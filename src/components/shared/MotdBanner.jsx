/**
 * MotdBanner Component
 * Displays Message of the Day based on current event phase and user role
 * 
 * @example
 * <MotdBanner 
 *   eventPhase="hacking"
 *   userRole="participant"
 * />
 */

import { useMemo, memo } from 'react';
import { Info, AlertTriangle, CheckCircle, XCircle, Megaphone } from 'lucide-react';
import Card from '../ui/Card';
import { HStack, VStack } from '../layout';
import { getMotdForPhaseAndRole, MOTD_VARIANTS } from '../../lib/motdMessages';
import { cn } from '../../lib/design-system';

/**
 * @typedef {Object} MotdBannerProps
 * @property {string} eventPhase - Current event phase
 * @property {string} userRole - User role (participant, ambassador, judge, admin)
 * @property {string} [className] - Additional CSS classes
 */

/**
 * Get icon component based on variant
 */
const getVariantIcon = (variant) => {
  switch (variant) {
    case 'warning':
      return AlertTriangle;
    case 'success':
      return CheckCircle;
    case 'error':
      return XCircle;
    case 'info':
    default:
      return Info;
  }
};

/**
 * Get styling classes based on variant
 */
const getVariantStyles = (variant) => {
  switch (variant) {
    case 'warning':
      return {
        card: 'border-l-4 border-l-orange-primary bg-orange-accent/10',
        icon: 'text-orange-primary bg-orange-accent',
        title: 'text-orange-primary',
      };
    case 'success':
      return {
        card: 'border-l-4 border-l-green-500 bg-green-500/10',
        icon: 'text-green-500 bg-green-500/20',
        title: 'text-green-500',
      };
    case 'error':
      return {
        card: 'border-l-4 border-l-red-500 bg-red-500/10',
        icon: 'text-red-500 bg-red-500/20',
        title: 'text-red-500',
      };
    case 'info':
    default:
      return {
        card: 'border-l-4 border-l-cyan-primary bg-cyan-accent/10',
        icon: 'text-cyan-primary bg-cyan-accent',
        title: 'text-cyan-primary',
      };
  }
};

function MotdBanner({ eventPhase, userRole, className }) {
  // Get MOTD for current phase and role
  const motd = useMemo(() => {
    return getMotdForPhaseAndRole(eventPhase, userRole);
  }, [eventPhase, userRole]);

  // Don't render if no MOTD
  if (!motd || !motd.message) {
    return null;
  }

  const Icon = getVariantIcon(motd.variant);
  const styles = getVariantStyles(motd.variant);

  return (
    <Card 
      variant="default" 
      padding="md" 
      className={cn(
        'animate-fade-in',
        styles.card,
        className
      )}
    >
      <HStack gap="4" align="start">
        {/* Icon */}
        <div className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
          styles.icon
        )}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Content */}
        <VStack gap="1" align="start" className="flex-1 min-w-0">
          {/* Title */}
          <div className="flex items-center gap-2">
            <Megaphone className={cn('w-4 h-4', styles.title)} />
            <span className={cn('text-xs font-bold uppercase tracking-wider', styles.title)}>
              {motd.title}
            </span>
          </div>
          
          {/* Message */}
          <p className="text-sm text-text-body leading-relaxed">
            {motd.message}
          </p>
        </VStack>
      </HStack>
    </Card>
  );
}

export default memo(MotdBanner);
