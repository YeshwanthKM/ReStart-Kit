import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, MapPin, Building, Calendar, FileText, CheckCircle2, AlertCircle, Save, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();

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
      setSuccessMsg('Your profile has been updated successfully.');
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-8 space-y-6">
      
      {/* Profile Overview Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-bold text-2xl flex items-center justify-center shadow-md">
            {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{formData.name || 'User Profile'}</h2>
            <div className="flex items-center space-x-2 mt-1 text-xs text-slate-500">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{user?.email}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 border border-slate-200">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>Role: <span className="font-bold text-slate-900">{user?.role}</span></span>
        </div>
      </div>

      {/* Profile Edit Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4 bg-slate-50/50">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <User className="w-5 h-5 text-emerald-600" />
            <span>Personal Profile & Location Settings</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            This information helps personalize your ReStart Kit tasks and local community resources.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          
          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-3 text-emerald-800 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-3 text-rose-800 text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Age</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="28"
                  min="16"
                  max="120"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">City</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Building className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Seattle"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            {/* State */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">State</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Washington"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Specific Location / Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Address or Neighborhood (Optional)</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Downtown / Central Area"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          {/* Bio / Background */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Brief Background or Current Situation (Optional)</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
              placeholder="Share any context about your current goals or situation to help tailor support..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            ></textarea>
          </div>

          {/* Save Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
