-- ============================================================
-- ZagranEasy — расширяет profiles.role до всех ролей приложения.
-- Раньше check ограничивал role только 'admin'/'manager' (роль
-- teacher/student определялась отдельными таблицами teachers/students,
-- см. 0006). NestJS-бэкенд (CreateUserDto) уже разрешает создавать
-- пользователей с role in ('admin','manager','teacher','student','parent') —
-- без этой миграции INSERT в profiles с такой ролью падает на constraint.
-- Применять через Supabase SQL Editor, после 0007.
-- ============================================================

-- Ищем constraint по факту (colum = role, тип = check), а не по имени —
-- Postgres называет безымянные inline-check по умолчанию profiles_role_check,
-- но полагаться на угаданное имя рискованно (может остаться дубликат).
do $$
declare
  con record;
begin
  for con in
    select conname
    from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%role%'
  loop
    execute format('alter table public.profiles drop constraint %I', con.conname);
  end loop;
end $$;

alter table profiles
  add constraint profiles_role_check
  check (role in ('admin', 'manager', 'teacher', 'student', 'parent'));
