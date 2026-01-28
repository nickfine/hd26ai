/**
 * LiveActivityFeed Component
 * 
 * Enhanced activity feed with distinct icons, relative timestamps, 
 * and subtle entrance animations. The heartbeat of the event.
 * 
 * Features:
 * - Distinct icons and colors for each activity type
 * - Relative timestamps with tooltip for absolute time
 * - Subtle fade-in animation for new items
 * - Live pulse indicator
 * - Respects prefers-reduced-motion
 */

import { memo, useMemo } from 'react';
import { 
  UserPlus, 
  Lightbulb, 
  Upload, 
  Vote, 
  MessageSquare,
  Award,
  Users,
  LogIn
} from 'lucide-react';
import { cn, formatNameWithCallsign } from '../../lib/design-system';
import { CallsignBadge } from './Badge';
import useReducedMotion from '../../hooks/useReducedMotion';

// Activity type configuration with icons and colors
const ACTIVITY_CONFIG = {
  join: {
    icon: UserPlus,
    label: 'joined',
    color: 'var(--status-success)',
    bgColor: 'var(--status-success-subtle)',
    emoji: '👋',
  },
  create: {
    icon: Lightbulb,
    label: 'created',
    color: 'var(--status-info)',
    bgColor: 'var(--status-info-subtle)',
    emoji: '🆕',
  },
  submit: {
    icon: Upload,
    label: 'submitted',
    color: 'var(--accent-brand)',
    bgColor: 'var(--accent-brand-subtle)',
    emoji: '📤',
  },
  vote: {
    icon: Vote,
    label: 'voted for',
    color: 'var(--status-warning)',
    bgColor: 'var(--status-warning-subtle)',
    emoji: '🗳️',
  },
  comment: {
    icon: MessageSquare,
    label: 'commented on',
    color: 'var(--text-secondary)',
    bgColor: 'var(--surface-secondary)',
    emoji: '💬',
  },
  award: {
    icon: Award,
    label: 'won',
    color: '#FFD700', // Gold
    bgColor: 'rgba(255, 215, 0, 0.15)',
    emoji: '🏆',
  },
  team_full: {
    icon: Users,
    label: 'team is now full:',
    color: 'var(--status-success)',
    bgColor: 'var(--status-success-subtle)',
    emoji: '✅',
  },
  login: {
    icon: LogIn,
    label: 'logged in',
    color: 'var(--text-secondary)',
    bgColor: 'var(--surface-secondary)',
    emoji: '👤',
  },
};

/**
 * Format relative time from ISO timestamp or relative string
 */
const formatRelativeTime = (timeInput) => {
  if (!timeInput) return 'recently';
  
  // If already formatted (e.g., "2 min ago"), return as-is
  if (typeof timeInput === 'string' && timeInput.includes('ago')) {
    return timeInput;
  }
  
  try {
    const now = new Date();
    const time = new Date(timeInput);
    
    if (isNaN(time.getTime())) {
      return timeInput || 'recently';
    }
    
    const diffMs = now - time;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffSecs < 30) return 'just now';
    if (diffMins < 1) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return time.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  } catch (err) {
    console.error('Error formatting time:', err);
    return 'recently';
  }
};

/**
 * Get absolute time for tooltip
 */
const getAbsoluteTime = (timeInput) => {
  if (!timeInput) return '';
  
  try {
    const time = new Date(timeInput);
    if (isNaN(time.getTime())) return '';
    
    return time.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return '';
  }
};

/**
 * Pulse indicator showing the feed is live
 */
export const LivePulse = memo(function LivePulse({ className }) {
  return (
    <span 
      className={cn(
        'relative inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider',
        className
      )}
      style={{ color: 'var(--status-success)' }}
    >
      <span className="relative flex h-2 w-2">
        <span 
          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
          style={{ backgroundColor: 'var(--status-success)' }}
        />
        <span 
          className="relative inline-flex rounded-full h-2 w-2"
          style={{ backgroundColor: 'var(--status-success)' }}
        />
      </span>
      Live
    </span>
  );
});

/**
 * Single activity item
 */
const ActivityItem = memo(function ActivityItem({ 
  activity, 
  isNew = false,
  showIcon = true,
  prefersReducedMotion = false,
}) {
  const config = ACTIVITY_CONFIG[activity.type] || ACTIVITY_CONFIG.join;
  const Icon = config.icon;
  const relativeTime = formatRelativeTime(activity.time);
  const absoluteTime = getAbsoluteTime(activity.time);
  const formatted = formatNameWithCallsign(activity.user, activity.callsign);
  
  return (
    <div 
      className={cn(
        'flex items-start gap-3 py-3 px-3 rounded-lg transition-colors',
        'hover:bg-[var(--surface-secondary)]',
        isNew && !prefersReducedMotion && 'animate-fade-in'
      )}
    >
      {/* Activity type icon */}
      {showIcon && (
        <div 
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: config.bgColor }}
        >
          <Icon className="w-4 h-4" style={{ color: config.color }} />
        </div>
      )}
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-relaxed">
          {/* User name with callsign */}
          <span 
            className="font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            {formatted.hasCallsign ? (
              <>
                {formatted.firstName}{' '}
                <CallsignBadge>{formatted.callsign}</CallsignBadge>
                {formatted.lastName && ` ${formatted.lastName}`}
              </>
            ) : (
              activity.user
            )}
          </span>
          
          {/* Action */}
          <span style={{ color: 'var(--text-secondary)' }}>
            {' '}{config.label}{' '}
          </span>
          
          {/* Target (team/project) */}
          {activity.team && (
            <span 
              className="font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              {activity.team}
            </span>
          )}
          {activity.project && (
            <span 
              className="font-medium italic"
              style={{ color: 'var(--text-primary)' }}
            >
              "{activity.project}"
            </span>
          )}
        </p>
        
        {/* Timestamp */}
        <p 
          className="text-xs mt-0.5"
          style={{ color: 'var(--text-disabled)' }}
          title={absoluteTime}
        >
          {relativeTime}
        </p>
      </div>
    </div>
  );
});

/**
 * LiveActivityFeed Component
 */
const LiveActivityFeed = memo(function LiveActivityFeed({
  activities = [],
  maxItems = 5,
  showHeader = true,
  className,
  emptyMessage = 'No activity yet',
}) {
  const prefersReducedMotion = useReducedMotion();
  
  // Slice to max items
  const displayedActivities = useMemo(() => 
    activities.slice(0, maxItems),
    [activities, maxItems]
  );
  
  return (
    <div className={cn('', className)}>
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: 'var(--text-secondary)' }}
          >
            Live Activity
          </h3>
          <LivePulse />
        </div>
      )}
      
      {/* Activity list - aria-live for screen reader announcements (WCAG 4.1.3) */}
      <div 
        className="space-y-1 max-h-80 overflow-y-auto rounded-lg"
        style={{ 
          backgroundColor: 'var(--surface-primary)',
          border: '1px solid var(--border-default)',
        }}
        role="log"
        aria-live="polite"
        aria-label="Live activity feed"
        aria-atomic="false"
        aria-relevant="additions"
      >
        {displayedActivities.length > 0 ? (
          displayedActivities.map((activity, index) => (
            <ActivityItem 
              key={activity.id || index}
              activity={activity}
              isNew={index === 0}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))
        ) : (
          <div 
            className="py-8 text-center text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  );
});

export default LiveActivityFeed;
