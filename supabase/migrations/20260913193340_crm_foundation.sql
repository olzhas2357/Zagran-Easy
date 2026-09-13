-- CRM foundation for the manager workspace.
-- Safe additive migration: no existing tables or columns are removed.

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated, service_role;

-- profiles gained student/teacher/parent roles in 0008. Keep the legacy helper
-- aligned with its name so those roles never inherit staff RLS policies.
create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role in ('admin', 'manager')
  );
$$;

revoke all on function public.is_staff() from public;
grant execute on function public.is_staff() to authenticated;

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid unique references public.leads(id) on delete set null,
  assigned_manager_id uuid not null references public.profiles(id) on delete restrict,
  created_by uuid not null references public.profiles(id) on delete restrict,

  full_name text not null check (length(trim(full_name)) > 0),
  phone text,
  email text,
  city text,
  birth_date date,
  parent_name text,
  parent_phone text,
  parent_email text,
  preferred_contact text check (preferred_contact in ('phone', 'whatsapp', 'email', 'telegram')),
  source text,

  lead_category text check (lead_category in ('A+', 'A', 'B', 'C')),
  sales_status text not null default 'new'
    check (sales_status in ('new', 'qualified', 'proposal', 'negotiation', 'won', 'lost')),
  product text,
  study_country text,
  specialty text,
  education_level text,
  intake_year integer check (intake_year between 2000 and 2200),
  intake_name text,
  budget numeric check (budget is null or budget >= 0),
  budget_currency text not null default 'KZT',
  language_level text,
  language_exams jsonb not null default '{}'::jsonb
    check (jsonb_typeof(language_exams) = 'object'),
  needs_grant boolean not null default false,
  needs_dormitory boolean not null default false,
  preferences text,
  deal_probability integer check (deal_probability between 0 and 100),
  refusal_reason text,

  next_action text,
  next_contact_at timestamptz,
  admission_stage text not null default 'not_started'
    check (admission_stage in ('not_started', 'documents', 'submitted', 'review', 'accepted', 'visa', 'enrolled', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index clients_assigned_manager_idx on public.clients(assigned_manager_id);
create index clients_sales_status_idx on public.clients(sales_status);
create index clients_next_contact_idx on public.clients(next_contact_at)
  where next_contact_at is not null;
create index clients_full_name_search_idx on public.clients using gin (to_tsvector('simple', full_name));

create table public.client_notes (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete restrict,
  body text not null check (length(trim(body)) > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index client_notes_client_created_idx on public.client_notes(client_id, created_at desc);

create or replace function private.touch_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function private.touch_updated_at() from public;
grant execute on function private.touch_updated_at() to authenticated, service_role;

create trigger clients_touch_updated_at
before update on public.clients
for each row execute function private.touch_updated_at();

create trigger client_notes_touch_updated_at
before update on public.client_notes
for each row execute function private.touch_updated_at();

create or replace function private.current_user_is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

revoke all on function private.current_user_is_admin() from public;
grant execute on function private.current_user_is_admin() to authenticated;
grant execute on function private.current_user_is_admin() to service_role;

create or replace function private.can_access_client(target_client_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.clients c
    where c.id = target_client_id
      and (
        c.assigned_manager_id = (select auth.uid())
        or (select private.current_user_is_admin())
      )
  );
$$;

revoke all on function private.can_access_client(uuid) from public;
grant execute on function private.can_access_client(uuid) to authenticated;
grant execute on function private.can_access_client(uuid) to service_role;

alter table public.clients enable row level security;
alter table public.client_notes enable row level security;

revoke all on table public.clients from anon, authenticated;
revoke all on table public.client_notes from anon, authenticated;
grant select, insert, update on table public.clients to authenticated;
grant select, insert, update, delete on table public.client_notes to authenticated;
grant select, insert, update, delete on table public.clients to service_role;
grant select, insert, update, delete on table public.client_notes to service_role;

create policy "managers read assigned clients"
on public.clients for select
to authenticated
using (
  assigned_manager_id = (select auth.uid())
  or (select private.current_user_is_admin())
);

create policy "managers create assigned clients"
on public.clients for insert
to authenticated
with check (
  created_by = (select auth.uid())
  and (
    assigned_manager_id = (select auth.uid())
    or (select private.current_user_is_admin())
  )
);

create policy "managers update assigned clients"
on public.clients for update
to authenticated
using (
  assigned_manager_id = (select auth.uid())
  or (select private.current_user_is_admin())
)
with check (
  assigned_manager_id = (select auth.uid())
  or (select private.current_user_is_admin())
);

create policy "staff read accessible client notes"
on public.client_notes for select
to authenticated
using ((select private.can_access_client(client_id)));

create policy "staff create accessible client notes"
on public.client_notes for insert
to authenticated
with check (
  author_id = (select auth.uid())
  and (select private.can_access_client(client_id))
);

create policy "authors update accessible client notes"
on public.client_notes for update
to authenticated
using (
  author_id = (select auth.uid())
  and (select private.can_access_client(client_id))
)
with check (
  author_id = (select auth.uid())
  and (select private.can_access_client(client_id))
);

create policy "authors delete accessible client notes"
on public.client_notes for delete
to authenticated
using (
  (
    author_id = (select auth.uid())
    and (select private.can_access_client(client_id))
  )
  or (select private.current_user_is_admin())
);

-- Ownership for the existing lead inbox. Unassigned leads remain visible so a
-- manager can claim them by converting them into a client.
drop policy if exists "staff manage leads" on public.leads;
drop policy if exists "staff update leads" on public.leads;
drop policy if exists "staff delete leads" on public.leads;

create policy "managers read own or unassigned leads"
on public.leads for select
to authenticated
using (
  assigned_to is null
  or assigned_to = (select auth.uid())
  or (select private.current_user_is_admin())
);

create policy "managers update own or unassigned leads"
on public.leads for update
to authenticated
using (
  assigned_to is null
  or assigned_to = (select auth.uid())
  or (select private.current_user_is_admin())
)
with check (
  assigned_to is null
  or assigned_to = (select auth.uid())
  or (select private.current_user_is_admin())
);

create policy "admins delete leads"
on public.leads for delete
to authenticated
using ((select private.current_user_is_admin()));

create or replace function private.can_access_lead(target_lead_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.leads l
    where l.id = target_lead_id
      and (
        l.assigned_to is null
        or l.assigned_to = (select auth.uid())
        or (select private.current_user_is_admin())
      )
  );
$$;

revoke all on function private.can_access_lead(uuid) from public;
grant execute on function private.can_access_lead(uuid) to authenticated, service_role;

drop policy if exists "staff manage lead_activities" on public.lead_activities;

create policy "staff read accessible lead activities"
on public.lead_activities for select
to authenticated
using ((select private.can_access_lead(lead_id)));

create policy "staff create accessible lead activities"
on public.lead_activities for insert
to authenticated
with check (
  author_id = (select auth.uid())
  and (select private.can_access_lead(lead_id))
);
