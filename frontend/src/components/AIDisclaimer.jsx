import React from 'react';
import { AlertCircle } from 'lucide-react';

export const AIDisclaimer = () => {
  return (
    <div className="flex items-start gap-3 p-3.5 bg-indigo-950/40 border border-indigo-500/20 rounded-xl text-xs text-indigo-200/90 shadow-sm">
      <AlertCircle className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
      <div>
        <span className="font-semibold text-indigo-300">AI Decision Support Notice: </span>
        AI-generated rankings are decision-support recommendations and should be reviewed by a human recruiter. Do not use the system as the sole basis for employment decisions.
      </div>
    </div>
  );
};
