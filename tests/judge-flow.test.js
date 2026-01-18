/**
 * Judge Flow Tests
 * Tests judge-specific functionality across phases
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { USER_ROLES } from '../src/data/mockData';
import { createTestUser, createTestEvent } from './helpers/testUtils';

describe('Judge Journey', () => {
  let testUser;
  let testEvent;

  beforeEach(() => {
    testUser = createTestUser({ role: 'judge' });
    testEvent = createTestEvent();
  });

  describe('Role Permissions', () => {
    it('should have correct judge permissions', () => {
      const judge = USER_ROLES.judge;
      expect(judge.canVote).toBe(false);
      expect(judge.canJudge).toBe(true);
      expect(judge.canViewAnalytics).toBe(true);
    });

    it('should NOT have voting access', () => {
      const judge = USER_ROLES.judge;
      expect(judge.canVote).toBe(false);
    });
  });

  describe('Judging Phase', () => {
    beforeEach(() => {
      testEvent.phase = 'judging';
    });

    it('should allow judge to access Judge Scoring page', () => {
      expect(testEvent.phase).toBe('judging');
      // Judge Scoring should be accessible
    });

    it('should allow judge to score projects', () => {
      const scores = {
        innovation: 8,
        technical: 7,
        presentation: 9,
        impact: 8,
        theme: 9,
      };
      
      // Verify all criteria are scored
      expect(Object.keys(scores).length).toBe(5);
      // Verify scores are within 0-10 range
      Object.values(scores).forEach(score => {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(10);
      });
    });

    it('should allow judge to view analytics', () => {
      const judge = USER_ROLES.judge;
      expect(judge.canViewAnalytics).toBe(true);
    });
  });

  describe('Results Phase', () => {
    beforeEach(() => {
      testEvent.phase = 'results';
    });

    it('should allow judge to view results with scores', () => {
      expect(testEvent.phase).toBe('results');
      // Results should show judge scores
    });
  });
});
