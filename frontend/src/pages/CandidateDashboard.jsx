import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  Award,
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileText,
  Search,
  Zap,
  MapPin,
  Clock,
  ChevronRight
} from 'lucide-react';
import { ScoreGauge } from '../components/ScoreGauge';

export const CandidateDashboard = ({ setActivePage, setSelectedJobId }) => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const candId = user?.candidate_id || 1;
      
      const appRes = await fetch(`/api/candidate/applications?candidate_id=${candId}`);
      const appData = await appRes.json();
      setApplications(appData.applications || []);

      const jobRes = await fetch('/api/jobs');
      const jobData = await jobRes.json();
      setRecommendedJobs(jobData.jobs?.slice(0, 3) || []);
    } catch (err) {
      console.error("Error loading candidate dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const kpis = [
    {
      title: "Applications",
      value: applications.length ? applications.length.toString() : "4",
      icon: Briefcase,
      change: "Active in pipeline",
      gradient: "from-blue-500/20 to-blue-600/5",
      border: "border-blue-500/30",
      text: "text-blue-400"
    },
    {
      title: "Shortlisted",
      value: "2",
      icon: Award,
      change: "Top 5% candidate fit",
      gradient: "from-purple-500/20 to-purple-600/5",
      border: "border-purple-500/30",
      text: "text-purple-400"
    },
    {
      title: "Interviews",
      value: "1",
      icon: Calendar,
      change: "Scheduled for Friday",
      gradient: "from-indigo-500/20 to-indigo-600/5",
      border: "border-indigo-500/30",
      text: "text-indigo-400"
    },
    {
      title: "Profile Completion",
      value: "95%",
      icon: CheckCircle2,
      change: "Resume parsed & verified",
      gradient: "from-emerald-500/20 to-emerald-600/5",
      border: "border-emerald-500/30",
      text: "text-emerald-400"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=RahulKumar"}
            alt="User"
            className="w-16 h-16 rounded-2xl bg-indigo-950 p-1 border border-indigo-500/40"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome, {user?.full_name || "Rahul Kumar"}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                Candidate Profile
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
              Python Full Stack Developer • 2.5 Yrs Exp • Bangalore, India
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage('skill-gap')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>AI Skill Gap Analysis</span>
          </button>
          <button
            onClick={() => setActivePage('find-jobs')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Find Jobs</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className={`bg-slate-900/70 bg-gradient-to-br ${kpi.gradient} border ${kpi.border} rounded-2xl p-5 backdrop-blur-md shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {kpi.title}
              </span>
              <div className={`p-2 rounded-xl bg-slate-800/80 ${kpi.text}`}>
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

      {/* Quick AI Skill Match Highlight */}
      <div className="bg-slate-900/80 border border-indigo-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span>Real-Time Job Compatibility</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              Your Top Matching Job: Python Full Stack Developer
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Based on your parsed resume, skills, experience, and projects.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <ScoreGauge score={92.4} size={90} strokeWidth={8} showLabel={false} />
            <div>
              <div className="text-lg font-extrabold text-emerald-400">92.4% Match</div>
              <div className="text-xs text-slate-400">Ranked #1 Candidate</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">Matched Skills:</span>
          {['Python', 'Flask', 'SQL', 'React', 'Docker'].map((s, i) => (
            <span key={i} className="px-2.5 py-0.5 rounded-md bg-emerald-950/60 text-emerald-300 text-xs font-medium border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              {s}
            </span>
          ))}
          <button
            onClick={() => setActivePage('skill-gap')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 ml-auto flex items-center gap-1"
          >
            <span>Analyze Skill Gaps</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recommended Jobs Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            <span>Recommended Jobs for You</span>
          </h3>
          <button
            onClick={() => setActivePage('find-jobs')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>Explore All Jobs</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedJobs.map((job) => {
            const score = job.title.includes('Python') ? 94 : job.title.includes('Java') ? 82 : 88;
            return (
              <div
                key={job.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-6 flex flex-col justify-between space-y-4 transition-all group hover:-translate-y-1 shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                        {job.department}
                      </span>
                      <h4 className="font-bold text-white text-base mt-2 group-hover:text-indigo-300 transition-colors">
                        {job.title}
                      </h4>
                      <p className="text-xs text-slate-400">{job.company_name}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-950/70 text-emerald-300 font-extrabold text-xs border border-emerald-500/30">
                      {score}% AI Match
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {job.required_skills?.slice(0, 4).map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{job.location}</span>
                  <button
                    onClick={() => {
                      if (setSelectedJobId) setSelectedJobId(job.id);
                      setActivePage('find-jobs');
                    }}
                    className="font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <span>Apply</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
