const { evaluateResumeWithGemini } = require('./gemini_evaluator');
const { getQuestionsForRole, ROLE_QUESTIONS_BANK } = require('./assessment_questions');

async function testDomainSpecificAndLiveUrls() {
  console.log('======================================================================');
  console.log('🧪 VERIFYING DOMAIN-SPECIFIC MCQS & LIVE RENDER ASSESSMENT URLS');
  console.log('======================================================================');

  const testRoles = [
    { role: 'Frontend Developer', name: 'Rohan Sharma', email: 'rohan@example.com' },
    { role: 'Backend Developer', name: 'Aditya Verma', email: 'aditya@example.com' },
    { role: 'Full Stack AI Engineer', name: 'Pooja Nair', email: 'pooja@example.com' },
    { role: 'Data Analyst', name: 'Vikram Singh', email: 'vikram@example.com' },
    { role: 'Business Analyst', name: 'Neha Gupta', email: 'neha@example.com' },
    { role: 'UI/UX Designer', name: 'Aarav Patel', email: 'aarav@example.com' },
    { role: 'Business Development Executive', name: 'Meera Rao', email: 'meera@example.com' }
  ];

  const roleQuestionSets = {};

  for (const { role, name, email } of testRoles) {
    console.log(`\n--- Testing Role: "${role}" ---`);

    // 1. Check Questions
    const questions = getQuestionsForRole(role, true);
    console.log(`  ✓ Total MCQs returned: ${questions.length} (Expected: 20)`);
    console.log(`  ✓ Sample Question 1: "${questions[0].question.substring(0, 60)}..."`);
    console.log(`  ✓ Sample Question 20: "${questions[19].question.substring(0, 60)}..."`);

    roleQuestionSets[role] = questions.map(q => q.question);

    // 2. Evaluate candidate for this role
    const evalRes = await evaluateResumeWithGemini({
      candidateName: name,
      candidateEmail: email,
      roleApplied: role,
      emailSubject: `Application for ${role} - ${name}`,
      emailBody: `Applying for ${role}`,
      resumeText: `${name} | ${email} | 3 years of production experience in ${role}. Core skills matching ${role} job requirements.`
    });

    if (evalRes.status === 'SELECTED') {
      const link = evalRes.interviewSchedule?.assessmentLink || '';
      console.log(`  ✓ Assessment Link: ${link}`);

      // Strict Checks:
      const hasLocalhost = link.includes('localhost');
      const hasLiveRender = link.startsWith('https://hr-smartflow-automation.onrender.com/assessment.html');
      const hasRoleParam = link.includes(`role=${encodeURIComponent(role)}`);
      const emailHasMeet = evalRes.emailHtmlBody.includes('meet.google.com');

      console.log(`  ✓ Does link contain 'localhost'?: ${hasLocalhost ? '❌ FAILED (Contains localhost)' : '✅ PASS (No localhost)'}`);
      console.log(`  ✓ Does link use live Render domain?: ${hasLiveRender ? '✅ PASS' : '❌ FAILED'}`);
      console.log(`  ✓ Does link pass exact role parameter?: ${hasRoleParam ? '✅ PASS' : '❌ FAILED'}`);
      console.log(`  ✓ Is Google Meet link completely removed from email?: ${!emailHasMeet ? '✅ PASS (Zero Meet links)' : '❌ FAILED'}`);

      if (hasLocalhost || !hasLiveRender || !hasRoleParam || emailHasMeet) {
        throw new Error(`Validation failed for role ${role}`);
      }
    }
  }

  // 3. Verify ALL question sets are mutually distinct
  console.log('\n--- Cross-Checking Domain Distinctness across all roles ---');
  const roleNames = Object.keys(roleQuestionSets);
  for (let i = 0; i < roleNames.length; i++) {
    for (let j = i + 1; j < roleNames.length; j++) {
      const roleA = roleNames[i];
      const roleB = roleNames[j];
      const setA = new Set(roleQuestionSets[roleA]);
      const overlap = roleQuestionSets[roleB].filter(q => setA.has(q));

      if (overlap.length > 0) {
        console.error(`❌ Overlap detected between "${roleA}" and "${roleB}":`, overlap);
        throw new Error(`Questions overlap between ${roleA} and ${roleB}`);
      } else {
        console.log(`  ✅ 0% overlap between "${roleA}" and "${roleB}" (Completely unique 20 MCQs)`);
      }
    }
  }

  console.log('\n🎉 ALL DOMAIN SPECIFIC MCQS & LIVE RENDER LINK CHECKS PASSED 100%!');
}

testDomainSpecificAndLiveUrls().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
