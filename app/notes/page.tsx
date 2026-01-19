"use client";

import { getNotes } from "@/lib/actions";
import { NotesApp } from "@/components/notes/notes-app";
import { useQuery } from "@tanstack/react-query";

export default function NotesPage() {
    const { data: notes, isLoading } = useQuery({
        queryKey: ["notes"],
        queryFn: () => getNotes(),
    });

    return (
        <div className="h-screen max-h-screen overflow-hidden flex flex-col">
            <div className="p-6 border-b border-zinc-800">
                <h2 className="text-2xl font-bold tracking-tight">Notes</h2>
            </div>
            <div className="flex-1 overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-zinc-500">Loading notes...</div>
                ) : (
                    <NotesApp initialNotes={notes || []} />
                )}
            </div>
        </div>
    );
}
