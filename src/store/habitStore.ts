"use client";

import { create } from "zustand";
import type { Habit, HabitLog, CategoryId } from "@/lib/types";
import { today } from "@/lib/utils";
import {
  fetchHabits,
  fetchAllLogs,
  insertHabit,
  deleteHabitDb,
  upsertLog,
} from "@/lib/db";

interface HabitStore {
  habits: Habit[];
  logs: HabitLog[];
  loading: boolean;

  // Init
  init: () => Promise<void>;

  // Habit CRUD
  addHabit: (data: {
    name: string;
    categoryId: CategoryId;
    goalTarget?: number;
    goalUnit?: string;
  }) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;

  // Log
  toggleLog: (habitId: string, date: string) => Promise<void>;
  setLogValue: (habitId: string, date: string, value: number) => Promise<void>;

  // Selectors
  getLogForDate: (habitId: string, date: string) => HabitLog | undefined;
  getTodayStats: () => { total: number; completed: number };
}

export const useHabitStore = create<HabitStore>((set, get) => ({
  habits: [],
  logs: [],
  loading: true,

  init: async () => {
    set({ loading: true });
    const [habits, logs] = await Promise.all([fetchHabits(), fetchAllLogs()]);
    set({ habits, logs, loading: false });
  },

  addHabit: async (data) => {
    const newHabit = await insertHabit(data);
    set((s) => ({ habits: [...s.habits, newHabit] }));
  },

  deleteHabit: async (id) => {
    await deleteHabitDb(id);
    set((s) => ({
      habits: s.habits.filter((h) => h.id !== id),
      logs: s.logs.filter((l) => l.habitId !== id),
    }));
  },

  toggleLog: async (habitId, date) => {
    const existing = get().logs.find(
      (l) => l.habitId === habitId && l.date === date
    );
    const updated: HabitLog = existing
      ? { ...existing, completed: !existing.completed }
      : { habitId, date, completed: true };

    // Optimistic update
    set((s) => ({
      logs: existing
        ? s.logs.map((l) =>
            l.habitId === habitId && l.date === date ? updated : l
          )
        : [...s.logs, updated],
    }));

    await upsertLog(updated);
  },

  setLogValue: async (habitId, date, value) => {
    const existing = get().logs.find(
      (l) => l.habitId === habitId && l.date === date
    );
    const updated: HabitLog = {
      ...(existing ?? { habitId, date }),
      completed: value > 0,
      value,
    };

    set((s) => ({
      logs: existing
        ? s.logs.map((l) =>
            l.habitId === habitId && l.date === date ? updated : l
          )
        : [...s.logs, updated],
    }));

    await upsertLog(updated);
  },

  getLogForDate: (habitId, date) =>
    get().logs.find((l) => l.habitId === habitId && l.date === date),

  getTodayStats: () => {
    const t = today();
    const { habits, logs } = get();
    const total = habits.length;
    const completed = habits.filter((h) =>
      logs.some((l) => l.habitId === h.id && l.date === t && l.completed)
    ).length;
    return { total, completed };
  },
}));
