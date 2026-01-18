# HD26AI Roadmap

## Current Version: 0.10.9

This document tracks planned features and improvements for the HackDay 2026 Companion App.

---

## 🚀 Planned Features

### High Priority

#### ~~Create Team UI~~ ✅ DONE
- **Status:** Complete (v0.10.5)
- **Location:** `Marketplace.jsx` → Create Team modal
- **Implemented:**
  - [x] Form to enter team name, description, allegiance (Human/AI)
  - [x] Select skills the team is looking for
  - [x] Set max team size (2-6 slider)
  - [x] Creator becomes team captain automatically
  - [x] Form validation with inline error messages
  - [x] Button hidden if user already on a team

#### ~~User Management (Admin Panel)~~ ✅ DONE
- **Status:** Complete (v0.10.6)
- **Location:** `AdminPanel.jsx` → `renderUsers()` section
- **Implemented:**
  - [x] Search/filter users by name or email
  - [x] Filter dropdown by role (All, Participant, Ambassador, Judge, Admin)
  - [x] Display current role badge for each user
  - [x] Role counts in legend cards
  - [x] Dropdown to change role (participant/ambassador/judge/admin)
  - [x] Confirmation modal before role changes
  - [x] Success/error toast feedback
  - [x] Prevents changing own role
  - [x] useUsers hook in useSupabase.js for Supabase integration

---

### Medium Priority

#### ~~Avatar Selection~~ ✅ DONE
- **Status:** Complete (v0.10.9)
- **Location:** `Profile.jsx` → Avatar card section
- **Asset Directory:** `public/avatars/human/` and `public/avatars/ai/`
- **Implemented:**
  - [x] AvatarPickerModal with grid of avatar options
  - [x] Separate Human and AI avatar sets
  - [x] Neutral users can browse both sets via tabs
  - [x] Click to select with visual preview
  - [x] Save via `updateUser({ avatar })`
  - [x] Avatar displays in profile identity card
  - [x] Placeholder fallback when images not yet added

#### ~~Live War Timer~~ ✅ DONE
- **Status:** Complete (v0.10.7)
- **Location:** `AppLayout.jsx` → Header timer section
- **Implemented:**
  - [x] Calculate time remaining from current date to event start (June 21, 2026 9AM)
  - [x] Update every second via `useEffect` interval
  - [x] Show different message when event is live ("⚡ EVENT LIVE ⚡") or ended ("Event Complete")
  - [x] Dynamic styling: dark bg for countdown, gradient pulse for live, muted for ended
  - [x] Consistent unit format: `6mo 15d 12h 26m 29s` (adapts as time passes)

#### ~~Edit Skills in Profile~~ ✅ DONE
- **Status:** Complete (v0.10.8)
- **Location:** `Profile.jsx` → Skills section
- **Implemented:**
  - [x] Edit button to enter edit mode
  - [x] Multi-select skill picker with predefined options
  - [x] Custom skill input with Enter key support
  - [x] Remove skills with X button on tags
  - [x] Max 5 skills limit enforced
  - [x] Validation for custom skills (2-30 chars, no duplicates)
  - [x] Save/cancel with persistence to Supabase

#### ~~Callsign Editing~~ ✅ DONE
- **Status:** Complete (v0.10.8)
- **Location:** `Profile.jsx` → Identity card section
- **Implemented:**
  - [x] Inline edit for callsign (Edit callsign button)
  - [x] Validation (max 20 chars, letters/numbers/spaces only)
  - [x] Live preview in name display during editing
  - [x] Character counter
  - [x] Save/cancel with persistence to database

---

### Lower Priority

#### Team Invites System
- **Status:** Demo mode only
- **Description:** Full invite workflow for captains to recruit free agents
- **Location:** `Marketplace.jsx`, `useSupabase.js`
- **Database Requirements:**
  - New `TeamInvite` table or extend `TeamMember` with invite status
- **Acceptance Criteria:**
  - [ ] Captain can send invite to free agent
  - [ ] Free agent sees pending invites in profile/notifications
  - [ ] Accept/decline invite
  - [ ] Invite expiration

#### Free Agent Auto-Assignment
- **Status:** Planned
- **Description:** Automatically assign remaining free agents to Observers team when hack starts
- **Location:** Backend resolver or scheduled function
- **Acceptance Criteria:**
  - [ ] Detect when event phase transitions to 'hacking'
  - [ ] Find all users with `isFreeAgent = true` and no team
  - [ ] Automatically add them to Observers team
  - [ ] Set `isFreeAgent = false` for assigned users
  - [ ] Log assignment activity

#### Free Agent Reminder System
- **Status:** Planned
- **Description:** Send reminders to free agents 24-48 hours before hack starts, offering auto-assign option
- **Location:** Backend scheduled job or resolver
- **Acceptance Criteria:**
  - [ ] Calculate time until hack start (24-48 hours window)
  - [ ] Query free agents who haven't joined a team
  - [ ] Send notification/email reminder
  - [ ] Offer "Auto-assign me to Observers" button
  - [ ] Allow manual opt-in before automatic assignment

#### Real-time Activity Feed
- **Status:** Mock data only
- **Description:** Live updates when users join teams, create teams, submit projects
- **Location:** `Dashboard.jsx` → Activity feed widget
- **Dependencies:** Supabase Realtime subscriptions
- **Acceptance Criteria:**
  - [ ] Subscribe to team membership changes
  - [ ] Subscribe to new team creations
  - [ ] Format and display new activities
  - [ ] Limit to recent N items

#### ~~Promo Tiles / Banner Graphics~~ ✅ DONE
- **Status:** Complete (v0.10.9)
- **Location:** `Dashboard.jsx` → PromoTile component
- **Asset Directory:** `public/promo/`
- **Implemented:**
  - [x] PromoTile component with image display
  - [x] Graceful fallback to placeholder when images not yet added
  - [x] 2 promo slots on dashboard (full-width + secondary)
  - [x] Responsive image display
- **To Add Images:** Drop `promo-1.png` and `promo-2.png` into `public/promo/`

---

## ✅ Completed Features (v0.10.x)

- [x] Landing page with "Human vs AI" theme
- [x] OAuth authentication (Google) via Supabase
- [x] Demo mode for testing without auth
- [x] Onboarding flow (name, skills, allegiance)
- [x] Dashboard with bento grid layout
- [x] Team marketplace (browse teams & free agents)
- [x] Team detail view with join requests
- [x] Profile page with bio editing
- [x] Rules page
- [x] Schedule page with calendar export (ICS, Google Calendar)
- [x] Project submission form
- [x] Voting system (5 votes per user)
- [x] Judge scoring interface
- [x] Voting analytics dashboard
- [x] Admin panel with phase control
- [x] Results page with award winners
- [x] Responsive mobile design
- [x] Callsign display system ("First 'Callsign' Last" format)
- [x] War recruitment status widget
- [x] Event phase progress bar
- [x] Edit skills from profile (v0.10.8)
- [x] Edit callsign from profile (v0.10.8)
- [x] Avatar selection from pre-made sets (v0.10.9)
- [x] Promo image support on dashboard (v0.10.9)

---

## 🐛 Known Issues

- [x] ~~macOS metadata files (`._*.jsx`) appearing in git status~~ — Already handled by `._*` in `.gitignore`
- [x] ~~`hints.json` file appears unrelated to project~~ — Removed (was Jira/HAPI scripting, unrelated)

---

## 📝 Notes

- **Supabase Tables Expected:** User, Team, TeamMember, Project, Vote, JudgeScore, Event, Milestone
- **Demo Mode:** App works without Supabase config using mock data
- **Event Date:** June 21-22, 2026

---

*Last updated: December 7, 2025*

