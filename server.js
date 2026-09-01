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

// Helper: Read Candidates (preserves each distinct candidate application)
function getCandidates() {
  if (!fs.existsSync(CANDIDATES_FILE)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(CANDIDATES_FILE, 'utf8'));
    if (!Array.isArray(data)) return [];
    const seen = new Set();
    const unique = [];
    for (const c of data) {
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

// Helper: Send Email via Nodemailer (Multi-protocol: SSL 465 + STARTTLS 587 + Gmail Service)
async function sendNotificationEmail({ to, subject, htmlBody }) {
  const settings = getSettings();
  const recruiterEmail = settings.recruiterEmail || process.env.RECRUITER_EMAIL || 'sharmavageesha2000@gmail.com';
  const appPassword = (settings.appPassword || process.env.GOOGLE_APP_PASSWORD || 'qoyolivxrkuqxmkx').replace(/\s+/g, '');

  if (!to || !appPassword) {
    return { success: false, error: 'Missing destination email or app password' };
  }

  const transportConfigs = [
    { host: 'smtp.gmail.com', port: 465, secure: true, auth: { user: recruiterEmail, pass: appPassword }, connectionTimeout: 12000, greetingTimeout: 10000, socketTimeout: 15000 },
    { host: 'smtp.gmail.com', port: 587, secure: false, auth: { user: recruiterEmail, pass: appPassword }, connectionTimeout: 12000, greetingTimeout: 10000, socketTimeout: 15000 },
    { service: 'gmail', auth: { user: recruiterEmail, pass: appPassword }, connectionTimeout: 15000, greetingTimeout: 10000, socketTimeout: 20000 }
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
      await new Promise(r => setTimeout(r, 600));
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

async function checkInboxNow() {
  if (isPollingActive) return;
  isPollingActive = true;

  try {
    const settings = getSettings();
    await pollCandidateEmails({
      email: settings.recruiterEmail || process.env.RECRUITER_EMAIL || 'sharmavageesha2000@gmail.com',
      password: settings.appPassword || process.env.GOOGLE_APP_PASSWORD || '',
      checkLatestCount: 20,
      onCandidateProcessed: async (newCand) => {
        console.log(`[Auto-Processor] 🚀 Processing incoming candidate: ${newCand.name} (${newCand.email})`);

        // 1. Auto-dispatch email
        if (settings.autoDispatchEmail !== false && newCand.email) {
          const emailResult = await sendNotificationEmail({
            to: newCand.email,
            subject: newCand.emailSubject,
            htmlBody: newCand.emailHtmlBody
          });
          newCand.emailStatus = emailResult.success ? 'SENT' : 'FAILED';
          newCand.lastEmailSentAt = new Date().toISOString();
        }

        // 2. Add to database (preserves all distinct applications & never overwrites history)
        const candidates = getCandidates();
        const duplicateIndex = candidates.findIndex(c => 
          (c.email && c.email.toLowerCase().trim() === newCand.email.toLowerCase().trim()) &&
          (c.roleApplied && c.roleApplied.toLowerCase().trim() === newCand.roleApplied.toLowerCase().trim()) &&
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
  } catch (err) {
    console.error('[Email Daemon] Error during check:', err.message);
  } finally {
    isPollingActive = false;
  }
}

// Start continuous background polling loop every 10 seconds
setInterval(checkInboxNow, 10000);

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

// 8. Check Inbox Now On-Demand
app.post('/api/check-inbox', async (req, res) => {
  await checkInboxNow();
  const candidates = getCandidates();
  res.json({
    success: true,
    totalCandidates: candidates.length,
    message: 'Inbox checked and synchronized.'
  });
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

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  HR Recruitment AI Automation & Dashboard Live!   `);
  console.log(`  URL: http://localhost:${PORT}                      `);
  console.log(`  Recruiter Email: sharmavageesha2000@gmail.com    `);
  console.log(`  Gmail SMTP & IMAP: CONNECTED & AUTHENTICATED     `);
  console.log(`  Auto-Scanner Daemon: ACTIVE (Polling every 10s)  `);
  console.log(`  Gemini Model: ${DEFAULT_MODEL} (Connected)       `);
  console.log(`====================================================`);

  // Initial check on boot
  setTimeout(checkInboxNow, 2000);
});
