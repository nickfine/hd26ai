/**
 * Countdown Component
 * A countdown timer component.
 * Dark Mode Cyber Arena Theme
 * 
 * Features:
 * - Huge JetBrains Mono numerals
 * - Seconds digit with neutral styling
 * - Radial pulse animation on every tick
 * 
 * @example
 * <Countdown targetDate="2024-12-31T23:59:59" />
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
  // Hero size - Signature statement piece (120px on desktop)
  hero: {
    digit: 'text-6xl sm:text-8xl md:text-[100px] lg:text-[120px]',
    seconds: 'text-7xl sm:text-9xl md:text-[110px] lg:text-[130px]',
    label: 'text-sm sm:text-base',
    separator: 'text-5xl sm:text-7xl md:text-8xl',
    padding: 'px-4 sm:px-6 md:px-8 py-4 sm:py-6',
    gap: 'gap-2 sm:gap-4 md:gap-6',
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
 * DigitDisplay - Individual digit display with premium styling
 * White numbers with soft orange glow (scales better on retina than hard stroke)
 */
const DigitDisplay = ({ value, label, isSeconds, size, isPulsing, heroMode }) => {
  const sizeConfig = SIZE_CONFIG[size];
  const paddedValue = pad(value);
  const isHeroSize = size === 'hero';

  // Get soft glow for seconds (neutral)
  const getSecondsGlow = () => {
    return '0 0 20px rgba(255, 69, 0, 0.5), 0 0 40px rgba(255, 69, 0, 0.25)';
  };

  // Hero mode gets white numbers with orange glow + letter spacing
  const getHeroStyle = () => {
    if (!heroMode && !isHeroSize) return {};
    return {
      textShadow: '0 0.5px 0 rgba(255, 107, 53, 0.8), 0 0 30px rgba(255, 69, 0, 0.5), 0 0 60px rgba(255, 69, 0, 0.3)',
      letterSpacing: '-0.02em',
    };
  };

  // Glitch effect styles for seconds digit
  const getGlitchStyles = () => {
    if (!isSeconds || (!heroMode && !isHeroSize)) return '';
    return 'countdown-glitch';
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          'relative flex items-center justify-center overflow-hidden',
          (heroMode || isHeroSize) ? 'glass-card grain-overlay countdown-gradient-sweep' : 'bg-arena-card border border-arena-border',
          'rounded-card',
          sizeConfig.padding,
          isPulsing && 'animate-countdown-pulse'
        )}
        style={(heroMode || isHeroSize) ? {
          background: 'radial-gradient(ellipse at center, rgba(255, 69, 0, 0.12) 0%, rgba(20, 22, 28, 0.45) 70%)',
        } : {}}
      >
        {/* Gradient sweep overlay for hero mode */}
        {(heroMode || isHeroSize) && (
          <div 
            className="absolute inset-0 pointer-events-none countdown-sweep-overlay"
            aria-hidden="true"
          />
        )}
        <span
          className={cn(
            'font-mono relative z-10',
            (heroMode || isHeroSize) ? 'font-black tracking-tighter' : 'font-bold tracking-tight',
            isSeconds ? sizeConfig.seconds : sizeConfig.digit,
            'text-text-primary',
            'transition-all duration-150',
            getGlitchStyles()
          )}
          style={{
            fontVariantNumeric: 'tabular-nums',
            textShadow: isSeconds ? getSecondsGlow() : ((heroMode || isHeroSize) ? getHeroStyle().textShadow : 'none'),
            ...((heroMode || isHeroSize) && !isSeconds ? getHeroStyle() : {}),
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
  size = 'lg',
  showLabels = true,
  showDays = true,
  showPulse = true,
  heroMode = false,   // Enable premium hero styling with grain + radial gradient
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
            size={size}
            heroMode={heroMode}
          />
          <Separator size={size} />
        </>
      )}

      {/* Hours */}
      <DigitDisplay
        value={timeLeft.hours}
        label={showLabels ? 'Hours' : undefined}
        size={size}
        heroMode={heroMode}
      />
      <Separator size={size} />

      {/* Minutes */}
      <DigitDisplay
        value={timeLeft.minutes}
        label={showLabels ? 'Min' : undefined}
        size={size}
        heroMode={heroMode}
      />
      <Separator size={size} />

      {/* Seconds - Special styling */}
      <DigitDisplay
        value={timeLeft.seconds}
        label={showLabels ? 'Sec' : undefined}
        isSeconds={true}
        size={size}
        isPulsing={isPulsing}
        heroMode={heroMode}
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

  // Neutral seconds color
  const secondsColor = 'text-text-secondary';

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

  const secondsColor = 'text-text-secondary';

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
