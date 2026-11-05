-- Run this in the Supabase SQL editor.
create table if not exists public.progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id text not null,
  completed boolean not null default false,
  hints_used integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

alter table public.progress enable row level security;

create policy "Users read own progress" on public.progress
  for select using (auth.uid() = user_id);

create policy "Users insert own progress" on public.progress
  for insert with check (auth.uid() = user_id);

create policy "Users update own progress" on public.progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
