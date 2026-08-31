import React, { useState, useEffect } from 'react';
import {
  Award,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Eye,
  CheckCircle2,
  Sparkles,
  User,
  Layers,
  ChevronDown,
  FileSpreadsheet,
  Building,
  MapPin,
  Clock,
  RotateCcw
} from 'lucide-react';
import { ScoreGauge } from '../components/ScoreGauge';
import { AIDisclaimer } from '../components/AIDisclaimer';
import { AIResumeAnalysisModal } from '../components/AIResumeAnalysisModal';
import confetti from 'canvas-confetti';

export const CandidateRankingPage = ({ selectedJobId, setSelectedJobId, setActivePage }) => {
  const [jobs, setJobs] = useState([]);
  const [currentJobId, setCurrentJobId] = useState(selectedJobId || 1);
  const [jobData, setJobData] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [minScore, setMinScore] = useState(0);
  const [skillFilter, setSkillFilter] = useState('');
  const [minExp, setMinExp] = useState(0);
  const [sortBy, setSortBy] = useState('final_score');

  // Modal State
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    fetchJobsList();
  }, []);

  useEffect(() => {
    if (currentJobId) {
      fetchRankedCandidates();
    }
  }, [currentJobId, search, minScore, skillFilter, minExp, sortBy]);

  const fetchJobsList = async () => {
    try {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      setJobs(data.jobs || []);
      if (data.jobs?.length > 0 && !selectedJobId) {
        setCurrentJobId(data.jobs[0].id);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  const fetchRankedCandidates = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        job_id: currentJobId,
        search,
        min_score: minScore,
        skill: skillFilter,
        min_exp: minExp,
        sort_by: sortBy
      });

      const res = await fetch(`/api/rank-candidates?${params.toString()}`);
      const data = await res.json();
      setJobData(data.job || null);
      setCandidates(data.candidates || []);
    } catch (err) {
      console.error("Error fetching candidate rankings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleShortlist = async (candidateId) => {
    try {
      const res = await fetch('/api/shortlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate_id: candidateId,
          job_id: currentJobId,
          recruiter_id: 1
        })
      });
      const data = await res.json();

      if (data.is_shortlisted) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      }

      // Update candidate in local state
      setCandidates(candidates.map(c => {
        if (c.candidate_id === candidateId) {
          return {
            ...c,
            is_shortlisted: data.is_shortlisted,
            status: data.is_shortlisted ? 'Shortlisted' : 'Review'
          };
        }
        return c;
      }));

      if (selectedCandidate && selectedCandidate.candidate_id === candidateId) {
        setSelectedCandidate({
          ...selectedCandidate,
          is_shortlisted: data.is_shortlisted,
          status: data.is_shortlisted ? 'Shortlisted' : 'Review'
        });
      }

    } catch (err) {
      console.error("Error toggling shortlist:", err);
    }
  };

  const handleExportCSV = () => {
    if (!candidates.length) return;
    const headers = ["Rank", "Candidate Name", "Email", "Phone", "Experience", "Skills Match (%)", "Experience Match (%)", "Final AI Score (%)", "Status"];
    const rows = candidates.map(c => [
      `#${c.rank}`,
      `"${c.candidate_name}"`,
      c.email,
      c.phone,
      `"${c.experience_years} Yrs"`,
      c.skills_score,
      c.experience_score,
      c.final_score,
      c.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `candidate_rankings_job_${currentJobId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetFilters = () => {
    setSearch('');
    setMinScore(0);
    setSkillFilter('');
    setMinExp(0);
    setSortBy('final_score');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                AI Candidate Ranking
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Automated multi-factor candidate scoring and smart ranking dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Job Selector Dropdown */}
        <div className="flex items-center gap-3">
          <div className="relative min-w-[260px]">
            <select
              value={currentJobId}
              onChange={(e) => {
                const id = parseInt(e.target.value);
                setCurrentJobId(id);
                if (setSelectedJobId) setSelectedJobId(id);
              }}
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

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
            title="Export rankings as CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* AI Decision Notice Banner */}
      <AIDisclaimer />

      {/* Active Job Requirements Card */}
      {jobData && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Evaluating Requirements for:</span>
                <span className="px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 font-bold text-xs border border-indigo-800/40">
                  {jobData.title}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-xs text-slate-400 font-semibold">Required Skills:</span>
                {jobData.required_skills?.map((s, i) => (
                  <span key={i} className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400 border-t lg:border-t-0 pt-2 lg:pt-0 border-slate-800">
              <div>
                <span className="font-semibold text-slate-300">Min Exp: </span>
                <span>{jobData.min_experience} Yrs</span>
              </div>
              <div>
                <span className="font-semibold text-slate-300">Education: </span>
                <span>{jobData.education?.split(' in ')[0] || "Bachelor's"}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-300">Total Ranked: </span>
                <span className="font-bold text-emerald-400">{candidates.length} Candidates</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-md space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidate name..."
              className="w-full bg-slate-800/70 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Skill Filter */}
          <div className="relative">
            <input
              type="text"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              placeholder="Filter by skill (e.g. Python, SQL)"
              className="w-full bg-slate-800/70 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Min Score Slider / Dropdown */}
          <div>
            <select
              value={minScore}
              onChange={(e) => setMinScore(parseFloat(e.target.value))}
              className="w-full bg-slate-800/70 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="0">All Match Scores (0%+)</option>
              <option value="90">Top Matches Only (90%+)</option>
              <option value="85">High Matches (85%+)</option>
              <option value="75">Good Matches (75%+)</option>
            </select>
          </div>

          {/* Experience Filter */}
          <div>
            <select
              value={minExp}
              onChange={(e) => setMinExp(parseFloat(e.target.value))}
              className="w-full bg-slate-800/70 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="0">Any Experience</option>
              <option value="1">1+ Years Experience</option>
              <option value="2">2+ Years Experience</option>
              <option value="3">3+ Years Experience</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-800/70 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="final_score">Sort by AI Score ↓</option>
              <option value="skills">Sort by Skills Score ↓</option>
              <option value="experience">Sort by Experience ↓</option>
            </select>

            {(search || minScore > 0 || skillFilter || minExp > 0 || sortBy !== 'final_score') && (
              <button
                onClick={handleResetFilters}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition-all"
                title="Reset Filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Main Candidate Ranking Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-4 px-5 text-center w-16">Rank</th>
                <th className="py-4 px-6">Candidate</th>
                <th className="py-4 px-6 text-center">Skills Match</th>
                <th className="py-4 px-6 text-center">Experience</th>
                <th className="py-4 px-6 text-center">AI Score</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {candidates.length > 0 ? (
                candidates.map((cand) => {
                  const isTop3 = cand.rank <= 3;
                  const rankBadgeClass =
                    cand.rank === 1
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                      : cand.rank === 2
                      ? 'bg-slate-300/20 text-slate-200 border-slate-400/40'
                      : cand.rank === 3
                      ? 'bg-amber-700/20 text-amber-400 border-amber-700/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700';

                  return (
                    <tr key={cand.candidate_id} className="hover:bg-slate-800/40 transition-colors group">
                      
                      {/* Rank Badge */}
                      <td className="py-4 px-5 text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-xl font-black text-xs border ${rankBadgeClass}`}>
                          #{cand.rank}
                        </span>
                      </td>

                      {/* Candidate Avatar & Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={cand.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${cand.candidate_name.replace(' ', '')}`}
                            alt={cand.candidate_name}
                            className="w-10 h-10 rounded-xl bg-slate-800 p-0.5 border border-slate-700 group-hover:border-indigo-500 transition-colors"
                          />
                          <div>
                            <div className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">
                              {cand.candidate_name}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {cand.headline || `${cand.experience_years} Yrs Exp • ${cand.education_level}`}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Skills Score Bar */}
                      <td className="py-4 px-6 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="font-bold text-emerald-400 text-xs">
                            {cand.skills_score}%
                          </span>
                          <div className="w-16 bg-slate-800 rounded-full h-1 mt-1">
                            <div
                              className="bg-emerald-500 h-1 rounded-full"
                              style={{ width: `${cand.skills_score}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* Experience Match */}
                      <td className="py-4 px-6 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="font-bold text-blue-400 text-xs">
                            {cand.experience_score}%
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {cand.experience_years} Yrs Exp
                          </span>
                        </div>
                      </td>

                      {/* AI Final Score Indicator */}
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-900/60 to-purple-900/60 border border-indigo-500/40 text-white font-extrabold text-xs shadow-md">
                          <Sparkles className="w-3 h-3 text-indigo-400" />
                          <span>{cand.final_score}%</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${
                            cand.is_shortlisted || cand.status === 'Shortlisted'
                              ? 'bg-purple-950/60 text-purple-300 border-purple-800/50'
                              : cand.status === 'Interview'
                              ? 'bg-blue-950/60 text-blue-300 border-blue-800/50'
                              : 'bg-slate-800/80 text-slate-400 border-slate-700'
                          }`}
                        >
                          {cand.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleShortlist(cand.candidate_id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              cand.is_shortlisted
                                ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/30'
                                : 'bg-slate-800 hover:bg-purple-950/60 hover:text-purple-300 text-slate-300 border border-slate-700'
                            }`}
                          >
                            {cand.is_shortlisted ? 'Shortlisted' : 'Shortlist'}
                          </button>

                          <button
                            onClick={() => setSelectedCandidate(cand)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
                            title="View AI Candidate Breakdown"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <a
                            href={`/api/download-resume/${cand.resume_id || 1}`}
                            download
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all inline-block"
                            title="Download Resume PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500 text-xs">
                    {loading ? "Loading candidate rankings..." : "No candidates found matching the selected filters."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Candidate Deep Profile Analysis Modal */}
      {selectedCandidate && (
        <AIResumeAnalysisModal
          candidate={selectedCandidate}
          job={jobData}
          onClose={() => setSelectedCandidate(null)}
          onToggleShortlist={handleToggleShortlist}
        />
      )}

    </div>
  );
};
