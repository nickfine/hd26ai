/**
 * Landing Page
 * The entry point for the HackDay app.
 */

import { useState, useEffect, useRef } from 'react';
import adaptLogo from '../../adaptlogo.png';
import Button from './ui/Button';
import Card from './ui/Card';
import { Container, HStack, VStack } from './layout';

function Landing({ onNavigate }) {
  const containerRef = useRef(null);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-hackday flex flex-col relative overflow-hidden"
    >

      {/* Header */}
      <header className="relative z-20 border-b border-arena-border px-4 sm:px-6 py-4">
        <Container size="lg" padding="none">
          <HStack justify="between" align="center">
            <HStack gap="3" align="center">
              <img src={adaptLogo} alt="Adaptavist" className="h-6 sm:h-8 w-auto" />
              <span className="font-heading font-bold text-base sm:text-lg tracking-tight text-text-primary">
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
      <main className="landing-main relative z-20 flex items-start justify-center px-4 sm:px-6 -mt-6 pb-4">
        <Container size="md" padding="none" className="landing-container">
          <VStack align="center" gap="6" className="landing-hero-content">
            
            {/* ==========================================
                ZONE A: THE HEADER (Top ~40%)
                Headline + Subhead grouped
                ========================================== */}
            <div className="landing-zone-header flex flex-col items-center">
              {/* Title */}
              <VStack align="center" gap="2" className="landing-title-group mt-4">
                <h1 className="landing-title text-4xl sm:text-6xl md:text-8xl font-heading font-black text-text-primary tracking-tight text-center">
                  HACKDAY 2026
                </h1>
                <p className="landing-subhead text-lg sm:text-2xl text-text-secondary text-center max-w-lg mt-6">
                  Build your team.<br />Make awesome together
                </p>
                <p className="landing-tagline text-sm text-text-muted text-center font-mono">
                  Adaptavist HackDay 2026
                </p>
              </VStack>
            </div>

            {/* ==========================================
                ZONE B: THE ACTION (Middle ~20%)
                Button isolated with massive spacing
                ========================================== */}
            <div className="landing-zone-action flex items-center justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => onNavigate('login')}
                className="landing-cta relative group px-10 sm:px-14 py-4 text-lg font-black uppercase tracking-wide"
              >
                <span className="relative z-10">GET STARTED</span>
              </Button>
            </div>

            {/* ==========================================
                ZONE C: THE FOOTER (Bottom ~30%)
                Stats + Recruitment anchored at bottom
                ========================================== */}
            <div className="landing-zone-footer flex flex-col items-center">
              {/* Stats */}
              <HStack gap="4" className="landing-stats sm:gap-8">
              <Card 
                variant="outlined" 
                padding="sm" 
                className="text-center min-w-[90px] sm:min-w-[120px] bg-arena-card/50 backdrop-blur-sm border-arena-border transition-colors"
              >
                <div className="text-2xl sm:text-4xl font-heading font-black text-text-primary">48</div>
                <div className="text-xs text-text-muted uppercase tracking-wide font-mono">Hours</div>
              </Card>
              <Card 
                variant="outlined" 
                padding="sm" 
                className="text-center min-w-[90px] sm:min-w-[120px] bg-arena-card/50 backdrop-blur-sm border-arena-border transition-colors"
              >
                <div className="text-2xl sm:text-4xl font-heading font-black text-text-primary">∞</div>
                <div className="text-xs text-text-muted uppercase tracking-wide font-mono">Possibilities</div>
              </Card>
              <Card 
                variant="outlined" 
                padding="sm" 
                className="text-center min-w-[90px] sm:min-w-[120px] bg-arena-card/50 backdrop-blur-sm border-arena-border transition-colors"
              >
                <div className="text-2xl sm:text-4xl font-heading font-black text-text-primary">1</div>
                <div className="text-xs text-text-muted uppercase tracking-wide font-mono">Winner</div>
              </Card>
            </HStack>

            {/* End Zone C: Footer */}
            </div>
          </VStack>
        </Container>
      </main>

      {/* Footer */}
      <footer className="relative z-20 mt-auto px-4 sm:px-6 py-4">
        <Container size="lg" padding="none">
          <div className="text-center text-xs text-text-muted font-mono uppercase tracking-wider">
            HD26 // May the best code win
          </div>
        </Container>
      </footer>
    </div>
  );
}

export default Landing;
