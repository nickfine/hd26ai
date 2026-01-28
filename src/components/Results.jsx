import { useMemo, useEffect, useState, useRef } from 'react';
import {
  Star,
  Award,
  Users,
  Download,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import AppLayout from './AppLayout';
import Button from './ui/Button';

// ============================================================================
// CONFETTI CELEBRATION
// ============================================================================

const fireCelebration = () => {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  const randomInRange = (min, max) => Math.random() * (max - min) + min;

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);

    const particleCount = 50 * (timeLeft / duration);
    
    // Gold confetti from left
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#FFD700', '#FFA500', '#FF8C00'],
    });
    
    // Purple/blue confetti from right
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#8B5CF6', '#6366F1', '#3B82F6'],
    });
  }, 250);
};

const fireWinnerSpotlight = () => {
  // Central burst for winner announcement
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#FFD700', '#FFA500', '#FFFFFF'],
    zIndex: 9999,
  });
};

// ============================================================================
// COMPONENT
// ============================================================================

function Results({
  user,
  teams = [],
  onNavigate,
  eventPhase,
  awards = {},
}) {
  const [showContent, setShowContent] = useState(false);
  const celebrationFired = useRef(false);

  // Check if results should be visible
  const isResultsPhase = eventPhase === 'results';
  const isAdmin = user?.role === 'admin';
  const canViewResults = isResultsPhase || isAdmin;

  // Fire celebration confetti on first view of results
  useEffect(() => {
    if (canViewResults && !celebrationFired.current) {
      celebrationFired.current = true;
      // Small delay for dramatic effect
      const timer = setTimeout(() => {
        fireCelebration();
      }, 500);
      
      // Show content after confetti starts
      const contentTimer = setTimeout(() => {
        setShowContent(true);
      }, 300);

      return () => {
        clearTimeout(timer);
        clearTimeout(contentTimer);
      };
    } else if (canViewResults) {
      setShowContent(true);
    }
  }, [canViewResults]);

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

    // Grand Champion: highest judge score overall
    const grandChampion = [...allSubmitted].sort(
      (a, b) => calculateJudgeTotal(b) - calculateJudgeTotal(a)
    )[0];

    // People's Champion: most participant votes
    const peoplesChampion = [...allSubmitted].sort(
      (a, b) =>
        (b.submission?.participantVotes || 0) - (a.submission?.participantVotes || 0)
    )[0];

    return {
      grand_champion: grandChampion,
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

  // Export results to CSV
  const exportResultsToCSV = () => {
    const csvRows = [];
    
    // Header row
    csvRows.push([
      'Rank',
      'Team Name',
      'Project Name',
      'Judge Score',
      'Judge Average %',
      'Participant Votes',
      'Total Members',
      'Awards',
    ].join(','));

    // Combine both rankings and add rank
    const allRanked = [...judgesRanked].map((team, idx) => ({
      ...team,
      judgeRank: idx + 1,
      peoplesRank: peoplesRanked.findIndex(t => t.id === team.id) + 1,
    }));

    // Sort by judge rank for export
    allRanked.sort((a, b) => a.judgeRank - b.judgeRank);

    // Data rows
    allRanked.forEach((team) => {
      const awards = [];
      if (awardWinners.grand_champion?.id === team.id) {
        awards.push('Grand Champion');
      }
      if (awardWinners.peoples_champion?.id === team.id) {
        awards.push("People's Choice");
      }

      csvRows.push([
        team.judgeRank,
        `"${team.name}"`,
        `"${team.submission?.projectName || 'N/A'}"`,
        calculateJudgeTotal(team),
        calculateJudgeAverage(team).toFixed(2),
        team.submission?.participantVotes || 0,
        team.members?.length || 0,
        `"${awards.join('; ')}"`,
      ].join(','));
    });

    // Create CSV string
    const csvContent = csvRows.join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `hackday-2026-results-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ============================================================================
  // RENDER: AWARD WINNER CARD - Enhanced with celebration effects
  // ============================================================================
  const renderAwardCard = (awardKey, award, winner, index) => {
    if (!winner) return null;

    // ECD: Simplified to 2 accent colors, removed gratuitous gradients
    const awardStyles = {
      grand_champion: {
        border: 'border-yellow-500/40',
        bg: 'bg-yellow-950/20',
        text: 'text-yellow-400',
        iconBg: 'bg-yellow-500',
        accent: 'bg-yellow-500',
      },
      peoples_champion: {
        border: 'border-violet-500/40',
        bg: 'bg-violet-950/20',
        text: 'text-violet-400',
        iconBg: 'bg-violet-500',
        accent: 'bg-violet-500',
      },
    };

    const style = awardStyles[awardKey] || awardStyles.grand_champion;
    const isGrand = awardKey === 'grand_champion';

    // ECD: Simplified - removed shimmer, glow ring, corner sparkles, pulsing ribbon
    // Kept: clean card, single accent bar, trophy icon, subtle hover
    return (
      <div
        key={awardKey}
        className={`relative overflow-hidden border ${style.border} ${style.bg} p-6 rounded-xl
          transition-all duration-300 hover:border-opacity-60 animate-award-reveal`}
        style={{ animationDelay: `${index * 200 + 400}ms` }}
        onAnimationEnd={() => index === 0 && fireWinnerSpotlight()}
      >
        {/* Single accent bar - restrained */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${style.accent}`} />

        {/* Trophy icon - simplified, no glow ring */}
        <div className="flex justify-center mb-5">
          <div className={`w-20 h-20 rounded-full ${style.iconBg} 
              flex items-center justify-center shadow-lg`}>
            <span className="text-4xl">
              {isGrand ? '🏆' : '👑'}
            </span>
          </div>
        </div>

        {/* Award title */}
        <div className="text-center mb-4">
          <h3 className={`text-xl font-black ${style.text} mb-1`}>
            {isGrand ? 'GRAND CHAMPION' : "PEOPLE'S CHAMPION"}
          </h3>
          <p className="text-xs text-arena-muted">
            {isGrand ? 'Highest Combined Score' : 'Most Community Votes'}
          </p>
        </div>

        {/* Winner info - cleaner structure */}
        <div className="p-4 rounded-lg bg-black/20">
          <h4 className="font-bold text-lg text-text-primary mb-1">
            {winner.submission?.projectName}
          </h4>
          <p className="text-sm text-arena-secondary mb-3">{winner.name}</p>
          
          {/* Stats row */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              {isGrand ? (
                <>
                  <Award className={`w-4 h-4 ${style.text}`} />
                  <span className={`font-bold ${style.text}`}>
                    {calculateJudgeAverage(winner).toFixed(0)}%
                  </span>
                </>
              ) : (
                <>
                  <Star className={`w-4 h-4 ${style.text}`} />
                  <span className={`font-bold ${style.text}`}>
                    {winner.submission?.participantVotes}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1 text-arena-muted text-sm">
              <Users className="w-4 h-4" />
              <span>{winner.members?.length} members</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // RENDER: LEADERBOARD ROW - Enhanced with staggered animation
  // ============================================================================
  const renderLeaderboardRow = (team, rank, showVotes = false) => {

    const medalStyles = {
      1: { bg: 'bg-gradient-to-r from-yellow-500 to-amber-500', text: 'text-white', emoji: '🥇' },
      2: { bg: 'bg-gradient-to-r from-gray-300 to-gray-400', text: 'text-gray-800', emoji: '🥈' },
      3: { bg: 'bg-gradient-to-r from-amber-600 to-orange-600', text: 'text-white', emoji: '🥉' },
    };
    
    const medal = medalStyles[rank];
    const isTopThree = rank <= 3;

    return (
      <div
        key={team.id}
        className={`flex items-center gap-3 p-3 border-b border-arena-border last:border-0
          transition-all duration-300 hover:bg-white/5 animate-leaderboard-row
          ${isTopThree ? 'bg-gradient-to-r from-white/5 to-transparent' : ''}`}
        style={{ animationDelay: `${(rank - 1) * 100 + 800}ms` }}
      >
        {/* Rank badge */}
        <div
          className={`w-9 h-9 flex-shrink-0 flex items-center justify-center font-black text-sm rounded-lg
            shadow-sm ${medal ? medal.bg + ' ' + medal.text : 'bg-arena-border text-arena-muted'}`}
        >
          {medal ? (
            <span className="text-lg">{medal.emoji}</span>
          ) : (
            <span className="text-xs">#{rank}</span>
          )}
        </div>

        {/* Team icon */}
        <div className={`w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-lg 
          ${isTopThree ? 'bg-white/10' : 'bg-arena-border'}`}>
          <Users className={`w-4 h-4 ${isTopThree ? 'text-text-primary' : 'text-text-secondary'}`} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className={`font-bold text-sm truncate ${isTopThree ? 'text-text-primary' : 'text-text-secondary'}`}>
            {team.submission?.projectName}
          </div>
          <div className="text-xs text-arena-muted truncate">{team.name}</div>
        </div>

        {/* Score - ECD: Clean, no animation on icons */}
        <div className="text-right">
          {showVotes ? (
            <div className={`flex items-center gap-1 font-bold ${isTopThree ? 'text-yellow-400' : 'text-brand'}`}>
              <Star className="w-4 h-4" />
              <span>{team.submission?.participantVotes || 0}</span>
            </div>
          ) : (
            <div className={`flex items-center gap-1 font-bold ${isTopThree ? 'text-violet-400' : 'text-violet'}`}>
              <Award className="w-4 h-4" />
              <span>{calculateJudgeAverage(team).toFixed(0)}%</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ============================================================================
  // RENDER: COMING SOON - ECD: Simplified, restrained
  // ============================================================================
  const renderComingSoon = () => (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        {/* Trophy icon - clean, no excessive decoration */}
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-arena-card border border-arena-border
          flex items-center justify-center">
          <span className="text-5xl">🏆</span>
        </div>
        
        <h2 className="text-2xl font-black text-text-primary mb-3">
          Results Coming Soon
        </h2>
        <p className="text-arena-secondary mb-8">
          Winners will be announced during the Results phase.
        </p>
        
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="px-6 py-3 bg-brand text-white font-bold hover:bg-brand/90 
            transition-colors rounded-lg"
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
            <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-violet/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
          </div>
        )}
        {!canViewResults ? (
          renderComingSoon()
        ) : (
          <>
            {/* Page Header - ECD: Simplified, type-driven */}
            <div className={`text-center mb-12 ${showContent ? 'animate-fade-in-up' : 'opacity-0'}`}>
              {/* Status badge - single icon, no animation overload */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-arena-card 
                border border-arena-border rounded-full mb-6">
                <span className="text-lg">{isResultsPhase ? '🎉' : '👁️'}</span>
                <span className="font-bold text-sm text-text-primary">
                  {isResultsPhase ? 'Winners Announced' : 'Preview Mode'}
                </span>
              </div>
              
              {/* Main title - clean, no gradient text */}
              <h1 className="text-4xl sm:text-5xl font-black text-text-primary mb-4">
                HackDay 2026 Results
              </h1>
              
              <p className="text-arena-secondary max-w-xl mx-auto mb-6">
                Congratulations to all participants!
              </p>
              
              {isAdmin && (
                <Button
                  onClick={exportResultsToCSV}
                  className="bg-brand hover:bg-brand/90 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              )}
            </div>

            {/* Stats Bar - Animated reveal */}
            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 ${showContent ? '' : 'opacity-0'}`}>
              {[
                { value: stats.totalTeams, label: 'Teams', icon: '💡', delay: 200 },
                { value: stats.totalMembers, label: 'Participants', icon: '👥', delay: 300 },
                { value: stats.totalVotes, label: 'Votes Cast', icon: '⭐', delay: 400 },
                { value: stats.totalProjects, label: 'Projects', icon: '🚀', delay: 500 },
              ].map((stat, i) => (
                <div 
                  key={stat.label}
                  className="bg-arena-card border border-arena-border rounded-xl p-4 text-center
                    hover:border-brand/50 transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${stat.delay}ms` }}
                >
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-3xl font-black text-brand">{stat.value}</div>
                  <div className="text-xs text-arena-secondary uppercase font-bold tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Award Winners - ECD: Type-driven, no decorative icons */}
            <div className={`mb-12 ${showContent ? '' : 'opacity-0'}`}>
              <h2 className="text-2xl font-black text-text-primary text-center mb-8">
                Award Winners
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {Object.entries(awards).map(([key, award], index) =>
                  renderAwardCard(key, award, awardWinners[key], index)
                )}
              </div>
            </div>

            {/* Leaderboards - ECD: Clean headers, consistent structure */}
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${showContent ? '' : 'opacity-0'}`}>
              {/* Judge Rankings */}
              <div className="bg-arena-card border border-arena-border rounded-xl overflow-hidden
                animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                <div className="px-4 py-3 border-b border-arena-border flex items-center gap-2">
                  <Award className="w-5 h-5 text-violet-400" />
                  <h3 className="font-bold text-text-primary">Judge Rankings</h3>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {judgesRanked.map((team, idx) =>
                    renderLeaderboardRow(team, idx + 1, false)
                  )}
                </div>
              </div>

              {/* People's Vote Rankings */}
              <div className="bg-arena-card border border-arena-border rounded-xl overflow-hidden
                animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                <div className="px-4 py-3 border-b border-arena-border flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <h3 className="font-bold text-text-primary">People's Choice</h3>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {peoplesRanked.map((team, idx) =>
                    renderLeaderboardRow(team, idx + 1, true)
                  )}
                </div>
              </div>
            </div>

            {/* Footer message */}
            <div className={`mt-12 text-center py-8 border-t border-arena-border ${showContent ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: '1000ms' }}>
              <div className="text-4xl mb-4">🎊</div>
              <p className="text-arena-secondary text-lg mb-2">
                Thank you to all participants, judges, and organizers!
              </p>
              <p className="text-arena-muted text-sm">
                HackDay 2026 was a tremendous success. See you next year!
              </p>
            </div>
          </>
        )}

        {/* CSS Animations - ECD: Reduced to essential, purposeful motion */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes award-reveal {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes leaderboard-row {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .animate-award-reveal {
          animation: award-reveal 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .animate-leaderboard-row {
          animation: leaderboard-row 0.3s ease-out forwards;
          opacity: 0;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
      </div>
    </AppLayout>
  );
}

export default Results;

