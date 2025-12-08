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
  // Brand - Orange is King
  brand: '#FF4500',
  brandHover: '#FF7033',
  brandPressed: '#CC3700',
  amber: '#FF8A00',
  orangeDark: '#CC3700',
  
  // Backgrounds
  bgPrimary: '#0B0A08',        // Warm black
  bgCard: '#111111',
  bgElevated: '#1A1A1A',
  bgGlass: 'rgba(15, 15, 15, 0.72)',
  
  // Borders
  border: '#1F1F1F',
  borderStrong: '#2A2A2A',
  borderGlass: 'rgba(255, 100, 0, 0.18)',  // Warm orange-tinted
  
  // Text Hierarchy
  textPrimary: '#FFFFFF',
  textBody: '#E0E0E0',
  textSecondary: '#AAAAAA',
  textMuted: '#888888',
  
  // Team colors - Orange vs Cyan
  human: '#FF4500',            // Brand orange
  humanGradientEnd: '#FF6200',
  ai: '#00E5FF',               // Electric cyan
  neutral: '#888888',
  
  // Status
  success: '#00FF9D',
  warning: '#FF8A00',
  error: '#FF4500',
};

// =============================================================================
// ALLEGIANCE CONFIGURATION
// Centralized styling for Human/AI/Neutral themes
// =============================================================================

export const ALLEGIANCE_CONFIG = {
  human: {
    id: 'human',
    label: 'Human',
    color: '#FF4500',              // Brand orange
    bgColor: 'rgba(255, 69, 0, 0.1)',
    borderColor: '#FF4500',
    textColor: '#FF4500',
    glowColor: 'rgba(255, 69, 0, 0.4)',
    gradientEnd: '#FF6200',
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
    color: '#00E5FF',              // Electric cyan
    bgColor: 'rgba(0, 229, 255, 0.1)',
    borderColor: '#00E5FF',
    textColor: '#00E5FF',
    glowColor: 'rgba(0, 229, 255, 0.4)',
    font: 'font-sans',             // Unified with Human mode
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
    color: '#888888',
    bgColor: 'rgba(136, 136, 136, 0.1)',
    borderColor: '#888888',
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
    base: 'bg-brand text-white border border-brand-dark',
    hover: 'hover:bg-brand-hover hover:shadow-inner-glow hover:-translate-y-1 hover:shadow-btn-lift',
    active: 'active:bg-brand-pressed active:translate-y-0',
    focus: 'focus-visible:ring-brand',
  },
  secondary: {
    base: 'bg-transparent text-white border-2 border-arena-border',
    hover: 'hover:bg-arena-card hover:border-text-secondary hover:-translate-y-0.5',
    active: 'active:bg-arena-elevated active:translate-y-0',
    focus: 'focus-visible:ring-text-secondary',
  },
  ghost: {
    base: 'bg-transparent text-text-secondary border-2 border-transparent',
    hover: 'hover:bg-arena-card hover:text-white',
    active: 'active:bg-arena-elevated',
    focus: 'focus-visible:ring-text-secondary',
  },
  danger: {
    base: 'bg-error text-white border border-brand-dark',
    hover: 'hover:bg-brand-hover hover:shadow-inner-glow hover:-translate-y-1',
    active: 'active:bg-brand-pressed active:translate-y-0',
    focus: 'focus-visible:ring-error',
  },
  human: {
    base: 'bg-human text-white border border-brand-dark rounded-card',
    hover: 'hover:bg-brand-hover hover:shadow-inner-glow hover:-translate-y-1 hover:shadow-glow-human-strong',
    active: 'active:bg-brand-pressed active:translate-y-0',
    focus: 'focus-visible:ring-human',
  },
  'human-ghost': {
    base: 'bg-transparent text-human border border-human rounded-card',
    hover: 'hover:bg-human/10 hover:shadow-glow-human hover:-translate-y-0.5',
    active: 'active:bg-human/20 active:translate-y-0',
    focus: 'focus-visible:ring-human',
  },
  ai: {
    base: 'bg-ai text-arena-black border-2 border-ai rounded-card',
    hover: 'hover:bg-ai/90 hover:shadow-glow-ai-strong hover:-translate-y-1',
    active: 'active:bg-ai/80 active:translate-y-0',
    focus: 'focus-visible:ring-ai',
  },
  'ai-ghost': {
    base: 'bg-transparent text-ai border border-ai rounded-card',
    hover: 'hover:bg-ai/10 hover:shadow-glow-ai hover:-translate-y-0.5',
    active: 'active:bg-ai/20 active:translate-y-0',
    focus: 'focus-visible:ring-ai',
  },
  accent: {
    base: 'bg-success text-arena-black border-2 border-success',
    hover: 'hover:bg-success/90 hover:-translate-y-0.5',
    active: 'active:bg-success/80 active:translate-y-0',
    focus: 'focus-visible:ring-success',
  },
};

export const CARD_VARIANTS = {
  default: 'glass-card rounded-card',
  outlined: 'glass-card border-2 border-arena-border-strong rounded-card',
  elevated: 'bg-arena-elevated border border-arena-border rounded-card shadow-lg',
  ghost: 'bg-transparent border border-transparent rounded-card',
  human: 'glass-card border-l-4 border-l-human rounded-card',
  ai: 'glass-card border-l-4 border-l-ai rounded-card',
  accent: 'glass-card border-l-4 border-l-brand rounded-card',
  special: 'glass-card border-2 border-brand rounded-card',
};

export const BADGE_VARIANTS = {
  default: 'bg-arena-elevated text-text-secondary border border-arena-border',
  outline: 'bg-transparent text-text-secondary border border-arena-border-strong',
  human: 'bg-human/10 text-human border border-human/30',
  ai: 'bg-ai/10 text-ai border border-ai/30',
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
