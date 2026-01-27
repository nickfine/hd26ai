/**
 * Design System Test Page
 * 
 * Purpose:
 * 1. Visual regression test - screenshot before/after token changes
 * 2. Token documentation - living reference for developers
 * 3. Dark mode verification - toggle to confirm all tokens flip correctly
 * 
 * Usage: Navigate to 'design-system' view in the app
 */

import { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Monitor,
  Check, 
  X, 
  AlertTriangle, 
  Info,
  ChevronRight,
  Loader2,
  User
} from 'lucide-react';
import Button, { IconButton, FillButton } from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge, { SkillBadge, StatusBadge, RoleBadge } from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Alert, { InlineAlert } from '../components/ui/Alert';
import Avatar from '../components/ui/Avatar';
import Tabs from '../components/ui/Tabs';
import { cn } from '../lib/design-system';
import { useTheme } from '../hooks/useTheme';

// =============================================================================
// COLOR SWATCH COMPONENT
// =============================================================================

const ColorSwatch = ({ name, variable, description }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(`var(${variable})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  
  return (
    <div 
      className="group cursor-pointer"
      onClick={handleCopy}
      title={`Click to copy: var(${variable})`}
    >
      <div 
        className="w-full h-16 rounded-lg border mb-2 transition-transform group-hover:scale-105"
        style={{ 
          backgroundColor: `var(${variable})`,
          borderColor: 'var(--border-default)'
        }}
      />
      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{name}</p>
      <p className="text-xs font-mono" style={{ color: 'var(--text-disabled)' }}>{variable}</p>
      {description && <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{description}</p>}
      {copied && <p className="text-xs mt-1" style={{ color: 'var(--status-success)' }}>Copied!</p>}
    </div>
  );
};

// =============================================================================
// SECTION COMPONENT
// =============================================================================

const Section = ({ title, description, children }) => (
  <section className="mb-12">
    <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h2>
    {description && <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>{description}</p>}
    {children}
  </section>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const DesignSystemTest = ({ onNavigate }) => {
  const { theme, resolvedTheme, toggleTheme, setTheme, isDark, isLight, isSystemTheme } = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <div className="min-h-screen p-8 transition-colors duration-200" style={{ backgroundColor: 'var(--surface-secondary)' }}>
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Design System Tokens</h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Visual regression test page for HD26AI design tokens
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Theme toggle buttons */}
            <div className="flex items-center gap-1 p-1 rounded-card" style={{ backgroundColor: 'var(--surface-primary)', border: '1px solid var(--border-default)' }}>
              <button
                onClick={() => setTheme('light')}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors",
                  isLight && !isSystemTheme ? "bg-[var(--interactive-primary)] text-white" : ""
                )}
                style={!isLight || isSystemTheme ? { color: 'var(--text-secondary)' } : {}}
              >
                <Sun className="w-4 h-4" />
                Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors",
                  isDark && !isSystemTheme ? "bg-[var(--interactive-primary)] text-white" : ""
                )}
                style={!isDark || isSystemTheme ? { color: 'var(--text-secondary)' } : {}}
              >
                <Moon className="w-4 h-4" />
                Dark
              </button>
              <button
                onClick={() => setTheme('system')}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors",
                  isSystemTheme ? "bg-[var(--interactive-primary)] text-white" : ""
                )}
                style={!isSystemTheme ? { color: 'var(--text-secondary)' } : {}}
              >
                <Monitor className="w-4 h-4" />
                System
              </button>
            </div>
            <Button variant="secondary" onClick={() => onNavigate('dashboard')}>
              Back to App
            </Button>
          </div>
        </div>
        
        {/* Current Theme Indicator */}
        <div 
          className="mb-8 p-4 rounded-card"
          style={{ 
            backgroundColor: 'var(--surface-primary)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'var(--border-default)'
          }}
        >
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Theme setting: <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{theme}</span>
            {' | '}
            Applied: <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{resolvedTheme}</span>
            {isSystemTheme && (
              <span style={{ color: 'var(--text-disabled)' }}> (following system preference)</span>
            )}
          </p>
        </div>

        {/* =================================================================
            SURFACE COLORS
            ================================================================= */}
        <Section 
          title="Surface Colors" 
          description="Background colors for different elevation levels. Darker = further back, lighter = elevated."
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <ColorSwatch 
              name="Primary (Page)" 
              variable="--color-bg-primary"
              description="Main page background"
            />
            <ColorSwatch 
              name="Card" 
              variable="--color-bg-card"
              description="Card backgrounds"
            />
            <ColorSwatch 
              name="Elevated" 
              variable="--color-bg-elevated"
              description="Modals, dropdowns"
            />
            <div>
              <div className="w-full h-16 rounded-lg border-2 border-arena-border mb-2 bg-arena-black" />
              <p className="text-sm font-medium text-white">Border Default</p>
              <p className="text-xs text-text-muted font-mono">--color-border</p>
            </div>
          </div>
        </Section>

        {/* =================================================================
            TEXT HIERARCHY
            ================================================================= */}
        <Section 
          title="Text Hierarchy" 
          description="Semantic text colors for different levels of emphasis."
        >
          <div 
            className="space-y-4 p-6 rounded-card"
            style={{ 
              backgroundColor: 'var(--surface-primary)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--border-default)'
            }}
          >
            <div>
              <h1 className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>Heading 1 - Primary Text</h1>
              <p className="text-xs font-mono mt-1" style={{ color: 'var(--text-disabled)' }}>--text-primary</p>
            </div>
            <div>
              <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Heading 2</h2>
            </div>
            <div>
              <h3 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Heading 3</h3>
            </div>
            <div>
              <h4 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Heading 4</h4>
            </div>
            <div>
              <h5 className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>Heading 5</h5>
            </div>
            <div>
              <h6 className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>Heading 6</h6>
            </div>
            <hr style={{ borderColor: 'var(--border-default)' }} />
            <div>
              <p className="text-base" style={{ color: 'var(--color-text-body)' }}>Body text - Regular paragraph content with good readability.</p>
              <p className="text-xs font-mono mt-1" style={{ color: 'var(--text-disabled)' }}>--color-text-body</p>
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Secondary text - Descriptions, metadata, less emphasis.</p>
              <p className="text-xs font-mono mt-1" style={{ color: 'var(--text-disabled)' }}>--text-secondary</p>
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--text-disabled)' }}>Muted text - Captions, timestamps, lowest emphasis.</p>
              <p className="text-xs font-mono mt-1" style={{ color: 'var(--text-disabled)' }}>--text-disabled</p>
            </div>
          </div>
        </Section>

        {/* =================================================================
            STATUS COLORS
            ================================================================= */}
        <Section 
          title="Status Colors" 
          description="Semantic colors for feedback, states, and alerts."
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <ColorSwatch 
              name="Success" 
              variable="--color-success"
              description="Positive feedback"
            />
            <ColorSwatch 
              name="Success Light" 
              variable="--color-success-light"
              description="Success backgrounds"
            />
            <ColorSwatch 
              name="Warning" 
              variable="--color-warning"
              description="Caution states"
            />
            <ColorSwatch 
              name="Warning Light" 
              variable="--color-warning-light"
              description="Warning backgrounds"
            />
            <ColorSwatch 
              name="Error" 
              variable="--color-error"
              description="Errors, danger"
            />
            <ColorSwatch 
              name="Error Light" 
              variable="--color-error-light"
              description="Error backgrounds"
            />
            <ColorSwatch 
              name="Info" 
              variable="--color-info"
              description="Informational"
            />
            <ColorSwatch 
              name="Info Light" 
              variable="--color-info-light"
              description="Info backgrounds"
            />
          </div>
          
          {/* Status as Badges */}
          <div className="flex flex-wrap gap-3 p-4 bg-arena-card rounded-card border border-arena-border">
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="default">Default</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </Section>

        {/* =================================================================
            BUTTONS
            ================================================================= */}
        <Section 
          title="Buttons" 
          description="Button variants and states."
        >
          <div className="space-y-6">
            {/* Variants */}
            <div className="p-6 bg-arena-card rounded-card border border-arena-border">
              <h3 className="text-sm font-semibold text-white mb-4">Variants</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <FillButton>Fill Animation</FillButton>
              </div>
            </div>
            
            {/* Sizes */}
            <div className="p-6 bg-arena-card rounded-card border border-arena-border">
              <h3 className="text-sm font-semibold text-white mb-4">Sizes</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="xs">Extra Small</Button>
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </div>
            </div>
            
            {/* States */}
            <div className="p-6 bg-arena-card rounded-card border border-arena-border">
              <h3 className="text-sm font-semibold text-white mb-4">States</h3>
              <div className="flex flex-wrap gap-4">
                <Button>Default</Button>
                <Button disabled>Disabled</Button>
                <Button loading>Loading</Button>
                <Button leftIcon={<Check className="w-4 h-4" />}>With Icon</Button>
              </div>
            </div>
            
            {/* Icon Buttons */}
            <div className="p-6 bg-arena-card rounded-card border border-arena-border">
              <h3 className="text-sm font-semibold text-white mb-4">Icon Buttons</h3>
              <div className="flex flex-wrap items-center gap-4">
                <IconButton icon={<User className="w-4 h-4" />} label="User" size="sm" />
                <IconButton icon={<Info className="w-4 h-4" />} label="Info" size="md" />
                <IconButton icon={<ChevronRight className="w-4 h-4" />} label="Next" size="lg" />
                <IconButton icon={<Loader2 className="w-4 h-4" />} label="Loading" loading />
              </div>
            </div>
          </div>
        </Section>

        {/* =================================================================
            FORM INPUTS
            ================================================================= */}
        <Section 
          title="Form Inputs" 
          description="Input fields and form controls."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-arena-card rounded-card border border-arena-border space-y-4">
              <h3 className="text-sm font-semibold text-white mb-4">Text Inputs</h3>
              <Input 
                label="Default Input"
                placeholder="Enter text..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Input 
                label="With Helper"
                placeholder="Enter email..."
                helperText="We'll never share your email."
              />
              <Input 
                label="Error State"
                placeholder="Invalid input"
                error="This field is required"
                defaultValue="Invalid value"
              />
              <Input 
                label="Disabled"
                placeholder="Cannot edit"
                disabled
                defaultValue="Disabled value"
              />
            </div>
            
            <div className="p-6 bg-arena-card rounded-card border border-arena-border space-y-4">
              <h3 className="text-sm font-semibold text-white mb-4">Input Variants</h3>
              <Input 
                label="With Left Icon"
                placeholder="Search..."
                leftIcon={<Info className="w-4 h-4" />}
              />
              <Input 
                label="With Right Icon"
                placeholder="Enter value..."
                rightIcon={<ChevronRight className="w-4 h-4" />}
              />
              <Input 
                label="Success State"
                placeholder="Valid input"
                success
                defaultValue="Valid value"
              />
            </div>
          </div>
        </Section>

        {/* =================================================================
            BADGES & TAGS
            ================================================================= */}
        <Section 
          title="Badges & Tags" 
          description="Status indicators, skill tags, and role badges."
        >
          <div className="space-y-6">
            <div className="p-6 bg-arena-card rounded-card border border-arena-border">
              <h3 className="text-sm font-semibold text-white mb-4">Skill Badges</h3>
              <div className="flex flex-wrap gap-2">
                <SkillBadge>Frontend Development</SkillBadge>
                <SkillBadge>Backend Development</SkillBadge>
                <SkillBadge>Design/UX</SkillBadge>
                <SkillBadge>DevOps</SkillBadge>
                <SkillBadge>Machine Learning</SkillBadge>
              </div>
            </div>
            
            <div className="p-6 bg-arena-card rounded-card border border-arena-border">
              <h3 className="text-sm font-semibold text-white mb-4">Status Badges</h3>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status="submitted" />
                <StatusBadge status="in_progress" />
                <StatusBadge status="not_started" />
                <StatusBadge status="draft" />
              </div>
            </div>
            
            <div className="p-6 bg-arena-card rounded-card border border-arena-border">
              <h3 className="text-sm font-semibold text-white mb-4">Role Badges</h3>
              <div className="flex flex-wrap gap-2">
                <RoleBadge role="participant" />
                <RoleBadge role="judge" />
                <RoleBadge role="admin" />
                <RoleBadge role="ambassador" />
              </div>
            </div>
          </div>
        </Section>

        {/* =================================================================
            ALERTS
            ================================================================= */}
        <Section 
          title="Alerts" 
          description="Feedback messages and notifications."
        >
          <div className="space-y-4">
            <Alert variant="info" title="Information">
              This is an informational message with helpful context.
            </Alert>
            <Alert variant="success" title="Success">
              Your changes have been saved successfully.
            </Alert>
            <Alert variant="warning" title="Warning">
              Please review your submission before the deadline.
            </Alert>
            <Alert variant="error" title="Error">
              Something went wrong. Please try again.
            </Alert>
            
            <div className="p-6 bg-arena-card rounded-card border border-arena-border">
              <h3 className="text-sm font-semibold text-white mb-4">Inline Alerts</h3>
              <div className="space-y-2">
                <InlineAlert variant="info">Inline info message</InlineAlert>
                <InlineAlert variant="success">Inline success message</InlineAlert>
                <InlineAlert variant="warning">Inline warning message</InlineAlert>
                <InlineAlert variant="error">Inline error message</InlineAlert>
              </div>
            </div>
          </div>
        </Section>

        {/* =================================================================
            CARDS
            ================================================================= */}
        <Section 
          title="Cards" 
          description="Content containers with different variants."
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="default" padding="md">
              <Card.Header>
                <Card.Title>Default Card</Card.Title>
                <Card.Subtitle>Standard content container</Card.Subtitle>
              </Card.Header>
              <Card.Body>
                <p className="text-text-secondary">Card body content goes here.</p>
              </Card.Body>
            </Card>
            
            <Card variant="elevated" padding="md">
              <Card.Header>
                <Card.Title>Elevated Card</Card.Title>
                <Card.Subtitle>With shadow elevation</Card.Subtitle>
              </Card.Header>
              <Card.Body>
                <p className="text-text-secondary">Higher visual prominence.</p>
              </Card.Body>
            </Card>
            
            <Card variant="outlined" padding="md">
              <Card.Header>
                <Card.Title>Outlined Card</Card.Title>
                <Card.Subtitle>Stronger border</Card.Subtitle>
              </Card.Header>
              <Card.Body>
                <p className="text-text-secondary">Clear boundary definition.</p>
              </Card.Body>
            </Card>
          </div>
          
          {/* Interactive Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card variant="default" padding="md" hoverable>
              <Card.Header>
                <Card.Title>Hoverable Card</Card.Title>
              </Card.Header>
              <Card.Body>
                <p className="text-text-secondary">Hover to see the lift effect.</p>
              </Card.Body>
            </Card>
            
            <Card variant="default" padding="md" clickable onClick={() => alert('Card clicked!')}>
              <Card.Header>
                <Card.Title>Clickable Card</Card.Title>
              </Card.Header>
              <Card.Body>
                <p className="text-text-secondary">Click to trigger an action.</p>
              </Card.Body>
            </Card>
          </div>
        </Section>

        {/* =================================================================
            AVATARS
            ================================================================= */}
        <Section 
          title="Avatars" 
          description="User profile images with status indicators."
        >
          <div className="p-6 bg-arena-card rounded-card border border-arena-border">
            <div className="flex flex-wrap items-end gap-6">
              <div className="text-center">
                <Avatar size="xs" name="Alice" />
                <p className="text-xs text-text-muted mt-2">XS</p>
              </div>
              <div className="text-center">
                <Avatar size="sm" name="Bob" />
                <p className="text-xs text-text-muted mt-2">SM</p>
              </div>
              <div className="text-center">
                <Avatar size="md" name="Carol" />
                <p className="text-xs text-text-muted mt-2">MD</p>
              </div>
              <div className="text-center">
                <Avatar size="lg" name="David" />
                <p className="text-xs text-text-muted mt-2">LG</p>
              </div>
              <div className="text-center">
                <Avatar size="xl" name="Eve" />
                <p className="text-xs text-text-muted mt-2">XL</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-arena-border">
              <Avatar size="md" name="Online" status="online" />
              <Avatar size="md" name="Offline" status="offline" />
              <Avatar size="md" name="Busy" status="busy" />
              <Avatar size="md" name="Away" status="away" />
            </div>
          </div>
        </Section>

        {/* =================================================================
            TABS
            ================================================================= */}
        <Section 
          title="Tabs" 
          description="Tab navigation for content organization."
        >
          <div className="p-6 bg-arena-card rounded-card border border-arena-border">
            <Tabs
              value={activeTab}
              onChange={setActiveTab}
              tabs={[
                { label: 'Overview', content: <p className="text-text-secondary p-4">Overview content goes here.</p> },
                { label: 'Details', content: <p className="text-text-secondary p-4">Details content goes here.</p> },
                { label: 'Settings', content: <p className="text-text-secondary p-4">Settings content goes here.</p> },
              ]}
            />
          </div>
        </Section>

        {/* =================================================================
            SPACING & RADIUS
            ================================================================= */}
        <Section 
          title="Spacing & Border Radius" 
          description="Consistent spacing scale and border radius tokens."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-arena-card rounded-card border border-arena-border">
              <h3 className="text-sm font-semibold text-white mb-4">Spacing Scale</h3>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16].map((n) => (
                  <div key={n} className="flex items-center gap-4">
                    <span className="text-xs text-text-muted font-mono w-16">--space-{n}</span>
                    <div 
                      className="h-4 bg-info rounded"
                      style={{ width: `calc(var(--space-${n}) * 4)` }}
                    />
                    <span className="text-xs text-text-secondary">
                      {n * 0.25}rem / {n * 4}px
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 bg-arena-card rounded-card border border-arena-border">
              <h3 className="text-sm font-semibold text-white mb-4">Border Radius</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: 'none', value: '0' },
                  { name: 'sm', value: '0.25rem' },
                  { name: 'md', value: '0.5rem' },
                  { name: 'lg', value: '0.75rem' },
                  { name: 'xl', value: '1rem' },
                  { name: 'card', value: '24px' },
                ].map(({ name, value }) => (
                  <div key={name} className="text-center">
                    <div 
                      className="w-16 h-16 bg-arena-elevated border border-arena-border mx-auto mb-2"
                      style={{ borderRadius: `var(--radius-${name})` }}
                    />
                    <p className="text-xs text-text-muted font-mono">--radius-{name}</p>
                    <p className="text-xs text-text-secondary">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* =================================================================
            FOCUS STATES
            ================================================================= */}
        <Section 
          title="Focus States" 
          description="Keyboard focus indicators for accessibility."
        >
          <div className="p-6 bg-arena-card rounded-card border border-arena-border">
            <p className="text-text-secondary mb-4">
              Tab through these elements to see focus states:
            </p>
            <div className="flex flex-wrap gap-4">
              <Button>Focusable Button</Button>
              <button className="px-4 py-2 bg-arena-elevated border border-arena-border rounded-card text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-text-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-arena-black">
                Custom Focus Ring
              </button>
              <a 
                href="#" 
                className="px-4 py-2 text-info underline focus:outline-none focus-visible:ring-2 focus-visible:ring-info rounded"
                onClick={(e) => e.preventDefault()}
              >
                Focusable Link
              </a>
            </div>
          </div>
        </Section>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-arena-border">
          <p className="text-text-muted text-sm text-center">
            HD26AI Design System Test Page | Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DesignSystemTest;
