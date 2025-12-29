"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTodos } from "@/hooks/useTodos";
import { TodoList } from "@/components/todos/TodoList";
import { TodoForm } from "@/components/todos/TodoForm";
import { DeleteConfirmModal } from "@/components/todos/DeleteConfirmModal";
import { Button } from "@/components/ui/Button";
import { Todo } from "@/lib/types";

export default function TodosPage() {
  const router = useRouter();
  const { user, signout, isLoading: authLoading, isMounted } = useAuth();
  const {
    todos,
    isLoading: todosLoading,
    error,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
  } = useTodos();

  const [deleteModalTodo, setDeleteModalTodo] = useState<Todo | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signout();
      router.push("/signin");
    } catch {
      // Error handled by useAuth
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleCreateTodo = async (title: string) => {
    await createTodo(title);
  };

  const handleToggleTodo = async (id: string) => {
    await toggleTodo(id);
  };

  const handleUpdateTodo = async (id: string, title: string) => {
    await updateTodo(id, { title });
  };

  const handleDeleteClick = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      setDeleteModalTodo(todo);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteModalTodo) {
      await deleteTodo(deleteModalTodo.id);
      setDeleteModalTodo(null);
    }
  };

  // Show loading state until mounted and auth check completes to prevent hydration mismatch
  if (!isMounted || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" suppressHydrationWarning>
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">My Todos</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <Button
              variant="secondary"
              onClick={handleSignOut}
              isLoading={isSigningOut}
              className="text-sm"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Error display */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Add todo form */}
        <div className="mb-8">
          <TodoForm onSubmit={handleCreateTodo} />
        </div>

        {/* Todo list */}
        <TodoList
          todos={todos}
          isLoading={todosLoading}
          onToggle={handleToggleTodo}
          onUpdate={handleUpdateTodo}
          onDelete={handleDeleteClick}
        />
      </main>

      {/* Delete confirmation modal */}
      <DeleteConfirmModal
        isOpen={!!deleteModalTodo}
        onClose={() => setDeleteModalTodo(null)}
        onConfirm={handleDeleteConfirm}
        todoTitle={deleteModalTodo?.title || ""}
      />
    </div>
  );
}
