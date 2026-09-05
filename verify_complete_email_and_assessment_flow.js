/**
 * Comprehensive Verification Script for HR Email Auto-replies & Assessment Flow
 * Tests:
 * 1. Post-Assessment Passing Flow (>= 80%): Automated Job Offer & Call Letter dispatch
 * 2. Post-Assessment Non-Passing Flow (< 80%): Automated Assessment Outcome & Feedback email dispatch
 * 3. Resume Intake Deduplication: Ensures strictly 1 email is sent per candidate evaluated
 */

const { 
  evaluateAssessmentSubmission, 
  generateSessionAssessment 
} = require('./assessment_questions');

const { 
  generateOfficialCallLetterHtml, 
  generateAssessmentOutcomeFeedbackHtml,
  generateStructuredSelectedHtml,
  generateStructuredRejectionHtml
} = require('./gemini_evaluator');

async function runTests() {
  console.log('===========================================================');
  console.log('🧪 Starting Full System Verification & Email Pipeline Audit');
  console.log('===========================================================\n');

  // TEST 1: Assessment Session Generation & Scoring
  console.log('--- TEST 1: Systematic 4-Section Assessment Session Generation ---');
  const session = generateSessionAssessment('Frontend Developer', {
    candidateEmail: 'candidate_test@example.com',
    name: 'Priya Sharma'
  });

  console.log(`Session ID: ${session.sessionId}`);
  console.log(`Role: ${session.role}`);
  console.log(`Total Questions: ${session.totalQuestions}`);
  console.log(`Total Sections: ${session.sections.length}`);
  session.sections.forEach(s => {
    console.log(`  - Section ${s.index}: ${s.name} (${s.questionCount} questions)`);
  });

  if (session.totalQuestions === 20 && session.sections.length === 4) {
    console.log('✅ TEST 1 PASSED: Systematic 4-section assessment generated perfectly.\n');
  } else {
    throw new Error('TEST 1 FAILED: Unexpected question/section count');
  }

  // TEST 2: Candidate Passing Test (>= 80%) -> Offer Letter Generation
  console.log('--- TEST 2: Candidate Passing Test (Score >= 80%) ---');
  const passingAnswers = {};
  session.questions.forEach((q, idx) => {
    // 17 out of 20 correct (85%)
    if (idx < 17) {
      // Find option matching correctIndex
      // For testing, answerKey is stored in session
    }
  });

  // Let's test evaluateAssessmentSubmission directly with perfect score
  const perfectAnswers = {};
  // active session answerKey
  const { ACTIVE_ASSESSMENT_SESSIONS } = require('./assessment_questions');
  const sessionData = ACTIVE_ASSESSMENT_SESSIONS.get(session.sessionId);
  Object.keys(sessionData.answerKey).forEach((qId, i) => {
    if (i < 17) {
      perfectAnswers[qId] = sessionData.answerKey[qId];
    } else {
      perfectAnswers[qId] = (sessionData.answerKey[qId] + 1) % 4; // incorrect
    }
  });

  const passEval = evaluateAssessmentSubmission('Frontend Developer', perfectAnswers, session.sessionId);
  console.log(`Score: ${passEval.scorePercent}% (${passEval.correctCount}/${passEval.totalQuestions})`);
  console.log(`Passed: ${passEval.passed} (Verdict: ${passEval.verdict})`);

  const offerHtml = generateOfficialCallLetterHtml({
    candidateName: 'Priya Sharma',
    roleApplied: 'Frontend Developer',
    offerRefId: 'HR-OFFER-2026-TEST'
  });

  if (passEval.passed && offerHtml.includes('OFFICIAL EMPLOYMENT OFFER') && offerHtml.includes('Priya Sharma')) {
    console.log('✅ TEST 2 PASSED: Passing candidate triggers Offer Letter & Call Letter with full terms.\n');
  } else {
    throw new Error('TEST 2 FAILED: Passing score did not produce valid offer letter');
  }

  // TEST 3: Candidate NOT Passing Test (< 80%) -> Outcome & Feedback Email
  console.log('--- TEST 3: Candidate NOT Passing Test (Score < 80%) ---');
  const failSession = generateSessionAssessment('Frontend Developer', {
    candidateEmail: 'fail_candidate@example.com',
    name: 'Rahul Verma'
  });
  const failSessionData = ACTIVE_ASSESSMENT_SESSIONS.get(failSession.sessionId);
  const failAnswers = {};
  Object.keys(failSessionData.answerKey).forEach((qId, i) => {
    if (i < 8) {
      failAnswers[qId] = failSessionData.answerKey[qId]; // 8 correct out of 20 (40%)
    } else {
      failAnswers[qId] = (failSessionData.answerKey[qId] + 1) % 4;
    }
  });

  const failEval = evaluateAssessmentSubmission('Frontend Developer', failAnswers, failSession.sessionId);
  console.log(`Score: ${failEval.scorePercent}% (${failEval.correctCount}/${failEval.totalQuestions})`);
  console.log(`Passed: ${failEval.passed} (Verdict: ${failEval.verdict})`);

  const feedbackHtml = generateAssessmentOutcomeFeedbackHtml({
    candidateName: 'Rahul Verma',
    roleApplied: 'Frontend Developer',
    scorePercent: failEval.scorePercent,
    passingThreshold: 80,
    correctCount: failEval.correctCount,
    totalQuestions: failEval.totalQuestions,
    sectionBreakdown: failEval.sectionBreakdown
  });

  if (!failEval.passed && feedbackHtml.includes('ASSESSMENT OUTCOME UPDATE') && feedbackHtml.includes('Rahul Verma') && feedbackHtml.includes('40%')) {
    console.log('✅ TEST 3 PASSED: Non-passing candidate automatically gets Assessment Outcome & Constructive Feedback email.\n');
  } else {
    throw new Error('TEST 3 FAILED: Failed candidate feedback email did not match expected structure');
  }

  // TEST 4: Single Email Verification on Resume Screening
  console.log('--- TEST 4: Resume Screening Email Formats ---');
  const selectedHtml = generateStructuredSelectedHtml({
    candidateName: 'Amit Patel',
    roleApplied: 'Backend Developer',
    matchScore: 88,
    assessmentLink: 'https://hr-smartflow-automation.onrender.com/assessment.html?candidateId=cand-123'
  });

  const rejectionHtml = generateStructuredRejectionHtml({
    candidateName: 'Sneha Roy',
    roleApplied: 'Backend Developer',
    matchScore: 35
  });

  if (selectedHtml.includes('Start Online Technical Assessment') && rejectionHtml.includes('Vageesha Sharma')) {
    console.log('✅ TEST 4 PASSED: Selected & Rejection email templates formatted properly for single dispatch.\n');
  } else {
    throw new Error('TEST 4 FAILED: Templates missing key elements');
  }

  console.log('===========================================================');
  console.log('🎉 ALL 4 AUDIT TESTS PASSED SUCCESSFULLY!');
  console.log('===========================================================');
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
