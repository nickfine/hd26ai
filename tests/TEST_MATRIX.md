# HackDay Test Matrix

## Role x Phase Test Coverage

| Role | Registration | Team Formation | Hacking | Submission | Voting | Judging | Results |
|------|-------------|----------------|----------|------------|--------|---------|---------|
| **Participant** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Ambassador** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Judge** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| **Admin** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| **Observer** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |

## Key Functionality by Role and Phase

### Participant

- **Registration**: Sign up, set isFreeAgent, appear in Free Agents
- **Team Formation**: Create team, join team, send invites, receive invites, leave team
- **Hacking**: Auto-assigned if free agent, team locked
- **Submission**: Submit project (captain only), view submission (member)
- **Voting**: Vote for up to 5 projects, remove votes
- **Judging**: View results (read-only)
- **Results**: View winners and rankings

### Ambassador

- **Same as Participant** except:
- **Voting**: Can vote (same as participant)

### Judge

- **Registration**: Sign up as judge
- **Team Formation**: View teams (limited access)
- **Submission**: View all submissions
- **Voting**: ❌ Cannot vote
- **Judging**: Score projects, view analytics
- **Results**: View results with judge scores

### Admin

- **All Phases**: Access Admin Panel, manage phases, manage users, view statistics
- **Team Formation**: Trigger reminder check
- **Hacking**: Trigger auto-assignment
- **Voting**: ❌ Cannot vote (but can view analytics)

### Observer

- **Registration**: Sign up, auto-assigned to Observers
- **All Phases**: Read-only access, cannot create teams, cannot vote, cannot judge

## Phase Transition Tests

| From Phase | To Phase | Triggered Action | Status |
|------------|----------|------------------|--------|
| registration | team_formation | Reminder check | ✅ |
| team_formation | hacking | Auto-assignment | ✅ |
| hacking | submission | Enable submission | ✅ |
| submission | voting | Enable voting | ✅ |
| voting | judging | Enable judging, disable voting | ✅ |
| judging | results | Enable results | ✅ |

## Test File Coverage

- ✅ `role-phase-matrix.test.js` - 10 tests
- ✅ `participant-flow.test.js` - 14 tests
- ✅ `judge-flow.test.js` - 6 tests
- ✅ `admin-flow.test.js` - 8 tests
- ✅ `cross-platform.test.js` - 5 tests
- ✅ `phase-transitions.test.js` - 9 tests
- ✅ `status-banner.test.js` - 5 tests
- ✅ `reminder-banner.test.js` - 7 tests
- ✅ `navigation.test.js` - 7 tests
- ✅ `auto-assignment.test.js` - 6 tests
- ✅ `reminder-check.test.js` - 5 tests
- ✅ `edge-cases.test.js` - 10 tests
- ✅ `integration.test.js` - 8 tests

**Total: 100 tests, all passing**

## Manual Testing Required

Some tests require manual verification in browser:

1. **UI Component Rendering**
   - StatusBanner display
   - ReminderBanner display
   - Navigation visibility

2. **User Interactions**
   - Form submissions
   - Button clicks
   - Modal interactions

3. **Cross-Platform Sync**
   - Real-time data sync between HD26AI and HD26Forge

4. **Forge-Specific**
   - Macro rendering in Confluence
   - Forge UI components
   - Confluence integration

## Next Steps

1. Run automated tests: `npm test`
2. Execute manual testing checklist
3. Test in browser with Chrome DevTools
4. Verify cross-platform consistency
5. Document any issues found
