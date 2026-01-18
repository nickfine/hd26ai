# HackDay Testing Guide

## Overview

This guide provides instructions for comprehensive testing of the HackDay 2026 applications (HD26AI and HD26Forge).

## Test Structure

### Automated Tests

All automated tests are located in `/tests/` directory:

- `role-phase-matrix.test.js` - Role and phase definitions
- `participant-flow.test.js` - Participant journey tests
- `judge-flow.test.js` - Judge journey tests
- `admin-flow.test.js` - Admin journey tests
- `cross-platform.test.js` - Cross-platform consistency
- `phase-transitions.test.js` - Phase change tests
- `status-banner.test.js` - StatusBanner component tests
- `reminder-banner.test.js` - Reminder banner tests
- `auto-assignment.test.js` - Auto-assignment tests
- `reminder-check.test.js` - Reminder check tests
- `navigation.test.js` - Navigation visibility tests
- `edge-cases.test.js` - Edge cases and error handling
- `integration.test.js` - End-to-end integration tests

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm test:ui

# Run tests with coverage
npm test:coverage
```

## Manual Testing Checklist

### Pre-Test Setup

1. **Database Setup**
   - Use test database or clear existing data
   - Create test event with appropriate startDate
   - Set up test users for each role

2. **Environment Setup**
   - Enable dev mode: `VITE_ENABLE_DEV_MODE=true`
   - Start HD26AI dev server: `npm run dev`
   - Start HD26Forge tunnel: `forge tunnel`

### Test Execution Matrix

#### Participant Role

**Registration Phase:**
- [ ] Sign up with name, callsign, skills
- [ ] Verify `isFreeAgent: true` is set
- [ ] Verify appears in Free Agents list
- [ ] Verify StatusBanner shows "Free Agent"
- [ ] Verify navigation shows "Sign Up"

**Team Formation Phase:**
- [ ] Create team
- [ ] Verify becomes team captain
- [ ] Verify `isFreeAgent: false` after team creation
- [ ] Send invite to free agent
- [ ] Accept invite as free agent
- [ ] Request to join team
- [ ] Handle join request as captain
- [ ] Leave team (verify becomes free agent)
- [ ] Verify reminder banner shows (if event 24-48h away)

**Hacking Phase:**
- [ ] Verify team creation disabled
- [ ] Verify auto-assignment occurred (if was free agent)
- [ ] Verify StatusBanner shows team or observer status

**Submission Phase:**
- [ ] Submit project as captain
- [ ] Verify submission saved
- [ ] Verify team member can view but not edit

**Voting Phase:**
- [ ] Verify "Voting" appears in navigation
- [ ] Vote for up to 5 projects
- [ ] Verify vote count decreases
- [ ] Remove vote
- [ ] Verify vote persists after refresh

**Results Phase:**
- [ ] Verify Results page accessible
- [ ] Verify can see winners and rankings

#### Ambassador Role

**All Phases:**
- [ ] Same as Participant (ambassador has same permissions)
- [ ] Verify can vote in voting phase

#### Judge Role

**Registration Phase:**
- [ ] Sign up as judge
- [ ] Verify "Judge Scoring" appears in navigation

**Judging Phase:**
- [ ] Access Judge Scoring page
- [ ] Score a project (all 5 criteria)
- [ ] Verify scores saved
- [ ] Edit scores
- [ ] Verify "Analytics" accessible
- [ ] Verify "Voting" does NOT appear

**Results Phase:**
- [ ] Verify can see judge scores in results

#### Admin Role

**All Phases:**
- [ ] Verify "Admin Panel" accessible
- [ ] Change phase from registration to team_formation
  - [ ] Verify reminder check runs (check console)
- [ ] Change phase from team_formation to hacking
  - [ ] Verify auto-assignment runs (check console)
  - [ ] Verify free agents assigned to Observers
- [ ] View all users
- [ ] Change user role
- [ ] View event statistics
- [ ] Set MOTD (if in hacking phase)
- [ ] Verify dev mode controls work (if enabled)

#### Observer Role

**Registration Phase:**
- [ ] Sign up as observer
- [ ] Verify auto-assigned to Observers team
- [ ] Verify StatusBanner shows "You're on Team Observers"

**All Phases:**
- [ ] Verify read-only access
- [ ] Verify cannot create teams
- [ ] Verify cannot vote
- [ ] Verify cannot judge

### Cross-Platform Tests

**Phase Synchronization:**
- [ ] Change phase in HD26AI
- [ ] Verify phase updates in HD26Forge
- [ ] Change phase in HD26Forge (if admin controls exist)
- [ ] Verify phase updates in HD26AI

**Data Synchronization:**
- [ ] Create team in HD26AI
- [ ] Verify team appears in HD26Forge
- [ ] Vote in HD26AI
- [ ] Verify vote count in HD26Forge
- [ ] Submit project in HD26Forge
- [ ] Verify submission in HD26AI

### Phase Transition Tests

1. **Registration → Team Formation**
   - [ ] Change phase
   - [ ] Verify reminder check runs (console log)
   - [ ] Verify team creation still enabled

2. **Team Formation → Hacking**
   - [ ] Change phase
   - [ ] Verify auto-assignment runs (console log)
   - [ ] Verify free agents assigned to Observers
   - [ ] Verify team creation disabled

3. **Hacking → Submission**
   - [ ] Change phase
   - [ ] Verify submission enabled
   - [ ] Verify team captains can submit

4. **Submission → Voting**
   - [ ] Change phase
   - [ ] Verify Voting appears for participants/ambassadors
   - [ ] Verify Voting does NOT appear for judges

5. **Voting → Judging**
   - [ ] Change phase
   - [ ] Verify Voting removed
   - [ ] Verify Judge Scoring accessible

6. **Judging → Results**
   - [ ] Change phase
   - [ ] Verify Results page shows winners

### Edge Cases

- [ ] Team at max capacity (6 members)
- [ ] Captain leaves team
- [ ] Team deletion
- [ ] Vote limit (5 votes)
- [ ] Role change during event
- [ ] Submission after deadline
- [ ] Multiple submissions (update vs create)

## Test Results Template

For each test, record:

```
Test ID: TC-001
Role: participant
Phase: registration
Platform: HD26AI
Status: PASS/FAIL/SKIP
Notes: [Any observations]
Screenshot: [If applicable]
```

## Known Issues to Verify

- [ ] Free agent visibility (regression test)
- [ ] StatusBanner display (regression test)
- [ ] Team creation (regression test - trackSide field)
- [ ] Phase/role consistency (regression test)
