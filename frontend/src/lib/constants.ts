import type { Category, Priority } from "./types";

// Category configurations with icons and colors
export const CATEGORY_CONFIG: Record<
  Category,
  { label: string; icon: string; color: string; bgColor: string }
> = {
  work: {
    label: "Work",
    icon: "💼",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  personal: {
    label: "Personal",
    icon: "👤",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  study: {
    label: "Study",
    icon: "📚",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
  health: {
    label: "Health",
    icon: "🏃",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  finance: {
    label: "Finance",
    icon: "💰",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  shopping: {
    label: "Shopping",
    icon: "🛒",
    color: "text-pink-600",
    bgColor: "bg-pink-50",
  },
  meetings: {
    label: "Meetings",
    icon: "📅",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  home: {
    label: "Home",
    icon: "🏠",
    color: "text-teal-600",
    bgColor: "bg-teal-50",
  },
  errands: {
    label: "Errands",
    icon: "🚀",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
};

// Priority configurations with colors
export const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  high: {
    label: "High",
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  medium: {
    label: "Medium",
    color: "text-yellow-700",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
  },
  low: {
    label: "Low",
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
};

// Recurring frequency options
export const RECURRING_FREQUENCIES = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

// View modes for todos
export const VIEW_MODES = {
  CARD: "card",
  TABLE: "table",
} as const;

export type ViewMode = (typeof VIEW_MODES)[keyof typeof VIEW_MODES];
