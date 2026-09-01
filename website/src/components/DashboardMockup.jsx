import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  ShieldCheck, 
  ArrowDownLeft, 
  ArrowUpRight,
  Wifi,
  Sparkles,
  Layers
} from 'lucide-react';

export default function DashboardMockup() {
  const transactions = [
    {
      name: 'Client Enterprise Payment',
      type: 'inbound',
      category: 'Direct Settlement',
      amount: '+ ₹45,000',
      time: 'Just now',
      color: 'emerald'
    },
    {
      name: 'Amazon Web Services',
      type: 'outbound',
      category: 'Cloud Infrastructure',
      amount: '− ₹2,499',
      time: '1h ago',
      color: 'slate'
    },
    {
      name: 'Netflix Corporate Team',
      type: 'outbound',
      category: 'Digital Media',
      amount: '− ₹799',
      time: '3h ago',
      color: 'slate'
    },
    {
      name: 'Staff Payroll Allocation',
      type: 'outbound',
      category: 'Automated Salary',
      amount: '− ₹65,000',
      time: 'Today',
      color: 'slate'
    }
  ];

  return (
    <div className="relative w-full max-w-md mx-auto lg:max-w-none space-y-3.5">
      
      {/* Decorative Glow Background */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600/15 via-cyan-400/15 to-emerald-500/15 rounded-2xl blur-xl -z-10 opacity-70"></div>

      {/* 1. Finova Titanium Gradient Virtual Card */}
      <div className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl border border-white/20">
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-400/10 rounded-full blur-2xl -z-0"></div>

        <div className="relative z-10 flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Layers className="w-3.5 h-3.5 text-cyan-300" />
            </div>
            <span className="font-bold tracking-wider text-[11px] uppercase text-cyan-200">
              FINOVA PLATINUM
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-5 rounded bg-gradient-to-tr from-amber-300 to-amber-500 border border-amber-200/60 shadow-inner"></div>
            <Wifi className="w-4 h-4 text-white/80 rotate-90" />
          </div>
        </div>

        <div className="relative z-10 text-lg sm:text-xl font-mono tracking-widest text-slate-200 mb-4 drop-shadow-sm">
          •••• &nbsp; •••• &nbsp; •••• &nbsp; 8842
        </div>

        <div className="relative z-10 flex justify-between items-end">
          <div>
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">
              Cardholder Name
            </span>
            <span className="text-xs font-bold tracking-wide text-white">
              FINOVA ENTERPRISE
            </span>
          </div>
          <div className="text-right">
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">
              Expires
            </span>
            <span className="text-[11px] font-bold font-mono text-cyan-300">
              09 / 29
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Live Financial Telemetry Dashboard */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-fintech-navy-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl space-y-4">
        
        {/* Balance Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-radar-pulse"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Live Treasury Balance
              </span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              ₹12,45,680
            </div>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <TrendingUp className="w-3 h-3" /> +18.4%
          </div>
        </div>

        {/* Revenue & Expenses Metrics Row */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-fintech-navy-850 border border-slate-100 dark:border-slate-800 hover:border-blue-400/40 transition-colors">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">
              <span>Revenue</span>
              <TrendingUp className="w-3 h-3 text-emerald-500" />
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              ₹8,45,200
            </div>
            <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
              +18.4% YoY
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-fintech-navy-850 border border-slate-100 dark:border-slate-800 hover:border-blue-400/40 transition-colors">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">
              <span>Expenses</span>
              <TrendingDown className="w-3 h-3 text-blue-500" />
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              ₹3,25,480
            </div>
            <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400">
              -8.2% Controlled
            </span>
          </div>
        </div>

        {/* Animated SVG Interactive Revenue Wave Chart */}
        <div className="p-2.5 rounded-xl bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/60 relative overflow-hidden">
          <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              Live Telemetry Curve
            </span>
            <span className="text-[9px] text-blue-500 font-bold">2026 Active Flow</span>
          </div>
          <div className="w-full h-12">
            <svg viewBox="0 0 300 70" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
                  <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0,55 Q 50,20 100,40 T 200,20 T 300,10 L 300,70 L 0,70 Z"
                fill="url(#chartGrad)"
              />
              <path
                d="M 0,55 Q 50,20 100,40 T 200,20 T 300,10"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="animate-wave-line"
              />
              <circle cx="300" cy="10" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="2" className="animate-pulse" />
            </svg>
          </div>
        </div>

        {/* Recent Transactions List */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
            <span>Recent Transactions</span>
            <span className="text-blue-500 text-[10px] font-semibold cursor-default">Real-Time</span>
          </div>

          <div className="space-y-1.5">
            {transactions.slice(0, 3).map((tx, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50/80 dark:bg-fintech-navy-850 border border-slate-100 dark:border-slate-800/80"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                    tx.type === 'inbound'
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                  }`}>
                    {tx.type === 'inbound' ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                  </div>
                  <div>
                    <strong className="block text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                      {tx.name}
                    </strong>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400">
                      {tx.category}
                    </span>
                  </div>
                </div>
                <span className={`text-[11px] font-bold font-mono ${
                  tx.type === 'inbound' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'
                }`}>
                  {tx.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Guarantee Badge */}
        <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" /> 256-Bit Cryptographic Vault
          </span>
          <span className="text-blue-500 font-semibold">Verified Architecture</span>
        </div>

      </div>

    </div>
  );
}
