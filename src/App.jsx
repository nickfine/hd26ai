import { useState } from 'react';
import { MOCK_TEAMS, ALLEGIANCE_CONFIG } from './data/mockData';
import Landing from './components/Landing';
import Login from './components/Login';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';

function App() {
  // Global State
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('landing');
  const [mockTeams] = useState(MOCK_TEAMS);

  // User management
  const updateUser = (updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : updates));
  };

  const createUser = (userData) => {
    setUser({
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
            updateUser={updateUser}
            teams={mockTeams}
            allegianceStyle={getAllegianceStyle()}
            onNavigate={setCurrentView}
          />
        );
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
