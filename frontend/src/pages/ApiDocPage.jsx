import React, { useState, useEffect } from 'react';
import {
  Globe2,
  Sparkles,
  Download,
  Copy,
  Check,
  Send,
  Code2,
  Layers,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { api } from '../services/api';

export const ApiDocPage = () => {
  const { activeProject, showNotification } = useProject();
  const [endpoints, setEndpoints] = useState([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Default demo endpoints
    const defaultApis = [
      {
        id: 1,
        method: "GET",
        path: "/api/students",
        file_path: "routes/students.py",
        function_name: "list_students",
        summary: "List all registered students",
        description: "Retrieves a paginated list of all active enrolled students with academic status and department metadata.",
        parameters: [
          { name: "page", in: "query", type: "int", required: false, desc: "Page index (default: 1)" },
          { name: "limit", in: "query", type: "int", required: false, desc: "Total records per page (default: 20)" }
        ],
        request_body: null,
        response_schema: {
          students: [
            { id: 1, name: "John Doe", email: "john@univ.edu", department: "Computer Science", gpa: 3.85 }
          ],
          total: 142
        },
        status_codes: ["200 OK", "400 Bad Request", "500 Internal Server Error"]
      },
      {
        id: 2,
        method: "POST",
        path: "/api/students",
        file_path: "routes/students.py",
        function_name: "register_student",
        summary: "Register new student",
        description: "Creates a new student record and provisions academic institutional email account.",
        parameters: [],
        request_body: {
          first_name: "Jane",
          last_name: "Smith",
          email: "jane@univ.edu",
          department: "Computer Science",
          enrollment_year: 2026
        },
        response_schema: {
          id: 143,
          status: "created",
          message: "Student account successfully provisioned."
        },
        status_codes: ["201 Created", "400 Validation Error", "409 Email Conflict"]
      },
      {
        id: 3,
        method: "GET",
        path: "/api/students/{id}",
        file_path: "routes/students.py",
        function_name: "get_student",
        summary: "Get student details by ID",
        description: "Retrieves complete student biographical profile, enrolled courses, and cumulative GPA.",
        parameters: [
          { name: "id", in: "path", type: "int", required: true, desc: "Unique student primary key" }
        ],
        request_body: null,
        response_schema: {
          id: 1,
          name: "John Doe",
          department: "Computer Science",
          gpa: 3.85,
          courses: ["CS301", "CS402"]
        },
        status_codes: ["200 OK", "404 Student Not Found"]
      },
      {
        id: 4,
        method: "PUT",
        path: "/api/students/{id}",
        file_path: "routes/students.py",
        function_name: "update_student",
        summary: "Update student profile",
        description: "Modifies student contact details, address, or assigned faculty advisor.",
        parameters: [
          { name: "id", in: "path", type: "int", required: true, desc: "Unique student identifier" }
        ],
        request_body: {
          contact_number: "+1-555-0199",
          advisor_id: 4
        },
        response_schema: {
          status: "updated",
          modified_at: "2026-08-21T18:30:00Z"
        },
        status_codes: ["200 OK", "400 Bad Request", "404 Not Found"]
      },
      {
        id: 5,
        method: "DELETE",
        path: "/api/students/{id}",
        file_path: "routes/students.py",
        function_name: "delete_student",
        summary: "Archive / Delete student record",
        description: "Soft-deletes or archives an inactive student record from active registry.",
        parameters: [
          { name: "id", in: "path", type: "int", required: true, desc: "Student ID" }
        ],
        request_body: null,
        response_schema: {
          status: "archived",
          student_id: 1
        },
        status_codes: ["200 OK", "404 Not Found"]
      },
      {
        id: 6,
        method: "POST",
        path: "/api/auth/login",
        file_path: "routes/auth.py",
        function_name: "login_user",
        summary: "Authenticate user credentials",
        description: "Validates user credentials against salted bcrypt hash and issues signed JWT token.",
        parameters: [],
        request_body: {
          email: "admin@univ.edu",
          password: "SecurePassword123"
        },
        response_schema: {
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          expires_in: 3600,
          role: "Administrator"
        },
        status_codes: ["200 OK", "401 Unauthorized Credentials"]
      }
    ];

    setEndpoints(defaultApis);
    setSelectedEndpoint(defaultApis[0]);
  }, [activeProject]);

  const getMethodBadgeColor = (method) => {
    switch (method.toUpperCase()) {
      case 'GET': return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'POST': return 'bg-indigo-950 text-indigo-300 border-indigo-800';
      case 'PUT': return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'DELETE': return 'bg-rose-950 text-rose-300 border-rose-800';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const handleGenerateFullSpec = async () => {
    setIsGenerating(true);
    const res = await api.generateApiDocs(activeProject ? activeProject.id : 1);
    setIsGenerating(false);
    showNotification('API Documentation generated and synced with project specification!');
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-xs font-semibold text-emerald-300 mb-2">
            <Globe2 className="w-3.5 h-3.5" />
            OpenAPI & REST Detection
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            API Documentation Generator
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Auto-detected REST endpoints, request payloads, query schemas, and HTTP response codes.
          </p>
        </div>

        <button
          onClick={handleGenerateFullSpec}
          disabled={isGenerating}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-blue-600 hover:from-indigo-600 hover:via-purple-700 hover:to-blue-700 font-semibold text-xs text-white shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all shrink-0"
        >
          <Sparkles className="w-4 h-4 text-cyan-300" />
          <span>{isGenerating ? 'Synthesizing Spec...' : 'Generate API Documentation with AI'}</span>
        </button>
      </div>

      {/* Main Split Layout: Left Endpoint Catalog + Right Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Endpoint List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Detected Endpoints ({endpoints.length})
          </div>

          <div className="space-y-2">
            {endpoints.map((ep) => {
              const isSelected = selectedEndpoint?.id === ep.id;
              return (
                <div
                  key={ep.id}
                  onClick={() => setSelectedEndpoint(ep)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-indigo-950/30 border-indigo-500/50 shadow-md shadow-indigo-950/30'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold border ${getMethodBadgeColor(ep.method)}`}>
                      {ep.method}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-mono font-semibold text-white truncate">
                        {ep.path}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {ep.summary}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-indigo-400 translate-x-0.5' : 'text-slate-600'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Endpoint Details Inspector */}
        <div className="lg:col-span-7 space-y-4">
          {selectedEndpoint ? (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-xl">
              
              {/* Endpoint Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border ${getMethodBadgeColor(selectedEndpoint.method)}`}>
                    {selectedEndpoint.method}
                  </span>
                  <span className="text-base font-mono font-bold text-white">
                    {selectedEndpoint.path}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {selectedEndpoint.file_path}
                </span>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 block">Description</span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {selectedEndpoint.description}
                </p>
              </div>

              {/* Parameters Table */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400 block">Parameters</span>
                {selectedEndpoint.parameters && selectedEndpoint.parameters.length > 0 ? (
                  <div className="rounded-xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase font-semibold">
                        <tr>
                          <th className="px-3 py-2">Name</th>
                          <th className="px-3 py-2">In</th>
                          <th className="px-3 py-2">Type</th>
                          <th className="px-3 py-2">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {selectedEndpoint.parameters.map((p, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/40">
                            <td className="px-3 py-2 font-mono font-semibold text-indigo-300">{p.name}</td>
                            <td className="px-3 py-2 font-mono text-cyan-300">{p.in}</td>
                            <td className="px-3 py-2 font-mono text-emerald-300">{p.type}</td>
                            <td className="px-3 py-2 text-slate-400">{p.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-500">
                    No query or path parameters required.
                  </div>
                )}
              </div>

              {/* Request Body Payload */}
              {selectedEndpoint.request_body && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-400 block">Request Payload (JSON)</span>
                  <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
                    {JSON.stringify(selectedEndpoint.request_body, null, 2)}
                  </pre>
                </div>
              )}

              {/* Response Body Schema */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400 block">Response Schema (200 OK)</span>
                <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto">
                  {JSON.stringify(selectedEndpoint.response_schema, null, 2)}
                </pre>
              </div>

              {/* Status Codes */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400 block">Status Codes</span>
                <div className="flex flex-wrap gap-2">
                  {selectedEndpoint.status_codes.map((st, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300">
                      {st}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-slate-900/80 border border-slate-800 text-center text-slate-500">
              Select an endpoint from the left catalog to inspect parameters and schemas.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
