/**
 * Landing Page
 * The entry point for the HackDay app, introducing the Human vs AI theme.
 * Dark Mode Cyber Arena Theme - "Tron meets Squid Game meets GitHub"
 */

import { useState, useEffect, useRef } from 'react';
import { Cpu, Heart } from 'lucide-react';
import adaptLogo from '../../adaptlogo.png';
import Button from './ui/Button';
import Card from './ui/Card';
import { Container, HStack, VStack } from './layout';

/**
 * CursorGlow - Mouse-following glow effect
 */
const CursorGlow = ({ allegiance = 'neutral' }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const glowColor = allegiance === 'ai' 
    ? 'rgba(0, 212, 255, 0.6)' 
    : allegiance === 'human' 
      ? 'rgba(255, 46, 99, 0.6)' 
      : 'rgba(255, 87, 34, 0.6)';

  if (!isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: position.x,
        top: position.y,
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        background: glowColor,
        filter: 'blur(8px)',
        transform: 'translate(-50%, -50%)',
        mixBlendMode: 'screen',
        opacity: 0.8,
      }}
    />
  );
};

function Landing({ onNavigate }) {
  const containerRef = useRef(null);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-arena-black flex flex-col relative overflow-hidden cursor-none"
    >
      {/* Cursor Glow Effect */}
      <CursorGlow allegiance="neutral" />

      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Brand orange blob - top left */}
        <div 
          className="blob blob-brand w-[600px] h-[600px] -top-40 -left-40 animate-blob-float opacity-40"
          style={{ filter: 'blur(100px)' }}
        />
        {/* AI blue blob - bottom right */}
        <div 
          className="blob blob-ai w-[400px] h-[400px] -bottom-20 -right-20 animate-blob-float-delay opacity-30"
          style={{ filter: 'blur(80px)' }}
        />
        {/* Human coral blob - center right */}
        <div 
          className="blob blob-human w-[300px] h-[300px] top-1/2 right-10 animate-blob-float opacity-20"
          style={{ filter: 'blur(60px)', animationDelay: '2s' }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-arena-border px-4 sm:px-6 py-4">
        <Container size="lg" padding="none">
          <HStack justify="between" align="center">
            <HStack gap="3" align="center">
              <img src={adaptLogo} alt="Adaptavist" className="h-6 sm:h-8 w-auto" />
              <span className="font-heading font-bold text-base sm:text-lg tracking-tight text-white">
                HACKDAY 2026
              </span>
            </HStack>
            <span className="text-xs text-text-muted uppercase tracking-widest hidden sm:inline font-mono">
              The Arena Awaits
            </span>
          </HStack>
        </Container>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-0">
        <Container size="md" padding="none">
          <VStack align="center" gap="8">
            {/* VS Badge */}
            <HStack gap="4" align="center" className="sm:gap-8">
              <HStack gap="2" align="center" className="text-ai sm:gap-3">
                <Cpu className="w-8 sm:w-12 h-8 sm:h-12" style={{ filter: 'drop-shadow(0 0 12px rgba(0, 212, 255, 0.5))' }} />
                <span className="text-xl sm:text-3xl font-mono font-bold">AI</span>
              </HStack>
              
              <div className="w-12 sm:w-20 h-12 sm:h-20 rounded-full border-2 sm:border-4 border-brand flex items-center justify-center bg-arena-black/50 backdrop-blur-sm"
                   style={{ boxShadow: '0 0 20px rgba(255, 87, 34, 0.3)' }}>
                <span className="text-base sm:text-2xl font-black text-brand">VS</span>
              </div>
              
              <HStack gap="2" align="center" className="text-human sm:gap-3">
                <span className="text-xl sm:text-3xl font-bold">HUMAN</span>
                <Heart className="w-8 sm:w-12 h-8 sm:h-12" style={{ filter: 'drop-shadow(0 0 12px rgba(255, 46, 99, 0.5))' }} />
              </HStack>
            </HStack>

            {/* Title */}
            <VStack align="center" gap="4">
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-heading font-black text-white tracking-tight text-center">
                THE WAR IS ON
              </h1>
              <p className="text-lg sm:text-2xl text-text-secondary text-center max-w-lg">
                Choose your side. Build your team. Ship something legendary.
              </p>
              <p className="text-sm text-text-muted text-center font-mono">
                Corporate HackDay 2026 — Where allegiances are tested
              </p>
            </VStack>

            {/* CTA */}
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigate('login')}
              className="relative group px-10 sm:px-14 py-4 text-lg font-black uppercase tracking-wide"
            >
              <span className="relative z-10">ENTER THE ARENA</span>
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-ai/20 to-human/20 
                              opacity-0 group-hover:opacity-100 transition-opacity rounded-card" />
            </Button>

            {/* Stats */}
            <HStack gap="4" className="sm:gap-8 mt-6 sm:mt-10">
              <Card 
                variant="outlined" 
                padding="sm" 
                className="text-center min-w-[90px] sm:min-w-[120px] bg-arena-card/50 backdrop-blur-sm border-arena-border hover:border-brand transition-colors"
              >
                <div className="text-2xl sm:text-4xl font-heading font-black text-white">48</div>
                <div className="text-xs text-text-muted uppercase tracking-wide font-mono">Hours</div>
              </Card>
              <Card 
                variant="outlined" 
                padding="sm" 
                className="text-center min-w-[90px] sm:min-w-[120px] bg-arena-card/50 backdrop-blur-sm border-arena-border hover:border-ai transition-colors"
              >
                <div className="text-2xl sm:text-4xl font-heading font-black text-ai">∞</div>
                <div className="text-xs text-text-muted uppercase tracking-wide font-mono">Possibilities</div>
              </Card>
              <Card 
                variant="outlined" 
                padding="sm" 
                className="text-center min-w-[90px] sm:min-w-[120px] bg-arena-card/50 backdrop-blur-sm border-arena-border hover:border-human transition-colors"
              >
                <div className="text-2xl sm:text-4xl font-heading font-black text-human">1</div>
                <div className="text-xs text-text-muted uppercase tracking-wide font-mono">Winner</div>
              </Card>
            </HStack>

            {/* Team Recruitment Teaser */}
            <div className="w-full max-w-md mt-8">
              <div className="text-center mb-3">
                <span className="text-xs text-text-muted uppercase tracking-widest font-mono">
                  Current Recruitment
                </span>
              </div>
              <div className="relative h-3 rounded-full overflow-hidden bg-arena-elevated">
                {/* AI side */}
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-ai transition-all duration-1000"
                  style={{ width: '48%' }}
                />
                {/* Human side */}
                <div 
                  className="absolute right-0 top-0 bottom-0 bg-human transition-all duration-1000"
                  style={{ width: '52%' }}
                />
                {/* Divider line */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 left-[48%] transform -translate-x-1/2"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(0, 212, 255, 0.6), white, rgba(255, 46, 99, 0.6))',
                    boxShadow: '-4px 0 8px rgba(0, 212, 255, 0.4), 4px 0 8px rgba(255, 46, 99, 0.4), 0 0 12px white',
                  }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs font-mono">
                <span className="text-ai">48% AI</span>
                <span className="text-human">52% Human</span>
              </div>
            </div>
          </VStack>
        </Container>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-arena-border px-4 sm:px-6 py-4">
        <Container size="lg" padding="none">
          <div className="text-center text-xs text-text-muted font-mono uppercase tracking-wider">
            HD26 // Human vs AI // May the best code win
          </div>
        </Container>
      </footer>
    </div>
  );
}

export default Landing;
