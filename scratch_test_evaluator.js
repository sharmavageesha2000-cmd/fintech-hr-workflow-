require('dotenv').config();
const { evaluateResumeWithGemini, getJobSpecification } = require('./gemini_evaluator');

async function testEvaluator() {
  console.log('==================================================');
  console.log('🔬 TEST 1: FRONTEND DEVELOPER RESUME');
  console.log('==================================================');
  const feResume = `
    Rohan Sharma
    Frontend Developer | React.js | JavaScript | HTML5 | CSS3 | Tailwind CSS
    Experience: 2.5 years
    - Developed modern responsive single-page web applications using React.js, Redux Toolkit, and JavaScript (ES6+).
    - Integrated RESTful APIs and optimized web performance.
    - Designed pixel-perfect responsive layouts with Tailwind CSS and HTML5/CSS3.
  `;
  const feResult = await evaluateResumeWithGemini({
    candidateName: 'Rohan Sharma',
    candidateEmail: 'rohan.sharma@example.com',
    roleApplied: 'Frontend Developer',
    resumeText: feResume,
    fileName: 'Rohan_Frontend_Resume.pdf'
  });
  console.log('Role:', feResult.roleApplied);
  console.log('Score:', feResult.matchScore);
  console.log('Status:', feResult.status);
  console.log('Matched Skills:', feResult.skills);
  console.log('Expected: SELECTED (>= 65) -> Actual:', feResult.status);
  if (feResult.status !== 'SELECTED') throw new Error('Test 1 Failed: Expected SELECTED for strong Frontend resume');

  console.log('\n==================================================');
  console.log('🔬 TEST 2: BACKEND DEVELOPER RESUME');
  console.log('==================================================');
  const beResume = `
    Amit Patel
    Backend Developer | Node.js | Express | PostgreSQL | MongoDB | REST APIs
    Experience: 3 years
    - Built robust backend microservices with Node.js and Express.
    - Designed database schemas in PostgreSQL and MongoDB.
    - Developed and secured REST APIs with JWT authentication.
  `;
  const beResult = await evaluateResumeWithGemini({
    candidateName: 'Amit Patel',
    candidateEmail: 'amit.patel@example.com',
    roleApplied: 'Backend Developer',
    resumeText: beResume,
    fileName: 'Amit_Backend_Resume.pdf'
  });
  console.log('Role:', beResult.roleApplied);
  console.log('Score:', beResult.matchScore);
  console.log('Status:', beResult.status);
  console.log('Matched Skills:', beResult.skills);
  console.log('Expected: SELECTED (>= 65) -> Actual:', beResult.status);
  if (beResult.status !== 'SELECTED') throw new Error('Test 2 Failed: Expected SELECTED for strong Backend resume');

  console.log('\n==================================================');
  console.log('🔬 TEST 3: MISMATCHED RESUME (FASHION CV APPLYING FOR BACKEND DEVELOPER)');
  console.log('==================================================');
  const fashionResume = `
    Rishu Paliwal
    Fashion Stylist & Wardrobe Consultant
    Experience: 2 years in luxury apparel merchandising, fashion retail cataloging, fabric quality inspection.
  `;
  const mismatchResult = await evaluateResumeWithGemini({
    candidateName: 'Rishu Paliwal',
    candidateEmail: 'paliwalrishu2000@gmail.com',
    roleApplied: 'Backend Developer',
    resumeText: fashionResume,
    fileName: 'Fashion_Stylist_CV.pdf'
  });
  console.log('Role:', mismatchResult.roleApplied);
  console.log('Score:', mismatchResult.matchScore);
  console.log('Status:', mismatchResult.status);
  console.log('Missing Skills:', mismatchResult.missingSkills);
  console.log('Expected: REJECTED (< 65) -> Actual:', mismatchResult.status);
  if (mismatchResult.status !== 'REJECTED') throw new Error('Test 3 Failed: Expected REJECTED for Fashion CV applying for Backend');

  console.log('\n==================================================');
  console.log('🔬 TEST 4: BUSINESS ANALYST RESUME');
  console.log('==================================================');
  const baResume = `
    Priya Nair
    Business Analyst | BRD | FRD | Agile Scrum | Jira | Process Mapping
    Experience: 2 years
    - Gathered business requirements and created comprehensive BRD and FRD documentation.
    - Facilitated sprint planning, user story grooming, and stakeholder alignment using Jira.
  `;
  const baResult = await evaluateResumeWithGemini({
    candidateName: 'Priya Nair',
    candidateEmail: 'priya.nair@example.com',
    roleApplied: 'Business Analyst',
    resumeText: baResume,
    fileName: 'Priya_BA_Resume.pdf'
  });
  console.log('Role:', baResult.roleApplied);
  console.log('Score:', baResult.matchScore);
  console.log('Status:', baResult.status);
  console.log('Matched Skills:', baResult.skills);
  console.log('Expected: SELECTED (>= 65) -> Actual:', baResult.status);
  if (baResult.status !== 'SELECTED') throw new Error('Test 4 Failed: Expected SELECTED for strong BA resume');

  console.log('\n🎉 ALL 4 OBJECTIVE ACCURACY TESTS PASSED PERFECTLY!');
}

testEvaluator().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
