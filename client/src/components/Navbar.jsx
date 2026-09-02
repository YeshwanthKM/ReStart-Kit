import React from 'react';
import { Compass, User, LogOut, LogIn, UserPlus, ClipboardCheck, Layers, LayoutDashboard, ShieldCheck, Building2, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ currentView, setCurrentView }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { lang, changeLanguage, t } = useLanguage();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        
        {/* Logo & Branding */}
        <button 
          onClick={() => setCurrentView('home')}
          className="flex items-center space-x-3 group text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-600 group-hover:bg-emerald-700 flex items-center justify-center text-white shadow-md transition-colors">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>{t('nav_brand')}</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">{t('nav_tagline')}</p>
          </div>
        </button>

        {/* Navigation, Language Switcher & Auth Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Language Switcher Pills */}
          <div className="bg-slate-100 p-0.5 rounded-xl flex items-center border border-slate-200 text-xs font-bold mr-1 sm:mr-2">
            <button
              onClick={() => changeLanguage('en')}
              className={`px-2 py-1 rounded-lg transition-all ${
                lang === 'en'
                  ? 'bg-white text-emerald-800 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="English"
            >
              EN
            </button>
            <button
              onClick={() => changeLanguage('ta')}
              className={`px-2 py-1 rounded-lg transition-all ${
                lang === 'ta'
                  ? 'bg-white text-emerald-800 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Tamil (தமிழ்)"
            >
              தமிழ்
            </button>
            <button
              onClick={() => changeLanguage('hi')}
              className={`px-2 py-1 rounded-lg transition-all ${
                lang === 'hi'
                  ? 'bg-white text-emerald-800 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Hindi (हिंदी)"
            >
              हिंदी
            </button>
          </div>

          <button
            onClick={() => setCurrentView('home')}
            className={`px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              currentView === 'home' 
                ? 'bg-slate-100 text-slate-900 font-semibold' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {t('nav_home')}
          </button>

          {/* LOCAL RESOURCES LINK FOR ALL USERS */}
          <button
            onClick={() => setCurrentView('resources')}
            className={`px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center space-x-1 sm:space-x-1.5 ${
              currentView === 'resources' 
                ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">{t('nav_resources')}</span>
          </button>

          {isAuthenticated ? (
            <>
              {/* ADMIN NAVIGATION */}
              {isAdmin ? (
                <button
                  onClick={() => setCurrentView('admin')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-colors flex items-center space-x-1.5 ${
                    currentView === 'admin' 
                      ? 'bg-purple-100 text-purple-900 font-bold border border-purple-300' 
                      : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>{t('nav_admin')}</span>
                </button>
              ) : (
                /* STANDARD USER NAVIGATION */
                <>
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                      currentView === 'dashboard' 
                        ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t('nav_dashboard')}</span>
                  </button>

                  <button
                    onClick={() => setCurrentView('roadmap')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                      currentView === 'roadmap' 
                        ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden sm:inline">{t('nav_roadmap')}</span>
                  </button>
                </>
              )}

              <button
                onClick={() => setCurrentView('profile')}
                className={`px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                  currentView === 'profile' 
                    ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">{t('nav_profile')}</span>
              </button>

              <div className="h-4 w-px bg-slate-200 mx-0.5"></div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  logout();
                  setCurrentView('home');
                }}
                className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg border border-rose-200 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{t('nav_logout')}</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setCurrentView('login')}
                className={`px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center space-x-1 ${
                  currentView === 'login'
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t('nav_login')}</span>
              </button>

              <button
                onClick={() => setCurrentView('register')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center space-x-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{t('nav_register')}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
