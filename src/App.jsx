import { useState } from 'react';
import {
  MOCK_TEAMS,
  MOCK_FREE_AGENTS,
  ALLEGIANCE_CONFIG,
  USER_ROLES,
  EVENT_PHASES,
  JUDGE_CRITERIA,
  AWARDS,
} from './data/mockData';
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

// Max votes per user for voting phase
const MAX_VOTES = 5;

function App() {
  // Global State
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('landing');
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [mockTeams, setMockTeams] = useState(MOCK_TEAMS);
  const [freeAgents, setFreeAgents] = useState(MOCK_FREE_AGENTS);
  const [marketplaceInitialTab, setMarketplaceInitialTab] = useState('teams');
  const [userVotes, setUserVotes] = useState([]); // Array of team IDs the user has voted for
  const [eventPhase, setEventPhase] = useState('voting'); // Current event phase

  // Get user role permissions
  const getUserPermissions = () => {
    if (!user?.role) return USER_ROLES.participant;
    return USER_ROLES[user.role] || USER_ROLES.participant;
  };

  // Update a specific team
  const updateTeam = (teamId, updates) => {
    setMockTeams((prev) =>
      prev.map((team) =>
        team.id === teamId ? { ...team, ...updates } : team
      )
    );
  };

  // Handle join request submission
  const handleJoinRequest = (teamId, request) => {
    setMockTeams((prev) =>
      prev.map((team) =>
        team.id === teamId
          ? { ...team, joinRequests: [...(team.joinRequests || []), request] }
          : team
      )
    );
  };

  // Handle captain's response to a join request
  const handleRequestResponse = (teamId, requestId, accepted) => {
    setMockTeams((prev) =>
      prev.map((team) => {
        if (team.id !== teamId) return team;

        const request = team.joinRequests?.find((r) => r.id === requestId);
        if (!request) return team;

        if (accepted) {
          // Add user to members and remove request
          const newMember = {
            id: request.userId,
            name: request.userName,
            callsign: '',
            skills: request.userSkills || [],
          };
          return {
            ...team,
            members: [...team.members, newMember],
            joinRequests: team.joinRequests.filter((r) => r.id !== requestId),
          };
        } else {
          // Just remove the request
          return {
            ...team,
            joinRequests: team.joinRequests.filter((r) => r.id !== requestId),
          };
        }
      })
    );
  };

  // Handle captain sending an invite to a free agent
  const handleSendInvite = (agentId, teamId, message) => {
    const team = mockTeams.find((t) => t.id === teamId);
    if (!team) return;

    const invite = {
      id: Date.now(),
      teamId,
      teamName: team.name,
      teamSide: team.side,
      message,
      timestamp: new Date().toISOString(),
    };

    setFreeAgents((prev) =>
      prev.map((agent) =>
        agent.id === agentId
          ? { ...agent, teamInvites: [...(agent.teamInvites || []), invite] }
          : agent
      )
    );
  };

  // Handle free agent's response to a team invite
  const handleInviteResponse = (agentId, inviteId, accepted) => {
    const agent = freeAgents.find((a) => a.id === agentId);
    if (!agent) return;

    const invite = agent.teamInvites?.find((i) => i.id === inviteId);
    if (!invite) return;

    if (accepted) {
      // Add agent to team members
      const newMember = {
        id: agent.id,
        name: agent.name,
        callsign: '',
        skills: agent.skills || [],
      };

      setMockTeams((prev) =>
        prev.map((team) =>
          team.id === invite.teamId
            ? { ...team, members: [...team.members, newMember] }
            : team
        )
      );

      // Remove agent from free agents pool
      setFreeAgents((prev) => prev.filter((a) => a.id !== agentId));
    } else {
      // Just remove the invite
      setFreeAgents((prev) =>
        prev.map((a) =>
          a.id === agentId
            ? { ...a, teamInvites: a.teamInvites.filter((i) => i.id !== inviteId) }
            : a
        )
      );
    }
  };

  // Handle submission updates from captain
  const handleUpdateSubmission = (teamId, submissionData) => {
    setMockTeams((prev) =>
      prev.map((team) =>
        team.id === teamId
          ? { ...team, submission: { ...team.submission, ...submissionData } }
          : team
      )
    );
  };

  // Handle voting for a project
  const handleVote = (teamId) => {
    setUserVotes((prev) => {
      const hasVoted = prev.includes(teamId);
      if (hasVoted) {
        // Remove vote (toggle off)
        return prev.filter((id) => id !== teamId);
      } else if (prev.length < MAX_VOTES) {
        // Add vote if under limit
        return [...prev, teamId];
      }
      // At vote limit, do nothing
      return prev;
    });
  };

  // Navigation handler for team detail
  const navigateToTeam = (teamId) => {
    setSelectedTeamId(teamId);
    setCurrentView('team-detail');
  };

  // Navigation handler with optional data (e.g., for tab selection)
  const handleNavigate = (view, options = {}) => {
    if (view === 'marketplace' && options.tab) {
      setMarketplaceInitialTab(options.tab);
    } else if (view === 'marketplace') {
      setMarketplaceInitialTab('teams'); // default to teams tab
    }
    setCurrentView(view);
  };

  // User management
  const updateUser = (updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : updates));
  };

  const createUser = (userData) => {
    setUser({
      id: userData.id || null,
      name: userData.name || '',
      skills: userData.skills || [],
      allegiance: userData.allegiance || 'neutral',
      email: userData.email || '',
      role: userData.role || 'participant',
    });
  };

  // Handle judge scoring a project
  const handleJudgeScore = (teamId, scoreData) => {
    if (!user || user.role !== 'judge') return;

    setMockTeams((prev) =>
      prev.map((team) => {
        if (team.id !== teamId) return team;

        const existingScores = team.submission?.judgeScores || [];
        const existingScoreIndex = existingScores.findIndex(
          (s) => s.judgeId === user.id
        );

        const newScore = {
          judgeId: user.id,
          judgeName: user.name,
          scores: scoreData.scores,
          comments: scoreData.comments || '',
          scoredAt: new Date().toISOString(),
        };

        let updatedScores;
        if (existingScoreIndex >= 0) {
          // Update existing score
          updatedScores = [...existingScores];
          updatedScores[existingScoreIndex] = newScore;
        } else {
          // Add new score
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
  };

  // Handle admin changing event phase
  const handlePhaseChange = (newPhase) => {
    if (!user || user.role !== 'admin') return;
    setEventPhase(newPhase);
  };

  // Handle admin updating user role
  const handleUpdateUserRole = (userId, newRole) => {
    if (!user || user.role !== 'admin') return;
    // In a real app, this would update the database
    // For now, we'll just log it
    console.log(`Admin updated user ${userId} to role: ${newRole}`);
  };

  // Get current allegiance styling
  const getAllegianceStyle = () => {
    if (!user) return ALLEGIANCE_CONFIG.neutral;
    return ALLEGIANCE_CONFIG[user.allegiance] || ALLEGIANCE_CONFIG.neutral;
  };

  // Render current view
  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <Landing onNavigate={setCurrentView} />;
      case 'login':
        return (
          <Login
            onNavigate={setCurrentView}
            onLogin={(email) => createUser({ email })}
            onDemoLogin={(userData) => {
              createUser(userData);
              setCurrentView('dashboard');
            }}
          />
        );
      case 'onboarding':
        return (
          <Onboarding
            user={user}
            updateUser={updateUser}
            onNavigate={setCurrentView}
          />
        );
      case 'dashboard':
        return (
          <Dashboard
            user={user}
            teams={mockTeams}
            allegianceStyle={getAllegianceStyle()}
            onNavigate={handleNavigate}
            eventPhase={eventPhase}
          />
        );
      case 'marketplace':
        return (
          <Marketplace
            user={user}
            teams={mockTeams}
            freeAgents={freeAgents}
            allegianceStyle={getAllegianceStyle()}
            onNavigate={setCurrentView}
            onNavigateToTeam={navigateToTeam}
            onSendInvite={handleSendInvite}
            onInviteResponse={handleInviteResponse}
            initialTab={marketplaceInitialTab}
          />
        );
      case 'profile':
        return (
          <Profile
            user={user}
            updateUser={updateUser}
            teams={mockTeams}
            allegianceStyle={getAllegianceStyle()}
            onNavigate={setCurrentView}
            onNavigateToTeam={navigateToTeam}
          />
        );
      case 'rules':
        return (
          <Rules
            user={user}
            allegianceStyle={getAllegianceStyle()}
            onNavigate={setCurrentView}
          />
        );
      case 'submission':
        return (
          <Submission
            user={user}
            teams={mockTeams}
            allegianceStyle={getAllegianceStyle()}
            onNavigate={setCurrentView}
            onUpdateSubmission={handleUpdateSubmission}
          />
        );
      case 'voting':
        return (
          <Voting
            user={user}
            teams={mockTeams}
            allegianceStyle={getAllegianceStyle()}
            onNavigate={setCurrentView}
            userVotes={userVotes}
            onVote={handleVote}
            permissions={getUserPermissions()}
          />
        );
      case 'analytics':
        return (
          <VotingAnalytics
            user={user}
            teams={mockTeams}
            allegianceStyle={getAllegianceStyle()}
            onNavigate={setCurrentView}
            eventPhase={eventPhase}
            judgeCriteria={JUDGE_CRITERIA}
            awards={AWARDS}
          />
        );
      case 'judge-scoring':
        return (
          <JudgeScoring
            user={user}
            teams={mockTeams}
            allegianceStyle={getAllegianceStyle()}
            onNavigate={setCurrentView}
            onScore={handleJudgeScore}
            judgeCriteria={JUDGE_CRITERIA}
          />
        );
      case 'admin':
        return (
          <AdminPanel
            user={user}
            teams={mockTeams}
            allegianceStyle={getAllegianceStyle()}
            onNavigate={setCurrentView}
            eventPhase={eventPhase}
            onPhaseChange={handlePhaseChange}
            eventPhases={EVENT_PHASES}
            onUpdateUserRole={handleUpdateUserRole}
          />
        );
      case 'results':
        return (
          <Results
            user={user}
            teams={mockTeams}
            allegianceStyle={getAllegianceStyle()}
            onNavigate={setCurrentView}
            eventPhase={eventPhase}
            awards={AWARDS}
          />
        );
      case 'team-detail': {
        const selectedTeam = mockTeams.find((t) => t.id === selectedTeamId);
        if (!selectedTeam) {
          setCurrentView('dashboard');
          return null;
        }
        return (
          <TeamDetail
            team={selectedTeam}
            user={user}
            allegianceStyle={getAllegianceStyle()}
            onNavigate={setCurrentView}
            onUpdateTeam={updateTeam}
            onJoinRequest={handleJoinRequest}
            onRequestResponse={handleRequestResponse}
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
