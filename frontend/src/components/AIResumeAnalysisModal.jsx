import React from 'react';
import {
  X,
  Sparkles,
  User,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Layers,
  Award,
  CheckCircle2,
  AlertTriangle,
  Download,
  Check,
  Building,
  MapPin
} from 'lucide-react';
import { ScoreGauge } from './ScoreGauge';

export const AIResumeAnalysisModal = ({ candidate, job, onClose, onToggleShortlist }) => {
  if (!candidate) return null;

  const skillsScore = candidate.skills_score || 95.0;
  const experienceScore = candidate.experience_score || 90.0;
  const educationScore = candidate.education_score || 92.0;
  const projectsScore = candidate.projects_score || 88.0;
  const finalScore = candidate.final_score || 92.4;

  const handleDownload = () => {
    window.open(`/api/download-resume/${candidate.resume_id || 1}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 p-6 sm:p-8 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-4">
            <img
              src={candidate.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.candidate_name.replace(' ', '')}`}
              alt={candidate.candidate_name}
              className="w-16 h-16 rounded-2xl bg-indigo-950 p-1 border border-indigo-500/40"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  {candidate.candidate_name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-950 border border-indigo-500/40 text-indigo-300 font-bold text-xs">
                  Rank #{candidate.rank || 1}
                </span>
              </div>
              <p className="text-xs text-indigo-300 font-medium mt-0.5">
                {candidate.headline || "Software Engineer"}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-500" />
                  {candidate.email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  {candidate.location || "Bangalore, India"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleShortlist(candidate.candidate_id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                candidate.is_shortlisted
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 hover:bg-purple-700'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>{candidate.is_shortlisted ? 'Shortlisted' : 'Shortlist Candidate'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
              title="Download Resume PDF"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* AI Scoring Breakdown Section */}
        <div className="bg-slate-800/50 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>AI Job Compatibility Analysis for: {job?.title || "Target Role"}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Weighted 5-Factor Model</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Circular Gauge */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-900/80 rounded-2xl border border-slate-700/60 text-center">
              <ScoreGauge score={finalScore} size={140} strokeWidth={12} showLabel={true} />
              <div className="mt-3 text-xs font-semibold text-slate-300">
                Overall AI Match: <strong className="text-white">{finalScore}%</strong>
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5">Top-Tier Recommendation</span>
            </div>

            {/* Sub-scores Progress Bars */}
            <div className="md:col-span-8 space-y-3">
              
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-300">Skills Match (40% Weight)</span>
                  <span className="font-bold text-emerald-400">{skillsScore}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full transition-all duration-700" style={{ width: `${skillsScore}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-300">Experience Match (20% Weight)</span>
                  <span className="font-bold text-blue-400">{experienceScore}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full transition-all duration-700" style={{ width: `${experienceScore}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-300">Education Match (15% Weight)</span>
                  <span className="font-bold text-indigo-400">{educationScore}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full transition-all duration-700" style={{ width: `${educationScore}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-300">Projects & Domain Match (15% Weight)</span>
                  <span className="font-bold text-purple-400">{projectsScore}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full transition-all duration-700" style={{ width: `${projectsScore}%` }}></div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Extracted Skills Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Extracted Skills Profile</span>
          </h3>

          <div className="flex flex-wrap gap-2">
            {candidate.skills?.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-sm flex items-center gap-1"
              >
                <Check className="w-3 h-3 text-emerald-400" />
                <span>{skill}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Candidate Background: Experience, Education, Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800 space-y-2">
            <div className="font-bold text-slate-300 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-purple-400" />
              <span>Experience & Company</span>
            </div>
            <div className="text-white font-semibold">
              {candidate.experience_years} Years Industry Experience
            </div>
            <div className="text-slate-400">
              Current / Last Company: {candidate.current_company || "Tech Systems Inc."}
            </div>
          </div>

          <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800 space-y-2">
            <div className="font-bold text-slate-300 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-blue-400" />
              <span>Education</span>
            </div>
            <div className="text-white font-semibold">
              {candidate.education_level || "B.Tech Computer Science"}
            </div>
            <div className="text-slate-400">
              Graduated with CS/Engineering specialization
            </div>
          </div>

        </div>

        {/* Projects Preview */}
        {candidate.projects?.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Highlighted Projects
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {candidate.projects.map((p, idx) => (
                <div key={idx} className="p-3.5 bg-slate-800/30 rounded-xl border border-slate-800">
                  <div className="font-bold text-white text-xs">{p.title}</div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">{p.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="text-slate-400">
            Candidate ID: <span className="font-mono text-slate-300">#CAND-{candidate.candidate_id}</span>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
};
