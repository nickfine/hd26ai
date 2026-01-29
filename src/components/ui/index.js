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
  StatusBadge,
  RoleBadge,
  CountBadge,
  LiveBadge,
  // New capsule badge system
  HeartbeatDot,
  StatusDot,
  UserCapsule,
  SkillChip,
  StatusCapsule,
  CallsignBadge,
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
  AvatarGroup
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

// Countdown
export {
  default as Countdown,
  CompactCountdown,
  MiniCountdown
} from './Countdown';

// StatCard
export {
  default as StatCard,
  StatCardGroup,
  HeroStatCard,
  MiniStatCard,
  HeroStatGrid,
  FigmaMetricsCard,
} from './StatCard';// LiveActivityFeed
export {
  default as LiveActivityFeed,
  LivePulse
} from './LiveActivityFeed';// Skeleton (loading placeholders)
export {
  default as Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonStatCard,
  SkeletonTable,
  SkeletonList,
  DashboardSkeleton,
  MarketplaceSkeleton,
  ProfileSkeleton,
} from './Skeleton';

// Loading State
export {
  default as LoadingState,
  LoadingOverlay,
  LoadingButton,
} from './LoadingState';// Error State
export {
  default as ErrorState,
  ErrorBanner,
  EmptyState,
} from './ErrorState';

// Phase Indicator (event timeline)
export {
  default as PhaseIndicator,
  PhaseStep,
  ConnectingLine,
} from './PhaseIndicator';

// MissionBrief (unified hero component)
export { default as MissionBrief } from './MissionBrief';