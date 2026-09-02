import React from 'react';
import { Compass, User, LogOut, LogIn, UserPlus, ShieldAlert, HeartHandshake } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ currentView, setCurrentView }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        
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
              <span>ReStart Kit</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">A Guided Path to a Fresh Start</p>
          </div>
        </button>

        {/* Navigation & Auth Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={() => setCurrentView('home')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'home' 
                ? 'bg-slate-100 text-slate-900 font-semibold' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Overview
          </button>

          {isAuthenticated ? (
            <>
              <button
                onClick={() => setCurrentView('profile')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                  currentView === 'profile' 
                    ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <User className="w-4 h-4 text-emerald-600" />
                <span>Profile</span>
              </button>

              <div className="h-4 w-px bg-slate-200 mx-1"></div>

              {/* User Profile Badge */}
              <div className="hidden sm:flex items-center space-x-2 text-xs">
                <span className="font-semibold text-slate-800">{user.profile?.name || user.email}</span>
                <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                  isAdmin ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-blue-100 text-blue-800 border border-blue-200'
                }`}>
                  {user.role}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  logout();
                  setCurrentView('home');
                }}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs sm:text-sm font-semibold rounded-lg border border-rose-200 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setCurrentView('login')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
                  currentView === 'login'
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => setCurrentView('register')}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center space-x-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
