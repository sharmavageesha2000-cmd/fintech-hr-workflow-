/**
 * Comprehensive Verification Suite: Guaranteed Automated Email Dispatch for Pass (>=80%) & Fail (<80%)
 */
const http = require('http');
const { ACTIVE_ASSESSMENT_SESSIONS } = require('./assessment_questions');

function makeRequest(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const reqOptions = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + (parsed.search || ''),
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(typeof body === 'string' ? body : JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('===============================================================');
  console.log('  TEST SUITE: GUARANTEED AUTOMATED EMAIL DISPATCH (PASS & FAIL)');
  console.log('===============================================================\n');

  const testEmail = 'sharmavageesha2000@gmail.com';

  // -------------------------------------------------------------------------
  // TEST 1: Passing Candidate (90% >= 80%) -> MUST Auto-Dispatch Offer Letter
  // -------------------------------------------------------------------------
  console.log('--- TEST 1: Passing Candidate Submission (>=80%) ---');
  const sessionPassRes = await makeRequest('http://localhost:3000/api/assessment/questions?role=Frontend%20Developer');
  const passSessionId = sessionPassRes.data.sessionId;
  const passQuestions = sessionPassRes.data.questions;
  console.log(`Generated session: ${passSessionId} with ${passQuestions.length} questions.`);

  const { ROLE_QUESTIONS_BANK, normalizeRoleToBankKey } = require('./assessment_questions');
  const bankKey = normalizeRoleToBankKey('Frontend Developer');
  const roleBank = ROLE_QUESTIONS_BANK[bankKey] || [];

  // Answer 18 out of 20 correctly (90%)
  const passAnswers = {};
  passQuestions.forEach((q, idx) => {
    const bankQ = roleBank.find(item => item.id === q.id);
    let correctIdx = 0;
    if (bankQ) {
      const correctText = bankQ.options[bankQ.correctIndex || 0];
      const matchPos = q.options.indexOf(correctText);
      correctIdx = matchPos !== -1 ? matchPos : 0;
    }
    if (idx < 18) {
      passAnswers[q.id] = correctIdx;
    } else {
      passAnswers[q.id] = (correctIdx + 1) % 4;
    }
  });

  const passCandId = `cand-pass-test-${Date.now()}`;
  const passSubmitPayload = {
    candidateId: passCandId,
    candidateName: 'Aarav Mehta',
    candidateEmail: testEmail,
    roleApplied: 'Frontend Developer',
    sessionId: passSessionId,
    answers: passAnswers,
    tabSwitchesCount: 0,
    timeSpentSeconds: 420,
    forcedByViolation: false
  };

  console.log('Submitting passing assessment...');
  const passRes = await makeRequest('http://localhost:3000/api/assessment/submit', { method: 'POST' }, passSubmitPayload);
  console.log('Passing Submit Result:', {
    success: passRes.data.success,
    scorePercent: passRes.data.scorePercent,
    passed: passRes.data.passed,
    deliveredTo: passRes.data.deliveredTo,
    emailSuccess: passRes.data.emailDispatch?.success,
    messageId: passRes.data.emailDispatch?.messageId
  });

  if (!passRes.data.passed) {
    throw new Error('FAILED: Expected candidate to pass with 90%!');
  }
  if (!passRes.data.emailDispatch?.success) {
    throw new Error('FAILED: Expected offer letter email dispatch to succeed!');
  }
  console.log('✅ TEST 1 PASSED: Offer Letter automatically sent to passed candidate!\n');

  // -------------------------------------------------------------------------
  // TEST 2: Non-Passing Candidate (40% < 80%) -> MUST Auto-Dispatch Feedback Email
  // -------------------------------------------------------------------------
  console.log('--- TEST 2: Non-Passing Candidate Submission (<80%) ---');
  const sessionFailRes = await makeRequest('http://localhost:3000/api/assessment/questions?role=Frontend%20Developer');
  const failSessionId = sessionFailRes.data.sessionId;
  const failQuestions = sessionFailRes.data.questions;
  console.log(`Generated session: ${failSessionId} with ${failQuestions.length} questions.`);

  // Answer 6 out of 20 correctly (30%)
  const failAnswers = {};
  failQuestions.forEach((q, idx) => {
    const bankQ = roleBank.find(item => item.id === q.id);
    let correctIdx = 0;
    if (bankQ) {
      const correctText = bankQ.options[bankQ.correctIndex || 0];
      const matchPos = q.options.indexOf(correctText);
      correctIdx = matchPos !== -1 ? matchPos : 0;
    }
    if (idx < 6) {
      failAnswers[q.id] = correctIdx;
    } else {
      failAnswers[q.id] = (correctIdx + 1) % 4;
    }
  });

  const failCandId = `cand-fail-test-${Date.now()}`;
  const failSubmitPayload = {
    candidateId: failCandId,
    candidateName: 'Pooja Verma',
    candidateEmail: testEmail,
    roleApplied: 'Frontend Developer',
    sessionId: failSessionId,
    answers: failAnswers,
    tabSwitchesCount: 1,
    timeSpentSeconds: 610,
    forcedByViolation: false
  };

  console.log('Submitting non-passing assessment...');
  const failRes = await makeRequest('http://localhost:3000/api/assessment/submit', { method: 'POST' }, failSubmitPayload);
  console.log('Non-Passing Submit Result:', {
    success: failRes.data.success,
    scorePercent: failRes.data.scorePercent,
    passed: failRes.data.passed,
    deliveredTo: failRes.data.deliveredTo,
    emailSuccess: failRes.data.emailDispatch?.success,
    messageId: failRes.data.emailDispatch?.messageId
  });

  if (failRes.data.passed) {
    throw new Error('FAILED: Expected candidate to fail with 40%!');
  }
  if (!failRes.data.emailDispatch?.success) {
    throw new Error('FAILED: Expected performance feedback email dispatch to succeed!');
  }
  console.log('✅ TEST 2 PASSED: Performance feedback automatically sent to non-passed candidate!\n');

  // -------------------------------------------------------------------------
  // TEST 3: Verification of 1-Time Link Lockout
  // -------------------------------------------------------------------------
  console.log('--- TEST 3: 1-Time Link Lockout Guard ---');
  const secondSubmit = await makeRequest('http://localhost:3000/api/assessment/submit', { method: 'POST' }, passSubmitPayload);
  console.log('Second submit attempt response:', secondSubmit.data);
  if (secondSubmit.data.alreadySubmitted !== true) {
    throw new Error('FAILED: Re-submission was not blocked!');
  }
  console.log('✅ TEST 3 PASSED: Assessment link strictly locked after first submission!\n');

  // -------------------------------------------------------------------------
  // TEST 4: Verification of Pending Dispatches Endpoint
  // -------------------------------------------------------------------------
  console.log('--- TEST 4: Pending Dispatches API Availability ---');
  const pendingRes = await makeRequest('http://localhost:3000/api/assessment/pending-dispatches');
  console.log('Pending dispatches count:', pendingRes.data.count);
  if (pendingRes.data.success !== true) {
    throw new Error('FAILED: pending-dispatches endpoint returned error!');
  }
  console.log('✅ TEST 4 PASSED: Pending dispatches API is operational!\n');

  console.log('===============================================================');
  console.log('  ALL AUTOMATED EMAIL DISPATCH TESTS PASSED PERFECTLY!');
  console.log('===============================================================');
}

runTests().catch(err => {
  console.error('❌ TEST RUN FAILED:', err);
  process.exit(1);
});
