-- Personal folders for reusable teacher tasks. Existing tasks remain unfiled.
create table public.task_folders (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (length(trim(name)) between 1 and 100),
  created_at timestamptz not null default now(),
  unique (id, teacher_id)
);
create unique index task_folders_teacher_name_uidx
  on public.task_folders (teacher_id, lower(trim(name)));

alter table public.task_folders enable row level security;
revoke all on public.task_folders from anon, authenticated;
grant select, insert, update, delete on public.task_folders to service_role;

alter table public.tasks add column folder_id uuid;
alter table public.tasks add constraint tasks_folder_requires_teacher
  check (folder_id is null or teacher_id is not null);
alter table public.tasks add constraint tasks_folder_owner_fkey
  foreign key (folder_id, teacher_id) references public.task_folders (id, teacher_id);
create index tasks_folder_id_idx on public.tasks (folder_id) where folder_id is not null;
