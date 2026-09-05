require('dotenv').config();
const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');
const nodemailer = require('nodemailer');
const mammoth = require('mammoth');
const path = require('path');
const fs = require('fs');
const { 
  evaluateResumeWithGemini, 
  cleanAndExtractJobRole, 
  extractCandidateNameFromResume,
  DEFAULT_GEMINI_KEY,
  DEFAULT_MODEL
} = require('./gemini_evaluator');

const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const PROCESSED_EMAILS_FILE = path.join(DATA_DIR, 'processed_emails.json');

// Ensure upload and data directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const CURRENTLY_PROCESSING_UIDS = new Set();

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
  const strUid = String(uid);
  CURRENTLY_PROCESSING_UIDS.add(strUid);
  const list = getProcessedUids();
  if (!list.includes(strUid)) {
    list.push(strUid);
    // Keep list bounded to last 3000 UIDs
    if (list.length > 3000) list.splice(0, list.length - 3000);
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
      let pdfMod = null;
      try { pdfMod = require('pdf-parse'); } catch (e) {}
      if (pdfMod) {
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

  // Fallback to ASCII string extraction for binary PDFs
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
 * Rigorously checks if an attachment and sender represent a legitimate candidate resume
 */
function isLegitimateResumeDocument(filename, extractedText, fromAddress, subject) {
  const fn = (filename || '').toLowerCase().trim();
  const from = (fromAddress || '').toLowerCase().trim();
  const subj = (subject || '').toLowerCase().trim();
  const text = (extractedText || '').toLowerCase().trim();

  // 1. Mandatory file extension check
  const hasValidExt = fn.endsWith('.pdf') || fn.endsWith('.docx') || fn.endsWith('.doc') || fn.endsWith('.txt') || fn.endsWith('.rtf');
  if (!hasValidExt) return false;

  // 2. Blocklist non-candidate sender domains / service addresses
  const blockedSenderPatterns = [
    'noreply', 'no-reply', 'alerts', 'alert@', 'donotreply', 'notification', 'notifications@',
    'billing@', 'invoices@', 'support@', 'info@twitter', 'accounts.google.com',
    'bank', 'unionbank', 'ubi.bank', 'hdfc', 'icici', 'sbi.co.in', 'axisbank', 'kotak',
    'paytm', 'phonepe', 'gpay', 'swiggy', 'zomato', 'amazon', 'flipkart', 'uber', 'ola',
    'irctc', 'bookmyshow', 'makemytrip', 'mailer-daemon', 'postmaster', 'bounce',
    'marketing@', 'newsletter@', 'promotions@', 'updates@', 'linkedin.com', 'naukri.com',
    'indeed.com', 'glassdoor.com', 'render.com', 'github.com'
  ];
  if (blockedSenderPatterns.some(pat => from.includes(pat))) {
    return false;
  }

  // 3. Blocklist non-resume attachment filenames
  const blockedFilenamePatterns = [
    'invoice', 'receipt', 'bill', 'statement', 'ticket', 'boarding', 'gst', 'tax',
    'payslip', 'salary', 'itr', 'epf', 'passbook', 'order', 'confirmation',
    'newsletter', 'report', 'card_statement', 'summary_statement', 'payment',
    'lic', 'policy', 'insurance', 'quotation', 'slip', 'booking', 'flyer', 'brochure',
    'form16', 'form_16', 'e-ticket', 'voucher', 'itinerary', 'bank_statement', 'cheque'
  ];
  if (blockedFilenamePatterns.some(pat => fn.includes(pat))) {
    return false;
  }

  // 4. Blocklist non-candidate email subjects (system outbounds, receipts, alerts)
  const blockedSubjectPatterns = [
    'your invoice', 'tax invoice', 'booking confirmed', 'ticket confirmed',
    'account statement', 'transaction alert', 'payment received', 'order confirmation',
    'security alert', 'otp', 'verification code', 'newsletter', 'salary credit',
    'interview invitation', 'official employment offer', 'official job offer',
    'update regarding your application', 'application status update', 'call letter',
    '[qa automation test]', '[copy]'
  ];
  if (blockedSubjectPatterns.some(pat => subj.includes(pat))) {
    return false;
  }

  // 5. Check extracted document text content against invoice/transaction tokens
  const invoiceTokens = [
    'tax invoice', 'gstin', 'cgst', 'sgst', 'igst', 'total amount payable',
    'booking id', 'account statement', 'available balance', 'branch code',
    'ifsc code', 'transaction date', 'debit card', 'credit card', 'seat layout',
    'convenience fee', 'show time', 'theatre', 'cinema'
  ];
  const hasInvoiceToken = invoiceTokens.some(token => text.includes(token));
  if (hasInvoiceToken) {
    return false;
  }

  // 6. Positive resume indicators
  const resumeIndicators = [
    'skills', 'experience', 'education', 'project', 'summary', 'curriculum vitae',
    'resume', 'cv', 'employment', 'qualification', 'bachelor', 'master', 'b.tech',
    'mca', 'bca', 'm.tech', 'b.e', 'bba', 'mba', 'university', 'college', 'school',
    'developer', 'engineer', 'frontend', 'backend', 'full stack', 'technical',
    'work history', 'certifications', 'objective', 'contact', 'responsibilities',
    'frameworks', 'profile', 'achievements', 'languages', 'react', 'javascript',
    'node', 'python', 'java', 'sql', 'git', 'html', 'css', 'design'
  ];

  let indicatorMatches = 0;
  for (const indicator of resumeIndicators) {
    if (text.includes(indicator) || fn.includes(indicator)) {
      indicatorMatches++;
    }
  }

  // If text was extracted, require at least 2 resume indicator matches
  if (text.length > 50) {
    return indicatorMatches >= 2;
  }

  // If text extraction was sparse (e.g. password-free scanned PDF), require resume in filename or subject
  const fnOrSubjHasResume = fn.includes('resume') || fn.includes('cv') || fn.includes('profile') ||
                           subj.includes('resume') || subj.includes('cv') || subj.includes('application') ||
                           subj.includes('developer') || subj.includes('engineer');

  return fnOrSubjHasResume;
}

/**
 * Check and poll Gmail IMAP mailbox for incoming candidate applications with resume attachments
 */
async function pollCandidateEmails({
  email,
  password,
  host = 'imap.gmail.com',
  port = 993,
  tls = true,
  checkLatestCount = 25,
  onCandidateProcessed = null
}) {
  const recruiterEmail = email || process.env.RECRUITER_EMAIL || 'sharmavageesha2000@gmail.com';
  const recruiterPass = (password || process.env.GOOGLE_APP_PASSWORD || 'qoyolivxrkuqxmkx').replace(/\s+/g, '');

  if (!recruiterEmail || !recruiterPass) {
    return {
      success: false,
      error: 'Gmail IMAP credentials not configured. Please supply email and app password.'
    };
  }

  const config = {
    imap: {
      user: recruiterEmail,
      password: recruiterPass,
      host,
      port,
      tls,
      tlsOptions: { rejectUnauthorized: false },
      authTimeout: 20000,
      connTimeout: 20000
    }
  };

  const processedSet = new Set(getProcessedUids().map(String));
  const newlyProcessed = [];

  let connection = null;
  try {
    connection = await imaps.connect(config);

    if (!connection) {
      return { success: false, error: 'Could not connect to Gmail IMAP server' };
    }

    const box = await connection.openBox('INBOX');
    const total = box.messages.total || 0;

    if (total === 0) {
      return { success: true, newlyProcessed: 0, candidates: [] };
    }

    // Target sequence range for latest messages
    const startSeq = Math.max(1, total - checkLatestCount + 1);
    const searchCriteria = [`${startSeq}:${total}`];
    const fetchOptions = { bodies: [''], struct: true, markSeen: false };

    console.log(`[Email Poller] Fetching sequence range ${startSeq}:${total} from INBOX (${total} total)...`);
    const rawMessages = await connection.search(searchCriteria, fetchOptions);
    console.log(`[Email Poller] Successfully retrieved ${rawMessages.length} messages from inbox.`);

    // 2. Process each message sequentially
    for (const msgItem of rawMessages) {
      const uid = msgItem.attributes.uid;
      const bodyPart = msgItem.parts.find(p => p.which === '');
      const buffer = bodyPart ? bodyPart.body : '';

      if (!uid || processedSet.has(String(uid)) || CURRENTLY_PROCESSING_UIDS.has(String(uid))) {
        continue; // Already processed or in-flight
      }
      processedSet.add(String(uid));
      CURRENTLY_PROCESSING_UIDS.add(String(uid));

      try {
        const parsedMail = await simpleParser(buffer);
        let fromAddress = parsedMail.from?.value?.[0]?.address || parsedMail.from?.text || '';
        if (fromAddress && fromAddress.includes('<') && fromAddress.includes('>')) {
          const match = fromAddress.match(/<([^>]+)>/);
          if (match) fromAddress = match[1];
        }
        fromAddress = (fromAddress || '').trim();

        const fromName = parsedMail.from?.value?.[0]?.name || (fromAddress ? fromAddress.split('@')[0] : 'Candidate');
        const subject = parsedMail.subject || 'Application Submission';
        const bodyText = parsedMail.text || parsedMail.html || '';

        // STRICT REQUIREMENT: Must have attachments
        if (!parsedMail.attachments || parsedMail.attachments.length === 0) {
          // Skip email without attachments and mark processed
          saveProcessedUid(uid);
          CURRENTLY_PROCESSING_UIDS.delete(String(uid));
          continue;
        }

        // Check attachments for legitimate resume documents only
        let resumeAttachment = null;
        let extractedResumeText = '';

        for (const att of parsedMail.attachments) {
          const fn = (att.filename || '').toLowerCase();
          const ct = (att.contentType || '').toLowerCase();

          // Check if file is a candidate document type
          const isDocType = fn.endsWith('.pdf') || fn.endsWith('.docx') || fn.endsWith('.doc') || 
                            fn.endsWith('.txt') || fn.endsWith('.rtf') || ct.includes('pdf') || 
                            ct.includes('word') || ct.includes('document');

          if (!isDocType) continue;

          // Extract text from document buffer
          const candidateText = await extractDocumentText(att.content, att.filename, att.contentType);

          // Rigorous check: Is this truly a resume document?
          const isResume = isLegitimateResumeDocument(att.filename, candidateText, fromAddress, subject);

          if (isResume) {
            const savedFilename = `${Date.now()}-${att.filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
            const savedPath = path.join(UPLOADS_DIR, savedFilename);
            fs.writeFileSync(savedPath, att.content);

            resumeAttachment = {
              fileName: att.filename,
              fileSize: att.size,
              savedPath,
              urlPath: `/uploads/${savedFilename}`
            };

            extractedResumeText = candidateText;
            break; // Stop after first valid resume attachment
          }
        }

        // If NO valid resume attachment was found, SKIP this email entirely
        if (!resumeAttachment) {
          saveProcessedUid(uid);
          CURRENTLY_PROCESSING_UIDS.delete(String(uid));
          continue;
        }

        // Resolve candidate email from sender or resume text
        let effectiveCandidateEmail = fromAddress;
        if (!effectiveCandidateEmail || !effectiveCandidateEmail.includes('@')) {
          const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
          const found = (extractedResumeText + ' ' + bodyText).match(emailRegex);
          if (found && found.length > 0) {
            effectiveCandidateEmail = found[0].trim();
          }
        }
        effectiveCandidateEmail = effectiveCandidateEmail || recruiterEmail;

        // Detect job role and candidate name
        const detectedCleanRole = cleanAndExtractJobRole(subject || resumeAttachment.fileName, extractedResumeText || bodyText);
        const candidateRealName = extractCandidateNameFromResume(extractedResumeText, resumeAttachment.fileName, fromName);

        console.log(`[Email Poller] 🎯 Valid candidate resume verified: "${candidateRealName}" (Sender: <${effectiveCandidateEmail}>) for Role: "${detectedCleanRole}" (Resume: ${resumeAttachment.fileName})`);

        // Evaluate candidate with Gemini AI
        const candUniqueId = 'cand-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
        const evalResult = await evaluateResumeWithGemini({
          candidateName: candidateRealName,
          candidateEmail: effectiveCandidateEmail,
          candidateId: candUniqueId,
          roleApplied: detectedCleanRole,
          emailSubject: subject,
          emailBody: bodyText,
          resumeText: extractedResumeText,
          fileName: resumeAttachment.fileName
        });

        const cleanFinalRole = cleanAndExtractJobRole(evalResult.roleApplied || detectedCleanRole);
        const finalCandidateName = evalResult.candidateName || candidateRealName;

        const newCandidate = {
          id: evalResult.candidateId || candUniqueId,
          name: finalCandidateName,
          email: effectiveCandidateEmail || evalResult.candidateEmail || recruiterEmail,
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
          source: 'EMAIL_INBOX_ATTACHMENT'
        };

        // Trigger onCandidateProcessed callback or fallback auto-reply
        if (onCandidateProcessed) {
          await onCandidateProcessed(newCandidate);
        } else {
          // Direct fallback auto-reply dispatch via Gmail SMTP
          try {
            console.log(`[Email Poller] ✉️ Dispatching auto-reply to: ${newCandidate.email}...`);
            const transporter = nodemailer.createTransport({
              host: 'smtp.gmail.com',
              port: 465,
              secure: true,
              auth: { user: recruiterEmail, pass: recruiterPass }
            });
            const info = await transporter.sendMail({
              from: `"Vageesha Sharma (Talent Acquisition)" <${recruiterEmail}>`,
              to: newCandidate.email,
              subject: newCandidate.emailSubject,
              html: newCandidate.emailHtmlBody
            });
            console.log(`[Email Poller] ✅ Auto-reply delivered! Message ID: ${info.messageId}`);
            newCandidate.emailStatus = 'SENT';
            newCandidate.lastEmailSentAt = new Date().toISOString();
          } catch (replyErr) {
            console.warn(`[Email Poller] Auto-reply error:`, replyErr.message);
            newCandidate.emailStatus = 'FAILED';
          }
        }

        newlyProcessed.push(newCandidate);
        saveProcessedUid(uid);
      } catch (err) {
        console.error(`[Email Poller] Error processing message UID ${uid}:`, err.message);
        saveProcessedUid(uid);
      } finally {
        CURRENTLY_PROCESSING_UIDS.delete(String(uid));
      }
    }

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
  } finally {
    if (connection) {
      try { connection.end(); } catch (e) {}
    }
  }
}

module.exports = {
  pollCandidateEmails,
  extractDocumentText,
  isLegitimateResumeDocument,
  getProcessedUids,
  saveProcessedUid
};
