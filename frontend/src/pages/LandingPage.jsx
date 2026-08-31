import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Logo } from '../components/Logo';
import {
  Sparkles,
  ArrowRight,
  Code2,
  Cpu,
  FileText,
  Globe2,
  FileCode2,
  Download,
  CheckCircle2,
  Zap,
  Terminal,
  Layers,
  ShieldCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const LandingPage = ({ onGetStarted, onOpenLogin, onOpenRegister, onTryDemo }) => {
  const [activeCodeTab, setActiveCodeTab] = useState('python');

  const stats = [
    { value: '10K+', label: 'Files Analyzed', desc: 'Across GitHub and local workspaces' },
    { value: '5K+', label: 'Documents Generated', desc: 'Production-ready technical specs' },
    { value: '20+', label: 'Programming Languages', desc: 'Full AST & regex semantic support' },
    { value: '95%', label: 'Documentation Efficiency', desc: 'Reduction in manual authoring time' },
  ];

  const features = [
    {
      icon: Sparkles,
      color: 'from-purple-500 to-indigo-600',
      title: 'AI Documentation Generation',
      desc: 'Automatically synthesize comprehensive system architecture, module breakdowns, and technical manuals using Generative AI.'
    },
    {
      icon: Cpu,
      color: 'from-blue-500 to-cyan-600',
      title: 'Code Analysis',
      desc: 'Deep-dive AST analysis extracting classes, methods, parameters, return types, imports, and cyclomatic complexity.'
    },
    {
      icon: Globe2,
      color: 'from-emerald-500 to-teal-600',
      title: 'API Documentation',
      desc: 'Detect REST endpoints, HTTP methods, request bodies, query parameters, and generate OpenAPI / Markdown specs.'
    },
    {
      icon: FileText,
      color: 'from-amber-500 to-orange-600',
      title: 'README Generator',
      desc: 'Instantly build polished GitHub README.md files featuring build badges, installation guides, tech stacks, and licenses.'
    },
    {
      icon: FileCode2,
      color: 'from-rose-500 to-pink-600',
      title: 'Code Explanation',
      desc: 'Explain complex algorithms and intricate functions in plain English with parameter tables and time complexity breakdowns.'
    },
    {
      icon: Download,
      color: 'from-indigo-500 to-blue-600',
      title: 'Multi-Format Export',
      desc: 'Export final approved documentation as professionally formatted PDF (with cover & page numbering), DOCX, or Markdown.'
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Upload Source Code',
      desc: 'Drag and drop individual source code files or an entire project ZIP archive.',
      icon: Terminal,
      color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
    },
    {
      step: '02',
      title: 'Deep AST Analysis',
      desc: 'The engine parses AST trees, extracts functions, classes, dependencies, and API endpoints.',
      icon: Cpu,
      color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
    },
    {
      step: '03',
      title: 'Generative AI Synthesis',
      desc: 'Generative AI synthesizes clear, structured, developer-friendly technical documentation.',
      icon: Sparkles,
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    },
    {
      step: '04',
      title: 'Edit & Multi-Format Export',
      desc: 'Refine using the AI Assistant and download beautiful PDF, DOCX, or Markdown files.',
      icon: Download,
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    }
  ];

  const supportedLanguages = [
    { name: 'Python', icon: '🐍', tag: 'Full AST + Flask / FastAPI' },
    { name: 'Java', icon: '☕', tag: 'Classes & Spring Boot' },
    { name: 'JavaScript', icon: '🟨', tag: 'ES6+ & Node / Express' },
    { name: 'TypeScript', icon: '🟦', tag: 'Typed Interfaces & React' },
    { name: 'C / C++', icon: '⚙️', tag: 'Functions & Structs' },
    { name: 'HTML5 & CSS3', icon: '🌐', tag: 'DOM Tree & Styles' },
    { name: 'SQL', icon: '🗄️', tag: 'Schema & DDL Queries' },
    { name: 'Go / Rust', icon: '⚡', tag: 'Coming Soon' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Top Navbar */}
      <Navbar
        onOpenLogin={onOpenLogin}
        onOpenRegister={onOpenRegister}
      />

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Background Glowing Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-xs font-semibold text-indigo-300 shadow-sm backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" style={{ animationDuration: '4s' }} />
                <span>Powered by Generative AI & AST Parsing</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                Turn Your Code Into <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                  Professional Documentation
                </span> <br className="hidden sm:inline" />
                with AI.
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                GenDoc AI analyzes your source code, understands project structure, and automatically generates clear, structured, developer-friendly technical documentation.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={onGetStarted}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-blue-600 hover:from-indigo-600 hover:via-purple-700 hover:to-blue-700 font-semibold text-white shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 group transition-all transform hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  Generate Documentation
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={onTryDemo}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  View Demo Project
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>No Hallucinations</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>PDF / DOCX / Markdown Export</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Multi-Language AST</span>
                </div>
              </div>

            </div>

            {/* Right Hero Interactive Flow Visual */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800/90 p-5 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl">
                
                {/* Visual Title Bar */}
                <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-mono text-slate-400">gendoc-ai-pipeline.exe</span>
                  <div className="w-3" />
                </div>

                {/* Animated Pipeline Nodes */}
                <div className="space-y-3 font-mono text-xs">
                  
                  {/* Step 1: SOURCE CODE */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-indigo-500/30 flex items-center justify-between text-indigo-300">
                    <div className="flex items-center gap-2.5">
                      <Terminal className="w-4 h-4 text-indigo-400" />
                      <span className="font-semibold tracking-wide">SOURCE CODE</span>
                    </div>
                    <span className="text-[10px] text-slate-400">18 Files • Python</span>
                  </div>

                  {/* Arrow 1 */}
                  <div className="flex justify-center text-slate-400 font-bold">
                    <span className="animate-bounce">↓</span>
                  </div>

                  {/* Step 2: AI CODE ANALYSIS */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 flex items-center justify-between text-cyan-300">
                    <div className="flex items-center gap-2.5">
                      <Cpu className="w-4 h-4 text-cyan-400" />
                      <span className="font-semibold tracking-wide">AI CODE ANALYSIS</span>
                    </div>
                    <span className="text-[10px] text-cyan-400">47 Functions • 12 Classes</span>
                  </div>

                  {/* Arrow 2 */}
                  <div className="flex justify-center text-slate-400 font-bold">
                    <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>↓</span>
                  </div>

                  {/* Step 3: GENERATIVE AI */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-purple-500/30 flex items-center justify-between text-purple-300">
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                      <span className="font-semibold tracking-wide">GENERATIVE AI</span>
                    </div>
                    <span className="text-[10px] text-purple-400">14 Section Synthesis</span>
                  </div>

                  {/* Arrow 3 */}
                  <div className="flex justify-center text-slate-400 font-bold">
                    <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>↓</span>
                  </div>

                  {/* Step 4: TECHNICAL DOCUMENTATION */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border border-emerald-500/40 flex items-center justify-between text-emerald-300 shadow-md">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold tracking-wide">TECHNICAL DOCUMENTATION</span>
                    </div>
                    <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-700/50">PDF • DOCX • MD</span>
                  </div>

                </div>

                {/* Bottom Code Terminal Snippet */}
                <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
                  <div className="text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    [READY] Architecture & REST API mapped cleanly.
                  </div>
                  <div className="text-slate-400">
                    &gt; export GenDoc_Technical_Specification.pdf (100% complete)
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 bg-slate-900/50 border-y border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                  {s.value}
                </div>
                <div className="text-sm font-semibold text-slate-200">{s.label}</div>
                <div className="text-xs text-slate-400">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/40 text-xs font-semibold text-indigo-300">
              <Zap className="w-3.5 h-3.5 text-cyan-300" />
              Comprehensive Tooling
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Everything You Need to Document Your Code
            </h2>
            <p className="text-slate-400 text-base">
              Engineered with Python AST, intelligent regex parsers, and Generative AI to convert complex architectures into immaculate documentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="group relative rounded-2xl bg-slate-900/60 border border-slate-800 p-6 hover:border-indigo-500/40 hover:bg-slate-900/90 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-950/30 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} p-2.5 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>

                  <div className="pt-6 flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                    <span>Explore capability</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* How It Works (4-Step Timeline) */}
      <section id="how-it-works" className="py-24 bg-slate-900/30 border-y border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-xs font-semibold text-cyan-300">
              <Layers className="w-3.5 h-3.5" />
              Four Simple Steps
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              How GenDoc AI Works
            </h2>
            <p className="text-slate-400 text-base">
              From raw source code to executive-ready technical specifications in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {workflowSteps.map((ws, idx) => {
              const Icon = ws.icon;
              return (
                <div key={idx} className="relative rounded-2xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-slate-300">{ws.step}</span>
                      <div className={`p-2.5 rounded-xl border ${ws.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white">{ws.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{ws.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Supported Languages Section */}
      <section id="languages" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800/40 text-xs font-semibold text-purple-300">
              <Code2 className="w-3.5 h-3.5" />
              Universal Support
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Supported Programming Languages
            </h2>
            <p className="text-slate-400 text-base">
              Deep syntax and structural understanding across all primary software stacks.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {supportedLanguages.map((lang, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-900 transition-all flex items-center gap-3.5 group"
              >
                <div className="text-2xl">{lang.icon}</div>
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {lang.name}
                  </div>
                  <div className="text-xs text-slate-400">{lang.tag}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 text-sm text-slate-400 font-medium">
            ✨ More languages coming soon (Go, Rust, Kotlin, Swift, Ruby).
          </div>

        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="rounded-3xl bg-gradient-to-r from-indigo-900/80 via-purple-900/80 to-slate-900/80 border border-indigo-500/30 p-8 sm:p-12 text-center space-y-6 shadow-2xl backdrop-blur-xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Ready to automate your technical documentation?
            </h2>
            <p className="text-slate-300 text-base max-w-2xl mx-auto">
              Perfect for final-year project demonstrations, CSE mini-projects, portfolio showcases, and engineering teams.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={onGetStarted}
                className="px-8 py-3.5 rounded-xl bg-white text-slate-950 font-bold hover:bg-slate-100 transition-all shadow-lg flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Get Started with GenDoc AI
              </button>
              <button
                onClick={onTryDemo}
                className="px-7 py-3.5 rounded-xl bg-slate-950/70 border border-slate-700 text-slate-200 hover:text-white font-semibold transition-all"
              >
                Try Interactive Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="py-12 bg-slate-950 border-t border-slate-900 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Logo size="sm" />
            <span className="text-slate-400">|</span>
            <span>Turn Code Into Clear Documentation with AI.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-slate-200 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-slate-200 transition-colors">How It Works</a>
            <a href="#languages" className="hover:text-slate-200 transition-colors">Supported Stacks</a>
            <span className="text-slate-400">© 2026 GenDoc AI. All rights reserved.</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
