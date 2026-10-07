/**
 * ============================================================================
 * FINOVA TECHNOLOGIES — FULL ENTERPRISE SYSTEM TEST & WORKFLOW VERIFICATION
 * ============================================================================
 * Validates every step of the HR automation workflow from resume ingestion,
 * strict name reading through resume text, assessment scoring, offer dispatch,
 * candidate decision engine, to dashboard synchronization.
 *
 * Invariant Rules Enforced:
 * 1. Strict Name Extraction through resume text only (supporting 2-column & header layouts)
 * 2. Only candidates who sent/submitted resumes appear in HR Resume Dashboard
 * 3. Passing Threshold: Strictly 80% (16/20 MCQs correct) -> SELECTED & OFFER_EXTENDED
 * 4. Offer Decision: Accept -> OFFER_ACCEPTED & Signed Call Letter; Decline -> OFFER_DECLINED
 * 5. Dry-run Mode: Zero bounce-backs or mock emails to synthetic mailboxes (SIMULATE_EMAIL=true)
 * ============================================================================
 */

process.env.SIMULATE_EMAIL = 'true';
require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

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

let totalTests = 0;
let passedTests = 0;
const failures = [];

function check(assertion, description) {
  totalTests++;
  try {
    if (typeof assertion === 'function') {
      assertion = assertion();
    }
    assert(Boolean(assertion), description);
    passedTests++;
    console.log(`  ✅ [PASS] ${description}`);
  } catch (err) {
    failures.push({ test: description, error: err.message });
    console.error(`  ❌ [FAIL] ${description} -> ${err.message}`);
  }
}

function httpReq(method, path, data = null, port = 3000) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';
    const options = {
      hostname: 'localhost',
      port,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-simulate-email': 'true',
        ...(data ? { 'Content-Length': Buffer.byteLength(postData) } : {})
      },
      timeout: 30000
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body), raw: body });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body, data: null });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Timeout requesting ${path}`));
    });

    if (postData) req.write(postData);
    req.end();
  });
}

async function runCompleteSystemTest() {
  const startTime = Date.now();
  console.log('================================================================================');
  console.log('  FINOVA TECHNOLOGIES — FULL WORKFLOW SYSTEM TEST & AUDIT SUITE');
  console.log('================================================================================\n');

  // STEP 1: Candidate Name Extraction Strictly Through Resume Text
  console.log('--- STEP 1: Strict Candidate Name Extraction through Resume Content ---');
  
  // 1A. Standard 1-column resume with all-caps header
  const name1 = extractCandidateNameFromResume('Page 1\nROHAN SHARMA\nFull Stack AI Engineer | Python | React.js', 'Full_Stack_AI_Engineer_Resume (2).pdf');
  check(name1 === 'Rohan Sharma', `1A. All-caps name on top line extracted: "${name1}" === "Rohan Sharma"`);

  // 1B. Business Analyst with uppercase title line
  const name2 = extractCandidateNameFromResume('ANANYA VERMA\nBUSINESS ANALYST | AGILE & PROCESS', 'Business_Analyst_Resume_2_to_3_Years.pdf');
  check(name2 === 'Ananya Verma', `1B. Business Analyst name extracted: "${name2}" === "Ananya Verma"`);

  // 1C. Title-case name on top line
  const name3 = extractCandidateNameFromResume('Kabir Singh\nAI Prompt Engineer (Fresher)', '4_Kabir_Singh_AI_Prompt_Engineer_Fresher.pdf');
  check(name3 === 'Kabir Singh', `1C. Title-case name on top line extracted: "${name3}" === "Kabir Singh"`);

  // 1D. Senior Data Analyst (Rohan Mehta) with generic filename
  const name4 = extractCandidateNameFromResume(' ROHAN MEHTA\nSENIOR DATA ANALYST | 4+ YEARS EXPERIENCE\nrohan.mehta@email.com', 'Data_Analyst_Resume_3_to_5_Years.pdf');
  check(name4 === 'Rohan Mehta', `1D. Data Analyst name extracted strictly from text (not "Data To"): "${name4}" === "Rohan Mehta"`);

  // 1E. 2-Column Resume where contact/skills are first and Candidate Name is on Line 56 (Vageesha Sharma)
  const vageeshaResumeText = `CONTACT
Jabalpur, Madhya Pradesh
7247647151
sharmavageesha2000@gmail.com
CORE SKILLS
Generative AI Tools
Workflow Automation
Digital Marketing
TECHNICAL LEARNING
REST APIs, web development fundamentals
EDUCATION
Master of Arts (MA) Economics
CERTIFICATIONS
Certification in Advanced Excel
STRENGTHS
Quick learner, problem-solving
LANGUAGES
Hindi, English
VAGEESHA SHARMA
ECONOMICS GRADUATE | MARKETING & RESEARCH | GENERATIVE AI
PROFESSIONAL PROFILE
MA Economics graduate with background in generative AI and workflow automation.`;
  const name5 = extractCandidateNameFromResume(vageeshaResumeText, 'resume.pdf');
  check(name5 === 'Vageesha Sharma', `1E. 2-column layout candidate name extracted (not "Generative" or "Tools"): "${name5}" === "Vageesha Sharma"`);

  // 1F. Recruiter Header Protection (Recruiter email/name in header, Candidate name inside body)
  const name6 = extractCandidateNameFromResume('Vageesha Sharma (Talent Acquisition)\nCandidate: Rohan Joshi\nFull Stack Engineer', 'Rohan_Joshi_CV.pdf');
  check(name6 === 'Rohan Joshi', `1F. Recruiter header protected, candidate extracted: "${name6}" === "Rohan Joshi"`);

  // 1G. Explicit label line
  const name7 = extractCandidateNameFromResume('Applicant Name: Harshita Mehta\nFrontend Developer\nSkills: React.js', 'Resume.pdf');
  check(name7 === 'Harshita Mehta', `1G. Explicit "Applicant Name:" label extracted: "${name7}" === "Harshita Mehta"`);

  // STEP 2: Document Ingestion & Gatekeeper Filtering
  console.log('\n--- STEP 2: Document Parser & Gatekeeper Anti-Spam Filtering ---');
  const sampleBuf = Buffer.from('HARSHITA MEHTA\nFull Stack AI Engineer\nSkills: React, Python, Gemini API, Node.js\nExperience: 4 years.');
  const parsedDocText = await extractDocumentText(sampleBuf, 'Harshita_Mehta_Resume.txt', 'text/plain');
  check(parsedDocText.includes('HARSHITA MEHTA'), 'Document parser successfully extracts text buffer');

  const invoiceCheck = isLegitimateResumeDocument('Tax_Invoice_INV2026.pdf', 'Tax Invoice Total Amount Payable GSTIN', 'billing@company.com', 'Your Invoice');
  check(invoiceCheck === false, 'Gatekeeper blocks non-resume invoices and receipts');

  const resumeCheck = isLegitimateResumeDocument('Candidate_Resume.pdf', 'Skills: React, JavaScript, HTML, CSS. Education: B.Tech CS. Experience: 3 years.', 'candidate@gmail.com', 'Job Application');
  check(resumeCheck === true, 'Gatekeeper approves genuine candidate resumes');

  // STEP 3: 800-Question Dynamic Assessment Rotation Engine
  console.log('\n--- STEP 3: 800-Question Assessment Rotation Engine ---');
  const roles = Object.keys(ROLE_QUESTIONS_BANK);
  check(roles.length >= 8, `Assessment bank covers all 8 job roles (Found: ${roles.length})`);
  
  let allBanksComplete = true;
  roles.forEach(r => {
    if (ROLE_QUESTIONS_BANK[r].length < 100) allBanksComplete = false;
  });
  check(allBanksComplete, 'Every job role has 100 non-repeating MCQs (800 questions total)');

  const session = generateSessionAssessment('Frontend Developer', {
    sampleCount: 20,
    candidateEmail: 'sharmavageesha2000@gmail.com',
    name: 'Vageesha Sharma'
  });
  check(session.questions.length === 20, 'Generates 20 unique MCQs per candidate session');
  check(Boolean(session.sessionId), 'Generates secure cryptographic session ID');

  // STEP 4: Assessment Scoring Logic & Strict 80% Threshold
  console.log('\n--- STEP 4: Technical Assessment Scoring (80% Passing Threshold) ---');
  const pool = ROLE_QUESTIONS_BANK['Frontend Developer'];
  const passAnswers = {};
  const failAnswers = {};

  session.questions.forEach((q, idx) => {
    const orig = pool.find(x => x.id === q.id);
    const correctText = orig ? orig.options[orig.correctIndex || 0] : q.options[0];
    const correctIdx = q.options.indexOf(correctText);
    const validIdx = correctIdx !== -1 ? correctIdx : 0;

    // Passing candidate: 17/20 correct = 85% (>= 80%)
    if (idx < 17) {
      passAnswers[q.id] = validIdx;
    } else {
      passAnswers[q.id] = (validIdx + 1) % 4;
    }

    // Failing candidate: 14/20 correct = 70% (< 80%)
    if (idx < 14) {
      failAnswers[q.id] = validIdx;
    } else {
      failAnswers[q.id] = (validIdx + 1) % 4;
    }
  });

  const passEval = evaluateAssessmentSubmission('Frontend Developer', passAnswers, session.sessionId);
  check(passEval.scorePercent === 85 && passEval.passed === true, `Pass evaluation: ${passEval.scorePercent}% >= 80% (passed: true)`);

  const failEval = evaluateAssessmentSubmission('Frontend Developer', failAnswers, session.sessionId);
  check(failEval.scorePercent === 70 && failEval.passed === false, `Fail evaluation: ${failEval.scorePercent}% < 80% (passed: false)`);

  // STEP 5: Provisional Selection Offer & Dynamic Future Joining Date
  console.log('\n--- STEP 5: Provisional Selection Offer Generation ---');
  const futureMonday = generateFutureJoiningDate(18);
  check(futureMonday.startsWith('Monday, '), `Guaranteed future Monday joining date: "${futureMonday}"`);

  const offerHtml = generateSelectionOfferEmailHtml({
    candidateName: 'Vageesha Sharma',
    candidateId: 'cand-system-test-99',
    candidateEmail: 'sharmavageesha2000@gmail.com',
    roleApplied: 'Frontend Developer',
    department: 'Engineering & Technology',
    skills: ['React.js', 'JavaScript', 'Tailwind CSS'],
    ctcPackage: '₹9,50,000 per annum (Standard Full-Time)',
    workMode: 'Remote / Hybrid (Flexible Work Arrangements)',
    reportingTo: 'Pooja Mehta (VP of Talent Acquisition)',
    joiningDate: futureMonday,
    decisionBaseUrl: 'http://localhost:3000',
    offerRefId: 'HR-OFFER-2026-TEST'
  });

  check(offerHtml.includes('Frontend Developer'), 'Selection offer contains Job Role');
  check(offerHtml.includes('₹9,50,000 per annum'), 'Selection offer contains Annual CTC Package');
  check(offerHtml.includes('Remote / Hybrid'), 'Selection offer contains Working Mode');
  check(offerHtml.includes('Pooja Mehta'), 'Selection offer contains Reporting HR');
  check(offerHtml.includes(futureMonday), 'Selection offer contains Future Monday Joining Date');
  check(offerHtml.includes('decision=accept'), 'Selection offer contains functional Accept button URL');
  check(offerHtml.includes('decision=reject'), 'Selection offer contains functional Decline button URL');

  // STEP 6: Interactive Offer Decision Flow (Accept & Decline)
  console.log('\n--- STEP 6: Offer Decision Engine & Official Call Letter ---');
  const acceptPageHtml = generateOfferDecisionPageHtml({
    status: 'accepted',
    candidateName: 'Vageesha Sharma',
    roleApplied: 'Frontend Developer'
  });
  check(acceptPageHtml.includes('Offer Formally Accepted!'), 'Decision page serves "Offer Formally Accepted!" confirmation');
  check(acceptPageHtml.includes('Vageesha Sharma'), 'Decision page personalizes candidate name');

  const callLetterHtml = generateOfficialCallLetterHtml({
    candidateName: 'Vageesha Sharma',
    roleApplied: 'Frontend Developer',
    joiningDate: futureMonday,
    ctcPackage: '₹9,50,000 per annum (Standard Full-Time)',
    reportingTo: 'Pooja Mehta (VP of Talent Acquisition)',
    workMode: 'Remote / Hybrid (Flexible Work Arrangements)',
    offerRefId: 'HR-OFFER-2026-TEST'
  });
  check(callLetterHtml.includes('OFFICIAL EMPLOYMENT OFFER'), 'Signed Call Letter generated with formal appointment text');
  check(callLetterHtml.includes('Vageesha Sharma'), 'Call letter addressed to candidate');

  const declinePageHtml = generateOfferDecisionPageHtml({
    status: 'declined',
    candidateName: 'Vageesha Sharma',
    roleApplied: 'Frontend Developer'
  });
  check(declinePageHtml.includes('Offer Decision Recorded: Declined'), 'Decline page serves polite confirmation');

  // STEP 7: Live Server Endpoints & Candidate Database Verification
  console.log('\n--- STEP 7: Live HTTP Server & HR Resume Dashboard Verification ---');
  let serverPort = null;
  let serverOnline = false;

  for (const portToTry of [3001, 3000, 3002]) {
    try {
      const ping = await httpReq('GET', '/api/candidates', null, portToTry);
      if (ping.status === 200 && ping.data && ping.data.success === true) {
        serverPort = portToTry;
        serverOnline = true;
        break;
      }
    } catch (e) {}
  }

  if (serverOnline) {
    console.log(`  Connected to running local server on port ${serverPort}`);

    // 7A. Verify candidates endpoint returns ONLY candidates who sent resumes
    const candsRes = await httpReq('GET', '/api/candidates', null, serverPort);
    check(candsRes.status === 200 && Array.isArray(candsRes.data.candidates), 'GET /api/candidates returns candidate array');
    
    const candidates = candsRes.data.candidates;
    const allHaveResumes = candidates.every(c => Boolean(c.attachmentInfo?.fileName || (c.resumeText && c.resumeText.length > 30)));
    check(allHaveResumes, `Only candidates who sent a resume are returned (Count: ${candidates.length}, All have resumes: ${allHaveResumes})`);

    // 7B. Verify candidate Vageesha Sharma is NOT blocked by recruiter name filter
    const vageeshaInDb = candidates.find(c => (c.name || '').toLowerCase().includes('vageesha sharma'));
    check(Boolean(vageeshaInDb), `Candidate Vageesha Sharma is present in candidates API: ${vageeshaInDb ? vageeshaInDb.name + ' (' + vageeshaInDb.roleApplied + ')' : 'NOT FOUND'}`);

    // 7C & 7D. Verify assessment questions and submission workflow
    const testCandidateId = `cand-sys-verify-${Date.now()}`;
    const questRes = await httpReq('GET', `/api/assessment/questions?candidateId=${testCandidateId}&role=Frontend%20Developer`, null, serverPort);
    check(questRes.status === 200 && Array.isArray(questRes.data.questions), 'GET /api/assessment/questions generates questions for candidate');

    const serverSessionId = questRes.data.sessionId;
    const serverQuestions = questRes.data.questions;
    const correctTestAnswers = {};
    serverQuestions.forEach((q) => {
      const orig = ROLE_QUESTIONS_BANK['Frontend Developer'].find(x => x.id === q.id);
      const correctText = orig ? orig.options[orig.correctIndex || 0] : q.options[0];
      const selectedIndex = q.options.indexOf(correctText);
      correctTestAnswers[q.id] = (selectedIndex !== -1 ? selectedIndex : 0);
    });

    const subReq = await httpReq('POST', '/api/assessment/submit', {
      candidateId: testCandidateId,
      candidateName: 'Vageesha Sharma',
      candidateEmail: 'sharmavageesha2000@gmail.com',
      roleApplied: 'Frontend Developer',
      sessionId: serverSessionId,
      answers: correctTestAnswers,
      tabSwitchesCount: 0,
      timeSpentSeconds: 400,
      simulateEmail: true
    }, serverPort);

    check(subReq.status === 200 && subReq.data.success === true, 'POST /api/assessment/submit evaluates test successfully');
    check(subReq.data.scorePercent === 100 && subReq.data.passed === true, 'Candidate scored 100% and passed threshold');
    check(subReq.data.candidate.status === 'SELECTED', 'Candidate status updated to SELECTED in database');
    check(subReq.data.candidate.offerStatus === 'OFFER_EXTENDED', 'Candidate offerStatus updated to OFFER_EXTENDED in database');

    // 7E. Verify Security Resubmission Lockout
    const lockedRes = await httpReq('POST', '/api/assessment/submit', {
      candidateId: testCandidateId,
      roleApplied: 'Frontend Developer',
      answers: correctTestAnswers,
      simulateEmail: true
    }, serverPort);
    check(lockedRes.data.alreadySubmitted === true, 'Security lockout strictly rejects re-submission of completed test');

    // 7F. Verify Candidate Offer Decision (Accept)
    const acceptReq = await httpReq('GET', `/api/offer/decision?decision=accept&id=${testCandidateId}&name=Vageesha%20Sharma&email=sharmavageesha2000%40gmail.com&role=Frontend%20Developer&simulateEmail=true`, null, serverPort);
    check(acceptReq.status === 200 && (acceptReq.raw || '').includes('Offer Formally Accepted!'), 'GET /api/offer/decision?decision=accept returns HTTP 200 OK acceptance page');

    // Clean up temporary test candidate record
    await httpReq('DELETE', `/api/candidates/${testCandidateId}`, null, serverPort);
    console.log(`  🧹 [Cleanup] Removed temporary test candidate: ${testCandidateId}`);
  } else {
    console.log('  ⚠️ Local server is not currently running. Skipping live HTTP endpoint assertions.');
  }

  // AUDIT SUMMARY
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log('\n================================================================================');
  console.log('🏁 SYSTEM TEST & WORKFLOW AUDIT VERDICT');
  console.log('================================================================================');
  console.log(`Total System Checks:    ${totalTests}`);
  console.log(`Passed Checks:          ${passedTests} / ${totalTests} (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log(`Failed Checks:          ${failures.length}`);
  console.log(`Runtime:                ${duration}s`);
  console.log(`System Status:          ${failures.length === 0 ? '🟢 100% OPERATIONAL & VERIFIED' : '🔴 ISSUES FOUND'}`);
  console.log('================================================================================\n');

  if (failures.length > 0) {
    console.error('Failure Details:');
    failures.forEach((f, i) => console.error(`  ${i + 1}. [${f.test}]: ${f.error}`));
    process.exit(1);
  }
}

runCompleteSystemTest().catch(err => {
  console.error('Fatal error in system test suite:', err);
  process.exit(1);
});
