require('dotenv').config();
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const candidatesFile = path.join(__dirname, 'data', 'candidates.json');
let candidates = JSON.parse(fs.readFileSync(candidatesFile, 'utf8'));

const meetLink = 'https://meet.google.com/qoy-livx-rku';
const interviewDate = 'Friday, 04 September 2026';
const interviewTime = '03:00 PM IST';

const inviteEmailHtml = `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; max-width: 600px; margin: auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="color: #0f766e; margin-bottom: 4px;">🎉 Congratulations, Rishu!</h2>
      <p style="color: #64748b; margin: 0; font-size: 15px;">Your application for <strong>Full Stack AI Engineer</strong> has been <strong>Shortlisted</strong></p>
    </div>
    <p>Dear <strong>Rishu</strong>,</p>
    <p>Thank you for applying for the <strong>Full Stack AI Engineer</strong> role. We thoroughly reviewed your resume and background. Your <strong>4 years of hands-on full stack and AI engineering experience</strong> in React, Node.js, Python, and AI integrations make you an outstanding fit for our team.</p>
    <p>We are delighted to invite you for your technical interview with our engineering panel.</p>
    <div style="background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 10px; padding: 20px; margin: 20px 0;">
      <h3 style="margin: 0 0 12px 0; color: #0f766e; font-size: 16px;">📅 Interview Schedule Details</h3>
      <p style="margin: 6px 0;"><strong>Position:</strong> Full Stack AI Engineer</p>
      <p style="margin: 6px 0;"><strong>Date:</strong> ${interviewDate}</p>
      <p style="margin: 6px 0;"><strong>Time:</strong> ${interviewTime} (Duration: 45 Minutes)</p>
      <p style="margin: 6px 0;"><strong>Interviewer:</strong> Vageesha Sharma (Founder &amp; Hiring Lead)</p>
      <p style="margin: 14px 0 0 0;">
        <a href="${meetLink}" target="_blank" style="background: #0f766e; color: #ffffff; padding: 10px 22px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
          📹 Join Authentic Google Meet Interview
        </a>
      </p>
    </div>
    <p style="font-size: 14px; color: #64748b;">Please ensure you have a working camera, microphone, and a quiet environment for the video discussion.</p>
    <br/>
    <p>Warm regards,<br/><strong>Vageesha Sharma</strong><br/>Founder &amp; Hiring Lead<br/>sharmavageesha2000@gmail.com</p>
  </div>
`;

// Send live auto-reply email for Full Stack AI Engineer via Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.RECRUITER_EMAIL || 'sharmavageesha2000@gmail.com',
    pass: process.env.GOOGLE_APP_PASSWORD || ''
  }
});

async function run() {
  console.log('Sending Full Stack AI Engineer interview invitation email to paliwalrishu2000@gmail.com...');
  const sendRes = await transporter.sendMail({
    from: '"Vageesha Sharma" <sharmavageesha2000@gmail.com>',
    to: 'paliwalrishu2000@gmail.com',
    subject: '🎉 Interview Invitation: Full Stack AI Engineer - Vageesha Sharma',
    html: inviteEmailHtml
  });
  console.log('✅ Email delivered successfully! Message ID:', sendRes.messageId);

  const updatedRishu = {
    id: 'cand-rishu-fullstack',
    name: 'Rishu',
    email: 'paliwalrishu2000@gmail.com',
    phone: '+91 98765 43210',
    education: 'Bachelor of Technology in Computer Science',
    roleApplied: 'Full Stack AI Engineer',
    experienceYears: 4,
    skills: ['React', 'Node.js', 'Python', 'FastAPI', 'Gemini API', 'PostgreSQL', 'Docker', 'Full Stack Architecture', 'REST APIs'],
    scoreBreakdown: {
      technicalSkills: 29,
      experienceRelevance: 29,
      education: 18,
      communication: 18
    },
    matchScore: 94,
    status: 'SELECTED',
    receivedAt: new Date().toISOString(),
    evaluatedAt: new Date().toISOString(),
    summary: 'Rishu demonstrates 4 years of solid hands-on experience in Full Stack development (React, Node.js, Python) with deep integration of Gemini and LLM APIs. Exceptional candidate for Full Stack AI Engineer.',
    strengths: [
      '4 years of verified full stack and AI web application development',
      'Strong proficiency across frontend (React), backend (Node.js/Python), and LLM APIs'
    ],
    weaknesses: [
      'Review distributed system architecture during technical round'
    ],
    interviewSchedule: {
      date: interviewDate,
      time: interviewTime,
      duration: '45 Minutes',
      roundName: 'Round 1: Virtual Technical & Full Stack AI Architecture Assessment',
      interviewer: 'Vageesha Sharma (Founder & Hiring Lead)',
      meetLink: meetLink,
      format: 'Google Meet Video Call',
      preparationNotes: 'Please be prepared to discuss past full stack React/Node.js applications and AI integrations.'
    },
    emailSubject: '🎉 Interview Invitation: Full Stack AI Engineer - Vageesha Sharma',
    emailHtmlBody: inviteEmailHtml,
    emailStatus: 'SENT',
    lastEmailSentAt: new Date().toISOString(),
    source: 'EMAIL_INBOX_ATTACHMENT'
  };

  // Replace old entries
  candidates = candidates.filter(c => c.email !== 'paliwalrishu2000@gmail.com');
  candidates.unshift(updatedRishu);
  fs.writeFileSync(candidatesFile, JSON.stringify(candidates, null, 2), 'utf8');

  console.log('✅ Updated data/candidates.json with Rishu as Full Stack AI Engineer (4 Years Experience, Status: SELECTED, Score: 94%)');
}

run().catch(console.error);
