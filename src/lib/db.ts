import { supabase } from "./supabase";
import type { Habit, HabitLog, CategoryId } from "./types";
import { generateId } from "./utils";

// ── Habits ────────────────────────────────────────────────

export async function fetchHabits(): Promise<Habit[]> {
  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    categoryId: r.category_id as CategoryId,
    goalTarget: r.goal_target ?? undefined,
    goalUnit: r.goal_unit ?? undefined,
    createdAt: r.created_at,
  }));
}

export async function insertHabit(habit: Omit<Habit, "id" | "createdAt">): Promise<Habit> {
  const id = generateId();
  const { data, error } = await supabase
    .from("habits")
    .insert({
      id,
      name: habit.name,
      category_id: habit.categoryId,
      goal_target: habit.goalTarget ?? null,
      goal_unit: habit.goalUnit ?? null,
      frequency: "daily",
    })
    .select()
    .single();
  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    categoryId: data.category_id as CategoryId,
    goalTarget: data.goal_target ?? undefined,
    goalUnit: data.goal_unit ?? undefined,
    createdAt: data.created_at,
  };
}

export async function deleteHabitDb(id: string): Promise<void> {
  const { error } = await supabase.from("habits").delete().eq("id", id);
  if (error) throw error;
}

// ── Logs ─────────────────────────────────────────────────

export async function fetchLogsForDate(date: string): Promise<HabitLog[]> {
  const { data, error } = await supabase
    .from("habit_logs")
    .select("*")
    .eq("date", date);
  if (error) throw error;
  return (data ?? []).map((r) => ({
    habitId: r.habit_id,
    date: r.date,
    completed: r.completed,
    value: r.value ?? undefined,
  }));
}

export async function fetchAllLogs(): Promise<HabitLog[]> {
  const { data, error } = await supabase
    .from("habit_logs")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    habitId: r.habit_id,
    date: r.date,
    completed: r.completed,
    value: r.value ?? undefined,
  }));
}

export async function upsertLog(log: HabitLog): Promise<void> {
  const { error } = await supabase.from("habit_logs").upsert(
    {
      habit_id: log.habitId,
      date: log.date,
      completed: log.completed,
      value: log.value ?? null,
    },
    { onConflict: "habit_id,date" }
  );
  if (error) throw error;
}
