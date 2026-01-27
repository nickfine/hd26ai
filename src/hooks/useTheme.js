/**
 * useTheme Hook
 * 
 * Manages theme state (light/dark) with:
 * - localStorage persistence
 * - System preference detection (prefers-color-scheme)
 * - System preference change listener
 * - Document attribute management ([data-color-mode])
 * 
 * Priority: localStorage > system preference > 'dark' (default)
 * 
 * Usage:
 * ```jsx
 * const { theme, setTheme, toggleTheme, systemTheme } = useTheme();
 * ```
 * 
 * Mid-Session Theme Switching:
 * Components using CSS custom properties (var(--token)) will automatically
 * update when theme changes. Avoid caching computed styles in state.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';

const THEME_STORAGE_KEY = 'hd26-theme';
const VALID_THEMES = ['light', 'dark', 'system'];

/**
 * Get the system's preferred color scheme
 * @returns {'light' | 'dark'}
 */
const getSystemTheme = () => {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

/**
 * Get the initial theme from localStorage or system preference
 * @returns {'light' | 'dark' | 'system'}
 */
const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'dark';
  
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && VALID_THEMES.includes(stored)) {
      return stored;
    }
  } catch (e) {
    // localStorage not available
    console.warn('[useTheme] localStorage not available:', e);
  }
  
  // Default to 'dark' to match current HD26AI branding
  // Users who prefer light mode can toggle it
  return 'dark';
};

/**
 * Apply theme to document
 * @param {'light' | 'dark'} resolvedTheme - The actual theme to apply (not 'system')
 */
const applyTheme = (resolvedTheme) => {
  if (typeof document === 'undefined') return;
  
  // Set the data-color-mode attribute which our CSS tokens respond to
  document.documentElement.setAttribute('data-color-mode', resolvedTheme);
  
  // Also set color-scheme for native browser elements (scrollbars, form controls)
  document.documentElement.style.colorScheme = resolvedTheme;
};

/**
 * useTheme Hook
 * @returns {Object} Theme state and controls
 */
export const useTheme = () => {
  const [theme, setThemeState] = useState(getInitialTheme);
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);
  
  // The actual theme being applied (resolves 'system' to actual value)
  const resolvedTheme = useMemo(() => {
    return theme === 'system' ? systemTheme : theme;
  }, [theme, systemTheme]);
  
  // Set theme with localStorage persistence
  const setTheme = useCallback((newTheme) => {
    if (!VALID_THEMES.includes(newTheme)) {
      console.warn(`[useTheme] Invalid theme: ${newTheme}. Use 'light', 'dark', or 'system'.`);
      return;
    }
    
    setThemeState(newTheme);
    
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (e) {
      console.warn('[useTheme] Failed to save theme to localStorage:', e);
    }
  }, []);
  
  // Toggle between light and dark (skips system)
  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }, [resolvedTheme, setTheme]);
  
  // Apply theme to document whenever resolvedTheme changes
  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);
  
  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    
    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    
    // Fallback for older browsers
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);
  
  // Apply theme on initial mount (handles SSR hydration)
  useEffect(() => {
    applyTheme(resolvedTheme);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  return {
    /** Current theme setting ('light', 'dark', or 'system') */
    theme,
    /** Set theme to 'light', 'dark', or 'system' */
    setTheme,
    /** Toggle between light and dark */
    toggleTheme,
    /** The resolved theme being applied ('light' or 'dark') */
    resolvedTheme,
    /** The system's preferred theme ('light' or 'dark') */
    systemTheme,
    /** Whether the theme is currently set to follow system */
    isSystemTheme: theme === 'system',
    /** Whether dark mode is active */
    isDark: resolvedTheme === 'dark',
    /** Whether light mode is active */
    isLight: resolvedTheme === 'light',
  };
};

export default useTheme;
