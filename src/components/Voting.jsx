import { useState, useMemo, memo, useCallback } from 'react';
import {
  Star,
  Search,
  Grid3X3,
  List,
  Video,
  Github,
  Globe,
  ExternalLink,
  Sparkles,
  Users,
  Filter,
} from 'lucide-react';
import { cn } from '../lib/design-system';
import { isValidUrl } from '../lib/constants';
import AppLayout from './AppLayout';

// ============================================================================
// CONSTANTS
// ============================================================================

// MAX_VOTES will be passed as prop from App.jsx based on event settings

// ============================================================================
// MEMOIZED PROJECT CARD COMPONENT
// ============================================================================

const ProjectCard = memo(function ProjectCard({ team, isVoted, canVote, onVote }) {
  const submission = team.submission;

  return (
    <div className="group relative bg-arena-card border-2 border-arena-border transition-all duration-300 hover:shadow-lg overflow-hidden rounded-lg">
      {/* Header with team info */}
      <div className="px-4 py-3 border-b border-arena-border bg-arena-elevated">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-text-secondary" />
            <span className="text-xs font-bold uppercase tracking-wide text-text-primary">
              {team.name}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-text-secondary">
            <Users className="w-3 h-3" />
            {team.members?.length || 0}
          </div>
        </div>
      </div>

      {/* Project content */}
      <div className="p-4">
        <h3 className="text-lg font-black text-text-primary mb-2 line-clamp-1">
          {submission?.projectName || 'Untitled Project'}
        </h3>
        <p className="text-sm text-text-secondary mb-4 line-clamp-3">
          {submission?.description || 'No description provided.'}
        </p>

        {/* Links */}
        <div className="flex flex-wrap gap-2 mb-4">
          {isValidUrl(submission?.demoVideoUrl) && (
            <a
              href={submission.demoVideoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold text-text-secondary bg-arena-elevated hover:bg-gray-200 transition-colors"
            >
              <Video className="w-3 h-3" />
              Demo
            </a>
          )}
          {isValidUrl(submission?.repoUrl) && (
            <a
              href={submission.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold text-text-secondary bg-arena-elevated hover:bg-gray-200 transition-colors"
            >
              <Github className="w-3 h-3" />
              Code
            </a>
          )}
          {isValidUrl(submission?.liveDemoUrl) && (
            <a
              href={submission.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold text-text-secondary bg-arena-elevated hover:bg-gray-200 transition-colors"
            >
              <Globe className="w-3 h-3" />
              Live
            </a>
          )}
        </div>
      </div>

      {/* Vote button */}
      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={() => onVote(team.id)}
          disabled={!isVoted && !canVote}
          className={`w-full py-3 flex items-center justify-center gap-2 font-bold text-sm transition-all duration-300
            ${
              isVoted
                ? 'bg-amber-400 text-amber-900 hover:bg-amber-500'
                : canVote
                ? 'border-2 border-arena-border text-text-secondary hover:border-amber-400 hover:text-amber-600'
                : 'border-2 border-arena-border text-arena-muted cursor-not-allowed'
            }`}
        >
          <Star
            className={`w-5 h-5 transition-transform duration-300 ${
              isVoted ? 'fill-amber-900 scale-110' : ''
            }`}
          />
          {isVoted ? 'Voted!' : 'Vote for this project'}
        </button>
      </div>

      {/* Voted indicator */}
      {isVoted && (
        <div className="absolute top-3 right-3">
          <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center animate-pulse">
            <Star className="w-4 h-4 fill-amber-900 text-amber-900" />
          </div>
        </div>
      )}
    </div>
  );
});

// ============================================================================
// MEMOIZED PROJECT ROW COMPONENT
// ============================================================================

const ProjectRow = memo(function ProjectRow({ team, isVoted, canVote, onVote }) {
  const submission = team.submission;

  return (
    <div
      className={`group bg-arena-card border-2 border-arena-border transition-all duration-200 hover:shadow-md`}
      style={{ borderColor: isVoted ? 'rgb(251, 191, 36)' : undefined }}
    >
      <div className="flex items-center gap-4 p-4">
        {/* Team indicator */}
        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg bg-arena-elevated">
          <Users className="w-6 h-6 text-text-secondary" />
        </div>

        {/* Project info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-black text-text-primary truncate">
              {submission?.projectName || 'Untitled Project'}
            </h3>
            <span className="text-xs font-bold px-2 py-0.5 bg-arena-elevated text-text-primary rounded">
              {team.name}
            </span>
          </div>
          <p className="text-sm text-text-secondary truncate">
            {submission?.description || 'No description provided.'}
          </p>
        </div>

        {/* Links */}
        <div className="hidden sm:flex items-center gap-2">
          {isValidUrl(submission?.demoVideoUrl) && (
            <a
              href={submission.demoVideoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-arena-muted hover:text-text-secondary transition-colors"
              title="Watch Demo"
            >
              <Video className="w-5 h-5" />
            </a>
          )}
          {isValidUrl(submission?.repoUrl) && (
            <a
              href={submission.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-arena-muted hover:text-text-secondary transition-colors"
              title="View Code"
            >
              <Github className="w-5 h-5" />
            </a>
          )}
          {isValidUrl(submission?.liveDemoUrl) && (
            <a
              href={submission.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-arena-muted hover:text-text-secondary transition-colors"
              title="Try Live Demo"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
        </div>

        {/* Vote button */}
        <button
          type="button"
          onClick={() => onVote(team.id)}
          disabled={!isVoted && !canVote}
          className={`px-4 py-2 flex items-center gap-2 font-bold text-sm transition-all duration-300 flex-shrink-0
            ${
              isVoted
                ? 'bg-amber-400 text-amber-900 hover:bg-amber-500'
                : canVote
                ? 'border-2 border-arena-border text-text-secondary hover:border-amber-400 hover:text-amber-600'
                : 'border-2 border-arena-border text-arena-muted cursor-not-allowed'
            }`}
        >
          <Star
            className={`w-4 h-4 transition-transform duration-300 ${
              isVoted ? 'fill-amber-900' : ''
            }`}
          />
          {isVoted ? 'Voted' : 'Vote'}
        </button>
      </div>
    </div>
  );
});

// ============================================================================
// COMPONENT
// ============================================================================

function Voting({
  user,
  teams = [],
  onNavigate,
  userVotes = [],
  onVote,
  permissions = {}, // eslint-disable-line no-unused-vars -- Reserved for future permission-based features
  eventPhase,
  maxVotes = 5,
}) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [filterSide, setFilterSide] = useState('all'); // Keep for compatibility but don't use
  const [searchQuery, setSearchQuery] = useState('');

  // Get only submitted projects
  const submittedProjects = useMemo(() => {
    return teams.filter((team) => team.submission?.status === 'submitted');
  }, [teams]);

  // Apply filters
  const filteredProjects = useMemo(() => {
    let result = submittedProjects;

    // No side filtering

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (team) =>
          team.submission?.projectName?.toLowerCase().includes(query) ||
          team.name?.toLowerCase().includes(query) ||
          team.submission?.description?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [submittedProjects, searchQuery]);

  // Vote tracking
  const votesUsed = userVotes.length;
  const votesRemaining = maxVotes - votesUsed;
  const hasVotedFor = (teamId) => userVotes.includes(teamId);
  const canVote = votesRemaining > 0;

  // Handle vote toggle
  const handleVote = useCallback((teamId) => {
    if (onVote) {
      onVote(teamId);
    }
  }, [onVote]);

  // ============================================================================
  // RENDER: EMPTY STATE
  // ============================================================================
  const renderEmptyState = () => (
    <div className="text-center py-16">
      <Sparkles className="w-16 h-16 mx-auto mb-4 text-arena-muted" />
      <h3 className="text-xl font-bold text-text-primary mb-2">No Projects Found</h3>
      <p className="text-text-secondary max-w-md mx-auto">
        {searchQuery
          ? 'Try adjusting your filters or search query.'
          : 'No projects have been submitted yet. Check back soon!'}
      </p>
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
      activeNav="voting"
    >
      <div className="p-4 sm:p-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-8 h-8 text-amber-500" />
            <h1 className="text-3xl font-black text-text-primary">PROJECT GALLERY</h1>
          </div>
          <p className="text-text-secondary">
            Browse all submitted projects and vote for your favorites. You have{' '}
            <strong>{maxVotes} votes</strong> to cast.
          </p>
        </div>

        {/* Vote Budget Card */}
        <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-200 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 fill-amber-900 text-amber-900" />
            </div>
            <div>
              <div className="text-sm font-bold text-amber-900">Your Voting Power</div>
              <div className="text-xs text-amber-700">
                Cast your votes wisely — they cannot be changed!
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {Array.from({ length: maxVotes }).map((_, i) => (
              <Star
                key={i}
                className={`w-6 h-6 transition-all duration-300 ${
                  i < votesUsed
                    ? 'fill-amber-400 text-amber-400 scale-110'
                    : 'text-amber-200'
                }`}
              />
            ))}
            <span className="ml-2 text-sm font-bold text-amber-900">
              {votesUsed}/{maxVotes} used
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-arena-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-3 border-2 border-arena-border focus:border-arena-border focus:outline-none text-sm"
            />
          </div>


          {/* View Toggle */}
          <div className="flex items-center border-2 border-arena-border bg-arena-card">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2.5 transition-colors ${
                viewMode === 'grid' ? 'bg-arena-elevated text-text-primary' : 'text-arena-muted hover:text-text-secondary'
              }`}
              title="Grid View"
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-2.5 transition-colors ${
                viewMode === 'list' ? 'bg-arena-elevated text-text-primary' : 'text-arena-muted hover:text-text-secondary'
              }`}
              title="List View"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-text-secondary">
          {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}{' '}
          {searchQuery ? 'found' : 'submitted'}
        </div>

        {/* Projects Display */}
        {filteredProjects.length === 0 ? (
          renderEmptyState()
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((team) => (
              <ProjectCard
                key={team.id}
                team={team}
                isVoted={hasVotedFor(team.id)}
                canVote={canVote}
                onVote={handleVote}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map((team) => (
              <ProjectRow
                key={team.id}
                team={team}
                isVoted={hasVotedFor(team.id)}
                canVote={canVote}
                onVote={handleVote}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default memo(Voting);

