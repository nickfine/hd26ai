/**
 * Signup Page - Multi-Step Wizard
 * High-conversion signup form with progressive disclosure and validation
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Eye, Check, Plus, Users, Zap, ChevronRight, ChevronLeft, X, Search } from 'lucide-react';
import { SKILLS } from '../data/mockData';
import AppLayout from './AppLayout';
import Button from './ui/Button';
import Input from './ui/Input';
import Badge from './ui/Badge';
import { HStack, VStack } from './layout';
import { cn, getRoleConfig } from '../lib/design-system';

const MAX_SKILLS = 5;
const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 50;

// Step definitions
const STEPS = [
  { id: 1, label: 'Identity', shortLabel: 'Name' },
  { id: 2, label: 'Skills', shortLabel: 'Skills' },
  { id: 3, label: 'Team', shortLabel: 'Team' },
];

// Role descriptions
const ROLE_DESCRIPTIONS = {
  observer: {
    title: 'Observer',
    description: 'Watch and learn from the sidelines. Join the Observers team to follow the event without participating.',
    benefits: ['View all teams', 'Access to submissions', 'Event insights'],
  },
};

function Signup({ user, updateUser, onNavigate, onAutoAssign, teams, eventPhase, onCreateTeam }) {
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState(user?.name || '');
  const [nameError, setNameError] = useState('');
  const [callsign, setCallsign] = useState(user?.callsign || '');
  const [callsignError, setCallsignError] = useState('');
  const [selectedSkills, setSelectedSkills] = useState(user?.skills || []);
  const [isObserver, setIsObserver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
        return true; // Team assignment is optional
      default:
        return false;
    }
  }), [name, nameError, callsignError, selectedSkills.length]);

  // Handle next step
  const handleNext = useCallback(() => {
    if (isStepValid(currentStep)) {
      if (currentStep < STEPS.length) {
        setCurrentStep(prev => prev + 1);
        // Scroll to top on step change
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [currentStep, isStepValid]);

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
    });
    
    // Small delay to ensure state update completes (especially in demo mode)
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Handle observer assignment to Observers team
    if (isObserver && onAutoAssign) {
      const result = await onAutoAssign(true);
      if (result?.success) {
        setShowConfetti(true);
        setTimeout(() => {
          onNavigate('dashboard');
        }, 2000);
        return;
      }
    }
    
    setShowConfetti(true);
    setTimeout(() => {
      onNavigate('dashboard');
    }, 2000);
  }, [name, selectedSkills, isObserver, updateUser, onAutoAssign, onNavigate]);

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
  const isLastStep = currentStep === STEPS.length;

  return (
    <AppLayout
      user={user}
      teams={teams}
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
              Create your profile and join a team
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={STEPS.length} aria-label="Signup progress">
            <div className="flex items-center justify-between mb-2">
              {STEPS.map((step, index) => {
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
                      {index < STEPS.length - 1 && (
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
                        <p id="name-error" className="text-sm text-error mt-2" role="alert">
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
                        <p id="callsign-error" className="text-sm text-error mt-2" role="alert">
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

            {/* Step 3: Team Assignment */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-black text-white mb-6">
                    <span className="text-brand">{STEPS[2].id}.</span> Join a Team or Observe
                  </h2>
                  
                  <div className="space-y-4">
                    {/* Observer Option */}
                    <button
                      type="button"
                      onClick={() => setIsObserver(!isObserver)}
                      aria-label={isObserver ? 'Deselect Observer' : 'Select Observer'}
                      aria-pressed={isObserver}
                      className={cn(
                        'w-full p-6 border-2 transition-all duration-200 text-left rounded-lg',
                        isObserver
                          ? 'border-white bg-white/10'
                          : 'border-arena-border hover:border-arena-secondary hover:bg-arena-elevated'
                      )}
                    >
                      <HStack gap="4" align="start">
                        <div className={cn(
                          'mt-1 w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all',
                          isObserver
                            ? 'border-white bg-white'
                            : 'border-arena-muted'
                        )}>
                          {isObserver && (
                            <Check className="w-4 h-4 text-arena-black" />
                          )}
                        </div>
                        <div className="flex-1">
                          <HStack gap="2" align="center" className="mb-2">
                            <Eye className={cn(
                              'w-5 h-5',
                              isObserver ? 'text-white' : 'text-arena-secondary'
                            )} />
                            <span className={cn(
                              'font-bold text-lg',
                              isObserver ? 'text-white' : 'text-white'
                            )}>
                              Join as Observer
                            </span>
                          </HStack>
                          <p className="text-sm text-arena-secondary">
                            Watch and learn from the sidelines. Join the Observers team to follow the event without participating.
                          </p>
                        </div>
                      </HStack>
                    </button>
                    
                    {!isObserver && (
                      <div className="p-4 border border-arena-border rounded-lg bg-arena-elevated">
                        <p className="text-sm text-arena-secondary">
                          You can join or create a team from the dashboard after signing up.
                        </p>
                      </div>
                    )}
                  </div>
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
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                disabled={!canProceed || isSubmitting}
                loading={isSubmitting}
                aria-label="Complete signup"
              >
                {isSubmitting
                  ? (isObserver ? 'JOINING AS OBSERVER...' : 'JOINING...')
                  : (isObserver ? 'JOIN AS OBSERVER' : 'COMPLETE SIGNUP')}
              </Button>
            )}
          </div>
        </div>
      </div>

    </AppLayout>
  );
}

export default Signup;
