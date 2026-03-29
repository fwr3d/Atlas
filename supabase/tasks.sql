create extension if not exists pgcrypto;

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  completed boolean not null default false,
  priority text not null default 'medium',
  due_date date,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.tasks
  add column if not exists completed boolean not null default false;

alter table public.tasks
  add column if not exists priority text not null default 'medium';

alter table public.tasks
  add column if not exists due_date date;

alter table public.tasks
  add column if not exists created_at timestamptz not null default timezone('utc', now());

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'tasks_priority_check'
  ) then
    alter table public.tasks
      add constraint tasks_priority_check
      check (priority in ('low', 'medium', 'high'));
  end if;
end $$;

update public.tasks
set priority = 'medium'
where priority is null or priority not in ('low', 'medium', 'high');

create index if not exists tasks_user_id_created_at_idx
  on public.tasks (user_id, created_at desc);

create index if not exists tasks_user_id_due_date_idx
  on public.tasks (user_id, due_date asc);

alter table public.tasks enable row level security;

drop policy if exists "Users can read their own tasks" on public.tasks;
create policy "Users can read their own tasks"
on public.tasks
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own tasks" on public.tasks;
create policy "Users can insert their own tasks"
on public.tasks
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own tasks" on public.tasks;
create policy "Users can update their own tasks"
on public.tasks
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own tasks" on public.tasks;
create policy "Users can delete their own tasks"
on public.tasks
for delete
using (auth.uid() = user_id);
