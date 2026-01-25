/**
 * Dashboard Page
 * Main hub showing activity feed, schedule, awards, and quick actions.
 */

import { useState, memo, useCallback } from 'react';
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
  Image as ImageIcon,
  Zap,
  Sparkles,
  UserPlus,
  ArrowRight,
  Clock,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Plus,
  Eye,
} from 'lucide-react';
import AppLayout from './AppLayout';
import Button from './ui/Button';
import Card from './ui/Card';
import Badge, { HeartbeatDot, CallsignBadge } from './ui/Badge';
import { HStack, VStack } from './layout';
import { cn, formatNameWithCallsign } from '../lib/design-system';
import { PROMO_IMAGES } from '../data/mockData';
import { StatusBanner } from './shared';
import FreeAgentReminderBanner from './shared/FreeAgentReminderBanner';

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_ACTIVITY_FEED = [
  { id: 1, type: 'join', user: 'Maya Rodriguez', callsign: 'HTML Hotshot', team: 'Neural Nexus', time: '2 min ago' },
  { id: 2, type: 'create', user: 'Jordan Lee', callsign: 'Prompt Wizard', team: 'Quantum Collective', time: '5 min ago' },
  { id: 3, type: 'join', user: 'Casey Brooks', callsign: 'CSS Wizard', team: 'Human Touch', time: '12 min ago' },
  { id: 4, type: 'create', user: 'Pat O\'Brien', callsign: 'Circuit Breaker', team: 'Carbon Coalition', time: '23 min ago' },
  { id: 5, type: 'join', user: 'Skyler Vance', callsign: 'Data Drifter', team: 'Digital Overlords', time: '31 min ago' },
];

const MOCK_SCHEDULE = [
  { id: 1, time: '10:00 AM', title: 'Opening Ceremony', description: 'Kickoff & rules explanation' },
  { id: 2, time: '10:30 AM', title: 'Team Formation Deadline', description: 'Final team submissions' },
  { id: 3, time: '11:00 AM', title: 'Hacking Begins', description: 'Start building!' },
  { id: 4, time: '5:00 PM', title: 'Submission Deadline', description: 'All projects due' },
];

const MOCK_AWARDS = [
  { id: 1, title: 'Grand HackDay Champion', prize: 'Personalised Callsign HackDay26 T-Shirts', icon: Trophy, description: 'Custom t-shirts with your callsign + digital swag' },
  { id: 2, title: 'People\'s Choice', prize: 'Personalised Idea Zoom Wallpaper', icon: Trophy, description: 'Custom Zoom background featuring your project idea' },
];

const MOCK_FAQ = [
  { id: 1, question: 'How do ideas work?', answer: 'Ideas are projects teams work on. Teams can have 2-6 members. You can join an existing idea or create your own.' },
  { id: 2, question: 'What can I build?', answer: 'Anything! Web apps, mobile apps, APIs, games, tools - as long as it fits the theme.' },
  { id: 3, question: 'How is judging done?', answer: 'Projects are judged on innovation, execution, design, and theme adherence. There will be peer voting for People\'s Choice award.' },
];

// Phase-specific default messages when no custom MOTD is set
const PHASE_DEFAULT_MOTD = {
  registration: "Registration is open! Sign up and join or create an idea.",
  team_formation: "Form your teams! Browse ideas or create your own.",
  hacking: "Hacking in progress! Build something amazing.",
  submission: "Submissions are open! Don't forget to submit your project.",
  voting: "Voting is live! Check out the projects and cast your votes.",
  judging: "Judging in progress. Results coming soon!",
  results: "Results are in! Check out the winners.",
};

// ============================================================================
// PROMO TILE COMPONENT
// ============================================================================

const PromoTile = memo(function PromoTile({ src, alt, className }) {
  const [imageError, setImageError] = useState(false);

  // Show placeholder if no image or image failed to load
  if (!src || imageError) {
    return (
      <Card 
        variant="ghost" 
        padding="none"
        className={cn(
          'border-2 border-dashed border-arena-border flex items-center justify-center min-h-[200px] bg-arena-elevated',
          className
        )}
      >
        <VStack align="center" gap="4" className="p-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-arena-card">
            <ImageIcon className="w-8 h-8 text-text-secondary" />
          </div>
          <p className="text-sm font-medium text-text-secondary">Promo Graphic</p>
          <p className="text-xs text-text-muted">Coming Soon</p>
        </VStack>
      </Card>
    );
  }

  return (
    <Card 
      variant="ghost" 
      padding="none"
      className={cn(
        'overflow-hidden min-h-[200px]',
        className
      )}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover min-h-[200px]"
        onError={() => setImageError(true)}
      />
    </Card>
  );
});

// ============================================================================
// FIRST-TIME USER DETECTION
// ============================================================================

const isFirstTimeUser = (user, teams) => {
  if (!user) return false;
  
  // Check if user is not on any team
  const userTeam = teams.find((team) => 
    team.captainId === user?.id || 
    team.members?.some(m => m.id === user?.id)
  );
  const hasNoTeam = !userTeam;
  
  // First-time user: no team
  return hasNoTeam;
};

// ============================================================================
// SIGNUP PROMO BOX
// ============================================================================

const SignupPromoBox = memo(function SignupPromoBox({ user, teams, onNavigate }) {
  if (!isFirstTimeUser(user, teams)) {
    return null;
  }

  return (
    <Card variant="accent" padding="md" className="animate-fade-in stagger-1">
      <Card.Label className="text-brand">Get Started</Card.Label>
      <Card.Title className="text-white mb-3">Complete Your Setup</Card.Title>
      <p className="text-sm text-text-body mb-4">
        Join an idea to start participating in HackDay 2026!
      </p>
      <Button
        variant="primary"
        size="md"
        fullWidth
        onClick={() => onNavigate('profile')}
        leftIcon={<UserPlus className="w-4 h-4" />}
        rightIcon={<ArrowRight className="w-4 h-4" />}
      >
        Complete Profile
      </Button>
    </Card>
  );
});

// ============================================================================
// NEW TO HACKDAY PROMO BOX
// ============================================================================

const NewToHackDayPromo = memo(function NewToHackDayPromo({ onNavigate }) {
  return (
    <Card variant="outlined" padding="lg" className="animate-fade-in stagger-2">
      <VStack gap="3" align="start">
        <h3 className="text-3xl font-black text-white leading-tight">
          New to HackDay?{' '}
          <button
            onClick={() => onNavigate('new-to-hackday')}
            className="text-brand hover:text-brand/80 underline underline-offset-4 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-bg-primary rounded"
          >
            Start here
          </button>
        </h3>
      </VStack>
    </Card>
  );
});

// ============================================================================
// HERO BENTO COMPONENT
// ============================================================================

const HeroBento = memo(function HeroBento({ eventPhase, user, teams, event, onNavigate, onNavigateToTeam }) {
  // Check if user has a team (as a member or captain)
  const userTeam = teams.find((team) => 
    team.captainId === user?.id || 
    team.members?.some(m => m.id === user?.id)
  );
  const hasTeam = !!userTeam;
  
  // Check if user has created a team (is captain)
  const userCreatedTeam = teams.find((team) => team.captainId === user?.id);
  const hasCreatedTeam = !!userCreatedTeam;
  
  // Check if user has applied to join any team (has pending join request)
  const hasAppliedToTeam = teams.some((team) => 
    team.joinRequests?.some((request) => request.userId === user?.id)
  );
  
  const hasSignedUp = user?.name && user.name.trim().length > 0; // User has completed signup if they have a name

  // Get MOTD from event (for hacking phase)
  const motd = event?.motd || '';

  // Render based on phase
  switch (eventPhase) {
    case 'registration':
      // If user has a team, show team confirmation message
      if (hasTeam) {
        return (
          <Card variant="accent" padding="lg" className="md:col-span-2 animate-fade-in">
            <VStack gap="4" align="start">
              <HStack gap="3" align="center">
                <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-brand" />
                </div>
                <div>
                  <Card.Label className="text-brand mb-0">Team Confirmed</Card.Label>
                  <Card.Title className="text-white mb-0">You're All Set!</Card.Title>
                </div>
              </HStack>
              <p className="text-base text-text-body">
                {hasCreatedTeam
                  ? `You've created ${userTeam.name}! ${userTeam.members?.length < userTeam.maxMembers ? 'Continue recruiting members to build your squad.' : 'Your team is complete and ready for HackDay!'}`
                  : `You're part of ${userTeam.name}! Make sure your team is complete before hacking begins.`}
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={() => onNavigateToTeam ? onNavigateToTeam(userTeam.id) : onNavigate('teams', { teamId: userTeam.id })}
                leftIcon={<Users className="w-5 h-5" />}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                View Your Team
              </Button>
            </VStack>
          </Card>
        );
      }
      
      // If user has applied to join a team, show pending application message
      if (hasAppliedToTeam) {
        const appliedTeam = teams.find((team) => 
          team.joinRequests?.some((request) => request.userId === user?.id)
        );
        return (
          <Card variant="accent" padding="lg" className="md:col-span-2 animate-fade-in">
            <VStack gap="4" align="start">
              <HStack gap="3" align="center">
                <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-brand" />
                </div>
                <div>
                  <Card.Label className="text-brand mb-0">Application Pending</Card.Label>
                  <Card.Title className="text-white mb-0">Waiting for Approval</Card.Title>
                </div>
              </HStack>
              <p className="text-base text-text-body">
                Your application to join <span className="font-bold text-white">{appliedTeam?.name}</span> is pending approval from the team captain. 
                You'll be notified once they respond.
              </p>
            </VStack>
          </Card>
        );
      }
      
      // If user has signed up but no team and no pending applications, show team joining message
      // Skip this for observers (they are automatically assigned to Observers team)
      if (hasSignedUp && !hasTeam) {
        return (
          <Card variant="accent" padding="lg" className="md:col-span-2 animate-fade-in">
            <VStack gap="4" align="start">
              <HStack gap="3" align="center">
                <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-brand" />
                </div>
                <div>
                  <Card.Label className="text-brand mb-0">Welcome to HackDay!</Card.Label>
                  <Card.Title className="text-white mb-0">Join Your Idea</Card.Title>
                </div>
              </HStack>
              <p className="text-base text-text-body">
                Find an idea that matches your interests and skill development needs, or browse ideas manually. You can also enable auto-assignment to be automatically matched with teammates.
              </p>
              <HStack gap="3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => onNavigate('marketplace', { tab: 'teams' })}
                  leftIcon={<Users className="w-5 h-5" />}
                >
                  Browse Ideas
                </Button>
                {false && (
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => onNavigate('signup', { step: 4 })}
                    leftIcon={<Zap className="w-5 h-5" />}
                  >
                    Enable Auto-Assign
                  </Button>
                )}
              </HStack>
            </VStack>
          </Card>
        );
      }
      // User hasn't signed up yet - show signup message
      return (
        <Card variant="accent" padding="lg" className="md:col-span-2 animate-fade-in">
          <VStack gap="4" align="start">
            <HStack gap="3" align="center">
              <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-brand" />
              </div>
              <div>
                <Card.Label className="text-brand mb-0">Registration Open</Card.Label>
                <Card.Title className="text-white mb-0">Join HackDay 2026</Card.Title>
              </div>
            </HStack>
            <p className="text-base text-text-body">
              Sign up now to participate in HackDay 2026! Create your profile and get ready to build something amazing.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigate('signup')}
              leftIcon={<UserPlus className="w-5 h-5" />}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Sign Up Now
            </Button>
          </VStack>
        </Card>
      );

    case 'team_formation':
      // If user has a team, show team confirmation message
      if (hasTeam) {
        return (
          <Card variant="accent" padding="lg" className="md:col-span-2 animate-fade-in">
            <VStack gap="4" align="start">
              <HStack gap="3" align="center">
                <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-brand" />
                </div>
                <div>
                  <Card.Label className="text-brand mb-0">Team Confirmed</Card.Label>
                  <Card.Title className="text-white mb-0">You're All Set!</Card.Title>
                </div>
              </HStack>
              <p className="text-base text-text-body">
                {hasCreatedTeam
                  ? `You've created ${userTeam.name}! ${userTeam.members?.length < userTeam.maxMembers ? 'Continue recruiting members to build your squad.' : 'Your team is complete and ready for HackDay!'}`
                  : `You're part of ${userTeam.name}! Make sure your team is complete before hacking begins.`}
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={() => onNavigateToTeam ? onNavigateToTeam(userTeam.id) : onNavigate('teams', { teamId: userTeam.id })}
                leftIcon={<Users className="w-5 h-5" />}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                View Your Team
              </Button>
            </VStack>
          </Card>
        );
      }
      
      // If user has applied to join a team, show pending application message
      if (hasAppliedToTeam) {
        const appliedTeam = teams.find((team) => 
          team.joinRequests?.some((request) => request.userId === user?.id)
        );
        return (
          <Card variant="accent" padding="lg" className="md:col-span-2 animate-fade-in">
            <VStack gap="4" align="start">
              <HStack gap="3" align="center">
                <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-brand" />
                </div>
                <div>
                  <Card.Label className="text-brand mb-0">Application Pending</Card.Label>
                  <Card.Title className="text-white mb-0">Waiting for Approval</Card.Title>
                </div>
              </HStack>
              <p className="text-base text-text-body">
                Your application to join <span className="font-bold text-white">{appliedTeam?.name}</span> is pending approval from the team captain. 
                You'll be notified once they respond.
              </p>
            </VStack>
          </Card>
        );
      }
      
      // User doesn't have a team and hasn't applied - show team formation message
      return (
        <Card variant="accent" padding="lg" className="md:col-span-2 animate-fade-in">
          <VStack gap="4" align="start">
            <HStack gap="3" align="center">
              <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-brand" />
              </div>
              <div>
                <Card.Label className="text-brand mb-0">Team Formation</Card.Label>
                <Card.Title className="text-white mb-0">Find Your Squad</Card.Title>
              </div>
            </HStack>
            <p className="text-base text-text-body">
              Join an idea to start participating! Teams can have 2-6 members.
            </p>
            <HStack gap="3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => onNavigate('marketplace', { tab: 'teams' })}
                leftIcon={<Users className="w-5 h-5" />}
              >
                Browse Ideas
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => onNavigate('marketplace', { tab: 'teams' })}
                leftIcon={<Plus className="w-5 h-5" />}
              >
                Create Idea
              </Button>
            </HStack>
          </VStack>
        </Card>
      );
      return (
        <Card variant="default" padding="lg" className="md:col-span-2 animate-fade-in">
          <VStack gap="4" align="start">
            <HStack gap="3" align="center">
              <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div>
                <Card.Label className="mb-0">Team Formation</Card.Label>
                <Card.Title className="mb-0">You're All Set!</Card.Title>
              </div>
            </HStack>
            <p className="text-base text-text-body">
              You're part of <span className="font-bold text-white">{userTeam.name}</span>. 
              Make sure your team is complete before hacking begins!
            </p>
          </VStack>
        </Card>
      );

    case 'hacking':
      return (
        <Card variant="accent" padding="lg" className="md:col-span-2 animate-fade-in">
          <VStack gap="4" align="start">
            <HStack gap="3" align="center">
              <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-brand" />
              </div>
              <div>
                <Card.Label className="text-brand mb-0">Build Mode Active</Card.Label>
                <Card.Title className="text-white mb-0">Hacking in Progress</Card.Title>
              </div>
            </HStack>
            <p className="text-base text-text-body">
              The hackathon is underway! Build something amazing with your team. 
              Remember to submit your project before the deadline.
            </p>
            {hasTeam && (
              <Button
                variant="primary"
                size="lg"
                onClick={() => onNavigateToTeam ? onNavigateToTeam(userTeam.id) : onNavigate('teams', { teamId: userTeam.id })}
                leftIcon={<Users className="w-5 h-5" />}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                View Your Team
              </Button>
            )}
          </VStack>
        </Card>
      );

    case 'submission':
      return (
        <Card variant="accent" padding="lg" className="md:col-span-2 animate-fade-in">
          <VStack gap="4" align="start">
            <HStack gap="3" align="center">
              <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-warning" />
              </div>
              <div>
                <Card.Label className="text-warning mb-0">Submission Deadline</Card.Label>
                <Card.Title className="text-white mb-0">Time is Running Out!</Card.Title>
              </div>
            </HStack>
            <p className="text-base text-text-body">
              The submission deadline is approaching! Make sure your project is complete, 
              your demo video is ready, and all submission materials are uploaded.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigate('submission')}
              leftIcon={<ArrowRight className="w-5 h-5" />}
            >
              Submit Your Project
            </Button>
          </VStack>
        </Card>
      );

    case 'voting':
      return (
        <Card variant="accent" padding="lg" className="md:col-span-2 animate-fade-in">
          <VStack gap="4" align="start">
            <HStack gap="3" align="center">
              <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center">
                <Vote className="w-6 h-6 text-brand" />
              </div>
              <div>
                <Card.Label className="text-brand mb-0">Voting Open</Card.Label>
                <Card.Title className="text-white mb-0">Choose Your Favorites</Card.Title>
              </div>
            </HStack>
            <p className="text-base text-text-body">
              All projects have been submitted! Browse the project gallery and vote for your 
              favorite projects. You can vote for up to 5 projects.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigate('voting')}
              leftIcon={<Vote className="w-5 h-5" />}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Browse & Vote
            </Button>
          </VStack>
        </Card>
      );

    case 'results':
      return (
        <Card variant="accent" padding="lg" className="md:col-span-2 animate-fade-in">
          <VStack gap="4" align="start">
            <HStack gap="3" align="center">
              <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-brand" />
              </div>
              <div>
                <Card.Label className="text-brand mb-0">HackDay 2026 Complete</Card.Label>
                <Card.Title className="text-white mb-0">Thank You for Participating!</Card.Title>
              </div>
            </HStack>
            <p className="text-base text-text-body">
              HackDay 2026 has come to an end. Thank you to all participants for your amazing 
              projects and contributions! Check out the results and winners.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigate('results')}
              leftIcon={<Trophy className="w-5 h-5" />}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              View Results
            </Button>
          </VStack>
        </Card>
      );

    default:
      // Fallback for other phases
      return (
        <Card variant="default" padding="lg" className="md:col-span-2 animate-fade-in">
          <VStack gap="4" align="start">
            <HStack gap="3" align="center">
              <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-brand" />
              </div>
              <div>
                <Card.Label className="mb-0">HackDay 2026</Card.Label>
                <Card.Title className="mb-0">Welcome to Mission Control</Card.Title>
              </div>
            </HStack>
            <p className="text-base text-text-body">
              Your command center for HackDay 2026. Track your progress, find teammates, 
              and stay updated on the latest events.
            </p>
          </VStack>
        </Card>
      );
  }
});

// ============================================================================
// COMPONENT
// ============================================================================

function Dashboard({
  user,
  teams = [],
  onNavigate,
  onNavigateToTeam,
  eventPhase = 'voting',
  event,
  activityFeed = null, // Real-time activity feed from Supabase (null in demo mode)
  userInvites = [], // Pending team invites for the current user
  devRoleOverride = null,
  onDevRoleChange = null,
  onPhaseChange = null,
  eventPhases = {},
  onAutoAssignOptIn = null, // Handler for auto-assign opt-in
}) {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = useCallback((id) => {
    setExpandedFaq(prev => prev === id ? null : id);
  }, []);
  
  const showSignupPromo = isFirstTimeUser(user, teams);
  const isRegistrationPhase = eventPhase === 'registration';

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
    >
      <div className="p-4 sm:p-6">
        {/* Page Header with orange pulse animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full mb-4 animate-orange-pulse">
            <Zap className="w-5 h-5 text-brand icon-orange" />
            <span className="font-bold text-sm text-white">MISSION CONTROL</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-brand mb-3 font-display animate-orange-pulse-delay-1">
            DASHBOARD
          </h1>
          <p className="text-text-body max-w-2xl mx-auto">
            Your command center for HackDay 2026. Track your progress, find teammates, 
            and stay updated on the latest events.
          </p>
        </div>

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

        {/* Free Agent Reminder Banner */}
        {onAutoAssignOptIn && (
          <div className="mb-6">
            <FreeAgentReminderBanner
              user={user}
              event={event}
              onOptIn={onAutoAssignOptIn}
              isOptingIn={false}
            />
          </div>
        )}

        {/* MOTD Banner - Shown in all phases */}
        <div className="mb-6">
          <Card variant="accent" padding="md" className="animate-fade-in">
            <HStack gap="3" align="center">
              <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-brand" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-brand uppercase tracking-wider mb-1">Message of the Day</div>
                <p className="text-sm text-text-body">
                  {event?.motd || PHASE_DEFAULT_MOTD[eventPhase] || "Welcome to HackDay 2026!"}
                </p>
              </div>
            </HStack>
          </Card>
        </div>

        {/* Bento Grid - 24px gap for premium breathing room */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hero Bento - Double width, phase-specific messages */}
          <HeroBento 
            eventPhase={eventPhase} 
            user={user} 
            teams={teams} 
            event={event}
            onNavigate={onNavigate}
            onNavigateToTeam={onNavigateToTeam}
          />
          
          {/* New to HackDay Promo Box - Show when not in registration phase */}
          {!isRegistrationPhase && !showSignupPromo && (
            <NewToHackDayPromo onNavigate={onNavigate} />
          )}

          {/* Project Gallery Feature Box - Only show during voting phase */}
          {eventPhase === 'voting' && (
            <Card variant="accent" padding="md" className="animate-fade-in stagger-3">
              <Card.Label className="text-brand">Project Gallery</Card.Label>
              <Card.Title className="text-white mb-3">Vote for Projects</Card.Title>
              <p className="text-sm text-text-body mb-4">
                Browse all submitted hackathon projects and vote for your favorites!
              </p>
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => onNavigate('voting')}
                leftIcon={<Vote className="w-4 h-4" />}
              >
                Browse &amp; Vote
              </Button>
            </Card>
          )}

          {/* Live Activity Feed Widget */}
          <Card variant="default" padding="md" className="animate-fade-in stagger-3">
            <HStack justify="between" align="center" className="mb-4">
              <Card.Label className="mb-0">Live Activity</Card.Label>
              <HStack gap="1.5" align="center" className="text-xs text-success">
                <HeartbeatDot className="text-success live-pulse-glow" />
                <span className="font-bold tracking-wider uppercase">Live</span>
              </HStack>
            </HStack>
            <VStack gap="0" className="max-h-48 overflow-y-auto">
              {(activityFeed && activityFeed.length > 0 ? activityFeed : MOCK_ACTIVITY_FEED).map((activity) => {
                // Format time for display
                const timeAgo = activity.time 
                  ? (() => {
                      try {
                        const now = new Date();
                        const activityTime = new Date(activity.time);
                        // Check if date is valid
                        if (isNaN(activityTime.getTime())) {
                          return activity.time || 'recently';
                        }
                        const diffMs = now - activityTime;
                        const diffMins = Math.floor(diffMs / 60000);
                        const diffHours = Math.floor(diffMs / 3600000);
                        const diffDays = Math.floor(diffMs / 86400000);
                        
                        if (diffMins < 1) return 'just now';
                        if (diffMins < 60) return `${diffMins} min ago`;
                        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
                        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
                        return activityTime.toLocaleDateString();
                      } catch (err) {
                        console.error('Error formatting activity time:', err, activity);
                        return 'recently';
                      }
                    })()
                  : activity.time || 'recently';
                
                const formatted = formatNameWithCallsign(activity.user, activity.callsign);
                
                return (
                  <div 
                    key={activity.id} 
                    className={cn(
                      'flex items-start gap-3 py-2.5 pl-3 border-l-2 text-sm',
                      'border-arena-border'
                    )}
                  >
                    {/* Activity indicator */}
                    <HeartbeatDot className="text-text-secondary" />
                    
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-white">
                        {formatted.hasCallsign ? (
                          <>
                            {formatted.firstName}{' '}
                            <CallsignBadge>
                              {formatted.callsign}
                            </CallsignBadge>
                            {formatted.lastName && ` ${formatted.lastName}`}
                          </>
                        ) : activity.user}
                      </span>
                      {activity.type === 'join' && <span className="text-text-body"> joined </span>}
                      {activity.type === 'create' && <span className="text-text-body"> created </span>}
                      {activity.type === 'submit' && <span className="text-text-body"> submitted </span>}
                      {activity.team && (
                        <span className="font-bold text-text-secondary">
                          {activity.team}
                        </span>
                      )}
                      {activity.project && (
                        <>
                          <span className="text-text-body"> project </span>
                          <span className="font-bold text-text-secondary italic">
                            "{activity.project}"
                          </span>
                        </>
                      )}
                      <div className="text-xs text-text-muted mt-0.5">{timeAgo}</div>
                    </div>
                  </div>
                );
              })}
            </VStack>
          </Card>

          {/* Schedule Preview Widget */}
          <Card variant="default" padding="md" className="animate-fade-in stagger-4">
            <HStack justify="between" align="center" className="mb-4">
              <Card.Label className="mb-0">Schedule Preview</Card.Label>
              <Calendar className="w-4 h-4 icon-orange" />
            </HStack>
            <VStack gap="3">
              {MOCK_SCHEDULE.map((item, index) => (
                <HStack 
                  key={item.id} 
                  gap="3"
                  className={cn('pb-3', index < MOCK_SCHEDULE.length - 1 && 'border-b border-arena-border divider-glow')}
                >
                  <div className="w-16 flex-shrink-0">
                    <div className="text-xs font-mono font-bold text-brand">{item.time}</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{item.title}</div>
                    <div className="text-xs text-text-body">{item.description}</div>
                  </div>
                </HStack>
              ))}
            </VStack>
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              className="mt-4"
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              View Full Schedule
            </Button>
          </Card>

          {/* Awards List Widget */}
          <Card variant="default" padding="md" className="animate-fade-in stagger-5">
            <HStack justify="between" align="center" className="mb-4">
              <Card.Label className="mb-0">Awards & Prizes</Card.Label>
              <Trophy className="w-4 h-4 icon-orange" />
            </HStack>
            <VStack gap="3">
              {MOCK_AWARDS.map((award, index) => {
                const Icon = award.icon;
                const isAI = award.title.includes('AI');
                const isHuman = award.title.includes('Human');
                const isChampion = award.title.includes('Champion');
                return (
                  <Card
                    key={award.id}
                    variant={isChampion ? 'accent' : isAI ? 'ai' : isHuman ? 'human' : 'default'}
                    padding="sm"
                    hoverable
                    className={cn('flex items-center gap-3', isChampion && 'animate-orange-pulse')}
                  >
                    <Icon className={cn(
                      'w-8 h-8 flex-shrink-0 transition-all duration-200',
                      isAI ? 'text-ai opacity-80 hover:opacity-100 hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]' 
                        : isHuman ? 'text-human opacity-80 hover:opacity-100 hover:drop-shadow-[0_0_8px_rgba(255,69,0,0.5)]' 
                        : 'icon-orange'
                    )} />
                    <div className="min-w-0">
                      <div className={cn(
                        'font-bold text-sm',
                        isAI ? 'text-ai' : isHuman ? 'text-human' : 'text-white'
                      )}>
                        {award.title}
                      </div>
                      <div className="text-xs text-text-body">{award.prize}</div>
                    </div>
                  </Card>
                );
              })}
            </VStack>
          </Card>

          {/* Promo Tile 2 - Shows in last slot when voting tile is hidden */}
          {eventPhase !== 'voting' && (
            <PromoTile 
              src={PROMO_IMAGES.promo2} 
              alt="Promo Banner 2" 
              colorScheme="special"
            />
          )}

          {/* FAQ Widget */}
          <Card variant="default" padding="md" className="md:col-span-2 animate-fade-in stagger-6">
            <HStack justify="between" align="center" className="mb-4">
              <Card.Label className="mb-0">Frequently Asked Questions</Card.Label>
              <HelpCircle className="w-4 h-4 icon-orange" />
            </HStack>
            <VStack gap="2">
              {MOCK_FAQ.map((faq) => (
                <div key={faq.id} className="border border-arena-border rounded-card overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-arena-elevated transition-colors"
                  >
                    <span className="font-bold text-sm text-white">{faq.question}</span>
                    {expandedFaq === faq.id 
                      ? <ChevronUp className="w-4 h-4 text-text-muted" />
                      : <ChevronDown className="w-4 h-4 text-text-muted" />
                    }
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="px-4 pb-4 text-sm text-text-body border-t border-arena-border pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </VStack>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

export default memo(Dashboard);
