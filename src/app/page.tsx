"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useHabitStore } from "@/store/habitStore";
import { HabitItem } from "@/components/HabitItem";
import { AddHabitModal } from "@/components/AddHabitModal";
import { ProgressRing } from "@/components/ProgressRing";
import { CATEGORIES } from "@/lib/types";
import { today, formatDate } from "@/lib/utils";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const [mounted, setMounted] = useState(false);
  const init = useHabitStore((s) => s.init);
  const loading = useHabitStore((s) => s.loading);
  const error = useHabitStore((s) => s.error);

  useEffect(() => {
    setMounted(true);
    init();
  }, [init]);

  const habits = useHabitStore((s) => s.habits);
  const { total, completed } = useHabitStore((s) => s.getTodayStats());
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  const filtered =
    activeFilter === "all"
      ? habits
      : habits.filter((h) => h.categoryId === activeFilter);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Günaydın";
    if (h < 18) return "İyi günler";
    return "İyi akşamlar";
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F5F2F2" }}>
        <div
          className="w-8 h-8 rounded-full animate-spin"
          style={{ border: "3px solid #E8E4E4", borderTopColor: "#5A7ACD" }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "#F5F2F2" }}>
        <div className="text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="font-semibold mb-1" style={{ color: "#2B2A2A" }}>Bağlantı hatası</p>
          <p className="text-sm mb-4" style={{ color: "#999" }}>{error}</p>
          <button
            onClick={() => init()}
            className="px-5 py-2 rounded-xl text-sm font-medium text-white"
            style={{ background: "#5A7ACD" }}
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#F5F2F2" }}>
      <div className="max-w-lg mx-auto px-4 py-8 pb-28">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-sm font-medium mb-1" style={{ color: "#999" }}>
              {formatDate(today())}
            </p>
            <h1 className="text-2xl font-bold" style={{ color: "#2B2A2A" }}>
              {greeting()} 👋
            </h1>
            {total > 0 && (
              <p className="text-sm mt-1" style={{ color: "#999" }}>
                {completed === total
                  ? "Harika! Hepsini tamamladın 🎉"
                  : `${completed}/${total} alışkanlık tamamlandı`}
              </p>
            )}
          </div>

          {/* Progress Ring */}
          {total > 0 && (
            <div className="relative shrink-0">
              <ProgressRing value={percent} size={72} />
              <span
                className="absolute inset-0 flex items-center justify-center text-sm font-bold"
                style={{ color: percent === 100 ? "#FEB05D" : "#5A7ACD" }}
              >
                {percent}%
              </span>
            </div>
          )}
        </div>

        {/* Category filter tabs */}
        {habits.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1 mb-5">
            <button
              onClick={() => setActiveFilter("all")}
              className="shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all"
              style={{
                background: activeFilter === "all" ? "#5A7ACD" : "#E8E4E4",
                color: activeFilter === "all" ? "#fff" : "#2B2A2A",
              }}
            >
              Tümü
            </button>
            {CATEGORIES.filter((c) =>
              habits.some((h) => h.categoryId === c.id)
            ).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className="shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                style={{
                  background: activeFilter === cat.id ? "#5A7ACD" : "#E8E4E4",
                  color: activeFilter === cat.id ? "#fff" : "#2B2A2A",
                }}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Habit list */}
        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((habit) => (
              <HabitItem key={habit.id} habitId={habit.id} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🌱</div>
            <p className="font-medium mb-1" style={{ color: "#2B2A2A" }}>
              Henüz alışkanlık yok
            </p>
            <p className="text-sm" style={{ color: "#999" }}>
              Aşağıdaki butona tıklayarak başla
            </p>
          </div>
        )}
      </div>

      {/* FAB - Add Habit */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center px-4">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-white font-semibold transition-transform active:scale-95"
          style={{
            background: "#5A7ACD",
            boxShadow: "0 8px 24px rgba(90,122,205,0.4)",
          }}
        >
          <Plus size={20} />
          Alışkanlık Ekle
        </button>
      </div>

      {/* Modal */}
      {showModal && <AddHabitModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
