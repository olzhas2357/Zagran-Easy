-- ============================================================
-- ZagranEasy — Фото кампуса и общежития для страницы вуза
-- Добавляет два поля с массивами ссылок на фото, редактируемые
-- менеджером из /staff/universities (см. lib/staff-actions.ts →
-- updateUniversityMedia). Применять через Supabase SQL Editor.
-- ============================================================

alter table universities
  add column if not exists gallery_images text[] default '{}',
  add column if not exists dormitory_images text[] default '{}';
