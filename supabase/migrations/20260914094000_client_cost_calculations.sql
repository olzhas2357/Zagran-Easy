create table public.cost_calculations (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  admission_case_id uuid not null references public.admission_cases(id) on delete cascade,
  university_id uuid not null references public.universities(id) on delete restrict,
  program_id uuid references public.university_programs(id) on delete set null,
  intake_id uuid references public.university_intakes(id) on delete set null,
  manager_id uuid not null references public.profiles(id) on delete restrict,
  title text not null,
  status text not null default 'draft' check (status in ('draft','sent','accepted','expired')),
  currency text not null default 'USD',
  exchange_rate numeric(18,6) not null default 1 check (exchange_rate > 0),
  calculation_date date not null default current_date,
  subtotal numeric(16,2) not null default 0,
  discount numeric(16,2) not null default 0,
  grand_total numeric(16,2) not null default 0,
  manager_comment text,
  client_comment text,
  valid_until date,
  installment_plan jsonb not null default '[]',
  public_token uuid unique,
  version integer not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cost_calculation_items (
  id uuid primary key default gen_random_uuid(),
  calculation_id uuid not null references public.cost_calculations(id) on delete cascade,
  category text not null,
  title text not null,
  description text,
  quantity numeric(14,3) not null default 1 check (quantity >= 0),
  unit_price numeric(16,2) not null default 0,
  amount numeric(16,2) not null default 0,
  currency text not null default 'USD',
  is_optional boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index cost_calculations_client_idx on public.cost_calculations(client_id, created_at desc);
create index cost_calculations_university_idx on public.cost_calculations(university_id);
create index cost_calculation_items_calculation_idx on public.cost_calculation_items(calculation_id, sort_order);

alter table public.cost_calculations enable row level security;
alter table public.cost_calculation_items enable row level security;
revoke all on public.cost_calculations, public.cost_calculation_items from anon, authenticated;
grant select, insert, update, delete on public.cost_calculations, public.cost_calculation_items to authenticated;
grant select, insert, update, delete on public.cost_calculations, public.cost_calculation_items to service_role;

create policy "staff read accessible calculations" on public.cost_calculations for select to authenticated
using ((select private.current_user_is_admin()) or manager_id = (select auth.uid()) or exists (
  select 1 from public.clients c where c.id = client_id and c.assigned_manager_id = (select auth.uid())
));
create policy "staff create calculations" on public.cost_calculations for insert to authenticated
with check ((select private.current_user_is_admin()) or manager_id = (select auth.uid()));
create policy "staff update own calculations" on public.cost_calculations for update to authenticated
using ((select private.current_user_is_admin()) or manager_id = (select auth.uid()))
with check ((select private.current_user_is_admin()) or manager_id = (select auth.uid()));
create policy "staff delete own drafts" on public.cost_calculations for delete to authenticated
using (((select private.current_user_is_admin()) or manager_id = (select auth.uid())) and status = 'draft');

create policy "staff read calculation items" on public.cost_calculation_items for select to authenticated
using (exists (select 1 from public.cost_calculations c where c.id = calculation_id and (
  (select private.current_user_is_admin()) or c.manager_id = (select auth.uid()) or exists (
    select 1 from public.clients cl where cl.id = c.client_id and cl.assigned_manager_id = (select auth.uid())
  )
)));
create policy "staff manage calculation items" on public.cost_calculation_items for all to authenticated
using (exists (select 1 from public.cost_calculations c where c.id = calculation_id and ((select private.current_user_is_admin()) or c.manager_id = (select auth.uid()))))
with check (exists (select 1 from public.cost_calculations c where c.id = calculation_id and ((select private.current_user_is_admin()) or c.manager_id = (select auth.uid()))));

create trigger cost_calculations_touch before update on public.cost_calculations
for each row execute function private.touch_updated_at();
