import { useState, useCallback } from 'react';
import PomodoroTimer from '@/components/PomodoroTimer';

const Index = () => {
  const [progress, setProgress] = useState(0);

  const handleProgressChange = useCallback((newProgress: number) => {
    setProgress(newProgress);
  }, []);

  // Aura height grows from bottom (0%) to top (100%) as timer progresses
  const auraHeight = 20 + progress * 80; // Start at 20%, grow to 100%
  
  // Color transitions through the sunrise palette based on progress
  const getAuraColors = () => {
    if (progress < 0.15) {
      return {
        inner: 'hsla(280, 40%, 35%, 0.8)',
        middle: 'hsla(250, 35%, 18%, 0.6)',
        outer: 'hsla(234, 32%, 12%, 0)'
      };
    } else if (progress < 0.3) {
      return {
        inner: 'hsla(340, 55%, 55%, 0.8)',
        middle: 'hsla(280, 40%, 35%, 0.5)',
        outer: 'hsla(250, 35%, 18%, 0)'
      };
    } else if (progress < 0.5) {
      return {
        inner: 'hsla(15, 70%, 55%, 0.85)',
        middle: 'hsla(340, 55%, 55%, 0.5)',
        outer: 'hsla(280, 40%, 35%, 0)'
      };
    } else if (progress < 0.7) {
      return {
        inner: 'hsla(30, 85%, 55%, 0.9)',
        middle: 'hsla(15, 70%, 55%, 0.5)',
        outer: 'hsla(340, 55%, 55%, 0)'
      };
    } else if (progress < 0.85) {
      return {
        inner: 'hsla(42, 90%, 60%, 0.9)',
        middle: 'hsla(30, 85%, 55%, 0.5)',
        outer: 'hsla(15, 70%, 55%, 0)'
      };
    } else {
      return {
        inner: 'hsla(200, 70%, 75%, 0.85)',
        middle: 'hsla(42, 90%, 60%, 0.5)',
        outer: 'hsla(30, 85%, 55%, 0)'
      };
    }
  };

  const auraColors = getAuraColors();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[hsl(234,32%,12%)]">
      {/* Sunrise aura - grows from bottom */}
      <div 
        className="fixed inset-x-0 bottom-0 pointer-events-none transition-all duration-[2000ms] ease-out"
        style={{
          height: `${auraHeight}%`,
          background: `
            radial-gradient(
              ellipse 120% 80% at 50% 100%,
              ${auraColors.inner} 0%,
              ${auraColors.middle} 40%,
              ${auraColors.outer} 70%
            )
          `,
        }}
      />

      {/* Secondary ambient glow */}
      <div 
        className="fixed inset-x-0 bottom-0 pointer-events-none transition-all duration-[3000ms] ease-out"
        style={{
          height: `${Math.min(100, auraHeight * 1.2)}%`,
          background: `
            radial-gradient(
              ellipse 150% 60% at 50% 100%,
              ${auraColors.middle} 0%,
              transparent 60%
            )
          `,
          opacity: 0.6,
        }}
      />

      {/* Sun orb that rises */}
      <div 
        className="fixed pointer-events-none transition-all duration-[2000ms] ease-out"
        style={{
          bottom: `${-5 + progress * 50}%`,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '250px',
          height: '250px',
          background: `radial-gradient(circle, 
            ${auraColors.inner.replace('0.8', '0.4').replace('0.85', '0.4').replace('0.9', '0.4')} 0%, 
            transparent 60%
          )`,
          borderRadius: '50%',
          filter: 'blur(30px)',
        }}
      />

      {/* Main content */}
      <main className="relative z-10 w-full max-w-lg mx-auto">
        <div className="glass-panel p-8 md:p-12">
          <PomodoroTimer onProgressChange={handleProgressChange} />
        </div>
      </main>

      {/* Subtle hint text */}
      <p className="mt-8 text-sm text-foreground/40 text-center max-w-xs relative z-10">
        Watch the sunrise as you focus
      </p>
    </div>
  );
};

export default Index;
