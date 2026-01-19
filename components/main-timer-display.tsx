"use client";

import { useTimer } from "@/components/timer/timer-provider";
import { Play, Pause, RotateCcw, Monitor, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";

function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function MainTimerDisplay() {
    const {
        timeRemaining,
        duration,
        isRunning,
        startTimer,
        pauseTimer,
        resumeTimer,
        resetTimer,
    } = useTimer();

    // Infer type for styling based on duration
    const type = duration < 15 * 60 ? "break" : "focus";

    // Calculate progress for visual (optional, or just remove glow effect dep)
    // const progress = ((duration - timeRemaining) / duration) * 100;

    const handleToggle = () => {
        if (isRunning) {
            pauseTimer();
        } else {
            resumeTimer();
        }
    };

    const setFocus = () => startTimer(25);
    const setShortBreak = () => startTimer(5);
    const setLongBreak = () => startTimer(15);

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div className="relative group">
                {/* Progress Ring Glow */}
                <div
                    className={cn(
                        "absolute inset-0 rounded-full blur-3xl opacity-20 transition-all duration-1000",
                        isRunning && type === "focus" ? "bg-cyan-500" : "",
                        isRunning && type === "break" ? "bg-green-500" : ""
                    )}
                />

                <div className="text-[12rem] leading-none font-bold font-mono tracking-tighter text-white select-none tabular-nums">
                    {formatTime(timeRemaining)}
                </div>
            </div>

            <div className="flex items-center gap-6 mt-8">
                <button
                    onClick={handleToggle}
                    className="h-16 w-16 rounded-full bg-white text-black flex items-center justify-center hover:bg-zinc-200 transition active:scale-95"
                >
                    {isRunning ? (
                        <Pause className="h-8 w-8 fill-current" />
                    ) : (
                        <Play className="h-8 w-8 fill-current ml-1" />
                    )}
                </button>

                <button
                    onClick={() => resetTimer()}
                    className="h-12 w-12 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center hover:bg-zinc-700 hover:text-white transition"
                >
                    <RotateCcw className="h-5 w-5" />
                </button>
            </div>

            <div className="flex gap-4 mt-8">
                <button
                    onClick={setFocus}
                    className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2",
                        type === "focus"
                            ? "bg-cyan-500/10 text-cyan-500 ring-1 ring-cyan-500/50"
                            : "text-zinc-500 hover:text-zinc-300"
                    )}
                >
                    <Monitor className="h-4 w-4" />
                    Focus (25m)
                </button>
                <button
                    onClick={setShortBreak}
                    className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2",
                        type === "break"
                            ? "bg-green-500/10 text-green-500 ring-1 ring-green-500/50"
                            : "text-zinc-500 hover:text-zinc-300"
                    )}
                >
                    <Coffee className="h-4 w-4" />
                    Break (5m)
                </button>
            </div>
        </div>
    );
}
