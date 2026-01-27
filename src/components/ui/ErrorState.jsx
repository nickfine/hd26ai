/**
 * ErrorState Component
 * Consistent error display with retry functionality.
 * 
 * @example
 * // Basic error
 * <ErrorState message="Failed to load data" onRetry={refetch} />
 * 
 * // Error with custom icon
 * <ErrorState 
 *   icon={<ServerCrash />}
 *   title="Server Error"
 *   message="Unable to connect to the server"
 *   onRetry={refetch}
 * />
 */

import { memo } from 'react';
import { AlertCircle, RefreshCw, WifiOff, ServerCrash, FileQuestion } from 'lucide-react';
import { cn } from '../../lib/design-system';
import Button from './Button';

const ErrorState = memo(function ErrorState({
  variant = 'default', // 'default' | 'network' | 'server' | 'notfound' | 'inline'
  title,
  message = 'Something went wrong',
  onRetry,
  retryText = 'Try Again',
  isRetrying = false,
  showIcon = true,
  className,
  children,
}) {
  // Variant configurations
  const variants = {
    default: {
      icon: AlertCircle,
      title: title || 'Error',
      color: 'text-error',
      bgColor: 'bg-error/10',
    },
    network: {
      icon: WifiOff,
      title: title || 'Connection Error',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    server: {
      icon: ServerCrash,
      title: title || 'Server Error',
      color: 'text-error',
      bgColor: 'bg-error/10',
    },
    notfound: {
      icon: FileQuestion,
      title: title || 'Not Found',
      color: 'text-text-secondary',
      bgColor: 'bg-arena-elevated',
    },
    inline: {
      icon: AlertCircle,
      title: null,
      color: 'text-error',
      bgColor: 'transparent',
    },
  };

  const config = variants[variant] || variants.default;
  const Icon = config.icon;

  // Inline variant - compact error display
  if (variant === 'inline') {
    return (
      <div className={cn(
        'flex items-center gap-2 text-sm',
        className
      )}>
        {showIcon && <Icon className={cn('w-4 h-4', config.color)} />}
        <span className={config.color}>{message}</span>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            disabled={isRetrying}
            className="text-brand hover:text-brand/80 underline text-sm"
          >
            {isRetrying ? 'Retrying...' : retryText}
          </button>
        )}
      </div>
    );
  }

  // Standard error state
  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-12 px-4 text-center',
      className
    )}>
      {/* Icon */}
      {showIcon && (
        <div className={cn(
          'w-16 h-16 rounded-full flex items-center justify-center mb-4',
          config.bgColor
        )}>
          <Icon className={cn('w-8 h-8', config.color)} />
        </div>
      )}

      {/* Title */}
      {config.title && (
        <h3 className="text-lg font-bold text-text-primary mb-2">
          {config.title}
        </h3>
      )}

      {/* Message */}
      <p className="text-text-secondary text-sm max-w-md mb-6">
        {message}
      </p>

      {/* Custom content */}
      {children}

      {/* Retry button */}
      {onRetry && (
        <Button
          variant="secondary"
          onClick={onRetry}
          disabled={isRetrying}
          leftIcon={<RefreshCw className={cn('w-4 h-4', isRetrying && 'animate-spin')} />}
        >
          {isRetrying ? 'Retrying...' : retryText}
        </Button>
      )}
    </div>
  );
});

/**
 * ErrorBanner - Dismissible error banner
 */
export const ErrorBanner = memo(function ErrorBanner({
  message,
  onDismiss,
  onRetry,
  className,
}) {
  return (
    <div className={cn(
      'flex items-center gap-3 p-4 rounded-lg',
      'bg-error/10 border border-error/30',
      className
    )}>
      <AlertCircle className="w-5 h-5 text-error flex-shrink-0" />
      <p className="flex-1 text-sm text-text-primary">{message}</p>
      <div className="flex items-center gap-2">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="text-sm font-medium text-brand hover:text-brand/80"
          >
            Retry
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="text-text-muted hover:text-text-primary"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
});

/**
 * EmptyState - For when there's no data (not an error)
 */
export const EmptyState = memo(function EmptyState({
  icon: CustomIcon,
  title = 'No data',
  message = 'There\'s nothing here yet.',
  action,
  actionText = 'Get Started',
  className,
}) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-12 px-4 text-center',
      className
    )}>
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-arena-elevated flex items-center justify-center mb-4">
        {CustomIcon ? (
          <CustomIcon className="w-8 h-8 text-text-muted" />
        ) : (
          <FileQuestion className="w-8 h-8 text-text-muted" />
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-text-primary mb-2">
        {title}
      </h3>

      {/* Message */}
      <p className="text-text-secondary text-sm max-w-md mb-6">
        {message}
      </p>

      {/* Action */}
      {action && (
        <Button variant="primary" onClick={action}>
          {actionText}
        </Button>
      )}
    </div>
  );
});

export default ErrorState;
