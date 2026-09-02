import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  ShieldCheck, 
  Users, 
  ClipboardCheck, 
  Layers, 
  FileText, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Search,
  Building,
  MapPin,
  Calendar,
  Sparkles,
  ListFilter,
  Trash2,
  X
} from 'lucide-react';

export default function AdminPage() {
  const { user: currentAdmin } = useAuth();
  const { t } = useLanguage();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Active Tab & Search
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'templates'
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, usersRes, templatesRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/task-templates')
      ]);

      if (usersRes.data.success) {
        const usersList = usersRes.data.users || [];
        setUsers(usersList);

        // Derive user counts directly from usersList to guarantee 100% alignment across all cards & tabs
        const totalAdmins = usersList.filter(u => u.role === 'ADMIN').length;
        const totalStandardUsers = usersList.length - totalAdmins;

        if (statsRes.data.success) {
          setStats({
            ...statsRes.data.stats,
            totalUsers: usersList.length,
            totalStandardUsers,
            totalAdmins
          });
        }
      }

      if (templatesRes.data.success) {
        setTemplates(templatesRes.data.templates || []);
      }
    } catch (err) {
      console.error('Admin portal data fetch error:', err);
      setError(err.message || 'Failed to load administrator management data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (userId, userEmail) => {
    if (!window.confirm(`Are you sure you want to permanently delete account "${userEmail}"?\n\nThis will clear all profile, assessment, and task history. You can then re-register with this email.`)) {
      return;
    }

    setError(null);
    setSuccessMsg(null);
    try {
      const res = await api.delete(`/admin/users/${userId}`);
      if (res.data.success) {
        setSuccessMsg(res.data.message || `User account ${userEmail} deleted successfully.`);
        
        // Optimistically update users table AND stats counter together
        setUsers(prev => {
          const updated = prev.filter(u => u.id !== userId);
          const totalAdmins = updated.filter(u => u.role === 'ADMIN').length;
          const totalStandardUsers = updated.length - totalAdmins;

          setStats(prevStats => prevStats ? {
            ...prevStats,
            totalUsers: updated.length,
            totalStandardUsers,
            totalAdmins
          } : prevStats);

          return updated;
        });

        fetchAdminData();
      }
    } catch (err) {
      console.error('Delete user error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to delete user account');
    }
  };

  const filteredUsers = users.filter(u => {
    if (!u) return false;
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    const name = (u.profile?.name || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    const city = (u.profile?.city || '').toLowerCase();
    return name.includes(query) || email.includes(query) || city.includes(query);
  });

  const filteredTemplates = templates.filter(item => {
    if (!item) return false;
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    const title = (item.title || '').toLowerCase();
    const desc = (item.description || '').toLowerCase();
    const pillarName = (item.pillar?.name || '').toLowerCase();
    return title.includes(query) || desc.includes(query) || pillarName.includes(query);
  });

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

  return (
    <div className="max-w-6xl mx-auto my-8 space-y-6">
      
      {/* Admin Portal Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-purple-700/80 backdrop-blur-sm text-purple-100 rounded-full text-xs font-bold border border-purple-500/40">
              <ShieldCheck className="w-4 h-4 text-purple-300" />
              <span>{t('nav_admin')}</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{t('admin_title')}</h2>
            <p className="text-purple-200 text-sm leading-relaxed">
              {t('admin_subtitle')}
            </p>
          </div>

          <button
            onClick={fetchAdminData}
            disabled={loading}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 backdrop-blur-sm transition-colors flex items-center space-x-2 self-start md:self-auto disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Portal</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-3 text-emerald-800 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Analytics KPI Metric Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">{t('admin_card_total_users')}</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">{stats.totalUsers}</div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">
              {stats.totalStandardUsers} Users | {stats.totalAdmins} Admins
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">{t('admin_card_assessments')}</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ClipboardCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">{stats.completedAssessments}</div>
            <div className="text-[11px] text-emerald-700 mt-1 font-semibold">
              Completed User Surveys
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">{t('admin_card_total_tasks')}</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">{stats.totalTasks}</div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">
              {stats.completedTasks} Done | {stats.pendingTasks} Pending
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">{t('admin_card_templates')}</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">{stats.totalTaskTemplates}</div>
            <div className="text-[11px] text-amber-700 mt-1 font-semibold">
              Seeded Rule Templates
            </div>
          </div>

        </div>
      )}

      {/* Main Admin Management Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Navigation Bar & Search */}
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                activeTab === 'users'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{t('admin_tab_users')} ({users.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('templates')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                activeTab === 'templates'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>{t('admin_tab_templates')} ({templates.length})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64 flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === 'users' ? 'Search by name, email, city...' : 'Search template title, pillar...'}
              className="w-full pl-9 pr-8 py-1.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: Registered Users Directory Table */}
        {activeTab === 'users' && (
          loading ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
              <span className="text-xs font-medium">Fetching registered user directory...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-10 text-center text-slate-500 text-xs space-y-2">
              <p>No registered users found matching your search.</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Clear Search Filter
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3 px-4">{t('admin_col_name')}</th>
                    <th className="py-3 px-4">{t('admin_col_email')}</th>
                    <th className="py-3 px-4">{t('admin_col_role')}</th>
                    <th className="py-3 px-4">{t('admin_col_location')}</th>
                    <th className="py-3 px-4">{t('admin_col_assessment')}</th>
                    <th className="py-3 px-4">{t('admin_col_tasks')}</th>
                    <th className="py-3 px-4">{t('admin_col_joined')}</th>
                    <th className="py-3 px-4 text-right">{t('admin_col_actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      
                      {/* Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-white ${
                            u.role === 'ADMIN' ? 'bg-purple-600' : 'bg-emerald-600'
                          }`}>
                            {u.profile?.name ? u.profile.name.charAt(0).toUpperCase() : u.email ? u.email.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{u.profile?.name || 'User Account'}</div>
                            {u.profile?.age && <div className="text-[10px] text-slate-400">Age: {u.profile.age}</div>}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 font-medium text-slate-700">{u.email}</td>

                      {/* Role */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                          u.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {u.role}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4 text-slate-600">
                        {u.profile?.city || u.profile?.state ? (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{u.profile.city || ''}{u.profile.city && u.profile.state ? ', ' : ''}{u.profile.state || ''}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Not set</span>
                        )}
                      </td>

                      {/* Assessment */}
                      <td className="py-3.5 px-4">
                        {u.assessment?.isCompleted ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold text-[10px] border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Completed</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">Pending</span>
                        )}
                      </td>

                      {/* Tasks */}
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {u._count?.userTasks || 0} task(s)
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        {currentAdmin?.id === u.id ? (
                          <span className="text-slate-400 italic text-[11px]">Active Admin</span>
                        ) : (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.email)}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-lg border border-rose-200 transition-colors inline-flex items-center space-x-1"
                            title="Delete user account and clear all history"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>{t('admin_btn_delete')}</span>
                          </button>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* TAB 2: Task Templates Inspection Table */}
        {activeTab === 'templates' && (
          loading ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
              <span className="text-xs font-medium">Fetching rule templates...</span>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="p-10 text-center text-slate-500 text-xs">
              No task templates found matching your search query.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3 px-4">Pillar</th>
                    <th className="py-3 px-4">Template Title & Description</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Trigger Need / Goal</th>
                    <th className="py-3 px-4">Target Timeline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredTemplates.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      
                      {/* Pillar */}
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-[11px]">
                          {item.pillar?.name || 'General'}
                        </span>
                      </td>

                      {/* Title & Description */}
                      <td className="py-3.5 px-4 space-y-1">
                        <div className="font-bold text-slate-900">{item.title}</div>
                        <div className="text-slate-600 text-[11px] leading-relaxed max-w-md">{item.description}</div>
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider border ${getPriorityStyle(item.priority)}`}>
                          {item.priority}
                        </span>
                      </td>

                      {/* Trigger Condition */}
                      <td className="py-3.5 px-4">
                        {item.triggerNeed || item.triggerGoal ? (
                          <div className="space-y-0.5">
                            {item.triggerNeed && (
                              <span className="inline-block px-1.5 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-mono">
                                Need: {item.triggerNeed}
                              </span>
                            )}
                            {item.triggerGoal && (
                              <span className="inline-block px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-mono">
                                Goal: {item.triggerGoal}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Universal</span>
                        )}
                      </td>

                      {/* Target Timeline */}
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {item.defaultDaysToComplete || 7} Days
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

      </div>
    </div>
  );
}
