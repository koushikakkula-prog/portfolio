import React, { useEffect, useState } from 'react';
import { Sparkles, FileText, Cpu, CheckCircle2 } from 'lucide-react';

export const AIProgressBar = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: "Extracting Document Text & Layout...", icon: FileText },
    { label: "Tokenizing & Entity Parsing (NLP)...", icon: Cpu },
    { label: "Extracting Technical Skills & Domain Vector...", icon: Sparkles },
    { label: "Calculating TF-IDF & Scoring Matrices...", icon: CheckCircle2 }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          if (onComplete) onComplete();
          return 100;
        }
        const next = prev + 5;
        if (next >= 75) setCurrentStep(3);
        else if (next >= 50) setCurrentStep(2);
        else if (next >= 25) setCurrentStep(1);
        return next;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="w-full bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 animate-pulse">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-100 text-base">Processing Resume with AI...</h4>
            <p className="text-xs text-indigo-300">
              {steps[currentStep]?.label}
            </p>
          </div>
        </div>
        <span className="text-lg font-bold text-indigo-400">{progress}%</span>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-slate-800 rounded-full h-3 p-0.5 overflow-hidden border border-slate-700">
        <div
          className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-full rounded-full transition-all duration-150 ease-out relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse-slow"></div>
        </div>
      </div>

      {/* Steps indicators */}
      <div className="grid grid-cols-4 gap-2 mt-4">
        {steps.map((step, idx) => {
          const isDone = currentStep > idx || progress === 100;
          const isCurrent = currentStep === idx && progress < 100;
          return (
            <div
              key={idx}
              className={`flex items-center gap-2 p-2 rounded-lg text-[11px] font-medium transition-all ${
                isDone
                  ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                  : isCurrent
                  ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-500/50 shadow-sm'
                  : 'bg-slate-800/40 text-slate-500 border border-slate-800'
              }`}
            >
              <step.icon className={`w-3.5 h-3.5 ${isDone ? 'text-emerald-400' : isCurrent ? 'text-indigo-400 animate-spin' : 'text-slate-600'}`} />
              <span className="truncate">Step {idx + 1}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
