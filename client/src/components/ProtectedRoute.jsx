import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, RefreshCw } from 'lucide-react';

export default function ProtectedRoute({ children, requireAdmin = false, onRedirect }) {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center p-8 text-slate-500 space-x-2">
        <RefreshCw className="w-5 h-5 animate-spin text-emerald-600" />
        <span className="text-sm font-medium">Verifying session security...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Authentication Required</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          Please log in or create an account to access this page and your personalized ReStart Kit profile.
        </p>
        <div className="pt-2 flex justify-center space-x-3">
          <button
            onClick={() => onRedirect && onRedirect('login')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors"
          >
            Sign In Now
          </button>
          <button
            onClick={() => onRedirect && onRedirect('register')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-lg transition-colors"
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Access Denied</h3>
        <p className="text-sm text-slate-600">
          This area is restricted to system administrators.
        </p>
      </div>
    );
  }

  return children;
}
