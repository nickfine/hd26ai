/**
 * NavItem Component
 * Navigation item for sidebars and menus.
 * 
 * @example
 * <NavItem icon={<Home />} active>Dashboard</NavItem>
 * <NavItem icon={<Settings />} highlight="warning">Settings</NavItem>
 */

import { forwardRef } from 'react';
import { cn } from '../../lib/design-system';

/**
 * @typedef {Object} NavItemProps
 * @property {React.ReactNode} [icon]
 * @property {boolean} [active=false]
 * @property {'amber' | 'purple' | 'success' | 'error'} [highlight]
 * @property {number} [badge]
 * @property {boolean} [disabled=false]
 * @property {() => void} [onClick]
 * @property {string} [className]
 * @property {React.ReactNode} children
 */

const NavItem = forwardRef(({
  icon,
  active = false,
  highlight,
  badge,
  disabled = false,
  onClick,
  className,
  children,
  ...props
}, ref) => {
  const highlightStyles = {
    amber: 'text-amber-700 bg-amber-50 hover:bg-amber-100 border-l-4 border-amber-400',
    purple: 'text-special-700 bg-special-50 hover:bg-special-100 border-l-4 border-special-400',
    success: 'text-success-700 bg-success-50 hover:bg-success-100 border-l-4 border-success-400',
    error: 'text-error-700 bg-error-50 hover:bg-error-100 border-l-4 border-error-400',
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full px-3 py-2 flex items-center gap-3 text-sm font-bold transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-500',
        active
          ? 'bg-neutral-900 text-white'
          : highlight
            ? highlightStyles[highlight]
            : 'text-neutral-600 hover:bg-neutral-100',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {/* Icon */}
      {icon && (
        <span className="w-4 h-4 flex-shrink-0">
          {icon}
        </span>
      )}

      {/* Label */}
      <span className="flex-1 text-left truncate">
        {children}
      </span>

      {/* Badge */}
      {badge !== undefined && badge > 0 && (
        <span className={cn(
          'px-1.5 py-0.5 text-xs font-bold rounded-full min-w-[1.25rem] text-center',
          active
            ? 'bg-white text-neutral-900'
            : 'bg-error-500 text-white'
        )}>
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  );
});

NavItem.displayName = 'NavItem';

/**
 * NavGroup - Group of navigation items with optional label
 */
export const NavGroup = ({
  label,
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn('space-y-1', className)} {...props}>
      {label && (
        <div className="text-xs font-bold uppercase tracking-wide text-neutral-400 mb-3 px-3">
          {label}
        </div>
      )}
      {children}
    </div>
  );
};

NavGroup.displayName = 'NavGroup';

/**
 * NavDivider - Visual separator between nav items
 */
export const NavDivider = ({ className }) => {
  return (
    <div className={cn('my-4 border-t border-neutral-200', className)} />
  );
};

NavDivider.displayName = 'NavDivider';

export default NavItem;



