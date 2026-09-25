-- Run after the migration, inside a transaction; fixtures are rolled back.
begin;
insert into auth.users(id, email) values
('00000000-0000-4000-8000-000000000901', 'parent-link-test@example.invalid'),
('00000000-0000-4000-8000-000000000902', 'child-link-test@example.invalid');
insert into public.profiles(id, role, full_name) values
('00000000-0000-4000-8000-000000000901', 'parent', 'Link test parent'),
('00000000-0000-4000-8000-000000000902', 'student', 'Link test student')
on conflict(id) do update set role = excluded.role;
insert into public.students(id) values ('00000000-0000-4000-8000-000000000902');
do $$
declare
  p uuid := '00000000-0000-4000-8000-000000000901';
  s uuid := '00000000-0000-4000-8000-000000000902';
  
begin
  if not exists(select 1 from public.parents where id=p) then raise exception 'Parent creation failed'; end if;
  perform public.set_parent_child_link(p,s,true);
  perform public.set_parent_child_link(p,s,true);
  if (select children from public.parents where id=p) is distinct from array[s] then raise exception 'Link not idempotent'; end if;
  if (select parent_ids from public.students where id=s) is distinct from array[p] then raise exception 'Reverse link missing'; end if;
  perform public.set_parent_child_link(p,s,false);
  perform public.set_parent_child_link(p,s,false);
  if (select children from public.parents where id=p) is distinct from '{}'::uuid[] then raise exception 'Unlink failed'; end if;
  if (select parent_ids from public.students where id=s) is distinct from '{}'::uuid[] then raise exception 'Reverse unlink failed'; end if;
  begin
    perform public.set_parent_child_link(s,s,true);
    raise exception 'Non-parent accepted';
  exception when no_data_found then null;
  end;
  begin
    perform public.set_parent_child_link(p,p,true);
    raise exception 'Non-student accepted';
  exception when no_data_found then null;
  end;
  if has_function_privilege('authenticated', 'public.set_parent_child_link(uuid,uuid,boolean)', 'execute') then raise exception 'Client can mutate links'; end if;
  if has_function_privilege('anon', 'public.set_parent_child_link(uuid,uuid,boolean)', 'execute') then raise exception 'Anonymous can mutate links'; end if;
end $$;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000901', true);
do $$ begin
  if (select count(*) from public.parents) <> 1 then raise exception 'Parent cannot read own row or sees other parents'; end if;
  if has_table_privilege('authenticated', 'public.parents', 'update') then raise exception 'Client can modify parent arrays'; end if;
end $$;
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000902', true);
do $$ begin
  if exists(select 1 from public.parents) then raise exception 'Unrelated user sees parent links'; end if;
end $$;
reset role;
rollback;
