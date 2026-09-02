import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
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
  const { t } = useLanguage();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Form State
  const [situation, setSituation] = useState('');
  const [selectedNeeds, setSelectedNeeds] = useState([]);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [city, setCity] = useState(user?.profile?.city || 'Chennai');
  const [state, setState] = useState(user?.profile?.state || 'Tamil Nadu');
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
      title: t('sit_justice_title'),
      desc: t('sit_justice_desc')
    },
    {
      id: 'SITUATION_HOUSING',
      title: t('sit_housing_title'),
      desc: t('sit_housing_desc')
    },
    {
      id: 'SITUATION_UNEMPLOYMENT',
      title: t('sit_unemp_title'),
      desc: t('sit_unemp_desc')
    },
    {
      id: 'SITUATION_DOCUMENTS',
      title: t('sit_docs_title'),
      desc: t('sit_docs_desc')
    },
    {
      id: 'SITUATION_FRESH_START',
      title: t('sit_fresh_title'),
      desc: t('sit_fresh_desc')
    }
  ];

  const pillarNeeds = [
    {
      pillar: 'DOCUMENTS',
      title: t('pillar_documents'),
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      items: [
        { id: 'NEED_STATE_ID', label: t('need_state_id') },
        { id: 'NEED_BIRTH_CERTIFICATE', label: t('need_birth_cert') },
        { id: 'NEED_SSN_CARD', label: t('need_ssn') },
        { id: 'NEED_LEGAL_AID', label: t('need_legal_aid') }
      ]
    },
    {
      pillar: 'BASIC_NEEDS',
      title: t('pillar_basic_needs'),
      icon: Home,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      items: [
        { id: 'NEED_SHELTER', label: t('need_shelter') },
        { id: 'NEED_FOOD', label: t('need_food') },
        { id: 'NEED_HEALTHCARE', label: t('need_healthcare') },
        { id: 'NEED_EMERGENCY_FUND', label: t('need_emergency_fund') }
      ]
    },
    {
      pillar: 'SKILLS',
      title: t('pillar_skills'),
      icon: GraduationCap,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      items: [
        { id: 'NEED_VOCATIONAL', label: t('need_vocational') },
        { id: 'NEED_DIGITAL', label: t('need_digital') },
        { id: 'NEED_RESUME', label: t('need_resume') },
        { id: 'NEED_GED', label: t('need_ged') }
      ]
    },
    {
      pillar: 'EMPLOYMENT',
      title: t('pillar_employment'),
      icon: Briefcase,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      items: [
        { id: 'NEED_FAIR_CHANCE_JOBS', label: t('need_fair_chance') },
        { id: 'NEED_INTERVIEW_PREP', label: t('need_interview') },
        { id: 'NEED_ENTRY_LEVEL_WORK', label: t('need_entry_level') },
        { id: 'NEED_APPRENTICESHIP', label: t('need_apprenticeship') }
      ]
    },
    {
      pillar: 'COMMUNITY',
      title: t('pillar_community'),
      icon: Users,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      items: [
        { id: 'NEED_MENTORSHIP', label: t('need_mentorship') },
        { id: 'NEED_NGO_SUPPORT', label: t('need_ngo') },
        { id: 'NEED_SUPPORT_GROUP', label: t('need_support_group') }
      ]
    }
  ];

  const goalOptions = [
    { id: 'GOAL_OBTAIN_ID', label: t('goal_obtain_id'), pillar: 'DOCUMENTS' },
    { id: 'GOAL_GET_JOB', label: t('goal_get_job'), pillar: 'EMPLOYMENT' },
    { id: 'GOAL_LEARN_TRADE', label: t('goal_learn_trade'), pillar: 'SKILLS' },
    { id: 'GOAL_HOUSING', label: t('goal_housing'), pillar: 'BASIC_NEEDS' },
    { id: 'GOAL_STABILITY', label: t('goal_stability'), pillar: 'COMMUNITY' }
  ];

  const handleToggleNeed = (needId) => {
    setSelectedNeeds(prev => 
      prev.includes(needId) ? prev.filter(id => id !== needId) : [...prev, needId]
    );
  };

  const handleToggleGoal = (goalId) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) ? prev.filter(id => id !== goalId) : [...prev, goalId]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      // 1. Save Assessment Response
      const res = await api.post('/assessment', {
        situation,
        needs: selectedNeeds,
        goals: selectedGoals,
        city,
        state,
        location
      });

      if (res.data.success) {
        // 2. Trigger Task Generation Engine
        try {
          await api.post('/tasks/generate');
        } catch (taskErr) {
          console.warn('Task generation background warning:', taskErr);
        }

        setSuccessMsg('Assessment submitted successfully! Building your personalized 5-Pillar roadmap...');
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 1200);
      }
    } catch (err) {
      console.error('Assessment Submission Error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to submit assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-700/80 backdrop-blur-sm text-emerald-100 rounded-full text-xs font-semibold border border-emerald-500/40">
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>{t('assess_title')}</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('assess_title')}
          </h2>
          <p className="text-emerald-100 text-sm max-w-xl">
            {t('assess_subtitle')}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-3 text-emerald-800 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600">
          <span>Step {step} of 4</span>
          <span>{step === 1 ? 'Primary Situation' : step === 2 ? 'Immediate Needs' : step === 3 ? 'Primary Goals' : 'Location Info'}</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Main Wizard Form Container */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">

        {/* STEP 1: Primary Situation Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{t('assess_step1_title')}</h3>
              <p className="text-xs text-slate-500">{t('assess_step1_desc')}</p>
            </div>

            <div className="space-y-3">
              {situationOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setSituation(opt.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
                    situation === opt.id
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0 ${
                    situation === opt.id ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                  }`}>
                    {situation === opt.id && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{opt.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{opt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Immediate Needs Selection across 5 Pillars */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{t('assess_step2_title')}</h3>
              <p className="text-xs text-slate-500">{t('assess_step2_desc')}</p>
            </div>

            <div className="space-y-6">
              {pillarNeeds.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.pillar} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1.5 rounded-lg ${p.bgColor} ${p.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{p.title}</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {p.items.map((item) => {
                        const isChecked = selectedNeeds.includes(item.id);
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleToggleNeed(item.id)}
                            className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex items-center space-x-2.5 ${
                              isChecked
                                ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 shadow-sm'
                                : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                              isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                            }`}>
                              {isChecked && <CheckCircle2 className="w-3 h-3" />}
                            </div>
                            <span>{item.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Primary Reintegration Goals */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{t('assess_step3_title')}</h3>
              <p className="text-xs text-slate-500">{t('assess_step3_desc')}</p>
            </div>

            <div className="space-y-3">
              {goalOptions.map((g) => {
                const isChecked = selectedGoals.includes(g.id);
                return (
                  <div
                    key={g.id}
                    onClick={() => handleToggleGoal(g.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center space-x-3 ${
                      isChecked
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-800'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${
                      isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                    }`}>
                      {isChecked && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <span className="text-sm font-bold">{g.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Location Info */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{t('assess_step4_title')}</h3>
              <p className="text-xs text-slate-500">{t('assess_step4_desc')}</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Chennai"
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
                      placeholder="e.g. Tamil Nadu"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Neighborhood / Circle (Optional)</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Anna Nagar / T. Nagar / Tambaram / Guindy"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls Footer */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('assess_btn_prev')}</span>
            </button>
          ) : <div></div>}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !situation}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center space-x-1.5 disabled:opacity-50"
            >
              <span>{t('assess_btn_next')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading || !city || !state}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <span>{t('assess_btn_submitting')}</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>{t('assess_btn_complete')}</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
