/**
 * FreeAgentReminderBanner Component
 * Displays a reminder banner for free agents when hack start is within 24-48 hours
 * 
 * @example
 * <FreeAgentReminderBanner 
 *   user={user} 
 *   event={event} 
 *   onOptIn={handleAutoAssignOptIn}
 *   isOptingIn={isOptingIn}
 * />
 */

import { useMemo } from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

export default function FreeAgentReminderBanner({ 
  user, 
  event, 
  onOptIn, 
  isOptingIn = false 
}) {
  const shouldShow = useMemo(() => {
    if (!user?.isFreeAgent || !event?.startDate) return false;
    
    const now = new Date();
    const hackStart = new Date(event.startDate);
    const hoursUntilHack = (hackStart - now) / (1000 * 60 * 60);
    
    // Show if within 24-48 hour window
    return hoursUntilHack >= 24 && hoursUntilHack <= 48;
  }, [user?.isFreeAgent, event?.startDate]);

  const hoursUntilHack = useMemo(() => {
    if (!event?.startDate) return null;
    const now = new Date();
    const hackStart = new Date(event.startDate);
    return Math.floor((hackStart - now) / (1000 * 60 * 60));
  }, [event?.startDate]);

  if (!shouldShow) return null;

  return (
    <Card className="border-2 border-amber-400 bg-amber-50">
      <div className="flex items-start gap-4">
        <Clock className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="font-bold text-amber-900 mb-1">
            Hack Starts in {hoursUntilHack} Hours!
          </h3>
          <p className="text-sm text-amber-800 mb-3">
            You're currently a free agent. Would you like to be automatically assigned to the Observers team when the hack starts?
          </p>
          {user?.autoAssignOptIn ? (
            <div className="flex items-center gap-2 text-sm text-green-700">
              <CheckCircle className="w-4 h-4" />
              <span>You've opted in to auto-assignment</span>
            </div>
          ) : (
            <Button
              onClick={() => onOptIn(true)}
              disabled={isOptingIn}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isOptingIn ? 'Opting In...' : 'Yes, Auto-Assign Me to Observers'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
