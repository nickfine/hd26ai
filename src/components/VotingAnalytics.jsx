import { useState, useMemo } from 'react';
import {
  Trophy,
  Star,
  Crown,
  BarChart3,
  TrendingUp,
  Filter,
  Award,
  ChevronDown,
  ChevronUp,
  Target,
  Sparkles,
  Users,
} from 'lucide-react';
import { cn } from '../lib/design-system';
import AppLayout from './AppLayout';

// ============================================================================
// COMPONENT
// ============================================================================

function VotingAnalytics({
  user,
  teams = [],
  onNavigate,
  eventPhase,
  judgeCriteria = [],
  awards = {},
}) {
  const [expandedTeam, setExpandedTeam] = useState(null);
  const [activeTab, setActiveTab] = useState('leaderboard'); // 'leaderboard' | 'peoples' | 'judges' | 'awards'

  // Get only submitted projects
  const submittedProjects = useMemo(() => {
    return teams.filter((team) => team.submission?.status === 'submitted');
  }, [teams]);

  // All submitted projects (no filtering)
  const filteredProjects = useMemo(() => {
    return submittedProjects;
  }, [submittedProjects]);

  // Calculate judge score average for a team
  const calculateJudgeAverage = (team) => {
    const scores = team.submission?.judgeScores || [];
    if (scores.length === 0) return 0;

    const totalScore = scores.reduce((sum, judge) => {
      const judgeTotal = Object.values(judge.scores).reduce((a, b) => a + b, 0);
      return sum + judgeTotal;
    }, 0);

    const maxPossible = scores.length * judgeCriteria.length * 10;
    return maxPossible > 0 ? (totalScore / maxPossible) * 100 : 0;
  };

  // Calculate raw judge score total for a team
  const calculateJudgeTotal = (team) => {
    const scores = team.submission?.judgeScores || [];
    if (scores.length === 0) return 0;

    return scores.reduce((sum, judge) => {
      return sum + Object.values(judge.scores).reduce((a, b) => a + b, 0);
    }, 0);
  };

  // Sort projects by combined score (judge average + normalized votes)
  const rankedProjects = useMemo(() => {
    const maxVotes = Math.max(
      ...filteredProjects.map((t) => t.submission?.participantVotes || 0),
      1
    );

    return [...filteredProjects].sort((a, b) => {
      const aJudgeScore = calculateJudgeAverage(a);
      const bJudgeScore = calculateJudgeAverage(b);
      const aVoteScore = ((a.submission?.participantVotes || 0) / maxVotes) * 100;
      const bVoteScore = ((b.submission?.participantVotes || 0) / maxVotes) * 100;

      // Combined score: 70% judge, 30% votes
      const aCombined = aJudgeScore * 0.7 + aVoteScore * 0.3;
      const bCombined = bJudgeScore * 0.7 + bVoteScore * 0.3;

      return bCombined - aCombined;
    });
  }, [filteredProjects]);

  // Sort by people's votes only
  const peoplesRanked = useMemo(() => {
    return [...filteredProjects].sort(
      (a, b) =>
        (b.submission?.participantVotes || 0) - (a.submission?.participantVotes || 0)
    );
  }, [filteredProjects]);

  // Sort by judge scores only
  const judgesRanked = useMemo(() => {
    return [...filteredProjects].sort(
      (a, b) => calculateJudgeTotal(b) - calculateJudgeTotal(a)
    );
  }, [filteredProjects]);

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

    const totalJudgeScores = submittedProjects.reduce(
      (sum, t) => sum + (t.submission?.judgeScores?.length || 0),
      0
    );
    const fullyJudged = submittedProjects.filter(
      (t) => (t.submission?.judgeScores?.length || 0) >= 3
    ).length;

    return {
      totalProjects: submittedProjects.length,
      totalVotes,
      humanVotes,
      aiVotes,
      totalJudgeScores,
      fullyJudged,
      judgeProgress: submittedProjects.length > 0 
        ? Math.round((fullyJudged / submittedProjects.length) * 100) 
        : 0,
    };
  }, [submittedProjects]);

  // ============================================================================
  // RENDER: STATS CARDS
  // ============================================================================
  const renderStats = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Projects */}
      <div className="bg-arena-card border-2 border-arena-border p-4">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-arena-muted" />
          <span className="text-xs font-bold text-text-secondary uppercase">Projects</span>
        </div>
        <div className="text-3xl font-black text-text-primary">{stats.totalProjects}</div>
        <div className="text-xs text-text-secondary mt-1">submitted</div>
      </div>

      {/* Total Votes */}
      <div className="bg-arena-card border-2 border-arena-border p-4">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-bold text-text-secondary uppercase">Votes</span>
        </div>
        <div className="text-3xl font-black text-text-primary">{stats.totalVotes}</div>
        <div className="text-xs text-text-secondary mt-1">
          <span className="text-green-600">{stats.humanVotes} human</span>
          {' · '}
          <span className="text-cyan-600">{stats.aiVotes} AI</span>
        </div>
      </div>

      {/* Judge Progress */}
      <div className="bg-arena-card border-2 border-arena-border p-4">
        <div className="flex items-center gap-2 mb-2">
          <Award className="w-5 h-5 text-purple-500" />
          <span className="text-xs font-bold text-text-secondary uppercase">Judging</span>
        </div>
        <div className="text-3xl font-black text-text-primary">{stats.judgeProgress}%</div>
        <div className="text-xs text-text-secondary mt-1">
          {stats.fullyJudged}/{stats.totalProjects} complete
        </div>
      </div>

      {/* Event Phase */}
      <div className="bg-arena-card border-2 border-arena-border p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          <span className="text-xs font-bold text-text-secondary uppercase">Phase</span>
        </div>
        <div className="text-lg font-black text-text-primary capitalize">
          {eventPhase?.replace('_', ' ')}
        </div>
        <div className="text-xs text-text-secondary mt-1">current stage</div>
      </div>
    </div>
  );

  // ============================================================================
  // RENDER: LEADERBOARD ROW
  // ============================================================================
  const renderLeaderboardRow = (team, rank, showVotes = true, showJudge = true) => {
    const judgeAvg = calculateJudgeAverage(team);
    const judgeScores = team.submission?.judgeScores || [];
    const isExpanded = expandedTeam === team.id;

    return (
      <div key={team.id} className="bg-arena-card border-2 border-arena-border overflow-hidden">
        <div
          className="flex items-center gap-4 p-4 cursor-pointer hover:bg-arena-elevated"
          onClick={() => setExpandedTeam(isExpanded ? null : team.id)}
        >
          {/* Rank */}
          <div
            className={`w-10 h-10 flex-shrink-0 flex items-center justify-center font-black text-lg
              ${rank === 1 ? 'bg-amber-400 text-amber-900' : ''}
              ${rank === 2 ? 'bg-gray-300 text-text-primary' : ''}
              ${rank === 3 ? 'bg-amber-600 text-amber-100' : ''}
              ${rank > 3 ? 'bg-arena-elevated text-text-secondary' : ''}
            `}
          >
            {rank}
          </div>

          {/* Team indicator */}
          <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-arena-elevated">
            <Users className="w-5 h-5 text-text-secondary" />
          </div>

          {/* Project info */}
          <div className="flex-1 min-w-0">
            <h3
              className="text-base font-black text-text-primary truncate"
            >
              {team.submission?.projectName || 'Untitled'}
            </h3>
            <p className="text-sm text-text-secondary truncate">{team.name}</p>
          </div>

          {/* Scores */}
          <div className="hidden sm:flex items-center gap-6">
            {showVotes && (
              <div className="text-center">
                <div className="text-xs font-bold text-arena-muted uppercase mb-1">Votes</div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-text-primary">
                    {team.submission?.participantVotes || 0}
                  </span>
                </div>
              </div>
            )}
            {showJudge && (
              <div className="text-center">
                <div className="text-xs font-bold text-arena-muted uppercase mb-1">Judge</div>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-purple-500" />
                  <span className="font-bold text-text-primary">{judgeAvg.toFixed(0)}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Expand indicator */}
          <div className="text-arena-muted">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>
        </div>

        {/* Expanded details */}
        {isExpanded && (
          <div className="border-t border-arena-border p-4 bg-arena-elevated">
            <p className="text-sm text-text-secondary mb-4">{team.submission?.description}</p>

            {/* Judge breakdown */}
            {judgeScores.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-text-secondary uppercase">Judge Scores</h4>
                {judgeScores.map((score) => (
                  <div key={score.judgeId} className="bg-arena-card p-3 border border-arena-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm">{score.judgeName}</span>
                      <span className="text-xs text-text-secondary">
                        {Object.values(score.scores).reduce((a, b) => a + b, 0)}/
                        {judgeCriteria.length * 10}
                      </span>
                    </div>
                    <div className="grid grid-cols-5 gap-2 text-xs">
                      {judgeCriteria.map((criterion) => (
                        <div key={criterion.id} className="text-center">
                          <div className="text-arena-muted truncate">{criterion.label}</div>
                          <div className="font-bold">{score.scores[criterion.id]}/10</div>
                        </div>
                      ))}
                    </div>
                    {score.comments && (
                      <p className="text-xs text-text-secondary mt-2 italic">"{score.comments}"</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {judgeScores.length === 0 && (
              <div className="text-sm text-arena-muted italic">No judge scores yet</div>
            )}
          </div>
        )}
      </div>
    );
  };

  // ============================================================================
  // RENDER: AWARD CARD
  // ============================================================================
  const renderAwardCard = (awardKey, award, winner) => {
    if (!winner) return null;

    return (
      <div
        key={awardKey}
        className="bg-gradient-to-br from-white to-gray-50 border-2 border-arena-border p-6"
      >
        <div className="text-4xl mb-3">{award.emoji}</div>
        <h3 className="text-lg font-black text-text-primary mb-1">{award.label}</h3>
        <p className="text-xs text-text-secondary mb-4">{award.description}</p>
        <div className="p-4 rounded-lg bg-arena-elevated">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-text-secondary" />
            <span
              className="font-black"
              style={{ color: config.color }}
            >
              {winner.submission?.projectName}
            </span>
          </div>
          <p className="text-sm text-text-secondary">{winner.name}</p>
          <div className="flex items-center gap-4 mt-2 text-xs">
            {award.determinedBy === 'votes' ? (
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400" />
                {winner.submission?.participantVotes} votes
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Award className="w-3 h-3 text-purple-500" />
                {calculateJudgeAverage(winner).toFixed(0)}% judge score
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // RENDER: TAB CONTENT
  // ============================================================================
  const renderTabContent = () => {
    switch (activeTab) {
      case 'leaderboard':
        return (
          <div className="space-y-3">
            {rankedProjects.length === 0 ? (
              <div className="text-center py-12 text-arena-muted">
                <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No submitted projects yet</p>
              </div>
            ) : (
              rankedProjects.map((team, idx) =>
                renderLeaderboardRow(team, idx + 1, true, true)
              )
            )}
          </div>
        );

      case 'peoples':
        return (
          <div className="space-y-3">
            <div className="bg-amber-50 border-2 border-amber-200 p-4 mb-4">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-600" />
                <span className="font-bold text-amber-900">People's Champion Award</span>
              </div>
              <p className="text-sm text-amber-700 mt-1">
                Ranked by participant votes. This determines the People's Champion!
              </p>
            </div>
            {peoplesRanked.map((team, idx) =>
              renderLeaderboardRow(team, idx + 1, true, false)
            )}
          </div>
        );

      case 'judges':
        return (
          <div className="space-y-3">
            <div className="bg-brand-subtle border-2 border-purple-200 p-4 mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-purple-600" />
                <span className="font-bold text-purple-900">Judge Rankings</span>
              </div>
              <p className="text-sm text-purple-700 mt-1">
                Ranked by combined judge scores. Determines Grand Champion and Best Side awards.
              </p>
            </div>
            {judgesRanked.map((team, idx) =>
              renderLeaderboardRow(team, idx + 1, false, true)
            )}
          </div>
        );

      case 'awards':
        return (
          <div>
            <div className="bg-gradient-to-r from-amber-50 to-purple-50 border-2 border-amber-200 p-4 mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <span className="font-bold text-text-primary">Award Winners</span>
              </div>
              <p className="text-sm text-text-secondary mt-1">
                Based on current voting and judging data. Final until results phase.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(awards).map(([key, award]) =>
                renderAwardCard(key, award, awardWinners[key])
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  return (
    <AppLayout
      user={user}
      teams={teams}
      onNavigate={onNavigate}
      eventPhase={eventPhase}
      activeNav="analytics"
    >
      <div className="p-4 sm:p-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-purple-500" />
            <h1 className="text-3xl font-black text-text-primary">VOTING ANALYTICS</h1>
          </div>
          <p className="text-text-secondary">
            Real-time voting data and judge scores.{' '}
            <span className="text-purple-600 font-medium">
              {user?.role === 'judge' ? 'Judge' : 'Admin'} View
            </span>
          </p>
        </div>

        {/* Stats */}
        {renderStats()}

        {/* Filter & Tabs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Tabs */}
          <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {[
              { id: 'leaderboard', label: 'Leaderboard', icon: TrendingUp },
              { id: 'peoples', label: "People's Vote", icon: Star },
              { id: 'judges', label: 'Judge Scores', icon: Award },
              { id: 'awards', label: 'Awards', icon: Trophy },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap
                    ${
                      activeTab === tab.id
                        ? 'bg-arena-elevated text-text-primary'
                        : 'bg-arena-card border-2 border-arena-border text-text-secondary hover:border-arena-border-strong'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </AppLayout>
  );
}

export default VotingAnalytics;

