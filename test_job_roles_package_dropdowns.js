// Automated Verification Script: Job Roles Annual Package Dropdown, Work Mode, & Reporting Authority
const fs = require('fs');
const path = require('path');
const http = require('http');

function makeRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : null;
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {})
      },
      timeout: 8000
    }, (res) => {
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
    if (postData) req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('========================================================');
  console.log('🧪 Starting Job Roles & Package Dropdowns Verification Suite');
  console.log('========================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passedTests++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
    }
  }

  // TEST 1: Inspect data/jobs.json
  console.log('--- Test Group 1: data/jobs.json structure & differentiation ---');
  const jobsPath = path.join(__dirname, 'data', 'jobs.json');
  const jobs = JSON.parse(fs.readFileSync(jobsPath, 'utf8'));
  assert(Array.isArray(jobs) && jobs.length >= 8, `Loaded ${jobs.length} jobs from data/jobs.json`);

  const packagesSeen = new Map();
  for (const job of jobs) {
    assert(!!job.annualPackage, `Job "${job.title}" has configured annualPackage: ${job.annualPackage}`);
    assert(Array.isArray(job.packageOptions) && job.packageOptions.length >= 3, `Job "${job.title}" has ${job.packageOptions?.length} differing package options`);
    assert(!!job.workingMode, `Job "${job.title}" has workingMode: ${job.workingMode}`);
    assert(!!job.reportingAuthority, `Job "${job.title}" has reportingAuthority: ${job.reportingAuthority}`);
    
    // Check package variation
    packagesSeen.set(job.title, job.annualPackage);
  }

  // Assert packages differ across different roles
  assert(packagesSeen.get('Frontend Developer') !== packagesSeen.get('Full Stack AI Engineer'),
    `Frontend Developer (${packagesSeen.get('Frontend Developer')}) differs from Full Stack AI Engineer (${packagesSeen.get('Full Stack AI Engineer')})`);
  
  assert(packagesSeen.get('Data Analyst') !== packagesSeen.get('AI / ML Engineer'),
    `Data Analyst (${packagesSeen.get('Data Analyst')}) differs from AI / ML Engineer (${packagesSeen.get('AI / ML Engineer')})`);

  assert(packagesSeen.get('UI/UX Product Designer') !== packagesSeen.get('Backend Developer'),
    `UI/UX Product Designer (${packagesSeen.get('UI/UX Product Designer')}) differs from Backend Developer (${packagesSeen.get('Backend Developer')})`);

  // TEST 2: GET /api/jobs
  console.log('\n--- Test Group 2: GET /api/jobs API verification ---');
  const jobsRes = await makeRequest('/api/jobs');
  assert(jobsRes.status === 200 && jobsRes.data?.success === true, 'GET /api/jobs returned HTTP 200 and success: true');
  const apiJobs = jobsRes.data.jobs;
  assert(apiJobs.length > 0, `Returned ${apiJobs.length} active jobs`);
  const frontendJob = apiJobs.find(j => j.title.toLowerCase().includes('frontend'));
  assert(frontendJob && frontendJob.annualPackage && frontendJob.workingMode && frontendJob.reportingAuthority,
    `Frontend job API response includes package: "${frontendJob?.annualPackage}", workMode: "${frontendJob?.workingMode}", reportingAuthority: "${frontendJob?.reportingAuthority}"`);

  // TEST 3: POST /api/jobs (Create new job with custom package dropdown selection)
  console.log('\n--- Test Group 3: POST /api/jobs dynamic job creation with dropdown fields ---');
  const customJobTitle = `Cloud DevOps Architect Test-${Date.now()}`;
  const newJobPayload = {
    title: customJobTitle,
    department: 'Infrastructure',
    experienceRequired: 'Senior (3-5 Yrs)',
    totalVacancies: 3,
    vacanciesLeft: 3,
    annualPackage: '₹18,00,000 - ₹24,00,000 per annum',
    packageOptions: [
      '₹14,00,000 - ₹18,00,000 per annum',
      '₹18,00,000 - ₹24,00,000 per annum',
      '₹24,00,000 - ₹32,00,000 per annum'
    ],
    workingMode: '100% Remote (Work from Anywhere)',
    reportingAuthority: 'Rohan Mehta (VP of Engineering)',
    skills: ['Kubernetes', 'AWS', 'Terraform', 'CI/CD']
  };

  const createRes = await makeRequest('/api/jobs', 'POST', newJobPayload);
  assert(createRes.status === 200 && createRes.data?.success === true, 'POST /api/jobs returned HTTP 200 and success: true');
  const createdJob = createRes.data?.job;
  assert(createdJob?.annualPackage === '₹18,00,000 - ₹24,00,000 per annum', `Created job has annualPackage: "${createdJob?.annualPackage}"`);
  assert(createdJob?.workingMode === '100% Remote (Work from Anywhere)', `Created job has workingMode: "${createdJob?.workingMode}"`);
  assert(createdJob?.reportingAuthority === 'Rohan Mehta (VP of Engineering)', `Created job has reportingAuthority: "${createdJob?.reportingAuthority}"`);

  // Clean up test job
  if (createdJob?.id) {
    await makeRequest(`/api/jobs/${createdJob.id}`, 'DELETE');
    console.log(`Cleaned up test job ${createdJob.id}`);
  }

  // TEST 4: Frontend UI app.js and index.html code verification
  console.log('\n--- Test Group 4: Frontend UI & Template Verification ---');
  const indexHtml = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');
  assert(indexHtml.includes('id="jobAnnualPackage"'), 'public/index.html has #jobAnnualPackage select dropdown');
  assert(indexHtml.includes('id="jobWorkingMode"'), 'public/index.html has #jobWorkingMode select dropdown');
  assert(indexHtml.includes('id="jobReportingAuthority"'), 'public/index.html has #jobReportingAuthority select dropdown');
  assert(indexHtml.includes('id="offerCtc"'), 'public/index.html has #offerCtc dropdown in offer modal');
  assert(indexHtml.includes('id="offerReportingTo"'), 'public/index.html has #offerReportingTo dropdown in offer modal');

  const appJs = fs.readFileSync(path.join(__dirname, 'public', 'app.js'), 'utf8');
  assert(appJs.includes('ROLE_PACKAGE_CATALOG'), 'public/app.js defines ROLE_PACKAGE_CATALOG');
  assert(appJs.includes('getPackagesForRole'), 'public/app.js contains getPackagesForRole() function');
  assert(appJs.includes('updateJobPackageDropdown'), 'public/app.js dynamically updates package dropdown based on selected job role');
  assert(appJs.includes('annualPackage'), 'public/app.js handles annualPackage in renderJobsList and job submission');

  // Summary
  console.log('\n========================================================');
  console.log(`📊 Suite Results: ${passedTests}/${totalTests} Tests Passed (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log('========================================================\n');

  if (passedTests === totalTests) {
    console.log('🎉 ALL TESTS PASSED SUCCESSFULLY!');
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
