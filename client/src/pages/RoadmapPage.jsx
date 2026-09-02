import React, { useState, useEffect } from 'react';
import api from '../services/api';
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
  ArrowRight
} from 'lucide-react';

export default function RoadmapPage({ onNavigateToAssessment }) {
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
        if (autoGenIfEmpty && fetchedStats.total === 0) {
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

  const handleGenerateTasks = async (isAuto = false) => {
    setGenLoading(true);
    if (!isAuto) {
      setError(null);
      setSuccessMsg(null);
    }
    try {
      const res = await api.post('/tasks/generate');
      if (res.data.success) {
        if (!isAuto) {
          setSuccessMsg(res.data.message || 'ReStart Kit generated successfully!');
        }
        // Refetch after generation
        const refetchRes = await api.get('/tasks');
        if (refetchRes.data.success) {
          setTasks(refetchRes.data.tasks || []);
          setStats(refetchRes.data.stats || { total: 0, completed: 0, pending: 0, progressPercent: 0 });
        }
      }
    } catch (err) {
      console.error('Generate tasks error:', err);
      if (!isAuto) {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('Please complete your Needs & Goals Assessment first.');
        }
      }
    } finally {
      setGenLoading(false);
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId) => {
    // Optimistic UI update
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextState = !t.isCompleted;
        return {
          ...t,
          isCompleted: nextState,
          completedAt: nextState ? new Date().toISOString() : null
        };
      }
      return t;
    }));

    try {
      const res = await api.patch(`/tasks/${taskId}/toggle`);
      if (res.data.success) {
        fetchTasks(false);
      }
    } catch (err) {
      console.error('Toggle task error:', err);
      fetchTasks(false);
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
    { slug: 'ALL', name: 'All Pillars' },
    { slug: 'DOCUMENTS', name: '1. Documents' },
    { slug: 'BASIC_NEEDS', name: '2. Basic Needs' },
    { slug: 'SKILLS', name: '3. Skills' },
    { slug: 'EMPLOYMENT', name: '4. Employment' },
    { slug: 'COMMUNITY', name: '5. Community' }
  ];

  return (
    <div className="max-w-5xl mx-auto my-8 space-y-6">
      
      {/* Roadmap Header & Progress Summary Card */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-block px-3 py-1 bg-emerald-700/80 backdrop-blur-sm text-emerald-100 rounded-full text-xs font-semibold border border-emerald-500/40">
              Personalized ReStart Checklist
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Your ReStart Kit Roadmap</h2>
            <p className="text-emerald-100 text-sm leading-relaxed">
              Step-by-step actionable tasks tailored to your assessment needs across the 5 Reintegration Pillars.
            </p>
          </div>

          {/* Progress Ring Box */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-center min-w-[200px] flex flex-col items-center justify-center">
            <div className="text-3xl font-black text-white">{stats.progressPercent}%</div>
            <div className="text-xs font-semibold text-emerald-200 mt-0.5">Overall Progress</div>
            <div className="w-full bg-emerald-950/60 rounded-full h-2 mt-3 overflow-hidden border border-emerald-500/30">
              <div 
                className="bg-emerald-400 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${stats.progressPercent}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between w-full text-[11px] text-emerald-200 mt-2 font-medium">
              <span>{stats.completed} Done</span>
              <span>{stats.pending} Remaining</span>
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
              <span>Take Assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Filter & Generation Controls Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Pillar Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {pillarsList.map(p => (
              <button
                key={p.slug}
                onClick={() => setSelectedPillar(p.slug)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedPillar === p.slug
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          {/* Actions & Status Filter */}
          <div className="flex items-center space-x-3 justify-end">
            
            {/* Status Selector */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 text-xs">
              <button
                onClick={() => setSelectedStatus('ALL')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  selectedStatus === 'ALL' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600'
                }`}
              >
                All Status
              </button>
              <button
                onClick={() => setSelectedStatus('PENDING')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  selectedStatus === 'PENDING' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setSelectedStatus('COMPLETED')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  selectedStatus === 'COMPLETED' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600'
                }`}
              >
                Completed
              </button>
            </div>

            {/* Re-generate Roadmap Button */}
            <button
              onClick={() => handleGenerateTasks(false)}
              disabled={genLoading}
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-xl border border-emerald-200 transition-colors flex items-center space-x-1.5 disabled:opacity-50"
              title="Refresh / Auto-Generate Tasks from Assessment"
            >
              <Sparkles className={`w-3.5 h-3.5 text-emerald-600 ${genLoading ? 'animate-spin' : ''}`} />
              <span>{genLoading ? 'Generating...' : 'Refresh Tasks'}</span>
            </button>

          </div>
        </div>
      </div>

      {/* Task Checklist Items List */}
      {loading || genLoading ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-slate-500 space-y-3">
          <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
          <span className="text-sm font-medium">Generating your ReStart Kit roadmap...</span>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Tasks Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            {stats.total === 0
              ? 'Please complete your Needs & Goals Assessment to auto-generate your step-by-step fresh start roadmap.'
              : 'No tasks match your selected filter options.'}
          </p>

          <div className="pt-2 flex justify-center space-x-3">
            {stats.total === 0 ? (
              <button
                onClick={onNavigateToAssessment}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center space-x-2"
              >
                <span>Take Assessment Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setSelectedPillar('ALL');
                  setSelectedStatus('ALL');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => {
            const PillarIcon = getPillarIcon(task.pillar?.slug);
            return (
              <div 
                key={task.id}
                className={`bg-white rounded-2xl p-5 shadow-sm border transition-all flex items-start space-x-4 ${
                  task.isCompleted 
                    ? 'bg-slate-50/70 border-slate-200 opacity-80' 
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {/* Interactive Checkbox Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggleTask(task.id)}
                  className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors focus:outline-none flex-shrink-0"
                  title={task.isCompleted ? 'Mark incomplete' : 'Mark complete'}
                >
                  {task.isCompleted ? (
                    <CheckSquare className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <Square className="w-6 h-6 text-slate-400 hover:text-slate-600" />
                  )}
                </button>

                {/* Task Details Content */}
                <div className="flex-grow space-y-1.5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    
                    <div className="flex items-center space-x-2">
                      {/* Pillar Icon Badge */}
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200">
                        <PillarIcon className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{task.pillar?.name || 'General'}</span>
                      </span>

                      {/* Priority Badge */}
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider border ${getPriorityStyle(task.priority)}`}>
                        {task.priority} Priority
                      </span>
                    </div>

                    {/* Due Date Indicator */}
                    {task.dueDate && (
                      <div className="flex items-center space-x-1 text-[11px] text-slate-400 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Target: {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                      </div>
                    )}
                  </div>

                  {/* Task Title */}
                  <h4 className={`text-base font-bold text-slate-900 ${task.isCompleted ? 'line-through text-slate-500' : ''}`}>
                    {task.title}
                  </h4>

                  {/* Task Description */}
                  <p className={`text-xs leading-relaxed ${task.isCompleted ? 'text-slate-400' : 'text-slate-600'}`}>
                    {task.description}
                  </p>

                  {/* Completion Timestamp */}
                  {task.isCompleted && task.completedAt && (
                    <div className="text-[11px] text-emerald-700 font-semibold flex items-center space-x-1 pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Completed on {new Date(task.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
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
