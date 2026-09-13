-- Connects a CRM client to a student account and to shortlisted universities.
create table public.admission_cases (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null unique references public.clients(id) on delete cascade,
  student_user_id uuid unique references auth.users(id) on delete set null,
  manager_id uuid not null references public.profiles(id) on delete restrict,
  stage text not null default 'qualification' check (stage in ('qualification','selection','documents','application','decision','visa','enrolled','closed')),
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  next_action text,
  next_action_owner text check (next_action_owner in ('manager','student','parent')),
  next_deadline_at timestamptz,
  manager_comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.client_universities (
  id uuid primary key default gen_random_uuid(),
  admission_case_id uuid not null references public.admission_cases(id) on delete cascade,
  university_id uuid not null references public.universities(id) on delete restrict,
  program_name text,
  priority integer not null default 1 check (priority between 1 and 99),
  status text not null default 'shortlisted' check (status in ('shortlisted','recommended','approved','applying','submitted','accepted','rejected','excluded')),
  match_score integer check (match_score between 0 and 100),
  recommendation_reason text,
  risks text,
  manager_comment text,
  exclusion_reason text,
  visible_to_student boolean not null default false,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (admission_case_id, university_id)
);

create index admission_cases_manager_idx on public.admission_cases(manager_id);
create index admission_cases_student_idx on public.admission_cases(student_user_id) where student_user_id is not null;
create index client_universities_case_priority_idx on public.client_universities(admission_case_id, priority);

create trigger admission_cases_touch_updated_at before update on public.admission_cases
for each row execute function private.touch_updated_at();
create trigger client_universities_touch_updated_at before update on public.client_universities
for each row execute function private.touch_updated_at();

alter table public.admission_cases enable row level security;
alter table public.client_universities enable row level security;
revoke all on public.admission_cases, public.client_universities from anon, authenticated;
grant select, insert, update on public.admission_cases, public.client_universities to authenticated;
grant select, insert, update, delete on public.admission_cases, public.client_universities to service_role;

create policy "case participants read" on public.admission_cases for select to authenticated
using (manager_id = (select auth.uid()) or student_user_id = (select auth.uid()) or (select private.current_user_is_admin()));
create policy "staff create cases" on public.admission_cases for insert to authenticated
with check (manager_id = (select auth.uid()) or (select private.current_user_is_admin()));
create policy "staff update cases" on public.admission_cases for update to authenticated
using (manager_id = (select auth.uid()) or (select private.current_user_is_admin()))
with check (manager_id = (select auth.uid()) or (select private.current_user_is_admin()));

create policy "participants read university selection" on public.client_universities for select to authenticated
using (exists (select 1 from public.admission_cases c where c.id = admission_case_id and
  (c.manager_id = (select auth.uid()) or (c.student_user_id = (select auth.uid()) and visible_to_student) or (select private.current_user_is_admin()))));
create policy "staff add university selection" on public.client_universities for insert to authenticated
with check (created_by = (select auth.uid()) and exists (select 1 from public.admission_cases c where c.id = admission_case_id and
  (c.manager_id = (select auth.uid()) or (select private.current_user_is_admin()))));
create policy "staff update university selection" on public.client_universities for update to authenticated
using (exists (select 1 from public.admission_cases c where c.id = admission_case_id and
  (c.manager_id = (select auth.uid()) or (select private.current_user_is_admin()))))
with check (exists (select 1 from public.admission_cases c where c.id = admission_case_id and
  (c.manager_id = (select auth.uid()) or (select private.current_user_is_admin()))));
