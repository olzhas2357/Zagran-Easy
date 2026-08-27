-- ============================================================
-- ZagranEasy — Хранилище материалов урока (кабинет преподавателя)
-- Бакет "lesson-materials": читают все авторизованные (учитель и его
-- ученики видят файлы), пишут/удаляют только учителя, в свою папку
-- ({auth.uid()}/...), см. storage-путь в lib/teacher-actions.ts.
-- Применять через Supabase SQL Editor, после 0006.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('lesson-materials', 'lesson-materials', true)
on conflict (id) do nothing;

create policy "public read lesson-materials"
  on storage.objects for select
  using (bucket_id = 'lesson-materials');

create policy "teacher upload own lesson-materials"
  on storage.objects for insert
  with check (
    bucket_id = 'lesson-materials'
    and public.is_teacher()
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "teacher delete own lesson-materials"
  on storage.objects for delete
  using (
    bucket_id = 'lesson-materials'
    and public.is_teacher()
    and (storage.foldername(name))[1] = auth.uid()::text
  );
