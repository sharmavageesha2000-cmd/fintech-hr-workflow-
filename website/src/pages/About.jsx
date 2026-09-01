import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Target, 
  Compass, 
  Handshake, 
  Lightbulb, 
  ShieldCheck, 
  Eye, 
  HeartHandshake, 
  Wand2, 
  Sparkles, 
  ArrowRight 
} from 'lucide-react';

export default function About() {
  const values = [
    {
      title: 'Trust',
      icon: Handshake,
      desc: 'We believe trust is the cornerstone of every financial relationship. We earn and maintain it through consistent reliability and transparency.'
    },
    {
      title: 'Innovation',
      icon: Lightbulb,
      desc: 'Pioneering creative software architectures that remove operational friction and transform complex financial challenges into seamless workflows.'
    },
    {
      title: 'Security',
      icon: ShieldCheck,
      desc: 'Upholding defense-in-depth principles and privacy-focused design to safeguard every transaction and financial data payload.'
    },
    {
      title: 'Transparency',
      icon: Eye,
      desc: 'Providing crystal-clear visibility into fees, operational metrics, and data telemetry with zero hidden complexities.'
    },
    {
      title: 'Customer First',
      icon: HeartHandshake,
      desc: 'Obsessing over the success and satisfaction of our users, engineering products that solve genuine, real-world operational problems.'
    },
    {
      title: 'Simplicity',
      icon: Wand2,
      desc: 'Eliminating cumbersome bureaucratic steps with clean user interfaces, modern component systems, and intuitive digital experiences.'
    }
  ];

  const timeline = [
    {
      year: '2024',
      badge: 'Concept',
      title: 'Finova Technologies Concept Established',
      desc: 'Ideated the foundational Finova framework, researching digital payment bottlenecks and architecting modern financial technology workflows.'
    },
    {
      year: '2025',
      badge: 'Development',
      title: 'Technology & Product Development',
      desc: 'Engineered core React component systems, modular REST data interfaces, and simulated financial analytics prototypes.'
    },
    {
      year: '2026',
      badge: 'Expansion',
      title: 'Digital Finance Solutions & Business Expansion',
      desc: 'Introduced digital payment infrastructure concepts, expense tracking telemetry, and automated candidate recruitment integrations.'
    },
    {
      year: 'Future',
      badge: 'Next Gen',
      title: 'Building the Next Generation of Financial Technology',
      desc: 'Continuously advancing AI-driven financial insights, global multi-currency abstractions, and next-generation treasury tooling.'
    }
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      
      {/* 1. Header Hero */}
      <section className="pt-6 sm:pt-10 pb-4 bg-radial-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <Sparkles className="w-3 h-3" /> About Finova Technologies
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Technology that makes <br className="hidden sm:inline" />
            <span className="text-gradient">finance simpler.</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            Finova Technologies is a forward-thinking FinTech company dedicated to developing digital solutions for modern financial operations, payments, and business growth.
          </p>

          {/* Mission & Vision Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto pt-4 text-left">
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-fintech-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-card-light dark:shadow-card-dark space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Our Mission</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                “To simplify financial technology and make digital financial solutions more accessible, secure and efficient for individuals, startups, and growing enterprises.”
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-fintech-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-card-light dark:shadow-card-dark space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Compass className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Our Vision</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                “To create a smarter, transparent, and resilient digital financial ecosystem that empowers businesses to manage capital with confidence.”
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Values Grid */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Guiding Principles
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Values that anchor our innovation
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Every interface, workflow, and technology decision is guided by our core values.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {values.map((val, idx) => {
              const IconComp = val.icon;
              return (
                <div 
                  key={idx}
                  className="p-5 rounded-2xl bg-white dark:bg-fintech-navy-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/50 shadow-card-light dark:shadow-card-dark hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 space-y-2"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {val.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Company Journey Timeline */}
      <section className="relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Company Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Our growth roadmap &amp; evolution
            </h2>
          </div>

          <div className="space-y-3.5">
            {timeline.map((step, idx) => (
              <div 
                key={idx} 
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 p-4 sm:p-5 rounded-2xl bg-white dark:bg-fintech-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-card-light dark:shadow-card-dark hover:border-blue-500/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-extrabold text-xs flex-shrink-0 shadow-sm shadow-blue-500/20">
                  {step.year}
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {step.title}
                    </h3>
                    <span className="px-2 py-0.2 rounded-full text-[9px] font-bold uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400">
                      {step.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CTA */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center shadow-xl space-y-3.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to explore Finova's technology?
            </h2>
            <p className="text-blue-100 max-w-lg mx-auto text-xs sm:text-sm">
              Learn how our modern solutions can empower your business operations and streamline payments.
            </p>
            <div className="pt-1">
              <Link
                to="/solutions"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold text-blue-600 bg-white hover:bg-slate-100 shadow-md uppercase tracking-wider"
              >
                Explore Solutions <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
