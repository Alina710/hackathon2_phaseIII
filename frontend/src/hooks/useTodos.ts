"use client";

import { useState, useEffect, useCallback } from "react";
import { Todo, TodoListResponse, CreateTodoRequest, UpdateTodoRequest } from "@/lib/types";
import { api, ApiClientError } from "@/lib/api";

interface UseTodosReturn {
  todos: Todo[];
  total: number;
  isLoading: boolean;
  error: string | null;
  fetchTodos: (filters?: {
    search?: string;
    status?: string;
    priority?: string;
    category?: string;
    sort_by?: string;
    sort_order?: string;
  }) => Promise<void>;
  createTodo: (data: CreateTodoRequest) => Promise<Todo>;
  updateTodo: (id: string, data: UpdateTodoRequest) => Promise<Todo>;
  toggleTodo: (id: string) => Promise<Todo>;
  deleteTodo: (id: string) => Promise<void>;
}

export function useTodos(): UseTodosReturn {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async (filters?: {
    search?: string;
    status?: string;
    priority?: string;
    category?: string;
    sort_by?: string;
    sort_order?: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      // Build query params
      const params = new URLSearchParams();
      if (filters?.search) params.append("search", filters.search);
      if (filters?.status) params.append("status", filters.status);
      if (filters?.priority) params.append("priority", filters.priority);
      if (filters?.category) params.append("category", filters.category);
      if (filters?.sort_by) params.append("sort_by", filters.sort_by);
      if (filters?.sort_order) params.append("sort_order", filters.sort_order);

      const queryString = params.toString();
      const endpoint = queryString ? `/todos?${queryString}` : "/todos";

      const response = await api.get<TodoListResponse>(endpoint);
      setTodos(response.todos);
      setTotal(response.total);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError("Failed to fetch todos");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const createTodo = async (data: any): Promise<Todo> => {
    try {
      setError(null);
      // Convert string priority to proper Priority type
      const createData = {
        ...data,
        priority: data.priority || "medium" as "high" | "medium" | "low",
        category: data.category || "personal",
      };
      const todo = await api.post<Todo>("/todos", createData);
      setTodos((prev) => [todo, ...prev]);
      setTotal((prev) => prev + 1);
      return todo;
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError("Failed to create todo");
      }
      throw err;
    }
  };

  const updateTodo = async (id: string, data: UpdateTodoRequest): Promise<Todo> => {
    try {
      setError(null);
      const todo = await api.patch<Todo>(`/todos/${id}`, data);
      setTodos((prev) => prev.map((t) => (t.id === id ? todo : t)));
      return todo;
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError("Failed to update todo");
      }
      throw err;
    }
  };

  const toggleTodo = async (id: string): Promise<Todo> => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    return updateTodo(id, { completed: !todo.completed });
  };

  const deleteTodo = async (id: string): Promise<void> => {
    try {
      setError(null);
      await api.delete(`/todos/${id}`);
      setTodos((prev) => prev.filter((t) => t.id !== id));
      setTotal((prev) => prev - 1);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError("Failed to delete todo");
      }
      throw err;
    }
  };

  return {
    todos,
    total,
    isLoading,
    error,
    fetchTodos,
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
  };
}
