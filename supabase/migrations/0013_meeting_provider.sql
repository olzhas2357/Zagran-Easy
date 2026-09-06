alter table public.scheduled_lessons
  add column if not exists meeting_provider text;

alter table public.scheduled_lessons
  drop constraint if exists scheduled_lessons_meeting_provider_check;

alter table public.scheduled_lessons
  add constraint scheduled_lessons_meeting_provider_check
  check (meeting_provider is null or meeting_provider in ('zoom', 'meet'));