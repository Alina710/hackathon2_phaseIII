"use client";

import { useState, KeyboardEvent } from "react";
import { Todo } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => Promise<void>;
  onUpdate: (id: string, title: string) => Promise<void>;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await onToggle(todo.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditTitle(todo.title);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle(todo.title);
  };

  const handleSave = async () => {
    if (editTitle.trim() === todo.title) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      await onUpdate(todo.id, editTitle.trim());
      setIsEditing(false);
    } catch {
      // Keep editing state on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div
      className={`
        flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border
        ${todo.completed ? "border-green-200 bg-green-50" : "border-gray-200"}
      `}
    >
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`
          w-6 h-6 rounded-full border-2 flex items-center justify-center
          transition-colors min-w-[24px]
          ${
            todo.completed
              ? "bg-green-500 border-green-500 text-white"
              : "border-gray-300 hover:border-green-500"
          }
          ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
        aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {todo.completed && (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </button>

      {isEditing ? (
        <div className="flex-1 flex items-center gap-2">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="flex-1"
          />
          <Button
            onClick={handleSave}
            isLoading={isLoading}
            variant="primary"
            className="text-sm"
          >
            Save
          </Button>
          <Button
            onClick={handleCancel}
            variant="secondary"
            className="text-sm"
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <>
          <span
            className={`
              flex-1 break-words
              ${todo.completed ? "line-through text-gray-500" : "text-gray-900"}
            `}
          >
            {todo.title}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
              aria-label="Edit todo"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>

            <button
              onClick={() => onDelete(todo.id)}
              className="p-2 text-gray-500 hover:text-red-600 transition-colors"
              aria-label="Delete todo"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
