/**
 * TeamCard Component
 * Display a team with members, allegiance styling, and status.
 * 
 * @example
 * <TeamCard team={team} onClick={() => navigateToTeam(team.id)} />
 * <TeamCard team={team} variant="compact" />
 */

import { forwardRef } from 'react';
import { Users, Heart, Cpu, ChevronRight, Crown } from 'lucide-react';
import Card from '../ui/Card';
import Badge, { StatusBadge } from '../ui/Badge';
import Avatar, { AvatarGroup } from '../ui/Avatar';
import Button from '../ui/Button';
import { cn, getAllegianceConfig } from '../../lib/design-system';

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

  const config = getAllegianceConfig(team.side);
  const AllegianceIcon = team.side === 'ai' ? Cpu : Heart;
  
  // Get card variant based on allegiance
  const cardVariant = team.side === 'ai' ? 'ai' : team.side === 'human' ? 'human' : 'default';

  // Calculate member stats
  const memberCount = team.members?.length || 0;
  const maxMembers = team.maxMembers || 6;
  const hasOpenSlots = memberCount < maxMembers;

  // Compact variant
  if (variant === 'compact') {
    return (
      <Card
        ref={ref}
        variant={cardVariant}
        padding="sm"
        clickable={clickable}
        onClick={onClick}
        className={cn(className)}
        {...props}
      >
        <div className="flex items-center gap-3">
          {/* Allegiance Icon */}
          <div
            className={cn(
              'w-10 h-10 flex items-center justify-center flex-shrink-0',
              team.side === 'ai' ? 'rounded-sm' : 'rounded-xl'
            )}
            style={{ backgroundColor: config.bgColor }}
          >
            <AllegianceIcon className="w-5 h-5" style={{ color: config.color }} />
          </div>
          
          {/* Team Info */}
          <div className="flex-1 min-w-0">
            <h4 className={cn(
              'font-bold text-neutral-900 truncate',
              team.side === 'ai' && 'font-mono'
            )}>
              {team.name}
            </h4>
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <Users className="w-3 h-3" />
              {memberCount}/{maxMembers}
            </div>
          </div>

          {clickable && (
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          )}
        </div>
      </Card>
    );
  }

  // Full variant
  if (variant === 'full') {
    return (
      <Card
        ref={ref}
        variant={cardVariant}
        padding="lg"
        clickable={clickable}
        onClick={onClick}
        className={cn(className)}
        {...props}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-12 h-12 flex items-center justify-center',
                team.side === 'ai' ? 'rounded-sm' : 'rounded-xl'
              )}
              style={{ backgroundColor: config.bgColor }}
            >
              <AllegianceIcon className="w-6 h-6" style={{ color: config.color }} />
            </div>
            <div>
              <h3 className={cn(
                'text-lg font-bold text-neutral-900',
                team.side === 'ai' && 'font-mono'
              )}>
                {team.name}
              </h3>
              <Badge variant={team.side === 'ai' ? 'ai' : 'human'} size="xs">
                {team.side === 'ai' ? 'AI Side' : 'Human Side'}
              </Badge>
            </div>
          </div>
          
          {showStatus && team.submission && (
            <StatusBadge status={team.submission.status} />
          )}
        </div>

        {/* Description */}
        {team.description && (
          <p className="text-sm text-neutral-600 mb-4">
            {team.description}
          </p>
        )}

        {/* Members */}
        {showMembers && team.members && team.members.length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-bold uppercase tracking-wide text-neutral-400 mb-2">
              Members ({memberCount}/{maxMembers})
            </div>
            <div className="flex items-center gap-2">
              <AvatarGroup
                users={team.members.map(m => ({
                  ...m,
                  allegiance: team.side,
                }))}
                max={5}
                size="sm"
              />
              {hasOpenSlots && (
                <span className="text-xs text-neutral-500">
                  {maxMembers - memberCount} slots open
                </span>
              )}
            </div>
          </div>
        )}

        {/* Looking For */}
        {showLookingFor && team.lookingFor && team.lookingFor.length > 0 && (
          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-neutral-400 mb-2">
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
      </Card>
    );
  }

  // Default variant
  return (
    <Card
      ref={ref}
      variant={cardVariant}
      padding="md"
      clickable={clickable}
      onClick={onClick}
      className={cn(className)}
      {...props}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-10 h-10 flex items-center justify-center flex-shrink-0',
              team.side === 'ai' ? 'rounded-sm' : 'rounded-xl'
            )}
            style={{ backgroundColor: config.bgColor }}
          >
            <AllegianceIcon className="w-5 h-5" style={{ color: config.color }} />
          </div>
          <div>
            <h4 className={cn(
              'font-bold text-neutral-900',
              team.side === 'ai' && 'font-mono'
            )}>
              {team.name}
            </h4>
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <Users className="w-3 h-3" />
              <span>{memberCount}/{maxMembers}</span>
              {hasOpenSlots && (
                <span className="text-human-600">• Open</span>
              )}
            </div>
          </div>
        </div>

        {clickable && (
          <ChevronRight className="w-5 h-5 text-neutral-400" />
        )}
      </div>

      {/* Description */}
      {team.description && (
        <p className="text-sm text-neutral-600 line-clamp-2 mb-3">
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
    </Card>
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
  emptyMessage = 'No teams found',
  onTeamClick,
  className,
  ...props
}) => {
  if (teams.length === 0) {
    return (
      <div className={cn('text-sm text-neutral-400 text-center py-8', className)}>
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
  allegiance,
  onRemove,
  removable = false,
  className,
}) => {
  const config = getAllegianceConfig(allegiance);

  return (
    <div className={cn(
      'flex items-center justify-between py-2',
      className
    )}>
      <div className="flex items-center gap-3">
        <Avatar
          name={member.name}
          size="sm"
          allegiance={allegiance}
        />
        <div>
          <div className="flex items-center gap-2">
            <span className={cn(
              'font-bold text-sm text-neutral-900',
              allegiance === 'ai' && 'font-mono'
            )}>
              {member.name}
            </span>
            {isCaptain && (
              <Crown className="w-4 h-4 text-accent-500" />
            )}
          </div>
          {member.callsign && (
            <span className="text-xs" style={{ color: config.color }}>
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
          className="text-error-500 hover:text-error-600"
        >
          Remove
        </Button>
      )}
    </div>
  );
};

TeamMemberItem.displayName = 'TeamMemberItem';

export default TeamCard;

