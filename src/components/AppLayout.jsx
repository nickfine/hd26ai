import { useState } from 'react';
import adaptLogo from '../../adaptlogo.png';
import {
  Clock,
  Users,
  User,
  Heart,
  Cpu,
  Scale,
  Calendar,
  Trophy,
  LogOut,
  BookOpen,
  BarChart3,
  Gavel,
  Shield,
  Vote,
  Send,
  LayoutDashboard,
  Download,
  Menu,
  X,
} from 'lucide-react';
import { ALLEGIANCE_CONFIG, USER_ROLES, EVENT_PHASE_ORDER, EVENT_PHASES as EVENT_PHASES_CONFIG } from '../data/mockData';

// ============================================================================
// NAVIGATION ITEMS
// ============================================================================

const getNavItems = (userRole, eventPhase = 'voting') => {
  const baseItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'rules', label: 'Rules', icon: BookOpen },
    { id: 'submission', label: 'Submission', icon: Send },
  ];

  const permissions = USER_ROLES[userRole] || USER_ROLES.participant;

  // Add voting for those who can vote (only during voting phase)
  if (permissions.canVote && eventPhase === 'voting') {
    baseItems.push({ id: 'voting', label: 'Voting', icon: Vote });
  }

  // Add judge scoring for judges
  if (permissions.canJudge) {
    baseItems.push({ id: 'judge-scoring', label: 'Judge Scoring', icon: Gavel, highlight: 'amber' });
  }

  // Add analytics for judges and admins
  if (permissions.canViewAnalytics) {
    baseItems.push({ id: 'analytics', label: 'Analytics', icon: BarChart3, highlight: 'purple' });
  }

  // Add admin panel for admins
  if (permissions.canManage) {
    baseItems.push({ id: 'admin', label: 'Admin Panel', icon: Shield, highlight: 'purple' });
  }

  // Results always at the end
  baseItems.push({ id: 'results', label: 'Results', icon: Trophy });

  return baseItems;
};

const ROLE_BADGES = {
  participant: { label: 'Participant', color: 'gray', icon: User },
  ambassador: { label: 'Ambassador', color: 'green', icon: null },
  judge: { label: 'Judge', color: 'amber', icon: Gavel },
  admin: { label: 'Admin', color: 'purple', icon: Shield },
};

// Helper to format name with callsign: "First 'Callsign' Last"
const formatNameWithCallsign = (name, callsign) => {
  if (!callsign || !name) return { formatted: name, hasCallsign: false };
  const parts = name.split(' ');
  if (parts.length < 2) return { formatted: name, hasCallsign: false };
  const firstName = parts[0];
  const lastName = parts.slice(1).join(' ');
  return { firstName, callsign, lastName, hasCallsign: true };
};

// ============================================================================
// COMPONENT
// ============================================================================

function AppLayout({
  user,
  teams = [],
  allegianceStyle,
  onNavigate,
  eventPhase = 'voting',
  activeNav = 'dashboard',
  children,
  showSidebar = true,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Find the team the user is captain of (if any)
  const captainedTeam = teams.find((team) => team.captainId === user?.id);
  
  // Find user's team (as member or captain)
  const userTeam = teams.find((team) => 
    team.captainId === user?.id || 
    team.members?.some(m => m.id === user?.id)
  );

  // Find user's callsign from their team membership
  const userCallsign = userTeam?.members?.find(m => m.id === user?.id)?.callsign;

  // Get nav items based on user role and event phase
  const navItems = getNavItems(user?.role, eventPhase);

  // Get role badge info
  const roleBadge = ROLE_BADGES[user?.role] || ROLE_BADGES.participant;

  // Calculate war stats
  const humanTeams = teams.filter(t => t.side === 'human').length;
  const aiTeams = teams.filter(t => t.side === 'ai').length;
  const totalTeams = humanTeams + aiTeams;
  const humanPercent = totalTeams > 0 ? Math.round((humanTeams / totalTeams) * 100) : 50;
  const aiPercent = totalTeams > 0 ? Math.round((aiTeams / totalTeams) * 100) : 50;

  const AllegianceIcon = {
    human: Heart,
    neutral: Scale,
    ai: Cpu,
  }[user?.allegiance || 'neutral'];

  const handleNavClick = (itemId) => {
    setSidebarOpen(false);
    if (itemId === 'teams') {
      onNavigate('marketplace', { tab: 'teams' });
    } else {
      onNavigate(itemId);
    }
  };

  return (
    <div className={`min-h-screen bg-white ${allegianceStyle?.font || 'font-sans'}`}>
      {/* ================================================================== */}
      {/* HEADER */}
      {/* ================================================================== */}
      <header className="border-b-2 border-gray-900 px-4 sm:px-6 py-4 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Mobile menu button */}
          {showSidebar && (
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={adaptLogo} alt="Adaptavist" className="h-10 w-auto" />
            <div className="hidden sm:block">
              <div className="font-black text-lg tracking-tight">HACKDAY 2026</div>
              <div className="text-xs text-gray-500 font-mono">HUMAN VS AI</div>
            </div>
          </div>

          {/* War Timer */}
          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-900 text-white">
            <Clock className="w-5 h-5" />
            <div>
              <div className="font-mono text-2xl font-bold tracking-wider">47:59:00</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Until June 21st 2026</div>
            </div>
          </div>

          {/* User Quick Access */}
          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="relative">
              <div
                className={`w-10 h-10 flex items-center justify-center ${allegianceStyle?.borderRadius || 'rounded-lg'}`}
                style={{
                  backgroundColor: allegianceStyle?.bgColor,
                  border: `2px solid ${allegianceStyle?.borderColor}`,
                }}
              >
                <AllegianceIcon className="w-5 h-5" style={{ color: allegianceStyle?.color }} />
              </div>
              {captainedTeam?.joinRequests?.length > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {captainedTeam.joinRequests.length}
                </div>
              )}
            </div>
            <div className="text-left hidden sm:block">
              <div className="font-bold text-gray-900 text-sm flex items-center gap-1 flex-wrap">
                {(() => {
                  const formatted = formatNameWithCallsign(user?.name, userCallsign);
                  if (!formatted.hasCallsign) return user?.name || 'Operator';
                  return (
                    <>
                      {formatted.firstName}
                      <span className={`px-1.5 py-0.5 text-xs font-bold rounded-full border bg-white
                          ${user?.allegiance === 'ai' 
                            ? 'border-cyan-500 text-cyan-700' 
                            : user?.allegiance === 'human' 
                              ? 'border-green-500 text-green-700' 
                              : 'border-gray-400 text-gray-600'}`}>
                        {formatted.callsign}
                      </span>
                      {formatted.lastName}
                    </>
                  );
                })()}
              </div>
              {captainedTeam ? (
                <>
                  <div className="text-xs text-gray-500">Captain</div>
                  <div className="text-xs font-medium" style={{ color: allegianceStyle?.color }}>
                    {captainedTeam.name}
                  </div>
                </>
              ) : userTeam ? (
                <div className="text-xs font-medium" style={{ color: allegianceStyle?.color }}>
                  {userTeam.name}
                </div>
              ) : (
                <div className="text-xs text-gray-500">Free Agent</div>
              )}
            </div>
          </button>
        </div>
      </header>

      {/* ================================================================== */}
      {/* EVENT STATUS BAR */}
      {/* ================================================================== */}
      <div className="border-b-2 border-gray-200 bg-gray-50 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto">
          {EVENT_PHASE_ORDER.map((phaseKey, index) => {
            const phase = EVENT_PHASES_CONFIG[phaseKey];
            const currentPhaseIndex = EVENT_PHASE_ORDER.indexOf(eventPhase);
            const isActive = phaseKey === eventPhase;
            const isComplete = index < currentPhaseIndex;
            return (
              <div key={phaseKey} className="flex items-center">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-6 h-6 flex items-center justify-center text-xs font-bold
                      ${isComplete 
                        ? 'bg-gray-900 text-white' 
                        : isActive 
                          ? 'bg-cyan-500 text-white animate-pulse' 
                          : 'bg-gray-300 text-gray-500'}`}
                  >
                    {isComplete ? '✓' : index + 1}
                  </div>
                  <span className={`text-xs font-bold whitespace-nowrap hidden sm:inline
                    ${isActive ? 'text-cyan-600' : isComplete ? 'text-gray-900' : 'text-gray-400'}`}>
                    {phase?.label}
                  </span>
                </div>
                {index < EVENT_PHASE_ORDER.length - 1 && (
                  <div className={`w-4 sm:w-8 h-0.5 mx-1 sm:mx-2
                    ${isComplete ? 'bg-gray-900' : 'bg-gray-300'}`} 
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ================================================================== */}
      {/* MAIN LAYOUT */}
      {/* ================================================================== */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && showSidebar && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ================================================================ */}
        {/* LEFT SIDEBAR */}
        {/* ================================================================ */}
        {showSidebar && (
          <aside className={`
            fixed lg:static inset-y-0 left-0 z-50
            w-[280px] border-r-0 lg:border-r-2 border-gray-200 bg-white
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            overflow-y-auto
          `}>
            <div className="p-4 sm:p-6 space-y-6">
              {/* Close button for mobile */}
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Role Badge */}
              {user?.role && user.role !== 'participant' && (
                <div
                  className={`p-3 border-2 flex items-center gap-2
                    ${roleBadge.color === 'amber' ? 'border-amber-300 bg-amber-50' : ''}
                    ${roleBadge.color === 'purple' ? 'border-purple-300 bg-purple-50' : ''}
                    ${roleBadge.color === 'green' ? 'border-green-300 bg-green-50' : ''}
                  `}
                >
                  {roleBadge.icon && (
                    <roleBadge.icon
                      className={`w-5 h-5
                        ${roleBadge.color === 'amber' ? 'text-amber-600' : ''}
                        ${roleBadge.color === 'purple' ? 'text-purple-600' : ''}
                        ${roleBadge.color === 'green' ? 'text-green-600' : ''}
                      `}
                    />
                  )}
                  <div>
                    <div
                      className={`text-xs font-bold uppercase tracking-wide
                        ${roleBadge.color === 'amber' ? 'text-amber-700' : ''}
                        ${roleBadge.color === 'purple' ? 'text-purple-700' : ''}
                        ${roleBadge.color === 'green' ? 'text-green-700' : ''}
                      `}
                    >
                      {roleBadge.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.role === 'judge' && 'Score submitted projects'}
                      {user.role === 'admin' && 'Full event access'}
                      {user.role === 'ambassador' && 'Recruit for your side'}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Menu */}
              <nav className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">
                  Navigation
                </div>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeNav === item.id;
                  const isHighlighted = item.highlight;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full px-3 py-2 flex items-center gap-3 text-sm font-bold transition-all
                        ${isActive 
                          ? 'bg-gray-900 text-white' 
                          : isHighlighted === 'amber'
                            ? 'text-amber-700 bg-amber-50 hover:bg-amber-100 border-l-4 border-amber-400'
                            : isHighlighted === 'purple'
                              ? 'text-purple-700 bg-purple-50 hover:bg-purple-100 border-l-4 border-purple-400'
                              : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => onNavigate('landing')}
                  className="w-full px-3 py-2 flex items-center gap-3 text-sm font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all mt-4"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </nav>

              {/* War Recruitment Status */}
              <div className="p-4 border-2 border-gray-200">
                <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">
                  War Recruitment Status
                </div>
                <div className="space-y-3">
                  {/* Human Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-bold text-green-600 flex items-center gap-1">
                        <Heart className="w-3 h-3" /> Human
                      </span>
                      <span className="font-mono font-bold">{humanPercent}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full transition-all duration-500"
                        style={{ width: `${humanPercent}%` }}
                      />
                    </div>
                  </div>
                  {/* AI Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-bold font-mono text-cyan-600 flex items-center gap-1">
                        <Cpu className="w-3 h-3" /> AI
                      </span>
                      <span className="font-mono font-bold">{aiPercent}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 overflow-hidden">
                      <div 
                        className="h-full bg-cyan-500 transition-all duration-500"
                        style={{ width: `${aiPercent}%` }}
                      />
                    </div>
                  </div>
                  {/* Total */}
                  <div className="pt-2 border-t border-gray-100 text-center">
                    <span className="text-xs text-gray-400">{totalTeams} teams registered</span>
                  </div>
                </div>
              </div>

              {/* Your Allegiance */}
              <div
                className={`p-4 border-2 ${allegianceStyle?.borderRadius || 'rounded-lg'}`}
                style={{ borderColor: allegianceStyle?.borderColor }}
              >
                <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">
                  Your Allegiance
                </div>
                <div className="flex gap-2 mb-3">
                  <div
                    className={`flex-1 p-3 border-2 rounded-xl text-center transition-all
                      ${user?.allegiance === 'human' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200'}`}
                  >
                    <Heart className={`w-6 h-6 mx-auto mb-1 ${user?.allegiance === 'human' ? 'text-green-600' : 'text-gray-300'}`} />
                    <div className={`text-xs font-bold ${user?.allegiance === 'human' ? 'text-green-600' : 'text-gray-400'}`}>
                      Human
                    </div>
                  </div>
                  <div
                    className={`flex-1 p-3 border-2 text-center transition-all
                      ${user?.allegiance === 'ai' 
                        ? 'border-cyan-500 bg-cyan-50 border-dashed' 
                        : 'border-gray-200'}`}
                  >
                    <Cpu className={`w-6 h-6 mx-auto mb-1 ${user?.allegiance === 'ai' ? 'text-cyan-600' : 'text-gray-300'}`} />
                    <div className={`text-xs font-bold font-mono ${user?.allegiance === 'ai' ? 'text-cyan-600' : 'text-gray-400'}`}>
                      AI
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full py-2 px-3 border-2 border-gray-200 text-gray-600 text-xs font-bold
                             hover:border-gray-400 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-3 h-3" />
                  Download Avatar
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* ================================================================ */}
        {/* MAIN CONTENT */}
        {/* ================================================================ */}
        <main className={`flex-1 ${showSidebar ? 'min-h-[calc(100vh-200px)]' : ''}`}>
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t-2 border-gray-200 px-4 sm:px-6 py-4 bg-white mt-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-gray-400">
          <span>MISSION CONTROL v1.0</span>
          <span>
            ALLEGIANCE:{' '}
            <span style={{ color: allegianceStyle?.color }} className="font-bold">
              {ALLEGIANCE_CONFIG[user?.allegiance || 'neutral'].label.toUpperCase()}
            </span>
          </span>
        </div>
      </footer>
    </div>
  );
}

export default AppLayout;

