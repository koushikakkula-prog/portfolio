import React, { useState, useEffect } from 'react';
import {
  History,
  Download,
  Eye,
  Trash2,
  FileText,
  FileCode2,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';
import { useProject } from '../context/ProjectContext';

export const HistoryPage = ({ onNavigateToEditor }) => {
  const { showNotification } = useProject();
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const data = await api.getHistory();
      setHistoryList(data);
      setLoading(false);
    };
    fetchHistory();
  }, []);

  const handleDownload = (doc) => {
    showNotification(`Downloading ${doc.file_name}...`);
    api.exportDocument(doc.format.toLowerCase(), doc.project_name, `# ${doc.project_name} Documentation\n\nExported document version ${doc.version}.`);
  };

  const handleDelete = (id) => {
    setHistoryList(historyList.filter(item => item.id !== id));
    showNotification('Document record removed from history.');
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/40 text-xs font-semibold text-indigo-300 mb-2">
          <History className="w-3.5 h-3.5" />
          Version Control
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Documentation History & Exports
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Review historical generation snapshots, previous document versions, and re-download in PDF, DOCX, or Markdown.
        </p>
      </div>

      {/* History Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-4">Project</th>
                <th className="px-5 py-4">Document</th>
                <th className="px-5 py-4">Version</th>
                <th className="px-5 py-4">Created</th>
                <th className="px-5 py-4">Format</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {historyList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4 font-bold text-white">
                    {item.project_name}
                  </td>
                  <td className="px-5 py-4 font-mono text-indigo-300 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.file_name}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800 text-[11px] font-mono">
                      {item.version}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-400">
                    {item.created_at}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold ${
                      item.format === 'PDF'
                        ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                        : item.format === 'DOCX'
                        ? 'bg-blue-950/80 text-blue-300 border border-blue-800/60'
                        : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                    }`}>
                      {item.format}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={onNavigateToEditor}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="View / Edit Document"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDownload(item)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 hover:text-white text-indigo-300 transition-colors"
                        title="Download Document"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition-colors"
                        title="Delete Entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
