/**
 * Progress Component
 * Display progress indicators as bars or circular displays.
 * 
 * @example
 * <Progress value={75} />
 * <Progress value={50} variant="human" showLabel />
 * <CircularProgress value={80} size="lg" />
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
  default: 'bg-neutral-900',
  human: 'bg-human-500',
  ai: 'bg-ai-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error: 'bg-error-500',
  accent: 'bg-accent-500',
};

const TRACK_COLORS = {
  default: 'bg-neutral-200',
  human: 'bg-human-100',
  ai: 'bg-ai-100',
  success: 'bg-success-100',
  warning: 'bg-warning-100',
  error: 'bg-error-100',
  accent: 'bg-accent-100',
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

  // Determine border radius based on variant/allegiance
  const radiusClass = variant === 'ai' 
    ? 'rounded-sm' 
    : variant === 'human' 
      ? 'rounded-full' 
      : 'rounded-full';

  return (
    <div ref={ref} className={cn('w-full', className)} {...props}>
      {/* Label Row */}
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1">
          {label && (
            <span className="text-sm font-medium text-neutral-700">{label}</span>
          )}
          {showLabel && (
            <span className="text-sm font-mono text-neutral-500">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      {/* Progress Track */}
      <div
        className={cn(
          'w-full overflow-hidden',
          trackColor,
          sizeClass,
          radiusClass
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        {/* Progress Bar */}
        <div
          className={cn(
            'h-full',
            barColor,
            radiusClass,
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
    default: '#111827',
    human: '#22c55e',
    ai: '#06b6d4',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    accent: '#f59e0b',
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
          stroke="#e5e7eb"
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
        <span className="absolute text-sm font-bold text-neutral-700">
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
    default: { active: 'bg-neutral-900 text-white', complete: 'bg-neutral-900 text-white', pending: 'bg-neutral-200 text-neutral-500' },
    human: { active: 'bg-human-500 text-white', complete: 'bg-human-500 text-white', pending: 'bg-human-100 text-human-500' },
    ai: { active: 'bg-ai-500 text-white', complete: 'bg-ai-500 text-white', pending: 'bg-ai-100 text-ai-500' },
    accent: { active: 'bg-accent-500 text-white', complete: 'bg-accent-500 text-white', pending: 'bg-accent-100 text-accent-600' },
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
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                  isComplete && colors.complete,
                  isActive && cn(colors.active, 'ring-4 ring-offset-2 ring-neutral-900/20'),
                  isPending && colors.pending
                )}
              >
                {isComplete ? '✓' : index + 1}
              </div>
              {step.label && (
                <span className={cn(
                  'mt-2 text-xs font-medium whitespace-nowrap',
                  isActive ? 'text-neutral-900' : 'text-neutral-500'
                )}>
                  {step.label}
                </span>
              )}
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'w-12 h-0.5 mx-2',
                  isComplete ? colors.complete.split(' ')[0] : 'bg-neutral-200'
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

