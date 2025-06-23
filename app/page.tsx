'use client';

import { useState, useEffect } from 'react';
import { MainTimer } from '@/components/MainTimer';
import { TodoList, TodoItem } from '@/components/TodoList';
import { NotesSection } from '@/components/NotesSection';
import { Terminal, Code, Cpu, Zap } from 'lucide-react';

interface AppData {
  mainTimer: number;
  mainTimerStarted: number;
  isMainTimerRunning: boolean;
  todos: TodoItem[];
  notes: string;
}

export default function Home() {
  const [data, setData] = useState<AppData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async (updatedData: AppData) => {
    try {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      setData(updatedData);
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  };

  const updateMainTimer = (time: number, isRunning: boolean, startedAt: number) => {
    if (!data) return;
    
    const updatedData = {
      ...data,
      mainTimer: time,
      isMainTimerRunning: isRunning,
      mainTimerStarted: startedAt
    };
    saveData(updatedData);
  };

  const updateTodos = (todos: TodoItem[]) => {
    if (!data) return;
    
    const updatedData = { ...data, todos };
    saveData(updatedData);
  };

  const updateNotes = (notes: string) => {
    if (!data) return;
    
    const updatedData = { ...data, notes };
    saveData(updatedData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin h-16 w-16 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-6"></div>
            <Terminal className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-cyan-400" />
          </div>
          <p className="text-slate-400 text-lg font-mono">Initializing workspace...</p>
          <p className="text-slate-500 text-sm font-mono mt-2">Loading development environment</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center text-red-400">
          <Terminal className="h-12 w-12 mx-auto mb-4" />
          <p className="text-lg font-mono">ERROR: Failed to load workspace</p>
          <p className="text-sm font-mono text-slate-500 mt-2">Please refresh to retry connection</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        {/* Floating orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Code-like floating elements */}
        <div className="absolute top-20 left-20 text-cyan-400/20 font-mono text-sm animate-pulse">
          {'{ "status": "active" }'}
        </div>
        <div className="absolute top-40 right-32 text-purple-400/20 font-mono text-sm animate-pulse" style={{ animationDelay: '1s' }}>
          {'const timer = new Timer();'}
        </div>
        <div className="absolute bottom-32 left-32 text-green-400/20 font-mono text-sm animate-pulse" style={{ animationDelay: '2s' }}>
          {'// TODO: Optimize performance'}
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Enhanced Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Terminal className="h-12 w-12 text-cyan-400" />
            <div className="h-12 w-px bg-gradient-to-b from-transparent via-slate-600 to-transparent"></div>
            <Code className="h-12 w-12 text-purple-400" />
            <div className="h-12 w-px bg-gradient-to-b from-transparent via-slate-600 to-transparent"></div>
            <Cpu className="h-12 w-12 text-green-400" />
          </div>
          
          {/*<h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-green-400 mb-4 tracking-tight font-mono">
            DEV_FOCUS_STATION
          </h1>*/}
          
          {/* <div className="max-w-3xl mx-auto">
            <p className="text-xl text-slate-400 leading-relaxed font-mono mb-4">
              {'// Advanced productivity suite for developers'}
            </p>
            <p className="text-lg text-slate-500 leading-relaxed">
              Time tracking • Task management • Cross-device synchronization • Built with Next.js
            </p>
          </div> */}
          
          {/* Status indicators */}
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-mono text-slate-400">System Online</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-mono text-slate-400">Real-time Sync</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-mono text-slate-400">Audio Enabled</span>
            </div>
          </div>
        </header>

        {/* Main Timer */}
        <div className="mb-12">
          <MainTimer
            initialTime={data.mainTimer}
            isRunning={data.isMainTimerRunning}
            startedAt={data.mainTimerStarted}
            onUpdate={updateMainTimer}
          />
        </div>

        {/* Todo and Notes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <TodoList
              todos={data.todos}
              onUpdate={updateTodos}
            />
          </div>
          
          <div>
            <NotesSection
              notes={data.notes}
              onUpdate={updateNotes}
            />
          </div>
        </div>

        {/* Enhanced Footer */}
        <footer className="text-center mt-16 text-slate-500 font-mono">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent flex-1"></div>
            <Terminal className="h-4 w-4 text-slate-600" />
            <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent flex-1"></div>
          </div>
          {/* <p className="text-sm">
            {'// Data synchronized across all devices • Built with Next.js & Tailwind CSS'}
          </p> */}
          <p className="text-xs mt-2 text-slate-600">
            {'v1.0.0 - Production Ready • Sound notifications enabled'}
          </p>
        </footer>
      </div>
    </div>
  );
}