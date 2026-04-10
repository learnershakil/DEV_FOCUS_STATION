"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "cmdk";
import { Calculator, Calendar, CreditCard, Settings, User, Smile, Monitor, CheckSquare, StickyNote, BarChart2 } from "lucide-react";
import { useEffect, useState } from "react";

export function CommandMenu() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const run = (fn: () => void) => {
        fn();
        setOpen(false);
    }

    return (
        <CommandDialog open={open} onOpenChange={setOpen} label="Global Command Menu">
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm">
                <div className="w-full max-w-lg rounded-xl border border-white/10 bg-[#0a0a0a50] backdrop-blur-xl shadow-2xl overflow-hidden p-2">
                    <CommandInput
                        placeholder="Type a command or search..."
                        className="w-full bg-transparent border-none p-3 text-lg text-white placeholder:text-zinc-500 focus:outline-none"
                    />
                    <CommandList className="max-h-[300px] overflow-y-auto mt-2 custom-scrollbar">
                        <CommandEmpty className="p-4 text-center text-sm text-zinc-500">No results found.</CommandEmpty>

                        <CommandGroup heading="Navigation" className="text-xs text-zinc-500 font-medium px-2 py-1.5 mb-1">
                            <CommandItem onSelect={() => run(() => router.push("/"))} className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-zinc-300 hover:bg-white/10 hover:text-white cursor-pointer transition-colors aria-selected:bg-white/10 aria-selected:text-white">
                                <Monitor className="mr-2 h-4 w-4" />
                                <span>Dashboard</span>
                            </CommandItem>
                            <CommandItem onSelect={() => run(() => router.push("/focus"))} className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-zinc-300 hover:bg-white/10 hover:text-white cursor-pointer transition-colors aria-selected:bg-white/10 aria-selected:text-white">
                                <Smile className="mr-2 h-4 w-4" />
                                <span>Focus Mode</span>
                            </CommandItem>
                            <CommandItem onSelect={() => run(() => router.push("/analytics"))} className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-zinc-300 hover:bg-white/10 hover:text-white cursor-pointer transition-colors aria-selected:bg-white/10 aria-selected:text-white">
                                <BarChart2 className="mr-2 h-4 w-4" />
                                <span>Analytics</span>
                            </CommandItem>
                            <CommandItem onSelect={() => run(() => router.push("/tasks"))} className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-zinc-300 hover:bg-white/10 hover:text-white cursor-pointer transition-colors aria-selected:bg-white/10 aria-selected:text-white">
                                <CheckSquare className="mr-2 h-4 w-4" />
                                <span>Tasks</span>
                            </CommandItem>
                            <CommandItem onSelect={() => run(() => router.push("/notes"))} className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-zinc-300 hover:bg-white/10 hover:text-white cursor-pointer transition-colors aria-selected:bg-white/10 aria-selected:text-white">
                                <StickyNote className="mr-2 h-4 w-4" />
                                <span>Notes</span>
                            </CommandItem>
                        </CommandGroup>

                        <CommandSeparator className="h-px bg-white/5 my-2" />

                        <CommandGroup heading="System" className="text-xs text-zinc-500 font-medium px-2 py-1.5 mb-1">
                            <CommandItem onSelect={() => run(() => router.push("/settings"))} className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-zinc-300 hover:bg-white/10 hover:text-white cursor-pointer transition-colors aria-selected:bg-white/10 aria-selected:text-white">
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </div>
            </div>
        </CommandDialog>
    );
}
