import { useState, useEffect } from 'react';
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

  // Find the team the user is captain of (if any)
  const captainedTeam = teams.find((team) => team.captainId === user?.id);

  // Filter teams based on selected filter allegiance
  const allegianceFilteredTeams = teams.filter((team) => {
    if (filterAllegiance === 'human') return team.side === 'human';
    if (filterAllegiance === 'ai') return team.side === 'ai';
    return true; // neutral shows all
  });

  // Filter teams by search
  const searchFilteredTeams = allegianceFilteredTeams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.lookingFor.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  // Sort teams: applied teams first, then others
  const filteredTeams = [...searchFilteredTeams].sort((a, b) => {
    const aApplied = a.joinRequests?.some((r) => r.userName === user?.name) ? 1 : 0;
    const bApplied = b.joinRequests?.some((r) => r.userName === user?.name) ? 1 : 0;
    return bApplied - aApplied;
  });

  // Filter free agents by allegiance (and exclude current user - you don't need to see yourself)
  const allegianceFilteredAgents = freeAgents.filter((agent) => {
    // Exclude current user from the list
    if (agent.id === user?.id || agent.name === user?.name) return false;
    
    if (filterAllegiance === 'human') return agent.allegiance === 'human';
    if (filterAllegiance === 'ai') return agent.allegiance === 'ai';
    return true; // neutral shows all
  });

  // Filter free agents by search
  const filteredAgents = allegianceFilteredAgents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.skills?.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  // Find current user's pending invites (if they are a free agent in the system)
  const currentUserAgent = freeAgents.find((a) => a.id === user?.id);
  const pendingInvites = currentUserAgent?.teamInvites || [];

  // Handle sending invite
  const handleSendInvite = () => {
    if (inviteModalAgent && captainedTeam) {
      onSendInvite(inviteModalAgent.id, captainedTeam.id, inviteMessage);
      setInviteModalAgent(null);
      setInviteMessage('');
    }
  };

  // Check if user is already on a team
  const userTeam = teams.find(
    (team) => team.captainId === user?.id || team.members?.some((m) => m.id === user?.id)
  );

  // Handle creating team
  const handleCreateTeam = async () => {
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
  };

  // Toggle skill in lookingFor array
  const toggleSkill = (skill) => {
    setNewTeam((prev) => ({
      ...prev,
      lookingFor: prev.lookingFor.includes(skill)
        ? prev.lookingFor.filter((s) => s !== skill)
        : [...prev.lookingFor, skill],
    }));
  };

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
          <div className="p-4 mb-6 border-2 border-blue-300 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold uppercase tracking-wide text-gray-500">
                Team Invites
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                <Mail className="w-3 h-3" />
                <span className="text-xs font-bold">{pendingInvites.length}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {pendingInvites.map((invite) => {
                const teamConfig = ALLEGIANCE_CONFIG[invite.teamSide] || ALLEGIANCE_CONFIG.neutral;
                
                return (
                  <div key={invite.id} className="p-3 bg-white border border-gray-200 rounded">
                    <div 
                      className={`font-bold text-sm text-gray-900 mb-1 ${
                        invite.teamSide === 'ai' ? 'font-mono' : ''
                      }`}
                    >
                      {invite.teamName}
                    </div>
                    {invite.message && (
                      <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                        "{invite.message}"
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onInviteResponse(user?.id, invite.id, true)}
                        className="flex-1 py-1.5 text-xs font-bold text-white rounded flex items-center justify-center gap-1"
                        style={{ backgroundColor: teamConfig.color }}
                      >
                        <Check className="w-3 h-3" />
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => onInviteResponse(user?.id, invite.id, false)}
                        className="flex-1 py-1.5 text-xs font-bold text-gray-600 border border-gray-300 rounded
                                   hover:bg-gray-100 flex items-center justify-center gap-1"
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-arena-card border border-arena-border rounded-full mb-4">
            <Users className="w-5 h-5 text-brand" />
            <span className="font-bold text-sm text-white">FIND YOUR SQUAD</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-brand mb-3 font-display">
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
              className="w-full pl-12 pr-4 py-3 border border-arena-border bg-arena-card
                         focus:border-brand focus:outline-none text-white placeholder-arena-muted
                         text-sm rounded-xl"
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
                className={`px-4 py-2 font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap rounded-lg
                           ${activeTab === 'teams' 
                             ? 'bg-brand text-white' 
                             : 'bg-arena-card border border-arena-border text-arena-secondary hover:border-brand/50 hover:text-white'}`}
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
                className={`px-4 py-2 font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap rounded-lg
                           ${activeTab === 'people' 
                             ? 'bg-brand text-white' 
                             : 'bg-arena-card border border-arena-border text-arena-secondary hover:border-brand/50 hover:text-white'}`}
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
                  className="px-4 py-2 font-bold text-sm bg-success text-arena-black hover:bg-success/90 transition-all flex items-center gap-2 whitespace-nowrap rounded-lg"
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
                    className={`px-3 py-2 flex items-center gap-2 text-xs font-bold transition-all rounded-lg
                      ${isActive
                        ? 'bg-brand text-white'
                        : 'bg-arena-card border border-arena-border text-arena-secondary hover:border-brand/50 hover:text-white'
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
                  const teamColor = team.side === 'ai' ? '#00D4FF' : '#FF2E63';

                  return (
                    <div
                      key={team.id}
                      className={`p-4 sm:p-5 bg-arena-card transition-all duration-200 hover:shadow-lg
                                 border-l-4 border border-arena-border rounded-xl`}
                      style={{ borderLeftColor: teamColor }}
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
                                className={`font-bold text-white truncate ${
                                  team.side === 'ai' ? 'font-mono' : ''
                                }`}
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
                        <div className="flex flex-wrap gap-1">
                          {team.lookingFor.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-1 text-xs border rounded-lg"
                              style={{
                                borderColor: `${teamColor}40`,
                                color: teamColor,
                                backgroundColor: `${teamColor}10`,
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
                        className="w-full py-2 flex items-center justify-center gap-2
                                   font-bold text-sm transition-all rounded-lg"
                        style={{
                          backgroundColor: teamColor,
                          color: 'white',
                        }}
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
                  const agentColor = agent.allegiance === 'ai' ? '#00D4FF' : agent.allegiance === 'human' ? '#FF2E63' : '#A855F7';

                  return (
                    <div
                      key={agent.id}
                      className="p-4 sm:p-5 bg-arena-card transition-all duration-200 hover:shadow-lg
                                 border-l-4 border border-arena-border rounded-xl"
                      style={{ borderLeftColor: agentColor }}
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
                                className={`font-bold text-white truncate ${
                                  agent.allegiance === 'ai' ? 'font-mono' : ''
                                }`}
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
                        <div className="flex flex-wrap gap-1">
                          {agent.skills?.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-1 text-xs border rounded-lg"
                              style={{
                                borderColor: `${agentColor}40`,
                                color: agentColor,
                                backgroundColor: `${agentColor}10`,
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
                          className="w-full py-2 flex items-center justify-center gap-2
                                     font-bold text-sm transition-all rounded-lg"
                          style={{
                            backgroundColor: agentColor,
                            color: 'white',
                          }}
                        >
                          <Send className="w-4 h-4" />
                          INVITE TO TEAM
                        </button>
                      )}
                      {captainedTeam && hasInvited && (
                        <div
                          className="w-full py-2 flex items-center justify-center gap-2
                                     font-bold text-sm text-arena-muted border border-arena-border rounded-lg"
                        >
                          <Check className="w-4 h-4" />
                          INVITE SENT
                        </div>
                      )}
                      {!captainedTeam && (
                        <div
                          className="w-full py-2 flex items-center justify-center gap-2
                                     text-sm text-arena-muted border border-arena-border bg-arena-elevated rounded-lg"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Send Team Invite</h2>
              <button
                type="button"
                onClick={() => {
                  setInviteModalAgent(null);
                  setInviteMessage('');
                }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-gray-50 border border-gray-200">
              <div className="text-sm font-bold text-gray-900">{inviteModalAgent.name}</div>
              <div className="text-xs text-gray-500 mb-2">
                {inviteModalAgent.skills?.join(', ')}
              </div>
              <div className="text-sm text-gray-600">{inviteModalAgent.bio}</div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                Invitation Message
              </label>
              <textarea
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                placeholder={`Tell ${inviteModalAgent.name} why they'd be a great fit for ${captainedTeam?.name}...`}
                className="w-full p-3 border-2 border-gray-200 focus:border-gray-900 focus:outline-none
                           text-sm resize-none h-24"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setInviteModalAgent(null);
                  setInviteMessage('');
                }}
                className="flex-1 py-2 border-2 border-gray-200 text-gray-600 font-bold text-sm
                           hover:border-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendInvite}
                className="flex-1 py-2 bg-gray-900 text-white font-bold text-sm
                           hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white p-4 sm:p-6 max-w-lg w-full mx-4 shadow-2xl my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-gray-900">CREATE YOUR TEAM</h2>
              <button
                type="button"
                onClick={() => setShowCreateTeamModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Team Name */}
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                Team Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newTeam.name}
                onChange={(e) => setNewTeam((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your team name"
                className="w-full p-3 border-2 border-gray-200 focus:border-gray-900 focus:outline-none text-sm"
                maxLength={50}
              />
              {newTeam.name.length > 0 && newTeam.name.length < 3 && (
                <p className="text-xs text-red-500 mt-1">Team name must be at least 3 characters</p>
              )}
            </div>

            {/* Allegiance */}
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                Choose Your Side <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setNewTeam((prev) => ({ ...prev, side: 'human' }))}
                  className={`flex-1 p-4 border-2 rounded-xl transition-all flex flex-col items-center gap-2
                    ${newTeam.side === 'human'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-400'
                    }`}
                >
                  <Heart className={`w-8 h-8 ${newTeam.side === 'human' ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className={`font-bold text-sm ${newTeam.side === 'human' ? 'text-green-700' : 'text-gray-500'}`}>
                    Human
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setNewTeam((prev) => ({ ...prev, side: 'ai' }))}
                  className={`flex-1 p-4 border-2 border-dashed transition-all flex flex-col items-center gap-2
                    ${newTeam.side === 'ai'
                      ? 'border-cyan-500 bg-cyan-50'
                      : 'border-gray-200 hover:border-gray-400'
                    }`}
                >
                  <Cpu className={`w-8 h-8 ${newTeam.side === 'ai' ? 'text-cyan-600' : 'text-gray-400'}`} />
                  <span className={`font-bold text-sm font-mono ${newTeam.side === 'ai' ? 'text-cyan-700' : 'text-gray-500'}`}>
                    AI
                  </span>
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={newTeam.description}
                onChange={(e) => setNewTeam((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your team's mission, goals, or project idea..."
                className="w-full p-3 border-2 border-gray-200 focus:border-gray-900 focus:outline-none text-sm resize-none h-24"
                maxLength={500}
              />
              <div className="flex justify-between mt-1">
                {newTeam.description.length > 0 && newTeam.description.length < 10 ? (
                  <p className="text-xs text-red-500">Description must be at least 10 characters</p>
                ) : (
                  <span />
                )}
                <p className="text-xs text-gray-400">{newTeam.description.length}/500</p>
              </div>
            </div>

            {/* Looking For Skills */}
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                Looking For <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-3">Select skills you're looking for in teammates</p>
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
                          : 'border-gray-200 text-gray-600 hover:border-gray-400'
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
                <p className="text-xs text-red-500 mt-2">Select at least one skill</p>
              )}
            </div>

            {/* Max Members */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                Max Team Size
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="2"
                  max="6"
                  value={newTeam.maxMembers}
                  onChange={(e) => setNewTeam((prev) => ({ ...prev, maxMembers: parseInt(e.target.value, 10) }))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="font-bold text-gray-900">{newTeam.maxMembers}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowCreateTeamModal(false)}
                className="flex-1 py-3 border-2 border-gray-200 text-gray-600 font-bold text-sm
                           hover:border-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateTeam}
                disabled={!isFormValid || isCreatingTeam}
                className={`flex-1 py-3 font-bold text-sm transition-all flex items-center justify-center gap-2
                  ${isFormValid && !isCreatingTeam
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
              >
                {isCreatingTeam ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
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

export default Marketplace;

