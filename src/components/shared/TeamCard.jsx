/**
 * TeamCard Component
 * Display a team with members and status.
 * 
 * @example
 * <TeamCard team={team} onClick={() => navigateToTeam(team.id)} />
 * <TeamCard team={team} variant="compact" />
 */

import { forwardRef } from 'react';
import { Users, ChevronRight, Crown } from 'lucide-react';
import Card from '../ui/Card';
import Badge, { StatusBadge } from '../ui/Badge';
import Avatar, { AvatarGroup } from '../ui/Avatar';
import Button from '../ui/Button';
import { cn } from '../../lib/design-system';

/**
 * @typedef {Object} TeamCardProps
 * @property {Object} team - Team object
 * @property {'default' | 'compact' | 'full'} [variant='default']
 * @property {boolean} [showMembers=true]
 * @property {boolean} [showLookingFor=true]
 * @property {boolean} [showStatus=false]
 * @property {boolean} [clickable=true]
 * @property {() => void} [onClick]
 * @property {string} [className]
 */

const TeamCard = forwardRef(({
  team,
  variant = 'default',
  showMembers = true,
  showLookingFor = true,
  showStatus = false,
  clickable = true,
  onClick,
  className,
  ...props
}, ref) => {
  if (!team) return null;

  // Calculate member stats
  const memberCount = team.members?.length || 0;
  const maxMembers = team.maxMembers || 6;
  const hasOpenSlots = memberCount < maxMembers;

  // Compact variant
  if (variant === 'compact') {
    return (
      <div
        ref={ref}
        onClick={clickable ? onClick : undefined}
        className={cn(
          'bg-arena-card border border-arena-border rounded-card p-3',
          'transition-all duration-200',
          clickable && cn('cursor-pointer hover:-translate-y-0.5'),
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-3">
          {/* Team Icon */}
          <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 rounded-lg bg-arena-elevated">
            <Users className="w-5 h-5 text-text-secondary" />
          </div>
          
          {/* Team Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-white truncate">
              {team.name}
            </h4>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <Users className="w-3 h-3" />
              {memberCount}/{maxMembers}
            </div>
          </div>

          {clickable && (
            <ChevronRight className="w-4 h-4 text-text-muted" />
          )}
        </div>
      </div>
    );
  }

  // Full variant
  if (variant === 'full') {
    return (
      <div
        ref={ref}
        onClick={clickable ? onClick : undefined}
        className={cn(
          'bg-arena-card border border-arena-border rounded-card p-5',
          'transition-all duration-200',
          clickable && cn('cursor-pointer hover:-translate-y-0.5'),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-arena-elevated">
              <Users className="w-6 h-6 text-text-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {team.name}
              </h3>
            </div>
          </div>
          
          {showStatus && team.submission && (
            <StatusBadge status={team.submission.status} />
          )}
        </div>

        {/* Description */}
        {team.description && (
          <p className="text-sm text-text-secondary mb-4">
            {team.description}
          </p>
        )}

        {/* Members */}
        {showMembers && team.members && team.members.length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-bold uppercase tracking-wide text-text-muted mb-2">
              Members ({memberCount}/{maxMembers})
            </div>
            <div className="flex items-center gap-2">
              <AvatarGroup
                users={team.members}
                max={5}
                size="sm"
              />
              {hasOpenSlots && (
                <span className="text-xs text-text-secondary">
                  {maxMembers - memberCount} slots open
                </span>
              )}
            </div>
          </div>
        )}

        {/* Looking For */}
        {showLookingFor && team.lookingFor && team.lookingFor.length > 0 && (
          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-text-muted mb-2">
              Looking For
            </div>
            <div className="flex flex-wrap gap-1">
              {team.lookingFor.map((skill, idx) => (
                <Badge key={idx} variant="default" size="sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div
      ref={ref}
      onClick={clickable ? onClick : undefined}
      className={cn(
        'bg-arena-card border border-arena-border rounded-card p-4',
        'transition-all duration-200',
        clickable && cn('cursor-pointer hover:-translate-y-0.5'),
        className
      )}
      {...props}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 rounded-lg bg-arena-elevated">
            <Users className="w-5 h-5 text-text-secondary" />
          </div>
          <div>
            <h4 className="font-bold text-white">
              {team.name}
            </h4>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <Users className="w-3 h-3" />
              <span>{memberCount}/{maxMembers}</span>
              {hasOpenSlots && (
                <span className="text-text-secondary">• Open</span>
              )}
            </div>
          </div>
        </div>

        {clickable && (
          <ChevronRight className="w-5 h-5 text-text-muted" />
        )}
      </div>

      {/* Description */}
      {team.description && (
        <p className="text-sm text-text-secondary line-clamp-2 mb-3">
          {team.description}
        </p>
      )}

      {/* Looking For Tags */}
      {showLookingFor && team.lookingFor && team.lookingFor.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {team.lookingFor.slice(0, 3).map((skill, idx) => (
            <Badge key={idx} variant="default" size="xs">
              {skill}
            </Badge>
          ))}
          {team.lookingFor.length > 3 && (
            <Badge variant="default" size="xs">
              +{team.lookingFor.length - 3}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
});

TeamCard.displayName = 'TeamCard';

/**
 * TeamList - Grid of team cards
 */
export const TeamList = ({
  teams = [],
  variant = 'default',
  columns = 2,
  emptyMessage = 'No ideas found',
  onTeamClick,
  className,
  ...props
}) => {
  if (teams.length === 0) {
    return (
      <div className={cn('text-sm text-text-muted text-center py-8', className)}>
        {emptyMessage}
      </div>
    );
  }

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  };

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)} {...props}>
      {teams.map((team) => (
        <TeamCard
          key={team.id}
          team={team}
          variant={variant}
          onClick={() => onTeamClick?.(team.id)}
        />
      ))}
    </div>
  );
};

TeamList.displayName = 'TeamList';

/**
 * TeamMemberItem - Single team member row
 */
export const TeamMemberItem = ({
  member,
  isCaptain = false,
  onRemove,
  removable = false,
  className,
}) => {
  return (
    <div className={cn(
      'flex items-center justify-between py-2',
      className
    )}>
      <div className="flex items-center gap-3">
        <Avatar
          name={member.name}
          size="sm"
        />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white">
              {member.name}
            </span>
            {isCaptain && (
              <Crown className="w-4 h-4 text-text-secondary" />
            )}
          </div>
          {member.callsign && (
            <span className="text-xs text-text-secondary">
              "{member.callsign}"
            </span>
          )}
        </div>
      </div>

      {removable && onRemove && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(member.id)}
          className="text-error hover:text-error/80"
        >
          Remove
        </Button>
      )}
    </div>
  );
};

TeamMemberItem.displayName = 'TeamMemberItem';

export default TeamCard;
