const assert = require('assert');
const { extractCandidateNameFromResume } = require('./gemini_evaluator');

console.log('=== Verifying Candidate Name Extraction strictly from Resume ===');

const test1 = extractCandidateNameFromResume('Page 1\nROHAN SHARMA\nFull Stack AI Engineer | Python | React.js', 'Full_Stack_AI_Engineer_Resume (2).pdf');
console.log('Test 1 (Full Stack AI Engineer):', test1);
assert.strictEqual(test1, 'Rohan Sharma');

const test2 = extractCandidateNameFromResume('ANANYA VERMA\nBUSINESS ANALYST | AGILE & PROCESS', 'Business_Analyst_Resume_2_to_3_Years.pdf');
console.log('Test 2 (Business Analyst):', test2);
assert.strictEqual(test2, 'Ananya Verma');

const test3 = extractCandidateNameFromResume('Kabir Singh\nAI Prompt Engineer (Fresher)', '4_Kabir_Singh_AI_Prompt_Engineer_Fresher.pdf');
console.log('Test 3 (Prompt Engineer):', test3);
assert.strictEqual(test3, 'Kabir Singh');

const test4 = extractCandidateNameFromResume('Rishu Paliwal\nFashion Stylist & Wardrobe Consultant', 'FASHION CV.pdf');
console.log('Test 4 (Fashion CV):', test4);
assert.strictEqual(test4, 'Rishu Paliwal');

const test5 = extractCandidateNameFromResume('Sneha Verma\nDigital Marketing Specialist', '5_Sneha_Verma_Digital_Marketing.docx');
console.log('Test 5 (Digital Marketing):', test5);
assert.strictEqual(test5, 'Sneha Verma');

const test6 = extractCandidateNameFromResume('ROHAN MEHTA\nSENIOR DATA ANALYST | 4+ YEARS EXPERIENCE\nrohan.mehta@email.com', 'Data_Analyst_Resume_3_to_5_Years.pdf');
console.log('Test 6 (Data Analyst - Rohan Mehta):', test6);
assert.strictEqual(test6, 'Rohan Mehta');

const test7 = extractCandidateNameFromResume('Vageesha Sharma (Talent Acquisition)\nCandidate: Rohan Joshi', 'Rohan_Joshi_CV.pdf');
console.log('Test 7 (Recruiter header protection):', test7);
assert.strictEqual(test7, 'Rohan Joshi');

console.log('✅ ALL candidate name extraction tests passed 100% perfectly!');

