/**
 * Avatar Component
 * Display user avatars with optional status indicators.
 * 
 * @example
 * <Avatar src="/user.jpg" name="John Doe" />
 * <Avatar name="Jane" indicator="online" />
 * <AvatarGroup users={[...]} max={3} />
 */

import { forwardRef } from 'react';
import { User } from 'lucide-react';
import { cn, SIZE_CLASSES } from '../../lib/design-system';

/**
 * @typedef {Object} AvatarProps
 * @property {string} [src] - Image URL
 * @property {string} [name] - User name (used for fallback initials)
 * @property {'xs' | 'sm' | 'md' | 'lg' | 'xl'} [size='md']
 * @property {'online' | 'offline' | 'busy' | 'away'} [indicator]
 * @property {boolean} [showBorder=false]
 * @property {string} [className]
 */

const INDICATOR_COLORS = {
  online: 'bg-success-500',
  offline: 'bg-neutral-400',
  busy: 'bg-error-500',
  away: 'bg-warning-500',
};

const INDICATOR_SIZE = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-3.5 h-3.5',
};

/**
 * Get initials from a name
 * @param {string} name - Full name
 * @returns {string} Up to 2 character initials
 */
const getInitials = (name) => {
  if (!name) return '';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const Avatar = forwardRef(({
  src,
  name,
  size = 'md',
  indicator,
  showBorder = false,
  className,
  ...props
}, ref) => {
  const sizeStyles = SIZE_CLASSES.avatar[size] || SIZE_CLASSES.avatar.md;
  const initials = getInitials(name);

  // Border style
  const borderStyle = showBorder ? 'border-2 border-solid' : '';

  // Border color
  const borderColorStyle = { borderColor: '#1F1F1F' }; // arena-border color

  return (
    <div className="relative inline-block">
      <div
        ref={ref}
        className={cn(
          // Base styles
          'flex items-center justify-center overflow-hidden',
          sizeStyles,
          'rounded-lg',
          borderStyle,
          // Background for fallback (dark theme)
          !src && 'bg-arena-elevated',
          className
        )}
        style={showBorder ? borderColorStyle : undefined}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={name || 'Avatar'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Fallback: Initials or Icon */}
        <div 
          className={cn(
            'flex items-center justify-center w-full h-full font-bold',
            src && 'hidden',
            'text-text-secondary'
          )}
        >
          {initials || <User className="w-1/2 h-1/2" />}
        </div>
      </div>

      {/* Status Indicator */}
      {indicator && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-arena-black',
            INDICATOR_SIZE[size],
            INDICATOR_COLORS[indicator]
          )}
        />
      )}
    </div>
  );
});

Avatar.displayName = 'Avatar';

/**
 * AvatarGroup - Display multiple avatars in a stack
 */
export const AvatarGroup = ({
  users = [],
  max = 3,
  size = 'md',
  className,
  ...props
}) => {
  const displayUsers = users.slice(0, max);
  const remaining = users.length - max;

  // Overlap based on size
  const overlapClass = {
    xs: '-ml-1.5',
    sm: '-ml-2',
    md: '-ml-2.5',
    lg: '-ml-3',
    xl: '-ml-4',
  };

  return (
    <div className={cn('flex items-center', className)} {...props}>
      {displayUsers.map((user, index) => (
        <Avatar
          key={user.id || index}
          src={user.image || user.src}
          name={user.name}
          size={size}
          className={cn(
            index > 0 && overlapClass[size],
            'ring-2 ring-arena-black'
          )}
        />
      ))}
      
      {remaining > 0 && (
        <div
          className={cn(
            SIZE_CLASSES.avatar[size],
            overlapClass[size],
            'flex items-center justify-center rounded-full',
            'bg-arena-elevated text-text-secondary font-bold ring-2 ring-arena-black'
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};

AvatarGroup.displayName = 'AvatarGroup';

export default Avatar;


