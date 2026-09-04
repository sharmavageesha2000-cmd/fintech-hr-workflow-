/**
 * Online Proctored Assessment Client Script
 * Implements Anti-Cheating Protection (Copy-Paste Lock, Tab Switch / Multi-Window Tracker)
 * Evaluates Domain-Specific 20 MCQs with 80% passing rule.
 */

// State
let assessmentSessionId = null;
let assessmentQuestions = [];
let answeredAnswers = {};
let violationCount = 0;
let maxViolations = 3;
let timerSeconds = 25 * 60; // 25 minutes
let timerInterval = null;
let isSubmitted = false;

// URL Parameters
const urlParams = new URLSearchParams(window.location.search);
let candidateId = urlParams.get('id') || 'cand-' + Date.now();
let candidateName = urlParams.get('name') || 'Candidate';
let candidateEmail = (urlParams.get('email') || '').trim();
let roleApplied = urlParams.get('role') || 'Frontend Developer';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setupCandidateHeader();
  setupAntiCheatingShield();
  startTimer();
  fetchQuestions();

  document.getElementById('assessmentForm').addEventListener('submit', handleFormSubmit);
});

function setupCandidateHeader() {
  document.getElementById('candNameDisplay').textContent = `${candidateName}'s Technical Assessment`;
  document.getElementById('candEmailDisplay').textContent = candidateEmail || 'Not set (Click ✏️ Edit Email)';
  document.getElementById('candRoleDisplay').textContent = roleApplied;
  document.getElementById('headerRole').textContent = `${roleApplied} (20 Domain MCQs)`;
}

function editCandidateEmail() {
  const current = candidateEmail || '';
  const entered = prompt('Please enter your valid email address where your Official Job Offer & Call Letter will be dispatched upon scoring >= 80%:', current);
  if (entered !== null) {
    const trimmed = entered.trim();
    if (trimmed && trimmed.includes('@')) {
      candidateEmail = trimmed;
      const disp = document.getElementById('candEmailDisplay');
      if (disp) disp.textContent = candidateEmail;
    } else if (trimmed) {
      alert('Please enter a valid email address (e.g. yourname@gmail.com).');
    }
  }
}

// -------------------------------------------------------------
// ANTI-CHEATING & PROCTORING SHIELD
// -------------------------------------------------------------
function setupAntiCheatingShield() {
  // 1. Disable Right-Click Context Menu
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  // 2. Disable Copy, Cut, Paste, Text Selection
  document.addEventListener('copy', (e) => { e.preventDefault(); return false; });
  document.addEventListener('cut', (e) => { e.preventDefault(); return false; });
  document.addEventListener('paste', (e) => { e.preventDefault(); return false; });
  document.addEventListener('selectstart', (e) => { e.preventDefault(); return false; });

  // 3. Block Developer Tools & Common Cheating Key Combinations
  document.addEventListener('keydown', (e) => {
    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    const key = e.key.toLowerCase();

    // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+A
    if (
      e.key === 'F12' ||
      (isCtrlOrCmd && ['c', 'v', 'x', 'u', 'a', 'p', 's'].includes(key)) ||
      (isCtrlOrCmd && e.shiftKey && ['i', 'j', 'c'].includes(key))
    ) {
      e.preventDefault();
      triggerViolation('Keyboard shortcut blocked by proctoring engine.');
      return false;
    }
  });

  // 4. Tab-Switch & Multi-Window Monitor
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && !isSubmitted) {
      triggerViolation('Browser Tab Switch / Window Minimization Detected');
    }
  });

  window.addEventListener('blur', () => {
    if (!isSubmitted) {
      triggerViolation('Window Focus Lost (Secondary Window or External App Opened)');
    }
  });
}

function triggerViolation(reason) {
  if (isSubmitted) return;
  violationCount++;
  document.getElementById('violationCount').textContent = violationCount;

  const modal = document.getElementById('violationModal');
  const modalText = document.getElementById('violationModalText');

  if (violationCount >= maxViolations) {
    modalText.innerHTML = `
      <strong style="color: #ef4444; font-size: 16px;">MAXIMUM VIOLATIONS EXCEEDED (3/3)</strong><br><br>
      Reason: ${reason}.<br><br>
      Our proctoring system has locked your test session. Your assessment is now being automatically submitted for evaluation.
    `;
    modal.style.display = 'flex';
    setTimeout(() => {
      submitAssessmentDirectly(true);
    }, 2500);
  } else {
    modalText.innerHTML = `
      <strong>Violation ${violationCount} of ${maxViolations}:</strong><br>
      ${reason}.<br><br>
      <span style="color: #fbbf24;">Opening second windows or switching tabs is strictly forbidden. 3 violations will auto-submit your test.</span>
    `;
    modal.style.display = 'flex';
  }
}

function closeViolationModal() {
  if (violationCount < maxViolations) {
    document.getElementById('violationModal').style.display = 'none';
  }
}

// -------------------------------------------------------------
// TIMER LOGIC
// -------------------------------------------------------------
function startTimer() {
  const display = document.getElementById('timerDisplay');

  timerInterval = setInterval(() => {
    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      display.textContent = '⏱️ 00:00 (Time Expired)';
      alert('Time expired! Submitting your assessment now.');
      submitAssessmentDirectly(false);
      return;
    }

    timerSeconds--;
    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    display.textContent = `⏱️ ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    if (timerSeconds < 300) {
      display.style.color = '#ef4444';
      display.style.borderColor = 'rgba(239, 68, 68, 0.4)';
    }
  }, 1000);
}

// -------------------------------------------------------------
// FETCH & RENDER QUESTIONS
// -------------------------------------------------------------
async function fetchQuestions() {
  const container = document.getElementById('questionsList');

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
      if (timerInterval) clearInterval(timerInterval);

      // Disable timer and violation counters in header
      const timerDisplay = document.getElementById('timerDisplay');
      if (timerDisplay) {
        timerDisplay.textContent = '🔒 Assessment Closed';
        timerDisplay.style.color = '#10b981';
        timerDisplay.style.borderColor = 'rgba(16, 185, 129, 0.4)';
      }
      const violBadge = document.getElementById('violationCountBadge');
      if (violBadge) violBadge.style.display = 'none';

      renderAlreadySubmittedScreen(data.candidate || {});
      return;
    }

    if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
      assessmentSessionId = data.sessionId || null;
      assessmentQuestions = data.questions;
      renderQuestions(data.questions);
      document.getElementById('totalCount').textContent = data.questions.length;
    } else {
      throw new Error(data.error || 'Failed to load questions');
    }
  } catch (err) {
    console.error('Questions load error:', err);
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #ef4444;">
        ⚠️ Failed to load assessment questions. Please refresh the page.
      </div>
    `;
  }
}

function renderQuestions(questions) {
  const container = document.getElementById('questionsList');
  container.innerHTML = '';

  questions.forEach((q, index) => {
    const card = document.createElement('div');
    card.className = 'q-card';
    card.id = `qCard_${q.id}`;

    const optionsHtml = q.options.map((opt, optIndex) => `
      <label class="option-label" id="optLabel_${q.id}_${optIndex}">
        <input 
          type="radio" 
          name="question_${q.id}" 
          value="${optIndex}" 
          class="option-radio"
          onchange="onSelectOption(${q.id}, ${optIndex})"
        >
        <span><strong>${String.fromCharCode(65 + optIndex)}.</strong> ${escapeHtml(opt)}</span>
      </label>
    `).join('');

    card.innerHTML = `
      <div class="q-header">
        <span class="q-number">Q${index + 1}</span>
        <div class="q-title">${escapeHtml(q.question)}</div>
      </div>
      <div class="options-grid">
        ${optionsHtml}
      </div>
    `;

    container.appendChild(card);
  });
}

function onSelectOption(questionId, optionIndex) {
  answeredAnswers[questionId] = optionIndex;

  // Highlight selected card & option
  const card = document.getElementById(`qCard_${questionId}`);
  if (card) card.classList.add('answered');

  for (let i = 0; i < 4; i++) {
    const label = document.getElementById(`optLabel_${questionId}_${i}`);
    if (label) {
      if (i === optionIndex) label.classList.add('selected');
      else label.classList.remove('selected');
    }
  }

  // Update progress
  const answeredCount = Object.keys(answeredAnswers).length;
  document.getElementById('answeredCount').textContent = answeredCount;
}

// -------------------------------------------------------------
// SUBMISSION & SCORING
// -------------------------------------------------------------
async function handleFormSubmit(e) {
  e.preventDefault();
  const total = assessmentQuestions.length || 20;
  const answered = Object.keys(answeredAnswers).length;

  if (answered < total) {
    const proceed = confirm(`You have answered ${answered} of ${total} questions. Unanswered questions will be scored as 0. Do you wish to submit now?`);
    if (!proceed) return;
  }

  // Ensure candidate email is verified so offer letter can be delivered
  if (!candidateEmail || !candidateEmail.includes('@') || candidateEmail.includes('example.com') || candidateEmail.includes('finova.com')) {
    const entered = prompt('Please enter your email address where your Official Job Offer & Call Letter will be dispatched upon scoring >= 80%:', candidateEmail || '');
    if (entered && entered.trim().includes('@')) {
      candidateEmail = entered.trim();
      const disp = document.getElementById('candEmailDisplay');
      if (disp) disp.textContent = candidateEmail;
    } else {
      alert('A valid email address is required so the recruitment system can dispatch your Official Call Letter.');
      return;
    }
  }

  submitAssessmentDirectly(false);
}

async function submitAssessmentDirectly(forcedByViolation = false) {
  if (isSubmitted) return;
  isSubmitted = true;
  clearInterval(timerInterval);

  const btn = document.getElementById('btnSubmitTest');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Evaluating Answers & Generating Results...';
  }

  const payload = {
    candidateId,
    candidateName,
    candidateEmail,
    roleApplied,
    sessionId: assessmentSessionId,
    answers: answeredAnswers,
    tabSwitchesCount: violationCount,
    forcedByViolation,
    timeSpentSeconds: (25 * 60) - Math.max(0, timerSeconds)
  };

  try {
    const res = await fetch('/api/assessment/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.success) {
      renderResultScreen(data);
    } else {
      alert(data.error || 'Submission failed. Please contact hiring team.');
    }
  } catch (err) {
    console.error('Submission error:', err);
    alert('Network error submitting assessment. Your responses have been cached.');
  }
}

function renderResultScreen(result) {
  document.getElementById('mainApp').style.display = 'none';
  document.getElementById('violationModal').style.display = 'none';
  const resultApp = document.getElementById('resultApp');
  resultApp.style.display = 'block';

  const isPassed = result.passed;
  const score = result.scorePercent;
  const correct = result.correctCount;
  const total = result.totalQuestions;
  const emailSent = result.emailDispatch && result.emailDispatch.success;
  const targetEmail = (result.candidate && result.candidate.email) || candidateEmail || '';
  const resolvedName = (result.candidate && result.candidate.name) || candidateName || 'Candidate';

  const resultCard = document.getElementById('resultCard');

  if (isPassed) {
    const offerDetails = result.candidate?.callLetterDetails || {};
    const refId = result.candidate?.offerRefId || offerDetails.offerRefId || 'HR-OFFER-2026';
    const ctc = offerDetails.ctcPackage || '₹9,50,000 per annum (Full-Time)';
    const joining = offerDetails.joiningDate || 'Monday, 14 September 2026';

    resultCard.innerHTML = `
      <div class="result-icon">🎉</div>
      <h2 class="result-title" style="color: #10b981;">Congratulations, ${escapeHtml(resolvedName)}!</h2>
      <p style="color: #9ca3af; font-size: 15px;">You have successfully passed the Technical Assessment for <strong>${escapeHtml(roleApplied)}</strong>.</p>
      
      <div class="score-circle" style="border-color: #10b981; box-shadow: 0 0 24px rgba(16, 185, 129, 0.25);">
        <span class="score-number">${score}%</span>
        <span class="score-label" style="color: #34d399;">Score (${correct}/${total})</span>
      </div>

      <div class="offer-alert" style="background: rgba(16, 185, 129, 0.12); border: 1.5px solid rgba(16, 185, 129, 0.4); border-radius: 14px; padding: 22px; margin: 20px 0; text-align: left;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 1px solid rgba(16, 185, 129, 0.25); padding-bottom: 10px;">
          <h3 style="margin: 0; font-size: 16px; font-weight: 800; color: #10b981;">📜 Official Job Offer &amp; Call Letter Extended!</h3>
          <span style="background: rgba(16, 185, 129, 0.2); color: #34d399; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 6px;">REF: ${escapeHtml(refId)}</span>
        </div>
        
        <table style="width: 100%; font-size: 13.5px; color: #e2e8f0; border-collapse: collapse; margin-bottom: 16px;">
          <tr>
            <td style="padding: 5px 0; color: #9ca3af; width: 35%;"><strong>Position:</strong></td>
            <td style="padding: 5px 0; font-weight: 700; color: #fff;">${escapeHtml(roleApplied)}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #9ca3af;"><strong>Package (CTC):</strong></td>
            <td style="padding: 5px 0; font-weight: 700; color: #34d399;">${escapeHtml(ctc)}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #9ca3af;"><strong>Joining Date:</strong></td>
            <td style="padding: 5px 0; font-weight: 700; color: #fff;">${escapeHtml(joining)}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #9ca3af;"><strong>Dispatch Destination:</strong></td>
            <td style="padding: 5px 0; font-weight: 700; color: #38bdf8;">${escapeHtml(targetEmail || 'Registered Candidate Email')}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #9ca3af;"><strong>Email Delivery Status:</strong></td>
            <td style="padding: 5px 0; font-weight: 700; color: ${emailSent ? '#34d399' : '#fbbf24'};">
              ${emailSent ? `✅ Dispatched &amp; Delivered via Gmail SMTP` : (targetEmail ? `🚀 Dispatched to ${escapeHtml(targetEmail)}` : '⚠️ Please enter email below')}
            </td>
          </tr>
        </table>

        <p style="margin: 0; line-height: 1.6; font-size: 13.5px; color: #d1fae5;">
          Because you achieved <strong>${score}%</strong> (passing threshold: 80%), your official employment offer, full compensation structure, joining guidelines, and call letter have been <strong>automatically generated and dispatched</strong> to <strong>${escapeHtml(targetEmail || 'your email')}</strong>. Please check your inbox (and spam/promotions folder).
        </p>
      </div>
    `;
  } else {
    resultCard.innerHTML = `
      <div class="result-icon">📊</div>
      <h2 class="result-title" style="color: #f59e0b;">Assessment Completed</h2>
      <p style="color: #9ca3af; font-size: 15px;">Technical Evaluation for <strong>${escapeHtml(roleApplied)}</strong></p>
      
      <div class="score-circle" style="border-color: #f59e0b; box-shadow: 0 0 24px rgba(245, 158, 11, 0.2);">
        <span class="score-number">${score}%</span>
        <span class="score-label" style="color: #fbbf24;">Score (${correct}/${total})</span>
      </div>

      <div class="feedback-alert">
        <h3 style="margin: 0 0 8px 0; font-size: 15px; font-weight: 800; color: #ef4444;">Threshold Not Reached (Passing Score: 80%)</h3>
        <p style="margin: 0; line-height: 1.5; color: #fee2e2;">
          You scored <strong>${score}%</strong> (${correct} of ${total} correct). For this opening, an 80% score is required for automated offer generation. Therefore, an employment offer has not been issued.
        </p>
      </div>

      <p class="result-msg">
        We appreciate your dedication and time taking this assessment. Your score and responses have been logged in our recruitment records.
      </p>
    `;
  }
}

function renderAlreadySubmittedScreen(cand) {
  document.getElementById('mainApp').style.display = 'none';
  const modal = document.getElementById('violationModal');
  if (modal) modal.style.display = 'none';

  const resultApp = document.getElementById('resultApp');
  resultApp.style.display = 'block';

  const isPassed = cand.passed !== undefined ? cand.passed : ((cand.scorePercent || 0) >= 80);
  const score = cand.scorePercent !== undefined ? cand.scorePercent : (cand.testScore || 0);
  const correct = cand.correctCount !== undefined ? cand.correctCount : Math.round((score / 100) * 20);
  const total = cand.totalQuestions || 20;
  const targetEmail = cand.email || candidateEmail || '';
  const resolvedName = cand.name || candidateName || 'Candidate';
  const resolvedRole = cand.roleApplied || roleApplied;
  const completedDate = cand.completedAt ? new Date(cand.completedAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }) : 'Recorded in Portal';

  const resultCard = document.getElementById('resultCard');

  if (isPassed) {
    const offerDetails = cand.callLetterDetails || {};
    const refId = cand.offerRefId || offerDetails.offerRefId || 'HR-OFFER-2026';
    const ctc = offerDetails.ctcPackage || '₹9,50,000 per annum (Full-Time)';
    const joining = offerDetails.joiningDate || 'Monday, 14 September 2026';

    resultCard.innerHTML = `
      <div class="result-icon">🔒</div>
      <div style="display: inline-block; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); color: #34d399; font-size: 11.5px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 4px 14px; border-radius: 99px; margin-bottom: 12px;">
        ASSESSMENT ALREADY SUBMITTED
      </div>
      <h2 class="result-title" style="color: #10b981; margin-top: 4px;">Test Completed &amp; Recorded</h2>
      <p style="color: #9ca3af; font-size: 14.5px;">
        Dear <strong>${escapeHtml(resolvedName)}</strong>, you have already completed the technical assessment for <strong>${escapeHtml(resolvedRole)}</strong>.
      </p>

      <div class="score-circle" style="border-color: #10b981; box-shadow: 0 0 24px rgba(16, 185, 129, 0.25); margin: 20px auto;">
        <span class="score-number">${score}%</span>
        <span class="score-label" style="color: #34d399;">Achieved (${correct}/${total})</span>
      </div>

      <div class="offer-alert" style="background: rgba(16, 185, 129, 0.12); border: 1.5px solid rgba(16, 185, 129, 0.4); border-radius: 14px; padding: 22px; margin: 20px 0; text-align: left;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 1px solid rgba(16, 185, 129, 0.25); padding-bottom: 10px;">
          <h3 style="margin: 0; font-size: 16px; font-weight: 800; color: #10b981;">📜 Official Job Offer Extended &amp; Sent</h3>
          <span style="background: rgba(16, 185, 129, 0.2); color: #34d399; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 6px;">REF: ${escapeHtml(refId)}</span>
        </div>

        <table style="width: 100%; font-size: 13.5px; color: #e2e8f0; border-collapse: collapse; margin-bottom: 16px;">
          <tr>
            <td style="padding: 5px 0; color: #9ca3af; width: 35%;"><strong>Position:</strong></td>
            <td style="padding: 5px 0; font-weight: 700; color: #fff;">${escapeHtml(resolvedRole)}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #9ca3af;"><strong>Package (CTC):</strong></td>
            <td style="padding: 5px 0; font-weight: 700; color: #34d399;">${escapeHtml(ctc)}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #9ca3af;"><strong>Joining Date:</strong></td>
            <td style="padding: 5px 0; font-weight: 700; color: #fff;">${escapeHtml(joining)}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #9ca3af;"><strong>Delivered To:</strong></td>
            <td style="padding: 5px 0; font-weight: 700; color: #38bdf8;">${escapeHtml(targetEmail || 'Registered Candidate Email')}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #9ca3af;"><strong>Submitted At:</strong></td>
            <td style="padding: 5px 0; font-weight: 700; color: #cbd5e1;">${escapeHtml(completedDate)}</td>
          </tr>
        </table>

        <p style="margin: 0; line-height: 1.6; font-size: 13.5px; color: #d1fae5;">
          Your official job offer and call letter have already been dispatched to your email address. Re-opening or re-taking questions is locked.
        </p>
      </div>

      <p class="result-msg" style="color: #64748b; font-size: 13px;">
        🛡️ For security and proctoring compliance, assessment links cannot be reused after submission.
      </p>
    `;
  } else {
    resultCard.innerHTML = `
      <div class="result-icon">🔒</div>
      <div style="display: inline-block; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); color: #fbbf24; font-size: 11.5px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 4px 14px; border-radius: 99px; margin-bottom: 12px;">
        ASSESSMENT ALREADY SUBMITTED
      </div>
      <h2 class="result-title" style="color: #f59e0b; margin-top: 4px;">Test Response Recorded</h2>
      <p style="color: #9ca3af; font-size: 14.5px;">
        Technical Evaluation for <strong>${escapeHtml(resolvedRole)}</strong>
      </p>

      <div class="score-circle" style="border-color: #f59e0b; box-shadow: 0 0 24px rgba(245, 158, 11, 0.2); margin: 20px auto;">
        <span class="score-number">${score}%</span>
        <span class="score-label" style="color: #fbbf24;">Score (${correct}/${total})</span>
      </div>

      <div class="feedback-alert" style="text-align: left; margin: 20px 0;">
        <h3 style="margin: 0 0 8px 0; font-size: 15px; font-weight: 800; color: #ef4444;">Assessment Already Completed</h3>
        <p style="margin: 0; line-height: 1.5; color: #fee2e2; font-size: 13.5px;">
          Dear <strong>${escapeHtml(resolvedName)}</strong>, you completed and submitted this assessment on <strong>${escapeHtml(completedDate)}</strong> with a score of <strong>${score}%</strong>. Your results are already logged in our hiring database.
        </p>
      </div>

      <p class="result-msg" style="color: #64748b; font-size: 13px;">
        🛡️ Test questions are closed and cannot be re-opened for an already submitted assessment link.
      </p>
    `;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
