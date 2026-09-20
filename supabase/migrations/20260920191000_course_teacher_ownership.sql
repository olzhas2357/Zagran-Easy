alter table public.courses
  add column if not exists teacher_id uuid references public.profiles(id) on delete set null;

create index if not exists courses_teacher_id_idx
  on public.courses (teacher_id);

