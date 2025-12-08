/**
 * Landing Page
 * The entry point for the HackDay app, introducing the Human vs AI theme.
 * Dark Mode Cyber Arena Theme - "Tron meets Squid Game meets GitHub"
 * 
 * Cinematic hero with AI (left) and Human (right) side figures
 */

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
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
    ? 'rgba(0, 229, 255, 0.6)' 
    : allegiance === 'human' 
      ? 'rgba(255, 69, 0, 0.6)' 
      : 'rgba(255, 69, 0, 0.6)';

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
  
  // Hover state for cinematic figure interactions
  const [buttonHover, setButtonHover] = useState(false);
  const [recruitHover, setRecruitHover] = useState(null); // 'ai' | 'human' | null

  // Mouse-reactive breathing vignette
  useEffect(() => {
    const handleMouseMove = (e) => {
      document.body.style.setProperty('--mouse-x', `${(e.clientX / window.innerWidth) * 100}%`);
      document.body.style.setProperty('--mouse-y', `${(e.clientY / window.innerHeight) * 100}%`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-hackday flex flex-col relative overflow-hidden cursor-none"
    >
      {/* Cursor Glow Effect */}
      <CursorGlow allegiance="neutral" />

      {/* Ambient Side Glows - Cyan from left, Orange from right */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div 
          className="absolute inset-y-0 left-0 w-1/2" 
          style={{ background: 'radial-gradient(ellipse at left center, rgba(0, 240, 255, 0.08), transparent 70%)' }} 
        />
        <div 
          className="absolute inset-y-0 right-0 w-1/2" 
          style={{ background: 'radial-gradient(ellipse at right center, rgba(255, 107, 0, 0.08), transparent 70%)' }} 
        />
      </div>

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

      {/* ============================================
          DESKTOP HERO FIGURES - Hidden on mobile
          Capped positioning for ultra-wide screens
          ============================================ */}
      
      {/* AI Figure - Left Side */}
      <motion.div
        initial={{ opacity: 0, x: -80 }}
        animate={{ 
          opacity: 1, 
          x: 0,
          scale: buttonHover || recruitHover === 'ai' ? 1.05 : 1,
          filter: buttonHover || recruitHover === 'ai' ? 'brightness(1.5) drop-shadow(0 0 70px #00F0FF)' : 'brightness(1.0)'
        }}
        transition={{ 
          duration: 2.2, 
          delay: 0.3, 
          ease: [0.25, 0.1, 0.25, 1],
          scale: { duration: 0.5, ease: "easeOut" },
          filter: { duration: 0.5, ease: "easeOut" }
        }}
        className="hidden md:block absolute top-[28%] -translate-y-1/2 z-10 pointer-events-none animate-hero-pulse"
        style={{
          left: 'clamp(-350px, calc(50% - 750px), -5%)',
          maxWidth: 'min(45vw, 600px)'
        }}
      >
        <img
          src="/promo/ai_transparent.png"
          alt="AI"
          className="w-full object-contain"
          style={{ 
            transform: 'scaleX(-1)' 
          }}
        />
      </motion.div>

      {/* Human Figure - Right Side */}
      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ 
          opacity: 1, 
          x: 0,
          scale: buttonHover || recruitHover === 'human' ? 1.05 : 1,
          filter: buttonHover || recruitHover === 'human' ? 'brightness(1.5) drop-shadow(0 0 70px #FF6B00)' : 'brightness(1.0)'
        }}
        transition={{ 
          duration: 2.2, 
          delay: 0.5, 
          ease: [0.25, 0.1, 0.25, 1],
          scale: { duration: 0.5, ease: "easeOut" },
          filter: { duration: 0.5, ease: "easeOut" }
        }}
        className="hidden md:block absolute top-[28%] -translate-y-1/2 z-10 pointer-events-none animate-hero-pulse"
        style={{
          right: 'clamp(-350px, calc(50% - 750px), -5%)',
          maxWidth: 'min(45vw, 600px)'
        }}
      >
        <img
          src="/promo/human_transparent.png"
          alt="Human"
          className="w-full object-contain"
          style={{ 
            filter: 'sepia(0.4) hue-rotate(15deg) saturate(2.5) brightness(1.15)',
            transform: 'scaleX(-1)' 
          }}
        />
      </motion.div>

      {/* ============================================
          MOBILE HERO FIGURES - Ambient background style
          Smaller, subtle, flanking the content
          ============================================ */}
      
      {/* Mobile AI Figure - Left side ambient */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 0.4, x: 0 }}
        transition={{ duration: 1.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="block md:hidden absolute left-[-15%] top-[25%] w-[50vw] z-0 pointer-events-none"
      >
        <img 
          src="/promo/ai_transparent.png" 
          alt="" 
          className="w-full object-contain opacity-60" 
          style={{ transform: 'scaleX(-1)' }} 
        />
        {/* Fade overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-arena-black/80" />
      </motion.div>

      {/* Mobile Human Figure - Right side ambient */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 0.4, x: 0 }}
        transition={{ duration: 1.8, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="block md:hidden absolute right-[-15%] top-[25%] w-[50vw] z-0 pointer-events-none"
      >
        <img 
          src="/promo/human_transparent.png" 
          alt="" 
          className="w-full object-contain opacity-60" 
          style={{ 
            filter: 'sepia(0.4) hue-rotate(15deg) saturate(2.5) brightness(1.15)',
            transform: 'scaleX(-1)' 
          }} 
        />
        {/* Fade overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-arena-black/80" />
      </motion.div>

      {/* Header */}
      <header className="relative z-20 border-b border-arena-border px-4 sm:px-6 py-4">
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
      <main className="relative z-20 flex items-start justify-center px-4 sm:px-6 -mt-6 pb-4">
        <Container size="md" padding="none">
          <VStack align="center" gap="6">
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
                <Heart className="w-8 sm:w-12 h-8 sm:h-12" style={{ filter: 'drop-shadow(0 0 12px rgba(255, 69, 0, 0.5))' }} />
              </HStack>
            </HStack>

            {/* Title */}
            <VStack align="center" gap="2">
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-heading font-black text-white tracking-tight text-center">
                THE WAR IS ON
              </h1>
              <p className="text-lg sm:text-2xl text-text-secondary text-center max-w-lg mt-6">
                Choose your side. Build your team.<br />Make awesome together
              </p>
              <p className="text-sm text-text-muted text-center font-mono">
                Adaptavist HackDay 2026 — Where allegiances are tested
              </p>
            </VStack>

            {/* CTA - with hover tracking for figure interaction */}
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigate('login')}
              onMouseEnter={() => setButtonHover(true)}
              onMouseLeave={() => setButtonHover(false)}
              className="relative group px-10 sm:px-14 py-4 text-lg font-black uppercase tracking-wide mt-8"
            >
              <span className="relative z-10">ENTER THE ARENA</span>
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-ai/20 to-human/20 
                              opacity-0 group-hover:opacity-100 transition-opacity rounded-card" />
            </Button>

            {/* Stats */}
            <HStack gap="4" className="sm:gap-8 mt-6">
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

            {/* Team Recruitment Teaser - with hover tracking for figure interaction */}
            <div className="w-full max-w-md">
              <div className="text-center mb-3">
                <span className="text-xs text-text-muted uppercase tracking-widest font-mono">
                  Current Recruitment
                </span>
              </div>
              <div className="relative h-3 rounded-full overflow-hidden bg-arena-elevated">
                {/* AI side - with hover interaction */}
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-ai transition-all duration-1000 cursor-pointer"
                  style={{ width: '48%' }}
                  onMouseEnter={() => setRecruitHover('ai')}
                  onMouseLeave={() => setRecruitHover(null)}
                />
                {/* Human side - with hover interaction */}
                <div 
                  className="absolute right-0 top-0 bottom-0 bg-human transition-all duration-1000 cursor-pointer"
                  style={{ width: '52%' }}
                  onMouseEnter={() => setRecruitHover('human')}
                  onMouseLeave={() => setRecruitHover(null)}
                />
                {/* Divider line */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 left-[48%] transform -translate-x-1/2"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(0, 229, 255, 0.6), white, rgba(255, 69, 0, 0.6))',
                    boxShadow: '-4px 0 8px rgba(0, 229, 255, 0.4), 4px 0 8px rgba(255, 69, 0, 0.4), 0 0 12px white',
                  }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs font-mono">
                <span 
                  className={`text-ai transition-all duration-300 cursor-pointer ${recruitHover === 'ai' ? 'scale-110 drop-shadow-[0_0_8px_#00F0FF]' : ''}`}
                  onMouseEnter={() => setRecruitHover('ai')}
                  onMouseLeave={() => setRecruitHover(null)}
                >
                  48% AI
                </span>
                <span 
                  className={`text-human transition-all duration-300 cursor-pointer ${recruitHover === 'human' ? 'scale-110 drop-shadow-[0_0_8px_#FF6B00]' : ''}`}
                  onMouseEnter={() => setRecruitHover('human')}
                  onMouseLeave={() => setRecruitHover(null)}
                >
                  52% Human
                </span>
              </div>
            </div>
          </VStack>
        </Container>
      </main>

      {/* Footer */}
      <footer className="relative z-20 mt-auto px-4 sm:px-6 py-4">
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
