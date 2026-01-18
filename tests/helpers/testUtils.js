/**
 * Test Utility Functions
 * Helper functions for setting up test scenarios
 */

import { vi } from 'vitest';

/**
 * Mock Supabase client for testing
 */
export function createMockSupabaseClient() {
  const mockData = {
    users: [],
    teams: [],
    projects: [],
    votes: [],
    scores: [],
    events: [],
    teamMembers: [],
    teamInvites: [],
  };

  return {
    from: (table) => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null })),
          maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: null })),
          limit: vi.fn(() => Promise.resolve({ data: [], error: null })),
        })),
        in: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ data: [], error: null })),
        })),
        order: vi.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: null, error: null })),
        in: vi.fn(() => Promise.resolve({ data: null, error: null })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: null, error: null })),
      })),
    }),
    channel: vi.fn(() => ({
      on: vi.fn(() => ({
        subscribe: vi.fn(() => ({ unsubscribe: vi.fn() })),
      })),
    })),
    removeChannel: vi.fn(),
    _mockData: mockData,
  };
}

/**
 * Create a test user with specific role
 */
export function createTestUser(overrides = {}) {
  return {
    id: `test-user-${Date.now()}`,
    name: 'Test User',
    email: 'test@example.com',
    role: 'participant',
    skills: [],
    isFreeAgent: true,
    autoAssignOptIn: false,
    callsign: '',
    bio: '',
    image: null,
    teamId: null,
    ...overrides,
  };
}

/**
 * Create a test team
 */
export function createTestTeam(overrides = {}) {
  return {
    id: `test-team-${Date.now()}`,
    name: 'Test Team',
    description: 'Test team description',
    captainId: `test-user-${Date.now()}`,
    members: [],
    maxMembers: 6,
    lookingFor: [],
    submission: null,
    isAutoCreated: false,
    ...overrides,
  };
}

/**
 * Create a test event
 */
export function createTestEvent(overrides = {}) {
  const now = new Date();
  const hackStart = new Date(now.getTime() + 48 * 60 * 60 * 1000); // 48 hours from now
  
  return {
    id: 'test-event-1',
    name: 'HackDay 2026',
    slug: 'hd26',
    year: 2026,
    phase: 'registration',
    startDate: hackStart.toISOString(),
    endDate: new Date(hackStart.getTime() + 48 * 60 * 60 * 1000).toISOString(),
    isCurrent: true,
    motd: '',
    ...overrides,
  };
}

/**
 * Mock phase change function
 */
export function mockPhaseChange(supabase, eventId, newPhase) {
  return supabase
    .from('Event')
    .update({ phase: newPhase, updatedAt: new Date().toISOString() })
    .eq('id', eventId);
}

/**
 * Wait for async operations
 */
export function waitFor(ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create mock navigation function
 */
export function createMockNavigate() {
  return vi.fn((view, options) => {
    console.log('Navigate:', view, options);
  });
}
