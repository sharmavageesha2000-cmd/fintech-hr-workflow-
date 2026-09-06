# AGENTS.md — HR Recruitment AI Automation & SmartFlow Decision System Memory

> **CRITICAL MEMORY DIRECTIVE FOR ANTIGRAVITY AGENTS:**
> This repository contains the complete enterprise **Finova Technologies HR Recruitment AI Automation & Workflow Platform**.
> Every detail, business rule, scoring invariant, and deployment instruction defined below MUST be preserved across all future interactions without error.

---

## 1. System URLs & Environment Details
- **Local Dashboard & Backend**: `http://localhost:3000` (Auto-fallbacks to port 3001 if 3000 is occupied)
- **Local Careers Website**: `http://localhost:3000/website/`
- **Live Production URL (Render Cloud)**: `https://hr-smartflow-automation.onrender.com`
- **Live Production Careers Website**: `https://hr-smartflow-automation.onrender.com/website/`
- **Offer Decision Action Portal**: `https://hr-smartflow-automation.onrender.com/api/offer/decision` and `https://hr-smartflow-automation.onrender.com/offer-decision.html`
- **GitHub Repository**: `https://github.com/sharmavageesha2000-cmd/fintech-hr-workflow-` (Target branches: `main` and `master`)
- **Git Binary Path on System**:
  `C:\Users\VAGEESHA\AppData\Local\GitHubDesktop\app-3.6.3\resources\app\git\cmd\git.exe`
- **Recruiter Email**: `sharmavageesha2000@gmail.com`
- **Gmail SMTP & IMAP Transport**: Direct SSL `smtp.gmail.com:465` and `imap.gmail.com:993` using Google App Password in `.env`

---

## 2. Core Architecture & Component Map
1. **`server.js`**:
   - Central Express application, continuous IMAP email poller daemon (every 15s), background outcome watchdog, and cloud bridge sync.
   - Hosts SPA routes: `/`, `/dashboard`, `/website`, `/assessment`, `/offer-decision`.
   - Contains Offer Decision Engine handling candidate **Accept** and **Decline** actions.
   - Synchronizes candidate statuses between Render Cloud and local Gmail SMTP daemon.
2. **`gemini_evaluator.js`**:
   - LLM resume parsing, candidate scoring, and HTML email templates.
   - `generateStructuredSelectedHtml`: Shortlist invitation with 20-MCQ test link.
   - `generateSelectionOfferEmailHtml`: Provisional Offer with job role, annual package, work mode, reporting HR, future Monday joining date, and interactive Accept/Reject action buttons.
   - `generateOfficialCallLetterHtml`: Corporate appointment & call letter dispatched upon offer acceptance.
   - `generateOfferDeclineAcknowledgementEmailHtml`: Polite decline response.
   - `generateOfferDecisionPageHtml`: Direct HTTP 200 interactive web page displayed when candidates click Accept or Decline.
3. **`email_poller.js`**:
   - IMAP email watcher that parses resume PDFs/Word docs from incoming applicant emails and triggers Gemini evaluation.
4. **`assessment_questions.js`**:
   - 800 enterprise questions across 8 domains (100 non-repeating MCQs per role).
   - Rotates 20 unique domain questions per candidate test session.
5. **`public/`**:
   - `index.html`, `app.js`, `styles.css`: HR Dashboard with interactive candidate management, real-time filters, and job role package dropdowns.
   - `assessment.html`, `assessment.js`: Proctored test portal with anti-cheating, tab-switching deterrence, and one-time submission lockout.
   - `offer-decision.html`: Direct response portal.
6. **`website/`**:
   - Production Vite + TailwindCSS + React 18 corporate & careers website, compiled into `public/website/`.
7. **`data/`**:
   - `candidates.json`: Persistent candidate database.
   - `jobs.json`: Role definitions, annual packages, package dropdown options, work modes, and reporting HR authorities.
   - `processed_emails.json`: Deduplication cache for email UIDs.

---

## 3. Mandatory Business Invariants (NEVER VIOLATE)

### Rule 1: Technical Assessment Scoring & Outcome Guarantee
- **Passing Threshold**: Strictly **80%** (16 out of 20 MCQs correct).
- **Passing Candidates ($\ge 80\%$ or `passed: true`)**:
  - Status MUST be set to `SELECTED`, `offerStatus: OFFER_EXTENDED`.
  - **NEVER send a rejection or performance feedback email to a passing candidate!**
  - Always extract `scorePercent` using:
    ```javascript
    const scorePercent = (
      c.assessmentDetails?.scorePercent !== undefined ? c.assessmentDetails.scorePercent :
      c.scorePercent !== undefined ? c.scorePercent :
      c.testScore !== undefined ? c.testScore :
      0
    );
    const passed = Boolean(
      c.passed === true ||
      c.testPassed === true ||
      (c.assessmentDetails && c.assessmentDetails.passed === true) ||
      scorePercent >= 80
    );
    ```
- **Non-Passing Candidates ($< 80\%$)**:
  - Status set to `REJECTED`, receives constructive Performance Feedback email with score breakdown.

### Rule 2: Provisional Selection & Job Offer Email Specifications
- Automatically dispatched upon test completion ($\ge 80\%$).
- Email MUST include:
  1. **Job Designation / Role** (e.g. `Business Analyst`, `Frontend Developer`, `Full Stack AI Engineer`).
  2. **Annual Compensation Package (CTC)** as configured in `data/jobs.json` (e.g. `₹9,00,000 per annum (Standard Full-Time)`).
  3. **Working Mode** (e.g. `Remote / Hybrid (Flexible Work Arrangements)`).
  4. **Reporting Authority / HR Name** (e.g. `Pooja Mehta (VP of Talent Acquisition)`).
  5. **Projected Date of Joining**: Guaranteed future Monday (18–25 days out, calculated by `generateFutureJoiningDate(18)`).
  6. **Interactive Action Buttons**:
     - `[✔ Accept Offer & Receive Official Call Letter]`
     - `[✖ Decline Offer]`
  7. **Universal Public URL Target**:
     - Button links MUST use `https://hr-smartflow-automation.onrender.com/api/offer/decision?...` so they work seamlessly when opened on mobile phones, tablets, or external laptops.

### Rule 3: Offer Decision Flow & Signed Call Letter Auto-Dispatch
- **When Candidate Clicks [Accept]**:
  1. Server serves HTTP 200 OK branded confirmation page (`generateOfferDecisionPageHtml({ status: 'accepted', ... })`).
  2. Candidate record updated to `status: SELECTED`, `offerStatus: OFFER_ACCEPTED`.
  3. Offer Decision Engine immediately generates and auto-dispatches the signed **Official Call Letter & Appointment Letter** via Gmail SMTP with subject `📜 Official Employment Offer Letter & Call Letter: <Role> - Finova Technologies`.
- **When Candidate Clicks [Decline]**:
  1. Server serves HTTP 200 OK confirmation page (`status: 'declined'`).
  2. Candidate record updated to `status: REJECTED`, `offerStatus: OFFER_DECLINED`.
  3. Offer Decision Engine automatically dispatches polite Decline Acknowledgement email.
- **Repeat Clicks**: Return `already_recorded` status without duplicate email dispatches.

### Rule 4: HR Dashboard Job Roles Configuration
- Every job title in `data/jobs.json` must support customizable:
  - `annualPackage`: Default selected package.
  - `packageOptions`: Dropdown array with distinct packages for that specific role.
  - `workingMode`: Selected work mode.
  - `reportingAuthority`: Designated HR manager / authority.
- The dashboard UI in `public/index.html` and `public/app.js` renders these dropdowns and updates them via `PUT /api/jobs/:id`.

---

## 4. Standard Operational Procedures

### Starting the Local Platform
```powershell
# In c:\Users\VAGEESHA\Desktop\my new n8n:
node server.js
# Or run the batch runner:
.\start_hr_system.bat
```

### Git Commit & Push Workflow
Always use the installed GitHub Desktop Git binary:
```powershell
$git = "C:\Users\VAGEESHA\AppData\Local\GitHubDesktop\app-3.6.3\resources\app\git\cmd\git.exe"
& $git add -A
& $git commit -m "<descriptive message>"
& $git push origin main
& $git push origin main:master
```

### Render Cloud Deployment
Trigger automatic clear-cache deploy using Render REST API:
```powershell
node trigger_render_deploy.js
```
The script will trigger `dep-...`, monitor build progress through `update_in_progress`, and confirm when status reaches `live`.
