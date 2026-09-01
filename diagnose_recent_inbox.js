require('dotenv').config();
const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');
const fs = require('fs');

async function diagnose() {
  console.log('Connecting to IMAP using imap-simple...');
  const connection = await imaps.connect({
    imap: {
      user: 'sharmavageesha2000@gmail.com',
      password: 'qoyolivxrkuqxmkx',
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      authTimeout: 10000,
      tlsOptions: { rejectUnauthorized: false }
    }
  });

  await connection.openBox('INBOX');

  const searchCriteria = ['ALL'];
  const fetchOptions = {
    bodies: ['HEADER', 'TEXT', ''],
    struct: true
  };

  const results = await connection.search(searchCriteria, fetchOptions);
  console.log(`Total messages in INBOX: ${results.length}`);

  const recent = results.slice(-10).reverse();

  console.log('\n======================================================');
  console.log('📬 RECENT 10 MESSAGES IN INBOX:');
  console.log('======================================================');

  for (let i = 0; i < recent.length; i++) {
    const item = recent[i];
    const allPart = item.parts.find(p => p.which === '');
    const rawSource = allPart ? allPart.body : '';
    let parsed = null;
    if (rawSource) {
      parsed = await simpleParser(rawSource);
    }
    const headerPart = item.parts.find(p => p.which === 'HEADER');
    const subject = parsed ? parsed.subject : headerPart?.body?.subject?.[0];
    const from = parsed ? (parsed.from?.text || parsed.from?.value?.[0]?.address) : headerPart?.body?.from?.[0];
    const date = parsed ? parsed.date : headerPart?.body?.date?.[0];
    const attachments = parsed?.attachments?.map(a => `${a.filename} (${a.contentType}, ${a.size}b)`) || [];

    console.log(`[${i + 1}] UID: ${item.attributes?.uid} | Date: ${date} | From: ${from}`);
    console.log(`    Subject: "${subject}"`);
    console.log(`    Attachments: ${attachments.length > 0 ? attachments.join(', ') : 'None'}`);
    console.log(`    Text snippet: "${(parsed?.text || '').slice(0, 150).replace(/\n/g, ' ')}"`);
    console.log('------------------------------------------------------');
  }

  connection.end();
}

diagnose().catch(console.error);
