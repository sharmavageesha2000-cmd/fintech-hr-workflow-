const https = require('https');

function makeRequest(url, method = 'GET', postData = null) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const reqOptions = {
      hostname: u.hostname,
      port: 443,
      path: u.pathname + u.search,
      method,
      headers: {
        'Accept': 'application/json'
      }
    };

    if (postData) {
      reqOptions.headers['Content-Type'] = 'application/json';
      reqOptions.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(reqOptions, (res) => {
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

async function testLiveRenderCloud() {
  console.log('1. Fetching questions from Live Render Cloud: https://hr-smartflow-automation.onrender.com ...');
  const qRes = await makeRequest('https://hr-smartflow-automation.onrender.com/api/assessment/questions?role=Business%20Analyst&name=Ananya%20Verma&email=sharmavageesha2000%40gmail.com');
  console.log('Status:', qRes.status);
  console.log('Session ID:', qRes.data?.sessionId);
  console.log('Role:', qRes.data?.role);
  console.log('Total Questions:', qRes.data?.totalQuestions);

  if (!qRes.data || !qRes.data.questions) {
    console.error('Failed to get questions from Render Cloud:', qRes);
    return;
  }

  // Answer correctly using master bank
  const { ROLE_QUESTIONS_BANK } = require('./assessment_questions');
  const baBank = ROLE_QUESTIONS_BANK['Business Analyst'];

  const answers = {};
  qRes.data.questions.forEach((q, idx) => {
    const orig = baBank.find(item => item.id === q.id);
    if (orig) {
      const correctText = orig.options[orig.correctIndex];
      const matchIdx = q.options.indexOf(correctText);
      answers[q.id] = matchIdx >= 0 ? matchIdx : 0;
    } else {
      answers[q.id] = 0;
    }
  });

  console.log('\n2. Submitting 100% score to Render Cloud for Ananya Verma (sharmavageesha2000@gmail.com)...');
  const payload = {
    candidateId: 'cand-1788538210123-101',
    candidateName: 'Ananya Verma',
    candidateEmail: 'sharmavageesha2000@gmail.com',
    roleApplied: 'Business Analyst',
    sessionId: qRes.data.sessionId,
    answers,
    tabSwitchesCount: 0,
    timeSpentSeconds: 400,
    forcedByViolation: false
  };

  const submitRes = await makeRequest('https://hr-smartflow-automation.onrender.com/api/assessment/submit', 'POST', JSON.stringify(payload));
  console.log('Render Cloud Submission Result:', submitRes);
}

testLiveRenderCloud().catch(console.error);
