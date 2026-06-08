import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, LogIn, Lock, Mail, UserPlus } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || loading) return;

    setErrorMsg('');
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(result.message);
      setLoading(false);
    }
  };

  // Pre-fill helper to make testing very easy for the user
  const handleQuickLogin = (roleEmail, rolePass) => {
    setEmail(roleEmail);
    setPassword(rolePass);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-slate-950">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-brand-500/10 blur-[100px] pulse-glow"></div>

      <div className="w-full max-w-md space-y-8 glass-panel p-8 rounded-3xl border border-slate-800/80 relative z-10">
        
        {/* Title / Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/20 items-center justify-center mb-2">
            <GraduationCap className="h-6 w-6 text-gold-400" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100 font-sans">
            Sign In to SBVM Portal
          </h2>
          <p className="text-xs text-slate-400">
            Enter credentials to access your student, parent, or administrative desk.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-3 text-xs text-red-400 text-left">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <Mail className="w-4 h-4" />
              </span>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@sbvm.edu.in"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <Lock className="w-4 h-4" />
              </span>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 font-bold text-sm text-white transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" /> {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Seeding access buttons to make verification instant for the user */}
        <div className="border-t border-slate-800/80 pt-6 space-y-3">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-center">Testing Credentials</p>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => handleQuickLogin('admin@sbvm.edu.in', 'adminPassword123')}
              className="py-1.5 px-3 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-brand-500/30 text-[10px] text-slate-300 font-medium transition-all"
            >
              🔑 Admin Access
            </button>
            <Link 
              to="/register" 
              className="py-1.5 px-3 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-gold-500/30 text-[10px] text-slate-300 font-medium transition-all flex items-center justify-center gap-1"
            >
              <UserPlus className="w-3 h-3 text-gold-400" /> Apply/Guest
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
