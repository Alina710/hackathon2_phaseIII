// User types
export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  user: User;
}

export interface SignupRequest {
  email: string;
  password: string;
}

export interface SigninRequest {
  email: string;
  password: string;
}

// Todo types
export type Priority = "high" | "medium" | "low";

export type Category =
  | "work"
  | "personal"
  | "study"
  | "health"
  | "finance"
  | "shopping"
  | "meetings"
  | "home"
  | "errands";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  due_date?: string;
  is_recurring: boolean;
  recurring_frequency?: string;
  reminder_time?: string;
  created_at: string;
  updated_at: string;
}

export interface TodoListResponse {
  todos: Todo[];
  total: number;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  priority?: Priority;
  category?: Category;
  due_date?: string;
  is_recurring?: boolean;
  recurring_frequency?: string;
  reminder_time?: string;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: Priority;
  category?: Category;
  due_date?: string;
  is_recurring?: boolean;
  recurring_frequency?: string;
  reminder_time?: string;
}

// Error types
export interface ErrorDetail {
  field: string;
  message: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: ErrorDetail[];
  };
}
