import { useState, useMemo } from 'react';
import adaptLogo from '../../adaptlogo.png';
import {
  ArrowLeft,
  Heart,
  Cpu,
  Scale,
  Shield,
  Settings,
  Users,
  Trophy,
  Star,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  ChevronRight,
  BarChart3,
  Gavel,
  Megaphone,
  UserCog,
  RefreshCw,
} from 'lucide-react';
import { ALLEGIANCE_CONFIG, EVENT_PHASE_ORDER } from '../data/mockData';

// ============================================================================
// COMPONENT
// ============================================================================

function AdminPanel({
  user,
  teams = [],
  allegianceStyle,
  onNavigate,
  eventPhase,
  onPhaseChange,
  eventPhases = {},
  onUpdateUserRole,
}) {
  const [activeSection, setActiveSection] = useState('overview'); // 'overview' | 'phases' | 'users'
  const [confirmPhaseChange, setConfirmPhaseChange] = useState(null);

  const AllegianceIcon = {
    human: Heart,
    neutral: Scale,
    ai: Cpu,
  }[user?.allegiance || 'neutral'];

  // Calculate stats
  const stats = useMemo(() => {
    const submittedProjects = teams.filter((t) => t.submission?.status === 'submitted');
    const totalVotes = submittedProjects.reduce(
      (sum, t) => sum + (t.submission?.participantVotes || 0),
      0
    );
    const totalJudgeScores = submittedProjects.reduce(
      (sum, t) => sum + (t.submission?.judgeScores?.length || 0),
      0
    );
    const fullyJudged = submittedProjects.filter(
      (t) => (t.submission?.judgeScores?.length || 0) >= 3
    ).length;

    const humanTeams = teams.filter((t) => t.side === 'human');
    const aiTeams = teams.filter((t) => t.side === 'ai');
    const totalMembers = teams.reduce((sum, t) => sum + (t.members?.length || 0), 0);

    return {
      totalTeams: teams.length,
      humanTeams: humanTeams.length,
      aiTeams: aiTeams.length,
      submittedProjects: submittedProjects.length,
      totalVotes,
      totalJudgeScores,
      fullyJudged,
      totalMembers,
    };
  }, [teams]);

  // Get phase info
  const currentPhaseInfo = eventPhases[eventPhase] || { label: 'Unknown', description: '' };
  const currentPhaseIndex = EVENT_PHASE_ORDER.indexOf(eventPhase);

  // Handle phase change
  const handlePhaseChange = (newPhase) => {
    if (confirmPhaseChange === newPhase) {
      onPhaseChange(newPhase);
      setConfirmPhaseChange(null);
    } else {
      setConfirmPhaseChange(newPhase);
    }
  };

  // ============================================================================
  // RENDER: OVERVIEW SECTION
  // ============================================================================
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Current Phase Card */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-6 h-6" />
          <span className="text-sm font-bold uppercase tracking-wide opacity-80">
            Current Event Phase
          </span>
        </div>
        <h2 className="text-3xl font-black mb-2">{currentPhaseInfo.label}</h2>
        <p className="opacity-80">{currentPhaseInfo.description}</p>
        <div className="mt-4 flex items-center gap-2">
          <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-500"
              style={{
                width: `${((currentPhaseIndex + 1) / EVENT_PHASE_ORDER.length) * 100}%`,
              }}
            />
          </div>
          <span className="text-sm font-bold">
            {currentPhaseIndex + 1}/{EVENT_PHASE_ORDER.length}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border-2 border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-gray-400" />
            <span className="text-xs font-bold text-gray-500 uppercase">Teams</span>
          </div>
          <div className="text-3xl font-black text-gray-900">{stats.totalTeams}</div>
          <div className="text-xs text-gray-500 mt-1">
            <span className="text-green-600">{stats.humanTeams} human</span>
            {' · '}
            <span className="text-cyan-600">{stats.aiTeams} AI</span>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold text-gray-500 uppercase">Submissions</span>
          </div>
          <div className="text-3xl font-black text-gray-900">{stats.submittedProjects}</div>
          <div className="text-xs text-gray-500 mt-1">projects submitted</div>
        </div>

        <div className="bg-white border-2 border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold text-gray-500 uppercase">Votes</span>
          </div>
          <div className="text-3xl font-black text-gray-900">{stats.totalVotes}</div>
          <div className="text-xs text-gray-500 mt-1">total votes cast</div>
        </div>

        <div className="bg-white border-2 border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Gavel className="w-5 h-5 text-purple-500" />
            <span className="text-xs font-bold text-gray-500 uppercase">Judging</span>
          </div>
          <div className="text-3xl font-black text-gray-900">{stats.fullyJudged}</div>
          <div className="text-xs text-gray-500 mt-1">fully judged</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border-2 border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onNavigate('analytics')}
            className="flex items-center gap-3 p-4 border-2 border-gray-200 hover:border-purple-400 transition-colors text-left"
          >
            <BarChart3 className="w-6 h-6 text-purple-500" />
            <div>
              <div className="font-bold text-gray-900">View Analytics</div>
              <div className="text-xs text-gray-500">See voting results & rankings</div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 ml-auto" />
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('phases')}
            className="flex items-center gap-3 p-4 border-2 border-gray-200 hover:border-amber-400 transition-colors text-left"
          >
            <Clock className="w-6 h-6 text-amber-500" />
            <div>
              <div className="font-bold text-gray-900">Manage Phases</div>
              <div className="text-xs text-gray-500">Change event phase</div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 ml-auto" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('marketplace')}
            className="flex items-center gap-3 p-4 border-2 border-gray-200 hover:border-green-400 transition-colors text-left"
          >
            <Users className="w-6 h-6 text-green-500" />
            <div>
              <div className="font-bold text-gray-900">View Teams</div>
              <div className="text-xs text-gray-500">Browse all teams</div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 ml-auto" />
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('users')}
            className="flex items-center gap-3 p-4 border-2 border-gray-200 hover:border-blue-400 transition-colors text-left"
          >
            <UserCog className="w-6 h-6 text-blue-500" />
            <div>
              <div className="font-bold text-gray-900">Manage Users</div>
              <div className="text-xs text-gray-500">Assign roles</div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 ml-auto" />
          </button>
        </div>
      </div>

      {/* Alerts / Warnings */}
      {stats.submittedProjects > 0 && stats.fullyJudged < stats.submittedProjects && (
        <div className="bg-amber-50 border-2 border-amber-200 p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-amber-900">Judging Incomplete</div>
            <p className="text-sm text-amber-700">
              {stats.submittedProjects - stats.fullyJudged} projects still need to be fully judged
              (3+ judge scores required).
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // ============================================================================
  // RENDER: PHASES SECTION
  // ============================================================================
  const renderPhases = () => (
    <div className="space-y-6">
      <div className="bg-white border-2 border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-2">Event Phase Control</h3>
        <p className="text-sm text-gray-500 mb-6">
          Change the current phase of the hackday event. This affects what features are available
          to participants.
        </p>

        <div className="space-y-3">
          {EVENT_PHASE_ORDER.map((phaseKey, idx) => {
            const phase = eventPhases[phaseKey];
            const isCurrent = eventPhase === phaseKey;
            const isPast = idx < currentPhaseIndex;
            const isNext = idx === currentPhaseIndex + 1;
            const isConfirming = confirmPhaseChange === phaseKey;

            return (
              <div
                key={phaseKey}
                className={`p-4 border-2 transition-all ${
                  isCurrent
                    ? 'border-purple-500 bg-purple-50'
                    : isPast
                    ? 'border-gray-200 bg-gray-50 opacity-60'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Status indicator */}
                  <div
                    className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full font-bold
                      ${isCurrent ? 'bg-purple-500 text-white' : ''}
                      ${isPast ? 'bg-green-100 text-green-600' : ''}
                      ${!isCurrent && !isPast ? 'bg-gray-100 text-gray-400' : ''}
                    `}
                  >
                    {isPast ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : isCurrent ? (
                      <Play className="w-5 h-5" />
                    ) : (
                      idx + 1
                    )}
                  </div>

                  {/* Phase info */}
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">{phase?.label}</div>
                    <div className="text-xs text-gray-500">{phase?.description}</div>
                  </div>

                  {/* Action */}
                  {!isCurrent && !isPast && (
                    <button
                      type="button"
                      onClick={() => handlePhaseChange(phaseKey)}
                      className={`px-4 py-2 text-sm font-bold transition-all ${
                        isConfirming
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : isNext
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {isConfirming ? 'Click to Confirm' : 'Activate'}
                    </button>
                  )}

                  {isCurrent && (
                    <span className="px-4 py-2 text-sm font-bold bg-purple-100 text-purple-600">
                      Current
                    </span>
                  )}

                  {isPast && (
                    <span className="px-4 py-2 text-sm font-bold bg-green-100 text-green-600">
                      Completed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {confirmPhaseChange && (
          <div className="mt-4 p-4 bg-red-50 border-2 border-red-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-red-900">Confirm Phase Change</div>
                <p className="text-sm text-red-700">
                  Are you sure you want to change to <strong>{eventPhases[confirmPhaseChange]?.label}</strong>?
                  This will affect all participants. Click the button again to confirm.
                </p>
                <button
                  type="button"
                  onClick={() => setConfirmPhaseChange(null)}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 font-bold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ============================================================================
  // RENDER: USERS SECTION
  // ============================================================================
  const renderUsers = () => (
    <div className="space-y-6">
      <div className="bg-white border-2 border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-2">User Role Management</h3>
        <p className="text-sm text-gray-500 mb-6">
          Assign and manage user roles. Judges can score projects, Ambassadors recruit for their
          side, and Admins have full access.
        </p>

        {/* Role Legend */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-3 bg-cyan-50 border border-cyan-200">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-cyan-600" />
              <span className="font-bold text-cyan-900 text-sm">Participant</span>
            </div>
            <p className="text-xs text-cyan-700">Can vote, join teams</p>
          </div>
          <div className="p-3 bg-green-50 border border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <Megaphone className="w-4 h-4 text-green-600" />
              <span className="font-bold text-green-900 text-sm">Ambassador</span>
            </div>
            <p className="text-xs text-green-700">Can recruit, vote</p>
          </div>
          <div className="p-3 bg-amber-50 border border-amber-200">
            <div className="flex items-center gap-2 mb-1">
              <Gavel className="w-4 h-4 text-amber-600" />
              <span className="font-bold text-amber-900 text-sm">Judge</span>
            </div>
            <p className="text-xs text-amber-700">Can score projects</p>
          </div>
          <div className="p-3 bg-purple-50 border border-purple-200">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-purple-600" />
              <span className="font-bold text-purple-900 text-sm">Admin</span>
            </div>
            <p className="text-xs text-purple-700">Full access</p>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="p-8 border-2 border-dashed border-gray-200 text-center">
          <RefreshCw className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <h4 className="font-bold text-gray-600 mb-2">User Management Coming Soon</h4>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            In the full version, you'll be able to search users, view their current roles,
            and assign new roles directly from this panel.
          </p>
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  return (
    <div className={`min-h-screen bg-gray-50 ${allegianceStyle?.font || 'font-sans'}`}>
      {/* Header */}
      <header
        className="border-b-2 px-4 sm:px-6 py-4 bg-white"
        style={{ borderColor: allegianceStyle?.borderColor }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="p-2 -ml-2 text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-bold">Back to Mission Control</span>
          </button>
          <div className="flex items-center gap-2">
            <img src={adaptLogo} alt="Adaptavist" className="h-6 w-auto" />
            <span className="font-bold text-sm tracking-tight hidden sm:inline">HACKDAY 2026</span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div
              className={`w-8 h-8 flex items-center justify-center ${allegianceStyle?.borderRadius}`}
              style={{
                backgroundColor: allegianceStyle?.bgColor,
                border: `2px solid ${allegianceStyle?.borderColor}`,
              }}
            >
              <AllegianceIcon className="w-4 h-4" style={{ color: allegianceStyle?.color }} />
            </div>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-black text-gray-900">ADMIN PANEL</h1>
          </div>
          <p className="text-gray-600">
            Manage the hackday event, phases, and user roles.
          </p>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Overview', icon: Settings },
            { id: 'phases', label: 'Event Phases', icon: Clock },
            { id: 'users', label: 'User Roles', icon: UserCog },
          ].map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap
                  ${
                    activeSection === section.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {section.label}
              </button>
            );
          })}
        </div>

        {/* Section Content */}
        {activeSection === 'overview' && renderOverview()}
        {activeSection === 'phases' && renderPhases()}
        {activeSection === 'users' && renderUsers()}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-4 sm:px-6 py-4 bg-white mt-8">
        <div className="max-w-6xl mx-auto text-center text-xs text-gray-400">
          HACKDAY 2026 — Admin Control Panel
        </div>
      </footer>
    </div>
  );
}

export default AdminPanel;

