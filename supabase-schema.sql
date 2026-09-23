-- Production is the source of truth. This file mirrors public.tasks as inspected on 2026-09-23.
-- Rhino-Plan: Kanban board tasks table
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)

create table if not exists tasks (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  description text,
  "column"   text not null check ("column" in ('backlog', 'todo', 'doing', 'quality', 'done')),
  position   float8 not null default 0,
  origin_sheet_id   text references public.origin_sheets(id),
  origin_sheet_code text,
  due_date          date,
  created_at timestamptz not null default now()
);

-- Index for fast ordering within each column
create index if not exists idx_tasks_column_position on tasks ("column", position);

alter table public.tasks enable row level security;

drop policy if exists "Allow anonymous read" on public.tasks;
drop policy if exists "Allow anonymous insert" on public.tasks;
drop policy if exists "Allow anonymous update" on public.tasks;
drop policy if exists "Allow anonymous delete" on public.tasks;
drop policy if exists "Authenticated users can access tasks" on public.tasks;
drop policy if exists "Users with a role can access tasks" on public.tasks;

revoke all on public.tasks from anon;

create policy "Users with a role can access tasks"
  on public.tasks
  for all
  to authenticated
  using ((select public.current_user_hierarchy_level()) >= 10)
  with check ((select public.current_user_hierarchy_level()) >= 10);
