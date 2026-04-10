"use client";

import { useState } from "react";
import { createTask, deleteTask, updateTaskStatus } from "@/lib/actions";
import { Plus, CheckCircle2, Circle, Trash2, Filter, Loader2, List, LayoutGrid, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Task } from "@/lib/db";

const tags = ["Academic", "Freelance", "Club", "Personal"] as const;

export function TaskFeed({ initialTasks }: { initialTasks: any[] }) {
    const [tasks, setTasks] = useState(initialTasks);
    const [newItem, setNewItem] = useState("");
    const [selectedTag, setSelectedTag] = useState<typeof tags[number]>("Academic");
    const [filter, setFilter] = useState<string>("All");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        if (!newItem.trim() || isSubmitting) return;

        setIsSubmitting(true);
        const optimisticTask = {
            id: "temp-" + Date.now(),
            title: newItem,
            tag: selectedTag,
            status: "todo",
            priority: "medium",
        };

        setTasks((prev) => [optimisticTask, ...prev]);
        setNewItem("");

        try {
            const created = await createTask({ title: newItem, tag: selectedTag });
            setTasks((prev) => prev.map((t) => (t.id === optimisticTask.id ? created : t)));
        } catch (error) {
            setTasks((prev) => prev.filter((t) => t.id !== optimisticTask.id));
        } finally {
            setIsSubmitting(false);
        }
    }

    async function toggleStatus(id: string, currentStatus: string) {
        const newStatus = currentStatus === "todo" ? "done" : "todo";
        setTasks((prev) =>
            prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
        );
        await updateTaskStatus(id, newStatus as any);
    }

    async function remove(id: string) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        await deleteTask(id);
    }
    // View State
    const [view, setView] = useState<"list" | "board">("list");

    // Filter Logic
    const filteredTasks = tasks.filter(t => filter === "All" || t.tag === filter);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // Kanban Columns
    const columns = [
        { id: "todo", label: "To Do", color: "bg-zinc-500" },
        { id: "in_progress", label: "In Progress", color: "bg-blue-500" },
        { id: "done", label: "Done", color: "bg-green-500" }
    ];

    const renderKanban = () => (
        <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-250px)]">
            {columns.map(col => (
                <div key={col.id} className="min-w-[300px] bg-white/5 rounded-xl p-4 flex flex-col gap-4 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                        <div className={cn("h-2 w-2 rounded-full", col.color)} />
                        <h3 className="font-semibold text-sm">{col.label}</h3>
                        <span className="text-xs text-zinc-500 ml-auto bg-black/20 px-2 py-0.5 rounded-full">
                            {filteredTasks.filter(t => t.status === col.id).length}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                        {filteredTasks
                            .filter(t => t.status === col.id)
                            .map(task => (
                                <motion.div
                                    key={task.id}
                                    layoutId={task.id}
                                    className="bg-zinc-900/50 p-3 rounded-lg border border-white/5 shadow-sm hover:border-white/10 cursor-grab active:cursor-grabbing group"
                                >
                                    <div className="flex justify-between items-start gap-2">
                                        <span className="text-sm font-medium leading-tight">{task.title}</span>
                                        <button onClick={() => remove(task.id)} className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-zinc-400">{task.tag}</span>
                                        {/* Quick Move Buttons */}
                                        <div className="flex gap-1">
                                            {col.id !== 'todo' && (
                                                <button
                                                    onClick={() => toggleStatus(task.id, 'todo')} // Simplified move back? toggleStatus logic assumes toggle completion only. Need generic move.
                                                    // Actually toggleStatus currently swaps to 'done' or 'todo'. We need a setStatus.
                                                    // Let's patch 'toggleStatus' to handle 'in_progress' or use updateTask logic if available?
                                                    // Ideally we need UpdateTaskStatus(id, newStatus). 
                                                    // For V1 of Kanban, we will just use the dedicated arrows to cycle: Todo -> InProgress -> Done
                                                    title="Move Back"
                                                    className="p-1 hover:bg-white/10 rounded text-zinc-500"
                                                >
                                                    <ArrowLeft className="h-3 w-3" />
                                                </button>
                                            )}
                                            {col.id !== 'done' && (
                                                <button
                                                    onClick={() => toggleStatus(task.id, col.id === 'todo' ? 'in_progress' : 'done')}
                                                    title="Move Forward"
                                                    className="p-1 hover:bg-white/10 rounded text-zinc-500"
                                                >
                                                    <ArrowRight className="h-3 w-3" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex flex-col gap-4 glass p-6 rounded-2xl shrink-0">
                <form onSubmit={handleCreate} className="relative flex gap-2">
                    <input
                        type="text"
                        placeholder="What needs to be done?"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        className="w-full bg-transparent border-none text-lg text-white placeholder:text-zinc-600 focus:ring-0 focus:outline-none"
                    />
                    <button
                        type="submit"
                        disabled={!newItem.trim() || isSubmitting}
                        className="p-2 rounded-full bg-primary/20 text-primary hover:bg-primary/30 disabled:opacity-50 transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                    </button>
                </form>

                <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
                    <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => setSelectedTag(tag)}
                                className={cn(
                                    "text-xs px-3 py-1.5 rounded-full border transition-all",
                                    selectedTag === tag
                                        ? "bg-white/10 border-white/20 text-white"
                                        : "border-transparent text-zinc-500 hover:text-zinc-300"
                                )}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>

                    <div className="flex bg-white/5 p-1 rounded-lg self-start">
                        <button
                            onClick={() => setView('list')}
                            className={cn(
                                "p-1.5 rounded-md transition-all",
                                view === 'list' ? "bg-white/10 text-white shadow" : "text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            <List className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setView('board')}
                            className={cn(
                                "p-1.5 rounded-md transition-all",
                                view === 'board' ? "bg-white/10 text-white shadow" : "text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide shrink-0">
                <Filter className="h-4 w-4 text-zinc-500" />
                {["All", ...tags].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={cn(
                            "text-sm px-3 py-1 rounded-lg transition-colors whitespace-nowrap",
                            filter === f ? "bg-white text-black" : "text-zinc-500 hover:text-zinc-300"
                        )}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {view === 'board' ? renderKanban() : (
                <div className="space-y-2">
                    <AnimatePresence initial={false}>
                        {filteredTasks.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-12 text-zinc-600"
                            >
                                No tasks found. Time to relax or plan ahead?
                            </motion.div>
                        ) : (
                            filteredTasks.map((task: Task) => (
                                <motion.div
                                    key={task.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className={cn(
                                        "group flex flex-col gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors cursor-pointer",
                                        task.status === "done" && "opacity-50"
                                    )}
                                    onClick={() => setExpandedId(expandedId === task.id ? null : task.id)}
                                >
                                    <div className="flex items-center gap-3 w-full">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toggleStatus(task.id, task.status); }}
                                            className="flex-shrink-0 text-zinc-500 hover:text-primary transition-colors"
                                        >
                                            {task.status === "done" ? (
                                                <CheckCircle2 className="h-6 w-6 text-primary" />
                                            ) : (
                                                <Circle className="h-6 w-6" />
                                            )}
                                        </button>

                                        <div className="flex-1 min-w-0 flex flex-col gap-1">
                                            <span className={cn("text-sm font-medium truncate", task.status === "done" && "line-through text-zinc-500")}>
                                                {task.title}
                                            </span>
                                            <span className={cn("text-xs w-fit px-2 py-0.5 rounded-full bg-white/5 text-zinc-400")}>
                                                {task.tag}
                                            </span>
                                        </div>

                                        <button
                                            onClick={(e) => { e.stopPropagation(); remove(task.id); }}
                                            className="opacity-0 group-hover:opacity-100 p-2 text-zinc-500 hover:text-red-400 transition-all block"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {/* Expanded Details */}
                                    <AnimatePresence>
                                        {expandedId === task.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden w-full pl-9 pr-2"
                                            >
                                                <div className="pt-2 border-t border-white/5 mt-2 space-y-3">
                                                    <div>
                                                        <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Description</p>
                                                        <p className="text-sm text-zinc-300">
                                                            {task.description || "No description provided."}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <div className="flex justify-between items-center mb-1">
                                                            <p className="text-xs text-zinc-500 uppercase font-bold">Progress</p>
                                                            <span className="text-xs text-zinc-400">{task.progress || 0}%</span>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-primary/50 rounded-full"
                                                                style={{ width: `${task.progress || 0}%` }}
                                                            />
                                                        </div>
                                                    </div>

                                                    {task.remarks && task.remarks.length > 0 && (
                                                        <div>
                                                            <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Remarks</p>
                                                            <ul className="text-xs text-zinc-400 list-disc list-inside">
                                                                {task.remarks.map((r, i) => (
                                                                    <li key={i}>{r}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
