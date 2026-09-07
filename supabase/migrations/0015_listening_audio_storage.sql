insert into storage.buckets (id, name, public)
values ('listening-audio', 'listening-audio', true)
on conflict (id) do update set public = true;

create policy "public read listening-audio"
  on storage.objects for select using (bucket_id = 'listening-audio');

create policy "teacher upload listening-audio"
  on storage.objects for insert
  with check (bucket_id = 'listening-audio' and auth.role() = 'authenticated');