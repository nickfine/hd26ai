import { useState } from 'react';
import { Users, ChevronRight, User, Crown, X, Clock, Check, XCircle, Send, Circle, CheckCircle2, Edit3, ArrowRightLeft, Mail, RefreshCw } from 'lucide-react';
import { cn } from '../lib/design-system';
import AppLayout from './AppLayout';
import { useSentTeamInvites, useTeamInviteMutations } from '../hooks/useSupabase';

function TeamDetail({ team, user, teams, onNavigate, onUpdateTeam, onJoinRequest, onRequestResponse, eventPhase }) {
  const [moreInfoText, setMoreInfoText] = useState(team.moreInfo || '');
  const [isEditingMoreInfo, setIsEditingMoreInfo] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [memberToTransfer, setMemberToTransfer] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [teamNameInput, setTeamNameInput] = useState(team.name || '');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionInput, setDescriptionInput] = useState(team.description || '');
  const [isEditingProblem, setIsEditingProblem] = useState(false);
  const [problemInput, setProblemInput] = useState(team.problem || '');
  
  // Check if current user is the captain (for demo, we'll check by matching user id or name)
  const isCaptain = user?.id === team.captainId;
  
  // Fetch sent invites (for captains)
  const { invites: sentInvites, loading: sentInvitesLoading, refetch: refetchSentInvites } = useSentTeamInvites(isCaptain ? team.id : null);
  const { resendInvite, loading: resendLoading } = useTeamInviteMutations();
  
  // Calculate invite analytics
  const inviteStats = {
    total: sentInvites.length,
    pending: sentInvites.filter(i => i.status === 'PENDING' && !i.isExpired).length,
    accepted: sentInvites.filter(i => i.status === 'ACCEPTED').length,
    declined: sentInvites.filter(i => i.status === 'DECLINED').length,
    expired: sentInvites.filter(i => i.status === 'EXPIRED' || i.isExpired).length,
    acceptanceRate: sentInvites.filter(i => i.status === 'ACCEPTED').length / Math.max(1, sentInvites.filter(i => i.status !== 'PENDING' && !i.isExpired).length) * 100,
  };
  
  const handleResendInvite = async (inviteId) => {
    const result = await resendInvite(inviteId);
    if (!result.error) {
      refetchSentInvites();
    }
  };
  
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

  // Handle captain transfer
  const handleTransferCaptain = () => {
    if (!memberToTransfer || !isCaptain) return;
    
    onUpdateTeam(team.id, { captainId: memberToTransfer.id });
    setShowTransferModal(false);
    setMemberToTransfer(null);
  };

  // Open transfer modal
  const openTransferModal = (member) => {
    setMemberToTransfer(member);
    setShowTransferModal(true);
  };

  // Handle team name save
  const handleSaveTeamName = () => {
    const trimmedName = teamNameInput.trim();
    if (trimmedName.length >= 3 && trimmedName !== team.name) {
      onUpdateTeam(team.id, { name: trimmedName });
    }
    setIsEditingName(false);
  };

  // Handle team name cancel
  const handleCancelTeamName = () => {
    setTeamNameInput(team.name || '');
    setIsEditingName(false);
  };

  // Handle description save
  const handleSaveDescription = () => {
    const trimmedDesc = descriptionInput.trim();
    if (trimmedDesc.length >= 10 && trimmedDesc !== team.description) {
      onUpdateTeam(team.id, { description: trimmedDesc });
    }
    setIsEditingDescription(false);
  };

  // Handle description cancel
  const handleCancelDescription = () => {
    setDescriptionInput(team.description || '');
    setIsEditingDescription(false);
  };

  // Handle problem cancel
  const handleCancelProblem = () => {
    setProblemInput(team.problem || '');
    setIsEditingProblem(false);
  };

  // Handle problem save
  const handleSaveProblem = () => {
    const trimmedProblem = problemInput.trim();
    if (trimmedProblem.length >= 10 && trimmedProblem !== team.problem) {
      onUpdateTeam(team.id, { problem: trimmedProblem });
    }
    setIsEditingProblem(false);
  };

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
    <AppLayout
      user={user}
      teams={teams}
      onNavigate={onNavigate}
      eventPhase={eventPhase}
      activeNav="teams"
    >
      <div className="p-4 sm:p-6">
        {/* Pending Request Banner */}
        {hasPendingRequest && (
          <div className="bg-warning/10 border-2 border-warning/50 px-4 py-3 mb-6 rounded-card"
               style={{ boxShadow: '0 0 20px rgba(255, 138, 0, 0.15)' }}>
            <div className="flex items-center justify-center gap-2 text-warning">
              <Clock className="w-5 h-5 flex-shrink-0 animate-pulse" />
              <span className="font-bold text-sm sm:text-base text-center">Your request to join this team is pending</span>
            </div>
          </div>
        )}
        {/* Team Header Card */}
        <div className="bg-arena-card border border-arena-border p-4 sm:p-6 mb-4 sm:mb-6 rounded-card">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
              <div className="w-12 sm:w-16 h-12 sm:h-16 flex-shrink-0 flex items-center justify-center rounded-lg bg-arena-elevated">
                <Users className="w-6 sm:w-8 h-6 sm:h-8 text-text-secondary" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-white">
                    {team.name}
                  </h1>
                  {isCaptain && !isEditingName && (
                    <button
                      type="button"
                      onClick={() => {
                        setTeamNameInput(team.name);
                        setIsEditingName(true);
                      }}
                      className="text-xs font-medium px-3 py-1 rounded transition-colors bg-arena-elevated border border-arena-border text-text-secondary hover:text-white"
                    >
                      Edit Idea
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm mt-1">
                  <span className="text-text-secondary">
                    {team.members.length} / {team.maxMembers} members
                  </span>
                </div>
              </div>
            </div>
            {isMember && (
              <span className="inline-flex items-center text-white font-bold 
                           px-5 py-2 rounded-full text-sm uppercase tracking-wider 
                           border border-arena-border bg-arena-elevated flex-shrink-0">
                You're on this team
              </span>
            )}
          </div>
        </div>

        {/* Pending Requests - Captain Only */}
        {isCaptain && team.joinRequests?.length > 0 && (
          <div className="bg-arena-card border border-arena-border p-4 sm:p-6 mb-4 sm:mb-6 rounded-card">
            <h2 className="text-xs font-bold uppercase tracking-wide text-text-secondary mb-4">
              Pending Requests ({team.joinRequests.length})
            </h2>
            <div className="space-y-4">
              {team.joinRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-arena-card border border-arena-border p-3 sm:p-4 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-arena-elevated">
                        <User className="w-5 h-5 text-text-secondary" />
                      </div>
                      <div>
                        <span className="font-bold text-white">{request.userName}</span>
                        <p className="text-xs text-text-muted">
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
                          className="px-2 py-1 text-xs bg-arena-card border border-arena-border text-text-secondary rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Message */}
                  {request.message && (
                    <p className="text-sm text-text-body mb-4 p-3 bg-arena-card rounded border border-arena-border italic">
                      "{request.message}"
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onRequestResponse(team.id, request.id, true)}
                      className="flex-1 py-2 px-3 sm:px-4 flex items-center justify-center gap-2 text-sm font-bold text-arena-black bg-success rounded-lg hover:bg-success/90 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span className="hidden xs:inline">Accept</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onRequestResponse(team.id, request.id, false)}
                      className="flex-1 py-2 px-3 sm:px-4 flex items-center justify-center gap-2 text-sm font-bold text-text-secondary bg-arena-border rounded-lg hover:bg-arena-border-strong transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span className="hidden xs:inline">Decline</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sent Invites (Captains Only) */}
        {isCaptain && (
          <div className="bg-arena-card border border-arena-border p-4 sm:p-6 mb-4 sm:mb-6 rounded-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-text-secondary" />
                <h2 className="text-xs font-bold uppercase tracking-wide text-text-secondary">
                  Sent Invites
                </h2>
              </div>
              {inviteStats.total > 0 && (
                <div className="text-xs text-text-muted">
                  {inviteStats.accepted}/{inviteStats.total} accepted ({inviteStats.acceptanceRate.toFixed(0)}%)
                </div>
              )}
            </div>
            
            {sentInvitesLoading ? (
              <p className="text-sm text-text-muted">Loading invites...</p>
            ) : sentInvites.length === 0 ? (
              <p className="text-sm text-text-muted">No invites sent yet.</p>
            ) : (
              <div className="space-y-3">
                {sentInvites.map((invite) => {
                  const statusColors = {
                    PENDING: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
                    ACCEPTED: 'bg-success/20 text-success border-success/30',
                    DECLINED: 'bg-error/20 text-error border-error/30',
                    EXPIRED: 'bg-arena-border text-arena-muted border-arena-border',
                  };
                  
                  return (
                    <div key={invite.id} className="p-3 bg-arena-elevated border border-arena-border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="font-bold text-sm text-white mb-1">{invite.userName}</div>
                          {invite.message && (
                            <p className="text-xs text-arena-muted mb-2 line-clamp-2">"{invite.message}"</p>
                          )}
                        </div>
                        <div className={`px-2 py-1 text-xs font-bold rounded border ${statusColors[invite.status] || statusColors.EXPIRED}`}>
                          {invite.status}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-arena-muted">
                          Sent {new Date(invite.createdAt).toLocaleDateString()}
                          {invite.expiresAt && invite.status === 'PENDING' && (
                            <span className="ml-2">
                              • Expires {new Date(invite.expiresAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {(invite.status === 'EXPIRED' || invite.status === 'DECLINED') && (
                          <button
                            type="button"
                            onClick={() => handleResendInvite(invite.id)}
                            disabled={resendLoading}
                            className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-brand bg-arena-card border border-arena-border rounded hover:bg-arena-elevated transition-colors disabled:opacity-50"
                          >
                            <RefreshCw className="w-3 h-3" />
                            Resend
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Project Goal */}
        <div className="bg-arena-card border border-arena-border p-4 sm:p-6 mb-4 sm:mb-6 rounded-card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wide text-text-secondary">
              Project Goal
            </h2>
            {isCaptain && !isEditingDescription && (
              <button
                type="button"
                onClick={() => {
                  setDescriptionInput(team.description || '');
                  setIsEditingDescription(true);
                }}
                className="text-xs font-medium px-3 py-1 rounded transition-colors"
                style={{
                  color: 'var(--color-text-secondary)',
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: `1px solid ${'var(--color-border)'}`,
                }}
              >
                Edit
              </button>
            )}
          </div>
          {isEditingDescription ? (
            <div className="space-y-3">
              <textarea
                value={descriptionInput}
                onChange={(e) => setDescriptionInput(e.target.value)}
                placeholder="Describe your team's project goal..."
                className={`w-full p-3 border-2 focus:outline-none text-base sm:text-lg resize-none transition-colors bg-arena-elevated text-white placeholder:text-text-muted rounded-card
                  ${descriptionInput.trim().length < 10 ? 'border-error/50' : 'border-arena-border focus:border-text-secondary'}`}
                rows={3}
                maxLength={500}
              />
              <div className="flex items-center justify-between">
                {descriptionInput.trim().length < 10 ? (
                  <p className="text-xs text-error">Description must be at least 10 characters</p>
                ) : (
                  <span />
                )}
                <p className="text-xs text-text-muted">{descriptionInput.length}/500</p>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCancelDescription}
                  className="px-4 py-2 text-sm font-medium text-text-secondary bg-arena-elevated rounded hover:bg-arena-border transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveDescription}
                  disabled={descriptionInput.trim().length < 10}
                  className="px-4 py-2 text-sm font-medium text-white rounded transition-colors disabled:opacity-50"
                  style={{ backgroundColor: 'var(--color-text-secondary)' }}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <p className="text-base sm:text-lg text-text-body">{team.description}</p>
          )}
        </div>

        {/* Problem We're Going To Solve */}
        <div className="bg-arena-card border border-arena-border p-4 sm:p-6 mb-4 sm:mb-6 rounded-card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wide text-text-secondary">
              Problem We're Going To Solve
            </h2>
            {isCaptain && !isEditingProblem && (
              <button
                type="button"
                onClick={() => {
                  setProblemInput(team.problem || '');
                  setIsEditingProblem(true);
                }}
                className="text-xs font-medium px-3 py-1 rounded transition-colors"
                style={{
                  color: 'var(--color-text-secondary)',
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: `1px solid ${'var(--color-border)'}`,
                }}
              >
                Edit
              </button>
            )}
          </div>
          {isEditingProblem ? (
            <div className="space-y-3">
              <textarea
                value={problemInput}
                onChange={(e) => setProblemInput(e.target.value)}
                placeholder="Describe the problem your team is going to solve..."
                className={`w-full p-3 border-2 focus:outline-none text-base sm:text-lg resize-none transition-colors bg-arena-elevated text-white placeholder:text-text-muted rounded-card
                  ${problemInput.trim().length < 10 ? 'border-error/50' : 'border-arena-border focus:border-text-secondary'}`}
                rows={3}
                maxLength={500}
              />
              <div className="flex items-center justify-between">
                {problemInput.trim().length < 10 ? (
                  <p className="text-xs text-error">Problem description must be at least 10 characters</p>
                ) : (
                  <span />
                )}
                <p className="text-xs text-text-muted">{problemInput.length}/500</p>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCancelProblem}
                  className="px-4 py-2 text-sm font-medium text-text-secondary bg-arena-elevated rounded hover:bg-arena-border transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProblem}
                  disabled={problemInput.trim().length < 10}
                  className="px-4 py-2 text-sm font-medium text-white rounded transition-colors disabled:opacity-50"
                  style={{ backgroundColor: 'var(--color-text-secondary)' }}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <p className="text-base sm:text-lg text-text-body">{team.problem || (
              <span className="text-text-muted italic">
                {isCaptain ? 'Click Edit to describe the problem your team is going to solve.' : 'No problem description provided.'}
              </span>
            )}</p>
          )}
        </div>

        {/* More Info */}
        <div className="bg-arena-card border border-arena-border p-4 sm:p-6 mb-4 sm:mb-6 rounded-card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wide text-text-secondary">
              More Info
            </h2>
            {isCaptain && !isEditingMoreInfo && (
              <button
                type="button"
                onClick={() => setIsEditingMoreInfo(true)}
                className="text-xs font-medium px-3 py-1 rounded transition-colors"
                style={{
                  color: 'var(--color-text-secondary)',
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: `1px solid ${'var(--color-border)'}`,
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
                className="w-full p-3 border border-arena-border bg-arena-elevated text-white placeholder:text-text-muted rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-text-secondary transition-all"
                rows={4}
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setMoreInfoText(team.moreInfo || '');
                    setIsEditingMoreInfo(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-text-secondary bg-arena-elevated rounded-lg hover:bg-arena-border transition-colors"
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
                  style={{ backgroundColor: 'var(--color-text-secondary)' }}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <p className="text-text-body">
              {team.moreInfo || (
                <span className="text-text-muted italic">
                  {isCaptain ? 'Click Edit to add more information about your project.' : 'No additional information provided.'}
                </span>
              )}
            </p>
          )}
        </div>

        {/* Team Members */}
        <div className="bg-arena-card border border-arena-border p-4 sm:p-6 mb-4 sm:mb-6 rounded-card">
          <h2 className="text-xs font-bold uppercase tracking-wide text-text-secondary mb-4">
            Team Members ({team.members.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {team.members.map((member) => (
              <div
                key={member.id}
                className="bg-arena-card border border-arena-border p-3 sm:p-4 rounded-lg transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  borderLeft: `4px solid ${'var(--color-text-secondary)'}`,
                  boxShadow: `inset 4px 0 15px -10px ${'var(--color-text-secondary)'}40`
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center relative flex-shrink-0"
                    style={{ backgroundColor: 'var(--color-text-secondary)' }}
                  >
                    <User className="w-5 h-5 text-white" />
                    {member.id === team.captainId && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                        <Crown className="w-3 h-3 text-yellow-800" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="font-bold text-white truncate"
                      >
                        {member.name}
                      </span>
                      {member.id === team.captainId && (
                        <span className="text-xs text-yellow-400 font-semibold uppercase flex-shrink-0">Captain</span>
                      )}
                    </div>
                    {member.callsign && (
                      <span className="text-sm text-text-secondary italic truncate">
                        "{member.callsign}"
                      </span>
                    )}
                  </div>
                  {/* Transfer Captain Button - Only visible to captain for non-captain members */}
                  {isCaptain && member.id !== team.captainId && (
                    <button
                      type="button"
                      onClick={() => openTransferModal(member)}
                      className="p-2 text-text-muted hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors flex-shrink-0"
                      title="Make Captain"
                    >
                      <Crown className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {member.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 text-xs rounded transition-transform hover:scale-105"
                      style={{
                        backgroundColor: `${'var(--color-text-secondary)'}15`,
                        color: 'var(--color-text-secondary)',
                        border: `1px solid ${'var(--color-text-secondary)'}30`,
                        boxShadow: `0 2px 8px ${'var(--color-text-secondary)'}20`
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                  {member.skills.length > 3 && (
                    <span className="px-2 py-1 text-xs text-text-muted">
                      +{member.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Common Interests */}
        {commonInterests.length > 0 && (
          <div className="bg-arena-card border border-arena-border p-4 sm:p-6 mb-4 sm:mb-6 rounded-card">
            <h2 className="text-xs font-bold uppercase tracking-wide text-text-secondary mb-3">
              Common Interests
            </h2>
            <div className="flex flex-wrap gap-2">
              {commonInterests.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-2 text-sm font-medium rounded-lg transition-transform hover:scale-105"
                  style={{
                    backgroundColor: `${'var(--color-text-secondary)'}20`,
                    color: 'var(--color-text-secondary)',
                    border: `1px solid ${'var(--color-text-secondary)'}40`,
                    boxShadow: `0 2px 10px ${'var(--color-text-secondary)'}25`
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Looking For */}
        <div className="bg-arena-card border border-arena-border p-4 sm:p-6 mb-4 sm:mb-6 rounded-card">
          <h2 className="text-xs font-bold uppercase tracking-wide text-text-secondary mb-3">
            Looking For
          </h2>
          <div className="flex flex-wrap gap-2">
            {team.lookingFor.map((skill) => (
              <span
                key={skill}
                className="px-3 py-2 text-sm rounded-lg transition-transform hover:scale-105"
                style={{
                  backgroundColor: `${'var(--color-text-secondary)'}15`,
                  color: 'var(--color-text-secondary)',
                  border: `1px solid ${'var(--color-text-secondary)'}30`,
                  boxShadow: `0 2px 8px ${'var(--color-text-secondary)'}20`
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Project Submission Status - Visible to team members only after submission phase */}
        {(isCaptain || isMember) && eventPhase && ['submission', 'voting', 'judging', 'results'].includes(eventPhase) && (
          <div
            className="bg-arena-card border border-arena-border p-4 sm:p-6 mb-4 sm:mb-6 border-2 rounded-card"
            style={{ 
              borderColor: `${'var(--color-text-secondary)'}99`,
              boxShadow: `0 0 25px ${'var(--color-text-secondary)'}20`
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wide text-text-secondary">
                Project Submission
              </h2>
              {/* Status Badge */}
              {(() => {
                const status = team.submission?.status || 'not_started';
                const statusConfig = {
                  submitted: { label: 'Submitted', color: '#00FF9D', bgColor: 'rgba(0, 255, 157, 0.1)', Icon: CheckCircle2 },
                  draft: { label: 'Draft', color: '#FF8A00', bgColor: 'rgba(255, 138, 0, 0.1)', Icon: Edit3 },
                  not_started: { label: 'Not Started', color: '#888888', bgColor: 'rgba(136, 136, 136, 0.1)', Icon: Circle },
                }[status];
                const StatusIcon = statusConfig.Icon;
                return (
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                    style={{ backgroundColor: statusConfig.bgColor, color: statusConfig.color }}
                  >
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusConfig.label}
                  </div>
                );
              })()}
            </div>

            {/* Submission Preview */}
            {(!team.submission || team.submission?.status === 'not_started') ? (
              <div className="text-center py-4">
                <Send className="w-8 h-8 mx-auto mb-2 text-text-muted" />
                <p className="text-sm text-text-secondary mb-4">
                  {isCaptain 
                    ? "You haven't started your submission yet." 
                    : "Your team hasn't started the submission yet."}
                </p>
                {isCaptain && (
                  <button
                    type="button"
                    onClick={() => onNavigate('submission')}
                    className="px-4 py-2 font-bold text-sm text-white transition-colors hover:opacity-90 rounded-lg"
                    style={{ backgroundColor: 'var(--color-text-secondary)' }}
                  >
                    Start Submission
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {team.submission?.projectName && (
                  <div>
                    <div className="text-xs text-text-muted mb-1">Project Name</div>
                    <div className="font-bold text-white">{team.submission.projectName}</div>
                  </div>
                )}
                {team.submission?.description && (
                  <div>
                    <div className="text-xs text-text-muted mb-1">Description</div>
                    <div className="text-sm text-text-body line-clamp-2">{team.submission.description}</div>
                  </div>
                )}

                {/* Progress indicators */}
                <div className="flex items-center gap-4 pt-2 border-t border-arena-border text-xs text-text-secondary">
                  <div className="flex items-center gap-1">
                    {team.submission?.repoUrl ? (
                      <Check className="w-3.5 h-3.5 text-success" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-text-muted" />
                    )}
                    Repo
                  </div>
                  <div className="flex items-center gap-1">
                    {team.submission?.demoVideoUrl ? (
                      <Check className="w-3.5 h-3.5 text-success" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-text-muted" />
                    )}
                    Video
                  </div>
                  <div className="flex items-center gap-1">
                    {team.submission?.liveDemoUrl ? (
                      <Check className="w-3.5 h-3.5 text-success" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-text-muted" />
                    )}
                    Live Demo
                  </div>
                </div>

                {/* Captain Action Button */}
                {isCaptain && (
                  <button
                    type="button"
                    onClick={() => onNavigate('submission')}
                    className="w-full mt-2 py-2.5 flex items-center justify-center gap-2 font-bold text-sm 
                               transition-colors hover:opacity-90 rounded-lg"
                    style={{ backgroundColor: 'var(--color-text-secondary)', color: 'white' }}
                  >
                    {team.submission?.status === 'submitted' ? 'View Submission' : 'Continue Editing'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Request to Join Button */}
        {isMember ? null : hasPendingRequest ? null : isTeamFull ? (
          <div
            className="glass-card w-full py-3 sm:py-4 text-center font-bold text-base sm:text-lg rounded-card text-text-muted"
          >
            TEAM IS FULL
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowRequestModal(true)}
            className={`w-full py-3 sm:py-4 flex items-center justify-center gap-2
                       font-bold text-base sm:text-lg transition-all duration-300
                       hover:-translate-y-1 hover:shadow-2xl rounded-card
                       bg-arena-elevated border border-arena-border text-white hover:bg-arena-border`}
          >
            REQUEST TO JOIN
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Request to Join Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div
            className="glass-card w-full max-w-md p-4 sm:p-6 rounded-card border-2 shadow-2xl"
            style={{ 
              borderColor: `${'var(--color-text-secondary)'}60`,
              boxShadow: `0 0 40px ${'var(--color-text-secondary)'}20`
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Request to Join</h3>
              <button
                type="button"
                onClick={() => {
                  setShowRequestModal(false);
                  setRequestMessage('');
                }}
                className="p-1 text-text-muted hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-text-secondary mb-2">
                Send a message to <span className="font-semibold text-white">{team.name}</span> captain:
              </p>
              <textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Tell the team why you'd like to join and what you can contribute..."
                className="w-full p-3 border border-arena-border bg-arena-elevated text-white placeholder:text-text-muted rounded-lg resize-none focus:outline-none focus:ring-2 transition-all text-base"
                style={{ '--tw-ring-color': 'var(--color-text-secondary)' }}
                rows={4}
              />
            </div>

            <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-bg-elevated)' }}>
              <p className="text-xs font-bold uppercase tracking-wide text-text-secondary mb-2">
                Your Skills
              </p>
              <div className="flex flex-wrap gap-1">
                {user?.skills?.length > 0 ? (
                  user.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 text-xs bg-arena-card border border-arena-border text-text-secondary rounded"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-text-muted italic">No skills added</span>
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
                className="flex-1 py-3 text-sm font-bold text-text-secondary glass-card rounded-lg hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitRequest}
                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all hover:-translate-y-0.5
                           bg-arena-elevated border border-arena-border text-white hover:bg-arena-border disabled:opacity-50`}
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Idea Modal */}
      {isEditingName && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div
            className="glass-card w-full max-w-md p-4 sm:p-6 rounded-card border-2 shadow-2xl"
            style={{ 
              borderColor: `${'var(--color-text-secondary)'}60`,
              boxShadow: `0 0 40px ${'var(--color-text-secondary)'}20`
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Edit Idea</h3>
              <button
                type="button"
                onClick={handleCancelTeamName}
                className="p-1 text-text-muted hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wide text-text-secondary mb-2">
                Project Idea
              </label>
              <input
                type="text"
                value={teamNameInput}
                onChange={(e) => setTeamNameInput(e.target.value)}
                placeholder="Enter project idea"
                maxLength={50}
                className={`w-full px-3 py-3 border-2 focus:outline-none transition-colors text-base bg-arena-elevated text-white placeholder:text-text-muted rounded-card
                  ${teamNameInput.trim().length < 3 ? 'border-error/50' : 'border-arena-border focus:border-text-secondary'}`}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && teamNameInput.trim().length >= 3) handleSaveTeamName();
                  if (e.key === 'Escape') handleCancelTeamName();
                }}
              />
              <div className="flex items-center justify-between mt-1">
                {teamNameInput.trim().length < 3 ? (
                  <p className="text-xs text-error">Idea must be at least 3 characters</p>
                ) : (
                  <span />
                )}
                <p className="text-xs text-text-muted">{teamNameInput.length}/50</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancelTeamName}
                className="flex-1 py-3 text-sm font-bold text-text-secondary glass-card rounded-lg hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveTeamName}
                disabled={teamNameInput.trim().length < 3}
                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0
                           bg-arena-elevated border border-arena-border text-white hover:bg-arena-border disabled:opacity-50`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Captain Modal */}
      {showTransferModal && memberToTransfer && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div
            className="glass-card w-full max-w-md p-4 sm:p-6 rounded-card border-2 shadow-2xl"
            style={{ 
              borderColor: `${'var(--color-text-secondary)'}60`,
              boxShadow: `0 0 40px ${'var(--color-text-secondary)'}20`
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Transfer Captain Role</h3>
              <button
                type="button"
                onClick={() => {
                  setShowTransferModal(false);
                  setMemberToTransfer(null);
                }}
                className="p-1 text-text-muted hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Transfer Info */}
            <div className="mb-6">
              <div className="flex items-center justify-center gap-4 py-4">
                {/* Current Captain (You) */}
                <div className="text-center">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2 relative"
                    style={{ backgroundColor: 'var(--color-text-secondary)' }}
                  >
                    <User className="w-7 h-7 text-white" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-sm">
                      <Crown className="w-3.5 h-3.5 text-yellow-800" />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-white">You</p>
                  <p className="text-xs text-text-muted">Current Captain</p>
                </div>

                {/* Arrow */}
                <div className="flex flex-col items-center">
                  <ArrowRightLeft className="w-6 h-6 text-text-muted" />
                </div>

                {/* New Captain */}
                <div className="text-center">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2"
                    style={{ backgroundColor: 'var(--color-text-secondary)' }}
                  >
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-sm font-medium text-white">{memberToTransfer.name}</p>
                  <p className="text-xs text-text-muted">New Captain</p>
                </div>
              </div>

              <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg">
                <p className="text-sm text-warning">
                  <span className="font-semibold">Are you sure?</span> This will transfer all captain privileges to{' '}
                  <span className="font-semibold">{memberToTransfer.name}</span>. You will become a regular team member.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowTransferModal(false);
                  setMemberToTransfer(null);
                }}
                className="flex-1 py-3 text-sm font-bold text-text-secondary glass-card rounded-lg hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleTransferCaptain}
                className="flex-1 py-3 text-sm font-bold text-arena-black bg-gradient-to-r from-yellow-400 to-yellow-500 
                           rounded-lg hover:from-yellow-300 hover:to-yellow-400 hover:-translate-y-0.5 
                           transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Crown className="w-4 h-4" />
                Transfer Captain
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default TeamDetail;
