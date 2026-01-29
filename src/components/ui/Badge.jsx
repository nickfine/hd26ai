/**
 * Badge Component
 * A label component for displaying status, skills, and other tags.
 * 
 * @example
 * <Badge variant="default">Status</Badge>
 * <Badge variant="success" icon={<Check />}>Complete</Badge>
 */

import { forwardRef } from 'react';
import { X } from 'lucide-react';
import { cn, BADGE_VARIANTS, SIZE_CLASSES, getSkillClasses, getSkillConfig } from '../../lib/design-system';

/**
 * @typedef {Object} BadgeProps
 * @property {'default' | 'outline' | 'neutral' | 'success' | 'warning' | 'error'} [variant='default']
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
      success: 'bg-success',
      warning: 'bg-warning',
      error: 'bg-error',
      default: 'bg-text-muted',
      outline: 'bg-text-muted',
      neutral: 'bg-text-muted',
    };
    return dotColors[variant] || dotColors.default;
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

// =============================================================================
// NEW BADGE SYSTEM - Capsules, Chips, and Status Indicators
// =============================================================================

/**
 * HeartbeatDot - Smooth dual-layer pulsing indicator
 * Uses animate-ping for a "heartbeat" effect
 */
export const HeartbeatDot = forwardRef(({
  className,
  ...props
}, ref) => {
  return (
    <span ref={ref} className={cn('relative flex h-2 w-2', className)} {...props}>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
    </span>
  );
});

HeartbeatDot.displayName = 'HeartbeatDot';

/**
 * StatusDot - ECD semantic status indicator
 * Three states: success (green pulse), warning (amber), neutral (gray)
 * 
 * @example
 * <StatusDot status="live" />     // Green with pulse
 * <StatusDot status="warning" />  // Amber, static
 * <StatusDot status="neutral" />  // Gray, static
 */
export const StatusDot = forwardRef(({
  status = 'neutral', // 'live' | 'success' | 'warning' | 'neutral'
  size = 'md', // 'sm' | 'md' | 'lg'
  className,
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-2.5 w-2.5',
  };
  
  const statusConfig = {
    live: {
      color: 'bg-[var(--status-success)]',
      pulse: true,
    },
    success: {
      color: 'bg-[var(--status-success)]',
      pulse: false,
    },
    warning: {
      color: 'bg-[var(--status-warning)]',
      pulse: false,
    },
    neutral: {
      color: 'bg-[var(--text-disabled)]',
      pulse: false,
    },
  };
  
  const config = statusConfig[status] || statusConfig.neutral;
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  
  if (config.pulse) {
    return (
      <span ref={ref} className={cn('relative flex', sizeClass, className)} {...props}>
        <span className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-75', config.color)} />
        <span className={cn('relative inline-flex rounded-full', sizeClass, config.color)} />
      </span>
    );
  }
  
  return (
    <span
      ref={ref}
      className={cn('inline-flex rounded-full', sizeClass, config.color, className)}
      {...props}
    />
  );
});

StatusDot.displayName = 'StatusDot';

/**
 * UserCapsule - User name display with callsign
 * 
 * @example
 * <UserCapsule 
 *   firstName="Casey" 
 *   callsign="CSS Wizard" 
 *   lastName="Brooks"
 *   showDot
 * />
 */
export const UserCapsule = forwardRef(({
  firstName,
  callsign,
  lastName,
  fullName, // Alternative: pass full formatted name
  showDot = true,
  showIcon = false,
  isElite = false, // Show level-up arrow for rare/elite callsigns
  className,
  children,
  ...props
}, ref) => {
  const bgClass = 'bg-arena-elevated';
  const borderClass = 'border-arena-border';
  const textClass = 'text-text-secondary';

  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full',
        'text-xs font-medium tracking-wider',
        'border',
        bgClass,
        borderClass,
        'text-white',
        className
      )}
      {...props}
    >
      {/* Heartbeat dot */}
      {showDot && (
        <HeartbeatDot className={textClass} />
      )}
      
      {/* Name with callsign */}
      {children || (
        <>
          {firstName}
          {callsign && (
            <span className={textClass}>
              ({callsign}
              {isElite && <sup className="text-brand animate-pulse ml-0.5">↑</sup>}
              )
            </span>
          )}
          {lastName && ` ${lastName}`}
        </>
      )}
      
      {/* Fallback for fullName */}
      {!children && !firstName && fullName}
    </span>
  );
});

UserCapsule.displayName = 'UserCapsule';

/**
 * SkillChip - Ultra-minimal gray chip for skill tags
 * 
 * @example
 * <SkillChip>Stack Overflow</SkillChip>
 */
export const SkillChip = forwardRef(({
  removable = false,
  onRemove,
  className,
  children,
  ...props
}, ref) => {

  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1',
        'px-2 py-0.5',
        'text-[10px] font-medium tracking-wider uppercase',
        'rounded-md',
        'bg-[#1F1F1F] border border-[#333] text-[#AAAAAA]',
        'hover:border-transparent transition-all duration-200',
        className
      )}
      {...props}
    >
      {children}
      
      {/* Remove button */}
      {removable && onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="flex-shrink-0 p-0.5 rounded hover:bg-white/10 transition-colors -mr-0.5"
          aria-label="Remove"
        >
          <X className="w-2.5 h-2.5" />
        </button>
      )}
    </span>
  );
});

SkillChip.displayName = 'SkillChip';

/**
 * StatusCapsule - Special status indicator (Captain, Free Agent, etc.)
 * Same style as role capsule but in brand orange with pulse
 * 
 * @example
 * <StatusCapsule>Free Agent</StatusCapsule>
 * <StatusCapsule icon={<Star />}>Captain</StatusCapsule>
 */
export const StatusCapsule = forwardRef(({
  icon,
  pulse = true,
  className,
  children,
  ...props
}, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full',
        'text-xs font-semibold',
        'bg-brand-20 border border-brand-60 text-brand',
        'shadow-brand-glow',
        pulse && 'animate-pulse',
        className
      )}
      {...props}
    >
      {icon && (
        <span className="w-3 h-3 flex-shrink-0">
          {icon}
        </span>
      )}
      {children}
    </span>
  );
});

StatusCapsule.displayName = 'StatusCapsule';

/**
 * CallsignBadge - Inline callsign display for activity feeds
 * Just the callsign part with team coloring
 * 
 * @example
 * Maya <CallsignBadge>Prompt Wizard</CallsignBadge> Lee joined...
 */
export const CallsignBadge = forwardRef(({
  isElite = false,
  className,
  children,
  ...props
}, ref) => {
  const textClass = 'text-text-secondary';

  return (
    <span
      ref={ref}
      className={cn(textClass, className)}
      {...props}
    >
      ({children}
      {isElite && <sup className="text-brand animate-pulse ml-0.5">↑</sup>}
      )
    </span>
  );
});

CallsignBadge.displayName = 'CallsignBadge';

/**
 * ColoredSkillChip - Skill chip with category-based coloring
 * Colors are determined by skill category (development, design, data, etc.)
 * 
 * @example
 * <ColoredSkillChip skill="Frontend Development" />
 * <ColoredSkillChip skill="Machine Learning" showDot />
 */
export const ColoredSkillChip = forwardRef(({
  skill,
  showDot = false,
  removable = false,
  onRemove,
  className,
  children,
  ...props
}, ref) => {
  const config = getSkillConfig(skill || children);
  const colorClasses = getSkillClasses(skill || children);

  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1.5',
        'px-2.5 py-1',
        'text-xs font-medium',
        'rounded-lg border',
        'transition-all duration-200 hover:scale-105',
        colorClasses,
        className
      )}
      {...props}
    >
      {showDot && (
        <span 
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: config.color }}
        />
      )}
      {skill || children}
      
      {/* Remove button */}
      {removable && onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="flex-shrink-0 p-0.5 rounded hover:bg-white/10 transition-colors -mr-0.5"
          aria-label="Remove"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
});

ColoredSkillChip.displayName = 'ColoredSkillChip';

/**
 * CardStateBadge - Badge that indicates card state (Your Team, Skills Match, etc.)
 * 
 * @example
 * <CardStateBadge state="yourTeam" />
 * <CardStateBadge state="matchingSkills" />
 */
export const CardStateBadge = forwardRef(({
  state = 'default',
  className,
  ...props
}, ref) => {
  // Import dynamically to avoid circular deps
  const CARD_STATES = {
    yourTeam: {
      label: 'Your Idea',
      badgeClass: 'bg-brand/20 text-brand border-brand/30',
      icon: '★',
    },
    matchingSkills: {
      label: 'Skills Match',
      badgeClass: 'bg-success/20 text-success border-success/30',
      icon: '✓',
    },
    teamFull: {
      label: 'Team Full',
      badgeClass: 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30',
      icon: '●',
    },
  };

  const config = CARD_STATES[state];
  if (!config) return null;

  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1',
        'px-2 py-0.5',
        'text-[10px] font-bold uppercase tracking-wide',
        'rounded-full border',
        config.badgeClass,
        className
      )}
      {...props}
    >
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
});

CardStateBadge.displayName = 'CardStateBadge';

export default Badge;
