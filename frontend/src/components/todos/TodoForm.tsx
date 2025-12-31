"use client";

import { useState, forwardRef, useImperativeHandle, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Toggle } from "@/components/ui/Toggle";
import { Dropdown, type DropdownOption } from "@/components/ui/Dropdown";
import { CATEGORY_CONFIG, PRIORITY_CONFIG, RECURRING_FREQUENCIES, type Category, type Priority } from "@/lib/constants";

export interface TodoFormProps {
  onSubmit: (data: {
    title: string;
    description?: string;
    priority: Priority;
    category: Category;
    due_date?: string;
    is_recurring: boolean;
    recurring_frequency?: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

export interface TodoFormRef {
  focus: () => void;
}

export const TodoForm = forwardRef<TodoFormRef, TodoFormProps>(
  ({ onSubmit, isLoading = false }, ref) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<Priority>("medium");
    const [category, setCategory] = useState<Category>("personal");
    const [dueDate, setDueDate] = useState("");
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurringFrequency, setRecurringFrequency] = useState("");
    const [showAdvanced, setShowAdvanced] = useState(false);

    const priorityOptions: DropdownOption[] = [
      { value: "high", label: "High Priority" },
      { value: "medium", label: "Medium Priority" },
      { value: "low", label: "Low Priority" },
    ];

    const categoryOptions: DropdownOption[] = Object.entries(CATEGORY_CONFIG).map(([key, config]) => ({
      value: key,
      label: config.label,
      icon: config.icon,
    }));

    useImperativeHandle(ref, () => ({
      focus: () => {
        const firstInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (firstInput) firstInput.focus();
      },
    }));

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      if (!title.trim()) return;

      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        category,
        due_date: dueDate || undefined,
        is_recurring: isRecurring,
        recurring_frequency: isRecurring ? recurringFrequency : undefined,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setPriority("medium");
      setCategory("personal");
      setDueDate("");
      setIsRecurring(false);
      setRecurringFrequency("");
      setShowAdvanced(false);
    };

    return (
      <Card className="mb-6 shadow-sm">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  label="Task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  required
                  autoFocus
                />
              </div>
              <div className="w-full min-w-[200px] max-w-[250px]">
                <div className="mb-1.5 block text-sm font-medium text-gray-700">Category</div>
                <Dropdown
                  options={categoryOptions}
                  value={category}
                  onSelect={setCategory}
                  placeholder="Select category"
                />
              </div>
            </div>

            {showAdvanced && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <div className="mb-1.5 block text-sm font-medium text-gray-700">Priority</div>
                      <Dropdown
                        options={priorityOptions}
                        value={priority}
                        onSelect={(val) => setPriority(val as Priority)}
                      />
                    </div>
                    <Input
                      type="datetime-local"
                      label="Due date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      label="Description (optional)"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add more details..."
                      as="textarea"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Recurring Task</span>
                    <Toggle
                      checked={isRecurring}
                      onChange={setIsRecurring}
                      size="sm"
                    />
                  </div>
                  {isRecurring && (
                    <div className="mt-3">
                      <div className="mb-2 block text-sm font-medium text-gray-700">Frequency</div>
                      <div className="flex gap-2">
                        {RECURRING_FREQUENCIES.map((freq) => (
                          <button
                            key={freq.value}
                            type="button"
                            onClick={() => setRecurringFrequency(freq.value)}
                            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                              recurringFrequency === freq.value
                                ? "bg-blue-600 text-white"
                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {freq.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? (
                  <>
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    Hide options
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    More options
                  </>
                )}
              </Button>
              <Button type="submit" isLoading={isLoading} size="md">
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Task
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }
);

TodoForm.displayName = "TodoForm";
