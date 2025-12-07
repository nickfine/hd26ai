/**
 * UI Components Barrel Export
 * Import all primitive components from this single file
 * 
 * @example
 * import { Button, Card, Badge, Input } from '@/components/ui';
 */

// Button
export { default as Button, IconButton, ButtonGroup } from './Button';

// Card
export { default as Card, useCardContext } from './Card';

// Badge
export { 
  default as Badge, 
  SkillBadge, 
  AllegianceBadge, 
  StatusBadge, 
  RoleBadge, 
  CountBadge 
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
  ProgressSteps 
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

