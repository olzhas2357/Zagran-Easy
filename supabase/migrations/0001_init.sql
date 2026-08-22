-- ============================================================
-- ZagranEasy — Начальная схема БД
-- Зеркалит lib/types.ts + расширения под каталог/подбор/кабинеты
--
-- ВАЖНО: в проекте уже существовали пустые таблицы старой структуры
-- (education_countries, universities, tours, work_countries,
-- properties, reviews, leads — проверено через REST API, 0 строк
-- в каждой). Ниже они удаляются и создаются заново по новой схеме.
-- Если с момента написания этого файла в них появились реальные
-- данные — НЕ запускайте этот блок, сначала мигрируйте данные вручную.
-- ============================================================

create extension if not exists "pgcrypto";

drop table if exists lead_activities cascade;
drop table if exists applications cascade;
drop table if exists leads cascade;
drop table if exists reviews cascade;
drop table if exists properties cascade;
drop table if exists work_countries cascade;
drop table if exists tours cascade;
drop table if exists universities cascade;
drop table if exists education_countries cascade;
drop table if exists profiles cascade;

-- ===================== ОБРАЗОВАНИЕ: СТРАНЫ =====================

create table education_countries (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  name_en text,
  flag text,
  continent text,
  cities text[] default '{}',
  description text,
  long_description text,
  badge_color text check (badge_color in ('blue','red','amber','green','purple')) default 'blue',
  image_url text,
  hero_image_url text,
  university_count int default 0,
  features text[] default '{}',
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ===================== ОБРАЗОВАНИЕ: УНИВЕРСИТЕТЫ =====================

create table universities (
  id uuid primary key default gen_random_uuid(),
  country_id uuid not null references education_countries(id) on delete cascade,
  slug text unique not null,
  name text not null,
  name_local text,
  city text not null,
  type text check (type in ('public','private')) default 'public',
  degree_levels text[] default '{}',           -- "Бакалавр", "Магистр", "PhD"...
  languages text[] default '{}',
  specialties text[] default '{}',              -- "IT", "Инженерия", "Медицина"... (фильтр каталога)
  tuition_from numeric,
  tuition_to numeric,
  has_grant boolean default false,
  grant_details text,
  has_dormitory boolean default false,
  dormitory_cost numeric,
  requirements text[] default '{}',
  description text,
  image_url text,
  website_url text,
  ranking_national int,
  ranking_world int,
  ielts_required boolean default false,
  is_partner boolean default false,              -- "Официальный партнёр"
  admission_chance int check (admission_chance between 0 and 100),  -- редакторская оценка шанса поступления
  deadline_label text,                            -- "до 15 сент" — то, что видит клиент
  deadline_date date,                             -- дата — из неё считаем "скоро" и сортировку
  rating_stars numeric(2,1) default 4.5,
  reviews_count int default 0,
  programs_count int default 0,                   -- всего программ в вузе (для карточки каталога, не то же самое что program_list)
  presentation_url text,
  presentation_pages int,
  last_verified_at date,                          -- для CMS-алерта "не проверялось 90+ дней"
  program_list jsonb default '[]',                -- [{name, meta, price}] — программы на странице вуза
  stories jsonb default '[]',                     -- [{name, meta, text}] — истории поступивших
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index universities_country_id_idx on universities(country_id);

-- ===================== ТУРЫ / РАБОТА / НЕДВИЖИМОСТЬ / ОТЗЫВЫ =====================

create table tours (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  region text,
  description text,
  highlights text[] default '{}',
  duration_days int,
  price_from numeric,
  hotel_stars int,
  includes text[] default '{}',
  image_url text,
  is_hot boolean default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table work_countries (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  flag text,
  industries text[] default '{}',
  description text,
  salary_range text,
  image_url text
);

create table properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  location text,
  city text,
  rooms int,
  area_sqm numeric,
  price_usd numeric,
  features text[] default '{}',
  is_hot_deal boolean default false,
  image_url text
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  service text,
  text text not null,
  avatar text,
  rating int check (rating between 1 and 5) default 5,
  created_at timestamptz not null default now()
);

-- ===================== ПЕРСОНАЛ (кабинет менеджера) =====================

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text check (role in ('admin','manager')) not null default 'manager',
  phone text,
  regions text[] default '{}',                    -- "Турция, Кипр" — за что отвечает менеджер
  created_at timestamptz not null default now()
);

-- Автосоздание профиля при регистрации нового пользователя Supabase Auth
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ===================== ЛИДЫ / CRM ("дожим") =====================

create table leads (
  id uuid primary key default gen_random_uuid(),
  source text check (source in ('quiz','form','whatsapp','callback')) not null,
  service text not null,
  name text,
  phone text,
  message text,
  quiz_answers jsonb,
  status text check (status in ('new','in_progress','done')) not null default 'new',
  assigned_to uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index leads_status_idx on leads(status);
create index leads_assigned_to_idx on leads(assigned_to);

create table lead_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  author_id uuid references profiles(id) on delete set null,
  note text not null,
  created_at timestamptz not null default now()
);

create index lead_activities_lead_id_idx on lead_activities(lead_id);

-- ===================== КАБИНЕТ СТУДЕНТА (клиентский трекер заявки) =====================

create table applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  university_id uuid references universities(id) on delete set null,
  program_name text,
  status text check (status in ('submitted','documents','review','decision','visa')) not null default 'submitted',
  steps jsonb default '[]',                        -- [{label, date, state}]
  documents jsonb default '[]',                     -- [{name, note, ok}]
  deadlines jsonb default '[]',                      -- [{title, date, urgent}]
  payment_total numeric,
  payment_currency text default '₸',
  installments_total int default 12,
  installments_paid int default 0,
  next_payment_date date,
  manager_id uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index applications_user_id_idx on applications(user_id);

-- ===================== ROW LEVEL SECURITY =====================

alter table education_countries enable row level security;
alter table universities enable row level security;
alter table tours enable row level security;
alter table work_countries enable row level security;
alter table properties enable row level security;
alter table reviews enable row level security;
alter table profiles enable row level security;
alter table leads enable row level security;
alter table lead_activities enable row level security;
alter table applications enable row level security;

-- Публичное чтение каталога (только активные записи)
create policy "public read active countries" on education_countries for select using (is_active = true);
create policy "public read active universities" on universities for select using (is_active = true);
create policy "public read tours" on tours for select using (true);
create policy "public read work_countries" on work_countries for select using (true);
create policy "public read properties" on properties for select using (true);
create policy "public read reviews" on reviews for select using (true);

-- Хелпер: является ли текущий пользователь сотрудником
drop function if exists public.is_staff();
drop function if exists public.is_admin();

create function public.is_staff()
returns boolean as $$
  select exists (select 1 from public.profiles where id = auth.uid());
$$ language sql stable security definer set search_path = public;

create function public.is_admin()
returns boolean as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$ language sql stable security definer set search_path = public;

-- Сотрудники видят и редактируют каталог целиком (включая неактивные черновики)
create policy "staff full access countries" on education_countries for all using (public.is_staff()) with check (public.is_staff());
create policy "staff full access universities" on universities for all using (public.is_staff()) with check (public.is_staff());

-- Лиды: анонимы могут только создавать (квиз/формы), читают и меняют — только сотрудники
create policy "anyone can create leads" on leads for insert with check (true);
create policy "staff manage leads" on leads for select using (public.is_staff());
create policy "staff update leads" on leads for update using (public.is_staff()) with check (public.is_staff());
create policy "staff delete leads" on leads for delete using (public.is_staff());

create policy "staff manage lead_activities" on lead_activities for all using (public.is_staff()) with check (public.is_staff());

-- Профили: сотрудник видит свой профиль; админ видит все
create policy "staff read own profile" on profiles for select using (id = auth.uid() or public.is_admin());
create policy "admin manage profiles" on profiles for update using (public.is_admin()) with check (public.is_admin());

-- Заявки студентов: владелец видит свою, сотрудники — все
create policy "owner read own applications" on applications for select using (user_id = auth.uid() or public.is_staff());
create policy "owner update own applications" on applications for update using (user_id = auth.uid() or public.is_staff()) with check (user_id = auth.uid() or public.is_staff());
create policy "staff insert applications" on applications for insert with check (public.is_staff() or user_id = auth.uid());
create policy "staff delete applications" on applications for delete using (public.is_staff());
