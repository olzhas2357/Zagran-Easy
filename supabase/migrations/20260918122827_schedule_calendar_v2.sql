-- Calendar-based language lesson schedule.
-- One row in schedule_slots is now one concrete date/time/format combination.

alter table public.schedule_courses
  add column if not exists language text,
  add column if not exists allowed_weekdays smallint[];

update public.schedule_courses
set language = case
  when lower(name) like '%китай%' then 'chinese'
  else 'english'
end
where language is null;

update public.schedule_courses
set
  allowed_weekdays = case language when 'chinese' then array[4, 5, 6]::smallint[] else array[1, 2, 3]::smallint[] end,
  offline_cap = 8,
  online_cap = 10,
  updated_at = now();

alter table public.schedule_slots
  add column if not exists lesson_date date,
  add column if not exists format text,
  add column if not exists capacity integer,
  add column if not exists created_by uuid references public.profiles(id);

-- Preserve old recurring rows by placing them on their next valid date.
-- Existing Chinese rows were shared by Thu-Sat; keep the originals on Saturday,
-- then clone them for Thursday and Friday below.
update public.schedule_slots s
set lesson_date = current_date + (
  (
    case
      when c.language = 'chinese' then 6
      when lower(c.days) like 'втор%' then 2
      when lower(c.days) like 'сред%' then 3
      else 1
    end
    - extract(isodow from current_date)::integer + 7
  ) % 7
)
from public.schedule_courses c
where s.course_id = c.id and s.lesson_date is null;

-- Day-specific legacy values have been consumed; courses can now be
-- normalized to one label per language.
update public.schedule_courses
set
  name = case language when 'chinese' then 'Китайский язык' else 'Английский язык' end,
  days = case language when 'chinese' then 'Четверг, пятница, суббота' else 'Понедельник, вторник, среда' end,
  updated_at = now();

-- A 00:00 placeholder was created by the old UI. Restore the intended example
-- time used for the English schedule instead of migrating an unusable slot.
update public.schedule_slots s
set time_start = '15:00', time_end = '17:00'
from public.schedule_courses c
where s.course_id = c.id
  and c.language = 'english'
  and s.time_start = '00:00'
  and s.time_end = '00:00';

update public.schedule_slots s
set format = 'offline', capacity = c.offline_cap
from public.schedule_courses c
where s.course_id = c.id and s.format is null;

-- Split every legacy dual-format slot into one offline and one online slot,
-- then move the old online enrollments to the new online row.
create temporary table schedule_legacy_online_map (
  old_slot_id uuid primary key,
  online_slot_id uuid not null unique
) on commit drop;

insert into schedule_legacy_online_map (old_slot_id, online_slot_id)
select id, gen_random_uuid()
from public.schedule_slots
where format = 'offline';

insert into public.schedule_slots (
  id, course_id, time_start, time_end, sort_order, is_active,
  created_at, updated_at, lesson_date, format, capacity, created_by
)
select
  m.online_slot_id, s.course_id, s.time_start, s.time_end, s.sort_order,
  s.is_active, s.created_at, now(), s.lesson_date, 'online', c.online_cap,
  s.created_by
from schedule_legacy_online_map m
join public.schedule_slots s on s.id = m.old_slot_id
join public.schedule_courses c on c.id = s.course_id;

update public.schedule_enrollments e
set slot_id = m.online_slot_id
from schedule_legacy_online_map m
where e.slot_id = m.old_slot_id and e.format = 'online';

-- Materialize the current Chinese timetable for Thursday and Friday as well.
-- No enrollments are copied; the original rows remain on Saturday.
insert into public.schedule_slots (
  course_id, time_start, time_end, sort_order, is_active, created_at,
  updated_at, lesson_date, format, capacity, created_by
)
select
  s.course_id, s.time_start, s.time_end, s.sort_order, s.is_active, now(),
  now(),
  current_date + ((target.iso_day - extract(isodow from current_date)::integer + 7) % 7),
  s.format, s.capacity, s.created_by
from public.schedule_slots s
join public.schedule_courses c on c.id = s.course_id
cross join (values (4), (5)) as target(iso_day)
where c.language = 'chinese'
  and s.lesson_date = current_date + ((6 - extract(isodow from current_date)::integer + 7) % 7);

-- Merge duplicate language rows left by the old text-based day editor.
with course_map as (
  select
    id,
    first_value(id) over (
      partition by language
      order by created_at, id
    ) as canonical_id
  from public.schedule_courses
)
update public.schedule_slots s
set course_id = course_map.canonical_id
from course_map
where s.course_id = course_map.id
  and s.course_id <> course_map.canonical_id;

with ranked as (
  select
    id,
    row_number() over (partition by language order by created_at, id) as position
  from public.schedule_courses
)
update public.schedule_courses c
set is_active = (ranked.position = 1), updated_at = now()
from ranked
where c.id = ranked.id;

alter table public.schedule_slots
  alter column time_start type time without time zone using time_start::time,
  alter column time_end type time without time zone using time_end::time,
  alter column lesson_date set not null,
  alter column format set not null,
  alter column capacity set not null;

alter table public.schedule_courses
  alter column language set not null,
  alter column allowed_weekdays set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'schedule_courses_language_check'
      and conrelid = 'public.schedule_courses'::regclass
  ) then
    alter table public.schedule_courses
      add constraint schedule_courses_language_check
      check (language in ('english', 'chinese'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'schedule_courses_weekdays_check'
      and conrelid = 'public.schedule_courses'::regclass
  ) then
    alter table public.schedule_courses
      add constraint schedule_courses_weekdays_check
      check (
        cardinality(allowed_weekdays) > 0
        and allowed_weekdays <@ array[1, 2, 3, 4, 5, 6, 7]::smallint[]
      );
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'schedule_slots_format_check'
      and conrelid = 'public.schedule_slots'::regclass
  ) then
    alter table public.schedule_slots
      add constraint schedule_slots_format_check
      check (format in ('offline', 'online'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'schedule_slots_capacity_check'
      and conrelid = 'public.schedule_slots'::regclass
  ) then
    alter table public.schedule_slots
      add constraint schedule_slots_capacity_check
      check (capacity between 1 and 100);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'schedule_slots_time_order_check'
      and conrelid = 'public.schedule_slots'::regclass
  ) then
    alter table public.schedule_slots
      add constraint schedule_slots_time_order_check
      check (time_end > time_start);
  end if;
end $$;

create unique index if not exists schedule_courses_active_language_uidx
  on public.schedule_courses (language)
  where is_active;

create unique index if not exists schedule_slots_unique_active_uidx
  on public.schedule_slots (course_id, lesson_date, time_start, time_end, format)
  where is_active;

create index if not exists schedule_slots_calendar_idx
  on public.schedule_slots (lesson_date, course_id, format)
  where is_active;

alter table public.schedule_enrollments
  add column if not exists student_id uuid references public.profiles(id);

-- Format now belongs to the slot. Keep the legacy column synchronized for
-- backwards compatibility with existing reports.
update public.schedule_enrollments e
set format = s.format
from public.schedule_slots s
where s.id = e.slot_id and e.format is distinct from s.format;

create unique index if not exists schedule_enrollments_slot_student_uidx
  on public.schedule_enrollments (slot_id, student_id)
  where student_id is not null;

create index if not exists schedule_enrollments_student_idx
  on public.schedule_enrollments (student_id)
  where student_id is not null;

-- Capacity check and insert must be atomic. The backend service-role is the
-- only role allowed to call this function; clients cannot bypass NestJS auth.
create or replace function public.create_schedule_enrollment(
  p_slot_id uuid,
  p_student_id uuid,
  p_student_name text,
  p_student_phone text default null
)
returns public.schedule_enrollments
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_slot public.schedule_slots%rowtype;
  v_enrollment public.schedule_enrollments%rowtype;
  v_count integer;
begin
  select * into v_slot
  from public.schedule_slots
  where id = p_slot_id and is_active
  for update;

  if not found then
    raise exception 'Слот не найден или уже закрыт';
  end if;

  if p_student_id is not null and exists (
    select 1 from public.schedule_enrollments
    where slot_id = p_slot_id and student_id = p_student_id
  ) then
    raise exception 'Вы уже записаны на это занятие';
  end if;

  if p_student_id is null and exists (
    select 1 from public.schedule_enrollments
    where slot_id = p_slot_id
      and lower(btrim(student_name)) = lower(btrim(p_student_name))
      and coalesce(regexp_replace(student_phone, '[^0-9]', '', 'g'), '') =
          coalesce(regexp_replace(p_student_phone, '[^0-9]', '', 'g'), '')
  ) then
    raise exception 'Студент уже записан на это занятие';
  end if;

  select count(*) into v_count
  from public.schedule_enrollments
  where slot_id = p_slot_id;

  if v_count >= v_slot.capacity then
    raise exception 'Свободных мест больше нет';
  end if;

  insert into public.schedule_enrollments (
    slot_id, format, student_id, student_name, student_phone
  ) values (
    p_slot_id,
    v_slot.format,
    p_student_id,
    btrim(p_student_name),
    nullif(btrim(p_student_phone), '')
  )
  returning * into v_enrollment;

  return v_enrollment;
end;
$$;

revoke all on function public.create_schedule_enrollment(uuid, uuid, text, text)
  from public, anon, authenticated;
grant execute on function public.create_schedule_enrollment(uuid, uuid, text, text)
  to service_role;
