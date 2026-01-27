/**
 * StatCard Component
 * 
 * Engaging metric card with count-up animation triggered by Intersection Observer.
 * Uses semantic design tokens for theming support.
 * 
 * Features:
 * - Count-up animation on scroll into view (800ms ease-out)
 * - Respects prefers-reduced-motion
 * - Optional trend indicator
 * - Icon support with brand accent
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
 * Trend indicator component
 */
const TrendIndicator = memo(function TrendIndicator({ value, label }) {
  if (!value) return null;
  
  const isPositive = value > 0;
  const isNegative = value < 0;
  
  return (
    <div 
      className={cn(
        'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
        isPositive && 'bg-[var(--status-success-subtle)] text-[var(--status-success)]',
        isNegative && 'bg-[var(--status-danger-subtle)] text-[var(--status-danger)]',
        !isPositive && !isNegative && 'bg-[var(--surface-secondary)] text-[var(--text-secondary)]'
      )}
    >
      <span>{isPositive ? '↑' : isNegative ? '↓' : '–'}</span>
      <span>{Math.abs(value)}</span>
      {label && <span className="text-[var(--text-secondary)]">{label}</span>}
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

export default StatCard;
