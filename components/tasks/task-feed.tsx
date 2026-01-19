"use client";

import { useState } from "react";
import { createTask, updateTaskStatus, deleteTask } from "@/lib/actions";
import { CheckCircle2, Circle, Trash2, Plus, Filter } from "lucide-react";
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
    const filteredTasks = tasks.filter(t => filter === "All" || t.tag === filter);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 glass p-6 rounded-2xl">
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
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
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
        </div>
    );
}
