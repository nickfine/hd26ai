import { useState } from 'react';
import { ArrowLeft, Cpu, Heart, Scale, Check, X, Plus, Users, Zap } from 'lucide-react';
import adaptLogo from '../../adaptlogo.png';
import { SKILLS, ALLEGIANCE_CONFIG } from '../data/mockData';

// Max skills allowed
const MAX_SKILLS = 5;

// Validation for custom skill
const validateCustomSkill = (value, existingSkills) => {
  const trimmed = value.trim();
  if (trimmed.length < 2) return 'Min 2 characters';
  if (trimmed.length > 30) return 'Max 30 characters';
  if (existingSkills.some(s => s.toLowerCase() === trimmed.toLowerCase())) return 'Already added';
  return null;
};

function Onboarding({ user, updateUser, onNavigate, onAutoAssign }) {
  const [name, setName] = useState(user?.name || '');
  const [selectedSkills, setSelectedSkills] = useState(user?.skills || []);
  const [allegiance, setAllegiance] = useState(user?.allegiance || 'neutral');
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [customSkillError, setCustomSkillError] = useState(null);
  const [autoAssignEnabled, setAutoAssignEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toggle predefined skill selection
  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(prev => prev.filter(s => s !== skill));
    } else if (selectedSkills.length < MAX_SKILLS) {
      setSelectedSkills(prev => [...prev, skill]);
    }
  };

  // Add custom skill
  const handleAddCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    const error = validateCustomSkill(trimmed, selectedSkills);
    if (error) {
      setCustomSkillError(error);
      return;
    }
    if (selectedSkills.length >= MAX_SKILLS) {
      setCustomSkillError(`Max ${MAX_SKILLS} skills`);
      return;
    }
    setSelectedSkills(prev => [...prev, trimmed]);
    setCustomSkillInput('');
    setCustomSkillError(null);
  };

  // Handle Enter key for custom skill
  const handleCustomSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomSkill();
    }
  };

  // Remove skill
  const removeSkill = (skill) => {
    setSelectedSkills(prev => prev.filter(s => s !== skill));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // First update the user profile
    await updateUser({
      name,
      skills: selectedSkills,
      allegiance,
    });
    
    // If auto-assign is enabled and user has a side, trigger auto-assignment
    if (autoAssignEnabled && allegiance !== 'neutral' && onAutoAssign) {
      const result = await onAutoAssign(true);
      if (result?.success && result?.teamId) {
        // User was assigned to a team, go to dashboard
        onNavigate('dashboard');
      } else {
        // Assignment failed, still go to dashboard
        onNavigate('dashboard');
      }
    } else {
      onNavigate('dashboard');
    }
    
    setIsSubmitting(false);
  };

  const config = ALLEGIANCE_CONFIG[allegiance];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm hidden sm:inline">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <img src={adaptLogo} alt="Adaptavist" className="h-6 w-auto" />
            <span className="font-bold text-sm tracking-tight">HACKDAY 2026</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-12">
        <div className="w-full max-w-2xl">
          {/* Card with dynamic border */}
          <div
            className={`bg-white p-5 sm:p-8 transition-all duration-300 ${config.borderRadius} ${config.borderStyle}`}
            style={{ borderColor: config.borderColor }}
          >
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">
                CONFIGURE YOUR AGENT
              </h1>
              <p className="text-sm text-gray-500">
                Set up your profile and declare your allegiance
              </p>
            </div>

            <div className="space-y-6 sm:space-y-8">
              {/* Display Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border-2 border-gray-200 
                             focus:border-gray-900 focus:outline-none
                             text-gray-900 placeholder:text-gray-400
                             transition-colors text-base"
                />
              </div>

              {/* Skills */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Areas of Interest
                  </label>
                  <span className="text-xs text-gray-400">
                    ({selectedSkills.length}/{MAX_SKILLS})
                  </span>
                </div>

                {/* Selected Skills as Tags */}
                {selectedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-gray-900 text-white rounded"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-1 hover:bg-gray-700 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Predefined Skills */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">
                    Suggested skills (click to add)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.filter(s => !selectedSkills.includes(s)).map((skill) => (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        disabled={selectedSkills.length >= MAX_SKILLS}
                        className={`px-3 py-1.5 text-sm border-2 transition-all rounded
                          ${selectedSkills.length >= MAX_SKILLS
                            ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                            : 'border-gray-200 text-gray-700 hover:border-gray-400'
                          }`}
                      >
                        <span className="flex items-center gap-1">
                          <Plus className="w-3 h-3" />
                          {skill}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Skill Input */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">
                    Or add your own
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customSkillInput}
                      onChange={(e) => {
                        setCustomSkillInput(e.target.value);
                        setCustomSkillError(null);
                      }}
                      onKeyDown={handleCustomSkillKeyDown}
                      placeholder="Type a skill and press Enter"
                      maxLength={30}
                      disabled={selectedSkills.length >= MAX_SKILLS}
                      className={`flex-1 px-3 py-2 border-2 focus:outline-none text-sm transition-colors rounded
                        ${customSkillError 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-200 focus:border-gray-900'}
                        ${selectedSkills.length >= MAX_SKILLS ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomSkill}
                      disabled={selectedSkills.length >= MAX_SKILLS || !customSkillInput.trim()}
                      className="px-4 py-2 text-sm font-medium bg-gray-900 text-white transition-colors disabled:opacity-50 rounded hover:bg-gray-800"
                    >
                      Add
                    </button>
                  </div>
                  {customSkillError && (
                    <p className="text-xs text-red-500 mt-1">{customSkillError}</p>
                  )}
                </div>
              </div>

              {/* Allegiance Toggle - CRITICAL FEATURE */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">
                  Declare Allegiance
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  {/* Human */}
                  <button
                    type="button"
                    onClick={() => setAllegiance('human')}
                    className={`p-3 sm:p-4 border-2 transition-all duration-200 rounded-xl
                      ${
                        allegiance === 'human'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                  >
                    <Heart
                      className={`w-6 sm:w-8 h-6 sm:h-8 mx-auto mb-1 sm:mb-2 ${
                        allegiance === 'human' ? 'text-green-500' : 'text-gray-400'
                      }`}
                    />
                    <div
                      className={`text-xs sm:text-sm font-bold ${
                        allegiance === 'human' ? 'text-green-600' : 'text-gray-600'
                      }`}
                    >
                      HUMAN
                    </div>
                    <div className="text-xs text-gray-400 mt-1 hidden sm:block">
                      Organic creativity
                    </div>
                  </button>

                  {/* Neutral */}
                  <button
                    type="button"
                    onClick={() => {
                      setAllegiance('neutral');
                      setAutoAssignEnabled(false); // Disable auto-assign when neutral
                    }}
                    className={`p-3 sm:p-4 border-2 transition-all duration-200 rounded-lg
                      ${
                        allegiance === 'neutral'
                          ? 'border-gray-500 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                  >
                    <Scale
                      className={`w-6 sm:w-8 h-6 sm:h-8 mx-auto mb-1 sm:mb-2 ${
                        allegiance === 'neutral' ? 'text-gray-500' : 'text-gray-400'
                      }`}
                    />
                    <div
                      className={`text-xs sm:text-sm font-bold ${
                        allegiance === 'neutral' ? 'text-gray-600' : 'text-gray-600'
                      }`}
                    >
                      NEUTRAL
                    </div>
                    <div className="text-xs text-gray-400 mt-1 hidden sm:block">
                      Free agent
                    </div>
                  </button>

                  {/* AI */}
                  <button
                    type="button"
                    onClick={() => setAllegiance('ai')}
                    className={`p-3 sm:p-4 border-2 transition-all duration-200 rounded-sm
                      ${
                        allegiance === 'ai'
                          ? 'border-cyan-500 bg-cyan-50 border-dashed'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                  >
                    <Cpu
                      className={`w-6 sm:w-8 h-6 sm:h-8 mx-auto mb-1 sm:mb-2 ${
                        allegiance === 'ai' ? 'text-cyan-500' : 'text-gray-400'
                      }`}
                    />
                    <div
                      className={`text-xs sm:text-sm font-bold font-mono ${
                        allegiance === 'ai' ? 'text-cyan-600' : 'text-gray-600'
                      }`}
                    >
                      AI
                    </div>
                    <div className="text-xs text-gray-400 mt-1 hidden sm:block">
                      Silicon supremacy
                    </div>
                  </button>
                </div>
              </div>

              {/* Auto-Assign Toggle */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">
                  Team Assignment
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (allegiance !== 'neutral') {
                      setAutoAssignEnabled(!autoAssignEnabled);
                    }
                  }}
                  disabled={allegiance === 'neutral'}
                  className={`w-full p-4 border-2 transition-all duration-200 text-left
                    ${allegiance === 'neutral' 
                      ? 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                      : autoAssignEnabled
                        ? allegiance === 'ai'
                          ? 'border-cyan-500 bg-cyan-50 border-dashed'
                          : 'border-green-500 bg-green-50 rounded-xl'
                        : 'border-gray-200 hover:border-gray-400 rounded-lg'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                      ${allegiance === 'neutral'
                        ? 'border-gray-300'
                        : autoAssignEnabled
                          ? allegiance === 'ai'
                            ? 'border-cyan-500 bg-cyan-500'
                            : 'border-green-500 bg-green-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {autoAssignEnabled && allegiance !== 'neutral' && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Zap className={`w-4 h-4 ${
                          allegiance === 'neutral'
                            ? 'text-gray-400'
                            : autoAssignEnabled
                              ? allegiance === 'ai' ? 'text-cyan-600' : 'text-green-600'
                              : 'text-gray-500'
                        }`} />
                        <span className={`font-bold text-sm ${
                          allegiance === 'neutral'
                            ? 'text-gray-400'
                            : autoAssignEnabled
                              ? allegiance === 'ai' ? 'text-cyan-700' : 'text-green-700'
                              : 'text-gray-700'
                        }`}>
                          Auto-assign me to a team
                        </span>
                      </div>
                      <p className={`text-xs mt-1 ${
                        allegiance === 'neutral' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {allegiance === 'neutral'
                          ? 'Choose Human or AI side to enable auto-assignment'
                          : `Join an existing ${allegiance === 'ai' ? 'AI' : 'Human'} team automatically, or start a new one if none are available`
                        }
                      </p>
                    </div>
                    <Users className={`w-5 h-5 flex-shrink-0 ${
                      allegiance === 'neutral'
                        ? 'text-gray-300'
                        : autoAssignEnabled
                          ? allegiance === 'ai' ? 'text-cyan-500' : 'text-green-500'
                          : 'text-gray-400'
                    }`} />
                  </div>
                </button>
              </div>

              {/* Submit */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!name.trim() || isSubmitting}
                className={`w-full py-3 sm:py-4 font-bold transition-colors border-2
                           disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2
                           ${autoAssignEnabled && allegiance !== 'neutral'
                             ? allegiance === 'ai'
                               ? 'bg-cyan-600 border-cyan-600 text-white hover:bg-cyan-700'
                               : 'bg-green-600 border-green-600 text-white hover:bg-green-700'
                             : 'bg-gray-900 border-gray-900 text-white hover:bg-gray-800'
                           }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {autoAssignEnabled && allegiance !== 'neutral' ? 'FINDING YOUR TEAM...' : 'JOINING...'}
                  </>
                ) : autoAssignEnabled && allegiance !== 'neutral' ? (
                  <>
                    <Zap className="w-4 h-4" />
                    AUTO-JOIN A TEAM
                  </>
                ) : (
                  'JOIN AS FREE AGENT'
                )}
              </button>

              {/* DEV SKIP BUTTON - REMOVE BEFORE LIVE */}
              <button
                type="button"
                onClick={() => {
                  updateUser({
                    name: 'Test User',
                    skills: ['Frontend Development', 'Backend Development'],
                    allegiance: 'neutral',
                  });
                  onNavigate('dashboard');
                }}
                className="w-full py-2 text-xs text-gray-400 hover:text-gray-600 underline"
              >
                [DEV] Skip to Dashboard
              </button>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-gray-400 mt-4 sm:mt-6">
            Your allegiance affects team recommendations in the marketplace
          </p>
        </div>
      </main>
    </div>
  );
}

export default Onboarding;
