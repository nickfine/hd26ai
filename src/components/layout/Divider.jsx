/**
 * Divider Component
 * A visual separator for content sections.
 * 
 * @example
 * <Divider />
 * <Divider orientation="vertical" />
 * <Divider label="OR" />
 */

import { forwardRef } from 'react';
import { cn } from '../../lib/design-system';

/**
 * @typedef {Object} DividerProps
 * @property {'horizontal' | 'vertical'} [orientation='horizontal']
 * @property {'light' | 'default' | 'strong'} [variant='default']
 * @property {string} [label]
 * @property {'sm' | 'md' | 'lg'} [spacing='md']
 * @property {string} [className]
 */

const Divider = forwardRef(({
  orientation = 'horizontal',
  variant = 'default',
  glow = false,
  label,
  spacing = 'md',
  className,
  ...props
}, ref) => {
  const isVertical = orientation === 'vertical';

  const variantStyles = {
    light: 'border-arena-border',
    default: 'border-arena-border-strong',
    strong: 'border-text-muted',
    glow: 'border-[rgba(255,107,53,0.15)]',
  };

  const spacingStyles = {
    sm: isVertical ? 'mx-2' : 'my-2',
    md: isVertical ? 'mx-4' : 'my-4',
    lg: isVertical ? 'mx-6' : 'my-6',
  };

  const glowStyles = glow ? 'divider-glow' : '';

  // Divider with label
  if (label) {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center',
          spacingStyles[spacing],
          className
        )}
        {...props}
      >
        <div className={cn(
          'flex-1 border-t',
          variantStyles[variant],
          glowStyles
        )} />
        <span className="px-4 text-sm text-text-muted font-medium">
          {label}
        </span>
        <div className={cn(
          'flex-1 border-t',
          variantStyles[variant],
          glowStyles
        )} />
      </div>
    );
  }

  // Simple divider
  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      className={cn(
        isVertical
          ? cn('h-full border-l', variantStyles[variant])
          : cn('w-full border-t', variantStyles[variant]),
        spacingStyles[spacing],
        glowStyles,
        className
      )}
      {...props}
    />
  );
});

Divider.displayName = 'Divider';

export default Divider;


