/**
 * Onboarding Page
 * User profile setup: name, skills, allegiance selection, and auto-assign option.
 */

import { useState } from 'react';
import { ArrowLeft, Cpu, Heart, Scale, Check, X, Plus, Users, Zap, Loader2 } from 'lucide-react';
import adaptLogo from '../../adaptlogo.png';
import { SKILLS } from '../data/mockData';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';
import Badge from './ui/Badge';
import { Container, HStack, VStack } from './layout';
import { cn, getAllegianceConfig, ALLEGIANCE_CONFIG } from '../lib/design-system';

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
        onNavigate('dashboard');
      } else {
        onNavigate('dashboard');
      }
    } else {
      onNavigate('dashboard');
    }
    
    setIsSubmitting(false);
  };

  const config = getAllegianceConfig(allegiance);

  return (
    <div className="min-h-screen bg-surface-1 flex flex-col">
      {/* Header */}
      <header className="border-b border-neutral-200 px-4 sm:px-6 py-4">
        <Container size="lg" padding="none">
          <HStack justify="between" align="center">
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Back</span>
            </button>
            <HStack gap="2" align="center">
              <img src={adaptLogo} alt="Adaptavist" className="h-6 w-auto" />
              <span className="font-bold text-sm tracking-tight">HACKDAY 2026</span>
            </HStack>
          </HStack>
        </Container>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-12">
        <div className="w-full max-w-2xl">
          {/* Card with dynamic border */}
          <div
            className={cn(
              'bg-white p-5 sm:p-8 transition-all duration-300',
              config.borderRadius,
              allegiance === 'ai' ? 'border-2 border-dashed' : 'border-2'
            )}
            style={{ borderColor: config.borderColor }}
          >
            <VStack align="center" gap="2" className="mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-black text-neutral-900">
                CONFIGURE YOUR AGENT
              </h1>
              <p className="text-sm text-neutral-500">
                Set up your profile and declare your allegiance
              </p>
            </VStack>

            <VStack gap="6">
              {/* Display Name */}
              <Input
                label="Display Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                size="lg"
              />

              {/* Skills */}
              <div>
                <HStack gap="2" align="center" className="mb-3">
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
                    Areas of Interest
                  </label>
                  <span className="text-xs text-neutral-400">
                    ({selectedSkills.length}/{MAX_SKILLS})
                  </span>
                </HStack>

                {/* Selected Skills as Tags */}
                {selectedSkills.length > 0 && (
                  <HStack gap="2" wrap className="mb-4">
                    {selectedSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="default"
                        size="md"
                        removable
                        onRemove={() => removeSkill(skill)}
                        className="bg-neutral-900 text-white border-neutral-900"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </HStack>
                )}

                {/* Predefined Skills */}
                <div className="mb-4">
                  <p className="text-xs text-neutral-500 mb-2">
                    Suggested skills (click to add)
                  </p>
                  <HStack gap="2" wrap>
                    {SKILLS.filter(s => !selectedSkills.includes(s)).map((skill) => (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        disabled={selectedSkills.length >= MAX_SKILLS}
                        className={cn(
                          'px-3 py-1.5 text-sm border-2 transition-all rounded',
                          selectedSkills.length >= MAX_SKILLS
                            ? 'border-neutral-100 text-neutral-300 cursor-not-allowed'
                            : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
                        )}
                      >
                        <HStack gap="1" align="center">
                          <Plus className="w-3 h-3" />
                          {skill}
                        </HStack>
                      </button>
                    ))}
                  </HStack>
                </div>

                {/* Custom Skill Input */}
                <div>
                  <p className="text-xs text-neutral-500 mb-2">
                    Or add your own
                  </p>
                  <HStack gap="2">
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
                      className={cn(
                        'flex-1 px-3 py-2 border-2 focus:outline-none text-sm transition-colors rounded',
                        customSkillError 
                          ? 'border-error-300 focus:border-error-500' 
                          : 'border-neutral-200 focus:border-neutral-900',
                        selectedSkills.length >= MAX_SKILLS && 'bg-neutral-50 cursor-not-allowed'
                      )}
                    />
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleAddCustomSkill}
                      disabled={selectedSkills.length >= MAX_SKILLS || !customSkillInput.trim()}
                    >
                      Add
                    </Button>
                  </HStack>
                  {customSkillError && (
                    <p className="text-xs text-error-500 mt-1">{customSkillError}</p>
                  )}
                </div>
              </div>

              {/* Allegiance Toggle */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-3">
                  Declare Allegiance
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  {/* Human */}
                  <button
                    type="button"
                    onClick={() => setAllegiance('human')}
                    className={cn(
                      'p-3 sm:p-4 border-2 transition-all duration-200 rounded-human',
                      allegiance === 'human'
                        ? 'border-human-500 bg-human-50'
                        : 'border-neutral-200 hover:border-neutral-400'
                    )}
                  >
                    <Heart
                      className={cn(
                        'w-6 sm:w-8 h-6 sm:h-8 mx-auto mb-1 sm:mb-2',
                        allegiance === 'human' ? 'text-human-500' : 'text-neutral-400'
                      )}
                    />
                    <div className={cn(
                      'text-xs sm:text-sm font-bold',
                      allegiance === 'human' ? 'text-human-600' : 'text-neutral-600'
                    )}>
                      HUMAN
                    </div>
                    <div className="text-xs text-neutral-400 mt-1 hidden sm:block">
                      Organic creativity
                    </div>
                  </button>

                  {/* Neutral */}
                  <button
                    type="button"
                    onClick={() => {
                      setAllegiance('neutral');
                      setAutoAssignEnabled(false);
                    }}
                    className={cn(
                      'p-3 sm:p-4 border-2 transition-all duration-200 rounded-neutral',
                      allegiance === 'neutral'
                        ? 'border-neutral-500 bg-neutral-50'
                        : 'border-neutral-200 hover:border-neutral-400'
                    )}
                  >
                    <Scale
                      className={cn(
                        'w-6 sm:w-8 h-6 sm:h-8 mx-auto mb-1 sm:mb-2',
                        allegiance === 'neutral' ? 'text-neutral-500' : 'text-neutral-400'
                      )}
                    />
                    <div className={cn(
                      'text-xs sm:text-sm font-bold',
                      allegiance === 'neutral' ? 'text-neutral-600' : 'text-neutral-600'
                    )}>
                      NEUTRAL
                    </div>
                    <div className="text-xs text-neutral-400 mt-1 hidden sm:block">
                      Free agent
                    </div>
                  </button>

                  {/* AI */}
                  <button
                    type="button"
                    onClick={() => setAllegiance('ai')}
                    className={cn(
                      'p-3 sm:p-4 border-2 transition-all duration-200 rounded-ai',
                      allegiance === 'ai'
                        ? 'border-ai-500 bg-ai-50 border-dashed'
                        : 'border-neutral-200 hover:border-neutral-400'
                    )}
                  >
                    <Cpu
                      className={cn(
                        'w-6 sm:w-8 h-6 sm:h-8 mx-auto mb-1 sm:mb-2',
                        allegiance === 'ai' ? 'text-ai-500' : 'text-neutral-400'
                      )}
                    />
                    <div className={cn(
                      'text-xs sm:text-sm font-bold font-mono',
                      allegiance === 'ai' ? 'text-ai-600' : 'text-neutral-600'
                    )}>
                      AI
                    </div>
                    <div className="text-xs text-neutral-400 mt-1 hidden sm:block">
                      Silicon supremacy
                    </div>
                  </button>
                </div>
              </div>

              {/* Auto-Assign Toggle */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wide mb-3">
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
                  className={cn(
                    'w-full p-4 border-2 transition-all duration-200 text-left',
                    allegiance === 'neutral' 
                      ? 'border-neutral-100 bg-neutral-50 cursor-not-allowed opacity-60 rounded-lg'
                      : autoAssignEnabled
                        ? allegiance === 'ai'
                          ? 'border-ai-500 bg-ai-50 border-dashed rounded-ai'
                          : 'border-human-500 bg-human-50 rounded-human'
                        : 'border-neutral-200 hover:border-neutral-400 rounded-lg'
                  )}
                >
                  <HStack gap="3" align="start">
                    <div className={cn(
                      'mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0',
                      allegiance === 'neutral'
                        ? 'border-neutral-300'
                        : autoAssignEnabled
                          ? allegiance === 'ai'
                            ? 'border-ai-500 bg-ai-500'
                            : 'border-human-500 bg-human-500'
                          : 'border-neutral-300'
                    )}>
                      {autoAssignEnabled && allegiance !== 'neutral' && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <HStack gap="2" align="center">
                        <Zap className={cn(
                          'w-4 h-4',
                          allegiance === 'neutral'
                            ? 'text-neutral-400'
                            : autoAssignEnabled
                              ? allegiance === 'ai' ? 'text-ai-600' : 'text-human-600'
                              : 'text-neutral-500'
                        )} />
                        <span className={cn(
                          'font-bold text-sm',
                          allegiance === 'neutral'
                            ? 'text-neutral-400'
                            : autoAssignEnabled
                              ? allegiance === 'ai' ? 'text-ai-700' : 'text-human-700'
                              : 'text-neutral-700'
                        )}>
                          Auto-assign me to a team
                        </span>
                      </HStack>
                      <p className={cn(
                        'text-xs mt-1',
                        allegiance === 'neutral' ? 'text-neutral-400' : 'text-neutral-500'
                      )}>
                        {allegiance === 'neutral'
                          ? 'Choose Human or AI side to enable auto-assignment'
                          : `Join an existing ${allegiance === 'ai' ? 'AI' : 'Human'} team automatically, or start a new one if none are available`
                        }
                      </p>
                    </div>
                    <Users className={cn(
                      'w-5 h-5 flex-shrink-0',
                      allegiance === 'neutral'
                        ? 'text-neutral-300'
                        : autoAssignEnabled
                          ? allegiance === 'ai' ? 'text-ai-500' : 'text-human-500'
                          : 'text-neutral-400'
                    )} />
                  </HStack>
                </button>
              </div>

              {/* Submit */}
              <Button
                variant={autoAssignEnabled && allegiance !== 'neutral' 
                  ? (allegiance === 'ai' ? 'ai' : 'human') 
                  : 'primary'}
                size="lg"
                fullWidth
                onClick={handleSubmit}
                disabled={!name.trim() || isSubmitting}
                loading={isSubmitting}
                leftIcon={autoAssignEnabled && allegiance !== 'neutral' ? <Zap /> : undefined}
              >
                {isSubmitting 
                  ? (autoAssignEnabled && allegiance !== 'neutral' ? 'FINDING YOUR TEAM...' : 'JOINING...')
                  : autoAssignEnabled && allegiance !== 'neutral' 
                    ? 'AUTO-JOIN A TEAM'
                    : 'JOIN AS FREE AGENT'
                }
              </Button>

              {/* DEV SKIP BUTTON */}
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
                className="w-full py-2 text-xs text-neutral-400 hover:text-neutral-600 underline"
              >
                [DEV] Skip to Dashboard
              </button>
            </VStack>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-neutral-400 mt-4 sm:mt-6">
            Your allegiance affects team recommendations in the marketplace
          </p>
        </div>
      </main>
    </div>
  );
}

export default Onboarding;
