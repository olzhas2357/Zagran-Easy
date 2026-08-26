# Supabase — миграции

Порядок применения (SQL Editor в панели Supabase → New query → вставить → Run):

1. `migrations/0001_init.sql` — схема (таблицы, RLS, триггер профиля).
   Внутри есть `drop table if exists ...` для старых пустых таблиц
   (`education_countries`, `universities`, `tours`, `work_countries`,
   `properties`, `reviews`, `leads`) — проверено через REST API, что
   они пустые. Если в них уже есть реальные данные — не запускайте,
   сначала выгрузите данные.
2. `migrations/0002_seed.sql` — тестовые данные (4 страны, 7 вузов,
   3 тура, отзывы и т.д.), те же, что сейчас в `data/*.ts`.
3. `migrations/0003_turkey_universities_update.sql` — заменяет 3 старых
   вуза Турции на полный список из 8 (источник: `turkey_education_data.json`,
   тот же список уже перенесён в `data/education.ts`). Применять один раз,
   после 0001+0002.
4. `migrations/0004_university_photos.sql` — добавляет колонки
   `gallery_images` и `dormitory_images` (фото кампуса и общежития на
   странице вуза, редактируются в /staff/universities).
5. `migrations/0005_university_media_storage.sql` — создаёт бакет
   `university-media` (публичный) для загрузки фото/презентаций прямо
   из кабинета менеджера, с политиками доступа (запись — только staff).

После применения:

- `.env` уже содержит рабочие ключи Supabase — приложение автоматически
  переключится с seed-данных (`data/*.ts`) на живую БД (см. `lib/data.ts`,
  флаг `USE_DB` в `lib/db.ts`).
- Чтобы завести первого сотрудника (менеджера/админа): зарегистрируйте
  пользователя через Supabase Auth (Dashboard → Authentication → Add user,
  или форму на `/staff/login` после того как она появится), профиль
  создастся автоматически с ролью `manager`. Чтобы сделать его `admin`,
  выполните в SQL Editor:
  ```sql
  update profiles set role = 'admin' where id = '<user-id>';
  ```
