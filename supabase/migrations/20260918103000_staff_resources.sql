create table if not exists public.staff_resources (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) between 1 and 300),
  description text not null default '',
  category text not null check (category in (
    'company', 'services', 'presentations', 'documents', 'sales',
    'marketing', 'training', 'templates', 'links'
  )),
  service text,
  resource_type text not null check (resource_type in (
    'document', 'presentation', 'link', 'video', 'template'
  )),
  status text not null default 'draft' check (status in (
    'draft', 'review', 'published', 'archived'
  )),
  file_path text,
  external_url text,
  original_name text,
  mime_type text,
  size_bytes bigint check (size_bytes is null or size_bytes >= 0),
  knowledge_article_id uuid references public.knowledge_articles(id) on delete set null,
  allowed_roles text[] not null default array['admin', 'manager']::text[],
  uploaded_by uuid not null references public.profiles(id),
  published_by uuid references public.profiles(id),
  published_at timestamptz,
  next_review_at date,
  version integer not null default 1 check (version > 0),
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint staff_resources_exactly_one_source check (
    num_nonnulls(file_path, external_url) = 1
  ),
  constraint staff_resources_allowed_roles_valid check (
    cardinality(allowed_roles) > 0
    and allowed_roles <@ array['admin', 'manager']::text[]
  )
);

create index if not exists staff_resources_status_updated_idx
  on public.staff_resources (status, updated_at desc);
create index if not exists staff_resources_category_idx
  on public.staff_resources (category);
create index if not exists staff_resources_knowledge_article_idx
  on public.staff_resources (knowledge_article_id)
  where knowledge_article_id is not null;

alter table public.staff_resources enable row level security;
revoke all on table public.staff_resources from anon, authenticated;
grant all on table public.staff_resources to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'staff-resources',
  'staff-resources',
  false,
  15728640,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/png',
    'image/jpeg'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

comment on table public.staff_resources is
  'Internal company files and links. Read and write access is only through the role-protected backend.';
