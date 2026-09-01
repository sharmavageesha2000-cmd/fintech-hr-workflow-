import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Code2, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Cloud, 
  Sparkles, 
  Lock, 
  Layers, 
  Network, 
  ArrowRight, 
  Fingerprint, 
  FileCheck 
} from 'lucide-react';
import { techStackData, securityPillars } from '../data/techStack';

export default function Technology() {
  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      
      {/* 1. Header Banner */}
      <section className="pt-6 sm:pt-10 pb-4 bg-radial-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <Cpu className="w-3 h-3" /> Engineering &amp; Architecture
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Built with <br className="hidden sm:inline" />
            <span className="text-gradient">modern technology.</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            Our technology ecosystem combines modular React components, scalable cloud concepts, and secure data practices to power reliable FinTech experiences.
          </p>
        </div>
      </section>

      {/* 2. Tech Stack Cards Grid */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStackData.map((tech, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-fintech-navy-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/50 shadow-card-light dark:shadow-card-dark hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 text-lg font-bold">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.2 rounded-full text-[9px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {tech.category}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {tech.name}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {tech.description}
                </p>

                <div className="pt-1 flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" /> Enterprise Certified Stack
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Security Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-100 dark:bg-fintech-navy-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <Lock className="w-3 h-3" /> Security &amp; Compliance
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Security is not an afterthought.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Our architectural blueprints incorporate defense-in-depth principles across every component.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {securityPillars.map((p, idx) => (
                <div key={idx} className="p-4 sm:p-5 rounded-xl bg-white dark:bg-fintech-navy-850 border border-slate-200 dark:border-slate-800/80 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-emerald-500" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{p.title}</h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 4. CTA */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center shadow-xl space-y-3.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Build your technical roadmap with Finova
            </h2>
            <p className="text-blue-100 max-w-lg mx-auto text-xs sm:text-sm">
              Get in touch with our engineering team to learn more about our architectural foundations.
            </p>
            <div className="pt-1">
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold text-blue-600 bg-white hover:bg-slate-100 shadow-md uppercase tracking-wider"
              >
                Connect With Engineers <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
