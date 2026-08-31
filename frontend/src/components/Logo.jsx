import React from 'react';
import { Sparkles, FileText, Code2 } from 'lucide-react';

export const Logo = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: { icon: 'w-4 h-4', box: 'w-7 h-7', text: 'text-lg', sub: 'text-[10px]' },
    md: { icon: 'w-5 h-5', box: 'w-9 h-9', text: 'text-xl', sub: 'text-xs' },
    lg: { icon: 'w-7 h-7', box: 'w-12 h-12', text: 'text-2xl', sub: 'text-sm' }
  };

  const s = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className={`relative ${s.box} rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-blue-600 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center group`}>
        <div className="w-full h-full bg-slate-950/80 rounded-[10px] flex items-center justify-center relative overflow-hidden backdrop-blur-sm">
          {/* Subtle glow layer */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Multi-element icon combining Document, Brackets, and Sparkle */}
          <div className="relative flex items-center justify-center">
            <FileText className={`${s.icon} text-indigo-300 transform -rotate-6 transition-transform group-hover:rotate-0`} />
            <Sparkles className="w-3 h-3 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
            <Code2 className="w-2.5 h-2.5 text-cyan-300 absolute -bottom-0.5 -left-0.5" />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-bold tracking-tight text-white ${s.text}`}>
            GenDoc <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">AI</span>
          </span>
        </div>
        <span className={`text-slate-400 font-medium tracking-wide ${s.sub}`}>
          Technical Doc Generator
        </span>
      </div>
    </div>
  );
};
