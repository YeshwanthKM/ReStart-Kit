import React, { useState, useEffect } from 'react';
import api from '../services/api';
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
  Sparkles
} from 'lucide-react';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active Tab & Search
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users')
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
      if (usersRes.data.success) {
        setUsers(usersRes.data.users || []);
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

  const filteredUsers = users.filter(u => {
    const query = searchQuery.toLowerCase();
    const name = u.profile?.name ? u.profile.name.toLowerCase() : '';
    const email = u.email.toLowerCase();
    const city = u.profile?.city ? u.profile.city.toLowerCase() : '';
    return name.includes(query) || email.includes(query) || city.includes(query);
  });

  return (
    <div className="max-w-6xl mx-auto my-8 space-y-6">
      
      {/* Admin Portal Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-purple-700/80 backdrop-blur-sm text-purple-100 rounded-full text-xs font-bold border border-purple-500/40">
              <ShieldCheck className="w-4 h-4 text-purple-300" />
              <span>Platform Administration Portal</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">System Oversight & User Management</h2>
            <p className="text-purple-200 text-sm leading-relaxed">
              Manage registered user accounts, oversee assessment activity, and inspect platform task templates.
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
              <span className="text-xs font-semibold text-slate-500">Total Accounts</span>
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
              <span className="text-xs font-semibold text-slate-500">Assessments</span>
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
              <span className="text-xs font-semibold text-slate-500">Total Tasks</span>
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
              <span className="text-xs font-semibold text-slate-500">Task Templates</span>
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
              <span>Registered Users ({users.length})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, city..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Users Directory Table */}
        {loading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
            <span className="text-xs font-medium">Fetching registered user directory...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-10 text-center text-slate-500 text-xs">
            No registered users found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/80 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">User / Name</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Location / City</th>
                  <th className="py-3 px-4">Assessment</th>
                  <th className="py-3 px-4">Generated Tasks</th>
                  <th className="py-3 px-4">Joined Date</th>
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
                          {u.profile?.name ? u.profile.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{u.profile?.name || 'Un-named User'}</div>
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

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
