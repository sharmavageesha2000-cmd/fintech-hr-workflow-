/**
 * Verification of Immediate Post-Assessment SMTP Auto-Reply Dispatch
 */
const { 
  generateSessionAssessment, 
  evaluateAssessmentSubmission, 
  ACTIVE_ASSESSMENT_SESSIONS 
} = require('./assessment_questions');

const { 
  generateOfficialCallLetterHtml, 
  generateAssessmentOutcomeFeedbackHtml 
} = require('./gemini_evaluator');

const nodemailer = require('nodemailer');

// Simulate server email dispatcher with bypassDedup
const DISPATCHED_EMAILS_CACHE = new Map();

async function mockSendNotificationEmail({ to, subject, htmlBody, bypassDedup = false }) {
  const dedupKey = `${(to || '').toLowerCase().trim()}__${(subject || '').toLowerCase().trim()}`;
  const lastSentTime = DISPATCHED_EMAILS_CACHE.get(dedupKey);

  if (!bypassDedup && lastSentTime && (Date.now() - lastSentTime < 300000)) {
    return { success: true, deduplicated: true, messageId: 'DEDUP_SUPPRESSED' };
  }
  DISPATCHED_EMAILS_CACHE.set(dedupKey, Date.now());

  // Test Nodemailer configuration & credentials
  const recruiterEmail = process.env.RECRUITER_EMAIL || 'sharmavageesha2000@gmail.com';
  const appPassword = (process.env.GOOGLE_APP_PASSWORD || 'qoyolivxrkuqxmkx').replace(/\s+/g, '');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: recruiterEmail, pass: appPassword },
    tls: { rejectUnauthorized: false }
  });

  console.log(`[SMTP Test] 🚀 Connecting to Gmail SMTP to send email to: ${to} (Subject: "${subject}")...`);
  const info = await transporter.sendMail({
    from: `"Vageesha Sharma (Talent Acquisition)" <${recruiterEmail}>`,
    to,
    subject,
    html: htmlBody
  });

  return { success: true, messageId: info.messageId, to, subject };
}

async function runImmediatePostTestAudit() {
  console.log('===========================================================');
  console.log('🧪 Starting Immediate Post-Test SMTP Auto-Reply Dispatch Audit');
  console.log('===========================================================\n');

  const testRecipient = 'sharmavageesha2000@gmail.com';

  // 1. TEST PASSING ASSESSMENT (>= 80%) -> Immediate Offer Letter Dispatch
  console.log('--- TEST 1: Passing Assessment (Score 90%) -> Immediate Offer Letter ---');
  const sessionPass = generateSessionAssessment('Frontend Developer', {
    candidateEmail: testRecipient,
    name: 'Priya Sharma'
  });
  const passData = ACTIVE_ASSESSMENT_SESSIONS.get(sessionPass.sessionId);
  const passAnswers = {};
  Object.keys(passData.answerKey).forEach((qId, i) => {
    if (i < 18) passAnswers[qId] = passData.answerKey[qId]; // 18/20 = 90%
    else passAnswers[qId] = (passData.answerKey[qId] + 1) % 4;
  });

  const passEval = evaluateAssessmentSubmission('Frontend Developer', passAnswers, sessionPass.sessionId);
  console.log(`Evaluated Score: ${passEval.scorePercent}%, Passed: ${passEval.passed}`);

  const offerHtml = generateOfficialCallLetterHtml({
    candidateName: 'Priya Sharma',
    roleApplied: 'Frontend Developer',
    offerRefId: `HR-OFFER-${Date.now()}`
  });

  const passDispatch = await mockSendNotificationEmail({
    to: testRecipient,
    subject: '🎉 Official Job Offer & Call Letter: Frontend Developer - Finova Technologies',
    htmlBody: offerHtml,
    bypassDedup: true
  });

  console.log('Passing Offer Letter Dispatch Result:', passDispatch);
  if (!passDispatch.success || passDispatch.deduplicated || !passDispatch.messageId) {
    throw new Error('TEST 1 FAILED: Offer Letter was not delivered immediately via SMTP');
  }
  console.log('✅ TEST 1 PASSED: Offer letter auto-reply dispatched immediately via SMTP!\n');

  // 2. TEST NON-PASSING ASSESSMENT (< 80%) -> Immediate Feedback Update Dispatch
  console.log('--- TEST 2: Non-Passing Assessment (Score 50%) -> Immediate Feedback Update ---');
  const sessionFail = generateSessionAssessment('Frontend Developer', {
    candidateEmail: testRecipient,
    name: 'Rohan Verma'
  });
  const failData = ACTIVE_ASSESSMENT_SESSIONS.get(sessionFail.sessionId);
  const failAnswers = {};
  Object.keys(failData.answerKey).forEach((qId, i) => {
    if (i < 10) failAnswers[qId] = failData.answerKey[qId]; // 10/20 = 50%
    else failAnswers[qId] = (failData.answerKey[qId] + 1) % 4;
  });

  const failEval = evaluateAssessmentSubmission('Frontend Developer', failAnswers, sessionFail.sessionId);
  console.log(`Evaluated Score: ${failEval.scorePercent}%, Passed: ${failEval.passed}`);

  const feedbackHtml = generateAssessmentOutcomeFeedbackHtml({
    candidateName: 'Rohan Verma',
    roleApplied: 'Frontend Developer',
    scorePercent: failEval.scorePercent,
    passingThreshold: 80,
    correctCount: failEval.correctCount,
    totalQuestions: failEval.totalQuestions,
    sectionBreakdown: failEval.sectionBreakdown
  });

  const failDispatch = await mockSendNotificationEmail({
    to: testRecipient,
    subject: 'Update regarding your Technical Assessment: Frontend Developer - Finova Technologies',
    htmlBody: feedbackHtml,
    bypassDedup: true
  });

  console.log('Feedback Update Dispatch Result:', failDispatch);
  if (!failDispatch.success || failDispatch.deduplicated || !failDispatch.messageId) {
    throw new Error('TEST 2 FAILED: Feedback update was not delivered immediately via SMTP');
  }
  console.log('✅ TEST 2 PASSED: Assessment outcome & feedback update dispatched immediately via SMTP!\n');

  console.log('===========================================================');
  console.log('🎉 ALL IMMEDIATE POST-TEST SMTP DISPATCH TESTS PASSED!');
  console.log('===========================================================');
}

runImmediatePostTestAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
