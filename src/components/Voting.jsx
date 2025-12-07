import { useState, useMemo } from 'react';
import adaptLogo from '../../adaptlogo.png';
import {
  ArrowLeft,
  Heart,
  Cpu,
  Scale,
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
import { ALLEGIANCE_CONFIG } from '../data/mockData';

// ============================================================================
// CONSTANTS
// ============================================================================

const MAX_VOTES = 5;

const FILTER_OPTIONS = [
  { id: 'all', label: 'All Projects' },
  { id: 'human', label: 'Human Side', icon: Heart },
  { id: 'ai', label: 'AI Side', icon: Cpu },
];

// ============================================================================
// COMPONENT
// ============================================================================

function Voting({
  user,
  teams = [],
  allegianceStyle,
  onNavigate,
  userVotes = [],
  onVote,
}) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [filterSide, setFilterSide] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const AllegianceIcon = {
    human: Heart,
    neutral: Scale,
    ai: Cpu,
  }[user?.allegiance || 'neutral'];

  // Get only submitted projects
  const submittedProjects = useMemo(() => {
    return teams.filter((team) => team.submission?.status === 'submitted');
  }, [teams]);

  // Apply filters
  const filteredProjects = useMemo(() => {
    let result = submittedProjects;

    // Filter by side
    if (filterSide !== 'all') {
      result = result.filter((team) => team.side === filterSide);
    }

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
  }, [submittedProjects, filterSide, searchQuery]);

  // Vote tracking
  const votesUsed = userVotes.length;
  const votesRemaining = MAX_VOTES - votesUsed;
  const hasVotedFor = (teamId) => userVotes.includes(teamId);
  const canVote = votesRemaining > 0;

  // Handle vote toggle
  const handleVote = (teamId) => {
    if (onVote) {
      onVote(teamId);
    }
  };

  // ============================================================================
  // RENDER: PROJECT CARD (GRID VIEW)
  // ============================================================================
  const renderProjectCard = (team) => {
    const config = ALLEGIANCE_CONFIG[team.side] || ALLEGIANCE_CONFIG.neutral;
    const isVoted = hasVotedFor(team.id);
    const submission = team.submission;

    return (
      <div
        key={team.id}
        className={`group relative bg-white border-2 transition-all duration-300 hover:shadow-lg overflow-hidden
          ${team.side === 'ai' ? 'border-dashed' : ''} ${config.borderRadius}`}
        style={{ borderColor: config.borderColor }}
      >
        {/* Header with team info */}
        <div
          className="px-4 py-3 border-b"
          style={{ borderColor: config.borderColor, backgroundColor: config.bgColor }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {team.side === 'ai' ? (
                <Cpu className="w-4 h-4" style={{ color: config.color }} />
              ) : (
                <Heart className="w-4 h-4" style={{ color: config.color }} />
              )}
              <span
                className={`text-xs font-bold uppercase tracking-wide ${
                  team.side === 'ai' ? 'font-mono' : ''
                }`}
                style={{ color: config.color }}
              >
                {team.name}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Users className="w-3 h-3" />
              {team.members?.length || 0}
            </div>
          </div>
        </div>

        {/* Project content */}
        <div className="p-4">
          <h3
            className={`text-lg font-black text-gray-900 mb-2 line-clamp-1 ${
              team.side === 'ai' ? 'font-mono' : ''
            }`}
          >
            {submission?.projectName || 'Untitled Project'}
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {submission?.description || 'No description provided.'}
          </p>

          {/* Links */}
          <div className="flex flex-wrap gap-2 mb-4">
            {submission?.demoVideoUrl && (
              <a
                href={submission.demoVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Video className="w-3 h-3" />
                Demo
              </a>
            )}
            {submission?.repoUrl && (
              <a
                href={submission.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Github className="w-3 h-3" />
                Code
              </a>
            )}
            {submission?.liveDemoUrl && (
              <a
                href={submission.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
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
            onClick={() => handleVote(team.id)}
            disabled={!isVoted && !canVote}
            className={`w-full py-3 flex items-center justify-center gap-2 font-bold text-sm transition-all duration-300
              ${
                isVoted
                  ? 'bg-amber-400 text-amber-900 hover:bg-amber-500'
                  : canVote
                  ? 'border-2 border-gray-200 text-gray-600 hover:border-amber-400 hover:text-amber-600'
                  : 'border-2 border-gray-100 text-gray-300 cursor-not-allowed'
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
  };

  // ============================================================================
  // RENDER: PROJECT ROW (LIST VIEW)
  // ============================================================================
  const renderProjectRow = (team) => {
    const config = ALLEGIANCE_CONFIG[team.side] || ALLEGIANCE_CONFIG.neutral;
    const isVoted = hasVotedFor(team.id);
    const submission = team.submission;

    return (
      <div
        key={team.id}
        className={`group bg-white border-2 transition-all duration-200 hover:shadow-md
          ${team.side === 'ai' ? 'border-dashed' : ''}`}
        style={{ borderColor: isVoted ? 'rgb(251, 191, 36)' : config.borderColor }}
      >
        <div className="flex items-center gap-4 p-4">
          {/* Side indicator */}
          <div
            className={`w-12 h-12 flex-shrink-0 flex items-center justify-center ${config.borderRadius}`}
            style={{ backgroundColor: config.bgColor }}
          >
            {team.side === 'ai' ? (
              <Cpu className="w-6 h-6" style={{ color: config.color }} />
            ) : (
              <Heart className="w-6 h-6" style={{ color: config.color }} />
            )}
          </div>

          {/* Project info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3
                className={`text-base font-black text-gray-900 truncate ${
                  team.side === 'ai' ? 'font-mono' : ''
                }`}
              >
                {submission?.projectName || 'Untitled Project'}
              </h3>
              <span
                className={`text-xs font-bold px-2 py-0.5 ${
                  team.side === 'ai' ? 'font-mono' : ''
                }`}
                style={{ backgroundColor: config.bgColor, color: config.color }}
              >
                {team.name}
              </span>
            </div>
            <p className="text-sm text-gray-600 truncate">
              {submission?.description || 'No description provided.'}
            </p>
          </div>

          {/* Links */}
          <div className="hidden sm:flex items-center gap-2">
            {submission?.demoVideoUrl && (
              <a
                href={submission.demoVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Watch Demo"
              >
                <Video className="w-5 h-5" />
              </a>
            )}
            {submission?.repoUrl && (
              <a
                href={submission.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="View Code"
              >
                <Github className="w-5 h-5" />
              </a>
            )}
            {submission?.liveDemoUrl && (
              <a
                href={submission.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Try Live Demo"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            )}
          </div>

          {/* Vote button */}
          <button
            type="button"
            onClick={() => handleVote(team.id)}
            disabled={!isVoted && !canVote}
            className={`px-4 py-2 flex items-center gap-2 font-bold text-sm transition-all duration-300 flex-shrink-0
              ${
                isVoted
                  ? 'bg-amber-400 text-amber-900 hover:bg-amber-500'
                  : canVote
                  ? 'border-2 border-gray-200 text-gray-600 hover:border-amber-400 hover:text-amber-600'
                  : 'border-2 border-gray-100 text-gray-300 cursor-not-allowed'
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
  };

  // ============================================================================
  // RENDER: EMPTY STATE
  // ============================================================================
  const renderEmptyState = () => (
    <div className="text-center py-16">
      <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-300" />
      <h3 className="text-xl font-bold text-gray-900 mb-2">No Projects Found</h3>
      <p className="text-gray-600 max-w-md mx-auto">
        {searchQuery || filterSide !== 'all'
          ? 'Try adjusting your filters or search query.'
          : 'No projects have been submitted yet. Check back soon!'}
      </p>
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
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-8 h-8 text-amber-500" />
            <h1 className="text-3xl font-black text-gray-900">PROJECT GALLERY</h1>
          </div>
          <p className="text-gray-600">
            Browse all submitted projects and vote for your favorites. You have{' '}
            <strong>{MAX_VOTES} votes</strong> to cast.
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
            {Array.from({ length: MAX_VOTES }).map((_, i) => (
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
              {votesUsed}/{MAX_VOTES} used
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 focus:border-gray-900 focus:outline-none text-sm"
            />
          </div>

          {/* Side Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            {FILTER_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isActive = filterSide === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setFilterSide(option.id)}
                  className={`px-3 py-2 text-xs font-bold transition-all flex items-center gap-1
                    ${
                      isActive
                        ? 'bg-gray-900 text-white'
                        : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-gray-400'
                    }`}
                >
                  {Icon && <Icon className="w-3 h-3" />}
                  {option.label}
                </button>
              );
            })}
          </div>

          {/* View Toggle */}
          <div className="flex items-center border-2 border-gray-200 bg-white">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2.5 transition-colors ${
                viewMode === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Grid View"
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-2.5 transition-colors ${
                viewMode === 'list' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-600'
              }`}
              title="List View"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-gray-500">
          {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}{' '}
          {searchQuery || filterSide !== 'all' ? 'found' : 'submitted'}
        </div>

        {/* Projects Display */}
        {filteredProjects.length === 0 ? (
          renderEmptyState()
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(renderProjectCard)}
          </div>
        ) : (
          <div className="space-y-4">{filteredProjects.map(renderProjectRow)}</div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-4 sm:px-6 py-4 bg-white mt-8">
        <div className="max-w-6xl mx-auto text-center text-xs text-gray-400">
          HACKDAY 2026 — Vote for your favorite projects!
        </div>
      </footer>
    </div>
  );
}

export default Voting;

