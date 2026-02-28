"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useHabitStore } from "@/store/habitStore";
import { CATEGORIES, type CategoryId } from "@/lib/types";

interface Props {
  onClose: () => void;
}

export function AddHabitModal({ onClose }: Props) {
  const addHabit = useHabitStore((s) => s.addHabit);

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<CategoryId>("saglik");
  const [hasGoal, setHasGoal] = useState(false);
  const [goalTarget, setGoalTarget] = useState("");
  const [goalUnit, setGoalUnit] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addHabit({
      name: name.trim(),
      categoryId,
      goalTarget: hasGoal && goalTarget ? parseFloat(goalTarget) : undefined,
      goalUnit: hasGoal && goalUnit ? goalUnit.trim() : undefined,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(43,42,42,0.4)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="fade-in w-full max-w-md rounded-3xl p-6 shadow-2xl"
        style={{ background: "#FFFFFF" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold" style={{ color: "#2B2A2A" }}>
            Yeni Alışkanlık
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100"
          >
            <X size={18} style={{ color: "#999" }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#999" }}>
              Alışkanlık adı
            </label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ör. Sabah koşusu"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                border: "1.5px solid #E8E4E4",
                color: "#2B2A2A",
                background: "#F5F2F2",
              }}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#999" }}>
              Kategori
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    border: `1.5px solid ${categoryId === cat.id ? "#5A7ACD" : "#E8E4E4"}`,
                    background: categoryId === cat.id ? "#EBF0FA" : "#FAFAFA",
                    color: categoryId === cat.id ? "#5A7ACD" : "#2B2A2A",
                  }}
                >
                  <span>{cat.icon}</span>
                  <span className="text-xs">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Goal toggle */}
          <div
            className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer"
            style={{ border: "1.5px solid #E8E4E4", background: "#FAFAFA" }}
            onClick={() => setHasGoal(!hasGoal)}
          >
            <span className="text-sm" style={{ color: "#2B2A2A" }}>
              Günlük hedef ekle
            </span>
            <div
              className="w-10 h-5 rounded-full relative transition-all"
              style={{ background: hasGoal ? "#5A7ACD" : "#E8E4E4" }}
            >
              <div
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
                style={{ left: hasGoal ? "22px" : "2px" }}
              />
            </div>
          </div>

          {/* Goal inputs */}
          {hasGoal && (
            <div className="flex gap-2 fade-in">
              <div className="flex-1">
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#999" }}>
                  Hedef miktar
                </label>
                <input
                  type="number"
                  min={1}
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(e.target.value)}
                  placeholder="20"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ border: "1.5px solid #E8E4E4", color: "#2B2A2A", background: "#F5F2F2" }}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#999" }}>
                  Birim
                </label>
                <input
                  type="text"
                  value={goalUnit}
                  onChange={(e) => setGoalUnit(e.target.value)}
                  placeholder="sayfa, dakika..."
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ border: "1.5px solid #E8E4E4", color: "#2B2A2A", background: "#F5F2F2" }}
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all mt-2"
            style={{
              background: name.trim() ? "#5A7ACD" : "#C5D3F0",
              cursor: name.trim() ? "pointer" : "not-allowed",
            }}
          >
            Alışkanlık Ekle
          </button>
        </form>
      </div>
    </div>
  );
}
