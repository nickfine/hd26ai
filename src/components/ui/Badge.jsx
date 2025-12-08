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
import { X, Heart, Cpu, Scale } from 'lucide-react';
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
 * AllegianceCapsule - User name display with callsign and team-colored glow
 * 
 * @example
 * <AllegianceCapsule 
 *   allegiance="human"
 *   firstName="Casey" 
 *   callsign="CSS Wizard" 
 *   lastName="Brooks"
 *   showDot
 * />
 */
export const AllegianceCapsule = forwardRef(({
  allegiance = 'neutral',
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
  const config = {
    human: {
      bgClass: 'bg-human-10',
      borderClass: 'border-human/50',
      shadowClass: 'shadow-human-glow',
      textClass: 'text-human',
      Icon: Heart,
    },
    ai: {
      bgClass: 'bg-ai-10',
      borderClass: 'border-ai/50',
      shadowClass: 'shadow-ai-glow',
      textClass: 'text-ai',
      Icon: Cpu,
    },
    neutral: {
      bgClass: 'bg-arena-elevated',
      borderClass: 'border-arena-border',
      shadowClass: '',
      textClass: 'text-text-secondary',
      Icon: Scale,
    },
  };

  const { bgClass, borderClass, shadowClass, textClass, Icon } = config[allegiance] || config.neutral;

  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full',
        'text-xs font-medium tracking-wider',
        'border',
        bgClass,
        borderClass,
        shadowClass,
        'text-white',
        className
      )}
      {...props}
    >
      {/* Heartbeat dot */}
      {showDot && (
        <HeartbeatDot className={textClass} />
      )}
      
      {/* Optional icon */}
      {showIcon && (
        <Icon className={cn('w-3 h-3', textClass)} />
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

AllegianceCapsule.displayName = 'AllegianceCapsule';

/**
 * SkillChip - Ultra-minimal gray chip for skill tags
 * 
 * @example
 * <SkillChip>Stack Overflow</SkillChip>
 * <SkillChip allegiance="human">HTML Hotshot</SkillChip>
 */
export const SkillChip = forwardRef(({
  allegiance, // Optional: add team-colored hover glow
  removable = false,
  onRemove,
  className,
  children,
  ...props
}, ref) => {
  // Determine hover glow based on allegiance
  const hoverGlow = allegiance === 'ai' 
    ? 'hover:shadow-lg hover:shadow-ai/10' 
    : allegiance === 'human'
      ? 'hover:shadow-lg hover:shadow-human/10'
      : 'hover:shadow-skill-glow';

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
        hoverGlow,
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
 * Same style as allegiance capsule but in brand orange with pulse
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
 * Maya <CallsignBadge allegiance="ai">Prompt Wizard</CallsignBadge> Lee joined...
 */
export const CallsignBadge = forwardRef(({
  allegiance = 'neutral',
  isElite = false,
  className,
  children,
  ...props
}, ref) => {
  const textClass = allegiance === 'ai' 
    ? 'text-ai' 
    : allegiance === 'human' 
      ? 'text-human' 
      : 'text-text-secondary';

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

export default Badge;
