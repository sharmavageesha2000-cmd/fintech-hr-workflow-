const { execSync } = require('child_process');
const git = 'C:\\Users\\VAGEESHA\\AppData\\Local\\GitHubDesktop\\app-3.6.3\\resources\\app\\git\\cmd\\git.exe';

try {
  console.log('Staging all files...');
  execSync(`"${git}" add -A`);
  
  console.log('Committing all changes...');
  const commitOut = execSync(`"${git}" commit -m "feat(workflow): save and persist all enterprise assessment, auto-reply, dashboard, and test suites"`).toString();
  console.log('Commit Output:', commitOut);

  console.log('Pushing to origin main...');
  const pushOut = execSync(`"${git}" push origin main`).toString();
  console.log('Push Output:', pushOut);
  console.log('✅ Successfully pushed all changes to GitHub!');
} catch (e) {
  console.log('Git output:', e.stdout ? e.stdout.toString() : '', e.stderr ? e.stderr.toString() : e.message);
}
