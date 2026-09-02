import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  CheckCircle2, 
  Search, 
  Plus, 
  Trash2, 
  X, 
  FileText, 
  Home, 
  GraduationCap, 
  Briefcase, 
  Users, 
  Layers, 
  RefreshCw,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

export default function ResourceDirectoryPage() {
  const { user, isAdmin } = useAuth();

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [selectedPillar, setSelectedPillar] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  // Admin Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);

  // New Resource Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pillarSlug, setPillarSlug] = useState('DOCUMENTS');
  const [category, setCategory] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState(user?.profile?.city || 'Chennai');
  const [state, setState] = useState(user?.profile?.state || 'Tamil Nadu');
  const [zipCode, setZipCode] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');

  const fetchResources = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = '/resources';
      const params = new URLSearchParams();
      if (selectedPillar !== 'ALL') params.append('pillarSlug', selectedPillar);
      if (searchQuery) params.append('search', searchQuery);
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

  const handleCreateResource = async (e) => {
    e.preventDefault();
    setModalError(null);
    setModalLoading(true);

    try {
      const res = await api.post('/resources', {
        title,
        description,
        pillarSlug,
        category,
        address,
        city,
        state,
        zipCode,
        phone,
        email,
        website
      });

      if (res.data.success) {
        setIsModalOpen(false);
        // Reset form
        setTitle('');
        setDescription('');
        setCategory('');
        setAddress('');
        setPhone('');
        setEmail('');
        setWebsite('');
        fetchResources();
      }
    } catch (err) {
      console.error('Create resource error:', err);
      setModalError(err.response?.data?.message || err.message || 'Failed to create resource');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteResource = async (resourceId) => {
    if (!window.confirm('Are you sure you want to remove this resource listing?')) return;

    try {
      const res = await api.delete(`/resources/${resourceId}`);
      if (res.data.success) {
        setResources(prev => prev.filter(r => r.id !== resourceId));
      }
    } catch (err) {
      console.error('Delete resource error:', err);
      alert('Failed to delete resource.');
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
    { slug: 'ALL', name: 'All Resources' },
    { slug: 'DOCUMENTS', name: '1. Documents' },
    { slug: 'BASIC_NEEDS', name: '2. Basic Needs' },
    { slug: 'SKILLS', name: '3. Skills' },
    { slug: 'EMPLOYMENT', name: '4. Employment' },
    { slug: 'COMMUNITY', name: '5. Community' }
  ];

  return (
    <div className="max-w-6xl mx-auto my-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-700/80 backdrop-blur-sm text-emerald-100 rounded-full text-xs font-semibold border border-emerald-500/40">
              <Building2 className="w-3.5 h-3.5" />
              <span>Verified Reintegration Directory</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Verified Local Support Resources</h2>
            <p className="text-emerald-100 text-sm leading-relaxed">
              Discover verified shelters, legal document aid centers, vocational labs, fair-chance employers, and community NGOs near you.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Verified Resource</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Search & Filter Controls Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-4">
        
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          
          {/* Keyword Search */}
          <div className="relative flex-grow w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, service, category, or city..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          {/* City Filter */}
          <div className="relative w-full sm:w-48">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              placeholder="Filter by City..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-colors w-full sm:w-auto flex items-center justify-center space-x-1.5"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </form>

        {/* Pillar Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-slate-100">
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
      </div>

      {/* Resource Cards Grid */}
      {loading ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
          <span className="text-sm font-medium">Searching verified support resources...</span>
        </div>
      ) : resources.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-3 text-slate-500">
          <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Verified Resources Found</h3>
          <p className="text-xs">Try clearing your search query or switching pillar filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {resources.map((res) => {
            const PillarIcon = getPillarIcon(res.pillar?.slug);
            return (
              <div 
                key={res.id} 
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  
                  {/* Card Header & Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 flex-wrap gap-1">
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200">
                          <PillarIcon className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{res.pillar?.name || 'General'}</span>
                        </span>

                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-semibold text-[10px] border border-emerald-200">
                          {res.category}
                        </span>
                      </div>
                    </div>

                    {/* Verified Badge */}
                    {res.isVerified && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px] border border-emerald-300 flex-shrink-0" title="Verified Provider">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 leading-snug">{res.title}</h3>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed">{res.description}</p>
                </div>

                {/* Contact & Location Footer */}
                <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-2">
                  
                  {res.address && (
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span>{res.address}, {res.city}, {res.state} {res.zipCode || ''}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                    {res.phone && (
                      <a 
                        href={`tel:${res.phone}`} 
                        className="inline-flex items-center space-x-1 text-slate-700 font-semibold hover:text-emerald-600 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{res.phone}</span>
                      </a>
                    )}

                    {res.website && (
                      <a 
                        href={res.website.startsWith('http') ? res.website : `https://${res.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center space-x-1 text-emerald-600 font-bold hover:underline"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Visit Website</span>
                      </a>
                    )}
                  </div>

                  {/* Admin Action Bar */}
                  {isAdmin && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleDeleteResource(res.id)}
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-semibold rounded-lg border border-rose-200 transition-colors flex items-center space-x-1"
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-bold text-slate-900">Add Verified Resource</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateResource} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Organization / Title <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Seattle Reentry Legal Clinic"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reintegration Pillar <span className="text-rose-500">*</span></label>
                  <select
                    value={pillarSlug}
                    onChange={(e) => setPillarSlug(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                  >
                    <option value="DOCUMENTS">1. Documents</option>
                    <option value="BASIC_NEEDS">2. Basic Needs</option>
                    <option value="SKILLS">3. Skills</option>
                    <option value="EMPLOYMENT">4. Employment</option>
                    <option value="COMMUNITY">5. Community</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category Tag</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Emergency Shelter / Legal Aid"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description <span className="text-rose-500">*</span></label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe services provided..."
                  rows={3}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 100 Main St"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Seattle"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="WA"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(206) 555-0199"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Website URL</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://example.org"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md disabled:opacity-50"
                >
                  {modalLoading ? 'Saving...' : 'Add Verified Resource'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
