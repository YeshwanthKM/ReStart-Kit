import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import AssessmentPage from './pages/AssessmentPage';
import RoadmapPage from './pages/RoadmapPage';
import { 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  FileText, 
  Home as HomeIcon, 
  GraduationCap, 
  Briefcase, 
  Users, 
  ShieldCheck,
  Compass,
  ArrowRight,
  UserCheck,
  ClipboardCheck,
  Layers,
  Sparkles
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

function MainContent({ currentView, setCurrentView }) {
  const { user, isAuthenticated } = useAuth();
  const [healthStatus, setHealthStatus] = useState(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [healthError, setHealthError] = useState(null);

  const checkHealth = async () => {
    setHealthLoading(true);
    setHealthError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHealthStatus(data);
    } catch (err) {
      console.error("Health check error:", err);
      setHealthError(err.message || 'Failed to connect to backend server');
    } finally {
      setHealthLoading(false);
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
      icon: HomeIcon,
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
      
      {/* Navigation Header */}
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      {/* Main View Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full space-y-10">

        {/* View Switcher */}
        {currentView === 'register' && (
          <RegisterPage 
            onSuccess={() => setCurrentView('assessment')} 
            onSwitchToLogin={() => setCurrentView('login')} 
          />
        )}

        {currentView === 'login' && (
          <LoginPage 
            onSuccess={() => setCurrentView('roadmap')} 
            onSwitchToRegister={() => setCurrentView('register')} 
          />
        )}

        {currentView === 'roadmap' && (
          <ProtectedRoute onRedirect={(view) => setCurrentView(view)}>
            <RoadmapPage onNavigateToAssessment={() => setCurrentView('assessment')} />
          </ProtectedRoute>
        )}

        {currentView === 'assessment' && (
          <ProtectedRoute onRedirect={(view) => setCurrentView(view)}>
            <AssessmentPage onComplete={() => setCurrentView('roadmap')} />
          </ProtectedRoute>
        )}

        {currentView === 'profile' && (
          <ProtectedRoute onRedirect={(view) => setCurrentView(view)}>
            <ProfilePage />
          </ProtectedRoute>
        )}

        {currentView === 'home' && (
          <div className="space-y-10">
            
            {/* Banner Section */}
            <section className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
              <div className="relative z-10 max-w-2xl space-y-4">
                <span className="inline-block px-3 py-1 bg-emerald-700/80 backdrop-blur-sm text-emerald-100 rounded-full text-xs font-medium border border-emerald-600/50">
                  Personalized Reintegration Platform
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  {isAuthenticated 
                    ? `Welcome back, ${user.profile?.name || user.email}!` 
                    : 'Rebuild your life with clarity and confidence.'}
                </h2>
                <p className="text-emerald-100 text-base sm:text-lg leading-relaxed">
                  ReStart Kit transforms overwhelming challenges into a personalized, step-by-step actionable roadmap supported by verified local resources across 5 key reintegration pillars.
                </p>

                {/* Call to Actions */}
                <div className="pt-2 flex flex-wrap gap-3">
                  {!isAuthenticated ? (
                    <>
                      <button 
                        onClick={() => setCurrentView('register')}
                        className="px-5 py-2.5 bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-sm rounded-xl shadow-md transition-all flex items-center space-x-2"
                      >
                        <span>Create Free Account</span>
                        <ArrowRight className="w-4 h-4 text-emerald-700" />
                      </button>
                      <button 
                        onClick={() => setCurrentView('login')}
                        className="px-5 py-2.5 bg-emerald-700/80 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl border border-emerald-500/50 transition-colors"
                      >
                        Sign In
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => setCurrentView('roadmap')}
                        className="px-5 py-2.5 bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-sm rounded-xl shadow-md transition-all flex items-center space-x-2"
                      >
                        <Layers className="w-4 h-4 text-emerald-700" />
                        <span>View My Roadmap</span>
                      </button>

                      <button 
                        onClick={() => setCurrentView('assessment')}
                        className="px-5 py-2.5 bg-emerald-700/80 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl border border-emerald-500/50 transition-colors flex items-center space-x-1.5"
                      >
                        <ClipboardCheck className="w-4 h-4" />
                        <span>Assessment</span>
                      </button>
                    </>
                  )}
                </div>
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
                  disabled={healthLoading}
                  className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${healthLoading ? 'animate-spin' : ''}`} />
                  <span>{healthLoading ? 'Testing...' : 'Re-test API'}</span>
                </button>
              </div>

              {/* Connection Status Box */}
              {healthLoading ? (
                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 space-x-3">
                  <RefreshCw className="w-5 h-5 animate-spin text-emerald-600" />
                  <span className="text-sm font-medium">Checking backend status...</span>
                </div>
              ) : healthError ? (
                <div className="p-5 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-3 text-rose-800">
                  <XCircle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Backend Disconnected</p>
                    <p className="text-xs text-rose-600 mt-1">{healthError}</p>
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

          </div>
        )}

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

export default function App() {
  const [currentView, setCurrentView] = useState('home');

  return (
    <AuthProvider>
      <MainContent currentView={currentView} setCurrentView={setCurrentView} />
    </AuthProvider>
  );
}
