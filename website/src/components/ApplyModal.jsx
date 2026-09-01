import React, { useState } from 'react';
import { Mail, Copy, Check, ExternalLink, X, Send, Sparkles } from 'lucide-react';
import { RECRUITER_EMAIL } from '../data/jobs';

export default function ApplyModal({ isOpen, onClose, jobTitle = 'General Application' }) {
  const [copied, setCopied] = useState(false);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg overflow-hidden bg-white dark:bg-fintech-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Glow Banner */}
        <div className="relative p-6 pb-4 bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-emerald-500/10 dark:from-blue-600/20 dark:to-emerald-500/20 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-2 text-xs font-bold tracking-wide uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/50 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Direct Resume Submission
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Apply for {jobTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Send your resume directly to our HR hiring team
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body & Action Choices */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Choose your preferred method to email your application to <strong className="text-blue-600 dark:text-blue-400">{RECRUITER_EMAIL}</strong>:
          </p>

          {/* Option 1: Gmail Web (Fastest for Browser Users) */}
          <a
            href={gmailWebUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-blue-950/40 dark:to-indigo-950/30 border border-blue-200/80 dark:border-blue-800/60 hover:border-blue-500 rounded-2xl transition-all duration-200 hover:shadow-md hover:scale-[1.01]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center flex-shrink-0 font-black text-base">
                M
              </div>
              <div>
                <strong className="block text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Open in Gmail Web App
                </strong>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Launches Gmail directly in your browser with pre-filled details
                </span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          </a>

          {/* Option 2: Default Mail Client (Outlook, Apple Mail, Windows Mail) */}
          <a
            href={mailtoUrl}
            className="group flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 hover:border-slate-400 dark:hover:border-slate-500 rounded-2xl transition-all duration-200 hover:shadow-md hover:scale-[1.01]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Open Default Email App
                </strong>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Opens Outlook, Apple Mail, or your system email client
                </span>
              </div>
            </div>
            <Send className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          </a>

          {/* Option 3: Copy Email Address */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                Recruiter Email Address
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white truncate block">
                {RECRUITER_EMAIL}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
                copied 
                  ? 'bg-emerald-500 text-white shadow-glow-emerald' 
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

          {/* Simple Steps Reminder */}
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/40 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Next Step:</strong> Simply attach your <strong>PDF/DOC resume</strong> and click send. Our AI workflow will screen your resume and schedule your interview automatically!
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex justify-end">
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
