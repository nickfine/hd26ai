import { useState } from 'react';
import adaptLogo from '../../adaptlogo.png';
import {
  ArrowLeft,
  Cpu,
  Heart,
  Scale,
  Crown,
  Bell,
  ChevronRight,
  Users,
  Camera,
  User,
} from 'lucide-react';
import { ALLEGIANCE_CONFIG } from '../data/mockData';

function Profile({
  user,
  updateUser,
  teams,
  allegianceStyle,
  onNavigate,
  onNavigateToTeam,
}) {
  const [bio, setBio] = useState(user?.bio || '');
  const [isEditingBio, setIsEditingBio] = useState(false);

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

  // Save bio
  const handleSaveBio = () => {
    updateUser({ bio });
    setIsEditingBio(false);
  };

  return (
    <div
      className={`min-h-screen bg-gray-50 ${allegianceStyle.font} transition-all duration-300`}
    >
      {/* Header */}
      <header
        className="border-b-2 px-4 sm:px-6 py-4 bg-white transition-all duration-300"
        style={{ borderColor: allegianceStyle.borderColor }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm hidden sm:inline">Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-2">
            <img src={adaptLogo} alt="Adaptavist" className="h-6 w-auto" />
            <span className="font-bold text-sm tracking-tight">HACKDAY 2026</span>
          </div>
        </div>
      </header>

      {/* Captain Alert Banner */}
      {isCaptain && pendingRequestCount > 0 && (
        <div className="bg-amber-50 border-b-2 border-amber-300 px-4 sm:px-6 py-3">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 mb-6">YOUR PROFILE</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Avatar & Basic Info */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Avatar Card */}
            <div
              className={`bg-white p-4 sm:p-6 border-2 ${allegianceStyle.borderRadius}`}
              style={{ borderColor: allegianceStyle.borderColor }}
            >
              <div className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-4">
                Avatar
              </div>
              
              {/* Avatar Placeholder */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-24 sm:w-32 h-24 sm:h-32 flex items-center justify-center mb-4 ${allegianceStyle.borderRadius}`}
                  style={{
                    backgroundColor: allegianceStyle.bgColor,
                    border: `3px solid ${allegianceStyle.borderColor}`,
                  }}
                >
                  <User
                    className="w-12 sm:w-16 h-12 sm:h-16"
                    style={{ color: allegianceStyle.color }}
                  />
                </div>
                
                <button
                  type="button"
                  className={`w-full py-2 flex items-center justify-center gap-2
                             font-bold text-sm transition-all border-2
                             ${allegianceStyle.borderRadius}`}
                  style={{
                    borderColor: allegianceStyle.borderColor,
                    color: allegianceStyle.color,
                    backgroundColor: allegianceStyle.bgColor,
                  }}
                >
                  <Camera className="w-4 h-4" />
                  Choose Avatar
                </button>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Avatar selection coming soon
                </p>
              </div>
            </div>

            {/* Name & Allegiance */}
            <div
              className={`bg-white p-4 sm:p-6 border-2 ${allegianceStyle.borderRadius}`}
              style={{ borderColor: allegianceStyle.borderColor }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 flex-shrink-0 flex items-center justify-center ${allegianceStyle.borderRadius}`}
                  style={{
                    backgroundColor: allegianceStyle.bgColor,
                    border: `2px solid ${allegianceStyle.borderColor}`,
                  }}
                >
                  <AllegianceIcon
                    className="w-5 h-5"
                    style={{ color: allegianceStyle.color }}
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2 flex-wrap">
                    <span className="truncate">{user?.name}</span>
                    {isCaptain && <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0" />}
                  </div>
                  <div
                    className="text-sm font-bold uppercase"
                    style={{ color: allegianceStyle.color }}
                  >
                    {ALLEGIANCE_CONFIG[user?.allegiance || 'neutral'].label} Side
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-gray-500">
                {isCaptain ? 'Team Captain' : userTeam ? 'Team Member' : 'Free Agent'}
              </div>
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
              <div className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-4">
                Your Skills
              </div>
              
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
              </div>
            )}

            {/* No Team State */}
            {!userTeam && (
              <div className="bg-white p-4 sm:p-6 border-2 border-gray-200 rounded-lg">
                <div className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-4">
                  My Team
                </div>
                <div className="text-center py-6">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500 mb-4">You're not on a team yet</p>
                  <button
                    type="button"
                    onClick={() => onNavigate('dashboard')}
                    className="px-6 py-2 bg-gray-900 text-white font-bold text-sm
                               hover:bg-gray-800 transition-colors"
                  >
                    Browse Teams
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-4 sm:px-6 py-4 bg-white mt-8">
        <div className="max-w-4xl mx-auto text-center text-xs text-gray-400">
          WIREFRAME PROTOTYPE — Allegiance:{' '}
          <span style={{ color: allegianceStyle.color }}>
            {ALLEGIANCE_CONFIG[user?.allegiance || 'neutral'].label.toUpperCase()}
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Profile;
