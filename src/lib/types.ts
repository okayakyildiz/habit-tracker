export type CategoryId =
  | "saglik"
  | "zihin"
  | "is"
  | "kisisel";

export interface Category {
  id: CategoryId;
  label: string;
  icon: string;
  color: string;      // badge bg color
  textColor: string;  // badge text color
}

export interface Habit {
  id: string;
  name: string;
  categoryId: CategoryId;
  goalTarget?: number;
  goalUnit?: string;
  createdAt: string; // ISO date string
}

export interface HabitLog {
  habitId: string;
  date: string;      // "YYYY-MM-DD"
  completed: boolean;
  value?: number;
}

export const CATEGORIES: Category[] = [
  { id: "saglik",  label: "Sağlık & Spor",      icon: "💪", color: "#EBF0FA", textColor: "#5A7ACD" },
  { id: "zihin",   label: "Zihin & Öğrenme",    icon: "📚", color: "#FFF4E6", textColor: "#D4891A" },
  { id: "is",      label: "İş & Üretkenlik",     icon: "💼", color: "#EBF0FA", textColor: "#5A7ACD" },
  { id: "kisisel", label: "Kişisel Gelişim",     icon: "🌱", color: "#FFF4E6", textColor: "#D4891A" },
];
