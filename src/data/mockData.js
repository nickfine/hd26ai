// Mock Data for HackDay Companion App
// Theme: AI vs Human

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

export const MOCK_TEAMS = [
  {
    id: 1,
    name: 'Neural Nexus',
    side: 'ai',
    description: 'Building autonomous code review agents',
    lookingFor: ['Backend Development', 'Machine Learning', 'DevOps'],
    members: 3,
    maxMembers: 5,
  },
  {
    id: 2,
    name: 'Human Touch',
    side: 'human',
    description: 'Crafting intuitive interfaces that AI cannot replicate',
    lookingFor: ['UI/UX Design', 'Frontend Development'],
    members: 2,
    maxMembers: 4,
  },
  {
    id: 3,
    name: 'The Resistance',
    side: 'human',
    description: 'Proving human creativity trumps machine efficiency',
    lookingFor: ['Product Management', 'Frontend Development', 'Mobile Development'],
    members: 4,
    maxMembers: 6,
  },
  {
    id: 4,
    name: 'Synthetic Minds',
    side: 'ai',
    description: 'Leveraging LLMs to solve impossible problems',
    lookingFor: ['Data Science', 'Backend Development'],
    members: 2,
    maxMembers: 4,
  },
  {
    id: 5,
    name: 'Carbon Coalition',
    side: 'human',
    description: 'Old-school engineering with a human heart',
    lookingFor: ['Hardware/IoT', 'Security', 'Backend Development'],
    members: 3,
    maxMembers: 5,
  },
  {
    id: 6,
    name: 'Digital Overlords',
    side: 'ai',
    description: 'Why write code when AI can write it for you?',
    lookingFor: ['Machine Learning', 'Data Science', 'DevOps'],
    members: 1,
    maxMembers: 4,
  },
  {
    id: 7,
    name: 'Analog Army',
    side: 'human',
    description: 'Keeping it real in a synthetic world',
    lookingFor: ['UI/UX Design', 'Product Management'],
    members: 2,
    maxMembers: 3,
  },
  {
    id: 8,
    name: 'Quantum Collective',
    side: 'ai',
    description: 'AI-first development for the next generation',
    lookingFor: ['Frontend Development', 'Backend Development', 'Machine Learning'],
    members: 2,
    maxMembers: 5,
  },
];

export const ALLEGIANCE_CONFIG = {
  human: {
    color: 'rgb(34, 197, 94)', // organic green
    bgColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgb(34, 197, 94)',
    label: 'Human',
    font: 'font-sans',
    borderRadius: 'rounded-2xl',
    borderStyle: 'border-2',
  },
  neutral: {
    color: 'rgb(156, 163, 175)', // gray
    bgColor: 'rgba(156, 163, 175, 0.1)',
    borderColor: 'rgb(156, 163, 175)',
    label: 'Neutral',
    font: 'font-sans',
    borderRadius: 'rounded-lg',
    borderStyle: 'border',
  },
  ai: {
    color: 'rgb(6, 182, 212)', // cyan
    bgColor: 'rgba(6, 182, 212, 0.1)',
    borderColor: 'rgb(6, 182, 212)',
    label: 'AI',
    font: 'font-mono',
    borderRadius: 'rounded-sm',
    borderStyle: 'border-2 border-dashed',
  },
};

