require('dotenv').config();
const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');
const { extractDocumentText, isSystemOutboundLoop } = require('./email_poller');
const { evaluateResumeWithGemini, cleanAndExtractJobRole } = require('./gemini_evaluator');

async function testFetch() {
  const config = {
    imap: {
      user: 'sharmavageesha2000@gmail.com',
      password: 'qoyolivxrkuqxmkx',
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
      authTimeout: 15000
    }
  };

  const connection = await imaps.connect(config);
  const box = await connection.openBox('INBOX');
  const total = box.messages.total || 0;
  console.log(`Total messages in mailbox: ${total}`);

  const startSeq = Math.max(1, total - 12);
  const seqRange = `${startSeq}:${total}`;

  const imap = connection.imap;
  const fetchedItems = [];

  await new Promise((resolve) => {
    const fetchRequest = imap.seq.fetch(seqRange, { bodies: '', struct: true });
    fetchRequest.on('message', (msg) => {
      let buffer = '';
      let uid = null;
      msg.on('body', (stream) => {
        stream.on('data', chunk => buffer += chunk.toString('utf8'));
      });
      msg.once('attributes', (attrs) => {
        uid = attrs.uid;
      });
      msg.once('end', () => {
        if (uid) fetchedItems.push({ uid, buffer });
      });
    });
    fetchRequest.once('error', resolve);
    fetchRequest.once('end', resolve);
  });

  connection.end();

  console.log(`\nFetched ${fetchedItems.length} raw messages. Parsing...`);

  for (let i = fetchedItems.length - 1; i >= 0; i--) {
    const item = fetchedItems[i];
    const parsed = await simpleParser(item.buffer);
    const sender = parsed.from?.value?.[0]?.address || parsed.from?.text || '';
    const subject = parsed.subject || '';
    const attachments = parsed.attachments || [];
    const isLoop = isSystemOutboundLoop(sender, subject, parsed.text || '');

    console.log(`\n------------------------------------------------------`);
    console.log(`[UID: ${item.uid}] | From: ${sender} | Date: ${parsed.date}`);
    console.log(`Subject: "${subject}"`);
    console.log(`Is Loop/Bounce Filtered?: ${isLoop}`);
    console.log(`Attachments (${attachments.length}): ${attachments.map(a => `${a.filename} (${a.contentType}, ${a.size}b)`).join(', ')}`);
    console.log(`Snippet: "${(parsed.text || '').slice(0, 120).replace(/\n/g, ' ')}"`);

    if (attachments.length > 0) {
      for (const att of attachments) {
        const text = await extractDocumentText(att.content, att.filename, att.contentType);
        console.log(`   -> Extracted from "${att.filename}" (${text.length} chars): "${text.slice(0, 150).replace(/\n/g, ' ')}..."`);
        const cleanRole = cleanAndExtractJobRole(subject + ' ' + att.filename, text);
        console.log(`   -> Detected Target Role: "${cleanRole}"`);
        const evalRes = await evaluateResumeWithGemini({
          candidateName: parsed.from?.value?.[0]?.name || 'Candidate',
          candidateEmail: sender,
          roleApplied: cleanRole,
          emailSubject: subject,
          emailBody: parsed.text || '',
          resumeText: text,
          fileName: att.filename
        });
        console.log(`   -> AI EVALUATION: Status: ${evalRes.status} | Match Score: ${evalRes.matchScore}% | Matched Skills: ${JSON.stringify(evalRes.skills)} | Missing: ${JSON.stringify(evalRes.missingSkills)}`);
      }
    }
  }
}

testFetch().catch(console.error);
