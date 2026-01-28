import { useState } from 'react';
import {
  Crown,
  Bell,
  ChevronRight,
  Users,
  User,
  Check,
  X,
  Plus,
  Zap,
  Activity,
  UserPlus,
  Send,
  Calendar,
} from 'lucide-react';
import { SKILLS, AVATARS } from '../data/mockData';
import { cn } from '../lib/design-system';
import AppLayout from './AppLayout';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { ProfileSkeleton } from './ui/Skeleton';

// Validation for callsign
const validateCallsign = (value) => {
  if (value.length > 20) return 'Max 20 characters';
  if (!/^[a-zA-Z0-9 ]*$/.test(value)) return 'Letters, numbers, and spaces only';
  return null;
};

// Validation for custom skill
const validateCustomSkill = (value, existingSkills) => {
  const trimmed = value.trim();
  if (trimmed.length < 2) return 'Min 2 characters';
  if (trimmed.length > 30) return 'Max 30 characters';
  if (existingSkills.some(s => s.toLowerCase() === trimmed.toLowerCase())) return 'Already added';
  return null;
};

// Max skills allowed
const MAX_SKILLS = 5;

// ============================================================================
// AVATAR PICKER MODAL
// ============================================================================

function AvatarPickerModal({ 
  isOpen, 
  onClose, 
  onSelect, 
  currentAvatar
}) {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar || null);

  // Get avatars
  const avatarsToShow = AVATARS.default || [];

  const handleSave = () => {
    if (selectedAvatar) {
      onSelect(selectedAvatar);
    }
    onClose();
  };

  const handleClear = () => {
    setSelectedAvatar(null);
    onSelect(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Choose Your Avatar"
      description="Pick an avatar that represents you"
      size="lg"
    >

      {/* Avatar Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto p-1">
        {avatarsToShow.map((avatar) => (
          <button
            key={avatar.id}
            type="button"
            onClick={() => setSelectedAvatar(avatar.src)}
            className={cn(
              'relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105',
              selectedAvatar === avatar.src
                ? 'border-text-secondary ring-2 ring-text-secondary/30'
                : 'border-arena-border hover:border-arena-secondary'
            )}
          >
            {/* Avatar Image */}
            <div className="w-full h-full flex items-center justify-center bg-arena-elevated">
              <img
                src={avatar.src}
                alt={avatar.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Show placeholder if image fails to load
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              {/* Placeholder shown on error */}
              <div 
                className="hidden w-full h-full items-center justify-center"
                style={{ position: 'absolute', inset: 0 }}
              >
                <User 
                  className={cn(
                    'w-8 h-8',
                    'text-text-muted'
                  )} 
                />
              </div>
            </div>

            {/* Selection indicator */}
            {selectedAvatar === avatar.src && (
              <div 
                className={cn(
                  'absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center',
                  activeTab === 'ai' ? 'bg-ai' : 'bg-human'
                )}
              >
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Empty state if no avatars */}
      {avatarsToShow.length === 0 && (
        <div className="text-center py-8 text-arena-muted">
          <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No avatars available yet</p>
          <p className="text-xs mt-1">Check back soon!</p>
        </div>
      )}

      {/* Footer */}
      <Modal.Footer>
        {currentAvatar && (
          <Button
            variant="ghost"
            onClick={handleClear}
            className="mr-auto text-arena-muted hover:text-text-primary"
          >
            Remove Avatar
          </Button>
        )}
        <Button
          variant="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={!selectedAvatar}
          style={{ 
            backgroundColor: undefined,
          }}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function Profile({
  user,
  updateUser,
  teams,
  onNavigate,
  onNavigateToTeam,
  onLeaveTeam,
  onAutoAssign,
  eventPhase,
  devRoleOverride = null,
  onDevRoleChange = null,
  onPhaseChange = null,
  eventPhases = {},
  isLoading = false, // Show skeleton loading state
  simulateLoading = false,
  onSimulateLoadingChange = null,
}) {
  // Show skeleton while loading
  if (isLoading) {
    return (
      <AppLayout
        user={user}
        teams={teams}
        onNavigate={onNavigate}
        eventPhase={eventPhase}
        activeNav="profile"
        devRoleOverride={devRoleOverride}
        onDevRoleChange={onDevRoleChange}
        onPhaseChange={onPhaseChange}
        eventPhases={eventPhases}
        simulateLoading={simulateLoading}
        onSimulateLoadingChange={onSimulateLoadingChange}
      >
        <ProfileSkeleton />
      </AppLayout>
    );
  }
  const [bio, setBio] = useState(user?.bio || '');
  const [isEditingBio, setIsEditingBio] = useState(false);
  
  // Callsign editing state - live preview uses this directly
  const [callsign, setCallsign] = useState(user?.callsign || '');
  const [isEditingCallsign, setIsEditingCallsign] = useState(false);
  const [callsignError, setCallsignError] = useState(null);
  
  // Skills editing state
  const [selectedSkills, setSelectedSkills] = useState(user?.skills || []);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [customSkillError, setCustomSkillError] = useState(null);
  
  // Leave team confirmation state
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  
  // Avatar picker modal state
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  
  // Auto-assign state
  const [isAutoAssigning, setIsAutoAssigning] = useState(false);
  const [autoAssignError, setAutoAssignError] = useState(null);
  const [autoAssignSuccess, setAutoAssignSuccess] = useState(null);

  // Find the team the user is on (as captain or member)
  const userTeam = teams.find(
    (team) =>
      team.captainId === user?.id ||
      team.members.some((m) => m.id === user?.id || m.name === user?.name)
  );

  // Check if user is captain
  const isCaptain = userTeam?.captainId === user?.id;

  // Get pending request count for captains
  const pendingRequestCount = isCaptain ? userTeam?.joinRequests?.length || 0 : 0;


  // Get the display callsign - use editing value if editing, otherwise saved value
  const displayCallsign = isEditingCallsign ? callsign : (user?.callsign || '');

  // Format name with callsign for live preview
  const formatNameWithCallsign = () => {
    if (!displayCallsign || !user?.name) return user?.name || 'Unknown';
    const parts = user.name.split(' ');
    if (parts.length < 2) return user.name;
    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ');
    return { firstName, callsign: displayCallsign, lastName };
  };

  const formattedName = formatNameWithCallsign();

  // Save bio
  const handleSaveBio = () => {
    updateUser({ bio });
    setIsEditingBio(false);
  };

  // Callsign change handler with validation
  const handleCallsignChange = (value) => {
    setCallsign(value);
    setCallsignError(validateCallsign(value));
  };

  // Save callsign
  const handleSaveCallsign = () => {
    if (callsignError) return;
    updateUser({ callsign: callsign.trim() });
    setIsEditingCallsign(false);
  };

  // Cancel callsign editing
  const handleCancelCallsign = () => {
    setCallsign(user?.callsign || '');
    setCallsignError(null);
    setIsEditingCallsign(false);
  };

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

  // Remove skill (works for both predefined and custom)
  const removeSkill = (skill) => {
    setSelectedSkills(prev => prev.filter(s => s !== skill));
  };

  // Save skills
  const handleSaveSkills = () => {
    updateUser({ skills: selectedSkills });
    setIsEditingSkills(false);
  };

  // Cancel skills editing
  const handleCancelSkills = () => {
    setSelectedSkills(user?.skills || []);
    setCustomSkillInput('');
    setCustomSkillError(null);
    setIsEditingSkills(false);
  };

  // Auto-assign handler
  const handleAutoAssign = async () => {
    if (!onAutoAssign) return;
    
    setIsAutoAssigning(true);
    setAutoAssignError(null);
    setAutoAssignSuccess(null);
    
    try {
      const result = await onAutoAssign(true);
      if (result?.success) {
        setAutoAssignSuccess(`Joined ${result.teamName || 'an idea'}!`);
        // Navigate to team after a brief delay
        setTimeout(() => {
          if (result.teamId) {
            onNavigateToTeam(result.teamId);
          }
        }, 1500);
      } else {
        setAutoAssignError(result?.error || 'Failed to auto-assign');
      }
    } catch (err) {
      setAutoAssignError('An error occurred');
    } finally {
      setIsAutoAssigning(false);
    }
  };

  return (
    <AppLayout
      user={user}
      teams={teams}
      onNavigate={onNavigate}
      eventPhase={eventPhase}
      activeNav="profile"
      devRoleOverride={devRoleOverride}
      onDevRoleChange={onDevRoleChange}
      onPhaseChange={onPhaseChange}
      eventPhases={eventPhases}
      simulateLoading={simulateLoading}
      onSimulateLoadingChange={onSimulateLoadingChange}
    >
      <div className="p-4 sm:p-6">
        {/* Captain Alert Banner */}
        {isCaptain && pendingRequestCount > 0 && (
          <div className="bg-warning/10 border-2 border-warning/50 px-4 py-3 mb-6 rounded-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-warning">
                <Bell className="w-5 h-5 flex-shrink-0" />
                <span className="font-bold text-sm sm:text-base">
                  You have {pendingRequestCount} pending application{pendingRequestCount > 1 ? 's' : ''} to review
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToTeam(userTeam.id)}
                className="w-full sm:w-auto px-4 py-2 bg-warning text-white font-bold text-sm rounded hover:bg-warning/80 transition-colors flex items-center justify-center gap-2"
              >
                Review Applications
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <h1 className="text-xl sm:text-2xl font-black text-brand mb-6">YOUR PROFILE</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Unified Identity Card */}
          <div className="lg:col-span-1">
            <div
              className="bg-arena-card p-6 border-2 border-arena-border rounded-card"
            >
              {/* Name, Callsign, and Role - Stacked */}
              <div className="text-center mb-5">
                {/* Full Name */}
                <div className="text-lg sm:text-xl font-bold text-text-primary flex items-center justify-center gap-2">
                  <span>{user?.name || 'Unknown'}</span>
                  {isCaptain && <Crown className="w-5 h-5 text-yellow-500 flex-shrink-0" />}
                </div>
                
                {/* Callsign - shown below name if exists */}
                {displayCallsign && (
                  <div className="mt-1">
                    <span
                      className={`inline-block px-3 py-1 text-sm font-bold rounded-full border
                        border-arena-border text-text-secondary bg-arena-elevated`}
                    >
                      "{displayCallsign}"
                    </span>
                  </div>
                )}
                
                {/* Role */}
                <div className="mt-2">
                  <span className="text-xs font-medium text-arena-secondary uppercase tracking-wide">
                    {isCaptain ? 'Team Captain' : userTeam ? 'Team Member' : 'Free Agent'}
                  </span>
                </div>
              </div>

              {/* Avatar Section - Below Name */}
              <div className="flex flex-col items-center mb-5">
                <div
                  className="w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center overflow-hidden rounded-lg bg-arena-elevated border-2 border-arena-border"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || 'Avatar'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  {/* Fallback icon - shown when no avatar or image fails */}
                  <div 
                    className={cn(
                      'w-full h-full items-center justify-center',
                      user?.avatar ? 'hidden' : 'flex'
                    )}
                  >
                    <User
                      className="w-14 sm:w-16 h-14 sm:h-16 text-text-secondary"
                    />
                  </div>
                </div>
              </div>

              {/* Callsign Edit Section */}
              {isEditingCallsign ? (
                <div className="mb-5 space-y-2">
                  <input
                    type="text"
                    value={callsign}
                    onChange={(e) => handleCallsignChange(e.target.value)}
                    placeholder="Enter your callsign"
                    maxLength={20}
                    className={`w-full px-3 py-2 border-2 bg-arena-black text-text-primary placeholder-arena-muted 
                      focus:outline-none text-sm transition-colors rounded
                      ${callsignError 
                        ? 'border-error focus:border-error' 
                        : 'border-arena-border focus:border-text-secondary'}`}
                  />
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${callsignError ? 'text-error' : 'text-arena-muted'}`}>
                      {callsignError || 'Letters, numbers, spaces'}
                    </span>
                    <span className="text-xs text-arena-muted">
                      {callsign.length}/20
                    </span>
                  </div>
                  <div className="flex gap-2 justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleCancelCallsign}
                      className="px-3 py-1.5 text-sm font-medium text-arena-secondary bg-arena-elevated hover:bg-arena-border transition-colors rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveCallsign}
                      disabled={!!callsignError}
                      className="px-3 py-1.5 text-sm font-medium text-text-primary transition-colors disabled:opacity-50 rounded bg-arena-elevated border border-arena-border"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                /* Text Button CTAs */
                <div className="flex items-center justify-center gap-4 mb-5 text-sm">
                  <button
                    type="button"
                    onClick={() => setShowAvatarPicker(true)}
                    className="font-medium transition-colors hover:underline text-text-secondary"
                  >
                    {user?.avatar ? 'Change avatar' : 'Choose avatar'}
                  </button>
                  <span className="text-arena-border">|</span>
                  <button
                    type="button"
                    onClick={() => setIsEditingCallsign(true)}
                    className="font-medium transition-colors hover:underline text-text-secondary"
                  >
                    Edit callsign
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Bio, Skills, Team */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Bio Section */}
            <div
              className="bg-arena-card p-4 sm:p-6 border-2 border-arena-border rounded-card"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-bold uppercase tracking-wide text-arena-secondary">
                  What I'm Looking For in HackDay
                </div>
                {!isEditingBio && (
                  <button
                    type="button"
                    onClick={() => setIsEditingBio(true)}
                    className="text-xs font-medium px-3 py-1 rounded transition-colors bg-arena-elevated border border-arena-border text-text-secondary hover:text-text-primary"
                  >
                    Edit
                  </button>
                )}
              </div>

              {isEditingBio ? (
                <div className="space-y-3">
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell everyone what you're hoping to learn, build, or achieve during HackDay..."
                    className="w-full p-3 border-2 border-arena-border bg-arena-black text-text-primary placeholder-arena-muted
                               focus:border-brand focus:outline-none text-sm resize-none transition-colors"
                    rows={4}
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setBio(user?.bio || '');
                        setIsEditingBio(false);
                      }}
                      className="px-4 py-2 text-sm font-medium text-arena-secondary bg-arena-elevated hover:bg-arena-border transition-colors rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveBio}
                      className="px-4 py-2 text-sm font-medium text-text-primary transition-colors rounded bg-arena-elevated border border-arena-border"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-text-primary text-sm sm:text-base">
                  {user?.bio || (
                    <span className="text-arena-muted italic">
                      Click Edit to share what you're looking for in HackDay...
                    </span>
                  )}
                </p>
              )}
            </div>

            {/* Skills Section */}
            <div
              className="bg-arena-card p-4 sm:p-6 border-2 border-arena-border rounded-card"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wide text-arena-secondary">
                    Your Skills
                  </span>
                  <span className="text-xs text-arena-muted">
                    ({(isEditingSkills ? selectedSkills : user?.skills)?.length || 0}/{MAX_SKILLS})
                  </span>
                </div>
                {!isEditingSkills && (
                  <button
                    type="button"
                    onClick={() => setIsEditingSkills(true)}
                    className="text-xs font-medium px-3 py-1 rounded transition-colors bg-arena-elevated border border-arena-border text-text-secondary hover:text-text-primary"
                  >
                    Edit
                  </button>
                )}
              </div>

              {isEditingSkills ? (
                <div className="space-y-4">
                  {/* Selected Skills as Tags */}
                  {selectedSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-brand text-white rounded"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-1 hover:bg-brand/80 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Predefined Skills Grid */}
                  <div>
                    <p className="text-xs text-arena-secondary mb-2">
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
                              ? 'border-arena-border text-arena-muted cursor-not-allowed'
                              : 'border-arena-border text-arena-secondary hover:border-brand hover:text-brand'
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
                    <p className="text-xs text-arena-secondary mb-2">
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
                        className={`flex-1 px-3 py-2 border-2 bg-arena-black text-text-primary placeholder-arena-muted 
                          focus:outline-none text-sm transition-colors rounded
                          ${customSkillError 
                            ? 'border-human focus:border-human' 
                            : 'border-arena-border focus:border-brand'}
                          ${selectedSkills.length >= MAX_SKILLS ? 'opacity-50 cursor-not-allowed' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomSkill}
                        disabled={selectedSkills.length >= MAX_SKILLS || !customSkillInput.trim()}
                        className="px-4 py-2 text-sm font-medium text-text-primary transition-colors disabled:opacity-50 rounded bg-arena-elevated border border-arena-border"
                      >
                        Add
                      </button>
                    </div>
                    {customSkillError && (
                      <p className="text-xs text-human mt-1">{customSkillError}</p>
                    )}
                  </div>

                  <div className="flex gap-2 justify-end pt-2 border-t border-arena-border">
                    <button
                      type="button"
                      onClick={handleCancelSkills}
                      className="px-4 py-2 text-sm font-medium text-arena-secondary bg-arena-elevated hover:bg-arena-border transition-colors rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveSkills}
                      className="px-4 py-2 text-sm font-medium text-text-primary transition-colors rounded bg-arena-elevated border border-arena-border"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {user?.skills?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-2 text-xs sm:text-sm font-medium border border-arena-border text-text-secondary bg-arena-elevated rounded-lg"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-arena-muted italic text-sm">
                      No skills added yet
                    </p>
                  )}
                </>
              )}
            </div>

            {/* My Team Section */}
            {userTeam && (
              <div
                className="bg-arena-card p-4 sm:p-6 border-2 border-arena-border rounded-card"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-arena-secondary">
                    My Team
                  </div>
                  {isCaptain && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 border border-yellow-500 text-yellow-500 rounded-full">
                      <Crown className="w-3 h-3" />
                      <span className="text-xs font-bold">Captain</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div
                    className="w-12 sm:w-14 h-12 sm:h-14 flex-shrink-0 flex items-center justify-center rounded-lg bg-arena-elevated"
                  >
                    <Users className="w-6 sm:w-7 h-6 sm:h-7 text-text-secondary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-text-primary">
                      {userTeam.name}
                    </h3>
                    <span className="text-sm font-bold uppercase text-text-secondary">
                      TEAM
                    </span>
                    
                    <div className="flex items-center gap-2 mt-2 text-sm text-arena-secondary">
                      <Users className="w-4 h-4" />
                      <span>
                        {userTeam.members.length}/{userTeam.maxMembers} members
                      </span>
                    </div>

                    <p className="text-sm text-arena-secondary mt-2 line-clamp-2">{userTeam.description}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateToTeam(userTeam.id)}
                  className={`w-full mt-4 py-3 flex items-center justify-center gap-2
                             font-bold text-sm transition-all text-text-primary
                             bg-arena-elevated border border-arena-border hover:bg-arena-border rounded-lg`}
                >
                  {isCaptain ? 'Manage Team' : 'View Team Details'}
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Leave Team */}
                {!showLeaveConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowLeaveConfirm(true)}
                    className="w-full mt-2 py-2 text-sm text-arena-muted hover:text-human transition-colors"
                  >
                    Leave Team
                  </button>
                ) : (
                  <div className="mt-3 p-3 bg-human-10 border border-human/50 rounded-lg">
                    <p className="text-sm text-human mb-3">
                      {isCaptain && userTeam.members.length > 1
                        ? 'As captain, leaving will transfer leadership to another member.'
                        : isCaptain
                          ? 'You are the only member. Leaving will disband the team.'
                          : 'Are you sure you want to leave this team?'}
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowLeaveConfirm(false)}
                        className="flex-1 px-3 py-2 text-sm font-medium text-arena-secondary bg-arena-elevated border border-arena-border rounded hover:bg-arena-border transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onLeaveTeam(userTeam.id);
                          setShowLeaveConfirm(false);
                        }}
                        className="flex-1 px-3 py-2 text-sm font-medium text-text-primary bg-human rounded hover:bg-human/80 transition-colors"
                      >
                        Leave Team
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* No Team State */}
            {!userTeam && (
              <div className="bg-arena-card p-4 sm:p-6 border-2 border-arena-border rounded-lg">
                <div className="text-xs font-bold uppercase tracking-wide text-arena-secondary mb-4">
                  My Team
                </div>
                
                {/* Success Message */}
                {autoAssignSuccess && (
                  <div className="mb-4 p-3 bg-ai-10 border border-ai/50 rounded-lg">
                    <div className="flex items-center gap-2 text-ai">
                      <Check className="w-4 h-4" />
                      <span className="font-medium text-sm">{autoAssignSuccess}</span>
                    </div>
                  </div>
                )}
                
                {/* Error Message */}
                {autoAssignError && (
                  <div className="mb-4 p-3 bg-human-10 border border-human/50 rounded-lg">
                    <div className="flex items-center gap-2 text-human">
                      <X className="w-4 h-4" />
                      <span className="font-medium text-sm">{autoAssignError}</span>
                    </div>
                  </div>
                )}
                
                <div className="text-center py-4">
                  <Users className="w-12 h-12 mx-auto mb-3 text-arena-muted" />
                  <p className="text-arena-secondary mb-6">You're not on a team yet</p>
                  
                  {/* Auto-Assign Section */}
                  {onAutoAssign && (
                    <div className="mb-4">
                      <button
                        type="button"
                        onClick={handleAutoAssign}
                        disabled={isAutoAssigning}
                        className={`w-full py-3 font-bold text-sm transition-all flex items-center justify-center gap-2 rounded-lg
                          ${isAutoAssigning
                            ? 'bg-arena-elevated text-arena-muted cursor-wait'
                            : 'bg-arena-elevated border border-arena-border text-text-primary hover:bg-arena-border'
                          }`}
                      >
                        {isAutoAssigning ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Finding your team...
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4" />
                            Auto-Join a Team
                          </>
                        )}
                      </button>
                      <p className="text-xs text-arena-muted mt-2">
                        Instantly join an existing team or start a new one
                      </p>
                    </div>
                  )}
                  
                  <div className="relative">
                    {onAutoAssign && (
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1 h-px bg-arena-border" />
                        <span className="text-xs text-arena-muted uppercase">or</span>
                        <div className="flex-1 h-px bg-arena-border" />
                      </div>
                    )}
                    
                    <button
                      type="button"
                      onClick={() => onNavigate('marketplace')}
                      className="px-6 py-2 bg-brand text-white font-bold text-sm rounded
                                 hover:bg-brand/80 transition-colors"
                    >
                      Browse Ideas
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Activity History Section */}
            <div className="bg-arena-card p-4 sm:p-6 border-2 border-arena-border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-brand" />
                  <span className="text-xs font-bold uppercase tracking-wide text-arena-secondary">
                    Activity History
                  </span>
                </div>
              </div>
              
              {/* Activity Timeline */}
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-arena-border" />
                
                {/* Activity Items */}
                <div className="space-y-4">
                  {/* Registered Activity */}
                  <div className="relative flex gap-3 pl-1">
                    <div className="relative z-10 w-5 h-5 rounded-full bg-ai/20 border-2 border-ai flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-2.5 h-2.5 text-ai" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary">Registered for HackDay 2026</p>
                      <p className="text-xs text-arena-muted">
                        {user?.createdAt 
                          ? new Date(user.createdAt).toLocaleDateString('en-GB', { 
                              day: 'numeric', month: 'short', year: 'numeric' 
                            })
                          : 'Recently'}
                      </p>
                    </div>
                  </div>

                  {/* Team Joined Activity */}
                  {userTeam && (
                    <div className="relative flex gap-3 pl-1">
                      <div className="relative z-10 w-5 h-5 rounded-full bg-brand/20 border-2 border-brand flex items-center justify-center flex-shrink-0">
                        <UserPlus className="w-2.5 h-2.5 text-brand" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text-primary">
                          {isCaptain ? 'Created' : 'Joined'} <span className="font-medium">{userTeam.name}</span>
                        </p>
                        <p className="text-xs text-arena-muted">
                          {isCaptain ? 'Team Captain' : 'Team Member'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Profile Updated Activity */}
                  {(user?.callsign || (user?.skills && user.skills.length > 0)) && (
                    <div className="relative flex gap-3 pl-1">
                      <div className="relative z-10 w-5 h-5 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center flex-shrink-0">
                        <User className="w-2.5 h-2.5 text-purple-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text-primary">Updated profile</p>
                        <p className="text-xs text-arena-muted">
                          {user?.callsign && `Callsign: "${user.callsign}"`}
                          {user?.callsign && user?.skills?.length > 0 && ' · '}
                          {user?.skills?.length > 0 && `${user.skills.length} skill${user.skills.length > 1 ? 's' : ''}`}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Submission Activity (if team has submitted) */}
                  {userTeam?.submission && (
                    <div className="relative flex gap-3 pl-1">
                      <div className="relative z-10 w-5 h-5 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center flex-shrink-0">
                        <Send className="w-2.5 h-2.5 text-emerald-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text-primary">
                          Submitted <span className="font-medium">{userTeam.submission.projectName}</span>
                        </p>
                        <p className="text-xs text-arena-muted">Project submitted for judging</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Stats Summary */}
              <div className="mt-4 pt-4 border-t border-arena-border">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-text-primary">{userTeam ? 1 : 0}</p>
                    <p className="text-xs text-arena-muted">Teams</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-text-primary">{user?.skills?.length || 0}</p>
                    <p className="text-xs text-arena-muted">Skills</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-text-primary">{userTeam?.submission ? 1 : 0}</p>
                    <p className="text-xs text-arena-muted">Submissions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Picker Modal */}
      <AvatarPickerModal
        isOpen={showAvatarPicker}
        onClose={() => setShowAvatarPicker(false)}
        onSelect={(avatarSrc) => updateUser({ avatar: avatarSrc })}
        currentAvatar={user?.avatar}
      />
    </AppLayout>
  );
}

export default Profile;
