import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

const POMODORO_DURATION = 25 * 60; // 25 minutes in seconds

interface PomodoroTimerProps {
  onProgressChange: (progress: number) => void;
}

const PomodoroTimer = ({ onProgressChange }: PomodoroTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(POMODORO_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);

  const progress = 1 - timeRemaining / POMODORO_DURATION;

  useEffect(() => {
    onProgressChange(progress);
  }, [progress, onProgressChange]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setSessions((s) => s + 1);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

  const toggleTimer = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeRemaining(POMODORO_DURATION);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center gap-12">
      {/* Session counter */}
      <div className="text-sm font-medium tracking-wider uppercase text-foreground/60">
        Session {sessions + 1}
      </div>

      {/* Timer display */}
      <div className="relative">
        <div className="timer-display text-8xl md:text-9xl font-medium text-foreground text-shadow-soft">
          {formatTime(timeRemaining)}
        </div>
        
        {/* Progress indicator */}
        <div className="mt-6 w-full h-1 bg-foreground/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-foreground/40 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <Button
          variant="timer"
          size="iconLg"
          onClick={resetTimer}
          aria-label="Reset timer"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
        
        <Button
          variant="timerPrimary"
          size="xl"
          onClick={toggleTimer}
          className="min-w-[140px]"
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              {timeRemaining === POMODORO_DURATION ? 'Start' : 'Resume'}
            </>
          )}
        </Button>
      </div>

      {/* Completed sessions */}
      {sessions > 0 && (
        <div className="flex items-center gap-2 text-sm text-foreground/50">
          <span>Completed today:</span>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(sessions, 8) }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-foreground/40"
              />
            ))}
            {sessions > 8 && <span>+{sessions - 8}</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default PomodoroTimer;
