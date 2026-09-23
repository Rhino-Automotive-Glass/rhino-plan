"use server";

import { createClient } from "@/lib/supabase/server";
import type { ColumnId, OriginSheet } from "@/types";

async function authorizedClient() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;

  const { data: level, error: roleError } = await supabase.rpc("current_user_hierarchy_level");
  if (roleError || typeof level !== "number" || level < 10) return null;

  return supabase;
}

export async function createTask(formData: FormData) {
  const supabase = await authorizedClient();
  if (!supabase) return { error: "Access denied" };

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const column = (formData.get("column") as ColumnId) ?? "backlog";
  const originSheetId = (formData.get("origin_sheet_id") as string)?.trim() || null;
  const originSheetCode = (formData.get("origin_sheet_code") as string)?.trim() || null;
  const dueDate = (formData.get("due_date") as string)?.trim() || null;

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
    .insert({
      title,
      description,
      column,
      position,
      origin_sheet_id: originSheetId,
      origin_sheet_code: originSheetCode,
      due_date: dueDate,
    })
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
  const supabase = await authorizedClient();
  if (!supabase) return { error: "Access denied" };

  const { error } = await supabase
    .from("tasks")
    .update({ column: newColumn, position: newPosition })
    .eq("id", taskId);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function searchOriginSheets(
  query: string
): Promise<{ data: OriginSheet[] | null; error: string | null }> {
  const term = query.trim();
  if (term.length < 2) {
    return { data: [], error: null };
  }

  const supabase = await authorizedClient();
  if (!supabase) return { data: null, error: "Access denied" };

  const { data, error } = await supabase
    .from("origin_sheets")
    .select("id, rhino_code, descripcion, clave_externa, data")
    .or(`rhino_code.ilike.%${term}%,descripcion.ilike.%${term}%`)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as OriginSheet[], error: null };
}

export async function deleteTask(taskId: string) {
  const supabase = await authorizedClient();
  if (!supabase) return { error: "Access denied" };

  const { error } = await supabase.from("tasks").delete().eq("id", taskId);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
