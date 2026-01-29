/**
 * MissionBrief Component
 * 
 * Unified hero component that consolidates:
 * - MotdBanner (phase/role messaging)
 * - ActiveIdeasWidget (stats hero)
 * - TeamFormationStatus (action CTAs)
 * 
 * Renders phase-aware, user-state-aware content with clear CTAs.
 */

import { memo, useMemo } from 'react';
import {
    Zap,
    Users,
    Lightbulb,
    Rocket,
    Trophy,
    Clock,
    ArrowRight,
} from 'lucide-react';
import Card from './Card';
import Button from './Button';
import { CompactCountdown } from './Countdown';
import { cn } from '../../lib/design-system';
import {
    computeUserState,
    getMissionContent,
    USER_STATES,
} from '../../lib/missionBriefContent';

/**
 * Get phase icon
 */
const getPhaseIcon = (phase) => {
    switch (phase) {
        case 'team_formation':
            return Users;
        case 'hacking':
            return Rocket;
        case 'submission':
            return Lightbulb;
        case 'voting':
        case 'judging':
        case 'results':
            return Trophy;
        default:
            return Zap;
    }
};

/**
 * Get phase gradient class
 */
const getPhaseGradient = (phase) => {
    switch (phase) {
        case 'team_formation':
            return 'gradient-cyan-blue';
        case 'hacking':
            return 'bg-brand';
        case 'submission':
            return 'gradient-orange';
        case 'voting':
        case 'judging':
            return 'gradient-purple';
        case 'results':
            return 'gradient-gold';
        default:
            return 'gradient-cyan-blue';
    }
};

/**
 * MissionBrief Component
 * 
 * @param {Object} props
 * @param {string} props.eventPhase - Current event phase
 * @param {Object} props.user - Current user object
 * @param {Object|null} props.userTeam - User's team object or null
 * @param {Object} props.stats - Aggregate stats (ideas, freeAgents, teams, submissions, etc.)
 * @param {boolean} props.hasPostedIdea - Whether user has posted an idea
 * @param {boolean} props.hasSubmitted - Whether team has submitted
 * @param {Date|string} props.phaseEndDate - When current phase ends (for countdown)
 * @param {Function} props.onNavigate - Navigation handler
 * @param {Function} props.onNavigateToTeam - Team navigation handler
 * @param {string} props.className - Additional CSS classes
 */
function MissionBrief({
    eventPhase = 'team_formation',
    user,
    userTeam,
    stats = {},
    hasPostedIdea = false,
    hasSubmitted = false,
    phaseEndDate,
    onNavigate,
    onNavigateToTeam,
    className,
}) {
    // Compute user state
    const userState = useMemo(() =>
        computeUserState({ userTeam, hasPostedIdea, hasSubmitted }),
        [userTeam, hasPostedIdea, hasSubmitted]
    );

    // Get content for current phase and user state
    const content = useMemo(() =>
        getMissionContent(eventPhase, userState),
        [eventPhase, userState]
    );

    // Build context object for dynamic content
    const contextObj = useMemo(() => ({
        teamName: userTeam?.name,
        memberCount: userTeam?.memberCount || (userTeam?.members?.length || 0) + 1,
        ideaTitle: userTeam?.ideaTitle || 'Your Idea',
        projectTitle: userTeam?.projectTitle || userTeam?.name || 'Your Project',
    }), [userTeam]);

    // Resolve dynamic content
    const resolvedStatus = typeof content.status === 'function'
        ? content.status(contextObj)
        : content.status;

    const resolvedContext = typeof content.context === 'function'
        ? content.context(stats)
        : content.context;

    // Handle CTA clicks
    const handlePrimaryCTA = () => {
        if (!content.primaryCTA || !onNavigate) return;

        if (content.primaryCTA.action === 'team' && userTeam?.id && onNavigateToTeam) {
            onNavigateToTeam(userTeam.id);
        } else {
            onNavigate(content.primaryCTA.action, content.primaryCTA.params);
        }
    };

    const handleSecondaryCTA = () => {
        if (!content.secondaryCTA || !onNavigate) return;

        if (content.secondaryCTA.action === 'team' && userTeam?.id && onNavigateToTeam) {
            onNavigateToTeam(userTeam.id);
        } else {
            onNavigate(content.secondaryCTA.action, content.secondaryCTA.params);
        }
    };

    const PhaseIcon = getPhaseIcon(eventPhase);
    const phaseGradient = getPhaseGradient(eventPhase);

    return (
        <Card
            variant="default"
            padding="lg"
            className={cn('relative overflow-hidden', className)}
        >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-gradient-to-br from-cyan-primary/10 to-transparent blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-gradient-to-tr from-brand/10 to-transparent blur-3xl pointer-events-none" />

            <div className="relative z-10">
                {/* Header: Phase icon + Headline */}
                <div className="flex items-center gap-3 mb-4">
                    <div className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center',
                        phaseGradient
                    )}>
                        <PhaseIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-cyan-primary">
                            Mission
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
                            {content.headline}
                        </h2>
                    </div>
                </div>

                {/* Status message */}
                <p className="text-lg text-text-primary font-medium mb-2">
                    {resolvedStatus}
                </p>

                {/* Supporting context */}
                <p className="text-base text-text-secondary mb-6">
                    {resolvedContext}
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3 mb-6">
                    {content.primaryCTA && (
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={handlePrimaryCTA}
                            rightIcon={<ArrowRight className="w-5 h-5" />}
                        >
                            {content.primaryCTA.label}
                        </Button>
                    )}
                    {content.secondaryCTA && (
                        <Button
                            variant="secondary"
                            size="lg"
                            onClick={handleSecondaryCTA}
                        >
                            {content.secondaryCTA.label}
                        </Button>
                    )}
                </div>

                {/* Footer: Countdown */}
                {content.footerPrefix && phaseEndDate && (
                    <div className="flex items-center gap-3 pt-4 border-t border-arena-border">
                        <Clock className="w-5 h-5 text-text-muted" />
                        <span className="text-sm text-text-secondary">
                            {content.footerPrefix}
                        </span>
                        <CompactCountdown targetDate={phaseEndDate} showDays />
                    </div>
                )}
            </div>
        </Card>
    );
}

export default memo(MissionBrief);
