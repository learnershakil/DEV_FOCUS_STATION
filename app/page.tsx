import { getUser, getStats, getTasks } from "@/lib/actions";
import { GraduationCap, Trophy, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { MainTimerDisplay } from "@/components/main-timer-display";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const user = await getUser();
    const stats = await getStats();
    const tasks = await getTasks();

    // Get upcoming tasks (simple filter for now)
    const upcomingTasks = tasks
        .filter(t => t.status === 'todo')
        .slice(0, 3);

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto mb-20 md:mb-0">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <div className="flex items-center gap-2 text-zinc-400 mb-2">
                        <GraduationCap className="h-4 w-4" />
                        <span className="text-sm font-medium tracking-wide uppercase">{user.title}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                        {greeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">{user.name}</span>.
                    </h1>
                    <p className="text-zinc-400 mt-2 text-lg">Ready to flow?</p>
                </div>

                <div className="glass px-6 py-3 rounded-2xl flex items-center gap-4">
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-zinc-500 uppercase font-bold">Streak</span>
                        <div className="flex items-center gap-1 text-yellow-400">
                            <span className="text-xl font-bold">{stats.streak}</span>
                            <span className="text-xs">days</span>
                        </div>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-zinc-500 uppercase font-bold">XP</span>
                        <div className="flex items-center gap-1 text-blue-400">
                            <span className="text-xl font-bold">{stats.tasksCompleted * 10}</span>
                            <span className="text-xs">pts</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Timer Area */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card rounded-3xl p-8 relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
                        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-blue-500/5" />
                        <MainTimerDisplay />
                    </div>

                    {/* Quick Actions / Categories */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['Academic', 'Freelance', 'Club', 'Personal'].map((cat) => (
                            <div key={cat} className="glass p-4 rounded-xl hover:bg-white/5 transition cursor-pointer group">
                                <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider group-hover:text-primary transition-colors">{cat}</span>
                                <div className="mt-1 text-2xl font-semibold text-white">
                                    {tasks.filter(t => t.tag === cat && t.status === 'todo').length}
                                </div>
                                <span className="text-xs text-zinc-400">active tasks</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Sidebar: Upcoming */}
                <div className="space-y-6">
                    <div className="glass rounded-2xl p-6 h-full">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-zinc-400" />
                                Up Next
                            </h3>
                            <Link href="/tasks" className="text-xs text-primary hover:underline">View all</Link>
                        </div>

                        <div className="space-y-4">
                            {upcomingTasks.map(task => (
                                <div key={task.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition group">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[10px] px-2 py-1 rounded-full border ${task.tag === 'Academic' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                            task.tag === 'Freelance' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                                task.tag === 'Club' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                                                    'bg-zinc-500/10 border-zinc-500/20 text-zinc-400'
                                            }`}>
                                            {task.tag}
                                        </span>
                                        {task.priority === 'high' && <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />}
                                    </div>
                                    <h4 className="font-medium text-zinc-200 group-hover:text-white transition-colors">{task.title}</h4>
                                </div>
                            ))}

                            {upcomingTasks.length === 0 && (
                                <div className="text-center py-10 text-zinc-500">
                                    <Trophy className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                    <p>All caught up!</p>
                                </div>
                            )}

                            <Link href="/tasks" className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 transition text-sm font-medium mt-4">
                                Add New Task <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
