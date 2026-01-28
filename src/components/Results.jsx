import { useMemo, useEffect, useState, useRef } from 'react';
import {
  Trophy,
  Crown,
  Star,
  Award,
  Users,
  Sparkles,
  Lock,
  Medal,
  Download,
  PartyPopper,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '../lib/design-system';
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
  const [hasAnimated, setHasAnimated] = useState(false);
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
        setHasAnimated(true);
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

    const awardStyles = {
      grand_champion: {
        gradient: 'from-yellow-500 via-amber-400 to-yellow-600',
        border: 'border-yellow-500/50',
        bg: 'bg-gradient-to-br from-yellow-950/30 to-amber-950/20',
        text: 'text-yellow-400',
        glow: 'shadow-[0_0_30px_rgba(234,179,8,0.3)]',
        iconBg: 'bg-gradient-to-br from-yellow-400 to-amber-600',
        ribbon: 'bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600',
      },
      peoples_champion: {
        gradient: 'from-violet-500 via-purple-400 to-indigo-500',
        border: 'border-violet-500/50',
        bg: 'bg-gradient-to-br from-violet-950/30 to-purple-950/20',
        text: 'text-violet-400',
        glow: 'shadow-[0_0_30px_rgba(139,92,246,0.3)]',
        iconBg: 'bg-gradient-to-br from-violet-400 to-purple-600',
        ribbon: 'bg-gradient-to-r from-violet-600 via-purple-400 to-violet-600',
      },
    };

    const style = awardStyles[awardKey] || awardStyles.grand_champion;
    const isGrand = awardKey === 'grand_champion';

    return (
      <div
        key={awardKey}
        className={`relative overflow-hidden border-2 ${style.border} ${style.bg} p-6 rounded-2xl
          ${style.glow} transform transition-all duration-500 hover:scale-[1.02]
          animate-award-reveal`}
        style={{ animationDelay: `${index * 300 + 500}ms` }}
        onAnimationEnd={() => index === 0 && fireWinnerSpotlight()}
      >
        {/* Animated shimmer effect */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div className={`absolute -inset-full bg-gradient-to-r from-transparent via-white/5 to-transparent
            animate-shimmer`} style={{ animationDelay: `${index * 500}ms` }} />
        </div>

        {/* Top ribbon */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${style.ribbon} animate-pulse`} />

        {/* Corner sparkles */}
        <Sparkles className={`absolute top-3 right-3 w-5 h-5 ${style.text} animate-twinkle`} />
        <Sparkles className={`absolute top-3 left-3 w-5 h-5 ${style.text} animate-twinkle`} 
          style={{ animationDelay: '0.5s' }} />

        {/* Trophy icon with glow */}
        <div className="flex justify-center mb-5">
          <div className={`relative w-24 h-24 rounded-full ${style.iconBg} 
              flex items-center justify-center shadow-2xl animate-trophy-bounce`}>
            <span className="text-5xl filter drop-shadow-lg">
              {isGrand ? '🏆' : '👑'}
            </span>
            {/* Glow ring */}
            <div className={`absolute inset-0 rounded-full ${style.iconBg} opacity-50 
              animate-ping-slow`} />
          </div>
        </div>

        {/* Award title */}
        <div className="text-center mb-4">
          <h3 className={`text-2xl font-black ${style.text} mb-1 tracking-wide`}>
            {isGrand ? 'GRAND CHAMPION' : "PEOPLE'S CHAMPION"}
          </h3>
          <p className="text-xs text-arena-muted">
            {isGrand ? 'Highest Combined Score' : 'Most Community Votes'}
          </p>
        </div>

        {/* Winner info card */}
        <div className="p-4 border border-white/10 rounded-xl bg-black/30 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-lg ${style.iconBg} flex items-center justify-center`}>
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-black text-lg text-text-primary leading-tight">
                {winner.submission?.projectName}
              </h4>
              <p className="text-sm text-arena-secondary">{winner.name}</p>
            </div>
          </div>
          
          {/* Stats row */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            {isGrand ? (
              <div className="flex items-center gap-2">
                <Award className={`w-4 h-4 ${style.text}`} />
                <span className={`font-bold ${style.text}`}>
                  {calculateJudgeAverage(winner).toFixed(0)}%
                </span>
                <span className="text-xs text-arena-muted">judge score</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Star className={`w-4 h-4 ${style.text}`} />
                <span className={`font-bold ${style.text}`}>
                  {winner.submission?.participantVotes}
                </span>
                <span className="text-xs text-arena-muted">votes</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-arena-muted">
              <Users className="w-4 h-4" />
              <span className="text-sm">{winner.members?.length}</span>
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

        {/* Score */}
        <div className="text-right">
          {showVotes ? (
            <div className={`flex items-center gap-1 font-bold ${isTopThree ? 'text-yellow-400' : 'text-brand'}`}>
              <Star className={`w-4 h-4 ${isTopThree ? 'animate-twinkle' : ''}`} />
              <span>{team.submission?.participantVotes || 0}</span>
            </div>
          ) : (
            <div className={`flex items-center gap-1 font-bold ${isTopThree ? 'text-violet-400' : 'text-violet'}`}>
              <Award className={`w-4 h-4 ${isTopThree ? 'animate-twinkle' : ''}`} />
              <span>{calculateJudgeAverage(team).toFixed(0)}%</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ============================================================================
  // RENDER: COMING SOON (if not results phase) - Enhanced anticipation
  // ============================================================================
  const renderComingSoon = () => (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        {/* Animated trophy with suspense */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-500/20 to-amber-500/10 
            animate-pulse" />
          <div className="absolute inset-2 rounded-full bg-arena-card flex items-center justify-center
            border-2 border-dashed border-yellow-500/30">
            <div className="text-5xl animate-bounce" style={{ animationDuration: '2s' }}>🏆</div>
          </div>
          {/* Sparkle decorations */}
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-twinkle" />
          <Sparkles className="absolute -bottom-2 -left-2 w-5 h-5 text-violet-400 animate-twinkle" 
            style={{ animationDelay: '0.5s' }} />
        </div>
        
        <h2 className="text-3xl font-black text-text-primary mb-3">
          Results Coming Soon
        </h2>
        <p className="text-arena-secondary mb-2">
          The winners will be announced during the Results phase.
        </p>
        <p className="text-arena-muted text-sm mb-8">
          Check back after judging is complete! 🎉
        </p>
        
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="px-8 py-3 bg-gradient-to-r from-brand to-violet-600 text-white font-bold 
            hover:from-brand/90 hover:to-violet-600/90 transition-all duration-300 rounded-xl
            shadow-lg shadow-brand/25"
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
            {/* Page Header - Celebration Style */}
            <div className={`text-center mb-12 ${showContent ? 'animate-celebration-header' : 'opacity-0'}`}>
              {/* Celebration badge */}
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-500/20 via-amber-500/10 to-violet-500/20 
                border border-yellow-500/30 rounded-full mb-6 backdrop-blur-sm">
                <PartyPopper className="w-5 h-5 text-yellow-400 animate-bounce" />
                <span className="font-black text-sm text-yellow-400 tracking-wider">
                  {isResultsPhase ? '🎉 WINNERS ANNOUNCED 🎉' : '👁️ PREVIEW MODE (Admin)'}
                </span>
                <PartyPopper className="w-5 h-5 text-violet-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
              
              {/* Main title with gradient */}
              <h1 className="text-4xl sm:text-5xl font-black mb-4 font-display">
                <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                  HACKDAY 2026
                </span>
                <br />
                <span className="text-text-primary">RESULTS</span>
              </h1>
              
              <p className="text-arena-secondary max-w-2xl mx-auto mb-6 text-lg">
                Congratulations to all participants! Here are the winners of HackDay 2026.
              </p>
              
              {isAdmin && (
                <div className="flex justify-center">
                  <Button
                    onClick={exportResultsToCSV}
                    className="bg-gradient-to-r from-brand to-violet-600 hover:from-brand/90 hover:to-violet-600/90 
                      text-white flex items-center gap-2 shadow-lg shadow-brand/25"
                  >
                    <Download className="w-4 h-4" />
                    Export Results CSV
                  </Button>
                </div>
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

            {/* Award Winners - Trophy Section */}
            <div className={`mb-12 ${showContent ? '' : 'opacity-0'}`}>
              <div className="flex items-center justify-center gap-3 mb-8">
                <Sparkles className="w-6 h-6 text-yellow-400 animate-twinkle" />
                <h2 className="text-2xl sm:text-3xl font-black text-text-primary tracking-wide">
                  AWARD WINNERS
                </h2>
                <Sparkles className="w-6 h-6 text-violet-400 animate-twinkle" style={{ animationDelay: '0.5s' }} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {Object.entries(awards).map(([key, award], index) =>
                  renderAwardCard(key, award, awardWinners[key], index)
                )}
              </div>
            </div>

            {/* Leaderboards - Full Rankings */}
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${showContent ? '' : 'opacity-0'}`}>
              {/* Judge Rankings */}
              <div className="bg-arena-card border border-arena-border rounded-xl overflow-hidden
                animate-fade-in-up" style={{ animationDelay: '700ms' }}>
                <div className="px-4 py-4 bg-gradient-to-r from-violet-500/20 to-purple-500/10 
                  border-b border-arena-border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                    <Award className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-black text-text-primary">Judge Rankings</h3>
                    <p className="text-xs text-arena-muted">Based on expert evaluation scores</p>
                  </div>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {judgesRanked.map((team, idx) =>
                    renderLeaderboardRow(team, idx + 1, false)
                  )}
                </div>
              </div>

              {/* People's Vote Rankings */}
              <div className="bg-arena-card border border-arena-border rounded-xl overflow-hidden
                animate-fade-in-up" style={{ animationDelay: '800ms' }}>
                <div className="px-4 py-4 bg-gradient-to-r from-yellow-500/20 to-amber-500/10 
                  border-b border-arena-border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-black text-text-primary">People's Choice</h3>
                    <p className="text-xs text-arena-muted">Community votes from all participants</p>
                  </div>
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

        {/* CSS Animations - Enhanced Celebration */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes award-reveal {
          0% { opacity: 0; transform: scale(0.8) translateY(30px); }
          50% { transform: scale(1.05) translateY(-5px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        
        @keyframes trophy-bounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-8px) rotate(-3deg); }
          75% { transform: translateY(-4px) rotate(3deg); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
        
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.3); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        @keyframes leaderboard-row {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes celebration-header {
          0% { opacity: 0; transform: scale(0.5); }
          50% { transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-award-reveal {
          animation: award-reveal 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          opacity: 0;
        }
        
        .animate-trophy-bounce {
          animation: trophy-bounce 2s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
        
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 1.5s ease-in-out infinite;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-leaderboard-row {
          animation: leaderboard-row 0.4s ease-out forwards;
          opacity: 0;
        }
        
        .animate-celebration-header {
          animation: celebration-header 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
      </div>
    </AppLayout>
  );
}

export default Results;

