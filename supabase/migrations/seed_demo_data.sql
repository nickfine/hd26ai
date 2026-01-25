-- ============================================================================
-- DEMO DATA SEED SCRIPT
-- ============================================================================
-- This script creates a demo event with teams, users, projects, votes, and scores
-- Both HD26Forge and HD26AI use this data when in demo mode
-- 
-- DEMO EVENT ID: 'demo-event-2026' (hardcoded in both apps)
-- 
-- To run: Execute this SQL in Supabase SQL Editor
-- To reset: Run the cleanup section at the bottom first
-- ============================================================================

-- ============================================================================
-- CLEANUP (Run this first if you need to reset demo data)
-- ============================================================================
-- DELETE FROM "JudgeScore" WHERE "projectId" IN (SELECT id FROM "Project" WHERE "teamId" IN (SELECT id FROM "Team" WHERE "eventId" = 'demo-event-2026'));
-- DELETE FROM "Vote" WHERE "projectId" IN (SELECT id FROM "Project" WHERE "teamId" IN (SELECT id FROM "Team" WHERE "eventId" = 'demo-event-2026'));
-- DELETE FROM "Project" WHERE "teamId" IN (SELECT id FROM "Team" WHERE "eventId" = 'demo-event-2026');
-- DELETE FROM "TeamMember" WHERE "teamId" IN (SELECT id FROM "Team" WHERE "eventId" = 'demo-event-2026');
-- DELETE FROM "TeamInvite" WHERE "teamId" IN (SELECT id FROM "Team" WHERE "eventId" = 'demo-event-2026');
-- DELETE FROM "Team" WHERE "eventId" = 'demo-event-2026';
-- DELETE FROM "EventRegistration" WHERE "eventId" = 'demo-event-2026';
-- DELETE FROM "User" WHERE id LIKE 'demo-%';
-- DELETE FROM "Event" WHERE id = 'demo-event-2026';

-- ============================================================================
-- 1. CREATE DEMO EVENT
-- ============================================================================
INSERT INTO "Event" (id, name, slug, description, year, phase, "isCurrent", "startDate", "endDate", "createdAt", "updatedAt")
VALUES (
  'demo-event-2026',
  'HackDay 2026 Demo',
  'hackday-2026-demo',
  'Demo event for showcasing the HackDay application. This data is shared across HD26Forge and HD26AI.',
  2026,
  'TEAM_FORMATION',  -- Default phase for demo
  false,  -- Not the current event (production event is current)
  '2026-01-13T09:00:00Z',
  '2026-01-17T18:00:00Z',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  phase = EXCLUDED.phase,
  "updatedAt" = NOW();

-- ============================================================================
-- 2. CREATE DEMO USERS
-- ============================================================================

-- Team Human Touch members
INSERT INTO "User" (id, name, email, callsign, skills, role, "isFreeAgent", "createdAt", "updatedAt")
VALUES 
  ('demo-user-201', 'Morgan Riley', 'morgan.riley@demo.com', 'Pixel Pusher', 'UI/UX Design,Product Management', 'USER', false, NOW(), NOW()),
  ('demo-user-202', 'Casey Brooks', 'casey.brooks@demo.com', 'CSS Wizard', 'Frontend Development,UI/UX Design', 'USER', false, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, skills = EXCLUDED.skills, "updatedAt" = NOW();

-- Team Neural Nexus members
INSERT INTO "User" (id, name, email, callsign, skills, role, "isFreeAgent", "createdAt", "updatedAt")
VALUES 
  ('demo-user-101', 'Alex Chen', 'alex.chen@demo.com', 'Keyboard Bandit', 'Backend Development,DevOps', 'USER', false, NOW(), NOW()),
  ('demo-user-102', 'Jordan Lee', 'jordan.lee@demo.com', 'Neural Ninja', 'Machine Learning,Data Science', 'USER', false, NOW(), NOW()),
  ('demo-user-103', 'Taylor Kim', 'taylor.kim@demo.com', 'Firewall', 'Backend Development,Security', 'USER', false, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, skills = EXCLUDED.skills, "updatedAt" = NOW();

-- Team The Resistance members
INSERT INTO "User" (id, name, email, callsign, skills, role, "isFreeAgent", "createdAt", "updatedAt")
VALUES 
  ('demo-user-301', 'Jamie Foster', 'jamie.foster@demo.com', 'The Architect', 'Product Management,UI/UX Design', 'USER', false, NOW(), NOW()),
  ('demo-user-302', 'Drew Parker', 'drew.parker@demo.com', 'Mobile Maven', 'Frontend Development,Mobile Development', 'USER', false, NOW(), NOW()),
  ('demo-user-303', 'Avery Quinn', 'avery.quinn@demo.com', 'Pipeline Pro', 'Backend Development,DevOps', 'USER', false, NOW(), NOW()),
  ('demo-user-304', 'Riley Hayes', 'riley.hayes@demo.com', 'App Whisperer', 'Mobile Development,Frontend Development', 'USER', false, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, skills = EXCLUDED.skills, "updatedAt" = NOW();

-- Team Synthetic Minds members
INSERT INTO "User" (id, name, email, callsign, skills, role, "isFreeAgent", "createdAt", "updatedAt")
VALUES 
  ('demo-user-401', 'Sam Rivera', 'sam.rivera@demo.com', 'Data Drifter', 'Machine Learning,Data Science', 'USER', false, NOW(), NOW()),
  ('demo-user-402', 'Chris Nakamura', 'chris.nakamura@demo.com', 'Token Master', 'Backend Development,Machine Learning', 'USER', false, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, skills = EXCLUDED.skills, "updatedAt" = NOW();

-- Team Carbon Coalition members
INSERT INTO "User" (id, name, email, callsign, skills, role, "isFreeAgent", "createdAt", "updatedAt")
VALUES 
  ('demo-user-501', 'Pat O''Brien', 'pat.obrien@demo.com', 'Circuit Breaker', 'Hardware/IoT,Security', 'USER', false, NOW(), NOW()),
  ('demo-user-502', 'Dana Kowalski', 'dana.kowalski@demo.com', 'Server Sage', 'Backend Development,DevOps', 'USER', false, NOW(), NOW()),
  ('demo-user-503', 'Jesse Martinez', 'jesse.martinez@demo.com', 'Locksmith', 'Security,Backend Development', 'USER', false, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, skills = EXCLUDED.skills, "updatedAt" = NOW();

-- Team Digital Overlords member
INSERT INTO "User" (id, name, email, callsign, skills, role, "isFreeAgent", "createdAt", "updatedAt")
VALUES 
  ('demo-user-601', 'Sage Thompson', 'sage.thompson@demo.com', 'Prompt Lord', 'Machine Learning,DevOps,Data Science', 'USER', false, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, skills = EXCLUDED.skills, "updatedAt" = NOW();

-- Team Analog Army members
INSERT INTO "User" (id, name, email, callsign, skills, role, "isFreeAgent", "createdAt", "updatedAt")
VALUES 
  ('demo-user-701', 'Robin Sinclair', 'robin.sinclair@demo.com', 'Retro Designer', 'UI/UX Design,Frontend Development', 'USER', false, NOW(), NOW()),
  ('demo-user-702', 'Finley Grant', 'finley.grant@demo.com', 'Roadmap Rebel', 'Product Management,UI/UX Design', 'USER', false, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, skills = EXCLUDED.skills, "updatedAt" = NOW();

-- Team Quantum Collective members
INSERT INTO "User" (id, name, email, callsign, skills, role, "isFreeAgent", "createdAt", "updatedAt")
VALUES 
  ('demo-user-801', 'Kai Patel', 'kai.patel@demo.com', 'Full Stack Flash', 'Frontend Development,Backend Development', 'USER', false, NOW(), NOW()),
  ('demo-user-802', 'Blake Nguyen', 'blake.nguyen@demo.com', 'Gradient Ghost', 'Machine Learning,Backend Development', 'USER', false, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, skills = EXCLUDED.skills, "updatedAt" = NOW();

-- Free Agents
INSERT INTO "User" (id, name, email, callsign, skills, role, "isFreeAgent", bio, "createdAt", "updatedAt")
VALUES 
  ('demo-free-5001', 'Quinn Harper', 'quinn.harper@demo.com', 'Design Coder', 'Frontend Development,UI/UX Design', 'USER', true, 'Designer who codes. Looking for a team that values aesthetics and user experience.', NOW(), NOW()),
  ('demo-free-5002', 'Skyler Vance', 'skyler.vance@demo.com', 'Data Dreamer', 'Machine Learning,Data Science', 'USER', true, 'Data scientist with a passion for neural networks. Ready to help your AI project dominate.', NOW(), NOW()),
  ('demo-free-5003', 'River Chen', 'river.chen@demo.com', 'Stack Surfer', 'Backend Development,DevOps,Security', 'USER', true, 'Full-stack engineer. I go where the interesting problems are.', NOW(), NOW()),
  ('demo-free-5004', 'Dakota Wells', 'dakota.wells@demo.com', 'App Artisan', 'Mobile Development,Frontend Development', 'USER', true, 'Cross-platform mobile dev. I believe in crafting apps with a human touch.', NOW(), NOW()),
  ('demo-free-5005', 'Ash Nakamura', 'ash.nakamura@demo.com', 'Product Pioneer', 'Product Management,UI/UX Design', 'USER', true, 'Product strategist embracing AI-first design.', NOW(), NOW()),
  ('demo-free-5006', 'Emery Blake', 'emery.blake@demo.com', 'Hardware Hacker', 'Hardware/IoT,Backend Development', 'USER', true, 'Hardware hacker at heart. Building tangible things in an increasingly digital world.', NOW(), NOW()),
  ('demo-free-5007', 'Jules Thornton', 'jules.thornton@demo.com', 'LLM Lord', 'Machine Learning,Backend Development,Data Science', 'USER', true, 'LLM enthusiast. If it involves prompts and parameters, count me in.', NOW(), NOW()),
  ('demo-free-5008', 'Rowan Kim', 'rowan.kim@demo.com', 'Full Stack Flash', 'Frontend Development,Backend Development', 'USER', true, 'Versatile full-stack dev. Show me your vision and I''ll help you build it.', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, skills = EXCLUDED.skills, "isFreeAgent" = true, "updatedAt" = NOW();

-- Judges
INSERT INTO "User" (id, name, email, callsign, skills, role, "isFreeAgent", "createdAt", "updatedAt")
VALUES 
  ('demo-judge-3001', 'Dr. Elena Vasquez', 'elena.vasquez@demo.com', 'VP Engineering', 'Product Management', 'JUDGE', false, NOW(), NOW()),
  ('demo-judge-3002', 'James Okonkwo', 'james.okonkwo@demo.com', 'Innovation Chief', 'Product Management', 'JUDGE', false, NOW(), NOW()),
  ('demo-judge-3003', 'Priya Sharma', 'priya.sharma@demo.com', 'Head of Product', 'Product Management,UI/UX Design', 'JUDGE', false, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, role = 'JUDGE', "updatedAt" = NOW();

-- Admin
INSERT INTO "User" (id, name, email, callsign, skills, role, "isFreeAgent", "createdAt", "updatedAt")
VALUES 
  ('demo-admin-4001', 'HackDay Admin', 'admin@demo.com', 'SysOp', 'DevOps,Security', 'ADMIN', false, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, role = 'ADMIN', "updatedAt" = NOW();

-- Observer
INSERT INTO "User" (id, name, email, callsign, skills, role, "isFreeAgent", "createdAt", "updatedAt")
VALUES 
  ('demo-observer-001', 'Frank Brown', 'frank.brown@demo.com', 'Watcher', 'Product Management', 'USER', false, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, "updatedAt" = NOW();

-- ============================================================================
-- 3. CREATE EVENT REGISTRATIONS
-- ============================================================================
INSERT INTO "EventRegistration" (id, "eventId", "userId", "createdAt")
SELECT 
  'demo-reg-' || id,
  'demo-event-2026',
  id,
  NOW()
FROM "User"
WHERE id LIKE 'demo-%'
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 4. CREATE TEAMS
-- ============================================================================
INSERT INTO "Team" (id, "eventId", name, description, "lookingFor", "maxSize", "trackSide", "isPublic", "isAutoCreated", "createdAt", "updatedAt")
VALUES 
  ('demo-team-human-touch', 'demo-event-2026', 'Human Touch', 'Crafting intuitive interfaces that AI cannot replicate. Proving human creativity trumps machine efficiency.', 'UI/UX Design,Frontend Development', 4, 'HUMAN', true, false, '2026-01-10T12:00:00Z', NOW()),
  ('demo-team-neural-nexus', 'demo-event-2026', 'Neural Nexus', 'Building autonomous code review agents powered by cutting-edge AI technology.', 'Machine Learning,DevOps', 5, 'AI', true, false, '2026-01-10T14:00:00Z', NOW()),
  ('demo-team-the-resistance', 'demo-event-2026', 'The Resistance', 'Proving human creativity trumps machine efficiency', 'Product Management,Frontend Development,Mobile Development', 6, 'HUMAN', true, false, '2026-01-10T15:00:00Z', NOW()),
  ('demo-team-synthetic-minds', 'demo-event-2026', 'Synthetic Minds', 'Leveraging LLMs to solve impossible problems', 'Data Science,Backend Development', 4, 'AI', true, false, '2026-01-10T16:00:00Z', NOW()),
  ('demo-team-carbon-coalition', 'demo-event-2026', 'Carbon Coalition', 'Old-school engineering with a human heart', 'Hardware/IoT,Security,Backend Development', 5, 'HUMAN', true, false, '2026-01-10T17:00:00Z', NOW()),
  ('demo-team-digital-overlords', 'demo-event-2026', 'Digital Overlords', 'Why write code when AI can write it for you?', 'Machine Learning,Data Science,DevOps', 4, 'AI', true, false, '2026-01-10T18:00:00Z', NOW()),
  ('demo-team-analog-army', 'demo-event-2026', 'Analog Army', 'Keeping it real in a synthetic world', 'UI/UX Design,Product Management', 3, 'HUMAN', true, false, '2026-01-10T19:00:00Z', NOW()),
  ('demo-team-quantum-collective', 'demo-event-2026', 'Quantum Collective', 'AI-first development for the next generation', 'Frontend Development,Backend Development,Machine Learning', 5, 'AI', true, false, '2026-01-10T20:00:00Z', NOW()),
  ('demo-team-observers', 'demo-event-2026', 'Observers', 'Watch and learn from the sidelines', '', 999, 'HUMAN', true, true, '2026-01-08T00:00:00Z', NOW())
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  description = EXCLUDED.description,
  "lookingFor" = EXCLUDED."lookingFor",
  "updatedAt" = NOW();

-- ============================================================================
-- 5. CREATE TEAM MEMBERS
-- ============================================================================

-- Human Touch (Morgan Riley is captain)
INSERT INTO "TeamMember" (id, "teamId", "userId", role, status, "createdAt")
VALUES 
  ('demo-tm-201', 'demo-team-human-touch', 'demo-user-201', 'OWNER', 'ACCEPTED', NOW()),
  ('demo-tm-202', 'demo-team-human-touch', 'demo-user-202', 'MEMBER', 'ACCEPTED', NOW())
ON CONFLICT (id) DO NOTHING;

-- Neural Nexus (Alex Chen is captain)
INSERT INTO "TeamMember" (id, "teamId", "userId", role, status, "createdAt")
VALUES 
  ('demo-tm-101', 'demo-team-neural-nexus', 'demo-user-101', 'OWNER', 'ACCEPTED', NOW()),
  ('demo-tm-102', 'demo-team-neural-nexus', 'demo-user-102', 'MEMBER', 'ACCEPTED', NOW()),
  ('demo-tm-103', 'demo-team-neural-nexus', 'demo-user-103', 'MEMBER', 'ACCEPTED', NOW())
ON CONFLICT (id) DO NOTHING;

-- The Resistance (Jamie Foster is captain)
INSERT INTO "TeamMember" (id, "teamId", "userId", role, status, "createdAt")
VALUES 
  ('demo-tm-301', 'demo-team-the-resistance', 'demo-user-301', 'OWNER', 'ACCEPTED', NOW()),
  ('demo-tm-302', 'demo-team-the-resistance', 'demo-user-302', 'MEMBER', 'ACCEPTED', NOW()),
  ('demo-tm-303', 'demo-team-the-resistance', 'demo-user-303', 'MEMBER', 'ACCEPTED', NOW()),
  ('demo-tm-304', 'demo-team-the-resistance', 'demo-user-304', 'MEMBER', 'ACCEPTED', NOW())
ON CONFLICT (id) DO NOTHING;

-- Synthetic Minds (Sam Rivera is captain)
INSERT INTO "TeamMember" (id, "teamId", "userId", role, status, "createdAt")
VALUES 
  ('demo-tm-401', 'demo-team-synthetic-minds', 'demo-user-401', 'OWNER', 'ACCEPTED', NOW()),
  ('demo-tm-402', 'demo-team-synthetic-minds', 'demo-user-402', 'MEMBER', 'ACCEPTED', NOW())
ON CONFLICT (id) DO NOTHING;

-- Carbon Coalition (Pat O'Brien is captain)
INSERT INTO "TeamMember" (id, "teamId", "userId", role, status, "createdAt")
VALUES 
  ('demo-tm-501', 'demo-team-carbon-coalition', 'demo-user-501', 'OWNER', 'ACCEPTED', NOW()),
  ('demo-tm-502', 'demo-team-carbon-coalition', 'demo-user-502', 'MEMBER', 'ACCEPTED', NOW()),
  ('demo-tm-503', 'demo-team-carbon-coalition', 'demo-user-503', 'MEMBER', 'ACCEPTED', NOW())
ON CONFLICT (id) DO NOTHING;

-- Digital Overlords (Sage Thompson is captain)
INSERT INTO "TeamMember" (id, "teamId", "userId", role, status, "createdAt")
VALUES 
  ('demo-tm-601', 'demo-team-digital-overlords', 'demo-user-601', 'OWNER', 'ACCEPTED', NOW())
ON CONFLICT (id) DO NOTHING;

-- Analog Army (Robin Sinclair is captain)
INSERT INTO "TeamMember" (id, "teamId", "userId", role, status, "createdAt")
VALUES 
  ('demo-tm-701', 'demo-team-analog-army', 'demo-user-701', 'OWNER', 'ACCEPTED', NOW()),
  ('demo-tm-702', 'demo-team-analog-army', 'demo-user-702', 'MEMBER', 'ACCEPTED', NOW())
ON CONFLICT (id) DO NOTHING;

-- Quantum Collective (Kai Patel is captain)
INSERT INTO "TeamMember" (id, "teamId", "userId", role, status, "createdAt")
VALUES 
  ('demo-tm-801', 'demo-team-quantum-collective', 'demo-user-801', 'OWNER', 'ACCEPTED', NOW()),
  ('demo-tm-802', 'demo-team-quantum-collective', 'demo-user-802', 'MEMBER', 'ACCEPTED', NOW())
ON CONFLICT (id) DO NOTHING;

-- Observers team
INSERT INTO "TeamMember" (id, "teamId", "userId", role, status, "createdAt")
VALUES 
  ('demo-tm-obs-001', 'demo-team-observers', 'demo-observer-001', 'MEMBER', 'ACCEPTED', NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 6. CREATE TEAM INVITES (pending invites to free agents)
-- ============================================================================
INSERT INTO "TeamInvite" (id, "teamId", "userId", message, status, "createdAt")
VALUES 
  ('demo-invite-001', 'demo-team-human-touch', 'demo-free-5001', 'We''d love to have you join Human Touch! Your design skills would be perfect for our Empathy Engine project.', 'PENDING', '2026-01-12T09:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 7. CREATE PROJECTS (Submissions)
-- ============================================================================
INSERT INTO "Project" (id, "teamId", name, description, "videoUrl", "repoUrl", "demoUrl", "submittedAt", "createdAt", "updatedAt")
VALUES 
  ('demo-proj-human-touch', 'demo-team-human-touch', 'Empathy Engine', 'A design system that adapts to user emotional states through micro-interactions and thoughtful UX patterns. It proves that human intuition in design cannot be replicated by algorithms.', 'https://youtube.com/watch?v=example123', 'https://github.com/human-touch/empathy-engine', 'https://empathy-engine.vercel.app', '2026-01-14T09:00:00Z', NOW(), NOW()),
  ('demo-proj-neural-nexus', 'demo-team-neural-nexus', 'CodeReview AI', 'An autonomous code review agent powered by LLMs that provides intelligent feedback on pull requests. It analyzes code patterns, suggests improvements, and catches bugs before they reach production.', 'https://youtube.com/watch?v=neural123', 'https://github.com/neural-nexus/codereview-ai', 'https://codereview-ai.vercel.app', '2026-01-14T10:30:00Z', NOW(), NOW()),
  ('demo-proj-the-resistance', 'demo-team-the-resistance', 'HumanFirst', 'A collaborative workspace that prioritizes human connection over efficiency metrics. Features real-time collaboration without AI interference.', 'https://youtube.com/watch?v=resist789', 'https://github.com/the-resistance/humanfirst', 'https://humanfirst.app', '2026-01-14T11:00:00Z', NOW(), NOW()),
  ('demo-proj-synthetic-minds', 'demo-team-synthetic-minds', 'MindMeld', 'An AI-powered brainstorming tool that generates, combines, and evolves ideas faster than any human team could. Let the machines do the thinking.', 'https://youtube.com/watch?v=synth456', 'https://github.com/synthetic-minds/mindmeld', 'https://mindmeld.ai', '2026-01-14T10:00:00Z', NOW(), NOW()),
  ('demo-proj-carbon-coalition', 'demo-team-carbon-coalition', 'SecureVault', 'Hardware-backed authentication that proves humans are still the best at security. No AI, no cloud dependencies, just pure engineering.', 'https://youtube.com/watch?v=vault321', 'https://github.com/carbon-coalition/securevault', '', '2026-01-14T09:30:00Z', NOW(), NOW()),
  ('demo-proj-quantum-collective', 'demo-team-quantum-collective', 'QuantumGen', 'A next-generation code generator that uses multiple AI models in parallel to produce optimal solutions. The future of development is here.', 'https://youtube.com/watch?v=quantum456', 'https://github.com/quantum-collective/quantumgen', 'https://quantumgen.ai', '2026-01-14T08:30:00Z', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  "updatedAt" = NOW();

-- ============================================================================
-- 8. CREATE VOTES (People's Champion voting)
-- ============================================================================
INSERT INTO "Vote" (id, "projectId", "userId", "createdAt")
VALUES 
  -- Votes for Human Touch (People's Champion contender - 4 votes)
  ('demo-vote-001', 'demo-proj-human-touch', 'demo-user-301', '2026-01-15T10:00:00Z'),
  ('demo-vote-002', 'demo-proj-human-touch', 'demo-user-302', '2026-01-15T10:30:00Z'),
  ('demo-vote-003', 'demo-proj-human-touch', 'demo-user-401', '2026-01-15T11:00:00Z'),
  ('demo-vote-004', 'demo-proj-human-touch', 'demo-user-501', '2026-01-15T11:30:00Z'),
  -- Votes for Quantum Collective (3 votes)
  ('demo-vote-005', 'demo-proj-quantum-collective', 'demo-user-101', '2026-01-15T12:00:00Z'),
  ('demo-vote-006', 'demo-proj-quantum-collective', 'demo-user-102', '2026-01-15T12:30:00Z'),
  ('demo-vote-007', 'demo-proj-quantum-collective', 'demo-user-601', '2026-01-15T13:00:00Z'),
  -- Votes for Neural Nexus (2 votes)
  ('demo-vote-008', 'demo-proj-neural-nexus', 'demo-user-701', '2026-01-15T13:30:00Z'),
  ('demo-vote-009', 'demo-proj-neural-nexus', 'demo-user-702', '2026-01-15T14:00:00Z'),
  -- Votes for The Resistance (1 vote)
  ('demo-vote-010', 'demo-proj-the-resistance', 'demo-user-201', '2026-01-15T14:30:00Z')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 9. CREATE JUDGE SCORES
-- ============================================================================
INSERT INTO "JudgeScore" (id, "projectId", "judgeId", scores, comments, "createdAt", "updatedAt")
VALUES 
  -- Human Touch scores (3 judges)
  ('demo-score-001', 'demo-proj-human-touch', 'demo-judge-3001', '{"innovation": 9, "technical": 7, "presentation": 10, "impact": 8, "theme": 9}', 'Beautiful presentation. The emotional design approach is unique.', '2026-01-16T13:00:00Z', NOW()),
  ('demo-score-002', 'demo-proj-human-touch', 'demo-judge-3002', '{"innovation": 8, "technical": 7, "presentation": 9, "impact": 9, "theme": 10}', 'Perfect embodiment of the human side. Inspiring work.', '2026-01-16T13:30:00Z', NOW()),
  ('demo-score-003', 'demo-proj-human-touch', 'demo-judge-3003', '{"innovation": 9, "technical": 8, "presentation": 9, "impact": 8, "theme": 9}', 'A compelling argument for human-centered design.', '2026-01-16T15:00:00Z', NOW()),
  -- Neural Nexus scores (2 judges)
  ('demo-score-004', 'demo-proj-neural-nexus', 'demo-judge-3001', '{"innovation": 9, "technical": 9, "presentation": 8, "impact": 9, "theme": 8}', 'Excellent technical execution. The AI integration is seamless.', '2026-01-16T14:00:00Z', NOW()),
  ('demo-score-005', 'demo-proj-neural-nexus', 'demo-judge-3002', '{"innovation": 8, "technical": 9, "presentation": 7, "impact": 8, "theme": 9}', 'Strong alignment with the AI theme. Very practical solution.', '2026-01-16T14:30:00Z', NOW()),
  -- The Resistance scores (1 judge)
  ('demo-score-006', 'demo-proj-the-resistance', 'demo-judge-3001', '{"innovation": 7, "technical": 8, "presentation": 8, "impact": 7, "theme": 8}', 'Solid execution, though the concept is less groundbreaking.', '2026-01-16T15:00:00Z', NOW()),
  -- Synthetic Minds scores (1 judge)
  ('demo-score-007', 'demo-proj-synthetic-minds', 'demo-judge-3002', '{"innovation": 8, "technical": 8, "presentation": 7, "impact": 8, "theme": 9}', 'Creative use of AI for ideation. Good theme alignment.', '2026-01-16T14:45:00Z', NOW()),
  -- Quantum Collective scores (3 judges - TOP SCORER)
  ('demo-score-008', 'demo-proj-quantum-collective', 'demo-judge-3001', '{"innovation": 10, "technical": 10, "presentation": 9, "impact": 10, "theme": 10}', 'Exceptional. This is the future of software development.', '2026-01-16T12:00:00Z', NOW()),
  ('demo-score-009', 'demo-proj-quantum-collective', 'demo-judge-3002', '{"innovation": 9, "technical": 10, "presentation": 8, "impact": 9, "theme": 10}', 'Technical masterpiece. Perfect AI theme alignment.', '2026-01-16T12:30:00Z', NOW()),
  ('demo-score-010', 'demo-proj-quantum-collective', 'demo-judge-3003', '{"innovation": 10, "technical": 9, "presentation": 9, "impact": 10, "theme": 9}', 'Game-changing potential. Well executed.', '2026-01-16T14:00:00Z', NOW())
ON CONFLICT (id) DO UPDATE SET 
  scores = EXCLUDED.scores,
  comments = EXCLUDED.comments,
  "updatedAt" = NOW();

-- ============================================================================
-- VERIFICATION QUERIES (Run these to verify the data was created)
-- ============================================================================
-- SELECT * FROM "Event" WHERE id = 'demo-event-2026';
-- SELECT COUNT(*) as user_count FROM "User" WHERE id LIKE 'demo-%';
-- SELECT COUNT(*) as team_count FROM "Team" WHERE "eventId" = 'demo-event-2026';
-- SELECT COUNT(*) as project_count FROM "Project" WHERE id LIKE 'demo-%';
-- SELECT COUNT(*) as vote_count FROM "Vote" WHERE id LIKE 'demo-%';
-- SELECT COUNT(*) as score_count FROM "JudgeScore" WHERE id LIKE 'demo-%';
