"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, CheckSquare, Timer, StickyNote } from "lucide-react";
import { motion } from "framer-motion";

const routes = [
    { label: "Home", icon: LayoutDashboard, href: "/" },
    { label: "Tasks", icon: CheckSquare, href: "/tasks" },
    { label: "Settings", icon: Timer, href: "/settings" }, // Re-using Timer icon for settings/focus for now or separate
    { label: "Notes", icon: StickyNote, href: "/notes" },
];

export function MobileNav() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6 md:hidden">
            <div className="glass mx-auto flex max-w-md items-center justify-around rounded-2xl p-2 shadow-xl backdrop-blur-xl">
                {routes.map((route) => {
                    const isActive = pathname === route.href;
                    return (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "relative flex flex-col items-center p-2 transition-colors",
                                isActive ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="mobile-nav-pill"
                                    className="absolute inset-0 rounded-xl bg-white/10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <route.icon className="z-10 h-5 w-5" />
                            {/* <span className="text-[10px] mt-1 z-10">{route.label}</span> */}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
