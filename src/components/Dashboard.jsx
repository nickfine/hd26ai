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
} from 'lucide-react';
import AppLayout from './AppLayout';
import Button from './ui/Button';
import Card from './ui/Card';
import Badge from './ui/Badge';
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
      bg: 'bg-gradient-to-br from-ai-50 to-teal-50',
      iconBg: 'bg-ai-100',
      iconColor: 'text-ai-300',
      textPrimary: 'text-ai-400',
      textSecondary: 'text-ai-300',
    },
    special: {
      bg: 'bg-gradient-to-br from-special-50 to-indigo-50',
      iconBg: 'bg-special-100',
      iconColor: 'text-special-300',
      textPrimary: 'text-special-400',
      textSecondary: 'text-special-300',
    },
    human: {
      bg: 'bg-gradient-to-br from-human-50 to-emerald-50',
      iconBg: 'bg-human-100',
      iconColor: 'text-human-300',
      textPrimary: 'text-human-400',
      textSecondary: 'text-human-300',
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
          'border-2 border-dashed border-neutral-300 flex items-center justify-center min-h-[200px]',
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
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Promo Tile 1 - Always visible, full width */}
          <PromoTile 
            src={PROMO_IMAGES.promo1} 
            alt="Promo Banner 1" 
            colorScheme="ai"
            className="md:col-span-2"
          />

          {/* Team Finder Feature Box */}
          <Card variant="outlined" padding="md">
            <Card.Label>Team Finder</Card.Label>
            <Card.Title className="mb-3">Find Your Squad</Card.Title>
            <p className="text-sm text-neutral-500 mb-4">
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
            <Card variant="accent" padding="md">
              <Card.Label className="text-accent-600">Project Gallery</Card.Label>
              <Card.Title className="text-accent-900 mb-3">Vote for Projects</Card.Title>
              <p className="text-sm text-accent-700 mb-4">
                Browse all submitted hackathon projects and vote for your favorites!
              </p>
              <Button
                variant="accent"
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
          <Card variant="default" padding="md">
            <HStack justify="between" align="center" className="mb-4">
              <Card.Label className="mb-0">Live Activity</Card.Label>
              <HStack gap="1" align="center" className="text-xs text-success-600">
                <Activity className="w-3 h-3 animate-pulse" />
                Live
              </HStack>
            </HStack>
            <VStack gap="3" className="max-h-48 overflow-y-auto">
              {MOCK_ACTIVITY_FEED.map((activity) => {
                const config = getAllegianceConfig(activity.side);
                const formatted = formatNameWithCallsign(activity.user, activity.callsign);
                return (
                  <HStack key={activity.id} gap="3" align="start" className="text-sm">
                    <div
                      className={cn(
                        'w-6 h-6 flex-shrink-0 flex items-center justify-center text-xs',
                        activity.side === 'ai' ? 'rounded-ai' : 'rounded-full'
                      )}
                      style={{ backgroundColor: config.bgColor }}
                    >
                      {activity.side === 'ai' 
                        ? <Cpu className="w-3 h-3" style={{ color: config.color }} />
                        : <Heart className="w-3 h-3" style={{ color: config.color }} />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={cn(
                        'font-bold text-neutral-900 inline-flex items-center gap-1 flex-wrap',
                        activity.side === 'ai' && 'font-mono'
                      )}>
                        {formatted.hasCallsign ? (
                          <>
                            {formatted.firstName}
                            <Badge 
                              variant={activity.side === 'ai' ? 'ai' : activity.side === 'human' ? 'human' : 'neutral'} 
                              size="xs"
                            >
                              {formatted.callsign}
                            </Badge>
                            {formatted.lastName}
                          </>
                        ) : activity.user}
                      </span>
                      {activity.type === 'join' && <span className="text-neutral-500"> joined </span>}
                      {activity.type === 'create' && <span className="text-neutral-500"> created </span>}
                      {activity.type === 'allegiance' && (
                        <span className="text-neutral-500"> chose {activity.side.toUpperCase()} side</span>
                      )}
                      {activity.team && (
                        <span className="font-bold" style={{ color: config.color }}>
                          {activity.team}
                        </span>
                      )}
                      <div className="text-xs text-neutral-400">{activity.time}</div>
                    </div>
                  </HStack>
                );
              })}
            </VStack>
          </Card>

          {/* Schedule Preview Widget */}
          <Card variant="default" padding="md">
            <HStack justify="between" align="center" className="mb-4">
              <Card.Label className="mb-0">Schedule Preview</Card.Label>
              <Calendar className="w-4 h-4 text-neutral-400" />
            </HStack>
            <VStack gap="3">
              {MOCK_SCHEDULE.map((item, index) => (
                <HStack 
                  key={item.id} 
                  gap="3"
                  className={cn('pb-3', index < MOCK_SCHEDULE.length - 1 && 'border-b border-neutral-100')}
                >
                  <div className="w-16 flex-shrink-0">
                    <div className="text-xs font-mono font-bold text-neutral-900">{item.time}</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-neutral-900">{item.title}</div>
                    <div className="text-xs text-neutral-500">{item.description}</div>
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
          <Card variant="default" padding="md">
            <HStack justify="between" align="center" className="mb-4">
              <Card.Label className="mb-0">Awards & Prizes</Card.Label>
              <Trophy className="w-4 h-4 text-accent-500" />
            </HStack>
            <VStack gap="3">
              {MOCK_AWARDS.map((award) => {
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
                    className="flex items-center gap-3"
                  >
                    <Icon className={cn(
                      'w-8 h-8 flex-shrink-0',
                      isAI ? 'text-ai-600' : isHuman ? 'text-human-600' : 'text-accent-500'
                    )} />
                    <div className="min-w-0">
                      <div className={cn(
                        'font-bold text-sm',
                        isAI ? 'font-mono text-ai-700' : isHuman ? 'text-human-700' : 'text-accent-700'
                      )}>
                        {award.title}
                      </div>
                      <div className="text-xs text-neutral-500">{award.prize}</div>
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
          <Card variant="default" padding="md" className="md:col-span-2">
            <HStack justify="between" align="center" className="mb-4">
              <Card.Label className="mb-0">Frequently Asked Questions</Card.Label>
              <HelpCircle className="w-4 h-4 text-neutral-400" />
            </HStack>
            <VStack gap="2">
              {MOCK_FAQ.map((faq) => (
                <div key={faq.id} className="border border-neutral-200">
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors"
                  >
                    <span className="font-bold text-sm text-neutral-900">{faq.question}</span>
                    {expandedFaq === faq.id 
                      ? <ChevronUp className="w-4 h-4 text-neutral-400" />
                      : <ChevronDown className="w-4 h-4 text-neutral-400" />
                    }
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="px-4 pb-4 text-sm text-neutral-600 border-t border-neutral-100 pt-3">
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
