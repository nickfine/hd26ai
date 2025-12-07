import { useState } from 'react';
import {
  Cpu,
  Heart,
  Scale,
  Crown,
  Bell,
  ChevronRight,
  Users,
  User,
  Check,
  X,
  Plus,
  Zap,
} from 'lucide-react';
import { SKILLS } from '../data/mockData';
import { ALLEGIANCE_CONFIG, cn, getAllegianceConfig } from '../lib/design-system';
import AppLayout from './AppLayout';

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

function Profile({
  user,
  updateUser,
  teams,
  allegianceStyle,
  onNavigate,
  onNavigateToTeam,
  onLeaveTeam,
  onAutoAssign,
  eventPhase,
}) {
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

  const AllegianceIcon = {
    human: Heart,
    neutral: Scale,
    ai: Cpu,
  }[user?.allegiance || 'neutral'];

  const teamConfig = userTeam ? ALLEGIANCE_CONFIG[userTeam.side] : null;

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
        setAutoAssignSuccess(`Joined ${result.teamName || 'a team'}!`);
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
      allegianceStyle={allegianceStyle}
      onNavigate={onNavigate}
      eventPhase={eventPhase}
      activeNav="profile"
    >
      <div className="p-4 sm:p-6">
        {/* Captain Alert Banner */}
        {isCaptain && pendingRequestCount > 0 && (
          <div className="bg-amber-50 border-2 border-amber-300 px-4 py-3 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-amber-700">
                <Bell className="w-5 h-5 flex-shrink-0" />
                <span className="font-bold text-sm sm:text-base">
                  You have {pendingRequestCount} pending application{pendingRequestCount > 1 ? 's' : ''} to review
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToTeam(userTeam.id)}
                className="w-full sm:w-auto px-4 py-2 bg-amber-500 text-white font-bold text-sm rounded hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
              >
                Review Applications
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <h1 className="text-xl sm:text-2xl font-black text-gray-900 mb-6">YOUR PROFILE</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Unified Identity Card */}
          <div className="lg:col-span-1">
            <div
              className={`bg-white p-6 border-2 ${allegianceStyle.borderRadius}`}
              style={{ borderColor: allegianceStyle.borderColor }}
            >
              {/* Name with Live Callsign Preview - At Top */}
              <div className="text-center mb-5">
                <div className="text-lg sm:text-xl font-bold text-gray-900 flex items-center justify-center gap-2 flex-wrap">
                  {typeof formattedName === 'string' ? (
                    <span>{formattedName}</span>
                  ) : (
                    <>
                      <span>{formattedName.firstName}</span>
                      <span
                        className={`px-2 py-0.5 text-sm font-bold rounded-full border
                          ${user?.allegiance === 'ai' 
                            ? 'border-cyan-500 text-cyan-700 bg-cyan-50' 
                            : user?.allegiance === 'human' 
                              ? 'border-green-500 text-green-700 bg-green-50' 
                              : 'border-gray-400 text-gray-600 bg-gray-50'}`}
                      >
                        {formattedName.callsign}
                      </span>
                      <span>{formattedName.lastName}</span>
                    </>
                  )}
                  {isCaptain && <Crown className="w-5 h-5 text-yellow-500 flex-shrink-0" />}
                </div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {isCaptain ? 'Team Captain' : userTeam ? 'Team Member' : 'Free Agent'}
                </span>
              </div>

              {/* Avatar Section - Below Name */}
              <div className="flex flex-col items-center mb-5">
                <div
                  className={`w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center ${allegianceStyle.borderRadius}`}
                  style={{
                    backgroundColor: allegianceStyle.bgColor,
                    border: `3px solid ${allegianceStyle.borderColor}`,
                  }}
                >
                  <User
                    className="w-14 sm:w-16 h-14 sm:h-16"
                    style={{ color: allegianceStyle.color }}
                  />
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
                    className={`w-full px-3 py-2 border-2 focus:outline-none text-sm transition-colors
                      ${callsignError 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-200 focus:border-gray-900'}`}
                  />
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${callsignError ? 'text-red-500' : 'text-gray-400'}`}>
                      {callsignError || 'Letters, numbers, spaces'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {callsign.length}/20
                    </span>
                  </div>
                  <div className="flex gap-2 justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleCancelCallsign}
                      className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveCallsign}
                      disabled={!!callsignError}
                      className="px-3 py-1.5 text-sm font-medium text-white transition-colors disabled:opacity-50 rounded"
                      style={{ backgroundColor: allegianceStyle.color }}
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
                    className="font-medium transition-colors hover:underline"
                    style={{ color: allegianceStyle.color }}
                  >
                    Choose avatar
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    type="button"
                    onClick={() => setIsEditingCallsign(true)}
                    className="font-medium transition-colors hover:underline"
                    style={{ color: allegianceStyle.color }}
                  >
                    Edit callsign
                  </button>
                </div>
              )}
            </div>

            {/* Allegiance Card */}
            <div
              className={`bg-white p-6 border-2 mt-4 ${allegianceStyle.borderRadius}`}
              style={{ borderColor: allegianceStyle.borderColor }}
            >
              <div className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-4">
                Your Allegiance
              </div>

              {userTeam ? (
                /* Team members inherit allegiance from team */
                <div className="text-center">
                  <div className="flex justify-center gap-3 mb-3">
                    <div
                      className={`flex-1 max-w-[120px] p-3 border-2 text-center
                        ${user?.allegiance === 'human'
                          ? 'border-green-500 bg-green-50 rounded-xl'
                          : user?.allegiance === 'ai'
                            ? 'border-cyan-500 bg-cyan-50 border-dashed'
                            : 'border-gray-200 rounded-lg'}`}
                    >
                      {user?.allegiance === 'human' ? (
                        <Heart className="w-6 h-6 mx-auto mb-1 text-green-600" />
                      ) : user?.allegiance === 'ai' ? (
                        <Cpu className="w-6 h-6 mx-auto mb-1 text-cyan-600" />
                      ) : (
                        <Scale className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                      )}
                      <div
                        className={`text-xs font-bold
                          ${user?.allegiance === 'human'
                            ? 'text-green-600'
                            : user?.allegiance === 'ai'
                              ? 'text-cyan-600 font-mono'
                              : 'text-gray-400'}`}
                      >
                        {user?.allegiance === 'human' ? 'Human' : user?.allegiance === 'ai' ? 'AI' : 'Neutral'}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 italic">
                    Inherited from your team
                  </p>
                </div>
              ) : (
                /* Free agents can change allegiance */
                <div>
                  <div className="flex gap-3 mb-3">
                    <button
                      type="button"
                      onClick={() => updateUser({ allegiance: 'human' })}
                      className={`flex-1 p-3 border-2 rounded-xl text-center transition-all hover:scale-105
                        ${user?.allegiance === 'human'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'}`}
                    >
                      <Heart className={`w-6 h-6 mx-auto mb-1 ${user?.allegiance === 'human' ? 'text-green-600' : 'text-gray-300'}`} />
                      <div className={`text-xs font-bold ${user?.allegiance === 'human' ? 'text-green-600' : 'text-gray-400'}`}>
                        Human
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateUser({ allegiance: 'ai' })}
                      className={`flex-1 p-3 border-2 text-center transition-all hover:scale-105
                        ${user?.allegiance === 'ai'
                          ? 'border-cyan-500 bg-cyan-50 border-dashed'
                          : 'border-gray-200 hover:border-cyan-300'}`}
                    >
                      <Cpu className={`w-6 h-6 mx-auto mb-1 ${user?.allegiance === 'ai' ? 'text-cyan-600' : 'text-gray-300'}`} />
                      <div className={`text-xs font-bold font-mono ${user?.allegiance === 'ai' ? 'text-cyan-600' : 'text-gray-400'}`}>
                        AI
                      </div>
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 text-center">
                    Choose your side before joining a team
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Bio, Skills, Team */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Bio Section */}
            <div
              className={`bg-white p-4 sm:p-6 border-2 ${allegianceStyle.borderRadius}`}
              style={{ borderColor: allegianceStyle.borderColor }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-bold uppercase tracking-wide text-gray-500">
                  What I'm Looking For in HackDay
                </div>
                {!isEditingBio && (
                  <button
                    type="button"
                    onClick={() => setIsEditingBio(true)}
                    className="text-xs font-medium px-3 py-1 rounded transition-colors"
                    style={{
                      color: allegianceStyle.color,
                      backgroundColor: allegianceStyle.bgColor,
                      border: `1px solid ${allegianceStyle.borderColor}`,
                    }}
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
                    className="w-full p-3 border-2 border-gray-200 focus:border-gray-900 focus:outline-none
                               text-sm resize-none transition-colors"
                    rows={4}
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setBio(user?.bio || '');
                        setIsEditingBio(false);
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveBio}
                      className="px-4 py-2 text-sm font-medium text-white transition-colors"
                      style={{ backgroundColor: allegianceStyle.color }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 text-sm sm:text-base">
                  {user?.bio || (
                    <span className="text-gray-400 italic">
                      Click Edit to share what you're looking for in HackDay...
                    </span>
                  )}
                </p>
              )}
            </div>

            {/* Skills Section */}
            <div
              className={`bg-white p-4 sm:p-6 border-2 ${allegianceStyle.borderRadius}`}
              style={{ borderColor: allegianceStyle.borderColor }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
                    Your Skills
                  </span>
                  <span className="text-xs text-gray-400">
                    ({(isEditingSkills ? selectedSkills : user?.skills)?.length || 0}/{MAX_SKILLS})
                  </span>
                </div>
                {!isEditingSkills && (
                  <button
                    type="button"
                    onClick={() => setIsEditingSkills(true)}
                    className="text-xs font-medium px-3 py-1 rounded transition-colors"
                    style={{
                      color: allegianceStyle.color,
                      backgroundColor: allegianceStyle.bgColor,
                      border: `1px solid ${allegianceStyle.borderColor}`,
                    }}
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

                  {/* Predefined Skills Grid */}
                  <div>
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
                        className="px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50 rounded"
                        style={{ backgroundColor: allegianceStyle.color }}
                      >
                        Add
                      </button>
                    </div>
                    {customSkillError && (
                      <p className="text-xs text-red-500 mt-1">{customSkillError}</p>
                    )}
                  </div>

                  <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={handleCancelSkills}
                      className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveSkills}
                      className="px-4 py-2 text-sm font-medium text-white transition-colors rounded"
                      style={{ backgroundColor: allegianceStyle.color }}
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
                          className={`px-3 py-2 text-xs sm:text-sm font-medium border ${allegianceStyle.borderRadius}`}
                          style={{
                            borderColor: allegianceStyle.borderColor,
                            color: allegianceStyle.color,
                            backgroundColor: allegianceStyle.bgColor,
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 italic text-sm">
                      No skills added yet
                    </p>
                  )}
                </>
              )}
            </div>

            {/* My Team Section */}
            {userTeam && (
              <div
                className={`bg-white p-4 sm:p-6 border-2 ${teamConfig.borderRadius}
                           ${userTeam.side === 'ai' ? 'border-dashed' : ''}`}
                style={{ borderColor: teamConfig.borderColor }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-gray-500">
                    My Team
                  </div>
                  {isCaptain && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                      <Crown className="w-3 h-3" />
                      <span className="text-xs font-bold">Captain</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div
                    className={`w-12 sm:w-14 h-12 sm:h-14 flex-shrink-0 flex items-center justify-center ${teamConfig.borderRadius}`}
                    style={{ backgroundColor: teamConfig.bgColor }}
                  >
                    {userTeam.side === 'ai' ? (
                      <Cpu className="w-6 sm:w-7 h-6 sm:h-7" style={{ color: teamConfig.color }} />
                    ) : (
                      <Heart className="w-6 sm:w-7 h-6 sm:h-7" style={{ color: teamConfig.color }} />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-base sm:text-lg font-bold text-gray-900 ${
                        userTeam.side === 'ai' ? 'font-mono' : ''
                      }`}
                    >
                      {userTeam.name}
                    </h3>
                    <span
                      className="text-sm font-bold uppercase"
                      style={{ color: teamConfig.color }}
                    >
                      {userTeam.side === 'ai' ? 'AI SIDE' : 'HUMAN SIDE'}
                    </span>
                    
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>
                        {userTeam.members.length}/{userTeam.maxMembers} members
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{userTeam.description}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateToTeam(userTeam.id)}
                  className={`w-full mt-4 py-3 flex items-center justify-center gap-2
                             font-bold text-sm transition-all text-white
                             ${teamConfig.borderRadius}`}
                  style={{ backgroundColor: teamConfig.color }}
                >
                  {isCaptain ? 'Manage Team' : 'View Team Details'}
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Leave Team */}
                {!showLeaveConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowLeaveConfirm(true)}
                    className="w-full mt-2 py-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
                  >
                    Leave Team
                  </button>
                ) : (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700 mb-3">
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
                        className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onLeaveTeam(userTeam.id);
                          setShowLeaveConfirm(false);
                        }}
                        className="flex-1 px-3 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
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
              <div className="bg-white p-4 sm:p-6 border-2 border-gray-200 rounded-lg">
                <div className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-4">
                  My Team
                </div>
                
                {/* Success Message */}
                {autoAssignSuccess && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <Check className="w-4 h-4" />
                      <span className="font-medium text-sm">{autoAssignSuccess}</span>
                    </div>
                  </div>
                )}
                
                {/* Error Message */}
                {autoAssignError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-700">
                      <X className="w-4 h-4" />
                      <span className="font-medium text-sm">{autoAssignError}</span>
                    </div>
                  </div>
                )}
                
                <div className="text-center py-4">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500 mb-6">You're not on a team yet</p>
                  
                  {/* Auto-Assign Section */}
                  {user?.allegiance !== 'neutral' && onAutoAssign && (
                    <div className="mb-4">
                      <button
                        type="button"
                        onClick={handleAutoAssign}
                        disabled={isAutoAssigning}
                        className={`w-full py-3 font-bold text-sm transition-all flex items-center justify-center gap-2 rounded-lg
                          ${isAutoAssigning
                            ? 'bg-gray-200 text-gray-500 cursor-wait'
                            : user?.allegiance === 'ai'
                              ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                              : 'bg-green-600 text-white hover:bg-green-700'
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
                            Auto-Join a {user?.allegiance === 'ai' ? 'AI' : 'Human'} Team
                          </>
                        )}
                      </button>
                      <p className="text-xs text-gray-400 mt-2">
                        Instantly join an existing team or start a new one
                      </p>
                    </div>
                  )}
                  
                  {/* Neutral user needs to pick a side first */}
                  {user?.allegiance === 'neutral' && onAutoAssign && (
                    <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <Zap className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-sm">Auto-Join Available</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Choose Human or AI side above to enable quick team assignment
                      </p>
                    </div>
                  )}
                  
                  <div className="relative">
                    {user?.allegiance !== 'neutral' && onAutoAssign && (
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-400 uppercase">or</span>
                        <div className="flex-1 h-px bg-gray-200" />
                      </div>
                    )}
                    
                    <button
                      type="button"
                      onClick={() => onNavigate('marketplace')}
                      className="px-6 py-2 bg-gray-900 text-white font-bold text-sm
                                 hover:bg-gray-800 transition-colors"
                    >
                      Browse Teams
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default Profile;
