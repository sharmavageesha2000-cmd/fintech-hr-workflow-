const { execSync } = require('child_process');
const git = 'C:\\Users\\VAGEESHA\\AppData\\Local\\GitHubDesktop\\app-3.6.3\\resources\\app\\git\\cmd\\git.exe';
console.log(execSync(`"${git}" log -n 5 --oneline`).toString());
console.log('Status:');
console.log(execSync(`"${git}" status`).toString());
