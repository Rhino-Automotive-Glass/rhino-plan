"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@/types";

export default function TaskCard({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
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
      {...listeners}
      className={`rounded-lg border border-gray-200 bg-white p-3 shadow-sm
        hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing
        ${isDragging ? "opacity-50 shadow-lg ring-2 ring-blue-400" : ""}`}
    >
      <p className="font-medium text-sm text-gray-900 leading-snug">
        {task.title}
      </p>
      {task.description && (
        <p className="mt-1 text-xs text-gray-500 line-clamp-2">
          {task.description}
        </p>
      )}
    </div>
  );
}
