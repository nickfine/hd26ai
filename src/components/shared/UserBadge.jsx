/**
 * UserBadge Component
 * Display a user with their avatar, name, callsign, and allegiance.
 * 
 * @example
 * <UserBadge user={user} showCallsign />
 * <UserBadge user={user} variant="compact" />
 */

import { forwardRef } from 'react';
import Avatar, { AllegianceAvatar } from '../ui/Avatar';
import Badge, { AllegianceBadge, RoleBadge } from '../ui/Badge';
import { cn, formatNameWithCallsign, getAllegianceConfig } from '../../lib/design-system';

/**
 * @typedef {Object} UserBadgeProps
 * @property {Object} user - User object
 * @property {'default' | 'compact' | 'full'} [variant='default']
 * @property {'sm' | 'md' | 'lg'} [size='md']
 * @property {boolean} [showCallsign=true]
 * @property {boolean} [showAllegiance=false]
 * @property {boolean} [showRole=false]
 * @property {boolean} [showSkills=false]
 * @property {boolean} [clickable=false]
 * @property {() => void} [onClick]
 * @property {string} [className]
 */

const SIZE_MAP = {
  sm: { avatar: 'sm', text: 'text-sm', subtext: 'text-xs' },
  md: { avatar: 'md', text: 'text-sm', subtext: 'text-xs' },
  lg: { avatar: 'lg', text: 'text-base', subtext: 'text-sm' },
};

const UserBadge = forwardRef(({
  user,
  variant = 'default',
  size = 'md',
  showCallsign = true,
  showAllegiance = false,
  showRole = false,
  showSkills = false,
  clickable = false,
  onClick,
  className,
  ...props
}, ref) => {
  if (!user) return null;

  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.md;
  const config = getAllegianceConfig(user.allegiance);
  const nameFormatted = formatNameWithCallsign(user.name, showCallsign ? user.callsign : null);

  const Component = clickable ? 'button' : 'div';

  // Compact variant - just avatar and name
  if (variant === 'compact') {
    return (
      <Component
        ref={ref}
        type={clickable ? 'button' : undefined}
        onClick={clickable ? onClick : undefined}
        className={cn(
          'inline-flex items-center gap-2',
          clickable && 'cursor-pointer hover:opacity-80 transition-opacity',
          className
        )}
        {...props}
      >
        <Avatar
          src={user.image}
          name={user.name}
          size={sizeConfig.avatar}
          allegiance={user.allegiance}
        />
        <span className={cn('font-bold text-neutral-900', sizeConfig.text)}>
          {user.name}
        </span>
      </Component>
    );
  }

  // Full variant - all details
  if (variant === 'full') {
    return (
      <Component
        ref={ref}
        type={clickable ? 'button' : undefined}
        onClick={clickable ? onClick : undefined}
        className={cn(
          'flex items-start gap-3 p-3 rounded-lg border border-neutral-200 bg-white',
          clickable && 'cursor-pointer hover:bg-neutral-50 transition-colors',
          className
        )}
        {...props}
      >
        <Avatar
          src={user.image}
          name={user.name}
          size="lg"
          allegiance={user.allegiance}
          showBorder
        />
        <div className="flex-1 min-w-0 text-left">
          {/* Name with callsign */}
          <div className={cn('font-bold text-neutral-900 flex items-center gap-1 flex-wrap', sizeConfig.text)}>
            {nameFormatted.hasCallsign ? (
              <>
                {nameFormatted.firstName}
                <span className={cn(
                  'px-1.5 py-0.5 text-xs font-bold rounded-full border bg-white',
                  user.allegiance === 'ai' 
                    ? 'border-ai-500 text-ai-700' 
                    : user.allegiance === 'human' 
                      ? 'border-human-500 text-human-700' 
                      : 'border-neutral-400 text-neutral-600'
                )}>
                  {nameFormatted.callsign}
                </span>
                {nameFormatted.lastName}
              </>
            ) : (
              user.name
            )}
          </div>

          {/* Badges row */}
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {showAllegiance && user.allegiance && (
              <AllegianceBadge allegiance={user.allegiance} size="xs" />
            )}
            {showRole && user.role && user.role !== 'participant' && (
              <RoleBadge role={user.role} size="xs" />
            )}
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="text-xs text-neutral-500 mt-2 line-clamp-2">
              {user.bio}
            </p>
          )}

          {/* Skills */}
          {showSkills && user.skills && user.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {user.skills.slice(0, 3).map((skill, idx) => (
                <Badge key={idx} variant="default" size="xs">
                  {skill}
                </Badge>
              ))}
              {user.skills.length > 3 && (
                <Badge variant="default" size="xs">
                  +{user.skills.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </Component>
    );
  }

  // Default variant
  return (
    <Component
      ref={ref}
      type={clickable ? 'button' : undefined}
      onClick={clickable ? onClick : undefined}
      className={cn(
        'flex items-center gap-3',
        clickable && 'cursor-pointer hover:opacity-80 transition-opacity',
        className
      )}
      {...props}
    >
      <Avatar
        src={user.image}
        name={user.name}
        size={sizeConfig.avatar}
        allegiance={user.allegiance}
        showBorder
      />
      <div className="flex-1 min-w-0 text-left">
        {/* Name with callsign */}
        <div className={cn('font-bold text-neutral-900 flex items-center gap-1 flex-wrap', sizeConfig.text)}>
          {nameFormatted.hasCallsign ? (
            <>
              {nameFormatted.firstName}
              <span className={cn(
                'px-1.5 py-0.5 text-xs font-bold rounded-full border bg-white',
                user.allegiance === 'ai' 
                  ? 'border-ai-500 text-ai-700' 
                  : user.allegiance === 'human' 
                    ? 'border-human-500 text-human-700' 
                    : 'border-neutral-400 text-neutral-600'
              )}>
                {nameFormatted.callsign}
              </span>
              {nameFormatted.lastName}
            </>
          ) : (
            user.name
          )}
        </div>
        
        {/* Subtitle row */}
        <div className={cn('text-neutral-500 flex items-center gap-2', sizeConfig.subtext)}>
          {showAllegiance && user.allegiance && (
            <span style={{ color: config.color }}>{config.label}</span>
          )}
          {showRole && user.role && user.role !== 'participant' && (
            <RoleBadge role={user.role} size="xs" />
          )}
        </div>
      </div>
    </Component>
  );
});

UserBadge.displayName = 'UserBadge';

/**
 * UserList - List of users with UserBadge
 */
export const UserList = ({
  users = [],
  variant = 'default',
  size = 'md',
  emptyMessage = 'No users found',
  className,
  ...props
}) => {
  if (users.length === 0) {
    return (
      <div className={cn('text-sm text-neutral-400 text-center py-4', className)}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)} {...props}>
      {users.map((user) => (
        <UserBadge
          key={user.id}
          user={user}
          variant={variant}
          size={size}
          showAllegiance
        />
      ))}
    </div>
  );
};

UserList.displayName = 'UserList';

export default UserBadge;

