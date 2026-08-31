import React, { useState } from 'react';
import { Briefcase, Plus, X, Sparkles, CheckCircle2, ArrowLeft, Layers, MapPin, DollarSign, Clock, BookOpen } from 'lucide-react';

export const CreateJobPage = ({ setActivePage, setSelectedJobId }) => {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [description, setDescription] = useState('');
  const [requiredSkillInput, setRequiredSkillInput] = useState('');
  const [requiredSkills, setRequiredSkills] = useState(['Python', 'SQL', 'React']);
  const [preferredSkillInput, setPreferredSkillInput] = useState('');
  const [preferredSkills, setPreferredSkills] = useState(['Docker', 'AWS']);
  const [education, setEducation] = useState("Bachelor's Degree in Computer Science or related field");
  const [minExperience, setMinExperience] = useState(2.0);
  const [location, setLocation] = useState('Bangalore, India (Hybrid)');
  const [salaryRange, setSalaryRange] = useState('$90,000 - $125,000 / ₹18 - 25 LPA');
  const [employmentType, setEmploymentType] = useState('Full Time');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddRequiredSkill = (e) => {
    e.preventDefault();
    if (requiredSkillInput.trim() && !requiredSkills.includes(requiredSkillInput.trim())) {
      setRequiredSkills([...requiredSkills, requiredSkillInput.trim()]);
      setRequiredSkillInput('');
    }
  };

  const handleRemoveRequiredSkill = (skillToRemove) => {
    setRequiredSkills(requiredSkills.filter(s => s !== skillToRemove));
  };

  const handleAddPreferredSkill = (e) => {
    e.preventDefault();
    if (preferredSkillInput.trim() && !preferredSkills.includes(preferredSkillInput.trim())) {
      setPreferredSkills([...preferredSkills, preferredSkillInput.trim()]);
      setPreferredSkillInput('');
    }
  };

  const handleRemovePreferredSkill = (skillToRemove) => {
    setPreferredSkills(preferredSkills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || requiredSkills.length === 0) {
      alert("Please fill in Job Title, Description, and at least 1 Required Skill.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/create-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          department,
          description,
          required_skills: requiredSkills,
          preferred_skills: preferredSkills,
          education,
          min_experience: parseFloat(minExperience),
          location,
          salary_range: salaryRange,
          employment_type: employmentType,
          recruiter_id: 1
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create job');

      setSuccessMessage("Job created successfully! AI requirements vector generated and candidates ranked.");
      setTimeout(() => {
        if (setSelectedJobId && data.job_id) {
          setSelectedJobId(data.job_id);
        }
        setActivePage('candidate-ranking');
      }, 1200);

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActivePage('recruiter-dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        <span className="px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>AI Vector Pre-computation Active</span>
        </span>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        
        <div className="mb-8 border-b border-slate-800 pb-5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Briefcase className="w-7 h-7 text-indigo-400" />
            <span>Create New Job Posting</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Specify technical requirements. The AI engine will automatically tokenize skills and calculate matching candidate scores.
          </p>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-xs text-emerald-200 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          
          {/* Row 1: Title & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Python Full Stack Developer"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1.5">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Engineering">Platform Engineering</option>
                <option value="AI & Data Science">AI & Data Science Lab</option>
                <option value="Enterprise Systems">Enterprise Systems</option>
                <option value="Cloud Infrastructure">Cloud Infrastructure & DevOps</option>
                <option value="Product & Design">Product & Design</option>
              </select>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block font-bold text-slate-300 mb-1.5">
              Job Description & Responsibilities *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the role, key responsibilities, team structure, and technologies used..."
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 leading-relaxed"
            />
          </div>

          {/* Required Skills (Tagger) */}
          <div>
            <label className="block font-bold text-slate-300 mb-1.5">
              Required Skills * (Primary AI Scoring Weight: 40%)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={requiredSkillInput}
                onChange={(e) => setRequiredSkillInput(e.target.value)}
                placeholder="Type a skill and press Enter or Add (e.g. Python, SQL, React, AWS)"
                className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddRequiredSkill(e); } }}
              />
              <button
                type="button"
                onClick={handleAddRequiredSkill}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {requiredSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-indigo-950/70 border border-indigo-500/40 text-indigo-300 font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <span>{skill}</span>
                  <X
                    className="w-3.5 h-3.5 text-indigo-400 hover:text-rose-400 cursor-pointer"
                    onClick={() => handleRemoveRequiredSkill(skill)}
                  />
                </span>
              ))}
            </div>
          </div>

          {/* Preferred Skills */}
          <div>
            <label className="block font-bold text-slate-300 mb-1.5">
              Preferred / Nice-to-Have Skills
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={preferredSkillInput}
                onChange={(e) => setPreferredSkillInput(e.target.value)}
                placeholder="e.g. Docker, Kubernetes, Tailwind, Redis"
                className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddPreferredSkill(e); } }}
              />
              <button
                type="button"
                onClick={handleAddPreferredSkill}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {preferredSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <span>{skill}</span>
                  <X
                    className="w-3.5 h-3.5 text-slate-400 hover:text-rose-400 cursor-pointer"
                    onClick={() => handleRemovePreferredSkill(skill)}
                  />
                </span>
              ))}
            </div>
          </div>

          {/* Row: Education & Min Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">
                Required Education Level
              </label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1.5">
                Minimum Experience (Years)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={minExperience}
                onChange={(e) => setMinExperience(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Row: Location, Salary & Employment Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1.5">
                Salary Range
              </label>
              <input
                type="text"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1.5">
                Employment Type
              </label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setActivePage('recruiter-dashboard')}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              {loading ? (
                <span>Generating AI Vectors...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Create Job & Auto-Rank Candidates</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
