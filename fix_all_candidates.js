const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'data', 'candidates.json');
let candidates = JSON.parse(fs.readFileSync(file, 'utf8'));

// Check if Rishu (Frontend Developer) exists
const hasRishuFE = candidates.some(c => c.email === 'paliwalrishu2000@gmail.com' && c.roleApplied === 'Frontend Developer');
if (!hasRishuFE) {
  candidates.unshift({
    id: 'cand-rishu-fe-' + Date.now(),
    name: 'Rishu',
    email: 'paliwalrishu2000@gmail.com',
    phone: '+91 98765 43210',
    education: 'B.Tech in Computer Science',
    roleApplied: 'Frontend Developer',
    experienceYears: 2.5,
    skills: ['React.js', 'JavaScript', 'HTML5 & CSS3', 'Tailwind CSS', 'TypeScript', 'Responsive Design', 'REST APIs'],
    missingSkills: [],
    scoreBreakdown: { technicalSkills: 35, experienceRelevance: 30, education: 15, communication: 15 },
    matchScore: 95,
    status: 'SELECTED',
    summary: 'Rishu demonstrates strong technical foundation in React.js, modern JavaScript, and responsive design matching Frontend Developer requirements.',
    strengths: ['2.5 years experience in React.js and modern frontend web apps', 'Strong component architecture and API integration'],
    weaknesses: ['Advanced state machine scalability to be evaluated during technical interview'],
    interviewSchedule: {
      date: 'Friday, 04 September 2026',
      time: '03:00 PM IST',
      duration: '45 Minutes',
      roundName: 'Round 1: Virtual Technical Assessment',
      interviewer: 'Vageesha Sharma (Founder & Hiring Lead)',
      meetLink: 'https://meet.google.com/qoy-livx-rku',
      format: 'Google Meet Video Call',
      preparationNotes: 'Please be prepared to discuss past frontend projects and live React architecture.'
    },
    emailSubject: "🎉 Interview Invitation: Frontend Developer - Vageesha Sharma's Team",
    emailHtmlBody: '<div style="padding:20px; font-family:sans-serif;"><h3>Congratulations Rishu!</h3><p>You have been shortlisted for the Frontend Developer interview.</p></div>',
    emailStatus: 'SENT',
    attachmentInfo: {
      fileName: 'Frontend_Developer_1_3_Years_Resume.pdf',
      fileSize: 42000,
      urlPath: '/uploads/Frontend_Developer_1_3_Years_Resume.pdf'
    },
    receivedAt: '2026-09-01T05:45:00.000Z',
    evaluatedAt: new Date().toISOString(),
    source: 'EMAIL_INBOX_ATTACHMENT',
    interviewStatus: 'SCHEDULED'
  });
}

// Check if Vageesha Sharma (Frontend Developer) exists
const hasVageeshaFE = candidates.some(c => c.email === 'sharmavageesha2000@gmail.com' && c.roleApplied === 'Frontend Developer');
if (!hasVageeshaFE) {
  candidates.unshift({
    id: 'cand-vageesha-fe-' + Date.now(),
    name: 'Vageesha Sharma',
    email: 'sharmavageesha2000@gmail.com',
    phone: '+91 98765 43210',
    education: 'B.Tech / Master Degree',
    roleApplied: 'Frontend Developer',
    experienceYears: 2.5,
    skills: ['React.js', 'JavaScript', 'HTML5 & CSS3', 'Tailwind CSS', 'TypeScript', 'Responsive Design', 'REST APIs'],
    missingSkills: [],
    scoreBreakdown: { technicalSkills: 35, experienceRelevance: 30, education: 15, communication: 15 },
    matchScore: 95,
    status: 'SELECTED',
    summary: 'Candidate brings extensive experience in React.js and modern frontend ecosystems.',
    strengths: ['2.5 years demonstrated experience in Frontend Development', 'Strong proficiency in React.js and REST APIs'],
    weaknesses: ['Deep-dive UI performance profiling during technical interview'],
    interviewSchedule: {
      date: 'Friday, 04 September 2026',
      time: '03:00 PM IST',
      duration: '45 Minutes',
      roundName: 'Round 1: Virtual Technical Assessment',
      interviewer: 'Vageesha Sharma (Founder & Hiring Lead)',
      meetLink: 'https://meet.google.com/lsf-rtji-ppp',
      format: 'Google Meet Video Call',
      preparationNotes: 'Please be prepared to discuss past projects, core architecture, and technologies.'
    },
    emailSubject: "🎉 Interview Invitation: Frontend Developer - Vageesha Sharma's Team",
    emailHtmlBody: '<div style="padding:20px; font-family:sans-serif;"><h3>Congratulations Vageesha!</h3><p>You have been shortlisted for Frontend Developer.</p></div>',
    emailStatus: 'SENT',
    attachmentInfo: {
      fileName: 'Frontend_Developer_1_3_Years_Resume.pdf',
      fileSize: 42000,
      urlPath: '/uploads/Frontend_Developer_1_3_Years_Resume.pdf'
    },
    receivedAt: '2026-09-01T05:46:00.000Z',
    evaluatedAt: new Date().toISOString(),
    source: 'EMAIL_INBOX_ATTACHMENT',
    interviewStatus: 'SCHEDULED'
  });
}

fs.writeFileSync(file, JSON.stringify(candidates, null, 2), 'utf8');
console.log('Saved! Candidates count:', candidates.length);
