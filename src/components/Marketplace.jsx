import { useState, useEffect, memo, useCallback, useMemo } from 'react';
import {
  Eye,
  Users,
  Plus,
  Search,
  ChevronRight,
  ChevronLeft,
  User,
  Send,
  X,
  Mail,
  Check,
  Grid3x3,
  Rows,
  Clock,
} from 'lucide-react';
import { SKILLS } from '../data/mockData';
import { cn } from '../lib/design-system';
import AppLayout from './AppLayout';
import { StatusBanner } from './shared';

function Marketplace({ 
  user, 
  teams, 
  freeAgents = [],
  onNavigate, 
  onNavigateToTeam,
  onSendInvite,
  onInviteResponse,
  onCreateTeam,
  initialTab = 'teams',
  eventPhase,
  userInvites = [], // Invites for the current user (from Supabase)
  devRoleOverride = null,
  onDevRoleChange = null,
  onPhaseChange = null,
  eventPhases = {},
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(initialTab);
  const [inviteModalAgent, setInviteModalAgent] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'row'
  const [currentPage, setCurrentPage] = useState(1);
  const [teamsPerPage] = useState(12); // Items per page

  // Sync activeTab when initialTab prop changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  const [inviteMessage, setInviteMessage] = useState('');

  // Create Team Modal State
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    lookingFor: [],
    maxMembers: 6,
  });

  // Find the team the user is captain of (if any) - memoized
  const captainedTeam = useMemo(() => 
    teams.find((team) => team.captainId === user?.id),
    [teams, user?.id]
  );

  // All teams (no filtering)
  const allTeams = useMemo(() => teams, [teams]);

  // Filter and sort teams - memoized
  const filteredTeams = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    const filtered = allTeams.filter(
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
  }, [allTeams, searchTerm, user?.name]);

  // Pagination calculations for teams
  const totalPages = useMemo(() => Math.ceil(filteredTeams.length / teamsPerPage), [filteredTeams.length, teamsPerPage]);
  const startIndex = (currentPage - 1) * teamsPerPage;
  const endIndex = startIndex + teamsPerPage;
  const paginatedTeams = useMemo(() => filteredTeams.slice(startIndex, endIndex), [filteredTeams, startIndex, endIndex]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Generate page numbers for pagination
  const getPageNumbers = useCallback(() => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end of visible range
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if at the beginning
      if (currentPage <= 2) {
        end = 4;
      }
      // Adjust if at the end
      if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }
      
      // Add ellipsis if needed
      if (start > 2) pages.push('...');
      
      // Add middle pages
      for (let i = start; i <= end; i++) pages.push(i);
      
      // Add ellipsis if needed
      if (end < totalPages - 1) pages.push('...');
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  }, [totalPages, currentPage]);

  // Filter free agents - memoized
  const allAgents = useMemo(() => freeAgents.filter((agent) => {
    // Exclude current user from the list
    if (agent.id === user?.id || agent.name === user?.name) return false;
    return true;
  }), [freeAgents, user?.id, user?.name]);

  // Filter free agents by search - memoized
  const filteredAgents = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return allAgents.filter(
      (agent) =>
        agent.name.toLowerCase().includes(searchLower) ||
        agent.bio?.toLowerCase().includes(searchLower) ||
        agent.skills?.some((skill) =>
          skill.toLowerCase().includes(searchLower)
        )
    );
  }, [allAgents, searchTerm]);

  // Find current user's pending invites
  // Priority: use userInvites prop (from Supabase), fallback to freeAgents data (for demo mode)
  const currentUserAgent = freeAgents.find((a) => a.id === user?.id);
  const allInvites = userInvites.length > 0 
    ? userInvites.map(invite => ({
        id: invite.id,
        teamId: invite.teamId,
        teamName: invite.teamName,
        message: invite.message || '',
        timestamp: invite.createdAt,
        expiresAt: invite.expiresAt,
        status: invite.status,
        isExpired: invite.isExpired || invite.status === 'EXPIRED',
      }))
    : (currentUserAgent?.teamInvites || []);
  
  // Filter to only pending (non-expired) invites for the main display
  const pendingInvites = allInvites.filter(invite => 
    invite.status === 'PENDING' && !invite.isExpired
  );
  
  // Separate expired invites for display
  const expiredInvites = allInvites.filter(invite => 
    invite.status === 'EXPIRED' || invite.isExpired
  );
  
  // Calculate time until expiration
  const getTimeUntilExpiration = (expiresAt) => {
    if (!expiresAt) return null;
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry - now;
    if (diffMs <= 0) return null;
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h`;
    const minutes = Math.floor(diffMs / (1000 * 60));
    return `${minutes}m`;
  };

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
  }, [newTeam, onCreateTeam, onNavigateToTeam]);

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
      onNavigate={onNavigate}
      eventPhase={eventPhase}
      activeNav="teams"
      devRoleOverride={devRoleOverride}
      onDevRoleChange={onDevRoleChange}
      onPhaseChange={onPhaseChange}
      eventPhases={eventPhases}
      userInvites={userInvites}
    >
      <div className="p-4 sm:p-6">
        {/* Status Banner */}
        <div className="mb-6">
          <StatusBanner
            user={user}
            teams={teams}
            userInvites={userInvites}
            onNavigate={onNavigate}
            eventPhase={eventPhase}
          />
        </div>

        {/* Pending Invites - For Free Agents */}
        {pendingInvites.length > 0 && (
          <div className="bg-arena-card border border-arena-border p-4 mb-6 rounded-card">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold uppercase tracking-wide text-arena-secondary">
                Team Invites
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-arena-elevated text-text-secondary rounded-full">
                <Mail className="w-3 h-3" />
                <span className="text-xs font-bold">{pendingInvites.length}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {pendingInvites.map((invite) => {
                const timeUntilExpiry = getTimeUntilExpiration(invite.expiresAt);
                return (
                  <div key={invite.id} className="p-3 bg-arena-elevated border border-arena-border rounded-lg">
                    <div className="flex items-start justify-between mb-1">
                      <div className="font-bold text-sm text-white">
                        {invite.teamName}
                      </div>
                      {timeUntilExpiry && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 rounded text-xs text-amber-400">
                          <Clock className="w-3 h-3" />
                          {timeUntilExpiry}
                        </div>
                      )}
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
                                   transition-all hover:-translate-y-0.5 bg-arena-elevated border border-arena-border"
                      >
                        <Check className="w-3 h-3" />
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => onInviteResponse(user?.id, invite.id, false)}
                        className="flex-1 py-1.5 text-xs font-bold text-arena-secondary bg-arena-card border border-arena-border rounded-lg
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
            
            {/* Expired Invites Section */}
            {expiredInvites.length > 0 && (
              <div className="mt-4 pt-4 border-t border-arena-border">
                <div className="text-xs font-bold uppercase tracking-wide text-arena-muted mb-3">
                  Expired Invites
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {expiredInvites.map((invite) => (
                    <div key={invite.id} className="p-3 bg-arena-elevated border border-arena-border rounded-lg opacity-60">
                      <div className="flex items-start justify-between mb-1">
                        <div className="font-bold text-sm text-white">
                          {invite.teamName}
                        </div>
                        <div className="px-2 py-0.5 bg-red-500/20 border border-red-500/30 rounded text-xs text-red-400">
                          Expired
                        </div>
                      </div>
                      {invite.message && (
                        <p className="text-xs text-arena-muted mb-2 line-clamp-2">
                          "{invite.message}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="bg-arena-card border border-arena-border inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4">
            <Users className="w-5 h-5 text-text-secondary" />
            <span className="font-bold text-sm text-white">FIND YOUR SQUAD</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 font-display">
            IDEAS
          </h1>
          <p className="text-arena-secondary max-w-2xl mx-auto mb-6">
            Browse open ideas looking for members or discover free agents with matching skills.
          </p>

          {/* Search */}
          <div className="relative w-full max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-arena-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={activeTab === 'teams' ? 'Search ideas or skills...' : 'Search people or skills...'}
              className="w-full pl-12 pr-4 py-3 bg-arena-card border border-arena-border
                         focus:border-brand/50 focus:outline-none text-white placeholder-arena-muted
                         text-sm rounded-xl transition-all"
            />
          </div>
        </div>

          {/* Filter and Tab Switcher Row */}
          <div className="flex flex-col gap-4 mb-6">
            {/* Tab Switcher + Create Team + View Toggle */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('teams')}
                className={`px-4 py-2 font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap rounded-lg backdrop-blur-md
                           ${activeTab === 'teams' 
                             ? 'bg-gradient-to-r from-[#FF8A50] to-[#FF4500] text-white shadow-[0_0_20px_rgba(255,107,53,0.3)]' 
                             : 'bg-arena-card border border-arena-border text-arena-secondary hover:border-brand/30 hover:text-white'}`}
              >
                IDEAS
                <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                  activeTab === 'teams' ? 'bg-white/20' : 'bg-arena-elevated'
                }`}>
                  {allTeams.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('people')}
                className={`px-4 py-2 font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap rounded-lg backdrop-blur-md
                           ${activeTab === 'people' 
                             ? 'bg-gradient-to-r from-[#FF8A50] to-[#FF4500] text-white shadow-[0_0_20px_rgba(255,107,53,0.3)]' 
                             : 'bg-arena-card border border-arena-border text-arena-secondary hover:border-brand/30 hover:text-white'}`}
              >
                FREE AGENTS
                <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                  activeTab === 'people' ? 'bg-white/20' : 'bg-arena-elevated'
                }`}>
                  {allAgents.length}
                </span>
              </button>
              
              {/* Spacer to push Create Team and filters to the right on larger screens */}
              <div className="hidden sm:block flex-1" />
              
              {/* View Mode Toggle - Only show for teams tab */}
              {activeTab === 'teams' && (
                <div className="flex items-center gap-1 bg-arena-card border border-arena-border p-1 rounded-lg backdrop-blur-md">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-all rounded ${
                      viewMode === 'grid'
                        ? 'bg-gradient-to-r from-[#FF8A50] to-[#FF4500] text-white shadow-[0_0_15px_rgba(255,107,53,0.25)]'
                        : 'text-arena-secondary hover:text-white'
                    }`}
                    title="Grid View"
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('row')}
                    className={`p-2 transition-all rounded ${
                      viewMode === 'row'
                        ? 'bg-gradient-to-r from-[#FF8A50] to-[#FF4500] text-white shadow-[0_0_15px_rgba(255,107,53,0.25)]'
                        : 'text-arena-secondary hover:text-white'
                    }`}
                    title="Row View"
                  >
                    <Rows className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {!userTeam && (
                <button
                  type="button"
                  onClick={() => setShowCreateTeamModal(true)}
                  className="px-4 py-2 font-bold text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 text-white 
                             hover:from-emerald-400 hover:to-emerald-500 hover:-translate-y-0.5
                             transition-all flex items-center gap-2 whitespace-nowrap rounded-lg shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  CREATE IDEA
                </button>
              )}
            </div>

          </div>

          {/* Teams Grid */}
          {activeTab === 'teams' && (
            <>
              <div className={cn(
                'grid gap-4',
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-2' 
                  : 'grid-cols-1 md:grid-cols-2'
              )}>
                {paginatedTeams.map((team) => {
                  const hasApplied = team.joinRequests?.some((r) => r.userName === user?.name);

                  return (
                    <div
                      key={team.id}
                      className={cn(
                        "bg-arena-card border border-arena-border p-4 sm:p-5 transition-all duration-300",
                        "hover:-translate-y-1",
                        "rounded-card",
                        viewMode === 'row' && "md:col-span-2"
                      )}
                    >
                      {/* Team Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-arena-elevated">
                            <Users className="w-5 h-5 text-text-secondary" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-white truncate">
                                {team.name}
                              </h3>
                              {hasApplied && (
                                <span className="px-2 py-0.5 text-xs font-bold uppercase bg-warning/20 text-warning rounded-full">
                                  Applied
                                </span>
                              )}
                            </div>
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
                              className="px-2.5 py-1 text-xs border border-arena-border rounded-lg transition-transform hover:scale-105 bg-arena-elevated text-text-secondary"
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
                        className="w-full h-12 flex items-center justify-center gap-2
                                   font-semibold text-sm transition-all duration-300 
                                   hover:-translate-y-1 rounded-xl
                                   bg-arena-elevated border border-arena-border text-white hover:bg-arena-card"
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
                      : 'No teams available.'}
                  </p>
                </div>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 mt-6 border-t border-arena-border">
                  <div className="text-sm text-arena-secondary">
                    Page {currentPage} of {totalPages} ({filteredTeams.length} teams)
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {/* Previous Button */}
                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className={cn(
                        "p-2 border-2 transition-colors rounded-lg",
                        currentPage === 1
                          ? 'border-arena-border text-arena-muted cursor-not-allowed'
                          : 'border-arena-border text-arena-secondary hover:border-brand/50 hover:text-white'
                      )}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Page Numbers */}
                    {getPageNumbers().map((page, idx) => (
                      page === '...' ? (
                        <span key={`ellipsis-${idx}`} className="px-2 text-arena-muted">...</span>
                      ) : (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={cn(
                            "min-w-[36px] h-9 px-2 border-2 text-sm font-medium transition-colors rounded-lg",
                            currentPage === page
                              ? 'border-brand bg-gradient-to-r from-[#FF8A50] to-[#FF4500] text-white shadow-[0_0_15px_rgba(255,107,53,0.25)]'
                              : 'border-arena-border text-arena-secondary hover:border-brand/50 hover:text-white'
                          )}
                        >
                          {page}
                        </button>
                      )
                    ))}

                    {/* Next Button */}
                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className={cn(
                        "p-2 border-2 transition-colors rounded-lg",
                        currentPage === totalPages
                          ? 'border-arena-border text-arena-muted cursor-not-allowed'
                          : 'border-arena-border text-arena-secondary hover:border-brand/50 hover:text-white'
                      )}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* People Grid */}
          {activeTab === 'people' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
                {filteredAgents.map((agent) => {
                  const hasInvited = agent.teamInvites?.some((i) => i.teamId === captainedTeam?.id);

                  return (
                    <div
                      key={agent.id}
                      className="bg-arena-card border border-arena-border p-4 sm:p-5 transition-all duration-300 
                                 hover:-translate-y-1 hover:shadow-2xl
                                 border-l-4 border-arena-border rounded-card"
                    >
                      {/* Agent Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-arena-elevated">
                            <User className="w-5 h-5 text-text-secondary" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-white truncate">
                                {agent.name}
                              </h3>
                              {hasInvited && (
                                <span className="px-2 py-0.5 text-xs font-bold uppercase bg-warning/20 text-warning rounded-full">
                                  Invited
                                </span>
                              )}
                            </div>
                            <span className="text-xs font-bold uppercase text-text-secondary">
                              FREE AGENT
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
                              className="px-2.5 py-1 text-xs border border-arena-border text-text-secondary rounded-lg bg-arena-elevated"
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
                          className="w-full h-12 flex items-center justify-center gap-2
                                     font-semibold text-sm transition-all duration-300 
                                     hover:-translate-y-1 hover:shadow-2xl rounded-xl shadow-lg
                                     bg-arena-elevated border border-arena-border text-white hover:bg-arena-border"
                        >
                          <Send className="w-4 h-4" />
                          INVITE TO TEAM
                        </button>
                      )}
                      {captainedTeam && hasInvited && (
                        <div
                          className="w-full h-12 flex items-center justify-center gap-2
                                     font-bold text-sm text-arena-muted bg-arena-card border border-arena-border rounded-xl"
                        >
                          <Check className="w-4 h-4" />
                          INVITE SENT
                        </div>
                      )}
                      {!captainedTeam && (
                        <div
                          className="w-full h-12 flex items-center justify-center gap-2
                                     text-sm text-arena-muted bg-arena-card border border-arena-border rounded-xl
                                     bg-gradient-to-r from-brand/20 to-transparent border-t border-brand/30"
                        >
                          Create an idea to send invites
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
          <div className="bg-arena-card border border-arena-border p-4 sm:p-6 max-w-md w-full mx-4 shadow-2xl rounded-card">
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
          <div className="bg-arena-card border border-arena-border p-4 sm:p-6 max-w-lg w-full mx-4 shadow-2xl my-8 rounded-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-white">CREATE YOUR IDEA</h2>
              <button
                type="button"
                onClick={() => setShowCreateTeamModal(false)}
                className="p-1 text-arena-muted hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Project Idea */}
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wide text-arena-secondary mb-2">
                Project Idea <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={newTeam.name}
                onChange={(e) => setNewTeam((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your project idea"
                className="w-full p-3 border-2 border-arena-border bg-arena-card text-white placeholder-arena-muted
                           focus:border-brand focus:outline-none text-sm rounded-lg"
                maxLength={50}
              />
              {newTeam.name.length > 0 && newTeam.name.length < 3 && (
                <p className="text-xs text-error mt-1">Idea must be at least 3 characters</p>
              )}
            </div>


            {/* Description */}
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wide text-arena-secondary mb-2">
                Description <span className="text-error">*</span>
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
                  <p className="text-xs text-error">Description must be at least 10 characters</p>
                ) : (
                  <span />
                )}
                <p className="text-xs text-arena-muted">{newTeam.description.length}/500</p>
              </div>
            </div>

            {/* Looking For Skills */}
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wide text-arena-secondary mb-2">
                Looking For <span className="text-error">*</span>
              </label>
              <p className="text-xs text-arena-muted mb-3">Select skills you're looking for in teammates</p>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((skill) => {
                  const isSelected = newTeam.lookingFor.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 text-xs font-medium border-2 transition-all rounded-full
                        ${isSelected
                          ? 'text-white bg-arena-elevated border-arena-border'
                          : 'border-arena-border text-arena-secondary hover:border-text-secondary'
                        }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
              {newTeam.lookingFor.length === 0 && (
                <p className="text-xs text-error mt-2">Select at least one skill</p>
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
                    Create Idea
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

