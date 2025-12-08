/**
 * Tabs Component
 * A tabbed interface component with multiple styling variants.
 * 
 * @example
 * <Tabs defaultValue="tab1">
 *   <Tabs.List>
 *     <Tabs.Tab value="tab1">Tab 1</Tabs.Tab>
 *     <Tabs.Tab value="tab2">Tab 2</Tabs.Tab>
 *   </Tabs.List>
 *   <Tabs.Panel value="tab1">Content 1</Tabs.Panel>
 *   <Tabs.Panel value="tab2">Content 2</Tabs.Panel>
 * </Tabs>
 */

import { createContext, useContext, useState, useCallback } from 'react';
import { cn } from '../../lib/design-system';

// Context for sharing tab state
const TabsContext = createContext({
  activeTab: '',
  setActiveTab: () => {},
  variant: 'default',
});

/**
 * @typedef {Object} TabsProps
 * @property {string} [defaultValue] - Initially active tab
 * @property {string} [value] - Controlled active tab
 * @property {(value: string) => void} [onChange] - Callback when tab changes
 * @property {'default' | 'pills' | 'underline' | 'enclosed'} [variant='default']
 * @property {string} [className]
 * @property {React.ReactNode} children
 */

function Tabs({
  defaultValue,
  value,
  onChange,
  variant = 'default',
  className,
  children,
  ...props
}) {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  
  const activeTab = value !== undefined ? value : internalValue;
  
  const setActiveTab = useCallback((newValue) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  }, [value, onChange]);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, variant }}>
      <div className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

/**
 * Tabs.List - Container for tab buttons
 */
function TabsList({ className, children, ...props }) {
  const { variant } = useContext(TabsContext);

  const variantStyles = {
    default: 'border-b-2 border-neutral-200 gap-0',
    pills: 'bg-neutral-100 p-1 rounded-lg gap-1',
    underline: 'border-b border-neutral-200 gap-4',
    enclosed: 'border-b-2 border-neutral-200 gap-0',
  };

  return (
    <div
      role="tablist"
      className={cn(
        'flex',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

TabsList.displayName = 'Tabs.List';

/**
 * Tabs.Tab - Individual tab button
 */
function TabsTab({
  value,
  disabled = false,
  icon,
  count,
  className,
  children,
  ...props
}) {
  const { activeTab, setActiveTab, variant } = useContext(TabsContext);
  const isActive = activeTab === value;

  const baseStyles = 'flex items-center gap-2 font-bold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-500';

  const variantStyles = {
    default: cn(
      'px-4 py-2.5 text-sm border-b-2 -mb-[2px]',
      isActive
        ? 'border-neutral-900 text-neutral-900'
        : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300',
      disabled && 'opacity-50 cursor-not-allowed'
    ),
    pills: cn(
      'px-3 py-1.5 text-sm rounded-md',
      isActive
        ? 'bg-white text-neutral-900 shadow-sm'
        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50',
      disabled && 'opacity-50 cursor-not-allowed'
    ),
    underline: cn(
      'pb-2.5 text-sm border-b-2 -mb-[1px]',
      isActive
        ? 'border-neutral-900 text-neutral-900'
        : 'border-transparent text-neutral-500 hover:text-neutral-700',
      disabled && 'opacity-50 cursor-not-allowed'
    ),
    enclosed: cn(
      'px-4 py-2.5 text-sm border-2 border-b-0 -mb-[2px] rounded-t-lg',
      isActive
        ? 'border-neutral-200 border-b-white bg-white text-neutral-900'
        : 'border-transparent text-neutral-500 hover:text-neutral-700',
      disabled && 'opacity-50 cursor-not-allowed'
    ),
  };

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
      tabIndex={isActive ? 0 : -1}
      onClick={() => !disabled && setActiveTab(value)}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
      {count !== undefined && (
        <span className={cn(
          'px-1.5 py-0.5 text-xs rounded-full',
          isActive
            ? 'bg-neutral-900 text-white'
            : 'bg-neutral-200 text-neutral-600'
        )}>
          {count}
        </span>
      )}
    </button>
  );
}

TabsTab.displayName = 'Tabs.Tab';

/**
 * Tabs.Panel - Content panel for a tab
 */
function TabsPanel({ value, className, children, ...props }) {
  const { activeTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      tabIndex={0}
      className={cn('pt-4 animate-fade-in', className)}
      {...props}
    >
      {children}
    </div>
  );
}

TabsPanel.displayName = 'Tabs.Panel';

// Attach sub-components
Tabs.List = TabsList;
Tabs.Tab = TabsTab;
Tabs.Panel = TabsPanel;

// Export hook for accessing tab context
export const useTabs = () => useContext(TabsContext);

export default Tabs;



