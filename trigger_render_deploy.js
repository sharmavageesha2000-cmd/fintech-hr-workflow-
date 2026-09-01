require('dotenv').config();
const https = require('https');

const RENDER_API_KEY = process.argv[2] || process.env.RENDER_API_KEY || 'rnd_6vT7mk49l8u0pv2tCChLbnhyrlji';

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

async function trigger() {
  console.log('🚀 Connecting to Render Cloud API...');
  
  // 1. List Services
  const services = await renderApiRequest('/services?limit=20');
  console.log(`Found ${services.length} services on Render account.`);

  services.forEach((s, i) => {
    const svc = s.service || s;
    console.log(`${i + 1}. [${svc.id}] ${svc.name} (${svc.type}) - URL: ${svc.serviceDetails?.url}`);
  });

  const targetService = services.find(s => {
    const svc = s.service || s;
    return svc.name.includes('hr') || svc.name.includes('smartflow') || svc.name.includes('workflow') || svc.name.includes('automation');
  }) || services[0];

  if (!targetService) {
    console.error('❌ No service found on Render account.');
    return;
  }

  const svc = targetService.service || targetService;
  console.log(`\n🎯 Target Service: "${svc.name}" (ID: ${svc.id})`);
  console.log(`   URL: ${svc.serviceDetails?.url || 'https://' + svc.name + '.onrender.com'}`);

  // 2. Set Env Vars (Google App Password & Gemini Key) on Render Cloud
  console.log('\n⚙️ Synchronizing Environment Variables on Render Cloud...');
  try {
    await renderApiRequest(`/services/${svc.id}/env-vars`, 'PUT', [
      { key: 'PORT', value: '10000' },
      { key: 'NODE_ENV', value: 'production' },
      { key: 'RECRUITER_EMAIL', value: 'sharmavageesha2000@gmail.com' },
      { key: 'RECRUITER_NAME', value: 'Vageesha Sharma' },
      { key: 'GOOGLE_APP_PASSWORD', value: 'qoyolivxrkuqxmkx' },
      { key: 'GEMINI_API_KEY', value: process.env.GEMINI_API_KEY || '' }
    ]);
    console.log('✅ Environment variables successfully synchronized on Render Cloud!');
  } catch (err) {
    console.warn('⚠️ Env var sync warning:', err.body || err.message);
  }

  // 3. Trigger Fresh Clear-Cache Deploy
  console.log('\n⚡ Triggering Fresh Clear-Build-Cache Deploy on Render...');
  const deployRes = await renderApiRequest(`/services/${svc.id}/deploys`, 'POST', {
    clearCache: 'clear'
  });

  console.log('🎉 Deploy initiated successfully!');
  console.log('   Deploy ID:', deployRes.id);
  console.log('   Commit:', deployRes.commit?.id || 'Latest main branch');
  console.log('   Status:', deployRes.status);

  // 4. Poll Deploy Status
  console.log('\n⏳ Monitoring deployment progress...');
  for (let attempt = 1; attempt <= 20; attempt++) {
    await new Promise(r => setTimeout(r, 6000));
    try {
      const check = await renderApiRequest(`/services/${svc.id}/deploys/${deployRes.id}`);
      console.log(`[${attempt * 6}s] Deploy Status: ${check.status}`);
      if (check.status === 'live') {
        console.log('\n🎉 SUCCESS! Render Cloud Service is now LIVE and fully deployed!');
        console.log(`👉 HR Dashboard URL: ${svc.serviceDetails?.url}`);
        console.log(`👉 Careers Website URL: ${svc.serviceDetails?.url}/website/`);
        return;
      }
      if (check.status === 'build_failed' || check.status === 'canceled') {
        console.error(`❌ Deployment ended with status: ${check.status}`);
        return;
      }
    } catch (e) {
      console.warn('Status poll warning:', e.message);
    }
  }

  console.log('\n✅ Deployment is progressing in the background on Render Cloud!');
  console.log(`👉 Live URL: ${svc.serviceDetails?.url}`);
}

trigger().catch(err => {
  console.error('❌ Render API Error:', err);
});
