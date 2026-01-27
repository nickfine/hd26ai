/**
 * Design System Utilities
 * Neutral theme helpers and utility functions
 */

import { Scale, Eye } from 'lucide-react';

// =============================================================================
// COLOR CONSTANTS
// =============================================================================

export const COLORS = {
  // Backgrounds
  bgPrimary: '#0B0A08',
  bgCard: '#111111',
  bgElevated: '#1A1A1A',
  
  // Borders
  border: '#1F1F1F',
  borderStrong: '#2A2A2A',
  
  // Text Hierarchy
  textPrimary: '#FFFFFF',
  textBody: '#E0E0E0',
  textSecondary: '#AAAAAA',
  textMuted: '#888888',
  
  // Neutral
  neutral: '#888888',
  
  // Status
  success: '#00FF9D',
  warning: '#FF8A00',
  error: '#FF4500',
};

// =============================================================================
// ROLE CONFIGURATION
// Centralized styling for Neutral and Observer roles
// =============================================================================

export const ROLE_CONFIG = {
  neutral: {
    id: 'neutral',
    label: 'Neutral',
    color: '#888888',
    bgColor: 'rgba(136, 136, 136, 0.1)',
    borderColor: '#888888',
    textColor: '#AAAAAA',
    font: 'font-sans',
    borderRadius: 'rounded-card',
    borderStyle: 'border-l-4',
    icon: Scale,
    classes: {
      bg: 'bg-neutral-600',
      bgLight: 'bg-neutral-800',
      text: 'text-text-secondary',
      textLight: 'text-text-muted',
      border: 'border-arena-border',
      borderLight: 'border-arena-border',
      ring: 'ring-neutral-600',
    },
  },
  observer: {
    id: 'observer',
    label: 'Observer',
    color: '#FFFFFF',
    bgColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: '#FFFFFF',
    textColor: '#FFFFFF',
    font: 'font-sans',
    borderRadius: 'rounded-card',
    borderStyle: 'border-l-4',
    icon: Eye,
    classes: {
      bg: 'bg-white',
      bgLight: 'bg-white/10',
      text: 'text-white',
      textLight: 'text-white/80',
      border: 'border-white',
      borderLight: 'border-white/30',
      ring: 'ring-white',
    },
  },
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get role configuration by key
 * @param {string} role - 'neutral' | 'observer'
 * @returns {object} Role configuration object
 */
export const getRoleConfig = (role) => {
  return ROLE_CONFIG[role] || ROLE_CONFIG.neutral;
};

/**
 * Get the icon component for a role
 * @param {string} role - 'neutral' | 'observer'
 * @returns {React.Component} Lucide icon component
 */
export const getRoleIcon = (role) => {
  const config = getRoleConfig(role);
  return config.icon;
};

/**
 * Merge class names, filtering out falsy values
 * @param  {...string} classes - Class names to merge
 * @returns {string} Merged class string
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Get border radius class based on role
 * @param {string} role - 'neutral' | 'observer'
 * @returns {string} Tailwind border-radius class
 */
export const getRoleBorderRadius = (role) => {
  const config = getRoleConfig(role);
  return config.borderRadius;
};

/**
 * Get font class based on role
 * @param {string} role - 'neutral' | 'observer'
 * @returns {string} Tailwind font-family class
 */
export const getRoleFont = (role) => {
  const config = getRoleConfig(role);
  return config.font;
};

/**
 * Format name with callsign: "First 'Callsign' Last"
 * @param {string} name - Full name
 * @param {string} callsign - User's callsign
 * @returns {object} Formatted name parts or string
 */
export const formatNameWithCallsign = (name, callsign) => {
  if (!callsign || !name) return { formatted: name, hasCallsign: false };
  const parts = name.split(' ');
  if (parts.length < 2) return { formatted: name, hasCallsign: false };
  const firstName = parts[0];
  const lastName = parts.slice(1).join(' ');
  return { firstName, callsign, lastName, hasCallsign: true };
};

// =============================================================================
// SIZE PRESETS
// =============================================================================

export const SIZES = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
};

export const SIZE_CLASSES = {
  button: {
    xs: 'px-2 py-1 text-xs gap-1',
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2',
    xl: 'px-6 py-3 text-lg gap-2.5',
  },
  icon: {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  },
  avatar: {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  },
  badge: {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1 text-sm',
  },
};

// =============================================================================
// VARIANT MAPPINGS - DARK THEME
// =============================================================================

export const BUTTON_VARIANTS = {
  primary: {
    base: 'bg-brand text-white border border-brand',
    hover: 'hover:bg-brand/90 hover:-translate-y-0.5',
    active: 'active:bg-brand/80 active:translate-y-0',
    focus: 'focus-visible:ring-brand',
  },
  secondary: {
    base: 'bg-transparent text-text-primary border-2 border-arena-border',
    hover: 'hover:bg-arena-card hover:border-text-secondary hover:-translate-y-0.5',
    active: 'active:bg-arena-elevated active:translate-y-0',
    focus: 'focus-visible:ring-text-secondary',
  },
  ghost: {
    base: 'bg-transparent text-text-secondary border-2 border-transparent',
    hover: 'hover:bg-arena-card hover:text-text-primary',
    active: 'active:bg-arena-elevated',
    focus: 'focus-visible:ring-text-secondary',
  },
  danger: {
    base: 'bg-error text-white border border-error',
    hover: 'hover:bg-error/90 hover:-translate-y-0.5',
    active: 'active:bg-error/80 active:translate-y-0',
    focus: 'focus-visible:ring-error',
  },
};

export const CARD_VARIANTS = {
  default: 'bg-arena-card border border-arena-border rounded-card',
  outlined: 'bg-arena-card border-2 border-arena-border-strong rounded-card',
  elevated: 'bg-arena-elevated border border-arena-border rounded-card shadow-lg',
  ghost: 'bg-transparent border border-transparent rounded-card',
};

export const BADGE_VARIANTS = {
  default: 'bg-arena-elevated text-text-secondary border border-arena-border',
  outline: 'bg-transparent text-text-secondary border border-arena-border-strong',
  neutral: 'bg-arena-elevated text-text-muted border border-arena-border',
  success: 'bg-success/10 text-success border border-success/30',
  warning: 'bg-warning/10 text-warning border border-warning/30',
  error: 'bg-error/10 text-error border border-error/30',
};

// =============================================================================
// SKILL COLOR SYSTEM
// Skills are grouped into categories with distinct colors
// =============================================================================

export const SKILL_CATEGORIES = {
  development: {
    label: 'Development',
    color: '#3B82F6', // blue
    bgClass: 'bg-blue-500/15',
    textClass: 'text-blue-400',
    borderClass: 'border-blue-500/30',
  },
  design: {
    label: 'Design',
    color: '#EC4899', // pink
    bgClass: 'bg-pink-500/15',
    textClass: 'text-pink-400',
    borderClass: 'border-pink-500/30',
  },
  data: {
    label: 'Data & AI',
    color: '#8B5CF6', // purple
    bgClass: 'bg-purple-500/15',
    textClass: 'text-purple-400',
    borderClass: 'border-purple-500/30',
  },
  infrastructure: {
    label: 'Infrastructure',
    color: '#10B981', // emerald
    bgClass: 'bg-emerald-500/15',
    textClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/30',
  },
  business: {
    label: 'Business',
    color: '#F59E0B', // amber
    bgClass: 'bg-amber-500/15',
    textClass: 'text-amber-400',
    borderClass: 'border-amber-500/30',
  },
  other: {
    label: 'Other',
    color: '#6B7280', // gray
    bgClass: 'bg-neutral-500/15',
    textClass: 'text-neutral-400',
    borderClass: 'border-neutral-500/30',
  },
};

// Map skills to categories - O(1) lookup
const SKILL_TO_CATEGORY_MAP = {
  'frontend development': 'development',
  'backend development': 'development',
  'mobile development': 'development',
  'ui/ux design': 'design',
  'graphic design': 'design',
  'machine learning': 'data',
  'data science': 'data',
  'ai/ml': 'data',
  'devops': 'infrastructure',
  'security': 'infrastructure',
  'cloud': 'infrastructure',
  'hardware/iot': 'infrastructure',
  'product management': 'business',
  'project management': 'business',
  'marketing': 'business',
};

/**
 * Get the category for a skill
 * @param {string} skill - The skill name
 * @returns {string} The category key
 */
export function getSkillCategory(skill) {
  if (!skill) return 'other';
  const normalizedSkill = skill.toLowerCase().trim();
  return SKILL_TO_CATEGORY_MAP[normalizedSkill] || 'other';
}

/**
 * Get the styling config for a skill
 * @param {string} skill - The skill name
 * @returns {object} The category styling config
 */
export function getSkillConfig(skill) {
  const category = getSkillCategory(skill);
  return SKILL_CATEGORIES[category] || SKILL_CATEGORIES.other;
}

/**
 * Get Tailwind classes for a skill badge
 * @param {string} skill - The skill name
 * @returns {string} Tailwind classes
 */
export function getSkillClasses(skill) {
  const config = getSkillConfig(skill);
  return `${config.bgClass} ${config.textClass} ${config.borderClass}`;
}

// =============================================================================
// CARD DIFFERENTIATION
// Visual indicators for different card states
// =============================================================================

export const CARD_STATES = {
  yourTeam: {
    label: 'Your Idea',
    borderClass: 'border-brand/50 ring-1 ring-brand/20',
    badgeClass: 'bg-brand/20 text-brand border-brand/30',
    icon: '★',
  },
  matchingSkills: {
    label: 'Skills Match',
    borderClass: 'border-success/50 ring-1 ring-success/20',
    badgeClass: 'bg-success/20 text-success border-success/30',
    icon: '✓',
  },
  teamFull: {
    label: 'Team Full',
    borderClass: 'border-arena-border opacity-60',
    badgeClass: 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30',
    icon: '●',
  },
  default: {
    borderClass: 'border-arena-border',
    badgeClass: '',
    icon: '',
  },
};

/**
 * Get the card state based on team and user context
 * @param {object} team - The team object
 * @param {object} user - The current user object
 * @returns {object} The card state config
 */
export function getCardState(team, user) {
  if (!team || !user) return CARD_STATES.default;
  
  // Check if user is captain
  if (team.captainId === user.id) {
    return CARD_STATES.yourTeam;
  }
  
  // Check if team is full
  if (team.members?.length >= (team.maxMembers || 6)) {
    return CARD_STATES.teamFull;
  }
  
  // Check if user's skills match what the team is looking for
  if (user.skills?.length > 0 && team.lookingFor?.length > 0) {
    const userSkillsLower = user.skills.map(s => s.toLowerCase());
    const hasMatch = team.lookingFor.some(skill => 
      userSkillsLower.includes(skill.toLowerCase())
    );
    if (hasMatch) {
      return CARD_STATES.matchingSkills;
    }
  }
  
  return CARD_STATES.default;
}

// =============================================================================
// EXPORT ALL
// =============================================================================

export default {
  COLORS,
  ROLE_CONFIG,
  getRoleConfig,
  getRoleIcon,
  getRoleBorderRadius,
  getRoleFont,
  formatNameWithCallsign,
  cn,
  SIZES,
  SIZE_CLASSES,
  BUTTON_VARIANTS,
  CARD_VARIANTS,
  BADGE_VARIANTS,
  SKILL_CATEGORIES,
  getSkillCategory,
  getSkillConfig,
  getSkillClasses,
  CARD_STATES,
  getCardState,
};
