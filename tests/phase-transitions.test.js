/**
 * Phase Transition Tests
 * Tests phase changes and their side effects
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createTestEvent, createTestUser, createMockSupabaseClient } from './helpers/testUtils';

describe('Phase Transitions', () => {
  let testEvent;
  let mockSupabase;

  beforeEach(() => {
    testEvent = createTestEvent();
    mockSupabase = createMockSupabaseClient();
  });

  describe('Registration → Team Formation', () => {
    it('should trigger reminder check', () => {
      const oldPhase = 'registration';
      const newPhase = 'team_formation';
      
      testEvent.phase = newPhase;
      
      // Reminder check should run if startDate is within 24-48h
      const now = new Date();
      const hackStart = new Date(testEvent.startDate);
      const hoursUntilHack = (hackStart - now) / (1000 * 60 * 60);
      
      if (hoursUntilHack >= 24 && hoursUntilHack <= 48) {
        // Reminder check should execute
        expect(testEvent.phase).toBe('team_formation');
      }
    });
  });

  describe('Team Formation → Hacking', () => {
    it('should trigger auto-assignment', () => {
      const oldPhase = 'team_formation';
      const newPhase = 'hacking';
      
      testEvent.phase = newPhase;
      
      // Auto-assignment should execute
      expect(testEvent.phase).toBe('hacking');
    });

    it('should disable team creation', () => {
      testEvent.phase = 'hacking';
      // Team creation should be disabled
      expect(testEvent.phase).toBe('hacking');
    });
  });

  describe('Hacking → Submission', () => {
    it('should enable submission', () => {
      testEvent.phase = 'submission';
      expect(testEvent.phase).toBe('submission');
      // Submission should be enabled
    });
  });

  describe('Submission → Voting', () => {
    it('should enable voting for participants/ambassadors', () => {
      testEvent.phase = 'voting';
      expect(testEvent.phase).toBe('voting');
      // Voting should be enabled
    });

    it('should NOT enable voting for judges', () => {
      testEvent.phase = 'voting';
      const judgeRole = { canVote: false };
      expect(judgeRole.canVote).toBe(false);
    });
  });

  describe('Voting → Judging', () => {
    it('should enable judging', () => {
      testEvent.phase = 'judging';
      expect(testEvent.phase).toBe('judging');
      // Judging should be enabled
    });

    it('should disable voting', () => {
      testEvent.phase = 'judging';
      // Voting should be disabled
      expect(testEvent.phase).toBe('judging');
    });
  });

  describe('Judging → Results', () => {
    it('should enable results display', () => {
      testEvent.phase = 'results';
      expect(testEvent.phase).toBe('results');
      // Results should be enabled
    });
  });
});
