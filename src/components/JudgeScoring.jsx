import { useState, useMemo } from 'react';
import {
  Gavel,
  CheckCircle2,
  Circle,
  ChevronRight,
  Save,
  Video,
  Github,
  Globe,
  Users,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { cn } from '../lib/design-system';
import AppLayout from './AppLayout';

// ============================================================================
// COMPONENT
// ============================================================================

function JudgeScoring({
  user,
  teams = [],
  onNavigate,
  onScore,
  judgeCriteria = [],
  eventPhase,
}) {
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [scores, setScores] = useState({});
  const [comments, setComments] = useState('');
  const [saveStatus, setSaveStatus] = useState(null); // 'saving' | 'saved' | 'error'

  // Get only submitted projects
  const submittedProjects = useMemo(() => {
    return teams.filter((team) => team.submission?.status === 'submitted');
  }, [teams]);

  // Get selected team
  const selectedTeam = useMemo(() => {
    return teams.find((t) => t.id === selectedTeamId);
  }, [teams, selectedTeamId]);

  // Check if user has already scored a team
  const hasScored = (teamId) => {
    const team = teams.find((t) => t.id === teamId);
    return team?.submission?.judgeScores?.some((s) => s.judgeId === user?.id);
  };

  // Get user's existing score for a team
  const getExistingScore = (teamId) => {
    const team = teams.find((t) => t.id === teamId);
    return team?.submission?.judgeScores?.find((s) => s.judgeId === user?.id);
  };

  // Calculate scoring progress
  const progress = useMemo(() => {
    const scored = submittedProjects.filter((t) => hasScored(t.id)).length;
    return {
      scored,
      total: submittedProjects.length,
      percentage: submittedProjects.length > 0
        ? Math.round((scored / submittedProjects.length) * 100)
        : 0,
    };
  }, [submittedProjects, user]);

  // Handle selecting a team to score
  const handleSelectTeam = (teamId) => {
    setSelectedTeamId(teamId);
    const existingScore = getExistingScore(teamId);
    if (existingScore) {
      setScores(existingScore.scores);
      setComments(existingScore.comments || '');
    } else {
      // Initialize with empty scores
      const initialScores = {};
      judgeCriteria.forEach((c) => {
        initialScores[c.id] = 0;
      });
      setScores(initialScores);
      setComments('');
    }
    setSaveStatus(null);
  };

  // Handle score change
  const handleScoreChange = (criterionId, value) => {
    setScores((prev) => ({
      ...prev,
      [criterionId]: Math.min(10, Math.max(0, parseInt(value) || 0)),
    }));
    setSaveStatus(null);
  };

  // Handle save
  const handleSave = () => {
    if (!selectedTeamId || !user) return;

    // Validate all scores are filled
    const allFilled = judgeCriteria.every((c) => scores[c.id] > 0);
    if (!allFilled) {
      setSaveStatus('error');
      return;
    }

    setSaveStatus('saving');
    
    // Call the onScore handler
    onScore(selectedTeamId, {
      scores,
      comments,
    });

    setTimeout(() => {
      setSaveStatus('saved');
    }, 500);
  };

  // Calculate total score
  const totalScore = useMemo(() => {
    return Object.values(scores).reduce((sum, val) => sum + val, 0);
  }, [scores]);

  const maxScore = judgeCriteria.length * 10;

  // ============================================================================
  // RENDER: PROJECT LIST ITEM
  // ============================================================================
  const renderProjectItem = (team) => {
    const scored = hasScored(team.id);
    const isSelected = selectedTeamId === team.id;

    return (
      <button
        key={team.id}
        type="button"
        onClick={() => handleSelectTeam(team.id)}
        className={`w-full text-left p-4 border-2 transition-all flex items-center gap-3
          ${isSelected ? 'border-purple-500 bg-brand-subtle' : 'border-arena-border hover:border-arena-border bg-arena-card'}`}
      >
        {/* Status indicator */}
        {scored ? (
          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
        ) : (
          <Circle className="w-5 h-5 text-arena-muted flex-shrink-0" />
        )}

        {/* Team icon */}
        <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg bg-arena-elevated">
          <Users className="w-4 h-4 text-text-secondary" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3
            className={`font-bold text-sm truncate ${scored ? 'text-text-secondary' : 'text-text-primary'}`}
          >
            {team.submission?.projectName || 'Untitled'}
          </h3>
          <p className="text-xs text-text-secondary truncate">{team.name}</p>
        </div>

        {/* Arrow */}
        <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-purple-500' : 'text-arena-muted'}`} />
      </button>
    );
  };

  // ============================================================================
  // RENDER: SCORING FORM
  // ============================================================================
  const renderScoringForm = () => {
    if (!selectedTeam) {
      return (
        <div className="flex items-center justify-center h-full text-arena-muted">
          <div className="text-center">
            <Gavel className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Select a project to score</p>
          </div>
        </div>
      );
    }

    const submission = selectedTeam.submission;

    return (
      <div className="h-full overflow-auto">
        {/* Project Header */}
        <div className="p-6 border-b-2 border-arena-border bg-arena-elevated">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-text-secondary" />
            <span
              className="text-sm font-bold uppercase tracking-wide"
              style={{ color: config.color }}
            >
              {selectedTeam.name}
            </span>
          </div>
          <h2
            className="text-2xl font-black text-text-primary mb-2"
          >
            {submission?.projectName || 'Untitled Project'}
          </h2>
          <p className="text-text-secondary">{submission?.description}</p>

          {/* Links */}
          <div className="flex flex-wrap gap-2 mt-4">
            {submission?.demoVideoUrl && (
              <a
                href={submission.demoVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-text-secondary bg-arena-card border border-arena-border hover:border-arena-border-strong transition-colors"
              >
                <Video className="w-3 h-3" />
                Watch Demo
              </a>
            )}
            {submission?.repoUrl && (
              <a
                href={submission.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-text-secondary bg-arena-card border border-arena-border hover:border-arena-border-strong transition-colors"
              >
                <Github className="w-3 h-3" />
                View Code
              </a>
            )}
            {submission?.liveDemoUrl && (
              <a
                href={submission.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-text-secondary bg-arena-card border border-arena-border hover:border-arena-border-strong transition-colors"
              >
                <Globe className="w-3 h-3" />
                Try Live
              </a>
            )}
          </div>

          {/* Team members */}
          <div className="flex items-center gap-2 mt-4 text-sm text-text-secondary">
            <Users className="w-4 h-4" />
            <span>{selectedTeam.members?.length || 0} members</span>
          </div>
        </div>

        {/* Scoring Section */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-text-primary">Score This Project</h3>
            <div className="text-right">
              <div className="text-2xl font-black text-purple-600">
                {totalScore}/{maxScore}
              </div>
              <div className="text-xs text-text-secondary">total score</div>
            </div>
          </div>

          {/* Criteria */}
          <div className="space-y-6">
            {judgeCriteria.map((criterion) => (
              <div key={criterion.id}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <label className="font-bold text-text-primary">{criterion.label}</label>
                    <p className="text-xs text-text-secondary">{criterion.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={scores[criterion.id] || 0}
                      onChange={(e) => handleScoreChange(criterion.id, e.target.value)}
                      className="w-16 text-center font-bold text-lg border-2 border-arena-border focus:border-purple-500 focus:outline-none py-1"
                    />
                    <span className="text-arena-muted text-sm">/10</span>
                  </div>
                </div>
                {/* Score slider */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleScoreChange(criterion.id, i + 1)}
                      className={`flex-1 h-3 transition-all ${
                        i < (scores[criterion.id] || 0)
                          ? 'bg-brand-subtle0'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Comments */}
          <div className="mt-8">
            <label className="flex items-center gap-2 font-bold text-text-primary mb-2">
              <MessageSquare className="w-4 h-4" />
              Comments (Optional)
            </label>
            <textarea
              value={comments}
              onChange={(e) => {
                setComments(e.target.value);
                setSaveStatus(null);
              }}
              placeholder="Add any notes or feedback for this project..."
              rows={3}
              className="w-full p-3 border-2 border-arena-border focus:border-purple-500 focus:outline-none text-sm resize-none"
            />
          </div>

          {/* Save Button */}
          <div className="mt-6 flex items-center gap-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className={`flex-1 py-3 font-bold text-text-primary flex items-center justify-center gap-2 transition-all
                ${saveStatus === 'saving' ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'}`}
            >
              {saveStatus === 'saving' ? (
                <>Saving...</>
              ) : saveStatus === 'saved' ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Score
                </>
              )}
            </button>
          </div>

          {/* Error message */}
          {saveStatus === 'error' && (
            <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              Please score all criteria before saving
            </div>
          )}

          {/* Already scored indicator */}
          {hasScored(selectedTeamId) && saveStatus !== 'saved' && (
            <div className="mt-3 flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              You've already scored this project. Saving will update your score.
            </div>
          )}
        </div>
      </div>
    );
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
      activeNav="judge-scoring"
    >
      <div className="p-4 sm:p-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Gavel className="w-8 h-8 text-amber-500" />
            <h1 className="text-3xl font-black text-text-primary">JUDGE SCORING</h1>
          </div>
          <p className="text-text-secondary">
            Score submitted projects on the judging criteria.{' '}
            <span className="text-amber-600 font-medium">Judge: {user?.name}</span>
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 p-4 bg-arena-card border-2 border-arena-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-text-secondary">Your Scoring Progress</span>
            <span className="text-sm font-bold text-purple-600">
              {progress.scored}/{progress.total} projects scored
            </span>
          </div>
          <div className="h-3 bg-gray-200 overflow-hidden">
            <div
              className="h-full bg-brand-subtle0 transition-all duration-500"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project List */}
          <div className="lg:col-span-1">
            <div className="bg-arena-card border-2 border-arena-border overflow-hidden">
              <div className="p-4 border-b border-arena-border bg-arena-elevated">
                <h2 className="font-bold text-text-primary">Projects to Score</h2>
                <p className="text-xs text-text-secondary mt-1">
                  {submittedProjects.length} submitted
                </p>
              </div>
              <div className="divide-y divide-gray-100 max-h-[600px] overflow-auto">
                {submittedProjects.length === 0 ? (
                  <div className="p-8 text-center text-arena-muted">
                    <p>No projects submitted yet</p>
                  </div>
                ) : (
                  submittedProjects.map(renderProjectItem)
                )}
              </div>
            </div>
          </div>

          {/* Scoring Form */}
          <div className="lg:col-span-2">
            <div className="bg-arena-card border-2 border-arena-border min-h-[600px]">
              {renderScoringForm()}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default JudgeScoring;

