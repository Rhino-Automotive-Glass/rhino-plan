"use client";

import { useRef, useState, useTransition } from "react";
import { createTask } from "@/app/actions";
import { COLUMNS } from "@/types";
import type { Task } from "@/types";

interface NewTaskFormProps {
  onTaskCreated: (task: Task) => void;
}

export default function NewTaskForm({ onTaskCreated }: NewTaskFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createTask(formData);
      if (result.error) {
        setError(result.error);
      } else if (result.task) {
        onTaskCreated(result.task as Task);
        formRef.current?.reset();
      }
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-xs font-medium text-gray-600">
          Title *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder="Task title"
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900
            placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-xs font-medium text-gray-600">
          Description
        </label>
        <input
          id="description"
          name="description"
          type="text"
          placeholder="Optional"
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900
            placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="column" className="text-xs font-medium text-gray-600">
          Column
        </label>
        <select
          id="column"
          name="column"
          defaultValue="backlog"
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900
            focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {COLUMNS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white
          hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {isPending ? "Adding…" : "Add Task"}
      </button>

      {error && <p className="w-full text-sm text-red-600">{error}</p>}
    </form>
  );
}
