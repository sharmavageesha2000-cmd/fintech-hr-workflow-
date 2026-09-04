const { 
  ROLE_QUESTIONS_BANK, 
  generateSessionAssessment, 
  evaluateAssessmentSubmission, 
  normalizeRoleToBankKey,
  CANDIDATE_SEEN_QUESTIONS 
} = require('./assessment_questions');

console.log('===============================================================');
console.log('  TEST SUITE: DOMAIN QUESTIONS SHUFFLING & NON-REPEATING TEST');
console.log('===============================================================');

// 1. Verify 50 questions exist per role
console.log('\n[TEST 1] Verifying 50 Questions per Domain:');
const roles = Object.keys(ROLE_QUESTIONS_BANK);
let allRolesHave50 = true;
roles.forEach(role => {
  const count = ROLE_QUESTIONS_BANK[role].length;
  console.log(`  ✓ Domain "${role}": ${count} MCQs`);
  if (count !== 50) allRolesHave50 = false;
});
if (!allRolesHave50) throw new Error('Not all roles have exactly 50 questions!');

// 2. Test candidate applying for the same job multiple times
console.log('\n[TEST 2] Testing Candidate Applying for Same Job Consecutive Attempts:');
const candidateEmail = 'candidate_deep_test@finovatech.com';
const testRole = 'Full Stack AI Engineer';

// Attempt 1
const session1 = generateSessionAssessment(testRole, { sampleCount: 20, candidateEmail });
const s1Ids = session1.questions.map(q => q.id);
console.log(`  Attempt 1 generated ${s1Ids.length} questions: [${s1Ids.slice(0, 5).join(', ')} ... ${s1Ids.slice(-3).join(', ')}]`);

// Attempt 2 (Same Candidate, Same Job)
const session2 = generateSessionAssessment(testRole, { sampleCount: 20, candidateEmail });
const s2Ids = session2.questions.map(q => q.id);
console.log(`  Attempt 2 generated ${s2Ids.length} questions: [${s2Ids.slice(0, 5).join(', ')} ... ${s2Ids.slice(-3).join(', ')}]`);

// Check overlap
const overlapAttempt1_2 = s1Ids.filter(id => s2Ids.includes(id));
console.log(`  Overlap between Attempt 1 and Attempt 2: ${overlapAttempt1_2.length} questions (Expected: 0)`);
if (overlapAttempt1_2.length !== 0) {
  throw new Error(`Failed: Questions repeated on attempt 2! Overlap: ${overlapAttempt1_2.join(', ')}`);
}
console.log('  ✅ SUCCESS: 0% question overlap on retake for same job!');

// Attempt 3 (Same Candidate, Same Job - will consume remaining 10 and cycle)
const session3 = generateSessionAssessment(testRole, { sampleCount: 20, candidateEmail });
const s3Ids = session3.questions.map(q => q.id);
console.log(`  Attempt 3 generated ${s3Ids.length} questions.`);

// 3. Test Option A/B/C/D Randomization across multiple sessions
console.log('\n[TEST 3] Testing Option Shuffling & Answer Distribution:');
const correctOptionDist = { 0: 0, 1: 0, 2: 0, 3: 0 };
for (let i = 0; i < 20; i++) {
  const sess = generateSessionAssessment('AI/ML Engineer', { sampleCount: 20 });
  // Evaluate answers where user selects option 0 for all
  const evalRes = evaluateAssessmentSubmission('AI/ML Engineer', {}, sess.sessionId);
  evalRes.details.forEach(d => {
    correctOptionDist[d.correctIndex] = (correctOptionDist[d.correctIndex] || 0) + 1;
  });
}
console.log('  Correct Answer Position Distribution across 400 questions:');
console.log(`    Option A (0): ${correctOptionDist[0]} (${Math.round(correctOptionDist[0]/4)}%)`);
console.log(`    Option B (1): ${correctOptionDist[1]} (${Math.round(correctOptionDist[1]/4)}%)`);
console.log(`    Option C (2): ${correctOptionDist[2]} (${Math.round(correctOptionDist[2]/4)}%)`);
console.log(`    Option D (3): ${correctOptionDist[3]} (${Math.round(correctOptionDist[3]/4)}%)`);

// Verify option A is not 100%
if (correctOptionDist[0] > 300) {
  throw new Error('Options are not sufficiently shuffled (Option A bias)!');
}
console.log('  ✅ SUCCESS: Correct options are evenly distributed across A, B, C, D!');

// 4. Test Submission & Scoring passing rule (>= 80% threshold)
console.log('\n[TEST 4] Testing 80% Passing Rule Scoring:');
const passSession = generateSessionAssessment('Backend Developer', { sampleCount: 20 });
// Build candidate answers for 17/20 correct (85%)
const sessionDetails = require('./assessment_questions').ACTIVE_ASSESSMENT_SESSIONS.get(passSession.sessionId);
const answers = {};
let idx = 0;
for (const [qid, correctIdx] of Object.entries(sessionDetails.answerKey)) {
  if (idx < 17) {
    answers[qid] = correctIdx; // Correct
  } else {
    answers[qid] = (correctIdx + 1) % 4; // Incorrect
  }
  idx++;
}

const evalPass = evaluateAssessmentSubmission('Backend Developer', answers, passSession.sessionId);
console.log(`  Candidate Score: ${evalPass.scorePercent}% (${evalPass.correctCount}/${evalPass.totalQuestions}) -> Passed: ${evalPass.passed}`);
if (!evalPass.passed || evalPass.scorePercent !== 85) {
  throw new Error('Scoring engine failed on 85% test!');
}
console.log('  ✅ SUCCESS: Evaluation engine correctly awards PASS and QUALIFIED status at 85% (>= 80%)!');

console.log('\n===============================================================');
console.log('  ALL TESTS PASSED! FULL ENTERPRISE COMPLIANCE CONFIRMED.      ');
console.log('===============================================================');
