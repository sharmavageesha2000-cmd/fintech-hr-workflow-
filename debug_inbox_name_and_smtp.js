require('dotenv').config();
const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');
const nodemailer = require('nodemailer');
const { extractDocumentText } = require('./email_poller');

async function check() {
  console.log('Connecting to IMAP...');
  const connection = await imaps.connect({
    imap: {
      user: 'sharmavageesha2000@gmail.com',
      password: 'qoyolivxrkuqxmkx',
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
      authTimeout: 15000
    }
  });

  const box = await connection.openBox('INBOX');
  const total = box.messages.total || 0;
  console.log(`Mailbox Total: ${total}`);

  const startSeq = Math.max(1, total - 8);
  const seqRange = `${startSeq}:${total}`;

  const imap = connection.imap;
  const rawMessages = await new Promise((resolve) => {
    const items = [];
    const req = imap.seq.fetch(seqRange, { bodies: '', struct: true });
    req.on('message', (msg) => {
      let buffer = '';
      let uid = null;
      msg.on('body', (stream) => {
        stream.on('data', chunk => buffer += chunk.toString('utf8'));
      });
      msg.once('attributes', (attrs) => {
        uid = attrs.uid;
      });
      msg.once('end', () => {
        if (uid) items.push({ uid, buffer });
      });
    });
    req.once('error', resolve);
    req.once('end', () => resolve(items));
  });

  connection.end();

  console.log(`Fetched ${rawMessages.length} latest messages.`);

  for (let i = rawMessages.length - 1; i >= 0; i--) {
    const item = rawMessages[i];
    const parsed = await simpleParser(item.buffer);
    const fromAddr = parsed.from?.value?.[0]?.address || '';
    const fromName = parsed.from?.value?.[0]?.name || '';
    const subject = parsed.subject || '';
    const attachments = parsed.attachments || [];

    console.log(`\n======================================================`);
    console.log(`[UID: ${item.uid}] Date: ${parsed.date}`);
    console.log(`From: "${fromName}" <${fromAddr}>`);
    console.log(`Subject: "${subject}"`);
    console.log(`Attachments: ${attachments.map(a => a.filename).join(', ') || 'None'}`);

    if (attachments.length > 0) {
      for (const att of attachments) {
        const text = await extractDocumentText(att.content, att.filename, att.contentType);
        console.log(`--- RESUME TOP 300 CHARS FOR [${att.filename}] ---`);
        console.log(text.slice(0, 300));
        console.log(`--------------------------------------------------`);
      }
    }
  }

  // Test Nodemailer SMTP Live
  console.log('\n--- TESTING LIVE GMAIL SMTP ---');
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sharmavageesha2000@gmail.com',
      pass: 'qoyolivxrkuqxmkx'
    }
  });

  try {
    const info = await transporter.sendMail({
      from: '"Vageesha Sharma • Talent Acquisition" <sharmavageesha2000@gmail.com>',
      to: 'sharmavageesha2000@gmail.com',
      subject: 'SMTP Delivery Diagnostic Test',
      text: 'Testing SMTP auto-reply delivery'
    });
    console.log('✅ SMTP Diagnostic Success! Message-ID:', info.messageId, 'Response:', info.response);
  } catch (err) {
    console.error('❌ SMTP Diagnostic Failed:', err);
  }
}

check().catch(console.error);
