require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { evaluateResumeWithGemini, cleanAndExtractJobRole } = require('./gemini_evaluator');
const { extractDocumentText } = require('./email_poller');
const nodemailer = require('nodemailer');

const UPLOADS_DIR = path.join(__dirname, 'uploads');
const files = fs.readdirSync(UPLOADS_DIR);
const samplePdfName = files.find(f => f.includes('Frontend_Developer')) || files.find(f => f.endsWith('.pdf'));
const samplePdfPath = path.join(UPLOADS_DIR, samplePdfName);

async function testSingleCandidate() {
  console.log(`Using resume: ${samplePdfName}`);
  console.log('--- Testing Document Parsing ---');
  const buffer = fs.readFileSync(samplePdfPath);
  const text = await extractDocumentText(buffer, samplePdfName, 'application/pdf');
  console.log('Extracted text length:', text.length);
  console.log('Text snippet (first 300 chars):');
  console.log(text.slice(0, 300));

  console.log('\n--- Testing Gemini Evaluation ---');
  const evalResult = await evaluateResumeWithGemini({
    candidateName: 'Rishu',
    candidateEmail: 'paliwalrishu2000@gmail.com',
    roleApplied: 'Frontend Developer',
    emailSubject: 'Job Application - Frontend Developer',
    emailBody: 'Dear Hiring Team, I am submitting my application for Frontend Developer.',
    resumeText: text,
    fileName: samplePdfName
  });

  console.log('Evaluation Result:');
  console.log('Candidate Name:', evalResult.candidateName);
  console.log('Candidate Email:', evalResult.candidateEmail);
  console.log('Role Applied:', evalResult.roleApplied);
  console.log('Match Score:', evalResult.matchScore);
  console.log('Status:', evalResult.status);
  console.log('Email Subject:', evalResult.emailSubject);

  console.log('\n--- Testing Live SMTP Dispatch to paliwalrishu2000@gmail.com and sharmavageesha2000@gmail.com ---');
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sharmavageesha2000@gmail.com',
      pass: 'qoyolivxrkuqxmkx'
    }
  });

  console.log('Sending interview email to paliwalrishu2000@gmail.com...');
  const send1 = await transporter.sendMail({
    from: '"Vageesha Sharma (Talent Acquisition)" <sharmavageesha2000@gmail.com>',
    to: 'paliwalrishu2000@gmail.com',
    subject: evalResult.emailSubject,
    html: evalResult.emailHtmlBody
  });
  console.log('✅ Delivered to paliwalrishu2000@gmail.com! Message-ID:', send1.messageId);

  console.log('Sending test confirmation copy to sharmavageesha2000@gmail.com...');
  const send2 = await transporter.sendMail({
    from: '"Vageesha Sharma (Talent Acquisition)" <sharmavageesha2000@gmail.com>',
    to: 'sharmavageesha2000@gmail.com',
    subject: `[Copy] ${evalResult.emailSubject}`,
    html: evalResult.emailHtmlBody
  });
  console.log('✅ Delivered to sharmavageesha2000@gmail.com! Message-ID:', send2.messageId);
}

testSingleCandidate().catch(console.error);
