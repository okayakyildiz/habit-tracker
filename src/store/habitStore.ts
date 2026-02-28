"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Habit, HabitLog, CategoryId } from "@/lib/types";
import { generateId, today } from "@/lib/utils";

interface HabitStore {
  habits: Habit[];
  logs: HabitLog[];

  // Habit CRUD
  addHabit: (data: { name: string; categoryId: CategoryId; goalTarget?: number; goalUnit?: string }) => void;
  deleteHabit: (id: string) => void;

  // Log
  toggleLog: (habitId: string, date: string) => void;
  setLogValue: (habitId: string, date: string, value: number) => void;

  // Selectors
  getLogForDate: (habitId: string, date: string) => HabitLog | undefined;
  getTodayStats: () => { total: number; completed: number };
}

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      habits: [],
      logs: [],

      addHabit: (data) => {
        const newHabit: Habit = {
          id: generateId(),
          name: data.name,
          categoryId: data.categoryId,
          goalTarget: data.goalTarget,
          goalUnit: data.goalUnit,
          createdAt: today(),
        };
        set((s) => ({ habits: [...s.habits, newHabit] }));
      },

      deleteHabit: (id) => {
        set((s) => ({
          habits: s.habits.filter((h) => h.id !== id),
          logs: s.logs.filter((l) => l.habitId !== id),
        }));
      },

      toggleLog: (habitId, date) => {
        const existing = get().logs.find(
          (l) => l.habitId === habitId && l.date === date
        );
        if (existing) {
          set((s) => ({
            logs: s.logs.map((l) =>
              l.habitId === habitId && l.date === date
                ? { ...l, completed: !l.completed }
                : l
            ),
          }));
        } else {
          set((s) => ({
            logs: [...s.logs, { habitId, date, completed: true }],
          }));
        }
      },

      setLogValue: (habitId, date, value) => {
        const existing = get().logs.find(
          (l) => l.habitId === habitId && l.date === date
        );
        if (existing) {
          set((s) => ({
            logs: s.logs.map((l) =>
              l.habitId === habitId && l.date === date
                ? { ...l, value, completed: value > 0 }
                : l
            ),
          }));
        } else {
          set((s) => ({
            logs: [
              ...s.logs,
              { habitId, date, value, completed: value > 0 },
            ],
          }));
        }
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
    }),
    { name: "habit-tracker-store" }
  )
);
