/**
 * Design System Utilities
 * Theme helpers, allegiance configuration, and utility functions
 * Dark Mode Cyber Arena Theme
 */

import { Heart, Cpu, Scale } from 'lucide-react';

// =============================================================================
// COLOR CONSTANTS
// =============================================================================

export const COLORS = {
  // Brand
  brand: '#FF5722',
  
  // Backgrounds
  bgPrimary: '#0A0A0A',
  bgCard: '#111111',
  bgElevated: '#1A1A1A',
  
  // Borders
  border: '#1F1F1F',
  borderStrong: '#2A2A2A',
  
  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#AAAAAA',
  textMuted: '#666666',
  
  // Team colors
  human: '#FF2E63',
  ai: '#00D4FF',
  neutral: '#666666',
  
  // Status
  success: '#00FF9D',
  warning: '#FF2E63',
  error: '#FF2E63',
};

// =============================================================================
// ALLEGIANCE CONFIGURATION
// Centralized styling for Human/AI/Neutral themes
// =============================================================================

export const ALLEGIANCE_CONFIG = {
  human: {
    id: 'human',
    label: 'Human',
    color: '#FF2E63',
    bgColor: 'rgba(255, 46, 99, 0.1)',
    borderColor: '#FF2E63',
    textColor: '#FF2E63',
    glowColor: 'rgba(255, 46, 99, 0.4)',
    font: 'font-sans',
    borderRadius: 'rounded-card',
    borderStyle: 'border-l-4',
    icon: Heart,
    // Tailwind classes for dark theme
    classes: {
      bg: 'bg-human',
      bgLight: 'bg-human/10',
      text: 'text-human',
      textLight: 'text-human/80',
      border: 'border-human',
      borderLight: 'border-human/30',
      ring: 'ring-human',
      glow: 'shadow-glow-human',
      glowStrong: 'shadow-glow-human-strong',
    },
  },
  ai: {
    id: 'ai',
    label: 'AI',
    color: '#00D4FF',
    bgColor: 'rgba(0, 212, 255, 0.1)',
    borderColor: '#00D4FF',
    textColor: '#00D4FF',
    glowColor: 'rgba(0, 212, 255, 0.4)',
    font: 'font-mono',
    borderRadius: 'rounded-card',
    borderStyle: 'border-l-4',
    icon: Cpu,
    // Tailwind classes for dark theme
    classes: {
      bg: 'bg-ai',
      bgLight: 'bg-ai/10',
      text: 'text-ai',
      textLight: 'text-ai/80',
      border: 'border-ai',
      borderLight: 'border-ai/30',
      ring: 'ring-ai',
      glow: 'shadow-glow-ai',
      glowStrong: 'shadow-glow-ai-strong',
    },
  },
  neutral: {
    id: 'neutral',
    label: 'Neutral',
    color: '#666666',
    bgColor: 'rgba(102, 102, 102, 0.1)',
    borderColor: '#666666',
    textColor: '#AAAAAA',
    glowColor: 'transparent',
    font: 'font-sans',
    borderRadius: 'rounded-card',
    borderStyle: 'border-l-4',
    icon: Scale,
    // Tailwind classes for dark theme
    classes: {
      bg: 'bg-neutral-600',
      bgLight: 'bg-neutral-800',
      text: 'text-text-secondary',
      textLight: 'text-text-muted',
      border: 'border-arena-border',
      borderLight: 'border-arena-border',
      ring: 'ring-neutral-600',
      glow: '',
      glowStrong: '',
    },
  },
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get allegiance configuration by key
 * @param {string} allegiance - 'human' | 'ai' | 'neutral'
 * @returns {object} Allegiance configuration object
 */
export const getAllegianceConfig = (allegiance) => {
  return ALLEGIANCE_CONFIG[allegiance] || ALLEGIANCE_CONFIG.neutral;
};

/**
 * Get the icon component for an allegiance
 * @param {string} allegiance - 'human' | 'ai' | 'neutral'
 * @returns {React.Component} Lucide icon component
 */
export const getAllegianceIcon = (allegiance) => {
  const config = getAllegianceConfig(allegiance);
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
 * Get border radius class based on allegiance
 * @param {string} allegiance - 'human' | 'ai' | 'neutral'
 * @returns {string} Tailwind border-radius class
 */
export const getAllegianceBorderRadius = (allegiance) => {
  const config = getAllegianceConfig(allegiance);
  return config.borderRadius;
};

/**
 * Get font class based on allegiance
 * @param {string} allegiance - 'human' | 'ai' | 'neutral'
 * @returns {string} Tailwind font-family class
 */
export const getAllegianceFont = (allegiance) => {
  const config = getAllegianceConfig(allegiance);
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
    base: 'bg-brand text-white border-2 border-brand',
    hover: 'hover:bg-brand/90 hover:shadow-glow-brand hover:scale-[1.04]',
    active: 'active:scale-[0.98]',
    focus: 'focus-visible:ring-brand',
  },
  secondary: {
    base: 'bg-transparent text-white border-2 border-arena-border',
    hover: 'hover:bg-arena-card hover:border-text-secondary',
    active: 'active:bg-arena-elevated',
    focus: 'focus-visible:ring-text-secondary',
  },
  ghost: {
    base: 'bg-transparent text-text-secondary border-2 border-transparent',
    hover: 'hover:bg-arena-card hover:text-white',
    active: 'active:bg-arena-elevated',
    focus: 'focus-visible:ring-text-secondary',
  },
  danger: {
    base: 'bg-error text-white border-2 border-error',
    hover: 'hover:bg-error/90 hover:shadow-glow-human',
    active: 'active:bg-error/80',
    focus: 'focus-visible:ring-error',
  },
  human: {
    base: 'bg-human text-white border-2 border-human rounded-card',
    hover: 'hover:bg-human/90 hover:shadow-glow-human-strong hover:scale-[1.04]',
    active: 'active:scale-[0.98]',
    focus: 'focus-visible:ring-human',
  },
  'human-ghost': {
    base: 'bg-transparent text-human border border-human rounded-card',
    hover: 'hover:bg-human/10 hover:shadow-glow-human',
    active: 'active:bg-human/20',
    focus: 'focus-visible:ring-human',
  },
  ai: {
    base: 'bg-ai text-arena-black border-2 border-ai rounded-card font-mono',
    hover: 'hover:bg-ai/90 hover:shadow-glow-ai-strong hover:scale-[1.04]',
    active: 'active:scale-[0.98]',
    focus: 'focus-visible:ring-ai',
  },
  'ai-ghost': {
    base: 'bg-transparent text-ai border border-ai rounded-card font-mono',
    hover: 'hover:bg-ai/10 hover:shadow-glow-ai',
    active: 'active:bg-ai/20',
    focus: 'focus-visible:ring-ai',
  },
  accent: {
    base: 'bg-success text-arena-black border-2 border-success',
    hover: 'hover:bg-success/90',
    active: 'active:bg-success/80',
    focus: 'focus-visible:ring-success',
  },
};

export const CARD_VARIANTS = {
  default: 'bg-arena-card border border-arena-border rounded-card',
  outlined: 'bg-arena-card border-2 border-arena-border-strong rounded-card',
  elevated: 'bg-arena-elevated border border-arena-border rounded-card shadow-lg',
  ghost: 'bg-transparent border border-transparent rounded-card',
  human: 'bg-arena-card border-l-4 border border-arena-border border-l-human rounded-card',
  ai: 'bg-arena-card border-l-4 border border-arena-border border-l-ai rounded-card',
  accent: 'bg-arena-card border-l-4 border border-arena-border border-l-brand rounded-card',
  special: 'bg-arena-elevated border-2 border-brand rounded-card',
};

export const BADGE_VARIANTS = {
  default: 'bg-arena-elevated text-text-secondary border border-arena-border',
  outline: 'bg-transparent text-text-secondary border border-arena-border-strong',
  human: 'bg-human/10 text-human border border-human/30',
  ai: 'bg-ai/10 text-ai border border-ai/30 font-mono',
  neutral: 'bg-arena-elevated text-text-muted border border-arena-border',
  success: 'bg-success/10 text-success border border-success/30',
  warning: 'bg-warning/10 text-warning border border-warning/30',
  error: 'bg-error/10 text-error border border-error/30',
  accent: 'bg-brand/10 text-brand border border-brand/30',
  special: 'bg-brand/20 text-brand border border-brand/50',
};

// =============================================================================
// EXPORT ALL
// =============================================================================

export default {
  COLORS,
  ALLEGIANCE_CONFIG,
  getAllegianceConfig,
  getAllegianceIcon,
  getAllegianceBorderRadius,
  getAllegianceFont,
  formatNameWithCallsign,
  cn,
  SIZES,
  SIZE_CLASSES,
  BUTTON_VARIANTS,
  CARD_VARIANTS,
  BADGE_VARIANTS,
};
