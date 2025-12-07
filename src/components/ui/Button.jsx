/**
 * Button Component
 * A versatile button with multiple variants, sizes, and allegiance-aware styling.
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
 * @property {'primary' | 'secondary' | 'ghost' | 'danger' | 'human' | 'ai' | 'accent'} [variant='primary']
 * @property {'xs' | 'sm' | 'md' | 'lg' | 'xl'} [size='md']
 * @property {React.ReactNode} [leftIcon]
 * @property {React.ReactNode} [rightIcon]
 * @property {boolean} [loading=false]
 * @property {boolean} [disabled=false]
 * @property {boolean} [fullWidth=false]
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
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
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
        'inline-flex items-center justify-center transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
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

export default Button;

