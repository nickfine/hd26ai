import { useState } from 'react';
import { MOCK_TEAMS, MOCK_FREE_AGENTS, ALLEGIANCE_CONFIG } from './data/mockData';
import Landing from './components/Landing';
import Login from './components/Login';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import TeamDetail from './components/TeamDetail';
import Profile from './components/Profile';

function App() {
  // Global State
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('landing');
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [mockTeams, setMockTeams] = useState(MOCK_TEAMS);
  const [freeAgents, setFreeAgents] = useState(MOCK_FREE_AGENTS);

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

  // Navigation handler for team detail
  const navigateToTeam = (teamId) => {
    setSelectedTeamId(teamId);
    setCurrentView('team-detail');
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
    });
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
            freeAgents={freeAgents}
            allegianceStyle={getAllegianceStyle()}
            onNavigate={setCurrentView}
            onNavigateToTeam={navigateToTeam}
            onSendInvite={handleSendInvite}
            onInviteResponse={handleInviteResponse}
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
