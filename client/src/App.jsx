import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AssessmentPage from './pages/AssessmentPage';
import RoadmapPage from './pages/RoadmapPage';
import DashboardPage from './pages/DashboardPage';
import ResourceDirectoryPage from './pages/ResourceDirectoryPage';
import AdminPage from './pages/AdminPage';
import { 
  Compass, 
  FileText, 
  Home as HomeIcon, 
  GraduationCap, 
  Briefcase, 
  Users as CommunityIcon, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Building2,
  ListCheck,
  Sparkles
} from 'lucide-react';

function MainContent({ currentView, setCurrentView }) {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { t } = useLanguage();

  const pillars = [
    {
      id: 'DOCUMENTS',
      title: t('pillar_documents'),
      icon: FileText,
      color: 'bg-blue-500 text-blue-100',
      bgColor: 'bg-blue-50 border-blue-200',
      description: t('pillar_documents_desc')
    },
    {
      id: 'BASIC_NEEDS',
      title: t('pillar_basic_needs'),
      icon: HomeIcon,
      color: 'bg-emerald-500 text-emerald-100',
      bgColor: 'bg-emerald-50 border-emerald-200',
      description: t('pillar_basic_needs_desc')
    },
    {
      id: 'SKILLS',
      title: t('pillar_skills'),
      icon: GraduationCap,
      color: 'bg-purple-500 text-purple-100',
      bgColor: 'bg-purple-50 border-purple-200',
      description: t('pillar_skills_desc')
    },
    {
      id: 'EMPLOYMENT',
      title: t('pillar_employment'),
      icon: Briefcase,
      color: 'bg-amber-500 text-amber-100',
      bgColor: 'bg-amber-50 border-amber-200',
      description: t('pillar_employment_desc')
    },
    {
      id: 'COMMUNITY',
      title: t('pillar_community'),
      icon: CommunityIcon,
      color: 'bg-rose-500 text-rose-100',
      bgColor: 'bg-rose-50 border-rose-200',
      description: t('pillar_community_desc')
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800">
      
      {/* Navigation Header */}
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      {/* Main View Router */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {currentView === 'login' && (
          <LoginPage 
            onSuccess={(userData) => {
              if (userData?.role === 'ADMIN') {
                setCurrentView('admin');
              } else {
                setCurrentView('dashboard');
              }
            }} 
            onSwitchToRegister={() => setCurrentView('register')} 
          />
        )}

        {currentView === 'register' && (
          <RegisterPage 
            onSuccess={() => setCurrentView('assessment')} 
            onSwitchToLogin={() => setCurrentView('login')} 
          />
        )}

        {currentView === 'dashboard' && (
          <ProtectedRoute onRedirect={(view) => setCurrentView(view)}>
            <DashboardPage onNavigate={(view) => setCurrentView(view)} />
          </ProtectedRoute>
        )}

        {currentView === 'roadmap' && (
          <ProtectedRoute onRedirect={(view) => setCurrentView(view)}>
            <RoadmapPage onNavigateToAssessment={() => setCurrentView('assessment')} />
          </ProtectedRoute>
        )}

        {currentView === 'assessment' && (
          <ProtectedRoute onRedirect={(view) => setCurrentView(view)}>
            <AssessmentPage onComplete={() => setCurrentView('dashboard')} />
          </ProtectedRoute>
        )}

        {currentView === 'profile' && (
          <ProtectedRoute onRedirect={(view) => setCurrentView(view)}>
            <ProfilePage />
          </ProtectedRoute>
        )}

        {currentView === 'resources' && (
          <ResourceDirectoryPage />
        )}

        {currentView === 'admin' && (
          <ProtectedRoute requireAdmin={true} onRedirect={(view) => setCurrentView(view)}>
            <AdminPage />
          </ProtectedRoute>
        )}

        {currentView === 'home' && (
          <div className="space-y-10">
            
            {/* Banner Section */}
            <section className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
              <div className="relative z-10 max-w-2xl space-y-4">
                <span className="inline-block px-3 py-1 bg-emerald-700/80 backdrop-blur-sm text-emerald-100 rounded-full text-xs font-medium border border-emerald-600/50">
                  {t('hero_badge')}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  {isAuthenticated 
                    ? `${t('hero_welcome')}, ${user.profile?.name || user.email}!` 
                    : t('hero_guest_title')}
                </h2>
                <p className="text-emerald-100 text-base sm:text-lg leading-relaxed">
                  {t('hero_description')}
                </p>

                {/* Call to Actions */}
                <div className="pt-2 flex flex-wrap gap-3">
                  {!isAuthenticated ? (
                    <>
                      <button 
                        onClick={() => setCurrentView('register')}
                        className="px-5 py-2.5 bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-sm rounded-xl shadow-md transition-all flex items-center space-x-2"
                      >
                        <span>{t('hero_btn_create')}</span>
                        <ArrowRight className="w-4 h-4 text-emerald-700" />
                      </button>
                      <button 
                        onClick={() => setCurrentView('login')}
                        className="px-5 py-2.5 bg-emerald-700/80 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl border border-emerald-500/50 transition-colors"
                      >
                        {t('hero_btn_signin')}
                      </button>
                      <button 
                        onClick={() => setCurrentView('resources')}
                        className="px-5 py-2.5 bg-emerald-900/60 hover:bg-emerald-900 text-emerald-100 font-semibold text-sm rounded-xl border border-emerald-500/30 transition-colors flex items-center space-x-1.5"
                      >
                        <Building2 className="w-4 h-4 text-emerald-300" />
                        <span>{t('hero_btn_resources')}</span>
                      </button>
                    </>
                  ) : isAdmin ? (
                    <button 
                      onClick={() => setCurrentView('admin')}
                      className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center space-x-2 border border-purple-400/30"
                    >
                      <ShieldCheck className="w-4 h-4 text-purple-200" />
                      <span>{t('hero_btn_admin')}</span>
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={() => setCurrentView('dashboard')}
                        className="px-5 py-2.5 bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-sm rounded-xl shadow-md transition-all flex items-center space-x-2"
                      >
                        <span>{t('nav_dashboard')}</span>
                        <ArrowRight className="w-4 h-4 text-emerald-700" />
                      </button>
                      <button 
                        onClick={() => setCurrentView('roadmap')}
                        className="px-5 py-2.5 bg-emerald-700/80 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl border border-emerald-500/50 transition-colors flex items-center space-x-1.5"
                      >
                        <ListCheck className="w-4 h-4 text-emerald-200" />
                        <span>{t('hero_btn_roadmap')}</span>
                      </button>
                      <button 
                        onClick={() => setCurrentView('assessment')}
                        className="px-5 py-2.5 bg-emerald-900/60 hover:bg-emerald-900 text-emerald-100 font-semibold text-sm rounded-xl border border-emerald-500/30 transition-colors"
                      >
                        {t('hero_btn_assessment')}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </section>

            {/* 5 Core Pillars Grid */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{t('pillars_section_title')}</h3>
                  <p className="text-sm text-slate-500">{t('pillars_section_desc')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {pillars.map((pillar) => {
                  const Icon = pillar.icon;
                  return (
                    <div 
                      key={pillar.id}
                      className={`p-5 rounded-2xl border ${pillar.bgColor} transition-all hover:shadow-md flex flex-col justify-between space-y-3`}
                    >
                      <div>
                        <div className={`w-10 h-10 rounded-xl ${pillar.color} flex items-center justify-center mb-3 shadow-sm`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mb-2">{pillar.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{pillar.description}</p>
                      </div>
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
          <p>{t('footer_text')}</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState('home');

  return (
    <AuthProvider>
      <LanguageProvider>
        <MainContent currentView={currentView} setCurrentView={setCurrentView} />
      </LanguageProvider>
    </AuthProvider>
  );
}
