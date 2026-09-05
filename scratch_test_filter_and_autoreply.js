const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');
const { isLegitimateResumeDocument, extractDocumentText } = require('./email_poller');

async function testFetchLatest() {
  console.log('Testing fast IMAP fetch for latest 10 messages...');
  const config = {
    imap: {
      user: 'sharmavageesha2000@gmail.com',
      password: 'qoyolivxrkuqxmkx',
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
      authTimeout: 25000,
      connTimeout: 25000
    }
  };

  const connection = await imaps.connect(config);
  const box = await connection.openBox('INBOX');
  const total = box.messages.total;
  console.log(`Box opened. Total messages: ${total}`);

  const start = Math.max(1, total - 9);
  const searchCriteria = [`${start}:${total}`];
  const fetchOptions = { bodies: [''], struct: true, markSeen: false };

  console.log(`Searching sequence range ${start}:${total}...`);
  const messages = await connection.search(searchCriteria, fetchOptions);
  console.log(`Found ${messages.length} messages in range!`);

  for (const msg of messages) {
    const uid = msg.attributes.uid;
    const bodyPart = msg.parts.find(p => p.which === '');
    const rawBody = bodyPart ? bodyPart.body : '';
    console.log(`\nProcessing Seq with UID: ${uid} (Raw body size: ${rawBody.length} bytes)...`);

    const parsed = await simpleParser(rawBody);
    console.log(`  From: ${parsed.from?.text}`);
    console.log(`  Subject: "${parsed.subject}"`);
    console.log(`  Date: ${parsed.date}`);
    console.log(`  Attachments: ${parsed.attachments ? parsed.attachments.length : 0}`);

    if (parsed.attachments && parsed.attachments.length > 0) {
      for (const att of parsed.attachments) {
        console.log(`    -> File: "${att.filename}" (${att.contentType}, ${att.size} bytes)`);
        const text = await extractDocumentText(att.content, att.filename, att.contentType);
        console.log(`       Extracted text preview: "${text.substring(0, 80).replace(/\n/g, ' ')}..."`);
        const isLegit = isLegitimateResumeDocument(att.filename, text, parsed.from?.value?.[0]?.address || parsed.from?.text, parsed.subject);
        console.log(`       Is Legitimate Resume: ${isLegit}`);
      }
    }
  }

  connection.end();
  console.log('\nDone!');
}

testFetchLatest().catch(console.error);
