# Comprehensive Testing Prompt - Feature Enhancements

**Use this prompt in a fresh chat to thoroughly test all new features across HD26AI and HD26Forge.**

---

## Testing Instructions

Please perform comprehensive testing of all newly implemented features across both HD26AI (web app) and HD26Forge (Confluence macro). Test each feature systematically, document any issues found, and verify functionality works correctly in both platforms.

---

## Test Environment Setup

**HD26AI:** https://hd26ai.vercel.app/  
**HD26Forge:** Confluence macro (development environment)  
**Database:** Shared Supabase database

**Test Accounts Needed:**
- Admin user (for admin features)
- Team Captain user (for invite management)
- Regular participant user (for general features)
- Judge user (for judging features)

---

## Feature Testing Checklist

### 1. Real-time Activity Feed

**HD26AI:**
- [ ] Navigate to Dashboard
- [ ] Verify "Live Activity" section displays recent activities
- [ ] Verify activities show: user joined team, team created, project submitted
- [ ] Verify timestamps display correctly (not "Invalid Date")
- [ ] Verify activity feed updates in real-time when new events occur
- [ ] Verify "LIVE" badge and heartbeat indicator are visible
- [ ] Test with different event phases to see relevant activities

**HD26Forge:**
- [ ] Open macro in Confluence
- [ ] Verify "Live Activity" section displays in Dashboard view
- [ ] Verify activities show: user joined team, team created, project submitted
- [ ] Verify timestamps display correctly
- [ ] Click "Refresh" button to update activity feed
- [ ] Verify activity feed shows recent activities (last 10-20)

**Test Scenarios:**
1. Create a new team → Verify "team created" activity appears
2. Join a team → Verify "user joined team" activity appears
3. Submit a project → Verify "project submitted" activity appears
4. Check timestamps are formatted correctly (e.g., "2 min ago", "1 hour ago")

---

### 2. Team Invite Expiration

**HD26AI:**
- [ ] Navigate to Teams/Marketplace page
- [ ] As a free agent, verify pending invites show expiration countdown (e.g., "3h remaining")
- [ ] Verify expired invites show "Expired" badge
- [ ] Verify expired invites are automatically marked as EXPIRED in database
- [ ] Verify invites expire after 7 days
- [ ] Check that expired invites are filtered out of pending list (or shown separately)

**HD26Forge:**
- [ ] Open macro in Confluence
- [ ] Navigate to Free Agents or Teams view
- [ ] As a free agent, verify pending invites show expiration countdown
- [ ] Verify expired invites show "Expired" Lozenge/Badge
- [ ] Verify expiration logic works correctly
- [ ] Check invite expiration display in invite list

**Test Scenarios:**
1. Send an invite → Verify it shows expiration countdown
2. Wait for invite to expire (or manually set expiresAt in past) → Verify it shows as expired
3. Verify expired invites cannot be accepted
4. Verify expiration countdown updates correctly

---

### 3. Team Invite Management (Captains)

**HD26AI:**
- [ ] As a team captain, navigate to Team Detail page
- [ ] Verify "Sent Invites" section is visible
- [ ] Verify sent invites list shows:
  - Invite status (Pending, Accepted, Declined, Expired)
  - Invited user name
  - Created date
  - Expiration status
- [ ] Verify "Resend Invite" button appears for declined/expired invites
- [ ] Click "Resend Invite" → Verify invite status resets to PENDING
- [ ] Verify acceptance rate statistics display correctly
- [ ] Verify invite stats show: total, pending, accepted, declined, expired, acceptance rate

**HD26Forge:**
- [ ] As a team captain, open team detail modal
- [ ] Verify sent invites section is visible (if implemented)
- [ ] Verify invite management features work correctly
- [ ] Test resend invite functionality (if available)

**Test Scenarios:**
1. As captain, send multiple invites → Verify all appear in "Sent Invites"
2. Accept one invite → Verify status updates to "Accepted"
3. Decline one invite → Verify status updates to "Declined" and "Resend" button appears
4. Resend declined invite → Verify status resets to "Pending"
5. Check acceptance rate calculation

---

### 4. Export Results (CSV)

**HD26AI:**
- [ ] Navigate to Results page as admin
- [ ] Verify "Export CSV" button is visible (admin only)
- [ ] Click "Export CSV" button
- [ ] Verify CSV file downloads
- [ ] Open CSV file and verify it contains:
  - Team name
  - Project name
  - Judge score
  - Vote count
  - Team members
  - Awards (if any)
- [ ] Verify CSV is properly formatted and readable
- [ ] Verify non-admin users do not see export button

**HD26Forge:**
- [ ] Navigate to Results view as admin
- [ ] Verify "Export CSV" button is visible (admin only)
- [ ] Click "Export CSV" button
- [ ] Verify CSV data is returned/downloaded
- [ ] Verify CSV contains all required fields
- [ ] Verify non-admin users do not see export button

**Test Scenarios:**
1. Export results with multiple teams → Verify all teams included
2. Export results with no submissions → Verify CSV handles empty data
3. Export results with judge scores → Verify scores included correctly
4. Export results with votes → Verify vote counts included correctly

---

### 5. Admin Settings

**HD26AI:**
- [ ] Navigate to Admin Panel as admin
- [ ] Verify "Settings" tab is visible (may need to scroll or use wider viewport)
- [ ] Click "Settings" tab
- [ ] Verify form displays current settings:
  - Maximum Team Size (default: 6)
  - Maximum Votes Per User (default: 5)
  - Submission Deadline (optional)
  - Voting Deadline (optional)
- [ ] Change Maximum Team Size → Click "Save Settings" → Verify saves successfully
- [ ] Change Maximum Votes Per User → Click "Save Settings" → Verify saves successfully
- [ ] Set Submission Deadline → Click "Save Settings" → Verify saves successfully
- [ ] Set Voting Deadline → Click "Save Settings" → Verify saves successfully
- [ ] Reload page → Verify settings persist
- [ ] Verify settings affect app behavior (e.g., max votes limit enforced)

**HD26Forge:**
- [ ] Navigate to Admin view as admin
- [ ] Verify "Settings" tab is visible
- [ ] Click "Settings" tab
- [ ] Verify form displays current settings
- [ ] Change settings → Click "Save Settings" → Verify saves successfully
- [ ] Verify settings persist after refresh
- [ ] Verify non-admin users cannot access settings

**Test Scenarios:**
1. Set maxTeamSize to 4 → Verify teams cannot exceed 4 members
2. Set maxVotesPerUser to 3 → Verify users cannot vote more than 3 times
3. Set submission deadline → Verify deadline is stored correctly
4. Clear deadlines → Verify null values saved correctly
5. Test with invalid values → Verify validation works

---

### 6. Analytics Dashboard

**HD26AI:**
- [ ] Navigate to Admin Panel as admin
- [ ] Verify "Analytics" tab is visible (may need to scroll or use wider viewport)
- [ ] Click "Analytics" tab OR click "View Analytics" Quick Action button
- [ ] Verify analytics dashboard displays:
  - User Engagement metrics (total users, users on teams, users who voted, users who submitted)
  - Signups over time chart/data
  - Teams created over time chart/data
  - Participation by role chart/data
- [ ] Verify charts/data are accurate
- [ ] Click "Export CSV" button (if available) → Verify analytics data exports
- [ ] Verify analytics update when new data is added

**HD26Forge:**
- [ ] Navigate to Admin view as admin
- [ ] Verify "Analytics" tab is visible
- [ ] Click "Analytics" tab
- [ ] Verify analytics display shows:
  - User Engagement metrics (with badges)
  - Participation by Role (with counts)
  - Signups Over Time (date-based list)
  - Teams Created Over Time (date-based list)
- [ ] Verify analytics data is accurate
- [ ] Verify analytics load correctly
- [ ] Verify non-admin users cannot access analytics

**Test Scenarios:**
1. Check analytics with no data → Verify handles empty state
2. Add new users → Verify signups chart updates
3. Create new teams → Verify teams chart updates
4. Verify role counts match actual user roles
5. Verify engagement metrics are accurate

---

### 7. Notification System

**HD26AI:**
- [ ] Verify notification bell icon is visible in header (if user has notifications)
- [ ] Click notification bell → Verify dropdown opens
- [ ] Verify notifications list displays:
  - Notification title
  - Notification message
  - Timestamp (formatted)
  - Notification type icon
- [ ] Click a notification → Verify it marks as read and navigates to action URL
- [ ] Click "Mark all as read" → Verify all notifications marked as read
- [ ] Verify unread count badge displays correctly
- [ ] Test different notification types:
  - Team invite received
  - Join request received (for captains)
  - Phase change announcement
- [ ] Verify notifications appear in real-time (if Realtime enabled)

**HD26Forge:**
- [ ] Verify notification system is accessible (if implemented in UI)
- [ ] Test notification resolvers work correctly:
  - getUserNotifications
  - markNotificationAsRead
- [ ] Verify notifications display correctly (if UI implemented)

**Test Scenarios:**
1. Send team invite → Verify invited user receives notification
2. Accept team invite → Verify captain receives notification
3. Change event phase → Verify all users receive phase change notification
4. Mark notification as read → Verify it updates in database
5. Mark all as read → Verify all notifications updated

---

### 8. Bulk User Operations

**HD26AI:**
- [ ] Navigate to Admin Panel → User Roles tab
- [ ] Verify checkboxes appear next to each user
- [ ] Select multiple users using checkboxes
- [ ] Select bulk role from dropdown (participant, ambassador, judge, admin)
- [ ] Click "Bulk Assign" button → Verify selected users' roles update
- [ ] Click "Export Users CSV" button → Verify CSV downloads
- [ ] Open CSV → Verify it contains all user data:
  - Name, email, role, team, skills, etc.
- [ ] Verify bulk operations work correctly
- [ ] Verify error handling for invalid operations

**HD26Forge:**
- [ ] Navigate to Admin view
- [ ] Verify user management table displays correctly
- [ ] Test role assignment (individual) works
- [ ] Verify user export functionality (if available)

**Test Scenarios:**
1. Select 3 users → Bulk assign as "judge" → Verify all 3 become judges
2. Select 5 users → Bulk assign as "participant" → Verify all 5 become participants
3. Export users → Verify CSV contains all users and correct data
4. Test with no selection → Verify appropriate error/validation

---

## Cross-Platform Consistency Tests

### Feature Parity
- [ ] Verify all features work in both HD26AI and HD26Forge
- [ ] Verify data is consistent between platforms (shared database)
- [ ] Verify UI/UX is appropriate for each platform (React vs Forge UI Kit)

### Role-Based Access
- [ ] Test as Admin → Verify all features accessible
- [ ] Test as Team Captain → Verify captain-specific features work
- [ ] Test as Judge → Verify judge features work, admin features restricted
- [ ] Test as Participant → Verify participant features work, admin features restricted

### Phase-Based Features
- [ ] Test in Registration phase → Verify appropriate features available
- [ ] Test in Team Formation phase → Verify team features available
- [ ] Test in Hacking phase → Verify submission features available
- [ ] Test in Voting phase → Verify voting features available
- [ ] Test in Judging phase → Verify judging features available
- [ ] Test in Results phase → Verify results features available

---

## Error Handling & Edge Cases

- [ ] Test with no data (empty database) → Verify graceful handling
- [ ] Test with invalid inputs → Verify validation works
- [ ] Test network errors → Verify error messages display
- [ ] Test permission errors → Verify appropriate access restrictions
- [ ] Test date formatting edge cases → Verify no "Invalid Date" errors
- [ ] Test with expired invites → Verify expiration logic works
- [ ] Test with missing required fields → Verify validation

---

## Performance Tests

- [ ] Verify activity feed loads quickly
- [ ] Verify analytics dashboard loads within reasonable time
- [ ] Verify export functions complete quickly
- [ ] Verify real-time updates don't cause performance issues
- [ ] Test with large datasets (many users, teams, activities)

---

## Browser Compatibility

- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge
- [ ] Test on mobile devices (if applicable)

---

## Documentation

For each feature tested, document:
1. ✅ Pass / ❌ Fail status
2. Any issues found (with screenshots if possible)
3. Browser/device tested on
4. User role used for testing
5. Event phase during testing
6. Any unexpected behavior

---

## Known Issues to Verify Fixed

1. **Activity Feed Date Formatting** - Verify dates display correctly (not "Invalid Date")
2. **Admin Panel Tabs Visibility** - Verify all tabs (Settings, Analytics) are accessible
3. **Notification Center Visibility** - Verify notification bell appears when notifications exist

---

## Test Completion Checklist

- [ ] All features tested in HD26AI
- [ ] All features tested in HD26Forge
- [ ] Cross-platform consistency verified
- [ ] Role-based access verified
- [ ] Phase-based features verified
- [ ] Error handling verified
- [ ] Edge cases tested
- [ ] Issues documented
- [ ] Screenshots captured (if issues found)

---

## Reporting

After testing, provide:
1. **Summary** - Overall test results (pass/fail counts)
2. **Issues Found** - List of any bugs or issues discovered
3. **Recommendations** - Suggestions for improvements
4. **Screenshots** - Visual evidence of issues (if any)

---

**Testing Priority:**
1. **High Priority:** Admin Settings, Analytics, Export Results
2. **Medium Priority:** Activity Feed, Invite Management
3. **Low Priority:** Notification System (if UI not fully visible), Bulk Operations

---

**Estimated Testing Time:** 2-3 hours for thorough testing of all features

---

**Note:** Some features may require specific database state (notifications, invites, results) to fully test. Create test data as needed or use existing production data.
