"use client";

import { SearchInput } from "@/components/ui/SearchInput";
import { Button } from "@/components/ui/Button";
import { Dropdown, type DropdownOption } from "@/components/ui/Dropdown";
import { CATEGORY_CONFIG as CatConfig, PRIORITY_CONFIG as PriConfig, type Category, type Priority } from "@/lib/constants";

interface TodoFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string | null;
  selectedCategory: string | null;
  selectedPriority: string | null;
  onStatusChange: (status: string | null) => void;
  onCategoryChange: (category: string | null) => void;
  onPriorityChange: (priority: string | null) => void;
  viewMode: "card" | "table";
  onViewModeChange: (mode: "card" | "table") => void;
}

export function TodoFilterBar({
  search,
  onSearchChange,
  selectedStatus,
  selectedCategory,
  selectedPriority,
  onStatusChange,
  onCategoryChange,
  onPriorityChange,
  viewMode,
  onViewModeChange,
}: TodoFilterBarProps) {
  const statusOptions: DropdownOption[] = [
    { value: "all", label: "All Status" },
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
  ];

  const priorityOptions: DropdownOption[] = [
    { value: "all", label: "All Priorities" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  const categoryOptions: DropdownOption[] = [
    { value: "all", label: "All Categories" },
    ...Object.entries(CatConfig).map(([key, config]) => ({
      value: key,
      label: config.label,
      icon: config.icon,
    })),
  ];

  return (
    <div className="mb-6 space-y-4">
      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="flex-1">
          <SearchInput
            value={search}
            onSearch={onSearchChange}
            onClear={() => onSearchChange("")}
            placeholder="Search tasks..."
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "card" ? "primary" : "outline"}
            size="sm"
            onClick={() => onViewModeChange("card")}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2v2a2 2 0 01-2 2h2a2 2 0 012-2v-2a2 2 0 01-2-2H4zm2 2a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8z" />
            </svg>
            Cards
          </Button>
          <Button
            variant={viewMode === "table" ? "primary" : "outline"}
            size="sm"
            onClick={() => onViewModeChange("table")}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2zM5 21a1 1 0 001-1V6a1 1 0 00-1-1H5v16zm0-16h14a1 1 0 001 1v16a1 1 0 00-1 1H5z" />
            </svg>
            Table
          </Button>
        </div>
      </div>

      {/* Filter Dropdowns */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <div className="mb-1.5 block text-sm font-medium text-gray-700">Status</div>
          <Dropdown
            options={statusOptions}
            value={selectedStatus || "all"}
            onSelect={(val) => onStatusChange(val === "all" ? null : val)}
          />
        </div>
        <div>
          <div className="mb-1.5 block text-sm font-medium text-gray-700">Category</div>
          <Dropdown
            options={categoryOptions}
            value={selectedCategory || "all"}
            onSelect={(val) => onCategoryChange(val === "all" ? null : val)}
          />
        </div>
        <div>
          <div className="mb-1.5 block text-sm font-medium text-gray-700">Priority</div>
          <Dropdown
            options={priorityOptions}
            value={selectedPriority || "all"}
            onSelect={(val) => onPriorityChange(val === "all" ? null : val)}
          />
        </div>
      </div>
    </div>
  );
}
