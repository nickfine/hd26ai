# Quick Testing Prompt - Feature Enhancements

**Copy and paste this into a fresh chat to test all new features:**

---

Please perform comprehensive testing of all newly implemented features across both HD26AI (https://hd26ai.vercel.app/) and HD26Forge (Confluence macro). Test each feature systematically and document any issues found.

## Features to Test:

### 1. Real-time Activity Feed
- **HD26AI:** Dashboard → Verify "Live Activity" section shows team joins, team creations, project submissions with correct timestamps (not "Invalid Date")
- **HD26Forge:** Dashboard view → Verify activity feed displays and refresh button works

### 2. Team Invite Expiration
- **HD26AI:** Teams/Marketplace → As free agent, verify pending invites show expiration countdown, expired invites show "Expired" badge
- **HD26Forge:** Free Agents view → Verify expiration display works correctly

### 3. Team Invite Management (Captains)
- **HD26AI:** Team Detail page → As captain, verify "Sent Invites" section shows status, resend button works, acceptance rate displays
- **HD26Forge:** Team detail → Verify invite management features (if implemented)

### 4. Export Results (CSV)
- **HD26AI:** Results page (admin only) → Click "Export CSV" → Verify CSV downloads with team name, project name, scores, votes, members
- **HD26Forge:** Results view (admin only) → Click "Export CSV" → Verify CSV export works

### 5. Admin Settings
- **HD26AI:** Admin Panel → Settings tab → Verify form shows maxTeamSize, maxVotesPerUser, deadlines → Change values → Save → Verify persists
- **HD26Forge:** Admin view → Settings tab → Verify settings form works, saves correctly

### 6. Analytics Dashboard
- **HD26AI:** Admin Panel → Analytics tab (or "View Analytics" button) → Verify shows engagement metrics, signups over time, teams created, participation by role
- **HD26Forge:** Admin view → Analytics tab → Verify analytics display with engagement metrics, role participation, signups/teams over time

### 7. Notification System
- **HD26AI:** Header → Click notification bell (if visible) → Verify dropdown shows notifications, mark as read works, unread count badge displays
- **HD26Forge:** Verify notification resolvers work (getUserNotifications, markNotificationAsRead)

### 8. Bulk User Operations
- **HD26AI:** Admin Panel → User Roles tab → Select multiple users → Choose bulk role → Click "Bulk Assign" → Verify roles update → Click "Export Users CSV" → Verify CSV downloads
- **HD26Forge:** Admin view → Verify user management works

## Cross-Platform Tests:
- Verify data consistency between HD26AI and HD26Forge (shared database)
- Test as different roles: Admin, Captain, Judge, Participant
- Test in different event phases: Registration, Team Formation, Hacking, Voting, Judging, Results

## Known Issues to Verify Fixed:
1. Activity feed dates should NOT show "Invalid Date"
2. Admin Panel tabs (Settings, Analytics) should be accessible
3. Notification center should be visible when notifications exist

## For Each Feature:
- Document ✅ Pass or ❌ Fail
- Note any issues found
- Include browser/device tested
- Include user role and event phase used

Provide a summary of test results, any issues found, and recommendations.
