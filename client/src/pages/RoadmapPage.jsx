import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  CheckSquare, 
  Square, 
  RefreshCw, 
  FileText, 
  Home, 
  GraduationCap, 
  Briefcase, 
  Users, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Filter,
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function RoadmapPage({ onNavigateToAssessment }) {
  const { user, isAdmin } = useAuth();
  const { t } = useLanguage();

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, progressPercent: 0 });
  const [loading, setLoading] = useState(true);
  const [genLoading, setGenLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Filters
  const [selectedPillar, setSelectedPillar] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const fetchTasks = async (autoGenIfEmpty = false) => {
    setLoading(true);
    setError(null);
    try {
      let url = '/tasks';
      const params = new URLSearchParams();
      if (selectedPillar !== 'ALL') params.append('pillarSlug', selectedPillar);
      if (selectedStatus !== 'ALL') params.append('status', selectedStatus.toLowerCase());
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await api.get(url);
      if (res.data.success) {
        const fetchedTasks = res.data.tasks || [];
        const fetchedStats = res.data.stats || { total: 0, completed: 0, pending: 0, progressPercent: 0 };
        
        setTasks(fetchedTasks);
        setStats(fetchedStats);

        // Auto-trigger generation if no tasks exist yet and autoGenIfEmpty is true
        if (autoGenIfEmpty && fetchedStats.total === 0 && !isAdmin) {
          handleGenerateTasks(true);
        }
      }
    } catch (err) {
      console.error('Fetch tasks error:', err);
      setError(err.message || 'Failed to load your roadmap checklist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(true);
  }, [selectedPillar, selectedStatus]);

  const handleToggleTask = async (taskId) => {
    // Optimistic UI update
    setTasks(prevTasks => 
      prevTasks.map(t => {
        if (t.id === taskId) {
          return { ...t, isCompleted: !t.isCompleted };
        }
        return t;
      })
    );

    try {
      const res = await api.patch(`/tasks/${taskId}/toggle`);
      if (res.data.success) {
        fetchTasks(false);
      }
    } catch (err) {
      console.error('Toggle task error:', err);
      setError(err.message || 'Failed to update task completion status');
      fetchTasks(false);
    }
  };

  const handleGenerateTasks = async (isAuto = false) => {
    setGenLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await api.post('/tasks/generate');
      if (res.data.success) {
        if (!isAuto) {
          setSuccessMsg(res.data.message || 'Tasks generated based on your assessment!');
        }
        fetchTasks(false);
      }
    } catch (err) {
      console.error('Task generation error:', err);
      if (!isAuto) {
        setError(err.response?.data?.message || err.message || 'Please complete your assessment survey to generate tasks.');
      }
    } finally {
      setGenLoading(false);
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

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'LOW':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const pillarsList = [
    { slug: 'ALL', name: t('roadmap_all_pillars') },
    { slug: 'DOCUMENTS', name: `1. ${t('pillar_documents')}` },
    { slug: 'BASIC_NEEDS', name: `2. ${t('pillar_basic_needs')}` },
    { slug: 'SKILLS', name: `3. ${t('pillar_skills')}` },
    { slug: 'EMPLOYMENT', name: `4. ${t('pillar_employment')}` },
    { slug: 'COMMUNITY', name: `5. ${t('pillar_community')}` }
  ];

  return (
    <div className="max-w-5xl mx-auto my-8 space-y-6">
      
      {/* Roadmap Header & Progress Summary Card */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-block px-3 py-1 bg-emerald-700/80 backdrop-blur-sm text-emerald-100 rounded-full text-xs font-semibold border border-emerald-500/40">
              {t('roadmap_title')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{t('roadmap_title')}</h2>
            <p className="text-emerald-100 text-sm leading-relaxed">
              {t('roadmap_subtitle')}
            </p>
          </div>

          {/* Progress Ring Box */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-center min-w-[200px] flex flex-col items-center justify-center">
            <div className="text-3xl font-black text-white">{stats.progressPercent}%</div>
            <div className="text-xs font-semibold text-emerald-200 mt-0.5">{t('dash_overall_progress')}</div>
            <div className="w-full bg-emerald-950/60 rounded-full h-2 mt-3 overflow-hidden border border-emerald-500/30">
              <div 
                className="bg-emerald-400 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${stats.progressPercent}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between w-full text-[11px] text-emerald-200 mt-2 font-medium">
              <span>{stats.completed} Done</span>
              <span>{stats.pending} Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-3 text-emerald-800 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-rose-800 text-sm">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
          {onNavigateToAssessment && (
            <button
              onClick={onNavigateToAssessment}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1"
            >
              <span>{t('hero_btn_assessment')}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Filter Controls Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Pillar Tabs */}
        <div className="flex items-center flex-wrap gap-1.5 w-full md:w-auto">
          {pillarsList.map((p) => (
            <button
              key={p.slug}
              onClick={() => setSelectedPillar(p.slug)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedPillar === p.slug
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2 self-end md:self-auto">
          <span className="text-xs font-semibold text-slate-500">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">{t('roadmap_all_status')}</option>
            <option value="PENDING">{t('roadmap_pending')}</option>
            <option value="COMPLETED">{t('roadmap_completed')}</option>
          </select>
        </div>

      </div>

      {/* Task List */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 space-y-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <RefreshCw className="w-6 h-6 animate-spin text-emerald-600 mx-auto" />
          <p className="text-xs font-semibold">Loading roadmap checklist...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="p-10 text-center text-slate-500 space-y-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Layers className="w-6 h-6" />
          </div>
          <p className="text-xs max-w-sm mx-auto leading-relaxed">
            {t('roadmap_empty')}
          </p>
          {onNavigateToAssessment && (
            <button
              onClick={onNavigateToAssessment}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all inline-flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('hero_btn_assessment')}</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => {
            const Icon = getPillarIcon(task.pillar?.slug);
            const priorityStyle = getPriorityStyle(task.priority);
            return (
              <div
                key={task.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start space-x-4 ${
                  task.isCompleted
                    ? 'bg-slate-50/80 border-slate-200 opacity-80'
                    : 'bg-white border-slate-200 shadow-sm hover:border-emerald-300'
                }`}
              >
                {/* Toggle Checkbox */}
                <button
                  onClick={() => handleToggleTask(task.id)}
                  className="mt-0.5 focus:outline-none flex-shrink-0"
                >
                  {task.isCompleted ? (
                    <CheckSquare className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400 hover:text-emerald-600 transition-colors" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-bold flex items-center space-x-1">
                        <Icon className="w-3 h-3 text-slate-500" />
                        <span>{task.pillar?.name}</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${priorityStyle}`}>
                        {task.priority} Priority
                      </span>
                    </div>

                    {task.targetDueDate && (
                      <span className="text-[11px] text-slate-400 flex items-center space-x-1 font-medium">
                        <Calendar className="w-3 h-3" />
                        <span>Due in {task.targetDueDate ? Math.ceil((new Date(task.targetDueDate) - new Date()) / (1000 * 60 * 60 * 24)) : 7} days</span>
                      </span>
                    )}
                  </div>

                  <h3 className={`text-base font-bold ${task.isCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                    {task.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                    {task.description}
                  </p>

                  {task.isCompleted && task.completedAt && (
                    <div className="text-[11px] text-emerald-700 pt-1 font-semibold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Completed on {new Date(task.completedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
