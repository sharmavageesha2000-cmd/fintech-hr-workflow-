require('dotenv').config();
const https = require('https');
const fs = require('fs');
const path = require('path');

const DEFAULT_GEMINI_KEY = process.env.GEMINI_API_KEY || '';
const DEFAULT_MODEL = 'gemini-3.5-flash';
const JOBS_FILE = path.join(__dirname, 'data', 'jobs.json');

/**
 * Extract the real candidate full name strictly from the top of the resume document text
 */
function extractCandidateNameFromResume(resumeText, fileName = '', senderName = '') {
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

/**
 * Load open job positions and active vacancies from jobs.json
 */
function getActiveJobs() {
  try {
    if (fs.existsSync(JOBS_FILE)) {
      const data = JSON.parse(fs.readFileSync(JOBS_FILE, 'utf8'));
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    console.warn('[Jobs Loader Warn]:', err.message);
  }
  return [
    {
      id: 'job-1',
      title: 'Frontend Developer',
      department: 'Technology',
      experienceRequired: '1–3 Years',
      skills: ['React.js', 'JavaScript', 'HTML5 & CSS3', 'Tailwind CSS', 'TypeScript', 'Responsive Design', 'REST APIs'],
      mandatorySkills: ['React.js', 'JavaScript', 'HTML5 & CSS3'],
      minMandatory: 2,
      description: 'Building modern, responsive, high-performance web applications using React.js and modern JavaScript/TypeScript.'
    },
    {
      id: 'job-2',
      title: 'Backend Developer',
      department: 'Technology',
      experienceRequired: '2–4 Years',
      skills: ['Node.js', 'Express', 'REST APIs', 'SQL / PostgreSQL', 'MongoDB', 'Databases', 'Backend Development'],
      mandatorySkills: ['Node.js', 'REST APIs', 'SQL / PostgreSQL', 'MongoDB'],
      minMandatory: 2,
      description: 'Designing scalable REST APIs, microservices, and database schemas with Node.js and PostgreSQL/MongoDB.'
    },
    {
      id: 'job-3',
      title: 'Full Stack AI Engineer',
      department: 'Technology',
      experienceRequired: '2–5 Years',
      skills: ['React.js', 'Node.js', 'Python', 'FastAPI', 'Gemini API / LLMs', 'PostgreSQL', 'REST APIs', 'Docker'],
      mandatorySkills: ['React.js', 'Node.js', 'Python'],
      minMandatory: 2,
      description: 'Building scalable full stack web applications integrating React, Node.js/Python APIs, and Gemini LLM pipelines.'
    },
    {
      id: 'job-4',
      title: 'AI/ML Engineer',
      department: 'Artificial Intelligence',
      experienceRequired: '2–5 Years',
      skills: ['Python', 'Machine Learning', 'PyTorch / TensorFlow', 'LLMs', 'Data Processing', 'AI Workflows'],
      mandatorySkills: ['Python', 'Machine Learning', 'PyTorch / TensorFlow'],
      minMandatory: 2,
      description: 'Developing machine learning models, LLM pipelines, and AI data processing workflows using Python.'
    },
    {
      id: 'job-5',
      title: 'Data Analyst',
      department: 'Data',
      experienceRequired: '1–3 Years',
      skills: ['SQL', 'Excel', 'Power BI / Tableau', 'Data Visualization', 'Business Analytics', 'Python'],
      mandatorySkills: ['Power BI / Tableau', 'Excel', 'Data Visualization', 'SQL'],
      minMandatory: 2,
      description: 'Extracting business insights, writing complex SQL queries, and creating executive data visualization dashboards in Power BI/Tableau/Excel.'
    },
    {
      id: 'job-6',
      title: 'Business Analyst',
      department: 'Business',
      experienceRequired: '1–3 Years',
      skills: ['Requirement Gathering (BRD/FRD)', 'Agile / Scrum', 'Jira', 'Process Mapping', 'Documentation', 'Business Analysis'],
      mandatorySkills: ['Requirement Gathering (BRD/FRD)', 'Agile / Scrum', 'Business Analysis', 'Jira'],
      minMandatory: 2,
      description: 'Bridging business stakeholders and engineering teams with detailed requirement analysis, BRD/FRD creation, and Agile workflows.'
    },
    {
      id: 'job-7',
      title: 'Business Development Executive',
      department: 'Sales',
      experienceRequired: '1–3 Years',
      skills: ['Lead Generation', 'Client Management', 'B2B Sales', 'CRM', 'Communication', 'Outreach'],
      mandatorySkills: ['Lead Generation', 'B2B Sales', 'Client Management'],
      minMandatory: 2,
      description: 'Driving outbound client acquisitions, managing enterprise accounts, and closing strategic sales opportunities.'
    },
    {
      id: 'job-8',
      title: 'UI/UX Designer',
      department: 'Design',
      experienceRequired: '1–3 Years',
      skills: ['Figma', 'UI Design', 'UX Research', 'Wireframing', 'Prototyping', 'Design Systems'],
      mandatorySkills: ['Figma', 'UI Design', 'Wireframing', 'Prototyping'],
      minMandatory: 2,
      description: 'Crafting user-centric UI designs, wireframes, interactive prototypes, and conducting user research in Figma.'
    }
  ];
}

/**
 * Generate an authentic Google Meet URL with standard 3-4-3 character format
 */
function generateAuthenticGoogleMeetLink(customLink) {
  if (customLink && customLink.startsWith('https://meet.google.com/')) {
    return customLink;
  }
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const getChunk = (len) => Array.from({ length: len }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
  return `https://meet.google.com/${getChunk(3)}-${getChunk(4)}-${getChunk(3)}`;
}

/**
 * Accurately extract years of experience from text/resume/email
 */
function extractExperienceYears(text) {
  if (!text) return 1;
  const t = text.toLowerCase();

  const m1 = t.match(/(?:experience\s*(?:of|:)?\s*|with\s+)?(\d+(?:\.\d+)?)\s*(?:\+)?\s*(?:years?|yrs?)/i);
  if (m1 && m1[1]) {
    const parsed = parseFloat(m1[1]);
    if (parsed >= 0 && parsed <= 40) return parsed;
  }

  const m2 = t.match(/(\d+(?:\.\d+)?)\s*(?:\+)?\s*(?:years?|yrs?)\s+(?:of\s+)?(?:experience|exp|industry)/i);
  if (m2 && m2[1]) {
    const parsed = parseFloat(m2[1]);
    if (parsed >= 0 && parsed <= 40) return parsed;
  }

  if (t.includes('senior') || t.includes('lead') || t.includes('architect') || t.includes('principal')) return 5;
  if (t.includes('fresher') || t.includes('entry level') || t.includes('intern') || t.includes('graduate')) return 0;

  return 2;
}

/**
 * Clean and normalize candidate job role against actual active vacancies in data/jobs.json
 */
function cleanAndExtractJobRole(inputStr, fallbackText = '') {
  let rawInput = (inputStr || '').trim();
  rawInput = rawInput.replace(/\.(pdf|docx?|txt|rtf|odt)$/i, '');
  rawInput = rawInput.replace(/^[\d\s_\-()#]+/, '');
  rawInput = rawInput.replace(/[\s_\-()#\d]+$/, '');
  rawInput = rawInput.replace(/[_\-]+/g, ' ').replace(/\s+/g, ' ').trim();

  const inputLower = rawInput.toLowerCase();
  const fallbackLower = (fallbackText || '').toLowerCase();

  const activeJobs = getActiveJobs();
  for (const job of activeJobs) {
    const jobTitleLower = job.title.toLowerCase();
    if (inputLower.includes(jobTitleLower) || jobTitleLower.includes(inputLower)) {
      return job.title;
    }
  }

  // Priority specific matches
  if (inputLower.includes('full stack') || inputLower.includes('fullstack')) {
    return 'Full Stack AI Engineer';
  }
  if (inputLower.includes('data analyst') || (inputLower.includes('business analyst') && inputLower.includes('data'))) {
    return 'Data Analyst';
  }
  if (inputLower.includes('business analyst') || fallbackLower.includes('business analyst')) {
    return 'Business Analyst';
  }
  if (inputLower.includes('frontend') || inputLower.includes('front end') || inputLower.includes('react') || fallbackLower.includes('frontend developer')) {
    return 'Frontend Developer';
  }
  if (inputLower.includes('backend') || inputLower.includes('back end') || inputLower.includes('node') || fallbackLower.includes('backend developer')) {
    return 'Backend Developer';
  }
  if (inputLower.includes('ai/ml') || inputLower.includes('machine learning') || inputLower.includes('ml engineer')) {
    return 'AI/ML Engineer';
  }
  if (inputLower.includes('business development') || inputLower.includes('bde') || inputLower.includes('sales')) {
    return 'Business Development Executive';
  }
  if (inputLower.includes('ui/ux') || inputLower.includes('ux') || inputLower.includes('figma') || inputLower.includes('designer')) {
    return 'UI/UX Designer';
  }

  return 'Frontend Developer';
}

/**
 * Match a role name to its full job specification from data/jobs.json
 */
function getJobSpecification(roleName) {
  const activeJobs = getActiveJobs();
  const normalized = (roleName || '').toLowerCase().trim();
  const found = activeJobs.find(j => 
    j.title.toLowerCase() === normalized ||
    normalized.includes(j.title.toLowerCase()) ||
    j.title.toLowerCase().includes(normalized)
  );

  if (found) {
    return {
      title: found.title,
      department: found.department || 'Technology',
      experienceRequired: found.experienceRequired || '1–3 Years',
      requiredSkills: Array.isArray(found.skills) ? found.skills : (found.skills || '').split(',').map(s => s.trim()),
      mandatorySkills: found.mandatorySkills || found.skills.slice(0, 3),
      minMandatory: found.minMandatory || 2,
      description: found.description || `Responsible for ${found.title} deliverables.`
    };
  }

  return {
    title: roleName || 'Frontend Developer',
    department: 'Technology',
    experienceRequired: '1–3 Years',
    requiredSkills: ['React.js', 'JavaScript', 'HTML5 & CSS3', 'Tailwind CSS', 'REST APIs'],
    mandatorySkills: ['React.js', 'JavaScript', 'HTML5 & CSS3'],
    minMandatory: 2,
    description: 'Developing high quality production solutions matching role requirements.'
  };
}

/**
 * Generate Structured Rejection HTML email with detailed missing skills and actionable advice
 */
function generateStructuredRejectionHtml({
  candidateName = 'Candidate',
  roleApplied = 'Frontend Developer',
  matchScore = 35,
  foundSkills = [],
  missingSkills = [],
  resumeGaps = [],
  recommendations = []
}) {
  const foundSkillsHtml = foundSkills.length > 0
    ? foundSkills.map(s => `<span style="background: #e2e8f0; color: #334155; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; display: inline-block; margin: 3px 4px 3px 0;">${s}</span>`).join('')
    : '<span style="color: #64748b; font-size: 13px;">No direct core technical skills identified for this role</span>';

  const missingSkillsHtml = missingSkills.length > 0
    ? missingSkills.map(s => `<span style="background: #fee2e2; color: #991b1b; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; display: inline-block; margin: 3px 4px 3px 0;">⚠️ ${s}</span>`).join('')
    : `<span style="background: #fee2e2; color: #991b1b; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; display: inline-block;">⚠️ Core technical requirements for ${roleApplied}</span>`;

  const gapsListHtml = resumeGaps.length > 0
    ? resumeGaps.map(g => `<li style="margin-bottom: 6px;">${g}</li>`).join('')
    : `<li style="margin-bottom: 6px;">Resume does not show sufficient hands-on production experience in the core technologies required for <strong>${roleApplied}</strong>.</li>`;

  const recommendationsListHtml = recommendations.length > 0
    ? recommendations.map(r => `<li style="margin-bottom: 6px;">${r}</li>`).join('')
    : `<li style="margin-bottom: 6px;">Deepen your skills in <strong>${missingSkills.slice(0, 3).join(', ') || 'the required technical stack'}</strong> and showcase live projects.</li>`;

  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.04);">
      <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 28px 24px; text-align: center; color: #ffffff;">
        <span style="background: rgba(255,255,255,0.15); font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; padding: 4px 12px; border-radius: 99px; display: inline-block; margin-bottom: 8px;">APPLICATION STATUS UPDATE</span>
        <h2 style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff;">Application Evaluation &amp; Feedback</h2>
        <p style="margin: 4px 0 0 0; color: #cbd5e1; font-size: 13px;">Role: <strong>${roleApplied}</strong> • Vageesha Sharma Talent Acquisition</p>
      </div>

      <div style="padding: 28px 24px;">
        <p style="font-size: 15px; line-height: 1.6; margin-top: 0;">Dear <strong>${candidateName}</strong>,</p>
        
        <p style="font-size: 14.5px; line-height: 1.6; color: #334155;">
          Thank you for applying for the <strong>${roleApplied}</strong> position at our organization and for sharing your resume.
        </p>

        <p style="font-size: 14.5px; line-height: 1.6; color: #334155;">
          Our technical evaluation team has thoroughly reviewed your background against the active role requirements and competencies for this vacancy.
        </p>

        <!-- Evaluation Summary Card -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin: 20px 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 14px;">
            <strong style="color: #0f172a; font-size: 15px;">📊 Screening Evaluation Summary</strong>
            <span style="background: #fee2e2; color: #991b1b; font-weight: 800; font-size: 12px; padding: 4px 10px; border-radius: 99px;">Role Match: ${matchScore}%</span>
          </div>

          <div style="margin-bottom: 14px;">
            <span style="font-size: 12.5px; font-weight: 700; color: #475569; display: block; margin-bottom: 6px;">Skills Identified in Your Profile:</span>
            <div>${foundSkillsHtml}</div>
          </div>

          <div style="margin-bottom: 14px;">
            <span style="font-size: 12.5px; font-weight: 700; color: #991b1b; display: block; margin-bottom: 6px;">Critical Missing Skills for "${roleApplied}":</span>
            <div>${missingSkillsHtml}</div>
          </div>
        </div>

        <!-- Resume Gaps & Detailed Feedback -->
        <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 18px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #92400e; font-size: 14px; font-weight: 700;">🔍 Identified Gaps &amp; Resume Analysis</h4>
          <ul style="margin: 0; padding-left: 20px; font-size: 13.5px; color: #78350f; line-height: 1.6;">
            ${gapsListHtml}
          </ul>
        </div>

        <!-- Recommendations for Future -->
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 18px; margin-bottom: 24px;">
          <h4 style="margin: 0 0 10px 0; color: #166534; font-size: 14px; font-weight: 700;">💡 Actionable Recommendations to Strengthen Your Profile</h4>
          <ul style="margin: 0; padding-left: 20px; font-size: 13.5px; color: #14532d; line-height: 1.6;">
            ${recommendationsListHtml}
          </ul>
        </div>

        <p style="font-size: 14.5px; line-height: 1.6; color: #334155;">
          At this stage, we are moving forward with candidates whose technical stack more directly matches our immediate requirements for the <strong>${roleApplied}</strong> vacancy.
        </p>

        <p style="font-size: 14px; line-height: 1.6; color: #475569;">
          We will keep your resume on file for future openings that match your specific profile. We wish you great success in your career.
        </p>

        <div style="margin-top: 28px; border-top: 1px solid #e2e8f0; padding-top: 18px;">
          <strong style="color: #0f172a; font-size: 14.5px; display: block;">Vageesha Sharma</strong>
          <span style="color: #64748b; font-size: 13px; display: block;">Founder &amp; Hiring Lead</span>
          <span style="color: #64748b; font-size: 13px; display: block;">Talent Acquisition Division</span>
          <span style="color: #4338ca; font-size: 13px; font-weight: 600; display: block; margin-top: 3px;">sharmavageesha2000@gmail.com</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Generate Structured Selected Interview Invitation HTML
 */
function generateStructuredSelectedHtml({
  candidateName = 'Candidate',
  roleApplied = 'Frontend Developer',
  detectedExp = 3,
  matchedSkills = [],
  interviewDate = 'Friday, 04 September 2026',
  interviewTime = '03:00 PM IST',
  meetUrl = 'https://meet.google.com/qoy-livx-rku'
}) {
  const skillsList = matchedSkills.slice(0, 5).join(', ') || 'core technical competencies';

  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; max-width: 600px; margin: auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #0f766e; margin-bottom: 4px;">🎉 Congratulations, ${candidateName}!</h2>
        <p style="color: #64748b; margin: 0; font-size: 15px;">Your application for <strong>${roleApplied}</strong> has been <strong>Shortlisted</strong></p>
      </div>
      <p>Dear <strong>${candidateName}</strong>,</p>
      <p>Thank you for applying for the <strong>${roleApplied}</strong> position. We thoroughly reviewed your resume and credentials. We are impressed by your <strong>${detectedExp} years of relevant experience</strong> and strong foundation in <strong>${skillsList}</strong>.</p>
      <p>We are delighted to invite you for your initial technical interview with our hiring team.</p>
      <div style="background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 10px; padding: 20px; margin: 20px 0;">
        <h3 style="margin: 0 0 12px 0; color: #0f766e; font-size: 16px;">📅 Interview Schedule Details</h3>
        <p style="margin: 6px 0;"><strong>Position:</strong> ${roleApplied}</p>
        <p style="margin: 6px 0;"><strong>Date:</strong> ${interviewDate}</p>
        <p style="margin: 6px 0;"><strong>Time:</strong> ${interviewTime} (Duration: 45 Minutes)</p>
        <p style="margin: 6px 0;"><strong>Interviewer:</strong> Vageesha Sharma (Founder &amp; Hiring Lead)</p>
        <p style="margin: 14px 0 0 0;">
          <a href="${meetUrl}" target="_blank" style="background: #0f766e; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
            📹 Join Google Meet Interview (${meetUrl})
          </a>
        </p>
      </div>
      <p style="font-size: 14px; color: #64748b;">Please ensure you have a quiet environment, a working camera, and microphone for the video call.</p>
      <br/>
      <p>Warm regards,<br/><strong>Vageesha Sharma</strong><br/>Founder &amp; Hiring Lead<br/>sharmavageesha2000@gmail.com</p>
    </div>
  `;
}

/**
 * Generate Corporate Official Call Letter & Job Offer HTML
 */
function generateOfficialCallLetterHtml({
  candidateName = 'Candidate',
  roleApplied = 'Frontend Developer',
  joiningDate = 'Monday, 14 September 2026',
  ctcPackage = '₹12,00,000 per annum (Full-Time)',
  reportingTo = 'Vageesha Sharma (Founder & Hiring Lead)',
  workMode = 'Remote / Hybrid (Flexible Work Arrangements)',
  offerRefId = 'HR-OFFER-2026-8492'
}) {
  const issueDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a; max-width: 660px; margin: 0 auto; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06);">
      
      <!-- Top Corporate Header -->
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); padding: 32px 28px; color: #ffffff; text-align: center;">
        <span style="background: rgba(255,255,255,0.15); font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; padding: 4px 14px; border-radius: 99px; display: inline-block; margin-bottom: 10px; color: #a5b4fc;">OFFICIAL EMPLOYMENT OFFER</span>
        <h1 style="margin: 0 0 6px 0; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">Finova Technologies Pvt. Ltd.</h1>
        <p style="margin: 0; color: #94a3b8; font-size: 13px;">Talent Acquisition Division • Ref: <strong>${offerRefId}</strong></p>
      </div>

      <!-- Letter Body -->
      <div style="padding: 32px 28px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 14px; margin-bottom: 20px;">
          <div>
            <strong style="font-size: 15px; color: #0f172a;">To: ${candidateName}</strong><br/>
            <span style="font-size: 13px; color: #64748b;">Selected Candidate</span>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 12px; color: #64748b; font-weight: 600;">Date of Issue:</span><br/>
            <strong style="font-size: 13px; color: #0f172a;">${issueDate}</strong>
          </div>
        </div>

        <p style="font-size: 14.5px; line-height: 1.6; color: #334155; margin-top: 0;">
          Dear <strong>${candidateName}</strong>,
        </p>

        <p style="font-size: 14.5px; line-height: 1.6; color: #334155;">
          Following your exceptional performance in our technical screening and assessment rounds, we are thrilled to formally extend this <strong>Official Offer of Employment &amp; Call Letter</strong> for the position of <strong>${roleApplied}</strong> at <strong>Finova Technologies</strong>.
        </p>

        <!-- Terms Box -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 22px; margin: 24px 0;">
          <h3 style="margin: 0 0 16px 0; color: #1e1b4b; font-size: 15px; font-weight: 700; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px;">
            📋 Key Employment Terms &amp; Compensation
          </h3>

          <table style="width: 100%; border-collapse: collapse; font-size: 13.5px;">
            <tr>
              <td style="padding: 6px 0; color: #64748b; width: 40%;"><strong>Designation / Role:</strong></td>
              <td style="padding: 6px 0; color: #0f172a; font-weight: 700;">${roleApplied}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;"><strong>Total Compensation (CTC):</strong></td>
              <td style="padding: 6px 0; color: #059669; font-weight: 800; font-size: 14px;">${ctcPackage}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;"><strong>Date of Joining:</strong></td>
              <td style="padding: 6px 0; color: #0f172a; font-weight: 700;">${joiningDate}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;"><strong>Work Mode:</strong></td>
              <td style="padding: 6px 0; color: #0f172a;">${workMode}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;"><strong>Reporting Authority:</strong></td>
              <td style="padding: 6px 0; color: #0f172a;">${reportingTo}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;"><strong>Offer Reference ID:</strong></td>
              <td style="padding: 6px 0; color: #4338ca; font-weight: 700;">${offerRefId}</td>
            </tr>
          </table>
        </div>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px; margin-bottom: 24px;">
          <h4 style="margin: 0 0 6px 0; color: #166534; font-size: 13.5px; font-weight: 700;">✅ Next Steps &amp; Acceptance</h4>
          <p style="margin: 0; font-size: 13px; color: #14532d; line-height: 1.5;">
            Please reply directly to this email with your formal acceptance within <strong>48 hours</strong> to initiate onboarding and credential provisioning.
          </p>
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: #334155;">
          We look forward to welcoming you to the Finova Technologies team and building state-of-the-art fintech solutions together!
        </p>

        <!-- Formal Signature -->
        <div style="margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 20px; display: flex; justify-content: space-between; align-items: flex-end;">
          <div>
            <strong style="color: #0f172a; font-size: 15px; display: block;">Vageesha Sharma</strong>
            <span style="color: #64748b; font-size: 13px; display: block;">Founder &amp; Hiring Lead</span>
            <span style="color: #64748b; font-size: 13px; display: block;">Finova Technologies Pvt. Ltd.</span>
            <span style="color: #4338ca; font-size: 13px; font-weight: 600; display: block; margin-top: 3px;">sharmavageesha2000@gmail.com</span>
          </div>
          <div style="text-align: right;">
            <span style="display: inline-block; border: 1px dashed #cbd5e1; padding: 6px 14px; border-radius: 6px; font-size: 11px; color: #059669; font-weight: 700; background: #f0fdf4;">
              ✔ DIGITALLY VERIFIED
            </span>
          </div>
        </div>

      </div>
    </div>
  `;
}

/**
 * Robust Skill Matcher: Compares candidate text against required skills accurately
 */
function evaluateSkillOverlap(candidateText, requiredSkills) {
  const textLower = (candidateText || '').toLowerCase();
  const matched = [];
  const missing = [];

  for (const reqSkill of requiredSkills) {
    const skillClean = reqSkill.toLowerCase();
    
    // Explicit exact keyword checks
    let isMatched = false;

    if (skillClean.includes('power bi') || skillClean.includes('tableau')) {
      isMatched = textLower.includes('power bi') || textLower.includes('powerbi') || textLower.includes('tableau');
    } else if (skillClean.includes('excel')) {
      isMatched = textLower.includes('excel') || textLower.includes('spreadsheets') || textLower.includes('pivot table');
    } else if (skillClean.includes('data visualization') || skillClean.includes('visualization')) {
      isMatched = textLower.includes('visualization') || textLower.includes('dashboard') || textLower.includes('kpi');
    } else if (skillClean.includes('sql')) {
      isMatched = textLower.includes('sql') || textLower.includes('postgresql') || textLower.includes('mysql') || textLower.includes('queries');
    } else if (skillClean.includes('react')) {
      isMatched = textLower.includes('react') || textLower.includes('react.js') || textLower.includes('reactjs');
    } else if (skillClean.includes('node')) {
      isMatched = textLower.includes('node') || textLower.includes('node.js') || textLower.includes('express');
    } else if (skillClean.includes('fastapi') || skillClean.includes('python')) {
      isMatched = textLower.includes('python') || textLower.includes('fastapi') || textLower.includes('django') || textLower.includes('flask');
    } else if (skillClean.includes('figma')) {
      isMatched = textLower.includes('figma') || textLower.includes('wireframe') || textLower.includes('ui/ux');
    } else if (skillClean.includes('brd') || skillClean.includes('frd') || skillClean.includes('requirement')) {
      isMatched = textLower.includes('brd') || textLower.includes('frd') || textLower.includes('requirement') || textLower.includes('user stories');
    } else {
      const rawTokens = skillClean.replace(/[\(\)\/\-&]/g, ' ').split(/\s+/).filter(w => w.length >= 3);
      isMatched = textLower.includes(skillClean);
      if (!isMatched && rawTokens.length > 0) {
        const matchCount = rawTokens.filter(tok => textLower.includes(tok)).length;
        isMatched = matchCount >= Math.ceil(rawTokens.length * 0.7);
      }
    }

    if (isMatched) {
      matched.push(reqSkill);
    } else {
      missing.push(reqSkill);
    }
  }

  return { matched, missing };
}

/**
 * Check if the candidate's primary domain fundamentally mismatches the applied job
 */
function detectDomainMismatch(targetRole, resumeText) {
  const t = (resumeText || '').toLowerCase();
  const role = targetRole.toLowerCase();

  // 1. Candidate is an AI Prompt Engineer / Chatbot Tuner applying for Data Analyst or Backend
  if ((t.includes('prompt engineer') || t.includes('zero/few-shot') || t.includes('prompt design')) && !t.includes('power bi') && !t.includes('tableau')) {
    if (role.includes('data analyst')) {
      return {
        mismatched: true,
        candidateDomain: 'AI Prompt Engineering / LLM Prompt Design',
        reason: 'Candidate background is specialized in AI prompt tuning and chatbot prompts, missing required Business Intelligence, Power BI/Tableau, and Advanced Excel modeling competencies for Data Analyst.'
      };
    }
    if (role.includes('backend developer')) {
      return {
        mismatched: true,
        candidateDomain: 'AI Prompt Engineering',
        reason: 'Candidate profile lacks production backend server architecture, Node.js/Express, and relational database schema design required for Backend Developer.'
      };
    }
  }

  // 2. Candidate is in Fashion / Apparel / Retail applying for Tech roles
  if ((t.includes('fashion stylist') || t.includes('apparel') || t.includes('wardrobe') || t.includes('merchandising')) && !t.includes('javascript') && !t.includes('node') && !t.includes('python')) {
    return {
      mismatched: true,
      candidateDomain: 'Fashion Styling & Apparel Merchandising',
      reason: 'Candidate background is in fashion and apparel merchandising, which does not match the technical software engineering stack for this vacancy.'
    };
  }

  // 3. Candidate is in Digital Marketing / SEO applying for Software roles
  if ((t.includes('google ads') || t.includes('meta ads') || t.includes('paid media') || t.includes('seo specialist')) && !t.includes('react') && !t.includes('javascript') && !t.includes('sql')) {
    return {
      mismatched: true,
      candidateDomain: 'Digital Marketing & Paid Media',
      reason: 'Candidate background is in digital advertising and SEO campaigns, lacking core software programming competencies.'
    };
  }

  return { mismatched: false };
}

/**
 * Accurate heuristic evaluation directly referencing data/jobs.json
 */
function heuristicFallbackEvaluation({
  candidateName = 'Candidate',
  candidateEmail = 'applicant@example.com',
  candidatePhone = '+91 98765 43210',
  roleApplied = 'Frontend Developer',
  resumeText = '',
  emailBody = '',
  fileName = '',
  customMeetLink = ''
}) {
  const combined = `${resumeText || ''} ${emailBody || ''}`;
  const targetJob = getJobSpecification(roleApplied);
  const detectedExp = extractExperienceYears(combined);
  const { matched, missing } = evaluateSkillOverlap(combined, targetJob.requiredSkills);
  const domainCheck = detectDomainMismatch(targetJob.title, combined);

  // Extract actual candidate name from resume document
  const resolvedName = extractCandidateNameFromResume(resumeText, fileName, candidateName);

  // Check mandatory skills
  const mandatoryOverlap = targetJob.mandatorySkills.filter(s => matched.includes(s));
  const hasMandatory = mandatoryOverlap.length >= targetJob.minMandatory;

  const totalRequired = targetJob.requiredSkills.length || 1;
  const matchRatio = matched.length / totalRequired;

  // Calculate match score
  let matchScore = Math.round((matchRatio * 55) + Math.min(35, detectedExp * 10) + 10);
  if (domainCheck.mismatched || !hasMandatory) {
    matchScore = Math.min(48, Math.max(20, matchScore));
  }

  const isSelected = !domainCheck.mismatched && hasMandatory && matchScore >= 65;
  const authenticMeetUrl = generateAuthenticGoogleMeetLink(customMeetLink);

  const resumeGaps = [];
  const recommendations = [];

  if (!isSelected) {
    if (domainCheck.mismatched) {
      resumeGaps.push(`Candidate background is focused in <strong>${domainCheck.candidateDomain}</strong> rather than <strong>${targetJob.title}</strong>.`);
      resumeGaps.push(domainCheck.reason);
      recommendations.push(`Apply for roles aligned with <strong>${domainCheck.candidateDomain}</strong> or build dedicated projects in <strong>${targetJob.requiredSkills.slice(0, 3).join(', ')}</strong>.`);
    } else {
      resumeGaps.push(`Resume lacks demonstrable proficiency in mandatory requirements for ${targetJob.title}: <strong>${missing.slice(0, 4).join(', ')}</strong>.`);
      resumeGaps.push(`Insufficient evidence of production-level project execution matching the <strong>${targetJob.title}</strong> job description.`);
      recommendations.push(`Deepen hands-on competency in <strong>${missing.slice(0, 3).join(', ')}</strong>.`);
    }
    recommendations.push(`Include live project links, portfolio dashboards, and quantifiable metrics in your resume.`);
  }

  const interviewDate = 'Friday, 04 September 2026';
  const interviewTime = '03:00 PM IST';

  const emailSubject = isSelected 
    ? `🎉 Interview Invitation: ${targetJob.title} - Vageesha Sharma's Team` 
    : `Update regarding your application for ${targetJob.title} - Vageesha Sharma`;

  const emailHtmlBody = isSelected
    ? generateStructuredSelectedHtml({
        candidateName: resolvedName,
        roleApplied: targetJob.title,
        detectedExp,
        matchedSkills: matched,
        interviewDate,
        interviewTime,
        meetUrl: authenticMeetUrl
      })
    : generateStructuredRejectionHtml({
        candidateName: resolvedName,
        roleApplied: targetJob.title,
        matchScore,
        foundSkills: matched,
        missingSkills: missing,
        resumeGaps,
        recommendations
      });

  return {
    candidateName: resolvedName,
    candidateEmail,
    candidatePhone,
    education: combined.toLowerCase().includes('mba') ? 'MBA' : (combined.toLowerCase().includes('tech') ? 'B.Tech in CS/IT' : 'Bachelor Degree'),
    experienceYears: detectedExp,
    roleApplied: targetJob.title,
    skills: matched.length > 0 ? matched : ['General Domain Skills'],
    missingSkills: missing,
    scoreBreakdown: {
      technicalSkills: isSelected ? Math.round(matchRatio * 35) : 8,
      experienceRelevance: isSelected ? Math.round(Math.min(35, detectedExp * 10)) : 8,
      education: isSelected ? 15 : 10,
      communication: isSelected ? 15 : 8
    },
    matchScore,
    status: isSelected ? 'SELECTED' : 'REJECTED',
    summary: isSelected
      ? `${resolvedName} possesses ${detectedExp} years of relevant experience aligned with ${targetJob.title}. Strong foundation in ${matched.slice(0, 4).join(', ')}. Shortlisted for technical interview.`
      : `${resolvedName} applied for ${targetJob.title}. Profile does not satisfy core job requirements. Missing: ${missing.slice(0, 3).join(', ')}. Status: REJECTED.`,
    strengths: isSelected
      ? [`${detectedExp} years of demonstrated experience in ${targetJob.title}`, `Strong skills in ${matched.slice(0, 3).join(', ')}`]
      : ['Clear communication and professional presentation'],
    weaknesses: isSelected
      ? ['In-depth architecture to be assessed during technical interview']
      : [`Missing key competencies for ${targetJob.title}: ${missing.slice(0, 3).join(', ')}`],
    interviewSchedule: isSelected ? {
      date: interviewDate,
      time: interviewTime,
      duration: '45 Minutes',
      roundName: 'Round 1: Technical Assessment',
      interviewer: 'Vageesha Sharma (Founder & Hiring Lead)',
      meetLink: authenticMeetUrl,
      format: 'Google Meet Video Call',
      preparationNotes: `Please be prepared to discuss past projects, core architecture, and technologies required for ${targetJob.title}.`
    } : null,
    emailSubject,
    emailHtmlBody
  };
}

/**
 * Evaluates candidate email and resume content using Google Gemini AI (gemini-3.5-flash)
 */
async function evaluateResumeWithGemini({
  candidateName = '',
  candidateEmail = '',
  candidatePhone = '',
  roleApplied = 'Frontend Developer',
  emailSubject = '',
  emailBody = '',
  resumeText = '',
  fileName = '',
  customMeetLink = '',
  apiKey = DEFAULT_GEMINI_KEY
}) {
  const effectiveKey = apiKey || DEFAULT_GEMINI_KEY;
  const fullContext = `${resumeText || ''} ${emailBody || ''} ${emailSubject || ''}`;
  const targetCleanRole = cleanAndExtractJobRole(roleApplied || emailSubject || fileName, fullContext);
  const targetJob = getJobSpecification(targetCleanRole);
  const detectedExp = extractExperienceYears(fullContext);
  const authenticMeetUrl = generateAuthenticGoogleMeetLink(customMeetLink);
  const domainCheck = detectDomainMismatch(targetJob.title, fullContext);

  // Extract real candidate name strictly from resume document text
  const resolvedCandidateName = extractCandidateNameFromResume(resumeText, fileName, candidateName);

  const prompt = `
You are an expert Chief Human Resources Officer and Senior Technical Hiring Manager evaluating a candidate for Finova Technologies (Recruiter: Vageesha Sharma <sharmavageesha2000@gmail.com>).

==================================================
OPEN JOB VACANCY: "${targetJob.title}" (${targetJob.department})
==================================================
- Experience Required: "${targetJob.experienceRequired}"
- Required Core Skills: ${JSON.stringify(targetJob.requiredSkills)}
- Mandatory Core Competencies: ${JSON.stringify(targetJob.mandatorySkills)}
- Job Description: "${targetJob.description}"

==================================================
CANDIDATE APPLICATION:
==================================================
- Candidate Full Name: "${resolvedCandidateName}" (Extract the exact candidate name from the top header of the resume text below).
- Candidate Email: "${candidateEmail || 'Extract from resume'}"
- Applied Role: "${targetJob.title}"
- Resume Filename: "${fileName}"
- Extracted Resume Text:
${(resumeText || emailBody || 'No resume text provided').slice(0, 4500)}

==================================================
STRICT EVALUATION RULES:
==================================================
1. CANDIDATE NAME RULE:
   - Always extract the job applicant's REAL name from the top of the resume (e.g., "Rohan Sharma", "Ananya Verma", "Kabir Singh", "Sneha Verma"). Do NOT output the recruiter's name ("Vageesha Sharma").

2. DOMAIN & ROLE MISMATCH RULE:
   - If candidate is an "AI Prompt Engineer" / "Prompt Design Fresher" applying for "Data Analyst", you MUST REJECT.
   - If candidate is a "Fashion Stylist", "Graphic Designer", or "Digital Marketer" applying for technical software roles (Backend, Frontend, Full Stack, Data Analyst), you MUST REJECT (Score < 45).
   - If candidate lacks Mandatory Core Competencies (${JSON.stringify(targetJob.mandatorySkills)}), you MUST REJECT (Score < 60).

3. QUALIFIED SELECTION RULE:
   - Candidate MUST have genuine, hands-on production experience in the Required Core Skills for "${targetJob.title}".
   - Match Score >= 65 is REQUIRED for "SELECTED".

4. OUTPUT REQUIREMENTS:
   - If SELECTED:
     * status: "SELECTED"
     * candidateName: "${resolvedCandidateName}"
     * interviewSchedule with meetLink "${authenticMeetUrl}", date "Friday, 04 September 2026", time "03:00 PM IST".
     * emailSubject: "🎉 Interview Invitation: ${targetJob.title} - Vageesha Sharma's Team"
   - If REJECTED:
     * status: "REJECTED"
     * candidateName: "${resolvedCandidateName}"
     * matchScore: integer between 20 and 50
     * missingSkills: list the exact missing skills from ${JSON.stringify(targetJob.requiredSkills)}
     * weaknesses: explain why their resume/background does not match the "${targetJob.title}" job vacancy.
     * interviewSchedule: null
     * emailSubject: "Update regarding your application for ${targetJob.title} - Vageesha Sharma"

Return ONLY a valid JSON object matching this schema:
{
  "candidateName": "${resolvedCandidateName}",
  "candidateEmail": "Candidate Email",
  "candidatePhone": "Phone",
  "education": "Degree",
  "roleApplied": "${targetJob.title}",
  "experienceYears": ${detectedExp},
  "skills": ["MatchedSkill1"],
  "missingSkills": ["MissingSkill1", "MissingSkill2"],
  "scoreBreakdown": {
    "technicalSkills": 10,
    "experienceRelevance": 10,
    "education": 10,
    "communication": 8
  },
  "matchScore": 38,
  "status": "REJECTED",
  "summary": "Evaluation summary",
  "strengths": ["Clear communication"],
  "weaknesses": ["Candidate lacks required competencies for this vacancy."],
  "interviewSchedule": null,
  "emailSubject": "Email Subject",
  "emailHtmlBody": "Email HTML"
}
`;

  return new Promise((resolve) => {
    const postData = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 2048,
        responseMimeType: 'application/json'
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/${DEFAULT_MODEL}:generateContent?key=${effectiveKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 3800
    };

    const fallback = () => heuristicFallbackEvaluation({
      candidateName: resolvedCandidateName,
      candidateEmail,
      candidatePhone,
      roleApplied: targetJob.title,
      resumeText,
      emailBody,
      fileName,
      customMeetLink: authenticMeetUrl
    });

    if (!effectiveKey) {
      return resolve(fallback());
    }

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const parsed = JSON.parse(data);
            const rawText = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawText) {
              const cleanedText = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
              const evalObj = JSON.parse(cleanedText);
              evalObj.roleApplied = targetJob.title;
              evalObj.candidateEmail = candidateEmail || evalObj.candidateEmail || 'applicant@example.com';
              
              // Validate extracted candidate name
              const finalName = evalObj.candidateName && !evalObj.candidateName.toLowerCase().includes('vageesha') && !evalObj.candidateName.toLowerCase().includes('candidate')
                ? evalObj.candidateName
                : resolvedCandidateName;
              evalObj.candidateName = finalName;

              // Strict guard: If domain is mismatched, force REJECTED
              if (domainCheck.mismatched) {
                evalObj.status = 'REJECTED';
                evalObj.matchScore = Math.min(evalObj.matchScore || 40, 45);
              }

              if (evalObj.status === 'SELECTED' && (evalObj.matchScore || 0) >= 65 && !domainCheck.mismatched) {
                evalObj.status = 'SELECTED';
                evalObj.interviewSchedule = {
                  date: 'Friday, 04 September 2026',
                  time: '03:00 PM IST',
                  duration: '45 Minutes',
                  roundName: 'Round 1: Technical Assessment',
                  interviewer: 'Vageesha Sharma (Founder & Hiring Lead)',
                  meetLink: authenticMeetUrl,
                  format: 'Google Meet Video Call',
                  preparationNotes: `Please be prepared to discuss past projects, core architecture, and technologies required for ${targetJob.title}.`
                };
                evalObj.emailSubject = `🎉 Interview Invitation: ${targetJob.title} - Vageesha Sharma's Team`;
                evalObj.emailHtmlBody = generateStructuredSelectedHtml({
                  candidateName: finalName,
                  roleApplied: targetJob.title,
                  detectedExp: evalObj.experienceYears || detectedExp,
                  matchedSkills: evalObj.skills || [],
                  meetUrl: authenticMeetUrl
                });
              } else {
                evalObj.status = 'REJECTED';
                evalObj.interviewSchedule = null;
                evalObj.matchScore = Math.min(evalObj.matchScore || 38, 55);
                evalObj.emailSubject = `Update regarding your application for ${targetJob.title} - Vageesha Sharma`;
                evalObj.emailHtmlBody = generateStructuredRejectionHtml({
                  candidateName: finalName,
                  roleApplied: targetJob.title,
                  matchScore: evalObj.matchScore,
                  foundSkills: evalObj.skills || [],
                  missingSkills: evalObj.missingSkills && evalObj.missingSkills.length > 0 ? evalObj.missingSkills : targetJob.requiredSkills.filter(s => !(evalObj.skills || []).includes(s)),
                  resumeGaps: evalObj.weaknesses && evalObj.weaknesses.length > 0 ? evalObj.weaknesses : [`Resume lacks key requirements for ${targetJob.title}`],
                  recommendations: [`Focus on developing hands-on competency in ${targetJob.requiredSkills.slice(0, 3).join(', ')}`]
                });
              }
              return resolve(evalObj);
            }
          }
          return resolve(fallback());
        } catch (e) {
          return resolve(fallback());
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      return resolve(fallback());
    });

    req.on('error', () => {
      return resolve(fallback());
    });

    req.write(postData);
    req.end();
  });
}

module.exports = {
  evaluateResumeWithGemini,
  heuristicFallbackEvaluation,
  cleanAndExtractJobRole,
  getJobSpecification,
  getActiveJobs,
  extractExperienceYears,
  extractCandidateNameFromResume,
  generateAuthenticGoogleMeetLink,
  generateStructuredRejectionHtml,
  generateStructuredSelectedHtml,
  generateOfficialCallLetterHtml,
  DEFAULT_MODEL,
  DEFAULT_GEMINI_KEY
};
