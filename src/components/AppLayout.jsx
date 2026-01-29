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
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import Badge, { RoleBadge } from './ui/Badge';
import NavItem, { NavGroup } from './shared/NavItem';
import { Container, HStack, VStack } from './layout';
import Avatar from './ui/Avatar';
import { PhaseIndicator } from './ui';
import { cn, formatNameWithCallsign } from '../lib/design-system';
import NotificationCenter from './shared/NotificationCenter';
import { useNotifications } from '../hooks/useNotifications';
import { useTheme } from '../hooks/useTheme';
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
        'hidden md:flex items-center gap-3 px-4 py-2 rounded-card border border-arena-border',
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
      <Clock className="w-5 h-5 text-text-secondary" />
      <div className="min-w-0">
        <div className="font-mono text-2xl font-bold tracking-wider text-text-primary">
          {timeRemaining.display}
        </div>
        <div className={cn(
          'text-xs uppercase tracking-wide truncate',
          timeRemaining.status === 'live' ? 'text-text-primary font-bold' : 'text-text-secondary'
        )}>
          {timeRemaining.label}
        </div>
      </div>
    </div>
  );
});

// ============================================================================
// THEME TOGGLE
// ============================================================================

const ThemeToggle = memo(function ThemeToggle() {
  const { theme, setTheme, resolvedTheme, isSystemTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
  ];

  const currentTheme = themes.find(t => t.id === theme) || themes[2];
  const CurrentIcon = currentTheme.icon;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center justify-center w-9 h-9 rounded-lg transition-all',
          'bg-arena-card border border-arena-border',
          'text-text-secondary hover:text-text-primary hover:bg-arena-elevated'
        )}
        title={`Theme: ${currentTheme.label}${isSystemTheme ? ` (${resolvedTheme})` : ''}`}
        aria-label="Toggle theme"
      >
        <CurrentIcon className="w-4 h-4" />
      </button>

      {/* Theme dropdown */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-36 bg-arena-card border border-arena-border rounded-lg shadow-xl z-50 py-1 overflow-hidden">
            {themes.map((t) => {
              const Icon = t.icon;
              const isActive = theme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors',
                    isActive 
                      ? 'bg-brand/10 text-brand' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-arena-elevated'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{t.label}</span>
                  {isActive && (
                    <span className="ml-auto text-brand">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
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
    { id: 'teams', label: 'Ideas', icon: Users },
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
  realUserRole = null,
  devRoleOverride = null,
  onDevRoleChange = null,
  onPhaseChange = null,
  eventPhases = {},
  userInvites = [],
  simulateLoading = false,
  onSimulateLoadingChange = null,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [devControlsOpen, setDevControlsOpen] = useState(false);
  
  // DEV MODE - Show for all users during development
  // TODO: REVERT BEFORE BETA - Change back to admin-only:
  //   const isRealAdmin = (realUserRole || user?.role) === 'admin';
  //   const devModeActive = isRealAdmin && (devRoleOverride || isDevMode);
  const isRealAdmin = true; // TEMPORARY: Show dev controls for all users
  
  // Dev mode is active when impersonating or in dev mode
  const devModeActive = devRoleOverride || isDevMode;

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
  
  // Notifications
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(user?.id);

  const handleNavClick = useCallback((itemId) => {
    setSidebarOpen(false);
    if (itemId === 'teams') {
      onNavigate('marketplace', { tab: 'teams' });
    } else {
      onNavigate(itemId);
    }
  }, [onNavigate]);

  return (
    <div className="min-h-screen bg-hackday text-text-primary">
      {/* Skip Link for Keyboard Navigation (WCAG 2.4.1) */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      {/* DEV MODE BANNER */}
      {devModeActive && (
        <div className="bg-yellow-500 text-black px-4 py-2 text-center text-sm font-bold sticky top-0 z-50">
          🔧 DEVELOPMENT MODE ACTIVE - Testing with real data
        </div>
      )}
      {/* ================================================================== */}
      {/* STICKY HEADER + EVENT BAR CONTAINER */}
      {/* ================================================================== */}
      <div className={`${devModeActive ? 'sticky top-[38px]' : 'sticky top-0'} z-40 bg-arena-black`}>
      {/* HEADER */}
      <header className="px-4 sm:px-6 py-4">
        <Container size="xl" padding="none">
          <HStack justify="between" align="center">
            {/* Mobile menu button */}
            {showSidebar && (
              <button
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 -ml-2 text-text-secondary hover:text-text-primary"
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
                <div className="font-black text-lg tracking-tight text-text-primary">HACKDAY 2026</div>
              </div>
            </button>

            {/* War Timer - Isolated component to prevent parent re-renders */}
            <WarTimer />

            {/* Notification Center */}
            {user?.id && (
              <NotificationCenter
                notifications={notifications}
                unreadCount={unreadCount}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
                onNavigate={onNavigate}
              />
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* DEV MODE CONTROLS - Single button with dropdown (visible to real admins, even when impersonating) */}
            {isRealAdmin && (
              <div className="relative z-[60]">
                <button
                  type="button"
                  onClick={() => setDevControlsOpen(!devControlsOpen)}
                  className={cn(
                    'flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-all',
                    devModeActive
                      ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                      : 'bg-arena-card border border-arena-border text-text-secondary hover:text-text-primary'
                  )}
                  title="Dev Controls"
                >
                  <Wrench className="w-3 h-3" />
                  <span className="hidden sm:inline">DEV</span>
                  <ChevronDown className={cn('w-3 h-3 transition-transform', devControlsOpen && 'rotate-180')} />
                </button>

                {/* Dev Controls Dropdown */}
                {devControlsOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-[55]" 
                      onClick={() => setDevControlsOpen(false)}
                    />
                    <div className="absolute left-0 top-full mt-2 w-64 bg-arena-card border-2 border-yellow-500 rounded-lg shadow-xl z-[60] p-4">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-arena-border">
                          <Wrench className="w-5 h-5 text-yellow-500" />
                          <span className="font-bold text-text-primary">Dev Controls</span>
                        </div>
                        
                        {/* Role Impersonation */}
                        {onDevRoleChange && (
                          <div>
                            <label className="text-xs font-bold text-text-muted mb-2 block">
                              Role Impersonation
                            </label>
                            <select
                              value={devRoleOverride || realUserRole || 'participant'}
                              onChange={(e) => {
                                const newRole = e.target.value;
                                const actualRole = realUserRole || 'participant';
                                onDevRoleChange?.(newRole === actualRole ? null : newRole);
                              }}
                              className="w-full px-3 py-2 bg-arena-elevated border border-arena-border rounded text-text-primary text-sm focus:outline-none focus:border-yellow-500"
                            >
                              <option value={realUserRole || 'participant'}>Real: {realUserRole || 'participant'}</option>
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
                        )}
                        
                        {/* Phase Switcher */}
                        {onPhaseChange && (
                          <div>
                            <label className="text-xs font-bold text-text-muted mb-2 block">
                              Event Phase
                            </label>
                            <select
                              value={eventPhase}
                              onChange={(e) => {
                                onPhaseChange(e.target.value);
                                setDevControlsOpen(false);
                              }}
                              className="w-full px-3 py-2 bg-arena-elevated border border-arena-border rounded text-text-primary text-sm focus:outline-none focus:border-yellow-500"
                            >
                              {Object.entries(eventPhases).map(([key, phase]) => (
                                <option key={key} value={key}>{phase.label}</option>
                              ))}
                            </select>
                          </div>
                        )}
                        
                        {/* Simulate Loading Toggle */}
                        {onSimulateLoadingChange && (
                          <div className="pt-3 border-t border-arena-border">
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={simulateLoading}
                                onChange={(e) => onSimulateLoadingChange(e.target.checked)}
                                className="w-4 h-4 rounded border-arena-border bg-arena-elevated accent-yellow-500"
                              />
                              <span className="text-sm text-text-primary">Simulate Loading</span>
                            </label>
                            {simulateLoading && (
                              <p className="mt-1 text-xs text-yellow-500">
                                Showing skeleton loading states
                              </p>
                            )}
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
                    <p className="font-bold text-text-primary text-sm">
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
                  {/* Join requests badge (for captains) */}
                  {captainedTeam?.joinRequests?.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                      {captainedTeam.joinRequests.length}
                    </div>
                  )}
                  {/* Team invites badge (for free agents) */}
                  {!userTeam && userInvites.filter(inv => inv.status === 'PENDING' && !inv.isExpired).length > 0 && (
                    <div 
                      className="absolute -top-1 -right-1 w-5 h-5 bg-brand text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse cursor-pointer"
                      title={`${userInvites.filter(inv => inv.status === 'PENDING' && !inv.isExpired).length} pending invite${userInvites.filter(inv => inv.status === 'PENDING' && !inv.isExpired).length !== 1 ? 's' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('marketplace', { tab: 'teams' });
                      }}
                    >
                      {userInvites.filter(inv => inv.status === 'PENDING' && !inv.isExpired).length}
                    </div>
                  )}
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-semibold text-text-primary text-sm">
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

      {/* EVENT STATUS BAR - Enhanced Phase Timeline */}
      <div className="border-b border-arena-border bg-arena-card px-4 sm:px-6 py-3">
        <Container size="xl" padding="none">
          {/* Mobile: Compact phase indicator */}
          <div className="sm:hidden">
            <PhaseIndicator 
              phases={EVENT_PHASES_CONFIG}
              currentPhase={eventPhase}
              compact
            />
          </div>

          {/* Desktop: Full animated phase timeline */}
          <div className="hidden sm:block">
            <PhaseIndicator 
              phases={EVENT_PHASES_CONFIG}
              currentPhase={eventPhase}
            />
          </div>
        </Container>
      </div>
      </div>
      {/* END STICKY HEADER + EVENT BAR CONTAINER */}

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
              'fixed lg:static inset-y-0 left-0',
              'w-[280px] bg-arena-black',
              'transform transition-transform duration-300 ease-in-out',
              sidebarOpen ? 'translate-x-0 z-50' : '-translate-x-full lg:translate-x-0 lg:z-30',
              'overflow-y-auto'
            )}>
              <div className="p-4 sm:p-6 space-y-6">
                {/* Close button for mobile */}
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden absolute top-4 right-4 p-2 text-text-muted hover:text-text-primary"
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
                    className="mt-4 text-text-muted hover:text-text-primary"
                  >
                    Sign Out
                  </NavItem>
                </NavGroup>

                {/* Idea Stats */}
                <div className="p-4 border-2 border-arena-border rounded-card">
                  <div className="text-xs font-bold uppercase tracking-wide text-arena-secondary mb-3">
                    Idea Status
                  </div>
                  <div className="pt-2 text-center">
                    <span className="text-xs text-arena-secondary">{teamStats.totalTeams} ideas registered</span>
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* ================================================================ */}
          {/* MAIN CONTENT */}
          {/* ================================================================ */}
          <main 
            id="main-content" 
            className={cn('flex-1', showSidebar && 'min-h-[calc(100vh-200px)]')}
            tabIndex={-1}
          >
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
