import React, { useState, useEffect } from 'react';
import {
  Save,
  RotateCcw,
  Sparkles,
  Zap,
  Sliders,
  Download,
  Copy,
  Check,
  FileCode2,
  BookOpen,
  Layers,
  FolderTree,
  Boxes,
  Code2,
  Globe2,
  Terminal,
  CheckCircle2,
  Eye,
  Edit3,
  MessageSquare,
  X,
  Send,
  HelpCircle
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { api } from '../services/api';

export const DocEditorPage = () => {
  const { activeProject, activeDoc, setActiveDoc, showNotification } = useProject();

  const [activeSectionId, setActiveSectionId] = useState('overview');
  const [markdownContent, setMarkdownContent] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // Floating AI Assistant Drawer State
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantQuery, setAssistantQuery] = useState('');
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [assistantHistory, setAssistantHistory] = useState([
    { sender: 'ai', text: 'Hello! I am your GenDoc AI Assistant. How would you like to refine or enhance this documentation?' }
  ]);

  const defaultSections = [
    { id: 'overview', title: '1. Project Overview', icon: BookOpen },
    { id: 'objectives', title: '2. Objectives', icon: CheckCircle2 },
    { id: 'technologies', title: '3. Technologies', icon: Zap },
    { id: 'architecture', title: '4. System Architecture', icon: Layers },
    { id: 'structure', title: '5. Project Structure', icon: FolderTree },
    { id: 'modules', title: '6. Module Documentation', icon: Boxes },
    { id: 'classes', title: '7. Classes', icon: Boxes },
    { id: 'functions', title: '8. Functions', icon: Code2 },
    { id: 'apis', title: '9. REST APIs', icon: Globe2 },
    { id: 'installation', title: '10. Installation', icon: Terminal },
    { id: 'usage', title: '11. Usage Guide', icon: Terminal },
    { id: 'testing', title: '12. Testing & QA', icon: CheckCircle2 },
    { id: 'future', title: '13. Future Scope', icon: Sparkles },
  ];

  useEffect(() => {
    if (activeDoc && activeDoc.content_markdown) {
      setMarkdownContent(activeDoc.content_markdown);
    } else {
      // Default initial Markdown content
      setMarkdownContent(`# Student Management System – Technical Documentation

> **GenDoc AI Generated Technical Specification**  
> *Version 1.2 | Generated on August 2026 | Reviewed for Academic & Enterprise Demonstration*

---

## 1. Project Overview
The **Student Management System** is a modern, modular Python web application built using Flask, SQLAlchemy, and SQLite/PostgreSQL. It delivers an automated, secure platform for universities and colleges to manage academic lifecycles—ranging from initial enrollment and student record administration to course scheduling, attendance, GPA calculation, and fee ledger management.

### Key Objectives:
- **Centralized Data Management:** Eliminate redundant spreadsheets with unified relational schemas.
- **Automated Academic Grading:** Provide credit-weighted GPA calculation with automated transcript export.
- **Role-Based Access Control:** Secure endpoints for Administrators, Faculty Professors, and Students.
- **RESTful Interoperability:** Clean REST APIs supporting web, mobile, and external registrar integrations.

---

## 2. Technologies
- Python 3.12+
- Flask / FastAPI
- SQLAlchemy ORM
- SQLite & PostgreSQL
- ReportLab (PDF Engine)
- HTML5 / Tailwind CSS
- PyTest Quality Assurance

---

## 3. System Architecture
The application employs an **N-Tier Model-View-Controller (MVC) Architectural Pattern** with clean separation of concerns:

\`\`\`text
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│        Web Browser / React Frontend / Mobile Clients        │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON REST
┌──────────────────────────────▼──────────────────────────────┐
│                    API Gateway & Routing                    │
│   Flask Blueprints: /api/auth, /api/students, /api/courses   │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                      Service Layer                          │
│     Billing Engine │ Grade Calculator │ Auth Service        │
└──────────────────────────────┬──────────────────────────────┘
                               │ ORM Mappings
┌──────────────────────────────▼──────────────────────────────┐
│                    Data Persistence Layer                   │
│        SQLAlchemy ORM ───> SQLite / PostgreSQL DB           │
└─────────────────────────────────────────────────────────────┘
\`\`\`

---

## 4. Project Structure
\`\`\`text
student-management/
│
├── app.py                     # Application factory & server entry point
├── models.py                  # Database relational schema models
├── database.py                # Database connection & session lifecycle
│
├── routes/                    # API Route Blueprints
│   ├── auth.py                # Authentication & JWT issuance
│   ├── students.py            # Student CRUD operations
│   ├── courses.py             # Course catalog & enrollment
│   └── grades.py              # Grading & transcript calculation
│
├── services/                  # Business Logic Layer
│   ├── billing.py             # Tuition & fee calculation
│   └── email.py               # SMTP notification dispatcher
│
├── utils/                     # Shared Utilities
│   └── helpers.py             # Formatters, validators, serializers
│
├── templates/                 # Server-rendered HTML templates
├── static/                    # CSS, JavaScript, and asset bundles
└── requirements.txt           # Python package dependencies
\`\`\`

---

## 5. Function Specification

| Function | File | Parameters | Return Type | Description |
| :--- | :--- | :--- | :--- | :--- |
| \`calculate_total\` | \`services/billing.py\` | \`price: float, quantity: int, tax_rate: float\` | \`float\` | Calculates billing subtotal plus regional taxes. |
| \`login_user\` | \`routes/auth.py\` | \`email: str, password: str\` | \`bool\` | Verifies user credentials using bcrypt hashing. |
| \`get_student\` | \`routes/students.py\` | \`student_id: int\` | \`dict\` | Retrieves student profile entity as a JSON object. |
| \`calculate_gpa\` | \`routes/grades.py\` | \`student_id: int, semester: int\` | \`float\` | Computes credit-weighted semester GPA. |
| \`register_student\` | \`routes/students.py\` | \`data: dict\` | \`dict\` | Persists a new student entity to database. |

---

## 6. REST API Specification

### \`GET /api/students\`
- **Description:** Returns a paginated list of all active students.
- **Parameters:** \`page\` (int), \`limit\` (int)
- **Response \`200 OK\`:**
\`\`\`json
{
  "students": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@univ.edu",
      "department": "CS",
      "gpa": 3.85
    }
  ],
  "total": 142
}
\`\`\`

---

## 7. Installation & Setup Guide
\`\`\`bash
# 1. Clone the repository
git clone https://github.com/example/student-management.git
cd student-management

# 2. Setup Virtual Environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start Flask Server
python app.py
\`\`\`

---

## 8. Future Enhancements
1. **Biometric Attendance Integration:** Real-time sync with hardware scanners.
2. **AI Tutor Assistant:** Automated study recommendations based on grade performance.
3. **Mobile Push Notifications:** Firebase cloud messaging for exam schedule updates.
`);
    }
  }, [activeDoc]);

  const handleSave = async () => {
    setIsSaving(true);
    if (activeDoc?.id) {
      await api.updateDocumentation(activeDoc.id, markdownContent);
    }
    setIsSaving(false);
    showNotification('Documentation saved successfully!');
  };

  const handleCopyClipboard = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    showNotification('Copied documentation to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = async (format) => {
    showNotification(`Preparing ${format.toUpperCase()} export...`);
    const success = await api.exportDocument(
      format,
      activeProject ? activeProject.name : 'Technical_Documentation',
      markdownContent
    );
    if (success) {
      showNotification(`${format.toUpperCase()} downloaded successfully!`);
    }
  };

  // AI Refinement Buttons
  const handleAIRefine = async (actionType) => {
    showNotification(`Applying AI refinement: "${actionType}"...`);
    let prompt = actionType;
    if (actionType === 'make_simpler') prompt = 'Make this documentation simpler and more concise for stakeholders.';
    if (actionType === 'make_technical') prompt = 'Add deep technical details, concurrency specifications, and latency profiles.';
    if (actionType === 'improve') prompt = 'Improve grammar, structure, and professional formatting.';

    const res = await api.queryAIAssistant(prompt, markdownContent);
    if (res && res.modified_content) {
      setMarkdownContent(res.modified_content);
      showNotification('Documentation updated with AI refinements!');
    }
  };

  // Assistant Chat Submission
  const handleSendAssistant = async (e) => {
    e?.preventDefault();
    if (!assistantQuery.trim()) return;

    const userText = assistantQuery;
    setAssistantQuery('');
    setAssistantHistory(prev => [...prev, { sender: 'user', text: userText }]);
    setAssistantLoading(true);

    const res = await api.queryAIAssistant(userText, markdownContent);
    setAssistantLoading(false);

    if (res) {
      setAssistantHistory(prev => [...prev, { sender: 'ai', text: res.reply }]);
      if (res.modified_content) {
        setMarkdownContent(res.modified_content);
        showNotification('Documentation updated with AI edits!');
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Action Toolbar */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl backdrop-blur-md">
        
        {/* Title & Document Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <FileCode2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              {activeProject ? activeProject.name : 'Student Management System'}
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800">
                v1.2 Draft
              </span>
            </h1>
            <p className="text-xs text-slate-400">Interactive Technical Documentation Editor</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Mode Toggle */}
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isEditMode ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {isEditMode ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            {isEditMode ? 'Preview Mode' : 'Edit Markdown'}
          </button>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            {isSaving ? 'Saving...' : 'Save'}
          </button>

          {/* AI Quick Buttons */}
          <button
            onClick={() => handleAIRefine('improve')}
            className="px-3 py-1.5 rounded-xl bg-indigo-950/80 border border-indigo-800/60 hover:bg-indigo-900/60 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            Improve with AI
          </button>

          <button
            onClick={() => handleAIRefine('make_simpler')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors hidden sm:inline-flex"
          >
            Make Simpler
          </button>

          <button
            onClick={() => handleAIRefine('make_technical')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors hidden sm:inline-flex"
          >
            Make More Technical
          </button>

          {/* Export Dropdown / Buttons */}
          <div className="flex items-center gap-1 pl-2 border-l border-slate-800">
            <button
              onClick={() => handleExport('pdf')}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Download PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
            <button
              onClick={() => handleExport('docx')}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-900/60 text-blue-300 text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Download DOCX"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOCX</span>
            </button>
            <button
              onClick={() => handleExport('markdown')}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-900/60 text-indigo-300 text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Download Markdown"
            >
              <Download className="w-3.5 h-3.5" />
              <span>MD</span>
            </button>
            <button
              onClick={handleCopyClipboard}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              title="Copy Markdown"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Main Split Layout: Left Section Navigator + Right Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Section Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
              DOCUMENTATION
            </div>
            <div className="space-y-1">
              {defaultSections.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeSectionId === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => {
                      setActiveSectionId(sec.id);
                      const el = document.getElementById(sec.id);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{sec.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Refinement Pill Box */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 text-xs space-y-2">
            <div className="text-indigo-300 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>AI Quick Prompts</span>
            </div>
            <div className="space-y-1 text-slate-400">
              <button
                onClick={() => { setIsAssistantOpen(true); setAssistantQuery('Explain the billing module architecture'); }}
                className="w-full text-left py-1 px-2 rounded-lg bg-slate-900/80 hover:text-indigo-300 text-[11px] truncate block"
              >
                • Explain this module
              </button>
              <button
                onClick={() => { setIsAssistantOpen(true); setAssistantQuery('Add comprehensive REST API examples with curl'); }}
                className="w-full text-left py-1 px-2 rounded-lg bg-slate-900/80 hover:text-indigo-300 text-[11px] truncate block"
              >
                • Add API examples
              </button>
              <button
                onClick={() => { setIsAssistantOpen(true); setAssistantQuery('Add a sequence diagram in Mermaid format'); }}
                className="w-full text-left py-1 px-2 rounded-lg bg-slate-900/80 hover:text-indigo-300 text-[11px] truncate block"
              >
                • Add Mermaid diagram
              </button>
            </div>
          </div>
        </div>

        {/* Right Main Editor / Formatted View */}
        <div className="lg:col-span-9 space-y-4">
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 shadow-2xl min-h-[650px] relative">
            
            {isEditMode ? (
              <textarea
                value={markdownContent}
                onChange={(e) => setMarkdownContent(e.target.value)}
                className="w-full h-[600px] bg-slate-950/80 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-y leading-relaxed"
                placeholder="Write markdown documentation here..."
              />
            ) : (
              <div className="prose prose-invert max-w-none space-y-6 text-slate-200 text-sm leading-relaxed font-sans">
                
                {/* Formatted Markdown Rendering */}
                {markdownContent.split('\n\n').map((block, idx) => {
                  if (block.startsWith('# ')) {
                    return (
                      <div key={idx} className="border-b border-slate-800 pb-4 mb-6">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                          {block.replace('# ', '')}
                        </h1>
                      </div>
                    );
                  }
                  if (block.startsWith('## ')) {
                    return (
                      <h2 key={idx} className="text-lg sm:text-xl font-bold text-indigo-300 pt-4 border-t border-slate-800/60">
                        {block.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (block.startsWith('### ')) {
                    return (
                      <h3 key={idx} className="text-base font-semibold text-slate-100">
                        {block.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (block.startsWith('```')) {
                    const cleanCode = block.replace(/```[a-z]*/g, '').trim();
                    return (
                      <pre key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto">
                        {cleanCode}
                      </pre>
                    );
                  }
                  if (block.startsWith('> ')) {
                    return (
                      <blockquote key={idx} className="p-4 rounded-xl bg-indigo-950/30 border-l-4 border-indigo-500 text-indigo-200 text-xs italic">
                        {block.replace(/> /g, '')}
                      </blockquote>
                    );
                  }
                  if (block.startsWith('|')) {
                    // Simple table parser
                    const rows = block.split('\n').filter(r => !r.includes('---'));
                    return (
                      <div key={idx} className="overflow-x-auto rounded-xl border border-slate-800">
                        <table className="w-full text-left text-xs">
                          <tbody>
                            {rows.map((row, rIdx) => {
                              const cells = row.split('|').filter(c => c.trim().length > 0);
                              return (
                                <tr key={rIdx} className={rIdx === 0 ? 'bg-slate-950 text-indigo-300 font-bold' : 'bg-slate-900/60 border-t border-slate-800'}>
                                  {cells.map((cell, cIdx) => (
                                    <td key={cIdx} className="px-4 py-2.5">
                                      {cell.trim()}
                                    </td>
                                  ))}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    );
                  }

                  return (
                    <p key={idx} className="text-slate-300 leading-relaxed">
                      {block}
                    </p>
                  );
                })}

              </div>
            )}

            {/* AI Review Disclaimer */}
            <div className="mt-8 pt-4 border-t border-slate-800/80 text-center text-xs text-slate-300 flex items-center justify-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI-generated documentation should be reviewed by a developer for accuracy before being used as official project documentation.</span>
            </div>

          </div>
        </div>

      </div>

      {/* Floating "✨ Ask GenDoc AI" Button */}
      <button
        onClick={() => setIsAssistantOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 text-white font-bold text-xs shadow-2xl shadow-indigo-500/40 hover:scale-105 transition-all flex items-center gap-2 border border-white/20 animate-bounce"
        style={{ animationDuration: '4s' }}
      >
        <Sparkles className="w-4 h-4 text-amber-300" />
        <span>✨ Ask GenDoc AI</span>
      </button>

      {/* Floating AI Assistant Drawer Modal */}
      {isAssistantOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-slate-900 border border-indigo-500/40 rounded-3xl shadow-2xl shadow-black/80 flex flex-col h-[500px] overflow-hidden animate-scaleUp">
          
          {/* Drawer Header */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400">
                <Sparkles className="w-4 h-4 text-cyan-300" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">GenDoc AI Assistant</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Context-Aware Copilot Active
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsAssistantOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {assistantHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl max-w-[88%] leading-relaxed ${
                  msg.sender === 'user'
                    ? 'ml-auto bg-indigo-600 text-white rounded-br-none shadow-sm'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {assistantLoading && (
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-indigo-400 text-xs inline-flex items-center gap-2">
                <span className="w-3 h-3 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
                <span>Synthesizing update...</span>
              </div>
            )}
          </div>

          {/* Suggested Quick Prompts */}
          <div className="px-3 py-2 bg-slate-950/60 border-t border-slate-800/80 flex gap-1.5 overflow-x-auto text-[10px]">
            <button
              onClick={() => { setAssistantQuery('Make this section shorter'); }}
              className="px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 hover:text-white shrink-0"
            >
              Shorter
            </button>
            <button
              onClick={() => { setAssistantQuery('Add more technical details'); }}
              className="px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 hover:text-white shrink-0"
            >
              More Technical
            </button>
            <button
              onClick={() => { setAssistantQuery('Generate practical API example'); }}
              className="px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 hover:text-white shrink-0"
            >
              Add API Example
            </button>
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendAssistant} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={assistantQuery}
              onChange={(e) => setAssistantQuery(e.target.value)}
              placeholder="Ask anything about your documentation..."
              className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={assistantLoading || !assistantQuery.trim()}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
};
