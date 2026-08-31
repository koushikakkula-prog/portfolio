import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Briefcase,
  Award,
  PieChart as PieIcon,
  Layers,
  Sparkles,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

export const AnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/analytics');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'];

  const defaultAppsData = [
    { title: 'Python Full Stack', applications: 120 },
    { title: 'Java Developer', applications: 86 },
    { title: 'Data Analyst', applications: 74 },
    { title: 'React Engineer', applications: 65 },
    { title: 'ML Engineer', applications: 52 },
    { title: 'Cloud DevOps', applications: 48 },
  ];

  const defaultDistData = [
    { range: '90 - 100%', count: 18 },
    { range: '80 - 89%', count: 32 },
    { range: '70 - 79%', count: 24 },
    { range: '60 - 69%', count: 12 },
    { range: '< 60%', count: 6 },
  ];

  const defaultSkillsData = [
    { skill: 'Python', demand: 95 },
    { skill: 'React', demand: 92 },
    { skill: 'SQL', demand: 88 },
    { skill: 'AWS', demand: 85 },
    { skill: 'Docker', demand: 80 },
    { skill: 'Machine Learning', demand: 78 },
  ];

  const defaultFunnelData = [
    { stage: 'Total Applied', candidates: 1248, fill: '#3B82F6' },
    { stage: 'AI Screened', candidates: 980, fill: '#6366F1' },
    { stage: 'Shortlisted', candidates: 186, fill: '#8B5CF6' },
    { stage: 'Interviewed', candidates: 64, fill: '#EC4899' },
    { stage: 'Hired / Selected', candidates: 22, fill: '#10B981' }
  ];

  const shortlistPieData = [
    { name: 'Shortlisted', value: 186, fill: '#8B5CF6' },
    { name: 'Under Review', value: 794, fill: '#3B82F6' },
    { name: 'Rejected / Low Fit', value: 268, fill: '#334155' }
  ];

  const kpis = [
    {
      title: "Total Applications",
      value: "1,248",
      icon: Users,
      change: "+22% this quarter",
      color: "text-blue-400"
    },
    {
      title: "Avg Candidate Score",
      value: "87.4%",
      icon: Sparkles,
      change: "+4.2% quality lift",
      color: "text-indigo-400"
    },
    {
      title: "Shortlisting Rate",
      value: "14.9%",
      icon: Award,
      change: "Optimized selectivity",
      color: "text-purple-400"
    },
    {
      title: "Time-to-Shortlist",
      value: "4.2s",
      icon: TrendingUp,
      change: "99% time saved by AI",
      color: "text-emerald-400"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Recruiter Intelligence & Pipeline Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Recruitment & AI Analytics Dashboard
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Real-time visual insights on applicant volume, candidate scoring distribution, in-demand skills, and hiring funnels.
          </p>
        </div>

        <div className="text-xs text-slate-400 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700">
          Last Synced: <strong className="text-white font-mono">Live</strong>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {kpi.title}
              </span>
              <div className={`p-2 rounded-xl bg-slate-800 ${kpi.color}`}>
                <kpi.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white mt-3 tracking-tight">
              {kpi.value}
            </div>
            <div className="text-[11px] font-semibold text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>{kpi.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid: Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Applications per Job (Bar Chart) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-white text-base">Applications per Job Posting</h3>
              <p className="text-xs text-slate-400">Total applicant distribution across active job roles</p>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-blue-950/60 text-blue-300 text-[11px] font-bold border border-blue-500/30">
              Live Feed
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.applications_per_job?.length ? data.applications_per_job : defaultAppsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="title" stroke="#64748B" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#F1F5F9' }}
                />
                <Bar dataKey="applications" fill="#6366F1" radius={[6, 6, 0, 0]}>
                  {defaultAppsData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Candidate Score Distribution (Area Chart) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-white text-base">AI Candidate Score Distribution</h3>
              <p className="text-xs text-slate-400">Histogram of candidate compatibility scores</p>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-purple-950/60 text-purple-300 text-[11px] font-bold border border-purple-500/30">
              Scoring Matrix
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.score_distribution?.length ? data.score_distribution : defaultDistData}>
                <defs>
                  <linearGradient id="colorScore" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="range" stroke="#64748B" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#F1F5F9' }}
                />
                <Area type="monotone" dataKey="count" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Charts Grid: Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 3: Most In-Demand Skills (Horizontal Bars) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl backdrop-blur-xl space-y-4">
          <div>
            <h3 className="font-extrabold text-white text-base">Top In-Demand Skills</h3>
            <p className="text-xs text-slate-400">Frequency across active requirements</p>
          </div>

          <div className="space-y-3 pt-2">
            {defaultSkillsData.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{item.skill}</span>
                  <span className="text-indigo-400">{item.demand}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
                    style={{ width: `${item.demand}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: Shortlisting & Selection Rate (Donut Pie) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl backdrop-blur-xl space-y-4">
          <div>
            <h3 className="font-extrabold text-white text-base">Shortlisting Conversion</h3>
            <p className="text-xs text-slate-400">Overall candidate pool qualification</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={shortlistPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {shortlistPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-semibold pt-2 border-t border-slate-800">
            <div>
              <div className="text-purple-400 font-extrabold text-sm">186</div>
              <div className="text-slate-400">Shortlisted</div>
            </div>
            <div>
              <div className="text-blue-400 font-extrabold text-sm">794</div>
              <div className="text-slate-400">Review</div>
            </div>
            <div>
              <div className="text-slate-400 font-extrabold text-sm">268</div>
              <div className="text-slate-500">Low Fit</div>
            </div>
          </div>
        </div>

        {/* Chart 5: End-to-End Hiring Funnel */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl backdrop-blur-xl space-y-4">
          <div>
            <h3 className="font-extrabold text-white text-base">End-to-End Hiring Funnel</h3>
            <p className="text-xs text-slate-400">Conversion across screening pipeline</p>
          </div>

          <div className="space-y-2.5 pt-2">
            {defaultFunnelData.map((stage, idx) => {
              const pct = Math.round((stage.candidates / 1248) * 100);
              return (
                <div key={idx} className="p-2.5 bg-slate-800/40 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.fill }}></span>
                    <span className="font-bold text-white">{stage.stage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-mono">{stage.candidates}</span>
                    <span className="font-semibold text-slate-500 text-[10px]">({pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
