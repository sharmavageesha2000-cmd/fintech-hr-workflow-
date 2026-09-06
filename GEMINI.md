# GEMINI.md — Finova Technologies HR Recruitment AI Platform Guidelines

## Critical Directives for Antigravity & AI Assistants
1. **Always Read `AGENTS.md`**: Refer to `AGENTS.md` in the workspace root for complete architectural specifications, URLs, and invariants.
2. **Assessment Passing Rule**:
   - Passing threshold is **80%** (16/20 correct).
   - Anyone with score $\ge 80\%$ or `passed: true` MUST receive the **Provisional Selection & Offer Email** with package, work mode, reporting HR, future Monday joining date, and functional Accept/Decline buttons.
   - Rejection/performance feedback emails MUST NEVER be sent to passing candidates.
3. **Offer Decision Flow**:
   - Accept -> Automatically generate and email signed **Official Call Letter & Appointment Letter** via direct SSL Gmail SMTP.
   - Decline -> Automatically generate and email polite **Decline Acknowledgment**.
   - Decision endpoint `/api/offer/decision` and portal `/offer-decision.html` return direct HTTP 200 OK.
4. **Environment URLs**:
   - Production Cloud: `https://hr-smartflow-automation.onrender.com`
   - Local: `http://localhost:3000`
   - GitHub: `https://github.com/sharmavageesha2000-cmd/fintech-hr-workflow-`
5. **Git Path on System**:
   - `C:\Users\VAGEESHA\AppData\Local\GitHubDesktop\app-3.6.3\resources\app\git\cmd\git.exe`
6. **Deployment Command**:
   - `node trigger_render_deploy.js` triggers fresh clear-cache build on Render and monitors until live.
