import React from 'react';
import { Logo } from './Logo';
import {
  LayoutDashboard,
  FolderKanban,
  UploadCloud,
  FileCode2,
  History,
  Cpu,
  Globe2,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';

export const Sidebar = ({ activeTab, onSelectTab, isCollapsed, onToggleCollapse, onOpenLanding }) => {
  const { user, logout } = useAuth();
  const { activeProject } = useProject();

  const menuGroups = [
    {
      title: 'CORE WORKSPACE',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'projects', label: 'Projects', icon: FolderKanban, badge: activeProject ? activeProject.name.slice(0, 10) + '...' : null },
        { id: 'upload', label: 'Upload Code', icon: UploadCloud },
      ]
    },
    {
      title: 'AI DOCUMENTATION',
      items: [
        { id: 'generate', label: 'Generate Documentation', icon: Sparkles, highlight: true },
        { id: 'editor', label: 'Documentation Editor', icon: FileCode2 },
        { id: 'analyzer', label: 'AI Code Analyzer', icon: Cpu },
        { id: 'api-docs', label: 'API Documentation', icon: Globe2 },
        { id: 'readme', label: 'README Generator', icon: FileText },
        { id: 'explainer', label: 'Code Explainer', icon: FileCode2 },
      ]
    },
    {
      title: 'INSIGHTS & MANAGE',
      items: [
        { id: 'history', label: 'Documentation History', icon: History },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  return (
    <aside className={`fixed left-0 top-0 bottom-0 z-40 bg-slate-950/95 border-r border-slate-800/80 flex flex-col transition-all duration-300 backdrop-blur-xl ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Sidebar Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
        {!isCollapsed ? (
          <div className="cursor-pointer" onClick={onOpenLanding}>
            <Logo size="sm" />
          </div>
        ) : (
          <div className="mx-auto cursor-pointer" onClick={onOpenLanding}>
            <Sparkles className="w-6 h-6 text-indigo-400" />
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800/60 hidden lg:flex"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 text-[11px] font-semibold tracking-wider text-slate-300 uppercase mb-2">
                {group.title}
              </div>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  title={isCollapsed ? item.label : ''}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/10 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                  } ${item.highlight && !isActive ? 'hover:border hover:border-indigo-500/20' : ''}`}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'
                  } ${item.highlight ? 'text-indigo-400' : ''}`} />

                  {!isCollapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}

                  {!isCollapsed && item.badge && (
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded-md border border-slate-700">
                      {item.badge}
                    </span>
                  )}

                  {!isCollapsed && item.highlight && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  )}

                  {/* Active Indicator Bar */}
                  {isActive && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-500 rounded-r-full" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* User Profile & Logout Bottom Bar */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
        {!isCollapsed ? (
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800/80">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white shadow-sm shrink-0">
                {user ? user.name.charAt(0) : 'A'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">{user ? user.name : 'Alex Rivera'}</div>
                <div className="text-[10px] text-slate-300 truncate">demo@gendoc.ai</div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800/80 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={logout}
            title="Logout"
            className="w-full flex justify-center p-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-900 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </aside>
  );
};
