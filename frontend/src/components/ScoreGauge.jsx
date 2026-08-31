import React from 'react';

export const ScoreGauge = ({ score = 85, size = 120, strokeWidth = 10, showLabel = true }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  const getColor = (s) => {
    if (s >= 90) return { stroke: 'url(#gradient-green)', text: 'text-emerald-400', glow: 'rgba(16, 185, 129, 0.4)' };
    if (s >= 80) return { stroke: 'url(#gradient-blue)', text: 'text-blue-400', glow: 'rgba(59, 130, 246, 0.4)' };
    if (s >= 70) return { stroke: 'url(#gradient-purple)', text: 'text-indigo-400', glow: 'rgba(99, 102, 241, 0.4)' };
    return { stroke: 'url(#gradient-amber)', text: 'text-amber-400', glow: 'rgba(245, 158, 11, 0.4)' };
  };

  const colors = getColor(clampedScore);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id="gradient-green" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
          <linearGradient id="gradient-purple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          <linearGradient id="gradient-amber" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1E293B"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className={`font-bold tracking-tight ${size < 90 ? 'text-lg' : 'text-2xl'} ${colors.text}`}>
          {clampedScore}%
        </span>
        {showLabel && (
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
            AI Match
          </span>
        )}
      </div>
    </div>
  );
};
