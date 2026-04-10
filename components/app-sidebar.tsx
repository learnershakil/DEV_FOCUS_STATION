"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Timer, CheckSquare, FileText, Settings, LayoutDashboard, StickyNote, GraduationCap, BarChart2 } from "lucide-react";

const routes = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/", color: "text-zinc-400" },
    { label: "Focus Mode", icon: Timer, href: "/focus", color: "text-sky-500" },
    { label: "Analytics", icon: BarChart2, href: "/analytics", color: "text-indigo-400" },
    { label: "Tasks", icon: CheckSquare, href: "/tasks", color: "text-green-400" },
    { label: "Notes", icon: StickyNote, href: "/notes", color: "text-amber-400" },
    { label: "Settings", icon: Settings, href: "/settings", color: "text-purple-400" },
];

export function AppSidebar() {
    const pathname = usePathname();
    // We need to fetch stats. Since this is a client component, we might need a wrapper or useEffect.
    // However, AppSidebar is marked "use client" but in Next.js App Router we can't easily async await in client components for server actions in render body.
    // Let's make it a presentation component that accepts props, OR fetch in useEffect.
    // For simplicity in this codebase structure: use client fetching or convert to server component?
    // "use client" is at top.

    // Let's cheat slightly and use a client swr-like effect or just hardcode visually for now?
    // No, let's do it right. We'll use a simple useEffect to fetch stats.

    const [userStats, setUserStats] = useState<{ name: string, title: string, level: number, rank: string } | null>(null);

    useEffect(() => {
        // Dynamic import to avoid server-action-in-client-bundle issues if any, though direct import usually works
        import("@/lib/actions").then(async (mod) => {
            const stats = await mod.getStats();
            const user = await mod.getUser();
            setUserStats({
                name: user.name,
                title: user.title,
                level: stats.level,
                rank: stats.rank
            });
        });
    }, []);

    return (
        <div className="hidden md:flex flex-col h-full glass border-r border-white/5 text-white w-64 fixed left-0 top-0 bottom-0 z-50">
            <div className="px-6 py-8 flex-1">
                <Link href="/" className="flex items-center gap-3 mb-10 pl-2">
                    <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-lg font-bold tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Student OS</h1>
                        <span className="text-[10px] text-zinc-500 font-mono">v3.1 QUANTUM</span>
                    </div>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-xl transition duration-200",
                                pathname === route.href
                                    ? "bg-white/10 text-white shadow-lg"
                                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="px-6 py-6 border-t border-white/5 bg-black/20">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500 flex items-center justify-center text-xs font-bold ring-2 ring-white/10">
                        {userStats?.level || 1}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium truncate">{userStats?.name || "Student"}</span>
                        <div className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs text-zinc-400 truncate">{userStats?.rank || "Novice"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
