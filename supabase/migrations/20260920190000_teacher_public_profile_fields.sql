alter table public.teachers
  add column if not exists is_published boolean not null default false,
  add column if not exists experience text,
  add column if not exists certificate_url text;

create index if not exists teachers_is_published_idx
  on public.teachers (is_published)
  where is_published = true;

