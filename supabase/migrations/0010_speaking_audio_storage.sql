-- Speaking recordings: public URLs are needed by the teacher review player.
insert into storage.buckets (id, name, public)
values ('speaking-audio', 'speaking-audio', true)
on conflict (id) do update set public = true;

create policy "public read speaking-audio"
  on storage.objects for select
  using (bucket_id = 'speaking-audio');

create policy "student upload own speaking-audio"
  on storage.objects for insert
  with check (
    bucket_id = 'speaking-audio'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "student delete own speaking-audio"
  on storage.objects for delete
  using (
    bucket_id = 'speaking-audio'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
