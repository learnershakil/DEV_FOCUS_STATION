'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Play, Pause, Check, Clock, Trash2, Bug, Zap, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export interface TodoItem {
  id: string;
  text: string;
  timeRemaining: number;
  isRunning: boolean;
  isCompleted: boolean;
  completedIn?: number;
  createdAt: number;
  originalTime: number; // Add this to track original time
}

interface TodoListProps {
  todos: TodoItem[];
  onUpdate: (todos: TodoItem[]) => void;
}

export function TodoList({ todos, onUpdate }: TodoListProps) {
  const [newTodo, setNewTodo] = useState('');
  const [newTodoTime, setNewTodoTime] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio context for notifications
    if (typeof window !== 'undefined') {
      const createNotificationSound = () => {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 600;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      };
      
      audioRef.current = { play: createNotificationSound } as any;
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedTodos = todos.map(todo => {
        if (todo.isRunning && !todo.isCompleted && todo.timeRemaining > 0) {
          const newTimeRemaining = Math.max(0, todo.timeRemaining - 0.1); // Update every 100ms
          
          // Play sound when todo timer completes
          if (newTimeRemaining === 0 && todo.timeRemaining > 0) {
            if (audioRef.current) {
              try {
                audioRef.current.play();
              } catch (error) {
                console.log('Audio notification failed:', error);
              }
            }
          }
          
          return {
            ...todo,
            timeRemaining: newTimeRemaining,
            isRunning: newTimeRemaining > 0
          };
        }
        return todo;
      });

      const hasChanges = updatedTodos.some((todo, index) => 
        Math.abs(todo.timeRemaining - todos[index].timeRemaining) > 0.05 || 
        todo.isRunning !== todos[index].isRunning
      );

      if (hasChanges) {
        onUpdate(updatedTodos);
      }
    }, 100); // Update every 100ms for millisecond precision

    return () => clearInterval(interval);
  }, [todos, onUpdate]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const millisecs = Math.floor((seconds % 1) * 10);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s.${millisecs}`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s.${millisecs}`;
    } else {
      return `${secs}s.${millisecs}`;
    }
  };

  const addTodo = () => {
    if (!newTodo.trim() || !newTodoTime.trim()) return;

    const timeInSeconds = parseInt(newTodoTime) * 60;
    if (timeInSeconds <= 0) return;

    const todo: TodoItem = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      timeRemaining: timeInSeconds,
      originalTime: timeInSeconds, // Store original time
      isRunning: false,
      isCompleted: false,
      createdAt: Date.now()
    };

    onUpdate([...todos, todo]);
    setNewTodo('');
    setNewTodoTime('');
  };

  const toggleTodo = (id: string) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, isRunning: !todo.isRunning };
      }
      return todo;
    });
    onUpdate(updatedTodos);
  };

  const completeTodo = (id: string) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        const completedIn = todo.originalTime - todo.timeRemaining;
        return { 
          ...todo, 
          isCompleted: true, 
          isRunning: false,
          completedIn: Math.max(0, completedIn)
        };
      }
      return todo;
    });
    onUpdate(updatedTodos);
  };

  const deleteTodo = (id: string) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    onUpdate(updatedTodos);
  };

  const activeTodos = todos.filter(todo => !todo.isCompleted);
  const completedTodos = todos.filter(todo => todo.isCompleted);

  const getTaskIcon = (index: number) => {
    const icons = [Bug, Zap, Coffee, Clock];
    const IconComponent = icons[index % icons.length];
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <Card className="bg-gradient-to-br from-slate-950/95 via-slate-900/95 to-slate-950/95 backdrop-blur-xl border border-purple-500/20 shadow-2xl shadow-purple-500/10">
      {/* Code-like background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 left-4 font-mono text-xs text-purple-400">
          {'// TODO_MANAGER_CLASS'}
        </div>
        <div className="absolute top-8 left-4 font-mono text-xs text-slate-500">
          {'class TodoManager extends TaskRunner {'}
        </div>
      </div>

      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bug className="h-6 w-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-slate-200 font-mono">
            TASK_QUEUE
          </h2>
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30 font-mono">
            {activeTodos.length} active
          </Badge>
        </div>

        {/* Add Todo Form */}
        <div className="mb-6 space-y-3">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg blur-sm" />
            <div className="relative bg-slate-900/80 border border-purple-500/30 rounded-lg p-4">
              <div className="text-xs text-purple-400 mb-2 font-mono">
                {'> addTask(description, timeLimit)'}
              </div>
              <Input
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Implement new feature, fix bug, refactor code..."
                className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder-slate-400 font-mono mb-3"
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              />
              <div className="flex gap-2">
                <Input
                  value={newTodoTime}
                  onChange={(e) => setNewTodoTime(e.target.value)}
                  placeholder="Time (minutes)"
                  type="number"
                  min="1"
                  className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder-slate-400 flex-1 font-mono"
                  onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                />
                <Button
                  onClick={addTodo}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0 shadow-lg hover:shadow-purple-500/25 transition-all duration-300 font-mono"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  push()
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Active Todos */}
        <div className="space-y-3 mb-6">
          {activeTodos.map((todo, index) => (
            <div
              key={todo.id}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative p-4 bg-slate-900/60 rounded-lg border border-slate-700/50 hover:bg-slate-800/60 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getTaskIcon(index)}
                      <p className="text-slate-200 font-medium truncate font-mono text-sm">
                        {todo.text}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-mono">timer:</span>
                        <span className={`text-lg font-mono font-bold ${
                          todo.timeRemaining <= 60 ? 'text-red-400' : 
                          todo.timeRemaining <= 300 ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {formatTime(todo.timeRemaining)}
                        </span>
                      </div>
                      {todo.isRunning && (
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 font-mono text-xs">
                          RUNNING
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="sm"
                      onClick={() => toggleTodo(todo.id)}
                      className={`${
                        todo.isRunning 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-green-600 hover:bg-green-700'
                      } text-white border-0 shadow-md transition-all duration-300 font-mono text-xs`}
                    >
                      {todo.isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      size="sm"
                      onClick={() => completeTodo(todo.id)}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white border-0 shadow-md transition-all duration-300 font-mono text-xs"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteTodo(todo.id)}
                      className="border-slate-600 text-slate-400 hover:bg-red-600/20 hover:border-red-500 hover:text-red-400 transition-all duration-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {activeTodos.length === 0 && (
            <div className="text-center py-8 text-slate-400 font-mono">
              <div className="text-sm">{'// No active tasks in queue'}</div>
              <div className="text-xs mt-1">{'queue.isEmpty() === true'}</div>
            </div>
          )}
        </div>

        {/* Completed Todos */}
        {completedTodos.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-300 mb-3 flex items-center gap-2 font-mono">
              <Check className="h-5 w-5 text-green-400" />
              COMPLETED_TASKS ({completedTodos.length})
            </h3>
            <div className="space-y-2">
              {completedTodos.map((todo, index) => (
                <div
                  key={todo.id}
                  className="p-3 bg-green-500/10 rounded-lg border border-green-500/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getTaskIcon(index)}
                        <p className="text-slate-300 line-through font-mono text-sm">{todo.text}</p>
                      </div>
                      <p className="text-sm text-green-400 font-mono">
                        {'// Completed in '}{formatTime(todo.completedIn || 0)}
                      </p>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteTodo(todo.id)}
                      className="border-slate-600 text-slate-400 hover:bg-red-600/20 hover:border-red-500 hover:text-red-400 transition-all duration-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}