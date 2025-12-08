/**
 * Countdown Component
 * A themed countdown timer with allegiance-aware styling.
 * Dark Mode Cyber Arena Theme
 * 
 * Features:
 * - Huge JetBrains Mono numerals
 * - Seconds digit changes color based on user allegiance
 * - Radial pulse animation on every tick
 * 
 * @example
 * <Countdown targetDate="2024-12-31T23:59:59" allegiance="human" />
 * <Countdown hours={2} minutes={30} seconds={0} />
 */

import { useState, useEffect, forwardRef, useCallback } from 'react';
import { cn } from '../../lib/design-system';

/**
 * @typedef {Object} CountdownProps
 * @property {Date | string} [targetDate] - Target date/time for countdown
 * @property {number} [hours] - Static hours (if no targetDate)
 * @property {number} [minutes] - Static minutes (if no targetDate)
 * @property {number} [seconds] - Static seconds (if no targetDate)
 * @property {'ai' | 'human' | 'neutral'} [allegiance='neutral'] - User's allegiance for color
 * @property {'sm' | 'md' | 'lg' | 'xl'} [size='lg']
 * @property {boolean} [showLabels=true]
 * @property {boolean} [showDays=true]
 * @property {boolean} [showPulse=true] - Enable pulse animation on tick
 * @property {() => void} [onComplete]
 * @property {string} [className]
 */

const SIZE_CONFIG = {
  sm: {
    digit: 'text-2xl sm:text-3xl',
    seconds: 'text-3xl sm:text-4xl',
    label: 'text-[10px]',
    separator: 'text-xl sm:text-2xl',
    padding: 'px-2 py-1',
    gap: 'gap-1 sm:gap-2',
  },
  md: {
    digit: 'text-4xl sm:text-5xl',
    seconds: 'text-5xl sm:text-6xl',
    label: 'text-xs',
    separator: 'text-3xl sm:text-4xl',
    padding: 'px-3 py-2',
    gap: 'gap-2 sm:gap-3',
  },
  lg: {
    digit: 'text-5xl sm:text-7xl',
    seconds: 'text-6xl sm:text-8xl',
    label: 'text-sm',
    separator: 'text-4xl sm:text-6xl',
    padding: 'px-4 py-3',
    gap: 'gap-2 sm:gap-4',
  },
  xl: {
    digit: 'text-7xl sm:text-9xl',
    seconds: 'text-8xl sm:text-[10rem]',
    label: 'text-base',
    separator: 'text-6xl sm:text-8xl',
    padding: 'px-6 py-4',
    gap: 'gap-3 sm:gap-6',
  },
};

// Calculate time remaining from target date
const calculateTimeLeft = (targetDate) => {
  const now = new Date().getTime();
  const target = new Date(targetDate).getTime();
  const difference = target - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, complete: true };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
    complete: false,
  };
};

// Format number to always show 2 digits
const pad = (num) => String(num).padStart(2, '0');

/**
 * DigitDisplay - Individual digit display
 */
const DigitDisplay = ({ value, label, isSeconds, allegiance, size, isPulsing }) => {
  const sizeConfig = SIZE_CONFIG[size];
  const paddedValue = pad(value);

  // Get color for seconds based on allegiance
  const getSecondsColor = () => {
    if (allegiance === 'ai') return 'text-ai';
    if (allegiance === 'human') return 'text-human';
    return 'text-brand';
  };

  // Get glow for seconds
  const getSecondsGlow = () => {
    if (allegiance === 'ai') return '0 0 30px rgba(0, 212, 255, 0.5)';
    if (allegiance === 'human') return '0 0 30px rgba(255, 46, 99, 0.5)';
    return '0 0 30px rgba(255, 87, 34, 0.4)';
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          'relative flex items-center justify-center',
          'bg-arena-card border border-arena-border rounded-lg',
          sizeConfig.padding,
          isPulsing && 'animate-countdown-pulse'
        )}
      >
        <span
          className={cn(
            'font-mono font-bold tracking-tight',
            isSeconds ? sizeConfig.seconds : sizeConfig.digit,
            isSeconds ? getSecondsColor() : 'text-white',
            'transition-colors duration-150'
          )}
          style={{
            fontVariantNumeric: 'tabular-nums',
            textShadow: isSeconds ? getSecondsGlow() : 'none',
          }}
        >
          {paddedValue}
        </span>
      </div>
      {label && (
        <span className={cn(
          'mt-2 text-text-muted font-mono uppercase tracking-widest',
          sizeConfig.label
        )}>
          {label}
        </span>
      )}
    </div>
  );
};

/**
 * Separator - Colon separator between time units
 */
const Separator = ({ size }) => {
  const sizeConfig = SIZE_CONFIG[size];

  return (
    <span className={cn(
      'text-text-muted font-mono font-bold mx-1 self-start mt-2',
      sizeConfig.separator
    )}>
      :
    </span>
  );
};

const Countdown = forwardRef(({
  targetDate,
  hours: staticHours,
  minutes: staticMinutes,
  seconds: staticSeconds,
  allegiance = 'neutral',
  size = 'lg',
  showLabels = true,
  showDays = true,
  showPulse = true,
  onComplete,
  className,
  ...props
}, ref) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    if (targetDate) {
      return calculateTimeLeft(targetDate);
    }
    return {
      days: 0,
      hours: staticHours || 0,
      minutes: staticMinutes || 0,
      seconds: staticSeconds || 0,
      complete: false,
    };
  });

  const [isPulsing, setIsPulsing] = useState(false);
  const sizeConfig = SIZE_CONFIG[size];

  // Trigger pulse animation
  const triggerPulse = useCallback(() => {
    if (!showPulse) return;
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 120);
  }, [showPulse]);

  // Update countdown every second if we have a target date
  useEffect(() => {
    if (!targetDate) return;

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(targetDate);
      setTimeLeft(prev => {
        // Trigger pulse on seconds change
        if (prev.seconds !== newTimeLeft.seconds) {
          triggerPulse();
        }
        return newTimeLeft;
      });

      if (newTimeLeft.complete && onComplete) {
        onComplete();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete, triggerPulse]);

  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-start',
        sizeConfig.gap,
        className
      )}
      role="timer"
      aria-label="Countdown timer"
      {...props}
    >
      {/* Days */}
      {showDays && timeLeft.days > 0 && (
        <>
          <DigitDisplay
            value={timeLeft.days}
            label={showLabels ? 'Days' : undefined}
            allegiance={allegiance}
            size={size}
          />
          <Separator size={size} />
        </>
      )}

      {/* Hours */}
      <DigitDisplay
        value={timeLeft.hours}
        label={showLabels ? 'Hours' : undefined}
        allegiance={allegiance}
        size={size}
      />
      <Separator size={size} />

      {/* Minutes */}
      <DigitDisplay
        value={timeLeft.minutes}
        label={showLabels ? 'Min' : undefined}
        allegiance={allegiance}
        size={size}
      />
      <Separator size={size} />

      {/* Seconds - Special styling */}
      <DigitDisplay
        value={timeLeft.seconds}
        label={showLabels ? 'Sec' : undefined}
        isSeconds={true}
        allegiance={allegiance}
        size={size}
        isPulsing={isPulsing}
      />
    </div>
  );
});

Countdown.displayName = 'Countdown';

/**
 * CompactCountdown - Smaller inline countdown for headers/cards
 */
export const CompactCountdown = forwardRef(({
  targetDate,
  allegiance = 'neutral',
  showDays = true,
  className,
  ...props
}, ref) => {
  const [timeLeft, setTimeLeft] = useState(() => 
    targetDate ? calculateTimeLeft(targetDate) : { days: 0, hours: 0, minutes: 0, seconds: 0 }
  );

  useEffect(() => {
    if (!targetDate) return;
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  // Get seconds color based on allegiance
  const secondsColor = allegiance === 'ai' 
    ? 'text-ai' 
    : allegiance === 'human' 
      ? 'text-human' 
      : 'text-brand';

  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center px-3 py-1.5 text-sm font-mono font-bold',
        'bg-arena-card border border-arena-border rounded-lg',
        'text-white',
        className
      )}
      role="timer"
      {...props}
    >
      {showDays && timeLeft.days > 0 && (
        <span className="mr-1">{timeLeft.days}d</span>
      )}
      <span>{pad(timeLeft.hours)}</span>
      <span className="text-text-muted mx-0.5">:</span>
      <span>{pad(timeLeft.minutes)}</span>
      <span className="text-text-muted mx-0.5">:</span>
      <span className={secondsColor}>{pad(timeLeft.seconds)}</span>
    </span>
  );
});

CompactCountdown.displayName = 'CompactCountdown';

/**
 * MiniCountdown - Tiny countdown for badges/inline
 */
export const MiniCountdown = forwardRef(({
  targetDate,
  allegiance = 'neutral',
  className,
  ...props
}, ref) => {
  const [timeLeft, setTimeLeft] = useState(() => 
    targetDate ? calculateTimeLeft(targetDate) : { hours: 0, minutes: 0, seconds: 0 }
  );

  useEffect(() => {
    if (!targetDate) return;
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const secondsColor = allegiance === 'ai' ? 'text-ai' : allegiance === 'human' ? 'text-human' : 'text-brand';

  return (
    <span
      ref={ref}
      className={cn('font-mono text-xs', className)}
      {...props}
    >
      {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:<span className={secondsColor}>{pad(timeLeft.seconds)}</span>
    </span>
  );
});

MiniCountdown.displayName = 'MiniCountdown';

export default Countdown;
