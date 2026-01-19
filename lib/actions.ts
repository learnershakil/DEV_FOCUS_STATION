"use server";

import { readDB, writeDB, Task, Note } from "./db";
import { revalidatePath } from "next/cache";

// --- TASKS ---

export async function getTasks() {
  const db = await readDB();
  return db.tasks;
}

export async function createTask(data: { title: string; tag: Task["tag"]; priority?: Task["priority"] }) {
  const db = await readDB();
  const newTask: Task = {
    id: crypto.randomUUID(),
    title: data.title,
    tag: data.tag,
    priority: data.priority || "medium",
    status: "todo",
    createdAt: new Date().toISOString(),
  };
  
  db.tasks.unshift(newTask);
  await writeDB(db);
  revalidatePath("/tasks");
  return newTask;
}

export async function updateTaskStatus(id: string, status: Task["status"]) {
  const db = await readDB();
  const taskIndex = db.tasks.findIndex((t) => t.id === id);
  
  if (taskIndex > -1) {
    db.tasks[taskIndex].status = status;
    if (status === "done") {
        db.stats.tasksCompleted += 1;
    }
    await writeDB(db);
    revalidatePath("/tasks");
  }
}

export async function deleteTask(id: string) {
  const db = await readDB();
  db.tasks = db.tasks.filter((t) => t.id !== id);
  await writeDB(db);
  revalidatePath("/tasks");
}

// --- NOTES ---

export async function getNotes() {
    const db = await readDB();
    return db.notes;
}

export async function createNote() {
    const db = await readDB();
    const newNote: Note = {
        id: crypto.randomUUID(),
        title: "Untitled Note",
        content: "",
        updatedAt: new Date().toISOString(),
    };
    db.notes.unshift(newNote);
    await writeDB(db);
    revalidatePath("/notes");
    return newNote;
}

export async function updateNote(id: string, data: { title?: string; content?: string }) {
    const db = await readDB();
    const noteIndex = db.notes.findIndex(n => n.id === id);
    if (noteIndex > -1) {
        db.notes[noteIndex] = { ...db.notes[noteIndex], ...data, updatedAt: new Date().toISOString() };
        await writeDB(db);
        revalidatePath("/notes");
    }
}

export async function deleteNote(id: string) {
    const db = await readDB();
    db.notes = db.notes.filter(n => n.id !== id);
    await writeDB(db);
    revalidatePath("/notes");
}

// --- USER & STATS ---

export async function getUser() {
    const db = await readDB();
    return db.user;
}

export async function getStats() {
    const db = await readDB();
    return db.stats;
}

// --- TIMER SYNC ---

export async function getTimerState() {
    const db = await readDB();
    return db.activeSession || null;
}

export async function startFocusSession(duration: number) {
    const db = await readDB();
    db.activeSession = {
        startTime: Date.now(),
        duration: duration,
        status: "running"
    };
    await writeDB(db);
    return db.activeSession;
}

export async function pauseFocusSession() {
    const db = await readDB();
    if (db.activeSession && db.activeSession.status === "running") {
        db.activeSession.status = "paused";
        db.activeSession.pausedAt = Date.now();
        await writeDB(db);
    }
}

export async function resumeFocusSession() {
    const db = await readDB();
    if (db.activeSession && db.activeSession.status === "paused" && db.activeSession.pausedAt) {
        // Adjust start time to account for pause duration
        const pauseDuration = Date.now() - db.activeSession.pausedAt;
        db.activeSession.startTime += pauseDuration;
        db.activeSession.status = "running";
        db.activeSession.pausedAt = undefined;
        await writeDB(db);
    }
}

export async function stopFocusSession() {
    const db = await readDB();
    db.activeSession = undefined;
    await writeDB(db);
}

export async function logFocusSession(durationMinutes: number) {
    const db = await readDB();
    // Simple XP logic: 10 points per minute? Or just per session.
    // Let's say 1 session = 1 streak increment if not already done today (logic simplified for now)
    db.stats.tasksCompleted += 1; // Increment simplified XP
    await writeDB(db);
    console.log(`Session completed: ${durationMinutes}m`);
}
