-- Homework completion awards XP exactly once. The backend calls this RPC with
-- source = 'homework_completed' and source_id = assignments.id.

do $$
declare
  constraint_name text;
begin
  select conname into constraint_name
  from pg_constraint
  where conrelid = 'public.assignments'::regclass
    and contype = 'c'
    and pg_get_constraintdef(oid) ilike '%status%';

  if constraint_name is not null then
    execute format('alter table public.assignments drop constraint %I', constraint_name);
  end if;
end $$;

alter table public.assignments
  add constraint assignments_status_check
  check (status in ('pending', 'assigned', 'in_progress', 'submitted', 'reviewed', 'returned', 'completed', 'overdue'));

create unique index if not exists xp_log_source_once_idx
  on public.xp_log (source, source_id)
  where source_id is not null;

create or replace function public.award_student_xp(
  p_student_id uuid,
  p_amount integer,
  p_source text,
  p_source_id uuid
)
returns boolean
language plpgsql
security invoker
set search_path = public
as $$
declare
  inserted_count integer;
begin
  if p_amount <= 0 then
    raise exception 'XP amount must be positive';
  end if;

  insert into public.xp_log (student_id, amount, source, source_id)
  values (p_student_id, p_amount, p_source, p_source_id)
  on conflict (source, source_id) where source_id is not null do nothing;

  get diagnostics inserted_count = row_count;
  if inserted_count = 0 then
    return false;
  end if;
  

  update public.students
  set xp = coalesce(xp, 0) + p_amount,
      level = greatest(1, floor((coalesce(xp, 0) + p_amount) / 500.0)::integer + 1)
  where id = p_student_id;

  if not found then
    raise exception 'Student not found';
  end if;

  return true;
end;
$$;

revoke all on function public.award_student_xp(uuid, integer, text, uuid) from public, anon, authenticated;
grant execute on function public.award_student_xp(uuid, integer, text, uuid) to service_role;
