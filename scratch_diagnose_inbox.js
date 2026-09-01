require('dotenv').config();
const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');
const fs = require('fs');
const path = require('path');

const email = process.env.RECRUITER_EMAIL || 'sharmavageesha2000@gmail.com';
const password = (process.env.GOOGLE_APP_PASSWORD || 'qoyolivxrkuqxmkx').replace(/\s+/g, '');

const config = {
  imap: {
    user: email,
    password: password,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
    authTimeout: 10000
  }
};

async function diagnose() {
  console.log(`Connecting to IMAP for ${email}...`);
  const connection = await imaps.connect(config);
  const box = await connection.openBox('INBOX');
  const total = box.messages.total || 0;
  console.log(`Total messages in INBOX: ${total}`);

  const processedFile = path.join(__dirname, 'data', 'processed_emails.json');
  let processedUids = [];
  if (fs.existsSync(processedFile)) {
    try { processedUids = JSON.parse(fs.readFileSync(processedFile, 'utf8')); } catch(e) {}
  }
  console.log(`Processed UIDs count in file: ${processedUids.length}`);
  console.log(`Last 10 Processed UIDs:`, processedUids.slice(-10));

  const startSeq = Math.max(1, total - 10);
  const seqRange = `${startSeq}:${total}`;
  console.log(`Fetching sequence range: ${seqRange}`);

  const imap = connection.imap;

  const messages = await new Promise((resolve) => {
    const list = [];
    const fetchReq = imap.seq.fetch(seqRange, { bodies: '', struct: true });
    fetchReq.on('message', (msg, seqno) => {
      let buffer = '';
      let uid = null;
      let date = null;
      msg.on('body', stream => stream.on('data', chunk => buffer += chunk.toString('utf8')));
      msg.once('attributes', attrs => { uid = attrs.uid; date = attrs.date; });
      msg.once('end', () => { list.push({ uid, date, buffer }); });
    });
    fetchReq.once('end', () => resolve(list));
    fetchReq.once('error', (err) => { console.error('Fetch error:', err); resolve(list); });
  });

  console.log(`\n--- Latest ${messages.length} Messages in Inbox ---`);
  for (const m of messages) {
    const isProcessed = processedUids.includes(String(m.uid));
    const parsed = await simpleParser(m.buffer);
    const fromAddr = parsed.from?.value?.[0]?.address || '';
    const fromName = parsed.from?.value?.[0]?.name || '';
    const subject = parsed.subject || '';
    const attachments = (parsed.attachments || []).map(a => ({ filename: a.filename, contentType: a.contentType, size: a.size }));
    
    console.log(`\nUID: ${m.uid} | IsProcessed: ${isProcessed} | Date: ${m.date}`);
    console.log(`From: "${fromName}" <${fromAddr}>`);
    console.log(`Subject: "${subject}"`);
    console.log(`Attachments (${attachments.length}):`, JSON.stringify(attachments));
    console.log(`Body snippet (first 100 chars): ${parsed.text ? parsed.text.slice(0, 100).replace(/\n/g, ' ') : 'NO_TEXT'}`);
  }

  connection.end();
}

diagnose().catch(console.error);
