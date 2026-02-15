"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { Task, ColumnId } from "@/types";
import { COLUMNS } from "@/types";
import { moveTask } from "@/app/actions";
import Column from "./Column";
import TaskCard from "./TaskCard";
import NewTaskForm from "./NewTaskForm";

// Group tasks by column, preserving order
function groupByColumn(tasks: Task[]): Record<ColumnId, Task[]> {
  const groups: Record<ColumnId, Task[]> = {
    backlog: [],
    todo: [],
    doing: [],
    quality: [],
    done: [],
  };
  for (const t of tasks) {
    groups[t.column].push(t);
  }
  // Sort each column by position
  for (const col of Object.keys(groups) as ColumnId[]) {
    groups[col].sort((a, b) => a.position - b.position);
  }
  return groups;
}

// Calculate a position value between two neighbors (or at edges)
function calcPosition(above: Task | undefined, below: Task | undefined): number {
  if (above && below) return (above.position + below.position) / 2;
  if (above) return above.position + 1024;
  if (below) return below.position - 1024;
  return 1024;
}

export default function KanbanBoard({ initialTasks }: { initialTasks: Task[] }) {
  const [columns, setColumns] = useState(() => groupByColumn(initialTasks));
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Find which column a task currently lives in
  const findColumn = useCallback(
    (taskId: string): ColumnId | null => {
      for (const col of Object.keys(columns) as ColumnId[]) {
        if (columns[col].some((t) => t.id === taskId)) return col;
      }
      return null;
    },
    [columns]
  );

  function handleDragStart(event: DragStartEvent) {
    const task = (event.active.data.current as { task: Task } | undefined)?.task;
    setActiveTask(task ?? null);
  }

  // Handle crossing between columns while dragging
  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const fromCol = findColumn(activeId);
    // overId could be a column id (droppable) or a task id
    const toCol = (COLUMNS.some((c) => c.id === overId)
      ? overId
      : findColumn(overId)) as ColumnId | null;

    if (!fromCol || !toCol || fromCol === toCol) return;

    setColumns((prev) => {
      const fromTasks = prev[fromCol].filter((t) => t.id !== activeId);
      const movedTask = prev[fromCol].find((t) => t.id === activeId)!;
      const toTasks = [...prev[toCol]];

      // Find insertion index
      const overIndex = toTasks.findIndex((t) => t.id === overId);
      const insertIndex = overIndex >= 0 ? overIndex : toTasks.length;

      toTasks.splice(insertIndex, 0, { ...movedTask, column: toCol });

      return { ...prev, [fromCol]: fromTasks, [toCol]: toTasks };
    });
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const col = findColumn(activeId);
    if (!col) return;

    // Compute the reordered list for same-column drops
    let finalTasks = [...columns[col]];
    const oldIndex = finalTasks.findIndex((t) => t.id === activeId);
    const newIndex = finalTasks.findIndex((t) => t.id === overId);

    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      finalTasks = arrayMove(finalTasks, oldIndex, newIndex);
      setColumns((prev) => ({ ...prev, [col]: finalTasks }));
    }

    // Calculate new position from neighbors and persist
    const idx = finalTasks.findIndex((t) => t.id === activeId);
    if (idx === -1) return;

    const above = finalTasks[idx - 1];
    const below = finalTasks[idx + 1];
    const newPosition = calcPosition(above, below);

    // Optimistically update position locally
    setColumns((prev) => ({
      ...prev,
      [col]: prev[col].map((t) =>
        t.id === activeId ? { ...t, position: newPosition } : t
      ),
    }));

    // Persist to server (fire-and-forget)
    const result = await moveTask(activeId, col, newPosition);
    if (result.error) {
      console.error("Failed to persist move:", result.error);
    }
  }

  function handleTaskCreated(task: Task) {
    setColumns((prev) => ({
      ...prev,
      [task.column]: [...prev[task.column], task],
    }));
  }

  return (
    <div className="flex flex-col gap-6">
      {/* New task form */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <NewTaskForm onTaskCreated={handleTaskCreated} />
      </div>

      {/* Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              columnId={col.id}
              tasks={columns[col.id]}
            />
          ))}
        </div>

        {/* Drag overlay for smooth visual feedback */}
        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
