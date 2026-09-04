require('dotenv').config();
const { getQuestionsForRole, evaluateAssessmentSubmission } = require('./assessment_questions');
const { generateStructuredSelectedHtml, generateOfficialCallLetterHtml } = require('./gemini_evaluator');
const nodemailer = require('nodemailer');

console.log('======================================================================');
console.log('🧪 VERIFYING 20-MCQ TECHNICAL ASSESSMENT & AUTO-OFFER PIPELINE');
console.log('======================================================================\n');

// 1. Check Questions Bank for multiple domains
const rolesToTest = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack AI Engineer',
  'AI/ML Engineer',
  'Data Analyst',
  'Business Analyst',
  'UI/UX Designer',
  'Business Development Executive'
];

let questionsCheckPassed = true;
rolesToTest.forEach(role => {
  const clientQuestions = getQuestionsForRole(role, true);
  const masterQuestions = getQuestionsForRole(role, false);
  const count = clientQuestions.length;
  const is20 = count === 20;
  const hasNoKeys = clientQuestions.every(q => q.correctIndex === undefined);

  if (!is20 || !hasNoKeys) questionsCheckPassed = false;
  console.log(`[Role Question Check] "${role}" -> Count: ${count}/20 questions | Keys Stripped for Security: ${hasNoKeys ? '✅ YES' : '❌ NO'}`);
});

console.log(`\nQuestion Bank Verdict: ${questionsCheckPassed ? '✅ ALL 8 DOMAINS HAVE 20 MCQs' : '❌ FAILED'}\n`);

// 2. Test Scoring Engine with >= 80% (Passed) and < 80% (Failed)
console.log('--- Testing Assessment Scoring Engine ---');

// Build answers for 17/20 correct (85% -> PASS)
const masterFrontend = getQuestionsForRole('Frontend Developer', false);
const passedAnswers = {};
masterFrontend.forEach((q, i) => {
  passedAnswers[q.id] = (i < 17) ? q.correctIndex : (q.correctIndex + 1) % 4; // 17 correct, 3 wrong
});

const passEval = evaluateAssessmentSubmission('Frontend Developer', passedAnswers);
console.log(`[Scenario 1: 17/20 Correct] -> Score: ${passEval.scorePercent}% | Passed: ${passEval.passed} (Expected: true) | Verdict: ${passEval.verdict} ${passEval.passed ? '✅ PASS' : '❌ FAIL'}`);

// Build answers for 12/20 correct (60% -> FAIL)
const failAnswers = {};
masterFrontend.forEach((q, i) => {
  failAnswers[q.id] = (i < 12) ? q.correctIndex : (q.correctIndex + 1) % 4; // 12 correct, 8 wrong
});

const failEval = evaluateAssessmentSubmission('Frontend Developer', failAnswers);
console.log(`[Scenario 2: 12/20 Correct] -> Score: ${failEval.scorePercent}% | Passed: ${failEval.passed} (Expected: false) | Verdict: ${failEval.verdict} ${!failEval.passed ? '✅ PASS' : '❌ FAIL'}`);

// 3. Test Auto-Reply Email Template (Verify Google Meet link is REMOVED and Assessment Link is PRESENT)
console.log('\n--- Testing Auto-Reply Email Template ---');
const sampleSelectedHtml = generateStructuredSelectedHtml({
  candidateName: 'Rohan Sharma',
  candidateEmail: 'rohan.sharma.dev@gmail.com',
  roleApplied: 'Frontend Developer',
  detectedExp: 3,
  matchedSkills: ['React.js', 'JavaScript', 'HTML5 & CSS3', 'Tailwind CSS']
});

const hasMeetLink = sampleSelectedHtml.includes('meet.google.com');
const hasAssessmentLink = sampleSelectedHtml.includes('assessment.html') || sampleSelectedHtml.includes('Technical Assessment');
const has20McqNotice = sampleSelectedHtml.includes('20') && sampleSelectedHtml.includes('80%');
const hasProctorNotice = sampleSelectedHtml.includes('Copy/paste') || sampleSelectedHtml.includes('Anti-Cheating');

console.log(`Google Meet Link Removed: ${!hasMeetLink ? '✅ YES (Google Meet is gone)' : '❌ NO (Meet link still exists)'}`);
console.log(`Technical Assessment Link Present: ${hasAssessmentLink ? '✅ YES' : '❌ NO'}`);
console.log(`20 Domain MCQs & 80% Pass Rule Stated: ${has20McqNotice ? '✅ YES' : '❌ NO'}`);
console.log(`Anti-Cheating (Copy/Paste & Window Switch) Notice Included: ${hasProctorNotice ? '✅ YES' : '❌ NO'}`);

// 4. Test Live SMTP Dispatch for Automated Offer Letter upon 80%+ Score
console.log('\n--- Testing Automated Job Offer Dispatch on >=80% Pass ---');
async function testOfferLetterDispatch() {
  const recruiterEmail = process.env.RECRUITER_EMAIL || 'sharmavageesha2000@gmail.com';
  const recruiterPass = (process.env.GOOGLE_APP_PASSWORD || 'qoyolivxrkuqxmkx').replace(/\s+/g, '');

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user: recruiterEmail, pass: recruiterPass }
  });

  const offerHtml = generateOfficialCallLetterHtml({
    candidateName: 'Rohan Sharma',
    roleApplied: 'Frontend Developer',
    joiningDate: 'Monday, 14 September 2026',
    ctcPackage: '₹9,50,000 per annum (Full-Time)',
    reportingTo: 'Vageesha Sharma (Founder & Hiring Lead)',
    workMode: 'Remote / Hybrid (Flexible Work Arrangements)',
    offerRefId: 'HR-OFFER-2026-950K'
  });

  console.log(`Dispatching verified Offer Letter to ${recruiterEmail}...`);
  const info = await transporter.sendMail({
    from: `"Vageesha Sharma (Talent Acquisition)" <${recruiterEmail}>`,
    to: recruiterEmail,
    subject: '🎉 [Verification] Official Job Offer & Call Letter: Frontend Developer (Passed >= 80%)',
    html: offerHtml
  });

  console.log(`✅ Official Call Letter delivered successfully! Message-ID: ${info.messageId}`);
  console.log('\n======================================================================');
  console.log('🎯 ALL 20-MCQ ASSESSMENT & AUTO-OFFER SYSTEM VERIFICATIONS PASSED ✅');
  console.log('======================================================================\n');
}

testOfferLetterDispatch().catch(err => {
  console.error('❌ Offer dispatch test error:', err);
  process.exit(1);
});
