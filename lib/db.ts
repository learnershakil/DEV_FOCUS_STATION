import fs from "fs/promises";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data.json");

export interface Task {
  id: string;
  title: string;
  tag: "Academic" | "Freelance" | "Club" | "Personal";
  priority: "low" | "medium" | "high";
  status: "todo" | "in_progress" | "done" | "canceled";
  description?: string;
  progress?: number; // 0-100
  remarks?: string[];
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface ActiveSession {
    startTime: number; // Date.now()
    duration: number; // in minutes
    status: "running" | "paused";
    pausedAt?: number; // Snapshot of time when paused to calc offset
}

export interface DB {
  user: {
    name: string;
    title: string;
  };
  stats: {
    streak: number;
    tasksCompleted: number;
  };
  activeSession?: ActiveSession; // Synced timer state
  tasks: Task[];
  notes: Note[];
}

export async function readDB(): Promise<DB> {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // Return default structure if file not found
    return {
      user: { name: "Student", title: "User" },
      stats: { streak: 0, tasksCompleted: 0 },
      tasks: [],
      notes: []
    };
  }
}

export async function writeDB(data: DB) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}
