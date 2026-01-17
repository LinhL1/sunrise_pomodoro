import { useState, useCallback, useMemo } from 'react';
import PomodoroTimer from '@/components/PomodoroTimer';

const Index = () => {
  const [progress, setProgress] = useState(0);

  const handleProgressChange = useCallback((newProgress: number) => {
    setProgress(newProgress);
  }, []);

  // Calculate which sunrise stage we're in (0-6)
  const sunriseStage = useMemo(() => {
    return Math.min(6, Math.floor(progress * 7));
  }, [progress]);

  return (
    <div 
      className={`min-h-screen flex flex-col items-center justify-center p-6 sunrise-gradient sunrise-stage-${sunriseStage}`}
    >
      {/* Sun element that rises with progress */}
      <div 
        className="fixed pointer-events-none transition-all duration-2000 ease-out"
        style={{
          bottom: `${-20 + progress * 60}%`,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '300px',
          height: '300px',
          background: `radial-gradient(circle, 
            hsla(42, 100%, 70%, ${0.2 + progress * 0.3}) 0%, 
            hsla(30, 100%, 60%, ${0.1 + progress * 0.2}) 40%, 
            transparent 70%
          )`,
          borderRadius: '50%',
          filter: 'blur(40px)',
        }}
      />

      {/* Main content */}
      <main className="relative z-10 w-full max-w-lg mx-auto">
        <div className="glass-panel p-8 md:p-12">
          <PomodoroTimer onProgressChange={handleProgressChange} />
        </div>
      </main>

      {/* Subtle hint text */}
      <p className="mt-8 text-sm text-foreground/40 text-center max-w-xs">
        Watch the sunrise as you focus
      </p>
    </div>
  );
};

export default Index;
