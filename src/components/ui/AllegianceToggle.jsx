/**
 * AllegianceToggle Component
 * A themed toggle switch for selecting Human/AI/Neutral allegiance.
 * Dark Mode Cyber Arena Theme
 * 
 * @example
 * <AllegianceToggle value="human" onChange={(val) => setAllegiance(val)} />
 * <AllegianceToggle value="ai" showLabels />
 */

import { forwardRef } from 'react';
import { Heart, Cpu, Scale } from 'lucide-react';
import { cn } from '../../lib/design-system';

/**
 * @typedef {Object} AllegianceToggleProps
 * @property {'human' | 'ai' | 'neutral'} [value='neutral']
 * @property {(value: string) => void} [onChange]
 * @property {boolean} [showLabels=true]
 * @property {boolean} [showIcons=true]
 * @property {boolean} [disabled=false]
 * @property {'sm' | 'md' | 'lg'} [size='md']
 * @property {string} [className]
 */

const SIZE_CONFIG = {
  sm: {
    container: 'h-10 text-xs',
    button: 'px-3 py-1.5',
    icon: 'w-3 h-3',
  },
  md: {
    container: 'h-12 text-sm',
    button: 'px-4 py-2',
    icon: 'w-4 h-4',
  },
  lg: {
    container: 'h-14 text-base',
    button: 'px-6 py-3',
    icon: 'w-5 h-5',
  },
};

const ALLEGIANCE_OPTIONS = [
  {
    id: 'human',
    label: 'HUMAN',
    shortLabel: 'H',
    Icon: Heart,
    activeClass: 'bg-human text-white shadow-glow-human',
    inactiveClass: 'text-human/60 hover:bg-human/10 hover:text-human',
  },
  {
    id: 'neutral',
    label: 'FREE',
    shortLabel: 'N',
    Icon: Scale,
    activeClass: 'bg-text-secondary text-arena-black',
    inactiveClass: 'text-text-muted hover:bg-arena-elevated hover:text-text-secondary',
  },
  {
    id: 'ai',
    label: 'AI',
    shortLabel: 'AI',
    Icon: Cpu,
    activeClass: 'bg-ai text-arena-black shadow-glow-ai font-mono',
    inactiveClass: 'text-ai/60 hover:bg-ai/10 hover:text-ai',
  },
];

const AllegianceToggle = forwardRef(({
  value = 'neutral',
  onChange,
  showLabels = true,
  showIcons = true,
  disabled = false,
  size = 'md',
  className,
  ...props
}, ref) => {
  const sizeConfig = SIZE_CONFIG[size] || SIZE_CONFIG.md;

  const handleSelect = (allegiance) => {
    if (!disabled && onChange) {
      onChange(allegiance);
    }
  };

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label="Select allegiance"
      className={cn(
        // Base container styles
        'inline-flex items-stretch',
        'rounded-card',
        'border border-arena-border',
        'bg-arena-card',
        'overflow-hidden',
        sizeConfig.container,
        // Disabled state
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {ALLEGIANCE_OPTIONS.map((option, index) => {
        const isActive = value === option.id;
        const Icon = option.Icon;

        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            disabled={disabled}
            onClick={() => handleSelect(option.id)}
            className={cn(
              // Base button styles
              'relative flex items-center justify-center gap-2',
              'font-bold tracking-wider',
              'transition-all duration-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand',
              sizeConfig.button,
              // Active/Inactive states
              isActive ? option.activeClass : option.inactiveClass,
              // Borders between buttons
              index > 0 && 'border-l border-arena-border',
              // Disabled cursor
              disabled && 'cursor-not-allowed',
              // AI uses mono font
              option.id === 'ai' && 'font-mono',
            )}
          >
            {/* Icon */}
            {showIcons && (
              <Icon className={cn(sizeConfig.icon, 'flex-shrink-0')} />
            )}
            
            {/* Label */}
            {showLabels && (
              <span className="uppercase">{option.label}</span>
            )}

            {/* Active indicator */}
            {isActive && (
              <span
                className={cn(
                  'absolute bottom-0 left-0 right-0 h-0.5',
                  option.id === 'human' && 'bg-human',
                  option.id === 'ai' && 'bg-ai animate-pulse',
                  option.id === 'neutral' && 'bg-text-secondary',
                )}
              />
            )}
          </button>
        );
      })}
    </div>
  );
});

AllegianceToggle.displayName = 'AllegianceToggle';

/**
 * AllegianceSwitch - Binary toggle between Human and AI only
 * Styled as a physical toggle switch
 */
export const AllegianceSwitch = forwardRef(({
  value = 'human',
  onChange,
  disabled = false,
  className,
  ...props
}, ref) => {
  const isAI = value === 'ai';

  const handleToggle = () => {
    if (!disabled && onChange) {
      onChange(isAI ? 'human' : 'ai');
    }
  };

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={isAI}
      aria-label={`Switch to ${isAI ? 'Human' : 'AI'} side`}
      disabled={disabled}
      onClick={handleToggle}
      className={cn(
        // Base switch container
        'relative inline-flex items-center',
        'w-20 h-10',
        'rounded-card',
        'border-2',
        'transition-all duration-300',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-arena-black',
        // Theme-specific styling
        isAI
          ? 'bg-arena-elevated border-ai/50 shadow-glow-ai'
          : 'bg-arena-elevated border-human/50 shadow-glow-human',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {/* Track labels */}
      <span 
        className={cn(
          'absolute left-2 text-xs font-bold transition-opacity',
          isAI ? 'opacity-30 text-human' : 'opacity-100 text-human'
        )}
      >
        H
      </span>
      <span 
        className={cn(
          'absolute right-2 text-xs font-bold font-mono transition-opacity',
          isAI ? 'opacity-100 text-ai' : 'opacity-30 text-ai'
        )}
      >
        AI
      </span>

      {/* Sliding knob */}
      <span
        className={cn(
          'absolute w-8 h-8 rounded-lg',
          'transform transition-all duration-300 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]',
          'flex items-center justify-center',
          // Position
          isAI ? 'translate-x-10' : 'translate-x-0.5',
          // Theme-specific knob styling
          isAI
            ? 'bg-ai shadow-glow-ai-strong'
            : 'bg-human shadow-glow-human-strong',
        )}
      >
        {isAI ? (
          <Cpu className="w-4 h-4 text-arena-black" />
        ) : (
          <Heart className="w-4 h-4 text-white" />
        )}
      </span>

      {/* Pulsing indicator */}
      <span 
        className={cn(
          'absolute -top-1 -right-1 w-2 h-2 rounded-full animate-pulse',
          isAI ? 'bg-ai' : 'bg-human'
        )} 
      />
    </button>
  );
});

AllegianceSwitch.displayName = 'AllegianceSwitch';

export default AllegianceToggle;
