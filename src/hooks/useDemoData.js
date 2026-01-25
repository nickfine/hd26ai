/**
 * Hook to fetch demo data from Supabase
 * 
 * This provides unified demo data across HD26Forge and HD26AI.
 * Demo data is seeded via supabase/migrations/seed_demo_data.sql
 * 
 * When Supabase is not configured, returns null to fall back to hardcoded mock data.
 */

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { DEMO_EVENT_ID, ROLE_MAP } from '../lib/constants';

export function useDemoData(enabled = false) {
  const [demoData, setDemoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled || !supabase) {
      setDemoData(null);
      return;
    }

    async function fetchDemoData() {
      setLoading(true);
      setError(null);

      try {
        // Fetch demo event
        const { data: eventData, error: eventError } = await supabase
          .from('Event')
          .select('*')
          .eq('id', DEMO_EVENT_ID)
          .single();

        if (eventError) {
          console.log('[useDemoData] Demo event not found, using hardcoded data');
          setDemoData(null);
          return;
        }

        // Fetch demo users
        const { data: users, error: usersError } = await supabase
          .from('User')
          .select('*')
          .like('id', 'demo-%');

        if (usersError) console.warn('[useDemoData] Error fetching users:', usersError);

        // Fetch demo teams with members
        const { data: teams, error: teamsError } = await supabase
          .from('Team')
          .select(`
            *,
            members:TeamMember(
              id,
              role,
              status,
              userId,
              user:User(id, name, callsign, skills, role, isFreeAgent, bio)
            ),
            project:Project(*)
          `)
          .eq('eventId', DEMO_EVENT_ID)
          .order('createdAt', { ascending: true });

        if (teamsError) console.warn('[useDemoData] Error fetching teams:', teamsError);

        // Fetch demo votes
        const { data: votes, error: votesError } = await supabase
          .from('Vote')
          .select('*')
          .like('id', 'demo-%');

        if (votesError) console.warn('[useDemoData] Error fetching votes:', votesError);

        // Fetch demo judge scores
        const { data: scores, error: scoresError } = await supabase
          .from('JudgeScore')
          .select(`
            *,
            judge:User(id, name, callsign)
          `)
          .like('id', 'demo-%');

        if (scoresError) console.warn('[useDemoData] Error fetching scores:', scoresError);

        // Create vote counts by projectId
        const voteCountsByProject = {};
        (votes || []).forEach(v => {
          voteCountsByProject[v.projectId] = (voteCountsByProject[v.projectId] || 0) + 1;
        });

        // Create scores by projectId
        const scoresByProject = {};
        (scores || []).forEach(s => {
          if (!scoresByProject[s.projectId]) {
            scoresByProject[s.projectId] = [];
          }
          scoresByProject[s.projectId].push({
            judgeId: s.judgeId,
            judgeName: s.judge?.name,
            scores: s.scores,
            comments: s.comments,
            scoredAt: s.createdAt,
          });
        });

        // Transform teams to app format (matching MOCK_TEAMS structure)
        const transformedTeams = (teams || []).map(team => {
          const captain = team.members?.find(m => m.role === 'OWNER');
          const acceptedMembers = team.members?.filter(m => m.status === 'ACCEPTED') || [];
          const project = team.project?.[0] || team.project;
          
          return {
            id: team.id.startsWith('demo-team-') ? parseInt(team.id.replace('demo-team-', '').replace(/-/g, ''), 36) % 1000 : team.id,
            dbId: team.id,  // Keep original DB ID for queries
            name: team.name,
            description: team.description,
            lookingFor: team.lookingFor ? team.lookingFor.split(',').map(s => s.trim()) : [],
            maxMembers: team.maxSize,
            captainId: captain?.user?.id ? parseInt(captain.user.id.replace('demo-user-', ''), 10) || captain.userId : captain?.userId,
            moreInfo: '',
            isAutoCreated: team.isAutoCreated,
            members: acceptedMembers.map(m => ({
              id: m.user?.id ? parseInt(m.user.id.replace('demo-user-', ''), 10) || m.userId : m.userId,
              dbId: m.userId,
              name: m.user?.name || 'Unknown',
              callsign: m.user?.callsign || '',
              skills: m.user?.skills ? m.user.skills.split(',').map(s => s.trim()) : [],
            })),
            joinRequests: [],  // Not fetched for demo
            submission: project ? {
              status: project.submittedAt ? 'submitted' : 'not_started',
              projectName: project.name,
              description: project.description,
              demoVideoUrl: project.videoUrl,
              repoUrl: project.repoUrl,
              liveDemoUrl: project.demoUrl,
              submittedAt: project.submittedAt,
              lastUpdated: project.updatedAt,
              participantVotes: voteCountsByProject[project.id] || 0,
              judgeScores: scoresByProject[project.id] || [],
            } : {
              status: 'not_started',
              projectName: '',
              description: '',
              demoVideoUrl: '',
              repoUrl: '',
              liveDemoUrl: '',
              submittedAt: null,
              lastUpdated: null,
              participantVotes: 0,
              judgeScores: [],
            },
          };
        }).filter(t => t.name !== 'Observers');  // Exclude observers team from normal list

        // Transform free agents
        const teamMemberIds = new Set();
        (teams || []).forEach(t => {
          (t.members || []).forEach(m => {
            if (m.status === 'ACCEPTED') teamMemberIds.add(m.userId);
          });
        });

        const transformedFreeAgents = (users || [])
          .filter(u => u.isFreeAgent && !teamMemberIds.has(u.id))
          .map(u => ({
            id: parseInt(u.id.replace('demo-free-', ''), 10) || u.id,
            dbId: u.id,
            name: u.name,
            callsign: u.callsign || '',
            skills: u.skills ? u.skills.split(',').map(s => s.trim()) : [],
            bio: u.bio || '',
            teamInvites: [],
            autoAssignOptIn: u.autoAssignOptIn || false,
          }));

        // Transform users for admin panel
        const transformedUsers = {
          participants: (users || []).filter(u => u.role === 'USER' && !u.isFreeAgent).map(u => ({
            id: parseInt(u.id.replace(/demo-user-|demo-free-/, ''), 10) || u.id,
            dbId: u.id,
            name: u.name,
            callsign: u.callsign || '',
            email: u.email,
            skills: u.skills ? u.skills.split(',').map(s => s.trim()) : [],
            role: ROLE_MAP[u.role] || 'participant',
          })),
          ambassadors: (users || []).filter(u => u.role === 'AMBASSADOR').map(u => ({
            id: parseInt(u.id.replace('demo-', ''), 10) || u.id,
            dbId: u.id,
            name: u.name,
            email: u.email,
            skills: u.skills ? u.skills.split(',').map(s => s.trim()) : [],
            role: 'ambassador',
            bio: u.bio || '',
          })),
          judges: (users || []).filter(u => u.role === 'JUDGE').map(u => ({
            id: parseInt(u.id.replace('demo-judge-', ''), 10) || u.id,
            dbId: u.id,
            name: u.name,
            email: u.email,
            skills: [],
            role: 'judge',
            title: u.callsign || 'Judge',
          })),
          admins: (users || []).filter(u => u.role === 'ADMIN').map(u => ({
            id: parseInt(u.id.replace('demo-admin-', ''), 10) || u.id,
            dbId: u.id,
            name: u.name,
            callsign: u.callsign || '',
            email: u.email,
            skills: [],
            role: 'admin',
          })),
        };

        console.log('[useDemoData] Loaded demo data from database:', {
          event: eventData.name,
          teams: transformedTeams.length,
          freeAgents: transformedFreeAgents.length,
          users: Object.values(transformedUsers).flat().length,
        });

        setDemoData({
          event: eventData,
          teams: transformedTeams,
          freeAgents: transformedFreeAgents,
          users: transformedUsers,
          votes: votes || [],
          scores: scores || [],
        });
      } catch (err) {
        console.error('[useDemoData] Error:', err);
        setError(err.message);
        setDemoData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchDemoData();
  }, [enabled]);

  return { demoData, loading, error };
}
