import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';

export const Navbar = ({ onNavigate, onOpenLogin, onOpenRegister }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Languages', href: '#languages' },
    { label: 'Documentation', href: '#demo' },
    { label: 'About', href: '#about' },
  ];

  const handleNavClick = (href) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/20 py-3.5' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div className="cursor-pointer" onClick={() => handleNavClick('#home')}>
            <Logo size="md" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 bg-slate-900/60 border border-slate-800/80 px-4 py-1.5 rounded-full backdrop-blur-md shadow-inner">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-full transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Login
            </button>
            <button
              onClick={onOpenRegister}
              className="relative group overflow-hidden rounded-xl p-px font-semibold text-sm shadow-lg shadow-indigo-500/20"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 group-hover:opacity-90 transition-opacity" />
              <span className="relative flex items-center gap-1.5 px-4 py-2 rounded-[11px] bg-slate-950/90 text-white group-hover:bg-transparent transition-all">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                Get Started
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 backdrop-blur-xl animate-fadeIn">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="text-left px-3 py-2.5 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg"
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-2.5">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenLogin(); }}
              className="w-full py-2.5 text-center text-sm font-semibold text-slate-200 bg-slate-900 border border-slate-800 rounded-xl"
            >
              Login
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenRegister(); }}
              className="w-full py-2.5 text-center text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 via-purple-600 to-blue-600 rounded-xl shadow-md shadow-indigo-500/25"
            >
              Get Started Free
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
