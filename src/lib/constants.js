/**
 * Shared Constants for Phase and Role Mappings
 * 
 * These constants ensure consistency between the database enum values
 * and the application's internal representation.
 */

// Phase mapping: DB enum (uppercase) -> app format (lowercase)
export const PHASE_MAP = {
  SETUP: 'setup',
  REGISTRATION: 'registration',
  TEAM_FORMATION: 'team_formation',
  HACKING: 'hacking',
  SUBMISSION: 'submission',
  VOTING: 'voting',
  JUDGING: 'judging',
  RESULTS: 'results',
};

// Reverse phase mapping: app format (lowercase) -> DB enum (uppercase)
export const REVERSE_PHASE_MAP = {
  setup: 'SETUP',
  registration: 'REGISTRATION',
  team_formation: 'TEAM_FORMATION',
  hacking: 'HACKING',
  submission: 'SUBMISSION',
  voting: 'VOTING',
  judging: 'JUDGING',
  results: 'RESULTS',
};

// Role mapping: DB enum (uppercase) -> app format (lowercase)
export const ROLE_MAP = {
  USER: 'participant',
  AMBASSADOR: 'ambassador',
  JUDGE: 'judge',
  ADMIN: 'admin',
};

// Reverse role mapping: app format (lowercase) -> DB enum (uppercase)
export const REVERSE_ROLE_MAP = {
  participant: 'USER',
  ambassador: 'AMBASSADOR',
  judge: 'JUDGE',
  admin: 'ADMIN',
};
