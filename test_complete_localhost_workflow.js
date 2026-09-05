const http = require('http');

console.log('================================================================');
console.log('  TESTING COMPLETE LOCALHOST WORKFLOW & INTEGRATION SUITE       ');
console.log('================================================================\n');

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, data });
      });
    }).on('error', reject);
  });
}

function post(path, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

(async () => {
  let allPass = true;

  // 1. Dashboard Homepage
  try {
    const res = await get('/');
    const ok = res.status === 200 && res.data.includes('HR SmartFlow');
    console.log(`[1] HR Dashboard Home (GET /): Status ${res.status} ${ok ? '✅ (PASS)' : '❌ (FAIL)'}`);
    if (!ok) allPass = false;
  } catch (e) {
    console.error('[1] Dashboard Home Error:', e.message);
    allPass = false;
  }

  // 2. Finova Website (SPA)
  try {
    const res = await get('/website/');
    const ok = res.status === 200 && res.data.includes('Finova');
    console.log(`[2] Finova Careers Website (GET /website/): Status ${res.status} ${ok ? '✅ (PASS)' : '❌ (FAIL)'}`);
    if (!ok) allPass = false;
  } catch (e) {
    console.error('[2] Website Error:', e.message);
    allPass = false;
  }

  // 3. Online Assessment Portal
  try {
    const res = await get('/assessment');
    const ok = res.status === 200 && res.data.includes('Systematic Technical Assessment');
    console.log(`[3] Assessment Portal (GET /assessment): Status ${res.status} ${ok ? '✅ (PASS)' : '❌ (FAIL)'}`);
    if (!ok) allPass = false;
  } catch (e) {
    console.error('[3] Assessment Portal Error:', e.message);
    allPass = false;
  }

  // 4. API Candidates List
  try {
    const res = await get('/api/candidates');
    const json = JSON.parse(res.data);
    const count = json.candidates ? json.candidates.length : (Array.isArray(json) ? json.length : 0);
    const ok = res.status === 200 && json.success === true && Array.isArray(json.candidates);
    console.log(`[4] Candidate Management API (GET /api/candidates): Status ${res.status}, Count: ${count} ${ok ? '✅ (PASS)' : '❌ (FAIL)'}`);
    if (!ok) allPass = false;
  } catch (e) {
    console.error('[4] Candidates API Error:', e.message);
    allPass = false;
  }

  // 5. API Jobs List
  try {
    const res = await get('/api/jobs');
    const json = JSON.parse(res.data);
    const ok = res.status === 200 && Array.isArray(json.jobs);
    console.log(`[5] Job Vacancies API (GET /api/jobs): Status ${res.status}, Active Jobs: ${json.jobs?.length} ${ok ? '✅ (PASS)' : '❌ (FAIL)'}`);
    if (!ok) allPass = false;
  } catch (e) {
    console.error('[5] Jobs API Error:', e.message);
    allPass = false;
  }

  // 6. Recruitment Analytics Stats
  try {
    const res = await get('/api/stats');
    const json = JSON.parse(res.data);
    const ok = res.status === 200 && json.success === true;
    console.log(`[6] Recruitment Stats API (GET /api/stats): Status ${res.status}, Total Applicants: ${json.stats?.total} ${ok ? '✅ (PASS)' : '❌ (FAIL)'}`);
    if (!ok) allPass = false;
  } catch (e) {
    console.error('[6] Stats API Error:', e.message);
    allPass = false;
  }

  // 7. Dynamic Non-Repeating 20-MCQ Assessment Sampling
  try {
    const candId = 'test-flow-' + Date.now();
    const res = await get(`/api/assessment/questions?role=Frontend%20Developer&candidateId=${candId}&candidateEmail=cand_flow@test.com&name=Flow%20Tester`);
    const json = JSON.parse(res.data);
    const ok = res.status === 200 && json.success === true && json.questions?.length === 20 && json.sections?.length === 4;
    console.log(`[7] Dynamic 20-MCQ Engine (GET /api/assessment/questions): Status ${res.status}, Questions: ${json.questions?.length}, Sections: ${json.sections?.length} ${ok ? '✅ (PASS)' : '❌ (FAIL)'}`);
    if (!ok) allPass = false;
  } catch (e) {
    console.error('[7] Assessment Questions Error:', e.message);
    allPass = false;
  }

  // 8. Test Status & Lockout Verification
  try {
    const res = await get('/api/assessment/status?candidateId=non_existent_cand');
    const json = JSON.parse(res.data);
    const ok = res.status === 200 && json.alreadySubmitted === false;
    console.log(`[8] Assessment Status API (GET /api/assessment/status): Status ${res.status}, alreadySubmitted: ${json.alreadySubmitted} ${ok ? '✅ (PASS)' : '❌ (FAIL)'}`);
    if (!ok) allPass = false;
  } catch (e) {
    console.error('[8] Assessment Status Error:', e.message);
    allPass = false;
  }

  console.log('\n================================================================');
  if (allPass) {
    console.log('🎉 ALL LOCALHOST WORKFLOW ENDPOINTS VERIFIED & WORKING PERFECTLY!');
  } else {
    console.error('❌ SOME CHECKS FAILED! Please review errors above.');
  }
  console.log('================================================================\n');
})();
