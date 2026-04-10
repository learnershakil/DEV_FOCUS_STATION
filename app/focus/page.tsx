"use client";

import { useTimer } from "@/components/timer/timer-provider";
import { Play, Pause, RotateCcw, Monitor, Coffee, Maximize2, Minimize2, ArrowLeft, Volume2, CloudRain, Wind } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FocusPage() {
    const { timeRemaining, duration, isRunning, startTimer, pauseTimer, resumeTimer, resetTimer } = useTimer();
    const [isFullscreen, setIsFullscreen] = useState(false);
    const router = useRouter();

    // Ambient Sound State
    const [sound, setSound] = useState<"none" | "rain" | "cafe">("none");
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (sound === "none") {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            return;
        }

        const src = sound === "rain" ? "https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg" : "https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg";

        if (!audioRef.current || audioRef.current.src !== src) {
            if (audioRef.current) audioRef.current.pause();
            audioRef.current = new Audio(src);
            audioRef.current.loop = true;
            audioRef.current.volume = 0.5;
        }

        audioRef.current.play().catch(e => console.log("Audio play failed (interaction required):", e));

        return () => {
            if (audioRef.current) audioRef.current.pause();
        }
    }, [sound]);

    function formatTime(seconds: number) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    }

    const type = duration < 15 * 60 ? "break" : "focus";

    return (
        <div className="h-screen w-full bg-black flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-1000"
            style={{ backgroundColor: type === 'focus' ? '#000000' : '#051805' }}>

            {/* Background Gradient */}
            <div className={cn(
                "absolute inset-0 opacity-30 blur-[100px] transition-colors duration-1000",
                type === 'focus' ? "bg-gradient-to-tr from-cyan-900/40 to-purple-900/40" : "bg-gradient-to-tr from-green-900/40 to-emerald-900/40"
            )} />

            {/* Navigation & Controls Overlay */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
                <Link href="/" className="text-zinc-500 hover:text-white transition flex items-center gap-2">
                    <ArrowLeft className="h-5 w-5" />
                    <span className="text-sm font-medium">Dashboard</span>
                </Link>

                <div className="flex gap-4">
                    {/* Sound Controls */}
                    <div className="flex bg-white/5 rounded-full p-1 backdrop-blur-md">
                        <button
                            onClick={() => setSound("none")}
                            className={cn("p-2 rounded-full transition-all", sound === "none" ? "bg-white/20 text-white" : "text-zinc-500 hover:text-zinc-300")}
                            title="Mute"
                        >
                            <Volume2 className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setSound("rain")}
                            className={cn("p-2 rounded-full transition-all", sound === "rain" ? "bg-white/20 text-white" : "text-zinc-500 hover:text-zinc-300")}
                            title="Rain"
                        >
                            <CloudRain className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setSound("cafe")}
                            className={cn("p-2 rounded-full transition-all", sound === "cafe" ? "bg-white/20 text-white" : "text-zinc-500 hover:text-zinc-300")}
                            title="Cafe"
                        >
                            <Wind className="h-4 w-4" />
                        </button>
                    </div>

                    <button onClick={toggleFullscreen} className="text-zinc-500 hover:text-white transition p-2 bg-white/5 rounded-full backdrop-blur-md">
                        {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Main Timer */}
            <div className="relative z-10 flex flex-col items-center">
                <div className="text-[15vw] leading-none font-bold font-mono text-white select-none tabular-nums drop-shadow-2xl">
                    {formatTime(timeRemaining)}
                </div>

                <div className="flex items-center gap-8 mt-12">
                    <button
                        onClick={isRunning ? pauseTimer : resumeTimer}
                        className="h-24 w-24 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
                    >
                        {isRunning ? (
                            <Pause className="h-10 w-10 fill-current" />
                        ) : (
                            <Play className="h-10 w-10 fill-current ml-1" />
                        )}
                    </button>
                    <button
                        onClick={() => resetTimer()}
                        className="h-16 w-16 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition backdrop-blur-md"
                    >
                        <RotateCcw className="h-6 w-6" />
                    </button>
                </div>

                <div className="mt-8 flex gap-4">
                    <span className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium border transition-colors",
                        type === 'focus' ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-200" : "border-transparent text-zinc-500"
                    )}>Focus</span>
                    <span className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium border transition-colors",
                        type === 'break' ? "bg-green-500/20 border-green-500/50 text-green-200" : "border-transparent text-zinc-500"
                    )}>Break</span>
                </div>
            </div>

            <div className="absolute bottom-8 text-zinc-500 text-sm font-medium tracking-widest uppercase opacity-50">
                {type === 'focus' ? "Deep Work Session" : "Rest & Recharge"}
            </div>
        </div>
    );
}
