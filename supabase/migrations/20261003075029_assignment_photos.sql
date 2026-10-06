-- Student homework photos are uploaded only through the authenticated NestJS
-- endpoint. The service role writes randomized objects under <student-id>/.
-- Homework photos are private. The authenticated API uploads with the service
-- role and returns short-lived signed URLs only to the assigned student/teacher.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'assignment-photos',
  'assignment-photos',
  false,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Keep recording buckets aligned with the API validation so browsers receive
-- a playable object with the expected Content-Type.
update storage.buckets
set file_size_limit = 20971520,
    allowed_mime_types = array[
      'audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/x-m4a',
      'audio/wav', 'audio/x-wav', 'audio/webm', 'audio/ogg'
    ]
where id = 'speaking-audio';

update storage.buckets
set file_size_limit = 52428800,
    allowed_mime_types = array[
      'audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/x-m4a',
      'audio/wav', 'audio/x-wav', 'audio/webm', 'audio/ogg', 'video/mp4'
    ]
where id = 'listening-audio';
