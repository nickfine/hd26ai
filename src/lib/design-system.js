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
};
