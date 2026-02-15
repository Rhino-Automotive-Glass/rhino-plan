import { supabase } from "@/lib/supabase";
import type { Task } from "@/types";
import KanbanBoard from "./components/KanbanBoard";

export const dynamic = "force-dynamic"; // always fetch fresh data

export default async function Home() {
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .order("position", { ascending: true });

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-red-600">Failed to load tasks: {error.message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Rhino Plan</h1>
        <p className="text-sm text-gray-500">A simple Kanban board</p>
      </header>
      <KanbanBoard initialTasks={(tasks as Task[]) ?? []} />
    </main>
  );
}
