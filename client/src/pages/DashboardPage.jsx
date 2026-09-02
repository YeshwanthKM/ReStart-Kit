import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
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
  const { t } = useLanguage();

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
      const updatedNextSteps = (prev.recommendedNextSteps || []).map(t => {
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
              <span>{t('dash_title')}</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {t('hero_welcome')}, {profileName}!
            </h2>
            <p className="text-emerald-100 text-sm leading-relaxed">
              {t('dash_subtitle')}
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
            <div className="text-xs font-bold text-emerald-200 mt-1 uppercase tracking-wider">{t('dash_overall_progress')}</div>
            <div className="w-full bg-emerald-950/60 rounded-full h-2.5 mt-3 overflow-hidden border border-emerald-500/30">
              <div 
                className="bg-emerald-400 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${stats.overallProgressPercent}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between w-full text-xs text-emerald-200 mt-3 font-semibold">
              <span>{stats.completedTasks} Done</span>
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
                  <span>{t('dash_recommended_title')}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{t('dash_recommended_subtitle')}</p>
              </div>

              {onNavigate && (
                <button
                  onClick={() => onNavigate('roadmap')}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
                >
                  <span>{t('dash_view_full_roadmap')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {recommendedNextSteps.length === 0 ? (
              <div className="p-6 bg-slate-50 rounded-xl text-center text-slate-500 text-xs space-y-3">
                <p>{t('roadmap_empty')}</p>
                {onNavigate && (
                  <button
                    onClick={() => onNavigate('assessment')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors"
                  >
                    {t('hero_btn_assessment')}
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {recommendedNextSteps.map((task) => {
                  const taskSlug = task.pillar?.slug || task.slug;
                  const pillarColor = getPillarColor(taskSlug);
                  return (
                    <div 
                      key={task.id}
                      className={`p-4 rounded-xl border transition-all flex items-start space-x-3 ${
                        task.isCompleted ? 'bg-slate-50 border-slate-200 opacity-75' : 'bg-white border-slate-200 shadow-sm hover:border-emerald-300'
                      }`}
                    >
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className="mt-0.5 focus:outline-none flex-shrink-0"
                      >
                        {task.isCompleted ? (
                          <CheckSquare className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-400 hover:text-emerald-600" />
                        )}
                      </button>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${pillarColor.bg} ${pillarColor.text}`}>
                            {task.pillar?.name || task.pillarName || 'Pillar'}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            task.priority === 'HIGH' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        <h4 className={`text-sm font-bold ${task.isCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                          {task.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{task.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 5-Pillar Progress Breakdown */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <span>{t('dash_pillar_breakdown')}</span>
            </h3>

            <div className="space-y-4">
              {pillarBreakdown.map((item) => {
                const slug = item.slug || item.pillar?.slug;
                const name = item.name || item.pillar?.name || 'Pillar';
                const Icon = getPillarIcon(slug);
                const color = getPillarColor(slug);
                return (
                  <div key={item.id || name} className="space-y-2 p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center space-x-2">
                        <div className={`p-1.5 rounded-lg ${color.bg} ${color.text}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-slate-900">{name}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <span>{item.completedTasks}/{item.totalTasks} {t('dash_tasks_done')}</span>
                        <span className="font-black text-slate-900">{item.progressPercent}%</span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${color.bar}`} 
                        style={{ width: `${item.progressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Quick Action Shortcuts */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Quick Navigation Shortcuts</h3>

            <div className="space-y-2.5">
              {onNavigate && (
                <>
                  <button
                    onClick={() => onNavigate('roadmap')}
                    className="w-full p-3 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-xl text-emerald-900 font-bold text-xs flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <Layers className="w-4 h-4 text-emerald-600" />
                      <span>{t('nav_roadmap')}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-600" />
                  </button>

                  <button
                    onClick={() => onNavigate('resources')}
                    className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-900 font-bold text-xs flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <Compass className="w-4 h-4 text-emerald-600" />
                      <span>{t('nav_resources')}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={() => onNavigate('assessment')}
                    className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-900 font-bold text-xs flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <ClipboardCheck className="w-4 h-4 text-emerald-600" />
                      <span>{t('roadmap_retake_survey')}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
