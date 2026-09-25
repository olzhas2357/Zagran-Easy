-- Trial bookings last 45 minutes; the group session keeps its own duration.
alter table public.trial_lesson_bookings
  add column if not exists duration_minutes integer not null default 45;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'trial_lesson_bookings_duration_minutes_check'
      and conrelid = 'public.trial_lesson_bookings'::regclass
  ) then
    alter table public.trial_lesson_bookings
      add constraint trial_lesson_bookings_duration_minutes_check
      check (duration_minutes = 45);
  end if;
end $$;

