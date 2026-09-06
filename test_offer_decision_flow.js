// End-to-End Test Suite: Conditional Offer Email with Future Date, Accept/Reject Flow, and Automated Follow-up Dispatches
const fs = require('fs');
const path = require('path');
const http = require('http');
const { generateFutureJoiningDate, generateSelectionOfferEmailHtml, generateOfferDeclineAcknowledgementEmailHtml } = require('./gemini_evaluator');

function makeRequest(pathUrl, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : null;
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: pathUrl,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {})
      },
      timeout: 15000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: (() => {
            try { return JSON.parse(data); } catch (e) { return data; }
          })()
        });
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('========================================================');
  console.log('🧪 Starting Offer Decision & Future Joining Date Test Suite');
  console.log('========================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, desc) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${desc}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${desc}`);
    }
  }

  // --- TEST GROUP 1: Future Joining Date Computation ---
  console.log('--- Test Group 1: Dynamic Future Joining Date Calculation ---');
  const futureDateStr = generateFutureJoiningDate(18);
  console.log(`Computed Future Joining Date: "${futureDateStr}"`);
  assert(futureDateStr.startsWith('Monday,'), `Joining date starts with Monday: "${futureDateStr}"`);
  
  // Verify it is at least 18 days in the future
  const parsedFuture = new Date(futureDateStr);
  const now = new Date();
  const diffDays = Math.round((parsedFuture - now) / (1000 * 60 * 60 * 24));
  console.log(`Days in future from today: ${diffDays} days`);
  assert(diffDays >= 18, `Date is strictly in the future (>= 18 days ahead, got ${diffDays})`);

  // --- TEST GROUP 2: Provisional Selection Email Template ---
  console.log('\n--- Test Group 2: Provisional Selection Email Template ---');
  const sampleEmailHtml = generateSelectionOfferEmailHtml({
    candidateName: 'Rohan Sharma',
    candidateId: 'cand-test-rohan-001',
    roleApplied: 'Backend Developer',
    department: 'Engineering',
    ctcPackage: '₹11,50,000 per annum (Standard Full-Time)',
    workMode: 'Remote / Hybrid (Flexible Work Arrangements)',
    reportingTo: 'Aarav Kapoor (Head of Engineering & Tech Hiring)',
    joiningDate: futureDateStr,
    decisionBaseUrl: 'http://localhost:3000',
    offerRefId: 'HR-OFFER-2026-TEST'
  });

  assert(sampleEmailHtml.includes('Backend Developer'), 'Email includes role name');
  assert(sampleEmailHtml.includes('₹11,50,000 per annum'), 'Email includes role annual package');
  assert(sampleEmailHtml.includes('Remote / Hybrid'), 'Email includes working mode');
  assert(sampleEmailHtml.includes('Aarav Kapoor'), 'Email includes reporting authority HR');
  assert(sampleEmailHtml.includes(futureDateStr), 'Email includes dynamic future joining date');
  assert(sampleEmailHtml.includes('/api/offer/decision?id=cand-test-rohan-001&decision=accept'), 'Email includes Accept button URL');
  assert(sampleEmailHtml.includes('/api/offer/decision?id=cand-test-rohan-001&decision=reject'), 'Email includes Decline button URL');

  // --- TEST GROUP 3: Offer Decision Portal Page ---
  console.log('\n--- Test Group 3: Offer Decision Landing Page HTTP 200 ---');
  const pageRes = await makeRequest('/offer-decision.html');
  assert(pageRes.status === 200, 'GET /offer-decision.html returns HTTP 200');
  assert(pageRes.data.includes('Offer Decision'), 'Page contains Offer Decision title');

  // --- TEST GROUP 4: Assessment Submission (Score >= 80%) & Provisional Offer Dispatch ---
  console.log('\n--- Test Group 4: Assessment Submit (>= 80%) sends Provisional Offer ---');
  const candidatePassId = `cand-pass-flow-${Date.now()}`;
  
  // Seed candidate
  const candidatesPath = path.join(__dirname, 'data', 'candidates.json');
  const candidates = JSON.parse(fs.readFileSync(candidatesPath, 'utf8'));
  candidates.unshift({
    id: candidatePassId,
    name: 'Siddharth Rao',
    email: 'sharmavageesha2000@gmail.com',
    roleApplied: 'Full Stack AI Engineer',
    receivedAt: new Date().toISOString(),
    attachmentInfo: { fileName: 'Siddharth_Rao_Resume.pdf', urlPath: '/uploads/dummy.pdf' }
  });
  fs.writeFileSync(candidatesPath, JSON.stringify(candidates, null, 2), 'utf8');

  // Query active assessment session to get exact question IDs and options
  const questionsRes = await makeRequest(`/api/assessment/questions?role=Full+Stack+AI+Engineer&candidateId=${candidatePassId}`);
  const sessionId = questionsRes.data?.sessionId;
  const questions = questionsRes.data?.questions || [];

  // Provide accurate answers for 18 out of 20 questions (90%)
  const { ROLE_QUESTIONS_BANK } = require('./assessment_questions');
  const allBankQuestions = Object.values(ROLE_QUESTIONS_BANK).flat();
  const answers = {};
  
  questions.forEach((q, idx) => {
    const bankQ = allBankQuestions.find(b => b.id === q.id);
    if (bankQ) {
      const correctText = bankQ.options[bankQ.correctIndex || 0];
      const correctIndexInShuffled = q.options.indexOf(correctText);
      answers[q.id] = (idx < 18)
        ? (correctIndexInShuffled !== -1 ? correctIndexInShuffled : 0)
        : ((correctIndexInShuffled !== -1 ? correctIndexInShuffled + 1 : 1) % 4);
    } else {
      answers[q.id] = 0;
    }
  });

  // Submit assessment passing with 18/20 answers (90%)
  const submitRes = await makeRequest('/api/assessment/submit', 'POST', {
    candidateId: candidatePassId,
    candidateName: 'Siddharth Rao',
    candidateEmail: 'sharmavageesha2000@gmail.com',
    roleApplied: 'Full Stack AI Engineer',
    sessionId,
    answers,
    timeSpentSeconds: 420
  });

  assert(submitRes.status === 200 && submitRes.data.passed === true, `Assessment submission cleared with score >= 80% (got ${submitRes.data?.scorePercent}%)`);
  
  // Verify candidate state after test pass
  const afterPassCandidates = JSON.parse(fs.readFileSync(candidatesPath, 'utf8'));
  const passCand = afterPassCandidates.find(c => c.id === candidatePassId);
  assert(passCand?.status === 'SELECTED', 'Candidate status is SELECTED');
  assert(passCand?.offerStatus === 'OFFER_EXTENDED', 'Candidate offerStatus is OFFER_EXTENDED (provisional offer sent)');
  assert(passCand?.callLetterDetails?.type === 'SELECTION_INTENT_OFFER', 'callLetterDetails has type SELECTION_INTENT_OFFER');
  assert(passCand?.callLetterDetails?.joiningDate.startsWith('Monday,'), `callLetterDetails has future joining date: ${passCand?.callLetterDetails?.joiningDate}`);

  // --- TEST GROUP 5: Candidate Clicks ACCEPT ---
  console.log('\n--- Test Group 5: Candidate Clicks Accept Offer ---');
  const acceptRes = await makeRequest(`/api/offer/decision?id=${candidatePassId}&decision=accept`);
  assert(acceptRes.status === 302, 'GET /api/offer/decision?decision=accept returns HTTP 302 Redirect');
  const acceptRedirect = acceptRes.headers['location'] || '';
  assert(acceptRedirect.includes('/offer-decision.html?status=accepted'), `Redirects to accepted screen: "${acceptRedirect}"`);

  // Check candidate record in DB
  const afterAcceptCandidates = JSON.parse(fs.readFileSync(candidatesPath, 'utf8'));
  const acceptedCand = afterAcceptCandidates.find(c => c.id === candidatePassId);
  assert(acceptedCand?.offerStatus === 'OFFER_ACCEPTED', 'Candidate offerStatus updated to OFFER_ACCEPTED');
  assert(!!acceptedCand?.offerAcceptedAt, `Candidate has offerAcceptedAt timestamp: ${acceptedCand?.offerAcceptedAt}`);
  assert(acceptedCand?.callLetterDetails?.type === 'FINAL_OFFER_LETTER', 'Final call letter generated and recorded');
  assert(acceptedCand?.callLetterDetails?.emailDispatch?.success === true, 'Final call letter dispatched via Gmail SMTP successfully');

  // --- TEST GROUP 6: Double Click Guard ---
  console.log('\n--- Test Group 6: Double Decision Guard on already accepted candidate ---');
  const doubleRes = await makeRequest(`/api/offer/decision?id=${candidatePassId}&decision=accept`);
  assert(doubleRes.status === 302, 'Double decision returns HTTP 302 Redirect');
  const doubleRedirect = doubleRes.headers['location'] || '';
  assert(doubleRedirect.includes('status=already_recorded'), `Redirects to already_recorded state: "${doubleRedirect}"`);

  // --- TEST GROUP 7: Candidate Clicks REJECT / DECLINE ---
  console.log('\n--- Test Group 7: Candidate Clicks Decline / Reject Offer ---');
  const candidateRejectId = `cand-reject-flow-${Date.now()}`;
  const candList = JSON.parse(fs.readFileSync(candidatesPath, 'utf8'));
  candList.unshift({
    id: candidateRejectId,
    name: 'Kavita Patel',
    email: 'sharmavageesha2000@gmail.com',
    roleApplied: 'AI/ML Engineer',
    status: 'SELECTED',
    offerStatus: 'OFFER_EXTENDED',
    receivedAt: new Date().toISOString(),
    attachmentInfo: { fileName: 'Kavita_Patel_Resume.pdf', urlPath: '/uploads/dummy.pdf' },
    callLetterDetails: {
      joiningDate: futureDateStr,
      ctcPackage: '₹17,00,000 per annum (Standard Full-Time)',
      reportingTo: 'Aarav Kapoor (Head of Engineering & Tech Hiring)',
      workMode: 'Hybrid (3 Days Office / 2 Days Remote)'
    }
  });
  fs.writeFileSync(candidatesPath, JSON.stringify(candList, null, 2), 'utf8');

  const rejectRes = await makeRequest(`/api/offer/decision?id=${candidateRejectId}&decision=reject`);
  assert(rejectRes.status === 302, 'GET /api/offer/decision?decision=reject returns HTTP 302 Redirect');
  const rejectRedirect = rejectRes.headers['location'] || '';
  assert(rejectRedirect.includes('/offer-decision.html?status=declined'), `Redirects to declined screen: "${rejectRedirect}"`);

  // Check candidate record in DB
  const afterRejectCandidates = JSON.parse(fs.readFileSync(candidatesPath, 'utf8'));
  const rejectedCand = afterRejectCandidates.find(c => c.id === candidateRejectId);
  assert(rejectedCand?.offerStatus === 'OFFER_DECLINED', 'Candidate offerStatus updated to OFFER_DECLINED');
  assert(rejectedCand?.status === 'REJECTED', 'Candidate status updated to REJECTED');
  assert(!!rejectedCand?.offerDeclinedAt, `Candidate has offerDeclinedAt timestamp: ${rejectedCand?.offerDeclinedAt}`);
  assert(rejectedCand?.declineDetails?.emailDispatch?.success === true, 'Decline acknowledgement email dispatched via Gmail SMTP successfully');

  // Summary
  console.log('\n========================================================');
  console.log(`📊 Suite Results: ${passed}/${total} Tests Passed (${Math.round((passed / total) * 100)}%)`);
  console.log('========================================================\n');

  if (passed === total) {
    console.log('🎉 ALL OFFER DECISION TESTS PASSED SUCCESSFULLY!');
    process.exit(0);
  } else {
    console.error('⚠️ SOME TESTS FAILED');
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
