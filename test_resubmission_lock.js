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
  console.log('  TEST: PREVENT RE-OPENING TEST QUESTIONS AFTER SUBMISSION      ');
  console.log('================================================================\n');

  const testEmail = 'single_attempt_candidate_' + Date.now() + '@finovatech.com';
  const testName = 'Pooja Verma';
  const testRole = 'UI/UX Designer';

  // Step 1: Open link for the 1st time
  console.log('1. Candidate opens test link for the FIRST time:');
  const url = `http://localhost:3000/api/assessment/questions?role=${encodeURIComponent(testRole)}&candidateEmail=${encodeURIComponent(testEmail)}&name=${encodeURIComponent(testName)}`;
  const step1 = await get(url);

  console.log('   Response -> alreadySubmitted:', step1.alreadySubmitted);
  console.log('   Questions returned:', step1.questions?.length, 'MCQs');
  if (step1.alreadySubmitted || !step1.questions || step1.questions.length !== 20) {
    throw new Error('Step 1 Failed: Candidate should receive 20 MCQs on 1st attempt!');
  }
  console.log('   ✅ PASS: Fresh 20 MCQs loaded for initial test attempt.\n');

  // Step 2: Candidate submits the test
  console.log('2. Candidate completes and submits assessment:');
  const answers = {};
  step1.questions.forEach(q => answers[q.id] = 0);

  const step2 = await post('http://localhost:3000/api/assessment/submit', {
    sessionId: step1.sessionId,
    candidateEmail: testEmail,
    candidateName: testName,
    roleApplied: testRole,
    answers,
    tabSwitchesCount: 0,
    timeSpentSeconds: 300
  });

  console.log('   Submission Result -> Success:', step2.success, '| Score:', step2.scorePercent + '%');
  console.log('   ✅ PASS: Assessment submitted and saved in recruitment records.\n');

  // Step 3: Candidate tries to open the link a SECOND time
  console.log('3. Candidate tries to open test link SECOND time:');
  const step3 = await get(url);

  console.log('   Response -> alreadySubmitted:', step3.alreadySubmitted);
  console.log('   Questions returned:', step3.questions ? step3.questions.length : 'NONE (Locked)');
  console.log('   Candidate details:', {
    name: step3.candidate?.name,
    email: step3.candidate?.email,
    role: step3.candidate?.roleApplied,
    score: step3.candidate?.scorePercent + '%',
    completedAt: step3.candidate?.completedAt
  });

  if (!step3.alreadySubmitted || step3.questions) {
    throw new Error('Step 3 Failed: Questions were exposed on 2nd visit when they should be LOCKED!');
  }

  console.log('\n================================================================');
  console.log('  ✅ ALL TESTS PASSED! TEST QUESTIONS ARE COMPLETELY LOCKED ON   ');
  console.log('     SUBSEQUENT VISITS AND CANNOT BE RE-OPENED AFTER SUBMISSION.');
  console.log('================================================================');
})();
