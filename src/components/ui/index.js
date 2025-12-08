/**
 * UI Components Barrel Export
 * Import all primitive components from this single file
 * 
 * @example
 * import { Button, Card, Badge, Input } from '@/components/ui';
 */

// Button
export { default as Button, IconButton, ButtonGroup, FillButton } from './Button';

// Card
export { default as Card, useCardContext } from './Card';

// Badge
export { 
  default as Badge, 
  SkillBadge, 
  AllegianceBadge, 
  StatusBadge, 
  RoleBadge, 
  CountBadge,
  LiveBadge 
} from './Badge';

// Input
export { 
  default as Input, 
  SearchInput, 
  TextArea, 
  FormField 
} from './Input';

// Avatar
export { 
  default as Avatar, 
  AvatarGroup, 
  AllegianceAvatar 
} from './Avatar';

// Progress
export { 
  default as Progress, 
  CircularProgress, 
  ProgressSteps,
  WarStatusBar 
} from './Progress';

// Modal
export { default as Modal, ConfirmModal } from './Modal';

// Tabs
export { default as Tabs, useTabs } from './Tabs';

// Select
export { default as Select, MultiSelect } from './Select';

// Alert
export { 
  default as Alert, 
  InlineAlert, 
  Toast, 
  Banner 
} from './Alert';

// Countdown
export { 
  default as Countdown, 
  CompactCountdown,
  MiniCountdown 
} from './Countdown';

// Allegiance Toggle
export { default as AllegianceToggle } from './AllegianceToggle';
