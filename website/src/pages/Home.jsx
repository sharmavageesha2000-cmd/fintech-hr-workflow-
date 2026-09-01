import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Layers, 
  TrendingUp, 
  Building,
  Users
} from 'lucide-react';
import DashboardMockup from '../components/DashboardMockup';
import ServiceCard from '../components/ServiceCard';
import { servicesData } from '../data/services';

export default function Home() {
  const stats = [
    { number: '10K+', label: 'Transactions Processed', icon: Zap },
    { number: '500+', label: 'Businesses Served', icon: Users },
    { number: '99.9%', label: 'Platform Reliability', icon: ShieldCheck },
    { number: '24/7', label: 'Digital Support', icon: CheckCircle2 }
  ];

  const whyFeatures = [
    {
      title: 'Secure by Design',
      desc: 'Security-focused architecture and responsible technology practices protecting every financial interaction.',
      icon: ShieldCheck
    },
    {
      title: 'Simple & Transparent',
      desc: 'Financial technology without unnecessary complexity, hidden barriers, or convoluted protocols.',
      icon: Sparkles
    },
    {
      title: 'Smart Insights',
      desc: 'Transform financial information into meaningful business insights with real-time metric telemetry.',
      icon: TrendingUp
    },
    {
      title: 'Built for Growth',
      desc: 'Solutions designed to scale smoothly from early-stage startup launches to high-volume enterprise operations.',
      icon: Building
    }
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-12 overflow-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative pt-6 sm:pt-10 lg:pt-12 pb-6 bg-radial-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                Next Generation Financial Technology
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                Powering the Future of <br className="hidden sm:inline" />
                <span className="text-gradient">Digital Finance</span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Secure, simple and intelligent financial technology designed to help businesses manage payments, understand their finances and grow with confidence.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
                <Link
                  to="/solutions"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 uppercase tracking-wider"
                >
                  Explore Solutions <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  to="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl text-xs font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-fintech-navy-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200"
                >
                  Talk to Us →
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Zero-Trust Security
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Modern Stack
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Automated Workflow
                </span>
              </div>

            </div>

            {/* Right Interactive Dashboard Mockup */}
            <div className="lg:col-span-5">
              <DashboardMockup />
            </div>

          </div>
        </div>
      </section>

      {/* 2. Statistics Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl bg-white dark:bg-fintech-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-card-light dark:shadow-card-dark">
            {stats.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className="text-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <div className="text-2xl sm:text-3xl font-extrabold text-gradient tracking-tight mb-0.5">
                    {item.number}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <IconComp className="w-3.5 h-3.5 text-blue-500" />
                    <span>{item.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Services / Solutions Section (Original 6-Card Grid) */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <Layers className="w-3 h-3" /> Capabilities Overview
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Everything you need to move money smarter.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Modern financial technology designed around the way ambitious businesses operate today.
            </p>
          </div>

          {/* Clean 6-Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {servicesData.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

        </div>
      </section>

      {/* 4. Featured FinTech Dashboard Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-8 lg:p-10 rounded-2xl bg-gradient-to-br from-slate-900 via-fintech-navy-900 to-indigo-950 text-white border border-slate-800 shadow-xl overflow-hidden relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
              
              {/* Left Details */}
              <div className="lg:col-span-7 space-y-4">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Sparkles className="w-3 h-3" /> Unified Treasury Architecture
                </span>
                
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                  Your finances. <span className="text-gradient-emerald">One intelligent view.</span>
                </h2>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Eliminate fragmented banking spreadsheets and manual reconciliations. Finova Technologies centralizes your enterprise telemetry into an intuitive, real-time operating dashboard.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Revenue tracking
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Expense monitoring
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Cash-flow visibility
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Financial reporting
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-200 col-span-full">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Business intelligence &amp; forecasting
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/solutions"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-sm hover:scale-105 transition-all uppercase tracking-wider"
                  >
                    View All Features <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Right Mini Graphic Display */}
              <div className="lg:col-span-5">
                <div className="p-4 sm:p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Health Index</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300">Optimal (98.4%)</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-lg bg-white/5 flex justify-between items-center text-xs">
                      <span className="text-slate-300">Working Capital Runway</span>
                      <strong className="text-white font-mono">18.4 Months</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/5 flex justify-between items-center text-xs">
                      <span className="text-slate-300">Net Operating Margin</span>
                      <strong className="text-emerald-400 font-mono">+34.2%</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/5 flex justify-between items-center text-xs">
                      <span className="text-slate-300">Payout Accuracy</span>
                      <strong className="text-cyan-300 font-mono">99.99%</strong>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 5. Why Finova Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3 h-3" /> Core Values
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Built around trust. Designed for growth.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              We engineer financial software that delivers enterprise durability with consumer simplicity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {whyFeatures.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div 
                  key={idx} 
                  className="p-5 rounded-2xl bg-white dark:bg-fintech-navy-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/50 shadow-card-light dark:shadow-card-dark hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 space-y-2.5"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 6. Call To Action Banner */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white text-center shadow-xl overflow-hidden">
            <div className="relative z-10 max-w-xl mx-auto space-y-4">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-md">
                <Sparkles className="w-3 h-3" /> Next Steps
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Ready to move finance forward?
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-normal">
                Discover how modern technology can simplify your financial operations, automate payment flows, and accelerate business growth.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                <Link
                  to="/solutions"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-blue-600 bg-white hover:bg-slate-100 shadow-md hover:scale-105 transition-all uppercase tracking-wider"
                >
                  Explore Solutions <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
                </Link>
                <Link
                  to="/contact"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-900/60 hover:bg-blue-900/80 border border-white/20 backdrop-blur-md hover:scale-105 transition-all"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
