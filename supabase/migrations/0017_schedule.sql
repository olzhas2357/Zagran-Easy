-- Общее расписание менеджеров и администраторов.
create table if not exists schedule_courses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  days text not null default '',
  offline_cap integer not null default 0 check (offline_cap >= 0),
  online_cap integer not null default 0 check (online_cap >= 0),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists schedule_slots (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references schedule_courses(id) on delete cascade,
  time_start text not null,
  time_end text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists schedule_enrollments (
  id uuid primary key default gen_random_uuid(),
  slot_id uuid not null references schedule_slots(id) on delete cascade,
  format text not null check (format in ('offline', 'online')),
  student_name text not null,
  student_phone text,
  enrolled_at timestamptz not null default now()
);

create index if not exists schedule_slots_course_idx on schedule_slots(course_id);
create index if not exists schedule_enrollments_slot_format_idx on schedule_enrollments(slot_id, format);

alter table schedule_courses enable row level security;
alter table schedule_slots enable row level security;
alter table schedule_enrollments enable row level security;

create policy "staff manage schedule courses" on schedule_courses
  for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage schedule slots" on schedule_slots
  for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage schedule enrollments" on schedule_enrollments
  for all using (public.is_staff()) with check (public.is_staff());

insert into schedule_courses (name, days, offline_cap, online_cap, sort_order)
values
  ('Английский', 'Пн — Ср', 8, 10, 0),
  ('Китайский', 'Чт — Сб', 6, 10, 1)
on conflict do nothing;

insert into schedule_slots (course_id, time_start, time_end, sort_order)
select id, '15:00', '17:00', 0 from schedule_courses where name = 'Английский'
  and not exists (select 1 from schedule_slots where course_id = schedule_courses.id);

insert into schedule_slots (course_id, time_start, time_end, sort_order)
select id, slot.time_start, slot.time_end, slot.sort_order
from schedule_courses
cross join (values
  ('10:00', '11:30', 0), ('11:45', '13:15', 1), ('13:45', '15:15', 2),
  ('15:30', '17:00', 3), ('17:15', '18:45', 4)
) as slot(time_start, time_end, sort_order)
where schedule_courses.name = 'Китайский'
  and not exists (select 1 from schedule_slots where course_id = schedule_courses.id);