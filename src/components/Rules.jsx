/**
 * Rules Page
 * Human vs AI rules with opposing gradient overlays.
 * Dark Mode Cyber Arena Theme
 */

import {
  Heart,
  Cpu,
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
import { ALLEGIANCE_CONFIG, cn, getAllegianceConfig } from '../lib/design-system';
import AppLayout from './AppLayout';

// ============================================================================
// RULES DATA
// ============================================================================

const HUMAN_RULES = {
  title: 'Human Team Rules',
  subtitle: 'Embrace your humanity — minimal AI assistance allowed',
  icon: Heart,
  color: '#FF4500',
  bgColor: 'rgba(255, 69, 0, 0.1)',
  borderColor: '#FF4500',
  allowed: [
    {
      title: 'Traditional Search Engines',
      description: 'Google, DuckDuckGo, Bing for research and documentation lookup',
      example: 'Searching "React useEffect cleanup function" on Google',
    },
    {
      title: 'Stack Overflow & Documentation',
      description: 'Reading docs, tutorials, and community Q&A sites',
      example: 'Copying a code snippet from MDN or Stack Overflow',
    },
    {
      title: 'IDE Autocomplete (Basic)',
      description: 'Standard IDE autocomplete and IntelliSense features',
      example: 'VS Code suggesting method names as you type',
    },
    {
      title: 'Linters & Formatters',
      description: 'ESLint, Prettier, and similar code quality tools',
      example: 'Auto-formatting code with Prettier on save',
    },
    {
      title: 'Pre-built Libraries & Frameworks',
      description: 'Using npm packages, UI libraries, and frameworks',
      example: 'Installing and using React, Tailwind CSS, or Express.js',
    },
    {
      title: 'Templates & Boilerplates',
      description: 'Starting from create-react-app, Vite templates, etc.',
      example: 'Running "npm create vite@latest" to scaffold a project',
    },
  ],
  notAllowed: [
    {
      title: 'AI Code Generation',
      description: 'No GitHub Copilot, ChatGPT, Claude, or similar AI tools for writing code',
      example: 'Asking ChatGPT to "write a function that validates email addresses"',
    },
    {
      title: 'AI-Powered IDEs',
      description: 'No Cursor AI, Windsurf, or AI-enhanced coding environments',
      example: 'Using Cursor\'s AI features to generate or refactor code',
    },
    {
      title: 'AI Chat for Problem Solving',
      description: 'No asking AI to debug, explain errors, or suggest solutions',
      example: 'Pasting an error message into ChatGPT and asking for help',
    },
    {
      title: 'AI Image Generation',
      description: 'No DALL-E, Midjourney, or Stable Diffusion for assets',
      example: 'Generating a logo with Midjourney',
    },
    {
      title: 'AI Writing Assistance',
      description: 'No AI for documentation, READMEs, or copy',
      example: 'Using ChatGPT to write your project description',
    },
    {
      title: 'AI-Enhanced Search',
      description: 'No Perplexity, Bing Chat, or Google AI Overviews',
      example: 'Using Perplexity to research and summarize a topic',
    },
  ],
  tips: [
    'Pair programming with teammates is encouraged!',
    'Take breaks — human brains need rest',
    'Use whiteboarding to plan before coding',
    'Leverage your team\'s diverse skills',
  ],
};

const AI_RULES = {
  title: 'AI Team Rules',
  subtitle: 'Maximize AI leverage — push the boundaries of what\'s possible',
  icon: Cpu,
  color: '#00D4FF',
  bgColor: 'rgba(0, 212, 255, 0.1)',
  borderColor: '#00D4FF',
  allowed: [
    {
      title: 'AI Code Generation',
      description: 'Full use of GitHub Copilot, ChatGPT, Claude, Gemini, etc.',
      example: 'Asking Claude to "build a REST API with authentication"',
    },
    {
      title: 'AI-Powered IDEs',
      description: 'Cursor, Windsurf, Copilot Workspace, and similar tools',
      example: 'Using Cursor Agent to implement an entire feature',
    },
    {
      title: 'AI Pair Programming',
      description: 'Real-time AI assistance for debugging and problem-solving',
      example: 'Having Copilot Chat explain and fix a complex bug',
    },
    {
      title: 'AI Image & Design Tools',
      description: 'DALL-E, Midjourney, Stable Diffusion, Figma AI, etc.',
      example: 'Generating UI mockups with Midjourney or app icons with DALL-E',
    },
    {
      title: 'AI Writing & Documentation',
      description: 'AI-generated READMEs, documentation, and copy',
      example: 'Using ChatGPT to write comprehensive API documentation',
    },
    {
      title: 'AI Research & Planning',
      description: 'Perplexity, Claude for research, architecture planning',
      example: 'Asking Claude to design a system architecture for your app',
    },
    {
      title: 'AI Testing & QA',
      description: 'AI-generated tests, automated test creation',
      example: 'Using Copilot to generate unit tests for your functions',
    },
    {
      title: 'Voice & Multimodal AI',
      description: 'Voice coding, screenshot-to-code, and similar tools',
      example: 'Using GPT-4 Vision to convert a design mockup to code',
    },
  ],
  notAllowed: [
    {
      title: 'Pre-built Complete Solutions',
      description: 'Cannot submit an existing AI-generated project from before the hackathon',
      example: 'Submitting a project you had ChatGPT build last month',
    },
    {
      title: 'Fully Autonomous AI Agents',
      description: 'A human must remain in the loop — no "set and forget" AI builds',
      example: 'Letting an AI agent build the entire project without human review',
    },
    {
      title: 'Purchased AI-Generated Assets',
      description: 'No buying pre-made AI art or code from marketplaces',
      example: 'Purchasing AI-generated templates from a marketplace',
    },
  ],
  tips: [
    'Experiment with multiple AI tools to find the best fit',
    'Use AI for brainstorming and rapid prototyping',
    'Combine different AI models for different tasks',
    'Document your AI workflow — judges love seeing the process!',
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

function Rules({ user, teams, allegianceStyle, onNavigate, eventPhase }) {
  const renderRuleSection = (rules, type) => {
    const Icon = rules.icon;
    const isAI = type === 'ai';
    const textColorClass = isAI ? 'text-ai' : 'text-human';
    const borderColorClass = isAI ? 'border-ai' : 'border-human';
    const panelColor = isAI ? '#00E5FF' : '#FF6B35';
    const bgGradient = isAI 
      ? 'bg-gradient-to-b from-ai/10 to-transparent'
      : 'bg-gradient-to-b from-human/10 to-transparent';

    return (
      <div
        className="glass-card human-glow overflow-hidden relative border-l-8 shadow-2xl rounded-card"
        style={{ 
          borderLeftColor: `${panelColor}B3`,
          boxShadow: `inset 8px 0 30px -15px ${panelColor}40, 0 25px 50px -12px rgba(0, 0, 0, 0.25)`
        }}
      >
        {/* Gradient overlay for team feel */}
        <div className={cn('absolute inset-0 pointer-events-none', bgGradient)} />
        
        {/* Section Header */}
        <div
          className={cn(
            'relative p-6 border-b',
            isAI ? 'border-ai/30' : 'border-human/30'
          )}
          style={{ backgroundColor: rules.bgColor }}
        >
          <div className="flex items-center gap-4">
            <div
              className={cn(
                'w-14 h-14 flex items-center justify-center rounded-lg shadow-lg',
                isAI ? 'bg-gradient-to-br from-ai to-ai/70' : 'bg-gradient-to-br from-human to-brand'
              )}
            >
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-heading font-black text-white"
                  style={{ textShadow: `0 0 20px ${panelColor}60` }}>
                {rules.title}
              </h2>
              <p className="text-sm text-text-secondary">{rules.subtitle}</p>
            </div>
          </div>
        </div>

        <div className="relative p-6">
          {/* Allowed Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Check className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-emerald-400">What's Allowed</h3>
            </div>
            <div className="grid gap-3">
              {rules.allowed.map((item, index) => (
                <div
                  key={index}
                  className="glass-card !bg-white/5 border border-white/10 p-5 rounded-lg
                             hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <Check className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">{item.title}</div>
                      <div className="text-sm text-gray-300 mt-1">{item.description}</div>
                      <div className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full 
                                      inline-flex items-center gap-1 mt-2 border border-emerald-500/20">
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
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shadow-lg shadow-red-500/20">
                <X className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-red-400">What's NOT Allowed</h3>
            </div>
            <div className="grid gap-3">
              {rules.notAllowed.map((item, index) => (
                <div
                  key={index}
                  className="glass-card !bg-white/5 border border-white/10 p-5 rounded-lg
                             hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <X className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">{item.title}</div>
                      <div className="text-sm text-gray-300 mt-1">{item.description}</div>
                      <div className="text-xs text-red-400 bg-red-500/10 px-3 py-1.5 rounded-full 
                                      inline-flex items-center gap-1 mt-2 border border-red-500/20">
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
          <div
            className="glass-card p-5 rounded-lg border-t-4"
            style={{ 
              borderTopColor: `${panelColor}99`,
              boxShadow: `0 -4px 20px -5px ${panelColor}30`
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Zap className={cn('w-5 h-5', textColorClass)} />
              <h4 className={cn('font-bold', textColorClass)}>
                Pro Tips for {isAI ? 'AI' : 'Human'} Teams
              </h4>
            </div>
            <ul className="space-y-2">
              {rules.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className={textColorClass}>•</span>
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
      allegianceStyle={allegianceStyle}
      onNavigate={onNavigate}
      eventPhase={eventPhase}
      activeNav="rules"
    >
      <div className="p-4 sm:p-6">
        {/* Page Header */}
        <div className="text-center mb-10">
          <div className="glass-card inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 backdrop-blur-md border border-white/10">
            <FileText className="w-5 h-5 text-brand" />
            <span className="font-bold text-sm text-white">RULES OF ENGAGEMENT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black text-brand mb-3 font-display"
              style={{ textShadow: '0 0 30px rgba(255, 107, 53, 0.4)' }}>
            HACKDAY RULES
          </h1>
          <p className="text-arena-secondary max-w-2xl mx-auto">
            The battle between Human and AI teams requires clear rules of engagement. 
            Choose your side and understand what's allowed for your allegiance.
          </p>
        </div>

        {/* General Rules */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"
              style={{ textShadow: '0 0 20px rgba(255, 107, 53, 0.3)' }}>
            <AlertTriangle className="w-5 h-5 text-brand" />
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

        {/* Faction-Specific Rules */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {renderRuleSection(HUMAN_RULES, 'human')}
          {renderRuleSection(AI_RULES, 'ai')}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <div className="glass-card inline-block p-6 rounded-card">
            <h3 className="text-lg font-bold text-white mb-2"
                style={{ textShadow: '0 0 20px rgba(255, 107, 53, 0.3)' }}>
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
