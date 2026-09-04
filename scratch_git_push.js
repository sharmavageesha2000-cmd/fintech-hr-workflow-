const { execSync } = require('child_process');
const git = 'C:\\Users\\VAGEESHA\\AppData\\Local\\GitHubDesktop\\app-3.6.3\\resources\\app\\git\\cmd\\git.exe';

try {
  console.log(execSync(`"${git}" add .`).toString());
  console.log(execSync(`"${git}" commit -m "Enhance resilient port fallback and continuous scanner daemon"`).toString());
  console.log(execSync(`"${git}" push origin main`).toString());
  console.log('Successfully pushed to GitHub!');
} catch (e) {
  console.error(e.message);
  if (e.stdout) console.log(e.stdout.toString());
  if (e.stderr) console.error(e.stderr.toString());
}
