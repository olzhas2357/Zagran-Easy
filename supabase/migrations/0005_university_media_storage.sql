-- ============================================================
-- ZagranEasy — Хранилище для фото и презентаций вузов
-- Бакет "university-media": публичное чтение (фото/PDF видны на
-- сайте без авторизации), запись только сотрудникам (is_staff()).
-- Применять через Supabase SQL Editor, после 0004.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('university-media', 'university-media', true)
on conflict (id) do nothing;

create policy "public read university-media"
  on storage.objects for select
  using (bucket_id = 'university-media');

create policy "staff upload university-media"
  on storage.objects for insert
  with check (bucket_id = 'university-media' and public.is_staff());

create policy "staff delete university-media"
  on storage.objects for delete
  using (bucket_id = 'university-media' and public.is_staff());
