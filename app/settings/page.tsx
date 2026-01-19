"use client";

export default function SettingsPage() {
    return (
        <div className="p-8 space-y-8 text-white">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-zinc-400">Manage your workspace preferences.</p>
            </div>

            <div className="space-y-4">
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                    <h3 className="text-lg font-medium mb-2">Data Management</h3>
                    <p className="text-sm text-zinc-400">
                        Your data is stored locally in <code className="bg-black/20 px-1 rounded">data.json</code> in the project folder.
                        This makes it easy to backup or sync via Git.
                    </p>
                    <button className="mt-4 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-sm transition font-medium disabled:opacity-50" disabled>
                        Clear All Data (Coming Soon)
                    </button>
                </div>

                <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                    <h3 className="text-lg font-medium mb-2">About</h3>
                    <p className="text-sm text-zinc-400">
                        Student Flow OS v2.1.0
                    </p>
                    <p className="text-xs text-zinc-500 mt-2">
                        Built with Next.js 16 + JSON + Tailwind + Framer Motion
                    </p>
                </div>
            </div>
        </div>
    );
}
