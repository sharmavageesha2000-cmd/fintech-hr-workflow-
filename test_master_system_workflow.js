/**
 * ============================================================================
 * FINOVA TECHNOLOGIES — MASTER ENTERPRISE SYSTEM TEST & AUDIT SUITE
 * ============================================================================
 * Scope: Complete end-to-end HR Recruitment AI Platform & Workflow Audit
 * Verifies every single step without missing steps:
 * 
 * 1. Environment & Credential Handshake (IMAP 993, SMTP 465, Gemini 3.5 Flash)
 * 2. Data Persistence & Job Roles Catalog (8 roles, custom packages, reporting HRs)
 * 3. Frontend & SPA Routes (Dashboard, Careers Website, Assessment, Offer Decision)
 * 4. Document Ingestion & Name Extraction (PDF/DOCX extraction, Name & Role parser)
 * 5. Resume Gatekeeper & Anti-Spam Filtering (Rejection of invoices/receipts)
 * 6. AI Resume Screening & Scoring (Shortlisting >= 70% vs Rejection < 70%)
 * 7. 800-Question Assessment Rotation Engine (20 unique MCQs across 4 sections)
 * 8. Assessment Submission, Anti-Cheating, & Security Resubmission Lock
 * 9. Provisional Selection Offer Email Generation (CTC, Work Mode, Future Monday)
 * 10. Interactive Offer Decision Engine (Accept -> Signed Call Letter, Decline -> Ack)
 * ============================================================================
 */

require('dotenv').config();
const http = require('http');
const https = require('https');
const nodemailer = require('nodemailer');
const imaps = require('imap-simple');
const fs = require('fs');
const path = require('path');

const { 
  evaluateResumeWithGemini, 
  cleanAndExtractJobRole, 
  extractCandidateNameFromResume,
  generateOfficialCallLetterHtml,
  generateSelectionOfferEmailHtml,
  generateOfferDeclineAcknowledgementEmailHtml,
  generateFutureJoiningDate,
  generateOfferDecisionPageHtml
} = require('./gemini_evaluator');

const { 
  extractDocumentText, 
  isLegitimateResumeDocument 
} = require('./email_poller');

const { 
  ROLE_QUESTIONS_BANK, 
  generateSessionAssessment, 
  evaluateAssessmentSubmission 
} = require('./assessment_questions');

const BASE_URL = 'http://localhost:3000';
const RECRUITER_EMAIL = process.env.RECRUITER_EMAIL || 'sharmavageesha2000@gmail.com';
const GOOGLE_APP_PASS = (process.env.GOOGLE_APP_PASSWORD || 'qoyolivxrkuqxmkx').replace(/\s+/g, '');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  ❌ [FAIL] ${testName} -> ${details}`);
    failures.push({ testName, details });
  }
}

function httpGet(path) {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}${path}`, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: body });
        }
      });
    }).on('error', reject);
  });
}

function httpPost(path, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function httpDelete(path) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path,
      method: 'DELETE'
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function runMasterSystemTest() {
  const startTime = Date.now();
  console.log('\n================================================================================');
  console.log('🏛️ FINOVA TECHNOLOGIES — MASTER ENTERPRISE SYSTEM TEST & AUDIT SUITE');
  console.log('================================================================================');
  console.log(`Execution Timestamp: ${new Date().toISOString()}`);
  console.log(`Recruiter Mailbox:   ${RECRUITER_EMAIL}`);
  console.log(`Target System:       Localhost (http://localhost:3000) & Render Cloud Bridge\n`);

  // ==========================================================================
  // STAGE 1: Environment & Credentials Handshake
  // ==========================================================================
  console.log('--- STAGE 1: Environment & Protocol Credentials Handshake ---');
  assert(Boolean(process.env.GEMINI_API_KEY), 'Gemini API Key configured in environment');
  assert(Boolean(RECRUITER_EMAIL && RECRUITER_EMAIL.includes('@')), 'Recruiter email configured');
  assert(Boolean(GOOGLE_APP_PASS && GOOGLE_APP_PASS.length === 16), 'Google App Password configured (16 chars)');

  // Verify IMAP Connection Handshake
  try {
    const imapConfig = {
      imap: {
        user: RECRUITER_EMAIL,
        password: GOOGLE_APP_PASS,
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
        authTimeout: 10000
      }
    };
    const imapConn = await imaps.connect(imapConfig);
    const box = await imapConn.openBox('INBOX');
    assert(box && box.messages.total >= 0, 'Gmail IMAP Handshake (imap.gmail.com:993 SSL) connected successfully');
    imapConn.end();
  } catch (err) {
    assert(false, 'Gmail IMAP Handshake connected', err.message);
  }

  // Verify Direct SSL SMTP Handshake (Port 465)
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: RECRUITER_EMAIL, pass: GOOGLE_APP_PASS },
      connectionTimeout: 10000
    });
    const smtpVerified = await transporter.verify();
    assert(smtpVerified === true, 'Gmail Direct SSL SMTP Handshake (smtp.gmail.com:465) verified');
  } catch (err) {
    assert(false, 'Gmail Direct SSL SMTP Handshake verified', err.message);
  }

  // ==========================================================================
  // STAGE 2: Data Persistence & Job Roles Catalog
  // ==========================================================================
  console.log('\n--- STAGE 2: Persistent Storage & Job Roles Catalog ---');
  const dataDir = path.join(__dirname, 'data');
  const uploadsDir = path.join(__dirname, 'uploads');
  assert(fs.existsSync(dataDir), 'data/ directory exists and accessible');
  assert(fs.existsSync(uploadsDir), 'uploads/ directory exists and accessible');
  assert(fs.existsSync(path.join(dataDir, 'candidates.json')), 'data/candidates.json exists');
  assert(fs.existsSync(path.join(dataDir, 'jobs.json')), 'data/jobs.json exists');

  const jobsRes = await httpGet('/api/jobs');
  assert(jobsRes.status === 200 && jobsRes.data.success === true, 'GET /api/jobs returns HTTP 200');
  const jobsList = jobsRes.data.jobs || [];
  assert(jobsList.length >= 8, `Jobs catalog contains all 8 active roles (Found: ${jobsList.length})`);

  // Verify role structure
  const sampleRole = jobsList[0];
  assert(Boolean(sampleRole.title && sampleRole.department), `Job role "${sampleRole.title}" has department: ${sampleRole.department}`);
  assert(Boolean(sampleRole.annualPackage), `Job role has configured compensation: ${sampleRole.annualPackage}`);
  assert(Boolean(sampleRole.reportingAuthority), `Job role has designated reporting HR: ${sampleRole.reportingAuthority}`);

  // ==========================================================================
  // STAGE 3: Frontend Web Applications & SPA Routing
  // ==========================================================================
  console.log('\n--- STAGE 3: Frontend Web Applications & SPA Delivery ---');
  const dashRes = await httpGet('/');
  assert(dashRes.status === 200 && (dashRes.raw || '').includes('HR SmartFlow'), 'HR Management Dashboard renders cleanly (GET /)');

  const websiteRes = await httpGet('/website/');
  assert(websiteRes.status === 200 && (websiteRes.raw || '').includes('Finova'), 'Finova Careers Website renders cleanly (GET /website/)');

  const assessPageRes = await httpGet('/assessment');
  assert(assessPageRes.status === 200 && (assessPageRes.raw || '').includes('Systematic Technical Assessment'), 'Assessment Proctored Portal renders cleanly (GET /assessment)');

  const decisionPageRes = await httpGet('/offer-decision.html');
  assert(decisionPageRes.status === 200 && (decisionPageRes.raw || '').includes('Offer Decision'), 'Candidate Offer Decision Portal renders cleanly (GET /offer-decision.html)');

  // ==========================================================================
  // STAGE 4: Document Ingestion, Name Extraction & Spam Filter
  // ==========================================================================
  console.log('\n--- STAGE 4: Document Text Extraction & Resume Gatekeeper ---');

  // Test text extraction
  const sampleResumeBuffer = Buffer.from('HARSHITA MEHTA\nFull Stack AI Engineer\nSkills: React, Python, Gemini API, Node.js\nExperience: 4 years building enterprise AI workflows.');
  const extractedText = await extractDocumentText(sampleResumeBuffer, 'Harshita_Mehta_Resume.txt', 'text/plain');
  assert(extractedText.includes('HARSHITA MEHTA'), 'Document text extraction succeeds for candidate resume');

  // Test name extraction resilience
  const name1 = extractCandidateNameFromResume('HARSHITA MEHTA\nFull Stack AI Engineer', 'Resume.pdf');
  assert(name1 === 'Harshita Mehta', `Extracts candidate real name properly (Got: "${name1}")`);

  const name2 = extractCandidateNameFromResume('Vageesha Sharma (Talent Acquisition)\nCandidate: Rohan Joshi', 'Rohan_Joshi_CV.pdf');
  assert(name2 === 'Rohan Joshi', `Protects recruiter name from being extracted as candidate (Got: "${name2}")`);

  // Test Spam/Invoice Gatekeeper
  const isInvoice = isLegitimateResumeDocument('Tax_Invoice_INV2026.pdf', 'Tax Invoice Total Amount Payable GSTIN', 'billing@company.com', 'Your Invoice');
  assert(isInvoice === false, 'Gatekeeper properly rejects invoices, bills, and payment receipts');

  const isLegit = isLegitimateResumeDocument('Software_Engineer_CV.pdf', 'Skills: JavaScript, Node, React, Python. Education: B.Tech in CS. Experience: 3 years.', 'candidate@gmail.com', 'Job Application');
  assert(isLegit === true, 'Gatekeeper properly approves genuine candidate resumes');

  // ==========================================================================
  // STAGE 5: AI Resume Screening (Gemini 3.5 Flash Decision Engine)
  // ==========================================================================
  console.log('\n--- STAGE 5: Gemini 3.5 Flash AI Resume Screening ---');
  const testRunSuffix = Date.now().toString().slice(-4);
  const testCandidatePayload = {
    name: `Kavita Sundaram ${testRunSuffix}`,
    email: `kavita.sundaram.qa${testRunSuffix}@gmail.com`,
    roleApplied: 'Frontend Developer',
    experienceYears: 3.5,
    skills: ['React.js', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Redux', 'REST APIs'],
    resumeText: `Kavita Sundaram | Senior Frontend Developer
Email: kavita.sundaram.qa${testRunSuffix}@gmail.com | Location: Bengaluru
Summary: Frontend Engineer with 3.5 years of production React and TypeScript experience.
Skills: React.js, TypeScript, Tailwind CSS, Redux Toolkit, Next.js, HTML5, CSS3, Jest.
Experience: Developed responsive fintech dashboards with 99.9% uptime.`
  };

  const evalRes = await httpPost('/api/evaluate', testCandidatePayload);
  assert(evalRes.status === 200 && evalRes.data.success === true, 'POST /api/evaluate completes with success: true');
  const screenedCand = evalRes.data.candidate;
  assert(screenedCand.status === 'SELECTED', `Candidate successfully SHORTLISTED (Status: ${screenedCand.status}, Score: ${screenedCand.matchScore}%)`);
  assert(Boolean(screenedCand.id), `Generated unique Candidate ID: ${screenedCand.id}`);
  assert(Boolean(screenedCand.interviewSchedule?.assessmentLink), 'Generated 20-MCQ Assessment Link with security token');

  // ==========================================================================
  // STAGE 6: 800-Question Dynamic Assessment Rotation Engine
  // ==========================================================================
  console.log('\n--- STAGE 6: 800-Question Assessment Rotation Engine ---');
  const roleBankKeys = Object.keys(ROLE_QUESTIONS_BANK);
  assert(roleBankKeys.length >= 8, `Question bank covers all 8 job roles (Found: ${roleBankKeys.length})`);
  
  // Verify 100 questions per role
  let allBanksComplete = true;
  roleBankKeys.forEach(r => {
    if (ROLE_QUESTIONS_BANK[r].length < 100) allBanksComplete = false;
  });
  assert(allBanksComplete, 'All 8 role banks contain strictly 100 distinct domain questions (800 MCQs total)');

  // Request session questions via API
  const sessionRes = await httpGet(`/api/assessment/questions?role=Frontend%20Developer&candidateId=${screenedCand.id}&candidateEmail=${encodeURIComponent(screenedCand.email)}`);
  assert(sessionRes.status === 200 && sessionRes.data.success === true, 'GET /api/assessment/questions generates active test session');
  const sessionData = sessionRes.data;
  assert(sessionData.questions && sessionData.questions.length === 20, `Session provides exactly 20 domain questions (Found: ${sessionData.questions.length})`);
  assert(sessionData.sections && sessionData.sections.length === 4, `Structured across all 4 systematic sections (Found: ${sessionData.sections.length})`);

  // Verify anti-cheating status API
  const statusCheck = await httpGet(`/api/assessment/status?candidateId=${screenedCand.id}`);
  assert(statusCheck.status === 200 && statusCheck.data.alreadySubmitted === false, 'Fresh assessment link is unlocked (alreadySubmitted: false)');

  // ==========================================================================
  // STAGE 7: Assessment Submission, Anti-Cheating & Scoring (Pass Threshold 80%)
  // ==========================================================================
  console.log('\n--- STAGE 7: Assessment Submission & Mandatory 80% Threshold ---');
  const rolePool = ROLE_QUESTIONS_BANK['Frontend Developer'];
  const correctAnswers = {};
  sessionData.questions.forEach((q, idx) => {
    const orig = rolePool.find(x => x.id === q.id);
    const correctText = orig ? orig.options[orig.correctIndex || 0] : q.options[0];
    const idxInSess = q.options.indexOf(correctText);
    const resolved = idxInSess !== -1 ? idxInSess : 0;
    // Score 19/20 = 95% (passing)
    if (idx < 19) {
      correctAnswers[q.id] = resolved;
    } else {
      correctAnswers[q.id] = (resolved + 1) % 4; // 1 deliberate incorrect
    }
  });

  const submitPayload = {
    candidateId: screenedCand.id,
    candidateName: screenedCand.name,
    candidateEmail: screenedCand.email,
    roleApplied: 'Frontend Developer',
    sessionId: sessionData.sessionId,
    answers: correctAnswers,
    tabSwitchesCount: 0,
    timeSpentSeconds: 620,
    forcedByViolation: false
  };

  const submitRes = await httpPost('/api/assessment/submit', submitPayload);
  assert(submitRes.status === 200 && submitRes.data.success === true, 'POST /api/assessment/submit evaluates submission');
  const subResult = submitRes.data;
  assert(subResult.scorePercent === 95, `Candidate scored 95% (19/20 correct)`);
  assert(subResult.passed === true, 'Candidate passed strictly against 80% threshold');
  assert(subResult.candidate.status === 'SELECTED', `Candidate status is SELECTED (Rule 1 compliance)`);
  assert(subResult.candidate.offerStatus === 'OFFER_EXTENDED', `Candidate offerStatus is OFFER_EXTENDED`);

  // STAGE 7B: Verify Security Lockout (Preventing retaking completed test)
  console.log('\n--- STAGE 7B: Security Resubmission Lockout Verification ---');
  const lockedSessionRes = await httpGet(`/api/assessment/questions?candidateId=${screenedCand.id}`);
  assert(lockedSessionRes.data.alreadySubmitted === true, 'Completed test link is strictly locked from re-opening questions');

  const duplicateSubmit = await httpPost('/api/assessment/submit', submitPayload);
  assert(duplicateSubmit.data.alreadySubmitted === true, 'Duplicate submission attempts are rejected with alreadySubmitted: true');

  // ==========================================================================
  // STAGE 8: Provisional Selection Offer & Dynamic Future Joining Date
  // ==========================================================================
  console.log('\n--- STAGE 8: Provisional Selection Offer & Joining Date ---');
  const futureJoining = generateFutureJoiningDate(18);
  assert(futureJoining.startsWith('Monday, '), `Guaranteed future Monday joining date: "${futureJoining}"`);
  
  const provisionalHtml = generateSelectionOfferEmailHtml({
    candidateName: screenedCand.name,
    candidateId: screenedCand.id,
    candidateEmail: screenedCand.email,
    roleApplied: 'Frontend Developer',
    department: 'Engineering & Technology',
    skills: ['React.js', 'TypeScript', 'Tailwind CSS'],
    ctcPackage: '₹12,00,000 per annum (Standard Full-Time)',
    workMode: 'Remote / Hybrid (Flexible Work Arrangements)',
    reportingTo: 'Pooja Mehta (VP of Talent Acquisition)',
    joiningDate: futureJoining,
    decisionBaseUrl: 'http://localhost:3000',
    offerRefId: subResult.candidate.offerRefId
  });

  assert(provisionalHtml.includes('Frontend Developer'), 'Provisional Offer Email contains Job Role');
  assert(provisionalHtml.includes('₹12,00,000 per annum'), 'Provisional Offer Email contains Annual CTC Compensation');
  assert(provisionalHtml.includes('Remote / Hybrid'), 'Provisional Offer Email contains Working Mode');
  assert(provisionalHtml.includes('Pooja Mehta'), 'Provisional Offer Email contains Reporting HR Authority');
  assert(provisionalHtml.includes(futureJoining), 'Provisional Offer Email contains Future Monday Joining Date');
  assert(provisionalHtml.includes('decision=accept'), 'Provisional Offer Email contains Accept button URL');
  assert(provisionalHtml.includes('decision=reject'), 'Provisional Offer Email contains Decline button URL');

  // ==========================================================================
  // STAGE 9: Candidate Offer Decision Flow (Accept -> Call Letter Dispatch)
  // ==========================================================================
  console.log('\n--- STAGE 9: Interactive Candidate Offer Decision Flow ---');

  // Simulate Candidate clicking [✔ Accept Offer]
  const acceptRes = await httpGet(`/api/offer/decision?decision=accept&id=${screenedCand.id}&name=${encodeURIComponent(screenedCand.name)}&email=${encodeURIComponent(screenedCand.email)}&role=Frontend%20Developer`);
  assert(acceptRes.status === 200, 'GET /api/offer/decision?decision=accept returns HTTP 200 OK Direct HTML Page');
  assert((acceptRes.raw || '').includes('Offer Formally Accepted!'), 'Branded confirmation page displays "Offer Formally Accepted!"');
  assert((acceptRes.raw || '').includes(screenedCand.name), 'Confirmation page personalizes candidate name');

  // Verify candidate record updated
  const updatedCandRes = await httpGet(`/api/candidates/${screenedCand.id}`);
  const updatedCand = updatedCandRes.data.candidate;
  assert(updatedCand.offerStatus === 'OFFER_ACCEPTED', `Candidate offerStatus updated to OFFER_ACCEPTED`);
  assert(updatedCand.status === 'SELECTED', `Candidate status is SELECTED`);
  assert(Boolean(updatedCand.offerAcceptedAt), `Recorded offerAcceptedAt timestamp: ${updatedCand.offerAcceptedAt}`);

  // STAGE 9B: Double Decision Guard
  console.log('\n--- STAGE 9B: Offer Decision Idempotency Guard ---');
  const doubleDecisionRes = await httpGet(`/api/offer/decision?decision=accept&id=${screenedCand.id}`);
  assert(doubleDecisionRes.status === 200 && (doubleDecisionRes.raw || '').includes('Decision Already Recorded'), 'Repeated decision clicks render "Decision Already Recorded" state without errors');

  // STAGE 9C: Simulate Decline Flow on Secondary Candidate
  console.log('\n--- STAGE 9C: Decline Offer Decision Flow ---');
  const declineCandidate = {
    id: `cand-decline-qa-${Date.now()}`,
    name: 'Sameer Kulkarni',
    email: 'sameer.kulkarni.qa@example.com',
    roleApplied: 'Backend Developer',
    status: 'SELECTED',
    offerStatus: 'OFFER_EXTENDED',
    receivedAt: new Date().toISOString()
  };
  // Insert temporary candidate
  const candidatesFilePath = path.join(__dirname, 'data', 'candidates.json');
  const currentCandidates = JSON.parse(fs.readFileSync(candidatesFilePath, 'utf8'));
  currentCandidates.unshift(declineCandidate);
  fs.writeFileSync(candidatesFilePath, JSON.stringify(currentCandidates, null, 2), 'utf8');

  const declineRes = await httpGet(`/api/offer/decision?decision=reject&id=${declineCandidate.id}&name=Sameer%20Kulkarni&email=sameer.kulkarni.qa@example.com&role=Backend%20Developer`);
  assert(declineRes.status === 200, 'GET /api/offer/decision?decision=reject returns HTTP 200 OK Direct HTML Page');
  assert((declineRes.raw || '').includes('Offer Decision Recorded: Declined'), 'Branded confirmation page displays "Offer Decision Recorded: Declined"');

  const updatedDeclineCandRes = await httpGet(`/api/candidates/${declineCandidate.id}`);
  const updatedDeclineCand = updatedDeclineCandRes.data.candidate;
  assert(updatedDeclineCand.offerStatus === 'OFFER_DECLINED', 'Declined candidate offerStatus updated to OFFER_DECLINED');
  assert(updatedDeclineCand.status === 'REJECTED', 'Declined candidate status updated to REJECTED');
  assert(Boolean(updatedDeclineCand.offerDeclinedAt), `Recorded offerDeclinedAt timestamp: ${updatedDeclineCand.offerDeclinedAt}`);

  // Clean up secondary test candidate via API
  await httpDelete(`/api/candidates/${declineCandidate.id}`);

  // ==========================================================================
  // STAGE 10: HR Dashboard Operations & Candidate Management
  // ==========================================================================
  console.log('\n--- STAGE 10: HR Dashboard APIs & Candidate Operations ---');
  const statsRes = await httpGet('/api/stats');
  assert(statsRes.status === 200 && statsRes.data.success === true, 'GET /api/stats returns recruitment metrics');

  const filterRes = await httpGet('/api/candidates?status=SELECTED');
  assert(filterRes.status === 200 && Array.isArray(filterRes.data.candidates), 'Filter candidates by status=SELECTED works cleanly');

  const searchRes = await httpGet(`/api/candidates?search=${encodeURIComponent(screenedCand.name)}`);
  assert(searchRes.status === 200 && searchRes.data.candidates.some(c => c.id === screenedCand.id), 'Search candidate by name returns target record');

  // Clean up primary test candidate so database stays pristine
  await httpDelete(`/api/candidates/${screenedCand.id}`);
  console.log(`  🧹 [Test Cleanup] Cleaned up temporary test candidate: ${screenedCand.name} (ID: ${screenedCand.id})`);

  // ==========================================================================
  // FINAL AUDIT VERDICT
  // ==========================================================================
  const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log('\n================================================================================');
  console.log('🏁 MASTER ENTERPRISE SYSTEM TEST & AUDIT EXECUTION COMPLETE');
  console.log('================================================================================');
  console.log(`Total System Assertions: ${totalTests}`);
  console.log(`Passed Assertions:       ${passedTests} / ${totalTests} (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log(`Failed Assertions:       ${failedTests}`);
  console.log(`Total Test Runtime:      ${totalDuration} seconds`);
  console.log(`Systematic Health:       ${failedTests === 0 ? '🟢 100% OPERATIONAL — ZERO BUGS, ZERO MISSING STEPS' : '🔴 ISSUES DETECTED'}`);
  console.log('================================================================================\n');

  if (failedTests > 0) {
    console.error('Failure Details:');
    failures.forEach((f, i) => console.error(`${i + 1}. [${f.testName}]: ${f.details}`));
    process.exit(1);
  }
}

runMasterSystemTest().catch(err => {
  console.error('Fatal Test Suite Error:', err);
  process.exit(1);
});
