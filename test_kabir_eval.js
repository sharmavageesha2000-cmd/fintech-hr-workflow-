require('dotenv').config();
const fs = require('fs');
const { evaluateResumeWithGemini } = require('./gemini_evaluator');
const { extractDocumentText } = require('./email_poller');

async function test() {
  const buf = fs.readFileSync('uploads/1788190735922-4_Kabir_Singh_AI_Prompt_Engineer_Fresher__1_.pdf');
  const text = await extractDocumentText(buf, 'resume.pdf', 'application/pdf');

  console.log('Evaluating Kabir Singh for Data Analyst role...');
  const res = await evaluateResumeWithGemini({
    candidateName: 'Kabir Singh',
    candidateEmail: 'kabir.singh.ai@email.com',
    roleApplied: 'Data Analyst',
    emailSubject: 'Application for Data Analyst',
    resumeText: text,
    fileName: 'Kabir_Singh_Prompt_Engineer.pdf'
  });

  console.log('\n======================================================');
  console.log('Result for Kabir Singh applying for Data Analyst:');
  console.log('Role Applied:', res.roleApplied);
  console.log('Score:', res.matchScore);
  console.log('Status:', res.status);
  console.log('Skills Identified:', res.skills);
  console.log('Missing Skills:', res.missingSkills);
  console.log('Weaknesses / Gaps:', res.weaknesses);
  console.log('Email Subject:', res.emailSubject);
  console.log('======================================================');
}

test().catch(console.error);
