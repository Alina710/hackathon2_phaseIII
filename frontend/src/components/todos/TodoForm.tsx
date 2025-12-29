"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface TodoFormProps {
  onSubmit: (title: string) => Promise<void>;
}

export function TodoForm({ onSubmit }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Title is required");
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(trimmedTitle);
      setTitle("");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create todo");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <div className="flex-1">
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          error={error || undefined}
          disabled={isLoading}
        />
      </div>
      <Button type="submit" isLoading={isLoading} className="whitespace-nowrap">
        Add Todo
      </Button>
    </form>
  );
}
