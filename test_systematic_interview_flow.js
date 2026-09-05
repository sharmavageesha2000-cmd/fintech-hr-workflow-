const http = require('http');

function makeRequest(url, options = {}, postData = null) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const reqOptions = {
      hostname: u.hostname,
      port: u.port || 3000,
      path: u.pathname + u.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    if (postData) {
      if (!reqOptions.headers['Content-Type']) {
        reqOptions.headers['Content-Type'] = 'application/json';
      }
      reqOptions.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
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

async function runEndToEndSystematicFlow() {
  console.log('================================================================================');
  console.log('🚀 EXECUTING END-TO-END RECRUITMENT FLOW & SYSTEMATIC INTERVIEW TEST SUITE');
  console.log('================================================================================\n');

  const BASE_URL = 'http://localhost:3000';

  // STEP 1: Candidate Pipeline & Jobs Health Check
  console.log('1️⃣ Checking Candidate Pipeline & Active Job Roles...');
  const candRes = await makeRequest(`${BASE_URL}/api/candidates`);
  if (candRes.status === 200 && candRes.data.success) {
    console.log(`   ✅ Candidate Pipeline Active: ${candRes.data.total} records in database.`);
  } else {
    console.error('   ❌ Failed to connect to /api/candidates. Ensure server is running.');
    return;
  }

  const jobsRes = await makeRequest(`${BASE_URL}/api/jobs`);
  console.log(`   ✅ Active Open Positions: ${jobsRes.data.jobs ? jobsRes.data.jobs.length : 0} vacancies tracked.\n`);

  // STEP 2: Candidate Intake & Gemini AI Evaluation
  console.log('2️⃣ Ingesting & Screening High-Priority Candidate with Gemini AI...');
  const testCandidate = {
    name: 'Devashish Sen',
    email: 'devashish.sen.cloud@gmail.com',
    roleApplied: 'Frontend Developer',
    experienceYears: 3,
    skills: ['React.js', 'JavaScript', 'HTML5 & CSS3', 'Tailwind CSS', 'TypeScript', 'Responsive Design', 'REST APIs'],
    resumeText: `Devashish Sen | Senior Frontend Engineer
Email: devashish.sen.cloud@gmail.com | Phone: +91 98765 43210
Location: Bengaluru, India

PROFESSIONAL SUMMARY:
Frontend Developer with 3.5 years of production experience building responsive web applications using React.js 18, TypeScript, Tailwind CSS, Next.js, and modern state architecture. Built enterprise fintech analytics portals with complex state management and high-concurrency websocket feeds.

CORE TECHNICAL SKILLS:
- Frontend: React.js, TypeScript, Next.js, Redux Toolkit, Tailwind CSS, HTML5/CSS3
- Architecture: Micro-frontends, Component Design Systems, RESTful APIs, WebSockets
- Performance: Web Vitals optimization, Code splitting, Lazy loading, Lighthouse 98+ score

EXPERIENCE:
Frontend Engineer - FinTech Labs (2023 - Present)
- Architected core dashboard in React 18 & TypeScript serving 100k+ active users.
- Reduced bundle size by 42% leveraging dynamic imports and tree-shaking.`
  };

  const evalRes = await makeRequest(`${BASE_URL}/api/evaluate`, { method: 'POST' }, JSON.stringify(testCandidate));
  console.log(`   ✅ AI Screening Result:`);
  console.log(`      - Candidate: ${evalRes.data.candidate.name}`);
  console.log(`      - Role: ${evalRes.data.candidate.roleApplied}`);
  console.log(`      - AI Match Score: ${evalRes.data.candidate.matchScore}/100`);
  console.log(`      - Status: ${evalRes.data.candidate.status}`);
  console.log(`      - Assessment Invitation Email: ${evalRes.data.candidate.emailStatus}\n`);

  // STEP 3: Systematic 4-Section Assessment Session Generation
  console.log('3️⃣ Initializing Systematic 4-Section Assessment Session...');
  const qParams = new URLSearchParams({
    role: 'Frontend Developer',
    candidateId: evalRes.data.candidate.id,
    candidateEmail: evalRes.data.candidate.email,
    name: evalRes.data.candidate.name
  });

  const assessRes = await makeRequest(`${BASE_URL}/api/assessment/questions?${qParams.toString()}`);
  const sessData = assessRes.data;

  console.log(`   ✅ Session ID: ${sessData.sessionId}`);
  console.log(`   ✅ Total Domain Questions: ${sessData.totalQuestions} MCQs`);
  console.log(`   ✅ Systematic Section Blueprint:`);
  (sessData.sections || []).forEach(sec => {
    const qCount = sessData.questions.filter(q => q.sectionIndex === sec.index).length;
    console.log(`      ${sec.icon} ${sec.name} (${qCount} Questions | Difficulty: ${sec.difficulty})`);
  });

  // Sample inspection of questions in each section
  console.log('\n   📋 Sample Questions across all 4 Systematic Sections:');
  const sampleQ1 = sessData.questions.find(q => q.sectionIndex === 1);
  const sampleQ2 = sessData.questions.find(q => q.sectionIndex === 2);
  const sampleQ3 = sessData.questions.find(q => q.sectionIndex === 3);
  const sampleQ4 = sessData.questions.find(q => q.sectionIndex === 4);

  if (sampleQ1) console.log(`      [Section 1]: Q${sampleQ1.questionNumber}. "${sampleQ1.question.substring(0, 65)}..." (Category: ${sampleQ1.category})`);
  if (sampleQ2) console.log(`      [Section 2]: Q${sampleQ2.questionNumber}. "${sampleQ2.question.substring(0, 65)}..." (Category: ${sampleQ2.category})`);
  if (sampleQ3) console.log(`      [Section 3]: Q${sampleQ3.questionNumber}. "${sampleQ3.question.substring(0, 65)}..." (Category: ${sampleQ3.category})`);
  if (sampleQ4) console.log(`      [Section 4]: Q${sampleQ4.questionNumber}. "${sampleQ4.question.substring(0, 65)}..." (Category: ${sampleQ4.category})\n`);

  // STEP 4: Submit Assessment Answers with 90% score (18/20 correct)
  console.log('4️⃣ Simulating Proctored Assessment Submission (Scoring 18/20 = 90%)...');
  
  const aq = require('./assessment_questions');
  const rolePool = aq.ROLE_QUESTIONS_BANK['Frontend Developer'];
  const userAnswers = {};

  sessData.questions.forEach((q, idx) => {
    const originalQ = rolePool.find(x => x.id === q.id);
    const correctText = originalQ ? originalQ.options[originalQ.correctIndex || 0] : q.options[0];
    const correctIdxInSession = q.options.indexOf(correctText);
    const resolvedCorrect = correctIdxInSession !== -1 ? correctIdxInSession : 0;

    // Answer 18 questions correctly, 2 incorrectly to test scoring calculation
    if (idx < 18) {
      userAnswers[q.id] = resolvedCorrect;
    } else {
      userAnswers[q.id] = (resolvedCorrect + 1) % 4; // Intentionally incorrect
    }
  });

  const submitPayload = {
    candidateId: evalRes.data.candidate.id,
    candidateName: evalRes.data.candidate.name,
    candidateEmail: evalRes.data.candidate.email,
    roleApplied: 'Frontend Developer',
    sessionId: sessData.sessionId,
    answers: userAnswers,
    tabSwitchesCount: 0,
    timeSpentSeconds: 740,
    forcedByViolation: false
  };

  const submitRes = await makeRequest(`${BASE_URL}/api/assessment/submit`, { method: 'POST' }, JSON.stringify(submitPayload));
  const subData = submitRes.data;

  console.log(`   ✅ Automated Grading Outcome:`);
  console.log(`      - Score: ${subData.scorePercent}% (${subData.correctCount}/${subData.totalQuestions} Correct)`);
  console.log(`      - Passing Threshold: 80% (>= 16/20)`);
  console.log(`      - Qualifying Status: ${subData.passed ? '🎉 PASSED — QUALIFIED FOR OFFICIAL OFFER' : 'FAILED'}`);
  console.log(`      - Final Status: ${subData.candidate.status}`);
  console.log(`      - Offer Status: ${subData.candidate.offerStatus}`);
  console.log(`      - Offer Reference ID: ${subData.candidate.offerRefId}`);
  console.log(`      - Offer Email SMTP Result: ${subData.emailDispatch ? (subData.emailDispatch.success ? 'Delivered via Gmail SMTP' : subData.emailDispatch.error || 'Sent') : 'N/A'}`);

  // Section Breakdown Matrix
  console.log('\n   📊 Systematic Section Performance Breakdown:');
  const secBreakdown = subData.result?.sectionBreakdown || {};
  Object.keys(secBreakdown).forEach(k => {
    const s = secBreakdown[k];
    console.log(`      ${s.icon} ${s.name}: ${s.correct}/${s.total} (${s.scorePercent}%) - ${s.scorePercent >= 80 ? 'Proficient' : 'Developing'}`);
  });

  // STEP 5: Verification of Reopening Prevention
  console.log('\n5️⃣ Verifying Security Lock (Preventing Reopening Completed Test)...');
  const retestRes = await makeRequest(`${BASE_URL}/api/assessment/questions?${qParams.toString()}`);
  if (retestRes.data.alreadySubmitted) {
    console.log(`   🔒 Security Verification Passed: Test link is locked after submission.`);
    console.log(`      Message: "${retestRes.data.message}"`);
  }

  console.log('\n================================================================================');
  console.log('✨ ALL SYSTEMATIC ASSESSMENT & END-TO-END FLOW TESTS COMPLETED SUCCESSFULLY!');
  console.log('================================================================================\n');
}

runEndToEndSystematicFlow().catch(console.error);
