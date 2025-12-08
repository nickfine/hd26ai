/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Safelist dynamic classes that Tailwind JIT can't detect
  safelist: [
    'bg-human', 'bg-ai', 'bg-brand',
    'bg-human-10', 'bg-human-20', 'bg-ai-10', 'bg-ai-20', 'bg-brand-20',
    'text-human', 'text-ai', 'text-brand',
    'border-human', 'border-ai', 'border-brand',
    'glow-human', 'glow-ai', 'glow-brand',
    'hover:glow-human', 'hover:glow-ai', 'hover:glow-brand',
    'shadow-human-glow', 'shadow-ai-glow', 'shadow-brand-glow',
  ],
  theme: {
    extend: {
      // =======================================================================
      // COLORS - Dark Mode Cyber Arena Palette
      // =======================================================================
      colors: {
        // Brand - Adaptavist Orange (Orange is King)
        brand: {
          DEFAULT: '#FF4500',
          hover: '#FF7033',        // 15% white mix - backlit
          pressed: '#CC3700',      // Darker for active
          amber: '#FF8A00',        // Deep amber accent
          dark: '#CC3700',         // Dark orange for depth
          // Opacity tokens for capsule badges
          10: '#FF45001A',   // 10% opacity
          20: '#FF450033',   // 20% opacity
          30: '#FF45004D',   // 30% opacity
          60: '#FF450099',   // 60% opacity
          // Standard scale
          50: '#FFF3E0',
          100: '#FFE0B2',
          200: '#FFCC80',
          300: '#FFB74D',
          400: '#FFA726',
          500: '#FF4500',
          600: '#E63E00',
          700: '#CC3700',
          800: '#B33000',
          900: '#992900',
        },
        
        // Team Human - Brand Orange (Orange is King)
        human: {
          DEFAULT: '#FF4500',
          // Opacity tokens for capsule badges
          10: '#FF45001A',   // 10% opacity
          20: '#FF450033',   // 20% opacity
          30: '#FF45004D',   // 30% opacity
          // Standard scale
          50: '#FFF3E0',
          100: '#FFE4CC',
          200: '#FFCA99',
          300: '#FFB066',
          400: '#FF8533',
          500: '#FF4500',
          600: '#E63E00',
          700: '#CC3700',
          800: '#B33000',
          900: '#992900',
          'gradient-end': '#FF6200',  // Gradient terminus
          glow: 'rgba(255, 69, 0, 0.4)',
        },
        
        // Team AI - Electric Cyan
        ai: {
          DEFAULT: '#00E5FF',
          // Opacity tokens for capsule badges
          10: '#00E5FF1A',   // 10% opacity
          20: '#00E5FF33',   // 20% opacity
          30: '#00E5FF4D',   // 30% opacity
          // Standard scale
          50: '#E0FBFF',
          100: '#B3F5FF',
          200: '#80EEFF',
          300: '#4DE8FF',
          400: '#26E3FF',
          500: '#00E5FF',
          600: '#00CCE6',
          700: '#00B3CC',
          800: '#0099B3',
          900: '#008099',
          glow: 'rgba(0, 229, 255, 0.4)',
        },
        
        // Arena surfaces (dark mode)
        arena: {
          black: '#0B0A08',      // Warm black - makes orange glow
          bg: '#0B0A08',         // Alias for bg-arena-bg
          card: '#111111',       // Card/panel bg
          elevated: '#1A1A1A',   // Elevated surfaces
          border: '#1F1F1F',     // Subtle borders
          'border-strong': '#2A2A2A',
          'glass': 'rgba(15, 15, 15, 0.72)',
          'glass-border': 'rgba(255, 100, 0, 0.18)',  // Warm orange-tinted
          // Text colors for arena namespace (allows text-arena-secondary etc.)
          secondary: '#AAAAAA',
          muted: '#888888',
        },
        
        // Text colors
        text: {
          primary: '#FFFFFF',
          body: '#E0E0E0',       // Body text
          secondary: '#AAAAAA',
          muted: '#888888',
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
        // Team glows (updated to brand orange)
        'glow-human': '0 0 12px rgba(255, 69, 0, 0.22)',
        'glow-human-strong': '0 0 20px rgba(255, 69, 0, 0.4)',
        'glow-ai': '0 0 12px rgba(0, 229, 255, 0.22)',
        'glow-ai-strong': '0 0 20px rgba(0, 229, 255, 0.4)',
        'glow-brand': '0 0 12px rgba(255, 69, 0, 0.3)',
        'glow-brand-strong': '0 0 20px rgba(255, 69, 0, 0.5)',
        // Inner glow for backlit button effect
        'inner-glow': 'inset 0 0 20px rgba(255, 255, 255, 0.15)',
        'btn-lift': '0 4px 12px rgba(0, 0, 0, 0.4)',
        // Alternate naming (for badge capsules)
        'human-glow': '0 0 20px rgba(255, 69, 0, 0.3)',
        'ai-glow': '0 0 20px rgba(0, 229, 255, 0.3)',
        'brand-glow': '0 0 20px rgba(255, 69, 0, 0.4)',
        // Skill chip hover glow
        'skill-glow': '0 4px 12px rgba(255, 69, 0, 0.1)',
        // Card hover
        'card-hover': '0 8px 25px -5px rgba(0, 0, 0, 0.6)',
        'card-human': '0 0 12px rgba(255, 69, 0, 0.22), 0 8px 25px -5px rgba(0, 0, 0, 0.6)',
        'card-ai': '0 0 12px rgba(0, 229, 255, 0.22), 0 8px 25px -5px rgba(0, 0, 0, 0.6)',
        // Icon glow on hover
        'icon-glow': '0 0 8px rgba(255, 69, 0, 0.5)',
      },
      
      // =======================================================================
      // ANIMATION
      // =======================================================================
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'blob': 'blob 8s ease-in-out infinite',
        'blob-delay-2': 'blob 8s ease-in-out 2s infinite',
        'blob-delay-4': 'blob 8s ease-in-out 4s infinite',
        'countdown-pulse': 'countdownPulse 120ms ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        // Hero figure cinematic pulse
        'hero-pulse': 'heroPulse 8s infinite ease-in-out',
        // Orange load pulse - brightness flash on mount
        'orange-pulse': 'orangePulse 0.6s ease-out',
        'orange-pulse-delay-1': 'orangePulse 0.6s ease-out 0.1s',
        'orange-pulse-delay-2': 'orangePulse 0.6s ease-out 0.2s',
        'orange-pulse-delay-3': 'orangePulse 0.6s ease-out 0.3s',
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
        blob: {
          '0%, 100%': { 
            transform: 'scale(1) translate(0, 0)',
            opacity: '0.6',
          },
          '33%': { 
            transform: 'scale(1.05) translate(10px, -10px)',
            opacity: '0.7',
          },
          '66%': { 
            transform: 'scale(0.95) translate(-5px, 5px)',
            opacity: '0.5',
          },
        },
        countdownPulse: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        // Hero figure cinematic pulse
        heroPulse: {
          '0%, 100%': { opacity: '0.96' },
          '50%': { opacity: '1' },
        },
        // Orange brightness pulse for load animations
        orangePulse: {
          '0%': { filter: 'brightness(1)', opacity: '0.8' },
          '50%': { filter: 'brightness(1.3)', opacity: '1' },
          '100%': { filter: 'brightness(1)', opacity: '1' },
        },
      },
      
      // =======================================================================
      // TRANSITION
      // =======================================================================
      transitionDuration: {
        'fast': '150ms',
        'normal': '200ms',
        'slow': '300ms',
        'war-bar': '800ms',
      },
      
      transitionTimingFunction: {
        'war-bar': 'cubic-bezier(0.16, 1, 0.3, 1)',
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
