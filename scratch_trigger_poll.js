require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { pollCandidateEmails } = require('./email_poller');
const nodemailer = require('nodemailer');

const DATA_DIR = path.join(__dirname, 'data');
const CANDIDATES_FILE = path.join(DATA_DIR, 'candidates.json');
const PROCESSED_FILE = path.join(DATA_DIR, 'processed_emails.json');

// Remove UIDs 5395, 5398, 5399 from processed list so they get picked up
let list = JSON.parse(fs.readFileSync(PROCESSED_FILE, 'utf8'));
list = list.filter(uid => !['5395', '5398', '5399'].includes(String(uid)));
fs.writeFileSync(PROCESSED_FILE, JSON.stringify(list, null, 2), 'utf8');
console.log('Reset processed_emails.json to allow re-processing of latest candidates.');

async function runTestPoll() {
  console.log('🚀 Running test poll on INBOX...');
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sharmavageesha2000@gmail.com',
      pass: 'qoyolivxrkuqxmkx'
    }
  });

  const res = await pollCandidateEmails({
    email: 'sharmavageesha2000@gmail.com',
    password: 'qoyolivxrkuqxmkx',
    checkLatestCount: 15,
    onCandidateProcessed: async (newCand) => {
      console.log(`\n========================================`);
      console.log(`🎯 ON CANDIDATE PROCESSED: ${newCand.name} (${newCand.email})`);
      console.log(`Role Applied: ${newCand.roleApplied}`);
      console.log(`Status: ${newCand.status}`);
      console.log(`Match Score: ${newCand.matchScore}`);
      console.log(`Attachment: ${newCand.attachmentInfo ? newCand.attachmentInfo.fileName : 'None'}`);
      console.log(`Dispatching auto-reply to: ${newCand.email}...`);

      try {
        const sendInfo = await transporter.sendMail({
          from: '"Vageesha Sharma (Talent Acquisition)" <sharmavageesha2000@gmail.com>',
          to: newCand.email,
          subject: newCand.emailSubject,
          html: newCand.emailHtmlBody
        });
        console.log(`✅ Auto-reply email delivered! Message-ID: ${sendInfo.messageId}`);
        newCand.emailStatus = 'SENT';
      } catch (err) {
        console.error(`❌ Auto-reply delivery error:`, err.message);
        newCand.emailStatus = 'FAILED';
      }

      // Save to candidates.json
      let candidates = [];
      if (fs.existsSync(CANDIDATES_FILE)) {
        try { candidates = JSON.parse(fs.readFileSync(CANDIDATES_FILE, 'utf8')); } catch(e) {}
      }
      const existingIdx = candidates.findIndex(c => (c.email && c.email.toLowerCase().trim() === newCand.email.toLowerCase().trim()));
      if (existingIdx !== -1) {
        candidates[existingIdx] = newCand;
        console.log(`🔄 Updated candidate in candidates.json`);
      } else {
        candidates.unshift(newCand);
        console.log(`✅ Added new candidate to candidates.json`);
      }
      fs.writeFileSync(CANDIDATES_FILE, JSON.stringify(candidates, null, 2), 'utf8');
    }
  });

  console.log('\nPoll result:', JSON.stringify(res, null, 2));
}

runTestPoll().catch(console.error);
