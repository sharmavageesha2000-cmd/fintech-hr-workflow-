# HR Recruitment & SmartFlow Decision Engine Rules

## 1. Automated Outcome & Selection Offer Dispatch
- Passing threshold is **80%** (16/20 correct).
- Candidates scoring $\ge 80\%$ or marked with `passed: true` are guaranteed to receive the **Provisional Selection & Offer Email**.
- Rejection emails are **strictly prohibited** for passing candidates.
- Safe extraction of `scorePercent`:
  `const scorePercent = c.assessmentDetails?.scorePercent ?? c.scorePercent ?? c.testScore ?? 0;`
  `const passed = Boolean(c.passed === true || c.testPassed === true || (c.assessmentDetails && c.assessmentDetails.passed === true) || scorePercent >= 80);`

## 2. Selection Offer Contents
- Job Designation / Role
- Annual Package (CTC) matching selected job package in `data/jobs.json`
- Working Mode (Remote / Hybrid)
- Reporting Authority HR Name
- Projected Date of Joining: Future Monday (18-25 days out)
- Interactive `[✔ Accept Offer]` and `[✖ Decline Offer]` action buttons pointing to:
  `https://hr-smartflow-automation.onrender.com/api/offer/decision?...`

## 3. Offer Decision Flow
- **Accept**: Status updated to `OFFER_ACCEPTED`, signed Official Call Letter auto-dispatched via Gmail SMTP (`smtp.gmail.com:465`).
- **Decline**: Status updated to `OFFER_DECLINED`, polite acknowledgment auto-dispatched.
- Decision portal `/api/offer/decision` and `/offer-decision.html` return direct HTTP 200 OK.

## 4. HR Dashboard Job Roles
- Each job role in `data/jobs.json` supports configurable package options, working mode, and reporting authority.
- The HR Dashboard allows changing and saving these configurations in real time.

## 5. Deployment & System Operations
- Git binary: `C:\Users\VAGEESHA\AppData\Local\GitHubDesktop\app-3.6.3\resources\app\git\cmd\git.exe`
- Push branches: `main` and `master`
- Render deploy command: `node trigger_render_deploy.js`
- Local daemon: `node server.js` (on port 3000)
