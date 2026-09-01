/**
 * HR SmartFlow - Complete Frontend Logic
 * Supports Startup Dashboard, Authentic Google Meet Links, Interview Status Toggle & Official Call Letters
 */

let allCandidates = [];
let allJobs = [];
let activeFilter = 'ALL';
let currentSettings = {};

// Pagination State for Candidate Table
let candidateCurrentPage = 1;
let candidatePageSize = 5;

// DOM Elements - Search & Filters
const globalSearchInput = document.getElementById('globalSearchInput');
const roleFilterSelect = document.getElementById('roleFilterSelect');
const expFilterSelect = document.getElementById('expFilterSelect');
const candidatesTableBody = document.getElementById('candidatesTableBody');
const filterTabs = document.querySelectorAll('.c-tab');

// Jobs & Roles Container
const openRolesContainer = document.getElementById('openRolesContainer');
const openAddJobModalBtn = document.getElementById('openAddJobModalBtn');
const sidebarJobsBadge = document.getElementById('sidebarJobsBadge');

// Job Modal Elements
const jobModal = document.getElementById('jobModal');
const closeJobModalBtn = document.getElementById('closeJobModalBtn');
const cancelJobModalBtn = document.getElementById('cancelJobModalBtn');
const jobForm = document.getElementById('jobForm');
const jobModalTitle = document.getElementById('jobModalTitle');
const deleteJobBtn = document.getElementById('deleteJobBtn');

// Offer Modal Elements
const offerModal = document.getElementById('offerModal');
const closeOfferModalBtn = document.getElementById('closeOfferModalBtn');
const cancelOfferModalBtn = document.getElementById('cancelOfferModalBtn');
const offerForm = document.getElementById('offerForm');

// Stat Badges
const countAll = document.getElementById('countAll');
const countSelected = document.getElementById('countSelected');
const countOffers = document.getElementById('countOffers');
const countRejected = document.getElementById('countRejected');
const sidebarCandidateBadge = document.getElementById('sidebarCandidateBadge');
const kpiOffersCount = document.getElementById('kpiOffersCount');

// Detailed Candidate Modal
const candidateModal = document.getElementById('candidateModal');
const closeCandidateModalBtn = document.getElementById('closeCandidateModalBtn');
const modalCloseFooterBtn = document.getElementById('modalCloseFooterBtn');
const modalName = document.getElementById('modalName');
const modalRole = document.getElementById('modalRole');
const modalBodyContent = document.getElementById('modalBodyContent');

// Scanner Modal
const scannerModal = document.getElementById('scannerModal');
const openScannerBtn = document.getElementById('openScannerBtn');
const closeScannerModalBtn = document.getElementById('closeScannerModalBtn');
const cancelScanModalBtn = document.getElementById('cancelScanModalBtn');
const scannerForm = document.getElementById('scannerForm');

// Settings Modal
const settingsModal = document.getElementById('settingsModal');
const headerSettingsBtn = document.getElementById('headerSettingsBtn');
const closeSettingsModalBtn = document.getElementById('closeSettingsModalBtn');
const cancelSettingsModalBtn = document.getElementById('cancelSettingsModalBtn');
const settingsForm = document.getElementById('settingsForm');

// Toolbar & Buttons
const checkInboxBtn = document.getElementById('checkInboxBtn');
const qaGenerateReport = document.getElementById('qaGenerateReport');
const toastContainer = document.getElementById('toastContainer');

// Presets
const presetSelect = document.getElementById('presetSelect');
const presetAi = document.getElementById('presetAi');
const presetReject = document.getElementById('presetReject');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  loadSettings();
  loadJobs();
  loadCandidates();

  // Background auto-refresh every 4s for instant real-time synchronization
  setInterval(() => {
    loadCandidates(false);
  }, 4000);
});

// Setup Listeners
function setupEventListeners() {
  // Sidebar Navigation Links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      const view = link.getAttribute('data-view');
      if (view === 'candidates') {
        document.getElementById('candidatesSection').scrollIntoView({ behavior: 'smooth' });
      } else if (view === 'jobs') {
        document.getElementById('jobsSection').scrollIntoView({ behavior: 'smooth' });
      } else if (view === 'settings') {
        openModal(settingsModal);
      } else if (view === 'interviews') {
        activeFilter = 'SELECTED';
        updateFilterTabsUI();
        renderCandidatesTable();
        document.getElementById('candidatesSection').scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  // Filter Tabs
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeFilter = tab.getAttribute('data-filter');
      candidateCurrentPage = 1;
      renderCandidatesTable();
    });
  });

  // Role Dropdown Filter
  if (roleFilterSelect) {
    roleFilterSelect.addEventListener('change', () => {
      candidateCurrentPage = 1;
      renderCandidatesTable();
    });
  }

  // Experience Dropdown Filter
  if (expFilterSelect) {
    expFilterSelect.addEventListener('change', () => {
      candidateCurrentPage = 1;
      renderCandidatesTable();
    });
  }

  // Global Search
  if (globalSearchInput) {
    globalSearchInput.addEventListener('input', () => {
      candidateCurrentPage = 1;
      renderCandidatesTable();
    });
  }

  // Candidate Table Pagination Listeners
  const pageSizeSelect = document.getElementById('pageSizeSelect');
  if (pageSizeSelect) {
    pageSizeSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      candidatePageSize = val === 'ALL' ? 'ALL' : parseInt(val, 10);
      candidateCurrentPage = 1;
      renderCandidatesTable();
    });
  }

  const prevPageBtn = document.getElementById('prevPageBtn');
  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
      if (candidateCurrentPage > 1) {
        candidateCurrentPage--;
        renderCandidatesTable();
      }
    });
  }

  const nextPageBtn = document.getElementById('nextPageBtn');
  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
      candidateCurrentPage++;
      renderCandidatesTable();
    });
  }

  // Add Job Button
  if (openAddJobModalBtn) {
    openAddJobModalBtn.addEventListener('click', () => openAddJobModal());
  }

  // Scanner Modals
  if (openScannerBtn) openScannerBtn.addEventListener('click', () => openModal(scannerModal));
  if (closeScannerModalBtn) closeScannerModalBtn.addEventListener('click', () => closeModal(scannerModal));
  if (cancelScanModalBtn) cancelScanModalBtn.addEventListener('click', () => closeModal(scannerModal));

  // Job Modal Close
  if (closeJobModalBtn) closeJobModalBtn.addEventListener('click', () => closeModal(jobModal));
  if (cancelJobModalBtn) cancelJobModalBtn.addEventListener('click', () => closeModal(jobModal));

  // Offer Modal Close
  if (closeOfferModalBtn) closeOfferModalBtn.addEventListener('click', () => closeModal(offerModal));
  if (cancelOfferModalBtn) cancelOfferModalBtn.addEventListener('click', () => closeModal(offerModal));

  // Candidate Modal Close
  if (closeCandidateModalBtn) closeCandidateModalBtn.addEventListener('click', () => closeModal(candidateModal));
  if (modalCloseFooterBtn) modalCloseFooterBtn.addEventListener('click', () => closeModal(candidateModal));

  // Settings Modal Close
  if (headerSettingsBtn) headerSettingsBtn.addEventListener('click', () => openModal(settingsModal));
  if (closeSettingsModalBtn) closeSettingsModalBtn.addEventListener('click', () => closeModal(settingsModal));
  if (cancelSettingsModalBtn) cancelSettingsModalBtn.addEventListener('click', () => closeModal(settingsModal));

  // Check Inbox Now
  if (checkInboxBtn) {
    checkInboxBtn.addEventListener('click', async () => {
      const originalText = checkInboxBtn.innerHTML;
      checkInboxBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Checking Inbox...';
      try {
        const res = await fetch('/api/check-inbox', { method: 'POST' });
        const data = await res.json();
        showToast('Gmail inbox synchronized successfully!', 'success');
        loadCandidates();
      } catch (err) {
        showToast('Failed to connect to inbox: ' + err.message, 'error');
      } finally {
        checkInboxBtn.innerHTML = originalText;
      }
    });
  }

  // Export CSV
  if (qaGenerateReport) qaGenerateReport.addEventListener('click', exportCSV);

  // Offer Form Submit (Complete Interview & Send Call Letter)
  if (offerForm) {
    offerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const candId = document.getElementById('offerCandidateId').value;
      const submitBtn = document.getElementById('submitOfferBtn');
      const originalHtml = submitBtn.innerHTML;

      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Dispatching Call Letter via Gmail...';
      submitBtn.disabled = true;

      const payload = {
        ctcPackage: document.getElementById('offerCtc').value,
        joiningDate: document.getElementById('offerJoiningDate').value,
        workMode: document.getElementById('offerWorkMode').value
      };

      try {
        const res = await fetch(`/api/candidates/${candId}/complete-interview`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json();

        if (result.success) {
          showToast(`Official Job Offer & Call Letter dispatched to ${result.candidate.email}!`, 'success');
          closeModal(offerModal);
          loadCandidates();
        } else {
          showToast('Failed to dispatch call letter: ' + (result.error || 'Unknown error'), 'error');
        }
      } catch (err) {
        showToast('Error issuing offer: ' + err.message, 'error');
      } finally {
        submitBtn.innerHTML = originalHtml;
        submitBtn.disabled = false;
      }
    });
  }

  // Job Form Submit (Create or Update)
  if (jobForm) {
    jobForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const jobId = document.getElementById('jobId').value;
      const payload = {
        title: document.getElementById('jobTitle').value,
        department: document.getElementById('jobDept').value,
        experienceRequired: document.getElementById('jobExp').value,
        status: document.getElementById('jobStatus').value,
        totalVacancies: parseInt(document.getElementById('jobTotalVacancies').value) || 1,
        vacanciesLeft: parseInt(document.getElementById('jobVacanciesLeft').value) || 0,
        skills: document.getElementById('jobSkills').value,
        description: document.getElementById('jobDesc').value
      };

      try {
        const url = jobId ? `/api/jobs/${jobId}` : '/api/jobs';
        const method = jobId ? 'PUT' : 'POST';

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json();

        if (result.success) {
          showToast(jobId ? 'Job role updated successfully!' : 'New job opening created!', 'success');
          closeModal(jobModal);
          jobForm.reset();
          loadJobs();
        } else {
          showToast('Failed to save job: ' + (result.error || 'Unknown error'), 'error');
        }
      } catch (err) {
        showToast('Error saving job role: ' + err.message, 'error');
      }
    });
  }

  // Delete Job Role
  if (deleteJobBtn) {
    deleteJobBtn.addEventListener('click', async () => {
      const jobId = document.getElementById('jobId').value;
      if (!jobId) return;
      if (!confirm('Are you sure you want to remove this job role?')) return;

      try {
        const res = await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' });
        const result = await res.json();
        if (result.success) {
          showToast('Job opening removed.', 'info');
          closeModal(jobModal);
          loadJobs();
        }
      } catch (err) {
        showToast('Error deleting job: ' + err.message, 'error');
      }
    });
  }

  // Scanner Form Submit
  if (scannerForm) {
    scannerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('submitScanModalBtn');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Screening with Gemini 3.6 Flash...';
      submitBtn.disabled = true;

      const formData = new FormData(scannerForm);

      try {
        const res = await fetch('/api/evaluate', {
          method: 'POST',
          body: formData
        });
        const result = await res.json();

        if (result.success) {
          showToast(`Screening complete! Result: ${result.candidate.status} (${result.candidate.matchScore}%)`, 'success');
          closeModal(scannerModal);
          scannerForm.reset();
          loadCandidates();
          setTimeout(() => openCandidateDetail(result.candidate), 400);
        } else {
          showToast('Screening error: ' + (result.error || 'Unknown error'), 'error');
        }
      } catch (err) {
        showToast('Error during evaluation: ' + err.message, 'error');
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // Settings Form Submit
  if (settingsForm) {
    settingsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        appPassword: document.getElementById('setAppPassword').value,
        geminiApiKey: document.getElementById('setGeminiKey').value,
        defaultGoogleMeetLink: document.getElementById('setDefaultMeetLink').value
      };

      try {
        const res = await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          showToast('Settings & Google Meet link saved and verified!', 'success');
          closeModal(settingsModal);
          loadSettings();
        }
      } catch (err) {
        showToast('Failed to save settings: ' + err.message, 'error');
      }
    });
  }

  // Presets Auto-Fill
  if (presetSelect) {
    presetSelect.addEventListener('click', () => {
      document.getElementById('scanName').value = 'Tanmay Kulkarni';
      document.getElementById('scanEmail').value = 'tanmay.k@example.com';
      document.getElementById('scanRole').value = 'Lead AI & n8n Workflow Architect';
      document.getElementById('scanPhone').value = '+91 98220 11223';
      document.getElementById('scanText').value = 'Tanmay Kulkarni | M.Tech AI | 7 years experience building n8n workflows, Gemini API architectures, Node.js microservices, Docker, Redis, Postgres.';
    });
  }

  if (presetAi) {
    presetAi.addEventListener('click', () => {
      document.getElementById('scanName').value = 'Rishu';
      document.getElementById('scanEmail').value = 'paliwalrishu2000@gmail.com';
      document.getElementById('scanRole').value = 'AI & Workflow Automation Specialist';
      document.getElementById('scanPhone').value = '+91 98765 43210';
      document.getElementById('scanText').value = 'Rishu | paliwalrishu2000@gmail.com | 4 years experience as AI & Workflow Automation Specialist. Expert in enterprise n8n workflows, Python, LLM APIs, and webhook automations.';
    });
  }

  if (presetReject) {
    presetReject.addEventListener('click', () => {
      document.getElementById('scanName').value = 'Amit Kumar Patel';
      document.getElementById('scanEmail').value = 'amit.patel99@example.com';
      document.getElementById('scanRole').value = 'DevOps & Cloud Engineer';
      document.getElementById('scanPhone').value = '+91 91234 56780';
      document.getElementById('scanText').value = 'Amit Patel | 6 months experience in office inventory management. High School graduate.';
    });
  }
}

// Load Jobs and Vacancies from Server
async function loadJobs() {
  try {
    const res = await fetch('/api/jobs');
    const data = await res.json();
    if (data.success) {
      allJobs = data.jobs || [];
      if (sidebarJobsBadge) sidebarJobsBadge.textContent = allJobs.length;
      renderJobsList();
      populateRoleDropdown();
    }
  } catch (err) {
    console.error('Error fetching jobs:', err);
  }
}

// Render Jobs Card on Dashboard
function renderJobsList() {
  if (!openRolesContainer) return;

  if (allJobs.length === 0) {
    openRolesContainer.innerHTML = `
      <div style="text-align:center; padding:1.5rem; color:var(--text-muted);">
        No open vacancies defined yet. Click <strong>"+ Add New Job Role"</strong> to create your first vacancy!
      </div>
    `;
    return;
  }

  openRolesContainer.innerHTML = allJobs.map(j => {
    const vacanciesLeft = j.vacanciesLeft !== undefined ? j.vacanciesLeft : j.totalVacancies;
    const isFilled = vacanciesLeft === 0;
    const badgeClass = isFilled ? 'red' : (j.status === 'ACTIVE' ? 'green' : 'blue');
    const badgeText = isFilled ? '0 Left (Filled)' : `${vacanciesLeft} Vacanc${vacanciesLeft > 1 ? 'ies' : 'y'} Left (${j.totalVacancies} Total)`;

    return `
      <div class="role-item">
        <div class="role-info-group">
          <div class="role-icon-bullet"><i class="fa-solid fa-briefcase"></i></div>
          <div class="role-title-sub">
            <div style="display:flex; align-items:center; gap:8px;">
              <strong>${escapeHtml(j.title)}</strong>
              <span style="font-size:0.7rem; background:#f1f5f9; color:#475569; padding:2px 6px; border-radius:4px; font-weight:700;">${escapeHtml(j.experienceRequired || 'All Yrs')}</span>
            </div>
            <span>${j.department || 'Startup Team'} • ${j.applicantCount || 0} Applicants (${j.shortlistedCount || 0} Shortlisted)</span>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="badge-pill ${badgeClass}">${badgeText}</span>
          <button class="btn-secondary-light" style="padding:0.25rem 0.65rem; font-size:0.75rem;" onclick="openEditJobModal('${j.id}')" title="Edit Vacancies or Experience">
            <i class="fa-solid fa-pen-to-square"></i> Edit
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Populate Role Dropdown Filter in Candidate Section
function populateRoleDropdown() {
  if (!roleFilterSelect) return;

  const currentVal = roleFilterSelect.value;
  const roleSet = new Set();

  // Add from company jobs
  allJobs.forEach(j => {
    if (j.title) roleSet.add(j.title.trim());
  });

  // Add from existing candidate records
  allCandidates.forEach(c => {
    if (c.roleApplied) roleSet.add(c.roleApplied.trim());
  });

  let html = `<option value="ALL">All Job Roles (All Vacancies)</option>`;
  Array.from(roleSet).sort().forEach(r => {
    const isSelected = r === currentVal ? 'selected' : '';
    html += `<option value="${escapeHtml(r)}" ${isSelected}>${escapeHtml(r)}</option>`;
  });

  roleFilterSelect.innerHTML = html;
}

// Open Add Job Modal
window.openAddJobModal = function() {
  jobForm.reset();
  document.getElementById('jobId').value = '';
  jobModalTitle.innerHTML = '<i class="fa-solid fa-plus" style="color:var(--primary-purple);"></i> Add New Job Role &amp; Vacancy';
  if (deleteJobBtn) deleteJobBtn.style.display = 'none';
  openModal(jobModal);
};

// Open Edit Job Modal
window.openEditJobModal = function(jobId) {
  const job = allJobs.find(j => j.id === jobId);
  if (!job) return;

  document.getElementById('jobId').value = job.id;
  document.getElementById('jobTitle').value = job.title || '';
  document.getElementById('jobDept').value = job.department || '';
  document.getElementById('jobExp').value = job.experienceRequired || 'Fresher (0-1 Yrs)';
  document.getElementById('jobStatus').value = job.status || 'ACTIVE';
  document.getElementById('jobTotalVacancies').value = job.totalVacancies || 1;
  document.getElementById('jobVacanciesLeft').value = job.vacanciesLeft !== undefined ? job.vacanciesLeft : job.totalVacancies;
  document.getElementById('jobSkills').value = Array.isArray(job.skills) ? job.skills.join(', ') : (job.skills || '');
  document.getElementById('jobDesc').value = job.description || '';

  jobModalTitle.innerHTML = `<i class="fa-solid fa-pen-to-square" style="color:var(--primary-purple);"></i> Edit Role: ${escapeHtml(job.title)}`;
  if (deleteJobBtn) deleteJobBtn.style.display = 'block';

  openModal(jobModal);
};

// Open Offer / Call Letter Modal
window.openOfferModal = function(candId) {
  const c = allCandidates.find(item => item.id === candId);
  if (!c) return;

  document.getElementById('offerCandidateId').value = c.id;
  document.getElementById('offerCandidateName').textContent = c.name;
  document.getElementById('offerCandidateEmail').textContent = c.email;
  document.getElementById('offerCandidateRole').textContent = c.roleApplied;

  const defaultCtc = c.roleApplied.includes('Architect') || c.roleApplied.includes('Lead')
    ? '₹20,00,000 per annum (Full-Time)'
    : (c.roleApplied.includes('Specialist') || c.roleApplied.includes('Senior')
        ? '₹16,00,000 per annum (Full-Time)'
        : '₹9,50,000 per annum (Full-Time)');

  document.getElementById('offerCtc').value = defaultCtc;
  document.getElementById('offerJoiningDate').value = 'Monday, 14 September 2026';

  openModal(offerModal);
};

// Toggle Interview Status (Scheduled <-> Completed)
window.toggleInterviewStatus = async function(candId) {
  try {
    const res = await fetch(`/api/candidates/${candId}/toggle-interview`, { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      showToast(`Interview status updated to: ${data.interviewStatus}`, 'info');
      loadCandidates();
    }
  } catch (err) {
    showToast('Failed to update interview status: ' + err.message, 'error');
  }
};

function updateFilterTabsUI() {
  filterTabs.forEach(t => {
    if (t.getAttribute('data-filter') === activeFilter) {
      t.classList.add('active');
    } else {
      t.classList.remove('active');
    }
  });
}

// Helper: Ensure unique candidates by ID
function deduplicateCandidateArray(list) {
  if (!Array.isArray(list)) return [];
  const seenIds = new Set();
  const uniqueList = [];
  for (const c of list) {
    const key = (c.id || c.email + '_' + (c.roleApplied || '')).toLowerCase().trim();
    if (!seenIds.has(key)) {
      seenIds.add(key);
      uniqueList.push(c);
    }
  }
  return uniqueList;
}

// Load Candidates from Server
async function loadCandidates(showLoadingToast = false) {
  try {
    const res = await fetch('/api/candidates');
    const data = await res.json();
    if (data.success) {
      allCandidates = deduplicateCandidateArray(data.candidates || []);
      updateKPIsAndCounts();
      populateRoleDropdown();
      renderCandidatesTable();
    }
  } catch (err) {
    console.error('Error fetching candidates:', err);
  }
}

// Load Settings from Server
async function loadSettings() {
  try {
    const res = await fetch('/api/settings');
    const data = await res.json();
    if (data.success) {
      currentSettings = data.settings || {};
      if (document.getElementById('setAppPassword')) {
        document.getElementById('setAppPassword').value = currentSettings.appPassword || '';
      }
      if (document.getElementById('setGeminiKey')) {
        document.getElementById('setGeminiKey').value = currentSettings.geminiApiKey || '';
      }
      if (document.getElementById('setDefaultMeetLink')) {
        document.getElementById('setDefaultMeetLink').value = currentSettings.defaultGoogleMeetLink || 'https://meet.google.com/qoy-livx-rku';
      }
    }
  } catch (err) {
    console.error('Error loading settings:', err);
  }
}

// Update Top KPIs and Startup Funnel dynamically from database
function updateKPIsAndCounts() {
  const total = allCandidates.length;
  const selected = allCandidates.filter(c => c.status === 'SELECTED').length;
  const rejected = allCandidates.filter(c => c.status === 'REJECTED').length;
  const offers = allCandidates.filter(c => c.offerStatus === 'OFFER_EXTENDED').length;
  const avgScore = total > 0 ? Math.round(allCandidates.reduce((acc, c) => acc + (c.matchScore || 0), 0) / total) : 0;

  const selectedPercent = total > 0 ? Math.round((selected / total) * 100) : 0;
  const offersPercent = total > 0 ? Math.round((offers / total) * 100) : 0;

  if (countAll) countAll.textContent = total;
  if (countSelected) countSelected.textContent = selected;
  if (countOffers) countOffers.textContent = offers;
  if (countRejected) countRejected.textContent = rejected;
  if (sidebarCandidateBadge) sidebarCandidateBadge.textContent = total;

  const kpiTotal = document.getElementById('kpiTotalCandidates');
  const kpiSel = document.getElementById('kpiSelectedCount');
  const kpiRej = document.getElementById('kpiRejectedCount');
  const kpiOff = document.getElementById('kpiOffersCount');

  if (kpiTotal) kpiTotal.textContent = total;
  if (kpiSel) kpiSel.textContent = selected;
  if (kpiRej) kpiRej.textContent = rejected;
  if (kpiOff) kpiOff.textContent = offers;

  // Update Funnel
  const funnelTotal = document.getElementById('funnelTotal');
  const funnelEvaluated = document.getElementById('funnelEvaluated');
  const funnelSelected = document.getElementById('funnelSelected');
  const funnelSelectedBar = document.getElementById('funnelSelectedBar');
  const funnelOffers = document.getElementById('funnelOffers');
  const funnelOffersBar = document.getElementById('funnelOffersBar');

  if (funnelTotal) funnelTotal.textContent = `${total} Candidates (100%)`;
  if (funnelEvaluated) funnelEvaluated.textContent = `${total} Candidates (100%)`;
  if (funnelSelected) funnelSelected.textContent = `${selected} Candidates (${selectedPercent}%)`;
  if (funnelSelectedBar) funnelSelectedBar.style.width = `${Math.max(10, selectedPercent)}%`;
  if (funnelOffers) funnelOffers.textContent = `${offers} Official Offers (${offersPercent}%)`;
  if (funnelOffersBar) funnelOffersBar.style.width = `${Math.max(10, offersPercent)}%`;
}

// Render Table of Candidates with Interview Status & Call Letter Action
function renderCandidatesTable() {
  if (!candidatesTableBody) return;

  const searchQuery = (globalSearchInput ? globalSearchInput.value : '').toLowerCase().trim();
  const selectedRole = roleFilterSelect ? roleFilterSelect.value : 'ALL';
  const selectedExp = expFilterSelect ? expFilterSelect.value : 'ALL';

  let filtered = allCandidates.filter(c => {
    // 1. Status Filter
    let matchStatus = true;
    if (activeFilter === 'SELECTED') matchStatus = c.status === 'SELECTED';
    else if (activeFilter === 'OFFER_EXTENDED') matchStatus = c.offerStatus === 'OFFER_EXTENDED';
    else if (activeFilter === 'REJECTED') matchStatus = c.status === 'REJECTED';

    // 2. Role Filter Dropdown
    const candidateRole = (c.roleApplied || '').toLowerCase();
    const matchRole = selectedRole === 'ALL' ||
      candidateRole.includes(selectedRole.toLowerCase()) ||
      selectedRole.toLowerCase().includes(candidateRole);

    // 3. Experience Filter Dropdown
    const exp = c.experienceYears !== undefined ? c.experienceYears : 1;
    let matchExp = true;
    if (selectedExp === 'FRESHER') {
      matchExp = exp <= 1 || (c.roleApplied || '').toLowerCase().includes('fresher');
    } else if (selectedExp === 'MID') {
      matchExp = exp > 1 && exp <= 4;
    } else if (selectedExp === 'SENIOR') {
      matchExp = exp >= 5;
    }

    // 4. Text Search Query
    const matchSearch = !searchQuery ||
      (c.name || '').toLowerCase().includes(searchQuery) ||
      (c.email || '').toLowerCase().includes(searchQuery) ||
      (c.roleApplied || '').toLowerCase().includes(searchQuery) ||
      (c.skills || []).some(s => s.toLowerCase().includes(searchQuery));

    return matchStatus && matchRole && matchExp && matchSearch;
  });

  filtered = deduplicateCandidateArray(filtered);

  const totalItems = filtered.length;
  const totalPages = candidatePageSize === 'ALL' ? 1 : Math.max(1, Math.ceil(totalItems / candidatePageSize));

  if (candidateCurrentPage > totalPages) {
    candidateCurrentPage = totalPages;
  }
  if (candidateCurrentPage < 1) {
    candidateCurrentPage = 1;
  }

  const startIndex = candidatePageSize === 'ALL' ? 0 : (candidateCurrentPage - 1) * candidatePageSize;
  const endIndex = candidatePageSize === 'ALL' ? totalItems : Math.min(startIndex + candidatePageSize, totalItems);
  const displayedCandidates = candidatePageSize === 'ALL' ? filtered : filtered.slice(startIndex, endIndex);

  // Update Pagination Footer UI
  const paginationStart = document.getElementById('paginationStart');
  const paginationEnd = document.getElementById('paginationEnd');
  const paginationTotal = document.getElementById('paginationTotal');
  const prevPageBtn = document.getElementById('prevPageBtn');
  const nextPageBtn = document.getElementById('nextPageBtn');
  const pagNumbers = document.getElementById('pagNumbers');

  if (paginationStart) paginationStart.textContent = totalItems === 0 ? 0 : startIndex + 1;
  if (paginationEnd) paginationEnd.textContent = endIndex;
  if (paginationTotal) paginationTotal.textContent = totalItems;
  if (prevPageBtn) prevPageBtn.disabled = candidateCurrentPage <= 1;
  if (nextPageBtn) nextPageBtn.disabled = candidateCurrentPage >= totalPages || totalItems === 0;

  // Render Page Number Buttons
  if (pagNumbers) {
    if (candidatePageSize === 'ALL' || totalPages <= 1) {
      pagNumbers.innerHTML = `<button class="pag-num-btn active">1</button>`;
    } else {
      let pageBtnsHtml = '';
      for (let p = 1; p <= totalPages; p++) {
        if (p === 1 || p === totalPages || (p >= candidateCurrentPage - 1 && p <= candidateCurrentPage + 1)) {
          const isActive = p === candidateCurrentPage ? 'active' : '';
          pageBtnsHtml += `<button class="pag-num-btn ${isActive}" onclick="goToCandidatePage(${p})">${p}</button>`;
        } else if (p === candidateCurrentPage - 2 || p === candidateCurrentPage + 2) {
          pageBtnsHtml += `<span class="pag-ellipsis">...</span>`;
        }
      }
      pagNumbers.innerHTML = pageBtnsHtml;
    }
  }

  if (filtered.length === 0) {
    candidatesTableBody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding: 2.5rem 1rem; color: var(--text-muted);">
          <i class="fa-solid fa-folder-open" style="font-size:2rem; margin-bottom:0.5rem; color:#cbd5e1; display:block;"></i>
          No candidate applications found for the selected Job Role / Experience filter.
        </td>
      </tr>
    `;
    return;
  }

  candidatesTableBody.innerHTML = displayedCandidates.map(c => {
    const isSelected = c.status === 'SELECTED';
    const isOfferExtended = c.offerStatus === 'OFFER_EXTENDED';
    const isInterviewDone = c.interviewStatus === 'COMPLETED';
    const score = c.matchScore || 0;
    const scoreClass = score >= 60 ? 'high' : 'low';
    const initials = (c.name || 'CN').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    // Authentic Google Meet link display
    const meetUrl = c.interviewSchedule?.meetLink || 'https://meet.google.com/qoy-livx-rku';
    const meetDisplay = isSelected
      ? `<a href="${meetUrl}" target="_blank" style="color:var(--primary-purple); font-weight:700; text-decoration:none; font-size:0.8rem; display:inline-flex; align-items:center; gap:4px;" title="Open Authentic Google Meet Call"><i class="fa-solid fa-video"></i> ${meetUrl.replace('https://', '')}</a>`
      : `<span style="color:#94a3b8; font-size:0.8rem;">N/A</span>`;

    // Interview Status Toggle & Badge
    let interviewStatusHtml = '';
    if (isOfferExtended) {
      interviewStatusHtml = `<span class="badge-pill green" style="background:#ecfdf5; color:#059669; border:1px solid #a7f3d0;"><i class="fa-solid fa-award"></i> Offer Extended</span>`;
    } else if (isInterviewDone) {
      interviewStatusHtml = `
        <button class="btn-secondary-light" style="padding:0.25rem 0.65rem; font-size:0.75rem; color:#059669; border-color:#86efac;" onclick="toggleInterviewStatus('${c.id}')" title="Click to toggle status">
          <i class="fa-solid fa-circle-check"></i> Interview Done
        </button>
      `;
    } else if (isSelected) {
      interviewStatusHtml = `
        <button class="btn-secondary-light" style="padding:0.25rem 0.65rem; font-size:0.75rem; color:#6366f1; border-color:#c7d2fe;" onclick="toggleInterviewStatus('${c.id}')" title="Click to mark interview as completed">
          <i class="fa-solid fa-calendar-check"></i> Scheduled (Click when Done)
        </button>
      `;
    } else {
      interviewStatusHtml = `<span style="color:#94a3b8; font-size:0.78rem;">Not Shortlisted</span>`;
    }

    // Call Letter Action Button
    let callLetterActionHtml = '';
    if (isOfferExtended) {
      callLetterActionHtml = `
        <button class="btn-secondary-light" style="padding:0.3rem 0.65rem; font-size:0.75rem; background:#ecfdf5; color:#059669; border-color:#a7f3d0;" onclick="openOfferModal('${c.id}')" title="Re-send or view Call Letter">
          <i class="fa-solid fa-envelope-circle-check"></i> Call Letter Sent
        </button>
      `;
    } else if (isSelected) {
      callLetterActionHtml = `
        <button class="btn-primary-purple" style="padding:0.3rem 0.65rem; font-size:0.75rem;" onclick="openOfferModal('${c.id}')" title="Send Official Job Offer & Call Letter Email">
          <i class="fa-solid fa-award"></i> Issue Call Letter
        </button>
      `;
    } else {
      callLetterActionHtml = `<span style="color:#94a3b8; font-size:0.78rem;">N/A</span>`;
    }

    const expDisplay = c.experienceYears !== undefined
      ? `${c.experienceYears} Yr${c.experienceYears === 1 ? '' : 's'}`
      : '1 Yr';

    const resumeLinkHtml = c.attachmentInfo?.fileName
      ? `<div style="font-size:0.73rem; margin-top:3px;">
          <a href="${c.attachmentInfo.urlPath}" target="_blank" style="color:#0284c7; text-decoration:none; font-weight:600; display:inline-flex; align-items:center; gap:3px;" title="View Attached Resume">
            <i class="fa-solid fa-paperclip"></i> ${escapeHtml(c.attachmentInfo.fileName.slice(0, 24))}
          </a>
        </div>`
      : '';

    return `
      <tr>
        <td>
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <div class="candidate-mini-avatar" style="background:${isSelected ? '#dcfce7' : '#fee2e2'}; color:${isSelected ? '#15803d' : '#b91c1c'};">
              ${initials}
            </div>
            <div>
              <strong style="color:var(--text-main); display:block; font-size:0.88rem;">${escapeHtml(c.name)}</strong>
              <span style="font-size:0.75rem; color:var(--text-muted);">${escapeHtml(c.email)}</span>
              ${resumeLinkHtml}
            </div>
          </div>
        </td>
        <td>
          <span style="font-weight:700; color:var(--text-main); font-size:0.85rem;">${escapeHtml(c.roleApplied || 'General')}</span>
        </td>
        <td>
          <span style="font-size:0.8rem; background:#f1f5f9; color:#334155; padding:3px 8px; border-radius:6px; font-weight:600;">${expDisplay}</span>
        </td>
        <td>
          <div class="score-progress-cell">
            <strong style="font-size:0.88rem; color:${score >= 60 ? '#10b981' : '#ef4444'};">${score}%</strong>
            <div class="score-bar-mini">
              <div class="score-fill-mini ${scoreClass}" style="width: ${score}%;"></div>
            </div>
          </div>
        </td>
        <td>
          <span class="status-pill-badge ${isSelected ? 'selected' : 'rejected'}">
            <i class="fa-solid ${isSelected ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
            ${c.status}
          </span>
        </td>
        <td>
          ${interviewStatusHtml}
        </td>
        <td>
          ${meetDisplay}
        </td>
        <td>
          <div style="display:flex; align-items:center; gap:0.4rem;">
            ${callLetterActionHtml}
            <button class="btn-secondary-light" style="padding:0.3rem 0.55rem; font-size:0.75rem;" onclick="viewCandidateDetails('${c.id}')" title="View Full AI Evaluation & Resume Details">
              <i class="fa-solid fa-eye"></i>
            </button>
            <button class="btn-secondary-light" style="padding:0.3rem 0.5rem; font-size:0.75rem; color:#ef4444;" onclick="deleteCandidate('${c.id}')" title="Delete Candidate">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Global page jump handler
window.goToCandidatePage = function(page) {
  candidateCurrentPage = page;
  renderCandidatesTable();
};

// View Detailed Candidate
window.viewCandidateDetails = function(candId) {
  const candidate = allCandidates.find(c => c.id === candId);
  if (!candidate) return;
  openCandidateDetail(candidate);
};

function openCandidateDetail(candidate) {
  modalName.textContent = candidate.name;
  modalRole.textContent = `${candidate.roleApplied} • Match Score: ${candidate.matchScore}%`;

  const isSelected = candidate.status === 'SELECTED';
  const isOffer = candidate.offerStatus === 'OFFER_EXTENDED';

  let offerBoxHtml = '';
  if (isOffer && candidate.callLetterDetails) {
    offerBoxHtml = `
      <div style="background:#ecfdf5; border:1px solid #a7f3d0; border-radius:12px; padding:16px; margin:16px 0;">
        <h4 style="color:#065f46; margin-bottom:8px; display:flex; align-items:center; gap:6px;">
          <i class="fa-solid fa-award"></i> Official Job Offer &amp; Call Letter Details
        </h4>
        <p style="margin:4px 0; font-size:0.86rem;"><strong>Ref ID:</strong> ${candidate.offerRefId || 'HR-OFFER-2026'}</p>
        <p style="margin:4px 0; font-size:0.86rem;"><strong>Compensation (CTC):</strong> ${candidate.callLetterDetails.ctcPackage || 'Full-Time'}</p>
        <p style="margin:4px 0; font-size:0.86rem;"><strong>Official Joining Date:</strong> ${candidate.callLetterDetails.joiningDate}</p>
        <p style="margin:4px 0; font-size:0.86rem;"><strong>Status:</strong> <span style="color:#059669; font-weight:700;">Delivered to ${candidate.email}</span></p>
      </div>
    `;
  }

  let interviewBoxHtml = '';
  if (isSelected && candidate.interviewSchedule) {
    const meetUrl = candidate.interviewSchedule.meetLink || 'https://meet.google.com/qoy-livx-rku';
    interviewBoxHtml = `
      <div style="background:#f0fdfa; border:1px solid #99f6e4; border-radius:12px; padding:16px; margin:16px 0;">
        <h4 style="color:#0f766e; margin-bottom:8px; display:flex; align-items:center; gap:6px;">
          <i class="fa-solid fa-video"></i> Authentic Google Meet Video Interview
        </h4>
        <p style="margin:4px 0; font-size:0.86rem;"><strong>Date:</strong> ${candidate.interviewSchedule.date}</p>
        <p style="margin:4px 0; font-size:0.86rem;"><strong>Time:</strong> ${candidate.interviewSchedule.time} (${candidate.interviewSchedule.duration || '45 min'})</p>
        <p style="margin:4px 0; font-size:0.86rem;"><strong>Interviewer:</strong> ${candidate.interviewSchedule.interviewer || 'Vageesha Sharma (Founder & Hiring Lead)'}</p>
        <p style="margin:8px 0 0 0; font-size:0.86rem;">
          <a href="${meetUrl}" target="_blank" class="btn-primary-purple" style="display:inline-flex; padding:6px 14px; font-size:0.82rem; text-decoration:none;">
            <i class="fa-solid fa-video"></i> Open Authentic Google Meet: ${meetUrl}
          </a>
        </p>
      </div>
    `;
  }

  const resumeDocHtml = candidate.attachmentInfo?.fileName
    ? `<div style="background:#f0f9ff; border:1px solid #bae6fd; border-radius:8px; padding:12px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <span style="font-size:0.75rem; color:#0369a1; font-weight:700;">ATTACHED RESUME DOCUMENT</span>
          <p style="margin:2px 0 0 0; font-size:0.88rem; font-weight:600; color:#0c4a6e;">
            <i class="fa-solid fa-file-pdf" style="color:#e11d48;"></i> ${escapeHtml(candidate.attachmentInfo.fileName)}
          </p>
        </div>
        <a href="${candidate.attachmentInfo.urlPath}" target="_blank" class="btn-secondary-light" style="font-size:0.75rem; padding:4px 12px; color:#0284c7; border-color:#7dd3fc; text-decoration:none; font-weight:600;">
          <i class="fa-solid fa-arrow-down-to-bracket"></i> Download / View Resume
        </a>
      </div>`
    : '';

  const missingSkillsHtml = (candidate.missingSkills && candidate.missingSkills.length > 0)
    ? `<div style="margin-bottom:16px; background:#fff1f2; border:1px solid #fecdd3; border-radius:8px; padding:12px;">
        <span style="font-size:0.75rem; color:#be123c; font-weight:700; display:flex; align-items:center; gap:5px;">
          <i class="fa-solid fa-triangle-exclamation"></i> CRITICAL MISSING SKILLS &amp; RESUME GAPS
        </span>
        <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:8px;">
          ${candidate.missingSkills.map(s => `<span style="background:#ffe4e6; color:#9f1239; border:1px solid #fda4af; padding:3px 10px; border-radius:99px; font-size:0.78rem; font-weight:700;">❌ ${escapeHtml(s)}</span>`).join('')}
        </div>
      </div>`
    : '';

  const strengthsHtml = (candidate.strengths && candidate.strengths.length > 0)
    ? `<div style="margin-bottom:16px;">
        <span style="font-size:0.75rem; color:#15803d; font-weight:700;">KEY STRENGTHS</span>
        <ul style="margin:6px 0 0 16px; font-size:0.86rem; color:#334155; line-height:1.4;">
          ${candidate.strengths.map(st => `<li>${escapeHtml(st)}</li>`).join('')}
        </ul>
      </div>`
    : '';

  const weaknessesHtml = (candidate.weaknesses && candidate.weaknesses.length > 0)
    ? `<div style="margin-bottom:16px;">
        <span style="font-size:0.75rem; color:#b91c1c; font-weight:700;">AREAS FOR IMPROVEMENT / GAPS</span>
        <ul style="margin:6px 0 0 16px; font-size:0.86rem; color:#334155; line-height:1.4;">
          ${candidate.weaknesses.map(w => `<li>${escapeHtml(w)}</li>`).join('')}
        </ul>
      </div>`
    : '';

  modalBodyContent.innerHTML = `
    ${resumeDocHtml}

    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:16px;">
      <div style="background:#f8fafc; padding:12px; border-radius:8px;">
        <span style="font-size:0.75rem; color:#64748b; font-weight:700;">CONTACT</span>
        <p style="margin:4px 0; font-size:0.88rem;"><strong>Email:</strong> ${escapeHtml(candidate.email)}</p>
        <p style="margin:4px 0; font-size:0.88rem;"><strong>Phone:</strong> ${escapeHtml(candidate.phone || 'N/A')}</p>
      </div>
      <div style="background:#f8fafc; padding:12px; border-radius:8px;">
        <span style="font-size:0.75rem; color:#64748b; font-weight:700;">EXPERIENCE & EDUCATION</span>
        <p style="margin:4px 0; font-size:0.88rem;"><strong>Experience:</strong> ${candidate.experienceYears || 0} Years</p>
        <p style="margin:4px 0; font-size:0.88rem;"><strong>Education:</strong> ${escapeHtml(candidate.education || 'Bachelor Degree')}</p>
      </div>
    </div>

    <div style="margin-bottom:16px;">
      <span style="font-size:0.75rem; color:#64748b; font-weight:700;">MATCHED CANDIDATE SKILLS</span>
      <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:6px;">
        ${(candidate.skills || []).map(s => `<span style="background:#e0e7ff; color:#4338ca; padding:3px 10px; border-radius:99px; font-size:0.78rem; font-weight:700;"><i class="fa-solid fa-check"></i> ${escapeHtml(s)}</span>`).join('')}
      </div>
    </div>

    ${missingSkillsHtml}

    <div style="margin-bottom:16px;">
      <span style="font-size:0.75rem; color:#64748b; font-weight:700;">AI EVALUATION &amp; QUALIFICATION SUMMARY</span>
      <p style="margin-top:6px; font-size:0.88rem; line-height:1.5; color:#334155; background:#f8fafc; padding:12px; border-radius:8px;">
        ${escapeHtml(candidate.summary || 'Profile evaluated.')}
      </p>
    </div>

    ${strengthsHtml}
    ${weaknessesHtml}

    ${offerBoxHtml}
    ${interviewBoxHtml}

    <div style="margin-top:16px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <span style="font-size:0.75rem; color:#64748b; font-weight:700;">DISPATCHED AUTO-REPLY EMAIL PREVIEW</span>
        <span style="font-size:0.75rem; font-weight:700; color:${candidate.emailStatus === 'SENT' ? '#059669' : '#d97706'};">
          <i class="fa-solid ${candidate.emailStatus === 'SENT' ? 'fa-circle-check' : 'fa-clock'}"></i> ${candidate.emailStatus === 'SENT' ? 'Delivered via Gmail SMTP' : 'Pending'}
        </span>
      </div>
      <div style="border:1px solid #e2e8f0; border-radius:8px; padding:14px; background:#ffffff; font-size:0.86rem; max-height:240px; overflow-y:auto;">
        ${candidate.emailHtmlBody || '<p>Email delivered to candidate.</p>'}
      </div>
    </div>
  `;

  openModal(candidateModal);
}

// Delete Candidate
window.deleteCandidate = async function(candId) {
  if (!confirm('Are you sure you want to remove this candidate record?')) return;
  try {
    const res = await fetch(`/api/candidates/${candId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      showToast('Candidate deleted successfully.', 'info');
      loadCandidates();
    }
  } catch (err) {
    showToast('Failed to delete candidate: ' + err.message, 'error');
  }
};

// Export to CSV
function exportCSV() {
  window.location.href = '/api/export/csv';
  showToast('Exporting candidate dataset to CSV...', 'success');
}

// Modal Helpers
function openModal(modalEl) {
  if (modalEl) modalEl.classList.add('show');
}

function closeModal(modalEl) {
  if (modalEl) modalEl.classList.remove('show');
}

// Toast Notifications
function showToast(message, type = 'info') {
  if (!toastContainer) return;
  const toast = document.createElement('div');
  toast.className = 'toast-item';
  
  let icon = '<i class="fa-solid fa-info-circle" style="color:var(--primary-purple);"></i>';
  if (type === 'success') icon = '<i class="fa-solid fa-circle-check" style="color:#10b981;"></i>';
  if (type === 'error') icon = '<i class="fa-solid fa-circle-exclamation" style="color:#ef4444;"></i>';

  toast.innerHTML = `
    ${icon}
    <span style="color:var(--text-main); font-weight:600;">${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
