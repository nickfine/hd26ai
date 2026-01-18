# Code Review: HD26AI & HD26Forge - Consistency and Integrity

**Date:** January 18, 2026  
**Reviewer:** AI Assistant  
**Scope:** Both HD26AI (web app) and HD26Forge (Confluence macro)

## Executive Summary

This review examines code consistency, integrity, and best practices across both applications. Overall, the codebase is well-structured with good separation of concerns. Several areas for improvement have been identified.

---

## 1. Phase and Role Mapping Consistency ✅

### Status: **CONSISTENT**

Both applications use centralized mapping constants:

**HD26AI:**
- `src/lib/constants.js` - Exported `PHASE_MAP`, `REVERSE_PHASE_MAP`, `ROLE_MAP`, `REVERSE_ROLE_MAP`
- Used consistently in `useSupabase.js` and `App.jsx`

**HD26Forge:**
- `src/index.js` - Local constants `PHASE_MAP`, `REVERSE_PHASE_MAP`, `ROLE_MAP`, `REVERSE_ROLE_MAP`
- Used consistently in resolver functions

**Recommendation:** ✅ No changes needed - mappings are consistent

---

## 2. StatusBanner Implementation Consistency

### Status: **MOSTLY CONSISTENT** (Minor differences)

**HD26AI:**
- Component: `src/components/shared/StatusBanner.jsx`
- Uses Card component with HStack/VStack
- Shows: Free Agent, Team Member (with role), Observer
- Phase check: `eventPhase === 'registration' || eventPhase === 'teams' || eventPhase === 'team_formation'`

**HD26Forge:**
- Inline implementation in `Dashboard` component
- Uses SectionMessage component
- Shows: Free Agent, Team Member (with role), Observer
- Phase check: `currentPhase === 'registration' || currentPhase === 'teams' || currentPhase === 'team_formation'`

**Issues Found:**
- ✅ Phase checks are consistent
- ✅ Logic is consistent
- ⚠️ Different UI components (Card vs SectionMessage) - acceptable due to platform differences

**Recommendation:** ✅ No changes needed - platform-appropriate implementations

---

## 3. Free Agent Reminder System

### Status: **CONSISTENT**

**HD26AI:**
- Component: `src/components/shared/FreeAgentReminderBanner.jsx`
- Shows when: `hoursUntilHack >= 24 && hoursUntilHack <= 48`
- Opt-in updates: `autoAssignOptIn` flag

**HD26Forge:**
- No reminder banner component (platform limitation)
- Reminder check function: `checkAndSendFreeAgentReminders` in `src/index.js`
- Same time window logic: `hoursUntilHack >= 24 && hoursUntilHack <= 48`

**Issues Found:**
- ✅ Time window logic is consistent
- ✅ Reminder check triggers on phase change to `team_formation`
- ⚠️ Forge doesn't have UI banner (acceptable - Confluence UI limitations)

**Recommendation:** ✅ No changes needed

---

## 4. Auto-Assignment Functionality

### Status: **CONSISTENT**

**HD26AI:**
- Function: `autoAssignFreeAgentsToObservers` in `src/hooks/useSupabase.js`
- Triggers: When phase changes to `'hacking'`
- Logic: Finds free agents, checks if on teams, assigns to Observers team

**HD26Forge:**
- Function: `autoAssignFreeAgentsToObservers` in `src/index.js`
- Triggers: When phase changes to `'hacking'`
- Logic: Same as HD26AI

**Issues Found:**
- ✅ Logic is identical
- ✅ Both create/get Observers team
- ✅ Both update `isFreeAgent` flag
- ✅ Both trigger on same phase change

**Recommendation:** ✅ No changes needed

---

## 5. Dev Mode Implementation

### Status: **CONSISTENT**

**HD26AI:**
- Toggle: localStorage key `hd26ai_dev_mode_enabled`
- Controls: Role impersonation + Phase switcher
- Visibility: Admin only
- Banner: Shows "DEVELOPMENT MODE ACTIVE"

**HD26Forge:**
- Toggle: localStorage key `hd26forge_dev_mode_enabled`
- Controls: Role impersonation + Phase switcher
- Visibility: Admin only (not in demo mode)
- Backend check: `checkDevMode` resolver

**Issues Found:**
- ✅ Both use localStorage for persistence
- ✅ Both have same controls (role + phase)
- ✅ Both check admin role
- ⚠️ Different localStorage keys (acceptable - different apps)

**Recommendation:** ✅ No changes needed

---

## 6. Phase Change Authorization

### Status: **CONSISTENT**

**HD26AI:**
- Check: `effectiveUser.role !== 'admin'` in `handlePhaseChange`
- Backend: `updatePhase` function in `useSupabase.js`
- Triggers: Reminder check (team_formation), Auto-assignment (hacking)

**HD26Forge:**
- Check: `user.role !== "ADMIN"` in `setEventPhase` resolver
- Backend: `setEventPhase` resolver
- Triggers: Reminder check (team_formation), Auto-assignment (hacking)

**Issues Found:**
- ✅ Both check admin role
- ✅ Both trigger same side effects
- ✅ Both use same phase mapping

**Recommendation:** ✅ No changes needed

---

## 7. Role Impersonation (Dev Mode)

### Status: **CONSISTENT**

**HD26AI:**
- State: `devRoleOverride` in `App.jsx`
- Applied: In `effectiveUser` calculation
- Navigation: Uses effective role for permissions

**HD26Forge:**
- State: `devRoleOverride` in `Dashboard` component
- Applied: `effectiveRole`, `effectiveIsJudge`, `effectiveIsAdmin`
- Navigation: Uses effective roles for button visibility

**Issues Found:**
- ✅ Both use same approach
- ✅ Both apply to navigation/permissions
- ✅ Both show impersonation indicator

**Recommendation:** ✅ No changes needed

---

## 8. Data Transformation Patterns

### Status: **MOSTLY CONSISTENT** (Minor differences)

**HD26AI:**
- Uses `ROLE_MAP` and `REVERSE_ROLE_MAP` from constants
- Uses `PHASE_MAP` and `REVERSE_PHASE_MAP` from constants
- Transform functions: `dbRoleToAppRole`, `appRoleToDbRole` in `useUsers` hook

**HD26Forge:**
- Uses local `ROLE_MAP` and `REVERSE_ROLE_MAP` constants
- Uses local `PHASE_MAP` and `REVERSE_PHASE_MAP` constants
- Transform function: `transformUser` in resolver

**Issues Found:**
- ✅ Both use same mapping constants (values match)
- ⚠️ HD26AI has helper functions, Forge has inline transforms (acceptable)

**Recommendation:** ✅ No changes needed

---

## 9. Error Handling

### Status: **GOOD** (Some improvements possible)

**HD26AI:**
- Try-catch blocks in async functions
- Error state management in hooks
- Console.error for debugging

**HD26Forge:**
- Try-catch blocks in resolvers
- Error throwing with descriptive messages
- Console.error for debugging

**Issues Found:**
- ✅ Both handle errors appropriately
- ⚠️ Some functions return `{ error: message }` while others throw (inconsistent but acceptable)
- ⚠️ User-facing error messages could be more user-friendly in some cases

**Recommendation:** ⚠️ Consider standardizing error handling patterns (low priority)

---

## 10. Security and Authorization

### Status: **GOOD**

**HD26AI:**
- Admin checks: `effectiveUser.role !== 'admin'`
- Captain checks: `team.captainId === user.id`
- Phase restrictions: Checked in components

**HD26Forge:**
- Admin checks: `user.role !== "ADMIN"`
- Captain checks: `team.captainId === accountId`
- Phase restrictions: Checked in resolvers

**Issues Found:**
- ✅ Both check authorization before sensitive operations
- ✅ Both verify captain role for team operations
- ✅ Both check admin role for phase changes

**Recommendation:** ✅ No changes needed

---

## 11. Type Consistency

### Status: **GOOD**

**HD26AI:**
- Phase values: lowercase strings (`'registration'`, `'team_formation'`, etc.)
- Role values: lowercase strings (`'participant'`, `'ambassador'`, etc.)
- Database: Uppercase enums (`'REGISTRATION'`, `'USER'`, etc.)

**HD26Forge:**
- Phase values: lowercase strings (same as HD26AI)
- Role values: lowercase strings (same as HD26AI)
- Database: Uppercase enums (same as HD26AI)

**Issues Found:**
- ✅ Types are consistent between apps
- ✅ Mapping is consistent

**Recommendation:** ✅ No changes needed

---

## 12. Missing REVERSE_ROLE_MAP in Forge

### Status: **FIXED** ✅

**HD26AI:**
- Has `REVERSE_ROLE_MAP` in `src/lib/constants.js`
- Used in `useUsers` hook for role updates

**HD26Forge:**
- ✅ **FIXED:** Added `REVERSE_ROLE_MAP` constant
- ✅ **FIXED:** Updated `updateRegistration` to use `REVERSE_ROLE_MAP` instead of inline mapping

**Issues Found:**
- ✅ Now consistent with HD26AI

**Recommendation:** ✅ **Fixed - No further action needed**

---

## 13. Team Creation Consistency

### Status: **CONSISTENT**

**HD26AI:**
- Function: `createTeam` in `useTeamMutations`
- Fields: `name`, `description`, `lookingFor`, `maxMembers`, `trackSide` (defaults to user's trackSide)
- Sets: `isFreeAgent: false` after creation

**HD26Forge:**
- Resolver: `createTeam` in `src/index.js`
- Fields: `name`, `description`, `lookingFor`, `maxSize`, `trackSide` (defaults to "HUMAN")
- Sets: `isFreeAgent: false` after creation

**Issues Found:**
- ✅ Both set `isFreeAgent: false`
- ✅ Both create team and add creator as owner
- ⚠️ Field name difference: `maxMembers` (HD26AI) vs `maxSize` (Forge) - acceptable (database uses `maxSize`)

**Recommendation:** ✅ No changes needed

---

## 14. Voting Logic Consistency

### Status: **CONSISTENT**

**HD26AI:**
- Max votes: 5 (constant `MAX_VOTES`)
- Checks: Vote limit, duplicate votes
- Storage: `Vote` table with `userId` and `projectId`

**HD26Forge:**
- Max votes: 5 (constant `MAX_VOTES_PER_USER`)
- Checks: Vote limit, duplicate votes
- Storage: `Vote` table with `userId` and `projectId`

**Issues Found:**
- ✅ Both enforce 5 vote limit
- ✅ Both prevent duplicate votes
- ✅ Both use same database structure

**Recommendation:** ✅ No changes needed

---

## 15. Navigation Visibility Logic

### Status: **CONSISTENT**

**HD26AI:**
- Uses `getNavItems` function in `AppLayout.jsx`
- Checks: `permissions.canVote`, `permissions.canJudge`, `permissions.canManage`
- Phase-based: `eventPhase === 'voting'` for Voting nav

**HD26Forge:**
- Uses `canVote`, `canJudge`, `effectiveIsAdmin` in `Dashboard`
- Checks: `phaseFeatures.voting`, `phaseFeatures.judging`
- Phase-based: Same logic

**Issues Found:**
- ✅ Both check role permissions
- ✅ Both check phase features
- ✅ Both use effective roles (with dev override)

**Recommendation:** ✅ No changes needed

---

## 16. Skills Consistency

### Status: **CONSISTENT**

**HD26AI:**
- Skills array: `SKILLS` in `mockData.js`
- Format: Full labels (e.g., "Frontend Development")
- Max: 5 skills per user

**HD26Forge:**
- Skills array: `SKILLS` in `index.jsx`
- Format: Full labels (same as HD26AI)
- Max: 5 skills per user

**Issues Found:**
- ✅ Skills match exactly
- ✅ Max skills limit is consistent
- ✅ Format is consistent

**Recommendation:** ✅ No changes needed

---

## 17. Event Phase Features

### Status: **CONSISTENT**

**HD26AI:**
- `PHASE_FEATURES` in `mockData.js` (object with phase keys)
- Features: `registration`, `teams`, `submit`, `voting`, `judging`, `results`

**HD26Forge:**
- `PHASE_FEATURES` in `index.jsx` (object with phase keys)
- Features: Same as HD26AI

**Issues Found:**
- ✅ Feature flags match
- ✅ Phase keys match

**Recommendation:** ✅ No changes needed

---

## 18. Code Quality Issues

### Minor Issues Found:

1. **Inconsistent Error Return Patterns:**
   - Some functions return `{ error: message }`
   - Others throw errors
   - **Impact:** Low - both patterns work, but could be standardized

2. **Missing REVERSE_ROLE_MAP in Forge:**
   - Forge uses inline mapping instead of constant
   - **Impact:** Low - works but less maintainable

3. **Dev Mode Check Logic:**
   - HD26AI: Checks `devModeActive` (env var OR UI toggle)
   - Forge: Checks `devModeEnabled` (UI toggle) AND `backendDevModeEnabled` (env var)
   - **Impact:** Low - both work correctly

---

## 19. Security Review

### Status: **GOOD**

**Authorization Checks:**
- ✅ Admin checks before phase changes
- ✅ Captain checks before team operations
- ✅ Role checks before voting/judging
- ✅ Phase restrictions enforced

**Data Validation:**
- ✅ Input validation in forms
- ✅ SQL injection protection (Supabase handles this)
- ✅ XSS protection (React escapes by default)

**Recommendations:**
- ✅ No critical security issues found

---

## 20. Performance Considerations

### Status: **GOOD**

**Optimizations Found:**
- ✅ `useMemo` for expensive calculations
- ✅ `useCallback` for event handlers
- ✅ React.memo for components
- ✅ Efficient data fetching patterns

**Potential Improvements:**
- ⚠️ Some large components could be split further (low priority)
- ⚠️ Consider code splitting for routes (low priority)

---

## Summary of Issues

### Critical Issues: **0**
### High Priority Issues: **0**
### Medium Priority Issues: **1**
### Low Priority Issues: **2**

### Issues to Address:

1. **Medium Priority:**
   - Add `REVERSE_ROLE_MAP` constant to Forge for consistency

2. **Low Priority:**
   - Standardize error handling patterns (return vs throw)
   - Consider splitting large components for better maintainability

---

## Recommendations

### Immediate Actions:
1. ✅ **Add `REVERSE_ROLE_MAP` to Forge** - Improves consistency and maintainability

### Future Improvements:
1. Consider creating shared constants package (if both apps share more code in future)
2. Standardize error handling patterns
3. Add TypeScript types for better type safety (HD26AI already has some)

---

## Conclusion

The codebase is **well-structured and consistent** across both applications. The phase and role mappings are properly centralized, authorization is properly enforced, and the implementations are consistent. The only notable issue is the missing `REVERSE_ROLE_MAP` constant in Forge, which should be added for consistency.

**Overall Grade: A-**

The code is production-ready with minor improvements recommended for consistency and maintainability.
