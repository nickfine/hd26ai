/**
 * Progress Component
 * Display progress indicators as bars or circular displays.
 * Dark Mode Cyber Arena Theme
 * 
 * @example
 * <Progress value={75} />
 * <Progress value={50} variant="human" showLabel />
 * <CircularProgress value={80} size="lg" />
 * <WarStatusBar humanPercent={45} aiPercent={55} />
 */

import { forwardRef } from 'react';
import { cn, getAllegianceConfig } from '../../lib/design-system';

/**
 * @typedef {Object} ProgressProps
 * @property {number} value - Progress value (0-100)
 * @property {number} [max=100] - Maximum value
 * @property {'sm' | 'md' | 'lg'} [size='md']
 * @property {'default' | 'human' | 'ai' | 'success' | 'warning' | 'error' | 'accent'} [variant='default']
 * @property {boolean} [showLabel=false]
 * @property {string} [label]
 * @property {boolean} [animated=true]
 * @property {string} [className]
 */

const SIZE_MAP = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

const VARIANT_COLORS = {
  default: 'bg-brand',
  human: 'bg-human',
  ai: 'bg-ai',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
  accent: 'bg-brand',
};

const TRACK_COLORS = {
  default: 'bg-arena-elevated',
  human: 'bg-human/20',
  ai: 'bg-ai/20',
  success: 'bg-success/20',
  warning: 'bg-warning/20',
  error: 'bg-error/20',
  accent: 'bg-brand/20',
};

const Progress = forwardRef(({
  value = 0,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  label,
  animated = true,
  className,
  ...props
}, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;
  const barColor = VARIANT_COLORS[variant] || VARIANT_COLORS.default;
  const trackColor = TRACK_COLORS[variant] || TRACK_COLORS.default;

  return (
    <div ref={ref} className={cn('w-full', className)} {...props}>
      {/* Label Row */}
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1">
          {label && (
            <span className="text-sm font-medium text-text-secondary">{label}</span>
          )}
          {showLabel && (
            <span className="text-sm font-mono text-text-muted">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      {/* Progress Track */}
      <div
        className={cn(
          'w-full overflow-hidden rounded-full',
          trackColor,
          sizeClass
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        {/* Progress Bar */}
        <div
          className={cn(
            'h-full rounded-full',
            barColor,
            animated && 'transition-all duration-500 ease-out'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
});

Progress.displayName = 'Progress';

/**
 * CircularProgress - Circular progress indicator
 */
export const CircularProgress = forwardRef(({
  value = 0,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  strokeWidth,
  className,
  ...props
}, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeMap = {
    sm: { size: 32, stroke: 3 },
    md: { size: 48, stroke: 4 },
    lg: { size: 64, stroke: 5 },
    xl: { size: 80, stroke: 6 },
  };

  const config = sizeMap[size] || sizeMap.md;
  const actualStrokeWidth = strokeWidth || config.stroke;
  const radius = (config.size - actualStrokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const variantStrokeColors = {
    default: '#FF5722',
    human: '#FF2E63',
    ai: '#00D4FF',
    success: '#00FF9D',
    warning: '#FF2E63',
    error: '#FF2E63',
    accent: '#FF5722',
  };

  const strokeColor = variantStrokeColors[variant] || variantStrokeColors.default;

  return (
    <div
      ref={ref}
      className={cn('relative inline-flex items-center justify-center', className)}
      {...props}
    >
      <svg
        width={config.size}
        height={config.size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={config.size / 2}
          cy={config.size / 2}
          r={radius}
          fill="none"
          stroke="#1F1F1F"
          strokeWidth={actualStrokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={config.size / 2}
          cy={config.size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={actualStrokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-out"
        />
      </svg>

      {/* Center Label */}
      {showLabel && (
        <span className="absolute text-sm font-bold text-white font-mono">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
});

CircularProgress.displayName = 'CircularProgress';

/**
 * WarStatusBar - The "battle line" showing Human vs AI recruitment
 * Features a sharp gradient split with a glowing divider
 */
export const WarStatusBar = forwardRef(({
  humanPercent = 50,
  aiPercent = 50,
  showLabels = true,
  showDivider = true,
  height = 'md',
  animated = true,
  className,
  ...props
}, ref) => {
  // Normalize percentages
  const total = humanPercent + aiPercent;
  const normalizedHuman = total > 0 ? (humanPercent / total) * 100 : 50;
  const normalizedAi = total > 0 ? (aiPercent / total) * 100 : 50;
  
  // Calculate background position (100% = all AI, 0% = all Human)
  // We want AI on left, Human on right
  const backgroundPosition = normalizedAi;

  const heightMap = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-6',
  };

  const heightClass = heightMap[height] || heightMap.md;

  return (
    <div ref={ref} className={cn('w-full', className)} {...props}>
      {/* Labels */}
      {showLabels && (
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-ai" />
            <span className="text-sm font-mono text-ai">{Math.round(normalizedAi)}%</span>
            <span className="text-xs text-text-muted">AI</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">Human</span>
            <span className="text-sm font-mono text-human">{Math.round(normalizedHuman)}%</span>
            <span className="w-3 h-3 rounded-full bg-human" />
          </div>
        </div>
      )}

      {/* War Bar */}
      <div
        className={cn(
          'relative w-full rounded-full overflow-hidden',
          heightClass
        )}
        style={{
          background: `linear-gradient(to right, #00D4FF 0%, #00D4FF 50%, #FF2E63 50%, #FF2E63 100%)`,
          backgroundSize: '200% 100%',
          backgroundPosition: `${backgroundPosition}% 0`,
          transition: animated ? 'background-position 800ms cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
        }}
        role="progressbar"
        aria-valuenow={normalizedHuman}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Human vs AI recruitment status"
      >
        {/* Battle line divider */}
        {showDivider && (
          <div
            className="absolute top-0 bottom-0 w-0.5"
            style={{
              left: `${normalizedAi}%`,
              transform: 'translateX(-50%)',
              background: 'linear-gradient(to bottom, rgba(0, 212, 255, 0.6), white, rgba(255, 46, 99, 0.6))',
              boxShadow: '-4px 0 8px rgba(0, 212, 255, 0.4), 4px 0 8px rgba(255, 46, 99, 0.4), 0 0 12px white',
              transition: animated ? 'left 800ms cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
            }}
          />
        )}
      </div>
    </div>
  );
});

WarStatusBar.displayName = 'WarStatusBar';

/**
 * ProgressSteps - Step-based progress indicator
 */
export const ProgressSteps = ({
  steps = [],
  currentStep = 0,
  variant = 'default',
  className,
  ...props
}) => {
  const variantColors = {
    default: { 
      active: 'bg-brand text-white', 
      complete: 'bg-brand text-white', 
      pending: 'bg-arena-elevated text-text-muted border border-arena-border' 
    },
    human: { 
      active: 'bg-human text-white shadow-glow-human', 
      complete: 'bg-human text-white', 
      pending: 'bg-human/20 text-human/50' 
    },
    ai: { 
      active: 'bg-ai text-arena-black shadow-glow-ai', 
      complete: 'bg-ai text-arena-black', 
      pending: 'bg-ai/20 text-ai/50' 
    },
    accent: { 
      active: 'bg-brand text-white shadow-glow-brand', 
      complete: 'bg-brand text-white', 
      pending: 'bg-brand/20 text-brand/50' 
    },
  };

  const colors = variantColors[variant] || variantColors.default;

  return (
    <div className={cn('flex items-center', className)} {...props}>
      {steps.map((step, index) => {
        const isComplete = index < currentStep;
        const isActive = index === currentStep;
        const isPending = index > currentStep;

        return (
          <div key={step.id || index} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200',
                  isComplete && colors.complete,
                  isActive && cn(colors.active, 'ring-4 ring-offset-2 ring-offset-arena-black ring-brand/20'),
                  isPending && colors.pending
                )}
              >
                {isComplete ? '✓' : index + 1}
              </div>
              {step.label && (
                <span className={cn(
                  'mt-2 text-xs font-medium whitespace-nowrap',
                  isActive ? 'text-white' : 'text-text-muted'
                )}>
                  {step.label}
                </span>
              )}
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'w-12 h-0.5 mx-2 transition-colors duration-200',
                  isComplete ? colors.complete.split(' ')[0] : 'bg-arena-border'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

ProgressSteps.displayName = 'ProgressSteps';

export default Progress;
