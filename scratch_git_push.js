const { execSync } = require('child_process');
const git = 'C:\\Users\\VAGEESHA\\AppData\\Local\\GitHubDesktop\\app-3.6.3\\resources\\app\\git\\cmd\\git.exe';

try {
  const out = execSync(`"${git}" push origin main`).toString();
  console.log('Push output:', out);
} catch (e) {
  console.log('Git push output/error:', e.stdout ? e.stdout.toString() : '', e.stderr ? e.stderr.toString() : e.message);
}
