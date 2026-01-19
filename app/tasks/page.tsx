"use client";

import { getTasks } from "@/lib/actions";
import { TaskFeed } from "@/components/tasks/task-feed";
import { useQuery } from "@tanstack/react-query";

export default function TasksPage() {
    const { data: tasks, isLoading } = useQuery({
        queryKey: ["tasks"],
        queryFn: () => getTasks(),
    });

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
                <p className="text-muted-foreground">Manage your flow.</p>
            </div>

            {isLoading ? (
                <div>Loading tasks...</div>
            ) : (
                <TaskFeed initialTasks={tasks || []} />
            )}
        </div>
    );
}
