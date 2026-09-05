const { 
  generateSessionAssessment, 
  evaluateAssessmentSubmission,
  ROLE_QUESTIONS_BANK 
} = require('./assessment_questions');

console.log('--- 1. Testing Session Generation & Shuffling ---');
const sess1 = generateSessionAssessment('Frontend Developer', { sampleCount: 20 });
const sess2 = generateSessionAssessment('Frontend Developer', { sampleCount: 20 });

console.log('Session 1 ID:', sess1.sessionId);
console.log('Session 2 ID:', sess2.sessionId);
console.log('Session 1 Q IDs:', sess1.questions.map(q => q.id).slice(0, 10));
console.log('Session 2 Q IDs:', sess2.questions.map(q => q.id).slice(0, 10));

// Ensure they are not identical sequences
const ids1 = sess1.questions.map(q => q.id).join(',');
const ids2 = sess2.questions.map(q => q.id).join(',');
console.log('Are Question Sequences Identical?', ids1 === ids2 ? 'YES (Error)' : 'NO (Successfully randomized!)');

console.log('\n--- 2. Testing 100% Correct Submission against Session 1 ---');
const { ACTIVE_ASSESSMENT_SESSIONS } = require('./assessment_questions');
const sessionData = ACTIVE_ASSESSMENT_SESSIONS.get(sess1.sessionId);

const perfectAnswers = {};
sess1.questions.forEach(q => {
  perfectAnswers[q.id] = sessionData.answerKey[q.id];
});

const eval100 = evaluateAssessmentSubmission('Frontend Developer', perfectAnswers, sess1.sessionId);
console.log(`Perfect Score Result: ${eval100.scorePercent}% (${eval100.correctCount}/${eval100.totalQuestions}) | Passed: ${eval100.passed} | Verdict: ${eval100.verdict}`);

console.log('\n--- 3. Testing 85% Correct Submission against Session 2 ---');
const sessionData2 = ACTIVE_ASSESSMENT_SESSIONS.get(sess2.sessionId);
const answers85 = {};
sess2.questions.forEach((q, idx) => {
  const correct = sessionData2.answerKey[q.id];
  if (idx < 17) {
    answers85[q.id] = correct; // 17 correct
  } else {
    answers85[q.id] = (correct + 1) % 4; // 3 incorrect
  }
});

const eval85 = evaluateAssessmentSubmission('Frontend Developer', answers85, sess2.sessionId);
console.log(`85% Score Result: ${eval85.scorePercent}% (${eval85.correctCount}/${eval85.totalQuestions}) | Passed: ${eval85.passed} | Verdict: ${eval85.verdict}`);

console.log('\n--- 4. Checking Correct Option Index Distribution across All Roles ---');
const roles = Object.keys(ROLE_QUESTIONS_BANK);
roles.forEach(role => {
  const sess = generateSessionAssessment(role, { sampleCount: 20 });
  const sessObj = ACTIVE_ASSESSMENT_SESSIONS.get(sess.sessionId);
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  Object.values(sessObj.answerKey).forEach(idx => {
    const letter = ['A', 'B', 'C', 'D'][idx];
    counts[letter] = (counts[letter] || 0) + 1;
  });
  console.log(`Role "${role}" Option Distribution: A:${counts.A}, B:${counts.B}, C:${counts.C}, D:${counts.D}`);
});
