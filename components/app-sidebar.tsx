"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Timer, CheckSquare, FileText, Settings, LayoutDashboard, StickyNote, GraduationCap } from "lucide-react";

const routes = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/", color: "text-zinc-400" },
    { label: "Focus Mode", icon: Timer, href: "/focus", color: "text-sky-500" },
    { label: "Tasks", icon: CheckSquare, href: "/tasks", color: "text-green-400" },
    { label: "Notes", icon: StickyNote, href: "/notes", color: "text-amber-400" },
    { label: "Focus", icon: Timer, href: "/settings", color: "text-purple-400" }, // Rename href later
];

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden md:flex flex-col h-full glass border-r border-white/5 text-white w-64 fixed left-0 top-0 bottom-0 z-50">
            <div className="px-6 py-8 flex-1">
                <Link href="/" className="flex items-center gap-3 mb-10 pl-2">
                    <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <h1 className="text-lg font-bold tracking-tight">Student OS</h1>
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
            <div className="px-6 py-6 border-t border-white/5">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500" />
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">Shakil</span>
                        <span className="text-xs text-zinc-500">B.Tech CSE</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
