import React from 'react';
import { Sparkles, Github, Linkedin, Twitter, Mail, MapPin, Heart } from 'lucide-react';

export const Footer = ({ setActivePage }) => {
  return (
    <footer id="about" className="bg-slate-950 border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Column 1: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-md shadow-indigo-500/20">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-indigo-200 to-blue-300 bg-clip-text text-transparent">
                AI Recruit
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Next-generation intelligent recruitment and automated candidate ranking system powered by natural language processing and cosine similarity matching.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500 transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:border-indigo-500 transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500 transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Platform */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => { setActivePage('landing'); setTimeout(() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }), 50); }} className="hover:text-white transition-colors">
                  AI Resume Screening
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('landing'); setTimeout(() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }), 50); }} className="hover:text-white transition-colors">
                  Candidate Ranking
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('landing'); setTimeout(() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }), 50); }} className="hover:text-white transition-colors">
                  Skill Gap Analysis
                </button>
              </li>
              <li>
                <button onClick={() => { setActivePage('landing'); setTimeout(() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }), 50); }} className="hover:text-white transition-colors">
                  Recruiter Analytics
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Portals */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">Portals</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setActivePage('recruiter-dashboard')} className="hover:text-white transition-colors">
                  Recruiter Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('candidate-dashboard')} className="hover:text-white transition-colors">
                  Candidate Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('find-jobs')} className="hover:text-white transition-colors">
                  Find Jobs & Apply
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('resume-upload')} className="hover:text-white transition-colors">
                  Resume Parser Upload
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Legal */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">Contact & Legal</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-1.5 text-slate-400">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>support@airecruit.io</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>Bangalore & Silicon Valley</span>
              </li>
              <li className="pt-2">
                <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} AI Recruit System. All rights reserved. CSE Mini-Project & Portfolio Showcase.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with AI & Machine Learning for modern hiring teams</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
