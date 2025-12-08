/**
 * Badge Component
 * A label component for displaying status, skills, allegiance, and other tags.
 * Dark Mode Cyber Arena Theme
 * 
 * @example
 * <Badge variant="human">Human Side</Badge>
 * <Badge variant="skill" removable onRemove={() => {}}>Frontend</Badge>
 * <Badge variant="success" icon={<Check />}>Complete</Badge>
 */

import { forwardRef } from 'react';
import { X } from 'lucide-react';
import { cn, BADGE_VARIANTS, SIZE_CLASSES } from '../../lib/design-system';

/**
 * @typedef {Object} BadgeProps
 * @property {'default' | 'outline' | 'human' | 'ai' | 'neutral' | 'success' | 'warning' | 'error' | 'accent' | 'special'} [variant='default']
 * @property {'xs' | 'sm' | 'md' | 'lg'} [size='sm']
 * @property {React.ReactNode} [icon]
 * @property {boolean} [removable=false]
 * @property {() => void} [onRemove]
 * @property {boolean} [dot=false]
 * @property {string} [dotColor]
 * @property {boolean} [glow=false] - Enable glow effect
 * @property {string} [className]
 * @property {React.ReactNode} children
 */

const Badge = forwardRef(({
  variant = 'default',
  size = 'sm',
  icon,
  removable = false,
  onRemove,
  dot = false,
  dotColor,
  glow = false,
  className,
  children,
  ...props
}, ref) => {
  const variantStyles = BADGE_VARIANTS[variant] || BADGE_VARIANTS.default;
  const sizeStyles = SIZE_CLASSES.badge[size] || SIZE_CLASSES.badge.sm;

  // Determine dot color based on variant if not explicitly set
  const getDotColor = () => {
    if (dotColor) return dotColor;
    const dotColors = {
      human: 'bg-human',
      ai: 'bg-ai',
      success: 'bg-success',
      warning: 'bg-warning',
      error: 'bg-error',
      accent: 'bg-brand',
      special: 'bg-brand',
      default: 'bg-text-muted',
      outline: 'bg-text-muted',
      neutral: 'bg-text-muted',
    };
    return dotColors[variant] || dotColors.default;
  };

  // Get glow class for badge
  const getGlowClass = () => {
    if (!glow) return '';
    if (variant === 'human') return 'shadow-glow-human';
    if (variant === 'ai') return 'shadow-glow-ai';
    return '';
  };

  return (
    <span
      ref={ref}
      className={cn(
        // Base styles
        'inline-flex items-center gap-1 font-bold rounded-full whitespace-nowrap',
        // Size
        sizeStyles,
        // Variant
        variantStyles,
        // Glow
        getGlowClass(),
        // Custom
        className
      )}
      {...props}
    >
      {/* Status Dot */}
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse', getDotColor())} />
      )}
      
      {/* Icon */}
      {icon && (
        <span className="flex-shrink-0 w-3 h-3">
          {icon}
        </span>
      )}
      
      {/* Badge Text */}
      <span>{children}</span>
      
      {/* Remove Button */}
      {removable && onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="flex-shrink-0 -mr-1 ml-0.5 p-0.5 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Remove"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
});

Badge.displayName = 'Badge';

/**
 * SkillBadge - Specialized badge for displaying skills
 */
export const SkillBadge = forwardRef(({
  skill,
  removable = false,
  onRemove,
  className,
  ...props
}, ref) => {
  return (
    <Badge
      ref={ref}
      variant="default"
      size="sm"
      removable={removable}
      onRemove={onRemove}
      className={cn('bg-arena-elevated text-text-secondary border border-arena-border', className)}
      {...props}
    >
      {skill}
    </Badge>
  );
});

SkillBadge.displayName = 'SkillBadge';

/**
 * AllegianceBadge - Badge showing user's allegiance (Human/AI/Neutral)
 */
export const AllegianceBadge = forwardRef(({
  allegiance = 'neutral',
  showIcon = false,
  size = 'sm',
  glow = false,
  className,
  ...props
}, ref) => {
  const { Heart, Cpu, Scale } = require('lucide-react');
  
  const config = {
    human: {
      variant: 'human',
      label: 'Human',
      Icon: Heart,
    },
    ai: {
      variant: 'ai',
      label: 'AI',
      Icon: Cpu,
    },
    neutral: {
      variant: 'neutral',
      label: 'Neutral',
      Icon: Scale,
    },
  };

  const { variant, label, Icon } = config[allegiance] || config.neutral;

  return (
    <Badge
      ref={ref}
      variant={variant}
      size={size}
      glow={glow}
      icon={showIcon ? <Icon className="w-3 h-3" /> : undefined}
      className={className}
      {...props}
    >
      {label}
    </Badge>
  );
});

AllegianceBadge.displayName = 'AllegianceBadge';

/**
 * StatusBadge - Badge for status indicators
 */
export const StatusBadge = forwardRef(({
  status,
  size = 'sm',
  className,
  ...props
}, ref) => {
  const statusConfig = {
    submitted: { variant: 'success', label: 'Submitted', dot: true },
    in_progress: { variant: 'warning', label: 'In Progress', dot: true },
    not_started: { variant: 'default', label: 'Not Started', dot: true },
    draft: { variant: 'default', label: 'Draft', dot: true },
    approved: { variant: 'success', label: 'Approved', dot: true },
    rejected: { variant: 'error', label: 'Rejected', dot: true },
    pending: { variant: 'warning', label: 'Pending', dot: true },
    live: { variant: 'success', label: 'Live', dot: true },
  };

  const config = statusConfig[status] || { variant: 'default', label: status, dot: false };

  return (
    <Badge
      ref={ref}
      variant={config.variant}
      size={size}
      dot={config.dot}
      className={className}
      {...props}
    >
      {config.label}
    </Badge>
  );
});

StatusBadge.displayName = 'StatusBadge';

/**
 * RoleBadge - Badge for user roles (Participant, Judge, Admin, etc.)
 */
export const RoleBadge = forwardRef(({
  role,
  size = 'sm',
  className,
  ...props
}, ref) => {
  const roleConfig = {
    participant: { variant: 'default', label: 'Participant' },
    ambassador: { variant: 'success', label: 'Ambassador' },
    judge: { variant: 'accent', label: 'Judge' },
    admin: { variant: 'special', label: 'Admin' },
  };

  const config = roleConfig[role] || roleConfig.participant;

  return (
    <Badge
      ref={ref}
      variant={config.variant}
      size={size}
      className={cn('font-bold', className)}
      {...props}
    >
      {config.label}
    </Badge>
  );
});

RoleBadge.displayName = 'RoleBadge';

/**
 * CountBadge - Numeric badge for counts (notifications, etc.)
 */
export const CountBadge = forwardRef(({
  count,
  max = 99,
  variant = 'error',
  className,
  ...props
}, ref) => {
  const displayCount = count > max ? `${max}+` : count;

  if (count <= 0) return null;

  return (
    <Badge
      ref={ref}
      variant={variant}
      size="xs"
      className={cn('min-w-[1.25rem] justify-center', className)}
      {...props}
    >
      {displayCount}
    </Badge>
  );
});

CountBadge.displayName = 'CountBadge';

/**
 * LiveBadge - Pulsing live indicator badge
 */
export const LiveBadge = forwardRef(({
  className,
  children = 'LIVE',
  ...props
}, ref) => {
  return (
    <Badge
      ref={ref}
      variant="error"
      size="xs"
      className={cn('uppercase tracking-wider', className)}
      {...props}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse mr-1" />
      {children}
    </Badge>
  );
});

LiveBadge.displayName = 'LiveBadge';

export default Badge;
