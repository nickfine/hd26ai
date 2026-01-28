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
  UserPlus, 
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
  registration: UserPlus,
  team_formation: Users,
  hacking: Code2,
  submission: Send,
  voting: Vote,
  judging: Gavel,
  results: Trophy,
};

// Phase colors for active state
const PHASE_COLORS = {
  registration: 'text-blue-400',
  team_formation: 'text-emerald-400',
  hacking: 'text-purple-400',
  submission: 'text-orange-400',
  voting: 'text-pink-400',
  judging: 'text-amber-400',
  results: 'text-brand',
};

/**
 * Single phase step with icon, label, and state
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
  const Icon = PHASE_ICONS[phase.id] || UserPlus;
  
  return (
    <div 
      className="relative flex flex-col items-center group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Phase circle with icon */}
      <div 
        className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center',
          'border-2 transition-all duration-300',
          'relative z-10',
          isComplete && 'bg-brand border-brand text-white',
          isActive && !isComplete && 'bg-brand/20 border-brand text-brand animate-pulse',
          !isActive && !isComplete && 'bg-arena-elevated border-arena-border text-text-muted',
          onClick && 'cursor-pointer hover:scale-110'
        )}
      >
        {isComplete ? (
          <Check className="w-5 h-5" strokeWidth={3} />
        ) : (
          <Icon className={cn(
            'w-5 h-5',
            isActive && PHASE_COLORS[phase.id]
          )} />
        )}
      </div>
      
      {/* Phase label */}
      <span className={cn(
        'mt-2 text-xs font-medium text-center whitespace-nowrap',
        'transition-colors duration-200',
        isActive ? 'text-brand font-bold' : isComplete ? 'text-text-primary' : 'text-text-muted'
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
 * Connecting line between phases with animation
 */
const ConnectingLine = memo(({ isComplete, isActive, isAnimating }) => (
  <div className="flex-1 h-0.5 mx-1 relative overflow-hidden">
    {/* Base line */}
    <div className={cn(
      'absolute inset-0 transition-colors duration-500',
      isComplete ? 'bg-brand' : 'bg-arena-border'
    )} />
    
    {/* Animated gradient for active transition */}
    {isAnimating && (
      <div 
        className="absolute inset-0 bg-gradient-to-r from-brand via-brand/50 to-transparent"
        style={{
          animation: 'shimmer 1.5s infinite',
        }}
      />
    )}
    
    {/* Pulse dot for active phase */}
    {isActive && !isComplete && (
      <div 
        className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand"
        style={{
          animation: 'pulse-dot 1.5s infinite',
        }}
      />
    )}
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
  
  // Full desktop view
  return (
    <div className={cn('flex items-start justify-center gap-0', className)}>
      {phaseKeys.map((phaseKey, index) => {
        const phase = phases[phaseKey];
        const isActive = index === currentIndex;
        const isComplete = index < currentIndex;
        const isAnimating = index === currentIndex - 1; // Line leading to current
        
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
              <ConnectingLine 
                isComplete={isComplete}
                isActive={isActive}
                isAnimating={isAnimating}
              />
            )}
          </div>
        );
      })}
      
      {/* CSS for animations */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: translateY(-50%) scale(1); }
          50% { opacity: 0.5; transform: translateY(-50%) scale(1.5); }
        }
      `}</style>
    </div>
  );
});

PhaseIndicator.displayName = 'PhaseIndicator';

export default PhaseIndicator;
export { PhaseStep, ConnectingLine };
