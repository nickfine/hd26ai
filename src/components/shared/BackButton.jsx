import { ChevronLeft } from 'lucide-react';
import { Button } from '../ui';

/**
 * BackButton Component
 * Provides context-aware back navigation for deep views
 */
function BackButton({ 
  label = 'Back', 
  to = null, 
  onClick = null,
  className = '',
}) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      // If 'to' is provided, use it
      window.history.pushState({}, '', to);
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else {
      // Default: browser back
      window.history.back();
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      leftIcon={<ChevronLeft className="w-4 h-4" />}
      className={className}
    >
      {label}
    </Button>
  );
}

export default BackButton;
