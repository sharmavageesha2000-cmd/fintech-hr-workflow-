const http = require('http');

function postJson(url, payload) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const data = JSON.stringify(payload);
    const req = http.request({
      hostname: u.hostname,
      port: u.port || 3000,
      path: u.pathname + u.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve({ raw: body });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve({ raw: body });
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('1. Candidate applies for "Full Stack AI Engineer" and opens test...');
  const qData = await getJson('http://localhost:3000/api/assessment/questions?role=Full%20Stack%20AI%20Engineer');
  console.log(`- Session ID: ${qData.sessionId}`);
  console.log(`- Loaded ${qData.questions.length} questions.`);

  // Let's test solving the questions using known options:
  // For each question in qData.questions, find which option is correct by matching the master bank
  const { ROLE_QUESTIONS_BANK } = require('./assessment_questions');
  const fullstackBank = ROLE_QUESTIONS_BANK['Full Stack AI Engineer'];

  const answers = {};
  qData.questions.forEach((q, idx) => {
    // find original question in bank
    const originalQ = fullstackBank.find(item => item.id === q.id);
    if (originalQ) {
      const correctText = originalQ.options[originalQ.correctIndex];
      // find index of correctText in this session's shuffled q.options
      const matchedIdx = q.options.indexOf(correctText);
      if (idx < 19) {
        answers[q.id] = matchedIdx; // Answer correctly
      } else {
        answers[q.id] = (matchedIdx + 1) % 4; // 1 incorrect
      }
    }
  });

  console.log('\n2. Submitting 19/20 correct answers (95% score)...');
  const submitRes = await postJson('http://localhost:3000/api/assessment/submit', {
    candidateId: 'cand-offer-' + Date.now(),
    candidateName: 'Vageesha Sharma',
    candidateEmail: 'sharmavageesha2000@gmail.com',
    roleApplied: 'Full Stack AI Engineer',
    sessionId: qData.sessionId,
    answers,
    tabSwitchesCount: 0,
    timeSpentSeconds: 540,
    forcedByViolation: false
  });

  console.log('\n3. Verification Result:');
  console.log('- Passed:', submitRes.passed);
  console.log('- Score:', submitRes.scorePercent + '%');
  console.log('- Correct Answers:', `${submitRes.correctCount} / ${submitRes.totalQuestions}`);
  console.log('- Verdict:', submitRes.verdict);
  console.log('- Candidate Record:', submitRes.candidate.name, '| Score:', submitRes.candidate.testScore, '| Status:', submitRes.candidate.status);
  console.log('- Offer Ref ID:', submitRes.candidate.offerRefId);
  console.log('- SMTP Dispatch:', submitRes.emailDispatched);
}

main().catch(console.error);
