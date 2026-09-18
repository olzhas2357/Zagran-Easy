create index if not exists schedule_slots_created_by_idx
  on public.schedule_slots (created_by)
  where created_by is not null;
