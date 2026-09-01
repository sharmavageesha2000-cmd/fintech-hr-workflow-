import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Mail, Phone, MapPin, CheckCircle2, Globe, Share2, MessageCircle, Code } from 'lucide-react';
import { RECRUITER_EMAIL } from '../data/jobs';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-100 dark:bg-fintech-navy-950 border-t border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-sm">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Finova
                </span>
                <span className="text-[10px] ml-1.5 px-1.5 py-0.2 rounded font-bold uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400">
                  Technologies
                </span>
              </div>
            </Link>
            
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              “Smarter Money. Simpler Future.” Technology-driven digital finance &amp; payment solutions built for modern startups, enterprises, and growing businesses.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <a href="#" className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500 transition-all" title="Global Network">
                <Globe className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500 transition-all" title="Social Channels">
                <Share2 className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500 transition-all" title="Community Hub">
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500 transition-all" title="Developer Portal">
                <Code className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Company
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/technology" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors">Technology Stack</Link>
              </li>
              <li>
                <Link to="/careers" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors">Careers &amp; Jobs</Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors">Contact Support</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Solutions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Solutions
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/solutions" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors">Digital Payments</Link>
              </li>
              <li>
                <Link to="/solutions" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors">Payment Infrastructure</Link>
              </li>
              <li>
                <Link to="/solutions" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors">Expense Management</Link>
              </li>
              <li>
                <Link to="/solutions" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors">Financial Analytics</Link>
              </li>
              <li>
                <Link to="/solutions" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors">Fraud &amp; Security</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Get in Touch
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Mail className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                <a href={`mailto:${RECRUITER_EMAIL}`} className="hover:text-blue-600 dark:hover:text-white transition-colors truncate">
                  {RECRUITER_EMAIL}
                </a>
              </li>
              <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Phone className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>+91 XXXXX XXXXX</span>
              </li>
              <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" />
                <span>India (Digital Operations)</span>
              </li>
            </ul>

            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" /> 99.9% Platform Uptime
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 Finova Technologies. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/about" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">Security Overview</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
