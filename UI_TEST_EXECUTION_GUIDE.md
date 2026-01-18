# UI Logic Test Execution Guide

## Overview

This guide provides step-by-step instructions for executing the comprehensive UI logic tests across all role/phase combinations in both HD26AI and HD26Forge applications.

## Prerequisites

1. **HD26AI Access:**
   - Production URL: https://hd26ai.vercel.app
   - Or preview/deployment URL
   - Admin account credentials

2. **HD26Forge Access:**
   - Confluence instance with HD26Forge macro installed
   - Development environment with Forge tunnel running (if testing locally)
   - Admin account credentials

3. **Browser Setup:**
   - Chrome/Edge with DevTools access
   - Multiple tabs or windows for side-by-side comparison

## Test Execution Workflow

### Step 1: Initial Setup

1. **Open HD26AI:**
   - Navigate to https://hd26ai.vercel.app
   - Authenticate as admin user
   - Navigate to Dashboard
   - Enable dev mode toggle (click "DEV" button in header)
   - Verify dev controls dropdown is visible

2. **Open HD26Forge:**
   - Navigate to Confluence page with HD26Forge macro
   - Authenticate as admin user
   - Verify macro loads
   - Enable dev mode toggle (click "DEV" button)
   - Verify dev controls dropdown is visible

### Step 2: Test Execution Pattern

For each role × phase combination:

1. **Set Role:**
   - Click "DEV" button to open dev controls
   - Click "Role Impersonation" dropdown
   - Select target role (Participant, Ambassador, Judge, Admin)
   - Verify role change is reflected in UI

2. **Set Phase:**
   - In same dev controls dropdown
   - Click "Event Phase" dropdown
   - Select target phase (Registration, Team Formation, Hacking, Submission, Voting, Judging, Results)
   - Verify phase change is reflected in UI

3. **Execute Test Scenarios:**
   - Follow the test scenario checklist below
   - Document results in UI_TEST_RESULTS.md
   - Capture screenshots for key states

4. **Repeat for Both Apps:**
   - Execute same role/phase combination in HD26Forge
   - Compare results between apps
   - Document any inconsistencies

### Step 3: Test Scenario Checklist

For each role × phase combination, verify:

#### Navigation Visibility
- [ ] Sidebar navigation items match expected role/phase
- [ ] Dashboard tabs match expected role/phase  
- [ ] Role-specific buttons (Judge, Admin) visible/hidden correctly
- [ ] Phase-specific navigation items visible/hidden correctly

#### Status Banners
- [ ] StatusBanner displays correct status (Free Agent / On Team / Observer)
- [ ] StatusBanner shows team role only in registration/team_formation phases
- [ ] FreeAgentReminderBanner shows/hides correctly (if applicable, 24-48h window)

#### Feature Availability
- [ ] Team creation button visible/hidden based on phase and role
- [ ] Team joining/leaving enabled/disabled based on phase
- [ ] Submission form accessible/restricted based on role and phase
- [ ] Voting interface accessible/restricted based on role and phase
- [ ] Judge scoring panel accessible/restricted based on role and phase
- [ ] Admin panel accessible/restricted based on role

#### Data Visibility
- [ ] Teams list visible/hidden correctly
- [ ] Free agents list visible/hidden correctly
- [ ] Submissions visible/hidden correctly
- [ ] Votes visible/hidden correctly
- [ ] Judge scores visible/hidden correctly
- [ ] Results visible/hidden correctly

#### Permissions & Actions
- [ ] Can create team (participant only, in registration/team_formation)
- [ ] Can join team (participant only, in registration/team_formation)
- [ ] Can submit project (team captain, in submission phase)
- [ ] Can vote (participant/ambassador, in voting phase)
- [ ] Can judge (judge, in judging phase)
- [ ] Can change phase (admin only)
- [ ] Can manage users (admin only)

## Expected Results by Role/Phase

### Participant Role

**Registration Phase:**
- Navigation: Dashboard, Sign Up, Teams, Rules visible
- Status Banner: Shows "Free Agent" or "On Team" with role
- Features: Can create team, can join team, can view teams
- Data: Teams list visible, Free agents list visible
- Permissions: Cannot vote, cannot judge, cannot access admin

**Team Formation Phase:**
- Navigation: Same as Registration
- Status Banner: Shows team role (Captain/Member)
- Features: Can create team, can join team, can leave team
- Data: Teams list visible, Free agents list visible
- Permissions: Cannot vote, cannot judge, cannot access admin

**Hacking Phase:**
- Navigation: Dashboard, Teams, Rules visible (no Sign Up)
- Status Banner: Shows team status (no role shown)
- Features: Cannot create team, cannot join/leave team
- Data: Teams list visible
- Permissions: Cannot vote, cannot judge, cannot access admin

**Submission Phase:**
- Navigation: Dashboard, Teams, Submission, Rules visible
- Status Banner: Shows team status
- Features: Can submit project (if captain), can view submission (if member)
- Data: Teams list visible, Submissions visible
- Permissions: Cannot vote, cannot judge, cannot access admin

**Voting Phase:**
- Navigation: Dashboard, Teams, Voting, Rules visible
- Status Banner: Shows team status
- Features: Can vote for projects (up to 5)
- Data: Teams with submissions visible, Votes visible
- Permissions: Can vote, cannot judge, cannot access admin

**Judging Phase:**
- Navigation: Dashboard, Teams, Voting, Rules visible
- Status Banner: Shows team status
- Features: Can vote (still), cannot judge
- Data: Submissions visible but not scorable
- Permissions: Can vote, cannot judge, cannot access admin

**Results Phase:**
- Navigation: Dashboard, Teams, Results, Rules visible
- Status Banner: Shows team status
- Features: Can view results
- Data: Results visible, Winners visible
- Permissions: Cannot vote, cannot judge, cannot access admin

### Ambassador Role

**All Phases:**
- Same as Participant EXCEPT:
- Can vote (same as participant)
- Cannot judge
- Cannot access admin

### Judge Role

**Registration/Team Formation/Hacking/Submission Phases:**
- Same navigation as Participant
- Cannot vote
- Cannot judge (judging not active)
- Cannot access admin

**Voting Phase:**
- Voting navigation NOT visible (judges don't vote)
- Cannot judge (judging not active)
- Submissions visible but not scorable

**Judging Phase:**
- Judge navigation visible
- Judge scoring panel accessible
- Can score projects
- Cannot vote
- Cannot access admin

**Results Phase:**
- Results navigation visible
- Judge scores visible in results
- Cannot vote
- Cannot access admin

### Admin Role

**All Phases:**
- All navigation items visible
- Admin button visible
- Dev mode toggle visible
- Phase switcher accessible
- Role impersonation accessible
- Admin panel accessible
- Can change event phase
- Can manage users
- Can view analytics

## Cross-Platform Consistency Checks

For each role × phase combination:

1. **Navigation:**
   - Verify same navigation items visible in both apps
   - Verify same tabs/buttons visible in both apps

2. **Features:**
   - Verify same features enabled/disabled in both apps
   - Verify same buttons visible/hidden in both apps

3. **Data:**
   - Verify same data visible in both apps
   - Verify same lists/tables show same information

4. **Permissions:**
   - Verify same permissions enforced in both apps
   - Verify same actions allowed/blocked in both apps

5. **Status Banners:**
   - Verify StatusBanner shows same status in both apps
   - Verify same information displayed in both apps

## Documentation Requirements

For each test execution:

1. **Record Results:**
   - Update UI_TEST_RESULTS.md with pass/fail for each scenario
   - Note any deviations from expected behavior
   - Document any bugs or issues found

2. **Capture Screenshots:**
   - Take screenshot of dashboard for each role/phase combination
   - Take screenshot of key features (voting, judging, admin panel)
   - Save screenshots with naming: `{app}_{role}_{phase}.png`

3. **Document Issues:**
   - Create detailed bug reports for any failures
   - Include steps to reproduce
   - Include screenshots and error messages
   - Note severity (Critical, High, Medium, Low)

## Test Completion

Once all 56 combinations are tested:

1. **Compile Results:**
   - Calculate pass/fail rates
   - Identify patterns in failures
   - Group issues by category

2. **Generate Report:**
   - Create executive summary
   - List all issues found
   - Provide recommendations
   - Include screenshots and evidence

3. **Follow-up:**
   - Create bug tickets for issues
   - Prioritize fixes
   - Plan retesting after fixes

## Tips for Efficient Testing

1. **Batch Similar Tests:**
   - Test all phases for one role before moving to next role
   - This reduces context switching

2. **Use Browser DevTools:**
   - Use console to verify state changes
   - Use Network tab to verify API calls
   - Use Elements tab to inspect UI structure

3. **Take Notes:**
   - Document unexpected behavior immediately
   - Note any workarounds needed
   - Record time taken for each combination

4. **Compare Side-by-Side:**
   - Open both apps in separate windows
   - Test same combination in both apps simultaneously
   - Compare results immediately

## Troubleshooting

### Dev Controls Not Visible
- Verify you're logged in as admin
- Check if dev mode toggle is enabled
- Verify environment variable is set (if required)
- Try refreshing the page

### Role/Phase Not Changing
- Verify dev controls dropdown is open
- Check browser console for errors
- Try clicking the option directly
- Refresh page and try again

### Inconsistent Results
- Clear browser cache
- Verify you're testing same data in both apps
- Check if demo mode vs real mode differences
- Verify environment variables are set correctly
