import React, { useState } from 'react';
import {
  Search,
  Bell,
  FolderKanban,
  Sparkles,
  ChevronDown,
  Menu,
  CheckCircle2,
  ExternalLink,
  Code2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';

export const Header = ({ onToggleMobileSidebar, onOpenNewProjectModal }) => {
  const { user } = useAuth();
  const { projects, activeProject, selectProject, notification } = useProject();
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notificationsList = [
    { id: 1, title: "Documentation Generated", desc: "Student Management System v1.2 ready for export", time: "5m ago", unread: true },
    { id: 2, title: "Code Analysis Finished", desc: "Parsed 18 Python files and 47 functions", time: "1h ago", unread: false },
    { id: 3, title: "AI Model Updated", desc: "Gemini 1.5 Pro inference optimization active", time: "3h ago", unread: false },
  ];

  return (
    <header className="h-16 bg-slate-950/80 border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
      
      {/* Left side: Mobile Toggle & Project Switcher */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Project Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProjectDropdown(!showProjectDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-sm text-slate-200 transition-colors shadow-sm"
          >
            <FolderKanban className="w-4 h-4 text-indigo-400" />
            <span className="font-medium max-w-[140px] sm:max-w-[200px] truncate">
              {activeProject ? activeProject.name : 'Select Project'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProjectDropdown && (
            <div className="absolute left-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-xl shadow-black/40 py-2 z-50 animate-fadeIn">
              <div className="px-3 py-1 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Active Projects
              </div>
              <div className="max-h-60 overflow-y-auto mt-1">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { selectProject(p); setShowProjectDropdown(false); }}
                    className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-slate-800/80 transition-colors ${
                      activeProject?.id === p.id ? 'bg-indigo-600/15 text-indigo-300 font-medium' : 'text-slate-300'
                    }`}
                  >
                    <div className="truncate">
                      <div className="truncate">{p.name}</div>
                      <div className="text-[10px] text-slate-300">{p.language} • {p.file_count || 0} files</div>
                    </div>
                    {activeProject?.id === p.id && <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />}
                  </button>
                ))}
              </div>
              <div className="p-2 border-t border-slate-800 mt-1">
                <button
                  onClick={() => { setShowProjectDropdown(false); onOpenNewProjectModal(); }}
                  className="w-full py-1.5 text-center text-xs font-semibold text-indigo-400 bg-indigo-950/40 border border-indigo-800/50 rounded-lg hover:bg-indigo-900/40 transition-colors"
                >
                  + New Project
                </button>
              </div>
            </div>
          )}
        </div>

        {/* AI Engine Status Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-950/50 border border-indigo-800/40 text-[11px] font-medium text-indigo-300">
          <Sparkles className="w-3 h-3 text-cyan-300 animate-pulse" />
          <span>AST + Generative AI Ready</span>
        </div>
      </div>

      {/* Right side: Global Search, Notifications, Profile */}
      <div className="flex items-center gap-3">
        
        {/* Search Bar */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search classes, APIs, functions..."
            className="w-56 lg:w-72 pl-9 pr-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800 rounded-xl hover:bg-slate-800/80 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-xl shadow-black/40 p-3 z-50 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-200">Notifications</span>
                <span className="text-[10px] text-indigo-400 cursor-pointer">Mark all as read</span>
              </div>
              <div className="divide-y divide-slate-800/60 max-h-64 overflow-y-auto">
                {notificationsList.map((n) => (
                  <div key={n.id} className="py-2.5 space-y-0.5 hover:bg-slate-800/40 px-1 rounded-lg transition-colors">
                    <div className="text-xs font-medium text-slate-200 flex items-center justify-between">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Chip */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white shadow-md">
            {user ? user.name.charAt(0) : 'A'}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-200">{user ? user.name : 'Alex Rivera'}</div>
            <div className="text-[10px] text-slate-300">Lead Architect</div>
          </div>
        </div>

      </div>

      {/* Global Notification Banner */}
      {notification && (
        <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl border text-sm font-medium shadow-2xl flex items-center gap-2 animate-slideUp ${
          notification.type === 'success' ? 'bg-emerald-950/90 text-emerald-300 border-emerald-800/80 shadow-emerald-950/50' : 'bg-rose-950/90 text-rose-300 border-rose-800/80'
        }`}>
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification.message}</span>
        </div>
      )}
    </header>
  );
};
