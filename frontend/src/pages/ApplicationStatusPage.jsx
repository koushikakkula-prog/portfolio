import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Clock,
  CheckCircle2,
  Sparkles,
  Building,
  MapPin,
  Calendar,
  AlertCircle,
  Award,
  ChevronRight,
  ArrowRight,
  Briefcase
} from 'lucide-react';
import { ScoreGauge } from '../components/ScoreGauge';

export const ApplicationStatusPage = ({ setActivePage }) => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const STAGES = [
    { name: "Applied", description: "Application & resume received" },
    { name: "Under Review", description: "Profile queued for processing" },
    { name: "AI Screening", description: "Vectorized NLP scoring computed" },
    { name: "Shortlisted", description: "Selected by talent team" },
    { name: "Interview", description: "Technical interview scheduled" },
    { name: "Selected", description: "Offer extended" }
  ];

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const candId = user?.candidate_id || 1;
      const res = await fetch(`/api/candidate/applications?candidate_id=${candId}`);
      const data = await res.json();
      setApplications(data.applications || []);
    } catch (err) {
      console.error("Error loading applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStageIndex = (status) => {
    switch (status) {
      case 'Applied': return 0;
      case 'Under Review': return 1;
      case 'AI Screening': return 2;
      case 'Shortlisted': return 3;
      case 'Interview': return 4;
      case 'Selected': return 5;
      default: return 2;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Recruitment Pipeline Tracker</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Application Status & AI Screening
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Track your stage progression from initial upload to final offer.
          </p>
        </div>

        <button
          onClick={() => setActivePage('find-jobs')}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
        >
          <Briefcase className="w-4 h-4" />
          <span>Browse More Roles</span>
        </button>
      </div>

      {/* Applications List */}
      <div className="space-y-6">
        {applications.length > 0 ? (
          applications.map((app) => {
            const currentStageIdx = getStageIndex(app.status);

            return (
              <div
                key={app.id}
                className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl space-y-6"
              >
                {/* App Top Summary */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                  <div className="flex items-center gap-4">
                    <img
                      src={app.company_logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100"}
                      alt="Company"
                      className="w-12 h-12 rounded-2xl bg-slate-800 object-cover border border-slate-700"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {app.job_title}
                      </h3>
                      <p className="text-xs text-indigo-300">
                        {app.company_name} • {app.department || "Engineering"}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Applied on: {app.applied_at || "Recent"} • Location: {app.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60">
                    <ScoreGauge score={app.match_score || 92.4} size={56} strokeWidth={6} showLabel={false} />
                    <div className="text-left">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">AI Match Score</div>
                      <div className="text-base font-extrabold text-emerald-400">{app.match_score || 92.4}%</div>
                      <div className="text-[10px] text-slate-300 font-medium">Rank #1 in Candidate Pool</div>
                    </div>
                  </div>
                </div>

                {/* 6-Stage Visual Timeline */}
                <div className="space-y-4">
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Pipeline Progression
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                    {STAGES.map((st, idx) => {
                      const isCompleted = idx <= currentStageIdx;
                      const isCurrent = idx === currentStageIdx;

                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-2xl border transition-all ${
                            isCurrent
                              ? 'bg-indigo-950/80 border-indigo-500 text-indigo-200 shadow-lg shadow-indigo-600/10 scale-[1.02]'
                              : isCompleted
                              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                              : 'bg-slate-800/30 border-slate-800 text-slate-500'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                              Step 0{idx + 1}
                            </span>
                            {isCompleted ? (
                              <CheckCircle2 className={`w-4 h-4 ${isCurrent ? 'text-indigo-400' : 'text-emerald-400'}`} />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border border-slate-700"></div>
                            )}
                          </div>
                          
                          <div className={`font-bold text-xs ${isCurrent ? 'text-white' : isCompleted ? 'text-emerald-200' : 'text-slate-500'}`}>
                            {st.name}
                          </div>
                          
                          <div className="text-[10px] text-slate-400 mt-1 leading-tight">
                            {st.description}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Status Callout */}
                <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">AI Screening Feedback: </strong>
                    Candidate exhibits strong alignment with Core Python and React requirements. Profile is placed in the top percentile.
                  </div>
                </div>

              </div>
            );
          })
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-xs">
            {loading ? "Loading applications..." : "No active applications found. Browse jobs to apply!"}
          </div>
        )}
      </div>

    </div>
  );
};
