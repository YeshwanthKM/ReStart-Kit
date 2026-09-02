import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  ClipboardCheck, 
  FileText, 
  Home, 
  GraduationCap, 
  Briefcase, 
  Users, 
  MapPin, 
  Building, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

export default function AssessmentPage({ onComplete }) {
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Form State
  const [situation, setSituation] = useState('');
  const [selectedNeeds, setSelectedNeeds] = useState([]);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [city, setCity] = useState(user?.profile?.city || '');
  const [state, setState] = useState(user?.profile?.state || '');
  const [location, setLocation] = useState(user?.profile?.location || '');

  // Pre-fetch existing assessment if available
  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const res = await api.get('/assessment/me');
        if (res.data.success && res.data.assessment) {
          const a = res.data.assessment;
          setSituation(a.situation || '');
          setSelectedNeeds(Array.isArray(a.needs) ? a.needs : []);
          setSelectedGoals(Array.isArray(a.goals) ? a.goals : []);
          if (a.city) setCity(a.city);
          if (a.state) setState(a.state);
          if (a.location) setLocation(a.location);
        }
      } catch (err) {
        console.error('Failed to load assessment:', err);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchAssessment();
  }, []);

  const situationOptions = [
    {
      id: 'SITUATION_JUSTICE',
      title: 'Reentering Community',
      desc: 'Returning home or rebuilding after involvement with the justice system.'
    },
    {
      id: 'SITUATION_HOUSING',
      title: 'Housing Insecurity',
      desc: 'Currently facing homelessness, emergency shelter stay, or temporary housing.'
    },
    {
      id: 'SITUATION_UNEMPLOYMENT',
      title: 'Job Loss or Displacement',
      desc: 'Seeking stable employment, vocational training, or career transition.'
    },
    {
      id: 'SITUATION_DOCUMENTS',
      title: 'Missing Identity Records',
      desc: 'Lacking state ID, driver’s license, birth certificate, or vital papers.'
    },
    {
      id: 'SITUATION_FRESH_START',
      title: 'General Reintegration',
      desc: 'Starting over in a new city or seeking comprehensive community support.'
    }
  ];

  const pillarNeeds = [
    {
      pillar: 'DOCUMENTS',
      title: 'Identity & Legal Documents',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      items: [
        { id: 'NEED_STATE_ID', label: 'State ID / Driver License Guidance' },
        { id: 'NEED_BIRTH_CERTIFICATE', label: 'Birth Certificate Assistance' },
        { id: 'NEED_SSN_CARD', label: 'Social Security Card Replacement' },
        { id: 'NEED_LEGAL_AID', label: 'Legal Documentation Support' }
      ]
    },
    {
      pillar: 'BASIC_NEEDS',
      title: 'Housing & Essential Living Needs',
      icon: Home,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      items: [
        { id: 'NEED_SHELTER', label: 'Emergency Shelter / Transitional Housing' },
        { id: 'NEED_FOOD', label: 'Food Assistance & Food Banks' },
        { id: 'NEED_HEALTHCARE', label: 'Healthcare & Mental Health Services' },
        { id: 'NEED_EMERGENCY_FUND', label: 'Basic Essentials & Clothing' }
      ]
    },
    {
      pillar: 'SKILLS',
      title: 'Skill Development & Education',
      icon: GraduationCap,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      items: [
        { id: 'NEED_VOCATIONAL', label: 'Vocational & Trade Skills Training' },
        { id: 'NEED_DIGITAL', label: 'Digital Literacy & Computer Basics' },
        { id: 'NEED_RESUME', label: 'Resume & Job Application Training' },
        { id: 'NEED_GED', label: 'GED / High School Diploma Prep' }
      ]
    },
    {
      pillar: 'EMPLOYMENT',
      title: 'Employment & Career Opportunities',
      icon: Briefcase,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      items: [
        { id: 'NEED_FAIR_CHANCE_JOBS', label: 'Fair-Chance Employer Network' },
        { id: 'NEED_INTERVIEW_PREP', label: 'Interview Preparation & Coaching' },
        { id: 'NEED_ENTRY_LEVEL_WORK', label: 'Immediate Entry-Level Opportunities' },
        { id: 'NEED_APPRENTICESHIP', label: 'Paid Apprenticeships & Internships' }
      ]
    },
    {
      pillar: 'COMMUNITY',
      title: 'Community Support & Mentorship',
      icon: Users,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      items: [
        { id: 'NEED_MENTORSHIP', label: 'One-on-One Peer Mentorship' },
        { id: 'NEED_NGO_SUPPORT', label: 'Local NGO & Non-Profit Assistance' },
        { id: 'NEED_SUPPORT_GROUP', label: 'Support Groups & Reentry Circles' },
        { id: 'NEED_COMMUNITY_CENTER', label: 'Community Resource Centers' }
      ]
    }
  ];

  const goalOptions = [
    { id: 'GOAL_OBTAIN_ID', label: 'Obtain all official government ID cards' },
    { id: 'GOAL_SECURE_HOUSING', label: 'Secure safe, long-term stable housing' },
    { id: 'GOAL_GET_JOB', label: 'Find a reliable job with fair compensation' },
    { id: 'GOAL_LEARN_TRADE', label: 'Complete vocational certification or digital training' },
    { id: 'GOAL_BUILD_NETWORK', label: 'Connect with a trusted local mentor or support network' }
  ];

  const toggleNeed = (needId) => {
    setSelectedNeeds(prev => 
      prev.includes(needId) ? prev.filter(id => id !== needId) : [...prev, needId]
    );
  };

  const toggleGoal = (goalId) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) ? prev.filter(id => id !== goalId) : [...prev, goalId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!situation) {
      setError('Please select your current primary situation.');
      setStep(1);
      return;
    }

    if (selectedNeeds.length === 0) {
      setError('Please select at least one immediate need.');
      setStep(2);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/assessment', {
        situation,
        needs: selectedNeeds,
        goals: selectedGoals,
        city,
        state,
        location
      });

      if (res.data.success) {
        setSuccessMsg('Assessment saved! Auto-generating your ReStart Kit...');
        // Auto-generate task checklist based on assessment
        try {
          await api.post('/tasks/generate');
        } catch (genErr) {
          console.error('Auto-generate tasks non-fatal error:', genErr);
        }
        
        // Short delay to show success state before transitioning
        setTimeout(() => {
          if (onComplete) onComplete(res.data.assessment);
        }, 800);
      }
    } catch (err) {
      console.error('Submit Assessment Error:', err);
      setError(err.message || 'Failed to save assessment. Please try again.');
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center text-slate-500 space-x-2">
        <Sparkles className="w-5 h-5 animate-spin text-emerald-600" />
        <span className="text-sm font-medium">Loading your assessment questionnaire...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-8 space-y-6">
      
      {/* Step Progress Bar Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ClipboardCheck className="w-6 h-6 text-emerald-600" />
              <span>Needs & Goals Assessment</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Step {step} of 4 — Tell us about your situation so we can build your personalized ReStart Kit.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
            {step === 1 && '1. Situation'}
            {step === 2 && '2. Needs'}
            {step === 3 && '3. Goals'}
            {step === 4 && '4. Location'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-emerald-600 h-2 transition-all duration-300 rounded-full"
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-3 text-emerald-800 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Questionnaire Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 min-h-[420px] flex flex-col justify-between">
        
        {/* STEP 1: SITUATION */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900">What best describes your current situation?</h3>
              <p className="text-xs text-slate-500 mt-1">Select the primary option that reflects your starting point right now.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {situationOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSituation(opt.id)}
                  className={`p-5 rounded-2xl text-left border transition-all relative ${
                    situation === opt.id
                      ? 'bg-emerald-50/80 border-emerald-500 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <h4 className="font-bold text-sm text-slate-900">{opt.title}</h4>
                    {situation === opt.id && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: NEEDS */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">What are your immediate needs?</h3>
              <p className="text-xs text-slate-500 mt-1">Select all items you need support with across the 5 reintegration pillars.</p>
            </div>

            <div className="space-y-6">
              {pillarNeeds.map((group) => {
                const Icon = group.icon;
                return (
                  <div key={group.pillar} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-7 h-7 rounded-lg ${group.bgColor} flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${group.color}`} />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{group.title}</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {group.items.map((item) => {
                        const isChecked = selectedNeeds.includes(item.id);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => toggleNeed(item.id)}
                            className={`p-3.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                              isChecked
                                ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold'
                                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                            }`}
                          >
                            <span>{item.label}</span>
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                              isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                            }`}>
                              {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: GOALS */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900">What are your top goals?</h3>
              <p className="text-xs text-slate-500 mt-1">Select the key milestones you want to achieve over the next 3 to 6 months.</p>
            </div>

            <div className="space-y-3">
              {goalOptions.map((goal) => {
                const isSelected = selectedGoals.includes(goal.id);
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => toggleGoal(goal.id)}
                    className={`w-full p-4 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                    }`}
                  >
                    <span>{goal.label}</span>
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                      isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: LOCATION & REVIEW */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Location & Final Review</h3>
              <p className="text-xs text-slate-500 mt-1">Specify your location so we can filter local community support resources near you.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Seattle"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">State <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. WA"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Neighborhood / District (Optional)</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Downtown / Central District"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            {/* Review Box */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2">
              <div className="font-bold text-slate-900 border-b border-slate-200 pb-2">Assessment Summary</div>
              <div><span className="font-semibold">Selected Situation:</span> {situationOptions.find(s => s.id === situation)?.title || 'Not selected'}</div>
              <div><span className="font-semibold">Needs Selected:</span> {selectedNeeds.length} item(s) across pillars</div>
              <div><span className="font-semibold">Goals Selected:</span> {selectedGoals.length} objective(s)</div>
            </div>
          </div>
        )}

        {/* Step Navigation Controls */}
        <div className="pt-8 border-t border-slate-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(prev => prev - 1)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div></div>}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !situation) {
                  setError('Please select a situation before continuing.');
                  return;
                }
                if (step === 2 && selectedNeeds.length === 0) {
                  setError('Please select at least one need before continuing.');
                  return;
                }
                setError(null);
                setStep(prev => prev + 1);
              }}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md transition-colors flex items-center space-x-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Building Roadmap...' : 'Complete Assessment'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
