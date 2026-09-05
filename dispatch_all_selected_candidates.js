const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { generateOfficialCallLetterHtml } = require('./gemini_evaluator');

const CANDIDATES_FILE = path.join(__dirname, 'data', 'candidates.json');
const SETTINGS_FILE = path.join(__dirname, 'data', 'settings.json');

function getSettings() {
  let fileSettings = {};
  if (fs.existsSync(SETTINGS_FILE)) {
    try { fileSettings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8')); } catch (e) {}
  }
  return {
    recruiterEmail: process.env.RECRUITER_EMAIL || fileSettings.recruiterEmail || 'sharmavageesha2000@gmail.com',
    recruiterName: process.env.RECRUITER_NAME || fileSettings.recruiterName || 'Vageesha Sharma',
    appPassword: (process.env.GOOGLE_APP_PASSWORD || fileSettings.appPassword || 'qoyolivxrkuqxmkx').replace(/\s+/g, '')
  };
}

async function sendNotificationEmail({ to, subject, htmlBody }) {
  const settings = getSettings();
  const recruiterEmail = settings.recruiterEmail;
  const appPassword = settings.appPassword;

  const transportConfigs = [
    { service: 'gmail', family: 4, auth: { user: recruiterEmail, pass: appPassword }, tls: { rejectUnauthorized: false }, connectionTimeout: 8000 },
    { host: 'smtp.gmail.com', port: 465, secure: true, family: 4, auth: { user: recruiterEmail, pass: appPassword }, tls: { rejectUnauthorized: false }, connectionTimeout: 8000 }
  ];

  for (let i = 0; i < transportConfigs.length; i++) {
    try {
      console.log(`[SMTP Dispatch] Sending to: ${to} (Subject: "${subject}")...`);
      const transporter = nodemailer.createTransport(transportConfigs[i]);
      const info = await transporter.sendMail({
        from: `"${settings.recruiterName}" <${recruiterEmail}>`,
        to,
        subject,
        html: htmlBody
      });
      console.log(`[SMTP Dispatch] ✅ Delivered successfully! Message ID: ${info.messageId}`);
      return { success: true, messageId: info.messageId, to, subject };
    } catch (err) {
      console.warn(`[SMTP Warning] Method ${i + 1} error:`, err.message);
    }
  }
  return { success: false, error: 'All dispatch methods failed' };
}

async function run() {
  console.log('--- Checking & Dispatching Offer Letters to All Selected Candidates ---');
  if (!fs.existsSync(CANDIDATES_FILE)) {
    console.error('No candidates file found.');
    return;
  }

  const candidates = JSON.parse(fs.readFileSync(CANDIDATES_FILE, 'utf8'));
  console.log(`Found ${candidates.length} candidate records.`);

  let dispatchedCount = 0;

  for (const c of candidates) {
    const isSelected = c.status === 'SELECTED' || (c.assessmentDetails && c.assessmentDetails.passed) || c.testPassed;
    const targetEmail = (c.email || '').trim();

    if (isSelected && targetEmail && targetEmail.includes('@')) {
      const role = c.roleApplied || 'Software Engineer';
      const offerRefId = c.offerRefId || `HR-OFFER-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const ctcPackage = (role.toLowerCase().includes('senior') || role.toLowerCase().includes('lead'))
        ? '₹14,50,000 per annum (Full-Time)'
        : '₹9,50,000 per annum (Full-Time)';
      const joiningDate = 'Monday, 14 September 2026';

      const callLetterHtml = generateOfficialCallLetterHtml({
        candidateName: c.name || 'Candidate',
        roleApplied: role,
        joiningDate,
        ctcPackage,
        reportingTo: 'Vageesha Sharma (Founder & Hiring Lead)',
        workMode: 'Remote / Hybrid (Flexible Work Arrangements)',
        offerRefId
      });

      const subject = `🎉 Official Job Offer & Call Letter: ${role} - Finova Technologies`;

      console.log(`\nDispatching for Candidate: "${c.name}" (${role}) -> Email: ${targetEmail}`);
      const dispatch = await sendNotificationEmail({
        to: targetEmail,
        subject,
        htmlBody: callLetterHtml
      });

      c.offerStatus = 'OFFER_EXTENDED';
      c.offerRefId = offerRefId;
      c.callLetterSentAt = new Date().toISOString();
      c.callLetterDetails = {
        joiningDate,
        ctcPackage,
        offerRefId,
        emailDispatch: dispatch,
        deliveredTo: targetEmail
      };

      if (dispatch.success) {
        dispatchedCount++;
      }
    }
  }

  fs.writeFileSync(CANDIDATES_FILE, JSON.stringify(candidates, null, 2), 'utf8');
  console.log(`\n🎉 Completed! Successfully dispatched Offer Letters to ${dispatchedCount} selected candidates.`);
}

run().catch(console.error);
