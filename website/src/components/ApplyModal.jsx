import React, { useState } from 'react';
import { 
  Mail, 
  Copy, 
  Check, 
  ExternalLink, 
  X, 
  Send, 
  Sparkles, 
  Upload, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { RECRUITER_EMAIL } from '../data/jobs';

export default function ApplyModal({ isOpen, onClose, jobTitle = 'General Application' }) {
  const [activeTab, setActiveTab] = useState('DIRECT'); // 'DIRECT' or 'EMAIL'
  const [copied, setCopied] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    roleApplied: jobTitle,
    resumeText: ''
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);

  if (!isOpen) return null;

  const subject = `Job Application - ${jobTitle}`;
  const emailBody = 
`Dear Hiring Team,

I am writing to submit my application for the "${jobTitle}" position at Finova Technologies.

Please find my resume attached with this email.

Candidate Information:
- Full Name: 
- Phone Number: 
- Current Location: 
- Total Years of Experience: 
- Notice Period / Availability: 

Thank you for reviewing my profile.

Best regards,`;

  const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(RECRUITER_EMAIL)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
  const mailtoUrl = `mailto:${RECRUITER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(RECRUITER_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setSubmissionError('Please enter your full name and valid email address.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const payload = new FormData();
      payload.append('candidateName', formData.name.trim());
      payload.append('candidateEmail', formData.email.trim());
      payload.append('candidatePhone', formData.phone.trim());
      payload.append('roleApplied', formData.roleApplied || jobTitle);
      payload.append('resumeText', formData.resumeText.trim());

      if (resumeFile) {
        payload.append('resumeFile', resumeFile);
      }

      // Target relative /api/evaluate or live production URL
      const apiUrl = window.location.hostname.includes('render.com') || window.location.port === '3000' || window.location.port === '3001'
        ? '/api/evaluate'
        : 'https://hr-smartflow-automation.onrender.com/api/evaluate';

      const res = await fetch(apiUrl, {
        method: 'POST',
        body: payload
      });

      const data = await res.json();

      if (data.success && data.candidate) {
        setSubmissionSuccess(data.candidate);
      } else {
        setSubmissionError(data.error || 'Failed to submit application. Please try emailing directly.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setSubmissionError('Network error connecting to evaluation service. You can send your resume directly to ' + RECRUITER_EMAIL);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden bg-white dark:bg-fintech-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="relative p-5 sm:p-6 pb-4 bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-emerald-500/10 dark:from-blue-600/20 dark:to-emerald-500/20 border-b border-slate-100 dark:border-slate-800/80 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-2 text-xs font-bold tracking-wide uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/50 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Finova Careers Portal
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                Apply for {jobTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Instant AI resume screening &amp; automatic technical assessment
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switch Tabs (Hidden once submitted) */}
          {!submissionSuccess && (
            <div className="flex items-center gap-2 mt-4 p-1 bg-slate-100/90 dark:bg-slate-800/70 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('DIRECT')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'DIRECT'
                    ? 'bg-white dark:bg-fintech-navy-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                🚀 Online Application
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('EMAIL')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'EMAIL'
                    ? 'bg-white dark:bg-fintech-navy-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                ✉️ Apply via Email
              </button>
            </div>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* ================= STATE 1: SUBMISSION SUCCESS SCREEN ================= */}
          {submissionSuccess ? (
            <div className="space-y-4 text-center py-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                  Application Submitted Successfully!
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-sm mx-auto">
                  Thank you, <strong>{submissionSuccess.name}</strong>! Your application for <strong>{submissionSuccess.roleApplied}</strong> has been evaluated.
                </p>
              </div>

              {/* Email Confirmation Notice */}
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-left space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                  <Mail className="w-4 h-4 text-blue-600" /> Assessment Invitation Dispatched
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  We have dispatched your personalized invitation with your 20-MCQ test link directly to: <strong className="text-blue-600 dark:text-blue-400">{submissionSuccess.email}</strong>
                </p>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-blue-100 dark:border-blue-900/60">
                  Candidate ID: <code className="font-mono font-bold text-slate-700 dark:text-slate-300">{submissionSuccess.id}</code>
                </div>
              </div>

              {/* Direct Launch Assessment Button */}
              <div className="pt-2">
                <a
                  href={`/assessment.html?role=${encodeURIComponent(submissionSuccess.roleApplied)}&name=${encodeURIComponent(submissionSuccess.name)}&email=${encodeURIComponent(submissionSuccess.email)}&id=${encodeURIComponent(submissionSuccess.id)}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md uppercase tracking-wider transition-all"
                >
                  🚀 Take 20-MCQ Technical Assessment Now <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ) : activeTab === 'DIRECT' ? (

            /* ================= STATE 2: DIRECT ONLINE FORM ================= */
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {submissionError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>{submissionError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Resume File Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Attach Resume Document (PDF / DOC / DOCX / TXT)
                </label>
                <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 rounded-xl p-3 text-center transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.rtf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {resumeFile ? (
                    <div className="flex items-center justify-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-bold">
                      <FileText className="w-4 h-4" /> {resumeFile.name} ({(resumeFile.size / 1024).toFixed(0)} KB)
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-5 h-5 mx-auto text-slate-400" />
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Click or drag resume file here to attach
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Optional Text Summary / Experience */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Key Skills or Profile Summary (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. React, Node.js, 3 years experience in financial web applications..."
                  value={formData.resumeText}
                  onChange={(e) => setFormData({ ...formData, resumeText: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> AI Screening &amp; Dispatching Test Link...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Submit Application &amp; Receive Assessment
                    </>
                  )}
                </button>
              </div>

            </form>
          ) : (

            /* ================= STATE 3: EMAIL CHOICE ================= */
            <div className="space-y-3.5">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Prefer sending via your email software? Send directly to <strong className="text-blue-600 dark:text-blue-400">{RECRUITER_EMAIL}</strong>:
              </p>

              {/* Option 1: Gmail Web */}
              <a
                href={gmailWebUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-blue-950/40 dark:to-indigo-950/30 border border-blue-200/80 dark:border-blue-800/60 hover:border-blue-500 rounded-2xl transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center flex-shrink-0 font-black text-sm">
                    M
                  </div>
                  <div>
                    <strong className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Open in Gmail Web App
                    </strong>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Launches Gmail in browser with pre-filled subject &amp; body
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </a>

              {/* Option 2: Default Mail Client */}
              <a
                href={mailtoUrl}
                className="group flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 hover:border-slate-400 dark:hover:border-slate-500 rounded-2xl transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      Open Default Email App
                    </strong>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Opens Outlook, Apple Mail, or Windows Mail
                    </span>
                  </div>
                </div>
                <Send className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </a>

              {/* Option 3: Copy Email Address */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                    Recruiter Email Address
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate block">
                    {RECRUITER_EMAIL}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                    copied 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-blue-600 hover:text-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Email
                    </>
                  )}
                </button>
              </div>

              {/* Reminder banner */}
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/40 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Tip:</strong> Simply attach your <strong>PDF/DOC resume</strong> and click send. Our AI workflow automatically screens incoming resumes!
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
