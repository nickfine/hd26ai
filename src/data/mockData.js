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
  registration: {
    id: 'registration',
    label: 'Registration',
    description: 'Sign up and create your profile',
    order: 1,
  },
  team_formation: {
    id: 'team_formation',
    label: 'Team Formation',
    description: 'Find teammates and form your squad',
    order: 2,
  },
  hacking: {
    id: 'hacking',
    label: 'Hacking',
    description: 'Build your project',
    order: 3,
  },
  submission: {
    id: 'submission',
    label: 'Submission',
    description: 'Submit your project for judging',
    order: 4,
  },
  voting: {
    id: 'voting',
    label: 'Voting',
    description: "Vote for People's Champion",
    order: 5,
  },
  judging: {
    id: 'judging',
    label: 'Judging',
    description: 'Judges evaluate submissions',
    order: 6,
  },
  results: {
    id: 'results',
    label: 'Results',
    description: 'Winners announced!',
    order: 7,
  },
};

export const EVENT_PHASE_ORDER = [
  'registration',
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
    // Team Human Touch members (aligned with Forge)
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
    // Team Neural Nexus members (aligned with Forge)
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

// Teams aligned with HD26Forge for consistent cross-platform demo
export const MOCK_TEAMS = [
  {
    id: 2,
    name: 'Human Touch',
    description: 'Crafting intuitive interfaces that AI cannot replicate. Proving human creativity trumps machine efficiency.',
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
        message: "I'd love to help with the UI design! My background in both design and coding could be a great fit.",
        timestamp: '2026-01-12T09:00:00.000Z',
      },
    ],
    submission: {
      status: 'submitted',
      projectName: 'Empathy Engine',
      description: 'A design system that adapts to user emotional states through micro-interactions and thoughtful UX patterns. It proves that human intuition in design cannot be replicated by algorithms.',
      demoVideoUrl: 'https://youtube.com/watch?v=example123',
      repoUrl: 'https://github.com/human-touch/empathy-engine',
      liveDemoUrl: 'https://empathy-engine.vercel.app',
      submittedAt: '2026-01-14T09:00:00.000Z',
      lastUpdated: '2026-01-14T09:00:00.000Z',
      participantVotes: 31,
      judgeScores: [
        {
          judgeId: 3001,
          judgeName: 'Dr. Elena Vasquez',
          scores: { innovation: 9, technical: 7, presentation: 10, impact: 8, theme: 9 },
          comments: 'Beautiful presentation. The emotional design approach is unique.',
          scoredAt: '2026-01-16T13:00:00.000Z',
        },
        {
          judgeId: 3002,
          judgeName: 'James Okonkwo',
          scores: { innovation: 8, technical: 7, presentation: 9, impact: 9, theme: 10 },
          comments: 'Perfect embodiment of the human side. Inspiring work.',
          scoredAt: '2026-01-16T13:30:00.000Z',
        },
        {
          judgeId: 3003,
          judgeName: 'Priya Sharma',
          scores: { innovation: 9, technical: 8, presentation: 9, impact: 8, theme: 9 },
          comments: 'A compelling argument for human-centered design.',
          scoredAt: '2026-01-16T15:00:00.000Z',
        },
      ],
    },
  },
  {
    id: 1,
    name: 'Neural Nexus',
    description: 'Building autonomous code review agents powered by cutting-edge AI technology.',
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
      projectName: 'CodeReview AI',
      description: 'An autonomous code review agent powered by LLMs that provides intelligent feedback on pull requests. It analyzes code patterns, suggests improvements, and catches bugs before they reach production.',
      demoVideoUrl: 'https://youtube.com/watch?v=neural123',
      repoUrl: 'https://github.com/neural-nexus/codereview-ai',
      liveDemoUrl: 'https://codereview-ai.vercel.app',
      submittedAt: '2026-01-14T10:30:00.000Z',
      lastUpdated: '2026-01-14T10:30:00.000Z',
      participantVotes: 24,
      judgeScores: [
        {
          judgeId: 3001,
          judgeName: 'Dr. Elena Vasquez',
          scores: { innovation: 9, technical: 9, presentation: 8, impact: 9, theme: 8 },
          comments: 'Excellent technical execution. The AI integration is seamless.',
          scoredAt: '2026-01-16T14:00:00.000Z',
        },
        {
          judgeId: 3002,
          judgeName: 'James Okonkwo',
          scores: { innovation: 8, technical: 9, presentation: 7, impact: 8, theme: 9 },
          comments: 'Strong alignment with the AI theme. Very practical solution.',
          scoredAt: '2026-01-16T14:30:00.000Z',
        },
      ],
    },
  },
  {
    id: 3,
    name: 'The Resistance',
    description: 'Proving human creativity trumps machine efficiency',
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
      projectName: 'HumanFirst',
      description: 'A collaborative workspace that prioritizes human connection over efficiency metrics. Features real-time collaboration without AI interference.',
      demoVideoUrl: 'https://youtube.com/watch?v=resist789',
      repoUrl: 'https://github.com/the-resistance/humanfirst',
      liveDemoUrl: 'https://humanfirst.app',
      submittedAt: '2025-12-07T11:00:00.000Z',
      lastUpdated: '2025-12-07T11:00:00.000Z',
      participantVotes: 18,
      judgeScores: [
        {
          judgeId: 3001,
          judgeName: 'Dr. Elena Vasquez',
          scores: { innovation: 7, technical: 8, presentation: 8, impact: 7, theme: 8 },
          comments: 'Solid execution, though the concept is less groundbreaking.',
          scoredAt: '2025-12-07T15:00:00.000Z',
        },
      ],
    },
  },
  {
    id: 4,
    name: 'Synthetic Minds',
    description: 'Leveraging LLMs to solve impossible problems',
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
      projectName: 'MindMeld',
      description: 'An AI-powered brainstorming tool that generates, combines, and evolves ideas faster than any human team could. Let the machines do the thinking.',
      demoVideoUrl: 'https://youtube.com/watch?v=synth456',
      repoUrl: 'https://github.com/synthetic-minds/mindmeld',
      liveDemoUrl: 'https://mindmeld.ai',
      submittedAt: '2025-12-07T10:00:00.000Z',
      lastUpdated: '2025-12-07T10:00:00.000Z',
      participantVotes: 15,
      judgeScores: [
        {
          judgeId: 3002,
          judgeName: 'James Okonkwo',
          scores: { innovation: 8, technical: 8, presentation: 7, impact: 8, theme: 9 },
          comments: 'Creative use of AI for ideation. Good theme alignment.',
          scoredAt: '2025-12-07T14:45:00.000Z',
        },
      ],
    },
  },
  {
    id: 5,
    name: 'Carbon Coalition',
    description: 'Old-school engineering with a human heart',
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
      projectName: 'SecureVault',
      description: 'Hardware-backed authentication that proves humans are still the best at security. No AI, no cloud dependencies, just pure engineering.',
      demoVideoUrl: 'https://youtube.com/watch?v=vault321',
      repoUrl: 'https://github.com/carbon-coalition/securevault',
      liveDemoUrl: '',
      submittedAt: '2025-12-07T09:30:00.000Z',
      lastUpdated: '2025-12-07T09:30:00.000Z',
      participantVotes: 12,
      judgeScores: [],
    },
  },
  {
    id: 6,
    name: 'Digital Overlords',
    description: 'Why write code when AI can write it for you?',
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
    name: 'Analog Army',
    description: 'Keeping it real in a synthetic world',
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
    name: 'Quantum Collective',
    description: 'AI-first development for the next generation',
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
      projectName: 'QuantumGen',
      description: 'A next-generation code generator that uses multiple AI models in parallel to produce optimal solutions. The future of development is here.',
      demoVideoUrl: 'https://youtube.com/watch?v=quantum456',
      repoUrl: 'https://github.com/quantum-collective/quantumgen',
      liveDemoUrl: 'https://quantumgen.ai',
      submittedAt: '2025-12-07T08:30:00.000Z',
      lastUpdated: '2025-12-07T08:30:00.000Z',
      participantVotes: 27,
      judgeScores: [
        {
          judgeId: 3001,
          judgeName: 'Dr. Elena Vasquez',
          scores: { innovation: 10, technical: 10, presentation: 9, impact: 10, theme: 10 },
          comments: 'Exceptional. This is the future of software development.',
          scoredAt: '2025-12-07T12:00:00.000Z',
        },
        {
          judgeId: 3002,
          judgeName: 'James Okonkwo',
          scores: { innovation: 9, technical: 10, presentation: 8, impact: 9, theme: 10 },
          comments: 'Technical masterpiece. Perfect AI theme alignment.',
          scoredAt: '2025-12-07T12:30:00.000Z',
        },
        {
          judgeId: 3003,
          judgeName: 'Priya Sharma',
          scores: { innovation: 10, technical: 9, presentation: 9, impact: 10, theme: 9 },
          comments: 'Game-changing potential. Well executed.',
          scoredAt: '2025-12-07T14:00:00.000Z',
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

