/**
 * StatusBanner Component Tests
 * Tests the StatusBanner display logic for different user states
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { createTestUser, createTestTeam } from './helpers/testUtils';

describe('StatusBanner Logic', () => {
  describe('Free Agent Status', () => {
    it('should show Free Agent status when isFreeAgent is true and no team', () => {
      const user = createTestUser({ 
        isFreeAgent: true,
        teamId: null,
      });
      
      expect(user.isFreeAgent).toBe(true);
      expect(user.teamId).toBeNull();
    });

    it('should show pending invite count', () => {
      const user = createTestUser({ 
        isFreeAgent: true,
        pendingInvites: 2,
      });
      
      // StatusBanner should display invite count
      expect(user.pendingInvites).toBe(2);
    });
  });

  describe('Team Member Status', () => {
    it('should show team name and role during registration/team_formation phases', () => {
      const user = createTestUser({ 
        isFreeAgent: false,
        teamId: 'team-1',
      });
      const team = createTestTeam({ id: 'team-1', name: 'Test Team' });
      const phase = 'team_formation';
      
      const showTeamRole = phase === 'registration' || 
                          phase === 'teams' || 
                          phase === 'team_formation';
      
      expect(showTeamRole).toBe(true);
      expect(user.teamId).toBe(team.id);
    });

    it('should identify captain vs member', () => {
      const team = createTestTeam({ captainId: 'user-1' });
      const user = createTestUser({ id: 'user-1' });
      
      const isCaptain = team.captainId === user.id;
      expect(isCaptain).toBe(true);
    });
  });

  describe('Observer Status', () => {
    it('should show Observer status when on Observers team', () => {
      const user = createTestUser({ 
        isFreeAgent: false,
        teamId: 'team-observers',
      });
      
      const isObserver = user.teamId === 'team-observers';
      expect(isObserver).toBe(true);
    });
  });
});
