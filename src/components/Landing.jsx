/**
 * Landing Page
 * The entry point for the HackDay app, introducing the Human vs AI theme.
 */

import { Cpu, Heart } from 'lucide-react';
import adaptLogo from '../../adaptlogo.png';
import Button from './ui/Button';
import Card from './ui/Card';
import { Container, HStack, VStack } from './layout';

function Landing({ onNavigate }) {
  return (
    <div className="min-h-screen bg-surface-1 flex flex-col">
      {/* Header */}
      <header className="border-b border-neutral-200 px-4 sm:px-6 py-4">
        <Container size="lg" padding="none">
          <HStack justify="between" align="center">
            <HStack gap="2" align="center">
              <img src={adaptLogo} alt="Adaptavist" className="h-6 sm:h-8 w-auto" />
              <span className="font-bold text-base sm:text-lg tracking-tight">HACKDAY 2026</span>
            </HStack>
            <span className="text-xs text-neutral-500 uppercase tracking-widest hidden sm:inline">
              The Arena Awaits
            </span>
          </HStack>
        </Container>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-0">
        <Container size="md" padding="none">
          <VStack align="center" gap="6">
            {/* VS Badge */}
            <HStack gap="3" align="center" className="sm:gap-6">
              <HStack gap="1" align="center" className="text-ai-500 sm:gap-2">
                <Cpu className="w-6 sm:w-10 h-6 sm:h-10" />
                <span className="text-lg sm:text-2xl font-mono font-bold">AI</span>
              </HStack>
              <div className="w-10 sm:w-16 h-10 sm:h-16 rounded-full border-2 sm:border-4 border-neutral-900 flex items-center justify-center">
                <span className="text-sm sm:text-xl font-black">VS</span>
              </div>
              <HStack gap="1" align="center" className="text-human-500 sm:gap-2">
                <span className="text-lg sm:text-2xl font-bold">HUMAN</span>
                <Heart className="w-6 sm:w-10 h-6 sm:h-10" />
              </HStack>
            </HStack>

            {/* Title */}
            <VStack align="center" gap="2">
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-neutral-900 tracking-tight text-center">
                THE WAR IS ON
              </h1>
              <p className="text-base sm:text-xl text-neutral-600 text-center">
                Choose your side. Build your team. Ship something legendary.
              </p>
              <p className="text-xs sm:text-sm text-neutral-400 text-center">
                Corporate HackDay 2026 — Where allegiances are tested
              </p>
            </VStack>

            {/* CTA */}
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigate('login')}
              className="relative group px-8 sm:px-12"
            >
              <span className="relative z-10">ENTER THE ARENA</span>
              <div className="absolute inset-0 bg-gradient-to-r from-ai-500/20 to-human-500/20 
                              opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>

            {/* Stats */}
            <HStack gap="3" className="sm:gap-8 mt-4 sm:mt-8">
              <Card variant="outlined" padding="sm" className="text-center min-w-[80px] sm:min-w-[100px]">
                <div className="text-xl sm:text-3xl font-bold text-neutral-900">48</div>
                <div className="text-xs text-neutral-500 uppercase tracking-wide">Hours</div>
              </Card>
              <Card variant="outlined" padding="sm" className="text-center min-w-[80px] sm:min-w-[100px]">
                <div className="text-xl sm:text-3xl font-bold text-neutral-900">∞</div>
                <div className="text-xs text-neutral-500 uppercase tracking-wide">Possibilities</div>
              </Card>
              <Card variant="outlined" padding="sm" className="text-center min-w-[80px] sm:min-w-[100px]">
                <div className="text-xl sm:text-3xl font-bold text-neutral-900">1</div>
                <div className="text-xs text-neutral-500 uppercase tracking-wide">Winner</div>
              </Card>
            </HStack>
          </VStack>
        </Container>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 px-4 sm:px-6 py-4">
        <Container size="lg" padding="none">
          <div className="text-center text-xs text-neutral-400">
            WIREFRAME PROTOTYPE — LOW FIDELITY
          </div>
        </Container>
      </footer>
    </div>
  );
}

export default Landing;
