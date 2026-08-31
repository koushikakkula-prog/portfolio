import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  Clock,
  Sparkles,
  Zap,
  FileCode2,
  FolderKanban
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { api } from '../services/api';

export const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      const res = await api.getAnalytics();
      setAnalyticsData(res);
      setLoading(false);
    };
    fetchAnalytics();
  }, []);

  const languageData = analyticsData?.language_distribution || [
    { name: "Python", value: 45, color: "#38bdf8" },
    { name: "Java", value: 30, color: "#818cf8" },
    { name: "JavaScript", value: 15, color: "#fbbf24" },
    { name: "C++", value: 6, color: "#f43f5e" },
    { name: "Others", value: 4, color: "#34d399" },
  ];

  const monthlyHistory = analyticsData?.monthly_generation_history || [
    { month: "Jan", docs: 4, files: 25 },
    { month: "Feb", docs: 8, files: 48 },
    { month: "Mar", docs: 12, files: 70 },
    { month: "Apr", docs: 18, files: 95 },
    { month: "May", docs: 24, files: 130 },
    { month: "Jun", docs: 28, files: 154 },
  ];

  const speedData = [
    { size: '10 KB', time: 1.2 },
    { size: '50 KB', time: 2.1 },
    { size: '200 KB', time: 3.8 },
    { size: '500 KB', time: 5.4 },
    { size: '1 MB', time: 7.9 },
  ];

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/40 text-xs font-semibold text-indigo-300 mb-2">
          <BarChart3 className="w-3.5 h-3.5" />
          Metrics & System Telemetry
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          GenDoc AI Analytics & Performance
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Detailed metrics covering language distribution, generation throughput, and AI parsing velocity.
        </p>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="text-xs font-semibold text-slate-400">Total Projects Analyzed</div>
          <div className="text-3xl font-extrabold text-white">12</div>
          <div className="text-[11px] text-emerald-400 font-medium">↑ 25% increase this month</div>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="text-xs font-semibold text-slate-400">Documents Synthesized</div>
          <div className="text-3xl font-extrabold text-indigo-400">28</div>
          <div className="text-[11px] text-slate-400">100% verified accuracy</div>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="text-xs font-semibold text-slate-400">Total Code Files Processed</div>
          <div className="text-3xl font-extrabold text-cyan-400">154</div>
          <div className="text-[11px] text-slate-400">Across 20+ languages</div>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="text-xs font-semibold text-slate-400">Documentation Efficiency</div>
          <div className="text-3xl font-extrabold text-emerald-400">95.4%</div>
          <div className="text-[11px] text-slate-400">Avg 4.2s / file turnaround</div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Language Breakdown Pie Chart */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-cyan-400" />
              Programming Language Breakdown
            </h3>
            <span className="text-xs text-slate-400">Distribution %</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {languageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend Bars */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800">
            {languageData.map((lang) => (
              <div key={lang.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lang.color }} />
                <span className="text-slate-300 font-medium">{lang.name}:</span>
                <span className="text-white font-bold">{lang.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Documents Generated Bar Chart */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              Documentation Generation Velocity
            </h3>
            <span className="text-xs text-slate-400">Monthly Volume</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="docs" name="Documents" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="files" name="Files Analyzed" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>Cumulative throughput growing 35% month-over-month.</span>
          </div>
        </div>

      </div>

      {/* AI Processing Speed Curve */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            AI Parsing & Synthesis Latency (Seconds vs Archive Size)
          </h3>
          <span className="text-xs text-emerald-400 font-mono">Sub-10s Target</span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={speedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="size" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} unit="s" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Line type="monotone" dataKey="time" name="Processing Time (s)" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
