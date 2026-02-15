"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import type { Task, ColumnId } from "@/types";
import { COLUMNS } from "@/types";
import TaskCard from "./TaskCard";

interface ColumnProps {
  columnId: ColumnId;
  tasks: Task[];
  onDeleteTask?: (taskId: string) => void;
}

export default function Column({ columnId, tasks, onDeleteTask }: ColumnProps) {
  const columnMeta = COLUMNS.find((c) => c.id === columnId)!;

  const { setNodeRef, isOver } = useDroppable({ id: columnId });

  return (
    <div className="flex w-72 shrink-0 flex-col rounded-xl bg-gray-100 dark:bg-gray-800/60">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-3">
        <span className={`h-3 w-3 rounded-full ${columnMeta.color}`} />
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          {columnMeta.label}
        </h2>
        <span className="ml-auto rounded-full bg-gray-200 dark:bg-gray-700 px-2 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300">
          {tasks.length}
        </span>
      </div>

      {/* Card list */}
      <div
        ref={setNodeRef}
        className={`flex flex-1 flex-col gap-2 overflow-y-auto px-2 pb-2 transition-colors
          ${isOver ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
        style={{ minHeight: 80 }}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={onDeleteTask} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
