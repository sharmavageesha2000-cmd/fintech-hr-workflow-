import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  Server, 
  Receipt, 
  LineChart, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { servicesData } from '../data/services';

const iconMap = {
  'digital-payments': CreditCard,
  'payment-infrastructure': Server,
  'expense-management': Receipt,
  'financial-analytics': LineChart,
  'business-finance': Building2,
  'fraud-security': ShieldCheck,
};

export default function Solutions() {
  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      
      {/* 1. Header Banner */}
      <section className="pt-6 sm:pt-10 pb-4 bg-radial-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <Sparkles className="w-3 h-3" /> Capabilities &amp; Architecture
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Built for modern <br className="hidden sm:inline" />
            <span className="text-gradient">financial operations.</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            Explore our specialized digital finance tools, payment gateways, and automated expense intelligence designed for high-performing startups and enterprises.
          </p>
        </div>
      </section>

      {/* 2. Alternating Solutions Grid */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          {servicesData.map((s, idx) => {
            const IconComp = iconMap[s.id] || CreditCard;
            const isEven = idx % 2 === 0;

            return (
              <div 
                key={s.id}
                className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-fintech-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-card-light dark:shadow-card-dark grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center"
              >
                {/* Content */}
                <div className={`space-y-4 lg:col-span-7 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="px-2 py-0.2 rounded-full text-[9px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400">
                        {s.tag}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                        {s.title}
                      </h2>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {s.description}
                  </p>

                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Core Functional Capabilities:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {s.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-sm uppercase tracking-wider transition-all"
                    >
                      Inquire About {s.title} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Visual Graphic */}
                <div className={`lg:col-span-5 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="p-6 rounded-xl bg-slate-50 dark:bg-fintech-navy-850 border border-slate-200/80 dark:border-slate-800 text-center space-y-2.5">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center border border-blue-500/20">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {s.title} Engine
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                      Engineered for high concurrent load, instant payload validation, and continuous telemetry monitoring.
                    </p>
                    <div className="pt-1">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <Zap className="w-3 h-3" /> High Throughput
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* 3. CTA */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center shadow-xl space-y-3.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to implement smarter finance?
            </h2>
            <p className="text-blue-100 max-w-lg mx-auto text-xs sm:text-sm">
              Talk with our solutions team to discuss custom integrations and modern payment workflows.
            </p>
            <div className="pt-1">
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold text-blue-600 bg-white hover:bg-slate-100 shadow-md uppercase tracking-wider"
              >
                Contact Solutions Team <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
