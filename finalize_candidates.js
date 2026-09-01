const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'data', 'candidates.json');
let candidates = JSON.parse(fs.readFileSync(file, 'utf8'));

// Check Kabir Singh
if (!candidates.some(c => c.name.toLowerCase().includes('kabir'))) {
  candidates.push({
    id: 'cand-kabir-singh',
    name: 'Kabir Singh',
    email: 'sharmavageesha2000@gmail.com',
    phone: '+91 90123 45678',
    education: 'B.Tech in Artificial Intelligence & Data Science',
    roleApplied: 'Data Analyst',
    experienceYears: 0,
    skills: ['SQL', 'Python', 'Analytics'],
    missingSkills: ['Excel', 'Power BI / Tableau', 'Data Visualization'],
    scoreBreakdown: { technicalSkills: 10, experienceRelevance: 8, education: 10, communication: 10 },
    matchScore: 38,
    status: 'REJECTED',
    interviewStatus: 'N/A',
    offerStatus: 'PENDING',
    summary: 'Candidate is an AI Prompt Engineer lacking Power BI, Tableau, and Excel data modeling required for Data Analyst.',
    strengths: ['Clear communication and professional presentation', 'Python and Prompt Engineering foundation'],
    weaknesses: ['Missing key competencies for Data Analyst: Excel, Power BI / Tableau, Data Visualization'],
    interviewSchedule: null,
    emailSubject: 'Update regarding your application for Data Analyst - Vageesha Sharma',
    emailHtmlBody: '<p>Constructive feedback regarding Data Analyst application</p>',
    emailStatus: 'SENT',
    attachmentInfo: {
      fileName: '4_Kabir_Singh_AI_Prompt_Engineer_Fresher (1).pdf',
      fileSize: 184500,
      path: '/uploads/1788200567348-4_Kabir_Singh_AI_Prompt_Engineer_Fresher.pdf'
    },
    receivedAt: new Date(Date.now() - 3600000).toISOString(),
    evaluatedAt: new Date().toISOString(),
    source: 'EMAIL_INBOX_ATTACHMENT'
  });
}

// Check Rishu Paliwal
if (!candidates.some(c => c.name.toLowerCase().includes('rishu'))) {
  candidates.push({
    id: 'cand-rishu-frontend',
    name: 'Rishu Paliwal',
    email: 'paliwalrishu2000@gmail.com',
    phone: '+91 98765 43210',
    education: 'B.Tech in Computer Science',
    roleApplied: 'Frontend Developer',
    experienceYears: 2,
    skills: ['React.js', 'JavaScript', 'HTML5 & CSS3', 'TypeScript', 'Responsive Design'],
    missingSkills: ['Tailwind CSS'],
    scoreBreakdown: { technicalSkills: 30, experienceRelevance: 25, education: 12, communication: 10 },
    matchScore: 77,
    status: 'SELECTED',
    interviewStatus: 'SCHEDULED',
    offerStatus: 'PENDING',
    summary: 'Strong frontend capabilities in React.js and responsive UI design.',
    strengths: ['2 years experience in React', 'Modern JavaScript and component state'],
    weaknesses: ['Tailwind CSS to be reviewed during interview'],
    interviewSchedule: {
      date: 'Friday, 04 September 2026',
      time: '03:00 PM IST',
      duration: '45 Minutes',
      roundName: 'Round 1: Technical Assessment',
      interviewer: 'Vageesha Sharma (Founder & Hiring Lead)',
      meetLink: 'https://meet.google.com/qoy-livx-rku',
      format: 'Google Meet Video Call'
    },
    emailSubject: '🎉 Interview Invitation: Frontend Developer - Vageesha Sharma\'s Team',
    emailHtmlBody: '<p>Interview invitation</p>',
    emailStatus: 'SENT',
    attachmentInfo: {
      fileName: 'Frontend_Developer_1_3_Years_Resume.pdf',
      fileSize: 195000,
      path: '/uploads/1788243684117-Frontend_Developer_1_3_Years_Resume.pdf'
    },
    receivedAt: new Date(Date.now() - 7200000).toISOString(),
    evaluatedAt: new Date().toISOString(),
    source: 'EMAIL_INBOX_ATTACHMENT'
  });
}

fs.writeFileSync(file, JSON.stringify(candidates, null, 2), 'utf8');
console.log('Final Candidate Count:', candidates.length);
