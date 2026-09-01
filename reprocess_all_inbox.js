require('dotenv').config();
const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { extractDocumentText } = require('./email_poller');
const { evaluateResumeWithGemini, cleanAndExtractJobRole } = require('./gemini_evaluator');

const CANDIDATES_FILE = path.join(__dirname, 'data', 'candidates.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

function getCandidates() {
  try {
    if (fs.existsSync(CANDIDATES_FILE)) {
      return JSON.parse(fs.readFileSync(CANDIDATES_FILE, 'utf8'));
    }
  } catch (e) {}
  return [];
}

function saveCandidates(data) {
  fs.writeFileSync(CANDIDATES_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function isSystemOutboundLoop(fromAddress, subject, body) {
  const s = (subject || '').toLowerCase();
  const f = (fromAddress || '').toLowerCase();
  return s.includes('interview invitation') ||
         s.includes('official employment offer') ||
         s.includes('official job offer') ||
         s.includes('update on your application') ||
         s.includes('update regarding your application') ||
         s.includes('application status update') ||
         s.includes('call letter') ||
         s.includes('[qa automation test]') ||
         s.includes('[copy]') ||
         f.includes('linkedin.com') ||
         f.includes('naukri.com') ||
         f.includes('indeed.com') ||
         f.includes('glassdoor.com') ||
         f.includes('no-reply@accounts.google.com') ||
         f.includes('mailer-daemon') ||
         f.includes('noreply@github.com') ||
         f.includes('no-reply@render.com') ||
         f.includes('postmaster');
}

async function sendEmail({ to, subject, htmlBody }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sharmavageesha2000@gmail.com',
      pass: 'qoyolivxrkuqxmkx'
    }
  });

  const res = await transporter.sendMail({
    from: '"Vageesha Sharma • Talent Acquisition" <sharmavageesha2000@gmail.com>',
    to,
    subject,
    html: htmlBody
  });
  return res;
}

async function reprocessInbox() {
  console.log('🔄 Connecting to IMAP to re-evaluate recent applicant emails...');
  const connection = await imaps.connect({
    imap: {
      user: 'sharmavageesha2000@gmail.com',
      password: 'qoyolivxrkuqxmkx',
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
      authTimeout: 15000
    }
  });

  const box = await connection.openBox('INBOX');
  const total = box.messages.total || 0;
  console.log(`Mailbox Total: ${total}`);

  const startSeq = Math.max(1, total - 15);
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
    req.once('error', (e) => {
      console.error('Fetch error:', e.message);
      resolve(items);
    });
    req.once('end', () => resolve(items));
  });

  connection.end();

  console.log(`Fetched ${rawMessages.length} raw messages. Analyzing...`);
  const candidates = getCandidates();

  for (const item of rawMessages) {
    try {
      const parsedMail = await simpleParser(item.buffer);
      const fromAddress = parsedMail.from?.value?.[0]?.address || '';
      const fromName = parsedMail.from?.value?.[0]?.name || fromAddress.split('@')[0] || 'Candidate';
      const subject = parsedMail.subject || 'Application';
      const bodyText = parsedMail.text || parsedMail.html || '';

      const isLoop = isSystemOutboundLoop(fromAddress, subject, bodyText);
      if (isLoop) {
        continue;
      }

      let resumeAttachment = null;
      let extractedResumeText = '';

      if (parsedMail.attachments && parsedMail.attachments.length > 0) {
        for (const att of parsedMail.attachments) {
          const fn = (att.filename || '').toLowerCase();
          const ct = (att.contentType || '').toLowerCase();

          if (fn.endsWith('.pdf') || fn.endsWith('.docx') || fn.endsWith('.doc') || fn.endsWith('.txt') || fn.endsWith('.rtf') ||
              ct.includes('pdf') || ct.includes('word') || ct.includes('document')) {
            const savedFilename = `${Date.now()}-${att.filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
            const savedPath = path.join(UPLOADS_DIR, savedFilename);
            fs.writeFileSync(savedPath, att.content);

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

      const isCandidate = resumeAttachment !== null ||
                          subject.toLowerCase().includes('job') ||
                          subject.toLowerCase().includes('resume') ||
                          subject.toLowerCase().includes('application') ||
                          subject.toLowerCase().includes('developer') ||
                          subject.toLowerCase().includes('analyst') ||
                          subject.toLowerCase().includes('engineer');

      if (!isCandidate) continue;

      const detectedCleanRole = cleanAndExtractJobRole(subject + ' ' + (resumeAttachment ? resumeAttachment.fileName : ''), extractedResumeText || bodyText);
      console.log(`\n======================================================`);
      console.log(`🎯 Evaluating Candidate: "${fromName}" <${fromAddress}>`);
      console.log(`   Subject: "${subject}"`);
      console.log(`   Resume: ${resumeAttachment ? resumeAttachment.fileName : 'None'} (${extractedResumeText.length} chars text)`);
      console.log(`   Target Job Role: "${detectedCleanRole}"`);

      const evalResult = await evaluateResumeWithGemini({
        candidateName: fromName,
        candidateEmail: fromAddress,
        roleApplied: detectedCleanRole,
        emailSubject: subject,
        emailBody: bodyText,
        resumeText: extractedResumeText,
        fileName: resumeAttachment ? resumeAttachment.fileName : 'resume.pdf'
      });

      console.log(`   📊 AI Result: Status: ${evalResult.status} | Score: ${evalResult.matchScore}%`);
      console.log(`   Skills: ${JSON.stringify(evalResult.skills)}`);
      console.log(`   Missing: ${JSON.stringify(evalResult.missingSkills)}`);

      // Dispatch auto-reply email
      let emailStatus = 'SENT';
      try {
        const mailRes = await sendEmail({
          to: fromAddress,
          subject: evalResult.emailSubject,
          htmlBody: evalResult.emailHtmlBody
        });
        console.log(`   ✉️ Dispatched Email -> Message-ID: ${mailRes.messageId}`);
      } catch (err) {
        console.warn(`   ⚠️ Email dispatch warn:`, err.message);
        emailStatus = 'FAILED';
      }

      const cleanFinalRole = cleanAndExtractJobRole(evalResult.roleApplied || detectedCleanRole);

      const candidateObj = {
        id: 'cand-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        name: evalResult.candidateName || fromName,
        email: fromAddress,
        phone: evalResult.candidatePhone || '+91 98765 43210',
        education: evalResult.education || 'Bachelor Degree',
        roleApplied: cleanFinalRole,
        experienceYears: evalResult.experienceYears || 2,
        skills: evalResult.skills || [],
        missingSkills: evalResult.missingSkills || [],
        scoreBreakdown: evalResult.scoreBreakdown || { technicalSkills: 25, experienceRelevance: 25, education: 15, communication: 15 },
        matchScore: evalResult.matchScore || 75,
        status: evalResult.status === 'SELECTED' ? 'SELECTED' : 'REJECTED',
        summary: evalResult.summary || 'Candidate evaluated.',
        strengths: evalResult.strengths || [],
        weaknesses: evalResult.weaknesses || [],
        interviewSchedule: evalResult.status === 'SELECTED' ? evalResult.interviewSchedule : null,
        emailSubject: evalResult.emailSubject,
        emailHtmlBody: evalResult.emailHtmlBody,
        emailStatus,
        attachmentInfo: resumeAttachment,
        receivedAt: parsedMail.date ? parsedMail.date.toISOString() : new Date().toISOString(),
        evaluatedAt: new Date().toISOString(),
        source: 'EMAIL_INBOX_ATTACHMENT',
        interviewStatus: evalResult.status === 'SELECTED' ? 'SCHEDULED' : null
      };

      // Add or update candidate for same email + role
      const existIdx = candidates.findIndex(c => c.email === fromAddress && c.roleApplied === cleanFinalRole);
      if (existIdx !== -1) {
        candidates[existIdx] = candidateObj;
      } else {
        candidates.unshift(candidateObj);
      }
    } catch (err) {
      console.error('Error processing msg:', err.message);
    }
  }

  saveCandidates(candidates);
  console.log(`\n✅ Finished! Total candidates in database: ${candidates.length}`);
}

reprocessInbox().catch(console.error);
