import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Create a gentle chime using Web Audio API
const createChimeSound = (audioContext: AudioContext) => {
  const now = audioContext.currentTime;
  
  // Create oscillators for a gentle bell-like sound
  const oscillator1 = audioContext.createOscillator();
  const oscillator2 = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator1.type = 'sine';
  oscillator1.frequency.setValueAtTime(523.25, now); // C5
  
  oscillator2.type = 'sine';
  oscillator2.frequency.setValueAtTime(659.25, now); // E5
  
  // Gentle envelope
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
  
  oscillator1.connect(gainNode);
  oscillator2.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator1.start(now);
  oscillator2.start(now);
  oscillator1.stop(now + 1.5);
  oscillator2.stop(now + 1.5);
};

const TIME_PRESETS = [
  { label: '25m', seconds: 25 * 60 },
  { label: '45m', seconds: 45 * 60 },
  { label: '60m', seconds: 60 * 60 },
];

interface PomodoroTimerProps {
  onProgressChange: (progress: number) => void;
}

const PomodoroTimer = ({ onProgressChange }: PomodoroTimerProps) => {
  const [duration, setDuration] = useState(25 * 60);
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('25');
  const [isComplete, setIsComplete] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const chimeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const progress = 1 - timeRemaining / duration;

  useEffect(() => {
    onProgressChange(progress);
  }, [progress, onProgressChange]);

  // Start chime when timer completes
  const startChime = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    
    // Play immediately
    createChimeSound(audioContextRef.current);
    
    // Then repeat every 3 seconds
    chimeIntervalRef.current = setInterval(() => {
      if (audioContextRef.current) {
        createChimeSound(audioContextRef.current);
      }
    }, 3000);
  }, []);

  // Stop chime
  const stopChime = useCallback(() => {
    if (chimeIntervalRef.current) {
      clearInterval(chimeIntervalRef.current);
      chimeIntervalRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopChime();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopChime]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsComplete(true);
            setSessions((s) => s + 1);
            startChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, startChime]);

  const toggleTimer = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeRemaining(duration);
    setIsComplete(false);
    stopChime();
  }, [duration, stopChime]);

  const selectPreset = useCallback((seconds: number) => {
    setDuration(seconds);
    setTimeRemaining(seconds);
    setIsRunning(false);
    setIsComplete(false);
    setCustomMinutes(String(seconds / 60));
    stopChime();
  }, [stopChime]);

  const handleTimeClick = () => {
    if (!isRunning) {
      setIsEditing(true);
    }
  };

  const handleCustomTimeSubmit = () => {
    const mins = parseInt(customMinutes, 10);
    if (!isNaN(mins) && mins > 0 && mins <= 180) {
      const seconds = mins * 60;
      setDuration(seconds);
      setTimeRemaining(seconds);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCustomTimeSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8">

      {/* Time presets */}
      <div className="poiret-one-regular flex items-center gap-2">
        {TIME_PRESETS.map((preset) => (
          <Button
            key={preset.label}
            variant={duration === preset.seconds ? 'timer' : 'timer'}
            size="sm"
            onClick={() => selectPreset(preset.seconds)}
            disabled={isRunning}
            className="min-w-[52px] hover:scale-100"
          >
            {preset.label}
          </Button>
        ))}
      </div>

      {/* Timer display */}
      <div className="relative">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(e.target.value)}
              onBlur={handleCustomTimeSubmit}
              onKeyDown={handleKeyDown}
              min={1}
              max={180}
              autoFocus
              className="w-32 text-center text-4xl font-medium bg-transparent border-foreground/20 text-foreground"
            />
            <span className="text-2xl text-foreground/60">min</span>
          </div>
        ) : (
          <button
            onClick={handleTimeClick}
            disabled={isRunning}
            className="bonbon-regular timer-display text-8xl md:text-9xl font-medium text-foreground text-shadow-soft cursor-pointer hover:opacity-80 transition-opacity disabled:cursor-default disabled:hover:opacity-100"
          >
            {formatTime(timeRemaining)}
          </button>
        )}
        
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
          variant="outline"
          size="iconLg"
          onClick={resetTimer}
          aria-label="Reset timer"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
        
        <Button
          variant="outline"
          size="xl"
          onClick={toggleTimer}
          className="min-w-[50px] hover:opacity-90"
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5" />
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              {/* {timeRemaining === duration ? 'Start' : 'Resume'} */}
            </>
          )}
        </Button>
      </div>

 </div> 
 
 );
};

export default PomodoroTimer;
