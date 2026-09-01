function extractCandidateNameFromResume(resumeText, fileName, senderName = '') {
  const roleStopwords = ['ai', 'ml', 'prompt', 'engineer', 'developer', 'analyst', 'designer', 'specialist', 'consultant', 'fresher', 'intern', 'manager', 'lead', 'digital', 'marketing', 'executive', 'cv', 'resume', 'fashion', 'stylist', 'business', 'years', 'full', 'stack', 'frontend', 'backend', 'page'];

  // 1. PRIMARY: Extract from Resume Document Text Header (First 8 lines)
  if (resumeText) {
    const lines = resumeText
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(l => l.length > 0 && !l.toLowerCase().startsWith('page ') && !l.toLowerCase().startsWith('--'));

    for (let i = 0; i < Math.min(8, lines.length); i++) {
      let line = lines[i]
        .replace(/^(mr\.|ms\.|mrs\.|dr\.)\s+/i, '')
        .replace(/[|•,].*$/, '') // remove title after pipe
        .replace(/[\(\[\{].*?[\)\]\}]/g, '') // remove brackets
        .trim();

      const lower = line.toLowerCase();
      if (lower.includes('curriculum') || lower.includes('resume') || lower.includes('profile') || 
          lower.includes('summary') || lower.includes('experience') || lower.includes('education') || 
          lower.includes('contact') || lower.includes('phone') || lower.includes('objective') ||
          lower.includes('email') || lower.includes('@') || lower.includes('http') || lower.length < 3 || lower.length > 30) {
        continue;
      }

      const words = line.split(/\s+/).filter(w => /^[a-zA-Z.'-]+$/.test(w) && !roleStopwords.includes(w.toLowerCase()));
      if (words.length >= 2 && words.length <= 3) {
        return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      }
      if (words.length === 1 && words[0].length >= 3 && !roleStopwords.includes(words[0].toLowerCase())) {
        return words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
      }
    }
  }

  // 2. SECONDARY: Extract from Filename if it contains candidate name pattern (e.g. "Kabir_Singh_...", "Sneha_Verma_...")
  if (fileName) {
    const cleanFn = fileName
      .replace(/\.(pdf|docx?|txt|rtf|odt)$/i, '')
      .replace(/^[\d\s_\-()#]+/, '')
      .replace(/[\s_\-()#\d]+$/, '')
      .replace(/[_\-]+/g, ' ')
      .trim();

    const fnParts = cleanFn.split(/\s+/).filter(w => !roleStopwords.includes(w.toLowerCase()) && !/^\d+$/.test(w));
    if (fnParts.length >= 2 && fnParts.length <= 3) {
      return fnParts.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    }
  }

  // 3. TERTIARY: Sender name if not recruiter name
  if (senderName && !senderName.toLowerCase().includes('vageesha') && !senderName.toLowerCase().includes('recruiter')) {
    return senderName;
  }

  return 'Candidate';
}

console.log('Test 1 (Full Stack AI Engineer):', extractCandidateNameFromResume('Page 1\nROHAN SHARMA\nFull Stack AI Engineer | Python | React.js', 'Full_Stack_AI_Engineer_Resume (2).pdf'));
console.log('Test 2 (Business Analyst):', extractCandidateNameFromResume('ANANYA VERMA\nBUSINESS ANALYST | AGILE & PROCESS', 'Business_Analyst_Resume_2_to_3_Years.pdf'));
console.log('Test 3 (Prompt Engineer):', extractCandidateNameFromResume('Kabir Singh\nAI Prompt Engineer (Fresher)', '4_Kabir_Singh_AI_Prompt_Engineer_Fresher.pdf'));
console.log('Test 4 (Fashion CV):', extractCandidateNameFromResume('Rishu Paliwal\nFashion Stylist & Wardrobe Consultant', 'FASHION CV.pdf'));
console.log('Test 5 (Digital Marketing):', extractCandidateNameFromResume('Sneha Verma\nDigital Marketing Specialist', '5_Sneha_Verma_Digital_Marketing.docx'));
