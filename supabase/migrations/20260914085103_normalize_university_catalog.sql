-- Extended university profile and normalized academic/cost catalog.
alter table public.universities
  add column if not exists latitude numeric(9,6),
  add column if not exists longitude numeric(9,6),
  add column if not exists address text,
  add column if not exists google_maps_url text,
  add column if not exists youtube_url text,
  add column if not exists virtual_tour_url text,
  add column if not exists logo_url text,
  add column if not exists application_fee numeric(14,2),
  add column if not exists medical_insurance_cost numeric(14,2),
  add column if not exists contact_email text,
  add column if not exists contact_phone text,
  add column if not exists advantages text[] not null default '{}',
  add column if not exists limitations text[] not null default '{}',
  add column if not exists information_source text;

create table public.university_programs (
  id uuid primary key default gen_random_uuid(), university_id uuid not null references public.universities(id) on delete cascade,
  external_id text, name text not null, degree_level text not null, specialty text, language text,
  duration_months integer check (duration_months is null or duration_months > 0), description text,
  is_active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (university_id, external_id)
);
create table public.university_intakes (
  id uuid primary key default gen_random_uuid(), program_id uuid not null references public.university_programs(id) on delete cascade,
  name text not null, academic_year text, application_opens date, application_deadline date, study_starts date,
  seats integer check (seats is null or seats >= 0), is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(program_id, name, academic_year)
);
create table public.university_requirements (
  id uuid primary key default gen_random_uuid(), university_id uuid not null references public.universities(id) on delete cascade,
  program_id uuid references public.university_programs(id) on delete cascade, requirement_type text not null,
  title text not null, description text, is_mandatory boolean not null default true, minimum_value numeric(10,2), unit text,
  sort_order integer not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.university_costs (
  id uuid primary key default gen_random_uuid(), university_id uuid not null references public.universities(id) on delete cascade,
  program_id uuid references public.university_programs(id) on delete cascade, intake_id uuid references public.university_intakes(id) on delete cascade,
  category text not null, title text not null, amount numeric(14,2) not null check(amount >= 0), currency text not null default 'USD',
  period text, is_required boolean not null default true, valid_from date, valid_until date,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.scholarships (
  id uuid primary key default gen_random_uuid(), university_id uuid not null references public.universities(id) on delete cascade,
  program_id uuid references public.university_programs(id) on delete cascade, name text not null, description text,
  coverage_type text, coverage_value numeric(14,2), currency text, eligibility text, application_deadline date,
  source_url text, is_active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.university_imports (
  id uuid primary key default gen_random_uuid(), created_by uuid not null references public.profiles(id) on delete restrict,
  file_name text not null, status text not null check(status in ('preview','processing','completed','failed')),
  column_mapping jsonb not null default '{}', total_rows integer not null default 0, valid_rows integer not null default 0,
  error_rows integer not null default 0, report jsonb not null default '[]', created_at timestamptz not null default now(), completed_at timestamptz
);

create index university_programs_university_idx on public.university_programs(university_id);
create index university_intakes_program_idx on public.university_intakes(program_id);
create index university_requirements_university_idx on public.university_requirements(university_id);
create index university_costs_university_idx on public.university_costs(university_id);
create index scholarships_university_idx on public.scholarships(university_id);

do $$ declare t text; begin foreach t in array array['university_programs','university_intakes','university_requirements','university_costs','scholarships','university_imports'] loop
  execute format('alter table public.%I enable row level security', t);
  execute format('revoke all on public.%I from anon, authenticated', t);
  execute format('grant select on public.%I to anon, authenticated', t);
  execute format('grant insert, update, delete on public.%I to authenticated', t);
  execute format('grant select, insert, update, delete on public.%I to service_role', t);
end loop; end $$;

create policy "public read active programs" on public.university_programs for select to anon, authenticated
using (is_active and exists(select 1 from public.universities u where u.id=university_id and u.is_active));
create policy "public read active intakes" on public.university_intakes for select to anon, authenticated
using (is_active and exists(select 1 from public.university_programs p join public.universities u on u.id=p.university_id where p.id=program_id and p.is_active and u.is_active));
create policy "public read requirements" on public.university_requirements for select to anon, authenticated
using (exists(select 1 from public.universities u where u.id=university_id and u.is_active));
create policy "public read costs" on public.university_costs for select to anon, authenticated
using (exists(select 1 from public.universities u where u.id=university_id and u.is_active));
create policy "public read scholarships" on public.scholarships for select to anon, authenticated
using (is_active and exists(select 1 from public.universities u where u.id=university_id and u.is_active));
create policy "admins read imports" on public.university_imports for select to authenticated using ((select private.current_user_is_admin()));

do $$ declare t text; begin foreach t in array array['university_programs','university_intakes','university_requirements','university_costs','scholarships','university_imports'] loop
  execute format('create policy "admins manage %s" on public.%I for all to authenticated using ((select private.current_user_is_admin())) with check ((select private.current_user_is_admin()))', t, t);
end loop; end $$;

create trigger university_programs_touch before update on public.university_programs for each row execute function private.touch_updated_at();
create trigger university_intakes_touch before update on public.university_intakes for each row execute function private.touch_updated_at();
create trigger university_requirements_touch before update on public.university_requirements for each row execute function private.touch_updated_at();
create trigger university_costs_touch before update on public.university_costs for each row execute function private.touch_updated_at();
create trigger scholarships_touch before update on public.scholarships for each row execute function private.touch_updated_at();
