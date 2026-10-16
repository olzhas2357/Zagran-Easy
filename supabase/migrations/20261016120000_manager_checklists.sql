-- Ежемесячные чек-листы для менеджеров: цель, скрипт и шаги. Управляет админ.
create table if not exists public.manager_checklists (
  id uuid primary key default gen_random_uuid(),
  month date not null check (month = date_trunc('month', month)::date),
  title text not null check (char_length(btrim(title)) between 1 and 300),
  goal text not null default '',
  target_count integer not null default 0 check (target_count >= 0),
  target_label text not null default '',
  steps jsonb not null default '[]'::jsonb check (jsonb_typeof(steps) = 'array'),
  sort_order integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists manager_checklists_month_idx
  on public.manager_checklists (month, sort_order);

create table if not exists public.manager_checklist_progress (
  checklist_id uuid not null references public.manager_checklists(id) on delete cascade,
  manager_id uuid not null references public.profiles(id) on delete cascade,
  completed_steps text[] not null default '{}',
  done_count integer not null default 0 check (done_count >= 0),
  updated_at timestamptz not null default now(),
  primary key (checklist_id, manager_id)
);

alter table public.manager_checklists enable row level security;
alter table public.manager_checklist_progress enable row level security;
revoke all on table public.manager_checklists from anon, authenticated;
revoke all on table public.manager_checklist_progress from anon, authenticated;
grant all on table public.manager_checklists to service_role;
grant all on table public.manager_checklist_progress to service_role;

comment on table public.manager_checklists is
  'Monthly manager checklists. steps: [{id,title,say,do}]. Access only through the role-protected backend.';
