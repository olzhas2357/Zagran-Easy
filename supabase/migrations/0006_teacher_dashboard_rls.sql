-- ============================================================
-- ZagranEasy — Teacher Dashboard: RLS для кабинета преподавателя
-- Роль "учитель" определяется наличием строки в teachers (id = profiles.id),
-- НЕ через profiles.role (там check остаётся 'admin'|'manager').
--
-- Также чинит 42P17 infinite recursion на profiles: пересоздаём все
-- политики на profiles через DO-блок, чтобы не зависеть от того, как
-- называлась политика, добавленная напрямую в Supabase Studio.
-- Применять через Supabase SQL Editor.
-- ============================================================

-- ---------- Хелперы (security definer — не триггерят RLS повторно) ----------

drop function if exists public.is_teacher();
create function public.is_teacher()
returns boolean as $$
  select exists (select 1 from public.teachers where id = auth.uid());
$$ language sql stable security definer set search_path = public;

drop function if exists public.is_my_student(uuid);
create function public.is_my_student(pid uuid)
returns boolean as $$
  select exists (select 1 from public.students where id = pid and teacher_id = auth.uid());
$$ language sql stable security definer set search_path = public;

drop function if exists public.owns_lesson(uuid);
create function public.owns_lesson(lid uuid)
returns boolean as $$
  select exists (
    select 1 from public.scheduled_lessons sl
    join public.teachers t on t.id = sl.teacher_id
    where sl.id = lid and t.id = auth.uid()
  );
$$ language sql stable security definer set search_path = public;

-- ---------- profiles: пересоздать все политики без рекурсии ----------

do $$
declare
  pol record;
begin
  for pol in select policyname from pg_policies where schemaname = 'public' and tablename = 'profiles'
  loop
    execute format('drop policy if exists %I on public.profiles', pol.policyname);
  end loop;
end $$;

create policy "staff read own profile" on profiles for select using (id = auth.uid() or public.is_admin());
create policy "admin manage profiles" on profiles for update using (public.is_admin()) with check (public.is_admin());
create policy "teachers view own students profiles" on profiles for select using (public.is_my_student(id));

-- ---------- teachers ----------

alter table teachers enable row level security;
drop policy if exists "teacher read own row" on teachers;
create policy "teacher read own row" on teachers for select using (id = auth.uid() or public.is_staff());
drop policy if exists "staff manage teachers" on teachers;
create policy "staff manage teachers" on teachers for all using (public.is_staff()) with check (public.is_staff());

-- ---------- students ----------

alter table students enable row level security;
drop policy if exists "teacher read own students" on students;
create policy "teacher read own students" on students for select
  using (teacher_id = auth.uid() or id = auth.uid() or public.is_staff());
drop policy if exists "staff manage students" on students;
create policy "staff manage students" on students for all using (public.is_staff()) with check (public.is_staff());

-- ---------- student_teachers ----------

alter table student_teachers enable row level security;
drop policy if exists "teacher read own student_teachers" on student_teachers;
create policy "teacher read own student_teachers" on student_teachers for select
  using (teacher_id = auth.uid() or student_id = auth.uid() or public.is_staff());
drop policy if exists "staff manage student_teachers" on student_teachers;
create policy "staff manage student_teachers" on student_teachers for all using (public.is_staff()) with check (public.is_staff());

-- ---------- scheduled_lessons ----------

alter table scheduled_lessons enable row level security;
drop policy if exists "teacher manage own lessons" on scheduled_lessons;
create policy "teacher manage own lessons" on scheduled_lessons for all
  using (teacher_id = auth.uid() or auth.uid() = any(student_ids) or public.is_staff())
  with check (teacher_id = auth.uid() or public.is_staff());

-- ---------- tasks (банк заданий — общий для всех учителей) ----------

alter table tasks enable row level security;
drop policy if exists "teacher read tasks" on tasks;
create policy "teacher read tasks" on tasks for select using (public.is_teacher() or public.is_staff());
drop policy if exists "staff manage tasks" on tasks;
create policy "staff manage tasks" on tasks for all using (public.is_staff()) with check (public.is_staff());

-- ---------- task_attempts ----------

alter table task_attempts enable row level security;
drop policy if exists "teacher read own students attempts" on task_attempts;
create policy "teacher read own students attempts" on task_attempts for select
  using (public.is_my_student(student_id) or student_id = auth.uid() or public.is_staff());
drop policy if exists "teacher review own students attempts" on task_attempts;
create policy "teacher review own students attempts" on task_attempts for update
  using (public.is_my_student(student_id) or public.is_staff())
  with check (public.is_my_student(student_id) or public.is_staff());
drop policy if exists "student insert own attempts" on task_attempts;
create policy "student insert own attempts" on task_attempts for insert
  with check (student_id = auth.uid() or public.is_staff());

-- ---------- assignments ----------

alter table assignments enable row level security;
drop policy if exists "teacher manage own assignments" on assignments;
create policy "teacher manage own assignments" on assignments for all
  using (teacher_id = auth.uid() or student_id = auth.uid() or public.is_staff())
  with check (teacher_id = auth.uid() or public.is_staff());

-- ---------- goals ----------

alter table goals enable row level security;
drop policy if exists "teacher read own students goals" on goals;
create policy "teacher read own students goals" on goals for select
  using (public.is_my_student(student_id) or student_id = auth.uid() or public.is_staff());

-- ---------- notifications ----------

alter table notifications enable row level security;
drop policy if exists "user read own notifications" on notifications;
create policy "user read own notifications" on notifications for select using (user_id = auth.uid());
drop policy if exists "user update own notifications" on notifications;
create policy "user update own notifications" on notifications for update
  using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "teacher insert notifications" on notifications;
create policy "teacher insert notifications" on notifications for insert
  with check (public.is_teacher() or public.is_staff());

-- ---------- xp_log ----------

alter table xp_log enable row level security;
drop policy if exists "teacher read own students xp_log" on xp_log;
create policy "teacher read own students xp_log" on xp_log for select
  using (public.is_my_student(student_id) or student_id = auth.uid() or public.is_staff());
drop policy if exists "teacher insert xp_log" on xp_log;
create policy "teacher insert xp_log" on xp_log for insert
  with check (public.is_my_student(student_id) or public.is_staff());

-- ---------- lesson_attendance ----------

alter table lesson_attendance enable row level security;
drop policy if exists "teacher manage own lesson_attendance" on lesson_attendance;
create policy "teacher manage own lesson_attendance" on lesson_attendance for all
  using (public.owns_lesson(lesson_id) or student_id = auth.uid() or public.is_staff())
  with check (public.owns_lesson(lesson_id) or public.is_staff());
