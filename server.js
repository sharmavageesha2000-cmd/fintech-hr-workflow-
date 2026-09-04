require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const nodemailer = require('nodemailer');
const mammoth = require('mammoth');
const { 
  evaluateResumeWithGemini, 
  cleanAndExtractJobRole, 
  extractCandidateNameFromResume,
  generateAuthenticGoogleMeetLink,
  generateOfficialCallLetterHtml,
  DEFAULT_GEMINI_KEY,
  DEFAULT_MODEL 
} = require('./gemini_evaluator');
const { pollCandidateEmails, extractDocumentText } = require('./email_poller');
const { 
  getQuestionsForRole, 
  evaluateAssessmentSubmission, 
  generateSessionAssessment 
} = require('./assessment_questions');

// Safely load PDF parser constructor
let PDFClass = null;
try {
  const pdfMod = require('pdf-parse');
  PDFClass = pdfMod.PDFParse || pdfMod;
} catch (e) {
  console.warn('[Server PDF Module Load Warn]:', e.message);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Global process protection from unexpected socket/IMAP disconnects
process.on('uncaughtException', (err) => {
  console.warn('[Server Warning] Caught exception safely without crashing:', err.message);
});
process.on('unhandledRejection', (reason) => {
  console.warn('[Server Warning] Caught unhandled rejection safely:', reason);
});

// Ensure directories exist
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const CANDIDATES_FILE = path.join(DATA_DIR, 'candidates.json');
const JOBS_FILE = path.join(DATA_DIR, 'jobs.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_'));
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/website', express.static(path.join(__dirname, 'public', 'website')));
app.use('/uploads', express.static(UPLOADS_DIR));

// Direct SPA Routes
app.get(['/website', '/website/*'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'website', 'index.html'));
});
app.get(['/dashboard', '/dashboard/*'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get(['/assessment', '/assessment/*', '/test', '/test/*'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'assessment.html'));
});

// Helper: Read Candidates (preserves valid candidate applications with attached resumes only)
function getCandidates(includeAll = false) {
  if (!fs.existsSync(CANDIDATES_FILE)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(CANDIDATES_FILE, 'utf8'));
    if (!Array.isArray(data)) return [];
    const seen = new Set();
    const unique = [];
    for (const c of data) {
      if (!includeAll) {
        // Enforce candidate has an attached resume document
        if (!c.attachmentInfo || !c.attachmentInfo.fileName) continue;
        
        // Filter out non-candidate records / service alerts / invoices
        const name = (c.name || '').toLowerCase();
        const email = (c.email || '').toLowerCase();
        const fn = (c.attachmentInfo.fileName || '').toLowerCase();
        if (name === 'obj' || name.includes('invoice') || email.includes('ubi.bank') || 
            email.includes('bookmyshow') || fn.includes('invoice') || fn.includes('receipt') || 
            fn.includes('ticket') || fn.includes('statement')) {
          continue;
        }
      }
      const uniqueKey = c.id || `${(c.email || '').toLowerCase().trim()}_${(c.roleApplied || '').toLowerCase().trim()}`;
      if (!seen.has(uniqueKey)) {
        seen.add(uniqueKey);
        unique.push(c);
      }
    }
    return unique;
  } catch (err) {
    console.error('Error reading candidates file:', err);
    return [];
  }
}

// Helper: Save Candidates (preserves all distinct applications)
function saveCandidates(candidates) {
  try {
    const seen = new Set();
    const unique = [];
    for (const c of (candidates || [])) {
      const uniqueKey = c.id || `${(c.email || '').toLowerCase().trim()}_${(c.roleApplied || '').toLowerCase().trim()}`;
      if (!seen.has(uniqueKey)) {
        seen.add(uniqueKey);
        unique.push(c);
      }
    }
    fs.writeFileSync(CANDIDATES_FILE, JSON.stringify(unique, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving candidates file:', err);
    return false;
  }
}

// Helper: Read Jobs
function getJobs() {
  if (!fs.existsSync(JOBS_FILE)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(JOBS_FILE, 'utf8'));
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Error reading jobs file:', err);
    return [];
  }
}

// Helper: Save Jobs
function saveJobs(jobs) {
  try {
    fs.writeFileSync(JOBS_FILE, JSON.stringify(jobs, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving jobs file:', err);
    return false;
  }
}

// Helper: Read Settings (merges environment variables on Render/Cloud)
function getSettings() {
  let fileSettings = {};
  if (fs.existsSync(SETTINGS_FILE)) {
    try {
      fileSettings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
    } catch (err) {
      fileSettings = {};
    }
  }

  const validKey = process.env.GEMINI_API_KEY || (fileSettings.geminiApiKey && !fileSettings.geminiApiKey.includes('YOUR_') ? fileSettings.geminiApiKey : '') || DEFAULT_GEMINI_KEY;
  const validPass = process.env.GOOGLE_APP_PASSWORD || process.env.APP_PASSWORD || (fileSettings.appPassword && !fileSettings.appPassword.includes('YOUR_') ? fileSettings.appPassword : '') || 'qoyolivxrkuqxmkx';

  return {
    recruiterEmail: process.env.RECRUITER_EMAIL || fileSettings.recruiterEmail || 'sharmavageesha2000@gmail.com',
    recruiterName: process.env.RECRUITER_NAME || fileSettings.recruiterName || 'Vageesha Sharma',
    geminiApiKey: validKey,
    geminiModel: fileSettings.geminiModel || DEFAULT_MODEL,
    autoDispatchEmail: fileSettings.autoDispatchEmail !== undefined ? fileSettings.autoDispatchEmail : true,
    appPassword: validPass,
    appPasswordConfigured: true,
    defaultGoogleMeetLink: fileSettings.defaultGoogleMeetLink || 'https://meet.google.com/qoy-livx-rku',
    googleAppPasswordUrl: 'https://myaccount.google.com/apppasswords'
  };
}

// Helper: Save Settings
function saveSettings(settings) {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf8');
    return true;
  } catch (err) {
    return false;
  }
}

// Helper: Extract text from files (supports PDF, TXT, DOC, DOCX)
async function extractTextFromFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) return '';
    const buffer = fs.readFileSync(filePath);
    const filename = path.basename(filePath);
    return await extractDocumentText(buffer, filename);
  } catch (err) {
    console.warn('[Server File Extract Error]:', err.message);
    return '';
  }
}

// Helper: Send Email via Nodemailer (Multi-protocol: Gmail Service + SSL 465 + STARTTLS 587 with IPv4 Force)
async function sendNotificationEmail({ to, subject, htmlBody }) {
  const settings = getSettings();
  const recruiterEmail = settings.recruiterEmail || process.env.RECRUITER_EMAIL || 'sharmavageesha2000@gmail.com';
  const appPassword = (settings.appPassword || process.env.GOOGLE_APP_PASSWORD || 'qoyolivxrkuqxmkx').replace(/\s+/g, '');

  if (!to || !appPassword) {
    return { success: false, error: 'Missing destination email or app password' };
  }

  const transportConfigs = [
    { 
      service: 'gmail', 
      family: 4, 
      auth: { user: recruiterEmail, pass: appPassword }, 
      tls: { rejectUnauthorized: false }, 
      connectionTimeout: 8000, 
      greetingTimeout: 6000, 
      socketTimeout: 12000 
    },
    { 
      host: 'smtp.gmail.com', 
      port: 465, 
      secure: true, 
      family: 4, 
      auth: { user: recruiterEmail, pass: appPassword }, 
      tls: { rejectUnauthorized: false }, 
      connectionTimeout: 8000, 
      greetingTimeout: 6000, 
      socketTimeout: 12000 
    },
    { 
      host: 'smtp.gmail.com', 
      port: 587, 
      secure: false, 
      family: 4, 
      auth: { user: recruiterEmail, pass: appPassword }, 
      tls: { rejectUnauthorized: false }, 
      connectionTimeout: 8000, 
      greetingTimeout: 6000, 
      socketTimeout: 12000 
    }
  ];

  let lastError = null;
  for (let i = 0; i < transportConfigs.length; i++) {
    const config = transportConfigs[i];
    try {
      console.log(`[Gmail SMTP] Dispatching email to: ${to} (Subject: "${subject}") [Method ${i + 1}/${transportConfigs.length}]...`);
      const transporter = nodemailer.createTransport(config);
      const info = await transporter.sendMail({
        from: `"${settings.recruiterName || 'Vageesha Sharma'}" <${recruiterEmail}>`,
        to,
        subject,
        html: htmlBody
      });
      console.log(`[Gmail SMTP] ✅ Delivered successfully! Message ID: ${info.messageId}`);
      return {
        success: true,
        simulated: false,
        messageId: info.messageId,
        to,
        subject
      };
    } catch (error) {
      lastError = error;
      console.warn(`[Gmail SMTP Warning] Method ${i + 1} failed: ${error.message}`);
      await new Promise(r => setTimeout(r, 400));
    }
  }

  console.error('[Gmail SMTP Error] All dispatch methods failed:', lastError?.message);
  return {
    success: false,
    simulated: false,
    error: lastError?.message || 'Email dispatch failed'
  };
}

// ================= CONTINUOUS EMAIL SCANNING DAEMON =================
let isPollingActive = false;
let lastPollStartTime = 0;

async function checkInboxNow() {
  // Watchdog reset: if polling has been active for over 45 seconds, force-clear lock
  if (isPollingActive) {
    if (Date.now() - lastPollStartTime > 45000) {
      console.warn('[Email Daemon] ⚠️ Polling lock watchdog expired (>45s). Resetting lock to resume scanning.');
      isPollingActive = false;
    } else {
      return;
    }
  }

  isPollingActive = true;
  lastPollStartTime = Date.now();

  try {
    const settings = getSettings();
    const result = await pollCandidateEmails({
      email: settings.recruiterEmail || process.env.RECRUITER_EMAIL || 'sharmavageesha2000@gmail.com',
      password: settings.appPassword || process.env.GOOGLE_APP_PASSWORD || '',
      checkLatestCount: 35,
      onCandidateProcessed: async (newCand) => {
        console.log(`[Auto-Processor] 🎯 Processing candidate resume: "${newCand.name}" (Email: <${newCand.email}>, Role: "${newCand.roleApplied}")`);

        // 1. Auto-dispatch personalized email notification / 20-MCQ assessment invitation / feedback
        if (settings.autoDispatchEmail !== false && newCand.email) {
          console.log(`[Auto-Processor] ✉️ Dispatching auto-reply email to: ${newCand.email} (Subject: "${newCand.emailSubject}")...`);
          const emailResult = await sendNotificationEmail({
            to: newCand.email,
            subject: newCand.emailSubject,
            htmlBody: newCand.emailHtmlBody
          });
          newCand.emailStatus = emailResult.success ? 'SENT' : 'FAILED';
          newCand.lastEmailSentAt = new Date().toISOString();
          console.log(`[Auto-Processor] ✅ Auto-reply outcome for ${newCand.email}: ${newCand.emailStatus} ${emailResult.messageId ? `(ID: ${emailResult.messageId})` : `(Err: ${emailResult.error})`}`);
        } else {
          console.warn(`[Auto-Processor] ⚠️ Auto-reply skipped: autoDispatchEmail=${settings.autoDispatchEmail}, email=${newCand.email}`);
        }

        // 2. Add to database (preserves candidate application history)
        const candidates = getCandidates(true);
        const duplicateIndex = candidates.findIndex(c => 
          (c.email && c.email.toLowerCase().trim() === (newCand.email || '').toLowerCase().trim()) &&
          (c.roleApplied && c.roleApplied.toLowerCase().trim() === (newCand.roleApplied || '').toLowerCase().trim()) &&
          (Math.abs(new Date(newCand.receivedAt || 0) - new Date(c.receivedAt || 0)) < 60000)
        );

        if (duplicateIndex !== -1) {
          newCand.id = candidates[duplicateIndex].id;
          candidates[duplicateIndex] = newCand;
          console.log(`[Auto-Processor] 🔄 Refreshed duplicate candidate record: ${newCand.name} (${newCand.roleApplied})`);
        } else {
          candidates.unshift(newCand);
          console.log(`[Auto-Processor] ✅ Added new candidate application: ${newCand.name} (${newCand.roleApplied}) (Total records: ${candidates.length})`);
        }

        saveCandidates(candidates);
      }
    });

    if (result && result.newlyProcessedCount > 0) {
      console.log(`[Email Daemon] 📥 Completed inbox cycle: ${result.newlyProcessedCount} new candidate applications processed & auto-replied!`);
    }
    return result;
  } catch (err) {
    console.error('[Email Daemon] Error during check:', err.message);
    return { success: false, error: err.message };
  } finally {
    isPollingActive = false;
  }
}

// ================= AUTOMATED OFFER LETTER DISPATCH DAEMON =================
let isDispatchingOffers = false;

async function checkAndDispatchPendingOfferLetters() {
  if (isDispatchingOffers) return;
  isDispatchingOffers = true;

  try {
    const candidates = getCandidates(true);
    let updated = false;

    for (const c of candidates) {
      const isPassed = c.status === 'SELECTED' || (c.assessmentDetails && c.assessmentDetails.passed) || c.testPassed;
      const targetEmail = (c.email || '').trim();
      const hasDelivered = c.callLetterDetails && c.callLetterDetails.emailDispatch && c.callLetterDetails.emailDispatch.success;

      if (isPassed && targetEmail && targetEmail.includes('@') && !hasDelivered) {
        const role = c.roleApplied || 'Software Engineer';
        const offerRefId = c.offerRefId || `HR-OFFER-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const defaultJoining = 'Monday, 14 September 2026';
        const defaultCtc = (role.toLowerCase().includes('senior') || role.toLowerCase().includes('lead'))
          ? '₹14,50,000 per annum (Full-Time)'
          : '₹9,50,000 per annum (Full-Time)';

        const callLetterHtml = generateOfficialCallLetterHtml({
          candidateName: c.name || 'Candidate',
          roleApplied: role,
          joiningDate: defaultJoining,
          ctcPackage: defaultCtc,
          reportingTo: 'Vageesha Sharma (Founder & Hiring Lead)',
          workMode: 'Remote / Hybrid (Flexible Work Arrangements)',
          offerRefId
        });

        const subject = `🎉 Official Job Offer & Call Letter: ${role} - Finova Technologies`;

        console.log(`[Auto-Offer Daemon] 🚀 Dispatching Official Offer Letter via SMTP to: ${targetEmail} (Candidate: "${c.name}")...`);
        const emailDispatch = await sendNotificationEmail({
          to: targetEmail,
          subject,
          htmlBody: callLetterHtml
        });

        if (emailDispatch.success) {
          console.log(`[Auto-Offer Daemon] ✅ Successfully delivered Call Letter to ${targetEmail} (Message ID: ${emailDispatch.messageId})`);
          c.status = 'SELECTED';
          c.offerStatus = 'OFFER_EXTENDED';
          c.offerRefId = offerRefId;
          c.callLetterSentAt = new Date().toISOString();
          c.callLetterDetails = {
            joiningDate: defaultJoining,
            ctcPackage: defaultCtc,
            offerRefId,
            emailDispatch,
            deliveredTo: targetEmail
          };
          updated = true;
        }
      }
    }

    if (updated) {
      saveCandidates(candidates);
    }
  } catch (err) {
    console.warn('[Auto-Offer Daemon Error]:', err.message);
  } finally {
    isDispatchingOffers = false;
  }
}

// Start continuous real-time background polling loops
setInterval(checkInboxNow, 5000);
setInterval(checkAndDispatchPendingOfferLetters, 8000);

// ================= API ROUTES =================

// 1. Get Candidates
app.get('/api/candidates', (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  const { status, search, role, sort } = req.query;
  let candidates = getCandidates();

  if (status && status !== 'ALL') {
    candidates = candidates.filter(c => c.status === status.toUpperCase());
  }

  if (role && role !== 'ALL') {
    candidates = candidates.filter(c => (c.roleApplied || '').toLowerCase().includes(role.toLowerCase()));
  }

  if (search) {
    const q = search.toLowerCase();
    candidates = candidates.filter(c =>
      (c.name || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.roleApplied || '').toLowerCase().includes(q) ||
      (c.skills || []).some(s => s.toLowerCase().includes(q))
    );
  }

  if (sort === 'score_desc') {
    candidates.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  } else if (sort === 'score_asc') {
    candidates.sort((a, b) => (a.matchScore || 0) - (b.matchScore || 0));
  } else if (sort === 'name_asc') {
    candidates.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  } else {
    candidates.sort((a, b) => new Date(b.receivedAt || 0) - new Date(a.receivedAt || 0));
  }

  res.json({
    success: true,
    total: candidates.length,
    candidates
  });
});

// 2. Get Single Candidate
app.get('/api/candidates/:id', (req, res) => {
  const candidates = getCandidates();
  const candidate = candidates.find(c => c.id === req.params.id);
  if (!candidate) {
    return res.status(404).json({ success: false, error: 'Candidate not found' });
  }
  res.json({ success: true, candidate });
});

// 3. Delete Candidate
app.delete('/api/candidates/:id', (req, res) => {
  let candidates = getCandidates();
  const initialLength = candidates.length;
  candidates = candidates.filter(c => c.id !== req.params.id);
  if (candidates.length === initialLength) {
    return res.status(404).json({ success: false, error: 'Candidate not found' });
  }
  saveCandidates(candidates);
  res.json({ success: true, message: 'Candidate deleted successfully' });
});

// 4. Evaluate & Ingest Candidate (Supports File Upload + Form Text)
app.post('/api/evaluate', upload.single('resumeFile'), async (req, res) => {
  try {
    const file = req.file;
    const body = req.body;
    const settings = getSettings();

    let extractedResumeText = body.resumeText || '';
    let fileName = file ? file.originalname : (body.fileName || 'Resume_Document.pdf');

    if (file) {
      const fileText = await extractTextFromFile(file.path);
      if (fileText && fileText.length > 20) {
        extractedResumeText = (extractedResumeText ? extractedResumeText + '\n\n' : '') + fileText;
      }
    }

    const candidateRealName = extractCandidateNameFromResume(extractedResumeText, fileName, body.candidateName || body.name || '');
    const candidateEmail = body.candidateEmail || body.email || '';
    const rawRole = body.roleApplied || 'Full Stack AI Engineer';
    const cleanTargetRole = cleanAndExtractJobRole(rawRole || fileName, extractedResumeText);
    const emailSubject = body.emailSubject || `Application for ${cleanTargetRole} - ${candidateRealName || 'Candidate'}`;
    const emailBody = body.emailBody || 'Please find attached my resume for your consideration.';

    console.log(`[Gemini AI] Evaluating candidate: "${candidateRealName || 'Anonymous'}" for Role: "${cleanTargetRole}"...`);

    const evalResult = await evaluateResumeWithGemini({
      candidateName: candidateRealName,
      candidateEmail,
      candidatePhone: body.candidatePhone || '',
      roleApplied: cleanTargetRole,
      emailSubject,
      emailBody,
      resumeText: extractedResumeText,
      fileName,
      apiKey: settings.geminiApiKey || DEFAULT_GEMINI_KEY
    });

    const cleanFinalRole = cleanAndExtractJobRole(evalResult.roleApplied || cleanTargetRole);
    const finalCandidateName = evalResult.candidateName || candidateRealName || 'Candidate';

    const finalCandidate = {
      id: 'cand-' + Date.now(),
      name: finalCandidateName,
      email: candidateEmail || evalResult.candidateEmail || 'candidate@example.com',
      phone: evalResult.candidatePhone || body.candidatePhone || 'Not specified',
      education: evalResult.education || 'Bachelor Degree',
      roleApplied: cleanFinalRole,
      experienceYears: evalResult.experienceYears || 0,
      skills: evalResult.skills || [],
      missingSkills: evalResult.missingSkills || [],
      scoreBreakdown: evalResult.scoreBreakdown || {
        technicalSkills: 20,
        experienceRelevance: 20,
        education: 15,
        communication: 15
      },
      matchScore: evalResult.matchScore || 50,
      status: evalResult.status === 'SELECTED' ? 'SELECTED' : 'REJECTED',
      summary: evalResult.summary || 'Profile evaluated using Gemini AI.',
      strengths: evalResult.strengths || [],
      weaknesses: evalResult.weaknesses || [],
      interviewSchedule: evalResult.status === 'SELECTED' ? evalResult.interviewSchedule : null,
      emailSubject: evalResult.emailSubject || (evalResult.status === 'SELECTED' ? `Interview Invitation: ${cleanFinalRole}` : `Update regarding your application for ${cleanFinalRole}`),
      emailHtmlBody: evalResult.emailHtmlBody,
      emailStatus: 'PENDING',
      attachmentInfo: file ? {
        fileName: file.originalname,
        fileSize: file.size,
        path: `/uploads/${file.filename}`
      } : null,
      receivedAt: new Date().toISOString(),
      evaluatedAt: new Date().toISOString(),
      source: file ? 'RESUME_UPLOAD_FILE' : 'EMAIL_INTAKE'
    };

    // Auto-dispatch email if enabled
    let emailDispatchResult = null;
    if (settings.autoDispatchEmail !== false && finalCandidate.email) {
      emailDispatchResult = await sendNotificationEmail({
        to: finalCandidate.email,
        subject: finalCandidate.emailSubject,
        htmlBody: finalCandidate.emailHtmlBody
      });
      finalCandidate.emailStatus = emailDispatchResult.success ? 'SENT' : 'FAILED';
      finalCandidate.lastEmailSentAt = new Date().toISOString();
    }

    // Save to Database
    const candidates = getCandidates();
    candidates.unshift(finalCandidate);
    saveCandidates(candidates);

    res.json({
      success: true,
      candidate: finalCandidate,
      emailDispatch: emailDispatchResult
    });
  } catch (error) {
    console.error('Evaluation API error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to evaluate candidate with Gemini AI'
    });
  }
});

// 5. Send/Resend Email
app.post('/api/send-email', async (req, res) => {
  const { candidateId, to, subject, htmlBody } = req.body;
  const dispatchResult = await sendNotificationEmail({ to, subject, htmlBody });

  if (candidateId) {
    const candidates = getCandidates();
    const c = candidates.find(item => item.id === candidateId);
    if (c) {
      c.emailStatus = dispatchResult.success ? 'SENT' : 'FAILED';
      c.lastEmailSentAt = new Date().toISOString();
      saveCandidates(candidates);
    }
  }

  res.json(dispatchResult);
});

// ================= ONLINE ASSESSMENT & AUTO-OFFER PIPELINE =================

// 5a. Get 20 MCQs for Candidate's Domain (Dynamically Sampled & Shuffled per Session)
app.get('/api/assessment/questions', (req, res) => {
  const { role, candidateId } = req.query;
  let targetRole = role;

  if (!targetRole && candidateId) {
    const candidates = getCandidates(true);
    const c = candidates.find(item => item.id === candidateId);
    if (c) targetRole = c.roleApplied;
  }

  targetRole = targetRole || 'Frontend Developer';
  const sessionData = generateSessionAssessment(targetRole, { sampleCount: 20 });

  res.json({
    success: true,
    sessionId: sessionData.sessionId,
    role: sessionData.role,
    totalQuestions: sessionData.totalQuestions,
    questions: sessionData.questions
  });
});

// 5b. Submit Assessment, Score Answers, & Auto-Dispatch Offer Letter (>= 80%)
app.post('/api/assessment/submit', async (req, res) => {
  try {
    const { 
      candidateId, 
      candidateName, 
      candidateEmail, 
      roleApplied, 
      sessionId,
      answers, 
      tabSwitchesCount, 
      timeSpentSeconds, 
      forcedByViolation 
    } = req.body;

    const effectiveRole = roleApplied || 'Frontend Developer';
    const evalResult = evaluateAssessmentSubmission(effectiveRole, answers || {}, sessionId);

    const candidates = getCandidates(true);
    let candidateIdx = -1;

    if (candidateId) {
      candidateIdx = candidates.findIndex(c => c.id === candidateId);
    }
    if (candidateIdx === -1 && candidateEmail) {
      candidateIdx = candidates.findIndex(c => (c.email || '').toLowerCase().trim() === candidateEmail.toLowerCase().trim());
    }

    let targetCandidate = candidateIdx !== -1 ? candidates[candidateIdx] : {
      id: candidateId || 'cand-' + Date.now(),
      name: candidateName || 'Candidate',
      email: candidateEmail || '',
      roleApplied: effectiveRole,
      receivedAt: new Date().toISOString()
    };

    // Ensure candidate name and email are updated with latest submitted values
    if (candidateEmail && candidateEmail.trim()) {
      targetCandidate.email = candidateEmail.trim();
    }
    if (candidateName && candidateName.trim() && candidateName !== 'Candidate') {
      targetCandidate.name = candidateName.trim();
    }
    targetCandidate.roleApplied = effectiveRole;

    targetCandidate.assessmentDetails = {
      completedAt: new Date().toISOString(),
      scorePercent: evalResult.scorePercent,
      correctCount: evalResult.correctCount,
      totalQuestions: evalResult.totalQuestions,
      passed: evalResult.passed,
      tabSwitchesCount: tabSwitchesCount || 0,
      timeSpentSeconds: timeSpentSeconds || 0,
      forcedByViolation: Boolean(forcedByViolation)
    };
    targetCandidate.testScore = evalResult.scorePercent;
    targetCandidate.testPassed = evalResult.passed;

    let emailDispatch = null;
    const targetEmail = (targetCandidate.email || candidateEmail || '').trim();

    // RULE: If candidate scores 80% or above (>= 16/20), automatically send Job Offer & Call Letter
    if (evalResult.passed) {
      console.log(`[Assessment Engine] 🎉 Candidate "${targetCandidate.name}" PASSED assessment with ${evalResult.scorePercent}% (Threshold: 80%)! Auto-generating Official Job Offer & Call Letter...`);

      const offerRefId = `HR-OFFER-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const defaultJoining = 'Monday, 14 September 2026';
      const defaultCtc = (effectiveRole.toLowerCase().includes('senior') || effectiveRole.toLowerCase().includes('lead'))
        ? '₹14,50,000 per annum (Full-Time)'
        : '₹9,50,000 per annum (Full-Time)';

      const callLetterHtml = generateOfficialCallLetterHtml({
        candidateName: targetCandidate.name,
        roleApplied: targetCandidate.roleApplied,
        joiningDate: defaultJoining,
        ctcPackage: defaultCtc,
        reportingTo: 'Vageesha Sharma (Founder & Hiring Lead)',
        workMode: 'Remote / Hybrid (Flexible Work Arrangements)',
        offerRefId
      });

      const subject = `🎉 Official Job Offer & Call Letter: ${targetCandidate.roleApplied} - Finova Technologies`;

      if (targetEmail) {
        console.log(`[Assessment Engine] 🚀 Dispatching Official Offer Letter via SMTP to: ${targetEmail}`);
        emailDispatch = await sendNotificationEmail({
          to: targetEmail,
          subject,
          htmlBody: callLetterHtml
        });
        console.log(`[Assessment Engine] Offer Letter SMTP Result:`, emailDispatch);
      } else {
        console.warn(`[Assessment Engine Warning] No recipient email specified for candidate "${targetCandidate.name}".`);
        emailDispatch = { success: false, error: 'No recipient email provided' };
      }

      targetCandidate.status = 'SELECTED';
      targetCandidate.interviewStatus = 'COMPLETED';
      targetCandidate.offerStatus = 'OFFER_EXTENDED';
      targetCandidate.offerRefId = offerRefId;
      targetCandidate.callLetterSentAt = new Date().toISOString();
      targetCandidate.callLetterDetails = {
        joiningDate: defaultJoining,
        ctcPackage: defaultCtc,
        offerRefId,
        emailDispatch,
        deliveredTo: targetEmail
      };
    } else {
      console.log(`[Assessment Engine] ⚠️ Candidate "${targetCandidate.name}" scored ${evalResult.scorePercent}% (< 80% passing threshold). Withholding Offer Letter.`);
      targetCandidate.status = 'REJECTED';
      targetCandidate.offerStatus = 'REJECTED';
      targetCandidate.interviewStatus = 'COMPLETED';

      // Send constructive technical feedback email (NO Offer Letter)
      if (targetEmail) {
        const feedbackSubject = `Technical Assessment Results: ${targetCandidate.roleApplied} - Finova Technologies`;
        const feedbackHtml = `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; max-width: 600px; margin: auto; padding: 26px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
            <h2 style="color: #991b1b; margin-top: 0;">Technical Assessment Outcome</h2>
            <p>Dear <strong>${targetCandidate.name}</strong>,</p>
            <p>Thank you for completing the online technical assessment for the <strong>${targetCandidate.roleApplied}</strong> position.</p>
            <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 16px; border-radius: 8px; margin: 18px 0;">
              <p style="margin: 0 0 6px 0;"><strong>Score Achieved:</strong> ${evalResult.scorePercent}% (${evalResult.correctCount} / ${evalResult.totalQuestions} correct)</p>
              <p style="margin: 0; color: #991b1b;"><strong>Passing Threshold:</strong> 80% (16 / 20 correct)</p>
            </div>
            <p style="color: #475569; line-height: 1.6;">
              For this vacancy, an 80% score is required for automated offer generation. Because this threshold was not reached, an employment offer has not been issued at this stage.
            </p>
            <p style="color: #475569; line-height: 1.6;">
              We encourage you to deepen your hands-on competencies in <strong>${targetCandidate.roleApplied}</strong> and reapply in future hiring cycles.
            </p>
            <p>We wish you great success in your career.</p>
            <div style="margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 14px;">
              <strong style="color: #0f172a; font-size: 14px; display: block;">Vageesha Sharma</strong>
              <span style="color: #64748b; font-size: 12.5px; display: block;">Founder &amp; Hiring Lead</span>
              <span style="color: #4338ca; font-size: 12.5px; font-weight: 600; display: block; margin-top: 2px;">sharmavageesha2000@gmail.com</span>
            </div>
          </div>
        `;

        emailDispatch = await sendNotificationEmail({
          to: targetEmail,
          subject: feedbackSubject,
          htmlBody: feedbackHtml
        });
      }
    }

    if (candidateIdx !== -1) {
      candidates[candidateIdx] = targetCandidate;
    } else {
      candidates.unshift(targetCandidate);
    }
    saveCandidates(candidates);

    res.json({
      success: true,
      passed: evalResult.passed,
      scorePercent: evalResult.scorePercent,
      correctCount: evalResult.correctCount,
      totalQuestions: evalResult.totalQuestions,
      candidate: targetCandidate,
      emailDispatch
    });
  } catch (err) {
    console.error('Assessment submit error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5c. Resend / Forward Official Offer & Call Letter to Candidate Email
app.post('/api/assessment/resend-offer', async (req, res) => {
  try {
    const { candidateId, candidateEmail, candidateName, roleApplied } = req.body;
    const targetEmail = (candidateEmail || '').trim();

    if (!targetEmail || !targetEmail.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid candidate email address is required.' });
    }

    const candidates = getCandidates(true);
    let candidate = candidates.find(c => (candidateId && c.id === candidateId) || (c.email && c.email.toLowerCase().trim() === targetEmail.toLowerCase().trim()));

    const effectiveRole = roleApplied || candidate?.roleApplied || 'Frontend Developer';
    const effectiveName = (candidateName && candidateName !== 'Candidate' ? candidateName : candidate?.name) || 'Candidate';
    const offerRefId = candidate?.offerRefId || `HR-OFFER-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const defaultJoining = candidate?.callLetterDetails?.joiningDate || 'Monday, 14 September 2026';
    const defaultCtc = candidate?.callLetterDetails?.ctcPackage || ((effectiveRole.toLowerCase().includes('senior') || effectiveRole.toLowerCase().includes('lead'))
      ? '₹14,50,000 per annum (Full-Time)'
      : '₹9,50,000 per annum (Full-Time)');

    const callLetterHtml = generateOfficialCallLetterHtml({
      candidateName: effectiveName,
      roleApplied: effectiveRole,
      joiningDate: defaultJoining,
      ctcPackage: defaultCtc,
      reportingTo: 'Vageesha Sharma (Founder & Hiring Lead)',
      workMode: 'Remote / Hybrid (Flexible Work Arrangements)',
      offerRefId
    });

    const subject = `🎉 Official Job Offer & Call Letter: ${effectiveRole} - Finova Technologies`;

    console.log(`[Assessment Engine] Resending Offer Letter to: ${targetEmail}`);
    const emailDispatch = await sendNotificationEmail({
      to: targetEmail,
      subject,
      htmlBody: callLetterHtml
    });

    if (candidate) {
      candidate.email = targetEmail;
      candidate.callLetterSentAt = new Date().toISOString();
      if (!candidate.callLetterDetails) candidate.callLetterDetails = {};
      candidate.callLetterDetails.emailDispatch = emailDispatch;
      candidate.callLetterDetails.deliveredTo = targetEmail;
      saveCandidates(candidates);
    }

    res.json({
      success: emailDispatch.success,
      emailDispatch,
      deliveredTo: targetEmail
    });
  } catch (err) {
    console.error('Error resending offer letter:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Complete Interview & Send Official Job Offer / Call Letter
app.post('/api/candidates/:id/complete-interview', async (req, res) => {
  const candidates = getCandidates();
  const index = candidates.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Candidate not found' });
  }

  const candidate = candidates[index];
  const { joiningDate, ctcPackage, workMode, customNote } = req.body;

  const defaultJoining = 'Monday, 14 September 2026';
  const defaultCtc = ctcPackage || '₹9,50,000 per annum (Full-Time)';

  const offerRefId = `HR-OFFER-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const callLetterHtml = generateOfficialCallLetterHtml({
    candidateName: candidate.name,
    roleApplied: candidate.roleApplied,
    joiningDate: joiningDate || defaultJoining,
    ctcPackage: ctcPackage || defaultCtc,
    reportingTo: 'Vageesha Sharma (Founder & Hiring Lead)',
    workMode: workMode || 'Remote / Hybrid (Flexible Work Arrangements)',
    offerRefId
  });

  const subject = `🎉 Official Job Offer & Call Letter: ${candidate.roleApplied} - HR SmartFlow`;

  // Send official call letter via Gmail SMTP
  const dispatchResult = await sendNotificationEmail({
    to: candidate.email,
    subject,
    htmlBody: callLetterHtml
  });

  // Update candidate status
  candidate.interviewStatus = 'COMPLETED';
  candidate.offerStatus = 'OFFER_EXTENDED';
  candidate.status = 'SELECTED';
  candidate.offerRefId = offerRefId;
  candidate.callLetterSentAt = new Date().toISOString();
  candidate.callLetterDetails = {
    joiningDate: joiningDate || defaultJoining,
    ctcPackage: ctcPackage || defaultCtc,
    offerRefId,
    emailDispatch: dispatchResult
  };

  candidates[index] = candidate;
  saveCandidates(candidates);

  res.json({
    success: true,
    candidate,
    dispatchResult,
    message: `Interview marked as COMPLETED! Official Call Letter sent to ${candidate.email}`
  });
});

// 7. Toggle Interview Status (Scheduled <-> Completed)
app.post('/api/candidates/:id/toggle-interview', (req, res) => {
  const candidates = getCandidates();
  const index = candidates.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Candidate not found' });
  }

  const candidate = candidates[index];
  const current = candidate.interviewStatus || 'SCHEDULED';
  candidate.interviewStatus = current === 'COMPLETED' ? 'SCHEDULED' : 'COMPLETED';
  candidates[index] = candidate;
  saveCandidates(candidates);

  res.json({ success: true, candidate, interviewStatus: candidate.interviewStatus });
});

// 8. Check Inbox Now On-Demand (Supports GET / POST & /api/poll alias)
app.all(['/api/check-inbox', '/api/poll', '/api/sync-emails'], async (req, res) => {
  try {
    const pollResult = await checkInboxNow();
    const candidates = getCandidates();
    res.json({
      success: true,
      pollResult: pollResult || { newlyProcessedCount: 0 },
      totalCandidates: candidates.length,
      latestCandidates: candidates.slice(0, 5),
      message: 'Inbox checked and synchronized successfully.'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. Analytics Statistics
app.get('/api/stats', (req, res) => {
  const candidates = getCandidates();
  const total = candidates.length;
  const selected = candidates.filter(c => c.status === 'SELECTED').length;
  const rejected = candidates.filter(c => c.status === 'REJECTED').length;
  const avgScore = total > 0 ? Math.round(candidates.reduce((acc, c) => acc + (c.matchScore || 0), 0) / total) : 0;
  const selectionRate = total > 0 ? Math.round((selected / total) * 100) : 0;

  const roleCounts = {};
  candidates.forEach(c => {
    const r = c.roleApplied || 'General';
    roleCounts[r] = (roleCounts[r] || 0) + 1;
  });

  res.json({
    success: true,
    stats: {
      total,
      selected,
      rejected,
      avgScore,
      selectionRate,
      roleCounts,
      lastUpdated: new Date().toISOString()
    }
  });
});

// 10. Job Openings & Vacancy Management APIs
app.get('/api/jobs', (req, res) => {
  const jobs = getJobs();
  const candidates = getCandidates();

  // Compute applicants and shortlisted counts per job
  const enrichedJobs = jobs.map(j => {
    const jobRole = (j.title || '').toLowerCase();
    const applicants = candidates.filter(c => (c.roleApplied || '').toLowerCase().includes(jobRole) || jobRole.includes((c.roleApplied || '').toLowerCase()));
    const shortlisted = applicants.filter(c => c.status === 'SELECTED').length;
    return {
      ...j,
      applicantCount: applicants.length,
      shortlistedCount: shortlisted
    };
  });

  res.json({ success: true, jobs: enrichedJobs });
});

app.post('/api/jobs', (req, res) => {
  const { title, department, experienceRequired, totalVacancies, vacanciesLeft, status, skills, description } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, error: 'Job title is required' });
  }

  const jobs = getJobs();
  const newJob = {
    id: 'job-' + Date.now(),
    title: title.trim(),
    department: department || 'Engineering',
    experienceRequired: experienceRequired || 'Fresher (0-1 Yrs)',
    totalVacancies: parseInt(totalVacancies) || 1,
    vacanciesLeft: parseInt(vacanciesLeft !== undefined ? vacanciesLeft : totalVacancies) || 1,
    status: status || 'ACTIVE',
    skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
    description: description || ''
  };

  jobs.unshift(newJob);
  saveJobs(jobs);
  res.json({ success: true, job: newJob });
});

app.put('/api/jobs/:id', (req, res) => {
  const jobs = getJobs();
  const index = jobs.findIndex(j => j.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Job not found' });
  }

  const existing = jobs[index];
  const updated = {
    ...existing,
    ...req.body,
    totalVacancies: req.body.totalVacancies !== undefined ? parseInt(req.body.totalVacancies) : existing.totalVacancies,
    vacanciesLeft: req.body.vacanciesLeft !== undefined ? parseInt(req.body.vacanciesLeft) : existing.vacanciesLeft,
    skills: Array.isArray(req.body.skills) ? req.body.skills : (req.body.skills ? req.body.skills.split(',').map(s => s.trim()) : existing.skills)
  };

  jobs[index] = updated;
  saveJobs(jobs);
  res.json({ success: true, job: updated });
});

app.delete('/api/jobs/:id', (req, res) => {
  let jobs = getJobs();
  const initialLength = jobs.length;
  jobs = jobs.filter(j => j.id !== req.params.id);
  if (jobs.length === initialLength) {
    return res.status(404).json({ success: false, error: 'Job not found' });
  }
  saveJobs(jobs);
  res.json({ success: true, message: 'Job opening deleted successfully' });
});

// 11. Get / Update Settings
app.get('/api/settings', (req, res) => {
  const settings = getSettings();
  res.json({
    success: true,
    settings: {
      ...settings,
      hasAppPassword: Boolean(settings.appPassword)
    }
  });
});

app.post('/api/settings', (req, res) => {
  const current = getSettings();
  const updated = { ...current, ...req.body };
  if (req.body.appPassword) {
    updated.appPasswordConfigured = true;
  }
  saveSettings(updated);
  res.json({ success: true, settings: updated });
});

// 12. Export CSV & JSON
app.get('/api/export/csv', (req, res) => {
  const candidates = getCandidates();
  const headers = ['ID', 'Name', 'Email', 'Phone', 'Role Applied', 'Experience (Years)', 'Match Score', 'Status', 'Received At', 'Interview Date', 'Interview Time', 'Google Meet Link'];
  
  const rows = candidates.map(c => [
    `"${c.id || ''}"`,
    `"${(c.name || '').replace(/"/g, '""')}"`,
    `"${c.email || ''}"`,
    `"${c.phone || ''}"`,
    `"${(c.roleApplied || '').replace(/"/g, '""')}"`,
    c.experienceYears || 0,
    c.matchScore || 0,
    `"${c.status || ''}"`,
    `"${c.receivedAt || ''}"`,
    `"${c.interviewSchedule?.date || 'N/A'}"`,
    `"${c.interviewSchedule?.time || 'N/A'}"`,
    `"${c.interviewSchedule?.meetLink || 'N/A'}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=candidates_report_${Date.now()}.csv`);
  res.send(csvContent);
});

app.get('/api/export/json', (req, res) => {
  const candidates = getCandidates();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=candidates_report_${Date.now()}.json`);
  res.send(JSON.stringify(candidates, null, 2));
});

function startServerWithFallback(portToTry) {
  const server = app.listen(portToTry, () => {
    console.log(`====================================================`);
    console.log(`  HR Recruitment AI Automation & Dashboard Live!   `);
    console.log(`  Local URL:  http://localhost:${portToTry}           `);
    console.log(`  Live Cloud: https://hr-smartflow-automation.onrender.com`);
    console.log(`  Recruiter:  sharmavageesha2000@gmail.com           `);
    console.log(`  Gmail SMTP & IMAP: CONNECTED & AUTHENTICATED      `);
    console.log(`  Auto-Scanner Daemon: ACTIVE (Polling every 5s)    `);
    console.log(`  Gemini Model: ${DEFAULT_MODEL} (Connected)        `);
    console.log(`====================================================`);

    // Initial check on boot
    setTimeout(checkInboxNow, 1500);

    // Keep Render Cloud instance active and warm (every 2.5 minutes)
    setInterval(() => {
      const https = require('https');
      https.get('https://hr-smartflow-automation.onrender.com/api/check-inbox', () => {}).on('error', () => {});
    }, 150000);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && portToTry < 3010) {
      console.warn(`[Server Notice] Port ${portToTry} is in use, automatically trying port ${portToTry + 1}...`);
      startServerWithFallback(portToTry + 1);
    } else {
      console.error('[Server Error] Failed to start server:', err.message);
    }
  });
}

startServerWithFallback(Number(PORT));

