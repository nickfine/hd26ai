/**
 * New to HackDay? Page
 * Onboarding guide and rules overview for new participants.
 */

import {
  Sparkles,
  Users,
  CheckCircle,
  ArrowRight,
  BookOpen,
  UserPlus,
  Code,
  Send,
  Trophy,
  Calendar,
  Zap,
  HelpCircle,
} from 'lucide-react';
import AppLayout from './AppLayout';
import Button from './ui/Button';
import Card from './ui/Card';
import { HStack, VStack } from './layout';
import { cn } from '../lib/design-system';

// ============================================================================
// ONBOARDING STEPS
// ============================================================================

const ONBOARDING_STEPS = [
  {
    id: 1,
    title: 'Join or Create an Idea',
    description: 'Find teammates in the marketplace or create your own idea. Teams can have 2-6 members.',
    icon: Users,
    color: 'brand',
    action: 'Browse Ideas',
    actionRoute: 'marketplace',
  },
  {
    id: 2,
    title: 'Build Your Project',
    description: 'Work with your team to create something amazing. Follow the rules and guidelines.',
    icon: Code,
    color: 'brand',
    action: 'View Rules',
    actionRoute: 'rules',
  },
  {
    id: 3,
    title: 'Submit Your Project',
    description: 'Submit your project with a demo video, repository link, and description before the deadline.',
    icon: Send,
    color: 'brand',
    action: 'Go to Submission',
    actionRoute: 'submission',
  },
];

// ============================================================================
// KEY RULES SUMMARY
// ============================================================================

const KEY_RULES = [
  {
    title: 'Team Formation',
    description: 'Teams must have 2-6 members.',
    icon: Users,
  },
  {
    title: 'Time Limit',
    description: 'All work must be completed within the official hackathon timeframe. No pre-built projects allowed.',
    icon: Calendar,
  },
  {
    title: 'Submission Requirements',
    description: 'Submit source code, a demo video (max 3 min), repository link, and project description by the deadline.',
    icon: Send,
  },
  {
    title: 'Judging Criteria',
    description: 'Projects are judged on Innovation, Execution, Design, and Theme Adherence. There\'s also a People\'s Choice award.',
    icon: Trophy,
  },
];


// ============================================================================
// COMPONENT
// ============================================================================

function NewToHackDay({ user, teams, onNavigate, eventPhase }) {
  return (
    <AppLayout
      user={user}
      teams={teams}
      onNavigate={onNavigate}
      eventPhase={eventPhase}
      activeNav="new-to-hackday"
    >
      <div className="p-4 sm:p-6">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-arena-card border border-arena-border rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-text-secondary" />
            <span className="font-bold text-sm text-white">GETTING STARTED</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 font-display">
            NEW TO HACKDAY?
          </h1>
          <p className="text-text-body max-w-2xl mx-auto">
            Welcome to HackDay 2026! This guide will help you get started and understand how the event works.
          </p>
        </div>

        {/* Welcome Section */}
        <Card variant="accent" padding="md" className="mb-6 animate-fade-in">
          <VStack gap="4">
            <HStack gap="3" align="center">
              <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-brand" />
              </div>
              <div>
                <Card.Title className="mb-1">What is HackDay?</Card.Title>
                <p className="text-sm text-text-body">
                  HackDay 2026 is a collaborative hackathon. Form a team and build something amazing within 24 hours. The best projects win awards and recognition!
                </p>
              </div>
            </HStack>
          </VStack>
        </Card>

        {/* Onboarding Steps */}
        <div className="mb-8">
          <HStack justify="between" align="center" className="mb-4">
            <Card.Label className="mb-0">Getting Started</Card.Label>
            <HelpCircle className="w-4 h-4 icon-orange" />
          </HStack>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ONBOARDING_STEPS.map((step, index) => {
              const Icon = step.icon;
              const colorClass = 'text-text-secondary';
              const bgClass = 'bg-arena-elevated';
              const borderClass = 'border-arena-border';
              
              return (
                <Card
                  key={step.id}
                  variant="default"
                  padding="md"
                  hoverable
                  className={cn('animate-fade-in', `stagger-${index + 1}`)}
                >
                  <HStack gap="3" align="start">
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                      bgClass
                    )}>
                      <Icon className={cn('w-5 h-5', colorClass)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-text-muted">STEP {step.id}</span>
                        <CheckCircle className="w-4 h-4 text-success" />
                      </div>
                      <Card.Title className="mb-2 text-base">{step.title}</Card.Title>
                      <p className="text-sm text-text-body mb-3">{step.description}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onNavigate(step.actionRoute)}
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                        className={cn(colorClass)}
                      >
                        {step.action}
                      </Button>
                    </div>
                  </HStack>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Key Rules Summary */}
        <div className="mb-8">
          <HStack justify="between" align="center" className="mb-4">
            <Card.Label className="mb-0">Key Rules</Card.Label>
            <BookOpen className="w-4 h-4 icon-orange" />
          </HStack>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {KEY_RULES.map((rule, index) => {
              const Icon = rule.icon;
              return (
                <Card
                  key={index}
                  variant="default"
                  padding="md"
                  className="animate-fade-in stagger-5"
                >
                  <HStack gap="3" align="start">
                    <div className="w-10 h-10 rounded-lg bg-brand/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-brand" />
                    </div>
                    <div>
                      <div className="font-bold text-white mb-1">{rule.title}</div>
                      <div className="text-sm text-text-body">{rule.description}</div>
                    </div>
                  </HStack>
                </Card>
              );
            })}
          </div>
        </div>


        {/* Quick Links */}
        <Card variant="default" padding="md" className="animate-fade-in stagger-6">
          <Card.Label className="mb-3">Quick Links</Card.Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => onNavigate('rules')}
              leftIcon={<BookOpen className="w-4 h-4" />}
            >
              View Full Rules
            </Button>
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => onNavigate('marketplace')}
              leftIcon={<Users className="w-4 h-4" />}
            >
              Browse Ideas
            </Button>
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => onNavigate('profile')}
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              Complete Profile
            </Button>
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => onNavigate('schedule')}
              leftIcon={<Calendar className="w-4 h-4" />}
            >
              View Schedule
            </Button>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}

export default NewToHackDay;

