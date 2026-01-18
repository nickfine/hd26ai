/**
 * StatusBanner Component
 * Displays user's current HackDay registration status (Free Agent / On Team / Observer)
 * 
 * @example
 * <StatusBanner 
 *   user={user} 
 *   teams={teams} 
 *   userInvites={userInvites}
 *   onNavigate={onNavigate}
 *   eventPhase={eventPhase}
 * />
 */

import { useMemo } from 'react';
import { User, Users, Eye, Mail, ArrowRight } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { HStack, VStack } from '../layout';
import { cn } from '../../lib/design-system';

/**
 * @typedef {Object} StatusBannerProps
 * @property {Object} user - Current user object
 * @property {Array} teams - All teams array
 * @property {Array} userInvites - Pending team invites for user
 * @property {(view: string, options?: Object) => void} onNavigate - Navigation handler
 * @property {string} eventPhase - Current event phase ('registration' | 'hacking' | 'voting' | etc.)
 */

const OBSERVERS_TEAM_ID = 'team-observers';

function StatusBanner({ user, teams = [], userInvites = [], onNavigate, eventPhase }) {
  // Find user's team
  const userTeam = useMemo(() => {
    if (!user?.id) return null;
    return teams.find((team) => 
      team.captainId === user.id || 
      team.members?.some(m => m.id === user.id)
    );
  }, [user?.id, teams]);

  // Check if user is captain
  const isCaptain = useMemo(() => {
    return userTeam?.captainId === user?.id;
  }, [userTeam, user?.id]);

  // Check if user is observer
  const isObserver = useMemo(() => {
    return userTeam?.id === OBSERVERS_TEAM_ID;
  }, [userTeam]);

  // Count pending invites
  const pendingInviteCount = useMemo(() => {
    return userInvites.filter(invite => invite.status === 'PENDING' || !invite.status).length;
  }, [userInvites]);

  // Only show team role during registration/teams phase (before hack starts)
  const showTeamRole = eventPhase === 'registration' || eventPhase === 'teams';

  // Don't render if user has no team and no invites (edge case - not registered)
  if (!userTeam && pendingInviteCount === 0 && !user?.isFreeAgent) {
    return null;
  }

  // Free Agent Status
  if (!userTeam) {
    return (
      <Card variant="accent" padding="md" className="animate-fade-in">
        <HStack gap="4" align="center" justify="between">
          <HStack gap="3" align="center" className="flex-1">
            <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-brand" />
            </div>
            <VStack gap="1" align="start" className="flex-1 min-w-0">
              <Card.Label className="text-brand mb-0">You're a Free Agent</Card.Label>
              <Card.Title className="text-white mb-0 text-base">
                Team captains can find you in the Marketplace
              </Card.Title>
              {pendingInviteCount > 0 && (
                <p className="text-sm text-text-body mt-1">
                  You have {pendingInviteCount} pending invite{pendingInviteCount !== 1 ? 's' : ''}
                </p>
              )}
            </VStack>
          </HStack>
          {pendingInviteCount > 0 && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigate('marketplace', { tab: 'teams' })}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              View Invites
            </Button>
          )}
        </HStack>
      </Card>
    );
  }

  // Observer Status
  if (isObserver) {
    return (
      <Card variant="accent" padding="md" className="animate-fade-in">
        <HStack gap="3" align="center">
          <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0">
            <Eye className="w-6 h-6 text-brand" />
          </div>
          <VStack gap="1" align="start" className="flex-1 min-w-0">
            <Card.Label className="text-brand mb-0">You're on Team Observers</Card.Label>
            <Card.Title className="text-white mb-0 text-base">
              as Member
            </Card.Title>
          </VStack>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('teams', { teamId: userTeam.id })}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            View Team
          </Button>
        </HStack>
      </Card>
    );
  }

  // On Team Status (only show role during registration/teams phase)
  if (userTeam && showTeamRole) {
    return (
      <Card variant="accent" padding="md" className="animate-fade-in">
        <HStack gap="3" align="center" justify="between">
          <HStack gap="3" align="center" className="flex-1">
            <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-brand" />
            </div>
            <VStack gap="1" align="start" className="flex-1 min-w-0">
              <Card.Label className="text-brand mb-0">You're on {userTeam.name}</Card.Label>
              <Card.Title className="text-white mb-0 text-base">
                as {isCaptain ? 'Captain' : 'Member'}
              </Card.Title>
            </VStack>
          </HStack>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('teams', { teamId: userTeam.id })}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            View Team
          </Button>
        </HStack>
      </Card>
    );
  }

  // On Team but hack has started (no role shown)
  if (userTeam && !showTeamRole) {
    return null;
  }

  return null;
}

export default StatusBanner;
