const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');
const { isLegitimateResumeDocument, extractDocumentText, getProcessedUids } = require('./email_poller');
const fs = require('fs');
require('dotenv').config();

async function run() {
  const settings = JSON.parse(fs.readFileSync('./data/settings.json', 'utf8'));
  const recruiterEmail = settings.recruiterEmail || process.env.RECRUITER_EMAIL || 'sharmavageesha2000@gmail.com';
  const recruiterPass = (settings.appPassword || process.env.GOOGLE_APP_PASSWORD || 'qoyolivxrkuqxmkx').replace(/\s+/g, '');

  console.log(`Connecting IMAP for: ${recruiterEmail}...`);
  const config = {
    imap: {
      user: recruiterEmail,
      password: recruiterPass,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
      authTimeout: 10000,
      connTimeout: 10000
    }
  };

  const connection = await imaps.connect(config);
  const box = await connection.openBox('INBOX');
  const total = box.messages.total;
  console.log(`Total messages in INBOX: ${total}`);

  const processedUids = getProcessedUids();
  console.log(`Total processed UIDs recorded: ${processedUids.length}`);

  // Fetch last 10 messages
  const count = 10;
  const startSeq = Math.max(1, total - count + 1);
  const messages = await connection.search([['ALL']], { bodies: '', struct: true });
  
  // Sort by UID desc
  messages.sort((a, b) => b.attributes.uid - a.attributes.uid);
  const latest10 = messages.slice(0, 10);

  console.log(`\nInspecting latest ${latest10.length} emails:`);
  for (const msg of latest10) {
    const uid = msg.attributes.uid;
    const allParts = msg.parts.find(p => p.which === '');
    const rawBody = allParts ? allParts.body : '';
    const parsed = await simpleParser(rawBody);

    const from = parsed.from?.text || parsed.from?.value?.[0]?.address || 'Unknown';
    const subject = parsed.subject || 'No Subject';
    const date = parsed.date;
    const attachments = parsed.attachments || [];
    const isProcessed = processedUids.includes(String(uid));

    console.log(`\n------------------------------------------------------------`);
    console.log(`UID: ${uid} | Processed: ${isProcessed} | Date: ${date}`);
    console.log(`From: ${from}`);
    console.log(`Subject: "${subject}"`);
    console.log(`Attachments count: ${attachments.length}`);

    if (attachments.length > 0) {
      for (const att of attachments) {
        console.log(`  📎 Attachment: "${att.filename}" (${att.contentType}, ${att.size} bytes)`);
        const text = await extractDocumentText(att.content, att.filename, att.contentType);
        console.log(`     Text length: ${text.length} characters`);
        const fromAddress = parsed.from?.value?.[0]?.address || from;
        const isLegit = isLegitimateResumeDocument(att.filename, text, fromAddress, subject);
        console.log(`     isLegitimateResumeDocument: ${isLegit}`);
      }
    }
  }

  connection.end();
}

run().catch(console.error);
