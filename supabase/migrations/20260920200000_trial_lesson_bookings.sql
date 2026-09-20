create table if not exists public.trial_lesson_bookings (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.lesson_sessions(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  client_name text not null check (length(trim(client_name)) > 0),
  client_phone text,
  status text not null default 'booked' check (status in ('booked', 'attended', 'enrolled', 'thinking', 'declined', 'no_show', 'cancelled')),
  notes text,
  booked_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists trial_lesson_bookings_session_client_uidx
  on public.trial_lesson_bookings (session_id, client_id)
  where client_id is not null and status <> 'cancelled';

create index if not exists trial_lesson_bookings_session_idx
  on public.trial_lesson_bookings (session_id, status);

alter table public.trial_lesson_bookings enable row level security;
revoke all on table public.trial_lesson_bookings from anon, authenticated;
grant select, insert, update, delete on table public.trial_lesson_bookings to service_role;

