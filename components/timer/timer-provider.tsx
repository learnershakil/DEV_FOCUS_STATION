"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { logFocusSession } from "@/lib/actions";

interface TimerContextType {
    timeRemaining: number;
    duration: number;
    isRunning: boolean;
    startTimer: (minutes: number) => void;
    pauseTimer: () => void;
    resumeTimer: () => void;
    stopTimer: () => void;
    resetTimer: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: React.ReactNode }) {
    const [timeRemaining, setTimeRemaining] = useState(25 * 60);
    const [duration, setDuration] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);

    // Poll for server state every 2 seconds to keep sync
    useEffect(() => {
        const sync = async () => {
            try {
                // We can't import getTimerState directly in client effect without wrapping in server action call pattern?
                // Actually we can if it's a server action.
                // But for cleaner code, let's assume we import a purely client wrapper or just call it.
                // Since 'getTimerState' is a server action (use server), we can call it.
                const { getTimerState } = await import("@/lib/actions");
                const session = await getTimerState();

                if (session) {
                    if (session.status === "running") {
                        const elapsed = Math.floor((Date.now() - session.startTime) / 1000);
                        const remaining = (session.duration * 60) - elapsed;
                        if (remaining > 0) {
                            setDuration(session.duration * 60);
                            setTimeRemaining(remaining);
                            setIsRunning(true);
                        } else {
                            // Finished technically
                            setIsRunning(false);
                            setTimeRemaining(0);
                        }
                    } else if (session.status === "paused") {
                        // If paused, we might drift if we don't have pausedAt logic fully mirror here,
                        // but usually we just want to know if it's running.
                        setIsRunning(false);
                    }
                }
            } catch (error) {
                console.error("Timer sync failed", error);
            }
        };

        const interval = setInterval(sync, 5000); // Low frequency check
        sync(); // Initial check

        return () => clearInterval(interval);
    }, []);

    // Local ticker for smooth UI
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining((prev) => prev - 1);
            }, 1000);
        } else if (timeRemaining <= 0 && isRunning) {
            // Handle complete locally
            setIsRunning(false);
            const { logFocusSession, stopFocusSession } = require("@/lib/actions");
            stopFocusSession();
            logFocusSession(25);
            new Audio("/bell.mp3").play().catch(() => { });
        }
        return () => clearInterval(interval);
    }, [isRunning, timeRemaining]);


    const startTimer = async (minutes: number) => {
        // optimistic
        setDuration(minutes * 60);
        setTimeRemaining(minutes * 60);
        setIsRunning(true);

        const { startFocusSession } = await import("@/lib/actions");
        await startFocusSession(minutes);
    };

    const pauseTimer = async () => {
        setIsRunning(false);
        const { pauseFocusSession } = await import("@/lib/actions");
        await pauseFocusSession();
    };

    const resumeTimer = async () => {
        if (timeRemaining > 0) {
            setIsRunning(true);
            const { resumeFocusSession } = await import("@/lib/actions");
            await resumeFocusSession();
        }
    };

    const stopTimer = async () => {
        setIsRunning(false);
        setTimeRemaining(duration);
        const { stopFocusSession } = await import("@/lib/actions");
        await stopFocusSession();
    };

    const resetTimer = async () => {
        stopTimer();
    };

    return (
        <TimerContext.Provider
            value={{
                timeRemaining,
                duration,
                isRunning,
                startTimer,
                pauseTimer,
                resumeTimer,
                stopTimer,
                resetTimer,
            }}
        >
            {children}
        </TimerContext.Provider>
    );
}

export const useTimer = () => {
    const context = useContext(TimerContext);
    if (!context) throw new Error("useTimer must be used within a TimerProvider");
    return context;
};
