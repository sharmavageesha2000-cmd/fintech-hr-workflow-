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
  ArrowRight 
} from 'lucide-react';

const iconMap = {
  'digital-payments': CreditCard,
  'payment-infrastructure': Server,
  'expense-management': Receipt,
  'financial-analytics': LineChart,
  'business-finance': Building2,
  'fraud-security': ShieldCheck,
};

export default function ServiceCard({ service }) {
  const IconComponent = iconMap[service.id] || CreditCard;

  return (
    <div className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-fintech-navy-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/50 shadow-card-light dark:shadow-card-dark hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      
      {/* Top Section */}
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/50 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
            <IconComponent className="w-5 h-5" />
          </div>
          {service.tag && (
            <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {service.tag}
            </span>
          )}
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {service.title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
          {service.shortDescription || service.description}
        </p>

        {service.features && (
          <ul className="space-y-1.5 mb-5">
            {service.features.map((feat, idx) => (
              <li key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Bottom Action Link */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <Link 
          to="/solutions" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 uppercase tracking-wider"
        >
          Explore Solution <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
