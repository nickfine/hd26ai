/**
 * Mission Brief Content Definitions
 * 
 * Phase × UserState → { headline, status, context, primaryCTA, secondaryCTA, footer }
 * 
 * This is the single source of truth for all MissionBrief copy.
 */

/**
 * User state types for the state machine
 */
export const USER_STATES = {
  FREE_AGENT_NO_IDEA: 'free_agent_no_idea',
  FREE_AGENT_HAS_IDEA: 'free_agent_has_idea',
  ON_TEAM_NOT_FULL: 'on_team_not_full',
  ON_TEAM_FULL: 'on_team_full',
  SUBMITTED: 'submitted',
  NOT_SUBMITTED: 'not_submitted',
  NOT_REGISTERED: 'not_registered',
};

/**
 * Compute user state from props
 * @param {Object} params
 * @param {Object|null} params.userTeam - User's team object or null
 * @param {boolean} params.hasPostedIdea - Whether user has posted an idea
 * @param {boolean} params.hasSubmitted - Whether team has submitted
 * @returns {string} One of USER_STATES
 */
export function computeUserState({ userTeam, hasPostedIdea, hasSubmitted, isRegistered = true }) {
  if (!isRegistered) {
    return USER_STATES.NOT_REGISTERED;
  }

  if (!userTeam) {
    return hasPostedIdea ? USER_STATES.FREE_AGENT_HAS_IDEA : USER_STATES.FREE_AGENT_NO_IDEA;
  }

  const memberCount = userTeam.memberCount || (userTeam.members?.length || 0) + 1;
  const isFull = memberCount >= 6;

  if (hasSubmitted) {
    return USER_STATES.SUBMITTED;
  }

  return isFull ? USER_STATES.ON_TEAM_FULL : USER_STATES.ON_TEAM_NOT_FULL;
}

/**
 * Content for each phase × user state combination
 * 
 * Structure:
 * MISSION_CONTENT[phase][userState] = {
 *   headline: string,
 *   status: string | (context) => string,
 *   context: string | (stats) => string,
 *   primaryCTA: { label: string, action: string, params?: object },
 *   secondaryCTA?: { label: string, action: string, params?: object },
 *   footerPrefix: string, // e.g., "Team formation closes in"
 * }
 */
export const MISSION_CONTENT = {
  // ============================================================================
  // REGISTRATION PHASE
  // ============================================================================
  registration: {
    [USER_STATES.NOT_REGISTERED]: {
      headline: 'WELCOME TO HACKDAY 2026',
      status: "Join the ultimate hackathon experience!",
      context: () => "Register now to form teams, build innovative projects, and compete for amazing prizes",
      primaryCTA: { label: 'Register Now', action: 'signup' },
      secondaryCTA: { label: 'Learn More', action: 'new-to-hackday' },
      footerPrefix: 'Registration closes in',
    },
    [USER_STATES.FREE_AGENT_NO_IDEA]: {
      headline: 'REGISTRATION COMPLETE',
      status: "You're all set!",
      context: () => "Complete your profile and add your skills while you wait for team formation to begin",
      primaryCTA: { label: 'Edit Profile', action: 'profile' },
      secondaryCTA: { label: 'View Schedule', action: 'schedule' },
      footerPrefix: 'Team formation begins in',
    },
    [USER_STATES.FREE_AGENT_HAS_IDEA]: {
      headline: 'REGISTRATION COMPLETE',
      status: "You're all set!",
      context: () => "Your profile is ready. Team formation will begin soon!",
      primaryCTA: { label: 'View Schedule', action: 'schedule' },
      secondaryCTA: { label: 'Edit Profile', action: 'profile' },
      footerPrefix: 'Team formation begins in',
    },
  },

  // ============================================================================
  // TEAM FORMATION PHASE
  // ============================================================================
  team_formation: {
    [USER_STATES.NOT_REGISTERED]: {
      headline: 'JOIN THE HACKATHON',
      status: "Registration is open!",
      context: () => "Sign up to join a team or post your idea",
      primaryCTA: { label: 'Register Now', action: 'signup' },
      secondaryCTA: { label: 'Browse Ideas', action: 'marketplace', params: { tab: 'ideas' } },
      footerPrefix: 'Registration closes in',
    },
    [USER_STATES.FREE_AGENT_NO_IDEA]: {
      headline: 'FORM YOUR SQUAD',
      status: "You're currently a Free Agent",
      context: (stats) => `${stats.ideas || 0} ideas are looking for teammates`,
      primaryCTA: { label: 'Browse Ideas', action: 'marketplace', params: { tab: 'ideas' } },
      secondaryCTA: { label: 'Post Your Own Idea', action: 'marketplace', params: { tab: 'create' } },
      footerPrefix: 'Team formation closes in',
    },
    [USER_STATES.FREE_AGENT_HAS_IDEA]: {
      headline: 'FORM YOUR SQUAD',
      status: (ctx) => `Your idea: ${ctx.ideaTitle || 'Untitled'}`,
      context: (stats) => `${stats.freeAgents || 0} free agents looking for teams`,
      primaryCTA: { label: 'Manage Your Idea', action: 'marketplace', params: { tab: 'my-idea' } },
      secondaryCTA: { label: 'Browse Other Ideas', action: 'marketplace', params: { tab: 'ideas' } },
      footerPrefix: 'Team formation closes in',
    },
    [USER_STATES.ON_TEAM_NOT_FULL]: {
      headline: 'GROW YOUR SQUAD',
      status: (ctx) => `Team ${ctx.teamName || 'Unknown'} • ${ctx.memberCount || 0}/6 members`,
      context: (stats) => `${stats.freeAgents || 0} free agents available to recruit`,
      primaryCTA: { label: 'Recruit Members', action: 'marketplace', params: { tab: 'free-agents' } },
      secondaryCTA: { label: 'View Team', action: 'team' },
      footerPrefix: 'Team formation closes in',
    },
    [USER_STATES.ON_TEAM_FULL]: {
      headline: 'SQUAD READY',
      status: (ctx) => `Team ${ctx.teamName || 'Unknown'} • 6/6 members`,
      context: () => "You're all set for hacking!",
      primaryCTA: { label: 'View Team', action: 'team' },
      secondaryCTA: null,
      footerPrefix: 'Hacking begins in',
    },
  },

  // ============================================================================
  // HACKING PHASE
  // ============================================================================
  hacking: {
    [USER_STATES.NOT_REGISTERED]: {
      headline: 'HACKING IN PROGRESS',
      status: "You are spectating this event",
      context: (stats) => `${stats.teams || 0} teams are currently building`,
      primaryCTA: { label: 'View Teams', action: 'marketplace', params: { tab: 'teams' } },
      secondaryCTA: { label: 'View Schedule', action: 'schedule' },
      footerPrefix: 'Submissions due in',
    },
    [USER_STATES.ON_TEAM_NOT_FULL]: {
      headline: 'BUILD SOMETHING EPIC',
      status: (ctx) => `Team ${ctx.teamName || 'Unknown'} • Building`,
      context: (stats) => `${stats.hoursRemaining || 0} hours of hacking remaining`,
      primaryCTA: { label: 'Go to Submission', action: 'submission' },
      secondaryCTA: { label: 'View Team', action: 'team' },
      footerPrefix: 'Submissions due in',
    },
    [USER_STATES.ON_TEAM_FULL]: {
      headline: 'BUILD SOMETHING EPIC',
      status: (ctx) => `Team ${ctx.teamName || 'Unknown'} • Building`,
      context: (stats) => `${stats.hoursRemaining || 0} hours of hacking remaining`,
      primaryCTA: { label: 'Go to Submission', action: 'submission' },
      secondaryCTA: { label: 'View Team', action: 'team' },
      footerPrefix: 'Submissions due in',
    },
    [USER_STATES.FREE_AGENT_NO_IDEA]: {
      headline: 'HACKING IN PROGRESS',
      status: "You're a spectator this round",
      context: (stats) => `${stats.teams || 0} teams are building`,
      primaryCTA: { label: 'View Teams', action: 'marketplace', params: { tab: 'teams' } },
      secondaryCTA: null,
      footerPrefix: 'Submissions due in',
    },
    [USER_STATES.FREE_AGENT_HAS_IDEA]: {
      headline: 'HACKING IN PROGRESS',
      status: "You're a spectator this round",
      context: (stats) => `${stats.teams || 0} teams are building`,
      primaryCTA: { label: 'View Teams', action: 'marketplace', params: { tab: 'teams' } },
      secondaryCTA: null,
      footerPrefix: 'Submissions due in',
    },
  },

  // ============================================================================
  // SUBMISSION PHASE
  // ============================================================================
  submission: {
    [USER_STATES.NOT_REGISTERED]: {
      headline: 'SUBMISSIONS OPEN',
      status: "Watch the projects roll in",
      context: (stats) => `${stats.submissions || 0} teams have submitted projects`,
      primaryCTA: { label: 'View Submissions', action: 'voting' },
      secondaryCTA: null,
      footerPrefix: 'Voting opens in',
    },
    [USER_STATES.NOT_SUBMITTED]: {
      headline: 'SUBMIT YOUR PROJECT',
      status: (ctx) => `Team ${ctx.teamName || 'Unknown'} • Not yet submitted`,
      context: () => 'Time is running out!',
      primaryCTA: { label: 'Submit Now', action: 'submission' },
      secondaryCTA: null,
      footerPrefix: 'Submissions due in',
    },
    [USER_STATES.SUBMITTED]: {
      headline: "YOU'RE IN THE RUNNING",
      status: (ctx) => `Project: ${ctx.projectTitle || 'Your Project'} submitted`,
      context: (stats) => `${stats.submissions || 0} total submissions`,
      primaryCTA: { label: 'View Submissions', action: 'voting' },
      secondaryCTA: null,
      footerPrefix: 'Voting opens in',
    },
    // Fallbacks for free agents
    [USER_STATES.FREE_AGENT_NO_IDEA]: {
      headline: 'SUBMISSIONS OPEN',
      status: 'Watch the projects roll in',
      context: (stats) => `${stats.submissions || 0} submissions so far`,
      primaryCTA: { label: 'View Submissions', action: 'voting' },
      secondaryCTA: null,
      footerPrefix: 'Voting opens in',
    },
    [USER_STATES.FREE_AGENT_HAS_IDEA]: {
      headline: 'SUBMISSIONS OPEN',
      status: 'Watch the projects roll in',
      context: (stats) => `${stats.submissions || 0} submissions so far`,
      primaryCTA: { label: 'View Submissions', action: 'voting' },
      secondaryCTA: null,
      footerPrefix: 'Voting opens in',
    },
  },

  // ============================================================================
  // VOTING PHASE
  // ============================================================================
  voting: {
    [USER_STATES.NOT_REGISTERED]: {
      headline: 'VOTING IS LIVE',
      status: "Check out the submissions",
      context: (stats) => `${stats.submissions || 0} projects competing`,
      primaryCTA: { label: 'View Submissions', action: 'voting' },
      secondaryCTA: null,
      footerPrefix: 'Voting closes in',
    },
    [USER_STATES.SUBMITTED]: {
      headline: 'VOTING IS LIVE',
      status: (ctx) => `Your project: ${ctx.projectTitle || 'Submitted'}`,
      context: (stats) => `${stats.submissions || 0} projects competing`,
      primaryCTA: { label: 'Vote Now', action: 'voting' },
      secondaryCTA: { label: 'View Your Submission', action: 'submission' },
      footerPrefix: 'Voting closes in',
    },
    // Default for others
    [USER_STATES.FREE_AGENT_NO_IDEA]: {
      headline: 'VOTING IS LIVE',
      status: 'Cast your vote for the best projects',
      context: (stats) => `${stats.submissions || 0} projects to review`,
      primaryCTA: { label: 'Vote Now', action: 'voting' },
      secondaryCTA: null,
      footerPrefix: 'Voting closes in',
    },
  },

  // ============================================================================
  // JUDGING PHASE
  // ============================================================================
  judging: {
    [USER_STATES.NOT_REGISTERED]: {
      headline: 'JUDGING IN PROGRESS',
      status: "Judges are reviewing submissions",
      context: (stats) => `${stats.submissions || 0} projects under review`,
      primaryCTA: { label: 'View Submissions', action: 'voting' },
      secondaryCTA: null,
      footerPrefix: 'Results announced in',
    },
    [USER_STATES.SUBMITTED]: {
      headline: 'JUDGING IN PROGRESS',
      status: (ctx) => `Your project: ${ctx.projectTitle || 'Submitted'}`,
      context: () => 'The judges are reviewing all submissions',
      primaryCTA: { label: 'View Submissions', action: 'voting' },
      secondaryCTA: null,
      footerPrefix: 'Results announced in',
    },
    // Default
    [USER_STATES.FREE_AGENT_NO_IDEA]: {
      headline: 'JUDGING IN PROGRESS',
      status: 'Sit tight while judges evaluate',
      context: (stats) => `${stats.submissions || 0} projects under review`,
      primaryCTA: { label: 'View Submissions', action: 'voting' },
      secondaryCTA: null,
      footerPrefix: 'Results announced in',
    },
  },

  // ============================================================================
  // RESULTS PHASE
  // ============================================================================
  results: {
    [USER_STATES.NOT_REGISTERED]: {
      headline: 'RESULTS ARE IN',
      status: "The winners have been announced",
      context: () => "See who won HackDay 2026",
      primaryCTA: { label: 'View Results', action: 'results' },
      secondaryCTA: null,
      footerPrefix: '',
    },
    [USER_STATES.SUBMITTED]: {
      headline: 'RESULTS ARE IN',
      status: (ctx) => `Your project: ${ctx.projectTitle || 'Submitted'}`,
      context: () => 'Check out the final standings!',
      primaryCTA: { label: 'View Results', action: 'results' },
      secondaryCTA: null,
      footerPrefix: '',
    },
    // Default
    [USER_STATES.FREE_AGENT_NO_IDEA]: {
      headline: 'RESULTS ARE IN',
      status: 'Congratulations to all participants!',
      context: () => 'Check out the winning projects',
      primaryCTA: { label: 'View Results', action: 'results' },
      secondaryCTA: null,
      footerPrefix: '',
    },
  },
};

/**
 * Get content for a specific phase and user state
 * @param {string} phase - Current event phase
 * @param {string} userState - Computed user state
 * @returns {Object} Content object
 */
export function getMissionContent(phase, userState) {
  const phaseContent = MISSION_CONTENT[phase];
  if (!phaseContent) {
    // Fallback to registration-like content
    return {
      headline: 'WELCOME TO HACKDAY 2026',
      status: 'Get ready for an amazing experience',
      context: () => 'Check back soon for updates',
      primaryCTA: { label: 'View Schedule', action: 'schedule' },
      secondaryCTA: null,
      footerPrefix: '',
    };
  }

  // Try exact match, then fallbacks
  return phaseContent[userState] ||
    phaseContent[USER_STATES.FREE_AGENT_NO_IDEA] ||
    Object.values(phaseContent)[0];
}

export default MISSION_CONTENT;
