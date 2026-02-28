import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, key);

// DB row types
export interface HabitRow {
  id: string;
  name: string;
  category_id: string;
  goal_target: number | null;
  goal_unit: string | null;
  frequency: string;
  created_at: string;
}

export interface HabitLogRow {
  id: string;
  habit_id: string;
  date: string;
  completed: boolean;
  value: number | null;
  note: string | null;
  created_at: string;
}
