import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { User, Mail, MapPin, Building, Calendar, FileText, CheckCircle2, AlertCircle, Save, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    city: '',
    state: '',
    location: '',
    bio: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.profile) {
      setFormData({
        name: user.profile.name || '',
        age: user.profile.age !== null && user.profile.age !== undefined ? String(user.profile.age) : '',
        city: user.profile.city || '',
        state: user.profile.state || '',
        location: user.profile.location || '',
        bio: user.profile.bio || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!formData.name.trim()) {
      setError('Name is required.');
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        name: formData.name,
        age: formData.age ? parseInt(formData.age, 10) : null,
        city: formData.city,
        state: formData.state,
        location: formData.location,
        bio: formData.bio
      });
      setSuccessMsg('Profile updated successfully!');
    } catch (err) {
      console.error('Update profile error:', err);
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-8 space-y-6">
      
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex items-center space-x-4">
        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center font-extrabold text-2xl">
          {user?.profile?.name ? user.profile.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-2xl font-bold">{user?.profile?.name || 'User Profile'}</h2>
          <p className="text-emerald-100 text-xs mt-0.5">{user?.email}</p>
          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-emerald-700/80 text-emerald-100 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/40">
            {user?.role} Account
          </span>
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

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">{t('nav_profile')} Details</h3>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Chennai"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g. Tamil Nadu"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Neighborhood / Circle</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Anna Nagar / T. Nagar"
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Bio / Notes</label>
          <textarea
            name="bio"
            rows="3"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Brief bio or personal notes..."
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          ></textarea>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-emerald-200" />
            <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
