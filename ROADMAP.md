# HD26AI Roadmap

## Current Version: 0.10.6

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

#### Avatar Selection
- **Status:** Placeholder button exists
- **Description:** Let users choose or upload profile avatars
- **Location:** `Profile.jsx` → Avatar card section
- **Options:**
  - Pre-set allegiance-themed avatars
  - Upload custom image (requires Supabase Storage)
- **Acceptance Criteria:**
  - [ ] Gallery of pre-set avatar options
  - [ ] Preview before saving
  - [ ] Avatar displays in header and profile

#### Download Avatar/Badge Assets
- **Status:** Button exists, not functional
- **Description:** Generate downloadable allegiance-themed assets
- **Location:** `AppLayout.jsx` → Sidebar "Download Avatar" button
- **Deliverables:**
  - Slack avatar (512x512)
  - Zoom background (1920x1080)
  - Teams background
- **Acceptance Criteria:**
  - [ ] Generate personalized badge with user name + allegiance
  - [ ] Download as PNG/ZIP

#### Live War Timer
- **Status:** Hardcoded value
- **Description:** Real countdown to event date (June 21st, 2026)
- **Location:** `AppLayout.jsx` → Header timer section
- **Acceptance Criteria:**
  - [ ] Calculate time remaining from current date to event start
  - [ ] Update every second
  - [ ] Show different message when event is live or ended
  - [ ] Handle timezone considerations

#### Edit Skills in Profile
- **Status:** Display only
- **Description:** Allow users to modify their skills after onboarding
- **Location:** `Profile.jsx` → Skills section
- **Acceptance Criteria:**
  - [ ] Edit button to enter edit mode
  - [ ] Multi-select skill picker (same as onboarding)
  - [ ] Save to Supabase profile

#### Callsign Editing
- **Status:** Display only (set during onboarding)
- **Description:** Allow users to edit their callsign from profile
- **Location:** `Profile.jsx`
- **Acceptance Criteria:**
  - [ ] Inline edit for callsign
  - [ ] Validation (max length, no special chars)
  - [ ] Persist to database

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

#### Promo Tiles / Banner Graphics
- **Status:** Placeholder slots ready
- **Description:** Add actual promotional graphics to dashboard
- **Location:** `Dashboard.jsx` → Promo tile sections
- **Notes:** Waiting for design assets
- **Acceptance Criteria:**
  - [ ] Receive promo images from design team
  - [ ] Implement responsive image display
  - [ ] Optional: rotation/randomization of multiple promos

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

---

## 🐛 Known Issues

- [ ] macOS metadata files (`._*.jsx`) appearing in git status — need to add to `.gitignore`
- [ ] `hints.json` file appears unrelated to project — consider removing

---

## 📝 Notes

- **Supabase Tables Expected:** User, Team, TeamMember, Project, Vote, JudgeScore, Event, Milestone
- **Demo Mode:** App works without Supabase config using mock data
- **Event Date:** June 21-22, 2026

---

*Last updated: December 7, 2024*

