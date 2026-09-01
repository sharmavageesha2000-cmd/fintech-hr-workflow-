import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, ArrowRight, Layers, Sparkles, Globe } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Solutions', path: '/solutions' },
    { name: 'Technology', path: '/technology' },
    { name: 'Careers', path: '/careers', badge: 'Hiring' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 dark:bg-fintech-navy-950/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm dark:shadow-2xl' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Finova
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                  Tech
                </span>
              </div>
              <p className="text-[9px] font-medium text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                Smarter Money. Simpler Future.
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 px-2.5 py-1 bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 rounded-full backdrop-blur-md">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `relative px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-blue-600 shadow-sm shadow-blue-600/30'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                  }`
                }
              >
                {link.name}
                {link.badge && (
                  <span className="ml-1 text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider bg-emerald-500 text-white">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Controls: Theme Toggle + CTA */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark/light theme"
              className="p-2 rounded-full text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:scale-105 transition-all"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
              )}
            </button>

            {/* Get Started Button */}
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200"
            >
              Get Started <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Mobile Right Controls: Theme Toggle + Hamburger */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              aria-label="Toggle navigation drawer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bottom-0 bg-white/95 dark:bg-fintech-navy-950/95 backdrop-blur-2xl border-t border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center justify-between p-3.5 rounded-2xl text-base font-bold transition-colors ${
                    isActive
                      ? 'text-white bg-blue-600 shadow-md shadow-blue-600/30'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`
                }
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-extrabold uppercase bg-emerald-500 text-white">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <Link
              to="/contact"
              className="w-full py-3.5 flex items-center justify-center gap-2 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-glow-blue"
            >
              Get Started Now <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
              © 2026 Finova Technologies
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
