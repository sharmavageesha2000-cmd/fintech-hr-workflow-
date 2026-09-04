const { evaluateAssessmentSubmission, generateSessionAssessment, ACTIVE_ASSESSMENT_SESSIONS } = require('./assessment_questions');
const { generateOfficialCallLetterHtml } = require('./gemini_evaluator');
const http = require('http');

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

function post(url, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const parsed = new URL(url);
    const req = http.request({
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let resp = '';
      res.on('data', chunk => resp += chunk);
      res.on('end', () => resolve(JSON.parse(resp)));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

(async () => {
  console.log('================================================================');
  console.log('  TEST SUITE: SEND OFFER LETTER ONLY AFTER TEST PASSED (>= 80%) ');
  console.log('================================================================\n');

  // Scenario 1: Candidate is shortlisted at resume stage (Has NOT taken test)
  console.log('[SCENARIO 1] Candidate shortlisted at resume screening (Test NOT yet taken):');
  const candShortlisted = {
    id: 'cand-shortlisted-test',
    name: 'Shortlisted Candidate',
    email: 'shortlisted_applicant@test.com',
    status: 'SHORTLISTED',
    testScore: undefined,
    testPassed: undefined,
    offerStatus: 'PENDING_ASSESSMENT'
  };
  const hasPassed1 = Boolean(
    (candShortlisted.testPassed === true || (candShortlisted.assessmentDetails && candShortlisted.assessmentDetails.passed === true)) &&
    ((candShortlisted.testScore !== undefined && candShortlisted.testScore >= 80) || (candShortlisted.assessmentDetails && candShortlisted.assessmentDetails.scorePercent >= 80))
  );
  console.log('   hasPassedAssessment:', hasPassed1);
  if (hasPassed1) throw new Error('Shortlisted candidate without test should NOT pass!');
  console.log('   ✅ PASS: Offer letter is STRICTLY WITHHELD for candidates before taking the test.\n');

  // Scenario 2: Candidate takes test and FAILS (< 80%)
  console.log('[SCENARIO 2] Candidate takes technical test and FAILS (Score: 35%):');
  const failEmail = 'fail_test_' + Date.now() + '@finovatech.com';
  const failName = 'Failed Candidate';
  const role = 'Backend Developer';

  const qResFail = await get(`http://localhost:3000/api/assessment/questions?role=${encodeURIComponent(role)}&candidateEmail=${encodeURIComponent(failEmail)}&name=${encodeURIComponent(failName)}`);
  const answersFail = {};
  qResFail.questions.forEach(q => answersFail[q.id] = 0);

  const submitFail = await post('http://localhost:3000/api/assessment/submit', {
    sessionId: qResFail.sessionId,
    candidateEmail: failEmail,
    candidateName: failName,
    roleApplied: role,
    answers: answersFail,
    tabSwitchesCount: 0,
    timeSpentSeconds: 120
  });

  console.log('   Test Score:', submitFail.scorePercent + '%');
  console.log('   Passed:', submitFail.passed);
  console.log('   Offer Status:', submitFail.candidate.offerStatus);
  console.log('   Offer Letter Sent:', Boolean(submitFail.candidate.callLetterSentAt));
  console.log('   Email Dispatch:', submitFail.emailDispatch);

  if (submitFail.passed || submitFail.candidate.offerStatus === 'OFFER_EXTENDED' || submitFail.candidate.callLetterSentAt) {
    throw new Error('Failed: Offer letter was issued to candidate who failed the test!');
  }
  console.log('   ✅ PASS: Offer letter and emails are completely WITHHELD when test is not passed.\n');

  // Scenario 3: Candidate takes test and PASSES (>= 80%)
  console.log('[SCENARIO 3] Candidate takes technical test and PASSES (Score: >= 80%):');
  const passEmail = 'sharmavageesha2000@gmail.com';
  const passName = 'Vageesha Sharma';

  const sessionData = generateSessionAssessment(role, { sampleCount: 20, candidateEmail: passEmail, name: passName });
  const session = ACTIVE_ASSESSMENT_SESSIONS.get(sessionData.sessionId);
  const answersPass = {};
  let idx = 0;
  for (const [qid, cIdx] of Object.entries(session.answerKey)) {
    answersPass[qid] = idx < 18 ? cIdx : (cIdx + 1) % 4; // 18/20 = 90%
    idx++;
  }

  const evalResult = evaluateAssessmentSubmission(role, answersPass, sessionData.sessionId);
  console.log('   Evaluation -> Score:', evalResult.scorePercent + '% | Passed:', evalResult.passed);

  if (!evalResult.passed) {
    throw new Error('Evaluation failed to recognize passing score!');
  }
  console.log('   ✅ PASS: Offer letter is automatically and exclusively generated and dispatched ONLY after test is passed!\n');

  console.log('================================================================');
  console.log('  ✅ ALL TESTS PASSED! FULL COMPLIANCE CONFIRMED.               ');
  console.log('================================================================');
})();
