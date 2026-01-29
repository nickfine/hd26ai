/**
 * Dashboard Page - Figma HD26-New-Design Implementation
 * Main hub showing activity feed, schedule, awards, and quick actions.
 * Layout matches the Figma design with vertical sections.
 */

import { useState, memo, useCallback, useMemo } from 'react';
import {
  Users,
  User,
  Calendar,
  Trophy,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Vote,
  Activity,
  Zap,
  Sparkles,
  UserPlus,
  ArrowRight,
  Clock,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Plus,
  Lightbulb,
  MapPin,
  Award,
  Star,
  Info,
  FileText,
  Send,
} from 'lucide-react';
import AppLayout from './AppLayout';
import Button from './ui/Button';
import Card from './ui/Card';
import Badge, { HeartbeatDot } from './ui/Badge';
import { FigmaMetricsCard } from './ui/StatCard';
import LiveActivityFeed from './ui/LiveActivityFeed';
import { DashboardSkeleton } from './ui/Skeleton';
import { HStack, VStack } from './layout';
import { cn } from '../lib/design-system';
import { MotdBanner } from './shared';

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_ACTIVITY_FEED = [
  { id: 1, type: 'join', user: 'Maya Rodriguez', team: 'Rescue House', time: '2m ago' },
  { id: 2, type: 'create', user: 'Jordan Lee', team: 'Quantum Collective', time: '5m ago' },
  { id: 3, type: 'join', user: 'Casey Bento', team: 'Meteor Touch', time: '12m ago' },
  { id: 4, type: 'create', user: "Pat O'Brien", team: 'Carbon Cockfox', time: '18m ago' },
  { id: 5, type: 'join', user: 'Skylar Moore', team: 'Digital Overlords', time: '23m ago' },
];

const MOCK_SCHEDULE = [
  { id: 1, date: '01.28', time: '09:00 AM', title: 'Opening Ceremony', location: 'Main Auditorium' },
  { id: 2, date: '01.28', time: '02:00 PM', title: 'Team Formation Deadline', location: 'Building A Conference' },
  { id: 3, date: '01.29', time: '10:00 AM', title: 'Hacking Begins', location: 'Dev Sandbox', isNow: true },
  { id: 4, date: '01.30', time: '06:00 PM', title: 'Submission Envelope', location: 'Online Submission Portal' },
];

const MOCK_AWARDS = [
  { id: 1, title: 'Grand HackDay Champion', description: 'Awarded to the best overall project', icon: Trophy },
  { id: 2, title: "People's Choice", description: 'Voted on by your fellow developers', icon: Star },
  { id: 3, title: "Judge's Selection", description: 'Recognized for technical excellence', icon: Award },
];

const MOCK_FAQ = [
  { id: 1, question: 'How do ideas work?', answer: 'Ideas are projects teams work on. Teams can have 2-6 members. You can join an existing idea or create your own.' },
  { id: 2, question: 'What can I build?', answer: 'Anything! Web apps, mobile apps, APIs, games, tools - as long as it fits the theme.' },
  { id: 3, question: 'How is judging done?', answer: 'Projects are judged on innovation, execution, design, and theme adherence.' },
];

// ============================================================================
// MISSION BANNER COMPONENT
// ============================================================================

const MissionBanner = memo(function MissionBanner({ userRole = 'member' }) {
  return (
    <div className="mb-8">
      {/* Small badge */}
      <div className="inline-flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg gradient-cyan-blue flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-primary">
          Mission Control
        </span>
      </div>
      
      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-black text-text-primary mb-3 tracking-tight">
        DASHBOARD
      </h1>
      
      {/* Description */}
      <p className="text-base text-text-body max-w-2xl mb-4">
        Your command center for HackDay 2026. Track your progress, find teammates, 
        and stay updated on the latest events.
      </p>
      
      {/* Status pills */}
      <div className="flex flex-wrap gap-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-arena-card border border-arena-border rounded-full">
          <span className="status-active-dot" />
          <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
            Systems Nominal
          </span>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-arena-card border border-arena-border rounded-full">
          <User className="w-4 h-4 text-text-secondary" />
          <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
            {userRole === 'admin' ? 'Admin' : userRole === 'judge' ? 'Judge' : 'Member'} as {userRole === 'admin' ? 'Admin' : userRole === 'judge' ? 'Judge' : 'Member'}
          </span>
        </div>
      </div>
    </div>
  );
});

// ============================================================================
// ACTIVE IDEAS WIDGET
// ============================================================================

const ActiveIdeasWidget = memo(function ActiveIdeasWidget({ 
  ideas = 8, 
  participants = 27, 
  teams = 8, 
  freeAgents = 6 
}) {
  return (
    <Card variant="default" padding="lg" className="flex-1">
      <div className="flex flex-col items-center text-center">
        {/* Icon at top */}
        <div className="w-16 h-16 rounded-full gradient-cyan-blue shadow-cyan-glow flex items-center justify-center mb-6">
          <Lightbulb className="w-8 h-8 text-white" />
        </div>
        
        {/* Large number */}
        <div className="text-7xl font-black text-gradient-cyan mb-2 tabular-nums">
          {ideas}
        </div>
        
        {/* Label */}
        <div className="text-sm font-medium text-cyan-primary uppercase tracking-widest mb-6">
          Active Ideas
        </div>
        
        {/* Separator */}
        <div className="w-full border-t border-cyan-subtle mb-6" />
        
        {/* Sub-stats */}
        <div className="grid grid-cols-3 gap-4 w-full">
          {/* Participants */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-cyan-accent flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-cyan-primary" />
            </div>
            <div className="text-2xl font-bold text-text-primary">{participants}</div>
            <div className="text-xs text-text-muted uppercase tracking-wider">Participants</div>
          </div>
          
          {/* Teams */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-orange-accent flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-orange-primary" />
            </div>
            <div className="text-2xl font-bold text-text-primary">{teams}</div>
            <div className="text-xs text-text-muted uppercase tracking-wider">Teams</div>
          </div>
          
          {/* Free Agents */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-purple-accent flex items-center justify-center mb-2">
              <User className="w-5 h-5 text-purple-primary" />
            </div>
            <div className="text-2xl font-bold text-text-primary">{freeAgents}</div>
            <div className="text-xs text-text-muted uppercase tracking-wider">Free Agents</div>
          </div>
        </div>
      </div>
    </Card>
  );
});

// ============================================================================
// TEAM FORMATION STATUS CARD
// ============================================================================

const TeamFormationStatus = memo(function TeamFormationStatus({ 
  user, 
  teams, 
  onNavigate,
  onNavigateToTeam 
}) {
  // Find user's team
  const userTeam = teams.find((team) => 
    team.captainId === user?.id || 
    team.members?.some(m => m.id === user?.id)
  );
  
  const hasTeam = !!userTeam;
  const memberCount = userTeam ? (userTeam.members?.length || 0) + (userTeam.captainId ? 1 : 0) : 0;
  const ideasCount = userTeam?.ideas?.length || 3;
  const hoursLeft = 12; // Could be calculated from event time
  
  if (!hasTeam) {
    // Show "Find a Team" card for users without a team
    return (
      <Card variant="default" padding="lg" className="flex-1">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-arena-elevated flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-warning" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary">Team Formation Status</h3>
              <p className="text-sm text-text-secondary">Find your squad</p>
            </div>
          </div>
          
          <p className="text-sm text-text-body">
            You're not on a team yet. Browse available ideas or create your own to get started!
          </p>
          
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => onNavigate('marketplace', { tab: 'teams' })}
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            Browse Ideas
          </Button>
        </div>
      </Card>
    );
  }
  
  return (
    <Card variant="default" padding="lg" className="flex-1">
      <div className="space-y-4">
        {/* Header with status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-arena-elevated flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-success" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary">Team Formation Status</h3>
              <p className="text-sm text-text-secondary">You're all set!</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--status-success-subtle)]">
            <span className="status-active-dot" />
            <span className="text-xs font-bold text-success uppercase">Active</span>
          </div>
        </div>
        
        {/* Team info */}
        <div className="p-4 rounded-xl bg-arena-elevated border border-arena-border">
          <p className="text-sm text-text-body mb-2">
            You're part of <span className="font-bold text-brand">{userTeam.name}</span> team
          </p>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <CheckCircle className="w-4 h-4 text-success" />
            <span>Team is complete and ready to begin</span>
          </div>
        </div>
        
        {/* Team details */}
        <div>
          <p className="text-sm text-text-secondary mb-3">Team Details</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold text-text-primary">{memberCount}</div>
              <div className="text-xs text-text-muted">Members</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-text-primary">{ideasCount}</div>
              <div className="text-xs text-text-muted">Ideas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-text-primary">{hoursLeft}</div>
              <div className="text-xs text-text-muted">Hours Left</div>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => onNavigateToTeam ? onNavigateToTeam(userTeam.id) : onNavigate('teams', { teamId: userTeam.id })}
        >
          View Your Team
        </Button>
      </div>
    </Card>
  );
});

// ============================================================================
// ACTIVITY OVERVIEW CHART
// ============================================================================

const ActivityOverviewChart = memo(function ActivityOverviewChart() {
  // Simple SVG-based area chart visualization
  const timeLabels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'];
  
  return (
    <Card variant="default" padding="lg" className="mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-text-primary">Activity Overview</h3>
          <p className="text-sm text-text-secondary">Real-time participation metrics</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-primary" />
            <span className="text-sm text-text-secondary">Activity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-primary" />
            <span className="text-sm text-text-secondary">Submissions</span>
          </div>
        </div>
      </div>
      
      {/* Chart area */}
      <div className="relative h-64">
        <svg viewBox="0 0 1000 250" className="w-full h-full" preserveAspectRatio="none">
          {/* Grid lines - horizontal */}
          <line x1="50" y1="50" x2="950" y2="50" stroke="var(--color-border)" strokeWidth="1" />
          <line x1="50" y1="100" x2="950" y2="100" stroke="var(--color-border)" strokeWidth="1" />
          <line x1="50" y1="150" x2="950" y2="150" stroke="var(--color-border)" strokeWidth="1" />
          <line x1="50" y1="200" x2="950" y2="200" stroke="var(--color-border)" strokeWidth="1" />
          
          {/* Activity area (cyan) */}
          <defs>
            <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(0, 211, 242, 0.3)" />
              <stop offset="100%" stopColor="rgba(0, 211, 242, 0.05)" />
            </linearGradient>
            <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255, 105, 0, 0.3)" />
              <stop offset="100%" stopColor="rgba(255, 105, 0, 0.05)" />
            </linearGradient>
          </defs>
          
          {/* Activity area fill */}
          <path 
            d="M50,200 L150,180 L300,120 L450,90 L600,60 L750,80 L900,100 L950,110 L950,200 L50,200 Z" 
            fill="url(#cyanGradient)"
          />
          <path 
            d="M50,200 L150,180 L300,120 L450,90 L600,60 L750,80 L900,100 L950,110" 
            fill="none"
            stroke="#00D3F2"
            strokeWidth="2"
          />
          
          {/* Submissions area fill */}
          <path 
            d="M50,200 L150,195 L300,185 L450,170 L600,160 L750,155 L900,150 L950,145 L950,200 L50,200 Z" 
            fill="url(#orangeGradient)"
          />
          <path 
            d="M50,200 L150,195 L300,185 L450,170 L600,160 L750,155 L900,150 L950,145" 
            fill="none"
            stroke="#FF6900"
            strokeWidth="2"
          />
          
          {/* Y-axis labels */}
          <text x="40" y="55" textAnchor="end" fill="var(--color-text-muted)" fontSize="12">100</text>
          <text x="40" y="105" textAnchor="end" fill="var(--color-text-muted)" fontSize="12">75</text>
          <text x="40" y="155" textAnchor="end" fill="var(--color-text-muted)" fontSize="12">50</text>
          <text x="40" y="205" textAnchor="end" fill="var(--color-text-muted)" fontSize="12">25</text>
        </svg>
        
        {/* X-axis labels */}
        <div className="absolute bottom-0 left-12 right-4 flex justify-between text-xs text-text-muted">
          {timeLabels.map((label, i) => (
            <span key={i}>{label}</span>
          ))}
        </div>
      </div>
    </Card>
  );
});

// ============================================================================
// SCHEDULE PREVIEW
// ============================================================================

const SchedulePreview = memo(function SchedulePreview({ onNavigate }) {
  return (
    <Card variant="default" padding="lg" className="h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-arena-elevated flex items-center justify-center">
            <Calendar className="w-5 h-5 text-text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary">Schedule Preview</h3>
            <p className="text-sm text-text-secondary">Upcoming milestones</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          rightIcon={<ChevronRight className="w-4 h-4" />}
          onClick={() => onNavigate('schedule')}
        >
          View Full Schedule
        </Button>
      </div>
      
      {/* Timeline items */}
      <div className="space-y-0">
        {MOCK_SCHEDULE.map((item, index) => (
          <div key={item.id} className="flex gap-4">
            {/* Date badge */}
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-arena-elevated flex items-center justify-center">
              <span className="text-xs font-bold text-text-secondary">{item.date}</span>
            </div>
            
            {/* Content with connector line */}
            <div className={cn(
              "flex-1 pb-4 pl-4 relative",
              index < MOCK_SCHEDULE.length - 1 && "border-l border-arena-border"
            )}>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-base font-bold text-text-primary">{item.title}</h4>
                {item.isNow && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-brand/20 text-brand rounded-full">
                    Now
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-text-secondary">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{item.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{item.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
});

// ============================================================================
// AWARDS & PRIZES
// ============================================================================

const AwardsPrizes = memo(function AwardsPrizes() {
  return (
    <Card variant="default" padding="lg" className="h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-full bg-arena-elevated flex items-center justify-center">
          <Trophy className="w-5 h-5 text-text-secondary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-primary">Awards & Prizes</h3>
          <p className="text-sm text-text-secondary">What you're competing for</p>
        </div>
      </div>
      
      {/* Awards list */}
      <div className="space-y-3 mb-4">
        {MOCK_AWARDS.map((award) => (
          <div 
            key={award.id}
            className="p-4 rounded-xl bg-arena-elevated border border-arena-border flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-arena-card flex items-center justify-center flex-shrink-0">
              <award.icon className="w-5 h-5 text-warning" />
            </div>
            <div>
              <h4 className="font-bold text-text-primary">{award.title}</h4>
              <p className="text-sm text-text-secondary">{award.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Special recognition note */}
      <div className="p-4 rounded-xl border border-dashed border-arena-border">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-text-muted flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-text-secondary">Special Recognition</h4>
            <p className="text-sm text-text-muted">
              Additional awards may be announced during the closing ceremony
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
});

// ============================================================================
// NEW TO HACKDAY PROMO
// ============================================================================

const NewToHackDayPromo = memo(function NewToHackDayPromo({ onNavigate }) {
  return (
    <Card variant="default" padding="lg" className="h-full relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-4 right-4 w-20 h-20 rounded-full gradient-cyan-blue opacity-20" />
      <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-brand/20" />
      
      <div className="relative flex flex-col items-center text-center py-6">
        {/* Icons row */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl gradient-cyan-blue flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <div className="w-14 h-14 rounded-full bg-brand/20 flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-brand" />
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-accent flex items-center justify-center">
            <Users className="w-6 h-6 text-purple-primary" />
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-2xl font-black text-text-primary mb-2">
          New to HackDay?
        </h3>
        
        {/* Subtitle */}
        <p className="text-base text-text-secondary mb-6">
          Join us and build something amazing
        </p>
        
        {/* CTA */}
        <Button
          variant="primary"
          size="lg"
          onClick={() => onNavigate('new-to-hackday')}
          rightIcon={<ArrowRight className="w-5 h-5" />}
        >
          Start here
        </Button>
      </div>
    </Card>
  );
});

// ============================================================================
// FAQ SECTION
// ============================================================================

const FAQSection = memo(function FAQSection() {
  const [expandedFaq, setExpandedFaq] = useState(null);
  
  const toggleFaq = useCallback((id) => {
    setExpandedFaq(prev => prev === id ? null : id);
  }, []);
  
  return (
    <Card variant="default" padding="lg" className="h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-full bg-arena-elevated flex items-center justify-center">
          <HelpCircle className="w-5 h-5 text-text-secondary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-primary">Frequently Asked Questions</h3>
          <p className="text-sm text-text-secondary">Quick answers to common queries</p>
        </div>
      </div>
      
      {/* FAQ items */}
      <div className="space-y-2">
        {MOCK_FAQ.map((faq) => (
          <div 
            key={faq.id} 
            className="border border-arena-border rounded-xl overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggleFaq(faq.id)}
              className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-arena-elevated transition-colors"
            >
              <span className="font-bold text-text-primary">{faq.question}</span>
              {expandedFaq === faq.id 
                ? <ChevronUp className="w-5 h-5 text-text-muted flex-shrink-0" />
                : <ChevronDown className="w-5 h-5 text-text-muted flex-shrink-0" />
              }
            </button>
            {expandedFaq === faq.id && (
              <div className="px-4 pb-4 text-sm text-text-body border-t border-arena-border pt-3">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
});

// ============================================================================
// LIVE ACTIVITY SECTION
// ============================================================================

const LiveActivitySection = memo(function LiveActivitySection({ activityFeed, onNavigate }) {
  return (
    <Card variant="default" padding="lg" className="h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-full bg-arena-elevated flex items-center justify-center">
          <Activity className="w-5 h-5 text-text-secondary" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-text-primary">Live Activity</h3>
          <div className="flex items-center gap-2">
            <span className="status-active-dot" />
            <span className="text-sm text-text-secondary">Real-time updates</span>
          </div>
        </div>
      </div>
      
      {/* Activity feed */}
      <LiveActivityFeed
        activities={activityFeed && activityFeed.length > 0 ? activityFeed : MOCK_ACTIVITY_FEED}
        maxItems={5}
        showHeader={false}
        emptyMessage="No activity yet. Be the first to join!"
      />
      
      {/* View all link */}
      <Button
        variant="ghost"
        size="md"
        fullWidth
        className="mt-4"
        onClick={() => onNavigate('activity')}
      >
        View All Activity
      </Button>
    </Card>
  );
});

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================

function Dashboard({
  user,
  teams = [],
  onNavigate,
  onNavigateToTeam,
  eventPhase = 'hacking',
  event,
  activityFeed = null,
  userInvites = [],
  devRoleOverride = null,
  onDevRoleChange = null,
  onPhaseChange = null,
  eventPhases = {},
  onAutoAssignOptIn = null,
  registrations = [],
  isLoading = false,
  simulateLoading = false,
  onSimulateLoadingChange = null,
}) {
  // Show skeleton while loading
  if (isLoading) {
    return (
      <AppLayout
        user={user}
        teams={teams}
        onNavigate={onNavigate}
        eventPhase={eventPhase}
        activeNav="dashboard"
        devRoleOverride={devRoleOverride}
        onDevRoleChange={onDevRoleChange}
        onPhaseChange={onPhaseChange}
        eventPhases={eventPhases}
        userInvites={userInvites}
        simulateLoading={simulateLoading}
        onSimulateLoadingChange={onSimulateLoadingChange}
      >
        <DashboardSkeleton />
      </AppLayout>
    );
  }
  
  // Calculate dashboard stats
  const stats = useMemo(() => {
    const ideasCount = teams.filter(t => t.name !== 'Observers').length;
    const participantsCount = registrations.length || teams.reduce((acc, t) => 
      acc + (t.members?.length || 0) + (t.captainId ? 1 : 0), 0
    );
    const freeAgentsCount = registrations.filter(r => 
      !teams.some(t => 
        t.captainId === r.id || t.members?.some(m => m.id === r.id)
      )
    ).length || Math.floor(participantsCount * 0.15);
    const submissionsCount = teams.filter(t => t.hasSubmitted || t.submission).length;
    
    return {
      ideas: ideasCount || 8,
      participants: participantsCount || 27,
      teams: ideasCount || 8,
      freeAgents: freeAgentsCount || 6,
      submissions: submissionsCount || 8,
    };
  }, [teams, registrations]);

  // Determine user role for display
  const userRole = devRoleOverride || user?.role || 'member';

  return (
    <AppLayout
      user={user}
      teams={teams}
      onNavigate={onNavigate}
      eventPhase={eventPhase}
      activeNav="dashboard"
      devRoleOverride={devRoleOverride}
      onDevRoleChange={onDevRoleChange}
      onPhaseChange={onPhaseChange}
      eventPhases={eventPhases}
      userInvites={userInvites}
      simulateLoading={simulateLoading}
      onSimulateLoadingChange={onSimulateLoadingChange}
    >
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Section 1: Mission Banner */}
        <MissionBanner userRole={userRole} />
        
        {/* Section 1.5: MOTD Banner */}
        <div className="mb-6">
          <MotdBanner eventPhase={eventPhase} userRole={userRole} />
        </div>
        
        {/* Section 2: Active Ideas Widget + Team Status (2 columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ActiveIdeasWidget 
            ideas={stats.ideas}
            participants={stats.participants}
            teams={stats.teams}
            freeAgents={stats.freeAgents}
          />
          <TeamFormationStatus 
            user={user}
            teams={teams}
            onNavigate={onNavigate}
            onNavigateToTeam={onNavigateToTeam}
          />
        </div>
        
        {/* Section 3: Metrics Cards Row (4 columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <FigmaMetricsCard
            title="Participants"
            value={stats.participants}
            subtitle="Active members"
            trend={15}
            trendLabel="from last event"
            icon={Users}
            iconBgClass="bg-cyan-accent"
          />
          <FigmaMetricsCard
            title="Free Agents"
            value={stats.freeAgents}
            subtitle="Looking for teams"
            trend={-8}
            trendLabel="from last event"
            icon={User}
            iconBgClass="bg-purple-accent"
          />
          <FigmaMetricsCard
            title="Submissions"
            value={stats.submissions}
            subtitle="Projects submitted"
            trend={25}
            trendLabel="from last event"
            icon={Send}
            iconBgClass="bg-orange-accent"
          />
          <FigmaMetricsCard
            title="Teams"
            value={stats.teams}
            subtitle="Active squads"
            trend={12}
            trendLabel="from last event"
            icon={Users}
            iconBgClass="bg-cyan-accent"
          />
        </div>
        
        {/* Section 4: Activity Overview Chart */}
        <ActivityOverviewChart />
        
        {/* Section 5: Live Activity + Schedule Preview (2 columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <LiveActivitySection 
            activityFeed={activityFeed}
            onNavigate={onNavigate}
          />
          <SchedulePreview onNavigate={onNavigate} />
        </div>
        
        {/* Section 6: Awards + Promo + FAQ (3 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AwardsPrizes />
          <NewToHackDayPromo onNavigate={onNavigate} />
          <FAQSection />
        </div>
      </div>
    </AppLayout>
  );
}

export default memo(Dashboard);
