import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';

export default function LoginPage({ onSuccess, onSwitchToRegister }) {
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    try {
      const userData = await login(email, password);
      if (onSuccess) onSuccess(userData);
    } catch (err) {
      console.error('Login failed:', err);
      const serverMsg = err.response?.data?.message || err.message || 'Invalid email or password. Please try again.';
      setError(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setEmail('admin@restartkit.com');
    setPassword('adminpassword123');
  };

  return (
    <div className="max-w-md mx-auto my-10 space-y-4">
      
      {/* Admin Demo Credentials Box */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center justify-between text-xs text-purple-900">
        <div className="flex items-center space-x-2.5">
          <ShieldCheck className="w-5 h-5 text-purple-600 flex-shrink-0" />
          <div>
            <p className="font-bold">Pre-seeded Admin Account</p>
            <p className="text-[11px] text-purple-700">admin@restartkit.com | adminpassword123</p>
          </div>
        </div>
        <button
          type="button"
          onClick={fillAdminCredentials}
          className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg text-[11px] transition-colors flex items-center space-x-1"
        >
          <KeyRound className="w-3 h-3" />
          <span>Fill</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 p-6 sm:p-8 text-white text-center">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/80 backdrop-blur-sm flex items-center justify-center mx-auto mb-3 border border-emerald-500/50">
            <LogIn className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <p className="text-emerald-100 text-sm mt-1">
            Sign in to access your ReStart Kit roadmap and resources.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-3 text-rose-800 text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>

          {/* Switch to Register */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-emerald-600 font-semibold hover:underline"
              >
                Create one now
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
