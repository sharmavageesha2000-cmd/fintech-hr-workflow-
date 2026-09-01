require('dotenv').config();
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { generateOfficialCallLetterHtml } = require('./gemini_evaluator');

const CANDIDATES_FILE = path.join(__dirname, 'data', 'candidates.json');

async function resendCallLetter() {
  console.log('🚀 Re-issuing Call Letter with exact decided CTC: ₹9,50,000 per annum...');

  const candidates = JSON.parse(fs.readFileSync(CANDIDATES_FILE, 'utf8'));
  const candidate = candidates.find(c => c.name.includes('Rohan') && c.roleApplied.includes('Full Stack'));

  if (!candidate) {
    console.error('Candidate not found.');
    return;
  }

  const offerRefId = `FINOVA-OFFER-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const decidedCtc = '₹9,50,000 per annum (Full-Time)';
  const joiningDate = 'Monday, 14 September 2026';
  const workMode = 'Hybrid (Bangalore / Remote Flexibility)';

  const callLetterHtml = generateOfficialCallLetterHtml({
    candidateName: candidate.name,
    roleApplied: candidate.roleApplied,
    joiningDate,
    ctcPackage: decidedCtc,
    reportingTo: 'Vageesha Sharma (Founder & Hiring Lead)',
    workMode,
    offerRefId
  });

  const subject = `🎉 Revised Official Job Offer & Call Letter: ${candidate.roleApplied} - Finova Technologies`;

  // Send via Gmail SMTP
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'sharmavageesha2000@gmail.com',
      pass: 'qoyolivxrkuqxmkx'
    }
  });

  const info = await transporter.sendMail({
    from: '"Vageesha Sharma • Talent Acquisition" <sharmavageesha2000@gmail.com>',
    to: candidate.email,
    subject,
    html: callLetterHtml
  });

  console.log(`✅ Corrected Call Letter Dispatched! Message-ID: ${info.messageId}`);

  // Update candidate record
  candidate.offerStatus = 'OFFER_EXTENDED';
  candidate.interviewStatus = 'COMPLETED';
  candidate.offerRefId = offerRefId;
  candidate.callLetterSentAt = new Date().toISOString();
  candidate.callLetterDetails = {
    joiningDate,
    ctcPackage: decidedCtc,
    offerRefId,
    emailDispatch: { success: true, messageId: info.messageId }
  };

  fs.writeFileSync(CANDIDATES_FILE, JSON.stringify(candidates, null, 2), 'utf8');
  console.log('✅ Candidate record updated with ₹9,50,000 compensation.');
}

resendCallLetter().catch(console.error);
