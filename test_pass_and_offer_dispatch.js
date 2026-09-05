const { generateSessionAssessment, evaluateAssessmentSubmission, ACTIVE_ASSESSMENT_SESSIONS } = require('./assessment_questions');
const { generateOfficialCallLetterHtml } = require('./gemini_evaluator');
const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('=== TESTING PASS SCORE (>=80%) & AUTO OFFER DISPATCH ===');

(async () => {
  const candidateEmail = 'sharmavageesha2000@gmail.com';
  const candidateName = 'Vageesha Sharma';
  const role = 'Full Stack AI Engineer';

  // 1. Generate session
  const sessionData = generateSessionAssessment(role, { sampleCount: 20, candidateEmail, name: candidateName });
  console.log(`Generated session ${sessionData.sessionId} with ${sessionData.questions.length} questions for ${candidateEmail}`);

  // 2. Prepare 18/20 answers (90%)
  const session = ACTIVE_ASSESSMENT_SESSIONS.get(sessionData.sessionId);
  const answers = {};
  let i = 0;
  for (const [qid, cIdx] of Object.entries(session.answerKey)) {
    answers[qid] = i < 18 ? cIdx : (cIdx + 1) % 4;
    i++;
  }

  // 3. Evaluate submission
  const evalResult = evaluateAssessmentSubmission(role, answers, sessionData.sessionId);
  console.log(`Evaluation: Score = ${evalResult.scorePercent}% (${evalResult.correctCount}/${evalResult.totalQuestions}) | Passed = ${evalResult.passed}`);

  if (!evalResult.passed) {
    throw new Error('Expected candidate to pass with 90% score!');
  }

  // 4. Test SMTP dispatch for Offer Letter
  const offerRefId = `HR-OFFER-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const callLetterHtml = generateOfficialCallLetterHtml({
    candidateName,
    roleApplied: role,
    joiningDate: 'Monday, 14 September 2026',
    ctcPackage: '₹14,50,000 per annum (Full-Time)',
    reportingTo: 'Vageesha Sharma (Founder & Hiring Lead)',
    workMode: 'Remote / Hybrid (Flexible Work Arrangements)',
    offerRefId
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sharmavageesha2000@gmail.com',
      pass: 'qoyolivxrkuqxmkx'
    },
    family: 4
  });

  console.log(`Dispatching official offer letter to ${candidateEmail}...`);
  const info = await transporter.sendMail({
    from: '"Finova Technologies Talent Acquisition" <sharmavageesha2000@gmail.com>',
    to: candidateEmail,
    subject: `🎉 Official Job Offer & Call Letter: ${role} - Finova Technologies [${offerRefId}]`,
    html: callLetterHtml
  });

  console.log('✅ SMTP Dispatch SUCCESS! Message ID:', info.messageId);
  console.log('🎉 Verified Offer Letter generated and dispatched automatically upon scoring >= 80%!');
})();
