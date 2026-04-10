"use client";

import { useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from "recharts";
import { getStats, getTasks } from "@/lib/actions"; // We'll need a wrapper or call direct if server actions allowed

export default function AnalyticsPage() {
    const [stats, setStats] = useState<any>(null);
    const [taskData, setTaskData] = useState<any[]>([]);

    useEffect(() => {
        // Fetch data
        Promise.all([
            import("@/lib/actions").then(mod => mod.getStats()),
            import("@/lib/actions").then(mod => mod.getTasks())
        ]).then(([s, t]) => {
            setStats(s);

            // Process tags for Pie Chart
            const tags: Record<string, number> = {};
            t.forEach((task: any) => {
                tags[task.tag] = (tags[task.tag] || 0) + 1;
            });
            const pieData = Object.keys(tags).map(key => ({ name: key, value: tags[key] }));
            setTaskData(pieData);
        });
    }, []);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    // Mock Weekly Data (since we don't have historical data structure yet)
    const weeklyData = [
        { name: 'Mon', minutes: 120 },
        { name: 'Tue', minutes: 200 },
        { name: 'Wed', minutes: 150 },
        { name: 'Thu', minutes: 280 },
        { name: 'Fri', minutes: 90 },
        { name: 'Sat', minutes: 60 },
        { name: 'Sun', minutes: 300 },
    ];

    if (!stats) return <div className="p-8 text-zinc-500">Loading insights...</div>;

    return (
        <div className="p-8 space-y-8 text-white max-w-7xl mx-auto mb-24 md:mb-0">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Analytics Engine</h2>
                <p className="text-zinc-400">Deep dive into your productivity metrics.</p>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/5">
                    <h3 className="text-zinc-400 text-sm font-medium uppercase">Current Rank</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-indigo-400">{stats.rank}</span>
                        <span className="text-sm text-zinc-500">Lvl {stats.level}</span>
                    </div>
                </div>
                <div className="glass p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
                    <h3 className="text-zinc-400 text-sm font-medium uppercase">Total XP</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-emerald-400">{stats.tasksCompleted * 100}</span>
                        <span className="text-sm text-zinc-500">points</span>
                    </div>
                </div>
                <div className="glass p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5">
                    <h3 className="text-zinc-400 text-sm font-medium uppercase">Focus Consistency</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-amber-400">{stats.streak}</span>
                        <span className="text-sm text-zinc-500">day streak</span>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bar Chart */}
                <div className="glass p-6 rounded-2xl min-h-[400px] flex flex-col">
                    <h3 className="text-lg font-semibold mb-6 pl-2 border-l-4 border-blue-500">Weekly Focus Output</h3>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                                    cursor={{ fill: '#ffffff10' }}
                                />
                                <Bar dataKey="minutes" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="glass p-6 rounded-2xl min-h-[400px] flex flex-col">
                    <h3 className="text-lg font-semibold mb-6 pl-2 border-l-4 border-purple-500">Task Distribution</h3>
                    <div className="flex-1 w-full relative">
                        {taskData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={taskData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {taskData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
                                No tasks data available
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
