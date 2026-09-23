-- The tasks API uses audio_url, while older task rows used question_audio_url.
-- Keep both columns during the compatibility period and backfill either side.
alter table public.tasks
  add column if not exists audio_url text;

update public.tasks
set audio_url = question_audio_url
where audio_url is null
  and question_audio_url is not null;

notify pgrst, 'reload schema';
