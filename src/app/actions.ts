"use server";

import { supabase } from "@/lib/supabase";
import type { ColumnId } from "@/types";

export async function createTask(formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const column = (formData.get("column") as ColumnId) ?? "backlog";

  if (!title) {
    return { error: "Title is required" };
  }

  // Place the new task at the bottom of the target column
  const { data: last } = await supabase
    .from("tasks")
    .select("position")
    .eq("column", column)
    .order("position", { ascending: false })
    .limit(1)
    .single();

  const position = (last?.position ?? 0) + 1024;

  const { data, error } = await supabase
    .from("tasks")
    .insert({ title, description, column, position })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { task: data };
}

export async function moveTask(
  taskId: string,
  newColumn: ColumnId,
  newPosition: number
) {
  const { error } = await supabase
    .from("tasks")
    .update({ column: newColumn, position: newPosition })
    .eq("id", taskId);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
