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
  Menu,
  X,
  Star,
  ChevronRight,
} from 'lucide-react';
import Progress from './ui/Progress';
import Badge, { RoleBadge, AllegianceCapsule, StatusCapsule, HeartbeatDot } from './ui/Badge';
import NavItem, { NavGroup } from './shared/NavItem';
import { Container, HStack, VStack } from './layout';
import { AllegianceAvatar } from './ui/Avatar';
import { cn, getAllegianceConfig, formatNameWithCallsign, ALLEGIANCE_CONFIG } from '../lib/design-system';
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
          ? 'bg-gradient-to-r from-ai to-human animate-pulse' 
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

const getNavItems = (userRole, eventPhase = 'voting') => {
  const baseItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'rules', label: 'Rules', icon: BookOpen },
    { id: 'submission', label: 'Submission', icon: Send },
  ];

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
  allegianceStyle,
  onNavigate,
  eventPhase = 'voting',
  activeNav = 'dashboard',
  children,
  showSidebar = true,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const navItems = useMemo(() => getNavItems(user?.role, eventPhase), [user?.role, eventPhase]);
  const config = useMemo(() => getAllegianceConfig(user?.allegiance || 'neutral'), [user?.allegiance]);

  // War stats - memoized
  const warStats = useMemo(() => {
    const humanTeams = teams.filter(t => t.side === 'human').length;
    const aiTeams = teams.filter(t => t.side === 'ai').length;
    const totalTeams = humanTeams + aiTeams;
    return {
      humanTeams,
      aiTeams,
      totalTeams,
      humanPercent: totalTeams > 0 ? Math.round((humanTeams / totalTeams) * 100) : 50,
      aiPercent: totalTeams > 0 ? Math.round((aiTeams / totalTeams) * 100) : 50,
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
    <div className={cn('min-h-screen bg-hackday text-white', config.font)}>
      {/* ================================================================== */}
      {/* HEADER */}
      {/* ================================================================== */}
      <header className="border-b border-arena-border px-4 sm:px-6 py-4 bg-arena-black sticky top-0 z-40">
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
            <HStack gap="3" align="center">
              <img src={adaptLogo} alt="Adaptavist" className="h-10 w-auto" />
              <div className="hidden sm:block">
                <div className="font-black text-lg tracking-tight text-white">HACKDAY 2026</div>
                <div className="text-xs text-arena-muted font-mono">HUMAN VS AI</div>
              </div>
            </HStack>

            {/* War Timer - Isolated component to prevent parent re-renders */}
            <WarTimer />

            {/* User Quick Access - Premium Glass Card */}
            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className={cn(
                'glass-card flex items-center gap-3 sm:gap-4 px-3 sm:px-5 py-2 sm:py-3 rounded-2xl cursor-pointer',
                'transition-all duration-300 group',
                'hover:-translate-y-0.5 hover:shadow-2xl',
                user?.allegiance === 'ai' 
                  ? 'border-cyan-500/30 hover:border-cyan-400/60 hover:shadow-cyan-900/40' 
                  : 'border-orange-500/30 hover:border-orange-400/60 hover:shadow-orange-900/40'
              )}
            >
              {/* Team info - hidden on mobile */}
              {userTeam && (
                <div className="hidden sm:flex items-center gap-3">
                  <div className={cn(
                    'w-10 h-10 lg:w-11 lg:h-11 rounded-xl flex items-center justify-center shadow-lg',
                    userTeam.side === 'ai' 
                      ? 'bg-gradient-to-br from-cyan-600 to-blue-600' 
                      : 'bg-gradient-to-br from-orange-600 to-red-600'
                  )}>
                    {userTeam.side === 'ai' 
                      ? <Cpu className="w-5 h-5 text-white" />
                      : <Heart className="w-5 h-5 text-white" />
                    }
                  </div>
                  <div className="text-left">
                    <p className={cn(
                      'font-bold text-white text-sm group-hover:transition-colors',
                      userTeam.side === 'ai' ? 'group-hover:text-cyan-200' : 'group-hover:text-orange-200'
                    )}>
                      {userTeam.name}
                    </p>
                    <p className={cn(
                      'text-xs',
                      userTeam.side === 'ai' ? 'text-cyan-400' : 'text-orange-400'
                    )}>
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
                  <AllegianceAvatar allegiance={user?.allegiance || 'neutral'} size="md" />
                  {captainedTeam?.joinRequests?.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-human text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                      {captainedTeam.joinRequests.length}
                    </div>
                  )}
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-semibold text-white text-sm">
                    {user?.name || 'Operator'}
                  </p>
                  <p className={cn(
                    'text-xs',
                    user?.allegiance === 'ai' ? 'text-cyan-300' : 'text-orange-300'
                  )}>
                    {userCallsign || (userTeam ? (user?.allegiance === 'ai' ? 'AI Operative' : 'Human Fighter') : 'Free Agent')}
                  </p>
                </div>
              </div>

              {/* Chevron arrow */}
              <ChevronRight className={cn(
                'w-5 h-5 transition-transform group-hover:translate-x-1',
                user?.allegiance === 'ai' ? 'text-cyan-400' : 'text-orange-400'
              )} />
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
                    <span className="text-xs font-bold text-ai">{currentPhaseIndex + 1}/{EVENT_PHASE_ORDER.length}</span>
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
                          idx < currentPhaseIndex ? 'bg-white' : idx === currentPhaseIndex ? 'bg-ai' : 'bg-arena-border'
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
                          ? 'bg-ai text-white animate-pulse' 
                          : 'bg-arena-border text-arena-muted'
                    )}>
                      {isComplete ? '✓' : index + 1}
                    </div>
                    <span className={cn(
                      'text-xs font-bold whitespace-nowrap',
                      isActive ? 'text-ai' : isComplete ? 'text-white' : 'text-arena-muted'
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
                  <div className={cn(
                    'p-3 border-2 rounded-card flex items-center gap-2',
                    user.role === 'judge' && 'border-brand/50 bg-brand/10',
                    user.role === 'admin' && 'border-ai/50 bg-ai/10',
                    user.role === 'ambassador' && 'border-human/50 bg-human/10'
                  )}>
                    {user.role === 'judge' && <Gavel className="w-5 h-5 text-brand" />}
                    {user.role === 'admin' && <Shield className="w-5 h-5 text-ai" />}
                    <div>
                      <div className={cn(
                        'text-xs font-bold uppercase tracking-wide',
                        user.role === 'judge' && 'text-brand',
                        user.role === 'admin' && 'text-ai',
                        user.role === 'ambassador' && 'text-human'
                      )}>
                        {user.role === 'judge' ? 'Judge' : user.role === 'admin' ? 'Admin' : 'Ambassador'}
                      </div>
                      <div className="text-xs text-arena-secondary">
                        {user.role === 'judge' && 'Score submitted projects'}
                        {user.role === 'admin' && 'Full event access'}
                        {user.role === 'ambassador' && 'Recruit for your side'}
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
                    onClick={() => onNavigate('landing')}
                    className="mt-4 text-arena-muted hover:text-white"
                  >
                    Sign Out
                  </NavItem>
                </NavGroup>

                {/* War Recruitment Status */}
                <div className="p-4 border-2 border-arena-border rounded-card">
                  <div className="text-xs font-bold uppercase tracking-wide text-arena-secondary mb-3">
                    War Recruitment Status
                  </div>
                  <VStack gap="3">
                    {/* Human Bar */}
                    <div>
                      <HStack justify="between" className="text-sm mb-1">
                        <HStack gap="1" align="center" className="font-bold text-human">
                          <Heart className="w-3 h-3" /> Human
                        </HStack>
                        <span className="font-mono font-bold text-white">{warStats.humanPercent}%</span>
                      </HStack>
                      <Progress value={warStats.humanPercent} variant="human" size="sm" />
                    </div>
                    {/* AI Bar */}
                    <div>
                      <HStack justify="between" className="text-sm mb-1">
                        <HStack gap="1" align="center" className="font-bold text-ai">
                          <Cpu className="w-3 h-3" /> AI
                        </HStack>
                        <span className="font-mono font-bold text-white">{warStats.aiPercent}%</span>
                      </HStack>
                      <Progress value={warStats.aiPercent} variant="ai" size="sm" />
                    </div>
                    {/* Total */}
                    <div className="pt-2 border-t border-arena-border text-center">
                      <span className="text-xs text-arena-secondary">{warStats.totalTeams} teams registered</span>
                    </div>
                  </VStack>
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
            <span>
              ALLEGIANCE:{' '}
              <span style={{ color: config.color }} className="font-bold">
                {config.label.toUpperCase()}
              </span>
            </span>
          </HStack>
        </Container>
      </footer>
    </div>
  );
}

export default memo(AppLayout);
