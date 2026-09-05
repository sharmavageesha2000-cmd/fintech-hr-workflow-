/**
 * Direct GitHub Repository Uploader via GitHub REST API
 * Uploads all workflow, dashboard, backend, and React website files directly to https://github.com/sharmavageesha2000-cmd/fintech-hr-workflow-
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const REPO_OWNER = process.env.REPO_OWNER || 'sharmavageesha2000-cmd';
const REPO_NAME = process.env.REPO_NAME || 'fintech-hr-workflow-';

const FILES_TO_UPLOAD = [
  'README.md',
  '.gitignore',
  'render.yaml',
  'package.json',
  'hr_workflow.json',
  'workflows.json',
  'server.js',
  'gemini_evaluator.js',
  'email_poller.js',
  'assessment_questions.js',
  'start_hr_system.bat',
  'test_hr_automation_suite.js',
  'data/jobs.json',
  'data/candidates.json',
  'data/settings.json',
  'public/index.html',
  'public/styles.css',
  'public/app.js',
  'public/assessment.html',
  'public/assessment.js',
  'public/website/index.html',
  'public/website/assets/index-C6VA72bO.js',
  'public/website/assets/index-ic_1IyeW.css',
  'website/package.json',
  'website/tailwind.config.js',
  'website/postcss.config.js',
  'website/vite.config.js',
  'website/index.html',
  'website/src/main.jsx',
  'website/src/App.jsx',
  'website/src/context/ThemeContext.jsx',
  'website/src/styles/index.css',
  'website/src/data/services.js',
  'website/src/data/jobs.js',
  'website/src/data/techStack.js',
  'website/src/components/Navbar.jsx',
  'website/src/components/Footer.jsx',
  'website/src/components/DashboardMockup.jsx',
  'website/src/components/ApplyModal.jsx',
  'website/src/components/ServiceCard.jsx',
  'website/src/components/JobCard.jsx',
  'website/src/components/CTASection.jsx',
  'website/src/components/FinTechVisual.jsx',
  'website/src/components/StatsSection.jsx',
  'website/src/components/WhyChooseUs.jsx',
  'website/src/pages/Home.jsx',
  'website/src/pages/About.jsx',
  'website/src/pages/Solutions.jsx',
  'website/src/pages/Technology.jsx',
  'website/src/pages/Careers.jsx',
  'website/src/pages/Contact.jsx'
];

function githubApiRequest(pathUrl, method, body, token) {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'api.github.com',
      port: 443,
      path: pathUrl,
      method,
      headers: {
        'User-Agent': 'HR-Workflow-Uploader',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        ...(dataString ? {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(dataString)
        } : {})
      }
    };

    const req = https.request(options, (res) => {
      let resData = '';
      res.on('data', chunk => resData += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(resData);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ statusCode: res.statusCode, data: json });
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${json.message || resData}`));
          }
        } catch (e) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ statusCode: res.statusCode, data: resData });
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${resData}`));
          }
        }
      });
    });

    req.on('error', reject);
    if (dataString) req.write(dataString);
    req.end();
  });
}

async function uploadFile(filePath, token) {
  const fullPath = path.join(__dirname, filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`[Skip] File not found: ${filePath}`);
    return;
  }

  const contentBase64 = fs.readFileSync(fullPath).toString('base64');
  const targetApiUrl = `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath.replace(/\\/g, '/')}`;

  // Check if file already exists to get SHA
  let existingSha = null;
  try {
    const existing = await githubApiRequest(targetApiUrl, 'GET', null, token);
    existingSha = existing.data?.sha;
  } catch (e) {
    // File doesn't exist yet, which is fine
  }

  const body = {
    message: `Update ${filePath.replace(/\\/g, '/')}`,
    content: contentBase64,
    branch: 'main',
    ...(existingSha ? { sha: existingSha } : {})
  };

  try {
    await githubApiRequest(targetApiUrl, 'PUT', body, token);
    console.log(`✅ Uploaded: ${filePath}`);
  } catch (err) {
    console.error(`❌ Failed to upload ${filePath}:`, err.message);
  }
}

async function pushAll(token) {
  if (!token) {
    console.error('❌ Error: GitHub Personal Access Token is required.');
    console.log('Usage: node push_to_github.js <YOUR_GITHUB_PAT>');
    process.exit(1);
  }

  console.log(`🚀 Starting push to https://github.com/${REPO_OWNER}/${REPO_NAME} ...`);
  for (const f of FILES_TO_UPLOAD) {
    await uploadFile(f, token);
  }
  console.log('\n🎉 All workflow, dashboard, and website files successfully pushed to GitHub!');
  console.log(`👉 View your repository: https://github.com/${REPO_OWNER}/${REPO_NAME}`);
}

const tokenArg = process.argv[2] || process.env.GITHUB_TOKEN;
if (tokenArg) {
  pushAll(tokenArg).catch(console.error);
}

module.exports = { pushAll, FILES_TO_UPLOAD };
