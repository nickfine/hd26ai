import { useState, useEffect } from 'react';
import adaptLogo from '../../adaptlogo.png';
import {
  Cpu,
  Heart,
  Scale,
  Users,
  Plus,
  Search,
  ArrowLeft,
  ChevronRight,
  User,
  Send,
  X,
  Mail,
  Check,
  Menu,
} from 'lucide-react';
import { ALLEGIANCE_CONFIG } from '../data/mockData';

function Marketplace({ 
  user, 
  teams, 
  freeAgents = [],
  allegianceStyle, 
  onNavigate, 
  onNavigateToTeam,
  onSendInvite,
  onInviteResponse,
  initialTab = 'teams',
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // Filter free agents by allegiance
  const allegianceFilteredAgents = freeAgents.filter((agent) => {
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

  const AllegianceIcon = {
    human: Heart,
    neutral: Scale,
    ai: Cpu,
  }[user?.allegiance || 'neutral'];

  return (
    <div
      className={`min-h-screen bg-gray-50 ${allegianceStyle.font} transition-all duration-300`}
    >
      {/* Header */}
      <header
        className={`border-b-2 px-4 sm:px-6 py-4 bg-white transition-all duration-300`}
        style={{ borderColor: allegianceStyle.borderColor }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Back to Dashboard */}
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="p-2 -ml-2 text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-bold">Back to Mission Control</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <img src={adaptLogo} alt="Adaptavist" className="h-6 w-auto" />
            <span className="font-bold text-sm tracking-tight hidden sm:inline">HACKDAY 2026</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* User Info - Clickable to Profile */}
            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
            >
              <div
                className={`w-8 h-8 flex items-center justify-center ${allegianceStyle.borderRadius}`}
                style={{
                  backgroundColor: allegianceStyle.bgColor,
                  border: `2px solid ${allegianceStyle.borderColor}`,
                }}
              >
                <AllegianceIcon
                  className="w-4 h-4"
                  style={{ color: allegianceStyle.color }}
                />
              </div>
              <div className="text-sm text-left hidden sm:block">
                <div className="font-bold text-gray-900">{user?.name}</div>
                <div className="text-xs text-gray-500">
                  {captainedTeam ? 'Team Captain' : 'Free Agent'}
                </div>
              </div>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex relative">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 border-r border-gray-200 bg-white min-h-[calc(100vh-65px)] p-6
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Close button for mobile */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>

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
              
              <div className="space-y-3">
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

          {/* ALLEGIANCE FILTER - KEY FEATURE */}
          <div className="mb-6">
            <div className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">
              Filter by Allegiance
            </div>
            <div className="space-y-2">
              {['human', 'ai', 'neutral'].map((side) => {
                const config = ALLEGIANCE_CONFIG[side];
                const isActive = filterAllegiance === side;
                const Icon = { human: Heart, neutral: Scale, ai: Cpu }[side];

                return (
                  <button
                    type="button"
                    key={side}
                    onClick={() => {
                      setFilterAllegiance(side);
                      setSidebarOpen(false);
                    }}
                    className={`w-full p-3 flex items-center gap-3 transition-all duration-200
                      ${config.borderRadius} border-2
                      ${
                        isActive
                          ? ''
                          : 'border-gray-200 hover:border-gray-400 bg-white'
                      }`}
                    style={
                      isActive
                        ? {
                            borderColor: config.borderColor,
                            backgroundColor: config.bgColor,
                          }
                        : {}
                    }
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{ color: isActive ? config.color : '#9ca3af' }}
                    />
                    <span
                      className={`font-bold text-sm ${
                        side === 'ai' ? 'font-mono' : ''
                      }`}
                      style={{ color: isActive ? config.color : '#374151' }}
                    >
                      {side === 'neutral' ? 'All' : config.label}
                    </span>
                    {isActive && (
                      <span className="ml-auto text-xs text-gray-400">
                        ACTIVE
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Create Team */}
          <button
            type="button"
            className={`w-full py-3 flex items-center justify-center gap-2 
                       bg-gray-900 text-white font-bold text-sm
                       hover:bg-gray-800 transition-all duration-200
                       ${allegianceStyle.borderRadius}`}
          >
            <Plus className="w-4 h-4" />
            CREATE TEAM
          </button>

          {/* Info */}
          <div className="mt-6 p-3 border border-gray-200 bg-gray-50 text-xs text-gray-500">
            <strong className="text-gray-700">Tip:</strong> Filter by allegiance
            to see teams for a specific side. Select All to view everything.
          </div>
        </aside>

        {/* Main Content - Marketplace */}
        <main className="flex-1 p-4 sm:p-6 w-full lg:w-auto">
          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden mb-4 p-2 -ml-2 text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            <Menu className="w-5 h-5" />
            <span className="text-sm font-bold">Filters</span>
          </button>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                TEAMS
              </h1>
              <p className="text-sm text-gray-500">
                Find your team or recruit free agents
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={activeTab === 'teams' ? 'Search teams or skills...' : 'Search people or skills...'}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border-2 border-gray-200 
                           focus:border-gray-900 focus:outline-none
                           text-sm"
              />
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('teams')}
              className={`px-4 py-2 font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap
                         ${activeTab === 'teams' 
                           ? 'bg-gray-900 text-white' 
                           : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-gray-400'}`}
            >
              TEAMS
              <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                activeTab === 'teams' ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {allegianceFilteredTeams.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('people')}
              className={`px-4 py-2 font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap
                         ${activeTab === 'people' 
                           ? 'bg-gray-900 text-white' 
                           : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-gray-400'}`}
            >
              FREE AGENTS
              <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                activeTab === 'people' ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {allegianceFilteredAgents.length}
              </span>
            </button>
          </div>

          {/* Allegiance Filter Indicator */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-2 mb-6 text-sm
                        ${ALLEGIANCE_CONFIG[filterAllegiance].borderRadius}`}
            style={{
              backgroundColor: ALLEGIANCE_CONFIG[filterAllegiance].bgColor,
              border: `1px solid ${ALLEGIANCE_CONFIG[filterAllegiance].borderColor}`,
              color: ALLEGIANCE_CONFIG[filterAllegiance].color,
            }}
          >
            {filterAllegiance === 'human' && <Heart className="w-4 h-4" />}
            {filterAllegiance === 'ai' && <Cpu className="w-4 h-4" />}
            {filterAllegiance === 'neutral' && <Scale className="w-4 h-4" />}
            <span className="text-xs sm:text-sm">
              {filterAllegiance === 'neutral'
                ? `Showing all ${activeTab}`
                : `Showing ${ALLEGIANCE_CONFIG[filterAllegiance].label} ${activeTab}`}
            </span>
          </div>

          {/* Teams Grid */}
          {activeTab === 'teams' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
                {filteredTeams.map((team) => {
                  const teamConfig = ALLEGIANCE_CONFIG[team.side];
                  const TeamIcon = team.side === 'ai' ? Cpu : Heart;
                  const hasApplied = team.joinRequests?.some((r) => r.userName === user?.name);

                  return (
                    <div
                      key={team.id}
                      className={`p-4 sm:p-5 bg-white transition-all duration-200 hover:shadow-lg
                                 border-2 ${teamConfig.borderRadius}
                                 ${team.side === 'ai' ? 'border-dashed' : ''}`}
                      style={{ borderColor: teamConfig.borderColor }}
                    >
                      {/* Team Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 flex-shrink-0 flex items-center justify-center ${teamConfig.borderRadius}`}
                            style={{
                              backgroundColor: teamConfig.bgColor,
                            }}
                          >
                            <TeamIcon
                              className="w-5 h-5"
                              style={{ color: teamConfig.color }}
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3
                                className={`font-bold text-gray-900 truncate ${
                                  team.side === 'ai' ? 'font-mono' : ''
                                }`}
                              >
                                {team.name}
                              </h3>
                              {hasApplied && (
                                <span className="px-2 py-0.5 text-xs font-bold uppercase bg-amber-100 text-amber-600 rounded-full">
                                  Applied
                                </span>
                              )}
                            </div>
                            <span
                              className="text-xs font-bold uppercase"
                              style={{ color: teamConfig.color }}
                            >
                              {team.side === 'ai' ? 'AI SIDE' : 'HUMAN SIDE'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500 flex-shrink-0">
                          <Users className="w-4 h-4" />
                          <span>
                            {team.members.length}/{team.maxMembers}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{team.description}</p>

                      {/* Looking For */}
                      <div className="mb-4">
                        <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">
                          Looking For
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {team.lookingFor.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className={`px-2 py-1 text-xs border ${teamConfig.borderRadius}`}
                              style={{
                                borderColor: teamConfig.borderColor,
                                color: teamConfig.color,
                                backgroundColor: teamConfig.bgColor,
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                          {team.lookingFor.length > 3 && (
                            <span className="px-2 py-1 text-xs text-gray-400">
                              +{team.lookingFor.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action */}
                      <button
                        type="button"
                        onClick={() => onNavigateToTeam(team.id)}
                        className={`w-full py-2 flex items-center justify-center gap-2
                                   font-bold text-sm transition-all
                                   ${teamConfig.borderRadius}`}
                        style={{
                          backgroundColor: teamConfig.color,
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
                <div className="text-center py-12 text-gray-400">
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

                  return (
                    <div
                      key={agent.id}
                      className={`p-4 sm:p-5 bg-white transition-all duration-200 hover:shadow-lg
                                 border-2 ${agentConfig.borderRadius}
                                 ${agent.allegiance === 'ai' ? 'border-dashed' : ''}`}
                      style={{ borderColor: agentConfig.borderColor }}
                    >
                      {/* Agent Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 flex-shrink-0 flex items-center justify-center ${agentConfig.borderRadius}`}
                            style={{
                              backgroundColor: agentConfig.bgColor,
                            }}
                          >
                            <AgentIcon
                              className="w-5 h-5"
                              style={{ color: agentConfig.color }}
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3
                                className={`font-bold text-gray-900 truncate ${
                                  agent.allegiance === 'ai' ? 'font-mono' : ''
                                }`}
                              >
                                {agent.name}
                              </h3>
                              {hasInvited && (
                                <span className="px-2 py-0.5 text-xs font-bold uppercase bg-blue-100 text-blue-600 rounded-full">
                                  Invited
                                </span>
                              )}
                            </div>
                            <span
                              className="text-xs font-bold uppercase"
                              style={{ color: agentConfig.color }}
                            >
                              {agentConfig.label} · FREE AGENT
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500 flex-shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{agent.bio}</p>

                      {/* Skills */}
                      <div className="mb-4">
                        <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">
                          Skills
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {agent.skills?.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className={`px-2 py-1 text-xs border ${agentConfig.borderRadius}`}
                              style={{
                                borderColor: agentConfig.borderColor,
                                color: agentConfig.color,
                                backgroundColor: agentConfig.bgColor,
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                          {agent.skills?.length > 3 && (
                            <span className="px-2 py-1 text-xs text-gray-400">
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
                          className={`w-full py-2 flex items-center justify-center gap-2
                                     font-bold text-sm transition-all
                                     ${agentConfig.borderRadius}`}
                          style={{
                            backgroundColor: agentConfig.color,
                            color: 'white',
                          }}
                        >
                          <Send className="w-4 h-4" />
                          INVITE TO TEAM
                        </button>
                      )}
                      {captainedTeam && hasInvited && (
                        <div
                          className={`w-full py-2 flex items-center justify-center gap-2
                                     font-bold text-sm text-gray-400 border-2 border-gray-200
                                     ${agentConfig.borderRadius}`}
                        >
                          <Check className="w-4 h-4" />
                          INVITE SENT
                        </div>
                      )}
                      {!captainedTeam && (
                        <div
                          className={`w-full py-2 flex items-center justify-center gap-2
                                     text-sm text-gray-400 border border-gray-200 bg-gray-50
                                     ${agentConfig.borderRadius}`}
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
                <div className="text-center py-12 text-gray-400">
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
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-4 sm:px-6 py-4 bg-white">
        <div className="max-w-7xl mx-auto text-center text-xs text-gray-400">
          WIREFRAME PROTOTYPE — Allegiance:{' '}
          <span style={{ color: allegianceStyle.color }}>
            {ALLEGIANCE_CONFIG[user?.allegiance || 'neutral'].label.toUpperCase()}
          </span>
        </div>
      </footer>

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
    </div>
  );
}

export default Marketplace;

