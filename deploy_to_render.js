/**
 * Automated Render Cloud Deployment Script
 * Uses Render REST API v1 to automatically deploy https://github.com/sharmavageesha2000-cmd/fintech-hr-workflow-
 */

const https = require('https');

const RENDER_API_KEY = process.argv[2] || process.env.RENDER_API_KEY;

if (!RENDER_API_KEY) {
  console.error('❌ Error: Please provide your Render API Key (starts with rnd_...)');
  console.log('👉 Get your Render API Key here: https://dashboard.render.com/u/settings#api-keys');
  process.exit(1);
}

function renderApiRequest(endpoint, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://api.render.com/v1${endpoint}`);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RENDER_API_KEY}`
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject({ statusCode: res.statusCode, body: parsed });
          }
        } catch (e) {
          resolve(body);
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function deploy() {
  console.log('🚀 Connecting to Render API...');
  
  // 1. Get Owner / Workspace ID
  const owners = await renderApiRequest('/owners');
  console.log('✅ Connected! Workspace:', owners[0]?.owner?.name || 'Personal Account');
  const ownerId = owners[0]?.owner?.id;

  if (!ownerId) {
    throw new Error('No workspace owner ID found on your Render account.');
  }

  // 2. Create Web Service
  console.log('📦 Creating Web Service for repository: fintech-hr-workflow- ...');
  const servicePayload = {
    type: 'web_service',
    name: 'hr-smartflow-automation',
    ownerId: ownerId,
    repo: 'https://github.com/sharmavageesha2000-cmd/fintech-hr-workflow-',
    branch: 'main',
    autoDeploy: 'yes',
    serviceDetails: {
      env: 'node',
      plan: 'free',
      region: 'oregon',
      envSpecificDetails: {
        buildCommand: 'npm install',
        startCommand: 'node server.js'
      },
      envVars: [
        { key: 'PORT', value: '10000' },
        { key: 'NODE_ENV', value: 'production' },
        { key: 'RECRUITER_EMAIL', value: 'sharmavageesha2000@gmail.com' },
        { key: 'RECRUITER_NAME', value: 'Vageesha Sharma' },
        { key: 'GOOGLE_APP_PASSWORD', value: process.env.GOOGLE_APP_PASSWORD || '' },
        { key: 'GEMINI_API_KEY', value: process.env.GEMINI_API_KEY || '' }
      ]
    }
  };

  const service = await renderApiRequest('/services', 'POST', servicePayload);
  console.log('🎉 Service successfully created on Render!');
  console.log('Service ID:', service.id);
  console.log('Service Name:', service.name);
  console.log('Service URL:', service.serviceDetails?.url || `https://${service.name}.onrender.com`);

  // 3. Trigger initial deploy
  console.log('⚡ Triggering initial build & deploy...');
  const deployRes = await renderApiRequest(`/services/${service.id}/deploys`, 'POST', {});
  console.log('🚀 Deployment initiated! Deploy ID:', deployRes.id);
  console.log('\n======================================================');
  console.log('🌟 YOUR CLOUD DEPLOYMENT IS LIVE & BUILDING!');
  console.log('👉 Dashboard URL:', `https://dashboard.render.com/web/${service.id}`);
  console.log('👉 Live App URL:', service.serviceDetails?.url || `https://${service.name}.onrender.com`);
  console.log('======================================================');
}

deploy().catch(err => {
  console.error('❌ Deployment error:', err);
});
