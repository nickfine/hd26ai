/**
 * PhaseIndicator Component
 * Enhanced event phase timeline with animations and visual hierarchy
 * 
 * Features:
 * - Animated connecting lines between phases
 * - Phase-specific icons
 * - Hover tooltips with descriptions
 * - Smooth transitions
 * - Responsive design (compact on mobile, full on desktop)
 */

import { memo, useState } from 'react';
import { 
  Users, 
  Code2, 
  Send, 
  Vote, 
  Gavel, 
  Trophy,
  Check
} from 'lucide-react';
import { cn } from '../../lib/design-system';

// Phase icons mapping
const PHASE_ICONS = {
  team_formation: Users,
  hacking: Code2,
  submission: Send,
  voting: Vote,
  judging: Gavel,
  results: Trophy,
};

// ECD: Removed per-phase colors - brand color only for active, neutral for all else

/**
 * Single phase step with icon, label, and state
 * ECD: Reduced visual weight - smaller circles, muted inactive states
 */
const PhaseStep = memo(({ 
  phase, 
  index, 
  isActive, 
  isComplete, 
  showTooltip = true,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = PHASE_ICONS[phase.id] || Users;
  
  return (
    <div 
      className="relative flex flex-col items-center group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Phase circle - ECD: reduced sizes, no scale transform */}
      <div 
        className={cn(
          'rounded-full flex items-center justify-center',
          'transition-all duration-300 relative z-10',
          // Size: reduced for subtlety
          isActive && !isComplete ? 'w-10 h-10' : 'w-8 h-8',
          // Complete state: solid brand
          isComplete && 'bg-brand border border-brand text-white',
          // Active state: prominent but not oversized (ECD: purposeful, not decorative)
          // animate-pulse-subtle adds mission control heartbeat - respects prefers-reduced-motion
          isActive && !isComplete && 'bg-brand/20 border-2 border-brand text-brand animate-pulse-subtle',
          // Inactive state: very subtle (ECD: restraint)
          !isActive && !isComplete && 'bg-arena-elevated/30 text-text-muted/40',
          onClick && 'cursor-pointer hover:scale-105'
        )}
      >
        {/* ECD: Icons only for active/complete, phase number for inactive */}
        {isComplete ? (
          <Check className="w-4 h-4" strokeWidth={3} />
        ) : isActive ? (
          <Icon className="w-5 h-5" />
        ) : (
          <span className="text-xs font-medium">{index + 1}</span>
        )}
      </div>
      
      {/* Phase label - ECD: hierarchy through weight and opacity */}
      <span className={cn(
        'mt-2 text-xs text-center whitespace-nowrap',
        'transition-all duration-200',
        isActive && 'text-brand font-bold text-sm',
        isComplete && 'text-text-primary font-medium',
        !isActive && !isComplete && 'text-text-muted/40 font-normal'
      )}>
        {phase.label}
      </span>
      
      {/* Tooltip on hover */}
      {showTooltip && phase.description && (
        <div className={cn(
          'absolute -bottom-16 left-1/2 -translate-x-1/2',
          'px-3 py-2 rounded-lg shadow-lg',
          'bg-arena-elevated border border-arena-border',
          'text-xs text-text-secondary whitespace-nowrap',
          'transition-all duration-200 pointer-events-none z-20',
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        )}>
          {phase.description}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-arena-elevated border-l border-t border-arena-border rotate-45" />
        </div>
      )}
    </div>
  );
});

PhaseStep.displayName = 'PhaseStep';

/**
 * Connecting line between phases
 * ECD: Thinner lines (1px), reduced spacing for subtlety
 */
const ConnectingLine = memo(({ isComplete }) => (
  <div className="flex-1 h-px mx-2 sm:mx-3 min-w-[24px] sm:min-w-[32px] relative overflow-hidden">
    {/* Base line - ECD: simple, no competing animations */}
    <div className={cn(
      'absolute inset-0 transition-colors duration-500',
      isComplete ? 'bg-brand' : 'bg-arena-border/50'
    )} />
  </div>
));

ConnectingLine.displayName = 'ConnectingLine';

/**
 * Main PhaseIndicator component
 */
const PhaseIndicator = memo(({ 
  phases,
  currentPhase,
  onPhaseClick,
  className,
  compact = false 
}) => {
  const phaseKeys = Object.keys(phases);
  const currentIndex = phaseKeys.indexOf(currentPhase);
  
  if (compact) {
    // Compact mobile view - just current phase with progress dots
    const currentPhaseData = phases[currentPhase];
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <div className="flex gap-1">
          {phaseKeys.map((key, index) => (
            <div 
              key={key}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-300',
                index < currentIndex && 'bg-brand',
                index === currentIndex && 'bg-brand animate-pulse w-4',
                index > currentIndex && 'bg-arena-border'
              )}
            />
          ))}
        </div>
        <span className="text-sm font-medium text-text-primary">
          {currentPhaseData?.label}
        </span>
      </div>
    );
  }
  
  // Full desktop view - ECD: generous spacing, even distribution
  return (
    <div className={cn('flex items-start justify-between w-full max-w-4xl mx-auto', className)}>
      {phaseKeys.map((phaseKey, index) => {
        const phase = phases[phaseKey];
        const isActive = index === currentIndex;
        const isComplete = index < currentIndex;
        
        return (
          <div key={phaseKey} className="flex items-center">
            <PhaseStep
              phase={phase}
              index={index}
              isActive={isActive}
              isComplete={isComplete}
              onClick={onPhaseClick ? () => onPhaseClick(phaseKey) : undefined}
            />
            
            {/* Connecting line (except after last phase) */}
            {index < phaseKeys.length - 1 && (
              <ConnectingLine isComplete={isComplete} />
            )}
          </div>
        );
      })}
    </div>
  );
});

PhaseIndicator.displayName = 'PhaseIndicator';

export default PhaseIndicator;
export { PhaseStep, ConnectingLine };
