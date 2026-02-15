-- Rhino-Plan: Kanban board tasks table
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)

create table if not exists tasks (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  description text,
  "column"   text not null check ("column" in ('backlog', 'todo', 'doing', 'quality', 'done')),
  position   float8 not null default 0,
  created_at timestamptz not null default now()
);

-- Index for fast ordering within each column
create index if not exists idx_tasks_column_position on tasks ("column", position);

-- Allow anonymous read/write (MVP — no auth)
alter table tasks enable row level security;

create policy "Allow anonymous read"  on tasks for select using (true);
create policy "Allow anonymous insert" on tasks for insert with check (true);
create policy "Allow anonymous update" on tasks for update using (true);
create policy "Allow anonymous delete" on tasks for delete using (true);
