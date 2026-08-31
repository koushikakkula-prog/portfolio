import React, { useState } from 'react';
import {
  Settings,
  User,
  Cpu,
  Download,
  Key,
  ShieldCheck,
  Save,
  CheckCircle2,
  Sparkles,
  Sliders
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';

export const SettingsPage = () => {
  const { user } = useAuth();
  const { showNotification } = useProject();

  const [activeTab, setActiveTab] = useState('ai'); // 'profile', 'ai', 'export'

  // Settings State
  const [profileName, setProfileName] = useState(user?.name || 'Alex Rivera');
  const [profileEmail, setProfileEmail] = useState(user?.email || 'demo@gendoc.ai');
  const [aiModel, setAiModel] = useState('Gemini 1.5 Pro (High Accuracy)');
  const [apiKey, setApiKey] = useState('');
  const [docStyle, setDocStyle] = useState('Professional');
  const [responseLength, setResponseLength] = useState('Detailed');
  const [defaultExportFormat, setDefaultExportFormat] = useState('PDF');

  const handleSave = (e) => {
    e?.preventDefault();
    showNotification('Settings updated successfully!');
  };

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/40 text-xs font-semibold text-indigo-300 mb-2">
          <Settings className="w-3.5 h-3.5" />
          System Preferences
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Settings & AI Configuration
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your account profile, configure Generative AI inference models, and customize document export standards.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('ai')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'ai'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>AI Model & Synthesis</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'profile'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Profile & Team</span>
        </button>

        <button
          onClick={() => setActiveTab('export')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'export'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Preferences</span>
        </button>
      </div>

      {/* Tab 1: AI Model Configuration */}
      {activeTab === 'ai' && (
        <form onSubmit={handleSave} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-xl">
          <div className="space-y-1 pb-4 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-300" />
              Generative AI Engine Settings
            </h3>
            <p className="text-xs text-slate-400">
              Configure the underlying LLM provider, prompt temperatures, and fallback algorithms.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Active AI Model
              </label>
              <select
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Gemini 1.5 Pro (High Accuracy)">Google Gemini 1.5 Pro (Recommended)</option>
                <option value="GPT-4o (OpenAI)">OpenAI GPT-4o</option>
                <option value="Claude 3.5 Sonnet">Anthropic Claude 3.5 Sonnet</option>
                <option value="AST Heuristic Engine (Offline / Local)">Local AST Semantic Engine (Zero API Key Required)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Custom API Key (Optional)
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="AIzaSy... (Leave empty to use built-in AST Generative engine)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                🔒 Keys are processed securely and never transmitted to frontend clients.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Default Documentation Style
                </label>
                <select
                  value={docStyle}
                  onChange={(e) => setDocStyle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Professional">Professional (Standard Industry Format)</option>
                  <option value="Technical">Technical (In-depth Algorithms & Concurrency)</option>
                  <option value="Simple">Simple (Concise & Plain English)</option>
                  <option value="Academic">Academic (College / University Final Project Specification)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Response Depth
                </label>
                <select
                  value={responseLength}
                  onChange={(e) => setResponseLength(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Detailed">Detailed (Full Chapter Breakdowns)</option>
                  <option value="Comprehensive">Comprehensive (Exhaustive Parameter Schemas)</option>
                  <option value="Compact">Compact (Executive Summary)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/25 flex items-center gap-2 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save AI Preferences</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Profile Settings */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSave} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-xl">
          <div className="space-y-1 pb-4 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" />
              User Profile & Credentials
            </h3>
            <p className="text-xs text-slate-400">
              Manage your display identity for generated document authorship metadata.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-extrabold text-xl text-white shadow-md">
                {profileName.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-bold text-white">{profileName}</div>
                <div className="text-xs text-slate-400">Lead System Architect</div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 flex items-center gap-2 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Update Profile</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Export Preferences */}
      {activeTab === 'export' && (
        <form onSubmit={handleSave} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-xl">
          <div className="space-y-1 pb-4 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-400" />
              Default Document Export Engine
            </h3>
            <p className="text-xs text-slate-400">
              Configure PDF header formatting, DOCX corporate themes, and Markdown syntax trees.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Preferred Default Export Format
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { format: 'PDF', label: 'PDF Document', desc: 'Styled with ReportLab cover & page numbering' },
                  { format: 'DOCX', label: 'Microsoft Word (DOCX)', desc: 'Formatted headings & styled tables' },
                  { format: 'Markdown', label: 'GitHub Markdown (.md)', desc: 'Clean syntax with Mermaid charts' }
                ].map((item) => (
                  <div
                    key={item.format}
                    onClick={() => setDefaultExportFormat(item.format)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      defaultExportFormat === item.format
                        ? 'bg-indigo-950/40 border-indigo-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-white mb-1">{item.label}</div>
                    <div className="text-[11px] text-slate-400">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 flex items-center gap-2 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Export Preferences</span>
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
