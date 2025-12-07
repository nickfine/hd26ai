import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

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
            user:User(id, name, email, image, skills, trackSide)
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
        side: team.trackSide?.toLowerCase() || 'neutral',
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
            odById: m.userId,
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
        side: data.trackSide?.toLowerCase() || 'neutral',
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
            odById: m.userId,
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

      const { data, error: fetchError } = await supabase
        .from('User')
        .select('*')
        .eq('isFreeAgent', true)
        .order('createdAt', { ascending: false });

      if (fetchError) throw fetchError;

      const transformedAgents = (data || []).map(user => ({
        id: user.id,
        name: user.name || 'Unknown',
        skills: user.skills ? user.skills.split(',').map(s => s.trim()) : [],
        allegiance: user.trackSide?.toLowerCase() || 'neutral',
        bio: user.bio || '',
        image: user.image,
        teamInvites: [], // Would need separate query
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
          phase: data.phase?.toLowerCase() || 'setup',
          startDate: data.startDate,
          endDate: data.endDate,
          rubricConfig: data.rubricConfig,
          prizesConfig: data.prizesConfig,
          milestones: data.milestones || [],
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
      const { error: updateError } = await supabase
        .from('Event')
        .update({
          phase: newPhase.toUpperCase(),
          updatedAt: new Date().toISOString(),
        })
        .eq('id', event.id);

      if (updateError) throw updateError;

      setEvent(prev => prev ? { ...prev, phase: newPhase.toLowerCase() } : null);
      return { error: null };
    } catch (err) {
      console.error('Error updating phase:', err);
      return { error: err.message };
    }
  }, [event?.id]);

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
          trackSide: teamData.side?.toUpperCase() || 'HUMAN',
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

