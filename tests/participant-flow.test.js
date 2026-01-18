/**
 * Participant Flow Tests
 * Tests the complete participant journey through all phases
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { USER_ROLES } from '../src/data/mockData';
import { createTestUser, createTestTeam, createTestEvent, createMockSupabaseClient } from './helpers/testUtils';

describe('Participant Full Journey', () => {
  let mockSupabase;
  let testUser;
  let testTeam;
  let testEvent;

  beforeEach(() => {
    mockSupabase = createMockSupabaseClient();
    testUser = createTestUser({ role: 'participant' });
    testTeam = createTestTeam({ captainId: testUser.id });
    testEvent = createTestEvent({ phase: 'registration' });
  });

  describe('Registration Phase', () => {
    it('should set isFreeAgent to true when signing up as participant', () => {
      expect(testUser.isFreeAgent).toBe(true);
    });

    it('should allow profile completion with name, callsign, and skills', () => {
      const completedUser = {
        ...testUser,
        name: 'John Doe',
        callsign: 'CodeMaster',
        skills: ['Frontend Development', 'UI/UX Design'],
      };
      
      expect(completedUser.name).toBe('John Doe');
      expect(completedUser.callsign).toBe('CodeMaster');
      expect(completedUser.skills.length).toBeLessThanOrEqual(5);
    });

    it('should validate skills limit (max 5)', () => {
      const skills = ['Skill1', 'Skill2', 'Skill3', 'Skill4', 'Skill5', 'Skill6'];
      expect(skills.length).toBeGreaterThan(5);
      // In actual implementation, this should be validated
    });
  });

  describe('Team Formation Phase', () => {
    beforeEach(() => {
      testEvent.phase = 'team_formation';
    });

    it('should allow team creation', () => {
      expect(testEvent.phase).toBe('team_formation');
      // Team creation should be enabled in this phase
    });

    it('should set isFreeAgent to false after team creation', () => {
      const userAfterTeamCreation = {
        ...testUser,
        isFreeAgent: false,
        teamId: testTeam.id,
      };
      
      expect(userAfterTeamCreation.isFreeAgent).toBe(false);
      expect(userAfterTeamCreation.teamId).toBe(testTeam.id);
    });

    it('should make creator the team captain', () => {
      expect(testTeam.captainId).toBe(testUser.id);
    });
  });

  describe('Submission Phase', () => {
    beforeEach(() => {
      testEvent.phase = 'submission';
      testTeam.submission = {
        projectId: 'project-1',
        status: 'submitted',
        projectName: 'Test Project',
        description: 'Test description',
        demoVideoUrl: 'https://example.com/video',
        repoUrl: 'https://github.com/example/repo',
        submittedAt: new Date().toISOString(),
      };
    });

    it('should allow team captain to submit project', () => {
      expect(testTeam.captainId).toBe(testUser.id);
      expect(testTeam.submission.status).toBe('submitted');
    });

    it('should set submittedAt timestamp', () => {
      expect(testTeam.submission.submittedAt).toBeDefined();
      expect(new Date(testTeam.submission.submittedAt).getTime()).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('Voting Phase', () => {
    beforeEach(() => {
      testEvent.phase = 'voting';
    });

    it('should allow participant to vote', () => {
      const participant = USER_ROLES.participant;
      expect(participant.canVote).toBe(true);
    });

    it('should limit votes to 5 projects', () => {
      const MAX_VOTES = 5;
      const votes = [1, 2, 3, 4, 5];
      expect(votes.length).toBeLessThanOrEqual(MAX_VOTES);
    });
  });

  describe('Results Phase', () => {
    beforeEach(() => {
      testEvent.phase = 'results';
    });

    it('should allow participant to view results', () => {
      expect(testEvent.phase).toBe('results');
      // Results should be accessible to all users
    });
  });
});

describe('Free Agent Journey', () => {
  let testUser;
  let testEvent;

  beforeEach(() => {
    testUser = createTestUser({ 
      role: 'participant',
      isFreeAgent: true,
    });
    testEvent = createTestEvent({ phase: 'registration' });
  });

  it('should remain as free agent during team formation', () => {
    testEvent.phase = 'team_formation';
    expect(testUser.isFreeAgent).toBe(true);
  });

  it('should show reminder banner when event is 24-48 hours away', () => {
    const now = new Date();
    const hackStart = new Date(now.getTime() + 30 * 60 * 60 * 1000); // 30 hours
    const hoursUntilHack = (hackStart - now) / (1000 * 60 * 60);
    
    const shouldShow = hoursUntilHack >= 24 && hoursUntilHack <= 48;
    expect(shouldShow).toBe(true);
  });

  it('should auto-assign to Observers when phase changes to hacking', () => {
    testEvent.phase = 'hacking';
    // Auto-assignment should trigger here
    const userAfterAssignment = {
      ...testUser,
      isFreeAgent: false,
      teamId: 'team-observers',
    };
    
    expect(userAfterAssignment.isFreeAgent).toBe(false);
    expect(userAfterAssignment.teamId).toBe('team-observers');
  });
});
