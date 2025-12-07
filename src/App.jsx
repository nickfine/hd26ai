import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  MOCK_TEAMS,
  MOCK_FREE_AGENTS,
  ALLEGIANCE_CONFIG,
  USER_ROLES,
  EVENT_PHASES,
  JUDGE_CRITERIA,
  AWARDS,
} from './data/mockData';

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
} from './hooks/useSupabase';

// Components
import Landing from './components/Landing';
import Login from './components/Login';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Marketplace from './components/Marketplace';
import TeamDetail from './components/TeamDetail';
import Profile from './components/Profile';
import Rules from './components/Rules';
import Submission from './components/Submission';
import Voting from './components/Voting';
import VotingAnalytics from './components/VotingAnalytics';
import JudgeScoring from './components/JudgeScoring';
import AdminPanel from './components/AdminPanel';
import Results from './components/Results';
import Schedule from './components/Schedule';

// Max votes per user for voting phase
const MAX_VOTES = 5;

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

  // Effective user (from Supabase or demo mode)
  const effectiveUser = useMemo(() => {
    if (useDemoMode && demoUser) {
      return demoUser;
    }
    if (auth.profile) {
      // Transform Supabase profile to app format
      return {
        id: auth.profile.id,
        name: auth.profile.name || 'Unknown',
        email: auth.profile.email,
        skills: auth.profile.skills ? auth.profile.skills.split(',').map(s => s.trim()) : [],
        allegiance: auth.profile.trackSide?.toLowerCase() || 'neutral',
        role: auth.profile.role?.toLowerCase() || 'participant',
        image: auth.profile.image,
        bio: auth.profile.bio,
      };
    }
    return null;
  }, [useDemoMode, demoUser, auth.profile]);

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
  const { event, updatePhase: updateEventPhase } = useEvent();
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

  // Demo mode state (mock data)
  const [mockTeams, setMockTeams] = useState(MOCK_TEAMS);
  const [mockFreeAgents, setMockFreeAgents] = useState(MOCK_FREE_AGENTS);
  const [mockUserVotes, setMockUserVotes] = useState([]);
  const [mockEventPhase, setMockEventPhase] = useState('voting');

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
        teamSide: team.side,
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
    }
    // In Supabase mode, invites would be handled differently
  }, [useDemoMode, mockTeams]);

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
    }
  }, [useDemoMode, mockFreeAgents]);

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
    
    if (useDemoMode) {
      setMockEventPhase(newPhase);
    } else {
      await updateEventPhase(newPhase);
    }
  }, [useDemoMode, effectiveUser, updateEventPhase]);

  const handleUpdateUserRole = useCallback(async (userId, newRole) => {
    if (!effectiveUser || effectiveUser.role !== 'admin') return;
    console.log(`Admin updated user ${userId} to role: ${newRole}`);
    // In Supabase mode, this would update the User table
  }, [effectiveUser]);

  // ============================================================================
  // NAVIGATION HANDLERS
  // ============================================================================
  const navigateToTeam = useCallback((teamId) => {
    setSelectedTeamId(teamId);
    setCurrentView('team-detail');
  }, []);

  const handleNavigate = useCallback((view, options = {}) => {
    if (view === 'marketplace' && options.tab) {
      setMarketplaceInitialTab(options.tab);
    } else if (view === 'marketplace') {
      setMarketplaceInitialTab('teams');
    }
    setCurrentView(view);
  }, []);

  // ============================================================================
  // USER MANAGEMENT
  // ============================================================================
  const updateUser = useCallback(async (updates) => {
    if (useDemoMode) {
      setDemoUser(prev => (prev ? { ...prev, ...updates } : updates));
    } else {
      // Map app format to database format
      const dbUpdates = {};
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.skills) dbUpdates.skills = updates.skills.join(', ');
      if (updates.allegiance) dbUpdates.trackSide = updates.allegiance.toUpperCase();
      if (updates.bio) dbUpdates.bio = updates.bio;
      
      await auth.updateProfile(dbUpdates);
    }
  }, [useDemoMode, auth]);

  const createUser = useCallback((userData) => {
    setDemoUser({
      id: userData.id || null,
      name: userData.name || '',
      skills: userData.skills || [],
      allegiance: userData.allegiance || 'neutral',
      email: userData.email || '',
      role: userData.role || 'participant',
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

  // ============================================================================
  // AUTH EFFECTS
  // ============================================================================
  useEffect(() => {
    // If user logs in via OAuth, redirect to dashboard (or onboarding if new)
    if (auth.isAuthenticated && auth.profile && !useDemoMode) {
      // Check if user needs onboarding (no allegiance set)
      if (!auth.profile.trackSide) {
        setCurrentView('onboarding');
      } else if (currentView === 'login' || currentView === 'landing') {
        setCurrentView('dashboard');
      }
    }
  }, [auth.isAuthenticated, auth.profile, useDemoMode, currentView]);

  // ============================================================================
  // ALLEGIANCE STYLING
  // ============================================================================
  const getAllegianceStyle = useCallback(() => {
    if (!effectiveUser) return ALLEGIANCE_CONFIG.neutral;
    return ALLEGIANCE_CONFIG[effectiveUser.allegiance] || ALLEGIANCE_CONFIG.neutral;
  }, [effectiveUser]);

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
            onOAuthSignIn={handleOAuthSignIn}
            authLoading={auth.loading}
            authError={auth.error}
          />
        );
      
      case 'onboarding':
        return (
          <Onboarding
            user={effectiveUser}
            updateUser={updateUser}
            onNavigate={setCurrentView}
          />
        );
      
      case 'dashboard':
        return (
          <Dashboard
            user={effectiveUser}
            teams={teams}
            allegianceStyle={getAllegianceStyle()}
            onNavigate={handleNavigate}
            eventPhase={eventPhase}
          />
        );
      
      case 'marketplace':
        return (
          <Marketplace
            user={effectiveUser}
            teams={teams}
            freeAgents={freeAgents}
            allegianceStyle={getAllegianceStyle()}
            onNavigate={handleNavigate}
            onNavigateToTeam={navigateToTeam}
            onSendInvite={handleSendInvite}
            onInviteResponse={handleInviteResponse}
            initialTab={marketplaceInitialTab}
            eventPhase={eventPhase}
          />
        );
      
      case 'profile':
        return (
          <Profile
            user={effectiveUser}
            updateUser={updateUser}
            teams={teams}
            allegianceStyle={getAllegianceStyle()}
            onNavigate={handleNavigate}
            onNavigateToTeam={navigateToTeam}
            eventPhase={eventPhase}
          />
        );
      
      case 'rules':
        return (
          <Rules
            user={effectiveUser}
            teams={teams}
            allegianceStyle={getAllegianceStyle()}
            onNavigate={handleNavigate}
            eventPhase={eventPhase}
          />
        );
      
      case 'submission':
        return (
          <Submission
            user={effectiveUser}
            teams={teams}
            allegianceStyle={getAllegianceStyle()}
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
            allegianceStyle={getAllegianceStyle()}
            onNavigate={handleNavigate}
            userVotes={userVotes}
            onVote={handleVote}
            permissions={getUserPermissions()}
            eventPhase={eventPhase}
          />
        );
      
      case 'analytics':
        return (
          <VotingAnalytics
            user={effectiveUser}
            teams={teams}
            allegianceStyle={getAllegianceStyle()}
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
            allegianceStyle={getAllegianceStyle()}
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
            allegianceStyle={getAllegianceStyle()}
            onNavigate={handleNavigate}
            eventPhase={eventPhase}
            onPhaseChange={handlePhaseChange}
            eventPhases={EVENT_PHASES}
            onUpdateUserRole={handleUpdateUserRole}
          />
        );
      
      case 'results':
        return (
          <Results
            user={effectiveUser}
            teams={teams}
            allegianceStyle={getAllegianceStyle()}
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
            allegianceStyle={getAllegianceStyle()}
            onNavigate={handleNavigate}
            eventPhase={eventPhase}
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
            allegianceStyle={getAllegianceStyle()}
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
    <div className={`min-h-screen bg-white ${getAllegianceStyle().font}`}>
      {renderView()}
    </div>
  );
}

export default App;
