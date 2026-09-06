create table if not exists public.lesson_boards (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null unique references public.scheduled_lessons(id) on delete cascade,
  board_data jsonb not null default '{"elements": [], "appState": {}, "files": {}}'::jsonb,
  version integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.lesson_boards enable row level security;

create policy "lesson participants read lesson board"
  on public.lesson_boards for select
  using (
    exists (
      select 1
      from public.scheduled_lessons sl
      where sl.id = lesson_boards.lesson_id
        and (sl.teacher_id = auth.uid() or auth.uid() = any(sl.student_ids))
    )
  );

create policy "lesson teacher writes lesson board"
  on public.lesson_boards for all
  using (
    exists (
      select 1
      from public.scheduled_lessons sl
      where sl.id = lesson_boards.lesson_id
        and sl.teacher_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.scheduled_lessons sl
      where sl.id = lesson_boards.lesson_id
        and sl.teacher_id = auth.uid()
    )
  );
