import React, { useState } from 'react';
import {
  Code2,
  Sparkles,
  Play,
  RotateCcw,
  Copy,
  Check,
  CheckCircle2,
  HelpCircle,
  Zap,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { useProject } from '../context/ProjectContext';

export const CodeExplainerPage = ({ onNavigateToEditor }) => {
  const { showNotification } = useProject();

  const sampleSnippet = `def calculate_total(price: float, quantity: int, tax_rate: float = 0.05) -> float:
    """Calculates net billing total including discount and tax."""
    subtotal = price * quantity
    if quantity >= 10:
        subtotal *= 0.9  # Bulk 10% discount
    total = subtotal * (1 + tax_rate)
    return round(total, 2)`;

  const [code, setCode] = useState(sampleSnippet);
  const [language, setLanguage] = useState('Python');
  const [isExplaining, setIsExplaining] = useState(false);
  const [copiedDocstring, setCopiedDocstring] = useState(false);
  const [explanation, setExplanation] = useState({
    function_name: 'calculate_total',
    purpose: 'Calculates the net billing total for student fee transactions. Evaluates bulk threshold discounts and incorporates regional tax rates.',
    parameters: [
      { name: 'price', type: 'float', description: 'Unit cost per course or credit hour.' },
      { name: 'quantity', type: 'int', description: 'Total credit units or items registered.' },
      { name: 'tax_rate', type: 'float', description: 'Optional regional tax coefficient (default: 0.05 / 5%).' }
    ],
    returns: 'float: Precision rounded net billing currency representation.',
    time_complexity: 'O(1) Constant Time Execution',
    space_complexity: 'O(1) Auxiliary Stack Frame Memory',
    step_by_step: [
      '**Step 1:** Multiplies unit price by quantity to derive subtotal amount.',
      '**Step 2:** Checks if quantity is greater than or equal to 10 to apply a 10% volume discount.',
      '**Step 3:** Applies regional tax coefficient to compute gross payable balance.',
      '**Step 4:** Rounds value to 2 decimal places and returns float result.'
    ],
    suggested_docstring: `"""\nCalculates net billing total including discount and tax.\n\nArgs:\n    price (float): Unit cost per item.\n    quantity (int): Number of units.\n    tax_rate (float, optional): Tax percentage (default: 0.05).\n\nReturns:\n    float: Precision-rounded billing total.\n"""`
  });

  const handleExplain = async () => {
    if (!code.trim()) return;
    setIsExplaining(true);
    const res = await api.explainCode(code, language);
    setIsExplaining(false);
    if (res && res.explanation) {
      setExplanation(res.explanation);
      showNotification('AI Code explanation generated!');
    }
  };

  const handleSimplify = async () => {
    setIsExplaining(true);
    const res = await api.explainCode(code, language);
    setIsExplaining(false);
    if (res && res.explanation) {
      setExplanation({
        ...res.explanation,
        purpose: 'Takes a price and quantity, applies a discount if ordering 10 or more, adds tax, and returns the total.'
      });
      showNotification('Explanation simplified for non-technical stakeholders!');
    }
  };

  const handleCopyDocstring = () => {
    navigator.clipboard.writeText(explanation.suggested_docstring);
    setCopiedDocstring(true);
    showNotification('Copied docstring to clipboard!');
    setTimeout(() => setCopiedDocstring(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/40 text-xs font-semibold text-amber-300 mb-2">
          <Code2 className="w-3.5 h-3.5" />
          Interactive Code Playground
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          AI Code Explainer & Docstring Generator
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Paste any function or algorithm to generate human-readable explanations, parameter tables, and docstrings.
        </p>
      </div>

      {/* Main Split Screen Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Code Editor Input */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl flex flex-col h-full min-h-[580px]">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-white">Source Code Input</span>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none"
              >
                <option value="Python">Python</option>
                <option value="JavaScript">JavaScript</option>
                <option value="TypeScript">TypeScript</option>
                <option value="Java">Java</option>
                <option value="C++">C++</option>
              </select>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
              placeholder="Paste your source code function or method here..."
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSimplify}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Simplify
                </button>
                <button
                  onClick={() => setCode(sampleSnippet)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold transition-colors"
                >
                  Reset Sample
                </button>
              </div>

              <button
                onClick={handleExplain}
                disabled={isExplaining}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold shadow-md shadow-indigo-500/25 flex items-center gap-2 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>{isExplaining ? 'Analyzing...' : 'Explain Code with AI'}</span>
              </button>
            </div>

          </div>
        </div>

        {/* Right Side: AI Structured Explanation */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5 shadow-xl min-h-[580px]">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span className="text-xs font-bold text-white">AI Structured Breakdown</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-amber-950 text-amber-300 border border-amber-800">
                {explanation.time_complexity}
              </span>
            </div>

            {/* Purpose */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400">Purpose:</span>
              <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                {explanation.purpose}
              </p>
            </div>

            {/* Parameters */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-400">Parameters:</span>
              <div className="space-y-1.5">
                {explanation.parameters.map((p, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-start gap-2.5">
                    <code className="text-indigo-300 font-mono font-semibold">{p.name}</code>
                    <span className="text-[10px] text-emerald-400 font-mono">({p.type})</span>
                    <span className="text-slate-400">{p.description}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Returns */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400">Returns:</span>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-300 font-mono">
                {explanation.returns}
              </div>
            </div>

            {/* Step-by-Step Logic */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-400">Step-by-Step Execution:</span>
              <div className="space-y-1 text-xs text-slate-300">
                {explanation.step_by_step.map((step, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 leading-relaxed">
                    <span dangerouslySetInnerHTML={{ __html: step.replace(/\*\*(.*?)\*\*/g, '<b class="text-white">$1</b>') }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Docstring */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Generated Docstring</span>
                <button
                  onClick={handleCopyDocstring}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                >
                  {copiedDocstring ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy Docstring</span>
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 whitespace-pre-wrap">
                {explanation.suggested_docstring}
              </pre>
            </div>

            {/* Next Action Button */}
            <div className="pt-2">
              <button
                onClick={onNavigateToEditor}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <span>Add this explanation to Full Documentation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
