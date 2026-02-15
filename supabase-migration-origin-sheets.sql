-- Migration: add origin sheet columns to existing tasks table
-- Run this if the tasks table already exists

alter table tasks add column if not exists origin_sheet_id text references public.origin_sheets(id);
alter table tasks add column if not exists origin_sheet_code text;
