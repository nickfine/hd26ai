/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Safelist dynamic classes that Tailwind JIT can't detect
  safelist: [],
  theme: {
    extend: {
      // =======================================================================
      // COLORS - Dark Mode Cyber Arena Palette
      // =======================================================================
      colors: {
        
        // Arena surfaces - use CSS variables for theme-aware colors
        arena: {
          black: 'var(--surface-secondary)',
          bg: 'var(--surface-secondary)',
          card: 'var(--surface-primary)',
          elevated: 'var(--surface-elevated)',
          border: 'var(--border-default)',
          'border-strong': 'var(--border-default)',
          'glass': 'var(--surface-glass)',
          'glass-border': 'var(--border-subtle)',
          // Text colors for arena namespace (allows text-arena-secondary etc.)
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-disabled)',
        },
        
        // Text colors - use CSS variables for theme-aware colors
        // These map to tokens.css which handles light/dark mode
        text: {
          primary: 'var(--text-primary)',
          body: 'var(--text-secondary)',        // Body text - maps to secondary for good contrast
          secondary: 'var(--text-secondary)',   // Descriptions, labels
          muted: 'var(--text-disabled)',        // Tertiary/muted text
        },
        
        // Status Colors
        success: {
          DEFAULT: '#00FF9D',
          50: '#E0FFF3',
          100: '#B3FFE4',
          200: '#80FFD3',
          300: '#4DFFC1',
          400: '#26FFAF',
          500: '#00FF9D',
          600: '#00E68A',
          700: '#00CC77',
        },
        
        warning: {
          DEFAULT: '#FF8A00',
          500: '#FF8A00',
        },
        
        error: {
          DEFAULT: '#FF4500',
          500: '#FF4500',
        },
        
        // Legacy neutral (for compatibility)
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
      },
      
      // =======================================================================
      // TYPOGRAPHY
      // =======================================================================
      fontFamily: {
        heading: ['Satoshi', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['Satoshi', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', 'monospace'],
        display: ['Satoshi', 'system-ui', '-apple-system', 'sans-serif'],
      },
      
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
        '7xl': ['4.5rem', { lineHeight: '1.05' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      
      // =======================================================================
      // BORDER RADIUS
      // =======================================================================
      borderRadius: {
        'none': '0',
        'sm': '0.25rem',
        'DEFAULT': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        'card': '24px',           // Premium 24px corners
        'full': '9999px',
      },
      
      // =======================================================================
      // BOX SHADOW - Including Glows
      // =======================================================================
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.4)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.4)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.4)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
        'none': 'none',
        // Card hover
        'card-hover': '0 8px 25px -5px rgba(0, 0, 0, 0.6)',
      },
      
      // =======================================================================
      // ANIMATION
      // =======================================================================
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'countdown-pulse': 'countdownPulse 120ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        countdownPulse: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      
      // =======================================================================
      // TRANSITION
      // =======================================================================
      transitionDuration: {
        'fast': '150ms',
        'normal': '200ms',
        'slow': '300ms',
      },
      
      transitionTimingFunction: {
        'bounce-custom': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      
      // =======================================================================
      // Z-INDEX SCALE
      // =======================================================================
      zIndex: {
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
        'cursor-glow': '9999',
      },
      
      // =======================================================================
      // SPACING
      // =======================================================================
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
