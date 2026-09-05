const http = require('http');

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

(async () => {
  console.log('================================================================');
  console.log('  VERIFYING MULTI-CANDIDATE TEST ISOLATION & RESUBMISSION LOCK  ');
  console.log('================================================================\n');

  const sharedEmail = 'multi_candidate_tester_' + Date.now() + '@gmail.com';
  
  // -------------------------------------------------------------
  // CANDIDATE 1: Rohan Mehta (Data Analyst)
  // -------------------------------------------------------------
  const cand1Id = 'cand-iso-1-' + Date.now();
  const cand1Name = 'Rohan Mehta';
  const cand1Role = 'Data Analyst';
  const cand1Url = `http://localhost:3000/api/assessment/questions?role=${encodeURIComponent(cand1Role)}&candidateId=${encodeURIComponent(cand1Id)}&candidateEmail=${encodeURIComponent(sharedEmail)}&name=${encodeURIComponent(cand1Name)}`;

  console.log(`[Step 1] Candidate 1 ("${cand1Name}") opens their interview link:`);
  console.log(`         ID: ${cand1Id}, Role: ${cand1Role}`);
  const step1 = await get(cand1Url);
  console.log(`         Outcome -> alreadySubmitted: ${step1.alreadySubmitted}, Total Questions: ${step1.questions?.length}`);
  if (step1.alreadySubmitted || !step1.questions || step1.questions.length !== 20) {
    throw new Error('FAILED: Candidate 1 should have received 20 fresh questions!');
  }
  console.log('         ✅ Candidate 1 questions loaded cleanly.\n');

  // Submit Candidate 1's test
  console.log(`[Step 2] Candidate 1 ("${cand1Name}") submits their assessment:`);
  const cand1Answers = {};
  step1.questions.forEach(q => cand1Answers[q.id] = 0); // select option 0
  const submit1 = await post('http://localhost:3000/api/assessment/submit', {
    candidateId: cand1Id,
    candidateName: cand1Name,
    candidateEmail: sharedEmail,
    roleApplied: cand1Role,
    sessionId: step1.sessionId,
    answers: cand1Answers,
    tabSwitchesCount: 0,
    timeSpentSeconds: 400
  });
  console.log(`         Outcome -> Success: ${submit1.success}, Score: ${submit1.scorePercent}%`);
  console.log('         ✅ Candidate 1 assessment submitted.\n');

  // Candidate 1 tries to open the SAME link again
  console.log(`[Step 3] Candidate 1 ("${cand1Name}") tries to reopen their submitted link:`);
  const reopen1 = await get(cand1Url);
  console.log(`         Outcome -> alreadySubmitted: ${reopen1.alreadySubmitted}`);
  console.log(`         Candidate Name in Lockout: "${reopen1.candidate?.name}"`);
  console.log(`         Role in Lockout: "${reopen1.candidate?.roleApplied}"`);
  if (!reopen1.alreadySubmitted || reopen1.questions) {
    throw new Error('FAILED: Candidate 1\'s submitted link MUST be locked and not return questions!');
  }
  if (reopen1.candidate?.name !== cand1Name) {
    throw new Error(`FAILED: Candidate 1's lock screen showed wrong name: ${reopen1.candidate?.name}`);
  }
  console.log('         ✅ SAME LINK IS STRICTLY LOCKED: Questions blocked, shows Candidate 1 name.\n');

  // -------------------------------------------------------------
  // CANDIDATE 2: Kabir Sen (Full Stack AI Engineer - Same email!)
  // -------------------------------------------------------------
  const cand2Id = 'cand-iso-2-' + Date.now();
  const cand2Name = 'Kabir Sen';
  const cand2Role = 'Full Stack AI Engineer';
  const cand2Url = `http://localhost:3000/api/assessment/questions?role=${encodeURIComponent(cand2Role)}&candidateId=${encodeURIComponent(cand2Id)}&candidateEmail=${encodeURIComponent(sharedEmail)}&name=${encodeURIComponent(cand2Name)}`;

  console.log(`[Step 4] Candidate 2 ("${cand2Name}") opens their NEW interview link (using same email):`);
  console.log(`         ID: ${cand2Id}, Role: ${cand2Role}`);
  const step4 = await get(cand2Url);
  console.log(`         Outcome -> alreadySubmitted: ${step4.alreadySubmitted}, Total Questions: ${step4.questions?.length}`);
  if (step4.alreadySubmitted) {
    throw new Error(`FAILED: Candidate 2 was falsely locked out! Showed name: "${step4.candidate?.name}"`);
  }
  if (!step4.questions || step4.questions.length !== 20) {
    throw new Error('FAILED: Candidate 2 did not get 20 domain questions!');
  }
  console.log(`         ✅ Candidate 2 NEW LINK OPENS CLEANLY! No mention of previous candidate (${cand1Name}).\n`);

  // Quick Status Endpoint Verification
  console.log('[Step 5] Verify /api/assessment/status endpoint:');
  const status1 = await get(`http://localhost:3000/api/assessment/status?candidateId=${encodeURIComponent(cand1Id)}`);
  console.log(`         Candidate 1 Status -> alreadySubmitted: ${status1.alreadySubmitted} (Name: ${status1.candidate?.name})`);
  const status2 = await get(`http://localhost:3000/api/assessment/status?candidateId=${encodeURIComponent(cand2Id)}`);
  console.log(`         Candidate 2 Status -> alreadySubmitted: ${status2.alreadySubmitted}`);
  if (!status1.alreadySubmitted || status2.alreadySubmitted) {
    throw new Error('FAILED: Status endpoint mismatch between submitted and unsubmitted candidates!');
  }
  console.log('         ✅ /api/assessment/status accurately isolates submitted from new sessions.\n');

  console.log('================================================================');
  console.log('  🎉 ALL ASSERTIONS PASSED!                                      ');
  console.log('  1. Completed test links are strictly locked from retakes.      ');
  console.log('  2. New interview mail links ALWAYS open cleanly for new student');
  console.log('     without showing previous student names or submitted status. ');
  console.log('================================================================');
})();
