-- Пакеты полного сопровождения (университеты и языковые курсы) по странам.
-- Seed идемпотентен: страны и пакеты обновляются по slug, повторный запуск не создаёт дубликатов.
-- Неизвестные значения (дедлайны, прочие расходы) не заполняются выдуманными данными.

begin;

create table if not exists education_packages (
  id uuid primary key default gen_random_uuid(),
  country_id uuid not null references education_countries(id) on delete cascade,
  slug text unique not null,
  name text not null,
  description text,
  stages text[] not null default '{}',
  price_from numeric,
  price_currency text check (price_currency in ('EUR','KZT','CNY','USD')),
  price_note text,
  extra_costs jsonb not null default '[]'::jsonb,
  selection_guide text not null default '',
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table education_packages add column if not exists selection_guide text not null default '';

create index if not exists education_packages_country_idx on education_packages (country_id);

alter table education_packages enable row level security;

drop policy if exists "public read active packages" on education_packages;
create policy "public read active packages" on education_packages for select using (is_active = true);

-- В slug стран могли попасть пробелы/переносы строк ('czech ', 'south-korea\n').
update education_countries set slug = btrim(slug, E' \t\r\n') where slug <> btrim(slug, E' \t\r\n');

-- Если ранее появился дубль страны czech-republic, переносим пакеты в czech и удаляем дубль.
do $$
declare
  keep_id uuid;
  dup_id uuid;
begin
  select id into keep_id from education_countries where slug = 'czech';
  select id into dup_id from education_countries where slug = 'czech-republic';
  if keep_id is not null and dup_id is not null then
    update education_packages set country_id = keep_id where country_id = dup_id;
    delete from education_countries where id = dup_id;
  elsif keep_id is null and dup_id is not null then
    update education_countries set slug = 'czech' where id = dup_id;
  end if;
end $$;

-- Страна Чехия (если ещё не добавлена).
insert into education_countries (slug, name, name_en, flag, continent, cities, description, badge_color, is_active, sort_order)
values ('czech', 'Чехия', 'Czech Republic', '🇨🇿', 'Europe', array['Прага','Брно','Острава'],
        'Языковая подготовка и поступление в чешские вузы.', 'blue', true, 3)
on conflict (slug) do nothing;

with seed (country_slug, slug, name, description, stages, price_from, price_currency, price_note, sort_order) as (
  values
    ('czech', 'czech-foundation', 'Foundation в Чехии',
     'Очная языковая подготовка в Чехии. Полугодовой курс: 3 000 € за чешский язык. Годовой курс: 4 600 € за чешский язык или 5 500 € с профильными предметами. Подача на визу ориентировочно через 1,5 месяца после договора. Указанный организатором визовый показатель: 95–98% (не официальная статистика и не гарантия).',
     array['Полугодовой курс: январь','Годовой курс: сентябрь'],
     3000, 'EUR', 'Полугодовой курс за чешский язык. Годовой: 4 600 € или 5 500 € с профильными предметами.', 1),
    ('czech', 'czech-fully-online', 'Полностью онлайн',
     'Онлайн-подготовка с преподавателями из Чехии, сопровождение включено. В презентации указано ожидание записи на визу около 2 месяцев и повышенный визовый риск, оценённый организатором как 50/50; оценки не являются официальной статистикой или гарантией.',
     array['Онлайн-курс','Поступление обычно в июле','Запись на визу после поступления','Выезд осенью при одобрении визы: сентябрь, октябрь или ноябрь'],
     1700000, 'KZT', null, 2),
    ('czech', 'czech-vsb-project', 'Проект VŠB',
     'Подготовка с ранним выездом. Возможно досрочное завершение обучения при выполнении требований школы. При отказе в визе может оставаться время для повторной подачи. Указанный организатором визовый показатель: 98–99% (не официальная статистика и не гарантия).',
     array['Подготовка','Подача на визу планируется в январе','Ранний выезд в Чехию с апреля','Поступление в вуз без потери года при выполнении требований'],
     2200000, 'KZT', null, 3),
    ('china', 'china-basic', 'Базовый пакет',
     'Онлайн или офлайн, занятия 3 раза в неделю в течение 10 месяцев. Китайский язык, HSK и базовое поступление на бакалавриат. Для стандартных специальностей, включая гуманитарные, экономические и IT-направления.',
     array['Договор','Старт языковых курсов и HSK','Подача заявок в университеты','Получение приглашения','Оформление визы','Выезд в сентябре'],
     1990000, 'KZT', null, 1),
    ('china', 'china-medical', 'Медицинская программа',
     'Интенсивная подготовка по китайскому языку и HSK с профильным сопровождением для поступления на медицинские специальности в университеты Китая. Подходит для направлений медицины, стоматологии и фармации.',
     array['Договор','Ранний аудит документов','Интенсивная профильная подготовка','Подача на медицинские квоты или гранты','Виза','Выезд в августе–сентябре'],
     2500000, 'KZT', null, 2),
    ('china', 'china-csca', 'Подготовка CSCA',
     'Углублённая подготовка по китайскому языку, HSK и профильным предметам CSCA (China Scholastic Competency Assessment) с полным сопровождением. Для поступления в ведущие университеты Китая, где требуется этот экзамен. Требования, квоты и даты экзаменов зависят от вуза и провинции; условия договора проверяются индивидуально.',
     array['Договор','Языковая база и усиленная подготовка по предметам CSCA','Регистрация на экзамен','Сдача CSCA','Подача документов в ведущие университеты','Виза','Выезд в сентябре'],
     2990000, 'KZT', null, 3)
),
resolved as (
  select c.id as country_id, s.*
  from seed s
  join education_countries c on c.slug = s.country_slug
)
insert into education_packages (
  country_id, slug, name, description, stages, price_from, price_currency, price_note, sort_order
)
select country_id, slug, name, description, stages, price_from, price_currency, price_note, sort_order
from resolved
on conflict (slug) do update set
  country_id = excluded.country_id,
  name = excluded.name,
  description = excluded.description,
  stages = excluded.stages,
  price_from = excluded.price_from,
  price_currency = excluded.price_currency,
  price_note = excluded.price_note,
  sort_order = excluded.sort_order,
  updated_at = now();

-- Ответ на вопрос «Как выбрать подходящую программу?» для каждого пакета.
update education_packages p
set selection_guide = v.guide, updated_at = now()
from (values
  ('czech-foundation', 'Подходит, если вы хотите сначала выучить чешский язык и адаптироваться в стране, а затем поступать в вуз.'),
  ('czech-fully-online', 'Подходит, если вы готовитесь из Казахстана и готовы выехать позже, осенью, после одобрения визы.'),
  ('czech-vsb-project', 'Подходит, если важно уехать весной и поступить в вуз в том же году.'),
  ('china-basic', 'Подходит для стандартных специальностей: гуманитарных, экономических и IT-направлений. Включает подготовку к HSK и базовое поступление на бакалавриат.'),
  ('china-medical', 'Подходит, если вы выбрали медицину, стоматологию или фармацию и хотите профильную подготовку и сопровождение по квотам и грантам.'),
  ('china-csca', 'Подходит для поступления в ведущие университеты Китая, где требуется экзамен CSCA. Перед выбором уточните требования конкретного вуза.')
) as v(slug, guide)
where p.slug = v.slug;

commit;
