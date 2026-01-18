# HackDay Testing Suite

## Overview

Comprehensive test suite for HackDay 2026 applications covering all roles, phases, and functionality across both HD26AI (web app) and HD26Forge (Confluence macro).

## Test Structure

### Automated Tests (100 tests)

All tests use Vitest and are located in `/tests/`:

1. **Core Tests**
   - `role-phase-matrix.test.js` - Role and phase definitions (10 tests)
   - `participant-flow.test.js` - Participant journey (14 tests)
   - `judge-flow.test.js` - Judge journey (6 tests)
   - `admin-flow.test.js` - Admin journey (8 tests)
   - `cross-platform.test.js` - Cross-platform consistency (5 tests)

2. **Feature Tests**
   - `phase-transitions.test.js` - Phase change logic (9 tests)
   - `status-banner.test.js` - StatusBanner component (5 tests)
   - `reminder-banner.test.js` - Reminder banner logic (7 tests)
   - `navigation.test.js` - Navigation visibility (7 tests)
   - `auto-assignment.test.js` - Auto-assignment functionality (6 tests)
   - `reminder-check.test.js` - Reminder check logic (5 tests)

3. **Edge Cases & Integration**
   - `edge-cases.test.js` - Edge cases and error handling (10 tests)
   - `integration.test.js` - End-to-end workflows (8 tests)

### Test Utilities

- `helpers/testUtils.js` - Helper functions for test setup
- `setup.js` - Test environment configuration

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm test:ui

# Run tests with coverage
npm test:coverage

# Run specific test file
npm test -- role-phase-matrix.test.js
```

## Test Coverage

### Roles Tested
- ✅ Participant
- ✅ Ambassador
- ✅ Judge
- ✅ Admin
- ✅ Observer

### Phases Tested
- ✅ Registration
- ✅ Team Formation
- ✅ Hacking
- ✅ Submission
- ✅ Voting
- ✅ Judging
- ✅ Results

### Key Features Tested
- ✅ Role-based permissions
- ✅ Phase-based feature flags
- ✅ Navigation visibility
- ✅ StatusBanner display logic
- ✅ Reminder banner logic
- ✅ Auto-assignment functionality
- ✅ Phase transitions
- ✅ Cross-platform consistency

## Manual Testing

See `TESTING_GUIDE.md` for comprehensive manual testing checklist.

## Test Results

**Current Status:** ✅ 100 tests passing

```
Test Files  13 passed (13)
Tests       100 passed (100)
```

## Next Steps

1. ✅ Automated tests implemented and passing
2. ⏳ Execute manual testing checklist
3. ⏳ Browser testing with Chrome DevTools
4. ⏳ Cross-platform consistency verification
5. ⏳ Performance and load testing

## Documentation

- `TESTING_GUIDE.md` - Comprehensive testing guide
- `TEST_MATRIX.md` - Test coverage matrix
- `../tests/MANUAL_TESTING_CHECKLIST.md` (Forge) - Forge-specific manual tests
