"use client";

import { useState, useEffect, useCallback } from "react";
import { Todo, TodoListResponse, CreateTodoRequest, UpdateTodoRequest } from "@/lib/types";
import { api, ApiClientError } from "@/lib/api";

interface UseTodosReturn {
  todos: Todo[];
  total: number;
  isLoading: boolean;
  error: string | null;
  fetchTodos: () => Promise<void>;
  createTodo: (title: string) => Promise<Todo>;
  updateTodo: (id: string, data: UpdateTodoRequest) => Promise<Todo>;
  toggleTodo: (id: string) => Promise<Todo>;
  deleteTodo: (id: string) => Promise<void>;
}

export function useTodos(): UseTodosReturn {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get<TodoListResponse>("/todos");
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

  const createTodo = async (title: string): Promise<Todo> => {
    try {
      setError(null);
      const todo = await api.post<Todo>("/todos", { title } as CreateTodoRequest);
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
