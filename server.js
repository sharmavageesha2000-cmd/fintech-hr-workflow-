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
  generateAssessmentOutcomeFeedbackHtml,
  generateFutureJoiningDate,
  generateSelectionOfferEmailHtml,
  generateOfferDeclineAcknowledgementEmailHtml,
  generateOfferDecisionPageHtml,
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
app.get(['/offer-decision', '/offer-decision.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'offer-decision.html'));
});

// Helper: Determine dynamic base URL for links in email notifications
function getBaseUrl(req = null) {
  if (process.env.APP_BASE_URL) return process.env.APP_BASE_URL;
  if (req && req.headers && req.headers.host) {
    const proto = req.headers['x-forwarded-proto'] || (req.secure ? 'https' : 'http');
    return `${proto}://${req.headers.host}`;
  }
  // When running locally without an active HTTP request
  if (!process.env.RENDER) {
    return `http://localhost:${PORT || 3000}`;
  }
  return 'https://hr-smartflow-automation.onrender.com';
}

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
        // Always preserve candidates with active assessments or applications
        const hasAssessmentActivity = Boolean(
          c.assessmentCompleted === true || 
          c.testSubmitted === true || 
          c.testScore !== undefined || 
          c.offerStatus || 
          c.interviewStatus
        );

        if (!hasAssessmentActivity && (!c.attachmentInfo || !c.attachmentInfo.fileName)) continue;
        
        // Filter out non-candidate records / service alerts / invoices
        const name = (c.name || '').toLowerCase();
        const email = (c.email || '').toLowerCase();
        const fn = (c.attachmentInfo?.fileName || '').toLowerCase();
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

// Helper: Get Role-specific job defaults (Package, Work Mode, Reporting Authority) from jobs.json
function getJobOfferDefaults(roleApplied) {
  const jobs = getJobs();
  const cleanRole = (roleApplied || '').trim().toLowerCase();
  
  // Try exact match first, then partial match
  let matchedJob = jobs.find(j => (j.title || '').trim().toLowerCase() === cleanRole);
  if (!matchedJob) {
    matchedJob = jobs.find(j => {
      const t = (j.title || '').toLowerCase();
      return cleanRole.includes(t) || t.includes(cleanRole);
    });
  }

  // Fallback defaults if not found
  const isSenior = cleanRole.includes('senior') || cleanRole.includes('lead');
  const defaultPackage = isSenior ? '₹14,50,000 per annum (Full-Time)' : '₹9,50,000 per annum (Full-Time)';

  return {
    ctcPackage: matchedJob?.annualPackage ? `${matchedJob.annualPackage} (Full-Time)` : defaultPackage,
    workMode: matchedJob?.workingMode || 'Remote / Hybrid (Flexible Work Arrangements)',
    reportingTo: matchedJob?.reportingAuthority || 'Vageesha Sharma (Founder & Hiring Lead)',
    matchedJob
  };
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

// Deduplication cache to prevent duplicate email dispatches
const DISPATCHED_EMAILS_CACHE = new Map();

// Sequential SMTP Queue Mutex to prevent simultaneous socket collisions on Gmail SMTP
let smtpDispatchMutex = Promise.resolve();
let isSmtpDispatching = false;
let isSmtpPending = false;

function sendNotificationEmail({ to, subject, htmlBody, bypassDedup = false }) {
  isSmtpPending = true;
  return new Promise((resolve) => {
    smtpDispatchMutex = smtpDispatchMutex.then(async () => {
      // Wait for any active IMAP polling cycle to conclude to prevent socket collisions
      let waitCount = 0;
      while (isPollingActive && waitCount < 50) {
        await new Promise(r => setTimeout(r, 200));
        waitCount++;
      }
      // Cooldown to let any previous IMAP connection cleanly disconnect on Gmail server
      await new Promise(r => setTimeout(r, 500));

      isSmtpDispatching = true;
      try {
        const result = await doSendNotificationEmail({ to, subject, htmlBody, bypassDedup });
        await new Promise(r => setTimeout(r, 500));
        resolve(result);
      } catch (err) {
        resolve({ success: false, error: err.message });
      } finally {
        isSmtpDispatching = false;
        isSmtpPending = false;
      }
    });
  });
}

// Internal: Send Email via Nodemailer (Multi-protocol: Gmail Service + SSL 465 + STARTTLS 587)
async function doSendNotificationEmail({ to, subject, htmlBody, bypassDedup = false }) {
  const settings = getSettings();
  const recruiterEmail = settings.recruiterEmail || process.env.RECRUITER_EMAIL || 'sharmavageesha2000@gmail.com';
  const appPassword = (settings.appPassword || process.env.GOOGLE_APP_PASSWORD || 'qoyolivxrkuqxmkx').replace(/\s+/g, '');

  if (!to || !appPassword) {
    return { success: false, error: 'Missing destination email or app password' };
  }

  // Deduplication Check: Prevent sending the exact same email to the same recipient more than once within 5 minutes (unless bypassDedup is true)
  const dedupKey = `${(to || '').toLowerCase().trim()}__${(subject || '').toLowerCase().trim()}`;
  const lastSentTime = DISPATCHED_EMAILS_CACHE.get(dedupKey);
  if (!bypassDedup && lastSentTime && (Date.now() - lastSentTime < 300000)) {
    console.log(`[Gmail Gatekeeper] 🛡️ Suppressed duplicate email dispatch to: ${to} (Subject: "${subject}")`);
    return {
      success: true,
      deduplicated: true,
      messageId: 'DEDUP_SUPPRESSED',
      to,
      subject
    };
  }
  DISPATCHED_EMAILS_CACHE.set(dedupKey, Date.now());

  const transportConfigs = [
    { 
      label: 'smtp.gmail.com:465 (Standard Direct SSL)',
      host: 'smtp.gmail.com', 
      port: 465, 
      secure: true, 
      auth: { user: recruiterEmail, pass: appPassword },
      connectionTimeout: 15000,
      greetingTimeout: 12000,
      socketTimeout: 25000
    },
    { 
      label: 'smtp.gmail.com:587 (STARTTLS)',
      host: 'smtp.gmail.com', 
      port: 587, 
      secure: false, 
      auth: { user: recruiterEmail, pass: appPassword },
      connectionTimeout: 15000,
      greetingTimeout: 12000,
      socketTimeout: 25000
    }
  ];

  let lastError = null;
  for (let i = 0; i < transportConfigs.length; i++) {
    const { label, ...transportOptions } = transportConfigs[i];
    let transporter = null;
    try {
      console.log(`[Gmail SMTP] Dispatching email to: ${to} (Subject: "${subject}") [Method ${i + 1}/${transportConfigs.length}: ${label}]...`);
      transporter = nodemailer.createTransport(transportOptions);
      const info = await transporter.sendMail({
        from: `"${settings.recruiterName || 'Vageesha Sharma'}" <${recruiterEmail}>`,
        to,
        subject,
        html: htmlBody
      });
      console.log(`[Gmail SMTP] ✅ Delivered successfully via ${label}! Message ID: ${info.messageId}`);
      try { transporter.close(); } catch (e) {}
      return {
        success: true,
        simulated: false,
        messageId: info.messageId,
        to,
        subject,
        transport: label
      };
    } catch (error) {
      if (transporter) {
        try { transporter.close(); } catch (e) {}
      }
      lastError = error;
      console.warn(`[Gmail SMTP Warning] Method ${i + 1} (${label}) failed: ${error.message}`);
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  // Fallback: Check if an external HTTPS email webhook relay is configured
  const emailRelayUrl = settings.emailRelayUrl || process.env.EMAIL_RELAY_URL;
  if (emailRelayUrl && emailRelayUrl.startsWith('http')) {
    try {
      console.log(`[Email Relay] Attempting dispatch via configured HTTPS relay: ${emailRelayUrl}`);
      const https = require('https');
      const http = require('http');
      const client = emailRelayUrl.startsWith('https') ? https : http;
      const relayPayload = JSON.stringify({ to, subject, htmlBody, from: recruiterEmail, recruiterName: settings.recruiterName || 'Vageesha Sharma' });
      
      const relayRes = await new Promise((resolve, reject) => {
        const req = client.request(emailRelayUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(relayPayload)
          },
          timeout: 15000
        }, (res) => {
          let body = '';
          res.on('data', d => body += d);
          res.on('end', () => resolve({ statusCode: res.statusCode, body }));
        });
        req.on('error', reject);
        req.on('timeout', () => { req.destroy(); reject(new Error('Relay timeout')); });
        req.write(relayPayload);
        req.end();
      });

      if (relayRes.statusCode >= 200 && relayRes.statusCode < 300) {
        console.log(`[Email Relay] ✅ Delivered successfully via HTTPS relay!`);
        return {
          success: true,
          simulated: false,
          messageId: `RELAY_${Date.now()}`,
          to,
          subject,
          transport: 'HTTPS_RELAY'
        };
      }
    } catch (relayErr) {
      console.warn(`[Email Relay Warning] HTTPS relay failed: ${relayErr.message}`);
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

let hasDoneInitialInboxPoll = false;

async function checkInboxNow() {
  if (isSmtpDispatching || isSmtpPending) {
    console.log('[Email Daemon] ⏳ Deferring IMAP inbox check: Outgoing SMTP email dispatch in progress or queued.');
    return;
  }

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
    const countToCheck = hasDoneInitialInboxPoll ? 5 : 8;
    hasDoneInitialInboxPoll = true;

    const result = await pollCandidateEmails({
      email: settings.recruiterEmail || process.env.RECRUITER_EMAIL || 'sharmavageesha2000@gmail.com',
      password: settings.appPassword || process.env.GOOGLE_APP_PASSWORD || '',
      checkLatestCount: countToCheck,
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
          // Update duplicate application record while preserving newCand.id so it matches the sent email link
          candidates[duplicateIndex] = newCand;
          console.log(`[Auto-Processor] 🔄 Refreshed duplicate candidate record: ${newCand.name} (${newCand.roleApplied}) [ID: ${newCand.id}]`);
        } else {
          candidates.unshift(newCand);
          console.log(`[Auto-Processor] ✅ Added new candidate application: ${newCand.name} (${newCand.roleApplied}) [ID: ${newCand.id}] (Total records: ${candidates.length})`);
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

// ================= AUTOMATED OUTCOME EMAIL DISPATCH WATCHDOG =================
let isDispatchingOutcomes = false;

async function checkAndDispatchPendingOutcomeEmails() {
  if (isDispatchingOutcomes || isPollingActive || isSmtpDispatching) return;
  isDispatchingOutcomes = true;

  try {
    const candidates = getCandidates(true);
    let updated = false;

    for (const c of candidates) {
      const isCompleted = Boolean(
        c.assessmentCompleted === true ||
        c.testSubmitted === true ||
        (c.assessmentDetails && c.assessmentDetails.completedAt) ||
        (c.testScore !== undefined && c.testScore !== null && c.interviewStatus === 'COMPLETED')
      );

      if (!isCompleted) continue;

      const targetEmail = (c.email || '').trim();
      if (!targetEmail || !targetEmail.includes('@') || targetEmail === 'candidate@example.com') continue;

      const scorePercent = c.assessmentDetails?.scorePercent ?? c.testScore ?? 0;
      const passed = Boolean(
        (c.testPassed === true || (c.assessmentDetails && c.assessmentDetails.passed === true) || c.status === 'SELECTED') &&
        scorePercent >= 80
      );

      // Rate limit retry attempts per candidate to prevent rapid socket cycling
      if (c.lastOutcomeEmailAttempt && (Date.now() - c.lastOutcomeEmailAttempt < 45000)) {
        continue;
      }

      const role = c.roleApplied || 'Frontend Developer';

      const jobDefaults = getJobOfferDefaults(role);
      const offerRefId = c.offerRefId || `HR-OFFER-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const futureJoiningDate = c.callLetterDetails?.joiningDate || generateFutureJoiningDate(18);
      const defaultCtc = c.callLetterDetails?.ctcPackage || jobDefaults.ctcPackage;
      const defaultReportingTo = c.callLetterDetails?.reportingTo || jobDefaults.reportingTo;
      const defaultWorkMode = c.callLetterDetails?.workMode || jobDefaults.workMode;
      const baseUrl = getBaseUrl();

      if (c.offerStatus === 'OFFER_ACCEPTED') {
        // Stage 2A: Candidate accepted conditional offer -> Dispatch official signed Offer & Call Letter
        const hasDeliveredCallLetter = Boolean(
          c.callLetterDetails?.type === 'FINAL_OFFER_LETTER' && 
          c.callLetterDetails?.emailDispatch?.success
        );

        if (!hasDeliveredCallLetter) {
          const callLetterHtml = generateOfficialCallLetterHtml({
            candidateName: c.name || 'Candidate',
            roleApplied: role,
            joiningDate: futureJoiningDate,
            ctcPackage: defaultCtc,
            reportingTo: defaultReportingTo,
            workMode: defaultWorkMode,
            offerRefId
          });

          const subject = `📜 Official Employment Offer Letter & Call Letter: ${role} - Finova Technologies`;
          console.log(`[Outcome Watchdog] 🚀 Auto-dispatching signed Official Call Letter via SMTP to: ${targetEmail} (Candidate: "${c.name}")...`);
          
          const emailDispatch = await sendNotificationEmail({
            to: targetEmail,
            subject,
            htmlBody: callLetterHtml,
            bypassDedup: true
          });

          if (emailDispatch && emailDispatch.success) {
            console.log(`[Outcome Watchdog] ✅ Successfully delivered Official Call Letter to ${targetEmail} (Message ID: ${emailDispatch.messageId})`);
            c.status = 'SELECTED';
            c.offerStatus = 'OFFER_ACCEPTED';
            c.callLetterSentAt = new Date().toISOString();
            c.pendingEmailSync = false;
            delete c.pendingEmailPayload;
            delete c.lastOutcomeEmailAttempt;
            c.callLetterDetails = {
              joiningDate: futureJoiningDate,
              ctcPackage: defaultCtc,
              reportingTo: defaultReportingTo,
              workMode: defaultWorkMode,
              offerRefId,
              emailDispatch,
              deliveredTo: targetEmail,
              type: 'FINAL_OFFER_LETTER'
            };
            updated = true;
          } else {
            c.lastOutcomeEmailAttempt = Date.now();
          }
          await new Promise(r => setTimeout(r, 1000));
        }
      } else if (c.offerStatus === 'OFFER_DECLINED') {
        // Stage 2B: Candidate declined conditional offer -> Dispatch polite decline acknowledgement
        const hasDeliveredDeclineAck = Boolean(c.declineDetails?.emailDispatch?.success);

        if (!hasDeliveredDeclineAck) {
          const declineHtml = generateOfferDeclineAcknowledgementEmailHtml({
            candidateName: c.name || 'Candidate',
            roleApplied: role,
            reportingTo: defaultReportingTo
          });

          const subject = `Acknowledgement of Decision: ${role} Offer - Finova Technologies`;
          console.log(`[Outcome Watchdog] ℹ️ Auto-dispatching Decline Acknowledgement via SMTP to: ${targetEmail} (Candidate: "${c.name}")...`);
          
          const emailDispatch = await sendNotificationEmail({
            to: targetEmail,
            subject,
            htmlBody: declineHtml,
            bypassDedup: true
          });

          if (emailDispatch && emailDispatch.success) {
            console.log(`[Outcome Watchdog] ✅ Successfully delivered Decline Acknowledgement to ${targetEmail} (Message ID: ${emailDispatch.messageId})`);
            c.status = 'REJECTED';
            c.offerStatus = 'OFFER_DECLINED';
            c.pendingEmailSync = false;
            delete c.pendingEmailPayload;
            delete c.lastOutcomeEmailAttempt;
            c.declineDetails = {
              declinedAt: c.offerDeclinedAt || new Date().toISOString(),
              emailDispatch,
              deliveredTo: targetEmail
            };
            updated = true;
          } else {
            c.lastOutcomeEmailAttempt = Date.now();
          }
          await new Promise(r => setTimeout(r, 1000));
        }
      } else if (passed) {
        // Stage 1A: Assessment passed (>= 80%) -> Dispatch Selection Intent & Offer with Accept/Reject buttons
        const hasDeliveredOffer = Boolean(c.callLetterDetails?.emailDispatch?.success);
        if (!hasDeliveredOffer) {
          const selectionOfferHtml = generateSelectionOfferEmailHtml({
            candidateName: c.name || 'Candidate',
            candidateId: c.id,
            candidateEmail: targetEmail,
            roleApplied: role,
            department: jobDefaults.matchedJob?.department || 'Engineering & Technology',
            skills: jobDefaults.matchedJob?.skills || [],
            description: jobDefaults.matchedJob?.description || '',
            joiningDate: futureJoiningDate,
            ctcPackage: defaultCtc,
            reportingTo: defaultReportingTo,
            workMode: defaultWorkMode,
            decisionBaseUrl: baseUrl,
            offerRefId
          });

          const subject = `🎉 Congratulations! Job Offer & Selection Intent: ${role} - Finova Technologies`;

          console.log(`[Outcome Watchdog] 🚀 Auto-dispatching Selection Offer Email via SMTP to: ${targetEmail} (Candidate: "${c.name}")...`);
          const emailDispatch = await sendNotificationEmail({
            to: targetEmail,
            subject,
            htmlBody: selectionOfferHtml,
            bypassDedup: true
          });

          if (emailDispatch && emailDispatch.success) {
            console.log(`[Outcome Watchdog] ✅ Successfully delivered Selection Offer to ${targetEmail} (Message ID: ${emailDispatch.messageId})`);
            c.status = 'SELECTED';
            c.offerStatus = 'OFFER_EXTENDED';
            c.offerRefId = offerRefId;
            c.callLetterSentAt = new Date().toISOString();
            c.pendingEmailSync = false;
            delete c.pendingEmailPayload;
            delete c.lastOutcomeEmailAttempt;
            c.callLetterDetails = {
              joiningDate: futureJoiningDate,
              ctcPackage: defaultCtc,
              reportingTo: defaultReportingTo,
              workMode: defaultWorkMode,
              offerRefId,
              emailDispatch,
              deliveredTo: targetEmail,
              type: 'SELECTION_INTENT_OFFER'
            };
            updated = true;
          } else {
            c.lastOutcomeEmailAttempt = Date.now();
          }
          await new Promise(r => setTimeout(r, 1000));
        }
      } else {
        // Stage 1B: Assessment not passed (< 80%) -> Dispatch Performance Feedback email
        const hasDeliveredFeedback = Boolean(c.feedbackDetails?.emailDispatch?.success);
        if (!hasDeliveredFeedback) {
          const feedbackHtml = generateAssessmentOutcomeFeedbackHtml({
            candidateName: c.name || 'Candidate',
            roleApplied: role,
            scorePercent,
            passingThreshold: 80,
            correctCount: c.assessmentDetails?.correctCount ?? Math.round((scorePercent / 100) * 20),
            totalQuestions: c.assessmentDetails?.totalQuestions ?? 20,
            sectionBreakdown: c.assessmentDetails?.sectionBreakdown
          });

          const subject = `📊 Technical Assessment Result & Performance Feedback: ${role} - Finova Technologies`;

          console.log(`[Outcome Watchdog] 🚀 Auto-dispatching Assessment Feedback email via SMTP to: ${targetEmail} (Candidate: "${c.name}")...`);
          const emailDispatch = await sendNotificationEmail({
            to: targetEmail,
            subject,
            htmlBody: feedbackHtml,
            bypassDedup: true
          });

          if (emailDispatch && emailDispatch.success) {
            console.log(`[Outcome Watchdog] ✅ Successfully delivered Feedback email to ${targetEmail} (Message ID: ${emailDispatch.messageId})`);
            c.status = 'REJECTED';
            c.offerStatus = 'REJECTED';
            c.feedbackSentAt = new Date().toISOString();
            c.pendingEmailSync = false;
            delete c.pendingEmailPayload;
            delete c.lastOutcomeEmailAttempt;
            c.feedbackDetails = {
              scorePercent,
              correctCount: c.assessmentDetails?.correctCount ?? Math.round((scorePercent / 100) * 20),
              totalQuestions: c.assessmentDetails?.totalQuestions ?? 20,
              emailDispatch,
              deliveredTo: targetEmail
            };
            updated = true;
          } else {
            c.lastOutcomeEmailAttempt = Date.now();
          }
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    }

    if (updated) {
      saveCandidates(candidates);
    }
  } catch (err) {
    console.warn('[Outcome Watchdog Error]:', err.message);
  } finally {
    isDispatchingOutcomes = false;
  }
}

// Start continuous real-time background polling loops
setInterval(checkInboxNow, 30000);
setInterval(checkAndDispatchPendingOutcomeEmails, 20000);

// ================= API ROUTES =================

// 1. Get Candidates
app.get('/api/candidates', (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  const { status, search, role, sort } = req.query;
  let candidates = getCandidates(true);

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

    const candidateUniqueId = 'cand-' + Date.now() + '-' + Math.floor(1000 + Math.random() * 9000);
    const evalResult = await evaluateResumeWithGemini({
      candidateName: candidateRealName,
      candidateEmail,
      candidateId: candidateUniqueId,
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
      id: evalResult.candidateId || candidateUniqueId,
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

// 5. Quick Check Assessment Status by Candidate ID (For Page-Load Guard)
app.get('/api/assessment/status', (req, res) => {
  const { candidateId, candidateEmail, role } = req.query;
  const candidates = getCandidates(true);
  let candidateRecord = null;

  if (candidateId && candidateId.trim() && candidateId !== 'null' && candidateId !== 'undefined') {
    candidateRecord = candidates.find(item => item.id === candidateId.trim());
  } else if (candidateEmail && candidateEmail.trim()) {
    const cleanEmail = candidateEmail.trim().toLowerCase();
    candidateRecord = candidates.find(item => 
      item.email && item.email.toLowerCase() === cleanEmail && 
      (!role || item.roleApplied === role)
    ) || candidates.find(item => item.email && item.email.toLowerCase() === cleanEmail);
  }

  if (!candidateRecord) {
    return res.json({ alreadySubmitted: false });
  }

  if (candidateRecord && (
    candidateRecord.assessmentCompleted === true ||
    candidateRecord.testSubmitted === true ||
    (candidateRecord.assessmentDetails && candidateRecord.assessmentDetails.completedAt) ||
    (candidateRecord.testScore !== undefined && candidateRecord.testScore !== null && candidateRecord.interviewStatus === 'COMPLETED')
  )) {
    const passed = candidateRecord.assessmentDetails?.passed !== undefined
      ? candidateRecord.assessmentDetails.passed
      : ((candidateRecord.testScore || 0) >= 80);

    return res.json({
      alreadySubmitted: true,
      candidate: {
        id: candidateRecord.id,
        name: candidateRecord.name,
        email: candidateRecord.email,
        roleApplied: candidateRecord.roleApplied,
        scorePercent: candidateRecord.assessmentDetails?.scorePercent ?? candidateRecord.testScore ?? 0,
        correctCount: candidateRecord.assessmentDetails?.correctCount ?? Math.round(((candidateRecord.testScore || 0) / 100) * 20),
        totalQuestions: candidateRecord.assessmentDetails?.totalQuestions || 20,
        passed,
        status: candidateRecord.status || (passed ? 'SELECTED' : 'REJECTED'),
        offerRefId: candidateRecord.offerRefId,
        callLetterDetails: candidateRecord.callLetterDetails
      }
    });
  }

  if (candidateRecord) {
    return res.json({
      alreadySubmitted: false,
      candidate: {
        id: candidateRecord.id,
        name: candidateRecord.name,
        email: candidateRecord.email,
        roleApplied: candidateRecord.roleApplied
      }
    });
  }

  res.json({ alreadySubmitted: false });
});

// 5a. Get 20 MCQs for Candidate's Domain (Dynamically Sampled & Shuffled per Session)
app.get('/api/assessment/questions', (req, res) => {
  const { role, candidateId, candidateEmail, name } = req.query;
  let targetRole = role;
  let candidateRecord = null;

  const candidates = getCandidates(true);
  // Match candidate strictly by explicit candidateId if present, or fallback to email + role
  if (candidateId && candidateId.trim() && candidateId !== 'null' && candidateId !== 'undefined') {
    candidateRecord = candidates.find(item => item.id === candidateId.trim());
  } else if (candidateEmail && candidateEmail.trim()) {
    const cleanEmail = candidateEmail.trim().toLowerCase();
    candidateRecord = candidates.find(item => 
      item.email && item.email.toLowerCase() === cleanEmail && 
      (!targetRole || item.roleApplied === targetRole)
    ) || candidates.find(item => item.email && item.email.toLowerCase() === cleanEmail);
  }

  // Check if THIS specific candidate attempt has ALREADY completed / submitted their assessment test
  const isAlreadySubmitted = Boolean(
    candidateRecord && (
      candidateRecord.assessmentCompleted === true ||
      candidateRecord.testSubmitted === true ||
      (candidateRecord.assessmentDetails && candidateRecord.assessmentDetails.completedAt) ||
      (candidateRecord.testScore !== undefined && candidateRecord.testScore !== null && candidateRecord.interviewStatus === 'COMPLETED')
    )
  );

  if (isAlreadySubmitted) {
    console.log(`[Assessment Engine] 🔒 Candidate "${candidateRecord.name}" (${candidateRecord.email}) opened test link again, but assessment is ALREADY SUBMITTED [ID: ${candidateRecord.id}]. Refusing question access.`);
    const passed = candidateRecord.assessmentDetails?.passed !== undefined 
      ? candidateRecord.assessmentDetails.passed 
      : (candidateRecord.testPassed || candidateRecord.status === 'SELECTED' || (candidateRecord.testScore || 0) >= 80);

    return res.json({
      success: true,
      alreadySubmitted: true,
      message: 'Assessment has already been submitted and evaluated. Reopening test questions is restricted.',
      candidate: {
        id: candidateRecord.id,
        name: candidateRecord.name,
        email: candidateRecord.email,
        roleApplied: candidateRecord.roleApplied || targetRole || 'Frontend Developer',
        scorePercent: candidateRecord.assessmentDetails?.scorePercent !== undefined 
          ? candidateRecord.assessmentDetails.scorePercent 
          : (candidateRecord.testScore || 0),
        correctCount: candidateRecord.assessmentDetails?.correctCount !== undefined
          ? candidateRecord.assessmentDetails.correctCount
          : Math.round(((candidateRecord.testScore || 0) / 100) * 20),
        totalQuestions: candidateRecord.assessmentDetails?.totalQuestions || 20,
        passed,
        completedAt: candidateRecord.assessmentDetails?.completedAt || candidateRecord.callLetterSentAt || new Date().toISOString(),
        status: candidateRecord.status || (passed ? 'SELECTED' : 'REJECTED'),
        offerRefId: candidateRecord.offerRefId,
        callLetterDetails: candidateRecord.callLetterDetails
      }
    });
  }

  if (!targetRole && candidateRecord) {
    targetRole = candidateRecord.roleApplied;
  }

  targetRole = targetRole || 'Frontend Developer';

  const effectiveEmail = candidateEmail || candidateRecord?.email || '';
  const effectiveId = candidateId || candidateRecord?.id || '';
  const effectiveName = name || candidateRecord?.name || '';

  const sessionData = generateSessionAssessment(targetRole, { 
    sampleCount: 20,
    candidateEmail: effectiveEmail,
    candidateId: effectiveId,
    name: effectiveName
  });

  res.json({
    success: true,
    alreadySubmitted: false,
    sessionId: sessionData.sessionId,
    role: sessionData.role,
    totalQuestions: sessionData.totalQuestions,
    sections: sessionData.sections,
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

    // Match strictly by candidateId to ensure this candidate's record is updated, or fallback to email + role
    if (candidateId && candidateId !== 'null' && candidateId !== 'undefined') {
      candidateIdx = candidates.findIndex(c => c.id === candidateId.trim());
    } else if (candidateEmail && candidateEmail.trim()) {
      const cleanEmail = candidateEmail.trim().toLowerCase();
      candidateIdx = candidates.findIndex(c => 
        c.email && c.email.toLowerCase() === cleanEmail &&
        (!roleApplied || c.roleApplied === effectiveRole)
      );
      if (candidateIdx === -1) {
        candidateIdx = candidates.findIndex(c => c.email && c.email.toLowerCase() === cleanEmail);
      }
    }

    // Strict Guard: Prevent re-submitting an already completed assessment
    if (candidateIdx !== -1 && candidates[candidateIdx].assessmentCompleted === true) {
      console.log(`[Assessment Engine] 🔒 Refusing resubmission for already completed candidate "${candidates[candidateIdx].name}" (ID: ${candidates[candidateIdx].id}).`);
      const existingCand = candidates[candidateIdx];
      const passed = existingCand.assessmentDetails?.passed !== undefined 
        ? existingCand.assessmentDetails.passed 
        : ((existingCand.testScore || 0) >= 80);
      return res.json({
        success: false,
        alreadySubmitted: true,
        message: 'Response has already been submitted. Each test link can only be submitted once.',
        candidate: {
          id: existingCand.id,
          name: existingCand.name,
          email: existingCand.email,
          roleApplied: existingCand.roleApplied || effectiveRole,
          scorePercent: existingCand.assessmentDetails?.scorePercent !== undefined 
            ? existingCand.assessmentDetails.scorePercent 
            : (existingCand.testScore || 0),
          correctCount: existingCand.assessmentDetails?.correctCount !== undefined
            ? existingCand.assessmentDetails.correctCount
            : Math.round(((existingCand.testScore || 0) / 100) * 20),
          totalQuestions: existingCand.assessmentDetails?.totalQuestions || 20,
          passed,
          status: existingCand.status || (passed ? 'SELECTED' : 'REJECTED'),
          offerRefId: existingCand.offerRefId,
          completedAt: existingCand.assessmentDetails?.completedAt || existingCand.callLetterSentAt
        }
      });
    }

    let targetCandidate = candidateIdx !== -1 ? candidates[candidateIdx] : {
      id: candidateId || 'cand-' + Date.now(),
      name: candidateName || 'Candidate',
      email: candidateEmail || '',
      roleApplied: effectiveRole,
      receivedAt: new Date().toISOString()
    };

    // Ensure candidate name and email are preserved from resume, and never overwritten by placeholder values
    if (candidateEmail && candidateEmail.trim() && candidateEmail.includes('@') && candidateEmail.trim().toLowerCase() !== 'candidate@example.com') {
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
    targetCandidate.assessmentCompleted = true;
    targetCandidate.testSubmitted = true;

    let emailDispatch = null;
    let targetEmail = '';
    if (targetCandidate.email && targetCandidate.email.includes('@') && targetCandidate.email.toLowerCase() !== 'candidate@example.com') {
      targetEmail = targetCandidate.email.trim();
    } else if (candidateEmail && candidateEmail.includes('@') && candidateEmail.toLowerCase() !== 'candidate@example.com') {
      targetEmail = candidateEmail.trim();
    } else if (req.body.email && req.body.email.includes('@') && req.body.email.toLowerCase() !== 'candidate@example.com') {
      targetEmail = req.body.email.trim();
    }

    // RULE: If candidate scores 80% or above (>= 16/20), automatically send Job Offer & Selection Intent Email with Accept/Reject actions
    if (evalResult.passed) {
      console.log(`[Assessment Engine] 🎉 Candidate "${targetCandidate.name}" PASSED assessment with ${evalResult.scorePercent}% (Threshold: 80%)! Auto-generating Selection Intent & Offer with Accept/Reject options...`);

      const jobDefaults = getJobOfferDefaults(effectiveRole);
      const offerRefId = `HR-OFFER-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const futureJoiningDate = generateFutureJoiningDate(18);
      const defaultCtc = jobDefaults.ctcPackage;
      const defaultReportingTo = jobDefaults.reportingTo;
      const defaultWorkMode = jobDefaults.workMode;
      const baseUrl = getBaseUrl(req);

      const selectionOfferHtml = generateSelectionOfferEmailHtml({
        candidateName: targetCandidate.name,
        candidateId: targetCandidate.id,
        candidateEmail: targetEmail,
        roleApplied: targetCandidate.roleApplied,
        department: jobDefaults.matchedJob?.department || 'Engineering & Technology',
        skills: jobDefaults.matchedJob?.skills || [],
        description: jobDefaults.matchedJob?.description || '',
        ctcPackage: defaultCtc,
        workMode: defaultWorkMode,
        reportingTo: defaultReportingTo,
        joiningDate: futureJoiningDate,
        decisionBaseUrl: baseUrl,
        offerRefId
      });

      const subject = `🎉 Congratulations! Job Offer & Selection Intent: ${targetCandidate.roleApplied} - Finova Technologies`;

      if (process.env.RENDER) {
        console.log(`[Assessment Engine] ☁️ Cloud instance detected. Flagging Selection Offer for Local SMTP Bridge to: ${targetEmail}`);
        emailDispatch = { success: false, pendingCloudBridge: true };
      } else if (targetEmail && targetEmail.includes('@')) {
        console.log(`[Assessment Engine] 🚀 Dispatching Selection Offer Email via SMTP immediately to: ${targetEmail}`);
        emailDispatch = await sendNotificationEmail({
          to: targetEmail,
          subject,
          htmlBody: selectionOfferHtml,
          bypassDedup: true
        });
        console.log(`[Assessment Engine] Selection Offer SMTP Result:`, emailDispatch);
      } else {
        console.warn(`[Assessment Engine Warning] No recipient email specified for candidate "${targetCandidate.name}".`);
        emailDispatch = { success: false, error: 'No recipient email provided' };
      }

      targetCandidate.status = 'SELECTED';
      targetCandidate.interviewStatus = 'COMPLETED';
      targetCandidate.offerStatus = 'OFFER_EXTENDED';
      targetCandidate.offerRefId = offerRefId;
      if (emailDispatch && emailDispatch.success) {
        targetCandidate.callLetterSentAt = new Date().toISOString();
        targetCandidate.pendingEmailSync = false;
        delete targetCandidate.pendingEmailPayload;
      } else {
        // Flag for immediate cloud bridge / local daemon dispatch
        console.warn(`[Assessment Engine] ⚠️ Immediate SMTP dispatch failed. Flagging for Cloud Bridge delivery to: ${targetEmail}`);
        targetCandidate.pendingEmailSync = true;
        targetCandidate.pendingEmailPayload = {
          to: targetEmail,
          subject,
          htmlBody: selectionOfferHtml,
          emailType: 'OFFER_LETTER',
          offerRefId
        };
      }

      targetCandidate.callLetterDetails = {
        joiningDate: futureJoiningDate,
        ctcPackage: defaultCtc,
        reportingTo: defaultReportingTo,
        workMode: defaultWorkMode,
        offerRefId,
        emailDispatch,
        deliveredTo: targetEmail,
        type: 'SELECTION_INTENT_OFFER'
      };
    } else {
      console.log(`[Assessment Engine] ⚠️ Candidate "${targetCandidate.name}" scored ${evalResult.scorePercent}% (< 80% passing threshold). Auto-dispatching Assessment Outcome & Performance Feedback email...`);

      const feedbackHtml = generateAssessmentOutcomeFeedbackHtml({
        candidateName: targetCandidate.name,
        roleApplied: targetCandidate.roleApplied,
        scorePercent: evalResult.scorePercent,
        passingThreshold: 80,
        correctCount: evalResult.correctCount,
        totalQuestions: evalResult.totalQuestions,
        sectionBreakdown: evalResult.sectionBreakdown
      });

      const subject = `📊 Technical Assessment Result & Performance Feedback: ${targetCandidate.roleApplied} - Finova Technologies`;

      if (process.env.RENDER) {
        console.log(`[Assessment Engine] ☁️ Cloud instance detected. Flagging Assessment Feedback for Local SMTP Bridge to: ${targetEmail}`);
        emailDispatch = { success: false, pendingCloudBridge: true };
      } else if (targetEmail && targetEmail.includes('@')) {
        console.log(`[Assessment Engine] 🚀 Dispatching Assessment Feedback email via SMTP immediately to: ${targetEmail}`);
        emailDispatch = await sendNotificationEmail({
          to: targetEmail,
          subject,
          htmlBody: feedbackHtml,
          bypassDedup: true
        });
        console.log(`[Assessment Engine] Assessment Feedback SMTP Result:`, emailDispatch);
      } else {
        console.warn(`[Assessment Engine Warning] No recipient email specified for candidate "${targetCandidate.name}".`);
        emailDispatch = { success: false, error: 'No recipient email provided' };
      }

      targetCandidate.status = 'REJECTED';
      targetCandidate.offerStatus = 'REJECTED';
      targetCandidate.interviewStatus = 'COMPLETED';
      if (emailDispatch && emailDispatch.success) {
        targetCandidate.feedbackSentAt = new Date().toISOString();
        targetCandidate.pendingEmailSync = false;
        delete targetCandidate.pendingEmailPayload;
      } else {
        // Flag for immediate cloud bridge / local daemon dispatch
        console.warn(`[Assessment Engine] ⚠️ Immediate SMTP dispatch failed. Flagging for Cloud Bridge delivery to: ${targetEmail}`);
        targetCandidate.pendingEmailSync = true;
        targetCandidate.pendingEmailPayload = {
          to: targetEmail,
          subject,
          htmlBody: feedbackHtml,
          emailType: 'FEEDBACK'
        };
      }

      targetCandidate.feedbackDetails = {
        scorePercent: evalResult.scorePercent,
        correctCount: evalResult.correctCount,
        totalQuestions: evalResult.totalQuestions,
        emailDispatch,
        deliveredTo: targetEmail
      };
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
      result: evalResult,
      candidate: targetCandidate,
      emailDispatch,
      deliveredTo: targetEmail
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
    const jobDefaults = getJobOfferDefaults(effectiveRole);
    const offerRefId = candidate?.offerRefId || `HR-OFFER-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const defaultJoining = candidate?.callLetterDetails?.joiningDate || 'Monday, 14 September 2026';
    const defaultCtc = candidate?.callLetterDetails?.ctcPackage || jobDefaults.ctcPackage;
    const defaultReportingTo = candidate?.callLetterDetails?.reportingTo || jobDefaults.reportingTo;
    const defaultWorkMode = candidate?.callLetterDetails?.workMode || jobDefaults.workMode;

    const callLetterHtml = generateOfficialCallLetterHtml({
      candidateName: effectiveName,
      roleApplied: effectiveRole,
      joiningDate: defaultJoining,
      ctcPackage: defaultCtc,
      reportingTo: defaultReportingTo,
      workMode: defaultWorkMode,
      offerRefId
    });

    const subject = `🎉 Official Job Offer & Call Letter: ${effectiveRole} - Finova Technologies`;

    console.log(`[Assessment Engine] Resending Offer Letter to: ${targetEmail}`);
    const emailDispatch = await sendNotificationEmail({
      to: targetEmail,
      subject,
      htmlBody: callLetterHtml,
      bypassDedup: true
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

// 5d. Resend / Forward Assessment Outcome Email (Offer Letter if passed >= 80%, Feedback if < 80%)
app.post('/api/assessment/resend-outcome', async (req, res) => {
  try {
    const { candidateId, candidateEmail, candidateName, roleApplied, scorePercent } = req.body;
    const targetEmail = (candidateEmail || '').trim();

    if (!targetEmail || !targetEmail.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid candidate email address is required.' });
    }

    const candidates = getCandidates(true);
    let candidate = candidates.find(c => (candidateId && c.id === candidateId.trim()) || (c.email && c.email.toLowerCase().trim() === targetEmail.toLowerCase().trim()));

    const effectiveRole = roleApplied || candidate?.roleApplied || 'Frontend Developer';
    const effectiveName = (candidateName && candidateName !== 'Candidate' ? candidateName : candidate?.name) || 'Candidate';
    const effectiveScore = scorePercent !== undefined ? scorePercent : (candidate?.testScore ?? candidate?.assessmentDetails?.scorePercent ?? 0);
    const passed = effectiveScore >= 80 || candidate?.status === 'SELECTED' || candidate?.testPassed === true;

    let subject = '';
    let htmlBody = '';

    if (passed) {
      const jobDefaults = getJobOfferDefaults(effectiveRole);
      const offerRefId = candidate?.offerRefId || `HR-OFFER-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const defaultJoining = candidate?.callLetterDetails?.joiningDate || 'Monday, 14 September 2026';
      const defaultCtc = candidate?.callLetterDetails?.ctcPackage || jobDefaults.ctcPackage;
      const defaultReportingTo = candidate?.callLetterDetails?.reportingTo || jobDefaults.reportingTo;
      const defaultWorkMode = candidate?.callLetterDetails?.workMode || jobDefaults.workMode;

      htmlBody = generateOfficialCallLetterHtml({
        candidateName: effectiveName,
        roleApplied: effectiveRole,
        joiningDate: defaultJoining,
        ctcPackage: defaultCtc,
        reportingTo: defaultReportingTo,
        workMode: defaultWorkMode,
        offerRefId
      });
      subject = `🎉 Official Job Offer & Call Letter: ${effectiveRole} - Finova Technologies`;
    } else {
      htmlBody = generateAssessmentOutcomeFeedbackHtml({
        candidateName: effectiveName,
        roleApplied: effectiveRole,
        scorePercent: effectiveScore,
        passingThreshold: 80,
        correctCount: candidate?.assessmentDetails?.correctCount ?? Math.round((effectiveScore / 100) * 20),
        totalQuestions: candidate?.assessmentDetails?.totalQuestions ?? 20,
        sectionBreakdown: candidate?.assessmentDetails?.sectionBreakdown
      });
      subject = `Update regarding your Technical Assessment: ${effectiveRole} - Finova Technologies`;
    }

    console.log(`[Assessment Engine] 🚀 Dispatching assessment outcome email to: ${targetEmail} (Passed: ${passed}, Subject: "${subject}")`);
    const emailDispatch = await sendNotificationEmail({
      to: targetEmail,
      subject,
      htmlBody,
      bypassDedup: true
    });

    if (candidate) {
      candidate.email = targetEmail;
      saveCandidates(candidates);
    }

    res.json({
      success: emailDispatch.success,
      emailDispatch,
      deliveredTo: targetEmail,
      passed
    });
  } catch (err) {
    console.error('Error resending assessment outcome email:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5e. Cloud-to-Local Bridge: Query candidates requiring automated email dispatch
app.get('/api/assessment/pending-dispatches', (req, res) => {
  try {
    const candidates = getCandidates(true);
    const pending = [];
    for (const c of candidates) {
      if (!c.assessmentCompleted) continue;
      const passed = c.testPassed === true || (c.testScore || 0) >= 80;
      const emailSuccess = passed 
        ? (c.callLetterDetails?.emailDispatch?.success === true && !!c.callLetterSentAt)
        : (c.feedbackDetails?.emailDispatch?.success === true && !!c.feedbackSentAt);
      
      if (!emailSuccess || c.pendingEmailSync) {
        const effectiveRole = c.roleApplied || 'Frontend Developer';
        const effectiveName = (c.name && c.name !== 'Candidate') ? c.name : 'Candidate';
        const effectiveScore = c.testScore ?? c.assessmentDetails?.scorePercent ?? 0;
        let targetEmail = '';
        if (c.email && c.email.includes('@') && c.email.toLowerCase() !== 'candidate@example.com') {
          targetEmail = c.email.trim();
        } else if (c.callLetterDetails?.deliveredTo && c.callLetterDetails.deliveredTo.includes('@')) {
          targetEmail = c.callLetterDetails.deliveredTo.trim();
        } else if (c.feedbackDetails?.deliveredTo && c.feedbackDetails.deliveredTo.includes('@')) {
          targetEmail = c.feedbackDetails.deliveredTo.trim();
        }

        if (!targetEmail || !targetEmail.includes('@')) continue;

        let subject = '';
        let htmlBody = '';
        if (passed) {
          const jobDefaults = getJobOfferDefaults(effectiveRole);
          const offerRefId = c.offerRefId || `HR-OFFER-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
          const defaultJoining = c.callLetterDetails?.joiningDate || 'Monday, 14 September 2026';
          const defaultCtc = c.callLetterDetails?.ctcPackage || jobDefaults.ctcPackage;
          const defaultReportingTo = c.callLetterDetails?.reportingTo || jobDefaults.reportingTo;
          const defaultWorkMode = c.callLetterDetails?.workMode || jobDefaults.workMode;
          htmlBody = generateOfficialCallLetterHtml({
            candidateName: effectiveName,
            roleApplied: effectiveRole,
            joiningDate: defaultJoining,
            ctcPackage: defaultCtc,
            reportingTo: defaultReportingTo,
            workMode: defaultWorkMode,
            offerRefId
          });
          subject = `🎉 Official Job Offer & Call Letter: ${effectiveRole} - Finova Technologies`;
        } else {
          htmlBody = generateAssessmentOutcomeFeedbackHtml({
            candidateName: effectiveName,
            roleApplied: effectiveRole,
            scorePercent: effectiveScore,
            passingThreshold: 80,
            correctCount: c.assessmentDetails?.correctCount ?? Math.round((effectiveScore / 100) * 20),
            totalQuestions: c.assessmentDetails?.totalQuestions ?? 20,
            sectionBreakdown: c.assessmentDetails?.sectionBreakdown
          });
          subject = `📊 Technical Assessment Result & Performance Feedback: ${effectiveRole} - Finova Technologies`;
        }

        pending.push({
          candidateId: c.id,
          candidateName: effectiveName,
          candidateEmail: targetEmail,
          roleApplied: effectiveRole,
          scorePercent: effectiveScore,
          passed,
          emailType: passed ? 'OFFER_LETTER' : 'FEEDBACK',
          subject,
          htmlBody
        });
      }
    }
    res.json({ success: true, count: pending.length, pending });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5f. Confirm Email Dispatch from Local Bridge or Background Worker
app.post('/api/assessment/confirm-dispatch', (req, res) => {
  try {
    const { candidateId, messageId, emailType, deliveredTo, success } = req.body;
    const candidates = getCandidates(true);
    let cand = candidates.find(c => c.id === candidateId);
    if (!cand && deliveredTo) {
      cand = candidates.find(c => c.email && c.email.toLowerCase().trim() === deliveredTo.toLowerCase().trim());
    }

    if (!cand) {
      return res.status(404).json({ success: false, error: 'Candidate not found' });
    }

    cand.pendingEmailSync = false;
    delete cand.pendingEmailPayload;

    if (success) {
      const nowIso = new Date().toISOString();
      if (emailType === 'OFFER_LETTER' || cand.testPassed) {
        cand.status = 'SELECTED';
        cand.offerStatus = 'OFFER_EXTENDED';
        cand.interviewStatus = 'COMPLETED';
        cand.callLetterSentAt = nowIso;
        if (!cand.callLetterDetails) cand.callLetterDetails = {};
        cand.callLetterDetails.emailDispatch = {
          success: true,
          simulated: false,
          messageId: messageId || `BRIDGE_${Date.now()}`,
          deliveredAt: nowIso,
          to: deliveredTo || cand.email
        };
        cand.callLetterDetails.deliveredTo = deliveredTo || cand.email;
      } else {
        cand.status = 'REJECTED';
        cand.offerStatus = 'REJECTED';
        cand.interviewStatus = 'COMPLETED';
        cand.feedbackSentAt = nowIso;
        if (!cand.feedbackDetails) cand.feedbackDetails = {};
        cand.feedbackDetails.emailDispatch = {
          success: true,
          simulated: false,
          messageId: messageId || `BRIDGE_${Date.now()}`,
          deliveredAt: nowIso,
          to: deliveredTo || cand.email
        };
        cand.feedbackDetails.deliveredTo = deliveredTo || cand.email;
      }
      saveCandidates(candidates);
      console.log(`[Assessment Engine] ✅ Confirmed email dispatch for ${cand.name} (${cand.email || deliveredTo}) [${emailType}]. Message ID: ${messageId}`);
    }
    res.json({ success: true, candidateId: cand.id, confirmed: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5g. Handle Candidate Offer Decision (Accept / Reject from Email Action Buttons)
app.get('/api/offer/decision', async (req, res) => {
  try {
    const candidateId = (req.query.id || req.query.candidateId || '').trim();
    const decision = (req.query.decision || req.query.action || '').trim().toLowerCase();
    const queryEmail = (req.query.email || '').trim();
    const queryName = (req.query.name || '').trim();
    const queryRole = (req.query.role || '').trim();
    const queryPackage = (req.query.package || '').trim();
    const queryMode = (req.query.mode || '').trim();
    const queryJoiningDate = (req.query.joiningDate || req.query.date || '').trim();
    const queryReportingTo = (req.query.reportingTo || req.query.hr || '').trim();
    const queryOfferRefId = (req.query.ref || '').trim();

    const candidates = getCandidates(true);
    let candidateIndex = -1;

    // 1. Strict match by unique Candidate ID first
    if (candidateId && !candidateId.includes('@')) {
      candidateIndex = candidates.findIndex(c => c.id === candidateId);
    }

    // 2. If candidateId is an email address or not provided, match candidate by email + role
    if (candidateIndex === -1 && (!candidateId || candidateId.includes('@')) && queryEmail) {
      candidateIndex = candidates.findIndex(c => 
        c.email && c.email.toLowerCase().trim() === queryEmail.toLowerCase().trim() &&
        (queryRole ? c.roleApplied === queryRole : true) &&
        (!c.offerStatus || c.offerStatus === 'OFFER_EXTENDED' || c.offerStatus === 'PENDING')
      );
    }

    let candidate = candidateIndex !== -1 ? candidates[candidateIndex] : null;

    // Resilient fallback: If candidate was not found in storage (e.g. wiped ephemeral disk or cross-environment),
    // reconstruct candidate from verified URL query parameters
    if (!candidate) {
      if (candidateId || queryEmail) {
        candidate = {
          id: candidateId || `cand-${Date.now()}`,
          name: queryName || 'Candidate',
          email: queryEmail || (candidateId && candidateId.includes('@') ? candidateId : ''),
          roleApplied: queryRole || 'Software Engineer',
          receivedAt: new Date().toISOString(),
          status: 'SELECTED'
        };
        candidates.unshift(candidate);
        candidateIndex = 0;
      } else {
        return res.send(generateOfferDecisionPageHtml({
          status: 'error',
          message: 'The candidate application record could not be identified from this action link.'
        }));
      }
    }

    const role = queryRole || candidate.roleApplied || 'Software Engineer';
    const jobDefaults = getJobOfferDefaults(role);
    const targetEmail = queryEmail || (candidate.email || '').trim();
    const joiningDate = queryJoiningDate || candidate.callLetterDetails?.joiningDate || generateFutureJoiningDate(18);
    const ctcPackage = queryPackage || candidate.callLetterDetails?.ctcPackage || jobDefaults.ctcPackage;
    const workMode = queryMode || candidate.callLetterDetails?.workMode || jobDefaults.workMode;
    const reportingTo = queryReportingTo || candidate.callLetterDetails?.reportingTo || jobDefaults.reportingTo;
    const offerRefId = queryOfferRefId || candidate.offerRefId || `HR-OFFER-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Guard: Prevent duplicate actions if already accepted or declined
    if (candidate.offerStatus === 'OFFER_ACCEPTED' || candidate.offerStatus === 'OFFER_DECLINED') {
      const existingDecision = candidate.offerStatus === 'OFFER_ACCEPTED' ? 'accepted' : 'declined';
      return res.send(generateOfferDecisionPageHtml({
        status: 'already_recorded',
        decision: existingDecision,
        name: candidate.name,
        role,
        email: targetEmail,
        package: ctcPackage,
        mode: workMode,
        joiningDate,
        reportingTo
      }));
    }

    if (decision === 'accept') {
      // 1. Mark status as OFFER_ACCEPTED
      candidate.status = 'SELECTED';
      candidate.offerStatus = 'OFFER_ACCEPTED';
      candidate.interviewStatus = 'COMPLETED';
      candidate.offerAcceptedAt = new Date().toISOString();

      // 2. Generate Final Official Signed Call Letter
      const callLetterHtml = generateOfficialCallLetterHtml({
        candidateName: candidate.name || 'Candidate',
        roleApplied: role,
        joiningDate,
        ctcPackage,
        reportingTo,
        workMode,
        offerRefId
      });

      const subject = `📜 Official Employment Offer Letter & Call Letter: ${role} - Finova Technologies`;

      // 3. Auto-dispatch Official Call Letter via SMTP
      let emailDispatch = null;
      if (process.env.RENDER) {
        console.log(`[Offer Decision Engine] ☁️ Cloud instance detected. Flagging Call Letter for Local SMTP Bridge to: ${targetEmail}`);
        candidate.pendingCallLetterDispatch = true;
        emailDispatch = { success: false, pendingCloudBridge: true };
      } else if (targetEmail && targetEmail.includes('@') && targetEmail !== 'candidate@example.com') {
        console.log(`[Offer Decision Engine] 🚀 Candidate "${candidate.name}" ACCEPTED offer! Auto-dispatching signed Official Call Letter to: ${targetEmail}`);
        emailDispatch = await sendNotificationEmail({
          to: targetEmail,
          subject,
          htmlBody: callLetterHtml,
          bypassDedup: true
        });
      }

      candidate.callLetterDetails = {
        joiningDate,
        ctcPackage,
        reportingTo,
        workMode,
        offerRefId,
        emailDispatch,
        deliveredTo: targetEmail,
        type: 'FINAL_OFFER_LETTER'
      };

      candidates[candidateIndex] = candidate;
      saveCandidates(candidates);

      return res.send(generateOfferDecisionPageHtml({
        status: 'accepted',
        name: candidate.name,
        role,
        email: targetEmail,
        package: ctcPackage,
        mode: workMode,
        joiningDate,
        reportingTo
      }));
    } else if (decision === 'reject' || decision === 'decline') {
      // 1. Mark status as OFFER_DECLINED
      candidate.status = 'REJECTED';
      candidate.offerStatus = 'OFFER_DECLINED';
      candidate.interviewStatus = 'COMPLETED';
      candidate.offerDeclinedAt = new Date().toISOString();

      // 2. Generate Polite Offer Decline Acknowledgement
      const declineHtml = generateOfferDeclineAcknowledgementEmailHtml({
        candidateName: candidate.name || 'Candidate',
        roleApplied: role,
        reportingTo
      });

      const subject = `Acknowledgement of Decision: ${role} Offer - Finova Technologies`;

      // 3. Auto-dispatch Decline Acknowledgement via SMTP
      let emailDispatch = null;
      if (process.env.RENDER) {
        console.log(`[Offer Decision Engine] ☁️ Cloud instance detected. Flagging Decline Acknowledgement for Local SMTP Bridge to: ${targetEmail}`);
        candidate.pendingDeclineDispatch = true;
        emailDispatch = { success: false, pendingCloudBridge: true };
      } else if (targetEmail && targetEmail.includes('@') && targetEmail !== 'candidate@example.com') {
        console.log(`[Offer Decision Engine] ℹ️ Candidate "${candidate.name}" DECLINED offer. Auto-dispatching polite acknowledgement to: ${targetEmail}`);
        emailDispatch = await sendNotificationEmail({
          to: targetEmail,
          subject,
          htmlBody: declineHtml,
          bypassDedup: true
        });
      }

      candidate.declineDetails = {
        declinedAt: candidate.offerDeclinedAt,
        emailDispatch,
        deliveredTo: targetEmail
      };

      candidates[candidateIndex] = candidate;
      saveCandidates(candidates);

      return res.send(generateOfferDecisionPageHtml({
        status: 'declined',
        name: candidate.name,
        role,
        email: targetEmail,
        package: ctcPackage,
        mode: workMode,
        joiningDate,
        reportingTo
      }));
    } else {
      return res.send(generateOfferDecisionPageHtml({
        status: 'error',
        message: 'Invalid decision action parameter provided.'
      }));
    }
  } catch (err) {
    console.error('Error handling offer decision:', err);
    return res.send(generateOfferDecisionPageHtml({
      status: 'error',
      message: err.message
    }));
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
  const { joiningDate, ctcPackage, workMode, customNote, reportingTo } = req.body;
  const jobDefaults = getJobOfferDefaults(candidate.roleApplied);

  const defaultJoining = joiningDate || generateFutureJoiningDate(18);
  const defaultCtc = ctcPackage || jobDefaults.ctcPackage;
  const defaultReportingTo = reportingTo || jobDefaults.reportingTo;
  const defaultWorkMode = workMode || jobDefaults.workMode;

  const offerRefId = `HR-OFFER-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const callLetterHtml = generateOfficialCallLetterHtml({
    candidateName: candidate.name,
    roleApplied: candidate.roleApplied,
    joiningDate: joiningDate || defaultJoining,
    ctcPackage: defaultCtc,
    reportingTo: defaultReportingTo,
    workMode: defaultWorkMode,
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
    ctcPackage: defaultCtc,
    reportingTo: defaultReportingTo,
    workMode: defaultWorkMode,
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
  const { 
    title, 
    department, 
    experienceRequired, 
    totalVacancies, 
    vacanciesLeft, 
    status, 
    skills, 
    description,
    annualPackage,
    packageOptions,
    workingMode,
    reportingAuthority
  } = req.body;

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
    description: description || '',
    annualPackage: annualPackage || '₹8,50,000 - ₹12,00,000 per annum',
    packageOptions: Array.isArray(packageOptions) ? packageOptions : (packageOptions ? [packageOptions] : []),
    workingMode: workingMode || 'Remote / Hybrid (Flexible Work Arrangements)',
    reportingAuthority: reportingAuthority || 'Vageesha Sharma (Founder & Hiring Lead)'
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

// ================= CLOUD BRIDGE & AUTOMATED EMAIL SWEEP DAEMON =================
let isBridgeSyncActive = false;
const DISPATCHED_CLOUD_ASSESSMENTS = new Set();

// Seed existing delivered candidate assessments on startup so past submissions aren't re-sent
function initCloudBridgeCache() {
  try {
    const candidates = getCandidates(true);
    for (const c of candidates) {
      const completionTime = c.assessmentDetails?.completedAt || c.callLetterSentAt || c.feedbackSentAt;
      if (c.callLetterDetails?.emailDispatch?.success && c.callLetterSentAt) {
        DISPATCHED_CLOUD_ASSESSMENTS.add(`${c.id}__OFFER__${completionTime || 'INIT'}`);
      }
      if (c.feedbackDetails?.emailDispatch?.success && c.feedbackSentAt) {
        DISPATCHED_CLOUD_ASSESSMENTS.add(`${c.id}__FEEDBACK__${completionTime || 'INIT'}`);
      }
    }
    console.log(`[Cloud Bridge Cache] Initialized with ${DISPATCHED_CLOUD_ASSESSMENTS.size} delivered outcome records.`);
  } catch (err) {
    console.warn('[Cloud Bridge Cache Warn]:', err.message);
  }
}
initCloudBridgeCache();

async function checkCloudPendingDispatches() {
  if (isBridgeSyncActive) return;
  // If running in cloud (Render), do not poll external cloud endpoint
  if (process.env.RENDER === 'true') return;

  isBridgeSyncActive = true;
  try {
    const https = require('https');
    const cloudUrl = 'https://hr-smartflow-automation.onrender.com/api/candidates?status=ALL&includeAll=true';

    const rawData = await new Promise((resolve, reject) => {
      const req = https.get(cloudUrl, { timeout: 10000 }, (res) => {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => resolve(body));
      });
      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('Cloud sync timeout')); });
    });

    const parsed = JSON.parse(rawData);
    let remoteCandidates = (parsed.success && Array.isArray(parsed.candidates)) ? parsed.candidates : [];

    const localCandidates = getCandidates(true);

    // Also actively probe Render for any local candidates awaiting assessment completion
    for (const lc of localCandidates) {
      if (lc.status === 'SELECTED' && lc.interviewStatus === 'SCHEDULED' && !lc.assessmentCompleted) {
        try {
          const statusRaw = await new Promise((res, rej) => {
            const sReq = https.get(`https://hr-smartflow-automation.onrender.com/api/assessment/status?candidateId=${encodeURIComponent(lc.id)}`, { timeout: 6000 }, (sRes) => {
              let b = '';
              sRes.on('data', d => b += d);
              sRes.on('end', () => res(b));
            });
            sReq.on('error', rej);
            sReq.on('timeout', () => { sReq.destroy(); rej(new Error('Status timeout')); });
          });
          const statusJson = JSON.parse(statusRaw);
          if (statusJson && statusJson.alreadySubmitted && statusJson.candidate) {
            const rc = statusJson.candidate;
            const existingIdx = remoteCandidates.findIndex(r => r.id === rc.id);
            if (existingIdx !== -1) {
              remoteCandidates[existingIdx] = { ...remoteCandidates[existingIdx], ...rc, assessmentCompleted: true, testSubmitted: true };
            } else {
              remoteCandidates.unshift({ ...lc, ...rc, assessmentCompleted: true, testSubmitted: true });
            }
          }
        } catch (e) {
          // Continue silently if status probe times out
        }
      }
    }

    if (remoteCandidates.length > 0) {
      for (const c of remoteCandidates) {
        const isCompleted = Boolean(
          c.assessmentCompleted === true ||
          c.testSubmitted === true ||
          (c.assessmentDetails && c.assessmentDetails.completedAt) ||
          (c.testScore !== undefined && c.testScore !== null && c.interviewStatus === 'COMPLETED')
        );

        if (!isCompleted) continue;

        const targetEmail = (c.email || '').trim();
        if (!targetEmail || !targetEmail.includes('@') || targetEmail === 'candidate@example.com') continue;

        const scorePercent = c.assessmentDetails?.scorePercent ?? c.testScore ?? 0;
        const passed = Boolean(
          (c.testPassed === true || (c.assessmentDetails && c.assessmentDetails.passed === true) || c.status === 'SELECTED') &&
          scorePercent >= 80
        );

        const role = c.roleApplied || 'Frontend Developer';
        const candidateName = c.name || 'Candidate';
        const jobDefaults = getJobOfferDefaults(role);
        const offerRefId = c.offerRefId || `HR-OFFER-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const futureJoiningDate = c.callLetterDetails?.joiningDate || generateFutureJoiningDate(18);
        const defaultCtc = c.callLetterDetails?.ctcPackage || jobDefaults.ctcPackage;
        const defaultReportingTo = c.callLetterDetails?.reportingTo || jobDefaults.reportingTo;
        const defaultWorkMode = c.callLetterDetails?.workMode || jobDefaults.workMode;

        // Locate corresponding local candidate record (Strictly match by ID first)
        let localMatch = null;
        if (c.id) {
          localMatch = localCandidates.find(lc => lc.id === c.id);
        }
        if (!localMatch && c.email) {
          localMatch = localCandidates.find(lc => 
            lc.email && lc.email.toLowerCase().trim() === c.email.toLowerCase().trim() && 
            lc.roleApplied === role && 
            !lc.assessmentCompleted
          );
        }

        // ================= STAGE 2A: CANDIDATE ACCEPTED OFFER =================
        if (c.offerStatus === 'OFFER_ACCEPTED') {
          const hasDeliveredCallLetter = Boolean(
            localMatch?.callLetterDetails?.type === 'FINAL_OFFER_LETTER' && 
            localMatch?.callLetterDetails?.emailDispatch?.success
          );

          const dedupKey = `${c.id}__CALL_LETTER__${c.offerAcceptedAt || 'ACCEPTED'}`;
          if (!hasDeliveredCallLetter && !DISPATCHED_CLOUD_ASSESSMENTS.has(dedupKey)) {
            console.log(`[Cloud Bridge] 🚀 Detected Candidate "${candidateName}" ACCEPTED offer on Render! Auto-dispatching signed Official Call Letter via local SMTP...`);
            
            const callLetterHtml = generateOfficialCallLetterHtml({
              candidateName,
              roleApplied: role,
              joiningDate: futureJoiningDate,
              ctcPackage: defaultCtc,
              reportingTo: defaultReportingTo,
              workMode: defaultWorkMode,
              offerRefId
            });

            const subject = `📜 Official Employment Offer Letter & Call Letter: ${role} - Finova Technologies`;
            const dispatchResult = await sendNotificationEmail({
              to: targetEmail,
              subject,
              htmlBody: callLetterHtml,
              bypassDedup: true
            });

            if (dispatchResult && dispatchResult.success) {
              console.log(`[Cloud Bridge] ✅ Delivered signed Official Call Letter to ${targetEmail} (Candidate: "${candidateName}", Message ID: ${dispatchResult.messageId})!`);
              DISPATCHED_CLOUD_ASSESSMENTS.add(dedupKey);

              let targetLocal = localMatch;
              if (!targetLocal) {
                targetLocal = { id: c.id || `cand-${Date.now()}`, name: candidateName, email: targetEmail, roleApplied: role, receivedAt: c.receivedAt || new Date().toISOString() };
                localCandidates.unshift(targetLocal);
              }

              targetLocal.status = 'SELECTED';
              targetLocal.offerStatus = 'OFFER_ACCEPTED';
              targetLocal.interviewStatus = 'COMPLETED';
              targetLocal.offerAcceptedAt = c.offerAcceptedAt || new Date().toISOString();
              targetLocal.callLetterSentAt = new Date().toISOString();
              targetLocal.callLetterDetails = {
                joiningDate: futureJoiningDate,
                ctcPackage: defaultCtc,
                reportingTo: defaultReportingTo,
                workMode: defaultWorkMode,
                offerRefId,
                emailDispatch: dispatchResult,
                deliveredTo: targetEmail,
                type: 'FINAL_OFFER_LETTER'
              };
              saveCandidates(localCandidates);
            }
            await new Promise(r => setTimeout(r, 1000));
          }
          continue;
        }

        // ================= STAGE 2B: CANDIDATE DECLINED OFFER =================
        if (c.offerStatus === 'OFFER_DECLINED') {
          const hasDeliveredDeclineAck = Boolean(localMatch?.declineDetails?.emailDispatch?.success);
          const dedupKey = `${c.id}__DECLINE_ACK__${c.offerDeclinedAt || 'DECLINED'}`;

          if (!hasDeliveredDeclineAck && !DISPATCHED_CLOUD_ASSESSMENTS.has(dedupKey)) {
            console.log(`[Cloud Bridge] ℹ️ Detected Candidate "${candidateName}" DECLINED offer on Render! Auto-dispatching polite acknowledgement via local SMTP...`);
            
            const declineHtml = generateOfferDeclineAcknowledgementEmailHtml({
              candidateName,
              roleApplied: role,
              reportingTo: defaultReportingTo
            });

            const subject = `Acknowledgement of Decision: ${role} Offer - Finova Technologies`;
            const dispatchResult = await sendNotificationEmail({
              to: targetEmail,
              subject,
              htmlBody: declineHtml,
              bypassDedup: true
            });

            if (dispatchResult && dispatchResult.success) {
              console.log(`[Cloud Bridge] ✅ Delivered Decline Acknowledgement to ${targetEmail} (Candidate: "${candidateName}", Message ID: ${dispatchResult.messageId})!`);
              DISPATCHED_CLOUD_ASSESSMENTS.add(dedupKey);

              let targetLocal = localMatch;
              if (!targetLocal) {
                targetLocal = { id: c.id || `cand-${Date.now()}`, name: candidateName, email: targetEmail, roleApplied: role, receivedAt: c.receivedAt || new Date().toISOString() };
                localCandidates.unshift(targetLocal);
              }

              targetLocal.status = 'REJECTED';
              targetLocal.offerStatus = 'OFFER_DECLINED';
              targetLocal.interviewStatus = 'COMPLETED';
              targetLocal.offerDeclinedAt = c.offerDeclinedAt || new Date().toISOString();
              targetLocal.declineDetails = {
                declinedAt: targetLocal.offerDeclinedAt,
                emailDispatch: dispatchResult,
                deliveredTo: targetEmail
              };
              saveCandidates(localCandidates);
            }
            await new Promise(r => setTimeout(r, 1000));
          }
          continue;
        }

        // ================= STAGE 1: ASSESSMENT OUTCOME DISPATCH =================
        const outcomeType = passed ? 'OFFER' : 'FEEDBACK';
        const completionTime = c.assessmentDetails?.completedAt || c.feedbackSentAt || c.callLetterSentAt || c.evaluatedAt || 'RECENT';
        const dedupKey = `${c.id}__${outcomeType}__${completionTime}`;

        // Check if already dispatched by local bridge
        if (DISPATCHED_CLOUD_ASSESSMENTS.has(dedupKey)) continue;

        // Check if already marked delivered locally
        const alreadyDeliveredLocally = localMatch && (
          passed
            ? (Boolean(localMatch.callLetterDetails?.emailDispatch?.success) && (localMatch.callLetterDetails?.type === 'SELECTION_INTENT_OFFER' || localMatch.callLetterDetails?.type === 'FINAL_OFFER_LETTER'))
            : (Boolean(localMatch.feedbackDetails?.emailDispatch?.success))
        );

        if (alreadyDeliveredLocally) {
          DISPATCHED_CLOUD_ASSESSMENTS.add(dedupKey);
          continue;
        }

        console.log(`[Cloud Bridge] 🚀 Detected completed assessment on Render for "${candidateName}" (Score: ${scorePercent}%, Passed: ${passed})! Auto-dispatching via local SMTP...`);

        let subject = '';
        let htmlBody = '';

        if (passed) {
          htmlBody = generateSelectionOfferEmailHtml({
            candidateName,
            candidateId: c.id,
            candidateEmail: targetEmail,
            roleApplied: role,
            department: jobDefaults.matchedJob?.department || 'Engineering & Technology',
            skills: jobDefaults.matchedJob?.skills || [],
            description: jobDefaults.matchedJob?.description || '',
            joiningDate: futureJoiningDate,
            ctcPackage: defaultCtc,
            reportingTo: defaultReportingTo,
            workMode: defaultWorkMode,
            decisionBaseUrl: 'https://hr-smartflow-automation.onrender.com',
            offerRefId
          });
          subject = `🎉 Congratulations! Job Offer & Selection Intent: ${role} - Finova Technologies`;
        } else {
          htmlBody = generateAssessmentOutcomeFeedbackHtml({
            candidateName,
            roleApplied: role,
            scorePercent,
            passingThreshold: 80,
            correctCount: c.assessmentDetails?.correctCount ?? Math.round((scorePercent / 100) * 20),
            totalQuestions: c.assessmentDetails?.totalQuestions ?? 20,
            sectionBreakdown: c.assessmentDetails?.sectionBreakdown
          });
          subject = `📊 Technical Assessment Result & Performance Feedback: ${role} - Finova Technologies`;
        }

        const dispatchResult = await sendNotificationEmail({
          to: targetEmail,
          subject,
          htmlBody,
          bypassDedup: true
        });

        if (dispatchResult && dispatchResult.success) {
          console.log(`[Cloud Bridge] ✅ Delivered ${passed ? 'Selection Intent Offer' : 'Assessment Feedback'} to ${targetEmail} (Candidate: "${candidateName}", Message ID: ${dispatchResult.messageId})!`);
          DISPATCHED_CLOUD_ASSESSMENTS.add(dedupKey);

          // Update local candidate record
          let targetLocal = localMatch;
          if (!targetLocal) {
            targetLocal = {
              id: c.id || `cand-${Date.now()}`,
              name: candidateName,
              email: targetEmail,
              roleApplied: role,
              receivedAt: c.receivedAt || new Date().toISOString()
            };
            localCandidates.unshift(targetLocal);
          }

          targetLocal.testScore = scorePercent;
          targetLocal.testPassed = passed;
          targetLocal.assessmentCompleted = true;
          targetLocal.testSubmitted = true;
          targetLocal.status = passed ? 'SELECTED' : 'REJECTED';
          targetLocal.offerStatus = passed ? 'OFFER_EXTENDED' : 'REJECTED';
          targetLocal.interviewStatus = 'COMPLETED';

          if (passed) {
            targetLocal.offerRefId = offerRefId;
            targetLocal.callLetterSentAt = new Date().toISOString();
            targetLocal.callLetterDetails = {
              joiningDate: futureJoiningDate,
              ctcPackage: defaultCtc,
              reportingTo: defaultReportingTo,
              workMode: defaultWorkMode,
              offerRefId,
              emailDispatch: dispatchResult,
              deliveredTo: targetEmail,
              type: 'SELECTION_INTENT_OFFER'
            };
          } else {
            targetLocal.feedbackSentAt = new Date().toISOString();
            targetLocal.feedbackDetails = {
              scorePercent,
              correctCount: c.assessmentDetails?.correctCount ?? Math.round((scorePercent / 100) * 20),
              totalQuestions: c.assessmentDetails?.totalQuestions ?? 20,
              emailDispatch: dispatchResult,
              deliveredTo: targetEmail
            };
          }

          saveCandidates(localCandidates);

          // Sync delivery confirmation to Render Cloud
          try {
            const confirmPayload = JSON.stringify({
              candidateId: c.id,
              messageId: dispatchResult.messageId,
              emailType: passed ? 'OFFER_LETTER' : 'FEEDBACK',
              deliveredTo: targetEmail,
              success: true
            });
            const confirmReq = https.request('https://hr-smartflow-automation.onrender.com/api/assessment/confirm-dispatch', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(confirmPayload)
              },
              timeout: 5000
            });
            confirmReq.on('error', () => {});
            confirmReq.write(confirmPayload);
            confirmReq.end();
          } catch (e) {}
        } else {
          console.warn(`[Cloud Bridge Warning] Failed to dispatch email to: ${targetEmail}:`, dispatchResult?.error);
        }
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  } catch (err) {
    // Silently continue if cloud instance is asleep or unreachable
  } finally {
    isBridgeSyncActive = false;
  }
}

function startServerWithFallback(portToTry) {
  const server = app.listen(portToTry, () => {
    console.log(`====================================================`);
    console.log(`  HR Recruitment AI Automation & Dashboard Live!   `);
    console.log(`  Local URL:  http://localhost:${portToTry}           `);
    console.log(`  Live Cloud: https://hr-smartflow-automation.onrender.com`);
    console.log(`  Recruiter:  sharmavageesha2000@gmail.com           `);
    console.log(`  Gmail SMTP & IMAP: CONNECTED & AUTHENTICATED      `);
    console.log(`  Auto-Scanner Daemon: ACTIVE (Polling every 15s)   `);
    console.log(`  Outcome Watchdog & Cloud Bridge: ACTIVE           `);
    console.log(`  Gemini Model: ${DEFAULT_MODEL} (Connected)        `);
    console.log(`====================================================`);

    // Initial checks on boot
    setTimeout(checkCloudPendingDispatches, 2000);
    setTimeout(checkInboxNow, 5000);
    setTimeout(checkAndDispatchPendingOutcomeEmails, 8000);

    // Continuous intervals (high-frequency 4s cloud bridge)
    setInterval(checkCloudPendingDispatches, 4000);

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


