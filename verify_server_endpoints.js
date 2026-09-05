const express = require('express');
const { generateSessionAssessment, evaluateAssessmentSubmission, ACTIVE_ASSESSMENT_SESSIONS } = require('./assessment_questions');
const { generateOfficialCallLetterHtml, generateAssessmentOutcomeFeedbackHtml } = require('./gemini_evaluator');

async function testSubmitLogic() {
  console.log('Testing Assessment Submit API Logic...');

  // 1. Passing submission (18/20 = 90%)
  const sessionPass = generateSessionAssessment('AI/ML Engineer', {
    candidateEmail: 'aiml_pass@example.com',
    name: 'Ananya Roy'
  });
  const passData = ACTIVE_ASSESSMENT_SESSIONS.get(sessionPass.sessionId);
  const passAnswers = {};
  Object.keys(passData.answerKey).forEach((qId, i) => {
    if (i < 18) {
      passAnswers[qId] = passData.answerKey[qId];
    } else {
      passAnswers[qId] = (passData.answerKey[qId] + 1) % 4;
    }
  });

  const evalPass = evaluateAssessmentSubmission('AI/ML Engineer', passAnswers, sessionPass.sessionId);
  console.log(`[PASS TEST] Score: ${evalPass.scorePercent}%, Passed: ${evalPass.passed}`);
  if (!evalPass.passed || evalPass.scorePercent < 80) {
    throw new Error('PASS TEST failed: Expected pass >= 80%');
  }

  // 2. Failing submission (12/20 = 60%)
  const sessionFail = generateSessionAssessment('AI/ML Engineer', {
    candidateEmail: 'aiml_fail@example.com',
    name: 'Karan Mehra'
  });
  const failData = ACTIVE_ASSESSMENT_SESSIONS.get(sessionFail.sessionId);
  const failAnswers = {};
  Object.keys(failData.answerKey).forEach((qId, i) => {
    if (i < 12) {
      failAnswers[qId] = failData.answerKey[qId];
    } else {
      failAnswers[qId] = (failData.answerKey[qId] + 1) % 4;
    }
  });

  const evalFail = evaluateAssessmentSubmission('AI/ML Engineer', failAnswers, sessionFail.sessionId);
  console.log(`[FAIL TEST] Score: ${evalFail.scorePercent}%, Passed: ${evalFail.passed}`);
  if (evalFail.passed || evalFail.scorePercent >= 80) {
    throw new Error('FAIL TEST failed: Expected fail < 80%');
  }

  // Test Feedback HTML generation for failing candidate
  const failFeedback = generateAssessmentOutcomeFeedbackHtml({
    candidateName: 'Karan Mehra',
    roleApplied: 'AI/ML Engineer',
    scorePercent: evalFail.scorePercent,
    passingThreshold: 80,
    correctCount: evalFail.correctCount,
    totalQuestions: evalFail.totalQuestions,
    sectionBreakdown: evalFail.sectionBreakdown
  });

  if (!failFeedback.includes('Karan Mehra') || !failFeedback.includes('60%') || !failFeedback.includes('AI/ML Engineer')) {
    throw new Error('Fail feedback HTML generation failed');
  }

  console.log('✅ All submit and grading logic verified successfully!');
}

testSubmitLogic().catch(err => {
  console.error(err);
  process.exit(1);
});
