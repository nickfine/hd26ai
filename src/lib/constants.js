/**
 * Shared Constants for Phase and Role Mappings
 * 
 * These constants ensure consistency between the database enum values
 * and the application's internal representation.
 */

// Demo event ID - shared with HD26Forge for unified demo data
// This event is seeded via supabase/migrations/seed_demo_data.sql
export const DEMO_EVENT_ID = 'demo-event-2026';

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

/**
 * Validates that a URL is a valid http/https URL
 * Used to prevent XSS via javascript: or data: URLs
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if the URL is valid http/https
 */
export const isValidUrl = (url) => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};
