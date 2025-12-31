"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { CATEGORY_CONFIG as CatConfig, PRIORITY_CONFIG as PriConfig, type Todo } from "@/lib/constants";
import { getRelativeTime, isOverdue } from "@/lib/utils";

interface TodoCardProps {
  todo: Todo;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function TodoCard({ todo, onToggle, onDelete, onEdit }: TodoCardProps) {
  const [isToggling, setIsToggling] = useState(false);

  const categoryConfig = CatConfig[todo.category];
  const priorityConfig = PriConfig[todo.priority];

  const handleToggle = async () => {
    setIsToggling(true);
    await onToggle(todo.id);
    setIsToggling(false);
  };

  return (
    <Card
      hover
      className={`transition-all duration-200 ${
        todo.completed ? "opacity-60" : ""
      } ${todo.due_date && isOverdue(todo.due_date) && !todo.completed ? "ring-2 ring-red-200" : ""}`}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <button
            type="button"
            onClick={handleToggle}
            disabled={isToggling}
            className={`mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg border-2 transition-all ${
              todo.completed
                ? "bg-blue-600 border-blue-600"
                : "border-gray-300 hover:border-blue-400"
            }`}
          >
            {todo.completed && (
              <svg className="h-3.5 w-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <h3
                  className={`text-base font-semibold ${
                    todo.completed ? "line-through text-gray-400" : "text-gray-900"
                  }`}
                >
                  {todo.title}
                </h3>
                {todo.description && (
                  <p
                    className={`mt-1 text-sm ${
                      todo.completed ? "line-through text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {todo.description}
                  </p>
                )}
              </div>
            </div>

            {/* Badges and Meta */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge
                variant={todo.priority === "high" ? "danger" : todo.priority === "medium" ? "warning" : "info"}
                size="sm"
              >
                {priorityConfig.label}
              </Badge>
              <Badge
                variant="default"
                size="sm"
                className={categoryConfig.bgColor}
              >
                {categoryConfig.icon} {categoryConfig.label}
              </Badge>
              {todo.due_date && (
                <Badge
                  variant="default"
                  size="sm"
                  className={
                    isOverdue(todo.due_date) && !todo.completed
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }
                >
                  {getRelativeTime(todo.due_date)}
                </Badge>
              )}
              {todo.is_recurring && (
                <Badge variant="success" size="sm">
                  ↻ {todo.recurring_frequency}
                </Badge>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-1">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(todo.id)}
                className="p-2"
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
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
