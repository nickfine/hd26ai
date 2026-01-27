/**
 * Card Component
 * A flexible container component with multiple variants and optional header/footer slots.
 * 
 * @example
 * <Card variant="outlined">Content here</Card>
 * <Card variant="elevated" padding="lg">Card content</Card>
 * <Card>
 *   <Card.Header>Title</Card.Header>
 *   <Card.Body>Content</Card.Body>
 *   <Card.Footer>Actions</Card.Footer>
 * </Card>
 */

import { forwardRef, createContext, useContext } from 'react';
import { cn, CARD_VARIANTS } from '../../lib/design-system';

// Context for sharing card variant with children
const CardContext = createContext({ variant: 'default' });

/**
 * @typedef {Object} CardProps
 * @property {'default' | 'outlined' | 'elevated' | 'ghost'} [variant='default']
 * @property {'none' | 'sm' | 'md' | 'lg'} [padding='md']
 * @property {boolean} [hoverable=false]
 * @property {boolean} [clickable=false]
 * @property {boolean} [glowOnHover=false] - Enable team-colored glow on hover
 * @property {string} [className]
 * @property {React.ReactNode} children
 */

const PADDING_MAP = {
  none: '',
  sm: 'p-4',
  md: 'p-5 sm:p-6',           // 24px default
  lg: 'p-6 sm:p-10',          // 40px for premium breathing room
};

const Card = forwardRef(({
  variant = 'default',
  padding = 'md',
  hoverable = false,
  clickable = false,
  glowOnHover = false,
  as: Component = 'div',
  className,
  children,
  ...props
}, ref) => {
  const variantStyles = CARD_VARIANTS[variant] || CARD_VARIANTS.default;
  const paddingStyles = PADDING_MAP[padding];

  // Determine hover class
  const getHoverClass = () => {
    if (!glowOnHover && !hoverable && !clickable) return '';
    return 'hover:shadow-card-hover hover:-translate-y-0.5';
  };

  return (
    <CardContext.Provider value={{ variant }}>
      <Component
        ref={ref}
        className={cn(
          // Base styles
          'transition-all duration-200',
          // Variant
          variantStyles,
          // Padding
          paddingStyles,
          // Interactive states
          (hoverable || clickable || glowOnHover) && getHoverClass(),
          clickable && 'cursor-pointer active:scale-[0.99]',
          // Custom
          className
        )}
        {...props}
      >
        {children}
      </Component>
    </CardContext.Provider>
  );
});

Card.displayName = 'Card';

/**
 * Card.Header - Header section of the card
 */
const CardHeader = forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'border-b border-arena-border pb-3 mb-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

CardHeader.displayName = 'Card.Header';

/**
 * Card.Title - Title within the card header or body
 */
const CardTitle = forwardRef(({
  as: Component = 'h3',
  className,
  children,
  ...props
}, ref) => {
  return (
    <Component
      ref={ref}
      className={cn(
        'text-lg font-bold text-text-primary font-heading',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
});

CardTitle.displayName = 'Card.Title';

/**
 * Card.Subtitle - Subtitle/description text
 */
const CardSubtitle = forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <p
      ref={ref}
      className={cn(
        'text-sm text-text-secondary mt-1',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
});

CardSubtitle.displayName = 'Card.Subtitle';

/**
 * Card.Body - Main content area of the card
 */
const CardBody = forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardBody.displayName = 'Card.Body';

/**
 * Card.Footer - Footer section of the card
 */
const CardFooter = forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'border-t border-arena-border pt-3 mt-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = 'Card.Footer';

/**
 * Card.Label - Small label text (e.g., category, type)
 */
const CardLabel = forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'text-xs font-bold uppercase tracking-wide text-text-muted mb-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

CardLabel.displayName = 'Card.Label';

// Attach sub-components to Card
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Label = CardLabel;

// Hook to access card context
export const useCardContext = () => useContext(CardContext);

export default Card;
