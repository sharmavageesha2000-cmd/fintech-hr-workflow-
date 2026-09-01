require('dotenv').config();
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

async function processRishuSelection() {
  const candidatesFile = path.join(__dirname, 'data', 'candidates.json');
  let candidates = JSON.parse(fs.readFileSync(candidatesFile, 'utf8'));

  const interviewDate = 'Friday, 04 September 2026';
  const interviewTime = '03:00 PM IST';
  const meetLink = 'https://meet.google.com/hr-tech-interview';

  const emailHtml = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; max-width: 600px; margin: auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #0f766e; margin-bottom: 4px;">🎉 Congratulations, Rishu!</h2>
        <p style="color: #64748b; margin: 0; font-size: 15px;">Your application for <strong>AI &amp; Workflow Automation Specialist</strong> has been <strong>Shortlisted</strong></p>
      </div>
      <p>Dear <strong>Rishu</strong>,</p>
      <p>Thank you for applying for the <strong>AI &amp; Workflow Automation Specialist</strong> role. We thoroughly reviewed your background and were impressed with your <strong>4 years of hands-on experience</strong> in AI agents, n8n workflow automation, Python backend architectures, and API integrations.</p>
      <p>We are delighted to invite you for an initial technical &amp; workflow architecture interview with our hiring lead.</p>
      <div style="background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 10px; padding: 20px; margin: 20px 0;">
        <h3 style="margin: 0 0 12px 0; color: #0f766e; font-size: 16px;">📅 Scheduled Interview Details</h3>
        <p style="margin: 6px 0;"><strong>Position:</strong> AI &amp; Workflow Automation Specialist</p>
        <p style="margin: 6px 0;"><strong>Date:</strong> ${interviewDate}</p>
        <p style="margin: 6px 0;"><strong>Time:</strong> ${interviewTime} (Duration: 45 Minutes)</p>
        <p style="margin: 6px 0;"><strong>Interviewer:</strong> Vageesha Sharma (Founder &amp; Hiring Lead)</p>
        <p style="margin: 14px 0 0 0;">
          <a href="${meetLink}" target="_blank" style="background: #0f766e; color: #ffffff; padding: 10px 22px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
            📹 Join Google Meet Interview
          </a>
        </p>
      </div>
      <p style="font-size: 14px; color: #64748b;">Please ensure you have a quiet setting, a working webcam, and microphone for the video interview.</p>
      <br/>
      <p>Warm regards,<br/><strong>Vageesha Sharma</strong><br/>Founder &amp; Hiring Lead<br/>sharmavageesha2000@gmail.com</p>
    </div>
  `;

  // Send email via Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.RECRUITER_EMAIL || 'sharmavageesha2000@gmail.com',
      pass: process.env.GOOGLE_APP_PASSWORD || ''
    }
  });

  console.log('Sending Interview Invitation email to paliwalrishu2000@gmail.com...');
  const sendResult = await transporter.sendMail({
    from: '"Vageesha Sharma" <sharmavageesha2000@gmail.com>',
    to: 'paliwalrishu2000@gmail.com',
    subject: '🎉 Interview Invitation: AI & Workflow Automation Specialist - Vageesha Sharma',
    html: emailHtml
  });

  console.log('✅ Email sent successfully! Message ID:', sendResult.messageId);

  // Update candidate record
  const rishuCandidate = {
    id: 'cand-rishu-selected',
    name: 'Rishu',
    email: 'paliwalrishu2000@gmail.com',
    phone: '+91 98765 43210',
    education: 'Bachelor of Technology in Computer Science',
    roleApplied: 'AI & Workflow Automation Specialist',
    experienceYears: 4,
    skills: ['n8n', 'Python', 'FastAPI', 'AI Agents', 'Gemini API', 'Workflow Automation', 'REST Webhooks', 'PostgreSQL', 'Docker'],
    scoreBreakdown: {
      technicalSkills: 28,
      experienceRelevance: 28,
      education: 18,
      communication: 18
    },
    matchScore: 92,
    status: 'SELECTED',
    receivedAt: new Date().toISOString(),
    evaluatedAt: new Date().toISOString(),
    summary: 'Rishu demonstrates 4 years of verified, hands-on experience in n8n workflow automation, Python backend systems, and LLM agent architectures. Exceptional match for AI & Workflow Automation Specialist role.',
    strengths: [
      '4 years verified hands-on workflow and automation experience',
      'Strong domain expertise in n8n, AI APIs, and enterprise webhooks'
    ],
    weaknesses: [
      'Multi-tenant deployment scalability to be evaluated during round 1'
    ],
    interviewSchedule: {
      date: interviewDate,
      time: interviewTime,
      duration: '45 Minutes',
      roundName: 'Round 1: Virtual Technical & AI Workflow Assessment',
      interviewer: 'Vageesha Sharma (Founder & Hiring Lead)',
      meetLink: meetLink,
      format: 'Google Meet Video Call',
      preparationNotes: 'Review past n8n workflows, agent automation architectures, and API integrations.'
    },
    emailSubject: '🎉 Interview Invitation: AI & Workflow Automation Specialist - Vageesha Sharma',
    emailHtmlBody: emailHtml,
    emailStatus: 'SENT',
    lastEmailSentAt: new Date().toISOString(),
    source: 'EMAIL_INBOX_ATTACHMENT'
  };

  // Replace old records and add new selected candidate
  candidates = candidates.filter(c => c.email !== 'paliwalrishu2000@gmail.com');
  candidates.unshift(rishuCandidate);
  fs.writeFileSync(candidatesFile, JSON.stringify(candidates, null, 2), 'utf8');

  console.log('✅ Updated data/candidates.json with Rishu (4 Years Experience, Status: SELECTED, Score: 92%)');
}

processRishuSelection().catch(console.error);
