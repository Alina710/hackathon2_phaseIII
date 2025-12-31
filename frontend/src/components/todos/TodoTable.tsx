"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CATEGORY_CONFIG as CatConfig, PRIORITY_CONFIG as PriConfig, type Todo } from "@/lib/constants";
import { getRelativeTime, isOverdue } from "@/lib/utils";

interface TodoTableProps {
  todos: Todo[];
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void;
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
}

export function TodoTable({
  todos,
  onToggle,
  onDelete,
  onEdit,
  sortField,
  sortDirection,
  onSort,
}: TodoTableProps) {
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

  const handleToggle = async (id: string) => {
    setTogglingIds((prev) => new Set(prev).add(id));
    await onToggle(id);
    setTogglingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <svg className="inline h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="inline h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Task
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <button
                type="button"
                onClick={() => onSort("priority")}
                className="flex items-center hover:text-gray-700 transition-colors"
              >
                Priority
                <SortIcon field="priority" />
              </button>
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <button
                type="button"
                onClick={() => onSort("due_date")}
                className="flex items-center hover:text-gray-700 transition-colors"
              >
                Due Date
                <SortIcon field="due_date" />
              </button>
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {todos.map((todo) => {
            const categoryConfig = CatConfig[todo.category];
            const priorityConfig = PriConfig[todo.priority];
            const isOverdueItem = todo.due_date && isOverdue(todo.due_date) && !todo.completed;
            const isToggling = togglingIds.has(todo.id);

            return (
              <tr
                key={todo.id}
                className={`transition-colors ${
                  todo.completed ? "bg-gray-50" : "bg-white hover:bg-gray-50"
                } ${isOverdueItem ? "bg-red-50/50" : ""}`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggle(todo.id)}
                      disabled={isToggling}
                      className={`mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                        todo.completed
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      {todo.completed && (
                        <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <div
                        className={`text-sm font-medium ${
                          todo.completed ? "line-through text-gray-400" : "text-gray-900"
                        }`}
                      >
                        {todo.title}
                      </div>
                      {todo.description && (
                        <div
                          className={`mt-0.5 text-xs ${
                            todo.completed ? "line-through text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {todo.description}
                        </div>
                      )}
                      {todo.is_recurring && (
                        <Badge variant="success" size="sm" className="mt-1 inline-flex">
                          ↻ {todo.recurring_frequency}
                        </Badge>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge
                    variant={todo.priority === "high" ? "danger" : todo.priority === "medium" ? "warning" : "info"}
                    size="sm"
                    className={priorityConfig.bgColor}
                  >
                    {priorityConfig.label}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge
                    variant="default"
                    size="sm"
                    className={categoryConfig.bgColor}
                  >
                    {categoryConfig.icon} {categoryConfig.label}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  {todo.due_date ? (
                    <div>
                      <div
                        className={`text-sm ${
                          isOverdueItem ? "text-red-600 font-medium" : "text-gray-600"
                        }`}
                      >
                        {getRelativeTime(todo.due_date)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(todo.due_date).toLocaleDateString()}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">No due date</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {todo.completed ? (
                    <Badge variant="success" size="sm">
                      Completed
                    </Badge>
                  ) : (
                    <Badge variant="warning" size="sm">
                      Pending
                    </Badge>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(todo.id)}
                        className="p-1.5"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(todo.id)}
                      className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
