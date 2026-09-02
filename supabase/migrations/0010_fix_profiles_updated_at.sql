-- ============================================================
-- ZagranEasy — фикс "record "new" has no field "updated_at""
--
-- В таблице profiles уже висит триггер trg_profiles_updated
-- (execute function update_modified_column()), добавленный напрямую
-- в Supabase Studio по аналогии с applications/goals — но саму
-- колонку updated_at туда не добавили. Из-за этого любой UPDATE
-- profiles (редактирование пользователя в админке, в т.ч. смена
-- имени/телефона перед назначением преподавателя студенту) падает.
--
-- Применять через Supabase SQL Editor.
-- ============================================================

alter table profiles
  add column if not exists updated_at timestamptz not null default now();
