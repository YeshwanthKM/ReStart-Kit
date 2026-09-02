import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Globe, 
  Search, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  FileText,
  Home,
  GraduationCap,
  Briefcase,
  Users,
  Layers,
  X
} from 'lucide-react';

export default function ResourceDirectoryPage() {
  const { user, isAdmin } = useAuth();
  const { t } = useLanguage();

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Filters
  const [selectedPillar, setSelectedPillar] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    description: '',
    pillarSlug: 'DOCUMENTS',
    category: '',
    address: '',
    city: user?.profile?.city || 'Chennai',
    state: user?.profile?.state || 'Tamil Nadu',
    zipCode: '',
    phone: '',
    email: '',
    website: '',
    isLocationBased: true,
    isVerified: true
  });

  const fetchResources = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = '/resources';
      const params = new URLSearchParams();
      if (selectedPillar !== 'ALL') params.append('pillarSlug', selectedPillar);
      if (searchQuery) params.append('query', searchQuery);
      if (cityFilter) params.append('city', cityFilter);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await api.get(url);
      if (res.data.success) {
        setResources(res.data.resources || []);
      }
    } catch (err) {
      console.error('Fetch resources error:', err);
      setError(err.message || 'Failed to load community resources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [selectedPillar, cityFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchResources();
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await api.post('/resources', formData);
      if (res.data.success) {
        setSuccessMsg(`Resource "${formData.name}" added successfully!`);
        setIsModalOpen(false);
        fetchResources();
      }
    } catch (err) {
      console.error('Add resource error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to add resource');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteResource = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete resource "${title}"?`)) return;

    setError(null);
    setSuccessMsg(null);
    try {
      const res = await api.delete(`/resources/${id}`);
      if (res.data.success) {
        setSuccessMsg(`Resource "${title}" deleted.`);
        fetchResources();
      }
    } catch (err) {
      console.error('Delete resource error:', err);
      setError(err.message || 'Failed to delete resource');
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

  const pillarsList = [
    { slug: 'ALL', name: t('roadmap_all_pillars') },
    { slug: 'DOCUMENTS', name: t('pillar_documents') },
    { slug: 'BASIC_NEEDS', name: t('pillar_basic_needs') },
    { slug: 'SKILLS', name: t('pillar_skills') },
    { slug: 'EMPLOYMENT', name: t('pillar_employment') },
    { slug: 'COMMUNITY', name: t('pillar_community') }
  ];

  return (
    <div className="max-w-6xl mx-auto my-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-700/80 backdrop-blur-sm text-emerald-100 rounded-full text-xs font-semibold border border-emerald-500/40">
              <Building2 className="w-3.5 h-3.5" />
              <span>{t('res_title')}</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{t('res_title')}</h2>
            <p className="text-emerald-100 text-sm leading-relaxed">
              {t('res_subtitle')}
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 self-start md:self-auto"
            >
              <Plus className="w-4 h-4 text-emerald-700" />
              <span>{t('res_add_modal_btn')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
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

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-4">
        
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('res_search_placeholder')}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          <div className="w-full sm:w-48">
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">{t('res_all_cities')}</option>
              <option value="Chennai">Chennai</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
          >
            Search
          </button>
        </form>

        {/* Pillar Filter Tabs */}
        <div className="flex items-center flex-wrap gap-1.5 pt-2 border-t border-slate-100">
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

      </div>

      {/* Resource Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 space-y-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <RefreshCw className="w-6 h-6 animate-spin text-emerald-600 mx-auto" />
          <p className="text-xs font-semibold">Fetching local support resources...</p>
        </div>
      ) : resources.length === 0 ? (
        <div className="p-10 text-center text-slate-500 space-y-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <Building2 className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-xs">No local resources found matching your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((res) => {
            const Icon = getPillarIcon(res.pillar?.slug);
            return (
              <div 
                key={res.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-[11px] font-bold border border-slate-200 flex items-center space-x-1">
                      <Icon className="w-3.5 h-3.5 text-slate-600" />
                      <span>{res.pillar?.name}</span>
                    </span>

                    {res.isVerified && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 flex items-center space-x-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>{t('res_verified_badge')}</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">{res.title}</h3>
                    {res.organization && (
                      <p className="text-xs text-emerald-700 font-semibold mt-0.5">{res.organization}</p>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{res.description}</p>
                </div>

                {/* Contact & Location Details */}
                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  {res.address && (
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span>{res.address}{res.city ? `, ${res.city}` : ''}{res.state ? `, ${res.state}` : ''}</span>
                    </div>
                  )}

                  {res.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <a href={`tel:${res.phone}`} className="hover:text-emerald-700 font-medium">{res.phone}</a>
                    </div>
                  )}

                  {res.website && (
                    <div className="flex items-center space-x-2">
                      <Globe className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <a 
                        href={res.website.startsWith('http') ? res.website : `https://${res.website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-600 hover:underline font-semibold"
                      >
                        Visit Official Website
                      </a>
                    </div>
                  )}

                  {isAdmin && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleDeleteResource(res.id, res.title)}
                        className="text-rose-600 hover:text-rose-800 text-[11px] font-bold flex items-center space-x-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete Listing</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Admin Add Resource Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Add Verified Resource</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddResource} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Resource Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. District Employment Exchange"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Organization *</label>
                <input
                  type="text"
                  required
                  value={formData.organization}
                  onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                  placeholder="e.g. Dept of Employment & Training"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pillar *</label>
                <select
                  value={formData.pillarSlug}
                  onChange={(e) => setFormData(prev => ({ ...prev, pillarSlug: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                >
                  <option value="DOCUMENTS">Documents</option>
                  <option value="BASIC_NEEDS">Basic Needs</option>
                  <option value="SKILLS">Skills & Education</option>
                  <option value="EMPLOYMENT">Employment</option>
                  <option value="COMMUNITY">Community</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description *</label>
                <textarea
                  required
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Service description..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="e.g. Santhome High Road, Mylapore"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="e.g. 044-24615160"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Website URL</label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                >
                  {submitting ? 'Adding...' : 'Save Resource'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
