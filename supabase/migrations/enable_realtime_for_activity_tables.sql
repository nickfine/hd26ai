-- Enable Realtime for TeamMember, Team, and Project tables for activity feed
-- Note: Realtime must be enabled in Supabase dashboard first
-- This migration ensures tables are published to Realtime

-- Enable Realtime publication for TeamMember table
ALTER PUBLICATION supabase_realtime ADD TABLE "TeamMember";

-- Enable Realtime publication for Team table
ALTER PUBLICATION supabase_realtime ADD TABLE "Team";

-- Enable Realtime publication for Project table
ALTER PUBLICATION supabase_realtime ADD TABLE "Project";
