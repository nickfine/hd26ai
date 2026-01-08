import { useState, useMemo, useEffect } from 'react';
import {
  Shield,
  Settings,
  Users,
  Trophy,
  Star,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  ChevronRight,
  ChevronLeft,
  BarChart3,
  Gavel,
  Megaphone,
  UserCog,
  RefreshCw,
  Search,
  X,
  ChevronDown,
  Check,
  Loader2,
} from 'lucide-react';
import { EVENT_PHASE_ORDER } from '../data/mockData';
import AppLayout from './AppLayout';

// Role configuration for UI display
const ROLE_CONFIG = {
  participant: {
    label: 'Participant',
    icon: Users,
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    textColor: 'text-cyan-700',
    badgeBg: 'bg-cyan-100',
    badgeText: 'text-cyan-800',
  },
  ambassador: {
    label: 'Ambassador',
    icon: Megaphone,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    badgeBg: 'bg-green-100',
    badgeText: 'text-green-800',
  },
  judge: {
    label: 'Judge',
    icon: Gavel,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
  },
  admin: {
    label: 'Admin',
    icon: Shield,
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-800',
  },
};

// ============================================================================
// COMPONENT
// ============================================================================

function AdminPanel({
  user,
  teams = [],
  allegianceStyle,
  onNavigate,
  eventPhase,
  onPhaseChange,
  eventPhases = {},
  onUpdateUserRole,
  allUsers = [],
  usersLoading = false,
  onRefreshUsers,
  event,
  onUpdateMotd,
}) {
  const [activeSection, setActiveSection] = useState('overview'); // 'overview' | 'phases' | 'users'
  const [confirmPhaseChange, setConfirmPhaseChange] = useState(null);
  const [motd, setMotd] = useState(event?.motd || '');
  const [isSavingMotd, setIsSavingMotd] = useState(false);

  // Sync MOTD state when event changes
  useEffect(() => {
    setMotd(event?.motd || '');
  }, [event?.motd]);
  
  // User management state
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [roleChangeConfirm, setRoleChangeConfirm] = useState(null); // { userId, userName, currentRole, newRole }
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [roleUpdateFeedback, setRoleUpdateFeedback] = useState(null); // { type: 'success' | 'error', message }
  const [roleFilterDropdownOpen, setRoleFilterDropdownOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState('all'); // 'all' | 'participant' | 'ambassador' | 'judge' | 'admin'
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const USERS_PER_PAGE = 8;

  // Calculate stats
  const stats = useMemo(() => {
    const submittedProjects = teams.filter((t) => t.submission?.status === 'submitted');
    const totalVotes = submittedProjects.reduce(
      (sum, t) => sum + (t.submission?.participantVotes || 0),
      0
    );
    const totalJudgeScores = submittedProjects.reduce(
      (sum, t) => sum + (t.submission?.judgeScores?.length || 0),
      0
    );
    const fullyJudged = submittedProjects.filter(
      (t) => (t.submission?.judgeScores?.length || 0) >= 3
    ).length;

    const humanTeams = teams.filter((t) => t.side === 'human');
    const aiTeams = teams.filter((t) => t.side === 'ai');
    const totalMembers = teams.reduce((sum, t) => sum + (t.members?.length || 0), 0);

    return {
      totalTeams: teams.length,
      humanTeams: humanTeams.length,
      aiTeams: aiTeams.length,
      submittedProjects: submittedProjects.length,
      totalVotes,
      totalJudgeScores,
      fullyJudged,
      totalMembers,
    };
  }, [teams]);

  // Get phase info
  const currentPhaseInfo = eventPhases[eventPhase] || { label: 'Unknown', description: '' };
  const currentPhaseIndex = EVENT_PHASE_ORDER.indexOf(eventPhase);

  // Handle phase change
  const handlePhaseChange = (newPhase) => {
    if (confirmPhaseChange === newPhase) {
      onPhaseChange(newPhase);
      setConfirmPhaseChange(null);
    } else {
      setConfirmPhaseChange(newPhase);
    }
  };

  // ============================================================================
  // RENDER: OVERVIEW SECTION
  // ============================================================================
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Current Phase Card */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-6 h-6" />
          <span className="text-sm font-bold uppercase tracking-wide opacity-80">
            Current Event Phase
          </span>
        </div>
        <h2 className="text-3xl font-black mb-2">{currentPhaseInfo.label}</h2>
        <p className="opacity-80">{currentPhaseInfo.description}</p>
        <div className="mt-4 flex items-center gap-2">
          <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-500"
              style={{
                width: `${((currentPhaseIndex + 1) / EVENT_PHASE_ORDER.length) * 100}%`,
              }}
            />
          </div>
          <span className="text-sm font-bold">
            {currentPhaseIndex + 1}/{EVENT_PHASE_ORDER.length}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border-2 border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-gray-400" />
            <span className="text-xs font-bold text-gray-500 uppercase">Teams</span>
          </div>
          <div className="text-3xl font-black text-gray-900">{stats.totalTeams}</div>
          <div className="text-xs text-gray-500 mt-1">
            <span className="text-green-600">{stats.humanTeams} human</span>
            {' · '}
            <span className="text-cyan-600">{stats.aiTeams} AI</span>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold text-gray-500 uppercase">Submissions</span>
          </div>
          <div className="text-3xl font-black text-gray-900">{stats.submittedProjects}</div>
          <div className="text-xs text-gray-500 mt-1">projects submitted</div>
        </div>

        <div className="bg-white border-2 border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold text-gray-500 uppercase">Votes</span>
          </div>
          <div className="text-3xl font-black text-gray-900">{stats.totalVotes}</div>
          <div className="text-xs text-gray-500 mt-1">total votes cast</div>
        </div>

        <div className="bg-white border-2 border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Gavel className="w-5 h-5 text-purple-500" />
            <span className="text-xs font-bold text-gray-500 uppercase">Judging</span>
          </div>
          <div className="text-3xl font-black text-gray-900">{stats.fullyJudged}</div>
          <div className="text-xs text-gray-500 mt-1">fully judged</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border-2 border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onNavigate('analytics')}
            className="flex items-center gap-3 p-4 border-2 border-gray-200 hover:border-purple-400 transition-colors text-left"
          >
            <BarChart3 className="w-6 h-6 text-purple-500" />
            <div>
              <div className="font-bold text-gray-900">View Analytics</div>
              <div className="text-xs text-gray-500">See voting results & rankings</div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 ml-auto" />
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('phases')}
            className="flex items-center gap-3 p-4 border-2 border-gray-200 hover:border-amber-400 transition-colors text-left"
          >
            <Clock className="w-6 h-6 text-amber-500" />
            <div>
              <div className="font-bold text-gray-900">Manage Phases</div>
              <div className="text-xs text-gray-500">Change event phase</div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 ml-auto" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('marketplace')}
            className="flex items-center gap-3 p-4 border-2 border-gray-200 hover:border-green-400 transition-colors text-left"
          >
            <Users className="w-6 h-6 text-green-500" />
            <div>
              <div className="font-bold text-gray-900">View Teams</div>
              <div className="text-xs text-gray-500">Browse all teams</div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 ml-auto" />
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('users')}
            className="flex items-center gap-3 p-4 border-2 border-gray-200 hover:border-blue-400 transition-colors text-left"
          >
            <UserCog className="w-6 h-6 text-blue-500" />
            <div>
              <div className="font-bold text-gray-900">Manage Users</div>
              <div className="text-xs text-gray-500">Assign roles</div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 ml-auto" />
          </button>
        </div>
      </div>

      {/* Alerts / Warnings */}
      {stats.submittedProjects > 0 && stats.fullyJudged < stats.submittedProjects && (
        <div className="bg-amber-50 border-2 border-amber-200 p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-amber-900">Judging Incomplete</div>
            <p className="text-sm text-amber-700">
              {stats.submittedProjects - stats.fullyJudged} projects still need to be fully judged
              (3+ judge scores required).
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // Handle MOTD update
  const handleSaveMotd = async () => {
    if (!onUpdateMotd) return;
    setIsSavingMotd(true);
    const result = await onUpdateMotd(motd);
    setIsSavingMotd(false);
    if (result?.error) {
      alert(`Error updating MOTD: ${result.error}`);
    }
  };

  // ============================================================================
  // RENDER: PHASES SECTION
  // ============================================================================
  const renderPhases = () => (
    <div className="space-y-6">
      {/* MOTD Editor - Only show during hacking phase */}
      {eventPhase === 'hacking' && (
        <div className="bg-white border-2 border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-2">Message of the Day (MOTD)</h3>
          <p className="text-sm text-gray-500 mb-4">
            Update the message displayed in the hero banner during the hacking phase.
          </p>
          <textarea
            value={motd}
            onChange={(e) => setMotd(e.target.value)}
            placeholder="Enter your message of the day..."
            className="w-full px-3 py-2 border-2 border-gray-200 rounded mb-3 min-h-[120px] focus:outline-none focus:border-purple-500"
            disabled={isSavingMotd}
          />
          <button
            type="button"
            onClick={handleSaveMotd}
            disabled={isSavingMotd}
            className="px-4 py-2 bg-purple-600 text-white font-bold rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSavingMotd ? 'Saving...' : 'Save MOTD'}
          </button>
        </div>
      )}

      <div className="bg-white border-2 border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-2">Event Phase Control</h3>
        <p className="text-sm text-gray-500 mb-6">
          Change the current phase of the hackday event. This affects what features are available
          to participants.
        </p>

        <div className="space-y-3">
          {EVENT_PHASE_ORDER.map((phaseKey, idx) => {
            const phase = eventPhases[phaseKey];
            const isCurrent = eventPhase === phaseKey;
            const isPast = idx < currentPhaseIndex;
            const isNext = idx === currentPhaseIndex + 1;
            const isConfirming = confirmPhaseChange === phaseKey;

            return (
              <div
                key={phaseKey}
                className={`p-4 border-2 transition-all ${
                  isCurrent
                    ? 'border-purple-500 bg-purple-50'
                    : isPast
                    ? 'border-gray-200 bg-gray-50 opacity-60'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Status indicator */}
                  <div
                    className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full font-bold
                      ${isCurrent ? 'bg-purple-500 text-white' : ''}
                      ${isPast ? 'bg-green-100 text-green-600' : ''}
                      ${!isCurrent && !isPast ? 'bg-gray-100 text-gray-400' : ''}
                    `}
                  >
                    {isPast ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : isCurrent ? (
                      <Play className="w-5 h-5" />
                    ) : (
                      idx + 1
                    )}
                  </div>

                  {/* Phase info */}
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">{phase?.label}</div>
                    <div className="text-xs text-gray-500">{phase?.description}</div>
                  </div>

                  {/* Action */}
                  {!isCurrent && !isPast && (
                    <button
                      type="button"
                      onClick={() => handlePhaseChange(phaseKey)}
                      className={`px-4 py-2 text-sm font-bold transition-all ${
                        isConfirming
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : isNext
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {isConfirming ? 'Click to Confirm' : 'Activate'}
                    </button>
                  )}

                  {isCurrent && (
                    <span className="px-4 py-2 text-sm font-bold bg-purple-100 text-purple-600">
                      Current
                    </span>
                  )}

                  {isPast && (
                    <span className="px-4 py-2 text-sm font-bold bg-green-100 text-green-600">
                      Completed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {confirmPhaseChange && (
          <div className="mt-4 p-4 bg-red-50 border-2 border-red-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-red-900">Confirm Phase Change</div>
                <p className="text-sm text-red-700">
                  Are you sure you want to change to <strong>{eventPhases[confirmPhaseChange]?.label}</strong>?
                  This will affect all participants. Click the button again to confirm.
                </p>
                <button
                  type="button"
                  onClick={() => setConfirmPhaseChange(null)}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 font-bold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Filter users based on search and role filter
  const filteredUsers = useMemo(() => {
    // Reset to page 1 when filters change (done via effect below)
    return allUsers.filter((u) => {
      // Search filter
      const matchesSearch =
        userSearchTerm === '' ||
        u.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(userSearchTerm.toLowerCase());

      // Role filter
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [allUsers, userSearchTerm, roleFilter]);

  // Reset page when filters change
  const resetPage = () => setCurrentPage(1);

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const endIndex = startIndex + USERS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
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
  };

  // Handle role change initiation
  const handleRoleChangeClick = (targetUser, newRole) => {
    if (targetUser.role === newRole) return;
    setRoleChangeConfirm({
      userId: targetUser.id,
      userName: targetUser.name,
      currentRole: targetUser.role,
      newRole,
    });
  };

  // Handle role change confirmation
  const handleRoleChangeConfirm = async () => {
    if (!roleChangeConfirm || !onUpdateUserRole) return;

    setIsUpdatingRole(true);
    setRoleUpdateFeedback(null);

    try {
      const result = await onUpdateUserRole(roleChangeConfirm.userId, roleChangeConfirm.newRole);
      if (result?.error) {
        setRoleUpdateFeedback({ type: 'error', message: result.error });
      } else {
        setRoleUpdateFeedback({
          type: 'success',
          message: `${roleChangeConfirm.userName} is now a ${ROLE_CONFIG[roleChangeConfirm.newRole]?.label}`,
        });
        setRoleChangeConfirm(null);
      }
    } catch (err) {
      setRoleUpdateFeedback({ type: 'error', message: err.message || 'Failed to update role' });
    } finally {
      setIsUpdatingRole(false);
      // Auto-dismiss success feedback after 3 seconds
      setTimeout(() => setRoleUpdateFeedback(null), 3000);
    }
  };

  // ============================================================================
  // RENDER: USERS SECTION
  // ============================================================================
  const renderUsers = () => (
    <div className="space-y-6">
      <div className="bg-white border-2 border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-bold text-gray-900 mb-1">User Role Management</h3>
            <p className="text-sm text-gray-500">
              Search users and assign roles. Changes take effect immediately.
            </p>
          </div>
          <button
            type="button"
            onClick={onRefreshUsers}
            disabled={usersLoading}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 border border-gray-200 hover:border-gray-400 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${usersLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Role Legend */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {Object.entries(ROLE_CONFIG).map(([roleKey, config]) => {
            const Icon = config.icon;
            const count = allUsers.filter((u) => u.role === roleKey).length;
            return (
              <div key={roleKey} className={`p-3 ${config.bgColor} border ${config.borderColor}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${config.textColor}`} />
                  <span className={`font-bold text-sm ${config.textColor}`}>{config.label}</span>
                </div>
                <p className="text-xs text-gray-500">{count} users</p>
              </div>
            );
          })}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={userSearchTerm}
              onChange={(e) => { setUserSearchTerm(e.target.value); resetPage(); }}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-sm"
            />
            {userSearchTerm && (
              <button
                type="button"
                onClick={() => { setUserSearchTerm(''); resetPage(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Role Filter Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setRoleFilterDropdownOpen(!roleFilterDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 hover:border-gray-400 transition-colors text-sm font-medium text-gray-700 w-full sm:w-auto"
            >
              {roleFilter === 'all' ? 'All Roles' : ROLE_CONFIG[roleFilter]?.label}
              <ChevronDown className="w-4 h-4" />
            </button>
            {roleFilterDropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white border-2 border-gray-200 shadow-lg z-10">
                <button
                  type="button"
                  onClick={() => {
                    setRoleFilter('all');
                    setRoleFilterDropdownOpen(false);
                    resetPage();
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between
                    ${roleFilter === 'all' ? 'bg-purple-50 text-purple-700' : 'text-gray-700'}`}
                >
                  All Roles
                  {roleFilter === 'all' && <Check className="w-4 h-4" />}
                </button>
                {Object.entries(ROLE_CONFIG).map(([roleKey, config]) => (
                  <button
                    key={roleKey}
                    type="button"
                    onClick={() => {
                      setRoleFilter(roleKey);
                      setRoleFilterDropdownOpen(false);
                      resetPage();
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between
                      ${roleFilter === roleKey ? 'bg-purple-50 text-purple-700' : 'text-gray-700'}`}
                  >
                    {config.label}
                    {roleFilter === roleKey && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Feedback Toast */}
        {roleUpdateFeedback && (
          <div
            className={`mb-4 p-3 flex items-center gap-2 text-sm font-medium
              ${roleUpdateFeedback.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : ''}
              ${roleUpdateFeedback.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : ''}`}
          >
            {roleUpdateFeedback.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
            {roleUpdateFeedback.type === 'error' && <AlertTriangle className="w-4 h-4" />}
            {roleUpdateFeedback.message}
            <button
              type="button"
              onClick={() => setRoleUpdateFeedback(null)}
              className="ml-auto p-1 hover:opacity-70"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Users List */}
        {usersLoading ? (
          <div className="py-12 text-center">
            <Loader2 className="w-8 h-8 mx-auto mb-3 text-purple-500 animate-spin" />
            <p className="text-sm text-gray-500">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-gray-200">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <h4 className="font-bold text-gray-600 mb-1">No Users Found</h4>
            <p className="text-sm text-gray-500">
              {userSearchTerm
                ? 'Try a different search term'
                : roleFilter !== 'all'
                ? `No ${ROLE_CONFIG[roleFilter]?.label}s found`
                : 'No users in the system'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-xs text-gray-500 mb-2">
              Showing {startIndex + 1}–{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
              {filteredUsers.length !== allUsers.length && ` (${allUsers.length} total)`}
            </div>
            {paginatedUsers.map((targetUser) => {
              const roleConfig = ROLE_CONFIG[targetUser.role] || ROLE_CONFIG.participant;
              const RoleIcon = roleConfig.icon;
              const isCurrentUser = targetUser.id === user?.id;

              return (
                <div
                  key={targetUser.id}
                  className={`p-4 border-2 border-gray-100 hover:border-gray-200 transition-colors
                    ${isCurrentUser ? 'bg-purple-50/50' : 'bg-white'}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* User Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Avatar */}
                      {targetUser.image ? (
                        <img
                          src={targetUser.image}
                          alt={targetUser.name}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-500 font-bold text-sm">
                            {targetUser.name?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        </div>
                      )}

                      {/* Name & Email */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-gray-900 truncate">
                            {targetUser.name}
                          </span>
                          {isCurrentUser && (
                            <span className="px-2 py-0.5 text-xs font-bold bg-purple-100 text-purple-700 rounded-full">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 truncate">{targetUser.email}</div>
                      </div>
                    </div>

                    {/* Current Role Badge */}
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium ${roleConfig.badgeBg} ${roleConfig.badgeText}`}
                      >
                        <RoleIcon className="w-4 h-4" />
                        {roleConfig.label}
                      </div>

                      {/* Role Selector */}
                      <select
                        value={targetUser.role}
                        onChange={(e) => handleRoleChangeClick(targetUser, e.target.value)}
                        disabled={isCurrentUser}
                        className={`px-3 py-2 border-2 border-gray-200 text-sm font-medium focus:border-purple-500 focus:outline-none
                          ${isCurrentUser ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer hover:border-gray-400'}`}
                        title={isCurrentUser ? "You can't change your own role" : 'Change role'}
                      >
                        {Object.entries(ROLE_CONFIG).map(([roleKey, config]) => (
                          <option key={roleKey} value={roleKey}>
                            {config.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </div>
                
                <div className="flex items-center gap-1">
                  {/* Previous Button */}
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={`p-2 border-2 transition-colors
                      ${currentPage === 1
                        ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                        : 'border-gray-200 text-gray-600 hover:border-purple-400 hover:text-purple-600'
                      }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Page Numbers */}
                  {getPageNumbers().map((page, idx) => (
                    page === '...' ? (
                      <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
                    ) : (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`min-w-[36px] h-9 px-2 border-2 text-sm font-medium transition-colors
                          ${currentPage === page
                            ? 'border-purple-500 bg-purple-500 text-white'
                            : 'border-gray-200 text-gray-600 hover:border-purple-400'
                          }`}
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
                    className={`p-2 border-2 transition-colors
                      ${currentPage === totalPages
                        ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                        : 'border-gray-200 text-gray-600 hover:border-purple-400 hover:text-purple-600'
                      }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Role Change Confirmation Modal */}
      {roleChangeConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Confirm Role Change</h2>
              <button
                type="button"
                onClick={() => setRoleChangeConfirm(null)}
                className="p-1 text-gray-400 hover:text-gray-600"
                disabled={isUpdatingRole}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Change <span className="font-bold">{roleChangeConfirm.userName}</span> from{' '}
                <span className={`font-bold ${ROLE_CONFIG[roleChangeConfirm.currentRole]?.textColor}`}>
                  {ROLE_CONFIG[roleChangeConfirm.currentRole]?.label}
                </span>{' '}
                to{' '}
                <span className={`font-bold ${ROLE_CONFIG[roleChangeConfirm.newRole]?.textColor}`}>
                  {ROLE_CONFIG[roleChangeConfirm.newRole]?.label}
                </span>
                ?
              </p>

              <div className="p-3 bg-amber-50 border border-amber-200 text-sm text-amber-800">
                <AlertTriangle className="w-4 h-4 inline mr-2" />
                This change takes effect immediately and affects user permissions.
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRoleChangeConfirm(null)}
                disabled={isUpdatingRole}
                className="flex-1 py-2.5 border-2 border-gray-200 text-gray-600 font-bold text-sm hover:border-gray-400 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRoleChangeConfirm}
                disabled={isUpdatingRole}
                className="flex-1 py-2.5 bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isUpdatingRole ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Confirm Change
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  return (
    <AppLayout
      user={user}
      teams={teams}
      allegianceStyle={allegianceStyle}
      onNavigate={onNavigate}
      eventPhase={eventPhase}
      activeNav="admin"
    >
      <div className="p-4 sm:p-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-black text-gray-900">ADMIN PANEL</h1>
          </div>
          <p className="text-gray-600">
            Manage the hackday event, phases, and user roles.
          </p>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Overview', icon: Settings },
            { id: 'phases', label: 'Event Phases', icon: Clock },
            { id: 'users', label: 'User Roles', icon: UserCog },
          ].map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap
                  ${
                    activeSection === section.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {section.label}
              </button>
            );
          })}
        </div>

        {/* Section Content */}
        {activeSection === 'overview' && renderOverview()}
        {activeSection === 'phases' && renderPhases()}
        {activeSection === 'users' && renderUsers()}
      </div>
    </AppLayout>
  );
}

export default AdminPanel;

