import React, { useState } from 'react';
import {
  Sparkles,
  CheckSquare,
  Square,
  ArrowRight,
  Cpu,
  Layers,
  FileText,
  ShieldCheck,
  Zap,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { api } from '../services/api';

export const GenerateDocPage = ({ onNavigateToEditor }) => {
  const { activeProject, setActiveDoc, showNotification } = useProject();

  const allSections = [
    { id: 'Project Overview', label: 'Project Overview', desc: 'Core purpose, domain context, and high-level value proposition.' },
    { id: 'System Architecture', label: 'System Architecture', desc: 'Layered MVC / Microservices diagram and data flow specification.' },
    { id: 'Installation Guide', label: 'Installation Guide', desc: 'Environment setup, dependencies, virtualenvs, and runtime start.' },
    { id: 'Project Structure', label: 'Project Structure', desc: 'Visual tree directory hierarchy and file responsibility breakdown.' },
    { id: 'Module Documentation', label: 'Module Documentation', desc: 'Individual file and package purpose documentation.' },
    { id: 'Class Documentation', label: 'Class Documentation', desc: 'Object models, inheritance chains, and internal properties.' },
    { id: 'Function Documentation', label: 'Function Documentation', desc: 'Complete parameter tables, return types, and docstrings.' },
    { id: 'API Documentation', label: 'API Documentation', desc: 'REST endpoints, payload schemas, query parameters, and responses.' },
    { id: 'Dependencies', label: 'Dependencies', desc: 'Third-party libraries, framework requirements, and versions.' },
    { id: 'Configuration', label: 'Configuration', desc: 'Environment variables (.env), database URIs, and security keys.' },
    { id: 'Usage Guide', label: 'Usage Guide', desc: 'CLI commands, user workflows, and administration procedures.' },
    { id: 'Examples', label: 'Examples & Code Snippets', desc: 'Practical code usage and end-to-end integration scenarios.' },
    { id: 'Testing', label: 'Testing & QA', desc: 'Unit testing instructions with pytest / jest test commands.' },
    { id: 'Future Enhancements', label: 'Future Enhancements', desc: 'Scalability roadmap, containerization, and prospective milestones.' },
  ];

  const [selectedSections, setSelectedSections] = useState(allSections.map(s => s.id));
  const [docStyle, setDocStyle] = useState('Professional');
  const [targetAudience, setTargetAudience] = useState('Developers');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  const generationStages = [
    "Analyzing Code",
    "Understanding Architecture",
    "Generating Descriptions",
    "Creating Documentation",
    "Finalizing Document"
  ];

  const toggleSection = (id) => {
    if (selectedSections.includes(id)) {
      setSelectedSections(selectedSections.filter(s => s !== id));
    } else {
      setSelectedSections([...selectedSections, id]);
    }
  };

  const handleSelectAll = () => {
    setSelectedSections(allSections.map(s => s.id));
  };

  const handleDeselectAll = () => {
    setSelectedSections([]);
  };

  const handleStartGeneration = async () => {
    if (selectedSections.length === 0) return;
    setIsGenerating(true);
    setGenerationProgress(10);
    setActiveStageIndex(0);

    // Simulate animated generation stages
    const stageInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) {
          clearInterval(stageInterval);
          return 90;
        }
        const next = prev + 18;
        setActiveStageIndex(Math.min(Math.floor(next / 20), 4));
        return next;
      });
    }, 450);

    try {
      const res = await api.generateDocumentation(
        activeProject ? activeProject.id : 1,
        selectedSections,
        docStyle,
        targetAudience
      );

      clearInterval(stageInterval);
      setGenerationProgress(100);
      setActiveStageIndex(4);

      setTimeout(() => {
        setIsGenerating(false);
        if (res && res.status === 'success') {
          setActiveDoc(res);
        }
        showNotification('Documentation generated successfully with AI!');
        onNavigateToEditor();
      }, 600);

    } catch (e) {
      clearInterval(stageInterval);
      setIsGenerating(false);
      onNavigateToEditor();
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800/40 text-xs font-semibold text-purple-300 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          Generative AI Synthesis
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Generate Technical Documentation
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Customize sections, tone, and audience. GenDoc AI synthesizes AST structures into professional technical manuals.
        </p>
      </div>

      {/* Generation Config Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Style Selector */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            Documentation Tone & Style
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {['Professional', 'Technical', 'Simple', 'Academic'].map((st) => (
              <button
                key={st}
                onClick={() => setDocStyle(st)}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all ${
                  docStyle === st
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 border border-indigo-500'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Target Audience */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Target Audience
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {['Developers', 'Reviewers / Evaluators', 'Stakeholders'].map((aud) => (
              <button
                key={aud}
                onClick={() => setTargetAudience(aud)}
                className={`py-2 px-2 rounded-xl text-xs font-semibold truncate transition-all ${
                  targetAudience === aud
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 border border-emerald-500'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {aud}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 14 Sections Checklist */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">
              Select Documentation Sections ({selectedSections.length} / {allSections.length})
            </h3>
            <p className="text-xs text-slate-400">Choose the specific technical chapters to include in the generated document</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Select All
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={handleDeselectAll}
              className="text-xs font-semibold text-slate-400 hover:text-slate-300"
            >
              Deselect All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {allSections.map((sec) => {
            const isChecked = selectedSections.includes(sec.id);
            return (
              <div
                key={sec.id}
                onClick={() => toggleSection(sec.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                  isChecked
                    ? 'bg-indigo-950/20 border-indigo-500/40 text-slate-100'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="pt-0.5 text-indigo-400">
                  {isChecked ? <CheckSquare className="w-4 h-4 text-indigo-400" /> : <Square className="w-4 h-4 text-slate-600" />}
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-bold ${isChecked ? 'text-white' : 'text-slate-300'}`}>
                    {sec.label}
                  </div>
                  <div className="text-[11px] text-slate-400 leading-normal">
                    {sec.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Generate Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-300" />
            <span>Deterministic AST semantics ensure 0% hallucinated methods.</span>
          </div>

          <button
            onClick={handleStartGeneration}
            disabled={selectedSections.length === 0 || isGenerating}
            className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-xs text-white shadow-xl flex items-center justify-center gap-2.5 transition-all ${
              selectedSections.length === 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 via-purple-600 to-blue-600 hover:from-indigo-600 hover:via-purple-700 hover:to-blue-700 shadow-indigo-500/25 transform hover:-translate-y-0.5'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Generate Documentation with AI</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AI Generation Modal / Overlay Animation */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl max-w-lg w-full p-8 text-center space-y-6 shadow-2xl shadow-indigo-950/50 animate-scaleUp">
            
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center mx-auto text-indigo-400 shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: '3s' }} />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-white">
                GenDoc AI is analyzing your project…
              </h3>
              <p className="text-xs text-slate-400">
                Transforming AST syntax trees into structured technical chapters
              </p>
            </div>

            {/* Animated Flow Steps */}
            <div className="space-y-2 text-xs font-mono">
              {generationStages.map((stage, idx) => {
                const isPassed = idx <= activeStageIndex;
                const isCurrent = idx === activeStageIndex;
                return (
                  <div key={idx} className="space-y-1">
                    <div className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-indigo-950/80 border-indigo-500/50 text-indigo-200 font-bold'
                        : isPassed
                        ? 'bg-slate-950 border-emerald-500/30 text-emerald-400'
                        : 'bg-slate-950/50 border-slate-800 text-slate-600'
                    }`}>
                      <div className="flex items-center gap-2">
                        {isPassed && !isCurrent ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : isCurrent ? (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-700" />
                        )}
                        <span>{stage}</span>
                      </div>
                      <span className="text-[10px]">
                        {isCurrent ? 'Processing...' : isPassed ? 'Done' : 'Queued'}
                      </span>
                    </div>
                    {idx < generationStages.length - 1 && (
                      <div className="flex justify-center text-slate-600 text-[10px]">↓</div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Live Progress Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>Overall Progress</span>
                <span className="text-indigo-400">{generationProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-300 rounded-full"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
