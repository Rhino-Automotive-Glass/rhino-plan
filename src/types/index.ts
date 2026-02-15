export type ColumnId = "backlog" | "todo" | "doing" | "quality" | "done";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  column: ColumnId;
  position: number;
  origin_sheet_id: string | null;
  origin_sheet_code: string | null;
  created_at: string;
}

export interface OriginSheet {
  id: string;
  rhino_code: string | null;
  descripcion: string | null;
  clave_externa: string | null;
  data: {
    metadata?: {
      fechaFormateada?: string;
      creadoPor?: string;
      verificadoPor?: string;
    };
    [key: string]: unknown;
  };
}

export const COLUMNS: { id: ColumnId; label: string; color: string }[] = [
  { id: "backlog", label: "Backlog", color: "bg-gray-500" },
  { id: "todo", label: "To Do", color: "bg-blue-500" },
  { id: "doing", label: "Doing", color: "bg-yellow-500" },
  { id: "quality", label: "Quality", color: "bg-purple-500" },
  { id: "done", label: "Done", color: "bg-green-500" },
];
