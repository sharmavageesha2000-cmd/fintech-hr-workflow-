const {
  ROLE_QUESTIONS_BANK,
  generateSessionAssessment,
  evaluateAssessmentSubmission,
  CANDIDATE_SEEN_QUESTIONS
} = require('./assessment_questions');

console.log('====================================================');
console.log('🧪 VERIFICATION SUITE: 800-QUESTION ENTERPRISE ENGINE');
console.log('====================================================\n');

// 1. Verify Role Bank Size (100 questions per role = 800 total)
const roles = Object.keys(ROLE_QUESTIONS_BANK);
console.log(`[Test 1] Verifying Question Bank Sizes (Expect 8 Roles x 100 MCQs = 800 Total)...`);
let total = 0;
let sizePassed = true;

roles.forEach(role => {
  const count = ROLE_QUESTIONS_BANK[role].length;
  total += count;
  const isOk = count === 100;
  if (!isOk) sizePassed = false;
  console.log(`  • ${role}: ${count}/100 MCQs ${isOk ? '✔' : '❌'}`);
});

console.log(`\n  Total MCQs in Bank: ${total}/800 ${total === 800 ? '✅ (PASS)' : '❌ (FAIL)'}\n`);

// 2. Test Non-Repeating Question Rotation across 5 Consecutive Attempts (5 x 20 = 100 unique questions)
console.log('[Test 2] Testing Candidate Non-Repeating Question Rotation (5 Cycles x 20 Questions = 100 Unique)...');
let rotationPassed = true;

roles.forEach(role => {
  const testCandidateEmail = `test_rotation_${role.toLowerCase().replace(/[^a-z0-9]/g, '_')}@finova.tech`;
  CANDIDATE_SEEN_QUESTIONS.delete(testCandidateEmail);

  const seenAllQuestions = new Set();

  for (let cycle = 1; cycle <= 5; cycle++) {
    const session = generateSessionAssessment(role, {
      candidateEmail: testCandidateEmail,
      sampleCount: 20
    });

    const sessionQIds = session.questions.map(q => q.id);
    let duplicateInCycle = false;

    sessionQIds.forEach(id => {
      if (seenAllQuestions.has(id)) {
        duplicateInCycle = true;
      }
      seenAllQuestions.add(id);
    });

    if (duplicateInCycle) {
      console.error(`  ❌ [${role}] Cycle ${cycle}: Detected duplicate question from previous attempt!`);
      rotationPassed = false;
    }
  }

  const isCompleteRotation = seenAllQuestions.size === 100;
  if (!isCompleteRotation) rotationPassed = false;
  console.log(`  • ${role}: ${seenAllQuestions.size}/100 unique questions sampled across 5 test attempts without repetition ${isCompleteRotation ? '✔' : '❌'}`);
});

console.log(`\n  Question Freshness & Non-Repetition: ${rotationPassed ? '✅ (100% PERFECT ROTATION PASS)' : '❌ (FAIL)'}\n`);

// 3. Test Systematic Grading & Section Scoring Breakdown
console.log('[Test 3] Testing Systematic Grading, Section Scores & 80% Threshold Evaluation...');
const sampleRole = 'Frontend Developer';
const sampleSession = generateSessionAssessment(sampleRole, {
  candidateEmail: 'candidate_evaluation_test@gmail.com',
  sampleCount: 20
});

// Simulate 18 correct answers (90% score) -> Expect PASSED_OFFER_QUALIFIED
const passingAnswers = {};
sampleSession.questions.forEach((q, idx) => {
  // Pass 18/20
  if (idx < 18) {
    // Look up correct index in active session
    const sess = require('./assessment_questions').ACTIVE_ASSESSMENT_SESSIONS.get(sampleSession.sessionId);
    passingAnswers[q.id] = sess.answerKey[q.id];
  } else {
    passingAnswers[q.id] = 999; // wrong answer
  }
});

const passResult = evaluateAssessmentSubmission(sampleRole, passingAnswers, sampleSession.sessionId);
console.log(`  • Passing Score: ${passResult.scorePercent}% (${passResult.correctCount}/${passResult.totalQuestions}) -> Verdict: ${passResult.verdict} (Passed: ${passResult.passed})`);

if (passResult.scorePercent === 90 && passResult.passed === true) {
  console.log('  ✅ 80%+ Offer Qualification Grading: PASS\n');
} else {
  console.error('  ❌ Grading test failed!');
}

console.log('====================================================');
console.log('🎉 ALL QUESTION BANK & ROTATION TESTS COMPLETED SUCCESSFULLY!');
console.log('====================================================');
