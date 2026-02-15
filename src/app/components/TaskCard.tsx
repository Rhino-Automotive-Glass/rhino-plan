"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@/types";

interface TaskCardProps {
  task: Task;
  onDelete?: (taskId: string) => void;
}

export default function TaskCard({ task, onDelete }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`group relative rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 shadow-sm
        hover:shadow-md transition-shadow
        ${isDragging ? "opacity-50 shadow-lg ring-2 ring-blue-400" : ""}`}
    >
      {/* Drag handle — entire card body */}
      <div ref={setActivatorNodeRef} {...listeners} className="cursor-grab active:cursor-grabbing">
        <p className="font-medium text-sm text-gray-900 dark:text-white leading-snug pr-6">
          {task.title}
        </p>
        {task.origin_sheet_code && (
          <span className="mt-1 inline-block rounded bg-teal-100 dark:bg-teal-900/40 px-1.5 py-0.5 text-xs font-medium text-teal-700 dark:text-teal-300">
            {task.origin_sheet_code}
          </span>
        )}
        {task.description && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
            {task.description}
          </p>
        )}
      </div>

      {/* Delete button — outside drag listeners */}
      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className="absolute top-2 right-2 rounded p-1 text-gray-300 dark:text-gray-500
            opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 dark:hover:text-red-400
            transition-all"
          aria-label="Delete task"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path
              fillRule="evenodd"
              d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
