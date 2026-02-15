export type ColumnId = "backlog" | "todo" | "doing" | "quality" | "done";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  column: ColumnId;
  position: number;
  created_at: string;
}

export const COLUMNS: { id: ColumnId; label: string; color: string }[] = [
  { id: "backlog", label: "Backlog", color: "bg-gray-500" },
  { id: "todo", label: "To Do", color: "bg-blue-500" },
  { id: "doing", label: "Doing", color: "bg-yellow-500" },
  { id: "quality", label: "Quality", color: "bg-purple-500" },
  { id: "done", label: "Done", color: "bg-green-500" },
];
