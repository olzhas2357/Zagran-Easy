-- Recurring teacher schedules: group -> weekly rules -> concrete sessions.
-- Students never self-enrol. Staff controls group membership.

create extension if not exists btree_gist with schema extensions;

create table if not exists public.classrooms (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  capacity integer not null check (capacity > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.schedule_groups (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  teacher_id uuid not null references public.teachers(id),
  course_id uuid references public.courses(id),
  format text not null check (format in ('online', 'offline')),
  classroom_id uuid references public.classrooms(id),
  capacity integer not null check (capacity between 1 and 100),
  starts_on date not null,
  ends_on date not null,
  status text not null default 'active' check (status in ('draft', 'active', 'completed', 'cancelled')),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint schedule_groups_date_order check (ends_on >= starts_on),
  constraint schedule_groups_classroom_format check (
    (format = 'online' and classroom_id is null)
    or (format = 'offline' and classroom_id is not null)
  )
);

create table if not exists public.schedule_rules (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.schedule_groups(id) on delete cascade,
  weekday smallint not null check (weekday between 1 and 7),
  time_start time without time zone not null,
  time_end time without time zone not null,
  created_at timestamptz not null default now(),
  constraint schedule_rules_time_order check (time_end > time_start),
  constraint schedule_rules_unique_day unique (group_id, weekday)
);

create table if not exists public.lesson_sessions (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.schedule_groups(id),
  teacher_id uuid not null references public.teachers(id),
  course_id uuid references public.courses(id),
  classroom_id uuid references public.classrooms(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'scheduled' check (status in ('scheduled', 'cancelled', 'completed')),
  cancellation_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lesson_sessions_time_order check (ends_at > starts_at)
);

create table if not exists public.schedule_group_students (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.schedule_groups(id) on delete cascade,
  student_id uuid not null references public.students(id),
  assigned_by uuid not null references public.profiles(id),
  status text not null default 'active' check (status in ('active', 'removed')),
  assigned_at timestamptz not null default now(),
  removed_at timestamptz,
  constraint schedule_group_students_unique unique (group_id, student_id)
);

create or replace function private.prepare_lesson_session()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_group public.schedule_groups%rowtype;
begin
  select * into strict v_group
  from public.schedule_groups
  where id = new.group_id;

  new.teacher_id := v_group.teacher_id;
  new.course_id := v_group.course_id;
  new.classroom_id := v_group.classroom_id;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists prepare_lesson_session on public.lesson_sessions;
create trigger prepare_lesson_session
  before insert or update of group_id, starts_at, ends_at, status
  on public.lesson_sessions
  for each row execute function private.prepare_lesson_session();

create or replace function private.validate_schedule_group_student()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_group public.schedule_groups%rowtype;
  v_assigned_teacher uuid;
  v_active_count integer;
begin
  select * into strict v_group
  from public.schedule_groups
  where id = new.group_id
  for update;

  select teacher_id into v_assigned_teacher
  from public.students
  where id = new.student_id;

  if v_assigned_teacher is null or v_assigned_teacher <> v_group.teacher_id then
    raise exception 'Студент не закреплён за преподавателем этой группы';
  end if;

  if new.status = 'active' then
    select count(*) into v_active_count
    from public.schedule_group_students member
    where member.group_id = new.group_id
      and member.status = 'active'
      and member.id is distinct from new.id;

    if v_active_count >= v_group.capacity then
      raise exception 'В учебной группе нет свободных мест';
    end if;
  end if;

  new.removed_at := case when new.status = 'removed' then coalesce(new.removed_at, now()) else null end;
  return new;
end;
$$;

drop trigger if exists validate_schedule_group_student on public.schedule_group_students;
create trigger validate_schedule_group_student
  before insert or update of group_id, student_id, status
  on public.schedule_group_students
  for each row execute function private.validate_schedule_group_student();

create index if not exists schedule_groups_teacher_idx on public.schedule_groups (teacher_id, status);
create index if not exists schedule_groups_period_idx on public.schedule_groups (starts_on, ends_on);
create index if not exists schedule_rules_group_idx on public.schedule_rules (group_id, weekday);
create index if not exists lesson_sessions_calendar_idx on public.lesson_sessions (starts_at, teacher_id, status);
create index if not exists lesson_sessions_group_idx on public.lesson_sessions (group_id, starts_at);
create index if not exists schedule_group_students_student_idx on public.schedule_group_students (student_id, status);

-- PostgreSQL exclusion constraints make conflict checks atomic even when two
-- requests attempt to create overlapping lessons at the same time.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'lesson_sessions_teacher_no_overlap') then
    alter table public.lesson_sessions add constraint lesson_sessions_teacher_no_overlap
      exclude using gist (
        teacher_id with =,
        tstzrange(starts_at, ends_at, '[)') with &&
      ) where (status = 'scheduled');
  end if;

  if not exists (select 1 from pg_constraint where conname = 'lesson_sessions_classroom_no_overlap') then
    alter table public.lesson_sessions add constraint lesson_sessions_classroom_no_overlap
      exclude using gist (
        classroom_id with =,
        tstzrange(starts_at, ends_at, '[)') with &&
      ) where (status = 'scheduled' and classroom_id is not null);
  end if;
end $$;

alter table public.classrooms enable row level security;
alter table public.schedule_groups enable row level security;
alter table public.schedule_rules enable row level security;
alter table public.lesson_sessions enable row level security;
alter table public.schedule_group_students enable row level security;

create policy "staff manage classrooms" on public.classrooms
  for all to authenticated using ((select public.is_staff())) with check ((select public.is_staff()));
create policy "teachers read classrooms" on public.classrooms
  for select to authenticated using ((select public.is_teacher()));

create policy "staff manage schedule groups" on public.schedule_groups
  for all to authenticated using ((select public.is_staff())) with check ((select public.is_staff()));
create policy "teachers read own schedule groups" on public.schedule_groups
  for select to authenticated using (teacher_id = (select auth.uid()));

create policy "staff manage schedule rules" on public.schedule_rules
  for all to authenticated using ((select public.is_staff())) with check ((select public.is_staff()));
create policy "teachers read own schedule rules" on public.schedule_rules
  for select to authenticated using (
    exists (
      select 1 from public.schedule_groups g
      where g.id = schedule_rules.group_id and g.teacher_id = (select auth.uid())
    )
  );

create policy "staff manage lesson sessions" on public.lesson_sessions
  for all to authenticated using ((select public.is_staff())) with check ((select public.is_staff()));
create policy "teachers read own lesson sessions" on public.lesson_sessions
  for select to authenticated using (teacher_id = (select auth.uid()));
create policy "students read assigned lesson sessions" on public.lesson_sessions
  for select to authenticated using (
    exists (
      select 1 from public.schedule_group_students member
      where member.group_id = lesson_sessions.group_id
        and member.student_id = (select auth.uid())
        and member.status = 'active'
    )
  );

create policy "staff manage schedule group students" on public.schedule_group_students
  for all to authenticated using ((select public.is_staff())) with check ((select public.is_staff()));
create policy "teachers read own group students" on public.schedule_group_students
  for select to authenticated using (
    exists (
      select 1 from public.schedule_groups g
      where g.id = schedule_group_students.group_id and g.teacher_id = (select auth.uid())
    )
  );
create policy "students read own group memberships" on public.schedule_group_students
  for select to authenticated using (student_id = (select auth.uid()));

-- Called by the trusted backend after validating the preview. It materializes
-- sessions using the Almaty school timezone. Exclusion constraints reject all
-- teacher/classroom conflicts in the same transaction.
create or replace function public.generate_schedule_group_sessions(p_group_id uuid)
returns integer
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_created integer;
begin
  insert into public.lesson_sessions (
    group_id, teacher_id, course_id, classroom_id, starts_at, ends_at
  )
  select
    g.id,
    g.teacher_id,
    g.course_id,
    g.classroom_id,
    ((calendar_day::date + rule.time_start) at time zone 'Asia/Almaty'),
    ((calendar_day::date + rule.time_end) at time zone 'Asia/Almaty')
  from public.schedule_groups g
  join public.schedule_rules rule on rule.group_id = g.id
  cross join lateral generate_series(g.starts_on, g.ends_on, interval '1 day') calendar_day
  where g.id = p_group_id
    and g.status = 'active'
    and extract(isodow from calendar_day)::smallint = rule.weekday
    and not exists (
      select 1 from public.lesson_sessions existing
      where existing.group_id = g.id
        and existing.starts_at = ((calendar_day::date + rule.time_start) at time zone 'Asia/Almaty')
    );

  get diagnostics v_created = row_count;
  return v_created;
end;
$$;

revoke all on function public.generate_schedule_group_sessions(uuid) from public, anon, authenticated;
grant execute on function public.generate_schedule_group_sessions(uuid) to service_role;
