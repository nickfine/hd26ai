// Mock Data for HackDay Companion App
//
// ============================================================================
// IMPORTANT: DEMO DATA SOURCE OF TRUTH
// ============================================================================
// The Supabase database is the SINGLE SOURCE OF TRUTH for demo data.
// Demo data is seeded via: supabase/migrations/seed_demo_data.sql
// 
// This file provides FALLBACK data when the database is unavailable.
// When updating demo data, update the SQL seed script first, then update
// this file to match for offline fallback support.
//
// Both HD26Forge and HD26AI share the same demo data from the database.
// ============================================================================

// ============================================================================
// SKILLS
// ============================================================================

export const SKILLS = [
  'Frontend Development',
  'Backend Development',
  'Machine Learning',
  'UI/UX Design',
  'Data Science',
  'DevOps',
  'Product Management',
  'Mobile Development',
  'Security',
  'Hardware/IoT',
];

// ============================================================================
// AVATARS
// ============================================================================
// Drop your avatar images into src/assets/avatars/human/ and src/assets/avatars/ai/
// Then update these arrays with the actual filenames.
// Recommended image size: 256x256 or 512x512 PNG

export const AVATARS = {
  default: [
    { id: 'avatar-1', src: '/avatars/default/avatar-1.png', name: 'Avatar 1' },
    { id: 'avatar-2', src: '/avatars/default/avatar-2.png', name: 'Avatar 2' },
    { id: 'avatar-3', src: '/avatars/default/avatar-3.png', name: 'Avatar 3' },
    { id: 'avatar-4', src: '/avatars/default/avatar-4.png', name: 'Avatar 4' },
    { id: 'avatar-5', src: '/avatars/default/avatar-5.png', name: 'Avatar 5' },
    { id: 'avatar-6', src: '/avatars/default/avatar-6.png', name: 'Avatar 6' },
  ],
};

// ============================================================================
// PROMO IMAGES
// ============================================================================
// Drop your promo images into src/assets/promo/
// Recommended size: 1200x400 or similar wide format

export const PROMO_IMAGES = {
  promo1: '/promo/promo-1.png',
  promo2: '/promo/promo-2.png',
};

// ============================================================================
// USER ROLES
// ============================================================================

export const USER_ROLES = {
  participant: {
    id: 'participant',
    label: 'Participant',
    description: 'Regular hackday attendee',
    canVote: true,           // People's Champion voting
    canJudge: false,         // Judge scoring
    canManage: false,        // Admin panel access
    canViewAnalytics: false, // Voting analytics
  },
  ambassador: {
    id: 'ambassador',
    label: 'Ambassador',
    description: 'Side recruiter with voting power',
    canVote: true,
    canJudge: false,
    canManage: false,
    canViewAnalytics: false,
  },
  judge: {
    id: 'judge',
    label: 'Judge',
    description: 'Official project evaluator',
    canVote: false,          // Judges don't vote for People's Champion
    canJudge: true,
    canManage: false,
    canViewAnalytics: true,
  },
  admin: {
    id: 'admin',
    label: 'Admin',
    description: 'Event organizer with full access',
    canVote: false,
    canJudge: false,
    canManage: true,
    canViewAnalytics: true,
  },
};

// ============================================================================
// EVENT PHASES
// ============================================================================

export const EVENT_PHASES = {
  team_formation: {
    id: 'team_formation',
    label: 'Team Formation',
    description: 'Sign up and find teammates',
    order: 1,
  },
  hacking: {
    id: 'hacking',
    label: 'Hacking',
    description: 'Build your project',
    order: 2,
  },
  submission: {
    id: 'submission',
    label: 'Submission',
    description: 'Submit your project for judging',
    order: 3,
  },
  voting: {
    id: 'voting',
    label: 'Voting',
    description: "Vote for People's Champion",
    order: 4,
  },
  judging: {
    id: 'judging',
    label: 'Judging',
    description: 'Judges evaluate submissions',
    order: 5,
  },
  results: {
    id: 'results',
    label: 'Results',
    description: 'Winners announced!',
    order: 6,
  },
};

export const EVENT_PHASE_ORDER = [
  'team_formation',
  'hacking',
  'submission',
  'voting',
  'judging',
  'results',
];

// ============================================================================
// JUDGE SCORING CRITERIA
// ============================================================================

export const JUDGE_CRITERIA = [
  {
    id: 'innovation',
    label: 'Innovation',
    description: 'Originality and creativity of the idea',
    maxScore: 10,
    weight: 1,
  },
  {
    id: 'technical',
    label: 'Technical Excellence',
    description: 'Code quality and technical implementation',
    maxScore: 10,
    weight: 1,
  },
  {
    id: 'presentation',
    label: 'Presentation',
    description: 'Demo quality and communication',
    maxScore: 10,
    weight: 1,
  },
  {
    id: 'impact',
    label: 'Impact',
    description: 'Potential real-world value',
    maxScore: 10,
    weight: 1,
  },
  {
    id: 'theme',
    label: 'Theme Alignment',
    description: 'How well it fits the hackathon theme',
    maxScore: 10,
    weight: 1,
  },
];

// ============================================================================
// AWARDS
// ============================================================================

export const AWARDS = {
  grand_champion: {
    id: 'grand_champion',
    label: 'Grand HackDay Champion',
    emoji: '🏆',
    description: 'Highest combined judge scores',
    determinedBy: 'judges',
    filter: 'all',
  },
  peoples_champion: {
    id: 'peoples_champion',
    label: "People's Champion",
    emoji: '👑',
    description: 'Most votes from participants',
    determinedBy: 'votes',
    filter: 'all',
  },
};

// ============================================================================
// MOCK USERS BY ROLE
// ============================================================================

// Users aligned with HD26Forge for consistent cross-platform demo
export const MOCK_USERS = {
  participants: [
    // Confluence Macro Builder team members (aligned with Forge)
    {
      id: 201,
      name: 'Morgan Riley',
      callsign: 'Pixel Pusher',
      email: 'morgan.riley@company.com',
      skills: ['UI/UX Design', 'Product Management'],
      role: 'participant',
    },
    {
      id: 202,
      name: 'Casey Brooks',
      callsign: 'CSS Wizard',
      email: 'casey.brooks@company.com',
      skills: ['Frontend Development', 'UI/UX Design'],
      role: 'participant',
    },
    // AI Code Reviewer team members (aligned with Forge)
    {
      id: 101,
      name: 'Alex Chen',
      callsign: 'Keyboard Bandit',
      email: 'alex.chen@company.com',
      skills: ['Backend Development', 'DevOps'],
      role: 'participant',
    },
    {
      id: 102,
      name: 'Jordan Lee',
      callsign: 'Neural Ninja',
      email: 'jordan.lee@company.com',
      skills: ['Machine Learning', 'Data Science'],
      role: 'participant',
    },
    {
      id: 103,
      name: 'Taylor Kim',
      callsign: 'Firewall',
      email: 'taylor.kim@company.com',
      skills: ['Backend Development', 'Security'],
      role: 'participant',
    },
  ],
  ambassadors: [
    {
      id: 2001,
      name: 'Sarah Mitchell',
      email: 'sarah.mitchell@company.com',
      skills: ['Product Management'],
      role: 'ambassador',
      bio: 'Recruiting for Team Human! Join the resistance against AI dominance.',
    },
    {
      id: 2002,
      name: 'Marcus Wong',
      email: 'marcus.wong@company.com',
      skills: ['Machine Learning'],
      role: 'ambassador',
      bio: 'The future is AI. Join the winning side.',
    },
  ],
  judges: [
    {
      id: 3001,
      name: 'Dr. Elena Vasquez',
      email: 'elena.vasquez@company.com',
      skills: [],
      role: 'judge',
      title: 'VP of Engineering',
    },
    {
      id: 3002,
      name: 'James Okonkwo',
      email: 'james.okonkwo@company.com',
      skills: [],
      role: 'judge',
      title: 'Chief Innovation Officer',
    },
    {
      id: 3003,
      name: 'Priya Sharma',
      email: 'priya.sharma@company.com',
      skills: [],
      role: 'judge',
      title: 'Head of Product',
    },
  ],
  admins: [
    {
      id: 4001,
      name: 'HackDay Admin',
      callsign: 'SysOp',
      email: 'admin@company.com',
      skills: [],
      role: 'admin',
    },
  ],
};

// Teams (Ideas) aligned with HD26Forge for consistent cross-platform demo
// SINGLE SOURCE OF TRUTH: Database via seed_demo_data.sql
export const MOCK_TEAMS = [
  {
    id: 2,
    name: 'Confluence Macro Builder',
    description: 'Build custom Confluence macros without code using an intuitive visual drag-and-drop editor.',
    lookingFor: ['UI/UX Design', 'Frontend Development'],
    maxMembers: 4,
    captainId: 201,
    moreInfo: '',
    isAutoCreated: false,
    members: [
      { id: 201, name: 'Morgan Riley', callsign: 'Pixel Pusher', skills: ['UI/UX Design', 'Product Management'] },
      { id: 202, name: 'Casey Brooks', callsign: 'CSS Wizard', skills: ['Frontend Development', 'UI/UX Design'] },
    ],
    joinRequests: [
      {
        id: 9001,
        userId: 5001,
        userName: 'Quinn Harper',
        userSkills: ['Frontend Development', 'UI/UX Design'],
        message: "I'd love to help with the drag-and-drop editor UI! My background in both design and coding could be a great fit.",
        timestamp: '2026-01-12T09:00:00.000Z',
      },
    ],
    submission: {
      status: 'submitted',
      projectName: 'Confluence Macro Builder',
      description: 'A visual drag-and-drop editor for creating custom Confluence macros. No coding required - just design your macro, configure inputs, and publish. Makes Confluence customization accessible to everyone.',
      demoVideoUrl: 'https://youtube.com/watch?v=macro123',
      repoUrl: 'https://github.com/demo/confluence-macro-builder',
      liveDemoUrl: 'https://macro-builder.vercel.app',
      submittedAt: '2026-01-14T09:00:00.000Z',
      lastUpdated: '2026-01-14T09:00:00.000Z',
      participantVotes: 31,
      judgeScores: [
        {
          judgeId: 3001,
          judgeName: 'Dr. Elena Vasquez',
          scores: { innovation: 9, technical: 7, presentation: 10, impact: 8, theme: 9 },
          comments: 'Beautiful drag-and-drop interface. Makes macro creation accessible to everyone.',
          scoredAt: '2026-01-16T13:00:00.000Z',
        },
        {
          judgeId: 3002,
          judgeName: 'James Okonkwo',
          scores: { innovation: 8, technical: 7, presentation: 9, impact: 9, theme: 10 },
          comments: 'Great UX focus. This will save teams hours of developer time.',
          scoredAt: '2026-01-16T13:30:00.000Z',
        },
        {
          judgeId: 3003,
          judgeName: 'Priya Sharma',
          scores: { innovation: 9, technical: 8, presentation: 9, impact: 8, theme: 9 },
          comments: 'Empowers non-technical users. Strong human-centered design.',
          scoredAt: '2026-01-16T15:00:00.000Z',
        },
      ],
    },
  },
  {
    id: 1,
    name: 'AI Code Reviewer',
    description: 'Autonomous code review agent that catches bugs, suggests improvements, and enforces best practices.',
    lookingFor: ['Machine Learning', 'DevOps'],
    maxMembers: 5,
    captainId: 101,
    moreInfo: '',
    isAutoCreated: false,
    members: [
      { id: 101, name: 'Alex Chen', callsign: 'Keyboard Bandit', skills: ['Backend Development', 'DevOps'] },
      { id: 102, name: 'Jordan Lee', callsign: 'Neural Ninja', skills: ['Machine Learning', 'Data Science'] },
      { id: 103, name: 'Taylor Kim', callsign: 'Firewall', skills: ['Backend Development', 'Security'] },
    ],
    joinRequests: [],
    submission: {
      status: 'submitted',
      projectName: 'AI Code Reviewer',
      description: 'An autonomous code review agent powered by LLMs. Analyzes pull requests, catches bugs, suggests improvements, and enforces coding standards automatically. Integrates with Bitbucket and GitHub.',
      demoVideoUrl: 'https://youtube.com/watch?v=reviewer123',
      repoUrl: 'https://github.com/demo/ai-code-reviewer',
      liveDemoUrl: 'https://ai-code-reviewer.vercel.app',
      submittedAt: '2026-01-14T10:30:00.000Z',
      lastUpdated: '2026-01-14T10:30:00.000Z',
      participantVotes: 24,
      judgeScores: [
        {
          judgeId: 3001,
          judgeName: 'Dr. Elena Vasquez',
          scores: { innovation: 9, technical: 9, presentation: 8, impact: 9, theme: 8 },
          comments: 'Excellent LLM integration. Catches real bugs in the demo.',
          scoredAt: '2026-01-16T14:00:00.000Z',
        },
        {
          judgeId: 3002,
          judgeName: 'James Okonkwo',
          scores: { innovation: 8, technical: 9, presentation: 7, impact: 8, theme: 9 },
          comments: 'Practical AI application. Would use this on my own PRs.',
          scoredAt: '2026-01-16T14:30:00.000Z',
        },
      ],
    },
  },
  {
    id: 3,
    name: 'Team Retro Board',
    description: 'Real-time retrospective board with anonymous voting and human-facilitated discussion prompts.',
    lookingFor: ['Product Management', 'Frontend Development', 'Mobile Development'],
    maxMembers: 6,
    captainId: 301,
    moreInfo: '',
    isAutoCreated: false,
    members: [
      { id: 301, name: 'Jamie Foster', callsign: 'The Architect', skills: ['Product Management', 'UI/UX Design'] },
      { id: 302, name: 'Drew Parker', callsign: 'Mobile Maven', skills: ['Frontend Development', 'Mobile Development'] },
      { id: 303, name: 'Avery Quinn', callsign: 'Pipeline Pro', skills: ['Backend Development', 'DevOps'] },
      { id: 304, name: 'Riley Hayes', callsign: 'App Whisperer', skills: ['Mobile Development', 'Frontend Development'] },
    ],
    joinRequests: [],
    submission: {
      status: 'submitted',
      projectName: 'Team Retro Board',
      description: 'A real-time retrospective board with anonymous voting, customizable templates, and human-facilitated discussion prompts. Built for honest team feedback and actionable improvements.',
      demoVideoUrl: 'https://youtube.com/watch?v=retro789',
      repoUrl: 'https://github.com/demo/team-retro-board',
      liveDemoUrl: 'https://retro-board.vercel.app',
      submittedAt: '2026-01-14T11:00:00.000Z',
      lastUpdated: '2026-01-14T11:00:00.000Z',
      participantVotes: 18,
      judgeScores: [
        {
          judgeId: 3001,
          judgeName: 'Dr. Elena Vasquez',
          scores: { innovation: 7, technical: 8, presentation: 8, impact: 7, theme: 8 },
          comments: 'Solid retro tool. Anonymous voting feature is well implemented.',
          scoredAt: '2026-01-16T15:00:00.000Z',
        },
      ],
    },
  },
  {
    id: 4,
    name: 'Smart Doc Summary',
    description: 'AI-powered document summarization that creates digestible summaries of long Confluence pages.',
    lookingFor: ['Data Science', 'Backend Development'],
    maxMembers: 4,
    captainId: 401,
    moreInfo: '',
    isAutoCreated: false,
    members: [
      { id: 401, name: 'Sam Rivera', callsign: 'Data Drifter', skills: ['Machine Learning', 'Data Science'] },
      { id: 402, name: 'Chris Nakamura', callsign: 'Token Master', skills: ['Backend Development', 'Machine Learning'] },
    ],
    joinRequests: [],
    submission: {
      status: 'submitted',
      projectName: 'Smart Doc Summary',
      description: 'AI-powered summarization for Confluence pages. Automatically generates executive summaries, key takeaways, and action items from long documents. Supports multiple summary lengths and formats.',
      demoVideoUrl: 'https://youtube.com/watch?v=summary456',
      repoUrl: 'https://github.com/demo/smart-doc-summary',
      liveDemoUrl: 'https://doc-summary.vercel.app',
      submittedAt: '2026-01-14T10:00:00.000Z',
      lastUpdated: '2026-01-14T10:00:00.000Z',
      participantVotes: 15,
      judgeScores: [
        {
          judgeId: 3002,
          judgeName: 'James Okonkwo',
          scores: { innovation: 8, technical: 8, presentation: 7, impact: 8, theme: 9 },
          comments: 'Great use of AI for document processing. Summary quality is impressive.',
          scoredAt: '2026-01-16T14:45:00.000Z',
        },
      ],
    },
  },
  {
    id: 5,
    name: 'Accessibility Checker',
    description: 'Automated accessibility audit tool with human-curated remediation guides and WCAG compliance.',
    lookingFor: ['Hardware/IoT', 'Security', 'Backend Development'],
    maxMembers: 5,
    captainId: 501,
    moreInfo: '',
    isAutoCreated: false,
    members: [
      { id: 501, name: 'Pat O\'Brien', callsign: 'Circuit Breaker', skills: ['Hardware/IoT', 'Security'] },
      { id: 502, name: 'Dana Kowalski', callsign: 'Server Sage', skills: ['Backend Development', 'DevOps'] },
      { id: 503, name: 'Jesse Martinez', callsign: 'Locksmith', skills: ['Security', 'Backend Development'] },
    ],
    joinRequests: [],
    submission: {
      status: 'submitted',
      projectName: 'Accessibility Checker',
      description: 'Automated WCAG compliance checker with human-curated remediation guides. Scans Confluence spaces for accessibility issues and provides clear fix instructions. Supports WCAG 2.1 AA and AAA.',
      demoVideoUrl: 'https://youtube.com/watch?v=a11y321',
      repoUrl: 'https://github.com/demo/accessibility-checker',
      liveDemoUrl: '',
      submittedAt: '2026-01-14T09:30:00.000Z',
      lastUpdated: '2026-01-14T09:30:00.000Z',
      participantVotes: 12,
      judgeScores: [],
    },
  },
  {
    id: 6,
    name: 'Sprint Predictor',
    description: 'ML-based sprint planning that predicts velocity, identifies risks, and suggests scope adjustments.',
    lookingFor: ['Machine Learning', 'Data Science', 'DevOps'],
    maxMembers: 4,
    captainId: 601,
    moreInfo: '',
    isAutoCreated: false,
    members: [
      { id: 601, name: 'Sage Thompson', callsign: 'Prompt Lord', skills: ['Machine Learning', 'DevOps', 'Data Science'] },
    ],
    joinRequests: [],
    submission: {
      status: 'not_started',
      projectName: '',
      description: '',
      demoVideoUrl: '',
      repoUrl: '',
      liveDemoUrl: '',
      submittedAt: null,
      lastUpdated: null,
      participantVotes: 0,
      judgeScores: [],
    },
  },
  {
    id: 7,
    name: 'Customer Journey Map',
    description: 'Visual customer journey mapping with collaborative whiteboarding and stakeholder feedback.',
    lookingFor: ['UI/UX Design', 'Product Management'],
    maxMembers: 3,
    captainId: 701,
    moreInfo: '',
    isAutoCreated: false,
    members: [
      { id: 701, name: 'Robin Sinclair', callsign: 'Retro Designer', skills: ['UI/UX Design', 'Frontend Development'] },
      { id: 702, name: 'Finley Grant', callsign: 'Roadmap Rebel', skills: ['Product Management', 'UI/UX Design'] },
    ],
    joinRequests: [],
    submission: {
      status: 'not_started',
      projectName: '',
      description: '',
      demoVideoUrl: '',
      repoUrl: '',
      liveDemoUrl: '',
      submittedAt: null,
      lastUpdated: null,
      participantVotes: 0,
      judgeScores: [],
    },
  },
  {
    id: 8,
    name: 'Rovo Salesforce Connector',
    description: 'Connect Salesforce to Atlassian Rovo for AI-powered CRM insights and automated workflows.',
    lookingFor: ['Frontend Development', 'Backend Development', 'Machine Learning'],
    maxMembers: 5,
    captainId: 801,
    moreInfo: '',
    isAutoCreated: false,
    members: [
      { id: 801, name: 'Kai Patel', callsign: 'Full Stack Flash', skills: ['Frontend Development', 'Backend Development'] },
      { id: 802, name: 'Blake Nguyen', callsign: 'Gradient Ghost', skills: ['Machine Learning', 'Backend Development'] },
    ],
    joinRequests: [],
    submission: {
      status: 'submitted',
      projectName: 'Rovo Salesforce Connector',
      description: 'Bridges Salesforce CRM with Atlassian Rovo for AI-powered insights. Surface customer data in Jira issues, auto-link deals to projects, and get AI recommendations based on CRM patterns.',
      demoVideoUrl: 'https://youtube.com/watch?v=rovo456',
      repoUrl: 'https://github.com/demo/rovo-salesforce',
      liveDemoUrl: 'https://rovo-sf.vercel.app',
      submittedAt: '2026-01-14T08:30:00.000Z',
      lastUpdated: '2026-01-14T08:30:00.000Z',
      participantVotes: 27,
      judgeScores: [
        {
          judgeId: 3001,
          judgeName: 'Dr. Elena Vasquez',
          scores: { innovation: 10, technical: 10, presentation: 9, impact: 10, theme: 10 },
          comments: 'Exceptional integration. This bridges a real gap between CRM and project tools.',
          scoredAt: '2026-01-16T12:00:00.000Z',
        },
        {
          judgeId: 3002,
          judgeName: 'James Okonkwo',
          scores: { innovation: 9, technical: 10, presentation: 8, impact: 9, theme: 10 },
          comments: 'Technical masterpiece. The Rovo AI recommendations are spot-on.',
          scoredAt: '2026-01-16T12:30:00.000Z',
        },
        {
          judgeId: 3003,
          judgeName: 'Priya Sharma',
          scores: { innovation: 10, technical: 9, presentation: 9, impact: 10, theme: 9 },
          comments: 'Game-changing for sales-engineering handoffs. Well executed.',
          scoredAt: '2026-01-16T14:00:00.000Z',
        },
      ],
    },
  },
];

// Free agents - aligned with HD26Forge for consistent cross-platform demo
// These IDs match the accountId pattern in Forge: "mock-free-500X"
export const MOCK_FREE_AGENTS = [
  {
    id: 5001,
    name: 'Quinn Harper',
    callsign: 'Design Coder',
    skills: ['Frontend Development', 'UI/UX Design'],
    bio: 'Designer who codes. Looking for a team that values aesthetics and user experience.',
    teamInvites: [],
    autoAssignOptIn: false,
  },
  {
    id: 5002,
    name: 'Skyler Vance',
    callsign: 'Data Dreamer',
    skills: ['Machine Learning', 'Data Science'],
    bio: 'Data scientist with a passion for neural networks. Ready to help your AI project dominate.',
    teamInvites: [],
    autoAssignOptIn: false,
  },
  {
    id: 5003,
    name: 'River Chen',
    callsign: 'Stack Surfer',
    skills: ['Backend Development', 'DevOps', 'Security'],
    bio: 'Full-stack engineer. I go where the interesting problems are, regardless of side.',
    teamInvites: [],
    autoAssignOptIn: false,
  },
  {
    id: 5004,
    name: 'Dakota Wells',
    callsign: 'App Artisan',
    skills: ['Mobile Development', 'Frontend Development'],
    bio: 'Cross-platform mobile dev. I believe in crafting apps with a human touch.',
    teamInvites: [],
    autoAssignOptIn: false,
  },
  {
    id: 5005,
    name: 'Ash Nakamura',
    callsign: 'Product Pioneer',
    skills: ['Product Management', 'UI/UX Design'],
    bio: 'Product strategist embracing AI-first design. Let machines do the heavy lifting.',
    teamInvites: [],
    autoAssignOptIn: false,
  },
  {
    id: 5006,
    name: 'Emery Blake',
    callsign: 'Hardware Hacker',
    skills: ['Hardware/IoT', 'Backend Development'],
    bio: 'Hardware hacker at heart. Building tangible things in an increasingly digital world.',
    teamInvites: [],
    autoAssignOptIn: false,
  },
  {
    id: 5007,
    name: 'Jules Thornton',
    callsign: 'LLM Lord',
    skills: ['Machine Learning', 'Backend Development', 'Data Science'],
    bio: 'LLM enthusiast. If it involves prompts and parameters, count me in.',
    teamInvites: [],
    autoAssignOptIn: false,
  },
  {
    id: 5008,
    name: 'Rowan Kim',
    callsign: 'Full Stack Flash',
    skills: ['Frontend Development', 'Backend Development'],
    bio: 'Versatile full-stack dev. Show me your vision and I\'ll help you build it.',
    teamInvites: [],
    autoAssignOptIn: false,
  },
];

// Re-export ROLE_CONFIG from design-system for backwards compatibility
// The canonical source is now in src/lib/design-system.js
export { ROLE_CONFIG } from '../lib/design-system';

