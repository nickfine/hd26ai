/**
 * Progress Component
 * Display progress indicators as bars or circular displays.
 * 
 * @example
 * <Progress value={75} />
 * <Progress value={50} variant="success" showLabel />
 * <CircularProgress value={80} size="lg" />
 */

import { forwardRef } from 'react';
import { cn } from '../../lib/design-system';

/**
 * @typedef {Object} ProgressProps
 * @property {number} value - Progress value (0-100)
 * @property {number} [max=100] - Maximum value
 * @property {'sm' | 'md' | 'lg'} [size='md']
 * @property {'default' | 'success' | 'warning' | 'error'} [variant='default']
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

const VARIANT_STYLES = {
  default: { gradient: false, color: 'bg-arena-elevated' },
  success: { gradient: false, color: 'bg-success' },
  warning: { gradient: false, color: 'bg-warning' },
  error: { gradient: false, color: 'bg-error' },
};

const TRACK_COLORS = {
  default: 'bg-arena-elevated',
  success: 'bg-success/20',
  warning: 'bg-warning/20',
  error: 'bg-error/20',
};

const Progress = forwardRef(({
  value = 0,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  label,
  animated = true,
  glossy = true,
  className,
  ...props
}, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;
  const variantStyle = VARIANT_STYLES[variant] || VARIANT_STYLES.default;
  const trackColor = TRACK_COLORS[variant] || TRACK_COLORS.default;

  // Build bar style - gradient or solid
  const barStyle = variantStyle.gradient
    ? {
        width: `${percentage}%`,
        background: `linear-gradient(90deg, ${variantStyle.from} 0%, ${variantStyle.to} 100%)`,
      }
    : { width: `${percentage}%` };

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
        {/* Progress Bar with optional glossy shine */}
        <div
          className={cn(
            'h-full rounded-full relative overflow-hidden',
            !variantStyle.gradient && variantStyle.color,
            animated && 'transition-all duration-500 ease-out'
          )}
          style={barStyle}
        >
          {/* Glossy shine overlay */}
          {glossy && (
            <div 
              className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10 pointer-events-none"
              aria-hidden="true"
            />
          )}
        </div>
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
    default: '#FF4500',
    human: '#FF4500',           // Brand orange
    ai: '#00E5FF',              // Electric cyan
    success: '#00FF9D',
    warning: '#FF8A00',
    error: '#FF4500',
    accent: '#FF4500',
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
