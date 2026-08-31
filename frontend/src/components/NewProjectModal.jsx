import React, { useState } from 'react';
import {
  X,
  FolderPlus,
  Sparkles,
  UploadCloud,
  FileCode,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { useProject } from '../context/ProjectContext';

export const NewProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
  const { loadProjects, selectProject, showNotification } = useProject();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('Python');
  const [projectType, setProjectType] = useState('Web Application');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    const res = await api.createProject({
      name,
      description,
      language,
      project_type: projectType
    });
    setLoading(false);

    showNotification(`Project "${name}" created successfully!`);
    await loadProjects();
    onClose();
    if (onProjectCreated) onProjectCreated(res.project_id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl shadow-black/80 animate-scaleUp">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create New Project</h3>
              <p className="text-xs text-slate-400">Initialize a new codebase for documentation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Project Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Healthcare Patient Portal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Project Description
            </label>
            <textarea
              rows={2}
              placeholder="Brief description of application capabilities and architecture..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Primary Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="JavaScript">JavaScript</option>
                <option value="TypeScript">TypeScript</option>
                <option value="C++">C++</option>
                <option value="React">React</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Project Type
              </label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Web Application">Web Application</option>
                <option value="Mobile Application">Mobile Application</option>
                <option value="API">API / Microservice</option>
                <option value="Desktop Application">Desktop Application</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-blue-600 hover:from-indigo-600 hover:via-purple-700 hover:to-blue-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>{loading ? 'Creating...' : 'Create Project'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
