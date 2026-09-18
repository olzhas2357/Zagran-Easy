create index if not exists staff_resources_uploaded_by_idx
  on public.staff_resources (uploaded_by);
create index if not exists staff_resources_published_by_idx
  on public.staff_resources (published_by)
  where published_by is not null;

drop policy if exists "staff resources backend only" on public.staff_resources;
create policy "staff resources backend only"
  on public.staff_resources
  as restrictive
  for all
  to anon, authenticated
  using (false)
  with check (false);
