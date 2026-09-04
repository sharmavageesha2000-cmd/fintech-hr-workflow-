require('dotenv').config();
const { isLegitimateResumeDocument } = require('./email_poller');
const nodemailer = require('nodemailer');

console.log('======================================================');
console.log('🧪 TESTING STRICT RESUME FILTERING & AUTO-REPLY LOGIC');
console.log('======================================================');

// 1. Test isLegitimateResumeDocument
const testCases = [
  {
    name: 'BookMyShow GST Invoice',
    filename: 'TUA3EWB_GST_Invoice.pdf',
    text: 'Tax Invoice GSTIN: 27AAACB2638L1Z1 Total Amount Payable: 450.00 Booking ID: BMS123456 Seat: A1, A2',
    sender: 'tickets@bookmyshow.com',
    subject: 'Your Booking Confirmation - Movie Tickets',
    expected: false
  },
  {
    name: 'Union Bank Account Statement',
    filename: '623562_4217.pdf',
    text: 'Union Bank of India Account Statement Available Balance: 15420.00 IFSC: UBIN0538914 Transaction Date: 01/09/2026',
    sender: 'noreplyunionbank@ubi.bank.in',
    subject: 'Your Monthly e-Statement',
    expected: false
  },
  {
    name: 'Amazon Order Invoice',
    filename: 'Amazon_Invoice_ORD9812.pdf',
    text: 'Tax Invoice / Bill of Supply / Cash Memo Order Date: 28.08.2026 Invoice Number: IN-9812 IGST 18%',
    sender: 'auto-confirm@amazon.in',
    subject: 'Your Amazon.in order #402-1234567-8910111',
    expected: false
  },
  {
    name: 'Candidate Email with Valid PDF Resume',
    filename: 'Rohan_Sharma_Frontend_Developer_Resume.pdf',
    text: 'Rohan Sharma | Frontend Developer | Email: rohan@example.com | Skills: React.js, JavaScript, Tailwind CSS, HTML5, REST APIs | Experience: 3 Years building interactive web applications | Education: B.Tech Computer Science',
    sender: 'rohan.sharma.dev@gmail.com',
    subject: 'Job Application - Frontend Developer - Rohan Sharma',
    expected: true
  },
  {
    name: 'Candidate Email with Valid DOCX Resume',
    filename: 'Ananya_Verma_FullStack_AI_CV.docx',
    text: 'Ananya Verma Curriculum Vitae. Technical Skills: Python, Node.js, React, Gemini AI, PostgreSQL. Professional Experience: 4 years designing full stack workflows and ML pipelines. Qualifications: MCA Computer Applications.',
    sender: 'ananya.verma.ai@gmail.com',
    subject: 'Application for Full Stack AI Engineer',
    expected: true
  },
  {
    name: 'Email with No Resume (Just a plain message)',
    filename: '',
    text: '',
    sender: 'someone@example.com',
    subject: 'Hello are you hiring?',
    expected: false
  }
];

let allPassed = true;
testCases.forEach((tc, idx) => {
  const result = isLegitimateResumeDocument(tc.filename, tc.text, tc.sender, tc.subject);
  const pass = result === tc.expected;
  if (!pass) allPassed = false;
  console.log(`Test ${idx + 1}: [${tc.name}] -> Result: ${result} (Expected: ${tc.expected}) ${pass ? '✅ PASS' : '❌ FAIL'}`);
});

console.log('\n--- Testing Auto-Reply SMTP Connection & Real Dispatch ---');
async function testAutoReply() {
  const recruiterEmail = process.env.RECRUITER_EMAIL || 'sharmavageesha2000@gmail.com';
  const recruiterPass = (process.env.GOOGLE_APP_PASSWORD || 'qoyolivxrkuqxmkx').replace(/\s+/g, '');

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user: recruiterEmail, pass: recruiterPass }
  });

  const testCandidateEmail = 'sharmavageesha2000@gmail.com'; // Deliver test copy to recruiter mailbox
  console.log(`Sending live test auto-reply to ${testCandidateEmail}...`);

  const info = await transporter.sendMail({
    from: `"Vageesha Sharma (Talent Acquisition)" <${recruiterEmail}>`,
    to: testCandidateEmail,
    subject: '✅ [Verification] HR SmartFlow Auto-Reply System Active & Verified',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h2 style="color: #10b981;">🎉 Auto-Reply Subsystem Verified</h2>
        <p>This confirms that the Gmail SMTP auto-reply dispatcher is 100% active and functioning properly.</p>
        <p><strong>Recruiter Account:</strong> ${recruiterEmail}</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      </div>
    `
  });

  console.log(`✅ Auto-reply successfully delivered! Message-ID: ${info.messageId}`);
  console.log('\n======================================================');
  console.log(`🎯 FILTER & AUTO-REPLY VERDICT: ${allPassed ? 'ALL TESTS PASSED ✅' : 'SOME TESTS FAILED ❌'}`);
  console.log('======================================================\n');
}

testAutoReply().catch(err => {
  console.error('❌ Auto-reply test failed:', err);
  process.exit(1);
});
