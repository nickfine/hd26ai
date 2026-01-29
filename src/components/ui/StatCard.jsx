/**
 * StatCard Component
 * 
 * ECD-compliant stat cards with hierarchy through scale.
 * HeroStatCard: Large, prominent countdown or primary metric (3x size)
 * StatCard: Standard metric card with icon
 * MiniStatCard: Compact inline stat for secondary metrics
 * 
 * Features:
 * - Count-up animation on scroll into view (800ms ease-out)
 * - Respects prefers-reduced-motion
 * - Monospace numbers for mission control aesthetic
 * - Clear visual hierarchy through size differentiation
 */

import { useState, useEffect, useRef, memo } from 'react';
import { cn } from '../../lib/design-system';

// Easing function for smooth animation
const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

/**
 * Animated counter hook with Intersection Observer
 */
const useCountUp = (end, duration = 800, enabled = true) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef(null);
  
  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  useEffect(() => {
    if (!enabled || hasAnimated) return;
    
    // If reduced motion, show final number immediately
    if (prefersReducedMotion) {
      setCount(end);
      setHasAnimated(true);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            
            const startTime = performance.now();
            
            const animate = (currentTime) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easedProgress = easeOutQuart(progress);
              
              setCount(Math.floor(easedProgress * end));
              
              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                setCount(end); // Ensure we end on exact number
              }
            };
            
            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.3, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [end, duration, enabled, hasAnimated, prefersReducedMotion]);

  return { count, elementRef, hasAnimated };
};

/**
 * Format large numbers with K/M suffix
 */
const formatNumber = (num, format = 'default') => {
  if (format === 'compact') {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString();
};

/**
 * Trend indicator component - Figma style
 */
const TrendIndicator = memo(function TrendIndicator({ value, label, showPercentage = true }) {
  if (value === undefined || value === null) return null;
  
  const isPositive = value > 0;
  const isNegative = value < 0;
  
  return (
    <div className="flex items-center gap-1 text-sm">
      <span 
        className={cn(
          'font-medium',
          isPositive && 'text-trend-up',
          isNegative && 'text-trend-down',
          !isPositive && !isNegative && 'text-[var(--text-secondary)]'
        )}
      >
        {isPositive ? '↑' : isNegative ? '↓' : '–'}
      </span>
      <span 
        className={cn(
          'font-medium',
          isPositive && 'text-trend-up',
          isNegative && 'text-trend-down',
          !isPositive && !isNegative && 'text-[var(--text-secondary)]'
        )}
      >
        {showPercentage ? `${Math.abs(value)}%` : Math.abs(value)}
      </span>
      {label && (
        <span className="text-[var(--text-muted)]">{label}</span>
      )}
    </div>
  );
});

/**
 * StatCard Component
 */
const StatCard = memo(function StatCard({
  value,
  label,
  icon: Icon,
  trend,
  trendLabel,
  format = 'default',
  className,
  accentColor = 'brand', // 'brand' | 'success' | 'warning' | 'info'
}) {
  const { count, elementRef, hasAnimated } = useCountUp(value);
  
  // Map accent colors to CSS variables
  const accentStyles = {
    brand: {
      iconBg: 'bg-[var(--accent-brand-subtle)]',
      iconColor: 'text-[var(--accent-brand)]',
    },
    success: {
      iconBg: 'bg-[var(--status-success-subtle)]',
      iconColor: 'text-[var(--status-success)]',
    },
    warning: {
      iconBg: 'bg-[var(--status-warning-subtle)]',
      iconColor: 'text-[var(--status-warning)]',
    },
    info: {
      iconBg: 'bg-[var(--status-info-subtle)]',
      iconColor: 'text-[var(--status-info)]',
    },
  };
  
  const accent = accentStyles[accentColor] || accentStyles.brand;

  return (
    <div
      ref={elementRef}
      className={cn(
        'relative p-5 rounded-xl transition-all duration-200',
        'bg-[var(--surface-primary)] border border-[var(--border-default)]',
        'hover:border-[var(--border-subtle)] hover:shadow-lg',
        className
      )}
      style={{
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Label */}
          <p 
            className="text-xs font-medium uppercase tracking-wider mb-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            {label}
          </p>
          
          {/* Value with count-up animation */}
          <div className="flex items-baseline gap-2">
            <span 
              className={cn(
                'text-3xl font-bold tabular-nums tracking-tight transition-opacity duration-300',
                hasAnimated ? 'opacity-100' : 'opacity-0'
              )}
              style={{ 
                color: 'var(--text-primary)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {formatNumber(count, format)}
            </span>
            
            {/* Trend indicator */}
            {trend !== undefined && (
              <TrendIndicator value={trend} label={trendLabel} />
            )}
          </div>
        </div>
        
        {/* Icon */}
        {Icon && (
          <div 
            className={cn(
              'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center',
              accent.iconBg
            )}
          >
            <Icon className={cn('w-6 h-6', accent.iconColor)} />
          </div>
        )}
      </div>
    </div>
  );
});

/**
 * StatCardGroup - Container for multiple stat cards
 */
export const StatCardGroup = memo(function StatCardGroup({ children, className }) {
  return (
    <div 
      className={cn(
        'grid grid-cols-2 sm:grid-cols-4 gap-4',
        className
      )}
    >
      {children}
    </div>
  );
});

/**
 * HeroStatCard - Large, prominent stat card for primary metrics
 * ECD: Creates clear visual hierarchy by being 3x the size of other stats
 * ECD: No decorative icon or sublabel - let the number speak for itself
 */
export const HeroStatCard = memo(function HeroStatCard({
  value,
  label,
  className,
  isUrgent = false,
}) {
  const { count, elementRef, hasAnimated } = useCountUp(
    typeof value === 'number' ? value : 0,
    1200
  );
  
  // For string values (like countdown), display directly
  const displayValue = typeof value === 'string' ? value : formatNumber(count);

  return (
    <div
      ref={elementRef}
      className={cn(
        'relative p-8 rounded-2xl transition-all duration-300',
        'bg-[var(--surface-primary)] border-2 border-t-2 border-t-brand',
        isUrgent 
          ? 'border-[var(--accent-brand)] shadow-lg shadow-[var(--accent-brand)]/10' 
          : 'border-[var(--border-default)]',
        'hover:shadow-xl',
        className
      )}
    >
      <div className="flex flex-col items-center text-center gap-3">
        {/* Value - Large monospace for mission control aesthetic */}
        <div 
          className={cn(
            'text-5xl sm:text-6xl font-black font-mono tracking-tight transition-opacity duration-500',
            hasAnimated || typeof value === 'string' ? 'opacity-100' : 'opacity-0',
            isUrgent ? 'text-[var(--accent-brand)]' : 'text-[var(--text-primary)]'
          )}
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {displayValue}
        </div>
        
        {/* Label */}
        <p 
          className="text-sm font-bold uppercase tracking-wider"
          style={{ color: 'var(--text-secondary)' }}
        >
          {label}
        </p>
      </div>
    </div>
  );
});

/**
 * MiniStatCard - Compact inline stat for secondary metrics
 * ECD: Demoted visual weight for non-primary stats
 */
export const MiniStatCard = memo(function MiniStatCard({
  value,
  label,
  className,
}) {
  const { count, elementRef, hasAnimated } = useCountUp(value, 600);

  return (
    <div
      ref={elementRef}
      className={cn(
        'flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200',
        'bg-[var(--surface-secondary)] border border-[var(--border-subtle)]',
        'hover:bg-[var(--surface-primary)] hover:border-brand/30',
        className
      )}
    >
      {/* Value - Medium monospace */}
      <span 
        className={cn(
          'text-2xl font-bold font-mono tabular-nums transition-opacity duration-300',
          hasAnimated ? 'opacity-100' : 'opacity-0'
        )}
        style={{ 
          color: 'var(--text-primary)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {formatNumber(count)}
      </span>
      
      {/* Label */}
      <span 
        className="text-xs font-medium uppercase tracking-wider mt-1"
        style={{ color: 'var(--text-secondary)' }}
      >
        {label}
      </span>
    </div>
  );
});

/**
 * HeroStatGrid - Asymmetric grid for hero + mini stats
 * ECD: Clear hierarchy with 1 large card + 4 small cards
 */
export const HeroStatGrid = memo(function HeroStatGrid({ 
  heroStat,
  miniStats = [],
  className,
}) {
  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)}>
      {/* Hero stat takes 2 columns on mobile, 2 columns + 2 rows on desktop */}
      <div className="col-span-2 md:row-span-2">
        {heroStat}
      </div>
      
      {/* Mini stats fill remaining space */}
      {miniStats.map((stat, index) => (
        <div key={stat.key || index}>
          {stat}
        </div>
      ))}
    </div>
  );
});

/**
 * FigmaMetricsCard - Figma-style metrics card with trend indicator
 * Matches the HD26-New-Design Figma layout
 */
export const FigmaMetricsCard = memo(function FigmaMetricsCard({
  title,
  value,
  subtitle,
  trend,
  trendLabel = 'from last event',
  icon: Icon,
  iconBgClass = 'bg-cyan-accent',
  className,
}) {
  const { count, elementRef, hasAnimated } = useCountUp(value, 800);

  return (
    <div
      ref={elementRef}
      className={cn(
        'relative p-5 rounded-2xl transition-all duration-200',
        'bg-[var(--surface-primary)] border border-[var(--border-default)]',
        'hover:border-[var(--border-subtle)] hover:shadow-lg',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Title - small, muted */}
          <p className="text-xs font-medium uppercase tracking-wider mb-2 text-[var(--text-muted)]">
            {title}
          </p>
          
          {/* Value - large number */}
          <p 
            className={cn(
              'text-4xl font-bold tabular-nums mb-1 transition-opacity duration-300',
              hasAnimated ? 'opacity-100' : 'opacity-0'
            )}
            style={{ color: 'var(--text-primary)' }}
          >
            {formatNumber(count)}
          </p>
          
          {/* Subtitle description */}
          <p className="text-sm text-[var(--text-secondary)] mb-3">
            {subtitle}
          </p>
          
          {/* Trend indicator */}
          {trend !== undefined && (
            <TrendIndicator value={trend} label={trendLabel} />
          )}
        </div>
        
        {/* Icon */}
        {Icon && (
          <div className={cn('flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center', iconBgClass)}>
            <Icon className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
          </div>
        )}
      </div>
    </div>
  );
});

export default StatCard;
