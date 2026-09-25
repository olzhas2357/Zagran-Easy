-- Keep both legacy arrays in sync in one transaction. Only the trusted API may
-- mutate relationships; authorization is enforced by ParentsController.
create or replace function public.set_parent_child_link(
  p_parent_id uuid, p_student_id uuid, p_linked boolean
) returns void
language plpgsql security invoker set search_path = '' as $$
begin
  if p_linked is null then
    raise exception 'linked is required' using errcode = '22004';
  end if;
  -- Lock parent first, then child: concurrent links cannot overwrite each other.
  perform 1 from public.profiles where id = p_parent_id and role = 'parent' for update;
  if not found then
    raise exception 'Parent not found' using errcode = 'P0002';
  end if;
  perform 1 from public.students s join public.profiles p on p.id = s.id
    where s.id = p_student_id and p.role = 'student' for update of s;
  if not found then
    raise exception 'Student not found' using errcode = 'P0002';
  end if;

  insert into public.parents(id, children) values (p_parent_id, '{}'::uuid[])
    on conflict (id) do nothing;
  update public.parents set children = case when p_linked then
    array_append(array_remove(coalesce(children, '{}'::uuid[]), p_student_id), p_student_id)
    else array_remove(coalesce(children, '{}'::uuid[]), p_student_id) end
    where id = p_parent_id;
  update public.students set parent_ids = case when p_linked then
    array_append(array_remove(coalesce(parent_ids, '{}'::uuid[]), p_parent_id), p_parent_id)
    else array_remove(coalesce(parent_ids, '{}'::uuid[]), p_parent_id) end
    where id = p_student_id;
end;
$$;
revoke all on function public.set_parent_child_link(uuid, uuid, boolean) from public, anon, authenticated;
grant execute on function public.set_parent_child_link(uuid, uuid, boolean) to service_role;

-- Existing accounts should have an empty parent record even before linking.
insert into public.parents(id, children)
select id, '{}'::uuid[] from public.profiles where role = 'parent'
on conflict (id) do nothing;

create or replace function private.create_parent_record()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  if new.role = 'parent' then
    insert into public.parents(id, children) values (new.id, '{}'::uuid[])
      on conflict (id) do nothing;
  end if;
  return new;
end;
$$;
revoke all on function private.create_parent_record() from public, anon, authenticated;
create trigger profiles_create_parent_record after insert or update of role on public.profiles
for each row execute function private.create_parent_record();

alter table public.parents enable row level security;
revoke all on public.parents from anon, authenticated;
grant select on public.parents to authenticated;
grant select, insert, update, delete on public.parents to service_role;
create policy "parents read own links" on public.parents for select to authenticated
using (id = (select auth.uid()));

