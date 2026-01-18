import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { REVERSE_PHASE_MAP, PHASE_MAP, ROLE_MAP, REVERSE_ROLE_MAP } from '../lib/constants';

// Helper to check if data has changed (shallow compare for arrays)
const hasDataChanged = (prev, next) => {
  if (!prev || !next) return prev !== next;
  if (prev.length !== next.length) return true;
  return prev.some((item, i) => item.id !== next[i]?.id);
};

// ============================================================================
// TEAMS HOOK
// ============================================================================

/**
 * Hook for fetching and managing teams
 */
export function useTeams(eventId = null) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const prevDataRef = useRef(null);

  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('Team')
        .select(`
          *,
          members:TeamMember(
            id,
            userId,
            role,
            status,
            user:User(id, name, email, image, skills)
          ),
          project:Project(*)
        `)
        .eq('isPublic', true)
        .order('createdAt', { ascending: false });

      if (eventId) {
        query = query.eq('eventId', eventId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Transform data to match our app's expected format
      const transformedTeams = (data || []).map(team => ({
        id: team.id,
        name: team.name,
        description: team.description || '',
        lookingFor: team.lookingFor ? team.lookingFor.split(',').map(s => s.trim()) : [],
        maxMembers: team.maxSize || 6,
        moreInfo: '',
        emoji: team.emoji,
        slug: team.slug,
        isPublic: team.isPublic,
        captainId: team.members?.find(m => m.role === 'OWNER' && m.status === 'ACCEPTED')?.userId || null,
        members: (team.members || [])
          .filter(m => m.status === 'ACCEPTED')
          .map(m => ({
            id: m.userId,
            name: m.user?.name || 'Unknown',
            callsign: '',
            skills: m.user?.skills ? m.user.skills.split(',').map(s => s.trim()) : [],
            image: m.user?.image,
          })),
        joinRequests: (team.members || [])
          .filter(m => m.status === 'PENDING')
          .map(m => ({
            id: m.id,
            userId: m.userId,
            userName: m.user?.name || 'Unknown',
            userSkills: m.user?.skills ? m.user.skills.split(',').map(s => s.trim()) : [],
            message: '',
            timestamp: m.createdAt,
          })),
        submission: team.project ? {
          projectId: team.project.id, // For vote tracking
          status: team.project.submittedAt ? 'submitted' : 'not_started',
          projectName: team.project.name || '',
          description: team.project.description || '',
          demoVideoUrl: team.project.videoUrl || '',
          repoUrl: team.project.repoUrl || '',
          liveDemoUrl: team.project.demoUrl || '',
          submittedAt: team.project.submittedAt,
          lastUpdated: team.project.updatedAt,
          participantVotes: 0, // Will be filled by votes query
          judgeScores: [],
        } : {
          projectId: null,
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
      }));

      setTeams(transformedTeams);
      setError(null);
    } catch (err) {
      console.error('Error fetching teams:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  return { teams, loading, error, refetch: fetchTeams };
}

// ============================================================================
// SINGLE TEAM HOOK
// ============================================================================

export function useTeam(teamId) {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTeam = useCallback(async () => {
    if (!teamId) {
      setTeam(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data, error: fetchError } = await supabase
        .from('Team')
        .select(`
          *,
          members:TeamMember(
            id,
            userId,
            role,
            status,
            createdAt,
            user:User(id, name, email, image, skills, trackSide, bio)
          ),
          project:Project(*)
        `)
        .eq('id', teamId)
        .single();

      if (fetchError) throw fetchError;

      // Transform to app format
      const transformedTeam = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        lookingFor: data.lookingFor ? data.lookingFor.split(',').map(s => s.trim()) : [],
        maxMembers: data.maxSize || 6,
        moreInfo: '',
        emoji: data.emoji,
        captainId: data.members?.find(m => m.role === 'OWNER' && m.status === 'ACCEPTED')?.userId || null,
        members: (data.members || [])
          .filter(m => m.status === 'ACCEPTED')
          .map(m => ({
            id: m.userId,
            name: m.user?.name || 'Unknown',
            callsign: '',
            skills: m.user?.skills ? m.user.skills.split(',').map(s => s.trim()) : [],
            image: m.user?.image,
          })),
        joinRequests: (data.members || [])
          .filter(m => m.status === 'PENDING')
          .map(m => ({
            id: m.id,
            userId: m.userId,
            userName: m.user?.name || 'Unknown',
            userSkills: m.user?.skills ? m.user.skills.split(',').map(s => s.trim()) : [],
            message: '',
            timestamp: m.createdAt,
          })),
        submission: data.project ? {
          projectId: data.project.id, // For vote tracking
          status: data.project.submittedAt ? 'submitted' : 'not_started',
          projectName: data.project.name || '',
          description: data.project.description || '',
          demoVideoUrl: data.project.videoUrl || '',
          repoUrl: data.project.repoUrl || '',
          liveDemoUrl: data.project.demoUrl || '',
          submittedAt: data.project.submittedAt,
          lastUpdated: data.project.updatedAt,
          participantVotes: 0,
          judgeScores: [],
        } : {
          projectId: null,
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

      setTeam(transformedTeam);
      setError(null);
    } catch (err) {
      console.error('Error fetching team:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  return { team, loading, error, refetch: fetchTeam };
}

// ============================================================================
// FREE AGENTS HOOK
// ============================================================================

export function useFreeAgents() {
  const [freeAgents, setFreeAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFreeAgents = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch free agents with their pending invites
      const { data: users, error: fetchError } = await supabase
        .from('User')
        .select('*')
        .eq('isFreeAgent', true)
        .order('createdAt', { ascending: false });

      if (fetchError) throw fetchError;

      // Fetch all pending invites for these users
      const userIds = (users || []).map(u => u.id);
      const { data: invites, error: invitesError } = await supabase
        .from('TeamInvite')
        .select(`
          *,
          team:Team(id, name)
        `)
        .in('userId', userIds)
        .eq('status', 'PENDING');

      if (invitesError) throw invitesError;

      // Group invites by userId
      const invitesByUser = {};
      (invites || []).forEach(invite => {
        if (!invitesByUser[invite.userId]) {
          invitesByUser[invite.userId] = [];
        }
        invitesByUser[invite.userId].push({
          id: invite.id,
          teamId: invite.teamId,
          teamName: invite.team?.name || 'Unknown Team',
          message: invite.message || '',
          createdAt: invite.createdAt,
        });
      });

      const transformedAgents = (users || []).map(user => ({
        id: user.id,
        name: user.name || 'Unknown',
        skills: user.skills ? user.skills.split(',').map(s => s.trim()) : [],
        bio: user.bio || '',
        image: user.image,
        teamInvites: invitesByUser[user.id] || [],
      }));

      setFreeAgents(transformedAgents);
      setError(null);
    } catch (err) {
      console.error('Error fetching free agents:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFreeAgents();
  }, [fetchFreeAgents]);

  return { freeAgents, loading, error, refetch: fetchFreeAgents };
}

// ============================================================================
// VOTES HOOK
// ============================================================================

export function useVotes(userId) {
  const [userVotes, setUserVotes] = useState([]);
  const [voteCounts, setVoteCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const MAX_VOTES = 5;

  const fetchVotes = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch user's votes
      if (userId) {
        const { data: userVoteData, error: userVoteError } = await supabase
          .from('Vote')
          .select('projectId')
          .eq('userId', userId);

        if (userVoteError) throw userVoteError;
        setUserVotes((userVoteData || []).map(v => v.projectId));
      }

      // Fetch vote counts per project
      const { data: allVotes, error: countError } = await supabase
        .from('Vote')
        .select('projectId');

      if (countError) throw countError;

      const counts = {};
      (allVotes || []).forEach(vote => {
        counts[vote.projectId] = (counts[vote.projectId] || 0) + 1;
      });
      setVoteCounts(counts);

      setError(null);
    } catch (err) {
      console.error('Error fetching votes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchVotes();
  }, [fetchVotes]);

  const vote = useCallback(async (projectId) => {
    if (!userId) {
      setError('Must be logged in to vote');
      return { error: 'Must be logged in to vote' };
    }

    const hasVoted = userVotes.includes(projectId);

    try {
      if (hasVoted) {
        // Remove vote
        const { error: deleteError } = await supabase
          .from('Vote')
          .delete()
          .eq('userId', userId)
          .eq('projectId', projectId);

        if (deleteError) throw deleteError;

        setUserVotes(prev => prev.filter(id => id !== projectId));
        setVoteCounts(prev => ({
          ...prev,
          [projectId]: Math.max(0, (prev[projectId] || 1) - 1),
        }));
      } else {
        // Check vote limit
        if (userVotes.length >= MAX_VOTES) {
          return { error: `Maximum ${MAX_VOTES} votes allowed` };
        }

        // Add vote
        const { error: insertError } = await supabase
          .from('Vote')
          .insert({
            id: crypto.randomUUID(),
            userId,
            projectId,
          });

        if (insertError) throw insertError;

        setUserVotes(prev => [...prev, projectId]);
        setVoteCounts(prev => ({
          ...prev,
          [projectId]: (prev[projectId] || 0) + 1,
        }));
      }

      return { error: null };
    } catch (err) {
      console.error('Error voting:', err);
      setError(err.message);
      return { error: err.message };
    }
  }, [userId, userVotes]);

  return {
    userVotes,
    voteCounts,
    loading,
    error,
    vote,
    refetch: fetchVotes,
    remainingVotes: MAX_VOTES - userVotes.length,
  };
}

// ============================================================================
// JUDGE SCORES HOOK
// ============================================================================

export function useJudgeScores(projectId = null) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchScores = useCallback(async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('JudgeScore')
        .select(`
          *,
          judge:User!judgeId(id, name, image)
        `);

      if (projectId) {
        query = query.eq('projectId', projectId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      const transformedScores = (data || []).map(score => ({
        id: score.id,
        judgeId: score.judgeId,
        judgeName: score.judge?.name || 'Unknown Judge',
        projectId: score.projectId,
        scores: score.scores || {},
        comments: score.comments || '',
        scoredAt: score.createdAt,
      }));

      setScores(transformedScores);
      setError(null);
    } catch (err) {
      console.error('Error fetching judge scores:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  const submitScore = useCallback(async (judgeId, targetProjectId, scoreData) => {
    try {
      // Check if score already exists
      const { data: existing } = await supabase
        .from('JudgeScore')
        .select('id')
        .eq('judgeId', judgeId)
        .eq('projectId', targetProjectId)
        .single();

      if (existing) {
        // Update existing score
        const { error: updateError } = await supabase
          .from('JudgeScore')
          .update({
            scores: scoreData.scores,
            comments: scoreData.comments || '',
            updatedAt: new Date().toISOString(),
          })
          .eq('id', existing.id);

        if (updateError) throw updateError;
      } else {
        // Insert new score
        const { error: insertError } = await supabase
          .from('JudgeScore')
          .insert({
            id: crypto.randomUUID(),
            judgeId,
            projectId: targetProjectId,
            scores: scoreData.scores,
            comments: scoreData.comments || '',
          });

        if (insertError) throw insertError;
      }

      await fetchScores();
      return { error: null };
    } catch (err) {
      console.error('Error submitting score:', err);
      setError(err.message);
      return { error: err.message };
    }
  }, [fetchScores]);

  return { scores, loading, error, submitScore, refetch: fetchScores };
}

// ============================================================================
// OBSERVERS TEAM HELPER
// ============================================================================

/**
 * Get or create the Observers team for an event
 * @param {string} eventId - Event ID
 * @returns {Promise<{id: string, error: string|null}>}
 */
async function getOrCreateObserversTeam(eventId) {
  try {
    // Try to find existing Observers team
    const { data: existingTeam, error: findError } = await supabase
      .from('Team')
      .select('id')
      .eq('eventId', eventId)
      .eq('name', 'Observers')
      .maybeSingle();

    if (findError && findError.code !== 'PGRST116') throw findError;

    if (existingTeam) {
      return { id: existingTeam.id, error: null };
    }

    // Create Observers team if it doesn't exist
    const observersTeamId = 'team-observers';
    const { data: newTeam, error: createError } = await supabase
      .from('Team')
      .insert({
        id: observersTeamId,
        eventId: eventId,
        name: 'Observers',
        description: 'Watch and learn from the sidelines',
        maxSize: 999, // No limit for observers
        trackSide: 'HUMAN', // Default, can be changed
        isPublic: true,
        isAutoCreated: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (createError) throw createError;
    return { id: newTeam.id, error: null };
  } catch (err) {
    console.error('Error getting/creating Observers team:', err);
    return { id: null, error: err.message };
  }
}

/**
 * Automatically assign free agents to Observers team
 * @param {string} eventId - Event ID
 * @returns {Promise<{assigned: number, error: string|null}>}
 */
async function autoAssignFreeAgentsToObservers(eventId) {
  try {
    // Get or create Observers team
    const { id: observersTeamId, error: teamError } = await getOrCreateObserversTeam(eventId);
    if (teamError || !observersTeamId) {
      throw new Error(`Failed to get Observers team: ${teamError}`);
    }

    // Find all free agents (users with isFreeAgent = true)
    const { data: freeAgents, error: agentsError } = await supabase
      .from('User')
      .select('id, name, email')
      .eq('isFreeAgent', true);

    if (agentsError) throw agentsError;

    if (!freeAgents || freeAgents.length === 0) {
      return { assigned: 0, error: null };
    }

    // Check which users are already on teams
    const userIds = freeAgents.map(u => u.id);
    const { data: existingMembers, error: membersError } = await supabase
      .from('TeamMember')
      .select('userId')
      .in('userId', userIds)
      .eq('status', 'ACCEPTED');

    if (membersError) throw membersError;

    const usersOnTeams = new Set((existingMembers || []).map(m => m.userId));
    const usersToAssign = freeAgents.filter(u => !usersOnTeams.has(u.id));

    if (usersToAssign.length === 0) {
      return { assigned: 0, error: null };
    }

    // Add users to Observers team
    const teamMembers = usersToAssign.map(user => ({
      id: `tm-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      teamId: observersTeamId,
      userId: user.id,
      role: 'MEMBER',
      status: 'ACCEPTED',
      createdAt: new Date().toISOString(),
    }));

    const { error: insertError } = await supabase
      .from('TeamMember')
      .insert(teamMembers);

    if (insertError) throw insertError;

    // Update isFreeAgent flag for assigned users
    const assignedUserIds = usersToAssign.map(u => u.id);
    const { error: updateError } = await supabase
      .from('User')
      .update({ isFreeAgent: false, updatedAt: new Date().toISOString() })
      .in('id', assignedUserIds);

    if (updateError) throw updateError;

    console.log(`Auto-assigned ${usersToAssign.length} free agents to Observers team`);
    return { assigned: usersToAssign.length, error: null };
  } catch (err) {
    console.error('Error auto-assigning free agents:', err);
    return { assigned: 0, error: err.message };
  }
}

/**
 * Check if hack start is within 24-48 hours and send reminders to free agents
 * @param {string} eventId - Event ID
 * @param {string} startDate - Event start date (ISO string)
 * @returns {Promise<{notified: number, error: string|null}>}
 */
async function checkAndSendFreeAgentReminders(eventId, startDate) {
  try {
    if (!startDate) {
      console.warn('No start date set for event, skipping reminders');
      return { notified: 0, error: null };
    }

    const now = new Date();
    const hackStart = new Date(startDate);
    const hoursUntilHack = (hackStart - now) / (1000 * 60 * 60);

    // Check if within 24-48 hour window
    if (hoursUntilHack < 24 || hoursUntilHack > 48) {
      console.log(`Hack start is ${hoursUntilHack.toFixed(1)} hours away, outside reminder window`);
      return { notified: 0, error: null };
    }

    // Find all free agents who haven't joined a team
    const { data: freeAgents, error: agentsError } = await supabase
      .from('User')
      .select('id, name, email, isFreeAgent')
      .eq('isFreeAgent', true);

    if (agentsError) throw agentsError;

    if (!freeAgents || freeAgents.length === 0) {
      return { notified: 0, error: null };
    }

    // Check which users are already on teams
    const userIds = freeAgents.map(u => u.id);
    const { data: existingMembers } = await supabase
      .from('TeamMember')
      .select('userId')
      .in('userId', userIds)
      .eq('status', 'ACCEPTED');

    const usersOnTeams = new Set((existingMembers || []).map(m => m.userId));
    const usersToNotify = freeAgents.filter(u => !usersOnTeams.has(u.id));

    // Store reminder sent timestamp (we'll add a field or use a separate table)
    // For now, we'll just log it - in-app notifications will be handled by UI
    console.log(`Reminder check: ${usersToNotify.length} free agents to notify`);

    // TODO: Send email reminders (requires email service setup)
    // For now, in-app notifications will be shown via UI component

    return { notified: usersToNotify.length, error: null };
  } catch (err) {
    console.error('Error checking reminders:', err);
    return { notified: 0, error: err.message };
  }
}

// ============================================================================
// EVENT HOOK
// ============================================================================

export function useEvent() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvent = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error: fetchError } = await supabase
        .from('Event')
        .select(`
          *,
          milestones:Milestone(*)
        `)
        .eq('isCurrent', true)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      if (data) {
        setEvent({
          id: data.id,
          name: data.name,
          slug: data.slug,
          year: data.year,
          description: data.description,
          phase: PHASE_MAP[data.phase] || 'setup',
          startDate: data.startDate,
          endDate: data.endDate,
          rubricConfig: data.rubricConfig,
          prizesConfig: data.prizesConfig,
          milestones: data.milestones || [],
          motd: data.motd || '', // Message of the Day for admin-editable messages
        });
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching event:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const updatePhase = useCallback(async (newPhase) => {
    if (!event?.id) return { error: 'No event found' };

    try {
      // Map app phase (lowercase) to DB enum (uppercase)
      const dbPhase = REVERSE_PHASE_MAP[newPhase] || 'REGISTRATION';
      
      const { error: updateError } = await supabase
        .from('Event')
        .update({
          phase: dbPhase,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', event.id);

      if (updateError) throw updateError;

      // REMINDER SYSTEM: If phase is changing to 'team_formation', check for reminders
      if (newPhase === 'team_formation') {
        await checkAndSendFreeAgentReminders(event.id, event.startDate);
      }

      // AUTO-ASSIGNMENT: If phase is changing to 'hacking', assign free agents
      if (newPhase === 'hacking') {
        await autoAssignFreeAgentsToObservers(event.id);
      }

      setEvent(prev => prev ? { ...prev, phase: newPhase } : null);
      return { error: null };
    } catch (err) {
      console.error('Error updating phase:', err);
      return { error: err.message };
    }
  }, [event?.id, event?.startDate]);

  return { event, loading, error, updatePhase, refetch: fetchEvent };
}

// ============================================================================
// TEAM MUTATIONS
// ============================================================================

export function useTeamMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create a new team
  const createTeam = useCallback(async (teamData, userId, eventId) => {
    setLoading(true);
    setError(null);

    try {
      const teamId = crypto.randomUUID();

      // Create team
      const { error: teamError } = await supabase
        .from('Team')
        .insert({
          id: teamId,
          eventId,
          name: teamData.name,
          description: teamData.description,
          lookingFor: teamData.lookingFor?.join(', ') || '',
          maxSize: teamData.maxMembers || 6,
          isPublic: true,
        });

      if (teamError) throw teamError;

      // Add creator as owner
      const { error: memberError } = await supabase
        .from('TeamMember')
        .insert({
          id: crypto.randomUUID(),
          teamId,
          userId,
          role: 'OWNER',
          status: 'ACCEPTED',
        });

      if (memberError) throw memberError;

      // Update user to not be free agent
      await supabase
        .from('User')
        .update({ isFreeAgent: false })
        .eq('id', userId);

      setLoading(false);
      return { data: { id: teamId }, error: null };
    } catch (err) {
      console.error('Error creating team:', err);
      setError(err.message);
      setLoading(false);
      return { data: null, error: err.message };
    }
  }, []);

  // Request to join a team
  const requestJoin = useCallback(async (teamId, userId, message = '') => {
    setLoading(true);
    setError(null);

    try {
      const { error: joinError } = await supabase
        .from('TeamMember')
        .insert({
          id: crypto.randomUUID(),
          teamId,
          userId,
          role: 'MEMBER',
          status: 'PENDING',
        });

      if (joinError) throw joinError;

      setLoading(false);
      return { error: null };
    } catch (err) {
      console.error('Error requesting to join:', err);
      setError(err.message);
      setLoading(false);
      return { error: err.message };
    }
  }, []);

  // Respond to join request (captain only)
  const respondToRequest = useCallback(async (requestId, accepted) => {
    setLoading(true);
    setError(null);

    try {
      if (accepted) {
        // Accept - update status
        const { data: request, error: fetchError } = await supabase
          .from('TeamMember')
          .select('userId')
          .eq('id', requestId)
          .single();

        if (fetchError) throw fetchError;

        const { error: updateError } = await supabase
          .from('TeamMember')
          .update({ status: 'ACCEPTED' })
          .eq('id', requestId);

        if (updateError) throw updateError;

        // Update user to not be free agent
        await supabase
          .from('User')
          .update({ isFreeAgent: false })
          .eq('id', request.userId);
      } else {
        // Reject - delete request
        const { error: deleteError } = await supabase
          .from('TeamMember')
          .delete()
          .eq('id', requestId);

        if (deleteError) throw deleteError;
      }

      setLoading(false);
      return { error: null };
    } catch (err) {
      console.error('Error responding to request:', err);
      setError(err.message);
      setLoading(false);
      return { error: err.message };
    }
  }, []);

  // Leave team
  const leaveTeam = useCallback(async (teamId, userId) => {
    setLoading(true);
    setError(null);

    try {
      const { error: leaveError } = await supabase
        .from('TeamMember')
        .delete()
        .eq('teamId', teamId)
        .eq('userId', userId);

      if (leaveError) throw leaveError;

      // Update user to be free agent
      await supabase
        .from('User')
        .update({ isFreeAgent: true })
        .eq('id', userId);

      setLoading(false);
      return { error: null };
    } catch (err) {
      console.error('Error leaving team:', err);
      setError(err.message);
      setLoading(false);
      return { error: err.message };
    }
  }, []);

  // Update team
  const updateTeam = useCallback(async (teamId, updates) => {
    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('Team')
        .update({
          name: updates.name,
          description: updates.description,
          lookingFor: updates.lookingFor?.join(', '),
          maxSize: updates.maxMembers,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', teamId);

      if (updateError) throw updateError;

      setLoading(false);
      return { error: null };
    } catch (err) {
      console.error('Error updating team:', err);
      setError(err.message);
      setLoading(false);
      return { error: err.message };
    }
  }, []);

  return {
    loading,
    error,
    createTeam,
    requestJoin,
    respondToRequest,
    leaveTeam,
    updateTeam,
  };
}

// ============================================================================
// SUBMISSION MUTATIONS
// ============================================================================

export function useSubmissionMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateSubmission = useCallback(async (teamId, submissionData) => {
    setLoading(true);
    setError(null);

    try {
      // Check if project exists
      const { data: existing } = await supabase
        .from('Project')
        .select('id')
        .eq('teamId', teamId)
        .single();

      const projectData = {
        name: submissionData.projectName,
        description: submissionData.description,
        videoUrl: submissionData.demoVideoUrl,
        repoUrl: submissionData.repoUrl,
        demoUrl: submissionData.liveDemoUrl,
        submittedAt: submissionData.status === 'submitted' ? new Date().toISOString() : null,
        updatedAt: new Date().toISOString(),
      };

      if (existing) {
        const { error: updateError } = await supabase
          .from('Project')
          .update(projectData)
          .eq('id', existing.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('Project')
          .insert({
            id: crypto.randomUUID(),
            teamId,
            ...projectData,
          });

        if (insertError) throw insertError;
      }

      setLoading(false);
      return { error: null };
    } catch (err) {
      console.error('Error updating submission:', err);
      setError(err.message);
      setLoading(false);
      return { error: err.message };
    }
  }, []);

  return { loading, error, updateSubmission };
}

// ============================================================================
// USERS HOOK (Admin)
// ============================================================================

/**
 * Hook for fetching and managing users (admin only)
 */
export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map database roles to app roles
  const dbRoleToAppRole = (dbRole) => {
    return ROLE_MAP[dbRole] || 'participant';
  };

  // Map app roles to database roles
  const appRoleToDbRole = (appRole) => {
    return REVERSE_ROLE_MAP[appRole] || 'USER';
  };

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error: fetchError } = await supabase
        .from('User')
        .select('id, name, email, image, role, createdAt')
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;

      const transformedUsers = (data || []).map(user => ({
        id: user.id,
        name: user.name || 'Unknown',
        email: user.email || '',
        image: user.image,
        role: dbRoleToAppRole(user.role),
        createdAt: user.createdAt,
      }));

      setUsers(transformedUsers);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUserRole = useCallback(async (userId, newRole) => {
    try {
      const dbRole = appRoleToDbRole(newRole);

      const { error: updateError } = await supabase
        .from('User')
        .update({
          role: dbRole,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Update local state
      setUsers(prev => prev.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      ));

      return { error: null };
    } catch (err) {
      console.error('Error updating user role:', err);
      setError(err.message);
      return { error: err.message };
    }
  }, []);

  return { users, loading, error, refetch: fetchUsers, updateUserRole };
}

// ============================================================================
// TEAM INVITES HOOK
// ============================================================================

/**
 * Hook for fetching and managing team invites for a user
 */
export function useTeamInvites(userId) {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInvites = useCallback(async () => {
    if (!userId) {
      setInvites([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data, error: fetchError } = await supabase
        .from('TeamInvite')
        .select(`
          *,
          team:Team(id, name, description)
        `)
        .eq('userId', userId)
        .eq('status', 'PENDING')
        .order('createdAt', { ascending: false });

      if (fetchError) throw fetchError;

      const transformedInvites = (data || []).map(invite => ({
        id: invite.id,
        teamId: invite.teamId,
        teamName: invite.team?.name || 'Unknown Team',
        message: invite.message || '',
        createdAt: invite.createdAt,
        expiresAt: invite.expiresAt,
      }));

      setInvites(transformedInvites);
      setError(null);
    } catch (err) {
      console.error('Error fetching team invites:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchInvites();
  }, [fetchInvites]);

  return { invites, loading, error, refetch: fetchInvites };
}

// ============================================================================
// TEAM INVITE MUTATIONS
// ============================================================================

/**
 * Hook for team invite mutations (send, accept, decline)
 */
export function useTeamInviteMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Send an invite from a team captain to a free agent
  const sendInvite = useCallback(async (teamId, userId, message = '') => {
    setLoading(true);
    setError(null);

    try {
      // Check if invite already exists
      const { data: existing } = await supabase
        .from('TeamInvite')
        .select('id')
        .eq('teamId', teamId)
        .eq('userId', userId)
        .eq('status', 'PENDING')
        .single();

      if (existing) {
        setLoading(false);
        return { error: 'Invite already sent to this user' };
      }

      // Create new invite
      const { error: insertError } = await supabase
        .from('TeamInvite')
        .insert({
          id: crypto.randomUUID(),
          teamId,
          userId,
          message: message.trim() || null,
          status: 'PENDING',
        });

      if (insertError) throw insertError;

      setLoading(false);
      return { error: null };
    } catch (err) {
      console.error('Error sending invite:', err);
      setError(err.message);
      setLoading(false);
      return { error: err.message };
    }
  }, []);

  // Respond to an invite (accept or decline)
  const respondToInvite = useCallback(async (inviteId, accepted) => {
    setLoading(true);
    setError(null);

    try {
      if (accepted) {
        // Fetch invite details
        const { data: invite, error: fetchError } = await supabase
          .from('TeamInvite')
          .select('teamId, userId')
          .eq('id', inviteId)
          .single();

        if (fetchError) throw fetchError;

        // Update invite status to ACCEPTED
        const { error: updateError } = await supabase
          .from('TeamInvite')
          .update({ status: 'ACCEPTED' })
          .eq('id', inviteId);

        if (updateError) throw updateError;

        // Add user to team as a member
        const { error: memberError } = await supabase
          .from('TeamMember')
          .insert({
            id: crypto.randomUUID(),
            teamId: invite.teamId,
            userId: invite.userId,
            role: 'MEMBER',
            status: 'ACCEPTED',
          });

        if (memberError) throw memberError;

        // Update user to not be free agent
        await supabase
          .from('User')
          .update({ isFreeAgent: false })
          .eq('id', invite.userId);

        // Mark any other pending invites for this user as EXPIRED
        await supabase
          .from('TeamInvite')
          .update({ status: 'EXPIRED' })
          .eq('userId', invite.userId)
          .eq('status', 'PENDING')
          .neq('id', inviteId);
      } else {
        // Decline - update status to DECLINED
        const { error: updateError } = await supabase
          .from('TeamInvite')
          .update({ status: 'DECLINED' })
          .eq('id', inviteId);

        if (updateError) throw updateError;
      }

      setLoading(false);
      return { error: null };
    } catch (err) {
      console.error('Error responding to invite:', err);
      setError(err.message);
      setLoading(false);
      return { error: err.message };
    }
  }, []);

  return {
    loading,
    error,
    sendInvite,
    respondToInvite,
  };
}

// ============================================================================
// ACTIVITY FEED HOOK (Real-time)
// ============================================================================

/**
 * Hook for real-time activity feed using Supabase Realtime
 * Subscribes to TeamMember and Team table changes
 */
export function useActivityFeed(limit = 20) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial fetch of recent activities
  const fetchInitialActivities = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch recent team creations
      const { data: recentTeams, error: teamsError } = await supabase
        .from('Team')
        .select(`
          id,
          name,
          createdAt,
          members:TeamMember!inner(userId, user:User(id, name))
        `)
        .order('createdAt', { ascending: false })
        .limit(limit);

      if (teamsError) throw teamsError;

      // Fetch recent team member joins (ACCEPTED status)
      const { data: recentJoins, error: joinsError } = await supabase
        .from('TeamMember')
        .select(`
          id,
          userId,
          teamId,
          createdAt,
          user:User(id, name),
          team:Team(id, name)
        `)
        .eq('status', 'ACCEPTED')
        .order('createdAt', { ascending: false })
        .limit(limit);

      if (joinsError) throw joinsError;

      // Format activities
      const teamActivities = (recentTeams || []).map(team => {
        const creator = team.members?.find(m => m.user)?.user;
        return {
          id: `team-${team.id}`,
          type: 'create',
          user: creator?.name || 'Unknown',
          team: team.name,
          time: team.createdAt,
        };
      });

      const joinActivities = (recentJoins || []).map(member => ({
        id: `join-${member.id}`,
        type: 'join',
        user: member.user?.name || 'Unknown',
        team: member.team?.name || 'Unknown Team',
        time: member.createdAt,
      }));

      // Combine and sort by time
      const allActivities = [...teamActivities, ...joinActivities]
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, limit);

      setActivities(allActivities);
      setError(null);
    } catch (err) {
      console.error('Error fetching activity feed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  // Set up Realtime subscriptions
  useEffect(() => {
    fetchInitialActivities();

    // Subscribe to TeamMember inserts (when status is ACCEPTED)
    const memberChannel = supabase
      .channel('activity-member-joins')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'TeamMember',
          filter: 'status=eq.ACCEPTED',
        },
        async (payload) => {
          try {
            // Fetch user and team details
            const { data: member } = await supabase
              .from('TeamMember')
              .select(`
                userId,
                teamId,
                user:User(id, name),
                team:Team(id, name)
              `)
              .eq('id', payload.new.id)
              .single();

            if (member && member.user && member.team) {
              const activity = {
                id: `join-${member.userId}-${member.teamId}-${Date.now()}`,
                type: 'join',
                user: member.user.name || 'Unknown',
                team: member.team.name,
                time: new Date().toISOString(),
              };

              setActivities(prev => {
                // Avoid duplicates
                if (prev.some(a => a.id === activity.id)) return prev;
                return [activity, ...prev].slice(0, limit);
              });
            }
          } catch (err) {
            console.error('Error processing member join activity:', err);
          }
        }
      )
      .subscribe();

    // Subscribe to Team inserts (team created)
    const teamChannel = supabase
      .channel('activity-team-creates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Team',
        },
        async (payload) => {
          try {
            // Fetch team with creator info
            const { data: team } = await supabase
              .from('Team')
              .select(`
                id,
                name,
                members:TeamMember(userId, user:User(id, name))
              `)
              .eq('id', payload.new.id)
              .single();

            if (team && team.members && team.members.length > 0) {
              const creator = team.members.find(m => m.user)?.user;
              const activity = {
                id: `team-${team.id}-${Date.now()}`,
                type: 'create',
                user: creator?.name || 'Unknown',
                team: team.name,
                time: new Date().toISOString(),
              };

              setActivities(prev => {
                // Avoid duplicates
                if (prev.some(a => a.id === activity.id)) return prev;
                return [activity, ...prev].slice(0, limit);
              });
            }
          } catch (err) {
            console.error('Error processing team create activity:', err);
          }
        }
      )
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      supabase.removeChannel(memberChannel);
      supabase.removeChannel(teamChannel);
    };
  }, [fetchInitialActivities, limit]);

  return { activities, loading, error, refetch: fetchInitialActivities };
}

