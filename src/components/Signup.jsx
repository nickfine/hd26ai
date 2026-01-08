/**
 * Signup Page - Multi-Step Wizard
 * High-conversion signup form with progressive disclosure and validation
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Cpu, Heart, Scale, Eye, Check, Plus, Users, Zap, ChevronRight, ChevronLeft, X, Search } from 'lucide-react';
import { SKILLS } from '../data/mockData';
import AppLayout from './AppLayout';
import Button from './ui/Button';
import Input from './ui/Input';
import Badge from './ui/Badge';
import { HStack, VStack } from './layout';
import { cn, getAllegianceConfig } from '../lib/design-system';

const MAX_SKILLS = 5;
const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 50;

// Step definitions
const STEPS = [
  { id: 1, label: 'Identity', shortLabel: 'Name' },
  { id: 2, label: 'Skills', shortLabel: 'Skills' },
  { id: 3, label: 'Allegiance', shortLabel: 'Side' },
  { id: 4, label: 'Team', shortLabel: 'Team' },
];

// Allegiance descriptions
const ALLEGIANCE_DESCRIPTIONS = {
  human: {
    title: 'Human Side',
    description: 'Join the organic creativity movement. Build with human ingenuity, intuition, and innovation.',
    benefits: ['Creative problem-solving', 'Intuitive design', 'Human-centered approach'],
  },
  ai: {
    title: 'AI Side',
    description: 'Embrace silicon supremacy. Leverage algorithmic excellence and computational precision.',
    benefits: ['Algorithmic efficiency', 'Data-driven solutions', 'Scalable systems'],
  },
  neutral: {
    title: 'Free Agent',
    description: 'Stay neutral and flexible. Choose teams based on project fit, not allegiance.',
    benefits: ['Maximum flexibility', 'Cross-side collaboration', 'Project-based choices'],
  },
  observer: {
    title: 'Observer',
    description: 'Watch and learn from the sidelines. Join the Observers team to follow the event without participating.',
    benefits: ['View all teams', 'Access to submissions', 'Event insights'],
  },
};

function Signup({ user, updateUser, onNavigate, onAutoAssign, teams, allegianceStyle, eventPhase, onCreateTeam }) {
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState(user?.name || '');
  const [nameError, setNameError] = useState('');
  const [callsign, setCallsign] = useState(user?.callsign || '');
  const [callsignError, setCallsignError] = useState('');
  const [selectedSkills, setSelectedSkills] = useState(user?.skills || []);
  const [allegiance, setAllegiance] = useState(null); // No pre-selection
  const [autoAssignEnabled, setAutoAssignEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllegianceToast, setShowAllegianceToast] = useState(false);
  const [allegianceToastContent, setAllegianceToastContent] = useState(null);
  
  // Skills search
  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const skillInputRef = useRef(null);
  const skillDropdownRef = useRef(null);
  
  // Confetti state
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiRef = useRef(null);

  // Validate name
  const validateName = useCallback((value) => {
    const trimmed = value.trim();
    if (!trimmed) return 'Display name is required';
    if (trimmed.length < MIN_NAME_LENGTH) return `Name must be at least ${MIN_NAME_LENGTH} characters`;
    if (trimmed.length > MAX_NAME_LENGTH) return `Name must be no more than ${MAX_NAME_LENGTH} characters`;
    return '';
  }, []);

  // Validate callsign
  const validateCallsign = useCallback((value) => {
    const trimmed = value.trim();
    if (trimmed.length > 0 && trimmed.length < 2) return 'Callsign must be at least 2 characters';
    if (trimmed.length > 20) return 'Callsign must be no more than 20 characters';
    // Allow alphanumeric, spaces, hyphens, underscores
    if (trimmed.length > 0 && !/^[a-zA-Z0-9\s\-_]+$/.test(trimmed)) {
      return 'Callsign can only contain letters, numbers, spaces, hyphens, and underscores';
    }
    return '';
  }, []);

  // Live name validation
  useEffect(() => {
    if (name) {
      const error = validateName(name);
      setNameError(error);
    } else {
      setNameError('');
    }
  }, [name, validateName]);

  // Live callsign validation
  useEffect(() => {
    if (callsign) {
      const error = validateCallsign(callsign);
      setCallsignError(error);
    } else {
      setCallsignError('');
    }
  }, [callsign, validateCallsign]);

  // Check if current step is valid
  const isStepValid = useCallback((step => {
    switch (step) {
      case 1:
        return name.trim().length >= MIN_NAME_LENGTH && !nameError && !callsignError;
      case 2:
        return selectedSkills.length > 0;
      case 3:
        return allegiance !== null;
      case 4:
        return true; // Team assignment is optional
      default:
        return false;
    }
  }), [name, nameError, callsignError, selectedSkills.length, allegiance]);

  // Handle next step
  const handleNext = useCallback(() => {
    if (isStepValid(currentStep)) {
      // If observer is selected on step 3, this is the last step - submission will be handled by the button
      if (currentStep === 3 && allegiance === 'observer') {
        // Don't advance, let the submit button handle it
        return;
      }
      // Otherwise proceed to next step
      if (currentStep < STEPS.length) {
        setCurrentStep(prev => prev + 1);
        // Scroll to top on step change
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [currentStep, isStepValid, allegiance]);

  // Handle previous step
  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  // Handle step click - allow navigation to any step
  const handleStepClick = useCallback((stepId) => {
    setCurrentStep(stepId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Filter skills based on search
  const filteredSkills = SKILLS.filter(skill =>
    skill.toLowerCase().includes(skillSearchQuery.toLowerCase()) &&
    !selectedSkills.includes(skill)
  );

  // Add skill
  const handleAddSkill = useCallback((skill) => {
    if (selectedSkills.length < MAX_SKILLS && !selectedSkills.includes(skill)) {
      setSelectedSkills(prev => [...prev, skill]);
      setSkillSearchQuery('');
      setShowSkillSuggestions(false);
    }
  }, [selectedSkills]);

  // Remove skill
  const handleRemoveSkill = useCallback((skill) => {
    setSelectedSkills(prev => prev.filter(s => s !== skill));
  }, []);

  // Handle custom skill input
  const handleCustomSkillKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && skillSearchQuery.trim()) {
      e.preventDefault();
      const trimmed = skillSearchQuery.trim();
      if (trimmed.length >= 2 && trimmed.length <= 30 && !selectedSkills.includes(trimmed)) {
        handleAddSkill(trimmed);
      }
    }
  }, [skillSearchQuery, selectedSkills, handleAddSkill]);

  // Handle allegiance selection
  const handleAllegianceSelect = useCallback((selectedAllegiance) => {
    setAllegiance(selectedAllegiance);
    if (selectedAllegiance === 'neutral' || selectedAllegiance === 'observer') {
      setAutoAssignEnabled(false);
    }
    
    // Show toast with description
    setAllegianceToastContent(ALLEGIANCE_DESCRIPTIONS[selectedAllegiance]);
    setShowAllegianceToast(true);
    setTimeout(() => setShowAllegianceToast(false), 5000);
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    
    // Ensure name is not empty before submitting
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < MIN_NAME_LENGTH) {
      setNameError(`Display Name must be at least ${MIN_NAME_LENGTH} characters.`);
      setIsSubmitting(false);
      return;
    }
    
    await updateUser({
      name: trimmedName,
      callsign: callsign.trim(),
      skills: selectedSkills,
      allegiance: allegiance || 'neutral',
    });
    
    // Small delay to ensure state update completes (especially in demo mode)
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Handle observer assignment to Observers team
    if (allegiance === 'observer' && onAutoAssign) {
      const result = await onAutoAssign(true);
      if (result?.success) {
        setShowConfetti(true);
        setTimeout(() => {
          onNavigate('dashboard');
        }, 2000);
        return;
      }
    }
    
    if (autoAssignEnabled && allegiance !== 'neutral' && allegiance !== 'observer' && onAutoAssign) {
      const result = await onAutoAssign(true);
      if (result?.success && result?.teamId) {
        setShowConfetti(true);
        setTimeout(() => {
          onNavigate('dashboard');
        }, 2000);
      } else {
        setShowConfetti(true);
        setTimeout(() => {
          onNavigate('dashboard');
        }, 2000);
      }
    } else {
      setShowConfetti(true);
      setTimeout(() => {
        onNavigate('dashboard');
      }, 2000);
    }
  }, [name, selectedSkills, allegiance, autoAssignEnabled, updateUser, onAutoAssign, onNavigate]);

  // Click outside to close skill suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        skillDropdownRef.current &&
        !skillDropdownRef.current.contains(event.target) &&
        skillInputRef.current &&
        !skillInputRef.current.contains(event.target)
      ) {
        setShowSkillSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Confetti effect
  useEffect(() => {
    if (showConfetti && confettiRef.current) {
      const canvas = confettiRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const particles = [];
      const particleCount = 150;
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: -10,
          vx: (Math.random() - 0.5) * 2,
          vy: Math.random() * 3 + 2,
          color: ['#FF4500', '#00E5FF', '#FFD700', '#FF6B6B', '#4ECDC4'][Math.floor(Math.random() * 5)],
          size: Math.random() * 5 + 3,
        });
      }
      
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, i) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.1; // gravity
          
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          
          if (p.y > canvas.height) {
            particles.splice(i, 1);
          }
        });
        
        if (particles.length > 0) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    }
  }, [showConfetti]);

  const progress = (currentStep / STEPS.length) * 100;
  const canProceed = isStepValid(currentStep);
  // Skip step 4 (team assignment) if observer is selected
  const isLastStep = allegiance === 'observer' 
    ? currentStep === 3 
    : currentStep === STEPS.length;

  return (
    <AppLayout
      user={user}
      teams={teams}
      allegianceStyle={allegianceStyle}
      onNavigate={onNavigate}
      eventPhase={eventPhase}
      activeNav="signup"
    >
      {/* Confetti Canvas */}
      {showConfetti && (
        <canvas
          ref={confettiRef}
          className="fixed inset-0 pointer-events-none z-50"
          style={{ zIndex: 9999 }}
        />
      )}

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full mb-4 animate-orange-pulse">
              <Zap className="w-5 h-5 text-brand icon-orange" />
              <span className="font-bold text-sm text-white">SIGN UP</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-brand mb-4 font-display animate-orange-pulse-delay-1">
              JOIN HACKDAY 2026
            </h1>
            <p className="text-lg text-text-body max-w-2xl mx-auto">
              Create your profile and choose your side in the ultimate Human vs AI hackathon
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={STEPS.length} aria-label="Signup progress">
            <div className="flex items-center justify-between mb-2">
              {STEPS.map((step, index) => {
                // Skip step 4 (team assignment) if observer is selected
                if (index === 3 && allegiance === 'observer') {
                  return null;
                }
                return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <button
                      type="button"
                      onClick={() => handleStepClick(step.id)}
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-300 cursor-pointer hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-arena-black',
                        currentStep > step.id
                          ? 'bg-brand text-white hover:bg-brand-hover'
                          : currentStep === step.id
                          ? 'bg-brand text-white scale-110 ring-4 ring-brand/30'
                          : 'bg-arena-border text-arena-muted hover:bg-arena-elevated hover:text-white'
                      )}
                      aria-label={`Step ${step.id}: ${step.label} - Click to navigate`}
                      aria-current={currentStep === step.id ? 'step' : undefined}
                    >
                      {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStepClick(step.id)}
                      className={cn(
                        'text-xs mt-2 font-bold transition-colors cursor-pointer hover:text-brand focus:outline-none',
                        currentStep >= step.id ? 'text-white' : 'text-arena-muted'
                      )}
                      aria-label={`Go to ${step.label}`}
                    >
                      {step.shortLabel}
                    </button>
                  </div>
                  {index < STEPS.length - 1 && !(index === 2 && allegiance === 'observer') && (
                    <div className={cn(
                      'flex-1 h-1 mx-2 transition-all duration-300',
                      currentStep > step.id ? 'bg-brand' : 'bg-arena-border'
                    )} />
                  )}
                </div>
                );
              })}
            </div>
            <div className="w-full h-2 bg-arena-border rounded-full overflow-hidden mt-4">
              <div
                className="h-full bg-brand transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="mb-4">
            {/* Step 1: Identity */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-black text-white mb-6">
                    <span className="text-brand">{STEPS[0].id}.</span> Your Identity
                  </h2>
                  
                  <VStack gap="4">
                    <div>
                      <Input
                        label="Display Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        size="lg"
                        error={nameError}
                        autoFocus
                        aria-required="true"
                        aria-invalid={!!nameError}
                        aria-describedby={nameError ? 'name-error' : undefined}
                      />
                      {nameError && (
                        <p id="name-error" className="text-sm text-human mt-2" role="alert">
                          {nameError}
                        </p>
                      )}
                    </div>

                    <div>
                      <Input
                        label="Callsign (Optional)"
                        value={callsign}
                        onChange={(e) => setCallsign(e.target.value)}
                        placeholder="e.g., Code Ninja, Debug Master"
                        size="lg"
                        error={callsignError}
                        aria-invalid={!!callsignError}
                        aria-describedby={callsignError ? 'callsign-error' : undefined}
                      />
                      {callsignError && (
                        <p id="callsign-error" className="text-sm text-human mt-2" role="alert">
                          {callsignError}
                        </p>
                      )}
                    </div>
                  </VStack>
                </div>
              </div>
            )}

            {/* Step 2: Skills */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-black text-white mb-6">
                    <span className="text-brand">{STEPS[1].id}.</span> Areas of Interest
                  </h2>

                  {/* Selected Skills */}
                  {selectedSkills.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-bold text-arena-secondary uppercase tracking-wide mb-3">
                        Your Skills ({selectedSkills.length}/{MAX_SKILLS})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedSkills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="default"
                            size="md"
                            removable
                            onRemove={() => handleRemoveSkill(skill)}
                            className="bg-brand text-white border-brand"
                            aria-label={`Remove ${skill}`}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Searchable Skill Input */}
                  <div className="relative" ref={skillDropdownRef}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-arena-muted" />
                      <input
                        ref={skillInputRef}
                        type="text"
                        value={skillSearchQuery}
                        onChange={(e) => {
                          setSkillSearchQuery(e.target.value);
                          setShowSkillSuggestions(true);
                        }}
                        onFocus={() => setShowSkillSuggestions(true)}
                        onKeyDown={handleCustomSkillKeyDown}
                        placeholder="Search or type a skill and press Enter"
                        maxLength={30}
                        disabled={selectedSkills.length >= MAX_SKILLS}
                        className={cn(
                          'w-full pl-10 pr-4 py-3 border-2 focus:outline-none text-sm transition-colors rounded-lg bg-arena-black text-white placeholder:text-arena-muted',
                          selectedSkills.length >= MAX_SKILLS
                            ? 'border-arena-border opacity-50 cursor-not-allowed'
                            : 'border-arena-border focus:border-brand'
                        )}
                        aria-label="Search or add skills"
                        aria-describedby="skill-helper"
                      />
                    </div>

                    {/* Suggestions Dropdown */}
                    {showSkillSuggestions && (filteredSkills.length > 0 || skillSearchQuery.trim()) && selectedSkills.length < MAX_SKILLS && (
                      <div className="absolute z-10 w-full mt-2 bg-arena-card border-2 border-arena-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredSkills.length > 0 && (
                          <div className="p-2">
                            <p className="text-xs text-arena-muted px-2 py-1 mb-1">Suggested Skills</p>
                            {filteredSkills.slice(0, 10).map((skill) => (
                              <button
                                key={skill}
                                type="button"
                                onClick={() => handleAddSkill(skill)}
                                className="w-full text-left px-3 py-2 text-sm text-arena-secondary hover:bg-arena-elevated hover:text-white rounded transition-colors flex items-center gap-2"
                                aria-label={`Add ${skill}`}
                              >
                                <Plus className="w-4 h-4" />
                                {skill}
                              </button>
                            ))}
                          </div>
                        )}
                        {skillSearchQuery.trim() && !selectedSkills.includes(skillSearchQuery.trim()) && (
                          <div className="p-2 border-t border-arena-border">
                            <button
                              type="button"
                              onClick={() => handleAddSkill(skillSearchQuery.trim())}
                              disabled={skillSearchQuery.trim().length < 2}
                              className="w-full text-left px-3 py-2 text-sm text-brand hover:bg-arena-elevated rounded transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                              aria-label={`Add custom skill: ${skillSearchQuery.trim()}`}
                            >
                              <Plus className="w-4 h-4" />
                              Add "{skillSearchQuery.trim()}"
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Allegiance */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-black text-white mb-2">
                    <span className="text-brand">{STEPS[2].id}.</span> Choose Your Side
                  </h2>
                  <p className="text-sm text-arena-muted mb-6">
                    You can change your side and team at any time until the hack starts
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-11 gap-4">
                    {/* Human */}
                    <button
                      type="button"
                      onClick={() => handleAllegianceSelect('human')}
                      aria-label="Select Human side"
                      aria-pressed={allegiance === 'human'}
                      className={cn(
                        'p-6 border-2 transition-all duration-300 rounded-lg text-left group relative overflow-hidden sm:col-span-3',
                        allegiance === 'human'
                          ? 'border-human bg-human/10 shadow-human-glow scale-105'
                          : 'border-arena-border hover:border-human/50 hover:bg-arena-elevated hover:scale-[1.02]'
                      )}
                    >
                      {allegiance === 'human' && (
                        <div className="absolute inset-0 bg-human/5 animate-pulse" />
                      )}
                      <div className="relative flex flex-col items-center text-center">
                        <Heart
                          className={cn(
                            'w-12 h-12 mb-3 transition-all duration-300',
                            allegiance === 'human'
                              ? 'text-human scale-110'
                              : 'text-arena-muted group-hover:text-human group-hover:scale-105'
                          )}
                        />
                        <div className={cn(
                          'text-lg font-black mb-1',
                          allegiance === 'human' ? 'text-human' : 'text-arena-secondary group-hover:text-human'
                        )}>
                          HUMAN
                        </div>
                        <div className="text-xs text-arena-muted">
                          Organic creativity
                        </div>
                        {allegiance === 'human' && (
                          <div className="mt-3 text-xs text-human font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Selected
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Neutral */}
                    <button
                      type="button"
                      onClick={() => handleAllegianceSelect('neutral')}
                      aria-label="Select Neutral side"
                      aria-pressed={allegiance === 'neutral'}
                      className={cn(
                        'p-6 border-2 transition-all duration-300 rounded-lg text-left group relative overflow-hidden sm:col-span-3',
                        allegiance === 'neutral'
                          ? 'border-arena-secondary bg-arena-secondary/10 scale-105'
                          : 'border-arena-border hover:border-arena-secondary/50 hover:bg-arena-elevated hover:scale-[1.02]'
                      )}
                    >
                      {allegiance === 'neutral' && (
                        <div className="absolute inset-0 bg-arena-secondary/5 animate-pulse" />
                      )}
                      <div className="relative flex flex-col items-center text-center">
                        <Scale
                          className={cn(
                            'w-12 h-12 mb-3 transition-all duration-300',
                            allegiance === 'neutral'
                              ? 'text-arena-secondary scale-110'
                              : 'text-arena-muted group-hover:text-arena-secondary group-hover:scale-105'
                          )}
                        />
                        <div className={cn(
                          'text-lg font-black mb-1',
                          allegiance === 'neutral' ? 'text-white' : 'text-arena-secondary group-hover:text-white'
                        )}>
                          NEUTRAL
                        </div>
                        <div className="text-xs text-arena-muted">
                          Free agent
                        </div>
                        {allegiance === 'neutral' && (
                          <div className="mt-3 text-xs text-arena-secondary font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Selected
                          </div>
                        )}
                      </div>
                    </button>

                    {/* AI */}
                    <button
                      type="button"
                      onClick={() => handleAllegianceSelect('ai')}
                      aria-label="Select AI side"
                      aria-pressed={allegiance === 'ai'}
                      className={cn(
                        'p-6 border-2 border-dashed transition-all duration-300 rounded-lg text-left group relative overflow-hidden sm:col-span-3',
                        allegiance === 'ai'
                          ? 'border-ai bg-ai/10 shadow-ai-glow scale-105'
                          : 'border-arena-border hover:border-ai/50 hover:bg-arena-elevated hover:scale-[1.02]'
                      )}
                    >
                      {allegiance === 'ai' && (
                        <div className="absolute inset-0 bg-ai/5 animate-pulse" />
                      )}
                      <div className="relative flex flex-col items-center text-center">
                        <Cpu
                          className={cn(
                            'w-12 h-12 mb-3 transition-all duration-300',
                            allegiance === 'ai'
                              ? 'text-ai scale-110'
                              : 'text-arena-muted group-hover:text-ai group-hover:scale-105'
                          )}
                        />
                        <div className={cn(
                          'text-lg font-black mb-1',
                          allegiance === 'ai' ? 'text-ai' : 'text-arena-secondary group-hover:text-ai'
                        )}>
                          AI
                        </div>
                        <div className="text-xs text-arena-muted">
                          Silicon supremacy
                        </div>
                        {allegiance === 'ai' && (
                          <div className="mt-3 text-xs text-ai font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Selected
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Observer Option - Same row, smaller than main options */}
                    <button
                      type="button"
                      onClick={() => handleAllegianceSelect('observer')}
                      aria-label="Select Observer"
                      aria-pressed={allegiance === 'observer'}
                      className={cn(
                        'p-6 border-2 transition-all duration-300 rounded-lg text-left group relative overflow-hidden sm:col-span-2',
                        allegiance === 'observer'
                          ? 'border-white bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105'
                          : 'border-arena-border hover:border-white/50 hover:bg-arena-elevated hover:scale-[1.02]'
                      )}
                    >
                      {allegiance === 'observer' && (
                        <div className="absolute inset-0 bg-white/5 animate-pulse" />
                      )}
                      <div className="relative flex flex-col items-center text-center">
                        <Eye
                          className={cn(
                            'w-12 h-12 mb-3 transition-all duration-300',
                            allegiance === 'observer'
                              ? 'text-white scale-110'
                              : 'text-arena-muted group-hover:text-white group-hover:scale-105'
                          )}
                        />
                        <div className={cn(
                          'text-lg font-black mb-1',
                          allegiance === 'observer' ? 'text-white' : 'text-arena-secondary group-hover:text-white'
                        )}>
                          OBSERVER
                        </div>
                        <div className="text-xs text-arena-muted">
                          Watch and learn
                        </div>
                        {allegiance === 'observer' && (
                          <div className="mt-3 text-xs text-white font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Selected
                          </div>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Team Assignment */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-black text-white mb-6">
                    <span className="text-brand">{STEPS[3].id}.</span> Team Assignment
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      if (allegiance !== 'neutral') {
                        setAutoAssignEnabled(!autoAssignEnabled);
                      }
                    }}
                    disabled={allegiance === 'neutral'}
                    aria-label={autoAssignEnabled ? 'Disable auto-assignment' : 'Enable auto-assignment'}
                    aria-pressed={autoAssignEnabled}
                    className={cn(
                      'w-full p-6 border-2 transition-all duration-200 text-left rounded-lg',
                      allegiance === 'neutral'
                        ? 'border-arena-border bg-arena-black cursor-not-allowed opacity-60'
                        : autoAssignEnabled
                          ? allegiance === 'ai'
                            ? 'border-ai bg-ai/10 border-dashed shadow-ai-glow'
                            : 'border-human bg-human/10 shadow-human-glow'
                          : 'border-arena-border hover:border-arena-secondary hover:bg-arena-elevated'
                    )}
                  >
                    <HStack gap="4" align="start">
                      <div className={cn(
                        'mt-1 w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all',
                        allegiance === 'neutral'
                          ? 'border-arena-muted'
                          : autoAssignEnabled
                            ? allegiance === 'ai'
                              ? 'border-ai bg-ai'
                              : 'border-human bg-human'
                            : 'border-arena-muted'
                      )}>
                        {autoAssignEnabled && allegiance !== 'neutral' && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <HStack gap="2" align="center" className="mb-2">
                          <Zap className={cn(
                            'w-5 h-5',
                            allegiance === 'neutral'
                              ? 'text-arena-muted'
                              : autoAssignEnabled
                                ? allegiance === 'ai' ? 'text-ai' : 'text-human'
                                : 'text-arena-secondary'
                          )} />
                          <span className={cn(
                            'font-bold text-lg',
                            allegiance === 'neutral'
                              ? 'text-arena-muted'
                              : autoAssignEnabled
                                ? allegiance === 'ai' ? 'text-ai' : 'text-human'
                                : 'text-white'
                          )}>
                            Auto-assign me to a team
                          </span>
                        </HStack>
                        {autoAssignEnabled && allegiance !== 'neutral' ? (
                          <div className="space-y-2">
                            <p className="text-sm text-arena-secondary">
                              We'll match you with a team based on your allegiance and skills!
                            </p>
                            <p className="text-xs text-arena-muted">
                              If no suitable team is available, we'll create a new one for you.
                            </p>
                          </div>
                        ) : (
                          <p className={cn(
                            'text-sm',
                            allegiance === 'neutral' ? 'text-arena-muted' : 'text-arena-secondary'
                          )}>
                              {allegiance === 'neutral'
                                ? 'Choose Human or AI side above to enable automatic team assignment.'
                                : "We'll automatically place you on an existing team, or create a new one if none are available."}
                          </p>
                        )}
                      </div>
                      <Users className={cn(
                        'w-6 h-6 flex-shrink-0',
                        allegiance === 'neutral'
                          ? 'text-arena-muted'
                          : autoAssignEnabled
                            ? allegiance === 'ai' ? 'text-ai' : 'text-human'
                            : 'text-arena-secondary'
                      )} />
                    </HStack>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4 pt-3 border-t border-arena-border mt-4">
            <Button
              variant="secondary"
              size="lg"
              onClick={handleBack}
              disabled={currentStep === 1}
              leftIcon={<ChevronLeft className="w-5 h-5" />}
              aria-label="Go to previous step"
            >
              Back
            </Button>
            
            {!isLastStep ? (
              <Button
                variant="primary"
                size="lg"
                onClick={handleNext}
                disabled={!canProceed}
                rightIcon={<ChevronRight className="w-5 h-5" />}
                aria-label="Go to next step"
              >
                Next
              </Button>
            ) : (
              <Button
                variant={autoAssignEnabled && allegiance !== 'neutral'
                  ? (allegiance === 'ai' ? 'ai' : 'human')
                  : 'primary'}
                size="lg"
                onClick={handleSubmit}
                disabled={!canProceed || isSubmitting}
                loading={isSubmitting}
                leftIcon={autoAssignEnabled && allegiance !== 'neutral' ? <Zap /> : undefined}
                aria-label="Complete signup"
              >
                {isSubmitting
                  ? (autoAssignEnabled && allegiance !== 'neutral' ? 'FINDING YOUR TEAM...' : 'JOINING...')
                  : autoAssignEnabled && allegiance !== 'neutral'
                    ? 'AUTO-JOIN & COMPLETE'
                    : 'JOIN AS FREE AGENT'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Allegiance Toast */}
      {showAllegianceToast && allegianceToastContent && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-arena-card border-2 border-arena-border rounded-lg shadow-lg p-4 max-w-md animate-slide-up"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h3 className="font-bold text-white mb-1">{allegianceToastContent.title}</h3>
              <p className="text-sm text-arena-secondary mb-2">{allegianceToastContent.description}</p>
              <ul className="text-xs text-arena-muted space-y-1">
                {allegianceToastContent.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center gap-1">
                    <span className="text-brand">•</span> {benefit}
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              onClick={() => setShowAllegianceToast(false)}
              className="flex-shrink-0 p-1 rounded hover:bg-arena-elevated transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4 text-arena-muted" />
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default Signup;
