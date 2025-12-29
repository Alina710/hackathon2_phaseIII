"use client";

import { Todo } from "@/lib/types";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  isLoading: boolean;
  onToggle: (id: string) => Promise<void>;
  onUpdate: (id: string, title: string) => Promise<void>;
  onDelete: (id: string) => void;
}

export function TodoList({
  todos,
  isLoading,
  onToggle,
  onUpdate,
  onDelete,
}: TodoListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-16 bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No todos yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new todo above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
