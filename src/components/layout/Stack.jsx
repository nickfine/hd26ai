/**
 * Stack Component
 * A flex container for stacking elements vertically or horizontally with consistent spacing.
 * 
 * @example
 * <Stack gap="4">
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 * </Stack>
 * 
 * <Stack direction="horizontal" gap="2" align="center">
 *   <Button>Action</Button>
 *   <Button variant="secondary">Cancel</Button>
 * </Stack>
 */

import { forwardRef } from 'react';
import { cn } from '../../lib/design-system';

/**
 * @typedef {Object} StackProps
 * @property {'vertical' | 'horizontal'} [direction='vertical']
 * @property {'0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12'} [gap='4']
 * @property {'start' | 'center' | 'end' | 'stretch' | 'baseline'} [align='stretch']
 * @property {'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'} [justify='start']
 * @property {boolean} [wrap=false]
 * @property {boolean} [dividers=false]
 * @property {string} [className]
 * @property {React.ReactNode} children
 */

const GAP_MAP = {
  '0': 'gap-0',
  '1': 'gap-1',
  '2': 'gap-2',
  '3': 'gap-3',
  '4': 'gap-4',
  '5': 'gap-5',
  '6': 'gap-6',
  '8': 'gap-8',
  '10': 'gap-10',
  '12': 'gap-12',
};

const ALIGN_MAP = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const JUSTIFY_MAP = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

const Stack = forwardRef(({
  direction = 'vertical',
  gap = '4',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  dividers = false,
  as: Component = 'div',
  className,
  children,
  ...props
}, ref) => {
  const isHorizontal = direction === 'horizontal';

  return (
    <Component
      ref={ref}
      className={cn(
        'flex',
        isHorizontal ? 'flex-row' : 'flex-col',
        GAP_MAP[gap],
        ALIGN_MAP[align],
        JUSTIFY_MAP[justify],
        wrap && 'flex-wrap',
        dividers && (isHorizontal ? 'divide-x divide-neutral-200' : 'divide-y divide-neutral-200'),
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
});

Stack.displayName = 'Stack';

/**
 * HStack - Horizontal stack (shorthand for Stack direction="horizontal")
 */
export const HStack = forwardRef(({
  gap = '4',
  align = 'center',
  justify = 'start',
  wrap = false,
  className,
  children,
  ...props
}, ref) => {
  return (
    <Stack
      ref={ref}
      direction="horizontal"
      gap={gap}
      align={align}
      justify={justify}
      wrap={wrap}
      className={className}
      {...props}
    >
      {children}
    </Stack>
  );
});

HStack.displayName = 'HStack';

/**
 * VStack - Vertical stack (shorthand for Stack direction="vertical")
 */
export const VStack = forwardRef(({
  gap = '4',
  align = 'stretch',
  justify = 'start',
  className,
  children,
  ...props
}, ref) => {
  return (
    <Stack
      ref={ref}
      direction="vertical"
      gap={gap}
      align={align}
      justify={justify}
      className={className}
      {...props}
    >
      {children}
    </Stack>
  );
});

VStack.displayName = 'VStack';

/**
 * Spacer - Flexible space element for pushing items apart
 */
export const Spacer = ({ className }) => {
  return <div className={cn('flex-1', className)} />;
};

Spacer.displayName = 'Spacer';

export default Stack;



