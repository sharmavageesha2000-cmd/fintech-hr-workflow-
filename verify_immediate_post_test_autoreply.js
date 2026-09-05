const http = require('http');
const { ACTIVE_ASSESSMENT_SESSIONS } = require('./assessment_questions');

function post(url, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const parsed = new URL(url);
    const req = http.request({
      hostname: parsed.hostname,
      port: parsed.port || 3000,
      path: parsed.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let resp = '';
      res.on('data', chunk => resp += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(resp));
        } catch (e) {
          resolve({ raw: resp });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ raw: data });
        }
      });
    }).on('error', reject);
  });
}

(async () => {
  console.log('================================================================');
  console.log('  TEST: VERIFYING IMMEDIATE POST-ASSESSMENT AUTOREPLY VIA SMTP  ');
  console.log('================================================================\n');

  const testEmail = 'paliwalrishu2000@gmail.com'; // Recipient email for live SMTP check

  // ----------------------------------------------------------------
  // Scenario 1: Candidate Passes Assessment (Score >= 80% -> Offer Letter)
  // ----------------------------------------------------------------
  console.log('Scenario 1: Candidate Passes Assessment (Score 100%) -> Official Job Offer & Call Letter');
  const passCandId = 'cand-live-pass-' + Date.now();
  const passCandName = 'Rohan Sharma';
  const passCandRole = 'Full Stack AI Engineer';

  // Step 1a: Fetch questions
  const qUrl = `http://localhost:3000/api/assessment/questions?role=${encodeURIComponent(passCandRole)}&candidateId=${encodeURIComponent(passCandId)}&candidateEmail=${encodeURIComponent(testEmail)}&name=${encodeURIComponent(passCandName)}`;
  const questionsRes = await get(qUrl);
  console.log(`  - Questions loaded: ${questionsRes.questions?.length} MCQs (Session ID: ${questionsRes.sessionId})`);

  // Step 1b: Submit with 100% correct answers by finding correct option text in bank
  const { ROLE_QUESTIONS_BANK, normalizeRoleToBankKey } = require('./assessment_questions');
  const bankKey = normalizeRoleToBankKey(passCandRole);
  const fullStackBank = ROLE_QUESTIONS_BANK[bankKey] || [];
  const passingAnswers = {};
  
  questionsRes.questions.forEach(q => {
    const bankQ = fullStackBank.find(item => item.id === q.id);
    if (bankQ) {
      const correctText = bankQ.options[bankQ.correctIndex || 0];
      const matchingIdx = q.options.indexOf(correctText);
      passingAnswers[q.id] = matchingIdx !== -1 ? matchingIdx : 0;
    } else {
      passingAnswers[q.id] = 0;
    }
  });

  const passSubmitRes = await post('http://localhost:3000/api/assessment/submit', {
    candidateId: passCandId,
    candidateName: passCandName,
    candidateEmail: testEmail,
    roleApplied: passCandRole,
    sessionId: questionsRes.sessionId,
    answers: passingAnswers,
    tabSwitchesCount: 0,
    timeSpentSeconds: 650
  });

  console.log(`  - Submit Result -> Score: ${passSubmitRes.scorePercent}%, Passed: ${passSubmitRes.passed}`);
  console.log(`  - Email Dispatch -> Success: ${passSubmitRes.emailDispatch?.success}, DeliveredTo: ${passSubmitRes.deliveredTo}`);
  console.log(`  - Message ID: ${passSubmitRes.emailDispatch?.messageId}`);

  if (!passSubmitRes.passed || !passSubmitRes.emailDispatch?.success) {
    throw new Error('FAILED Scenario 1: Passing candidate did not receive immediate Offer Letter email!');
  }
  console.log('  ✅ PASS Scenario 1: Official Job Offer & Call Letter immediately sent via SMTP!\n');

  // ----------------------------------------------------------------
  // Scenario 2: Candidate Scores < 80% -> Performance Feedback Email
  // ----------------------------------------------------------------
  console.log('Scenario 2: Candidate Scores < 80% (Score 50%) -> Assessment Outcome & Feedback Email');
  const failCandId = 'cand-live-feedback-' + Date.now();
  const failCandName = 'Priya Verma';
  const failCandRole = 'Data Analyst';

  const qUrl2 = `http://localhost:3000/api/assessment/questions?role=${encodeURIComponent(failCandRole)}&candidateId=${encodeURIComponent(failCandId)}&candidateEmail=${encodeURIComponent(testEmail)}&name=${encodeURIComponent(failCandName)}`;
  const questionsRes2 = await get(qUrl2);

  const dataBankKey = normalizeRoleToBankKey(failCandRole);
  const dataBank = ROLE_QUESTIONS_BANK[dataBankKey] || [];
  const failAnswers = {};

  questionsRes2.questions.forEach((q, idx) => {
    const bankQ = dataBank.find(item => item.id === q.id);
    if (bankQ) {
      const correctText = bankQ.options[bankQ.correctIndex || 0];
      const correctOptIdx = q.options.indexOf(correctText);
      // 13 correct answers out of 20 = 65% score
      if (idx < 13) {
        failAnswers[q.id] = correctOptIdx !== -1 ? correctOptIdx : 0;
      } else {
        failAnswers[q.id] = correctOptIdx !== -1 ? (correctOptIdx + 1) % 4 : 1;
      }
    } else {
      failAnswers[q.id] = idx < 13 ? 0 : 1;
    }
  });

  const failSubmitRes = await post('http://localhost:3000/api/assessment/submit', {
    candidateId: failCandId,
    candidateName: failCandName,
    candidateEmail: testEmail,
    roleApplied: failCandRole,
    sessionId: questionsRes2.sessionId,
    answers: failAnswers,
    tabSwitchesCount: 0,
    timeSpentSeconds: 500
  });

  console.log(`  - Submit Result -> Score: ${failSubmitRes.scorePercent}%, Passed: ${failSubmitRes.passed}`);
  console.log(`  - Email Dispatch -> Success: ${failSubmitRes.emailDispatch?.success}, DeliveredTo: ${failSubmitRes.deliveredTo}`);
  console.log(`  - Message ID: ${failSubmitRes.emailDispatch?.messageId}`);

  if (failSubmitRes.passed || !failSubmitRes.emailDispatch?.success) {
    throw new Error('FAILED Scenario 2: Non-passing candidate did not receive immediate Assessment Feedback email!');
  }
  console.log('  ✅ PASS Scenario 2: Performance Feedback email immediately sent via SMTP!\n');

  // ----------------------------------------------------------------
  // Scenario 3: Verify /api/assessment/resend-outcome
  // ----------------------------------------------------------------
  console.log('Scenario 3: Verify /api/assessment/resend-outcome endpoint');
  const resendRes = await post('http://localhost:3000/api/assessment/resend-outcome', {
    candidateId: passCandId,
    candidateEmail: testEmail,
    candidateName: passCandName,
    roleApplied: passCandRole,
    scorePercent: 90
  });

  console.log(`  - Resend Result -> Success: ${resendRes.success}, DeliveredTo: ${resendRes.deliveredTo}`);
  console.log(`  - Message ID: ${resendRes.emailDispatch?.messageId}`);
  if (!resendRes.success) {
    throw new Error('FAILED Scenario 3: Resend outcome endpoint failed!');
  }
  console.log('  ✅ PASS Scenario 3: Resend outcome successfully delivered via SMTP!\n');

  console.log('================================================================');
  console.log('  🎉 ALL POST-TEST AUTOREPLY TESTS PASSED SUCCESSFULLY!          ');
  console.log('  Immediate email delivery via SMTP is 100% verified.            ');
  console.log('================================================================');
})();
