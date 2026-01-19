"use client";

import { useState, useEffect, useRef } from "react";
import { createNote, updateNote, deleteNote } from "@/lib/actions";
import { Plus, Trash2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";


export function NotesApp({ initialNotes }: { initialNotes: any[] }) {
    const [notes, setNotes] = useState(initialNotes);
    const [activeNoteId, setActiveNoteId] = useState<string | null>(
        initialNotes.length > 0 ? initialNotes[0].id : null
    );

    const activeNote = notes.find((n) => n.id === activeNoteId);

    const handleCreate = async () => {
        // Optimistic
        const tempId = "temp-" + Date.now();
        const newNote = {
            id: tempId,
            title: "Untitled Note",
            content: "",
            updatedAt: new Date().toISOString()
        };
        setNotes([newNote, ...notes]);
        setActiveNoteId(tempId);

        const created = await createNote();
        // Sync ID
        setNotes(prev => prev.map(n => n.id === tempId ? created : n));
        if (activeNoteId === tempId) setActiveNoteId(created.id);
    };
    return (
        <div className="flex h-[calc(100vh-8rem)] gap-6">
            {/* Sidebar */}
            <div className="w-64 flex flex-col gap-4 glass rounded-2xl p-4">
                <button
                    onClick={handleCreate}
                    className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 transition-colors font-medium"
                >
                    <Plus className="h-4 w-4" /> New Note
                </button>
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {notes.map(note => (
                        <button
                            key={note.id}
                            onClick={() => setActiveNoteId(note.id)}
                            className={cn(
                                "flex flex-col items-start gap-1 w-full p-3 rounded-xl text-left transition-all border",
                                activeNoteId === note.id
                                    ? "bg-white/10 border-white/10 text-white"
                                    : "border-transparent hover:bg-white/5 text-zinc-400 hover:text-zinc-200"
                            )}
                        >
                            <span className="font-medium text-sm truncate w-full">{note.title || "Untitled"}</span>
                            <span className="text-[10px] text-zinc-500">
                                {new Date(note.updatedAt).toLocaleDateString()}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 glass rounded-2xl p-6 flex flex-col gap-4">
                {activeNote ? (
                    <>
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <input
                                value={activeNote.title}
                                onChange={(e) => {
                                    const newTitle = e.target.value;
                                    setNotes(prev => prev.map(n => n.id === activeNote.id ? { ...n, title: newTitle } : n));
                                    updateNote(activeNote.id, { title: newTitle });
                                }}
                                placeholder="Note Title"
                                className="bg-transparent text-2xl font-bold focus:outline-none placeholder:text-zinc-600 w-full"
                            />
                            <button
                                onClick={async () => {
                                    const id = activeNote.id;
                                    setActiveNoteId(null); // Deselect first to match optimistic removal
                                    setNotes(prev => prev.filter(n => n.id !== id));
                                    await deleteNote(id);
                                }}
                                className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                        <textarea
                            value={activeNote.content}
                            onChange={(e) => {
                                const newContent = e.target.value;
                                setNotes(prev => prev.map(n => n.id === activeNote.id ? { ...n, content: newContent } : n));
                                updateNote(activeNote.id, { content: newContent });
                            }}
                            placeholder="Start typing..."
                            className="flex-1 bg-transparent resize-none focus:outline-none text-zinc-300 leading-relaxed custom-scrollbar"
                        />
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-4">
                        <FileText className="h-12 w-12 opacity-20" />
                        <p>Select a note or create a new one.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
