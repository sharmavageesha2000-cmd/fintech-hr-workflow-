import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react';
import { RECRUITER_EMAIL } from '../data/jobs';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    solution: 'Digital Payments',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendEmail = (useGmailWeb = false) => {
    const subject = `Business Inquiry – Finova Technologies (${formData.company || formData.name || 'General'})`;
    const body = 
`Dear Finova Technologies Team,

I would like to inquire regarding your FinTech solutions and services.

Inquiry Details:
- Full Name: ${formData.name || 'N/A'}
- Email Address: ${formData.email || 'N/A'}
- Phone Number: ${formData.phone || 'N/A'}
- Company Name: ${formData.company || 'N/A'}
- Solution of Interest: ${formData.solution}

Message:
${formData.message || 'Please connect with me regarding Finova Technologies solutions.'}

Thank you!`;

    if (useGmailWeb) {
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(RECRUITER_EMAIL)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(gmailUrl, '_blank');
    } else {
      window.location.href = `mailto:${RECRUITER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendEmail(false);
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      
      {/* 1. Header Banner */}
      <section className="pt-6 sm:pt-10 pb-4 bg-radial-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <Sparkles className="w-3 h-3" /> Direct Contact &amp; Partnerships
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Let's build <br className="hidden sm:inline" />
            <span className="text-gradient">something smarter.</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            Have questions about our digital finance solutions, partnership opportunities, or technical integrations? We'd love to connect.
          </p>
        </div>
      </section>

      {/* 2. Contact Grid & Form */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Left Contact Information */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-white dark:bg-fintech-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-card-light dark:shadow-card-dark space-y-6">
              <div>
                <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  Direct Inquiries
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                  Reach our team directly
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                  We review and respond to all technical, business, and enterprise inquiries promptly.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Email Address</strong>
                    <a href={`mailto:${RECRUITER_EMAIL}`} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                      {RECRUITER_EMAIL}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Phone &amp; Messaging</strong>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">+91 XXXXX XXXXX</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400 flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Headquarters</strong>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">India (Digital Operations)</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Responses delivered within 24-48 business hours.</span>
              </div>
            </div>

            {/* Right Contact Form */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-white dark:bg-fintech-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-card-light dark:shadow-card-dark space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Send a Business Message
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Fill in your details below to generate a pre-formatted inquiry email to our team.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Full Name *</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      placeholder="e.g. Rahul Sharma" 
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-fintech-navy-850 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Email Address *</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      placeholder="e.g. rahul@startup.com" 
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-fintech-navy-850 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Phone Number</label>
                    <input 
                      type="text" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-fintech-navy-850 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Company Name</label>
                    <input 
                      type="text" 
                      name="company" 
                      value={formData.company} 
                      onChange={handleChange} 
                      placeholder="e.g. Acme FinTech"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-fintech-navy-850 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Solution of Interest</label>
                  <select
                    name="solution"
                    value={formData.solution}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-fintech-navy-850 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="Digital Payments">Digital Payments Platform</option>
                    <option value="Payment Infrastructure">Payment Infrastructure</option>
                    <option value="Expense Management">Expense Management</option>
                    <option value="Financial Analytics">Financial Analytics &amp; Intelligence</option>
                    <option value="Fraud & Security">Fraud &amp; Security Shield</option>
                    <option value="Custom Integration">Custom Enterprise Integration</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Your Message *</label>
                  <textarea
                    rows={3}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your business requirements, timeline, or questions..."
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-fintech-navy-850 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  ></textarea>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-sm uppercase tracking-wider transition-all"
                  >
                    <Send className="w-3.5 h-3.5" /> Send Inquiry
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSendEmail(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-fintech-navy-850 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-all"
                  >
                    Open in Gmail Web <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
