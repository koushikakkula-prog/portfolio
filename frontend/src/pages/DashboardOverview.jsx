import React, { useState } from 'react';
import {
  FolderKanban,
  FileCode2,
  Sparkles,
  Clock,
  Plus,
  ArrowRight,
  CheckCircle2,
  Play,
  UploadCloud,
  Cpu,
  Globe2,
  FileText,
  TrendingUp,
  Code
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { api } from '../services/api';

export const DashboardOverview = ({ onNavigate, onOpenNewProjectModal }) => {
  const { projects, activeProject, selectProject, showNotification } = useProject();

  const stats = [
    { title: 'Projects', value: projects.length || '12', icon: FolderKanban, color: 'from-blue-500 to-indigo-600', sub: '+3 this week' },
    { title: 'Files Analyzed', value: '154', icon: FileCode2, color: 'from-purple-500 to-indigo-600', sub: '20+ languages' },
    { title: 'Documents Generated', value: '28', icon: Sparkles, color: 'from-cyan-500 to-blue-600', sub: '100% verified' },
    { title: 'AI Processing Time', value: '2.4 min', icon: Clock, color: 'from-emerald-500 to-teal-600', sub: 'Avg 4.2s / file' },
  ];

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-950/80 via-purple-950/60 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 relative overflow-hidden backdrop-blur-md shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-semibold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            GenDoc AI Engine v2.4 Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Turn Code Into Clear Documentation with AI
          </h1>
          <p className="text-sm text-slate-300">
            Analyze repositories, extract classes and API specs, and export technical documentation as PDF, DOCX, or Markdown.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('generate')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              Generate Documentation
            </button>
            <button
              onClick={() => onNavigate('upload')}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <UploadCloud className="w-3.5 h-3.5 text-indigo-400" />
              Upload New Project
            </button>
          </div>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((st, idx) => {
          const Icon = st.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-slate-900/70 border border-slate-800/90 p-5 backdrop-blur-md shadow-sm hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">{st.title}</span>
                <div className={`p-2 rounded-xl bg-gradient-to-br ${st.color} text-white shadow-sm`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold text-white tracking-tight">{st.value}</div>
                <span className="text-[11px] text-slate-300 font-medium">{st.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigate('analyzer')}
          className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-900 transition-all text-left group"
        >
          <Cpu className="w-5 h-5 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
          <div className="text-xs font-bold text-white">AI Code Analyzer</div>
          <div className="text-[11px] text-slate-300">Inspect AST & functions</div>
        </button>

        <button
          onClick={() => onNavigate('api-docs')}
          className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-900 transition-all text-left group"
        >
          <Globe2 className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
          <div className="text-xs font-bold text-white">API Documentation</div>
          <div className="text-[11px] text-slate-300">REST endpoint reference</div>
        </button>

        <button
          onClick={() => onNavigate('readme')}
          className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-900 transition-all text-left group"
        >
          <FileText className="w-5 h-5 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
          <div className="text-xs font-bold text-white">README Generator</div>
          <div className="text-[11px] text-slate-300">GitHub markdown specs</div>
        </button>

        <button
          onClick={() => onNavigate('explainer')}
          className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-900 transition-all text-left group"
        >
          <Code className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
          <div className="text-xs font-bold text-white">Code Explainer</div>
          <div className="text-[11px] text-slate-300">Algorithm breakdown</div>
        </button>
      </div>

      {/* Recent Projects Section */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-base font-bold text-white">Recent Projects</h2>
            <p className="text-xs text-slate-300">Manage codebases and view generated documentation</p>
          </div>
          <button
            onClick={onOpenNewProjectModal}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            New Project
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-300 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3">Project</th>
                <th className="px-5 py-3">Language</th>
                <th className="px-5 py-3 text-right">Files</th>
                <th className="px-5 py-3">Last Updated</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {projects.map((proj) => (
                <tr
                  key={proj.id}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    activeProject?.id === proj.id ? 'bg-indigo-950/20' : ''
                  }`}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-indigo-400">
                        {proj.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{proj.name}</div>
                        <div className="text-[11px] text-slate-300 max-w-xs truncate">{proj.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-medium">
                      {proj.language}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right font-mono font-medium text-slate-200">
                    {proj.file_count || 18}
                  </td>
                  <td className="px-5 py-4 text-slate-300">
                    {proj.last_updated || 'Today'}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      proj.status === 'Completed'
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50'
                        : 'bg-amber-950/80 text-amber-300 border border-amber-800/50'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        proj.status === 'Completed' ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'
                      }`} />
                      {proj.status || 'Ready'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => {
                        selectProject(proj);
                        onNavigate('editor');
                        showNotification(`Switched active project to "${proj.name}"`);
                      }}
                      className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 font-semibold transition-all"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
