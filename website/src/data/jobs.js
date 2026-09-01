export const defaultJobsData = [
  {
    id: "job-1",
    title: "Frontend Developer",
    department: "Technology",
    experienceRequired: "1–3 Years",
    skills: ["React.js", "JavaScript", "HTML", "CSS", "Responsive Design"],
    description: "Develop responsive, pixel-perfect user interfaces and payment experiences using modern React.js and CSS.",
    vacanciesLeft: 2,
    totalVacancies: 2,
    location: "Remote / Hybrid (India)",
    employmentType: "Full-Time"
  },
  {
    id: "job-2",
    title: "Backend Developer",
    department: "Technology",
    experienceRequired: "2–4 Years",
    skills: ["Node.js", "APIs", "Databases", "Backend Development"],
    description: "Design high-performance REST APIs, database schemas, and microservice infrastructure for digital transactions.",
    vacanciesLeft: 2,
    totalVacancies: 2,
    location: "Remote / Hybrid (India)",
    employmentType: "Full-Time"
  },
  {
    id: "job-3",
    title: "AI/ML Engineer",
    department: "Artificial Intelligence",
    experienceRequired: "2–5 Years",
    skills: ["Python", "Machine Learning", "AI", "Data Processing"],
    description: "Build predictive financial algorithms, fraud detection pipelines, and intelligent data automation models.",
    vacanciesLeft: 2,
    totalVacancies: 2,
    location: "Remote / Hybrid (India)",
    employmentType: "Full-Time"
  },
  {
    id: "job-4",
    title: "Data Analyst",
    department: "Data",
    experienceRequired: "1–3 Years",
    skills: ["Excel", "SQL", "Data Visualization", "Analytics"],
    description: "Extract actionable financial insights, build KPI dashboards, and support leadership with data-driven modeling.",
    vacanciesLeft: 1,
    totalVacancies: 1,
    location: "Remote / Hybrid (India)",
    employmentType: "Full-Time"
  },
  {
    id: "job-5",
    title: "Business Analyst",
    department: "Business",
    experienceRequired: "1–3 Years",
    skills: ["Requirement Analysis", "Business Processes", "Documentation", "Communication"],
    description: "Bridge stakeholder requirements and engineering delivery by structuring clear functional workflows and specs.",
    vacanciesLeft: 1,
    totalVacancies: 1,
    location: "Remote / Hybrid (India)",
    employmentType: "Full-Time"
  },
  {
    id: "job-6",
    title: "Business Development Executive",
    department: "Sales",
    experienceRequired: "1–3 Years",
    skills: ["Communication", "Lead Generation", "Client Management", "Sales"],
    description: "Accelerate market growth by identifying partnership opportunities, managing client pipelines, and closing deals.",
    vacanciesLeft: 2,
    totalVacancies: 2,
    location: "Remote / Hybrid (India)",
    employmentType: "Full-Time"
  },
  {
    id: "job-7",
    title: "UI/UX Designer",
    department: "Design",
    experienceRequired: "1–3 Years",
    skills: ["Figma", "UI Design", "UX Research", "Prototyping"],
    description: "Craft intuitive, engaging digital financial user journeys, interactive Figma prototypes, and user design systems.",
    vacanciesLeft: 1,
    totalVacancies: 1,
    location: "Remote / Hybrid (India)",
    employmentType: "Full-Time"
  }
];

export const RECRUITER_EMAIL = "sharmavageesha2000@gmail.com";

/**
 * Builds standard mailto URL for direct candidate resume applications
 */
export function getJobApplicationMailto(jobTitle) {
  const subject = encodeURIComponent(`Job Application - ${jobTitle}`);
  const body = encodeURIComponent(
`Dear Hiring Team,

I am writing to express my interest in the "${jobTitle}" position at Finova Technologies.

Please find my resume attached with this email for your review.

Candidate Details:
- Full Name: 
- Phone Number: 
- Total Years of Experience: 
- Notice Period / Availability: 
- Key Skills: 

Thank you for your time and consideration.

Best regards,`
  );
  return `mailto:${RECRUITER_EMAIL}?subject=${subject}&body=${body}`;
}
