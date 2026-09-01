# ⚡ HR SmartFlow — AI Recruitment & Resume Screening Automation

[![n8n](https://img.shields.io/badge/Workflow-n8n-EA4B71?style=for-the-badge&logo=n8n&logoColor=white)](https://n8n.io)
[![Gemini](https://img.shields.io/badge/AI%20Model-Google%20Gemini%203.6%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Gmail](https://img.shields.io/badge/Email-Gmail%20IMAP%20%26%20SMTP-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](https://gmail.com)
[![Express](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)

An end-to-end autonomous recruitment and applicant screening pipeline designed for high-growth startups and HR teams.

---

## 🌟 Key Architecture & Capabilities

1. **Autonomous Email Ingestion (Gmail IMAP)**
   - Continuous background polling (`sharmavageesha2000@gmail.com`) every 10 seconds.
   - Detects candidate applications and automatically downloads PDF / DOC / DOCX resume attachments.

2. **Google Gemini 3.6 Flash Intelligent Evaluation**
   - Extracts candidate name, email, phone, experience, and core skills.
   - Computes a multi-factor **Match Score (0–100)**:
     - Technical Competencies (0–30)
     - Experience Relevance (0–30)
     - Education Background (0–20)
     - Communication Quality (0–20)
   - Evaluates against open job roles and makes the autonomous hiring verdict:
     - **SELECTED** (Score $\ge 60$)
     - **REJECTED** (Score $< 60$)

3. **Automated Candidate Email Dispatch (Gmail SMTP)**
   - **Shortlisted Candidates:** Receives personalized invitation with proposed date, time, and **Google Meet Video Link**.
   - **Rejected Candidates:** Receives courteous and encouraging feedback.

4. **Interactive HR Dashboard & Vacancy Manager (`http://localhost:3000`)**
   - **4 Live KPI Metric Cards:** Total Applications, Shortlisted for Interview, Rejections Handled, Average AI Score.
   - **Real-Time Startup Funnel:** Applications $\rightarrow$ AI Evaluated $\rightarrow$ Shortlisted $\rightarrow$ Rejections.
   - **Open Job Roles & Vacancy Tracking:** Add, edit, and monitor open vacancies and required experience in real-time.
   - **Job Role & Experience Filters:** Instant filtering by positions and seniority levels.
   - **Candidate Profile Modal:** Complete AI breakdown, strengths, weaknesses, and auto-reply copy preview.
   - **AI Resume Scanner & Simulator:** Drag-and-drop resume upload and 1-click test presets.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18+)
- Google Gemini API Key
- Gmail App Password for IMAP & SMTP

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/sharmavageesha2000-cmd/fintech-hr-workflow-.git

# Navigate to workspace
cd fintech-hr-workflow-

# Install dependencies
npm install
```

### 3. Start the System
```bash
# Start the backend server & email daemon
node server.js

# Or double-click start_hr_system.bat on Windows
```

Open your browser and navigate to:
👉 **`http://localhost:3000`**

---

## 📁 Repository Structure

```
├── hr_workflow.json        # n8n Workflow definition
├── workflows.json          # Workspace n8n catalog
├── server.js               # Express REST API & continuous 10s email polling daemon
├── gemini_evaluator.js     # Google Gemini 3.6 Flash AI evaluation & role sanitizer
├── email_poller.js         # Gmail IMAP inbox listener & PDF/DOC downloader
├── package.json            # Node.js dependencies
├── start_hr_system.bat     # Windows 1-click startup batch script
├── data/
│   ├── candidates.json     # Candidate database & interview records
│   ├── jobs.json           # Active job openings, experience, and vacancies
│   ├── settings.json       # Recruiter configuration & credentials
│   └── processed_emails.json # Message deduplication tracker
└── public/
    ├── index.html          # Startup HR Dashboard UI
    ├── styles.css          # Design system & responsive layout
    └── app.js              # Frontend logic, charts, filters & modals
```

---

## 🔒 Security Notice
Sensitive credentials (API keys, App Passwords) can be configured dynamically through the **Settings Modal** on the dashboard or stored in environment variables.

---

## 👤 Author & Recruiter
**Vageesha Sharma**  
Email: `sharmavageesha2000@gmail.com`
