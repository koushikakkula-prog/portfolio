import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Copy,
  Download,
  Check,
  Code2,
  Terminal,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { api } from '../services/api';

export const ReadmeGenPage = () => {
  const { activeProject, showNotification } = useProject();

  const [formData, setFormData] = useState({
    name: activeProject ? activeProject.name : 'Student Management System',
    description: activeProject ? activeProject.description : 'A comprehensive enterprise-grade web application to manage student profiles, enrollments, and academic transcripts.',
    technologies: 'Python, Flask, SQLAlchemy, SQLite, ReportLab, Tailwind CSS',
    installation: 'pip install -r requirements.txt\npython -c "from app import db; db.create_all()"',
    usage: 'python app.py\n# Navigate to http://localhost:5000 in your browser',
    features: '- Automated Credit-Weighted GPA Calculations\n- Role-Based Access Control (Admins, Faculty, Students)\n- PDF Transcript Generation\n- Comprehensive RESTful API Endpoints',
    contributors: 'Alex Rivera, Lead Engineering Team',
    license: 'MIT'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [readmeOutput, setReadmeOutput] = useState('');

  const handleGenerate = async (e) => {
    e?.preventDefault();
    setIsGenerating(true);
    const res = await api.generateReadme(formData);
    setIsGenerating(false);

    if (res && res.readme_markdown) {
      setReadmeOutput(res.readme_markdown);
      showNotification('README.md generated successfully with AI!');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(readmeOutput);
    setCopied(true);
    showNotification('Copied README to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([readmeOutput], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showNotification('Downloaded README.md');
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/40 text-xs font-semibold text-indigo-300 mb-2">
          <FileText className="w-3.5 h-3.5" />
          GitHub Standards
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          AI README Generator
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Produce professional, production-ready README.md markdown with badges, setup guides, and architecture specs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form Inputs */}
        <div className="lg:col-span-6 space-y-4">
          <form onSubmit={handleGenerate} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-800">
              Project Parameters
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Project Description
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Technologies & Frameworks (comma-separated)
              </label>
              <input
                type="text"
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Key Features (bullet points)
              </label>
              <textarea
                rows={3}
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Installation Command
                </label>
                <input
                  type="text"
                  value={formData.installation}
                  onChange={(e) => setFormData({ ...formData, installation: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Usage Command
                </label>
                <input
                  type="text"
                  value={formData.usage}
                  onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Contributors
                </label>
                <input
                  type="text"
                  value={formData.contributors}
                  onChange={(e) => setFormData({ ...formData, contributors: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  License
                </label>
                <select
                  value={formData.license}
                  onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="MIT">MIT License</option>
                  <option value="Apache-2.0">Apache 2.0</option>
                  <option value="GPL-3.0">GNU GPL v3</option>
                  <option value="BSD-3-Clause">BSD 3-Clause</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-blue-600 hover:from-indigo-600 hover:via-purple-700 hover:to-blue-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all mt-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              {isGenerating ? 'Generating README...' : 'Generate README with AI'}
            </button>
          </form>
        </div>

        {/* Right Markdown Preview & Export */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl flex flex-col h-full min-h-[550px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-400" />
                <span>Generated README.md Output</span>
              </div>

              {readmeOutput && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download README.md</span>
                  </button>
                </div>
              )}
            </div>

            {readmeOutput ? (
              <pre className="flex-1 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 overflow-y-auto leading-relaxed whitespace-pre-wrap">
                {readmeOutput}
              </pre>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center text-slate-500">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="text-xs font-semibold text-slate-400">
                  Configure project parameters on the left and click "Generate README"
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
