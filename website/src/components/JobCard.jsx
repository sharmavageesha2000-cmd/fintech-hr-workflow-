import React, { useState } from 'react';
import { Briefcase, Clock, MapPin, Sparkles, ArrowRight, UserCheck } from 'lucide-react';
import ApplyModal from './ApplyModal';
import { RECRUITER_EMAIL } from '../data/jobs';

export default function JobCard({ job }) {
  const [modalOpen, setModalOpen] = useState(false);
  const vacanciesLeft = job.vacanciesLeft !== undefined ? job.vacanciesLeft : job.totalVacancies;

  return (
    <>
      <div className="group relative p-5 sm:p-6 rounded-2xl bg-white/90 dark:bg-fintech-navy-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 spotlight-card shimmer-hover shadow-card-light dark:shadow-card-dark hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          
          {/* Main Info */}
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {job.title}
              </h3>
              <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/50">
                {job.department || 'Technology'}
              </span>
              <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50 flex items-center gap-1">
                <UserCheck className="w-3 h-3" /> {vacanciesLeft} Open
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-500" /> {job.experienceRequired || '1–3 Years'}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" /> {job.location || 'Remote / Hybrid (India)'}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-cyan-500" /> {job.employmentType || 'Full-Time'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {job.description}
            </p>

            {job.skills && job.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {job.skills.map((skill, idx) => (
                  <span 
                    key={idx} 
                    className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Button & Email Callout */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between lg:justify-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800 flex-shrink-0">
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 uppercase tracking-wider w-full sm:w-auto"
            >
              Apply Now <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              Direct to: <strong className="text-slate-700 dark:text-slate-300">{RECRUITER_EMAIL}</strong>
            </span>
          </div>

        </div>
      </div>

      {/* Application Choice Modal */}
      <ApplyModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        jobTitle={job.title}
      />
    </>
  );
}
