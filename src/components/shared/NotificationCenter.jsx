/**
 * NotificationCenter Component
 * Displays a dropdown notification center with unread count badge
 */

import { useState, useRef, useEffect } from 'react';
import { Bell, Check, X, ExternalLink } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { cn } from '../../lib/design-system';

function NotificationCenter({ notifications = [], unreadCount = 0, onMarkAsRead, onMarkAllAsRead, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }

    if (notification.actionUrl) {
      // Parse actionUrl to determine navigation
      // Format: "marketplace" or "teams?teamId=xxx"
      const [view, query] = notification.actionUrl.split('?');
      const params = query ? Object.fromEntries(new URLSearchParams(query)) : {};
      onNavigate(view, params);
    }

    setIsOpen(false);
  };

  const formatTime = (createdAt) => {
    const now = new Date();
    const time = new Date(createdAt);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return time.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'TEAM_INVITE':
        return '👥';
      case 'JOIN_REQUEST':
        return '✋';
      case 'PHASE_CHANGE':
        return '🔄';
      case 'REMINDER':
        return '⏰';
      default:
        return '🔔';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'relative p-2 rounded-lg transition-colors',
          'hover:bg-arena-elevated',
          isOpen && 'bg-arena-elevated'
        )}
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-text-secondary" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-arena-card border-2 border-arena-border rounded-lg shadow-xl z-50 max-h-96 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b border-arena-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-text-secondary" />
              <span className="font-bold text-sm text-text-primary">Notifications</span>
              {unreadCount > 0 && (
                <Badge className="bg-error text-white text-xs">{unreadCount}</Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  onMarkAllAsRead();
                }}
                className="text-xs text-brand hover:text-brand/80 font-medium"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="w-8 h-8 text-arena-muted mx-auto mb-2" />
                <p className="text-sm text-arena-muted">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-arena-border">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      'w-full px-4 py-3 text-left hover:bg-arena-elevated transition-colors',
                      !notification.read && 'bg-arena-elevated/50'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-lg flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className={cn(
                            'text-sm font-semibold',
                            !notification.read ? 'text-text-primary' : 'text-arena-secondary'
                          )}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-brand rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-xs text-arena-muted mb-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-arena-muted">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationCenter;
