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
  label,
  spacing = 'md',
  className,
  ...props
}, ref) => {
  const isVertical = orientation === 'vertical';

  const variantStyles = {
    light: 'border-neutral-100',
    default: 'border-neutral-200',
    strong: 'border-neutral-900',
  };

  const spacingStyles = {
    sm: isVertical ? 'mx-2' : 'my-2',
    md: isVertical ? 'mx-4' : 'my-4',
    lg: isVertical ? 'mx-6' : 'my-6',
  };

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
          variantStyles[variant]
        )} />
        <span className="px-4 text-sm text-neutral-400 font-medium">
          {label}
        </span>
        <div className={cn(
          'flex-1 border-t',
          variantStyles[variant]
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
        className
      )}
      {...props}
    />
  );
});

Divider.displayName = 'Divider';

export default Divider;

