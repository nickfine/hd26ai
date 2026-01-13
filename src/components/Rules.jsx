/**
 * Rules Page
 * General hackathon rules and guidelines.
 */

import {
  Check,
  X,
  AlertTriangle,
  Lightbulb,
  Code,
  FileText,
  Zap,
  Users,
  Clock,
  Award,
} from 'lucide-react';
import { cn } from '../lib/design-system';
import AppLayout from './AppLayout';

// ============================================================================
// RULES DATA
// ============================================================================

const HACKATHON_RULES = {
  title: 'Hackathon Rules',
  subtitle: 'Guidelines and expectations for all participants',
  allowed: [
    {
      title: 'Search Engines & Documentation',
      description: 'Google, DuckDuckGo, Bing, Stack Overflow, and official documentation',
      example: 'Searching for solutions or reading documentation',
    },
    {
      title: 'IDE Features',
      description: 'Standard IDE autocomplete, IntelliSense, and code formatting tools',
      example: 'Using VS Code autocomplete or Prettier for formatting',
    },
    {
      title: 'Libraries & Frameworks',
      description: 'Using npm packages, UI libraries, and open-source frameworks',
      example: 'Installing and using React, Tailwind CSS, or Express.js',
    },
    {
      title: 'Templates & Boilerplates',
      description: 'Starting from project templates and scaffolding tools',
      example: 'Running "npm create vite@latest" to scaffold a project',
    },
    {
      title: 'Collaboration Tools',
      description: 'Pair programming, code reviews, and team collaboration',
      example: 'Working together with teammates on code',
    },
  ],
  notAllowed: [
    {
      title: 'Pre-built Projects',
      description: 'Cannot submit projects that were built before the hackathon started',
      example: 'Submitting a project you worked on last month',
    },
    {
      title: 'Purchased Solutions',
      description: 'No buying pre-made code, designs, or complete solutions',
      example: 'Purchasing templates or complete projects from marketplaces',
    },
    {
      title: 'Plagiarism',
      description: 'All code must be original work created during the hackathon',
      example: 'Copying entire projects or significant portions from elsewhere',
    },
  ],
  tips: [
    'Work together with your team — collaboration is key!',
    'Take breaks when needed — rest helps productivity',
    'Plan before coding — whiteboarding and design help',
    'Leverage your team\'s diverse skills and perspectives',
  ],
};

const GENERAL_RULES = [
  {
    icon: Clock,
    title: 'Time Limit',
    description: 'All work must be completed within the official hackathon timeframe. No pre-built projects.',
  },
  {
    icon: Users,
    title: 'Team Size',
    description: 'Teams must have 2-6 members. All members must be registered participants.',
  },
  {
    icon: Code,
    title: 'Original Work',
    description: 'Projects must be original work created during the hackathon. Open source libraries are allowed.',
  },
  {
    icon: FileText,
    title: 'Submission Requirements',
    description: 'Submit source code, a demo video (max 3 min), and project description by the deadline.',
  },
  {
    icon: Award,
    title: 'Judging Criteria',
    description: 'Projects judged on Innovation, Execution, Design, and Theme Adherence.',
  },
  {
    icon: AlertTriangle,
    title: 'Code of Conduct',
    description: 'Be respectful, inclusive, and professional. Harassment of any kind will not be tolerated.',
  },
];

// ============================================================================
// COMPONENT
// ============================================================================

function Rules({ user, teams, onNavigate, eventPhase }) {
  const renderRuleSection = (rules) => {
    return (
      <div className="bg-arena-card border border-arena-border rounded-card overflow-hidden">
        {/* Section Header */}
        <div className="relative p-6 border-b border-arena-border bg-arena-elevated">
          <div>
            <h2 className="text-2xl font-heading font-black text-white">
              {rules.title}
            </h2>
            <p className="text-sm text-text-secondary">{rules.subtitle}</p>
          </div>
        </div>

        <div className="relative p-6">
          {/* Allowed Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                <Check className="w-5 h-5 text-success" />
              </div>
              <h3 className="text-lg font-bold text-success">What's Allowed</h3>
            </div>
            <div className="grid gap-3">
              {rules.allowed.map((item, index) => (
                <div
                  key={index}
                  className="bg-arena-elevated border border-arena-border p-5 rounded-lg
                             hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <Check className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">{item.title}</div>
                      <div className="text-sm text-text-secondary mt-1">{item.description}</div>
                      <div className="text-xs text-success bg-success/10 px-3 py-1.5 rounded-full 
                                      inline-flex items-center gap-1 mt-2 border border-success/20">
                        <Lightbulb className="w-3 h-3" />
                        Example: {item.example}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Not Allowed Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-error/20 flex items-center justify-center">
                <X className="w-5 h-5 text-error" />
              </div>
              <h3 className="text-lg font-bold text-error">What's NOT Allowed</h3>
            </div>
            <div className="grid gap-3">
              {rules.notAllowed.map((item, index) => (
                <div
                  key={index}
                  className="bg-arena-elevated border border-arena-border p-5 rounded-lg
                             hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <X className="w-6 h-6 text-error flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">{item.title}</div>
                      <div className="text-sm text-text-secondary mt-1">{item.description}</div>
                      <div className="text-xs text-error bg-error/10 px-3 py-1.5 rounded-full 
                                      inline-flex items-center gap-1 mt-2 border border-error/20">
                        <AlertTriangle className="w-3 h-3" />
                        Example: {item.example}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-arena-elevated border border-arena-border p-5 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-text-secondary" />
              <h4 className="font-bold text-text-secondary">
                Pro Tips
              </h4>
            </div>
            <ul className="space-y-2">
              {rules.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="text-text-secondary">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AppLayout
      user={user}
      teams={teams}
      onNavigate={onNavigate}
      eventPhase={eventPhase}
      activeNav="rules"
    >
      <div className="p-4 sm:p-6">
        {/* Page Header */}
        <div className="text-center mb-10">
          <div className="bg-arena-card border border-arena-border inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4">
            <FileText className="w-5 h-5 text-text-secondary" />
            <span className="font-bold text-sm text-white">RULES</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black text-white mb-3 font-display">
            HACKDAY RULES
          </h1>
          <p className="text-arena-secondary max-w-2xl mx-auto">
            Guidelines and expectations for all participants.
          </p>
        </div>

        {/* General Rules */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-text-secondary" />
            General Rules (All Teams)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GENERAL_RULES.map((rule, index) => {
              const Icon = rule.icon;
              return (
                <div
                  key={index}
                  className="glass-card human-glow p-4 rounded-card 
                             hover:border-brand/30 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-brand" />
                    </div>
                    <div>
                      <div className="font-bold text-white">{rule.title}</div>
                      <div className="text-sm text-text-secondary">{rule.description}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hackathon Rules */}
        <div className="max-w-4xl mx-auto">
          {renderRuleSection(HACKATHON_RULES)}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <div className="bg-arena-card border border-arena-border inline-block p-6 rounded-card">
            <h3 className="text-lg font-bold text-white mb-2">
              Questions about the rules?
            </h3>
            <p className="text-sm text-gray-300 mb-4">
              Reach out to the organizers on Slack or check the FAQ section.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3 font-bold text-sm text-white rounded-lg
                         bg-gradient-to-r from-[#FF8A50] to-[#FF4500]
                         hover:from-[#FF9966] hover:to-[#FF5722]
                         hover:-translate-y-0.5 transition-all shadow-lg
                         hover:shadow-[0_8px_30px_rgba(255,107,53,0.3)]"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default Rules;
