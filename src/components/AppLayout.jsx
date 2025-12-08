/**
 * AppLayout Component
 * Main layout wrapper providing consistent header, sidebar navigation, and footer.
 */

import { useState, useEffect } from 'react';
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
} from 'lucide-react';
import Progress from './ui/Progress';
import Badge, { RoleBadge } from './ui/Badge';
import NavItem, { NavGroup } from './shared/NavItem';
import { Container, HStack, VStack } from './layout';
import { AllegianceAvatar } from './ui/Avatar';
import { cn, getAllegianceConfig, formatNameWithCallsign, ALLEGIANCE_CONFIG } from '../lib/design-system';
import { USER_ROLES, EVENT_PHASE_ORDER, EVENT_PHASES as EVENT_PHASES_CONFIG } from '../data/mockData';

// ============================================================================
// WAR TIMER - Countdown to June 21, 2026
// ============================================================================

const EVENT_START = new Date('2026-06-21T09:00:00');
const EVENT_END = new Date('2026-06-22T17:00:00');

const calculateTimeRemaining = () => {
  const now = new Date();
  
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
    
    return { status: 'countdown', display, label: 'Until HackDay 2026' };
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
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const captainedTeam = teams.find((team) => team.captainId === user?.id);
  const userTeam = teams.find((team) => 
    team.captainId === user?.id || 
    team.members?.some(m => m.id === user?.id)
  );
  const userCallsign = user?.callsign || userTeam?.members?.find(m => m.id === user?.id)?.callsign;

  const navItems = getNavItems(user?.role, eventPhase);
  const config = getAllegianceConfig(user?.allegiance || 'neutral');

  // War stats
  const humanTeams = teams.filter(t => t.side === 'human').length;
  const aiTeams = teams.filter(t => t.side === 'ai').length;
  const totalTeams = humanTeams + aiTeams;
  const humanPercent = totalTeams > 0 ? Math.round((humanTeams / totalTeams) * 100) : 50;
  const aiPercent = totalTeams > 0 ? Math.round((aiTeams / totalTeams) * 100) : 50;

  const handleNavClick = (itemId) => {
    setSidebarOpen(false);
    if (itemId === 'teams') {
      onNavigate('marketplace', { tab: 'teams' });
    } else {
      onNavigate(itemId);
    }
  };

  return (
    <div className={cn('min-h-screen bg-arena-black text-white', config.font)}>
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

            {/* War Timer */}
            <div className={cn(
              'hidden md:flex items-center gap-3 px-4 py-2 text-white rounded-card',
              timeRemaining.status === 'live' 
                ? 'bg-gradient-to-r from-ai to-human animate-pulse' 
                : timeRemaining.status === 'ended'
                  ? 'bg-arena-card'
                  : 'bg-arena-card'
            )}>
              <Clock className="w-5 h-5 text-arena-secondary" />
              <div>
                <div className="font-mono text-2xl font-bold tracking-wider text-white">
                  {timeRemaining.display}
                </div>
                <div className={cn(
                  'text-xs uppercase tracking-wide',
                  timeRemaining.status === 'live' ? 'text-white font-bold' : 'text-arena-secondary'
                )}>
                  {timeRemaining.label}
                </div>
              </div>
            </div>

            {/* User Quick Access */}
            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="relative">
                <AllegianceAvatar allegiance={user?.allegiance || 'neutral'} size="md" />
                {captainedTeam?.joinRequests?.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-human text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {captainedTeam.joinRequests.length}
                  </div>
                )}
              </div>
              <div className="text-left hidden sm:block">
                <div className="font-bold text-white text-sm flex items-center gap-1 flex-wrap">
                  {(() => {
                    const formatted = formatNameWithCallsign(user?.name, userCallsign);
                    if (!formatted.hasCallsign) return user?.name || 'Operator';
                    return (
                      <>
                        {formatted.firstName}
                        <Badge 
                          variant={user?.allegiance === 'ai' ? 'ai' : user?.allegiance === 'human' ? 'human' : 'neutral'} 
                          size="xs"
                        >
                          {formatted.callsign}
                        </Badge>
                        {formatted.lastName}
                      </>
                    );
                  })()}
                </div>
                {captainedTeam ? (
                  <>
                    <div className="text-xs text-arena-secondary">Captain</div>
                    <div className="text-xs font-medium" style={{ color: config.color }}>
                      {captainedTeam.name}
                    </div>
                  </>
                ) : userTeam ? (
                  <div className="text-xs font-medium" style={{ color: config.color }}>
                    {userTeam.name}
                  </div>
                ) : (
                  <div className="text-xs text-arena-secondary">Free Agent</div>
                )}
              </div>
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
                        <span className="font-mono font-bold text-white">{humanPercent}%</span>
                      </HStack>
                      <Progress value={humanPercent} variant="human" size="sm" />
                    </div>
                    {/* AI Bar */}
                    <div>
                      <HStack justify="between" className="text-sm mb-1">
                        <HStack gap="1" align="center" className="font-bold font-mono text-ai">
                          <Cpu className="w-3 h-3" /> AI
                        </HStack>
                        <span className="font-mono font-bold text-white">{aiPercent}%</span>
                      </HStack>
                      <Progress value={aiPercent} variant="ai" size="sm" />
                    </div>
                    {/* Total */}
                    <div className="pt-2 border-t border-arena-border text-center">
                      <span className="text-xs text-arena-secondary">{totalTeams} teams registered</span>
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

export default AppLayout;
