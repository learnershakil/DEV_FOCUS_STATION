"use client";

import { useTimer } from "@/components/timer/timer-provider";
import { cn } from "@/lib/utils";
import { Pause, Play, RotateCcw, MonitorPlay, Maximize2 } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function FocusPage() {
    const { timeRemaining, isRunning, startTimer, pauseTimer, resumeTimer, resetTimer, duration } = useTimer();
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Format time (mm:ss)
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    const progress = ((duration - timeRemaining) / duration) * 100;

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-black text-white">
            {/* Background Ambient Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 animate-pulse-slow" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-12">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-light tracking-[0.2em] uppercase text-zinc-400">Deep Focus</h1>
                    <div className="h-0.5 w-12 bg-white/20 mx-auto" />
                </div>

                <div className="text-[12vw] md:text-[180px] leading-none font-bold font-mono tracking-tighter tabular-nums select-none bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 drop-shadow-2xl">
                    {formatTime(timeRemaining)}
                </div>

                {/* Progress Bar */}
                <div className="w-64 md:w-96 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-white transition-all duration-1000 ease-linear"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Controls */}
                <div className="flex items-center gap-8">
                    {!isRunning && timeRemaining === duration && (
                        <button
                            onClick={() => startTimer(25)}
                            className="p-6 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:scale-105 active:scale-95 group"
                        >
                            <Play className="h-8 w-8 fill-zinc-200 group-hover:fill-white" />
                        </button>
                    )}

                    {isRunning && (
                        <button
                            onClick={pauseTimer}
                            className="p-6 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:scale-105 active:scale-95 group"
                        >
                            <Pause className="h-8 w-8 fill-zinc-200 group-hover:fill-white" />
                        </button>
                    )}

                    {!isRunning && timeRemaining < duration && timeRemaining > 0 && (
                        <button
                            onClick={resumeTimer}
                            className="p-6 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:scale-105 active:scale-95 group"
                        >
                            <Play className="h-8 w-8 fill-zinc-200 group-hover:fill-white" />
                        </button>
                    )}

                    <button
                        onClick={resetTimer}
                        className="p-4 rounded-full text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all"
                    >
                        <RotateCcw className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {/* Floating Tools */}
            <div className="absolute top-8 right-8 flex gap-4">

                <button
                    onClick={toggleFullscreen}
                    className="p-2 text-zinc-500 hover:text-white transition opacity-50 hover:opacity-100"
                >
                    <Maximize2 className="h-5 w-5" />
                </button>

                <Link
                    href="/"
                    onClick={() => document.fullscreenElement && document.exitFullscreen()}
                    className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium hover:bg-white/10 transition"
                >
                    Exit Flow
                </Link>
            </div>
        </div>
    );
}
