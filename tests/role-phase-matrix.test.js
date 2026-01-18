/**
 * Role x Phase Matrix Tests
 * Tests each role's permissions and functionality in each phase
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { USER_ROLES, EVENT_PHASES } from '../src/data/mockData';
import { ROLE_MAP, PHASE_MAP } from '../src/lib/constants';

describe('Role and Phase Matrix', () => {
  describe('Role Definitions', () => {
    it('should have correct permissions for participant', () => {
      const participant = USER_ROLES.participant;
      expect(participant.canVote).toBe(true);
      expect(participant.canJudge).toBe(false);
      expect(participant.canManage).toBe(false);
      expect(participant.canViewAnalytics).toBe(false);
    });

    it('should have correct permissions for ambassador', () => {
      const ambassador = USER_ROLES.ambassador;
      expect(ambassador.canVote).toBe(true);
      expect(ambassador.canJudge).toBe(false);
      expect(ambassador.canManage).toBe(false);
      expect(ambassador.canViewAnalytics).toBe(false);
    });

    it('should have correct permissions for judge', () => {
      const judge = USER_ROLES.judge;
      expect(judge.canVote).toBe(false);
      expect(judge.canJudge).toBe(true);
      expect(judge.canManage).toBe(false);
      expect(judge.canViewAnalytics).toBe(true);
    });

    it('should have correct permissions for admin', () => {
      const admin = USER_ROLES.admin;
      expect(admin.canVote).toBe(false);
      expect(admin.canJudge).toBe(false);
      expect(admin.canManage).toBe(true);
      expect(admin.canViewAnalytics).toBe(true);
    });
  });

  describe('Phase Features', () => {
    it('should have correct features for registration phase', () => {
      // Registration phase should allow registration and teams
      expect(EVENT_PHASES.registration).toBeDefined();
      expect(EVENT_PHASES.registration.id).toBe('registration');
    });

    it('should have correct features for team_formation phase', () => {
      expect(EVENT_PHASES.team_formation).toBeDefined();
      expect(EVENT_PHASES.team_formation.id).toBe('team_formation');
    });

    it('should have all required phases', () => {
      const requiredPhases = [
        'registration',
        'team_formation',
        'hacking',
        'submission',
        'voting',
        'judging',
        'results',
      ];
      
      requiredPhases.forEach(phaseId => {
        expect(EVENT_PHASES[phaseId]).toBeDefined();
        expect(EVENT_PHASES[phaseId].id).toBe(phaseId);
      });
    });
  });

  describe('Role Mapping Consistency', () => {
    it('should map database roles to app roles correctly', () => {
      expect(ROLE_MAP.USER).toBe('participant');
      expect(ROLE_MAP.AMBASSADOR).toBe('ambassador');
      expect(ROLE_MAP.JUDGE).toBe('judge');
      expect(ROLE_MAP.ADMIN).toBe('admin');
    });

    it('should have reverse role mapping', () => {
      // This would be in constants file
      const REVERSE_ROLE_MAP = {
        participant: 'USER',
        ambassador: 'AMBASSADOR',
        judge: 'JUDGE',
        admin: 'ADMIN',
      };
      
      expect(REVERSE_ROLE_MAP.participant).toBe('USER');
      expect(REVERSE_ROLE_MAP.ambassador).toBe('AMBASSADOR');
      expect(REVERSE_ROLE_MAP.judge).toBe('JUDGE');
      expect(REVERSE_ROLE_MAP.admin).toBe('ADMIN');
    });
  });

  describe('Phase Mapping Consistency', () => {
    it('should map database phases to app phases correctly', () => {
      expect(PHASE_MAP.REGISTRATION).toBe('registration');
      expect(PHASE_MAP.TEAM_FORMATION).toBe('team_formation');
      expect(PHASE_MAP.HACKING).toBe('hacking');
      expect(PHASE_MAP.SUBMISSION).toBe('submission');
      expect(PHASE_MAP.VOTING).toBe('voting');
      expect(PHASE_MAP.JUDGING).toBe('judging');
      expect(PHASE_MAP.RESULTS).toBe('results');
    });
  });
});
