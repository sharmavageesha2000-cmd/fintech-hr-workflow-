const { execSync } = require('child_process');
const git = 'C:\\Users\\VAGEESHA\\AppData\\Local\\GitHubDesktop\\app-3.6.3\\resources\\app\\git\\cmd\\git.exe';

try {
  execSync(`"${git}" add assessment_questions.js server.js public/assessment.js public/assessment.html`);
  const out = execSync(`"${git}" commit -m "feat: 280-question bank with dynamic sampling, question shuffling, randomized options, and session-aware grading"`).toString();
  console.log(out);
} catch (e) {
  console.log('Git output:', e.stdout ? e.stdout.toString() : e.message);
}
