/**
 * Cross-Platform Consistency Tests
 * Tests that HD26AI and HD26Forge maintain data consistency
 */

import { describe, it, expect } from 'vitest';
import { PHASE_MAP, ROLE_MAP } from '../src/lib/constants';
import { EVENT_PHASES } from '../src/data/mockData';

describe('Cross-Platform Consistency', () => {
  describe('Phase Synchronization', () => {
    it('should use consistent phase IDs', () => {
      const expectedPhases = [
        'registration',
        'team_formation',
        'hacking',
        'submission',
        'voting',
        'judging',
        'results',
      ];
      
      expectedPhases.forEach(phaseId => {
        expect(EVENT_PHASES[phaseId]).toBeDefined();
        expect(EVENT_PHASES[phaseId].id).toBe(phaseId);
      });
    });

    it('should map database phases consistently', () => {
      expect(PHASE_MAP.REGISTRATION).toBe('registration');
      expect(PHASE_MAP.TEAM_FORMATION).toBe('team_formation');
      expect(PHASE_MAP.SUBMISSION).toBe('submission');
    });
  });

  describe('Role Consistency', () => {
    it('should map database roles consistently', () => {
      expect(ROLE_MAP.USER).toBe('participant');
      expect(ROLE_MAP.AMBASSADOR).toBe('ambassador');
      expect(ROLE_MAP.JUDGE).toBe('judge');
      expect(ROLE_MAP.ADMIN).toBe('admin');
    });

    it('should have ambassador role in both platforms', () => {
      expect(ROLE_MAP.AMBASSADOR).toBe('ambassador');
    });
  });

  describe('Data Structure Consistency', () => {
    it('should have consistent phase order', () => {
      const phaseOrder = [
        'registration',
        'team_formation',
        'hacking',
        'submission',
        'voting',
        'judging',
        'results',
      ];
      
      phaseOrder.forEach((phaseId, index) => {
        expect(EVENT_PHASES[phaseId].order).toBe(index + 1);
      });
    });
  });
});
