"use client";

import { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTodos } from "@/hooks/useTodos";
import { TodoForm, type TodoFormRef } from "@/components/todos/TodoForm";
import { TodoCard } from "@/components/todos/TodoCard";
import { TodoTable } from "@/components/todos/TodoTable";
import { TodoFilterBar } from "@/components/todos/TodoFilterBar";
import { DeleteConfirmModal } from "@/components/todos/DeleteConfirmModal";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Todo, type Priority, type Category } from "@/lib/types";
import { VIEW_MODES, type ViewMode } from "@/lib/constants";

function TodosPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, signout, isLoading: authLoading, isMounted } = useAuth();
  const {
    todos,
    total,
    isLoading: todosLoading,
    error,
    fetchTodos,
    createTodo,
    deleteTodo,
    toggleTodo,
  } = useTodos();

  // Filter and sort state
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<ViewMode>(VIEW_MODES.CARD);

  // Modal state
  const [deleteModalTodo, setDeleteModalTodo] = useState<Todo | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Ref for focusing title input
  const firstInputRef = useRef<TodoFormRef>(null);

  // Helper function to focus the first input
  const handleFocus = () => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  };

  // Initialize filters from URL params
  useEffect(() => {
    const view = searchParams.get("view");
    const category = searchParams.get("category");
    if (view === "table" || view === "card") {
      setViewMode(view as ViewMode);
    }
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  // Calculate todo counts for sidebar
  const todoCounts = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      all: todos.length,
      today: todos.filter(t => {
        if (!t.due_date) return false;
        const dueDate = new Date(t.due_date);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() === today.getTime();
      }).length,
      upcoming: todos.filter(t => {
        if (!t.due_date || t.completed) return false;
        const dueDate = new Date(t.due_date);
        return dueDate > today;
      }).length,
      completed: todos.filter(t => t.completed).length,
      ...todos.reduce((acc, todo) => {
        acc[todo.category] = (acc[todo.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }, [todos]);

  // Filter and sort todos
  const filteredTodos = useMemo(() => {
    let result = [...todos];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        t =>
          t.title.toLowerCase().includes(searchLower) ||
          t.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (selectedStatus) {
      result = result.filter(t =>
        selectedStatus === "completed" ? t.completed : !t.completed
      );
    }

    // Apply category filter
    if (selectedCategory) {
      result = result.filter(t => t.category === selectedCategory);
    }

    // Apply priority filter
    if (selectedPriority) {
      result = result.filter(t => t.priority === selectedPriority);
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      if (sortField === "created_at") {
        comparison =
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortField === "due_date") {
        const aDate = a.due_date ? new Date(a.due_date).getTime() : 0;
        const bDate = b.due_date ? new Date(b.due_date).getTime() : 0;
        comparison = aDate - bDate;
      } else if (sortField === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        comparison = priorityOrder[a.priority as Priority] - priorityOrder[b.priority as Priority];
      }

      return sortDirection === "desc" ? -comparison : comparison;
    });

    return result;
  }, [todos, search, selectedStatus, selectedCategory, selectedPriority, sortField, sortDirection]);

  // Apply filters
  useEffect(() => {
    fetchTodos({
      search: search || undefined,
      status: selectedStatus || undefined,
      priority: selectedPriority || undefined,
      category: selectedCategory || undefined,
      sort_by: sortField,
      sort_order: sortDirection,
    });
  }, [search, selectedStatus, selectedCategory, selectedPriority, sortField, sortDirection, fetchTodos]);

  // Calculate progress
  const completedCount = todos.filter(t => t.completed).length;
  const progressPercent = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  // Event handlers
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

  const handleCreateTodo = async (data: {
    title: string;
    description?: string;
    priority: string;
    category: string;
    due_date?: string;
    is_recurring: boolean;
    recurring_frequency?: string;
  }) => {
    setIsCreating(true);
    try {
      await createTodo(data as any);
    } catch (err) {
      // Error is already handled by useTodos hook
    } finally {
      setIsCreating(false);
    }
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

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
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
      <TopNavbar user={user} />

      <div className="flex">
        <Sidebar
          activeCategory={selectedCategory as any || "all"}
          todoCounts={todoCounts}
        />

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="mx-auto max-w-6xl">
            {/* Progress bar */}
            <Card className="mb-6 shadow-sm">
              <CardContent className="p-6">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Your Progress
                    </h2>
                    <p className="text-sm text-gray-600">
                      {completedCount} of {total} tasks completed
                    </p>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {progressPercent}%
                  </span>
                </div>
                <Progress value={progressPercent} showLabel={false} />
              </CardContent>
            </Card>

            {/* Error display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Add todo form */}
            <TodoForm
              ref={firstInputRef}
              onSubmit={handleCreateTodo}
              isLoading={isCreating}
            />

            {/* Filter bar */}
            <TodoFilterBar
              search={search}
              onSearchChange={setSearch}
              selectedStatus={selectedStatus}
              selectedCategory={selectedCategory}
              selectedPriority={selectedPriority}
              onStatusChange={setSelectedStatus}
              onCategoryChange={setSelectedCategory}
              onPriorityChange={setSelectedPriority}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            {/* Todo list */}
            {filteredTodos.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="mx-auto mb-4 w-16 h-16 text-6xl text-gray-300">📋</div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    {search || selectedCategory || selectedPriority || selectedStatus
                      ? "No tasks found"
                      : "No tasks yet"}
                  </h3>
                  <p className="mb-4 text-sm text-gray-600">
                    {search || selectedCategory || selectedPriority || selectedStatus
                      ? "Try adjusting your filters or add a new task"
                      : "Create your first task to get started"}
                  </p>
                  {!search && !selectedCategory && !selectedPriority && !selectedStatus && (
                    <Button onClick={() => handleFocus()}>
                      Create your first task
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : viewMode === "card" ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTodos.map((todo) => (
                  <TodoCard
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>
            ) : (
              <div>
                <TodoTable
                  todos={filteredTodos}
                  onToggle={toggleTodo}
                  onDelete={handleDeleteClick}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
              </div>
            )}

            {/* Loading state */}
            {todosLoading && filteredTodos.length === 0 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="min-h-[200px]">
                    <CardContent className="p-5">
                      <div className="animate-pulse space-y-3">
                        <div className="h-6 w-6 bg-gray-200 rounded"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                          <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

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

export default function TodosPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    }>
      <TodosPageContent />
    </Suspense>
  );
}
