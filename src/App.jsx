import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  MOCK_TEAMS,
  MOCK_FREE_AGENTS,
  MOCK_USERS,
  USER_ROLES,
  EVENT_PHASES,
  JUDGE_CRITERIA,
  AWARDS,
} from './data/mockData';
import { ROLE_MAP } from './lib/constants';

// Supabase hooks
import { useAuth } from './hooks/useAuth';
import {
  useTeams,
  useFreeAgents,
  useVotes,
  useJudgeScores,
  useEvent,
  useTeamMutations,
  useSubmissionMutations,
  useUsers,
  useTeamInvites,
  useTeamInviteMutations,
  useActivityFeed,
} from './hooks/useSupabase';
import { useDemoData } from './hooks/useDemoData';

// Components
import Landing from './components/Landing';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Marketplace from './components/Marketplace';
import TeamDetail from './components/TeamDetail';
import Profile from './components/Profile';
import Rules from './components/Rules';
import NewToHackDay from './components/NewToHackDay';
import Submission from './components/Submission';
import Voting from './components/Voting';
import VotingAnalytics from './components/VotingAnalytics';
import JudgeScoring from './components/JudgeScoring';
import AdminPanel from './components/AdminPanel';
import Results from './components/Results';
import Schedule from './components/Schedule';

// Max votes per user for voting phase (can be overridden by event settings)
const DEFAULT_MAX_VOTES = 5;

// Check if we're in demo mode (no Supabase configured)
const isDemoMode = !import.meta.env.VITE_SUPABASE_URL || 
                   import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co';

function App() {
  // ============================================================================
  // AUTH STATE (Supabase or Demo)
  // ============================================================================
  const auth = useAuth();
  
  // Demo mode state (fallback when Supabase not configured)
  const [demoUser, setDemoUser] = useState(null);
  const [useDemoMode, setUseDemoMode] = useState(isDemoMode);
  
  // DEV MODE - Remove before production
  // Dev mode allows testing controls (role impersonation, phase switching) with real Supabase data
  const [devRoleOverride, setDevRoleOverride] = useState(null);

  // Effective user (from Supabase or demo mode)
  const effectiveUser = useMemo(() => {
    if (useDemoMode && demoUser) {
      return demoUser;
    }
    if (auth.profile) {
      // Transform Supabase profile to app format
      const baseUser = {
        id: auth.profile.id,
        name: auth.profile.name || 'Unknown',
        email: auth.profile.email,
        skills: auth.profile.skills ? auth.profile.skills.split(',').map(s => s.trim()) : [],
        role: ROLE_MAP[auth.profile.role] || 'participant',
        image: auth.profile.image,
        bio: auth.profile.bio,
        callsign: auth.profile.callsign || '',
        autoAssignOptIn: auth.profile.autoAssignOptIn || false,
      };
      
      // DEV MODE: Apply role override if active (admin-only, gated by env var)
      const isDevMode = import.meta.env.VITE_ENABLE_DEV_MODE === 'true' && 
                        baseUser.role === 'admin';
      if (isDevMode && devRoleOverride) {
        return { ...baseUser, role: devRoleOverride };
      }
      
      return baseUser;
    }
    return null;
  }, [useDemoMode, demoUser, auth.profile, devRoleOverride]);
  
  // DEV MODE: Check if dev mode is active (requires env var AND admin role)
  const devModeActive = useMemo(() => {
    return import.meta.env.VITE_ENABLE_DEV_MODE === 'true' && 
           effectiveUser?.role === 'admin';
  }, [effectiveUser?.role]);

  // ============================================================================
  // NAVIGATION STATE
  // ============================================================================
  const [currentView, setCurrentView] = useState('landing');
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [marketplaceInitialTab, setMarketplaceInitialTab] = useState('teams');

  // ============================================================================
  // DATA STATE (Supabase hooks or Mock data)
  // ============================================================================
  
  // Supabase data hooks
  const { event, updatePhase: updateEventPhase, updateEventSettings } = useEvent();
  const { teams: supabaseTeams, loading: teamsLoading, refetch: refetchTeams } = useTeams(event?.id);
  const { freeAgents: supabaseFreeAgents, refetch: refetchFreeAgents } = useFreeAgents();
  const { 
    userVotes: supabaseUserVotes, 
    voteCounts, 
    vote: supabaseVote,
    remainingVotes 
  } = useVotes(effectiveUser?.id);
  const { scores: judgeScores, submitScore } = useJudgeScores();
  
  // Mutations
  const teamMutations = useTeamMutations();
  const submissionMutations = useSubmissionMutations();

  // Users (for admin panel)
  const { 
    users: supabaseUsers, 
    loading: usersLoading, 
    refetch: refetchUsers, 
    updateUserRole: supabaseUpdateUserRole 
  } = useUsers();

  // Team invites
  const { invites: userInvites } = useTeamInvites(effectiveUser?.id);
  const inviteMutations = useTeamInviteMutations();

  // Activity feed
  const { activities: activityFeed, loading: activityFeedLoading } = useActivityFeed(20);

  // Database demo data (unified with HD26Forge via seed_demo_data.sql)
  // Falls back to hardcoded MOCK_* data if database is unavailable
  const { demoData: dbDemoData, loading: demoDataLoading } = useDemoData(useDemoMode);

  // Demo mode state (mock data - will be overridden by database data if available)
  const [mockTeams, setMockTeams] = useState(MOCK_TEAMS);
  const [mockFreeAgents, setMockFreeAgents] = useState(MOCK_FREE_AGENTS);
  const [mockUserVotes, setMockUserVotes] = useState([]);
  const [mockEventPhase, setMockEventPhase] = useState('voting');
  const [mockEventMotd, setMockEventMotd] = useState(''); // MOTD for demo mode
  
  // Flatten mock users for admin panel
  const [mockAllUsers, setMockAllUsers] = useState(() => [
    ...MOCK_USERS.participants,
    ...MOCK_USERS.ambassadors,
    ...MOCK_USERS.judges,
    ...MOCK_USERS.admins,
  ]);

  // Update mock data from database when available
  useEffect(() => {
    if (dbDemoData) {
      console.log('[App] Using demo data from database');
      setMockTeams(dbDemoData.teams);
      setMockFreeAgents(dbDemoData.freeAgents);
      setMockAllUsers([
        ...dbDemoData.users.participants,
        ...dbDemoData.users.ambassadors,
        ...dbDemoData.users.judges,
        ...dbDemoData.users.admins,
      ]);
      // Use event phase from database demo event
      if (dbDemoData.event?.phase) {
        const phase = dbDemoData.event.phase.toLowerCase();
        setMockEventPhase(phase);
      }
    }
  }, [dbDemoData]);

  // Effective data (Supabase or mock)
  const teams = useMemo(() => {
    if (useDemoMode) return mockTeams;
    
    // Merge vote counts and judge scores into teams
    return supabaseTeams.map(team => {
      const teamScores = judgeScores.filter(s => s.projectId === team.submission?.projectId);
      return {
        ...team,
        submission: team.submission ? {
          ...team.submission,
          participantVotes: voteCounts[team.submission?.projectId] || 0,
          judgeScores: teamScores.map(s => ({
            judgeId: s.judgeId,
            judgeName: s.judgeName,
            scores: s.scores,
            comments: s.comments,
            scoredAt: s.scoredAt,
          })),
        } : team.submission,
      };
    });
  }, [useDemoMode, mockTeams, supabaseTeams, voteCounts, judgeScores]);

  const freeAgents = useDemoMode ? mockFreeAgents : supabaseFreeAgents;
  const eventPhase = useDemoMode ? mockEventPhase : (event?.phase || 'voting');
  
  // Effective event (Supabase or mock)
  const effectiveEvent = useMemo(() => {
    if (useDemoMode) {
      return {
        id: 'demo-event',
        phase: mockEventPhase,
        motd: mockEventMotd,
      };
    }
    return event;
  }, [useDemoMode, mockEventPhase, mockEventMotd, event]);

  // Convert project IDs to team IDs for voting component compatibility
  const userVotes = useMemo(() => {
    if (useDemoMode) return mockUserVotes;
    
    // Map project IDs back to team IDs
    return supabaseUserVotes.map(projectId => {
      const team = supabaseTeams.find(t => t.submission?.projectId === projectId);
      return team?.id || projectId;
    }).filter(Boolean);
  }, [useDemoMode, mockUserVotes, supabaseUserVotes, supabaseTeams]);

  // ============================================================================
  // USER PERMISSIONS
  // ============================================================================
  const getUserPermissions = useCallback(() => {
    if (!effectiveUser?.role) return USER_ROLES.participant;
    
    // Map database roles to app roles
    const roleMap = {
      user: 'participant',
      participant: 'participant',
      ambassador: 'ambassador',
      judge: 'judge',
      admin: 'admin',
    };
    
    const mappedRole = roleMap[effectiveUser.role.toLowerCase()] || 'participant';
    return USER_ROLES[mappedRole] || USER_ROLES.participant;
  }, [effectiveUser?.role]);

  // ============================================================================
  // TEAM HANDLERS
  // ============================================================================
  const updateTeam = useCallback(async (teamId, updates) => {
    if (useDemoMode) {
      setMockTeams(prev =>
        prev.map(team =>
          team.id === teamId ? { ...team, ...updates } : team
        )
      );
    } else {
      await teamMutations.updateTeam(teamId, updates);
      refetchTeams();
    }
  }, [useDemoMode, teamMutations, refetchTeams]);

  const leaveTeam = useCallback(async (teamId) => {
    if (!effectiveUser) return;
    
    if (useDemoMode) {
      // Remove user from team
      setMockTeams(prev =>
        prev.map(team => {
          if (team.id !== teamId) return team;
          
          // Remove user from members array
          const updatedMembers = team.members.filter(
            m => m.id !== effectiveUser.id && m.name !== effectiveUser.name
          );
          
          // If user was captain and there are remaining members, promote the first one
          let newCaptainId = team.captainId;
          if (team.captainId === effectiveUser.id && updatedMembers.length > 0) {
            newCaptainId = updatedMembers[0].id;
          }
          
          return {
            ...team,
            members: updatedMembers,
            captainId: newCaptainId,
          };
        }).filter(team => {
          // Remove team if it has no members left
          if (team.id === teamId) {
            const remainingMembers = team.members.filter(
              m => m.id !== effectiveUser.id && m.name !== effectiveUser.name
            );
            return remainingMembers.length > 0;
          }
          return true;
        })
      );
      
      // Add user to free agents list
      setMockFreeAgents(prev => {
        // Check if already in the list
        if (prev.some(a => a.id === effectiveUser.id)) return prev;
        return [
          ...prev,
          {
            id: effectiveUser.id,
            name: effectiveUser.name,
            skills: effectiveUser.skills || [],
            bio: effectiveUser.bio || '',
            teamInvites: [],
            autoAssignOptIn: false,
          }
        ];
      });
    } else {
      await teamMutations.leaveTeam(teamId, effectiveUser.id);
      refetchTeams();
    }
  }, [useDemoMode, effectiveUser, teamMutations, refetchTeams, auth]);

  const handleJoinRequest = useCallback(async (teamId, request) => {
    if (useDemoMode) {
      setMockTeams(prev =>
        prev.map(team =>
          team.id === teamId
            ? { ...team, joinRequests: [...(team.joinRequests || []), request] }
            : team
        )
      );
    } else {
      await teamMutations.requestJoin(teamId, effectiveUser?.id, request.message);
      refetchTeams();
    }
  }, [useDemoMode, teamMutations, effectiveUser?.id, refetchTeams]);

  const handleRequestResponse = useCallback(async (teamId, requestId, accepted) => {
    if (useDemoMode) {
      setMockTeams(prev =>
        prev.map(team => {
          if (team.id !== teamId) return team;

          const request = team.joinRequests?.find(r => r.id === requestId);
          if (!request) return team;

          if (accepted) {
            const newMember = {
              id: request.userId,
              name: request.userName,
              callsign: '',
              skills: request.userSkills || [],
            };
            return {
              ...team,
              members: [...team.members, newMember],
              joinRequests: team.joinRequests.filter(r => r.id !== requestId),
            };
          } else {
            return {
              ...team,
              joinRequests: team.joinRequests.filter(r => r.id !== requestId),
            };
          }
        })
      );
    } else {
      await teamMutations.respondToRequest(requestId, accepted);
      refetchTeams();
    }
  }, [useDemoMode, teamMutations, refetchTeams]);

  const handleSendInvite = useCallback(async (agentId, teamId, message) => {
    if (useDemoMode) {
      const team = mockTeams.find(t => t.id === teamId);
      if (!team) return;

      const invite = {
        id: Date.now(),
        teamId,
        teamName: team.name,
        message,
        timestamp: new Date().toISOString(),
      };

      setMockFreeAgents(prev =>
        prev.map(agent =>
          agent.id === agentId
            ? { ...agent, teamInvites: [...(agent.teamInvites || []), invite] }
            : agent
        )
      );
    } else {
      // Supabase mode - use invite mutations
      const result = await inviteMutations.sendInvite(teamId, agentId, message);
      if (!result.error) {
        // Refresh free agents to show updated invites
        refetchFreeAgents();
      }
      return result;
    }
  }, [useDemoMode, mockTeams, inviteMutations, refetchFreeAgents]);

  const handleInviteResponse = useCallback(async (agentId, inviteId, accepted) => {
    if (useDemoMode) {
      const agent = mockFreeAgents.find(a => a.id === agentId);
      if (!agent) return;

      const invite = agent.teamInvites?.find(i => i.id === inviteId);
      if (!invite) return;

      if (accepted) {
        const newMember = {
          id: agent.id,
          name: agent.name,
          callsign: '',
          skills: agent.skills || [],
        };

        setMockTeams(prev =>
          prev.map(team =>
            team.id === invite.teamId
              ? { ...team, members: [...team.members, newMember] }
              : team
          )
        );

        setMockFreeAgents(prev => prev.filter(a => a.id !== agentId));
      } else {
        setMockFreeAgents(prev =>
          prev.map(a =>
            a.id === agentId
              ? { ...a, teamInvites: a.teamInvites.filter(i => i.id !== inviteId) }
              : a
          )
        );
      }
    } else {
      // Supabase mode - use invite mutations
      const result = await inviteMutations.respondToInvite(inviteId, accepted);
      if (!result.error) {
        // Refresh teams and free agents
        refetchTeams();
        refetchFreeAgents();
      }
      return result;
    }
  }, [useDemoMode, mockFreeAgents, inviteMutations, refetchTeams, refetchFreeAgents]);

  // ============================================================================
  // CREATE TEAM HANDLER
  // ============================================================================
  const handleCreateTeam = useCallback(async (teamData) => {
    if (useDemoMode) {
      // Generate a unique ID for the new team
      const newTeamId = Date.now();
      
      const newTeam = {
        id: newTeamId,
        name: teamData.name,
        description: teamData.description,
        lookingFor: teamData.lookingFor || [],
        maxMembers: teamData.maxMembers || 6,
        moreInfo: '',
        captainId: effectiveUser?.id,
        isAutoCreated: teamData.isAutoCreated || false,
        members: [
          {
            id: effectiveUser?.id,
            name: effectiveUser?.name,
            callsign: '',
            skills: effectiveUser?.skills || [],
          },
        ],
        joinRequests: [],
        submission: {
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

      setMockTeams(prev => [newTeam, ...prev]);
      return { id: newTeamId };
    } else {
      const result = await teamMutations.createTeam(teamData, effectiveUser?.id, event?.id);
      if (!result.error) {
        refetchTeams();
        return { id: result.data.id };
      }
      return null;
    }
  }, [useDemoMode, effectiveUser, teamMutations, event?.id, refetchTeams]);

  // ============================================================================
  // AUTO-ASSIGN TEAM HANDLER
  // ============================================================================
  const handleAutoAssign = useCallback(async (optIn) => {
    if (!effectiveUser) return { success: false, error: 'No user logged in' };
    
    // Check if user is already on a team
    const userTeam = teams.find(
      team => team.captainId === effectiveUser.id || 
              team.members?.some(m => m.id === effectiveUser.id || m.name === effectiveUser.name)
    );
    if (userTeam) {
      return { success: false, error: 'You are already on a team' };
    }

    // Update user's auto-assign opt-in status
    if (useDemoMode) {
      setDemoUser(prev => prev ? { ...prev, autoAssignOptIn: optIn } : prev);
    } else {
      await auth.updateProfile({ autoAssignOptIn: optIn });
    }

    // If opting out, just return success
    if (!optIn) {
      return { success: true };
    }

    // Find existing auto-created team with room
    const existingAutoTeam = teams.find(
      team => team.isAutoCreated && 
              team.members.length < 6
    );

    if (existingAutoTeam) {
      // Add user to existing auto-team
      if (useDemoMode) {
        const newMember = {
          id: effectiveUser.id,
          name: effectiveUser.name,
          callsign: effectiveUser.callsign || '',
          skills: effectiveUser.skills || [],
        };
        
        setMockTeams(prev =>
          prev.map(team =>
            team.id === existingAutoTeam.id
              ? { ...team, members: [...team.members, newMember] }
              : team
          )
        );
        
        return { success: true, teamId: existingAutoTeam.id, teamName: existingAutoTeam.name };
      } else {
        // In Supabase mode, add member to team
        await teamMutations.addMember(existingAutoTeam.id, effectiveUser.id);
        refetchTeams();
        return { success: true, teamId: existingAutoTeam.id, teamName: existingAutoTeam.name };
      }
    } else {
      // Create new auto-team
      const existingAutoTeamsCount = teams.filter(
        t => t.isAutoCreated
      ).length;
      const teamNumber = existingAutoTeamsCount + 1;
      const teamName = `Auto Idea #${teamNumber}`;

      const teamData = {
        name: teamName,
        description: `Auto-created idea. Join us and let's build something amazing together!`,
        lookingFor: [],
        maxMembers: 6,
        isAutoCreated: true,
      };

      const result = await handleCreateTeam(teamData);
      if (result?.id) {
        return { success: true, teamId: result.id, teamName: teamName };
      }
      return { success: false, error: 'Failed to create auto-team' };
    }
  }, [effectiveUser, teams, useDemoMode, auth, teamMutations, refetchTeams, handleCreateTeam]);

  // ============================================================================
  // SUBMISSION HANDLERS
  // ============================================================================
  const handleUpdateSubmission = useCallback(async (teamId, submissionData) => {
    if (useDemoMode) {
      setMockTeams(prev =>
        prev.map(team =>
          team.id === teamId
            ? { ...team, submission: { ...team.submission, ...submissionData } }
            : team
        )
      );
    } else {
      await submissionMutations.updateSubmission(teamId, submissionData);
      refetchTeams();
    }
  }, [useDemoMode, submissionMutations, refetchTeams]);

  // ============================================================================
  // VOTING HANDLERS
  // ============================================================================
  const handleVote = useCallback(async (teamId) => {
    if (useDemoMode) {
      setMockUserVotes(prev => {
        const hasVoted = prev.includes(teamId);
        if (hasVoted) {
          return prev.filter(id => id !== teamId);
        } else if (prev.length < MAX_VOTES) {
          return [...prev, teamId];
        }
        return prev;
      });
    } else {
      // In Supabase mode, we vote by project ID
      const team = teams.find(t => t.id === teamId);
      if (team?.submission?.projectId) {
        await supabaseVote(team.submission.projectId);
      }
    }
  }, [useDemoMode, teams, supabaseVote]);

  // ============================================================================
  // JUDGE SCORING HANDLERS
  // ============================================================================
  const handleJudgeScore = useCallback(async (teamId, scoreData) => {
    if (!effectiveUser || (effectiveUser.role !== 'judge' && effectiveUser.role !== 'admin')) return;

    if (useDemoMode) {
      setMockTeams(prev =>
        prev.map(team => {
          if (team.id !== teamId) return team;

          const existingScores = team.submission?.judgeScores || [];
          const existingScoreIndex = existingScores.findIndex(
            s => s.judgeId === effectiveUser.id
          );

          const newScore = {
            judgeId: effectiveUser.id,
            judgeName: effectiveUser.name,
            scores: scoreData.scores,
            comments: scoreData.comments || '',
            scoredAt: new Date().toISOString(),
          };

          let updatedScores;
          if (existingScoreIndex >= 0) {
            updatedScores = [...existingScores];
            updatedScores[existingScoreIndex] = newScore;
          } else {
            updatedScores = [...existingScores, newScore];
          }

          return {
            ...team,
            submission: {
              ...team.submission,
              judgeScores: updatedScores,
            },
          };
        })
      );
    } else {
      const team = teams.find(t => t.id === teamId);
      if (team?.submission?.projectId) {
        await submitScore(effectiveUser.id, team.submission.projectId, scoreData);
      }
    }
  }, [useDemoMode, effectiveUser, teams, submitScore]);

  // ============================================================================
  // ADMIN HANDLERS
  // ============================================================================
  const handlePhaseChange = useCallback(async (newPhase) => {
    if (!effectiveUser || effectiveUser.role !== 'admin') return;
    
    // Allow phase changes in real mode if dev mode is active
    if (useDemoMode || devModeActive) {
      if (useDemoMode) {
        setMockEventPhase(newPhase);
      } else {
        await updateEventPhase(newPhase);
      }
    }
  }, [useDemoMode, devModeActive, effectiveUser, updateEventPhase]);

  const handleAutoAssignOptIn = useCallback(async (optIn) => {
    if (!effectiveUser) return;
    
    if (useDemoMode) {
      setDemoUser(prev => prev ? { ...prev, autoAssignOptIn: optIn } : prev);
    } else {
      await auth.updateProfile({ autoAssignOptIn: optIn });
    }
  }, [useDemoMode, effectiveUser, auth]);

  const handleUpdateMotd = useCallback(async (motd) => {
    if (!effectiveUser || effectiveUser.role !== 'admin') {
      return { error: 'Only admins can update MOTD' };
    }
    
    if (useDemoMode) {
      setMockEventMotd(motd);
      return { error: null };
    } else {
      // In Supabase mode, update MOTD in event table
      // For now, we'll need to add this to the updatePhase function or create a separate update
      // This is a placeholder - actual implementation would update the Event table
      return { error: 'MOTD update not yet implemented for Supabase mode' };
    }
  }, [useDemoMode, effectiveUser]);

  const handleUpdateUserRole = useCallback(async (userId, newRole) => {
    if (!effectiveUser || effectiveUser.role !== 'admin') {
      return { error: 'Only admins can change user roles' };
    }

    if (useDemoMode) {
      // Update mock users in demo mode
      setMockAllUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, role: newRole } : u
      ));
      return { error: null };
    } else {
      // Use Supabase to update the user role
      return await supabaseUpdateUserRole(userId, newRole);
    }
  }, [effectiveUser, useDemoMode, supabaseUpdateUserRole]);

  // ============================================================================
  // NAVIGATION HANDLERS
  // ============================================================================
  const navigateToTeam = useCallback((teamId) => {
    setSelectedTeamId(teamId);
    setCurrentView('team-detail');
  }, []);

  const handleNavigate = useCallback(async (view, options = {}) => {
    // Handle sign out specially
    if (view === 'signout') {
      if (!useDemoMode) {
        await auth.signOut();
      }
      setDemoUser(null);
      setCurrentView('landing');
      return;
    }
    
    if (view === 'marketplace' && options.tab) {
      setMarketplaceInitialTab(options.tab);
    } else if (view === 'marketplace') {
      setMarketplaceInitialTab('teams');
    }
    setCurrentView(view);
  }, [useDemoMode, auth]);

  // ============================================================================
  // USER MANAGEMENT
  // ============================================================================
  const updateUser = useCallback(async (updates) => {
    if (useDemoMode) {
      setDemoUser(prev => (prev ? { ...prev, ...updates } : updates));
      // In demo mode, state updates are synchronous but we need to ensure React has processed it
      // Return a resolved promise to maintain async consistency
      return Promise.resolve();
    } else {
      // Map app format to database format
      const dbUpdates = {};
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.skills) dbUpdates.skills = updates.skills.join(', ');
      if (updates.bio) dbUpdates.bio = updates.bio;
      if (updates.callsign !== undefined) dbUpdates.callsign = updates.callsign;
      if (updates.autoAssignOptIn !== undefined) dbUpdates.autoAssignOptIn = updates.autoAssignOptIn;
      if (updates.isFreeAgent !== undefined) dbUpdates.isFreeAgent = updates.isFreeAgent;
      
      await auth.updateProfile(dbUpdates);
    }
  }, [useDemoMode, auth]);

  const createUser = useCallback((userData) => {
    setDemoUser({
      id: userData.id || null,
      name: userData.name || '',
      skills: userData.skills || [],
      email: userData.email || '',
      role: userData.role || 'participant',
      callsign: userData.callsign || '',
      autoAssignOptIn: userData.autoAssignOptIn || false,
    });
    setUseDemoMode(true);
  }, []);

  // OAuth sign in handler
  const handleOAuthSignIn = useCallback(async (provider) => {
    if (provider === 'google') {
      await auth.signInWithGoogle();
    }
  }, [auth]);

  // Demo login handler
  const handleDemoLogin = useCallback((userData) => {
    createUser(userData);
    // Set the event phase if provided
    if (userData.phase) {
      setMockEventPhase(userData.phase);
    }
    setCurrentView('dashboard');
  }, [createUser]);

  // Demo onboarding handler - creates a new user and goes to dashboard in signup mode
  const handleDemoOnboarding = useCallback((phase) => {
    // Always force 'registration' phase for new user onboarding to show signup hero bento
    setMockEventPhase('registration');
    
    // Create user with empty name (hasn't signed up yet)
    createUser({
      id: Date.now(),
      name: '',
      email: 'new.user@company.com',
      skills: [],
      role: 'participant',
      autoAssignOptIn: false,
    });
    
    // Navigate to dashboard - state updates will be batched by React
    setCurrentView('dashboard');
  }, [createUser]);

  // ============================================================================
  // AUTH EFFECTS
  // ============================================================================
  useEffect(() => {
    // If user logs in via OAuth, redirect to dashboard
    // NOTE: Onboarding modal is hidden for now - all users go to dashboard
    if (auth.isAuthenticated && auth.profile && !useDemoMode) {
      // Always send users to dashboard (onboarding is hidden)
      if (currentView === 'login' || currentView === 'landing') {
        setCurrentView('dashboard');
      }
      // Previously: if (!auth.profile.trackSide) { setCurrentView('onboarding'); }
    }
  }, [auth.isAuthenticated, auth.profile, useDemoMode, currentView]);


  // ============================================================================
  // VIEW RENDERING
  // ============================================================================
  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <Landing onNavigate={setCurrentView} />;
      
      case 'login':
        return (
          <Login
            onNavigate={setCurrentView}
            onLogin={(email) => createUser({ email })}
            onDemoLogin={handleDemoLogin}
            onDemoOnboarding={handleDemoOnboarding}
            onOAuthSignIn={handleOAuthSignIn}
            authLoading={auth.loading}
            authError={auth.error}
          />
        );
      
      case 'signup':
        return (
          <Signup
            user={effectiveUser}
            updateUser={updateUser}
            onNavigate={handleNavigate}
            onAutoAssign={handleAutoAssign}
            teams={teams}
            eventPhase={eventPhase}
            onCreateTeam={handleCreateTeam}
          />
        );
      
      case 'dashboard':
        return (
          <Dashboard
            user={effectiveUser}
            teams={teams}
            onNavigate={handleNavigate}
            onNavigateToTeam={navigateToTeam}
            eventPhase={eventPhase}
            event={effectiveEvent}
            activityFeed={useDemoMode ? null : activityFeed}
            userInvites={useDemoMode ? [] : userInvites}
            devRoleOverride={devRoleOverride}
            onDevRoleChange={setDevRoleOverride}
            onPhaseChange={handlePhaseChange}
            eventPhases={EVENT_PHASES}
            onAutoAssignOptIn={handleAutoAssignOptIn}
          />
        );
      
      case 'marketplace':
        return (
          <Marketplace
            user={effectiveUser}
            teams={teams}
            freeAgents={freeAgents}
            onNavigate={handleNavigate}
            onNavigateToTeam={navigateToTeam}
            onSendInvite={handleSendInvite}
            onInviteResponse={handleInviteResponse}
            onCreateTeam={handleCreateTeam}
            initialTab={marketplaceInitialTab}
            eventPhase={eventPhase}
            userInvites={useDemoMode ? [] : userInvites}
            devRoleOverride={devRoleOverride}
            onDevRoleChange={setDevRoleOverride}
            onPhaseChange={handlePhaseChange}
            eventPhases={EVENT_PHASES}
          />
        );
      
      case 'profile':
        return (
          <Profile
            user={effectiveUser}
            updateUser={updateUser}
            teams={teams}
            onNavigate={handleNavigate}
            onNavigateToTeam={navigateToTeam}
            onLeaveTeam={leaveTeam}
            onAutoAssign={handleAutoAssign}
            eventPhase={eventPhase}
            devRoleOverride={devRoleOverride}
            onDevRoleChange={setDevRoleOverride}
            onPhaseChange={handlePhaseChange}
            eventPhases={EVENT_PHASES}
          />
        );
      
      case 'rules':
        return (
          <Rules
            user={effectiveUser}
            teams={teams}
            onNavigate={handleNavigate}
            eventPhase={eventPhase}
          />
        );
      
      case 'new-to-hackday':
        return (
          <NewToHackDay
            user={effectiveUser}
            teams={teams}
            onNavigate={handleNavigate}
            eventPhase={eventPhase}
          />
        );
      
      case 'submission':
        return (
          <Submission
            user={effectiveUser}
            teams={teams}
            onNavigate={handleNavigate}
            onUpdateSubmission={handleUpdateSubmission}
            eventPhase={eventPhase}
          />
        );
      
      case 'voting':
        return (
          <Voting
            user={effectiveUser}
            teams={teams}
            onNavigate={handleNavigate}
            userVotes={userVotes}
            onVote={handleVote}
            permissions={getUserPermissions()}
            eventPhase={eventPhase}
            maxVotes={effectiveEvent?.maxVotesPerUser || DEFAULT_MAX_VOTES}
          />
        );
      
      case 'analytics':
        return (
          <VotingAnalytics
            user={effectiveUser}
            teams={teams}
            onNavigate={handleNavigate}
            eventPhase={eventPhase}
            judgeCriteria={JUDGE_CRITERIA}
            awards={AWARDS}
          />
        );
      
      case 'judge-scoring':
        return (
          <JudgeScoring
            user={effectiveUser}
            teams={teams}
            onNavigate={handleNavigate}
            onScore={handleJudgeScore}
            judgeCriteria={JUDGE_CRITERIA}
            eventPhase={eventPhase}
          />
        );
      
      case 'admin':
        return (
          <AdminPanel
            user={effectiveUser}
            teams={teams}
            onNavigate={handleNavigate}
            eventPhase={eventPhase}
            onPhaseChange={handlePhaseChange}
            onUpdateEventSettings={updateEventSettings}
            eventPhases={EVENT_PHASES}
            onUpdateUserRole={handleUpdateUserRole}
            allUsers={useDemoMode ? mockAllUsers : supabaseUsers}
            usersLoading={useDemoMode ? false : usersLoading}
            onRefreshUsers={useDemoMode ? () => {} : refetchUsers}
            event={effectiveEvent}
            onUpdateMotd={handleUpdateMotd}
            isDevMode={devModeActive}
            onDevRoleChange={setDevRoleOverride}
            devRoleOverride={devRoleOverride}
          />
        );
      
      case 'results':
        return (
          <Results
            user={effectiveUser}
            teams={teams}
            onNavigate={handleNavigate}
            eventPhase={eventPhase}
            awards={AWARDS}
          />
        );
      
      case 'schedule':
        return (
          <Schedule
            user={effectiveUser}
            teams={teams}
            onNavigate={handleNavigate}
            eventPhase={eventPhase}
            event={event}
          />
        );
      
      case 'team-detail': {
        const selectedTeam = teams.find(t => t.id === selectedTeamId);
        if (!selectedTeam) {
          setCurrentView('dashboard');
          return null;
        }
        return (
          <TeamDetail
            team={selectedTeam}
            user={effectiveUser}
            teams={teams}
            onNavigate={handleNavigate}
            onUpdateTeam={updateTeam}
            onJoinRequest={handleJoinRequest}
            onRequestResponse={handleRequestResponse}
            eventPhase={eventPhase}
          />
        );
      }
      
      default:
        return <Landing onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-arena-black">
      {renderView()}
    </div>
  );
}

export default App;
