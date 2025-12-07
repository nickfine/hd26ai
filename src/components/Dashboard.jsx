import { useState } from 'react';
import {
  Cpu,
  Heart,
  Scale,
  Users,
  Plus,
  Search,
  LogOut,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { ALLEGIANCE_CONFIG } from '../data/mockData';

function Dashboard({ user, updateUser, teams, allegianceStyle, onNavigate }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter teams based on user allegiance
  const allegianceFilteredTeams = teams.filter((team) => {
    if (user?.allegiance === 'human') return team.side === 'human';
    if (user?.allegiance === 'ai') return team.side === 'ai';
    return true; // neutral shows all
  });

  // Filter teams by search
  const filteredTeams = allegianceFilteredTeams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.lookingFor.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const AllegianceIcon = {
    human: Heart,
    neutral: Scale,
    ai: Cpu,
  }[user?.allegiance || 'neutral'];

  return (
    <div
      className={`min-h-screen bg-gray-50 ${allegianceStyle.font} transition-all duration-300`}
    >
      {/* Header */}
      <header
        className={`border-b-2 px-6 py-4 bg-white transition-all duration-300`}
        style={{ borderColor: allegianceStyle.borderColor }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-gray-900" />
            <span className="font-bold text-sm tracking-tight">HACKDAY 2026</span>
          </div>

          <div className="flex items-center gap-4">
            {/* User Info */}
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 flex items-center justify-center ${allegianceStyle.borderRadius}`}
                style={{
                  backgroundColor: allegianceStyle.bgColor,
                  border: `2px solid ${allegianceStyle.borderColor}`,
                }}
              >
                <AllegianceIcon
                  className="w-4 h-4"
                  style={{ color: allegianceStyle.color }}
                />
              </div>
              <div className="text-sm">
                <div className="font-bold text-gray-900">{user?.name}</div>
                <div className="text-xs text-gray-500">Free Agent</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('landing')}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <aside className="w-72 border-r border-gray-200 bg-white min-h-[calc(100vh-65px)] p-6">
          {/* Profile Card */}
          <div
            className={`p-4 mb-6 transition-all duration-300 ${allegianceStyle.borderRadius} ${allegianceStyle.borderStyle}`}
            style={{
              borderColor: allegianceStyle.borderColor,
              backgroundColor: allegianceStyle.bgColor,
            }}
          >
            <div className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">
              Your Profile
            </div>
            <div className="text-lg font-bold text-gray-900 mb-1">
              {user?.name}
            </div>
            <div className="text-xs text-gray-500 mb-3">
              {user?.skills?.length || 0} skills registered
            </div>

            {/* Skills Preview */}
            <div className="flex flex-wrap gap-1 mb-4">
              {user?.skills?.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 text-xs bg-white border border-gray-200 text-gray-600"
                >
                  {skill}
                </span>
              ))}
              {user?.skills?.length > 3 && (
                <span className="px-2 py-1 text-xs text-gray-400">
                  +{user.skills.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* LIVE ALLEGIANCE TOGGLE - KEY FEATURE */}
          <div className="mb-6">
            <div className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">
              Switch Allegiance
            </div>
            <div className="space-y-2">
              {['human', 'neutral', 'ai'].map((side) => {
                const config = ALLEGIANCE_CONFIG[side];
                const isActive = user?.allegiance === side;
                const Icon = { human: Heart, neutral: Scale, ai: Cpu }[side];

                return (
                  <button
                    type="button"
                    key={side}
                    onClick={() => updateUser({ allegiance: side })}
                    className={`w-full p-3 flex items-center gap-3 transition-all duration-200
                      ${config.borderRadius} border-2
                      ${
                        isActive
                          ? ''
                          : 'border-gray-200 hover:border-gray-400 bg-white'
                      }`}
                    style={
                      isActive
                        ? {
                            borderColor: config.borderColor,
                            backgroundColor: config.bgColor,
                          }
                        : {}
                    }
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{ color: isActive ? config.color : '#9ca3af' }}
                    />
                    <span
                      className={`font-bold text-sm ${
                        side === 'ai' ? 'font-mono' : ''
                      }`}
                      style={{ color: isActive ? config.color : '#374151' }}
                    >
                      {config.label}
                    </span>
                    {isActive && (
                      <span className="ml-auto text-xs text-gray-400">
                        ACTIVE
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Create Team */}
          <button
            type="button"
            className={`w-full py-3 flex items-center justify-center gap-2 
                       bg-gray-900 text-white font-bold text-sm
                       hover:bg-gray-800 transition-all duration-200
                       ${allegianceStyle.borderRadius}`}
          >
            <Plus className="w-4 h-4" />
            CREATE TEAM
          </button>

          {/* Info */}
          <div className="mt-6 p-3 border border-gray-200 bg-gray-50 text-xs text-gray-500">
            <strong className="text-gray-700">Tip:</strong> Switch your allegiance
            to see teams for your side. Your choice affects filtering
            and visual themes.
          </div>
        </aside>

        {/* Main Content - Marketplace */}
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900">
                THE MARKETPLACE
              </h1>
              <p className="text-sm text-gray-500">
                Find your team or recruit free agents
              </p>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search teams or skills..."
                className="pl-10 pr-4 py-2 border-2 border-gray-200 
                           focus:border-gray-900 focus:outline-none
                           text-sm w-64"
              />
            </div>
          </div>

          {/* Allegiance Filter Indicator */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-2 mb-6 text-sm
                        ${allegianceStyle.borderRadius}`}
            style={{
              backgroundColor: allegianceStyle.bgColor,
              border: `1px solid ${allegianceStyle.borderColor}`,
              color: allegianceStyle.color,
            }}
          >
            <AllegianceIcon className="w-4 h-4" />
            <span>
              {user?.allegiance === 'neutral'
                ? 'Showing all teams'
                : `Showing ${ALLEGIANCE_CONFIG[user?.allegiance || 'neutral'].label} teams only`}
            </span>
          </div>

          {/* Teams Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredTeams.map((team) => {
              const teamConfig = ALLEGIANCE_CONFIG[team.side];
              const TeamIcon = team.side === 'ai' ? Cpu : Heart;

              return (
                <div
                  key={team.id}
                  className={`p-5 bg-white transition-all duration-200 hover:shadow-lg
                             border-2 ${teamConfig.borderRadius}
                             ${team.side === 'ai' ? 'border-dashed' : ''}`}
                  style={{ borderColor: teamConfig.borderColor }}
                >
                  {/* Team Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 flex items-center justify-center ${teamConfig.borderRadius}`}
                        style={{
                          backgroundColor: teamConfig.bgColor,
                        }}
                      >
                        <TeamIcon
                          className="w-5 h-5"
                          style={{ color: teamConfig.color }}
                        />
                      </div>
                      <div>
                        <h3
                          className={`font-bold text-gray-900 ${
                            team.side === 'ai' ? 'font-mono' : ''
                          }`}
                        >
                          {team.name}
                        </h3>
                        <span
                          className="text-xs font-bold uppercase"
                          style={{ color: teamConfig.color }}
                        >
                          {team.side === 'ai' ? 'AI SIDE' : 'HUMAN SIDE'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>
                        {team.members}/{team.maxMembers}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4">{team.description}</p>

                  {/* Looking For */}
                  <div className="mb-4">
                    <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">
                      Looking For
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {team.lookingFor.map((skill) => (
                        <span
                          key={skill}
                          className={`px-2 py-1 text-xs border ${teamConfig.borderRadius}`}
                          style={{
                            borderColor: teamConfig.borderColor,
                            color: teamConfig.color,
                            backgroundColor: teamConfig.bgColor,
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action */}
                  <button
                    type="button"
                    className={`w-full py-2 flex items-center justify-center gap-2
                               font-bold text-sm transition-all
                               ${teamConfig.borderRadius}`}
                    style={{
                      backgroundColor: teamConfig.color,
                      color: 'white',
                    }}
                  >
                    REQUEST TO JOIN
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredTeams.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>
                {searchTerm
                  ? 'No teams found matching your search.'
                  : 'No teams available for your current allegiance.'}
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-6 py-4 bg-white">
        <div className="max-w-7xl mx-auto text-center text-xs text-gray-400">
          WIREFRAME PROTOTYPE — Allegiance:{' '}
          <span style={{ color: allegianceStyle.color }}>
            {ALLEGIANCE_CONFIG[user?.allegiance || 'neutral'].label.toUpperCase()}
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;

