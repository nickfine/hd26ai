/**
 * Design System Utilities
 * Theme helpers, allegiance configuration, and utility functions
 */

import { Heart, Cpu, Scale } from 'lucide-react';

// =============================================================================
// ALLEGIANCE CONFIGURATION
// Centralized styling for Human/AI/Neutral themes
// =============================================================================

export const ALLEGIANCE_CONFIG = {
  human: {
    id: 'human',
    label: 'Human',
    color: 'rgb(34, 197, 94)',
    bgColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgb(34, 197, 94)',
    textColor: 'rgb(21, 128, 61)',
    font: 'font-sans',
    borderRadius: 'rounded-human',
    borderStyle: 'border-2 border-solid',
    icon: Heart,
    // Tailwind classes
    classes: {
      bg: 'bg-human-500',
      bgLight: 'bg-human-50',
      text: 'text-human-600',
      textLight: 'text-human-500',
      border: 'border-human-500',
      borderLight: 'border-human-200',
      ring: 'ring-human-500',
    },
  },
  ai: {
    id: 'ai',
    label: 'AI',
    color: 'rgb(6, 182, 212)',
    bgColor: 'rgba(6, 182, 212, 0.1)',
    borderColor: 'rgb(6, 182, 212)',
    textColor: 'rgb(14, 116, 144)',
    font: 'font-mono',
    borderRadius: 'rounded-ai',
    borderStyle: 'border-2 border-dashed',
    icon: Cpu,
    // Tailwind classes
    classes: {
      bg: 'bg-ai-500',
      bgLight: 'bg-ai-50',
      text: 'text-ai-600',
      textLight: 'text-ai-500',
      border: 'border-ai-500',
      borderLight: 'border-ai-200',
      ring: 'ring-ai-500',
    },
  },
  neutral: {
    id: 'neutral',
    label: 'Neutral',
    color: 'rgb(156, 163, 175)',
    bgColor: 'rgba(156, 163, 175, 0.1)',
    borderColor: 'rgb(156, 163, 175)',
    textColor: 'rgb(75, 85, 99)',
    font: 'font-sans',
    borderRadius: 'rounded-neutral',
    borderStyle: 'border',
    icon: Scale,
    // Tailwind classes
    classes: {
      bg: 'bg-neutral-500',
      bgLight: 'bg-neutral-50',
      text: 'text-neutral-600',
      textLight: 'text-neutral-500',
      border: 'border-neutral-400',
      borderLight: 'border-neutral-200',
      ring: 'ring-neutral-500',
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
// VARIANT MAPPINGS
// =============================================================================

export const BUTTON_VARIANTS = {
  primary: {
    base: 'bg-neutral-900 text-white border-2 border-neutral-900',
    hover: 'hover:bg-neutral-800 hover:border-neutral-800',
    active: 'active:bg-neutral-950',
    focus: 'focus-visible:ring-neutral-500',
  },
  secondary: {
    base: 'bg-white text-neutral-900 border-2 border-neutral-900',
    hover: 'hover:bg-neutral-900 hover:text-white',
    active: 'active:bg-neutral-800',
    focus: 'focus-visible:ring-neutral-500',
  },
  ghost: {
    base: 'bg-transparent text-neutral-600 border-2 border-transparent',
    hover: 'hover:bg-neutral-100 hover:text-neutral-900',
    active: 'active:bg-neutral-200',
    focus: 'focus-visible:ring-neutral-500',
  },
  danger: {
    base: 'bg-error-500 text-white border-2 border-error-500',
    hover: 'hover:bg-error-600 hover:border-error-600',
    active: 'active:bg-error-700',
    focus: 'focus-visible:ring-error-500',
  },
  human: {
    base: 'bg-human-500 text-white border-2 border-human-500 rounded-human',
    hover: 'hover:bg-human-600 hover:border-human-600',
    active: 'active:bg-human-700',
    focus: 'focus-visible:ring-human-500',
  },
  ai: {
    base: 'bg-ai-500 text-white border-2 border-ai-500 rounded-ai font-mono',
    hover: 'hover:bg-ai-600 hover:border-ai-600',
    active: 'active:bg-ai-700',
    focus: 'focus-visible:ring-ai-500',
  },
  accent: {
    base: 'bg-accent-400 text-accent-900 border-2 border-accent-400',
    hover: 'hover:bg-accent-500 hover:border-accent-500',
    active: 'active:bg-accent-600',
    focus: 'focus-visible:ring-accent-500',
  },
};

export const CARD_VARIANTS = {
  default: 'bg-white border-2 border-neutral-200',
  outlined: 'bg-white border-2 border-neutral-900',
  elevated: 'bg-white border border-neutral-200 shadow-md',
  ghost: 'bg-transparent border-2 border-transparent',
  human: 'bg-white border-2 border-human-300 rounded-human',
  ai: 'bg-white border-2 border-ai-300 border-dashed rounded-ai',
  accent: 'bg-accent-50 border-2 border-accent-400',
  special: 'bg-special-50 border-2 border-special-300',
};

export const BADGE_VARIANTS = {
  default: 'bg-neutral-100 text-neutral-700 border border-neutral-200',
  outline: 'bg-transparent text-neutral-700 border border-neutral-300',
  human: 'bg-human-50 text-human-700 border border-human-200',
  ai: 'bg-ai-50 text-ai-700 border border-ai-200 font-mono',
  neutral: 'bg-neutral-100 text-neutral-600 border border-neutral-200',
  success: 'bg-success-50 text-success-700 border border-success-200',
  warning: 'bg-warning-50 text-warning-700 border border-warning-200',
  error: 'bg-error-50 text-error-700 border border-error-200',
  accent: 'bg-accent-100 text-accent-800 border border-accent-300',
  special: 'bg-special-100 text-special-700 border border-special-300',
};

// =============================================================================
// EXPORT ALL
// =============================================================================

export default {
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

