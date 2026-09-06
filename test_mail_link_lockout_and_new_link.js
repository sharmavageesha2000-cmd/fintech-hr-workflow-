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
  console.log('========================================================================');
  console.log('  TEST SUITE: 1-TIME MAIL LINK LOCKOUT & NEW EMAIL LINK VALIDATION     ');
  console.log('========================================================================\n');

  const sharedEmail = 'candidate_two_attempts_' + Date.now() + '@example.com';
  const candName = 'Aarav Nair';

  // -------------------------------------------------------------
  // TEST 1: Candidate receives MAIL 1 (Link 1)
  // -------------------------------------------------------------
  const link1Id = 'cand-mail1-' + Date.now();
  const role1 = 'Frontend Developer';
  console.log(`[Phase 1] Candidate receives Mail 1 for ${role1} (ID: ${link1Id})`);

  // Step 1.1: Verify /api/assessment/status before starting
  const status1Initial = await get(`http://localhost:3000/api/assessment/status?candidateId=${encodeURIComponent(link1Id)}`);
  console.log(`   1.1 Status before test -> alreadySubmitted: ${status1Initial.alreadySubmitted}`);
  if (status1Initial.alreadySubmitted) {
    throw new Error('FAILED: Link 1 should not be submitted initially!');
  }

  // Step 1.2: Candidate opens test link 1 for the first time
  const link1Questions = await get(`http://localhost:3000/api/assessment/questions?role=${encodeURIComponent(role1)}&candidateId=${encodeURIComponent(link1Id)}&candidateEmail=${encodeURIComponent(sharedEmail)}&name=${encodeURIComponent(candName)}`);
  console.log(`   1.2 Question endpoint -> alreadySubmitted: ${link1Questions.alreadySubmitted}, MCQs: ${link1Questions.questions?.length}`);
  if (link1Questions.alreadySubmitted || !link1Questions.questions || link1Questions.questions.length !== 20) {
    throw new Error('FAILED: Link 1 should return 20 MCQs on first visit!');
  }
  console.log('   ✅ PASS: Link 1 loaded cleanly for its 1st attempt.\n');

  // Step 1.3: Candidate completes and submits Link 1
  console.log('   1.3 Submitting assessment for Link 1...');
  const answers1 = {};
  link1Questions.questions.forEach((q, idx) => {
    // Score ~85% (17 correct) to trigger offer
    answers1[q.id] = (idx < 17) ? 0 : 1;
  });

  const submit1 = await post('http://localhost:3000/api/assessment/submit', {
    candidateId: link1Id,
    candidateName: candName,
    candidateEmail: sharedEmail,
    roleApplied: role1,
    sessionId: link1Questions.sessionId,
    answers: answers1,
    tabSwitchesCount: 0,
    timeSpentSeconds: 420
  });
  console.log(`   1.3 Submission Result -> Success: ${submit1.success}, Score: ${submit1.scorePercent}%, Passed: ${submit1.passed}`);
  if (!submit1.success || !submit1.candidate?.assessmentCompleted) {
    throw new Error('FAILED: Link 1 submission failed!');
  }
  console.log('   ✅ PASS: Link 1 successfully submitted and recorded in recruitment database.\n');

  // Step 1.4: Candidate opens Link 1 a SECOND TIME
  console.log(`[Phase 2] Candidate opens the SAME Link 1 a SECOND time:`);
  const status1Second = await get(`http://localhost:3000/api/assessment/status?candidateId=${encodeURIComponent(link1Id)}`);
  console.log(`   2.1 Status on 2nd visit -> alreadySubmitted: ${status1Second.alreadySubmitted} (Candidate: "${status1Second.candidate?.name}")`);
  if (!status1Second.alreadySubmitted) {
    throw new Error('FAILED: Status endpoint must report alreadySubmitted = true on 2nd visit to Link 1!');
  }

  const link1Reopen = await get(`http://localhost:3000/api/assessment/questions?role=${encodeURIComponent(role1)}&candidateId=${encodeURIComponent(link1Id)}&candidateEmail=${encodeURIComponent(sharedEmail)}&name=${encodeURIComponent(candName)}`);
  console.log(`   2.2 Question access on 2nd visit -> alreadySubmitted: ${link1Reopen.alreadySubmitted}, Questions: ${link1Reopen.questions ? 'EXPOSED (FAIL)' : 'BLOCKED (PASS)'}`);
  if (!link1Reopen.alreadySubmitted || link1Reopen.questions) {
    throw new Error('FAILED: Link 1 questions must NOT open a second time!');
  }

  // Step 1.5: Attempt direct POST submission on Link 1 again
  const submit1Duplicate = await post('http://localhost:3000/api/assessment/submit', {
    candidateId: link1Id,
    candidateName: candName,
    candidateEmail: sharedEmail,
    roleApplied: role1,
    sessionId: link1Questions.sessionId,
    answers: answers1
  });
  console.log(`   2.3 Duplicate POST attempt -> alreadySubmitted: ${submit1Duplicate.alreadySubmitted}, message: "${submit1Duplicate.message}"`);
  if (!submit1Duplicate.alreadySubmitted || submit1Duplicate.success) {
    throw new Error('FAILED: Direct duplicate submission must be rejected!');
  }
  console.log('   ✅ PASS: Link 1 is STRICTLY LOCKED and replies response has been submitted.\n');

  // -------------------------------------------------------------
  // TEST 2: Candidate receives MAIL 2 (New Link 2 with new ID for same email)
  // -------------------------------------------------------------
  const link2Id = 'cand-mail2-' + Date.now();
  const role2 = 'Backend Developer';
  console.log(`[Phase 3] Candidate receives Mail 2 for ${role2} (NEW ID: ${link2Id}, Same Email: ${sharedEmail})`);

  // Step 2.1: Verify Link 2 status before starting
  const status2Initial = await get(`http://localhost:3000/api/assessment/status?candidateId=${encodeURIComponent(link2Id)}`);
  console.log(`   3.1 Link 2 status before test -> alreadySubmitted: ${status2Initial.alreadySubmitted}`);
  if (status2Initial.alreadySubmitted) {
    throw new Error('FAILED: New Link 2 must NOT be locked just because Link 1 was submitted!');
  }

  // Step 2.2: Candidate opens Link 2 for the first time
  const link2Questions = await get(`http://localhost:3000/api/assessment/questions?role=${encodeURIComponent(role2)}&candidateId=${encodeURIComponent(link2Id)}&candidateEmail=${encodeURIComponent(sharedEmail)}&name=${encodeURIComponent(candName)}`);
  console.log(`   3.2 Link 2 questions -> alreadySubmitted: ${link2Questions.alreadySubmitted}, MCQs: ${link2Questions.questions?.length}`);
  if (link2Questions.alreadySubmitted || !link2Questions.questions || link2Questions.questions.length !== 20) {
    throw new Error('FAILED: Candidate did not receive 20 MCQs for Link 2!');
  }
  console.log('   ✅ PASS: New email test link (Link 2) works cleanly for its first attempt!\n');

  // Step 2.3: Candidate completes and submits Link 2
  console.log('   3.3 Submitting assessment for Link 2...');
  const answers2 = {};
  link2Questions.questions.forEach((q, idx) => {
    answers2[q.id] = (idx < 18) ? 0 : 1;
  });

  const submit2 = await post('http://localhost:3000/api/assessment/submit', {
    candidateId: link2Id,
    candidateName: candName,
    candidateEmail: sharedEmail,
    roleApplied: role2,
    sessionId: link2Questions.sessionId,
    answers: answers2,
    tabSwitchesCount: 0,
    timeSpentSeconds: 380
  });
  console.log(`   3.3 Link 2 Submission Result -> Success: ${submit2.success}, Score: ${submit2.scorePercent}%`);
  if (!submit2.success || !submit2.candidate?.assessmentCompleted) {
    throw new Error('FAILED: Link 2 submission failed!');
  }
  console.log('   ✅ PASS: Link 2 submitted and recorded.\n');

  // Step 2.4: Candidate opens Link 2 a SECOND time
  console.log(`[Phase 4] Candidate opens Link 2 a SECOND time:`);
  const status2Second = await get(`http://localhost:3000/api/assessment/status?candidateId=${encodeURIComponent(link2Id)}`);
  console.log(`   4.1 Link 2 status on 2nd visit -> alreadySubmitted: ${status2Second.alreadySubmitted}`);
  if (!status2Second.alreadySubmitted) {
    throw new Error('FAILED: Link 2 must now also be locked out after 1-time use!');
  }

  const link2Reopen = await get(`http://localhost:3000/api/assessment/questions?role=${encodeURIComponent(role2)}&candidateId=${encodeURIComponent(link2Id)}&candidateEmail=${encodeURIComponent(sharedEmail)}&name=${encodeURIComponent(candName)}`);
  console.log(`   4.2 Link 2 question access on 2nd visit -> alreadySubmitted: ${link2Reopen.alreadySubmitted}, Questions: ${link2Reopen.questions ? 'EXPOSED (FAIL)' : 'BLOCKED (PASS)'}`);
  if (!link2Reopen.alreadySubmitted || link2Reopen.questions) {
    throw new Error('FAILED: Link 2 questions must NOT open a second time!');
  }
  console.log('   ✅ PASS: Link 2 is ALSO strictly locked after one time use!\n');

  // Step 2.5: Verify Link 1 remains locked
  console.log(`[Phase 5] Re-verifying Link 1 is still locked:`);
  const status1Third = await get(`http://localhost:3000/api/assessment/status?candidateId=${encodeURIComponent(link1Id)}`);
  console.log(`   5.1 Link 1 status -> alreadySubmitted: ${status1Third.alreadySubmitted}`);
  if (!status1Third.alreadySubmitted) {
    throw new Error('FAILED: Link 1 should still be locked!');
  }
  console.log('   ✅ PASS: Both individual links remain independently locked.\n');

  console.log('========================================================================');
  console.log('  🎉 ALL VERIFICATION TESTS PASSED (100%)!                              ');
  console.log('  1. Same mail link CANNOT open a 2nd time (locks to response submitted).');
  console.log('  2. Another mail with new test link WORKS cleanly.                     ');
  console.log('  3. That second link also works for EXACTLY ONE TIME and then locks.   ');
  console.log('========================================================================');
})();
