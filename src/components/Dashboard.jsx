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
  HelpCircle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Send,
  Vote,
  Activity,
  Download,
  LayoutDashboard,
  LogOut,
  BookOpen,
  BarChart3,
  Gavel,
  Shield,
  Megaphone,
  Image as ImageIcon,
} from 'lucide-react';
import { ALLEGIANCE_CONFIG, USER_ROLES, EVENT_PHASE_ORDER, EVENT_PHASES as EVENT_PHASES_CONFIG } from '../data/mockData';

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_ACTIVITY_FEED = [
  { id: 1, type: 'join', user: 'Maya Rodriguez', team: 'Neural Nexus', side: 'ai', time: '2 min ago' },
  { id: 2, type: 'create', user: 'Jordan Lee', team: 'Quantum Collective', side: 'ai', time: '5 min ago' },
  { id: 3, type: 'join', user: 'Casey Brooks', team: 'Human Touch', side: 'human', time: '12 min ago' },
  { id: 4, type: 'allegiance', user: 'River Chen', side: 'ai', time: '15 min ago' },
  { id: 5, type: 'create', user: 'Pat O\'Brien', team: 'Carbon Coalition', side: 'human', time: '23 min ago' },
  { id: 6, type: 'join', user: 'Skyler Vance', team: 'Digital Overlords', side: 'ai', time: '31 min ago' },
];

const MOCK_SCHEDULE = [
  { id: 1, time: '10:00 AM', title: 'Opening Ceremony', description: 'Kickoff & rules explanation' },
  { id: 2, time: '10:30 AM', title: 'Team Formation Deadline', description: 'Final team submissions' },
  { id: 3, time: '11:00 AM', title: 'Hacking Begins', description: 'Start building!' },
  { id: 4, time: '5:00 PM', title: 'Submission Deadline', description: 'All projects due' },
];

const MOCK_AWARDS = [
  { id: 1, title: 'Grand HackDay Champion', prize: 'T-Shirts + Digital Swag', icon: Trophy, description: 'Champion t-shirts, Zoom backgrounds, Slack avatars' },
  { id: 2, title: 'Best Human Team', prize: 'Digital Swag', icon: Heart, description: 'Human team Zoom backgrounds & Slack avatars' },
  { id: 3, title: 'Best AI Team', prize: 'Digital Swag', icon: Cpu, description: 'AI team Zoom backgrounds & Slack avatars' },
];

const MOCK_FAQ = [
  { id: 1, question: 'How do teams work?', answer: 'Teams can have 2-6 members. You can join an existing team or create your own. All team members must choose the same allegiance (Human or AI).' },
  { id: 2, question: 'What can I build?', answer: 'Anything! Web apps, mobile apps, APIs, games, tools - as long as it fits the theme. AI-side teams are encouraged to use AI tools heavily, while Human-side teams should minimize AI assistance.' },
  { id: 3, question: 'How is judging done?', answer: 'Projects are judged on innovation, execution, design, and theme adherence. There will be peer voting for People\'s Choice award.' },
  { id: 4, question: 'Can I switch allegiances?', answer: 'You can switch until team formation deadline. After that, your allegiance is locked for the duration of the hackathon.' },
];

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
  ambassador: { label: 'Ambassador', color: 'green', icon: Megaphone },
  judge: { label: 'Judge', color: 'amber', icon: Gavel },
  admin: { label: 'Admin', color: 'purple', icon: Shield },
};

// ============================================================================
// COMPONENT
// ============================================================================

function Dashboard({
  user,
  teams = [],
  allegianceStyle,
  onNavigate,
  eventPhase = 'voting',
}) {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [activeNav, setActiveNav] = useState('dashboard');

  // Find the team the user is captain of (if any)
  const captainedTeam = teams.find((team) => team.captainId === user?.id);
  
  // Find user's team (as member or captain)
  const userTeam = teams.find((team) => 
    team.captainId === user?.id || 
    team.members?.some(m => m.id === user?.id)
  );

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

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className={`min-h-screen bg-white ${allegianceStyle?.font || 'font-sans'}`}>
      {/* ================================================================== */}
      {/* HEADER */}
      {/* ================================================================== */}
      <header className="border-b-2 border-gray-900 px-4 sm:px-6 py-4 bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={adaptLogo} alt="Adaptavist" className="h-10 w-auto" />
            <div>
              <div className="font-black text-lg tracking-tight">HACKDAY 2026</div>
              <div className="text-xs text-gray-500 font-mono">HUMAN VS AI</div>
            </div>
          </div>

          {/* War Timer */}
          <div className="flex items-center gap-3 px-4 py-2 bg-gray-900 text-white">
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
            className="hidden sm:flex items-center gap-3 hover:opacity-80 transition-opacity"
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
            <div className="text-left">
              <div className="font-bold text-gray-900 text-sm">{user?.name || 'Operator'}</div>
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
        {/* ================================================================ */}
        {/* LEFT SIDEBAR (30%) */}
        {/* ================================================================ */}
        <aside className="w-full lg:w-[280px] border-r-0 lg:border-r-2 border-gray-200 p-4 sm:p-6 space-y-6">
          {/* Role Badge */}
          {user?.role && user.role !== 'participant' && (
            <div
              className={`p-3 border-2 flex items-center gap-2 mb-4
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
                  onClick={() => {
                    setActiveNav(item.id);
                    if (item.id === 'teams') onNavigate('marketplace', { tab: 'teams' });
                    if (item.id === 'schedule') onNavigate('schedule');
                    if (item.id === 'rules') onNavigate('rules');
                    if (item.id === 'submission') onNavigate('submission');
                    if (item.id === 'voting') onNavigate('voting');
                    if (item.id === 'analytics') onNavigate('analytics');
                    if (item.id === 'judge-scoring') onNavigate('judge-scoring');
                    if (item.id === 'admin') onNavigate('admin');
                    if (item.id === 'results') onNavigate('results');
                  }}
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
        </aside>

        {/* ================================================================ */}
        {/* RIGHT MAIN CONTENT (70%) */}
        {/* ================================================================ */}
        <main className="flex-1 p-4 sm:p-6">
          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Promo Tile */}
            <div className="border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 
                            flex items-center justify-center min-h-[200px] relative overflow-hidden">
              {/* Placeholder - Replace with actual promo graphic */}
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-400 font-medium">Promo Graphic</p>
                <p className="text-xs text-gray-300 mt-1">Coming Soon</p>
              </div>
            </div>

            {/* Team Finder Feature Box */}
            <div className="p-5 border-2 border-gray-900 bg-gray-900 text-white">
              <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">
                Team Finder
              </div>
              <h3 className="text-xl font-black mb-3">Find Your Squad</h3>
              <p className="text-sm text-gray-400 mb-4">
                Browse open teams looking for members or discover free agents with matching skills.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('marketplace', { tab: 'teams' })}
                  className="flex-1 py-3 bg-white text-gray-900 font-bold text-sm
                             hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Browse Teams
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('marketplace', { tab: 'people' })}
                  className="flex-1 py-3 border-2 border-white text-white font-bold text-sm
                             hover:bg-white hover:text-gray-900 transition-all flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Free Agents
                </button>
              </div>
            </div>

            {/* Project Gallery Feature Box - Only show during voting phase */}
            {eventPhase === 'voting' && (
              <div className="p-5 border-2 border-amber-400 bg-amber-50">
                <div className="text-xs font-bold uppercase tracking-wide text-amber-600 mb-2">
                  Project Gallery
                </div>
                <h3 className="text-xl font-black text-amber-900 mb-3">Vote for Projects</h3>
                <p className="text-sm text-amber-700 mb-4">
                  Browse all submitted hackathon projects and vote for your favorites!
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('voting')}
                  className="w-full py-3 bg-amber-400 text-amber-900 font-bold text-sm
                             hover:bg-amber-500 transition-all flex items-center justify-center gap-2"
                >
                  <Vote className="w-4 h-4" />
                  Browse &amp; Vote
                </button>
              </div>
            )}

            {/* Live Activity Feed Widget */}
            <div className="p-5 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-bold uppercase tracking-wide text-gray-400">
                  Live Activity
                </div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <Activity className="w-3 h-3 animate-pulse" />
                  Live
                </div>
              </div>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {MOCK_ACTIVITY_FEED.map((activity) => {
                  const config = ALLEGIANCE_CONFIG[activity.side] || ALLEGIANCE_CONFIG.neutral;
                  return (
                    <div key={activity.id} className="flex items-start gap-3 text-sm">
                      <div
                        className={`w-6 h-6 flex-shrink-0 flex items-center justify-center text-xs
                          ${activity.side === 'ai' ? '' : 'rounded-full'}`}
                        style={{ backgroundColor: config.bgColor }}
                      >
                        {activity.side === 'ai' 
                          ? <Cpu className="w-3 h-3" style={{ color: config.color }} />
                          : <Heart className="w-3 h-3" style={{ color: config.color }} />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`font-bold ${activity.side === 'ai' ? 'font-mono' : ''}`}>
                          {activity.user}
                        </span>
                        {activity.type === 'join' && (
                          <span className="text-gray-500"> joined </span>
                        )}
                        {activity.type === 'create' && (
                          <span className="text-gray-500"> created </span>
                        )}
                        {activity.type === 'allegiance' && (
                          <span className="text-gray-500"> chose {activity.side.toUpperCase()} side</span>
                        )}
                        {activity.team && (
                          <span className="font-bold" style={{ color: config.color }}>
                            {activity.team}
                          </span>
                        )}
                        <div className="text-xs text-gray-400">{activity.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Schedule Preview Widget */}
            <div className="p-5 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-bold uppercase tracking-wide text-gray-400">
                  Schedule Preview
                </div>
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
              <div className="space-y-3">
                {MOCK_SCHEDULE.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`flex gap-3 pb-3 ${index < MOCK_SCHEDULE.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    <div className="w-16 flex-shrink-0">
                      <div className="text-xs font-mono font-bold text-gray-900">{item.time}</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">{item.title}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="w-full mt-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 
                           flex items-center justify-center gap-1"
              >
                View Full Schedule
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Awards List Widget */}
            <div className="p-5 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-bold uppercase tracking-wide text-gray-400">
                  Awards & Prizes
                </div>
                <Trophy className="w-4 h-4 text-amber-500" />
              </div>
              <div className="space-y-3">
                {MOCK_AWARDS.map((award) => {
                  const Icon = award.icon;
                  const isAI = award.title.includes('AI');
                  const isHuman = award.title.includes('Human');
                  const isChampion = award.title.includes('Champion');
                  return (
                    <div 
                      key={award.id} 
                      className={`p-3 border-2 transition-all hover:shadow-md flex items-center gap-3
                        ${isAI ? 'border-cyan-300 border-dashed' : isHuman ? 'border-green-300 rounded-xl' : isChampion ? 'border-amber-400 bg-amber-50' : 'border-gray-200'}`}
                    >
                      <Icon className={`w-8 h-8 flex-shrink-0
                        ${isAI ? 'text-cyan-600' : isHuman ? 'text-green-600' : 'text-amber-500'}`} 
                      />
                      <div className="min-w-0">
                        <div className={`font-bold text-sm ${isAI ? 'font-mono text-cyan-700' : isHuman ? 'text-green-700' : 'text-amber-700'}`}>
                          {award.title}
                        </div>
                        <div className="text-xs text-gray-500">{award.prize}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FAQ Widget */}
            <div className="md:col-span-2 p-5 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-bold uppercase tracking-wide text-gray-400">
                  Frequently Asked Questions
                </div>
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </div>
              <div className="space-y-2">
                {MOCK_FAQ.map((faq) => (
                  <div key={faq.id} className="border border-gray-200">
                    <button
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full px-4 py-3 flex items-center justify-between text-left
                                 hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-bold text-sm text-gray-900">{faq.question}</span>
                      {expandedFaq === faq.id 
                        ? <ChevronUp className="w-4 h-4 text-gray-400" />
                        : <ChevronDown className="w-4 h-4 text-gray-400" />
                      }
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
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

export default Dashboard;
