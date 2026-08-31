-- ============================================================
-- ZagranEasy — Хранилище фото преподавателя (кабинет преподавателя)
-- Бакет "teacher-avatars": читают все (фото видно на публичном сайте),
-- пишут/удаляют только учителя, в свою папку ({auth.uid()}/...),
-- см. storage-путь в lib/teacher-actions.ts.
-- Применять через Supabase SQL Editor, после 0008.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('teacher-avatars', 'teacher-avatars', true)
on conflict (id) do nothing;

create policy "public read teacher-avatars"
  on storage.objects for select
  using (bucket_id = 'teacher-avatars');

create policy "teacher upload own teacher-avatars"
  on storage.objects for insert
  with check (
    bucket_id = 'teacher-avatars'
    and public.is_teacher()
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "teacher update own teacher-avatars"
  on storage.objects for update
  using (
    bucket_id = 'teacher-avatars'
    and public.is_teacher()
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "teacher delete own teacher-avatars"
  on storage.objects for delete
  using (
    bucket_id = 'teacher-avatars'
    and public.is_teacher()
    and (storage.foldername(name))[1] = auth.uid()::text
  );
