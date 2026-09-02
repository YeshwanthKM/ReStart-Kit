import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  FileText, 
  Home, 
  GraduationCap, 
  Briefcase, 
  Users, 
  ShieldCheck,
  Compass
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export default function App() {
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHealthStatus(data);
    } catch (err) {
      console.error("Health check error:", err);
      setError(err.message || 'Failed to connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const pillars = [
    {
      id: 'DOCUMENTS',
      title: '1. Documents',
      icon: FileText,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Identity cards, legal papers, and government documentation guidance.'
    },
    {
      id: 'BASIC_NEEDS',
      title: '2. Basic Needs',
      icon: Home,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      description: 'Stable housing, food security, and essential support resources.'
    },
    {
      id: 'SKILLS',
      title: '3. Skills',
      icon: GraduationCap,
      color: 'bg-amber-500',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      description: 'Skill development programs, vocational training, and digital literacy.'
    },
    {
      id: 'EMPLOYMENT',
      title: '4. Employment',
      icon: Briefcase,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Job preparation, resume support, and placement opportunities.'
    },
    {
      id: 'COMMUNITY',
      title: '5. Community',
      icon: Users,
      color: 'bg-rose-500',
      textColor: 'text-rose-600',
      bgColor: 'bg-rose-50',
      description: 'Mentorship networks, community organizations, and local support NGOs.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
      {/* Header / Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">ReStart Kit</h1>
              <p className="text-xs text-slate-500">A Guided Path to a Fresh Start</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Phase 0 Foundation</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full space-y-10">
        
        {/* Banner Section */}
        <section className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-3 py-1 bg-emerald-700/80 backdrop-blur-sm text-emerald-100 rounded-full text-xs font-medium mb-4 border border-emerald-600/50">
              Personalized Reintegration Platform
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
              Rebuild your life with clarity and confidence.
            </h2>
            <p className="text-emerald-100 text-base sm:text-lg leading-relaxed mb-6">
              ReStart Kit transforms overwhelming challenges into a personalized, step-by-step actionable roadmap supported by verified local resources across 5 key reintegration pillars.
            </p>
          </div>
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
        </section>

        {/* Backend API Health Status Verification Card */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <span>Backend API Connection Status</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Target Endpoint: <code className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-mono text-xs">{API_BASE_URL}/health</code>
              </p>
            </div>

            <button 
              onClick={checkHealth}
              disabled={loading}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Testing Connection...' : 'Re-test API'}</span>
            </button>
          </div>

          {/* Connection Status Box */}
          {loading ? (
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 space-x-3">
              <RefreshCw className="w-5 h-5 animate-spin text-emerald-600" />
              <span className="text-sm font-medium">Checking backend status...</span>
            </div>
          ) : error ? (
            <div className="p-5 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-3 text-rose-800">
              <XCircle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Backend Disconnected</p>
                <p className="text-xs text-rose-600 mt-1">{error}</p>
                <p className="text-xs text-slate-500 mt-2">Ensure Express server is running: <code className="bg-rose-100 text-rose-900 px-1.5 py-0.5 rounded font-mono">npm run dev:server</code></p>
              </div>
            </div>
          ) : healthStatus ? (
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-3 text-emerald-900">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="flex-grow">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="font-bold text-sm text-emerald-950">{healthStatus.message}</p>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-semibold text-xs">
                    HTTP 200 OK
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-emerald-800 border-t border-emerald-200/60 pt-3">
                  <div><span className="font-semibold">Success Flag:</span> {String(healthStatus.success)}</div>
                  <div><span className="font-semibold">Server Timestamp:</span> {healthStatus.timestamp}</div>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        {/* Five Reintegration Pillars Section */}
        <section className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">The 5 Reintegration Pillars</h3>
            <p className="text-sm text-slate-600">ReStart Kit organizes guidance and resources across five core pillars.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div key={pillar.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 rounded-xl ${pillar.bgColor} flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${pillar.textColor}`} />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-2">{pillar.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{pillar.description}</p>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-slate-500">
          <p>ReStart Kit – Guided Path to a Fresh Start &copy; 2026. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
