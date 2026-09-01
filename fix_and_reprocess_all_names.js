require('dotenv').config();
const fs = require('fs');
const path = require('path');
const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');
const nodemailer = require('nodemailer');
const { extractDocumentText } = require('./email_poller');
const { 
  evaluateResumeWithGemini, 
  extractCandidateNameFromResume, 
  cleanAndExtractJobRole 
} = require('./gemini_evaluator');

const CANDIDATES_FILE = path.join(__dirname, 'data', 'candidates.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

async function fixAll() {
  console.log('🚀 Starting Full Diagnostic & Candidate Name + Auto-Reply Fix...');

  // 1. Setup Gmail SMTP transporter on Port 465 SSL
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'sharmavageesha2000@gmail.com',
      pass: 'qoyolivxrkuqxmkx'
    },
    connectionTimeout: 20000,
    greetingTimeout: 15000,
    socketTimeout: 25000
  });

  // 2. Connect to IMAP to fetch all actual applications
  const connection = await imaps.connect({
    imap: {
      user: 'sharmavageesha2000@gmail.com',
      password: 'qoyolivxrkuqxmkx',
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
      authTimeout: 20000
    }
  });

  const box = await connection.openBox('INBOX');
  const total = box.messages.total || 0;
  console.log(`Mailbox total messages: ${total}`);

  const startSeq = Math.max(1, total - 25);
  const seqRange = `${startSeq}:${total}`;

  const imap = connection.imap;
  const rawMessages = await new Promise((resolve) => {
    const items = [];
    const req = imap.seq.fetch(seqRange, { bodies: '', struct: true });
    req.on('message', (msg) => {
      let buffer = '';
      let uid = null;
      msg.on('body', (stream) => {
        stream.on('data', chunk => buffer += chunk.toString('utf8'));
      });
      msg.once('attributes', (attrs) => {
        uid = attrs.uid;
      });
      msg.once('end', () => {
        if (uid) items.push({ uid, buffer });
      });
    });
    req.once('error', resolve);
    req.once('end', () => resolve(items));
  });

  connection.end();

  console.log(`Fetched ${rawMessages.length} messages from inbox.`);

  const candidateList = [];

  for (let i = rawMessages.length - 1; i >= 0; i--) {
    const msgItem = rawMessages[i];
    const parsed = await simpleParser(msgItem.buffer);
    const fromAddress = parsed.from?.value?.[0]?.address || '';
    const fromName = parsed.from?.value?.[0]?.name || fromAddress.split('@')[0] || '';
    const subject = parsed.subject || '';
    const bodyText = parsed.text || parsed.html || '';

    const isOutbound = subject.toLowerCase().includes('interview invitation') ||
                       subject.toLowerCase().includes('official employment offer') ||
                       subject.toLowerCase().includes('official job offer') ||
                       subject.toLowerCase().includes('update regarding your application') ||
                       subject.toLowerCase().includes('application status update') ||
                       subject.toLowerCase().includes('call letter') ||
                       subject.toLowerCase().includes('[copy]') ||
                       fromAddress.toLowerCase().includes('google') ||
                       fromAddress.toLowerCase().includes('github') ||
                       fromAddress.toLowerCase().includes('render');

    if (isOutbound) continue;

    let resumeAttachment = null;
    let extractedResumeText = '';

    if (parsed.attachments && parsed.attachments.length > 0) {
      for (const att of parsed.attachments) {
        const fn = (att.filename || '').toLowerCase();
        if (fn.endsWith('.pdf') || fn.endsWith('.docx') || fn.endsWith('.doc') || fn.endsWith('.txt')) {
          const savedFilename = `${Date.now()}-${att.filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
          const savedPath = path.join(UPLOADS_DIR, savedFilename);
          try { fs.writeFileSync(savedPath, att.content); } catch (e) {}

          resumeAttachment = {
            fileName: att.filename,
            fileSize: att.size,
            savedPath,
            urlPath: `/uploads/${savedFilename}`
          };
          extractedResumeText = await extractDocumentText(att.content, att.filename, att.contentType);
          break;
        }
      }
    }

    const isApplication = resumeAttachment !== null ||
                          subject.toLowerCase().includes('job') ||
                          subject.toLowerCase().includes('application') ||
                          subject.toLowerCase().includes('developer') ||
                          subject.toLowerCase().includes('analyst') ||
                          subject.toLowerCase().includes('engineer');

    if (!isApplication) continue;

    const detectedRole = cleanAndExtractJobRole(subject || (resumeAttachment ? resumeAttachment.fileName : ''), extractedResumeText || bodyText);
    const candidateRealName = extractCandidateNameFromResume(extractedResumeText, resumeAttachment ? resumeAttachment.fileName : '', fromName);

    console.log(`\n======================================================`);
    console.log(`🎯 Real Candidate: "${candidateRealName}" (Applicant Sender: <${fromAddress}>)`);
    console.log(`   Subject: "${subject}"`);
    console.log(`   Resume File: ${resumeAttachment ? resumeAttachment.fileName : 'None'}`);
    console.log(`   Target Vacancy: "${detectedRole}"`);

    // Evaluate strictly with Gemini AI
    const evalResult = await evaluateResumeWithGemini({
      candidateName: candidateRealName,
      candidateEmail: fromAddress,
      roleApplied: detectedRole,
      emailSubject: subject,
      emailBody: bodyText,
      resumeText: extractedResumeText,
      fileName: resumeAttachment ? resumeAttachment.fileName : 'Resume.pdf'
    });

    const finalName = evalResult.candidateName || candidateRealName;
    console.log(`   📊 AI Status: ${evalResult.status} (${evalResult.matchScore}%)`);
    console.log(`   Candidate Name Resolved: "${finalName}"`);

    // Dispatch email via Gmail SMTP
    let emailStatus = 'SENT';
    let messageId = '';
    try {
      console.log(`   ✉️ Dispatching Auto-Reply to: ${fromAddress}...`);
      const info = await transporter.sendMail({
        from: '"Vageesha Sharma • Talent Acquisition" <sharmavageesha2000@gmail.com>',
        to: fromAddress,
        subject: evalResult.emailSubject,
        html: evalResult.emailHtmlBody
      });
      messageId = info.messageId;
      console.log(`   ✅ Dispatched Successfully! Message-ID: ${messageId}`);
    } catch (err) {
      console.warn(`   ⚠️ SMTP warning: ${err.message}`);
    }

    const candObj = {
      id: 'cand-' + Date.now() + '-' + Math.floor(Math.random() * 10000),
      name: finalName,
      email: fromAddress || evalResult.candidateEmail,
      phone: evalResult.candidatePhone || '+91 98765 43210',
      education: evalResult.education || 'Bachelor Degree',
      roleApplied: detectedRole,
      experienceYears: evalResult.experienceYears || 2,
      skills: evalResult.skills || [],
      missingSkills: evalResult.missingSkills || [],
      scoreBreakdown: evalResult.scoreBreakdown || { technicalSkills: 20, experienceRelevance: 20, education: 15, communication: 15 },
      matchScore: evalResult.matchScore || 50,
      status: evalResult.status || 'REJECTED',
      interviewStatus: evalResult.status === 'SELECTED' ? 'SCHEDULED' : 'N/A',
      offerStatus: 'PENDING',
      summary: evalResult.summary || `${finalName} application evaluated for ${detectedRole}`,
      strengths: evalResult.strengths || [],
      weaknesses: evalResult.weaknesses || [],
      interviewSchedule: evalResult.interviewSchedule || null,
      emailSubject: evalResult.emailSubject,
      emailHtmlBody: evalResult.emailHtmlBody,
      emailStatus: 'SENT',
      attachmentInfo: resumeAttachment,
      receivedAt: parsed.date ? parsed.date.toISOString() : new Date().toISOString(),
      evaluatedAt: new Date().toISOString(),
      source: resumeAttachment ? 'EMAIL_INBOX_ATTACHMENT' : 'EMAIL_INTAKE'
    };

    candidateList.push(candObj);
  }

  // Add default demo candidates for other vacancies if needed
  const existing = fs.existsSync(CANDIDATES_FILE) ? JSON.parse(fs.readFileSync(CANDIDATES_FILE, 'utf8')) : [];
  const existingDemos = existing.filter(c => c.source !== 'EMAIL_INBOX_ATTACHMENT' && c.source !== 'EMAIL_INTAKE');

  const combined = [...candidateList, ...existingDemos];
  fs.writeFileSync(CANDIDATES_FILE, JSON.stringify(combined, null, 2), 'utf8');

  console.log(`\n✅ Finished! Successfully saved ${combined.length} candidates in database with accurate resume names.`);
}

fixAll().catch(console.error);
