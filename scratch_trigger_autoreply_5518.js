const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');
const { isLegitimateResumeDocument, extractDocumentText, saveProcessedUid } = require('./email_poller');
const { evaluateResumeWithGemini, cleanAndExtractJobRole, extractCandidateNameFromResume } = require('./gemini_evaluator');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const UPLOADS_DIR = path.join(__dirname, 'uploads');
const CANDIDATES_FILE = path.join(__dirname, 'data', 'candidates.json');

async function processCandidateUID5588() {
  console.log('🚀 Processing incoming candidate email (UID 5588)...');
  const recruiterEmail = 'sharmavageesha2000@gmail.com';
  const recruiterPass = 'qoyolivxrkuqxmkx';

  const config = {
    imap: {
      user: recruiterEmail,
      password: recruiterPass,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
      authTimeout: 25000,
      connTimeout: 25000
    }
  };

  const connection = await imaps.connect(config);
  const box = await connection.openBox('INBOX');
  const total = box.messages.total;
  console.log(`INBOX opened. Total messages: ${total}`);

  // Fetch the latest message using search by sequence range
  const messages = await connection.search([`${total}:${total}`], { bodies: [''], struct: true });
  console.log(`Found ${messages.length} message.`);

  if (messages.length === 0) {
    console.error('Message not found!');
    connection.end();
    return;
  }

  const msg = messages[0];
  const messageUid = msg.attributes.uid;
  const bodyPart = msg.parts.find(p => p.which === '');
  const rawBuffer = bodyPart ? bodyPart.body : '';

  console.log(`Fetched message UID: ${messageUid} (${rawBuffer.length} bytes)`);

  const parsedMail = await simpleParser(rawBuffer);
  console.log(`From: ${parsedMail.from?.text}`);
  console.log(`Subject: "${parsedMail.subject}"`);
  console.log(`Date: ${parsedMail.date}`);
  console.log(`Attachments: ${parsedMail.attachments ? parsedMail.attachments.length : 0}`);

  if (!parsedMail.attachments || parsedMail.attachments.length === 0) {
    console.error('No attachments found!');
    connection.end();
    return;
  }

  const att = parsedMail.attachments[0];
  console.log(`Attachment: "${att.filename}" (${att.contentType}, ${att.size} bytes)`);

  const resumeText = await extractDocumentText(att.content, att.filename, att.contentType);
  console.log(`Extracted resume text (${resumeText.length} chars):`);
  console.log(resumeText.slice(0, 300));

  const savedFilename = `${Date.now()}-${att.filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const savedPath = path.join(UPLOADS_DIR, savedFilename);
  fs.writeFileSync(savedPath, att.content);

  const resumeAttachment = {
    fileName: att.filename,
    fileSize: att.size,
    savedPath,
    urlPath: `/uploads/${savedFilename}`
  };

  const candidateRealName = extractCandidateNameFromResume(resumeText, att.filename, parsedMail.from?.value?.[0]?.name);
  const detectedRole = cleanAndExtractJobRole(parsedMail.subject, resumeText);
  let candidateEmail = parsedMail.from?.value?.[0]?.address || recruiterEmail;

  console.log(`\nEvaluating with Gemini AI: Candidate "${candidateRealName}", Role: "${detectedRole}", Email: "${candidateEmail}"...`);

  const evalResult = await evaluateResumeWithGemini({
    candidateName: candidateRealName,
    candidateEmail,
    roleApplied: detectedRole,
    emailSubject: parsedMail.subject,
    emailBody: parsedMail.text || '',
    resumeText,
    fileName: att.filename
  });

  console.log(`\nGemini AI Evaluation Result:`);
  console.log(`- Candidate Name: ${evalResult.candidateName}`);
  console.log(`- Role: ${evalResult.roleApplied}`);
  console.log(`- Match Score: ${evalResult.matchScore}/100`);
  console.log(`- Status: ${evalResult.status}`);
  console.log(`- Auto-reply Subject: "${evalResult.emailSubject}"`);

  // Dispatch Auto-Reply Email via Gmail SMTP
  console.log(`\n✉️ Sending Auto-Reply email to ${candidateEmail}...`);
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    family: 4,
    auth: { user: recruiterEmail, pass: recruiterPass }
  });

  const mailOptions = {
    from: `"Vageesha Sharma (Talent Acquisition)" <${recruiterEmail}>`,
    to: candidateEmail,
    subject: evalResult.emailSubject || `Application Update: ${detectedRole}`,
    html: evalResult.emailHtmlBody
  };

  const mailInfo = await transporter.sendMail(mailOptions);
  console.log(`✅ Auto-reply SENT successfully! Message ID: ${mailInfo.messageId}`);

  // Save candidate in candidates.json
  const newCandidate = {
    id: 'cand-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    name: evalResult.candidateName || candidateRealName,
    email: candidateEmail,
    phone: evalResult.candidatePhone || 'Not specified',
    education: evalResult.education || 'Bachelor Degree',
    roleApplied: evalResult.roleApplied || detectedRole,
    experienceYears: evalResult.experienceYears || 2,
    skills: evalResult.skills || [],
    missingSkills: evalResult.missingSkills || [],
    scoreBreakdown: evalResult.scoreBreakdown || { technicalSkills: 20, experienceRelevance: 20, education: 15, communication: 15 },
    matchScore: evalResult.matchScore || 85,
    status: evalResult.status || 'SELECTED',
    interviewStatus: evalResult.status === 'SELECTED' ? 'SCHEDULED' : 'N/A',
    offerStatus: 'PENDING',
    summary: evalResult.summary || 'Profile evaluated using Gemini AI.',
    strengths: evalResult.strengths || [],
    weaknesses: evalResult.weaknesses || [],
    interviewSchedule: evalResult.interviewSchedule || null,
    emailSubject: evalResult.emailSubject,
    emailHtmlBody: evalResult.emailHtmlBody,
    emailStatus: 'SENT',
    lastEmailSentAt: new Date().toISOString(),
    attachmentInfo: resumeAttachment,
    receivedAt: parsedMail.date ? parsedMail.date.toISOString() : new Date().toISOString(),
    evaluatedAt: new Date().toISOString(),
    source: 'EMAIL_INBOX_ATTACHMENT'
  };

  let candidatesList = [];
  if (fs.existsSync(CANDIDATES_FILE)) {
    candidatesList = JSON.parse(fs.readFileSync(CANDIDATES_FILE, 'utf8'));
  }
  candidatesList.unshift(newCandidate);
  fs.writeFileSync(CANDIDATES_FILE, JSON.stringify(candidatesList, null, 2), 'utf8');
  console.log(`✅ Candidate saved to database (Total records: ${candidatesList.length})`);

  saveProcessedUid(messageUid);
  connection.end();
  console.log('\n🎉 ALL DONE! Candidate processed and auto-reply delivered.');
}

processCandidateUID5588().catch(console.error);
