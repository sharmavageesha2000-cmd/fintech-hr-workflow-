const { pollCandidateEmails } = require('./email_poller');
const nodemailer = require('nodemailer');
require('dotenv').config();

async function run() {
  console.log('Testing auto-reply dispatch on UID 5518...');
  const recruiterEmail = process.env.RECRUITER_EMAIL || 'sharmavageesha2000@gmail.com';
  const recruiterPass = (process.env.GOOGLE_APP_PASSWORD || 'qoyolivxrkuqxmkx').replace(/\s+/g, '');

  const res = await pollCandidateEmails({
    checkLatestCount: 5,
    onCandidateProcessed: async (cand) => {
      console.log('Sending auto-reply to:', cand.email, 'Subject:', cand.emailSubject);
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user: recruiterEmail, pass: recruiterPass }
      });
      const info = await transporter.sendMail({
        from: `"Vageesha Sharma (Talent Acquisition)" <${recruiterEmail}>`,
        to: cand.email,
        subject: cand.emailSubject,
        html: cand.emailHtmlBody
      });
      console.log('✅ Auto-reply successfully delivered! Message ID:', info.messageId);
    }
  });
  console.log('Poll result:', res.newlyProcessedCount, 'candidates processed.');
}

run().catch(console.error);
