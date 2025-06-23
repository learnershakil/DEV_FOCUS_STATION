import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Force dynamic rendering
export const dynamic = "force-dynamic";

const dataPath = path.join(process.cwd(), "data.json");

export interface TodoItem {
  id: string;
  text: string;
  timeRemaining: number; // in seconds
  isRunning: boolean;
  isCompleted: boolean;
  completedIn?: number; // time taken to complete in seconds
  createdAt: number;
  originalTime: number; // Add this to track original time
}

export interface AppData {
  mainTimer: number; // 36 hours in seconds (129600)
  mainTimerStarted: number; // timestamp when started
  isMainTimerRunning: boolean;
  todos: TodoItem[];
  notes: string;
}

async function ensureDataFile(): Promise<AppData> {
  try {
    const data = await fs.readFile(dataPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist, create default data
    const defaultData: AppData = {
      mainTimer: 24 * 60 * 60, // 24 hours in seconds
      mainTimerStarted: Date.now(),
      isMainTimerRunning: false,
      todos: [],
      notes: "",
    };
    await fs.writeFile(dataPath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
}

export async function GET() {
  try {
    const data = await ensureDataFile();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const updatedData = await request.json();

    // Ensure the data directory exists
    const dir = path.dirname(dataPath);
    await fs.mkdir(dir, { recursive: true });

    await fs.writeFile(dataPath, JSON.stringify(updatedData, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      {
        error: "Failed to save data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
