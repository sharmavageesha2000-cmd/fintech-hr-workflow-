/**
 * Systematic Online Proctored Assessment Engine
 * Finova Technologies - Enterprise AI Recruitment Platform
 */

// Application State
let assessmentSessionId = null;
let assessmentQuestions = [];
let assessmentSections = [];
let currentQuestionIndex = 0;
let userAnswers = {}; // { questionId: optionIndex }
let flaggedQuestions = new Set(); // Set of questionIds marked for review
let visitedQuestions = new Set();

let violationCount = 0;
const maxViolations = 3;
let timerSeconds = 25 * 60; // 25 Minutes
let timerInterval = null;
let isAssessmentStarted = false;
let isSubmitted = false;

// URL Query Parameters
const urlParams = new URLSearchParams(window.location.search);
let candidateId = urlParams.get('id') || 'cand-' + Date.now();
let candidateName = urlParams.get('name') || 'Candidate';
let candidateEmail = (urlParams.get('email') || '').trim();
let roleApplied = urlParams.get('role') || 'Frontend Developer';

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  setupInitialUI();
  setupAntiCheatingShield();
  setupKeyboardShortcuts();
});

function setupInitialUI() {
  // Update Header & Onboarding metadata
  const headerRole = document.getElementById('headerRolePill');
  if (headerRole) headerRole.textContent = roleApplied;

  const obName = document.getElementById('onboardCandName');
  if (obName) obName.textContent = candidateName;

  const obRole = document.getElementById('onboardCandRole');
  if (obRole) obRole.textContent = roleApplied;

  const obEmail = document.getElementById('onboardCandEmail');
  if (obEmail) obEmail.textContent = candidateEmail || 'Not set (Click ✏️ Edit)';
}

function editCandidateName() {
  const current = candidateName === 'Candidate' ? '' : candidateName;
  const entered = prompt('Please enter your full name:', current);
  if (entered !== null && entered.trim()) {
    candidateName = entered.trim();
    const disp = document.getElementById('onboardCandName');
    if (disp) disp.textContent = candidateName;
  }
}

function editCandidateRole() {
  const availableRoles = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack AI Engineer',
    'AI/ML Engineer',
    'Data Analyst',
    'Business Analyst',
    'UI/UX Designer',
    'Business Development Executive'
  ];
  const roleListPrompt = 'Select your target job domain by number:\n' + 
    availableRoles.map((r, i) => `${i + 1}. ${r}`).join('\n');
  const chosen = prompt(roleListPrompt, '1');
  if (chosen !== null) {
    const idx = parseInt(chosen, 10) - 1;
    if (idx >= 0 && idx < availableRoles.length) {
      roleApplied = availableRoles[idx];
    } else if (chosen.trim()) {
      roleApplied = chosen.trim();
    }
    const headerRole = document.getElementById('headerRolePill');
    if (headerRole) headerRole.textContent = roleApplied;
    const obRole = document.getElementById('onboardCandRole');
    if (obRole) obRole.textContent = roleApplied;
  }
}

function editCandidateEmail() {
  const current = candidateEmail === 'candidate@example.com' ? '' : (candidateEmail || '');
  const entered = prompt('Please enter your valid email address where your Official Job Offer & Call Letter / Assessment Results will be dispatched immediately:', current);
  if (entered !== null) {
    const trimmed = entered.trim();
    if (trimmed && trimmed.includes('@')) {
      candidateEmail = trimmed;
      const disp1 = document.getElementById('onboardCandEmail');
      if (disp1) disp1.textContent = candidateEmail;
      const disp2 = document.getElementById('modalCandidateEmail');
      if (disp2) disp2.textContent = candidateEmail;
    } else if (trimmed) {
      alert('Please enter a valid email address (e.g. yourname@gmail.com).');
    }
  }
}

// -------------------------------------------------------------
// ANTI-CHEATING PROCTORING SHIELD
// -------------------------------------------------------------
function setupAntiCheatingShield() {
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  document.addEventListener('copy', (e) => { e.preventDefault(); return false; });
  document.addEventListener('cut', (e) => { e.preventDefault(); return false; });
  document.addEventListener('paste', (e) => { e.preventDefault(); return false; });
  document.addEventListener('selectstart', (e) => { e.preventDefault(); return false; });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && isAssessmentStarted && !isSubmitted) {
      triggerProctoringViolation('Browser Tab Switch / Window Minimization Detected');
    }
  });

  window.addEventListener('blur', () => {
    if (isAssessmentStarted && !isSubmitted) {
      triggerProctoringViolation('Window Focus Lost (Secondary Window or External Application Opened)');
    }
  });
}

function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (!isAssessmentStarted || isSubmitted) return;

    // Block Inspect & DevTools keys
    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    const key = e.key.toLowerCase();

    if (
      e.key === 'F12' ||
      (isCtrlOrCmd && ['c', 'v', 'x', 'u', 'a', 'p', 's'].includes(key)) ||
      (isCtrlOrCmd && e.shiftKey && ['i', 'j', 'c'].includes(key))
    ) {
      e.preventDefault();
      triggerProctoringViolation('Blocked key shortcut used during assessment.');
      return;
    }

    // Question navigation shortcuts
    if (e.key === 'ArrowRight' || e.key === 'Enter') {
      navigateQuestion(1);
    } else if (e.key === 'ArrowLeft') {
      navigateQuestion(-1);
    } else if (['1', '2', '3', '4'].includes(e.key)) {
      selectOptionForActiveQuestion(parseInt(e.key, 10) - 1);
    } else if (['a', 'b', 'c', 'd'].includes(key)) {
      selectOptionForActiveQuestion(key.charCodeAt(0) - 97);
    } else if (key === 'f') {
      toggleFlagActiveQuestion();
    }
  });
}

function triggerProctoringViolation(reason) {
  if (!isAssessmentStarted || isSubmitted) return;
  violationCount++;

  const disp = document.getElementById('violationCountDisplay');
  if (disp) disp.textContent = violationCount;

  const modal = document.getElementById('violationModal');
  const modalText = document.getElementById('violationModalText');

  if (violationCount >= maxViolations) {
    if (modalText) {
      modalText.innerHTML = `
        <strong style="color: #ef4444; font-size: 15px;">MAXIMUM VIOLATIONS EXCEEDED (3/3)</strong><br><br>
        Reason: ${escapeHtml(reason)}.<br><br>
        Our proctoring engine has locked this assessment session. Your test is now being submitted automatically for evaluation.
      `;
    }
    if (modal) modal.style.display = 'flex';
    setTimeout(() => {
      confirmFinalSubmission(true);
    }, 2500);
  } else {
    if (modalText) {
      modalText.innerHTML = `
        <strong>Violation ${violationCount} of ${maxViolations}:</strong><br>
        ${escapeHtml(reason)}.<br><br>
        <span style="color: #fbbf24;">Switching windows or opening second tabs is strictly tracked. Exceeding 3 violations will auto-submit your test.</span>
      `;
    }
    if (modal) modal.style.display = 'flex';
  }
}

function closeViolationModal() {
  if (violationCount < maxViolations) {
    const modal = document.getElementById('violationModal');
    if (modal) modal.style.display = 'none';
  }
}

// -------------------------------------------------------------
// ASSESSMENT LAUNCH & QUESTION FETCH
// -------------------------------------------------------------
async function startAssessmentSession() {
  // Ensure candidate has entered a valid email address before test begins
  if (!candidateEmail || !candidateEmail.includes('@') || candidateEmail === 'candidate@example.com') {
    const entered = prompt('Please enter your email address to receive your Official Job Offer / Assessment Results immediately after the test:', candidateEmail === 'candidate@example.com' ? '' : candidateEmail);
    if (entered && entered.trim() && entered.includes('@')) {
      candidateEmail = entered.trim();
      const disp = document.getElementById('onboardCandEmail');
      if (disp) disp.textContent = candidateEmail;
    }
  }

  const btn = document.getElementById('btnStartAssessment');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '⏳ Initializing Systematic Assessment Engine...';
  }

  try {
    const queryParams = new URLSearchParams({
      role: roleApplied,
      candidateId: candidateId,
      candidateEmail: candidateEmail || '',
      name: candidateName || ''
    });

    const res = await fetch(`/api/assessment/questions?${queryParams.toString()}`);
    const data = await res.json();

    if (data.alreadySubmitted) {
      isSubmitted = true;
      document.getElementById('onboardingScreen').style.display = 'none';
      renderAlreadySubmittedScreen(data.candidate || {});
      return;
    }

    if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
      assessmentSessionId = data.sessionId || null;
      assessmentQuestions = data.questions;
      assessmentSections = data.sections || [];

      // Switch screen
      document.getElementById('onboardingScreen').style.display = 'none';
      document.getElementById('assessmentWorkspace').style.display = 'grid';
      isAssessmentStarted = true;

      // Start timer
      startTimer();

      // Render systematic section tabs & question palette
      renderSectionTabs();
      renderPaletteGrid();

      // Render first question
      renderActiveQuestion(0);
    } else {
      throw new Error(data.error || 'Failed to initialize questions.');
    }
  } catch (err) {
    console.error('Launch error:', err);
    alert('Failed to load assessment. Please refresh the page.');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '🚀 Retry Launching Assessment';
    }
  }
}

// -------------------------------------------------------------
// TIMER
// -------------------------------------------------------------
function startTimer() {
  const display = document.getElementById('timerDisplay');

  timerInterval = setInterval(() => {
    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      if (display) {
        display.textContent = '⏱️ 00:00 (Expired)';
        display.classList.add('urgent');
      }
      alert('Time expired! Submitting your assessment for automated evaluation now.');
      confirmFinalSubmission(false);
      return;
    }

    timerSeconds--;
    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    if (display) {
      display.textContent = `⏱️ ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      if (timerSeconds < 300) {
        display.classList.add('urgent');
      }
    }
  }, 1000);
}

// -------------------------------------------------------------
// SYSTEMATIC SECTION TABS & PALETTE
// -------------------------------------------------------------
function renderSectionTabs() {
  const container = document.getElementById('sectionTabsContainer');
  if (!container) return;
  container.innerHTML = '';

  const defaultSections = assessmentSections.length > 0 ? assessmentSections : [
    { index: 1, key: 'sec_1', shortName: 'Core Fundamentals', icon: '📐' },
    { index: 2, key: 'sec_2', shortName: 'System Architecture', icon: '🏛️' },
    { index: 3, key: 'sec_3', shortName: 'Problem Solving', icon: '⚡' },
    { index: 4, key: 'sec_4', shortName: 'Best Practices', icon: '🛡️' }
  ];

  defaultSections.forEach((sec, sIdx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `section-tab-btn ${sIdx === 0 ? 'active' : ''}`;
    btn.id = `sectionTabBtn_${sec.index}`;
    btn.onclick = () => jumpToSection(sec.index);

    // Count answered in this section
    const qInSection = assessmentQuestions.filter(q => (q.sectionIndex || 1) === sec.index);
    const answeredCount = qInSection.filter(q => userAnswers[q.id] !== undefined).length;

    btn.innerHTML = `
      <span>${sec.icon || '📌'} ${sec.shortName || ('Section ' + sec.index)}</span>
      <span class="tab-count" id="secTabCount_${sec.index}">${answeredCount}/${qInSection.length}</span>
    `;

    container.appendChild(btn);
  });
}

function updateSectionTabCounts() {
  const defaultSections = [1, 2, 3, 4];
  defaultSections.forEach(secIdx => {
    const countBadge = document.getElementById(`secTabCount_${secIdx}`);
    if (countBadge) {
      const qInSection = assessmentQuestions.filter(q => (q.sectionIndex || 1) === secIdx);
      const answeredCount = qInSection.filter(q => userAnswers[q.id] !== undefined).length;
      countBadge.textContent = `${answeredCount}/${qInSection.length}`;
    }
  });
}

function jumpToSection(secIndex) {
  const firstQIdx = assessmentQuestions.findIndex(q => (q.sectionIndex || 1) === secIndex);
  if (firstQIdx !== -1) {
    renderActiveQuestion(firstQIdx);
  }
}

function renderPaletteGrid() {
  const grid = document.getElementById('paletteGrid');
  if (!grid) return;
  grid.innerHTML = '';

  assessmentQuestions.forEach((q, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `palette-btn ${idx === currentQuestionIndex ? 'current' : ''}`;
    btn.id = `paletteBtn_${idx}`;
    btn.textContent = idx + 1;
    btn.title = `Question ${idx + 1} (${q.sectionShortName || 'Domain MCQ'})`;
    btn.onclick = () => renderActiveQuestion(idx);

    grid.appendChild(btn);
  });

  updatePaletteStatus();
}

function updatePaletteStatus() {
  assessmentQuestions.forEach((q, idx) => {
    const btn = document.getElementById(`paletteBtn_${idx}`);
    if (!btn) return;

    btn.className = 'palette-btn';
    if (idx === currentQuestionIndex) {
      btn.classList.add('current');
    }

    const isAnswered = userAnswers[q.id] !== undefined;
    const isFlagged = flaggedQuestions.has(q.id);

    if (isAnswered) btn.classList.add('answered');
    if (isFlagged) btn.classList.add('flagged');
  });

  // Update sidebar counter
  const answeredTotal = Object.keys(userAnswers).length;
  const total = assessmentQuestions.length || 20;

  const progText = document.getElementById('navigatorProgressText');
  if (progText) progText.textContent = `Answered: ${answeredTotal} / ${total} Questions`;

  // Update target progress bar
  const targetPct = Math.min(Math.round((answeredTotal / 16) * 100), 100);
  const targetFill = document.getElementById('targetProgressFill');
  if (targetFill) targetFill.style.width = `${targetPct}%`;

  const targetRatio = document.getElementById('targetCountRatio');
  if (targetRatio) targetRatio.textContent = `${answeredTotal} / 16 (${targetPct}%)`;

  updateSectionTabCounts();
}

// -------------------------------------------------------------
// RENDER ACTIVE QUESTION
// -------------------------------------------------------------
function renderActiveQuestion(idx) {
  if (idx < 0 || idx >= assessmentQuestions.length) return;
  currentQuestionIndex = idx;
  const q = assessmentQuestions[idx];
  visitedQuestions.add(q.id);

  // Update Section Tab active state
  const secIdx = q.sectionIndex || 1;
  document.querySelectorAll('.section-tab-btn').forEach(btn => btn.classList.remove('active'));
  const activeTabBtn = document.getElementById(`sectionTabBtn_${secIdx}`);
  if (activeTabBtn) activeTabBtn.classList.add('active');

  // Update Question Meta Header
  document.getElementById('activeQNumPill').textContent = `Q${idx + 1} of ${assessmentQuestions.length}`;
  document.getElementById('activeQSectionPill').textContent = q.sectionName || `Section ${secIdx}: Domain Competency`;
  document.getElementById('activeQCategoryPill').textContent = q.category || `${roleApplied} Core`;

  const diffPill = document.getElementById('activeQDiffPill');
  if (diffPill) {
    const diff = (q.difficulty || 'Core / Intermediate').toLowerCase();
    diffPill.textContent = q.difficulty || 'Core / Intermediate';
    diffPill.className = 'q-diff-pill';
    if (diff.includes('advanced')) diffPill.classList.add('advanced');
    if (diff.includes('expert')) diffPill.classList.add('expert');
  }

  // Question Statement with syntax-friendly formatting
  const statementBox = document.getElementById('activeQStatement');
  statementBox.innerHTML = formatQuestionText(q.question);

  // Options Stack
  const optionsStack = document.getElementById('activeOptionsStack');
  optionsStack.innerHTML = '';

  const selectedOpt = userAnswers[q.id];

  q.options.forEach((optText, optIdx) => {
    const card = document.createElement('div');
    card.className = `option-card ${selectedOpt === optIdx ? 'selected' : ''}`;
    card.id = `optCard_${q.id}_${optIdx}`;
    card.onclick = () => selectOptionForActiveQuestion(optIdx);

    const letter = String.fromCharCode(65 + optIdx);

    card.innerHTML = `
      <div class="option-letter">${letter}</div>
      <div class="option-text">${escapeHtml(optText)}</div>
    `;

    optionsStack.appendChild(card);
  });

  // Update Flag Button state
  const flagBtn = document.getElementById('btnFlagQ');
  if (flagBtn) {
    if (flaggedQuestions.has(q.id)) {
      flagBtn.classList.add('active');
      flagBtn.innerHTML = '🚩 Flagged for Review';
    } else {
      flagBtn.classList.remove('active');
      flagBtn.innerHTML = '🏷️ Mark for Review';
    }
  }

  // Update Prev/Next button states
  const prevBtn = document.getElementById('btnPrevQ');
  if (prevBtn) prevBtn.disabled = idx === 0;

  const nextBtn = document.getElementById('btnNextQ');
  if (nextBtn) {
    if (idx === assessmentQuestions.length - 1) {
      nextBtn.innerHTML = 'Review &amp; Submit →';
      nextBtn.onclick = () => openSubmissionSummaryModal();
    } else {
      nextBtn.innerHTML = 'Next Question →';
      nextBtn.onclick = () => navigateQuestion(1);
    }
  }

  updatePaletteStatus();
}

function selectOptionForActiveQuestion(optIdx) {
  const q = assessmentQuestions[currentQuestionIndex];
  if (!q) return;

  userAnswers[q.id] = optIdx;

  // Update cards
  for (let i = 0; i < 4; i++) {
    const card = document.getElementById(`optCard_${q.id}_${i}`);
    if (card) {
      if (i === optIdx) card.classList.add('selected');
      else card.classList.remove('selected');
    }
  }

  updatePaletteStatus();
}

function clearActiveQuestionAnswer() {
  const q = assessmentQuestions[currentQuestionIndex];
  if (!q) return;

  delete userAnswers[q.id];

  for (let i = 0; i < 4; i++) {
    const card = document.getElementById(`optCard_${q.id}_${i}`);
    if (card) card.classList.remove('selected');
  }

  updatePaletteStatus();
}

function toggleFlagActiveQuestion() {
  const q = assessmentQuestions[currentQuestionIndex];
  if (!q) return;

  if (flaggedQuestions.has(q.id)) {
    flaggedQuestions.delete(q.id);
  } else {
    flaggedQuestions.add(q.id);
  }

  renderActiveQuestion(currentQuestionIndex);
}

function navigateQuestion(step) {
  const nextIdx = currentQuestionIndex + step;
  if (nextIdx >= 0 && nextIdx < assessmentQuestions.length) {
    renderActiveQuestion(nextIdx);
  }
}

// -------------------------------------------------------------
// SUBMISSION SUMMARY MODAL
// -------------------------------------------------------------
function openSubmissionSummaryModal() {
  const total = assessmentQuestions.length || 20;
  const answered = Object.keys(userAnswers).length;
  const flagged = flaggedQuestions.size;
  const unanswered = total - answered;

  document.getElementById('modalAnsweredCount').textContent = answered;
  document.getElementById('modalFlaggedCount').textContent = flagged;
  document.getElementById('modalUnansweredCount').textContent = unanswered;

  const emailDisp = document.getElementById('modalCandidateEmail');
  if (emailDisp) {
    emailDisp.textContent = candidateEmail || '⚠️ No email set (Click Change Email)';
  }

  const warn = document.getElementById('unansweredWarning');
  if (warn) {
    warn.style.display = unanswered > 0 ? 'block' : 'none';
  }

  document.getElementById('summaryModalBackdrop').style.display = 'flex';
}

function closeSubmissionSummaryModal() {
  document.getElementById('summaryModalBackdrop').style.display = 'none';
}

// -------------------------------------------------------------
// CONFIRM FINAL SUBMISSION & SERVER EVALUATION
// -------------------------------------------------------------
async function confirmFinalSubmission(forcedByViolation = false) {
  // Validate email address before final submission
  if (!candidateEmail || !candidateEmail.includes('@') || candidateEmail === 'candidate@example.com') {
    const entered = prompt('Please enter your email address so your immediate test result / offer letter email can be delivered to you:', '');
    if (entered && entered.trim() && entered.includes('@')) {
      candidateEmail = entered.trim();
    }
  }

  closeSubmissionSummaryModal();
  isSubmitted = true;
  if (timerInterval) clearInterval(timerInterval);

  // Show loading in workspace
  const workspace = document.getElementById('assessmentWorkspace');
  if (workspace) {
    workspace.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 80px 20px; background: var(--surface); border: 1px solid var(--surface-border); border-radius: 20px;">
        <div style="font-size: 48px; margin-bottom: 16px;">⚡</div>
        <h2 style="font-size: 24px; font-weight: 800; color: #fff; margin-bottom: 8px;">
          Evaluating Systematic Assessment...
        </h2>
        <p style="font-size: 14.5px; color: var(--text-muted); max-width: 500px; margin: 0 auto;">
          Analyzing your responses against the enterprise domain key, calculating multi-section competency breakdown, and dispatching your auto-reply outcome email immediately via SMTP.
        </p>
      </div>
    `;
  }

  try {
    const payload = {
      candidateId,
      candidateName,
      candidateEmail,
      roleApplied,
      sessionId: assessmentSessionId,
      answers: userAnswers,
      tabSwitchesCount: violationCount,
      timeSpentSeconds: (25 * 60) - timerSeconds,
      forcedByViolation
    };

    const res = await fetch('/api/assessment/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.success) {
      renderSystematicResultDashboard(data.result, data.candidate);
    } else {
      throw new Error(data.error || 'Evaluation failed.');
    }
  } catch (err) {
    console.error('Submission error:', err);
    alert('Submission failed. Your answers are saved locally. Please contact HR recruiter.');
  }
}

// -------------------------------------------------------------
// SYSTEMATIC EVALUATION REPORT & DASHBOARD
// -------------------------------------------------------------
function renderSystematicResultDashboard(result, candidate) {
  const container = document.getElementById('resultDashboard');
  const workspace = document.getElementById('assessmentWorkspace');
  if (workspace) workspace.style.display = 'none';

  container.style.display = 'flex';
  container.innerHTML = '';

  const scorePct = result.scorePercent || 0;
  const passed = result.passed || false;
  const correctCount = result.correctCount || 0;
  const totalQ = result.totalQuestions || 20;

  // Hero Score Card
  const heroCard = document.createElement('div');
  heroCard.className = 'result-hero-card';
  heroCard.style.setProperty('--score-pct', scorePct);

  const heroIcon = passed ? '🎉' : '📊';
  const heroTitle = passed ? 'Assessment Passed — Offer Qualified!' : 'Technical Assessment Completed';
  const verdictBadge = passed 
    ? '<span style="background: rgba(16, 185, 129, 0.2); border: 1px solid #10b981; color: #34d399; font-weight: 800; font-size: 13px; padding: 6px 16px; border-radius: 99px;">✔ 80%+ QUALIFIED FOR OFFICIAL OFFER</span>'
    : '<span style="background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #f87171; font-weight: 800; font-size: 13px; padding: 6px 16px; border-radius: 99px;">BELOW 80% QUALIFYING THRESHOLD</span>';

  heroCard.innerHTML = `
    <div style="font-size: 48px; margin-bottom: 12px;">${heroIcon}</div>
    <h2 style="font-size: 26px; font-weight: 800; color: #fff; margin-bottom: 6px;">${heroTitle}</h2>
    <p style="font-size: 14.5px; color: var(--text-muted); margin-bottom: 20px;">
      Candidate: <strong style="color: #fff;">${candidateName}</strong> • Domain: <strong style="color: var(--primary);">${roleApplied}</strong>
    </p>
    
    ${verdictBadge}

    <div class="radial-score-gauge">
      <div class="score-inner-text">
        <span class="score-num">${scorePct}%</span>
        <span class="score-sub">${correctCount} of ${totalQ} Correct</span>
      </div>
    </div>

    <div style="display: flex; justify-content: center; gap: 24px; font-size: 13.5px; color: var(--text-muted); margin-top: 10px;">
      <div>⏱️ Time Taken: <strong style="color: #fff;">${Math.floor(((25 * 60) - timerSeconds) / 60)}m ${((25 * 60) - timerSeconds) % 60}s</strong></div>
      <div>🛡️ Proctoring Violations: <strong style="color: ${violationCount > 0 ? '#f87171' : '#34d399'};">${violationCount}</strong></div>
      <div>🎯 Passing Score: <strong style="color: #34d399;">80% (16/20)</strong></div>
    </div>
  `;
  container.appendChild(heroCard);

  // Offer Letter Extension Card (if Passed)
  if (passed) {
    const offerDetails = candidate?.callLetterDetails || {};
    const offerCard = document.createElement('div');
    offerCard.className = 'offer-dispatch-banner';
    offerCard.innerHTML = `
      <h3>🎉 Official Job Offer &amp; Call Letter Dispatched!</h3>
      <p style="font-size: 14.5px; color: #e2e8f0; line-height: 1.6; margin-bottom: 16px;">
        Congratulations! Scoring <strong>${scorePct}%</strong> has satisfied all technical criteria for <strong>${roleApplied}</strong>. Your official appointment letter has been automatically generated and dispatched via SMTP.
      </p>
      <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 18px; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; font-size: 13.5px;">
        <div>
          <span style="color: #94a3b8; font-size: 11.5px; text-transform: uppercase; font-weight: 700; display: block;">Offer Ref ID</span>
          <strong style="color: #38bdf8; font-family: var(--font-mono);">${candidate?.offerRefId || 'HR-OFFER-2026-CONFIRMED'}</strong>
        </div>
        <div>
          <span style="color: #94a3b8; font-size: 11.5px; text-transform: uppercase; font-weight: 700; display: block;">Annual Compensation (CTC)</span>
          <strong style="color: #34d399;">${offerDetails.ctcPackage || '₹9,50,000 - ₹14,50,000 PA'}</strong>
        </div>
        <div>
          <span style="color: #94a3b8; font-size: 11.5px; text-transform: uppercase; font-weight: 700; display: block;">Proposed Joining Date</span>
          <strong style="color: #fff;">${offerDetails.joiningDate || 'Monday, 14 September 2026'}</strong>
        </div>
        <div>
          <span style="color: #94a3b8; font-size: 11.5px; text-transform: uppercase; font-weight: 700; display: block;">Delivered To</span>
          <strong style="color: #fff;">${offerDetails.deliveredTo || candidateEmail || candidate?.email || 'Registered Email'}</strong>
        </div>
      </div>
    `;
    container.appendChild(offerCard);
  } else {
    // Assessment Outcome & Feedback Dispatched Banner
    const feedbackDetails = candidate?.feedbackDetails || {};
    const feedbackCard = document.createElement('div');
    feedbackCard.style.cssText = 'background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 14px; padding: 20px; margin-top: 20px; color: #fff; text-align: left;';
    feedbackCard.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
        <span style="font-size: 22px;">📊</span>
        <h3 style="color: #fbbf24; margin: 0; font-size: 16px; font-weight: 800;">Assessment Outcome &amp; Performance Feedback Dispatched</h3>
      </div>
      <p style="margin: 0 0 12px 0; font-size: 13.5px; color: #fde68a; line-height: 1.5;">
        An automated evaluation email detailing your overall score (${scorePct}%), 4-section competency breakdown, and actionable growth areas has been dispatched via Gmail SMTP.
      </p>
      <div style="font-size: 12.5px; color: #cbd5e1;">
        Delivered To: <strong style="color: #38bdf8;">${feedbackDetails.deliveredTo || candidateEmail || candidate?.email || 'Registered Email'}</strong>
      </div>
    `;
    container.appendChild(feedbackCard);
  }

  // Section Breakdown Matrix
  const secMatrix = document.createElement('div');
  secMatrix.innerHTML = `
    <h3 style="font-size: 18px; font-weight: 800; color: #fff; margin: 12px 0 16px 0;">
      📊 Systematic Section Competency Performance
    </h3>
  `;
  const secGrid = document.createElement('div');
  secGrid.className = 'section-matrix-grid';

  const sectionBreakdown = result.sectionBreakdown || {};
  Object.keys(sectionBreakdown).forEach(k => {
    const sec = sectionBreakdown[k];
    const secCard = document.createElement('div');
    secCard.className = 'section-score-card';

    const secPct = sec.scorePercent || 0;
    const isSecPassed = secPct >= 80;

    secCard.innerHTML = `
      <div class="sec-card-header">
        <h4>${sec.icon || '📌'} ${sec.shortName || sec.name}</h4>
        <span class="sec-score-pill" style="color: ${isSecPassed ? '#34d399' : '#fbbf24'};">${sec.correct}/${sec.total} (${secPct}%)</span>
      </div>
      <div class="progress-track" style="margin: 8px 0;">
        <div class="progress-fill" style="width: ${secPct}%; background: ${isSecPassed ? 'var(--success)' : 'var(--warning)'};"></div>
      </div>
      <div style="font-size: 11.5px; color: var(--text-dim); display: flex; justify-content: space-between;">
        <span>Difficulty: ${sec.difficulty || 'Advanced'}</span>
        <span style="color: ${isSecPassed ? '#34d399' : '#fbbf24'}; font-weight: 700;">${isSecPassed ? 'Proficient' : 'Developing'}</span>
      </div>
    `;
    secGrid.appendChild(secCard);
  });

  secMatrix.appendChild(secGrid);
  container.appendChild(secMatrix);

  // Detailed Solution & Answer Review
  const reviewSection = document.createElement('div');
  reviewSection.innerHTML = `
    <h3 style="font-size: 18px; font-weight: 800; color: #fff; margin: 20px 0 16px 0;">
      📝 Question-by-Question Solution Breakdown &amp; Explanations
    </h3>
  `;

  const reviewList = document.createElement('div');
  reviewList.className = 'review-list';

  (result.details || []).forEach((d, idx) => {
    const card = document.createElement('div');
    card.className = `review-q-card ${d.isCorrect ? 'correct' : 'incorrect'}`;

    const userSelectedLetter = d.userSelected !== null ? String.fromCharCode(65 + d.userSelected) : 'Unanswered';
    const correctLetter = String.fromCharCode(65 + d.correctIndex);
    const statusPill = d.isCorrect
      ? '<span style="background: rgba(16, 185, 129, 0.15); color: #34d399; font-weight: 800; font-size: 12px; padding: 3px 10px; border-radius: 6px;">✔ Correct (+1)</span>'
      : '<span style="background: rgba(239, 68, 68, 0.15); color: #f87171; font-weight: 800; font-size: 12px; padding: 3px 10px; border-radius: 6px;">✖ Incorrect (0)</span>';

    const optionsList = d.options.map((opt, oIdx) => {
      const isCorrectOpt = oIdx === d.correctIndex;
      const isUserChoice = oIdx === d.userSelected;
      let optStyle = 'background: rgba(255,255,255,0.02); border: 1px solid var(--surface-border); color: var(--text-muted);';

      if (isCorrectOpt) {
        optStyle = 'background: rgba(16, 185, 129, 0.12); border: 1px solid #10b981; color: #fff; font-weight: 700;';
      } else if (isUserChoice && !d.isCorrect) {
        optStyle = 'background: rgba(239, 68, 68, 0.12); border: 1px solid #ef4444; color: #fca5a5;';
      }

      return `
        <div style="padding: 10px 14px; border-radius: 8px; margin-bottom: 6px; font-size: 13.5px; ${optStyle}">
          <strong>${String.fromCharCode(65 + oIdx)}.</strong> ${escapeHtml(opt)}
          ${isCorrectOpt ? ' <strong style="color: #34d399; margin-left: 6px;">(Correct Answer)</strong>' : ''}
          ${isUserChoice && !isCorrectOpt ? ' <strong style="color: #f87171; margin-left: 6px;">(Your Selection)</strong>' : ''}
        </div>
      `;
    }).join('');

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div style="display: flex; gap: 8px; align-items: center;">
          <span style="font-family: var(--font-mono); font-size: 12px; font-weight: 800; color: var(--primary);">Q${idx + 1}</span>
          <span style="font-size: 12px; color: var(--text-muted);">${d.sectionShortName || 'Section'} • ${d.category || 'Competency'}</span>
        </div>
        ${statusPill}
      </div>

      <div style="font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 14px; line-height: 1.5;">
        ${formatQuestionText(d.question)}
      </div>

      <div>${optionsList}</div>

      <div class="review-explanation">
        💡 <strong>Engineering Rationale:</strong> ${escapeHtml(d.explanation)}
      </div>
    `;

    reviewList.appendChild(card);
  });

  reviewSection.appendChild(reviewList);
  container.appendChild(reviewSection);
}

function renderAlreadySubmittedScreen(cand) {
  const container = document.getElementById('resultDashboard');
  container.style.display = 'flex';
  container.innerHTML = `
    <div class="result-hero-card" style="margin-top: 40px;">
      <div style="font-size: 48px; margin-bottom: 12px;">🔒</div>
      <h2 style="font-size: 24px; font-weight: 800; color: #fff; margin-bottom: 8px;">
        Assessment Already Completed
      </h2>
      <p style="font-size: 14.5px; color: var(--text-muted); margin-bottom: 20px;">
        Candidate: <strong style="color: #fff;">${cand.name || candidateName}</strong> • Domain: <strong style="color: var(--primary);">${cand.roleApplied || roleApplied}</strong>
      </p>
      <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 14px; padding: 20px; max-width: 500px; margin: 0 auto 24px auto; color: #fff; text-align: left;">
        <div style="font-size: 13.5px; margin-bottom: 6px;">Score Achieved: <strong style="color: #34d399; font-size: 18px; font-family: var(--font-mono);">${cand.scorePercent || 0}%</strong></div>
        <div style="font-size: 13.5px; margin-bottom: 6px;">Evaluation Status: <strong style="color: #38bdf8;">${cand.status || 'EVALUATED'}</strong></div>
        <div style="font-size: 13.5px;">Offer Reference: <strong style="color: #a78bfa; font-family: var(--font-mono);">${cand.offerRefId || 'N/A'}</strong></div>
      </div>
      <button type="button" onclick="startFreshCandidateTest()" style="background: linear-gradient(135deg, var(--primary), var(--accent)); color: #fff; border: none; padding: 12px 28px; border-radius: 10px; font-size: 14px; font-weight: 800; cursor: pointer; box-shadow: 0 4px 15px var(--primary-glow);">
        🚀 Take Assessment as a New Candidate
      </button>
    </div>
  `;
}

function startFreshCandidateTest() {
  const newId = 'cand-' + Date.now();
  const newToken = 'tkn_' + Date.now();
  window.location.href = `/assessment.html?id=${newId}&token=${newToken}&role=Frontend Developer&name=New Candidate`;
}

// -------------------------------------------------------------
// UTILITIES
// -------------------------------------------------------------
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatQuestionText(text) {
  if (!text) return '';
  let escaped = escapeHtml(text);
  // Format inline code `code`
  escaped = escaped.replace(/`([^`]+)`/g, '<code>$1</code>');
  return escaped;
}
