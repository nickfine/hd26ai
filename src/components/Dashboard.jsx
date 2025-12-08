/**
 * Dashboard Page
 * Main hub showing activity feed, schedule, awards, and quick actions.
 */

import { useState } from 'react';
import {
  Users,
  User,
  Heart,
  Cpu,
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
} from 'lucide-react';
import AppLayout from './AppLayout';
import Button from './ui/Button';
import Card from './ui/Card';
import Badge, { CallsignBadge, HeartbeatDot } from './ui/Badge';
import { HStack, VStack } from './layout';
import { cn, getAllegianceConfig, formatNameWithCallsign } from '../lib/design-system';
import { PROMO_IMAGES } from '../data/mockData';

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_ACTIVITY_FEED = [
  { id: 1, type: 'join', user: 'Maya Rodriguez', callsign: 'HTML Hotshot', team: 'Neural Nexus', side: 'ai', time: '2 min ago' },
  { id: 2, type: 'create', user: 'Jordan Lee', callsign: 'Prompt Wizard', team: 'Quantum Collective', side: 'ai', time: '5 min ago' },
  { id: 3, type: 'join', user: 'Casey Brooks', callsign: 'CSS Wizard', team: 'Human Touch', side: 'human', time: '12 min ago' },
  { id: 4, type: 'allegiance', user: 'River Chen', callsign: 'Stack Overflow', side: 'ai', time: '15 min ago' },
  { id: 5, type: 'create', user: 'Pat O\'Brien', callsign: 'Circuit Breaker', team: 'Carbon Coalition', side: 'human', time: '23 min ago' },
  { id: 6, type: 'join', user: 'Skyler Vance', callsign: 'Data Drifter', team: 'Digital Overlords', side: 'ai', time: '31 min ago' },
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

// ============================================================================
// PROMO TILE COMPONENT
// ============================================================================

function PromoTile({ src, alt, colorScheme = 'ai', className }) {
  const [imageError, setImageError] = useState(false);

  const colorConfig = {
    ai: {
      bg: 'bg-ai/5',
      iconBg: 'bg-ai/20',
      iconColor: 'text-ai',
      textPrimary: 'text-ai',
      textSecondary: 'text-ai/60',
    },
    special: {
      bg: 'bg-brand/5',
      iconBg: 'bg-brand/20',
      iconColor: 'text-brand',
      textPrimary: 'text-brand',
      textSecondary: 'text-brand/60',
    },
    human: {
      bg: 'bg-human/5',
      iconBg: 'bg-human/20',
      iconColor: 'text-human',
      textPrimary: 'text-human',
      textSecondary: 'text-human/60',
    },
  };

  const colors = colorConfig[colorScheme] || colorConfig.ai;

  // Show placeholder if no image or image failed to load
  if (!src || imageError) {
    return (
      <Card 
        variant="ghost" 
        padding="none"
        className={cn(
          'border-2 border-dashed border-arena-border flex items-center justify-center min-h-[200px]',
          colors.bg,
          className
        )}
      >
        <VStack align="center" gap="4" className="p-6">
          <div className={cn('w-16 h-16 rounded-full flex items-center justify-center', colors.iconBg)}>
            <ImageIcon className={cn('w-8 h-8', colors.iconColor)} />
          </div>
          <p className={cn('text-sm font-medium', colors.textPrimary)}>Promo Graphic</p>
          <p className={cn('text-xs', colors.textSecondary)}>Coming Soon</p>
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
}

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

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <AppLayout
      user={user}
      teams={teams}
      allegianceStyle={allegianceStyle}
      onNavigate={onNavigate}
      eventPhase={eventPhase}
      activeNav="dashboard"
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

        {/* Bento Grid - 24px gap for premium breathing room */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Team Finder Feature Box */}
          <Card variant="outlined" padding="md" className="animate-fade-in stagger-1">
            <Card.Label>Team Finder</Card.Label>
            <Card.Title className="mb-3">Find Your Squad</Card.Title>
            <p className="text-sm text-text-body mb-4">
              Browse open teams looking for members or discover free agents with matching skills.
            </p>
            <HStack gap="3">
              <Button
                variant="primary"
                size="md"
                onClick={() => onNavigate('marketplace', { tab: 'teams' })}
                leftIcon={<Users className="w-4 h-4" />}
                className="flex-1"
              >
                Browse Teams
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => onNavigate('marketplace', { tab: 'people' })}
                leftIcon={<User className="w-4 h-4" />}
                className="flex-1"
              >
                Free Agents
              </Button>
            </HStack>
          </Card>

          {/* Project Gallery Feature Box - Only show during voting phase */}
          {eventPhase === 'voting' && (
            <Card variant="accent" padding="md" className="animate-fade-in stagger-2">
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
          <Card variant="default" padding="md" className="animate-fade-in stagger-2">
            <HStack justify="between" align="center" className="mb-4">
              <Card.Label className="mb-0">Live Activity</Card.Label>
              <HStack gap="1.5" align="center" className="text-xs text-success">
                <HeartbeatDot className="text-success" />
                <span className="font-bold tracking-wider uppercase">Live</span>
              </HStack>
            </HStack>
            <VStack gap="0" className="max-h-48 overflow-y-auto">
              {MOCK_ACTIVITY_FEED.map((activity) => {
                const config = getAllegianceConfig(activity.side);
                const formatted = formatNameWithCallsign(activity.user, activity.callsign);
                const borderColor = activity.side === 'ai' ? 'border-ai' : activity.side === 'human' ? 'border-human' : 'border-arena-border';
                
                return (
                  <div 
                    key={activity.id} 
                    className={cn(
                      'flex items-start gap-3 py-2.5 pl-3 border-l-2 text-sm',
                      borderColor
                    )}
                  >
                    {/* Team-colored pulsing dot */}
                    <HeartbeatDot className={activity.side === 'ai' ? 'text-ai' : 'text-human'} />
                    
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-white">
                        {formatted.hasCallsign ? (
                          <>
                            {formatted.firstName}{' '}
                            <CallsignBadge allegiance={activity.side}>
                              {formatted.callsign}
                            </CallsignBadge>
                            {formatted.lastName && ` ${formatted.lastName}`}
                          </>
                        ) : activity.user}
                      </span>
                      {activity.type === 'join' && <span className="text-text-body"> joined </span>}
                      {activity.type === 'create' && <span className="text-text-body"> created </span>}
                      {activity.type === 'allegiance' && (
                        <span className="text-text-body"> chose {activity.side.toUpperCase()} side</span>
                      )}
                      {activity.team && (
                        <span className="font-bold" style={{ color: config.color }}>
                          {activity.team}
                        </span>
                      )}
                      <div className="text-xs text-text-muted mt-0.5">{activity.time}</div>
                    </div>
                  </div>
                );
              })}
            </VStack>
          </Card>

          {/* Schedule Preview Widget */}
          <Card variant="default" padding="md" className="animate-fade-in stagger-3">
            <HStack justify="between" align="center" className="mb-4">
              <Card.Label className="mb-0">Schedule Preview</Card.Label>
              <Calendar className="w-4 h-4 icon-orange" />
            </HStack>
            <VStack gap="3">
              {MOCK_SCHEDULE.map((item, index) => (
                <HStack 
                  key={item.id} 
                  gap="3"
                  className={cn('pb-3', index < MOCK_SCHEDULE.length - 1 && 'border-b border-arena-border')}
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
          <Card variant="default" padding="md" className="animate-fade-in stagger-4">
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
          <Card variant="default" padding="md" className="md:col-span-2 animate-fade-in stagger-5">
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

export default Dashboard;
