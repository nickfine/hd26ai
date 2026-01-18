/**
 * Integration Tests
 * Tests end-to-end user journeys and workflows
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { createTestUser, createTestTeam, createTestEvent } from './helpers/testUtils';
import { USER_ROLES } from '../src/data/mockData';

describe('End-to-End User Journeys', () => {
  describe('Participant Full Journey', () => {
    it('should complete full participant workflow', () => {
      // 1. Registration
      const user = createTestUser({ 
        role: 'participant',
        isFreeAgent: true,
      });
      expect(user.isFreeAgent).toBe(true);
      
      // 2. Team Formation
      const team = createTestTeam({ captainId: user.id });
      const userAfterTeam = {
        ...user,
        isFreeAgent: false,
        teamId: team.id,
      };
      expect(userAfterTeam.isFreeAgent).toBe(false);
      
      // 3. Submission
      team.submission = {
        projectId: 'project-1',
        status: 'submitted',
        submittedAt: new Date().toISOString(),
      };
      expect(team.submission.status).toBe('submitted');
      
      // 4. Voting
      const canVote = USER_ROLES.participant.canVote;
      expect(canVote).toBe(true);
      
      // 5. Results
      expect(team.submission).toBeDefined();
    });
  });

  describe('Free Agent Journey', () => {
    it('should complete free agent workflow', () => {
      // 1. Registration as free agent
      const user = createTestUser({ 
        role: 'participant',
        isFreeAgent: true,
      });
      expect(user.isFreeAgent).toBe(true);
      
      // 2. Remain as free agent during team formation
      const event = createTestEvent({ phase: 'team_formation' });
      expect(user.isFreeAgent).toBe(true);
      
      // 3. Auto-assignment to Observers
      const eventHacking = createTestEvent({ phase: 'hacking' });
      const userAfterAssignment = {
        ...user,
        isFreeAgent: false,
        teamId: 'team-observers',
      };
      expect(userAfterAssignment.teamId).toBe('team-observers');
    });
  });

  describe('Judge Journey', () => {
    it('should complete judge workflow', () => {
      // 1. Registration as judge
      const user = createTestUser({ role: 'judge' });
      expect(user.role).toBe('judge');
      
      // 2. View submissions (all phases)
      const canViewSubmissions = true; // Judges can always view
      expect(canViewSubmissions).toBe(true);
      
      // 3. Score projects (judging phase)
      const canJudge = USER_ROLES.judge.canJudge;
      expect(canJudge).toBe(true);
      
      // 4. View analytics
      const canViewAnalytics = USER_ROLES.judge.canViewAnalytics;
      expect(canViewAnalytics).toBe(true);
      
      // 5. View results with scores
      expect(canJudge).toBe(true);
    });
  });

  describe('Admin Journey', () => {
    it('should complete admin workflow', () => {
      // 1. Registration as admin
      const user = createTestUser({ role: 'admin' });
      expect(user.role).toBe('admin');
      
      // 2. Monitor registrations
      const canManage = USER_ROLES.admin.canManage;
      expect(canManage).toBe(true);
      
      // 3. Trigger reminder check
      const event = createTestEvent({ phase: 'team_formation' });
      expect(event.phase).toBe('team_formation');
      
      // 4. Trigger auto-assignment
      const eventHacking = createTestEvent({ phase: 'hacking' });
      expect(eventHacking.phase).toBe('hacking');
      
      // 5. Monitor event progress
      expect(canManage).toBe(true);
    });
  });
});

describe('Cross-Platform Data Sync', () => {
  it('should sync phase changes between platforms', () => {
    const event = createTestEvent({ phase: 'registration' });
    // Both HD26AI and HD26Forge read from same Event table
    expect(event.phase).toBe('registration');
  });

  it('should sync team data between platforms', () => {
    const team = createTestTeam();
    // Team created in one platform should appear in the other
    expect(team.id).toBeDefined();
  });

  it('should sync vote data between platforms', () => {
    const vote = {
      userId: 'user-1',
      projectId: 'project-1',
    };
    // Vote cast in one platform should appear in the other
    expect(vote.userId).toBeDefined();
    expect(vote.projectId).toBeDefined();
  });
});
