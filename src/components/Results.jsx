import { useMemo } from 'react';
import {
  Heart,
  Cpu,
  Trophy,
  Crown,
  Star,
  Award,
  Users,
  Sparkles,
  Lock,
  Medal,
} from 'lucide-react';
import { ALLEGIANCE_CONFIG, cn, getAllegianceConfig } from '../lib/design-system';
import AppLayout from './AppLayout';

// ============================================================================
// COMPONENT
// ============================================================================

function Results({
  user,
  teams = [],
  allegianceStyle,
  onNavigate,
  eventPhase,
  awards = {},
}) {

  // Check if results should be visible
  const isResultsPhase = eventPhase === 'results';
  const isAdmin = user?.role === 'admin';
  const canViewResults = isResultsPhase || isAdmin;

  // Get only submitted projects
  const submittedProjects = useMemo(() => {
    return teams.filter((team) => team.submission?.status === 'submitted');
  }, [teams]);

  // Calculate judge score total for a team
  const calculateJudgeTotal = (team) => {
    const scores = team.submission?.judgeScores || [];
    if (scores.length === 0) return 0;

    return scores.reduce((sum, judge) => {
      return sum + Object.values(judge.scores).reduce((a, b) => a + b, 0);
    }, 0);
  };

  // Calculate judge score average percentage
  const calculateJudgeAverage = (team) => {
    const scores = team.submission?.judgeScores || [];
    if (scores.length === 0) return 0;

    const totalScore = scores.reduce((sum, judge) => {
      const judgeTotal = Object.values(judge.scores).reduce((a, b) => a + b, 0);
      return sum + judgeTotal;
    }, 0);

    const maxPossible = scores.length * 5 * 10; // 5 criteria, max 10 each
    return maxPossible > 0 ? (totalScore / maxPossible) * 100 : 0;
  };

  // Sort by judge scores
  const judgesRanked = useMemo(() => {
    return [...submittedProjects].sort(
      (a, b) => calculateJudgeTotal(b) - calculateJudgeTotal(a)
    );
  }, [submittedProjects]);

  // Sort by people's votes
  const peoplesRanked = useMemo(() => {
    return [...submittedProjects].sort(
      (a, b) =>
        (b.submission?.participantVotes || 0) - (a.submission?.participantVotes || 0)
    );
  }, [submittedProjects]);

  // Calculate award winners
  const awardWinners = useMemo(() => {
    const allSubmitted = teams.filter((t) => t.submission?.status === 'submitted');
    const humanTeams = allSubmitted.filter((t) => t.side === 'human');
    const aiTeams = allSubmitted.filter((t) => t.side === 'ai');

    // Grand Champion: highest judge score overall
    const grandChampion = [...allSubmitted].sort(
      (a, b) => calculateJudgeTotal(b) - calculateJudgeTotal(a)
    )[0];

    // Best Human: highest judge score among human teams
    const bestHuman = [...humanTeams].sort(
      (a, b) => calculateJudgeTotal(b) - calculateJudgeTotal(a)
    )[0];

    // Best AI: highest judge score among AI teams
    const bestAI = [...aiTeams].sort(
      (a, b) => calculateJudgeTotal(b) - calculateJudgeTotal(a)
    )[0];

    // People's Champion: most participant votes
    const peoplesChampion = [...allSubmitted].sort(
      (a, b) =>
        (b.submission?.participantVotes || 0) - (a.submission?.participantVotes || 0)
    )[0];

    return {
      grand_champion: grandChampion,
      best_human: bestHuman,
      best_ai: bestAI,
      peoples_champion: peoplesChampion,
    };
  }, [teams]);

  // Stats
  const stats = useMemo(() => {
    const totalVotes = submittedProjects.reduce(
      (sum, t) => sum + (t.submission?.participantVotes || 0),
      0
    );
    const totalMembers = teams.reduce((sum, t) => sum + (t.members?.length || 0), 0);
    const totalJudgeScores = submittedProjects.reduce(
      (sum, t) => sum + (t.submission?.judgeScores?.length || 0),
      0
    );

    return {
      totalTeams: teams.length,
      totalProjects: submittedProjects.length,
      totalVotes,
      totalMembers,
      totalJudgeScores,
    };
  }, [teams, submittedProjects]);

  // ============================================================================
  // RENDER: AWARD WINNER CARD
  // ============================================================================
  const renderAwardCard = (awardKey, award, winner, index) => {
    if (!winner) return null;
    const config = ALLEGIANCE_CONFIG[winner.side] || ALLEGIANCE_CONFIG.neutral;

    const awardStyles = {
      grand_champion: {
        gradient: 'from-brand via-orange-400 to-brand',
        border: 'border-brand',
        bg: 'bg-arena-card',
        text: 'text-brand',
        glow: 'shadow-glow-brand',
      },
      best_human: {
        gradient: 'from-human via-red-400 to-human',
        border: 'border-human',
        bg: 'bg-arena-card',
        text: 'text-human',
        glow: 'shadow-glow-human',
      },
      best_ai: {
        gradient: 'from-ai via-cyan-400 to-ai',
        border: 'border-ai',
        bg: 'bg-arena-card',
        text: 'text-ai',
        glow: 'shadow-glow-ai',
      },
      peoples_champion: {
        gradient: 'from-violet via-purple-400 to-violet',
        border: 'border-violet',
        bg: 'bg-arena-card',
        text: 'text-violet',
        glow: 'shadow-glow-brand',
      },
    };

    const style = awardStyles[awardKey] || awardStyles.grand_champion;

    return (
      <div
        key={awardKey}
        className={`relative overflow-hidden border-2 ${style.border} ${style.bg} p-6 rounded-xl
          shadow-lg ${style.glow} transform transition-all duration-500 hover:scale-105
          animate-fade-in-up`}
        style={{ animationDelay: `${index * 200}ms` }}
      >
        {/* Gradient header */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${style.gradient}`}
        />

        {/* Trophy icon */}
        <div className="flex justify-center mb-4">
          <div
            className={`w-20 h-20 rounded-full bg-gradient-to-br ${style.gradient} 
              flex items-center justify-center shadow-lg animate-pulse-slow`}
          >
            <span className="text-4xl">{award.emoji}</span>
          </div>
        </div>

        {/* Award name */}
        <h3 className={`text-xl font-black ${style.text} text-center mb-1`}>
          {award.label}
        </h3>
        <p className="text-xs text-arena-muted text-center mb-4">{award.description}</p>

        {/* Winner info */}
        <div
          className="p-4 border border-arena-border rounded-lg bg-arena-black/50"
        >
          <div className="flex items-center gap-2 mb-2">
            {winner.side === 'ai' ? (
              <Cpu className="w-5 h-5" style={{ color: config.color }} />
            ) : (
              <Heart className="w-5 h-5" style={{ color: config.color }} />
            )}
            <span
              className="font-black text-lg"
              style={{ color: config.color }}
            >
              {winner.submission?.projectName}
            </span>
          </div>
          <p className="text-sm text-arena-secondary mb-2">{winner.name}</p>
          <div className="flex items-center gap-4 text-xs text-arena-muted">
            {award.determinedBy === 'votes' ? (
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-brand" />
                {winner.submission?.participantVotes} votes
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Award className="w-3 h-3 text-violet" />
                {calculateJudgeAverage(winner).toFixed(0)}% judge score
              </span>
            )}
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {winner.members?.length} members
            </span>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // RENDER: LEADERBOARD ROW
  // ============================================================================
  const renderLeaderboardRow = (team, rank, showVotes = false) => {
    const config = ALLEGIANCE_CONFIG[team.side] || ALLEGIANCE_CONFIG.neutral;

    const medalColors = {
      1: 'bg-brand text-white',
      2: 'bg-arena-secondary text-arena-black',
      3: 'bg-brand/60 text-white',
    };

    return (
      <div
        key={team.id}
        className={`flex items-center gap-3 p-3 border-b border-arena-border last:border-0
          ${rank <= 3 ? 'bg-arena-black/30' : ''}`}
      >
        {/* Rank */}
        <div
          className={`w-8 h-8 flex-shrink-0 flex items-center justify-center font-black text-sm rounded
            ${medalColors[rank] || 'bg-arena-border text-arena-muted'}`}
        >
          {rank <= 3 ? <Medal className="w-4 h-4" /> : rank}
        </div>

        {/* Side icon */}
        <div
          className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded bg-arena-border"
        >
          {team.side === 'ai' ? (
            <Cpu className="w-4 h-4" style={{ color: config.color }} />
          ) : (
            <Heart className="w-4 h-4" style={{ color: config.color }} />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div
            className="font-bold text-sm truncate text-white"
          >
            {team.submission?.projectName}
          </div>
          <div className="text-xs text-arena-muted truncate">{team.name}</div>
        </div>

        {/* Score */}
        <div className="text-right">
          {showVotes ? (
            <div className="flex items-center gap-1 text-brand font-bold">
              <Star className="w-4 h-4" />
              {team.submission?.participantVotes || 0}
            </div>
          ) : (
            <div className="flex items-center gap-1 text-violet font-bold">
              <Award className="w-4 h-4" />
              {calculateJudgeAverage(team).toFixed(0)}%
            </div>
          )}
        </div>
      </div>
    );
  };

  // ============================================================================
  // RENDER: COMING SOON (if not results phase)
  // ============================================================================
  const renderComingSoon = () => (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-arena-card flex items-center justify-center">
          <Lock className="w-12 h-12 text-arena-muted" />
        </div>
        <h2 className="text-2xl font-black text-white mb-3">Results Coming Soon</h2>
        <p className="text-arena-secondary mb-6">
          The winners will be announced during the Results phase. Check back after judging
          is complete!
        </p>
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="px-6 py-3 bg-brand text-white font-bold hover:bg-brand/90 transition-colors rounded-lg"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  return (
    <AppLayout
      user={user}
      teams={teams}
      allegianceStyle={allegianceStyle}
      onNavigate={onNavigate}
      eventPhase={eventPhase}
      activeNav="results"
    >
      <div className="p-4 sm:p-6 relative">
        {/* Celebration background */}
        {canViewResults && (
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute inset-0 bg-arena-black" />
            <div className="absolute top-0 left-0 w-96 h-96 bg-brand/10 rounded-full blur-3xl animate-blob" />
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-violet/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
            <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-ai/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
          </div>
        )}
        {!canViewResults ? (
          renderComingSoon()
        ) : (
          <>
            {/* Page Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-arena-card border border-arena-border rounded-full mb-4">
                <Trophy className="w-5 h-5 text-brand" />
                <span className="font-bold text-sm text-white">
                  {isResultsPhase ? 'WINNERS ANNOUNCED' : 'PREVIEW MODE (Admin Only)'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-brand mb-3 font-display">
                HACKDAY 2026 RESULTS
              </h1>
              <p className="text-arena-secondary max-w-2xl mx-auto">
                Congratulations to all participants! Here are the winners of this year's
                Human vs AI HackDay.
              </p>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
              <div className="bg-arena-card border border-arena-border rounded-xl p-4 text-center">
                <div className="text-3xl font-black text-brand">{stats.totalTeams}</div>
                <div className="text-xs text-arena-secondary uppercase font-bold">Teams</div>
              </div>
              <div className="bg-arena-card border border-arena-border rounded-xl p-4 text-center">
                <div className="text-3xl font-black text-brand">{stats.totalMembers}</div>
                <div className="text-xs text-arena-secondary uppercase font-bold">Participants</div>
              </div>
              <div className="bg-arena-card border border-arena-border rounded-xl p-4 text-center">
                <div className="text-3xl font-black text-brand">{stats.totalVotes}</div>
                <div className="text-xs text-arena-secondary uppercase font-bold">Votes Cast</div>
              </div>
              <div className="bg-arena-card border border-arena-border rounded-xl p-4 text-center">
                <div className="text-3xl font-black text-brand">{stats.totalProjects}</div>
                <div className="text-xs text-arena-secondary uppercase font-bold">Projects</div>
              </div>
            </div>

            {/* Award Winners */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-8 h-8 text-brand" />
                <h2 className="text-2xl font-black text-white">AWARD WINNERS</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(awards).map(([key, award], index) =>
                  renderAwardCard(key, award, awardWinners[key], index)
                )}
              </div>
            </div>

            {/* Leaderboards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Judge Rankings */}
              <div className="bg-arena-card border border-arena-border rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-violet/10 border-b border-arena-border flex items-center gap-2">
                  <Award className="w-5 h-5 text-violet" />
                  <h3 className="font-black text-white">Judge Rankings</h3>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {judgesRanked.map((team, idx) =>
                    renderLeaderboardRow(team, idx + 1, false)
                  )}
                </div>
              </div>

              {/* People's Vote Rankings */}
              <div className="bg-arena-card border border-arena-border rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-brand/10 border-b border-arena-border flex items-center gap-2">
                  <Crown className="w-5 h-5 text-brand" />
                  <h3 className="font-black text-white">People's Vote</h3>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {peoplesRanked.map((team, idx) =>
                    renderLeaderboardRow(team, idx + 1, true)
                  )}
                </div>
              </div>
            </div>

            {/* Footer message */}
            <div className="mt-12 text-center">
              <p className="text-arena-secondary text-sm">
                Thank you to all participants, judges, and organizers for making HackDay 2026
                a success!
              </p>
            </div>
          </>
        )}

        {/* CSS Animations */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.4);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 20px 10px rgba(251, 191, 36, 0.2);
          }
        }
        
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
      </div>
    </AppLayout>
  );
}

export default Results;

