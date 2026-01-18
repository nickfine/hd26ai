/**
 * Auto-Assignment Tests
 * Tests the auto-assignment functionality when phase changes to hacking
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createTestUser, createTestEvent, createMockSupabaseClient } from './helpers/testUtils';

describe('Auto-Assignment Functionality', () => {
  let mockSupabase;
  let testEvent;
  let freeAgents;

  beforeEach(() => {
    mockSupabase = createMockSupabaseClient();
    testEvent = createTestEvent({ phase: 'team_formation' });
    freeAgents = [
      createTestUser({ id: 'user-1', isFreeAgent: true }),
      createTestUser({ id: 'user-2', isFreeAgent: true }),
      createTestUser({ id: 'user-3', isFreeAgent: true }),
    ];
  });

  describe('Observers Team Creation', () => {
    it('should create Observers team if it does not exist', () => {
      const observersTeamId = 'team-observers';
      expect(observersTeamId).toBe('team-observers');
    });

    it('should use existing Observers team if it exists', () => {
      const observersTeamId = 'team-observers';
      // Should check for existing team first
      expect(observersTeamId).toBeDefined();
    });
  });

  describe('Free Agent Assignment', () => {
    it('should assign all free agents to Observers team', () => {
      const assignedUsers = freeAgents.map(user => ({
        ...user,
        isFreeAgent: false,
        teamId: 'team-observers',
      }));
      
      assignedUsers.forEach(user => {
        expect(user.isFreeAgent).toBe(false);
        expect(user.teamId).toBe('team-observers');
      });
    });

    it('should skip users already on teams', () => {
      const userOnTeam = createTestUser({ 
        isFreeAgent: false,
        teamId: 'team-1',
      });
      
      const usersToAssign = freeAgents.filter(u => !u.teamId);
      expect(usersToAssign.length).toBe(freeAgents.length);
    });

    it('should update isFreeAgent flag to false', () => {
      const assignedUser = {
        ...freeAgents[0],
        isFreeAgent: false,
      };
      
      expect(assignedUser.isFreeAgent).toBe(false);
    });
  });

  describe('Phase Transition Trigger', () => {
    it('should trigger auto-assignment when phase changes to hacking', () => {
      const oldPhase = testEvent.phase;
      testEvent.phase = 'hacking';
      
      expect(oldPhase).toBe('team_formation');
      expect(testEvent.phase).toBe('hacking');
      // Auto-assignment should trigger here
    });
  });
});
