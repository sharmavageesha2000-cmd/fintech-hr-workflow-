const nodemailer = require('nodemailer');

const recruiterEmail = 'sharmavageesha2000@gmail.com';
const appPassword = 'qoyolivxrkuqxmkx';

async function testTransport(name, options) {
  console.log(`\nTesting transport: ${name}...`);
  const start = Date.now();
  try {
    const transporter = nodemailer.createTransport(options);
    await transporter.verify();
    console.log(`✅ [${name}] Verified in ${Date.now() - start}ms!`);
    
    // Try sending a test email
    const info = await transporter.sendMail({
      from: `"Finova HR" <${recruiterEmail}>`,
      to: recruiterEmail,
      subject: `Test Dispatch from ${name}`,
      text: `Hello! Transport ${name} works successfully!`
    });
    console.log(`🚀 [${name}] Sent successfully! Message ID: ${info.messageId} in ${Date.now() - start}ms`);
    return true;
  } catch (err) {
    console.error(`❌ [${name}] Failed in ${Date.now() - start}ms:`, err.message);
    return false;
  }
}

async function main() {
  console.log('--- Testing SMTP Transports ---');

  // Config 1: service: 'gmail' with family: 4 (IPv4)
  await testTransport('Gmail Service with family: 4', {
    service: 'gmail',
    family: 4,
    auth: { user: recruiterEmail, pass: appPassword },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 10000
  });

  // Config 2: host: 'smtp.gmail.com', port 465 with family: 4
  await testTransport('smtp.gmail.com:465 (SSL) with family: 4', {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    family: 4,
    auth: { user: recruiterEmail, pass: appPassword },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 10000
  });

  // Config 3: host: 'smtp.gmail.com', port 587 with family: 4
  await testTransport('smtp.gmail.com:587 (STARTTLS) with family: 4', {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    family: 4,
    auth: { user: recruiterEmail, pass: appPassword },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 10000
  });
}

main().catch(console.error);
