/**
 * AppLayout Component
 * Main layout wrapper providing consistent header, sidebar navigation, and footer.
 */

import { useState, useEffect, memo, useCallback, useMemo } from 'react';
import adaptLogo from '../../adaptlogo.png';
import {
  Clock,
  Users,
  User,
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
  Menu,
  X,
  Star,
  ChevronRight,
  ChevronDown,
  Sparkles,
  UserPlus,
  Settings,
  Wrench,
} from 'lucide-react';
import Badge, { RoleBadge } from './ui/Badge';
import NavItem, { NavGroup } from './shared/NavItem';
import { Container, HStack, VStack } from './layout';
import Avatar from './ui/Avatar';
import { cn, formatNameWithCallsign } from '../lib/design-system';
import { USER_ROLES, EVENT_PHASE_ORDER, EVENT_PHASES as EVENT_PHASES_CONFIG } from '../data/mockData';
import { 
  createUKDate, 
  convertUKTimeToLocal, 
  getUserTimezone, 
  getTimezoneAbbr,
  EVENT_TIMEZONE 
} from '../lib/timezone';

// ============================================================================
// WAR TIMER - Countdown to June 21, 2026 (UK time)
// ============================================================================

// Event times are in UK timezone (Europe/London)
// June 21, 2026 09:00 UK time = BST (UTC+1)
const EVENT_START = createUKDate('2026-06-21', '09:00');
const EVENT_END = createUKDate('2026-06-22', '17:00');

const calculateTimeRemaining = () => {
  const now = new Date();
  const userTimezone = getUserTimezone();
  const userTzAbbr = getTimezoneAbbr();
  
  if (now < EVENT_START) {
    const diff = EVENT_START - now;
    const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const months = Math.floor(totalDays / 30);
    const days = totalDays % 30;
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    let display;
    if (months > 0) {
      display = `${months}mo ${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else if (days > 0) {
      display = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else {
      display = `${hours}h ${minutes}m ${seconds}s`;
    }
    
    // Get event start time in user's local timezone
    const localStart = convertUKTimeToLocal('2026-06-21', '09:00', userTimezone);
    const userLocale = navigator.language || 'en-US';
    const localStartDate = EVENT_START.toLocaleDateString(userLocale, {
      timeZone: userTimezone,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    const localStartTime = localStart.time;
    
    // Format label with timezone info
    // If user is in UK, show simple label. Otherwise show both local and UK times
    const label = userTimezone === EVENT_TIMEZONE
      ? 'Until HackDay 2026 (09:00 UK)'
      : `Until ${localStartDate} ${localStartTime} (${userTzAbbr}) / 09:00 UK`;
    
    return { 
      status: 'countdown', 
      display, 
      label,
      localStartDate,
      localStartTime,
      userTzAbbr,
    };
  }
  
  if (now >= EVENT_START && now < EVENT_END) {
    const diff = EVENT_END - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { status: 'live', display: `${hours}h ${minutes}m ${seconds}s`, label: '⚡ EVENT LIVE ⚡' };
  }
  
  return { status: 'ended', display: '0h 0m 0s', label: 'Event Complete' };
};

// Isolated timer component to prevent parent re-renders
const WarTimer = memo(function WarTimer() {
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      className={cn(
        'hidden md:flex items-center gap-3 px-4 py-2 text-white rounded-card',
        timeRemaining.status === 'live' 
          ? 'bg-arena-elevated animate-pulse' 
          : timeRemaining.status === 'ended'
            ? 'bg-arena-card'
            : 'bg-arena-card'
      )}
      title={timeRemaining.status === 'countdown' && timeRemaining.localStartDate 
        ? `Event starts: ${timeRemaining.localStartDate} at ${timeRemaining.localStartTime} (${timeRemaining.userTzAbbr})`
        : undefined
      }
    >
      <Clock className="w-5 h-5 text-arena-secondary" />
      <div className="min-w-0">
        <div className="font-mono text-2xl font-bold tracking-wider text-white">
          {timeRemaining.display}
        </div>
        <div className={cn(
          'text-xs uppercase tracking-wide truncate',
          timeRemaining.status === 'live' ? 'text-white font-bold' : 'text-arena-secondary'
        )}>
          {timeRemaining.label}
        </div>
      </div>
    </div>
  );
});

// ============================================================================
// NAVIGATION ITEMS
// ============================================================================

const getNavItems = (userRole, eventPhase = 'voting', user = null) => {
  const baseItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  // Add Sign Up navigation item during registration phase or for users without a team
  const showSignup = eventPhase === 'registration' || (user && !user.teamId);
  if (showSignup) {
    baseItems.push({ id: 'signup', label: 'Sign Up', icon: UserPlus });
  }

  baseItems.push(
    { id: 'new-to-hackday', label: 'New to HackDay?', icon: Sparkles },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'rules', label: 'Rules', icon: BookOpen },
    { id: 'submission', label: 'Submission', icon: Send },
  );

  const permissions = USER_ROLES[userRole] || USER_ROLES.participant;

  if (permissions.canVote && eventPhase === 'voting') {
    baseItems.push({ id: 'voting', label: 'Voting', icon: Vote });
  }

  if (permissions.canJudge) {
    baseItems.push({ id: 'judge-scoring', label: 'Judge Scoring', icon: Gavel, highlight: 'amber' });
  }

  if (permissions.canViewAnalytics) {
    baseItems.push({ id: 'analytics', label: 'Analytics', icon: BarChart3, highlight: 'purple' });
  }

  if (permissions.canManage) {
    baseItems.push({ id: 'admin', label: 'Admin Panel', icon: Shield, highlight: 'purple' });
  }

  baseItems.push({ id: 'results', label: 'Results', icon: Trophy });

  return baseItems;
};

// ============================================================================
// COMPONENT
// ============================================================================

function AppLayout({
  user,
  teams = [],
  onNavigate,
  eventPhase = 'voting',
  activeNav = 'dashboard',
  children,
  showSidebar = true,
  isDevMode = false,
  devRoleOverride = null,
  onDevRoleChange = null,
  onPhaseChange = null,
  eventPhases = {},
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [devControlsOpen, setDevControlsOpen] = useState(false);
  
  // DEV MODE - Calculate if dev mode is active (requires env var AND admin role)
  const devModeActive = isDevMode || (
    import.meta.env.VITE_ENABLE_DEV_MODE === 'true' && 
    user?.role === 'admin'
  );

  // Mouse-reactive breathing vignette (throttled for performance)
  useEffect(() => {
    let rafId = null;
    let lastX = 0;
    let lastY = 0;
    
    const handleMouseMove = (e) => {
      // Only update if significant movement (throttle)
      const newX = (e.clientX / window.innerWidth) * 100;
      const newY = (e.clientY / window.innerHeight) * 100;
      
      if (Math.abs(newX - lastX) > 2 || Math.abs(newY - lastY) > 2) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          document.body.style.setProperty('--mouse-x', `${newX}%`);
          document.body.style.setProperty('--mouse-y', `${newY}%`);
          lastX = newX;
          lastY = newY;
        });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Memoize expensive calculations
  const captainedTeam = useMemo(() => 
    teams.find((team) => team.captainId === user?.id), 
    [teams, user?.id]
  );
  
  const userTeam = useMemo(() => 
    teams.find((team) => 
      team.captainId === user?.id || 
      team.members?.some(m => m.id === user?.id)
    ),
    [teams, user?.id]
  );
  
  const userCallsign = user?.callsign || userTeam?.members?.find(m => m.id === user?.id)?.callsign;

  const navItems = useMemo(() => getNavItems(user?.role, eventPhase, user), [user?.role, eventPhase, user]);
  
  // Team stats
  const teamStats = useMemo(() => {
    const totalTeams = teams.length;
    return {
      totalTeams,
    };
  }, [teams]);

  const handleNavClick = useCallback((itemId) => {
    setSidebarOpen(false);
    if (itemId === 'teams') {
      onNavigate('marketplace', { tab: 'teams' });
    } else {
      onNavigate(itemId);
    }
  }, [onNavigate]);

  return (
    <div className="min-h-screen bg-hackday text-white">
      {/* DEV MODE - Remove before production */}
      {devModeActive && (
        <div className="bg-yellow-500 text-black px-4 py-2 text-center text-sm font-bold sticky top-0 z-50">
          🔧 DEVELOPMENT MODE ACTIVE - Testing with real data
        </div>
      )}
      {/* ================================================================== */}
      {/* HEADER */}
      {/* ================================================================== */}
      <header className={`border-b border-arena-border px-4 sm:px-6 py-4 bg-arena-black ${devModeActive ? 'sticky top-[38px]' : 'sticky top-0'} z-40`}>
        <Container size="xl" padding="none">
          <HStack justify="between" align="center">
            {/* Mobile menu button */}
            {showSidebar && (
              <button
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 -ml-2 text-arena-secondary hover:text-white"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            {/* Logo */}
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <img src={adaptLogo} alt="Adaptavist" className="h-10 w-auto" />
              <div className="hidden sm:block">
                <div className="font-black text-lg tracking-tight text-white">HACKDAY 2026</div>
              </div>
            </button>

            {/* War Timer - Isolated component to prevent parent re-renders */}
            <WarTimer />

            {/* DEV MODE CONTROLS - Remove before production */}
            {devModeActive && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDevControlsOpen(!devControlsOpen)}
                  className={cn(
                    'bg-yellow-500 text-black border-2 border-yellow-600 flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer',
                    'transition-all duration-200 font-bold text-sm',
                    'hover:bg-yellow-400'
                  )}
                  title="Dev Mode Controls"
                >
                  <Wrench className="w-4 h-4" />
                  <span className="hidden sm:inline">DEV</span>
                  <ChevronDown className={cn('w-4 h-4 transition-transform', devControlsOpen && 'rotate-180')} />
                </button>
                
                {/* Dev Controls Dropdown */}
                {devControlsOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setDevControlsOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-64 bg-arena-card border-2 border-yellow-500 rounded-lg shadow-xl z-50 p-4">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-arena-border">
                          <Wrench className="w-5 h-5 text-yellow-500" />
                          <span className="font-bold text-white">Dev Controls</span>
                        </div>
                        
                        {/* Role Impersonation */}
                        <div>
                          <label className="text-xs font-bold text-arena-secondary mb-2 block">
                            Role Impersonation
                          </label>
                          <select
                            value={devRoleOverride || user?.role || 'participant'}
                            onChange={(e) => {
                              const newRole = e.target.value;
                              const realRole = user?.role || 'participant';
                              onDevRoleChange?.(newRole === realRole ? null : newRole);
                            }}
                            className="w-full px-3 py-2 bg-arena-elevated border border-arena-border rounded text-white text-sm focus:outline-none focus:border-yellow-500"
                          >
                            <option value={user?.role || 'participant'}>Real: {user?.role || 'participant'}</option>
                            <option value="participant">Participant</option>
                            <option value="ambassador">Ambassador</option>
                            <option value="judge">Judge</option>
                            <option value="admin">Admin</option>
                          </select>
                          {devRoleOverride && (
                            <p className="mt-1 text-xs text-yellow-500">
                              Impersonating: {devRoleOverride}
                            </p>
                          )}
                        </div>
                        
                        {/* Phase Switcher */}
                        {onPhaseChange && (
                          <div>
                            <label className="text-xs font-bold text-arena-secondary mb-2 block">
                              Event Phase
                            </label>
                            <select
                              value={eventPhase}
                              onChange={(e) => {
                                onPhaseChange(e.target.value);
                                setDevControlsOpen(false);
                              }}
                              className="w-full px-3 py-2 bg-arena-elevated border border-arena-border rounded text-white text-sm focus:outline-none focus:border-yellow-500"
                            >
                              {Object.entries(eventPhases).map(([key, phase]) => (
                                <option key={key} value={key}>{phase.label}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* User Quick Access */}
            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className={cn(
                'bg-arena-card border border-arena-border flex items-center gap-3 sm:gap-4 px-3 sm:px-5 py-2 sm:py-3 rounded-2xl cursor-pointer',
                'transition-all duration-300 group',
                'hover:-translate-y-0.5'
              )}
            >
              {/* Team info - hidden on mobile */}
              {userTeam && (
                <div className="hidden sm:flex items-center gap-3">
                  <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl flex items-center justify-center shadow-lg bg-arena-elevated">
                    <Users className="w-5 h-5 text-text-secondary" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-white text-sm">
                      {userTeam.name}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {captainedTeam ? 'Team Captain' : 'Team Member'}
                    </p>
                  </div>
                  {/* Divider */}
                  <div className="hidden lg:block h-10 w-px bg-arena-border/50 mx-1" />
                </div>
              )}

              {/* User avatar + name */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative">
                  <Avatar user={user} size="md" />
                  {captainedTeam?.joinRequests?.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                      {captainedTeam.joinRequests.length}
                    </div>
                  )}
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-semibold text-white text-sm">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {userCallsign || (userTeam ? 'Team Member' : 'Free Agent')}
                  </p>
                </div>
              </div>

              {/* Chevron arrow */}
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1 text-text-secondary" />
            </button>
          </HStack>
        </Container>
      </header>

      {/* ================================================================== */}
      {/* EVENT STATUS BAR */}
      {/* ================================================================== */}
      <div className="border-b border-arena-border bg-arena-card px-4 sm:px-6 py-3">
        <Container size="xl" padding="none">
          {/* Mobile: Compact current phase display */}
          <div className="sm:hidden">
            {(() => {
              const currentPhaseIndex = EVENT_PHASE_ORDER.indexOf(eventPhase);
              const currentPhase = EVENT_PHASES_CONFIG[eventPhase];
              return (
                <div className="flex items-center justify-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-arena-muted">Phase</span>
                    <span className="text-xs font-bold text-text-secondary">{currentPhaseIndex + 1}/{EVENT_PHASE_ORDER.length}</span>
                  </div>
                  <div className="h-4 w-px bg-arena-border" />
                  <span className="text-sm font-bold text-white">{currentPhase?.label}</span>
                  <div className="h-4 w-px bg-arena-border" />
                  <div className="flex gap-1">
                    {EVENT_PHASE_ORDER.map((_, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          'w-2 h-2 rounded-full',
                          idx < currentPhaseIndex ? 'bg-white' : idx === currentPhaseIndex ? 'bg-text-secondary' : 'bg-arena-border'
                        )}
                      />
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Desktop: Full phase timeline */}
          <HStack justify="center" gap="4" className="hidden sm:flex">
            {EVENT_PHASE_ORDER.map((phaseKey, index) => {
              const phase = EVENT_PHASES_CONFIG[phaseKey];
              const currentPhaseIndex = EVENT_PHASE_ORDER.indexOf(eventPhase);
              const isActive = phaseKey === eventPhase;
              const isComplete = index < currentPhaseIndex;
              return (
                <HStack key={phaseKey} gap="0" align="center">
                  <HStack gap="1" align="center">
                    <div className={cn(
                      'w-6 h-6 flex items-center justify-center text-xs font-bold rounded',
                      isComplete 
                        ? 'bg-white text-arena-bg' 
                        : isActive 
                          ? 'bg-text-secondary text-white animate-pulse' 
                          : 'bg-arena-border text-arena-muted'
                    )}>
                      {isComplete ? '✓' : index + 1}
                    </div>
                    <span className={cn(
                      'text-xs font-bold whitespace-nowrap',
                      isActive ? 'text-text-secondary' : isComplete ? 'text-white' : 'text-arena-muted'
                    )}>
                      {phase?.label}
                    </span>
                  </HStack>
                  {index < EVENT_PHASE_ORDER.length - 1 && (
                    <div className={cn(
                      'w-8 h-0.5 mx-2',
                      isComplete ? 'bg-white' : 'bg-arena-border'
                    )} />
                  )}
                </HStack>
              );
            })}
          </HStack>
        </Container>
      </div>

      {/* ================================================================== */}
      {/* MAIN LAYOUT */}
      {/* ================================================================== */}
      <Container size="xl" padding="none">
        <div className="flex flex-col lg:flex-row">
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
            <aside className={cn(
              'fixed lg:static inset-y-0 left-0 z-50',
              'w-[280px] bg-arena-black',
              'transform transition-transform duration-300 ease-in-out',
              sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
              'overflow-y-auto'
            )}>
              <div className="p-4 sm:p-6 space-y-6">
                {/* Close button for mobile */}
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden absolute top-4 right-4 p-2 text-arena-muted hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Role Badge */}
                {user?.role && user.role !== 'participant' && (
                  <div className="p-3 border-2 border-arena-border rounded-card flex items-center gap-2 bg-arena-elevated">
                    {user.role === 'judge' && <Gavel className="w-5 h-5 text-text-secondary" />}
                    {user.role === 'admin' && <Shield className="w-5 h-5 text-text-secondary" />}
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-text-secondary">
                        {user.role === 'judge' ? 'Judge' : user.role === 'admin' ? 'Admin' : 'Ambassador'}
                      </div>
                      <div className="text-xs text-arena-secondary">
                        {user.role === 'judge' && 'Score submitted projects'}
                        {user.role === 'admin' && 'Full event access'}
                        {user.role === 'ambassador' && 'Event ambassador'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Menu */}
                <NavGroup label="Navigation">
                  {navItems.map((item) => (
                    <NavItem
                      key={item.id}
                      icon={<item.icon />}
                      active={activeNav === item.id}
                      highlight={item.highlight}
                      onClick={() => handleNavClick(item.id)}
                    >
                      {item.label}
                    </NavItem>
                  ))}
                  <NavItem
                    icon={<LogOut />}
                    onClick={() => onNavigate('signout')}
                    className="mt-4 text-arena-muted hover:text-white"
                  >
                    Sign Out
                  </NavItem>
                </NavGroup>

                {/* Team Stats */}
                <div className="p-4 border-2 border-arena-border rounded-card">
                  <div className="text-xs font-bold uppercase tracking-wide text-arena-secondary mb-3">
                    Team Status
                  </div>
                  <div className="pt-2 text-center">
                    <span className="text-xs text-arena-secondary">{teamStats.totalTeams} teams registered</span>
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* ================================================================ */}
          {/* MAIN CONTENT */}
          {/* ================================================================ */}
          <main className={cn('flex-1', showSidebar && 'min-h-[calc(100vh-200px)]')}>
            {children}
          </main>
        </div>
      </Container>

      {/* Footer */}
      <footer className="border-t border-arena-border px-4 sm:px-6 py-4 bg-arena-black mt-6">
        <Container size="xl" padding="none">
          <HStack justify="between" className="text-xs text-arena-muted">
            <span>MISSION CONTROL v1.0</span>
          </HStack>
        </Container>
      </footer>
    </div>
  );
}

export default memo(AppLayout);
