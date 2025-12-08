/**
 * Button Component
 * A versatile button with multiple variants, sizes, and allegiance-aware styling.
 * Dark Mode Cyber Arena Theme
 * 
 * @example
 * <Button variant="primary" size="md">Click Me</Button>
 * <Button variant="human" leftIcon={<Heart />}>Human Side</Button>
 * <Button variant="ai" rightIcon={<Cpu />} loading>Processing</Button>
 */

import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn, SIZE_CLASSES, BUTTON_VARIANTS } from '../../lib/design-system';

/**
 * @typedef {Object} ButtonProps
 * @property {'primary' | 'secondary' | 'ghost' | 'danger' | 'human' | 'human-ghost' | 'ai' | 'ai-ghost' | 'accent'} [variant='primary']
 * @property {'xs' | 'sm' | 'md' | 'lg' | 'xl'} [size='md']
 * @property {React.ReactNode} [leftIcon]
 * @property {React.ReactNode} [rightIcon]
 * @property {boolean} [loading=false]
 * @property {boolean} [disabled=false]
 * @property {boolean} [fullWidth=false]
 * @property {boolean} [glow=false] - Enable glow effect on hover
 * @property {'button' | 'submit' | 'reset'} [type='button']
 * @property {string} [className]
 * @property {React.ReactNode} children
 */

const Button = forwardRef(({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  loading = false,
  disabled = false,
  fullWidth = false,
  glow = false,
  type = 'button',
  className,
  children,
  ...props
}, ref) => {
  const variantStyles = BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.primary;
  const sizeStyles = SIZE_CLASSES.button[size] || SIZE_CLASSES.button.md;
  const iconSize = SIZE_CLASSES.icon[size] || SIZE_CLASSES.icon.md;

  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={cn(
        // Base styles
        'inline-flex items-center justify-center font-bold transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-arena-black',
        'rounded-card',
        // Size
        sizeStyles,
        // Variant
        variantStyles.base,
        !isDisabled && variantStyles.hover,
        !isDisabled && variantStyles.active,
        variantStyles.focus,
        // States
        isDisabled && 'opacity-50 cursor-not-allowed',
        fullWidth && 'w-full',
        // Extra glow on hover
        glow && !isDisabled && 'hover:shadow-glow-brand',
        // Custom
        className
      )}
      {...props}
    >
      {/* Loading Spinner */}
      {loading && (
        <Loader2 className={cn(iconSize, 'animate-spin', children && 'mr-2')} />
      )}
      
      {/* Left Icon */}
      {!loading && leftIcon && (
        <span className={cn(iconSize, 'flex-shrink-0')}>
          {leftIcon}
        </span>
      )}
      
      {/* Button Text */}
      {children && <span>{children}</span>}
      
      {/* Right Icon */}
      {!loading && rightIcon && (
        <span className={cn(iconSize, 'flex-shrink-0')}>
          {rightIcon}
        </span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

/**
 * IconButton - Button variant for icon-only buttons
 */
export const IconButton = forwardRef(({
  variant = 'ghost',
  size = 'md',
  icon,
  label,
  loading = false,
  disabled = false,
  className,
  ...props
}, ref) => {
  const variantStyles = BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.ghost;
  const iconSize = SIZE_CLASSES.icon[size] || SIZE_CLASSES.icon.md;
  
  const sizeMap = {
    xs: 'p-1',
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
    xl: 'p-3',
  };
  
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type="button"
      disabled={isDisabled}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex items-center justify-center transition-all duration-200 rounded-card',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-arena-black',
        sizeMap[size],
        variantStyles.base,
        !isDisabled && variantStyles.hover,
        !isDisabled && variantStyles.active,
        variantStyles.focus,
        isDisabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className={cn(iconSize, 'animate-spin')} />
      ) : (
        <span className={iconSize}>{icon}</span>
      )}
    </button>
  );
});

IconButton.displayName = 'IconButton';

/**
 * ButtonGroup - Container for grouping buttons
 */
export const ButtonGroup = ({ children, className, ...props }) => {
  return (
    <div 
      className={cn('inline-flex', className)} 
      role="group"
      {...props}
    >
      {children}
    </div>
  );
};

ButtonGroup.displayName = 'ButtonGroup';

/**
 * FillButton - Button with fill animation (for "Request to Join" etc.)
 */
export const FillButton = forwardRef(({
  variant = 'human',
  size = 'md',
  children,
  className,
  ...props
}, ref) => {
  const sizeStyles = SIZE_CLASSES.button[size] || SIZE_CLASSES.button.md;
  
  // Determine fill color based on variant
  const fillColor = variant === 'ai' ? 'bg-ai' : 'bg-human';
  const textColor = variant === 'ai' ? 'text-ai' : 'text-human';
  const borderColor = variant === 'ai' ? 'border-ai' : 'border-human';
  const glowClass = variant === 'ai' ? 'hover:shadow-glow-ai' : 'hover:shadow-glow-human';

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'group relative inline-flex items-center justify-center font-bold',
        'transition-all duration-200 overflow-hidden rounded-card',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-arena-black',
        'bg-transparent border-2',
        textColor,
        borderColor,
        glowClass,
        sizeStyles,
        className
      )}
      {...props}
    >
      {/* Fill overlay - scales on hover */}
      <span 
        className={cn(
          'absolute inset-0 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300',
          fillColor
        )}
        aria-hidden="true"
      />
      {/* Text - needs to be above fill */}
      <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
        {children}
      </span>
    </button>
  );
});

FillButton.displayName = 'FillButton';

export default Button;
