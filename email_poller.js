require('dotenv').config();
const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const path = require('path');
const fs = require('fs');
const { evaluateResumeWithGemini, cleanAndExtractJobRole, extractCandidateNameFromResume } = require('./gemini_evaluator');

const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const PROCESSED_EMAILS_FILE = path.join(DATA_DIR, 'processed_emails.json');

// Ensure upload and data directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

/**
 * Load list of already processed email UIDs to prevent duplicate ingestion
 */
function getProcessedUids() {
  if (fs.existsSync(PROCESSED_EMAILS_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(PROCESSED_EMAILS_FILE, 'utf8'));
      if (Array.isArray(data)) return data;
    } catch (e) {
      return [];
    }
  }
  return [];
}

/**
 * Persist processed UID into disk
 */
function saveProcessedUid(uid) {
  if (!uid) return;
  const list = getProcessedUids();
  const strUid = String(uid);
  if (!list.includes(strUid)) {
    list.push(strUid);
    // Keep list bounded to last 2000 UIDs
    if (list.length > 2000) list.splice(0, list.length - 2000);
    try {
      fs.writeFileSync(PROCESSED_EMAILS_FILE, JSON.stringify(list, null, 2), 'utf8');
    } catch (e) {}
  }
}

/**
 * Extract clean plaintext from PDF / Word DOCX / Text attachments
 */
async function extractDocumentText(buffer, filename, contentType) {
  if (!buffer || buffer.length === 0) return '';
  const ext = (filename || '').toLowerCase();
  const ct = (contentType || '').toLowerCase();

  try {
    // 1. PDF Parsing
    if (ext.endsWith('.pdf') || ct.includes('pdf')) {
      const pdfMod = require('pdf-parse');
      if (pdfMod.PDFParse) {
        const parser = new pdfMod.PDFParse({ data: buffer });
        await parser.load();
        const res = await parser.getText();
        if (res && res.text) {
          return res.text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
        }
      } else if (typeof pdfMod === 'function') {
        const parsed = await pdfMod(buffer);
        if (parsed && parsed.text) {
          return parsed.text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
        }
      }
    }

    // 2. Word DOCX Parsing
    if (ext.endsWith('.docx') || ct.includes('wordprocessingml') || ct.includes('docx')) {
      const result = await mammoth.extractRawText({ buffer });
      if (result && result.value) {
        return result.value.replace(/\r\n/g, '\n').trim();
      }
    }

    // 3. Plain Text / RTF / Markdown
    if (ext.endsWith('.txt') || ext.endsWith('.rtf') || ext.endsWith('.md') || ct.includes('text/plain')) {
      return buffer.toString('utf8').replace(/\r\n/g, '\n').trim();
    }
  } catch (err) {
    console.warn(`[Document Parser Warn] Could not extract text from ${filename}:`, err.message);
  }

  // Fallback to ASCII string extraction
  try {
    const rawAscii = buffer.toString('utf8');
    const printable = rawAscii.replace(/[^\x20-\x7E\n\r\t]/g, ' ');
    if (printable.length > 200) {
      return printable.slice(0, 4000).trim();
    }
  } catch (e) {}

  return '';
}

/**
 * Check and poll Gmail IMAP mailbox for incoming candidate applications
 */
async function pollCandidateEmails({
  email,
  password,
  host = 'imap.gmail.com',
  port = 993,
  tls = true,
  checkLatestCount = 20,
  onCandidateProcessed = null
}) {
  if (!email || !password) {
    return {
      success: false,
      error: 'Gmail IMAP credentials not configured. Please supply email and app password.'
    };
  }

  const cleanPass = password.replace(/\s+/g, '');
  const config = {
    imap: {
      user: email,
      password: cleanPass,
      host,
      port,
      tls,
      tlsOptions: { rejectUnauthorized: false },
      authTimeout: 20000,
      connTimeout: 20000
    }
  };

  const processedList = getProcessedUids();
  const newlyProcessed = [];

  try {
    const connection = await imaps.connect(config);

    if (!connection) {
      return { success: false, error: 'Could not connect to Gmail IMAP server' };
    }

    const box = await connection.openBox('INBOX');
    const total = box.messages.total || 0;

    if (total === 0) {
      try { connection.end(); } catch (e) {}
      return { success: true, newlyProcessed: 0, candidates: [] };
    }

    // Target sequence range for latest messages
    const startSeq = Math.max(1, total - checkLatestCount + 1);
    const seqRange = `${startSeq}:${total}`;

    const imap = connection.imap;

    // 1. Fetch raw messages into memory
    const rawMessages = await new Promise((resolve) => {
      const fetchedItems = [];
      const fetchRequest = imap.seq.fetch(seqRange, { bodies: '', struct: true });

      fetchRequest.on('message', (msg, seqno) => {
        let buffer = '';
        let uid = null;

        msg.on('body', (stream) => {
          stream.on('data', chunk => buffer += chunk.toString('utf8'));
        });

        msg.once('attributes', (attrs) => {
          uid = attrs.uid;
        });

        msg.once('end', () => {
          if (uid) {
            fetchedItems.push({ uid, buffer });
          }
        });
      });

      fetchRequest.once('error', (err) => {
        resolve(fetchedItems);
      });

      fetchRequest.once('end', () => {
        resolve(fetchedItems);
      });
    });

    // 2. Process each message sequentially
    for (const msgItem of rawMessages) {
      const { uid, buffer } = msgItem;

      if (!uid || processedList.includes(String(uid))) {
        continue; // Already processed
      }

      try {
        const parsedMail = await simpleParser(buffer);
        const fromAddress = parsedMail.from?.value?.[0]?.address || '';
        const fromName = parsedMail.from?.value?.[0]?.name || fromAddress.split('@')[0] || 'Candidate';
        const subject = parsedMail.subject || 'Application Submission';
        const bodyText = parsedMail.text || parsedMail.html || '';

        // Filter system notifications / outbounds
        const isSystemOutboundLoop = subject.toLowerCase().includes('interview invitation') ||
                                     subject.toLowerCase().includes('official employment offer') ||
                                     subject.toLowerCase().includes('official job offer') ||
                                     subject.toLowerCase().includes('update on your application') ||
                                     subject.toLowerCase().includes('update regarding your application') ||
                                     subject.toLowerCase().includes('application status update') ||
                                     subject.toLowerCase().includes('call letter') ||
                                     subject.toLowerCase().includes('[qa automation test]') ||
                                     subject.toLowerCase().includes('[copy]') ||
                                     fromAddress.toLowerCase().includes('linkedin.com') ||
                                     fromAddress.toLowerCase().includes('naukri.com') ||
                                     fromAddress.toLowerCase().includes('indeed.com') ||
                                     fromAddress.toLowerCase().includes('glassdoor.com') ||
                                     fromAddress.toLowerCase().includes('no-reply@accounts.google.com') ||
                                     fromAddress.toLowerCase().includes('mailer-daemon') ||
                                     fromAddress.toLowerCase().includes('noreply@github.com') ||
                                     fromAddress.toLowerCase().includes('no-reply@render.com');

        // Check attachments for resume documents
        let resumeAttachment = null;
        let extractedResumeText = '';

        if (parsedMail.attachments && parsedMail.attachments.length > 0) {
          for (const att of parsedMail.attachments) {
            const fn = (att.filename || '').toLowerCase();
            const ct = (att.contentType || '').toLowerCase();

            if (fn.endsWith('.pdf') || fn.endsWith('.docx') || fn.endsWith('.doc') || fn.endsWith('.txt') || fn.endsWith('.rtf') || fn.endsWith('.md') ||
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

              // Extract text from document buffer
              extractedResumeText = await extractDocumentText(att.content, att.filename, att.contentType);
              break;
            }
          }
        }

        const isCandidateEmail = !isSystemOutboundLoop && (
          resumeAttachment !== null ||
          subject.toLowerCase().includes('job') ||
          subject.toLowerCase().includes('resume') ||
          subject.toLowerCase().includes('application') ||
          subject.toLowerCase().includes('engineer') ||
          subject.toLowerCase().includes('developer') ||
          subject.toLowerCase().includes('analyst') ||
          subject.toLowerCase().includes('designer') ||
          subject.toLowerCase().includes('executive') ||
          subject.toLowerCase().includes('candidate')
        );

        if (isCandidateEmail) {
          const detectedCleanRole = cleanAndExtractJobRole(subject || (resumeAttachment ? resumeAttachment.fileName : ''), extractedResumeText || bodyText);
          const candidateRealName = extractCandidateNameFromResume(extractedResumeText, resumeAttachment ? resumeAttachment.fileName : '', fromName);

          console.log(`[Email Poller] 📥 New candidate detected: "${candidateRealName}" (Sender: <${fromAddress}>) for Role: "${detectedCleanRole}" (Resume: ${resumeAttachment ? resumeAttachment.fileName : 'None'})`);

          const evalResult = await evaluateResumeWithGemini({
            candidateName: candidateRealName,
            candidateEmail: fromAddress,
            roleApplied: detectedCleanRole,
            emailSubject: subject,
            emailBody: bodyText,
            resumeText: extractedResumeText,
            fileName: resumeAttachment ? resumeAttachment.fileName : 'Resume_Document.pdf'
          });

          const cleanFinalRole = cleanAndExtractJobRole(evalResult.roleApplied || detectedCleanRole);
          const finalCandidateName = evalResult.candidateName || candidateRealName;

          const newCandidate = {
            id: 'cand-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
            name: finalCandidateName,
            email: fromAddress || evalResult.candidateEmail,
            phone: evalResult.candidatePhone || 'Not specified',
            education: evalResult.education || 'Bachelor Degree',
            roleApplied: cleanFinalRole,
            experienceYears: evalResult.experienceYears || 0,
            skills: evalResult.skills || [],
            missingSkills: evalResult.missingSkills || [],
            scoreBreakdown: evalResult.scoreBreakdown || { technicalSkills: 10, experienceRelevance: 10, education: 10, communication: 10 },
            matchScore: evalResult.matchScore || 50,
            status: evalResult.status || 'REJECTED',
            interviewStatus: evalResult.status === 'SELECTED' ? 'SCHEDULED' : 'N/A',
            offerStatus: 'PENDING',
            summary: evalResult.summary || `Application evaluated for ${cleanFinalRole}`,
            strengths: evalResult.strengths || [],
            weaknesses: evalResult.weaknesses || [],
            interviewSchedule: evalResult.interviewSchedule || null,
            emailSubject: evalResult.emailSubject || (evalResult.status === 'SELECTED' ? `Interview Invitation: ${cleanFinalRole}` : `Update regarding your application for ${cleanFinalRole}`),
            emailHtmlBody: evalResult.emailHtmlBody,
            emailStatus: 'PENDING',
            attachmentInfo: resumeAttachment,
            receivedAt: parsedMail.date ? parsedMail.date.toISOString() : new Date().toISOString(),
            evaluatedAt: new Date().toISOString(),
            source: resumeAttachment ? 'EMAIL_INBOX_ATTACHMENT' : 'EMAIL_INTAKE'
          };

          if (onCandidateProcessed) {
            await onCandidateProcessed(newCandidate);
          }

          newlyProcessed.push(newCandidate);
        }

        // Mark UID as processed after handling
        saveProcessedUid(uid);
      } catch (err) {
        console.error(`[Email Poller] Error processing message UID ${uid}:`, err.message);
        saveProcessedUid(uid);
      }
    }

    try { connection.end(); } catch (e) {}

    return {
      success: true,
      totalChecked: checkLatestCount,
      newlyProcessedCount: newlyProcessed.length,
      candidates: newlyProcessed
    };
  } catch (error) {
    console.error('[Email Poller] Connection error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  pollCandidateEmails,
  extractDocumentText,
  getProcessedUids,
  saveProcessedUid
};
