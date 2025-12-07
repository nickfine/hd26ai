import { useState } from 'react';
import { ArrowLeft, Cpu, Heart, Users, Zap, ChevronRight, User, Crown, X, Clock, Check, XCircle } from 'lucide-react';
import { ALLEGIANCE_CONFIG } from '../data/mockData';

function TeamDetail({ team, user, allegianceStyle, onNavigate, onUpdateTeam, onJoinRequest, onRequestResponse }) {
  const [moreInfoText, setMoreInfoText] = useState(team.moreInfo || '');
  const [isEditingMoreInfo, setIsEditingMoreInfo] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  
  // Check if current user is the captain (for demo, we'll check by matching user id or name)
  const isCaptain = user?.id === team.captainId;
  
  // Check if user is already a member
  const isMember = team.members.some((m) => m.name === user?.name);
  
  // Check if user has a pending request
  const hasPendingRequest = team.joinRequests?.some((r) => r.userName === user?.name);
  
  // Determine if team is full
  const isTeamFull = team.members.length >= team.maxMembers;

  // Handle request submission
  const handleSubmitRequest = () => {
    if (!user) return;
    
    const request = {
      id: Date.now(),
      userId: user.id || Date.now(),
      userName: user.name,
      userSkills: user.skills || [],
      message: requestMessage,
      timestamp: new Date().toISOString(),
    };
    
    onJoinRequest(team.id, request);
    setShowRequestModal(false);
    setRequestMessage('');
    
    // Navigate back to marketplace after a short delay
    setTimeout(() => {
      onNavigate('dashboard');
    }, 800);
  };
  const teamConfig = ALLEGIANCE_CONFIG[team.side];
  const TeamIcon = team.side === 'ai' ? Cpu : Heart;

  // Compute common interests from member skills
  const allSkills = team.members.flatMap((member) => member.skills);
  const skillCounts = allSkills.reduce((acc, skill) => {
    acc[skill] = (acc[skill] || 0) + 1;
    return acc;
  }, {});
  const commonInterests = Object.entries(skillCounts)
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .map(([skill]) => skill);

  return (
    <div
      className={`min-h-screen bg-gray-50 ${allegianceStyle.font} transition-all duration-300`}
    >
      {/* Header */}
      <header
        className="border-b-2 px-6 py-4 bg-white transition-all duration-300"
        style={{ borderColor: allegianceStyle.borderColor }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Marketplace</span>
          </button>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-gray-900" />
            <span className="font-bold text-sm tracking-tight">HACKDAY 2026</span>
          </div>
        </div>
      </header>

      {/* Pending Request Banner - Top of Page */}
      {hasPendingRequest && (
        <div className="bg-amber-50 border-b-2 border-amber-300 px-6 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 text-amber-700">
            <Clock className="w-5 h-5" />
            <span className="font-bold">Your request to join this team is pending</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Team Header Card */}
        <div
          className={`bg-white p-6 mb-6 transition-all duration-300
                     border-2 ${teamConfig.borderRadius}
                     ${team.side === 'ai' ? 'border-dashed' : ''}`}
          style={{ borderColor: teamConfig.borderColor }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 flex items-center justify-center ${teamConfig.borderRadius}`}
                style={{ backgroundColor: teamConfig.bgColor }}
              >
                <TeamIcon
                  className="w-8 h-8"
                  style={{ color: teamConfig.color }}
                />
              </div>
              <div>
                <h1
                  className={`text-2xl font-black text-gray-900 ${
                    team.side === 'ai' ? 'font-mono' : ''
                  }`}
                >
                  {team.name}
                </h1>
                <span
                  className="text-sm font-bold uppercase"
                  style={{ color: teamConfig.color }}
                >
                  {team.side === 'ai' ? 'AI SIDE' : 'HUMAN SIDE'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Users className="w-5 h-5" />
              <span className="text-lg font-bold">
                {team.members.length}/{team.maxMembers}
              </span>
            </div>
          </div>
        </div>

        {/* Project Goal */}
        <div className="bg-white p-6 mb-6 border border-gray-200">
          <h2 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">
            Project Goal
          </h2>
          <p className="text-lg text-gray-700">{team.description}</p>
        </div>

        {/* More Info */}
        <div className="bg-white p-6 mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wide text-gray-500">
              More Info
            </h2>
            {isCaptain && !isEditingMoreInfo && (
              <button
                type="button"
                onClick={() => setIsEditingMoreInfo(true)}
                className="text-xs font-medium px-3 py-1 rounded transition-colors"
                style={{
                  color: teamConfig.color,
                  backgroundColor: teamConfig.bgColor,
                  border: `1px solid ${teamConfig.borderColor}`,
                }}
              >
                Edit
              </button>
            )}
          </div>
          {isEditingMoreInfo ? (
            <div className="space-y-3">
              <textarea
                value={moreInfoText}
                onChange={(e) => setMoreInfoText(e.target.value)}
                placeholder="Add additional information about your project..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 transition-all"
                style={{ focusRingColor: teamConfig.color }}
                rows={4}
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setMoreInfoText(team.moreInfo || '');
                    setIsEditingMoreInfo(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateTeam(team.id, { moreInfo: moreInfoText });
                    setIsEditingMoreInfo(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
                  style={{ backgroundColor: teamConfig.color }}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700">
              {team.moreInfo || (
                <span className="text-gray-400 italic">
                  {isCaptain ? 'Click Edit to add more information about your project.' : 'No additional information provided.'}
                </span>
              )}
            </p>
          )}
        </div>

        {/* Team Members */}
        <div className="bg-white p-6 mb-6 border border-gray-200">
          <h2 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-4">
            Team Members ({team.members.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {team.members.map((member) => (
              <div
                key={member.id}
                className={`p-4 border-2 ${teamConfig.borderRadius} transition-all`}
                style={{
                  borderColor: teamConfig.borderColor,
                  backgroundColor: teamConfig.bgColor,
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center relative"
                    style={{ backgroundColor: teamConfig.color }}
                  >
                    <User className="w-5 h-5 text-white" />
                    {member.id === team.captainId && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-sm">
                        <Crown className="w-3 h-3 text-yellow-800" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold text-gray-900 ${
                          team.side === 'ai' ? 'font-mono' : ''
                        }`}
                      >
                        {member.name}
                      </span>
                      {member.id === team.captainId && (
                        <span className="text-xs text-yellow-600 font-semibold uppercase">Captain</span>
                      )}
                    </div>
                    {member.callsign && (
                      <span className="text-sm text-gray-500 italic">
                        "{member.callsign}"
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 text-xs bg-white border border-gray-200 text-gray-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Common Interests */}
        {commonInterests.length > 0 && (
          <div className="bg-white p-6 mb-6 border border-gray-200">
            <h2 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">
              Common Interests
            </h2>
            <div className="flex flex-wrap gap-2">
              {commonInterests.map((skill) => (
                <span
                  key={skill}
                  className={`px-3 py-2 text-sm font-medium ${teamConfig.borderRadius}`}
                  style={{
                    backgroundColor: teamConfig.bgColor,
                    color: teamConfig.color,
                    border: `1px solid ${teamConfig.borderColor}`,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Looking For */}
        <div className="bg-white p-6 mb-6 border border-gray-200">
          <h2 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">
            Looking For
          </h2>
          <div className="flex flex-wrap gap-2">
            {team.lookingFor.map((skill) => (
              <span
                key={skill}
                className={`px-3 py-2 text-sm border ${teamConfig.borderRadius}`}
                style={{
                  borderColor: teamConfig.borderColor,
                  color: teamConfig.color,
                  backgroundColor: teamConfig.bgColor,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Pending Requests - Captain Only */}
        {isCaptain && team.joinRequests?.length > 0 && (
          <div
            className={`bg-white p-6 mb-6 border-2 ${teamConfig.borderRadius}`}
            style={{ borderColor: teamConfig.borderColor }}
          >
            <h2 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-4">
              Pending Requests ({team.joinRequests.length})
            </h2>
            <div className="space-y-4">
              {team.joinRequests.map((request) => (
                <div
                  key={request.id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: teamConfig.color }}
                      >
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="font-bold text-gray-900">{request.userName}</span>
                        <p className="text-xs text-gray-500">
                          {new Date(request.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Requester's Skills */}
                  {request.userSkills?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {request.userSkills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 text-xs bg-white border border-gray-200 text-gray-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Message */}
                  {request.message && (
                    <p className="text-sm text-gray-600 mb-4 p-3 bg-white rounded border border-gray-100 italic">
                      "{request.message}"
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onRequestResponse(team.id, request.id, true)}
                      className="flex-1 py-2 px-4 flex items-center justify-center gap-2 text-sm font-bold text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => onRequestResponse(team.id, request.id, false)}
                      className="flex-1 py-2 px-4 flex items-center justify-center gap-2 text-sm font-bold text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Request to Join Button */}
        {isMember ? (
          <div
            className={`w-full py-4 text-center font-bold text-lg
                       ${teamConfig.borderRadius}`}
            style={{
              backgroundColor: teamConfig.bgColor,
              color: teamConfig.color,
              border: `2px solid ${teamConfig.borderColor}`,
            }}
          >
            YOU'RE ON THIS TEAM
          </div>
        ) : hasPendingRequest ? null : isTeamFull ? (
          <div
            className={`w-full py-4 text-center font-bold text-lg
                       ${teamConfig.borderRadius} bg-gray-100 text-gray-400`}
          >
            TEAM IS FULL
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowRequestModal(true)}
            className={`w-full py-4 flex items-center justify-center gap-2
                       font-bold text-lg transition-all hover:opacity-90
                       ${teamConfig.borderRadius}`}
            style={{
              backgroundColor: teamConfig.color,
              color: 'white',
            }}
          >
            REQUEST TO JOIN
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-6 py-4 bg-white">
        <div className="max-w-4xl mx-auto text-center text-xs text-gray-400">
          WIREFRAME PROTOTYPE — Allegiance:{' '}
          <span style={{ color: allegianceStyle.color }}>
            {ALLEGIANCE_CONFIG[user?.allegiance || 'neutral'].label.toUpperCase()}
          </span>
        </div>
      </footer>

      {/* Request to Join Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`bg-white w-full max-w-md p-6 ${teamConfig.borderRadius} border-2`}
            style={{ borderColor: teamConfig.borderColor }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Request to Join</h3>
              <button
                type="button"
                onClick={() => {
                  setShowRequestModal(false);
                  setRequestMessage('');
                }}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Send a message to <span className="font-semibold">{team.name}</span> captain:
              </p>
              <textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Tell the team why you'd like to join and what you can contribute..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 transition-all"
                style={{ '--tw-ring-color': teamConfig.color }}
                rows={4}
              />
            </div>

            <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: teamConfig.bgColor }}>
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                Your Skills
              </p>
              <div className="flex flex-wrap gap-1">
                {user?.skills?.length > 0 ? (
                  user.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 text-xs bg-white border border-gray-200 text-gray-600"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400 italic">No skills added</span>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowRequestModal(false);
                  setRequestMessage('');
                }}
                className="flex-1 py-3 text-sm font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitRequest}
                className="flex-1 py-3 text-sm font-bold text-white rounded-lg transition-colors hover:opacity-90"
                style={{ backgroundColor: teamConfig.color }}
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamDetail;

