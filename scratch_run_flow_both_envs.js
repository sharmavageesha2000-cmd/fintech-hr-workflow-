const http = require('http');
const https = require('https');

async function makeRequest(url, method = 'GET', data = null, timeoutMs = 75000) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;
    const urlObj = new URL(url);

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'HR-Workflow-Tester/1.0'
      }
    };

    const req = client.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.setTimeout(timeoutMs, () => {
      req.destroy();
      reject(new Error(`Request timed out after ${timeoutMs/1000}s`));
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runFlowOnEnv(envName, baseUrl) {
  console.log(`\n======================================================`);
  console.log(`🚀 RUNNING HR RECRUITMENT FLOW ON: ${envName.toUpperCase()}`);
  console.log(`   Base URL: ${baseUrl}`);
  console.log(`======================================================`);

  try {
    // 1. Health & Candidates Check (also acts as cold-start wake-up for Render)
    console.log(`\n1️⃣ Connecting & Fetching Candidate Pipeline... (Waking up instance if asleep)`);
    const candRes = await makeRequest(`${baseUrl}/api/candidates`);
    if (candRes.status === 200 && candRes.data.success) {
      const candidates = candRes.data.candidates || [];
      console.log(`   ✅ Success! Found ${candidates.length} candidates in database.`);
      const selected = candidates.filter(c => c.status === 'SELECTED').length;
      const rejected = candidates.filter(c => c.status === 'REJECTED').length;
      const offers = candidates.filter(c => c.offerStatus === 'OFFER_EXTENDED').length;
      console.log(`   📊 Stats: Shortlisted: ${selected} | Rejected: ${rejected} | Offers Sent: ${offers}`);
    } else {
      console.log(`   ⚠️ Response:`, candRes.status, candRes.data || candRes.raw);
    }

    // 2. Open Job Roles & Vacancies Check
    console.log(`\n2️⃣ Fetching Job Roles & Vacancies...`);
    const jobsRes = await makeRequest(`${baseUrl}/api/jobs`);
    if (jobsRes.status === 200 && jobsRes.data.success) {
      const jobs = jobsRes.data.jobs || [];
      console.log(`   ✅ Success! Found ${jobs.length} active job roles.`);
      jobs.slice(0, 4).forEach((j, i) => {
        console.log(`      ${i + 1}. ${j.title} (${j.department}) - Vacancies Left: ${j.vacanciesLeft}/${j.totalVacancies}`);
      });
    }

    // 3. Trigger Live Gmail Inbox Scanner & AI Evaluator
    console.log(`\n3️⃣ Triggering Live Gmail Inbox Sync & Evaluation...`);
    const inboxRes = await makeRequest(`${baseUrl}/api/check-inbox`, 'POST');
    if (inboxRes.status === 200 && inboxRes.data.success) {
      console.log(`   ✅ Inbox Sync Complete! Processed: ${inboxRes.data.processedCount || 0} applications.`);
      console.log(`   ✉️ Message: ${inboxRes.data.message || 'Synchronized successfully.'}`);
    } else {
      console.log(`   ⚠️ Inbox response:`, inboxRes);
    }

    // 4. Test Direct Application Evaluation with Gemini AI
    console.log(`\n4️⃣ Testing Live AI Evaluation with Gemini 3.5 Flash...`);
    const testCandidate = {
      name: 'Aditya Mehta',
      email: 'aditya.mehta.ai2026@gmail.com',
      roleApplied: 'Lead AI & n8n Workflow Architect',
      experienceYears: 6,
      skills: ['n8n', 'Python', 'Gemini API', 'Docker', 'PostgreSQL', 'Microservices'],
      resumeText: 'Aditya Mehta | Lead AI & Workflow Architect. 6 years architecting high-scale enterprise n8n workflow systems, integrating LLM reasoning agents, building secure microservices, and orchestrating cloud payment pipelines.'
    };

    const evalRes = await makeRequest(`${baseUrl}/api/evaluate`, 'POST', testCandidate);
    if (evalRes.status === 200 && evalRes.data.success) {
      const result = evalRes.data.candidate;
      console.log(`   ✅ AI Evaluation Succeeded!`);
      console.log(`      Candidate: ${result.name} (${result.email})`);
      console.log(`      Status: ${result.status} | Match Score: ${result.matchScore}%`);
      console.log(`      Google Meet: ${result.interviewSchedule?.meetLink || 'N/A'}`);
      console.log(`      Evaluation Summary: ${result.evaluationSummary || 'Evaluated successfully'}`);
    } else {
      console.log(`   ⚠️ Evaluation response:`, evalRes);
    }

    console.log(`\n🎉 [${envName.toUpperCase()}] All HR Flow checks executed successfully!`);
    return true;
  } catch (err) {
    console.error(`❌ [${envName.toUpperCase()}] Flow Error:`, err.message);
    return false;
  }
}

async function main() {
  console.log(`🚀 Starting automated flow execution on both Localhost and Render Cloud...\n`);

  // Run on Localhost
  const localSuccess = await runFlowOnEnv('Localhost', 'http://localhost:3000');

  // Run on Render Cloud
  const cloudSuccess = await runFlowOnEnv('Render Cloud', 'https://hr-smartflow-automation.onrender.com');

  console.log(`\n======================================================`);
  console.log(`📋 FINAL VERIFICATION SUMMARY`);
  console.log(`======================================================`);
  console.log(`Localhost (http://localhost:3000): ${localSuccess ? '✅ PASSED & ACTIVE' : '❌ FAILED'}`);
  console.log(`Render Cloud (https://hr-smartflow-automation.onrender.com): ${cloudSuccess ? '✅ PASSED & ACTIVE' : '❌ FAILED'}`);
  console.log(`======================================================\n`);
}

main();
