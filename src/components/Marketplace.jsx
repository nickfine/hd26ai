import { useState, useEffect, memo, useCallback, useMemo } from 'react';
import {
  Cpu,
  Heart,
  Scale,
  Users,
  Plus,
  Search,
  ChevronRight,
  User,
  Send,
  X,
  Mail,
  Check,
} from 'lucide-react';
import { SKILLS } from '../data/mockData';
import { ALLEGIANCE_CONFIG, cn, getAllegianceConfig } from '../lib/design-system';
import AppLayout from './AppLayout';

function Marketplace({ 
  user, 
  teams, 
  freeAgents = [],
  allegianceStyle, 
  onNavigate, 
  onNavigateToTeam,
  onSendInvite,
  onInviteResponse,
  onCreateTeam,
  initialTab = 'teams',
  eventPhase,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(initialTab);
  const [inviteModalAgent, setInviteModalAgent] = useState(null);

  // Sync activeTab when initialTab prop changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  const [inviteMessage, setInviteMessage] = useState('');
  const [filterAllegiance, setFilterAllegiance] = useState(user?.allegiance || 'neutral');

  // Create Team Modal State
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    side: user?.allegiance === 'neutral' ? 'human' : (user?.allegiance || 'human'),
    lookingFor: [],
    maxMembers: 6,
  });

  // Find the team the user is captain of (if any) - memoized
  const captainedTeam = useMemo(() => 
    teams.find((team) => team.captainId === user?.id),
    [teams, user?.id]
  );

  // Filter teams based on selected filter allegiance - memoized
  const allegianceFilteredTeams = useMemo(() => teams.filter((team) => {
    if (filterAllegiance === 'human') return team.side === 'human';
    if (filterAllegiance === 'ai') return team.side === 'ai';
    return true; // neutral shows all
  }), [teams, filterAllegiance]);

  // Filter and sort teams - memoized
  const filteredTeams = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    const filtered = allegianceFilteredTeams.filter(
      (team) =>
        team.name.toLowerCase().includes(searchLower) ||
        team.description.toLowerCase().includes(searchLower) ||
        team.lookingFor.some((skill) =>
          skill.toLowerCase().includes(searchLower)
        )
    );
    
    // Sort teams: applied teams first, then others
    return [...filtered].sort((a, b) => {
      const aApplied = a.joinRequests?.some((r) => r.userName === user?.name) ? 1 : 0;
      const bApplied = b.joinRequests?.some((r) => r.userName === user?.name) ? 1 : 0;
      return bApplied - aApplied;
    });
  }, [allegianceFilteredTeams, searchTerm, user?.name]);

  // Filter free agents by allegiance - memoized
  const allegianceFilteredAgents = useMemo(() => freeAgents.filter((agent) => {
    // Exclude current user from the list
    if (agent.id === user?.id || agent.name === user?.name) return false;
    
    if (filterAllegiance === 'human') return agent.allegiance === 'human';
    if (filterAllegiance === 'ai') return agent.allegiance === 'ai';
    return true; // neutral shows all
  }), [freeAgents, filterAllegiance, user?.id, user?.name]);

  // Filter free agents by search - memoized
  const filteredAgents = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return allegianceFilteredAgents.filter(
      (agent) =>
        agent.name.toLowerCase().includes(searchLower) ||
        agent.bio?.toLowerCase().includes(searchLower) ||
        agent.skills?.some((skill) =>
          skill.toLowerCase().includes(searchLower)
        )
    );
  }, [allegianceFilteredAgents, searchTerm]);

  // Find current user's pending invites (if they are a free agent in the system)
  const currentUserAgent = freeAgents.find((a) => a.id === user?.id);
  const pendingInvites = currentUserAgent?.teamInvites || [];

  // Handle sending invite - memoized
  const handleSendInvite = useCallback(() => {
    if (inviteModalAgent && captainedTeam) {
      onSendInvite(inviteModalAgent.id, captainedTeam.id, inviteMessage);
      setInviteModalAgent(null);
      setInviteMessage('');
    }
  }, [inviteModalAgent, captainedTeam, onSendInvite, inviteMessage]);

  // Check if user is already on a team
  const userTeam = teams.find(
    (team) => team.captainId === user?.id || team.members?.some((m) => m.id === user?.id)
  );

  // Handle creating team - memoized
  const handleCreateTeam = useCallback(async () => {
    // Validation
    if (newTeam.name.trim().length < 3) return;
    if (newTeam.description.trim().length < 10) return;
    if (newTeam.lookingFor.length === 0) return;

    setIsCreatingTeam(true);
    try {
      const result = await onCreateTeam?.(newTeam);
      if (result?.id) {
        // Reset form and close modal
        setNewTeam({
          name: '',
          description: '',
          side: user?.allegiance === 'neutral' ? 'human' : (user?.allegiance || 'human'),
          lookingFor: [],
          maxMembers: 6,
        });
        setShowCreateTeamModal(false);
        // Navigate to the new team
        onNavigateToTeam(result.id);
      }
    } finally {
      setIsCreatingTeam(false);
    }
  }, [newTeam, onCreateTeam, onNavigateToTeam, user?.allegiance]);

  // Toggle skill in lookingFor array - memoized
  const toggleSkill = useCallback((skill) => {
    setNewTeam((prev) => ({
      ...prev,
      lookingFor: prev.lookingFor.includes(skill)
        ? prev.lookingFor.filter((s) => s !== skill)
        : [...prev.lookingFor, skill],
    }));
  }, []);

  // Validation state
  const isFormValid =
    newTeam.name.trim().length >= 3 &&
    newTeam.description.trim().length >= 10 &&
    newTeam.lookingFor.length > 0;

  return (
    <AppLayout
      user={user}
      teams={teams}
      allegianceStyle={allegianceStyle}
      onNavigate={onNavigate}
      eventPhase={eventPhase}
      activeNav="teams"
    >
      <div className="p-4 sm:p-6">
        {/* Pending Invites - For Free Agents */}
        {pendingInvites.length > 0 && (
          <div className="glass-card p-4 mb-6 border-2 border-ai/30 rounded-card"
               style={{ boxShadow: '0 0 30px rgba(0, 229, 255, 0.15)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold uppercase tracking-wide text-arena-secondary">
                Team Invites
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-ai/20 text-ai rounded-full live-pulse-glow">
                <Mail className="w-3 h-3" />
                <span className="text-xs font-bold">{pendingInvites.length}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {pendingInvites.map((invite) => {
                const teamConfig = ALLEGIANCE_CONFIG[invite.teamSide] || ALLEGIANCE_CONFIG.neutral;
                
                return (
                  <div key={invite.id} className="p-3 glass-card rounded-lg">
                    <div 
                      className="font-bold text-sm text-white mb-1"
                    >
                      {invite.teamName}
                    </div>
                    {invite.message && (
                      <p className="text-xs text-arena-muted mb-2 line-clamp-2">
                        "{invite.message}"
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onInviteResponse(user?.id, invite.id, true)}
                        className="flex-1 py-1.5 text-xs font-bold text-white rounded-lg flex items-center justify-center gap-1
                                   transition-all hover:-translate-y-0.5"
                        style={{ backgroundColor: teamConfig.color }}
                      >
                        <Check className="w-3 h-3" />
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => onInviteResponse(user?.id, invite.id, false)}
                        className="flex-1 py-1.5 text-xs font-bold text-arena-secondary glass-card rounded-lg
                                   hover:text-white flex items-center justify-center gap-1 transition-all hover:-translate-y-0.5"
                      >
                        <X className="w-3 h-3" />
                        Decline
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="glass-card inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 backdrop-blur-md border border-white/10">
            <Users className="w-5 h-5 text-brand" />
            <span className="font-bold text-sm text-white">FIND YOUR SQUAD</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-brand mb-3 font-display"
              style={{ textShadow: '0 0 30px rgba(255, 107, 53, 0.4)' }}>
            TEAMS
          </h1>
          <p className="text-arena-secondary max-w-2xl mx-auto mb-6">
            Browse open teams looking for members or discover free agents with matching skills.
            Form your alliance and prepare for battle.
          </p>

          {/* Search */}
          <div className="relative w-full max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-arena-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={activeTab === 'teams' ? 'Search teams or skills...' : 'Search people or skills...'}
              className="w-full pl-12 pr-4 py-3 glass-card !bg-white/5 border border-white/10
                         focus:border-brand/50 focus:outline-none text-white placeholder-arena-muted
                         text-sm rounded-xl transition-all"
            />
          </div>
        </div>

          {/* Filter and Tab Switcher Row */}
          <div className="flex flex-col gap-4 mb-6">
            {/* Tab Switcher + Create Team */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('teams')}
                className={`px-4 py-2 font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap rounded-lg backdrop-blur-md
                           ${activeTab === 'teams' 
                             ? 'bg-gradient-to-r from-[#FF8A50] to-[#FF4500] text-white shadow-[0_0_20px_rgba(255,107,53,0.3)]' 
                             : 'glass-card text-arena-secondary hover:border-brand/30 hover:text-white'}`}
              >
                TEAMS
                <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                  activeTab === 'teams' ? 'bg-white/20' : 'bg-arena-elevated'
                }`}>
                  {allegianceFilteredTeams.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('people')}
                className={`px-4 py-2 font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap rounded-lg backdrop-blur-md
                           ${activeTab === 'people' 
                             ? 'bg-gradient-to-r from-[#FF8A50] to-[#FF4500] text-white shadow-[0_0_20px_rgba(255,107,53,0.3)]' 
                             : 'glass-card text-arena-secondary hover:border-brand/30 hover:text-white'}`}
              >
                FREE AGENTS
                <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                  activeTab === 'people' ? 'bg-white/20' : 'bg-arena-elevated'
                }`}>
                  {allegianceFilteredAgents.length}
                </span>
              </button>
              
              {/* Spacer to push Create Team and filters to the right on larger screens */}
              <div className="hidden sm:block flex-1" />
              
              {!userTeam && (
                <button
                  type="button"
                  onClick={() => setShowCreateTeamModal(true)}
                  className="px-4 py-2 font-bold text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 text-white 
                             hover:from-emerald-400 hover:to-emerald-500 hover:-translate-y-0.5
                             transition-all flex items-center gap-2 whitespace-nowrap rounded-lg shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  CREATE TEAM
                </button>
              )}
            </div>

            {/* Allegiance Filter */}
            <div className="flex flex-wrap items-center gap-2">
              {['human', 'ai', 'neutral'].map((side) => {
                const config = ALLEGIANCE_CONFIG[side];
                const isActive = filterAllegiance === side;
                const Icon = { human: Heart, neutral: Scale, ai: Cpu }[side];

                return (
                  <button
                    type="button"
                    key={side}
                    onClick={() => setFilterAllegiance(side)}
                    className={`px-3 py-2 flex items-center gap-2 text-xs font-bold transition-all rounded-lg backdrop-blur-md
                      ${isActive
                        ? 'bg-gradient-to-r from-[#FF8A50] to-[#FF4500] text-white shadow-[0_0_15px_rgba(255,107,53,0.25)]'
                        : 'glass-card text-arena-secondary hover:border-brand/30 hover:text-white'
                      }`}
                  >
                    <Icon className="w-3 h-3" />
                    {side === 'neutral' ? 'All' : config.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Teams Grid */}
          {activeTab === 'teams' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
                {filteredTeams.map((team) => {
                  const teamConfig = ALLEGIANCE_CONFIG[team.side];
                  const TeamIcon = team.side === 'ai' ? Cpu : Heart;
                  const hasApplied = team.joinRequests?.some((r) => r.userName === user?.name);
                  const teamColor = team.side === 'ai' ? '#00E5FF' : '#FF375F';

                  return (
                    <div
                      key={team.id}
                      className="glass-card p-4 sm:p-5 transition-all duration-300 
                                 hover:-translate-y-1 hover:shadow-2xl
                                 border-l-4 rounded-card"
                      style={{ 
                        borderLeftColor: teamColor,
                        boxShadow: `inset 4px 0 20px -10px ${teamColor}40`
                      }}
                    >
                      {/* Team Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg"
                            style={{
                              backgroundColor: `${teamColor}20`,
                            }}
                          >
                            <TeamIcon
                              className="w-5 h-5"
                              style={{ color: teamColor }}
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3
                                className="font-bold text-white truncate"
                              >
                                {team.name}
                              </h3>
                              {hasApplied && (
                                <span className="px-2 py-0.5 text-xs font-bold uppercase bg-amber-900/30 text-amber-400 rounded-full">
                                  Applied
                                </span>
                              )}
                            </div>
                            <span
                              className="text-xs font-bold uppercase"
                              style={{ color: teamColor }}
                            >
                              {team.side === 'ai' ? 'AI SIDE' : 'HUMAN SIDE'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-arena-secondary flex-shrink-0">
                          <Users className="w-4 h-4" />
                          <span>
                            {team.members.length}/{team.maxMembers}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-arena-secondary mb-4 line-clamp-2">{team.description}</p>

                      {/* Looking For */}
                      <div className="mb-4">
                        <div className="text-xs font-bold uppercase tracking-wide text-arena-muted mb-2">
                          Looking For
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {team.lookingFor.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="px-2.5 py-1 text-xs border rounded-lg transition-transform hover:scale-105"
                              style={{
                                borderColor: `${teamColor}40`,
                                color: teamColor,
                                backgroundColor: `${teamColor}10`,
                                boxShadow: `0 2px 8px ${teamColor}20`,
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                          {team.lookingFor.length > 3 && (
                            <span className="px-2 py-1 text-xs text-arena-muted">
                              +{team.lookingFor.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action */}
                      <button
                        type="button"
                        onClick={() => onNavigateToTeam(team.id)}
                        className={`w-full h-12 flex items-center justify-center gap-2
                                   font-semibold text-sm transition-all duration-300 
                                   hover:-translate-y-1 hover:shadow-2xl rounded-xl shadow-lg
                                   ${team.side === 'ai' 
                                     ? 'bg-gradient-to-r from-[#00E5FF] to-[#00B4D8] text-black' 
                                     : 'bg-gradient-to-r from-[#FF375F] to-[#FF6B35] text-white'}`}
                      >
                        LEARN MORE
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Empty State - Teams */}
              {filteredTeams.length === 0 && (
                <div className="text-center py-12 text-arena-muted">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>
                    {searchTerm
                      ? 'No teams found matching your search.'
                      : 'No teams available for the selected filter.'}
                  </p>
                </div>
              )}
            </>
          )}

          {/* People Grid */}
          {activeTab === 'people' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
                {filteredAgents.map((agent) => {
                  const agentConfig = ALLEGIANCE_CONFIG[agent.allegiance] || ALLEGIANCE_CONFIG.neutral;
                  const AgentIcon = { human: Heart, neutral: Scale, ai: Cpu }[agent.allegiance] || Scale;
                  const hasInvited = agent.teamInvites?.some((i) => i.teamId === captainedTeam?.id);
                  const agentColor = agent.allegiance === 'ai' ? '#00E5FF' : agent.allegiance === 'human' ? '#FF375F' : '#A855F7';

                  return (
                    <div
                      key={agent.id}
                      className="glass-card p-4 sm:p-5 transition-all duration-300 
                                 hover:-translate-y-1 hover:shadow-2xl
                                 border-l-4 rounded-card"
                      style={{ 
                        borderLeftColor: agentColor,
                        boxShadow: `inset 4px 0 20px -10px ${agentColor}40`
                      }}
                    >
                      {/* Agent Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg"
                            style={{
                              backgroundColor: `${agentColor}20`,
                            }}
                          >
                            <AgentIcon
                              className="w-5 h-5"
                              style={{ color: agentColor }}
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3
                                className="font-bold text-white truncate"
                              >
                                {agent.name}
                              </h3>
                              {hasInvited && (
                                <span className="px-2 py-0.5 text-xs font-bold uppercase bg-ai/20 text-ai rounded-full">
                                  Invited
                                </span>
                              )}
                            </div>
                            <span
                              className="text-xs font-bold uppercase"
                              style={{ color: agentColor }}
                            >
                              {agentConfig.label} · FREE AGENT
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-arena-secondary flex-shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-sm text-arena-secondary mb-4 line-clamp-2">{agent.bio}</p>

                      {/* Skills */}
                      <div className="mb-4">
                        <div className="text-xs font-bold uppercase tracking-wide text-arena-muted mb-2">
                          Skills
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {agent.skills?.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="px-2.5 py-1 text-xs border rounded-lg transition-transform hover:scale-105"
                              style={{
                                borderColor: `${agentColor}40`,
                                color: agentColor,
                                backgroundColor: `${agentColor}10`,
                                boxShadow: `0 2px 8px ${agentColor}20`,
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                          {agent.skills?.length > 3 && (
                            <span className="px-2 py-1 text-xs text-arena-muted">
                              +{agent.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action - Only show invite button for captains */}
                      {captainedTeam && !hasInvited && (
                        <button
                          type="button"
                          onClick={() => setInviteModalAgent(agent)}
                          className={`w-full h-12 flex items-center justify-center gap-2
                                     font-semibold text-sm transition-all duration-300 
                                     hover:-translate-y-1 hover:shadow-2xl rounded-xl shadow-lg
                                     ${agent.allegiance === 'ai' 
                                       ? 'bg-gradient-to-r from-[#00E5FF] to-[#00B4D8] text-black' 
                                       : 'bg-gradient-to-r from-[#FF375F] to-[#FF6B35] text-white'}`}
                        >
                          <Send className="w-4 h-4" />
                          INVITE TO TEAM
                        </button>
                      )}
                      {captainedTeam && hasInvited && (
                        <div
                          className="w-full h-12 flex items-center justify-center gap-2
                                     font-bold text-sm text-arena-muted glass-card rounded-xl"
                        >
                          <Check className="w-4 h-4" />
                          INVITE SENT
                        </div>
                      )}
                      {!captainedTeam && (
                        <div
                          className="w-full h-12 flex items-center justify-center gap-2
                                     text-sm text-arena-muted glass-card rounded-xl
                                     bg-gradient-to-r from-brand/20 to-transparent border-t border-brand/30"
                        >
                          Create a team to send invites
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Empty State - People */}
              {filteredAgents.length === 0 && (
                <div className="text-center py-12 text-arena-muted">
                  <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>
                    {searchTerm
                      ? 'No free agents found matching your search.'
                      : 'No free agents available for the selected filter.'}
                  </p>
                </div>
              )}
            </>
          )}
      </div>

      {/* Invite Modal */}
      {inviteModalAgent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-4 sm:p-6 max-w-md w-full mx-4 shadow-2xl rounded-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Send Team Invite</h2>
              <button
                type="button"
                onClick={() => {
                  setInviteModalAgent(null);
                  setInviteMessage('');
                }}
                className="p-1 text-arena-muted hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-arena-elevated border border-arena-border rounded-lg">
              <div className="text-sm font-bold text-white">{inviteModalAgent.name}</div>
              <div className="text-xs text-arena-muted mb-2">
                {inviteModalAgent.skills?.join(', ')}
              </div>
              <div className="text-sm text-arena-secondary">{inviteModalAgent.bio}</div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wide text-arena-secondary mb-2">
                Invitation Message
              </label>
              <textarea
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                placeholder={`Tell ${inviteModalAgent.name} why they'd be a great fit for ${captainedTeam?.name}...`}
                className="w-full p-3 border-2 border-arena-border bg-arena-card text-white placeholder-arena-muted
                           focus:border-brand focus:outline-none text-sm resize-none h-24 rounded-lg"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setInviteModalAgent(null);
                  setInviteMessage('');
                }}
                className="flex-1 py-2 border-2 border-arena-border text-arena-secondary font-bold text-sm
                           hover:border-brand/50 hover:text-white transition-colors rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendInvite}
                className="flex-1 py-2 bg-gradient-to-r from-[#FF8A50] to-[#FF4500] text-white font-bold text-sm
                           hover:from-[#FF9966] hover:to-[#FF5722] transition-colors flex items-center justify-center gap-2 rounded-lg"
              >
                <Send className="w-4 h-4" />
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Team Modal */}
      {showCreateTeamModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="glass-card p-4 sm:p-6 max-w-lg w-full mx-4 shadow-2xl my-8 rounded-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-white">CREATE YOUR TEAM</h2>
              <button
                type="button"
                onClick={() => setShowCreateTeamModal(false)}
                className="p-1 text-arena-muted hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Team Name */}
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wide text-arena-secondary mb-2">
                Team Name <span className="text-human">*</span>
              </label>
              <input
                type="text"
                value={newTeam.name}
                onChange={(e) => setNewTeam((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your team name"
                className="w-full p-3 border-2 border-arena-border bg-arena-card text-white placeholder-arena-muted
                           focus:border-brand focus:outline-none text-sm rounded-lg"
                maxLength={50}
              />
              {newTeam.name.length > 0 && newTeam.name.length < 3 && (
                <p className="text-xs text-human mt-1">Team name must be at least 3 characters</p>
              )}
            </div>

            {/* Allegiance */}
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wide text-arena-secondary mb-2">
                Choose Your Side <span className="text-human">*</span>
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setNewTeam((prev) => ({ ...prev, side: 'human' }))}
                  className={`flex-1 p-4 border-2 rounded-xl transition-all flex flex-col items-center gap-2
                    ${newTeam.side === 'human'
                      ? 'border-human bg-human/10'
                      : 'border-arena-border hover:border-human/50'
                    }`}
                >
                  <Heart className={`w-8 h-8 ${newTeam.side === 'human' ? 'text-human' : 'text-arena-muted'}`} />
                  <span className={`font-bold text-sm ${newTeam.side === 'human' ? 'text-human' : 'text-arena-muted'}`}>
                    Human
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setNewTeam((prev) => ({ ...prev, side: 'ai' }))}
                  className={`flex-1 p-4 border-2 border-dashed transition-all flex flex-col items-center gap-2
                    ${newTeam.side === 'ai'
                      ? 'border-ai bg-ai/10'
                      : 'border-arena-border hover:border-ai/50'
                    }`}
                >
                  <Cpu className={`w-8 h-8 ${newTeam.side === 'ai' ? 'text-ai' : 'text-arena-muted'}`} />
                  <span className={`font-bold text-sm ${newTeam.side === 'ai' ? 'text-ai' : 'text-arena-muted'}`}>
                    AI
                  </span>
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wide text-arena-secondary mb-2">
                Description <span className="text-human">*</span>
              </label>
              <textarea
                value={newTeam.description}
                onChange={(e) => setNewTeam((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your team's mission, goals, or project idea..."
                className="w-full p-3 border-2 border-arena-border bg-arena-card text-white placeholder-arena-muted
                           focus:border-brand focus:outline-none text-sm resize-none h-24 rounded-lg"
                maxLength={500}
              />
              <div className="flex justify-between mt-1">
                {newTeam.description.length > 0 && newTeam.description.length < 10 ? (
                  <p className="text-xs text-human">Description must be at least 10 characters</p>
                ) : (
                  <span />
                )}
                <p className="text-xs text-arena-muted">{newTeam.description.length}/500</p>
              </div>
            </div>

            {/* Looking For Skills */}
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wide text-arena-secondary mb-2">
                Looking For <span className="text-human">*</span>
              </label>
              <p className="text-xs text-arena-muted mb-3">Select skills you're looking for in teammates</p>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((skill) => {
                  const isSelected = newTeam.lookingFor.includes(skill);
                  const sideConfig = ALLEGIANCE_CONFIG[newTeam.side];
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 text-xs font-medium border-2 transition-all
                        ${newTeam.side === 'ai' ? '' : 'rounded-full'}
                        ${isSelected
                          ? `text-white ${newTeam.side === 'ai' ? 'border-dashed' : ''}`
                          : 'border-arena-border text-arena-secondary hover:border-brand/50'
                        }`}
                      style={isSelected ? {
                        backgroundColor: sideConfig.color,
                        borderColor: sideConfig.color,
                      } : {}}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
              {newTeam.lookingFor.length === 0 && (
                <p className="text-xs text-human mt-2">Select at least one skill</p>
              )}
            </div>

            {/* Max Members */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wide text-arena-secondary mb-2">
                Max Team Size
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="2"
                  max="6"
                  value={newTeam.maxMembers}
                  onChange={(e) => setNewTeam((prev) => ({ ...prev, maxMembers: parseInt(e.target.value, 10) }))}
                  className="flex-1 h-2 bg-arena-elevated rounded-lg appearance-none cursor-pointer accent-brand"
                />
                <div className="flex items-center gap-1 px-3 py-1 bg-arena-elevated border border-arena-border rounded">
                  <Users className="w-4 h-4 text-arena-secondary" />
                  <span className="font-bold text-white">{newTeam.maxMembers}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowCreateTeamModal(false)}
                className="flex-1 py-3 border-2 border-arena-border text-arena-secondary font-bold text-sm
                           hover:border-brand/50 hover:text-white transition-colors rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateTeam}
                disabled={!isFormValid || isCreatingTeam}
                className={`flex-1 py-3 font-bold text-sm transition-all flex items-center justify-center gap-2 rounded-lg
                  ${isFormValid && !isCreatingTeam
                    ? 'bg-gradient-to-r from-[#FF8A50] to-[#FF4500] text-white hover:from-[#FF9966] hover:to-[#FF5722]'
                    : 'bg-arena-elevated text-arena-muted cursor-not-allowed'
                  }`}
              >
                {isCreatingTeam ? (
                  <>
                    <div className="w-4 h-4 border-2 border-arena-muted border-t-white rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Create Team
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default memo(Marketplace);

