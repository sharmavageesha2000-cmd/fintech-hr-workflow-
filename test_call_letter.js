require('dotenv').config();
const http = require('http');

async function testCallLetter() {
  console.log('Testing Call Letter API endpoint...');

  // 1. Get shortlisted candidate ID
  const candidatesRes = await new Promise(resolve => {
    http.get('http://localhost:3000/api/candidates', res => {
      let b = '';
      res.on('data', d => b += d);
      res.on('end', () => resolve(JSON.parse(b)));
    });
  });

  const selectedCand = candidatesRes.candidates.find(c => c.status === 'SELECTED');
  if (!selectedCand) {
    console.error('No selected candidate found to issue call letter.');
    return;
  }

  console.log(`Found candidate: "${selectedCand.name}" (${selectedCand.roleApplied}) [ID: ${selectedCand.id}] [Email: ${selectedCand.email}]`);

  // 2. Post to complete-interview / issue call letter endpoint
  const payload = JSON.stringify({
    ctcPackage: '₹14,50,000 per annum (Full-Time)',
    joiningDate: 'Monday, 14 September 2026',
    workMode: 'Hybrid (Bangalore / Remote Flexibility)',
    customNote: 'Welcome to Finova Technologies!'
  });

  const req = http.request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/candidates/${selectedCand.id}/complete-interview`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  }, res => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => {
      console.log('HTTP Status:', res.statusCode);
      try {
        const result = JSON.parse(body);
        console.log('Call Letter API Result:', result);
        console.log('Email Dispatch Success:', result.dispatchResult?.success);
        console.log('Email Message ID:', result.dispatchResult?.messageId);
        console.log('Candidate Offer Status:', result.candidate?.offerStatus);
      } catch(e) {
        console.log('Body:', body);
      }
    });
  });

  req.on('error', console.error);
  req.write(payload);
  req.end();
}

testCallLetter().catch(console.error);
