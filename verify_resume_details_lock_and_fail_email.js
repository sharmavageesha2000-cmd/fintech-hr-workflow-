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
  console.log('  TEST: VERIFIED RESUME IDENTITY LOCK & NON-PASSING PERFORMANCE EMAIL  ');
  console.log('========================================================================\n');

  const fs = require('fs');
  const path = require('path');
  const candidates = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'candidates.json'), 'utf8'));

  // 1. Pick a candidate with real resume record
  const cand = candidates.find(c => c.name && c.email && c.email.includes('@') && !c.assessmentCompleted);
  if (!cand) {
    throw new Error('No unsubmitted candidate found in candidates.json for testing!');
  }

  console.log(`[TEST 1] Testing /api/assessment/status for Resume-Backed Candidate:`);
  console.log(`         Candidate: "${cand.name}", Email: "${cand.email}", Role: "${cand.roleApplied}" (ID: ${cand.id})`);
  
  const statusRes = await get(`http://localhost:3000/api/assessment/status?candidateId=${encodeURIComponent(cand.id)}`);
  console.log(`         Status Result: alreadySubmitted = ${statusRes.alreadySubmitted}`);
  console.log(`         Candidate Record returned:`, statusRes.candidate);

  if (!statusRes.candidate || statusRes.candidate.name !== cand.name || statusRes.candidate.email !== cand.email) {
    throw new Error('FAILED: /api/assessment/status did not return verified resume details for candidate!');
  }
  console.log('   ✅ PASS: /api/assessment/status accurately delivers verified candidate resume details!\n');

  // 2. Test Assessment Submission for Non-Passing Candidate (< 80%)
  console.log(`[TEST 2] Testing Non-Passing Candidate Test Submission (< 80%):`);
  const testCandidateId = 'cand-fail-test-' + Date.now();
  const testEmail = 'sharmavageesha2000@gmail.com'; // Real recipient for live SMTP
  const testName = 'Devashish Sen';
  const testRole = 'Frontend Developer';

  const questionsRes = await get(`http://localhost:3000/api/assessment/questions?role=${encodeURIComponent(testRole)}&candidateId=${encodeURIComponent(testCandidateId)}&candidateEmail=${encodeURIComponent(testEmail)}&name=${encodeURIComponent(testName)}`);
  console.log(`         Retrieved ${questionsRes.questions?.length} MCQs for ${testRole}`);

  // Intentionally submit failing answers (~30% score)
  const failingAnswers = {};
  questionsRes.questions.forEach((q, idx) => {
    failingAnswers[q.id] = (idx < 6) ? 0 : 1; // only ~6 correct out of 20 = 30%
  });

  console.log(`         Submitting answers for score < 80%...`);
  const submitFailRes = await post('http://localhost:3000/api/assessment/submit', {
    candidateId: testCandidateId,
    candidateName: testName,
    candidateEmail: testEmail,
    roleApplied: testRole,
    sessionId: questionsRes.sessionId,
    answers: failingAnswers,
    tabSwitchesCount: 0,
    timeSpentSeconds: 320
  });

  console.log(`         Submission Outcome:`);
  console.log(`         - Score Achieved: ${submitFailRes.scorePercent}%`);
  console.log(`         - Passed Threshold: ${submitFailRes.passed}`);
  console.log(`         - Candidate Status: ${submitFailRes.candidate?.status}`);
  console.log(`         - Email Dispatch:`, submitFailRes.emailDispatch);
  console.log(`         - Delivered To:`, submitFailRes.deliveredTo);

  if (submitFailRes.passed) {
    throw new Error('FAILED: Test should not have passed with score < 80%!');
  }
  if (!submitFailRes.emailDispatch || !submitFailRes.emailDispatch.success) {
    throw new Error(`FAILED: Non-passing candidate performance email was not dispatched! Error: ${submitFailRes.emailDispatch?.error}`);
  }
  if (submitFailRes.deliveredTo !== testEmail) {
    throw new Error(`FAILED: Performance email was delivered to wrong address: ${submitFailRes.deliveredTo}`);
  }
  console.log('   ✅ PASS: Performance feedback update email dispatched immediately via Gmail SMTP to candidate mail!\n');

  // 3. Verify HTML & JS Assets
  console.log(`[TEST 3] Verifying Locked UI Assets:`);
  const htmlContent = fs.readFileSync(path.join(__dirname, 'public', 'assessment.html'), 'utf8');
  const jsContent = fs.readFileSync(path.join(__dirname, 'public', 'assessment.js'), 'utf8');

  if (htmlContent.includes('editCandidateEmail()')) {
    throw new Error('FAILED: assessment.html still contains editCandidateEmail button!');
  }
  if (jsContent.includes('function editCandidateName') || jsContent.includes('function editCandidateRole')) {
    throw new Error('FAILED: assessment.js still contains edit candidate prompt functions!');
  }
  if (!htmlContent.includes('VERIFIED CANDIDATE PROFILE (LOCKED FROM RESUME)')) {
    throw new Error('FAILED: assessment.html does not show locked verified profile badge!');
  }
  console.log('   ✅ PASS: Candidate details are strictly read-only and immutable!\n');

  console.log('========================================================================');
  console.log('  🎉 ALL ASSERTIONS PASSED (100%)!                                      ');
  console.log('  1. Candidate details cannot be changed and reflect resume info.       ');
  console.log('  2. Candidates who do not pass receive performance feedback via mail.  ');
  console.log('========================================================================');
})();
