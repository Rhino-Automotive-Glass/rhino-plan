"use client";

import { useRef, useState, useTransition } from "react";
import { createTask } from "@/app/actions";
import { COLUMNS } from "@/types";
import type { Task, OriginSheet } from "@/types";
import OriginSheetSearch from "./OriginSheetSearch";

interface NewTaskFormProps {
  onTaskCreated: (task: Task) => void;
}

export default function NewTaskForm({ onTaskCreated }: NewTaskFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [selectedSheet, setSelectedSheet] = useState<OriginSheet | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);

    if (selectedSheet) {
      formData.set("origin_sheet_id", selectedSheet.id);
      formData.set("origin_sheet_code", selectedSheet.rhino_code ?? "");
    }

    startTransition(async () => {
      const result = await createTask(formData);
      if (result.error) {
        setError(result.error);
      } else if (result.task) {
        onTaskCreated(result.task as Task);
        formRef.current?.reset();
        setSelectedSheet(null);
      }
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-wrap items-end gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-xs font-medium text-gray-600 dark:text-gray-400">
          Title *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder="Task title"
          className="input-base"
        />
      </div>

      {/* Origin sheet search — between title and description */}
      <OriginSheetSearch
        selected={selectedSheet}
        onSelect={setSelectedSheet}
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-xs font-medium text-gray-600 dark:text-gray-400">
          Description
        </label>
        <input
          id="description"
          name="description"
          type="text"
          placeholder="Optional"
          className="input-base"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="column" className="text-xs font-medium text-gray-600 dark:text-gray-400">
          Column
        </label>
        <select
          id="column"
          name="column"
          defaultValue="backlog"
          className="input-base"
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
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white
          hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
      >
        {isPending ? "Adding…" : "Add Task"}
      </button>

      {error && <p className="w-full text-sm text-red-600">{error}</p>}
    </form>
  );
}
