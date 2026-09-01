import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Sparkles, 
  Mail, 
  Send, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  UserCheck,
  Building
} from 'lucide-react';
import JobCard from '../components/JobCard';
import ApplyModal from '../components/ApplyModal';
import { defaultJobsData, RECRUITER_EMAIL } from '../data/jobs';

export default function Careers() {
  const [jobs, setJobs] = useState(defaultJobsData);
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [generalModalOpen, setGeneralModalOpen] = useState(false);

  // Dynamic synchronization with live HR Dashboard vacancies
  useEffect(() => {
    async function syncJobs() {
      try {
        const apiUrl = window.location.hostname.includes('render.com') 
          ? '/api/jobs' 
          : 'https://hr-smartflow-automation.onrender.com/api/jobs';

        const res = await fetch(apiUrl);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.jobs) && data.jobs.length > 0) {
            setJobs(data.jobs);
          }
        }
      } catch (e) {
        console.log('Using default jobs data');
      }
    }

    syncJobs();
  }, []);

  const departments = ['ALL', ...new Set(jobs.map(j => j.department || 'Technology'))];

  const filteredJobs = jobs.filter(j => {
    if (selectedDept === 'ALL') return true;
    return j.department === selectedDept;
  });

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      
      {/* 1. Header Hero */}
      <section className="pt-6 sm:pt-10 pb-4 bg-radial-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <Sparkles className="w-3 h-3" /> Career Opportunities
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Build the future of <br className="hidden sm:inline" />
            <span className="text-gradient">finance with us.</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            We are looking for talented people who want to build innovative technology for the future of digital finance.
          </p>

          {/* Banner Card */}
          <div className="max-w-xl mx-auto p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-600/10 via-indigo-500/10 to-cyan-400/10 dark:from-blue-950/40 dark:to-cyan-950/30 border border-blue-200 dark:border-blue-800/80 shadow-sm flex items-center justify-between gap-4">
            <div className="text-left">
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                Direct Recruiter Application
              </span>
              <strong className="block text-sm text-slate-900 dark:text-white font-bold mt-0.5">
                Your next opportunity starts here.
              </strong>
            </div>
            <button
              onClick={() => setGeneralModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-sm uppercase tracking-wider flex-shrink-0 transition-all"
            >
              Send Resume <ArrowRight className="w-3 h-3 inline ml-1" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Job Openings List */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Filter Tabs */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap pb-2">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  selectedDept === dept
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                    : 'bg-white dark:bg-fintech-navy-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-400'
                }`}
              >
                {dept === 'ALL' ? 'All Positions' : dept}
              </button>
            ))}
          </div>

          {/* Job Cards */}
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <JobCard key={job.id || job.title} job={job} />
            ))}
          </div>

          {/* Bottom Prefer Email Banner */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-100 dark:bg-fintech-navy-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Prefer direct email application?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
              Send your resume directly to <strong className="text-blue-600 dark:text-blue-400 font-bold">{RECRUITER_EMAIL}</strong>. Our AI workflow automatically screens all inbound applications within minutes!
            </p>
            <div className="pt-1">
              <button
                onClick={() => setGeneralModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-sm uppercase tracking-wider transition-all"
              >
                <Send className="w-3.5 h-3.5" /> Send Resume Directly →
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* General Application Modal */}
      <ApplyModal
        isOpen={generalModalOpen}
        onClose={() => setGeneralModalOpen(false)}
        jobTitle="General Position"
      />

    </div>
  );
}
