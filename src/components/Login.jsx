/**
 * Login Page
 * Authentication page with OAuth and demo mode options.
 */

import { useState } from 'react';
import { ArrowLeft, Crown, Gavel, Megaphone, Shield, Users, Loader2, User, UserPlus, UsersRound, Code, Send, Vote, Scale, Trophy, Sparkles } from 'lucide-react';
import adaptLogo from '../../adaptlogo.png';
import Button from './ui/Button';
import Card from './ui/Card';
import Alert from './ui/Alert';
import { Container, HStack, VStack } from './layout';
import { cn } from '../lib/design-system';

// Event phases for demo mode
const EVENT_PHASES = [
  { id: 'registration', label: 'Register', icon: UserPlus },
  { id: 'team_formation', label: 'Teams', icon: UsersRound },
  { id: 'hacking', label: 'Hacking', icon: Code },
  { id: 'submission', label: 'Submit', icon: Send },
  { id: 'voting', label: 'Voting', icon: Vote },
  { id: 'judging', label: 'Judging', icon: Scale },
  { id: 'results', label: 'Results', icon: Trophy },
];

// Google Icon SVG
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

// Demo role button component
const DemoRoleButton = ({ icon: Icon, label, onClick, variant = 'primary', className, style }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'w-full py-3 text-white font-bold transition-colors text-sm flex items-center justify-center gap-2',
      className
    )}
    style={style}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);

function Login({ onNavigate, onLogin, onDemoLogin, onDemoOnboarding, onOAuthSignIn, authLoading, authError }) {
  const [showDemoMode, setShowDemoMode] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState('team_formation');

  return (
    <div className="min-h-screen bg-hackday flex flex-col">
      {/* Header */}
      <header className="border-b border-arena-border px-4 sm:px-6 py-4">
        <Container size="lg" padding="none">
          <HStack justify="between" align="center">
            <button
              type="button"
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Back</span>
            </button>
            <HStack gap="2" align="center">
              <img src={adaptLogo} alt="Adaptavist" className="h-6 w-auto" />
              <span className="font-bold text-sm tracking-tight">HACKDAY 2026</span>
            </HStack>
          </HStack>
        </Container>
      </header>

      {/* Main */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-md mx-auto">
          {/* Card */}
          <Card variant="outlined" padding="lg">
            <VStack align="center" gap="6">
              <VStack align="center" gap="2">
                <h1 className="text-xl sm:text-2xl font-black text-white font-display">
                  AUTHENTICATE
                </h1>
                <p className="text-sm text-arena-secondary">
                  Sign in to enter the arena
                </p>
              </VStack>

              {/* Error Message */}
              {authError && (
                <Alert variant="error" className="w-full">
                  {authError}
                </Alert>
              )}

              {/* OAuth Buttons */}
              <VStack gap="3" className="w-full">
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={() => onOAuthSignIn?.('google')}
                  disabled={authLoading}
                  leftIcon={authLoading ? <Loader2 className="animate-spin" /> : <GoogleIcon />}
                  className="border-arena-border hover:border-arena-secondary"
                >
                  {authLoading ? 'Signing in...' : 'Continue with Google'}
                </Button>
              </VStack>

              {/* Info text */}
              <p className="text-xs text-arena-muted text-center">
                By signing in, you agree to participate in HackDay 2026
              </p>
            </VStack>
          </Card>

          {/* Demo Mode Toggle */}
          <div className="mt-4 sm:mt-6">
            <button
              type="button"
              onClick={() => setShowDemoMode(!showDemoMode)}
              className="w-full py-2 text-sm text-arena-muted hover:text-white 
                         transition-colors flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              {showDemoMode ? 'Hide Demo Mode' : 'Use Demo Mode (for testing)'}
            </button>

            {/* Demo Mode - Role Selection */}
            {showDemoMode && (
              <Card variant="ghost" padding="md" className="mt-3 border-2 border-dashed border-arena-border bg-arena-card">
                {/* Phase Selector */}
                <div className="mb-5">
                  <span className="text-xs font-bold uppercase tracking-wide text-arena-secondary block mb-3">
                    Event Phase
                  </span>
                  <div className="grid grid-cols-7 gap-1">
                    {EVENT_PHASES.map((phase) => {
                      const Icon = phase.icon;
                      const isSelected = selectedPhase === phase.id;
                      return (
                        <button
                          key={phase.id}
                          type="button"
                          onClick={() => setSelectedPhase(phase.id)}
                          className={cn(
                            'flex flex-col items-center justify-center py-2 px-1 rounded transition-all',
                            isSelected 
                              ? 'bg-brand text-white' 
                              : 'bg-arena-elevated text-arena-muted hover:bg-arena-border hover:text-white border border-arena-border'
                          )}
                          title={phase.label}
                        >
                          <Icon className="w-4 h-4 mb-1" />
                          <span className="text-[9px] font-medium leading-tight">{phase.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-2 text-center">
                    <span className="text-xs text-arena-muted">
                      Simulating: <span className="font-semibold text-white">{EVENT_PHASES.find(p => p.id === selectedPhase)?.label}</span> phase
                    </span>
                  </div>
                </div>

                {/* Role Selector */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wide text-arena-secondary">
                    Select Role
                  </span>
                </div>
                
                <VStack gap="3">
                  {/* New User - Goes to Dashboard in signup mode (registration phase) */}
                  <DemoRoleButton
                    icon={Sparkles}
                    label="New User (Onboarding)"
                    onClick={() => {
                      if (onDemoOnboarding) {
                        onDemoOnboarding(selectedPhase);
                      } else {
                        onDemoLogin({
                          id: Date.now(),
                          name: '',
                          email: 'new.user@company.com',
                          skills: [],
                          allegiance: 'neutral',
                          role: 'participant',
                          phase: 'registration',
                        });
                        // Navigate to dashboard in signup mode
                        onNavigate('dashboard');
                      }
                    }}
                    className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
                  />
                  
                  {/* Participant / Team Member */}
                  <DemoRoleButton
                    icon={User}
                    label="Team Member"
                    onClick={() => {
                      onDemoLogin({
                        id: 202,
                        name: 'Casey Brooks',
                        callsign: 'CSS Wizard',
                        email: 'casey.brooks@company.com',
                        skills: ['Frontend Development', 'UI/UX Design'],
                        allegiance: 'human',
                        role: 'participant',
                        phase: selectedPhase,
                      });
                    }}
                    className="bg-blue-500 hover:bg-blue-600"
                  />
                  
                  {/* Participant / Captain */}
                  <DemoRoleButton
                    icon={Crown}
                    label="Team Captain"
                    onClick={() => {
                      onDemoLogin({
                        id: 101,
                        name: 'Alex Chen',
                        callsign: 'Keyboard Bandit',
                        email: 'alex.chen@company.com',
                        skills: ['Backend Development', 'DevOps'],
                        allegiance: 'ai',
                        role: 'participant',
                        phase: selectedPhase,
                      });
                    }}
                    style={{ backgroundColor: '#06b6d4' }}
                  />
                  
                  {/* Ambassador */}
                  <DemoRoleButton
                    icon={Megaphone}
                    label="Ambassador"
                    onClick={() => {
                      onDemoLogin({
                        id: 2001,
                        name: 'Sarah Mitchell',
                        email: 'sarah.mitchell@company.com',
                        skills: ['Product Management'],
                        allegiance: 'human',
                        role: 'ambassador',
                        phase: selectedPhase,
                      });
                    }}
                    style={{ backgroundColor: '#22c55e' }}
                  />
                  
                  {/* Judge */}
                  <DemoRoleButton
                    icon={Gavel}
                    label="Judge"
                    onClick={() => {
                      onDemoLogin({
                        id: 3001,
                        name: 'Dr. Elena Vasquez',
                        email: 'elena.vasquez@company.com',
                        skills: [],
                        allegiance: 'neutral',
                        role: 'judge',
                        phase: selectedPhase,
                      });
                    }}
                    style={{ backgroundColor: '#f59e0b' }}
                  />
                  
                  {/* Admin */}
                  <DemoRoleButton
                    icon={Shield}
                    label="Admin"
                    onClick={() => {
                      onDemoLogin({
                        id: 4001,
                        name: 'HackDay Admin',
                        email: 'admin@company.com',
                        skills: [],
                        allegiance: 'neutral',
                        role: 'admin',
                        phase: selectedPhase,
                      });
                    }}
                    style={{ backgroundColor: '#9333ea' }}
                  />
                </VStack>
                
                <p className="text-xs text-arena-muted mt-3 text-center">
                  Demo mode uses mock data — no authentication required
                </p>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
