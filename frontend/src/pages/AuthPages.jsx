import React, { useState } from 'react';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const LoginPage = ({ onSwitchToRegister, onLoginSuccess, onBackToHome }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('demo@gendoc.ai');
  const [password, setPassword] = useState('demo123');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      onLoginSuccess();
    } else {
      setError('Invalid email or password. You can use 1-Click Demo Login.');
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@gendoc.ai');
    setPassword('demo123');
    setLoading(true);
    await login('demo@gendoc.ai', 'demo123');
    setLoading(false);
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Background Gradients */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="inline-block cursor-pointer" onClick={onBackToHome}>
          <Logo size="lg" className="justify-center" />
        </div>
        <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-white">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Sign in to manage and generate technical documentation
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-slate-900/90 py-8 px-6 sm:px-10 border border-slate-800 rounded-2xl shadow-2xl shadow-black/50 backdrop-blur-xl space-y-6">
          
          {/* 1-Click Demo Button */}
          <button
            onClick={handleDemoLogin}
            type="button"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 border border-indigo-500/40 hover:border-indigo-400 text-indigo-300 hover:text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            1-Click Instant Demo Login (Alex Rivera)
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-xs text-slate-300 uppercase">Or sign in with email</span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@example.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
                />
                <span>Remember me</span>
              </label>
              <a href="#forgot" className="text-indigo-400 hover:text-indigo-300">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-blue-600 hover:from-indigo-600 hover:via-purple-700 hover:to-blue-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? 'Authenticating...' : 'Login to Dashboard'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Google Sign In Placeholder */}
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z" />
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z" />
            </svg>
            Continue with Google
          </button>

          <div className="text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Create Account
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export const RegisterPage = ({ onSwitchToLogin, onRegisterSuccess, onBackToHome }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const success = await register(name, email, password);
    setLoading(false);
    if (success) {
      onRegisterSuccess();
    } else {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Background Gradients */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="inline-block cursor-pointer" onClick={onBackToHome}>
          <Logo size="lg" className="justify-center" />
        </div>
        <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-white">
          Create an Account
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Get started with AI-powered documentation generation
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-slate-900/90 py-8 px-6 sm:px-10 border border-slate-800 rounded-2xl shadow-2xl shadow-black/50 backdrop-blur-xl space-y-6">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-blue-600 hover:from-indigo-600 hover:via-purple-700 hover:to-blue-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all mt-2"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-400">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Sign In
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
