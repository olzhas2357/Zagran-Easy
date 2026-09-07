alter table public.courses
  add column if not exists total_lessons integer not null default 0,
  add column if not exists total_tasks integer not null default 0,
  add column if not exists estimated_hours numeric not null default 0,
  add column if not exists is_active boolean not null default true,
  add column if not exists image_url text,
  add column if not exists sort_order integer not null default 0;

create index if not exists courses_active_sort_order_idx
  on public.courses (is_active, sort_order);