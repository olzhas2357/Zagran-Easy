alter table public.lesson_sessions
  add column if not exists meeting_url text,
  add column if not exists meeting_provider text;

alter table public.lesson_sessions
  drop constraint if exists lesson_sessions_meeting_provider_check;

alter table public.lesson_sessions
  add constraint lesson_sessions_meeting_provider_check
  check (meeting_provider is null or meeting_provider in ('meet', 'zoom'));

alter table public.lesson_sessions
  drop constraint if exists lesson_sessions_meeting_url_check;

alter table public.lesson_sessions
  add constraint lesson_sessions_meeting_url_check
  check (
    meeting_url is null
    or meeting_url ~ '^https://(meet\.google\.com|zoom\.us)/'
  );

