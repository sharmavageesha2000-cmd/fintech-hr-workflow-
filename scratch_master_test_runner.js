const { execSync } = require('child_process');

console.log('================================================================');
console.log('        RUNNING COMPLETE AUTOMATION & INTEGRATION SUITE         ');
console.log('================================================================\n');

const testScripts = [
  'test_complete_localhost_workflow.js',
  'test_800_questions_and_rotation.js',
  'test_domain_question_shuffling_suite.js',
  'verify_complete_email_and_assessment_flow.js',
  'test_dynamic_shuffling_and_offer_flow.js',
  'test_offer_letter_only_after_test_passed.js',
  'test_resubmission_lock.js',
  'verify_candidate_isolation_and_flow.js',
  'test_systematic_interview_flow.js'
];

let allPassed = true;
const results = [];

for (const script of testScripts) {
  console.log(`\n▶️ Running: node ${script}...`);
  try {
    const start = Date.now();
    const output = execSync(`node ${script}`, { stdio: 'pipe' }).toString();
    const duration = ((Date.now() - start) / 1000).toFixed(2);
    console.log(`  ✅ PASSED (${duration}s)`);
    results.push({ script, status: 'PASSED', duration });
  } catch (err) {
    allPassed = false;
    console.error(`  ❌ FAILED: node ${script}`);
    console.error(err.stdout ? err.stdout.toString() : '');
    console.error(err.stderr ? err.stderr.toString() : err.message);
    results.push({ script, status: 'FAILED' });
  }
}

console.log('\n================================================================');
console.log('                     FINAL SUMMARY REPORT                       ');
console.log('================================================================');
results.forEach(r => {
  console.log(`- ${r.script.padEnd(45)}: ${r.status === 'PASSED' ? '✅ PASS (' + r.duration + 's)' : '❌ FAIL'}`);
});
console.log('================================================================');
console.log(`OVERALL STATUS: ${allPassed ? '🎉 ALL TESTS PASSED (100%)' : '❌ SOME TESTS FAILED'}`);
console.log('================================================================\n');

if (!allPassed) process.exit(1);
