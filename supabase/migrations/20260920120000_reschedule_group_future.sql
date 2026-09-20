-- Atomically replace weekly rules from an effective date while preserving
-- cancelled future sessions as history and leaving past sessions untouched.

create or replace function public.reschedule_schedule_group_future(
  p_group_id uuid,
  p_effective_date date,
  p_rules jsonb
)
returns integer
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_group public.schedule_groups%rowtype;
  v_created integer;
begin
  select * into strict v_group
  from public.schedule_groups
  where id = p_group_id
  for update;

  if p_effective_date < v_group.starts_on or p_effective_date > v_group.ends_on then
    raise exception 'Дата изменения находится вне периода расписания';
  end if;

  if jsonb_typeof(p_rules) <> 'array' or jsonb_array_length(p_rules) = 0 then
    raise exception 'Добавьте хотя бы один день занятий';
  end if;

  if exists (
    select 1
    from jsonb_to_recordset(p_rules) as rule(weekday smallint, time_start time, time_end time)
    where rule.weekday not between 1 and 7 or rule.time_end <= rule.time_start
  ) then
    raise exception 'Некорректный день недели или время занятия';
  end if;

  if (
    select count(*) <> count(distinct rule.weekday)
    from jsonb_to_recordset(p_rules) as rule(weekday smallint)
  ) then
    raise exception 'День недели выбран несколько раз';
  end if;

  update public.lesson_sessions
  set
    status = 'cancelled',
    cancellation_reason = 'Расписание изменено администратором',
    updated_at = now()
  where group_id = p_group_id
    and status = 'scheduled'
    and (starts_at at time zone 'Asia/Almaty')::date >= p_effective_date;

  delete from public.schedule_rules where group_id = p_group_id;

  insert into public.schedule_rules (group_id, weekday, time_start, time_end)
  select p_group_id, rule.weekday, rule.time_start, rule.time_end
  from jsonb_to_recordset(p_rules) as rule(
    weekday smallint,
    time_start time without time zone,
    time_end time without time zone
  );

  insert into public.lesson_sessions (
    group_id, teacher_id, course_id, classroom_id, starts_at, ends_at
  )
  select
    v_group.id,
    v_group.teacher_id,
    v_group.course_id,
    v_group.classroom_id,
    ((calendar_day::date + rule.time_start) at time zone 'Asia/Almaty'),
    ((calendar_day::date + rule.time_end) at time zone 'Asia/Almaty')
  from public.schedule_rules rule
  cross join lateral generate_series(
    greatest(v_group.starts_on, p_effective_date),
    v_group.ends_on,
    interval '1 day'
  ) calendar_day
  where rule.group_id = p_group_id
    and extract(isodow from calendar_day)::smallint = rule.weekday;

  get diagnostics v_created = row_count;
  update public.schedule_groups set updated_at = now() where id = p_group_id;
  return v_created;
end;
$$;

revoke all on function public.reschedule_schedule_group_future(uuid, date, jsonb)
  from public, anon, authenticated;
grant execute on function public.reschedule_schedule_group_future(uuid, date, jsonb)
  to service_role;

