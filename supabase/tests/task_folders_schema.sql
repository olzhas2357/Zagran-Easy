-- Run only in an empty disposable database: this file creates minimal test tables and roles.
\set ON_ERROR_STOP on
create role anon;
create role authenticated;
create role service_role;
create table public.profiles (id uuid primary key);
create table public.tasks (id uuid primary key, teacher_id uuid references public.profiles(id));
\ir ../migrations/20260925112436_teacher_task_folders.sql
insert into profiles values ('00000000-0000-0000-0000-000000000001'), ('00000000-0000-0000-0000-000000000002');
insert into task_folders (id,teacher_id,name) values
 ('00000000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000001','Present Simple'),
 ('00000000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000002','Present Simple');
insert into tasks values ('00000000-0000-0000-0000-000000000021','00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000011');
do $$ begin
  begin
    update tasks set folder_id = '00000000-0000-0000-0000-000000000012';
    raise exception 'Cross-teacher folder assignment was allowed';
  exception when foreign_key_violation then null; end;
  begin
    insert into task_folders(teacher_id,name) values ('00000000-0000-0000-0000-000000000001',' present simple ');
    raise exception 'Duplicate folder was allowed';
  exception when unique_violation then null; end;
  begin
    insert into task_folders(teacher_id,name) values ('00000000-0000-0000-0000-000000000001','  ');
    raise exception 'Empty folder name was allowed';
  exception when check_violation then null; end;
  begin
    update tasks set teacher_id = null;
    raise exception 'Ownerless task in folder was allowed';
  exception when check_violation then null; end;
  if has_table_privilege('authenticated','public.task_folders','SELECT') or has_table_privilege('anon','public.task_folders','INSERT') then
    raise exception 'Folder table exposed to public roles';
  end if;
  if not (select relrowsecurity from pg_class where oid = 'public.task_folders'::regclass) then
    raise exception 'RLS is disabled';
  end if;
end $$;
update tasks set folder_id = null;
select 'Folder migration checks passed' as result;
