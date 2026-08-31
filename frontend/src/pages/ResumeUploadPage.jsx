import React, { useState } from 'react';
import {
  FileUp,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  User,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Layers,
  Award,
  ChevronRight,
  ArrowRight,
  Code2
} from 'lucide-react';
import { AIProgressBar } from '../components/AIProgressBar';
import { ScoreGauge } from '../components/ScoreGauge';

export const ResumeUploadPage = ({ setActivePage, setSelectedJobId }) => {
  const [file, setFile] = useState(null);
  const [pastedText, setPastedText] = useState('');
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'paste'
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const sampleResumeSnippet = `Rahul Kumar
rahul.kumar@example.com | +91 98765 43210
Bangalore, India

Professional Summary:
Passionate Full Stack Python & React Developer with 2.5 years of experience developing robust microservices, REST APIs, and responsive frontends.

Education:
B.Tech in Computer Science and Engineering, 2022

Technical Skills:
Python, Flask, Django, SQL, PostgreSQL, React, JavaScript, HTML5, CSS3, Docker, Git, REST API, AWS, Redis

Projects:
- AI-Powered Recruitment Management Platform (Flask, React, Scikit-learn)
- Scalable E-Commerce Microservices Engine (Python, PostgreSQL, Redis)

Certifications:
- AWS Certified Cloud Practitioner
- Scikit-learn Machine Learning Specialist`;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError('');
    }
  };

  const handleProcessResume = async () => {
    if (activeTab === 'upload' && !file) {
      setError('Please select or drag-and-drop a PDF/DOCX resume file.');
      return;
    }
    if (activeTab === 'paste' && !pastedText.trim()) {
      setError('Please paste resume text to analyze.');
      return;
    }

    setError('');
    setIsProcessing(true);
    setParsedData(null);

    const formData = new FormData();
    if (activeTab === 'upload' && file) {
      formData.append('file', file);
    } else {
      formData.append('text', pastedText);
    }

    try {
      const res = await fetch('/api/upload-resume', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to process resume');

      // Let the progress animation play for smooth realistic UX
      setTimeout(() => {
        setIsProcessing(false);
        setParsedData(data.parsed_data);
      }, 2000);

    } catch (err) {
      setIsProcessing(false);
      setError(err.message);
    }
  };

  const handleLoadSample = () => {
    setActiveTab('paste');
    setPastedText(sampleResumeSnippet);
    setError('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>NLP Document Information Extractor</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Upload Candidate Resume
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm">
          Upload a candidate resume in PDF, DOC, DOCX, or text format. Our AI engine extracts structured skills, experience, and projects in real time.
        </p>
      </div>

      {/* Main Upload Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
        
        {/* Mode Selector */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div className="flex gap-2">
            <button
              onClick={() => { setActiveTab('upload'); setError(''); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'upload'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              Upload Document (PDF / DOCX)
            </button>
            <button
              onClick={() => { setActiveTab('paste'); setError(''); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'paste'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              Paste Resume Text
            </button>
          </div>

          <button
            onClick={handleLoadSample}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
          >
            Load Sample Resume
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-950/50 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab 1: Drag and Drop Zone */}
        {activeTab === 'upload' ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all ${
              dragOver
                ? 'border-indigo-500 bg-indigo-950/30 scale-[1.01]'
                : file
                ? 'border-emerald-500/50 bg-emerald-950/20'
                : 'border-slate-700 bg-slate-800/30 hover:border-indigo-500/50 hover:bg-slate-800/50'
            }`}
          >
            <input
              type="file"
              id="resume-file"
              accept=".pdf,.docx,.doc,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-600/10">
                <UploadCloud className="w-8 h-8 animate-bounce" />
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  {file ? file.name : "Drag & drop candidate resume here"}
                </h3>
                <p className="text-xs text-slate-400">
                  Supports PDF, DOC, DOCX, or TXT up to 10MB
                </p>
              </div>

              <label
                htmlFor="resume-file"
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white font-semibold text-xs cursor-pointer transition-all shadow-md"
              >
                {file ? "Change Selected File" : "Browse Files"}
              </label>
            </div>
          </div>
        ) : (
          /* Tab 2: Paste Resume Text */
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Paste Raw Resume Content
            </label>
            <textarea
              rows={8}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste candidate resume text with contact details, education, skills, and work experience..."
              className="w-full bg-slate-800/70 border border-slate-700 rounded-2xl p-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono leading-relaxed"
            />
          </div>
        )}

        {/* Process Button */}
        {!isProcessing && !parsedData && (
          <button
            onClick={handleProcessResume}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Process Resume with AI Engine</span>
          </button>
        )}

        {/* Live Animated AI Progress Bar */}
        {isProcessing && <AIProgressBar />}

        {/* Structured Parsed Output */}
        {parsedData && (
          <div className="space-y-6 pt-4 border-t border-slate-800 animate-in fade-in zoom-in-95 duration-500">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <h3 className="font-bold text-white text-sm">Resume Successfully Parsed!</h3>
                  <p className="text-xs text-emerald-300">
                    AI Entity Recognition extracted complete candidate profile.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActivePage('candidate-ranking')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-md hover:scale-105 transition-all flex items-center gap-1.5"
              >
                <span>View Candidate in Ranking</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Extracted Profile Details Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Box 1: Contact Info */}
              <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60 space-y-3">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                  <User className="w-4 h-4" />
                  <span>Candidate Identity</span>
                </div>
                <div>
                  <div className="text-base font-extrabold text-white">
                    {parsedData.name}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <Mail className="w-3 h-3 text-slate-500" />
                    <span>{parsedData.email}</span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-slate-500" />
                    <span>{parsedData.phone}</span>
                  </div>
                </div>
              </div>

              {/* Box 2: Experience & Education */}
              <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60 space-y-3">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                  <Briefcase className="w-4 h-4" />
                  <span>Experience & Education</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">
                    Experience: <span className="text-indigo-300 font-bold">{parsedData.experience_years} Years</span>
                  </div>
                  <div className="text-xs text-slate-300 mt-1 flex items-start gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{parsedData.education_level || "Bachelor's Degree"}</span>
                  </div>
                </div>
              </div>

              {/* Box 3: Certifications */}
              <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60 space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                  <Award className="w-4 h-4" />
                  <span>Certifications</span>
                </div>
                <div className="space-y-1">
                  {parsedData.certifications?.length > 0 ? (
                    parsedData.certifications.map((c, i) => (
                      <div key={i} className="text-xs text-slate-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                        <span>{c}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400">Standard Professional Verification</div>
                  )}
                </div>
              </div>

            </div>

            {/* Extracted Skills Badges */}
            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                  <span>Extracted Skills ({parsedData.skills?.length || 0})</span>
                </div>
                <span className="text-[11px] text-slate-400">Auto-detected technical taxonomy</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {parsedData.skills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Extracted Projects */}
            {parsedData.projects?.length > 0 && (
              <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 space-y-3">
                <div className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span>Extracted Projects</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {parsedData.projects.map((proj, idx) => (
                    <div key={idx} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                      <div className="font-bold text-white text-xs">{proj.title}</div>
                      <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">{proj.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => { setParsedData(null); setFile(null); setPastedText(''); }}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
              >
                Upload Another Resume
              </button>
              <button
                onClick={() => setActivePage('candidate-ranking')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all flex items-center gap-1.5"
              >
                <span>Run AI Matching & Ranking</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
