import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, LogIn, Briefcase, UserCheck, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export const LoginPage = ({ setActivePage }) => {
  const { login, quickLoginAs } = useAuth();
  const [role, setRole] = useState('recruiter'); // 'recruiter' or 'candidate'
  const [email, setEmail] = useState('recruiter@airecruit.com');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (newRole === 'recruiter') {
      setEmail('recruiter@airecruit.com');
    } else {
      setEmail('rahul.kumar@example.com');
    }
    setPassword('password123');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'recruiter') {
        setActivePage('recruiter-dashboard');
      } else {
        setActivePage('candidate-dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoRole) => {
    quickLoginAs(demoRole);
    if (demoRole === 'recruiter') {
      setActivePage('recruiter-dashboard');
    } else {
      setActivePage('candidate-dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Secure AI Authentication</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="text-slate-400 text-xs">
            Sign in to access your recruitment analytics and AI candidate matching
          </p>
        </div>

        {/* Role Switcher Tabs */}
        <div className="bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl flex gap-1 shadow-inner">
          <button
            type="button"
            onClick={() => handleRoleChange('recruiter')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              role === 'recruiter'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Recruiter</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('candidate')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              role === 'candidate'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Candidate</span>
          </button>
        </div>

        {/* Login Form Box */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-5">
          
          {error && (
            <div className="p-3 bg-rose-950/50 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-800/70 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800/70 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => alert("Password reset link sent to demo account.")}
                className="text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Login to Account</span>
                </>
              )}
            </button>

          </form>

          {/* Quick 1-Click CSE Demo Evaluation Buttons */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <div className="text-center text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Quick 1-Click Evaluation Login
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('recruiter')}
                className="py-2 px-3 rounded-lg bg-purple-950/50 hover:bg-purple-900/60 border border-purple-800/40 text-purple-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                <span>Demo Recruiter</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('candidate')}
                className="py-2 px-3 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-800/40 text-emerald-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Demo Candidate</span>
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <span className="text-xs text-slate-400">
              Don't have an account?{' '}
            </span>
            <button
              onClick={() => setActivePage('register')}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Register here
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
