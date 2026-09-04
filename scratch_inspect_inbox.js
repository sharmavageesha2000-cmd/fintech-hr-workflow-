const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');
const { isLegitimateResumeDocument, extractDocumentText, getProcessedUids } = require('./email_poller');
require('dotenv').config();

async function checkLatestInboxEmails() {
  const config = {
    imap: {
      user: process.env.RECRUITER_EMAIL || 'sharmavageesha2000@gmail.com',
      password: (process.env.GOOGLE_APP_PASSWORD || 'qoyolivxrkuqxmkx').replace(/\s+/g, ''),
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false }
    }
  };

  console.log('🔍 Checking latest emails in INBOX...');
  const connection = await imaps.connect(config);
  const box = await connection.openBox('INBOX');
  const total = box.messages.total;
  console.log('Total messages in INBOX:', total);

  const processedList = getProcessedUids();
  console.log('Total UIDs in processed_emails.json:', processedList.length);

  const count = 10;
  const startSeq = Math.max(1, total - count + 1);
  const fetchRequest = connection.imap.seq.fetch(startSeq + ':' + total, { bodies: '', struct: true });

  const emails = [];
  fetchRequest.on('message', (msg, seqno) => {
    let buffer = '';
    let uid = null;
    msg.on('body', (stream) => {
      stream.on('data', chunk => buffer += chunk.toString('utf8'));
    });
    msg.once('attributes', (attrs) => {
      uid = attrs.uid;
    });
    msg.once('end', () => {
      if (uid) emails.push({ uid, buffer, seqno });
    });
  });

  fetchRequest.once('end', async () => {
    setTimeout(async () => {
      for (const item of emails) {
        console.log('\n======================================================');
        console.log(`Seq: ${item.seqno} | UID: ${item.uid} | In processedList?: ${processedList.includes(String(item.uid))}`);
        try {
          const parsed = await simpleParser(item.buffer);
          console.log(`  Date: ${parsed.date}`);
          console.log(`  From: ${parsed.from?.text || parsed.from?.value?.[0]?.address}`);
          console.log(`  Subject: ${parsed.subject}`);
          console.log(`  Attachments count: ${parsed.attachments ? parsed.attachments.length : 0}`);
          
          if (parsed.attachments && parsed.attachments.length > 0) {
            for (const att of parsed.attachments) {
              console.log(`    -> Attachment: "${att.filename}" (${att.contentType}, ${att.size} bytes)`);
              const text = await extractDocumentText(att.content, att.filename, att.contentType);
              console.log(`       Extracted text length: ${text.length} chars`);
              console.log(`       Text preview: ${text.substring(0, 100).replace(/\n/g, ' ')}...`);
              const isLegit = isLegitimateResumeDocument(att.filename, text, parsed.from?.value?.[0]?.address, parsed.subject);
              console.log(`       isLegitimateResumeDocument result: ${isLegit}`);
            }
          }
        } catch(e) {
          console.error('  Error parsing email:', e.message);
        }
      }
      connection.end();
    }, 3000);
  });
}

checkLatestInboxEmails().catch(console.error);
