import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, 
  Home, 
  GraduationCap, 
  Briefcase, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  ClipboardCheck, 
  User, 
  Square, 
  CheckSquare, 
  Calendar,
  Compass,
  MapPin
} from 'lucide-react';

export default function DashboardPage({ onNavigate }) {
  const { user } = useAuth();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/dashboard/stats');
      if (res.data.success) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error('Fetch dashboard stats error:', err);
      setError(err.message || 'Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const handleToggleTask = async (taskId) => {
    if (!dashboardData) return;

    // Optimistic UI update for recommended tasks
    setDashboardData(prev => {
      if (!prev) return prev;
      const updatedNextSteps = prev.recommendedNextSteps.map(t => {
        if (t.id === taskId) {
          return { ...t, isCompleted: !t.isCompleted };
        }
        return t;
      });
      return {
        ...prev,
        recommendedNextSteps: updatedNextSteps
      };
    });

    try {
      await api.patch(`/tasks/${taskId}/toggle`);
      fetchDashboardStats();
    } catch (err) {
      console.error('Toggle task error:', err);
      fetchDashboardStats();
    }
  };

  const getPillarIcon = (slug) => {
    switch (slug) {
      case 'DOCUMENTS': return FileText;
      case 'BASIC_NEEDS': return Home;
      case 'SKILLS': return GraduationCap;
      case 'EMPLOYMENT': return Briefcase;
      case 'COMMUNITY': return Users;
      default: return Layers;
    }
  };

  const getPillarColor = (slug) => {
    switch (slug) {
      case 'DOCUMENTS': return { text: 'text-blue-600', bg: 'bg-blue-50', bar: 'bg-blue-500' };
      case 'BASIC_NEEDS': return { text: 'text-emerald-600', bg: 'bg-emerald-50', bar: 'bg-emerald-500' };
      case 'SKILLS': return { text: 'text-amber-600', bg: 'bg-amber-50', bar: 'bg-amber-500' };
      case 'EMPLOYMENT': return { text: 'text-purple-600', bg: 'bg-purple-50', bar: 'bg-purple-500' };
      case 'COMMUNITY': return { text: 'text-rose-600', bg: 'bg-rose-50', bar: 'bg-rose-500' };
      default: return { text: 'text-slate-600', bg: 'bg-slate-50', bar: 'bg-slate-500' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-slate-500 space-y-3">
        <RefreshCw className="w-7 h-7 animate-spin text-emerald-600" />
        <span className="text-sm font-semibold">Loading your ReStart dashboard...</span>
      </div>
    );
  }

  const profileName = dashboardData?.profile?.name || user?.profile?.name || user?.email || 'Friend';
  const cityState = dashboardData?.profile?.city || user?.profile?.city 
    ? `${dashboardData?.profile?.city || user?.profile?.city}${dashboardData?.profile?.state ? ', ' + dashboardData.profile.state : ''}`
    : null;

  const stats = dashboardData?.stats || { totalTasks: 0, completedTasks: 0, pendingTasks: 0, overallProgressPercent: 0 };
  const pillarBreakdown = dashboardData?.pillarBreakdown || [];
  const recommendedNextSteps = dashboardData?.recommendedNextSteps || [];

  return (
    <div className="max-w-6xl mx-auto my-8 space-y-8">
      
      {/* Welcome Banner Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-700/80 backdrop-blur-sm text-emerald-100 rounded-full text-xs font-semibold border border-emerald-500/40">
              <Compass className="w-3.5 h-3.5" />
              <span>Personal Reintegration Dashboard</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome, {profileName}!
            </h2>
            <p className="text-emerald-100 text-sm leading-relaxed">
              Track your step-by-step progress across the 5 Reintegration Pillars and execute your top recommended next steps.
            </p>
            {cityState && (
              <div className="flex items-center space-x-1 text-xs text-emerald-200 pt-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{cityState}</span>
              </div>
            )}
          </div>

          {/* Overall Progress Widget Box */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center min-w-[220px] flex flex-col items-center justify-center">
            <div className="text-4xl font-black text-white">{stats.overallProgressPercent}%</div>
            <div className="text-xs font-bold text-emerald-200 mt-1 uppercase tracking-wider">Overall Progress</div>
            <div className="w-full bg-emerald-950/60 rounded-full h-2.5 mt-3 overflow-hidden border border-emerald-500/30">
              <div 
                className="bg-emerald-400 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${stats.overallProgressPercent}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between w-full text-xs text-emerald-200 mt-3 font-semibold">
              <span>{stats.completedTasks} Completed</span>
              <span>{stats.pendingTasks} Pending</span>
            </div>
          </div>

        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT 2 COLUMNS: Recommended Next Steps & 5 Pillars Breakdown */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Recommended Next Steps Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <span>Recommended Next Steps</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Top priority action items for your immediate focus.</p>
              </div>

              {onNavigate && (
                <button
                  onClick={() => onNavigate('roadmap')}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
                >
                  <span>View All Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {recommendedNextSteps.length === 0 ? (
              <div className="p-6 bg-slate-50 rounded-xl text-center text-slate-500 text-xs space-y-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-semibold text-slate-700">
                  {stats.totalTasks > 0 ? 'All pending tasks completed! Great job!' : 'No tasks generated yet.'}
                </p>
                {stats.totalTasks === 0 && onNavigate && (
                  <button
                    onClick={() => onNavigate('assessment')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm"
                  >
                    Take Needs Assessment Now
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {recommendedNextSteps.map((task) => {
                  const Icon = getPillarIcon(task.pillar?.slug);
                  return (
                    <div 
                      key={task.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-emerald-300 transition-all flex items-start space-x-3"
                    >
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors focus:outline-none flex-shrink-0"
                      >
                        {task.isCompleted ? (
                          <CheckSquare className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                        )}
                      </button>

                      <div className="flex-grow space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-slate-600 flex items-center space-x-1">
                            <Icon className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{task.pillar?.name}</span>
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                            {task.priority} Priority
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900">{task.title}</h4>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{task.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 5 Reintegration Pillars Progress Breakdown Cards */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">5 Reintegration Pillars Progress</h3>
              <p className="text-xs text-slate-500 mt-0.5">Completion breakdown across all core reintegration areas.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pillarBreakdown.map((pillar) => {
                const Icon = getPillarIcon(pillar.slug);
                const colors = getPillarColor(pillar.slug);
                return (
                  <div key={pillar.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${colors.text}`} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{pillar.name}</h4>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {pillar.completedTasks} / {pillar.totalTasks} Tasks Done
                          </span>
                        </div>
                      </div>

                      <span className="text-sm font-black text-slate-900">{pillar.progressPercent}%</span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${colors.bar}`}
                        style={{ width: `${pillar.progressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT 1 COLUMN: Quick Actions & Profile Summary */}
        <div className="space-y-6">
          
          {/* Quick Action Shortcuts Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Quick Actions</h3>

            <div className="space-y-2.5">
              <button
                onClick={() => onNavigate && onNavigate('roadmap')}
                className="w-full p-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold text-xs rounded-xl border border-emerald-200 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center space-x-2.5">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>View Full ReStart Roadmap</span>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-700" />
              </button>

              <button
                onClick={() => onNavigate && onNavigate('assessment')}
                className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center space-x-2.5">
                  <ClipboardCheck className="w-4 h-4 text-slate-600" />
                  <span>Update Needs Assessment</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigate && onNavigate('profile')}
                className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center space-x-2.5">
                  <User className="w-4 h-4 text-slate-600" />
                  <span>Edit Profile & Location</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-bold text-xl flex items-center justify-center shadow-sm">
                {profileName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">{profileName}</h4>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1">
              {user?.profile?.city && (
                <div><span className="font-semibold text-slate-700">Location:</span> {user.profile.city}, {user.profile.state || ''}</div>
              )}
              <div><span className="font-semibold text-slate-700">Role:</span> {user?.role}</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
