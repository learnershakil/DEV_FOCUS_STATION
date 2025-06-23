'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Code, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface MainTimerProps {
  initialTime: number;
  isRunning: boolean;
  startedAt: number;
  onUpdate: (time: number, isRunning: boolean, startedAt: number) => void;
}

export function MainTimer({ initialTime, isRunning, startedAt, onUpdate }: MainTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isActive, setIsActive] = useState(isRunning);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio context for notifications
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      // Create a simple beep sound using Web Audio API
      const createBeepSound = () => {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      };
      
      // @ts-ignore
      audioRef.current.play = createBeepSound;
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = (now - startedAt) / 1000;
        const remaining = Math.max(0, initialTime - elapsed);
        
        setTimeRemaining(remaining);
        
        if (remaining === 0) {
          setIsActive(false);
          onUpdate(0, false, startedAt);
          // Play notification sound when timer completes
          if (audioRef.current) {
            try {
              audioRef.current.play();
            } catch (error) {
              console.log('Audio notification failed:', error);
            }
          }
        }
      }, 50); // Update every 50ms for smooth millisecond display
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining, initialTime, startedAt, onUpdate]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const millisecs = Math.floor((seconds % 1) * 10);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${millisecs}`;
  };

  const toggleTimer = () => {
    const newIsActive = !isActive;
    const newStartedAt = newIsActive ? Date.now() - (initialTime - timeRemaining) * 1000 : startedAt;
    
    setIsActive(newIsActive);
    onUpdate(timeRemaining, newIsActive, newStartedAt);
  };

  const resetTimer = () => {
    const resetTime = 24 * 60 * 60; // 24 hours
    setTimeRemaining(resetTime);
    setIsActive(false);
    onUpdate(resetTime, false, Date.now());
  };

  const progress = ((initialTime - timeRemaining) / initialTime) * 100;

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-slate-950/95 via-slate-900/95 to-slate-950/95 backdrop-blur-xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
      {/* Code-like background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 left-4 font-mono text-xs text-cyan-400">
          {'// MAIN_TIMER_INSTANCE'}
        </div>
        <div className="absolute top-8 left-4 font-mono text-xs text-slate-500">
          {'const timer = new Timer({ duration: 36 * 3600 });'}
        </div>
        <div className="absolute bottom-8 right-4 font-mono text-xs text-slate-500">
          {'timer.status: '}<span className={isActive ? 'text-green-400' : 'text-red-400'}>
            {isActive ? 'RUNNING' : 'PAUSED'}
          </span>
        </div>
      </div>
      
      {/* Animated border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-green-500/20 animate-pulse" />
      
      <div className="relative p-8 text-center">
        {/* Header with developer icons */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <Terminal className="h-8 w-8 text-cyan-400" />
          <h1 className="text-2xl font-bold text-slate-200 tracking-wide font-mono">
            MAIN_COUNTDOWN_TIMER
          </h1>
          <Code className="h-8 w-8 text-purple-400" />
        </div>
        
        <div className="mb-8">
          {/* Timer display with terminal-like styling */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-green-500/10 rounded-lg blur-xl" />
            <div className="relative bg-slate-900/80 border border-cyan-500/30 rounded-lg p-6 font-mono">
              <div className="text-xs text-cyan-400 mb-2 text-left">
                {'> timer.getFormattedTime()'}
              </div>
              <div className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-green-400 tracking-wider">
                {formatTime(timeRemaining)}
              </div>
              <div className="text-xs text-slate-500 mt-2 text-right">
                {'// HH:MM:SS.MS format'}
              </div>
            </div>
          </div>
          
          {/* Progress bar with code-like styling */}
          <div className="mt-6">
            <div className="flex justify-between text-xs text-slate-400 font-mono mb-2">
              <span>{`progress: ${progress.toFixed(1)}%`}</span>
              <span>{'complete: 100%'}</span>
            </div>
            <div className="w-full bg-slate-800/50 rounded-full h-3 overflow-hidden border border-slate-700/50">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-green-500 rounded-full transition-all duration-300 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Control buttons with developer styling */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={toggleTimer}
            size="lg"
            className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white border-0 shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 font-mono"
          >
            {isActive ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
            {isActive ? 'timer.pause()' : 'timer.start()'}
          </Button>
          
          <Button
            onClick={resetTimer}
            size="lg"
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-300 font-mono"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            timer.reset()
          </Button>
        </div>

        {/* Status indicator */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
          <span className="text-sm font-mono text-slate-400">
            Status: <span className={isActive ? 'text-green-400' : 'text-red-400'}>
              {isActive ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </span>
        </div>
      </div>
    </Card>
  );
}