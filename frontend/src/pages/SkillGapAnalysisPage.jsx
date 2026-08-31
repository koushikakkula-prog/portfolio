import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  TrendingUp,
  BookOpen,
  ArrowRight,
  ChevronDown,
  Layers,
  Award,
  Zap,
  Target
} from 'lucide-react';
import { ScoreGauge } from '../components/ScoreGauge';

export const SkillGapAnalysisPage = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(1);
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Candidate interactive custom skill toggles for live what-if simulation
  const [customSkills, setCustomSkills] = useState(['Python', 'SQL', 'Flask', 'React']);
  const [newSkillInput, setNewSkillInput] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      fetchAnalysis();
    }
  }, [selectedJobId]);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      const candId = user?.candidate_id || 1;
      const res = await fetch(`/api/skill-gap-analysis?candidate_id=${candId}&job_id=${selectedJobId}`);
      const data = await res.json();
      setAnalysisData(data);
    } catch (err) {
      console.error("Error fetching skill gap:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkillInput.trim() && !customSkills.includes(newSkillInput.trim())) {
      setCustomSkills([...customSkills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setCustomSkills(customSkills.filter(s => s !== skill));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Career Intelligence & Upskilling</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Skill Gap Analysis
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Compare your verified skillset directly against target job requirements and receive tailored learning paths.
          </p>
        </div>

        {/* Job Selector */}
        <div className="relative min-w-[280px]">
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Select Target Job
          </label>
          <div className="relative">
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(parseInt(e.target.value))}
              className="w-full bg-slate-800/90 border border-indigo-500/40 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-lg focus:outline-none focus:border-indigo-400 cursor-pointer appearance-none pr-10"
            >
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-indigo-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Analysis Card */}
      {analysisData && (
        <div className="space-y-6">
          
          {/* Top Comparison Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Overall Gauge */}
            <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-xl backdrop-blur-xl space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Skill Match Compatibility
              </span>
              <ScoreGauge
                score={analysisData.skill_match_percentage || 80.0}
                size={150}
                strokeWidth={14}
                showLabel={true}
              />
              <div className="text-xs text-slate-300">
                Overall Candidate AI Score: <strong className="text-white text-sm">{analysisData.overall_score || 92.4}%</strong>
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-950 border border-indigo-500/40 text-indigo-300 text-[11px] font-semibold">
                High Match Alignment
              </span>
            </div>

            {/* Right: Side-by-Side Comparison Box */}
            <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-6">
              
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-400" />
                  <span>Requirements vs Candidate Skill Alignment</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Target Role: <strong className="text-indigo-300">{analysisData.job_title}</strong>
                </p>
              </div>

              {/* Side-by-side Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Column 1: Job Requirements */}
                <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Job Requirements ({analysisData.required_skills?.length || 5})
                  </div>
                  <div className="space-y-2">
                    {analysisData.required_skills?.map((skill, idx) => {
                      const isMatched = analysisData.matched_skills?.some(
                        s => s.toLowerCase() === skill.toLowerCase()
                      );
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-medium text-slate-200"
                        >
                          <span>{skill}</span>
                          {isMatched ? (
                            <span className="flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Matched</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-rose-400 font-bold text-[11px]">
                              <XCircle className="w-4 h-4" />
                              <span>Missing</span>
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Column 2: Candidate Skills */}
                <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Candidate Profile Skills
                  </div>
                  <div className="space-y-2">
                    {analysisData.required_skills?.map((skill, idx) => {
                      const isMatched = analysisData.matched_skills?.some(
                        s => s.toLowerCase() === skill.toLowerCase()
                      );
                      return (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-2 rounded-xl border text-xs font-medium ${
                            isMatched
                              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                              : 'bg-rose-950/40 border-rose-500/30 text-rose-200'
                          }`}
                        >
                          <span>{skill}</span>
                          <span>{isMatched ? "✓ Present" : "✗ Missing"}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* Missing Skills & AI Recommendations Card */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Personalized AI Upskilling Recommendations
                </h3>
                <p className="text-xs text-slate-400">
                  Targeted learning actions to elevate your score to 95%+
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analysisData.missing_skills?.length > 0 ? (
                analysisData.missing_skills.map((miss, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-slate-900/80 border border-indigo-500/20 rounded-2xl space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md bg-rose-950/60 text-rose-300 font-bold text-xs border border-rose-500/30">
                        Missing Skill
                      </span>
                      <span className="text-[10px] font-semibold text-indigo-400">+15% Score Boost</span>
                    </div>
                    
                    <h4 className="font-extrabold text-white text-base">
                      {miss}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      Learn {miss} fundamentals and build a working microservice or deployment pipeline to fulfill this core requirement.
                    </p>

                    <div className="pt-2">
                      <a
                        href={`https://www.google.com/search?q=learn+${miss}+tutorials+guide`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300"
                      >
                        <span>Recommended Curriculum</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 p-6 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h4 className="font-bold text-white text-base">100% Skill Requirements Fulfilled!</h4>
                  <p className="text-xs text-slate-300">
                    Your skills cover all core technical requirements. Prepare for architectural and behavioral interview discussions.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
