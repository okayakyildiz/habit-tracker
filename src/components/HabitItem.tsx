"use client";

import { Trash2 } from "lucide-react";
import { useHabitStore } from "@/store/habitStore";
import { CATEGORIES } from "@/lib/types";
import { today } from "@/lib/utils";

interface Props {
  habitId: string;
}

export function HabitItem({ habitId }: Props) {
  const habit = useHabitStore((s) => s.habits.find((h) => h.id === habitId));
  const log = useHabitStore((s) => s.getLogForDate(habitId, today()));
  const toggleLog = useHabitStore((s) => s.toggleLog);
  const setLogValue = useHabitStore((s) => s.setLogValue);
  const deleteHabit = useHabitStore((s) => s.deleteHabit);

  if (!habit) return null;

  const category = CATEGORIES.find((c) => c.id === habit.categoryId)!;
  const isCompleted = log?.completed ?? false;
  const t = today();

  const progress =
    habit.goalTarget && log?.value
      ? Math.min(100, (log.value / habit.goalTarget) * 100)
      : isCompleted
      ? 100
      : 0;

  return (
    <div
      className="fade-in flex items-center gap-3 p-4 rounded-2xl transition-all"
      style={{
        background: isCompleted ? "#FFF8EE" : "#FFFFFF",
        border: `1.5px solid ${isCompleted ? "#FEB05D" : "#E8E4E4"}`,
      }}
    >
      {/* Checkbox */}
      <button
        onClick={() => toggleLog(habit.id, t)}
        className="shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all"
        style={{
          borderColor: isCompleted ? "#FEB05D" : "#5A7ACD",
          background: isCompleted ? "#FEB05D" : "transparent",
        }}
        aria-label="Tamamla"
      >
        {isCompleted && (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="font-medium text-sm truncate"
            style={{
              color: "#2B2A2A",
              textDecoration: isCompleted ? "line-through" : "none",
              opacity: isCompleted ? 0.6 : 1,
            }}
          >
            {habit.name}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
            style={{ background: category.color, color: category.textColor }}
          >
            {category.icon} {category.label}
          </span>
        </div>

        {/* Goal input or progress bar */}
        {habit.goalTarget ? (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#E8E4E4" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background: progress >= 100 ? "#FEB05D" : "#5A7ACD",
                }}
              />
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <input
                type="number"
                min={0}
                max={habit.goalTarget * 2}
                value={log?.value ?? ""}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  if (!isNaN(v)) setLogValue(habit.id, t, v);
                }}
                className="w-12 text-xs text-center rounded-lg px-1 py-0.5 outline-none"
                style={{ border: "1px solid #E8E4E4", color: "#2B2A2A", background: "#F5F2F2" }}
                placeholder="0"
              />
              <span className="text-xs" style={{ color: "#999" }}>
                / {habit.goalTarget} {habit.goalUnit}
              </span>
            </div>
          </div>
        ) : null}
      </div>

      {/* Delete */}
      <button
        onClick={() => deleteHabit(habit.id)}
        className="shrink-0 p-1.5 rounded-lg transition-colors hover:bg-red-50"
        style={{ color: "#ccc" }}
        aria-label="Sil"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
