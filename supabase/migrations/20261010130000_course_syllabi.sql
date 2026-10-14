create table if not exists public.course_syllabi (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null unique references public.courses(id) on delete cascade,
  teacher_id uuid references public.teachers(id) on delete set null,
  storage_path text not null,
  file_name text not null,
  mime_type text not null check (mime_type in (
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  )),
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 20971520),
  comment text,
  version integer not null default 1 check (version > 0),
  uploaded_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists course_syllabi_teacher_idx
  on public.course_syllabi (teacher_id);

alter table public.course_syllabi enable row level security;

create policy "staff manage course syllabi"
  on public.course_syllabi
  for all
  to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));

create policy "teachers manage own course syllabi"
  on public.course_syllabi
  for all
  to authenticated
  using (teacher_id = (select auth.uid()) and (select public.is_teacher()))
  with check (teacher_id = (select auth.uid()) and (select public.is_teacher()));

create policy "students read syllabus for assigned course"
  on public.course_syllabi
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.schedule_group_students member
      join public.schedule_groups learning_group on learning_group.id = member.group_id
      where member.student_id = (select auth.uid())
        and member.status = 'active'
        and learning_group.course_id = course_syllabi.course_id
    )
  );

grant select on public.course_syllabi to authenticated;
grant select, insert, update, delete on public.course_syllabi to service_role;
