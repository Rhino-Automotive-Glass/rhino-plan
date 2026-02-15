import { supabase } from "@/lib/supabase";
import type { Task } from "@/types";
import KanbanBoard from "./components/KanbanBoard";
import { ThemeToggle } from "@/components/theme";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .order("position", { ascending: true });

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <main className="flex min-h-screen items-center justify-center">
          <p className="text-red-600">Failed to load tasks: {error.message}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Rhino Plan</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Kanban Board</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Board</h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Drag and drop tasks between columns to update their status.
          </p>
        </div>
        <KanbanBoard initialTasks={(tasks as Task[]) ?? []} />
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Rhino Plan &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
