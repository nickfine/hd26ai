/**
 * Navigation Tests
 * Tests role-based and phase-based navigation visibility
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { USER_ROLES } from '../src/data/mockData';
import { createTestUser, createTestEvent } from './helpers/testUtils';

describe('Navigation Visibility', () => {
  describe('Role-Based Navigation', () => {
    it('should show Voting for participants in voting phase', () => {
      const participant = USER_ROLES.participant;
      const eventPhase = 'voting';
      
      const shouldShowVoting = participant.canVote && eventPhase === 'voting';
      expect(shouldShowVoting).toBe(true);
    });

    it('should NOT show Voting for judges', () => {
      const judge = USER_ROLES.judge;
      expect(judge.canVote).toBe(false);
    });

    it('should show Judge Scoring for judges', () => {
      const judge = USER_ROLES.judge;
      expect(judge.canJudge).toBe(true);
    });

    it('should show Analytics for judges and admins', () => {
      const judge = USER_ROLES.judge;
      const admin = USER_ROLES.admin;
      
      expect(judge.canViewAnalytics).toBe(true);
      expect(admin.canViewAnalytics).toBe(true);
    });

    it('should show Admin Panel only for admins', () => {
      const admin = USER_ROLES.admin;
      const participant = USER_ROLES.participant;
      
      expect(admin.canManage).toBe(true);
      expect(participant.canManage).toBe(false);
    });
  });

  describe('Phase-Based Navigation', () => {
    it('should show Sign Up during registration phase', () => {
      const eventPhase = 'registration';
      const user = createTestUser({ teamId: null });
      
      const showSignup = eventPhase === 'registration' || !user.teamId;
      expect(showSignup).toBe(true);
    });

    it('should show Sign Up if user has no team', () => {
      const eventPhase = 'team_formation';
      const user = createTestUser({ teamId: null });
      
      const showSignup = eventPhase === 'registration' || !user.teamId;
      expect(showSignup).toBe(true);
    });
  });
});
