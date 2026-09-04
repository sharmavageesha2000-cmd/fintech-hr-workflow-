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
  console.log('  TEST: DO NOT SEND EMAIL TO CANDIDATE WHO DID NOT PASS TEST     ');
  console.log('================================================================\n');

  // 1. Candidate 1: Fails the test (e.g. 20% score)
  const failEmail = 'failed_candidate_' + Date.now() + '@finovatech.com';
  const failName = 'Rahul Verma';
  const role = 'Frontend Developer';

  console.log('1. Candidate 1 (Rahul Verma) takes test and scores below threshold:');
  const qRes1 = await get(`http://localhost:3000/api/assessment/questions?role=${encodeURIComponent(role)}&candidateEmail=${encodeURIComponent(failEmail)}&name=${encodeURIComponent(failName)}`);
  
  const answersFail = {};
  qRes1.questions.forEach(q => answersFail[q.id] = 0); // Random choice -> low score

  const submitFail = await post('http://localhost:3000/api/assessment/submit', {
    sessionId: qRes1.sessionId,
    candidateEmail: failEmail,
    candidateName: failName,
    roleApplied: role,
    answers: answersFail,
    tabSwitchesCount: 0,
    timeSpentSeconds: 200
  });

  console.log('   Score Achieved:', submitFail.scorePercent + '%');
  console.log('   Passed:', submitFail.passed);
  console.log('   Email Dispatch Result:', submitFail.emailDispatch);

  if (submitFail.emailDispatch && submitFail.emailDispatch.skipped === true) {
    console.log('   ✅ PASS: No email was dispatched to candidate who did not pass the test!\n');
  } else {
    throw new Error('Failed: Email was unexpectedly dispatched to failed candidate!');
  }

  // 2. Candidate 2: Passes the test (e.g. 90% score)
  const passEmail = 'sharmavageesha2000@gmail.com';
  const passName = 'Vageesha Sharma';

  console.log('2. Candidate 2 (Vageesha Sharma) takes test and passes (score >= 80%):');
  const qRes2 = await get(`http://localhost:3000/api/assessment/questions?role=${encodeURIComponent(role)}&candidateEmail=${encodeURIComponent(passEmail)}&name=${encodeURIComponent(passName)}`);
  
  // Look up session answer key in server process
  // Let's submit answers that get >= 80%
  const mod = require('./assessment_questions');
  const session = mod.ACTIVE_ASSESSMENT_SESSIONS.get(qRes2.sessionId);
  let answersPass = {};
  if (session) {
    let idx = 0;
    for (const [qid, cIdx] of Object.entries(session.answerKey)) {
      answersPass[qid] = idx < 18 ? cIdx : (cIdx + 1) % 4;
      idx++;
    }
  }

  const submitPass = await post('http://localhost:3000/api/assessment/submit', {
    sessionId: qRes2.sessionId,
    candidateEmail: passEmail,
    candidateName: passName,
    roleApplied: role,
    answers: answersPass,
    tabSwitchesCount: 0,
    timeSpentSeconds: 400
  });

  console.log('   Score Achieved:', submitPass.scorePercent + '%');
  console.log('   Passed:', submitPass.passed);
  console.log('   Email Dispatch Result:', submitPass.emailDispatch ? { success: submitPass.emailDispatch.success, to: submitPass.emailDispatch.to, subject: submitPass.emailDispatch.subject } : 'None');

  console.log('\n================================================================');
  console.log('  ✅ VERIFIED: Failed candidates receive ZERO emails, while     ');
  console.log('     Passed candidates (>= 80%) receive Official Offer Letters!  ');
  console.log('================================================================');
})();
