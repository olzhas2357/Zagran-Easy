begin;

drop table if exists pg_temp.spring_2027_requirements;
drop table if exists pg_temp.spring_2027_scholarships;
drop table if exists pg_temp.spring_2027_costs;
drop table if exists pg_temp.spring_2027_intakes;
drop table if exists pg_temp.spring_2027_programs;
drop table if exists pg_temp.spring_2027_university_ids;
drop table if exists pg_temp.spring_2027_universities;

create temporary table spring_2027_universities (
  slug text primary key,
  display_name text not null,
  aliases text[] not null,
  city text not null,
  university_type text,
  degree_levels text[] not null,
  languages text[] not null,
  specialties text[] not null,
  has_grant boolean not null,
  grant_details text not null,
  has_dormitory boolean not null,
  requirements text[] not null,
  description text not null,
  programs_count integer not null,
  sort_order integer not null
);

insert into spring_2027_universities values
  (
    'south-china-university-of-technology',
    'Южно-Китайский технологический университет',
    array['south china university of technology', 'южно-китайский технологический университет'],
    'Гуанчжоу', null, array['Языковой курс'], array['Китайский'],
    array['Китайский язык'], false, '', false,
    array['Возраст от 18 лет', 'Справка о несудимости с переводом, нотариальным заверением и апостилем для заявителей из Центральной Азии', 'Бумажные документы'],
    'Весенний набор 2027: обычный и интенсивный курсы китайского языка. Университет не предоставляет проживание.',
    1, 100
  ),
  (
    'shenzhen-university',
    'Шэньчжэньский университет',
    array['shenzhen university', 'шэньчжэньский университет'],
    'Шэньчжэнь', null, array['PhD'], array['Китайский', 'Английский'],
    array['Телекоммуникационная инженерия', 'Интеллектуальное производство', 'Электронные науки и технологии', 'Компьютерные науки и технологии', 'Педагогика', 'Гражданское строительство', 'Искусственный интеллект', 'Менеджмент и инженерия управления'],
    true,
    'Стипендии предоставляются по результатам отбора и не гарантируются.',
    true,
    array['Магистратура или выше', 'Возраст до 40 лет', 'HSK 5 не менее 180 баллов для обучения на китайском языке', 'Подтверждение владения английским языком для обучения на английском языке'],
    'Весенний набор 2027 в докторантуру в Шэньчжэне, провинция Гуандун. Доступность и стоимость конкретного направления следует подтвердить перед подачей документов.',
    1, 101
  ),
  (
    'zhejiang-international-studies-university',
    'Чжэцзянский университет иностранных языков',
    array['zhejiang international studies university', 'чжэцзянский университет иностранных языков'],
    'Ханчжоу', null, array['Языковой курс'], array['Китайский', 'Английский'],
    array['Китайский язык'], false, '', true,
    array['Возраст 18–23 года', 'Обязательное собеседование', 'Бытовое общение на китайском или английском языке'],
    'Весенний набор 2027 на платную программу китайского языка.',
    1, 102
  ),
  (
    'china-university-of-petroleum-east-china',
    'Китайский нефтяной университет (Восточный Китай)',
    array['china university of petroleum (east china)', 'china university of petroleum (huadong)', 'китайский нефтяной университет (восточный китай)'],
    'Циндао', null, array['Языковой курс', 'Подготовительная программа'], array['Китайский', 'Английский'],
    array['Китайский язык', 'Подготовительная программа'], false, '', false,
    array['Возраст 16–25 лет', 'Среднее образование или эквивалент', 'HSK 3 для подготовительной программы на китайском языке', 'Семь стандартных документов; перечень требуется уточнить', 'Финансовое подтверждение'],
    'Весенний набор 2027 в Циндао, провинция Шаньдун: курсы китайского языка и подготовительная программа. Проживание указано в апартаментах вне кампуса.',
    2, 103
  ),
  (
    'gdufs-south-china-business-college',
    'Наньго бизнес-колледж Гуандунского университета иностранных языков',
    array['gdufs south china business college', 'south china business college', 'наньго бизнес-колледж гуандунского университета иностранных языков'],
    'Гуанчжоу', null, array['Языковой курс'], array['Китайский'],
    array['Китайский язык — начальный уровень'], false, '', true,
    array['Возраст 18–35 лет', 'Среднее образование или выше', 'Банковская справка на сумму более 5 000 USD', 'Семь стандартных документов; перечень требуется уточнить', 'Справка о несудимости с переводом на китайский язык и апостилем'],
    'Весенний набор 2027: доступен начальный уровень китайского языка. Несовершеннолетние и выпускники средних профессиональных учебных заведений рассматриваются индивидуально.',
    1, 104
  ),
  (
    'china-university-of-mining-and-technology',
    'Китайский горно-технологический университет',
    array['china university of mining and technology', 'china university of mining & technology', 'китайский горно-технологический университет'],
    'Сюйчжоу', null, array['Языковой курс'], array['Китайский'],
    array['Китайский язык'], false, '', true,
    array['Возраст 17–30 лет', 'Среднее образование или выше', 'HSK 3 для среднего уровня китайского языка', 'Семь стандартных документов; перечень требуется уточнить'],
    'Весенний набор 2027 на начальный и средний уровни китайского языка в Сюйчжоу, провинция Цзянсу.',
    2, 105
  );

do $$
declare
  china_id uuid;
  seed record;
  match_count integer;
  slug_count integer;
begin
  select id into china_id
  from public.education_countries
  where slug = 'china';

  if china_id is null then
    raise exception 'Страна с slug=china не найдена; университеты весеннего набора не добавлены';
  end if;

  for seed in select * from spring_2027_universities loop
    select count(*) into match_count
    from public.universities u
    where u.country_id = china_id
      and (
        u.slug = seed.slug
        or lower(u.name) = any(seed.aliases)
        or lower(coalesce(u.name_local, '')) = any(seed.aliases)
      );

    if match_count > 1 then
      raise exception 'В Китае найдено несколько записей для университета "%"; устраните неоднозначность вручную', seed.display_name;
    end if;

    select count(*) into slug_count
    from public.universities
    where slug = seed.slug;

    if match_count = 0 and slug_count > 0 then
      raise exception 'Slug "%" уже занят другой записью; университет "%" не добавлен', seed.slug, seed.display_name;
    end if;

    if match_count = 0 then
      insert into public.universities (
        country_id, slug, name, city, type, degree_levels, languages, specialties,
        has_grant, grant_details, has_dormitory, requirements, description,
        rating_stars, reviews_count, programs_count, is_active, sort_order, information_source
      ) values (
        china_id, seed.slug, seed.display_name, seed.city, seed.university_type,
        seed.degree_levels, seed.languages, seed.specialties, seed.has_grant,
        seed.grant_details, seed.has_dormitory, seed.requirements, seed.description,
        0, 0, seed.programs_count, true, seed.sort_order,
        'Условия предоставлены в задании; сверка с официальными источниками не проведена (17.10.2026).'
      )
      on conflict (slug) do nothing;
    end if;
  end loop;
end $$;

create temporary table spring_2027_university_ids as
select seed.slug, u.id as university_id
from spring_2027_universities seed
join public.education_countries country on country.slug = 'china'
join public.universities u on u.country_id = country.id
  and (
    u.slug = seed.slug
    or lower(u.name) = any(seed.aliases)
    or lower(coalesce(u.name_local, '')) = any(seed.aliases)
  );

create temporary table spring_2027_programs (
  external_id text primary key,
  university_slug text not null references spring_2027_universities(slug),
  name text not null,
  degree_level text not null,
  specialty text,
  language text,
  description text not null
);

insert into spring_2027_programs values
  ('scut-language-2027', 'south-china-university-of-technology',
   'Курсы китайского языка — обычный и интенсивный', 'Языковой курс', 'Китайский язык', 'Китайский',
   'Доступны обычный курс и интенсивный курс. Для зачисления требуется отправить бумажные документы. После зачисления университет может рекомендовать варианты аренды жилья.'),
  ('szu-phd-2027', 'shenzhen-university',
   'Докторантура (PhD)', 'PhD',
   'Телекоммуникационная инженерия; интеллектуальное производство; электронные науки и технологии; компьютерные науки и технологии; педагогика; гражданское строительство; искусственный интеллект; менеджмент и инженерия управления',
   'Китайский или английский',
   'По предоставленным условиям стоимость зависит от области обучения. Список направлений и их наличие необходимо подтвердить у университета.'),
  ('zisu-language-2027', 'zhejiang-international-studies-university',
   'Китайский язык', 'Языковой курс', 'Китайский язык', 'Китайский',
   'Платная программа. Поступление включает обязательное собеседование.'),
  ('cup-language-2027', 'china-university-of-petroleum-east-china',
   'Китайский язык', 'Языковой курс', 'Китайский язык', 'Китайский',
   'Языковой сертификат не требуется. Дедлайн в предоставленных условиях указан как 20 декабря; год необходимо подтвердить, поэтому дата не внесена в календарное поле.'),
  ('cup-preparatory-2027', 'china-university-of-petroleum-east-china',
   'Подготовительная программа', 'Подготовительная программа', 'Подготовка к дальнейшему обучению', 'Китайский или английский',
   'Для обучения на китайском языке требуется HSK 3. Для обучения на английском языке принимаются Duolingo 100, IELTS 6.0 или TOEFL 75. Дедлайн указан как 20 декабря; год необходимо подтвердить.'),
  ('gdufs-language-2027', 'gdufs-south-china-business-college',
   'Китайский язык — начальный уровень', 'Языковой курс', 'Китайский язык', 'Китайский',
   'Можно учиться один семестр или один год. Для годичного обучения стоимость обучения и проживания указана как вдвое выше семестровой. Приём — до заполнения свободных мест.'),
  ('cumt-language-beginner-2027', 'china-university-of-mining-and-technology',
   'Китайский язык — начальный уровень', 'Языковой курс', 'Начальный китайский', 'Китайский',
   'Начальный уровень китайского языка. Начало обучения — 25 февраля 2027 года.'),
  ('cumt-language-intermediate-2027', 'china-university-of-mining-and-technology',
   'Китайский язык — средний уровень', 'Языковой курс', 'Средний китайский', 'Китайский',
   'Для среднего уровня требуется сертификат HSK 3. Начало обучения — 25 февраля 2027 года.');

insert into public.university_programs (
  university_id, external_id, name, degree_level, specialty, language, description, is_active
)
select ids.university_id, program.external_id, program.name, program.degree_level,
       program.specialty, program.language, program.description, true
from spring_2027_programs program
join spring_2027_university_ids ids on ids.slug = program.university_slug
on conflict (university_id, external_id) do nothing;

create temporary table spring_2027_intakes (
  external_id text primary key references spring_2027_programs(external_id),
  application_deadline date,
  study_starts date
);

insert into spring_2027_intakes values
  ('scut-language-2027', null, null),
  ('szu-phd-2027', '2026-11-30', null),
  ('zisu-language-2027', null, null),
  ('cup-language-2027', null, null),
  ('cup-preparatory-2027', null, null),
  ('gdufs-language-2027', null, null),
  ('cumt-language-beginner-2027', '2027-01-04', '2027-02-25'),
  ('cumt-language-intermediate-2027', '2027-01-04', '2027-02-25');

insert into public.university_intakes (
  program_id, name, academic_year, application_deadline, study_starts, is_active
)
select db_program.id, 'Весна', '2027', intake.application_deadline, intake.study_starts, true
from spring_2027_intakes intake
join spring_2027_programs seed on seed.external_id = intake.external_id
join spring_2027_university_ids ids on ids.slug = seed.university_slug
join public.university_programs db_program
  on db_program.university_id = ids.university_id and db_program.external_id = seed.external_id
on conflict (program_id, name, academic_year) do nothing;

create temporary table spring_2027_costs (
  university_slug text not null references spring_2027_universities(slug),
  external_id text references spring_2027_programs(external_id),
  category text not null,
  title text not null,
  amount numeric(14,2) not null,
  currency text not null,
  period text,
  is_required boolean not null default true
);

insert into spring_2027_costs (university_slug, external_id, category, title, amount, currency, period) values
  ('south-china-university-of-technology', 'scut-language-2027', 'application_fee', 'Регистрационный взнос', 450, 'CNY', 'единоразово'),
  ('south-china-university-of-technology', 'scut-language-2027', 'tuition', 'Обычный курс китайского языка', 8500, 'CNY', 'семестр'),
  ('south-china-university-of-technology', 'scut-language-2027', 'tuition', 'Интенсивный курс китайского языка', 10000, 'CNY', 'семестр'),

  ('shenzhen-university', 'szu-phd-2027', 'application_fee', 'Регистрационный взнос', 400, 'CNY', 'единоразово'),
  ('shenzhen-university', 'szu-phd-2027', 'tuition', 'Обучение по гуманитарным направлениям', 34000, 'CNY', 'год'),
  ('shenzhen-university', 'szu-phd-2027', 'tuition', 'Обучение по инженерным и техническим направлениям', 40000, 'CNY', 'год'),
  ('shenzhen-university', 'szu-phd-2027', 'tuition', 'Обучение по направлениям медицины, искусства и спорта', 52000, 'CNY', 'год'),
  ('shenzhen-university', 'szu-phd-2027', 'housing', 'Общежитие кампуса Yuehai — нижняя граница указанного диапазона', 2400, 'CNY', 'семестр'),
  ('shenzhen-university', 'szu-phd-2027', 'housing', 'Общежитие кампуса Yuehai — верхняя граница указанного диапазона', 8000, 'CNY', 'семестр'),
  ('shenzhen-university', 'szu-phd-2027', 'housing', 'Общежитие кампуса Lihu — двухместная комната', 750, 'CNY', 'семестр'),

  ('zhejiang-international-studies-university', 'zisu-language-2027', 'application_fee', 'Регистрационный взнос', 500, 'CNY', 'единоразово'),
  ('zhejiang-international-studies-university', 'zisu-language-2027', 'tuition', 'Обучение китайскому языку', 7000, 'CNY', 'семестр'),
  ('zhejiang-international-studies-university', 'zisu-language-2027', 'housing', 'Общежитие — четырёхместная комната', 1950, 'CNY', 'семестр'),
  ('zhejiang-international-studies-university', 'zisu-language-2027', 'housing', 'Общежитие — двухместная комната', 4200, 'CNY', 'семестр'),
  ('zhejiang-international-studies-university', 'zisu-language-2027', 'housing', 'Общежитие — одноместная комната', 9000, 'CNY', 'семестр'),

  ('china-university-of-petroleum-east-china', 'cup-language-2027', 'tuition', 'Курс китайского языка', 7000, 'CNY', 'семестр'),
  ('china-university-of-petroleum-east-china', 'cup-preparatory-2027', 'tuition', 'Подготовительная программа', 10000, 'CNY', 'семестр'),
  ('china-university-of-petroleum-east-china', null, 'housing', 'Апартаменты вне кампуса', 1100, 'CNY', 'месяц'),

  ('gdufs-south-china-business-college', 'gdufs-language-2027', 'application_fee', 'Регистрационный взнос', 400, 'CNY', 'единоразово'),
  ('gdufs-south-china-business-college', 'gdufs-language-2027', 'tuition', 'Обучение китайскому языку', 5000, 'CNY', 'семестр'),
  ('gdufs-south-china-business-college', 'gdufs-language-2027', 'housing', 'Общежитие — двухместная комната', 4500, 'CNY', 'семестр'),
  ('gdufs-south-china-business-college', 'gdufs-language-2027', 'housing', 'Общежитие — трёхместная комната', 3000, 'CNY', 'семестр'),
  ('gdufs-south-china-business-college', 'gdufs-language-2027', 'housing', 'Общежитие — четырёхместная комната', 2500, 'CNY', 'семестр'),
  ('gdufs-south-china-business-college', 'gdufs-language-2027', 'guardian_fee', 'Опекунский сбор для несовершеннолетних', 2000, 'CNY', 'единоразово'),

  ('china-university-of-mining-and-technology', 'cumt-language-beginner-2027', 'application_fee', 'Регистрационный взнос', 400, 'CNY', 'единоразово'),
  ('china-university-of-mining-and-technology', 'cumt-language-beginner-2027', 'tuition', 'Начальный уровень китайского языка', 6000, 'CNY', 'семестр'),
  ('china-university-of-mining-and-technology', 'cumt-language-beginner-2027', 'housing', 'Двухместная комната (период оплаты не указан)', 1500, 'CNY', null),
  ('china-university-of-mining-and-technology', 'cumt-language-intermediate-2027', 'application_fee', 'Регистрационный взнос', 400, 'CNY', 'единоразово'),
  ('china-university-of-mining-and-technology', 'cumt-language-intermediate-2027', 'tuition', 'Средний уровень китайского языка', 6000, 'CNY', 'семестр'),
  ('china-university-of-mining-and-technology', 'cumt-language-intermediate-2027', 'housing', 'Двухместная комната (период оплаты не указан)', 1500, 'CNY', null);

update spring_2027_costs
set is_required = false
where category = 'guardian_fee';

insert into public.university_costs (
  university_id, program_id, intake_id, category, title, amount, currency, period, is_required
)
select ids.university_id, db_program.id, db_intake.id, seed.category, seed.title,
       seed.amount, seed.currency, seed.period, seed.is_required
from spring_2027_costs seed
join spring_2027_university_ids ids on ids.slug = seed.university_slug
left join public.university_programs db_program
  on db_program.university_id = ids.university_id and db_program.external_id = seed.external_id
left join public.university_intakes db_intake
  on db_intake.program_id = db_program.id and db_intake.name = 'Весна' and db_intake.academic_year = '2027'
where not exists (
  select 1 from public.university_costs existing
  where existing.university_id = ids.university_id
    and existing.program_id is not distinct from db_program.id
    and existing.intake_id is not distinct from db_intake.id
    and existing.category = seed.category
    and existing.title = seed.title
    and existing.amount = seed.amount
    and existing.currency = seed.currency
    and existing.period is not distinct from seed.period
);

create temporary table spring_2027_requirements (
  external_id text not null references spring_2027_programs(external_id),
  requirement_type text not null,
  title text not null,
  description text not null,
  is_mandatory boolean not null default true,
  minimum_value numeric(10,2),
  unit text
);

insert into spring_2027_requirements (external_id, requirement_type, title, description) values
  ('scut-language-2027', 'age', 'Возраст', 'Принимаются только заявители от 18 лет; несовершеннолетние не принимаются.'),
  ('scut-language-2027', 'documents', 'Документы для заявителей из Центральной Азии', 'Справка о несудимости с переводом на китайский язык, нотариальным заверением и апостилем. Требуется отправить бумажные документы в университет.'),
  ('scut-language-2027', 'housing', 'Проживание', 'Университет не предоставляет общежитие. После зачисления может рекомендовать варианты аренды жилья.'),

  ('szu-phd-2027', 'education', 'Образование', 'Степень магистра или выше.'),
  ('szu-phd-2027', 'age', 'Возраст', 'Возраст до 40 лет; уточните у университета, включается ли возраст 40 лет.'),
  ('szu-phd-2027', 'language', 'Обучение на китайском языке', 'HSK 5, минимум 180 баллов.'),
  ('szu-phd-2027', 'language', 'Обучение на английском языке', 'Требуется подтверждение владения английским языком.'),
  ('szu-phd-2027', 'documents', 'Стандартные документы', 'Требуются 7 стандартных документов; точный состав перечня необходимо уточнить у университета.'),
  ('szu-phd-2027', 'documents', 'Рекомендации', 'Две рекомендации от профессоров или доцентов, а также рекомендация предполагаемого научного руководителя.'),
  ('szu-phd-2027', 'documents', 'Личное заявление', 'Объём не менее 1500 китайских иероглифов; единицу объёма необходимо подтвердить по официальным требованиям.'),
  ('szu-phd-2027', 'documents', 'Резюме и языковой сертификат', 'Требуются резюме и языковой сертификат.'),
  ('szu-phd-2027', 'financial', 'Подтверждение средств', 'Подтвердите наличие не менее 30 000 CNY или эквивалента.'),
  ('szu-phd-2027', 'documents', 'Справка о несудимости', 'Требуется справка о несудимости с переводом на китайский язык.'),
  ('szu-phd-2027', 'scholarship', 'Стипендии', 'Доступны стипендии провинции Гуандун, Shenzhen Universiade и Liyuan. Назначаются по результатам отбора и не гарантируются.'),

  ('zisu-language-2027', 'age', 'Возраст', 'Возраст заявителя — от 18 до 23 лет.'),
  ('zisu-language-2027', 'age', 'Верхняя возрастная граница', 'Максимальный возраст — 23 года.'),
  ('zisu-language-2027', 'interview', 'Собеседование', 'Обязательное собеседование.'),
  ('zisu-language-2027', 'language', 'Язык общения', 'Необходимо уметь общаться на бытовые темы на китайском или английском языке.'),

  ('cup-language-2027', 'language', 'Языковой сертификат', 'Языковой сертификат не требуется.'),
  ('cup-language-2027', 'age', 'Возраст', 'Возраст заявителя — от 16 до 25 лет.'),
  ('cup-language-2027', 'age', 'Верхняя возрастная граница', 'Максимальный возраст — 25 лет.'),
  ('cup-language-2027', 'education', 'Образование', 'Среднее образование или эквивалент.'),
  ('cup-language-2027', 'documents', 'Стандартные документы', 'Требуются 7 стандартных документов; точный состав перечня не предоставлен.'),
  ('cup-language-2027', 'financial', 'Финансовое подтверждение', 'Требуется подтверждение наличия средств.'),
  ('cup-language-2027', 'deadline', 'Срок подачи', 'В предоставленных условиях указано 20 декабря; год не подтверждён, поэтому календарная дата не установлена.'),

  ('cup-preparatory-2027', 'language', 'Обучение на китайском языке', 'Требуется HSK 3.'),
  ('cup-preparatory-2027', 'language', 'Обучение на английском языке', 'Принимаются Duolingo 100, IELTS 6.0 или TOEFL 75.'),
  ('cup-preparatory-2027', 'age', 'Возраст', 'Возраст заявителя — от 16 до 25 лет.'),
  ('cup-preparatory-2027', 'age', 'Верхняя возрастная граница', 'Максимальный возраст — 25 лет.'),
  ('cup-preparatory-2027', 'education', 'Образование', 'Среднее образование или эквивалент.'),
  ('cup-preparatory-2027', 'documents', 'Стандартные документы', 'Требуются 7 стандартных документов; точный состав перечня не предоставлен.'),
  ('cup-preparatory-2027', 'financial', 'Финансовое подтверждение', 'Требуется подтверждение наличия средств.'),
  ('cup-preparatory-2027', 'deadline', 'Срок подачи', 'В предоставленных условиях указано 20 декабря; год не подтверждён, поэтому календарная дата не установлена.'),

  ('gdufs-language-2027', 'age', 'Возраст', 'Указанный возраст для программы — от 18 до 35 лет.'),
  ('gdufs-language-2027', 'age', 'Верхняя возрастная граница', 'Максимальный указанный возраст — 35 лет.'),
  ('gdufs-language-2027', 'education', 'Образование', 'Среднее образование или выше. Выпускники средних профессиональных учебных заведений рассматриваются индивидуально.'),
  ('gdufs-language-2027', 'financial', 'Банковская справка', 'Требуется подтверждение наличия более 5 000 USD.'),
  ('gdufs-language-2027', 'documents', 'Стандартные документы', 'Требуются 7 стандартных документов; точный состав перечня не предоставлен.'),
  ('gdufs-language-2027', 'documents', 'Справка о несудимости', 'Требуется справка с переводом на китайский язык и апостилем. Заявителям, уже находящимся в Китае, нужна китайская справка о несудимости.'),
  ('gdufs-language-2027', 'age', 'Несовершеннолетние заявители', 'Рассматриваются индивидуально; может потребоваться опекунский сбор.'),
  ('gdufs-language-2027', 'deadline', 'Срок подачи', 'Приём открыт до заполнения свободных мест; календарная дата не указана.'),
  ('gdufs-language-2027', 'program', 'Длительность обучения', 'Возможно обучение один семестр или один год. По предоставленным условиям годовая стоимость обучения и проживания вдвое выше семестровой.'),

  ('cumt-language-beginner-2027', 'age', 'Возраст', 'Возраст заявителя — от 17 до 30 лет.'),
  ('cumt-language-beginner-2027', 'age', 'Верхняя возрастная граница', 'Максимальный возраст — 30 лет.'),
  ('cumt-language-beginner-2027', 'education', 'Образование', 'Среднее образование или выше.'),
  ('cumt-language-beginner-2027', 'documents', 'Стандартные документы', 'Требуются 7 стандартных документов; точный состав перечня не предоставлен.'),
  ('cumt-language-intermediate-2027', 'age', 'Возраст', 'Возраст заявителя — от 17 до 30 лет.'),
  ('cumt-language-intermediate-2027', 'age', 'Верхняя возрастная граница', 'Максимальный возраст — 30 лет.'),
  ('cumt-language-intermediate-2027', 'education', 'Образование', 'Среднее образование или выше.'),
  ('cumt-language-intermediate-2027', 'documents', 'Стандартные документы', 'Требуются 7 стандартных документов; точный состав перечня не предоставлен.'),
  ('cumt-language-intermediate-2027', 'language', 'Средний уровень китайского', 'Для поступления на средний уровень требуется сертификат HSK 3.');

update spring_2027_requirements requirement
set minimum_value = seed.minimum_value,
    unit = seed.unit
from (values
  ('scut-language-2027', 'Возраст', 18::numeric, 'лет'),
  ('szu-phd-2027', 'Обучение на китайском языке', 180::numeric, 'баллов'),
  ('szu-phd-2027', 'Личное заявление', 1500::numeric, 'иероглифов'),
  ('szu-phd-2027', 'Подтверждение средств', 30000::numeric, 'CNY'),
  ('zisu-language-2027', 'Возраст', 18::numeric, 'лет'),
  ('cup-language-2027', 'Возраст', 16::numeric, 'лет'),
  ('cup-preparatory-2027', 'Возраст', 16::numeric, 'лет'),
  ('gdufs-language-2027', 'Возраст', 18::numeric, 'лет'),
  ('cumt-language-beginner-2027', 'Возраст', 17::numeric, 'лет'),
  ('cumt-language-intermediate-2027', 'Возраст', 17::numeric, 'лет')
) as seed(external_id, title, minimum_value, unit)
where requirement.external_id = seed.external_id and requirement.title = seed.title;

insert into public.university_requirements (
  university_id, program_id, requirement_type, title, description, is_mandatory, minimum_value, unit, sort_order
)
select ids.university_id, db_program.id, seed.requirement_type, seed.title, seed.description,
       seed.is_mandatory, seed.minimum_value, seed.unit,
       row_number() over (partition by db_program.id order by seed.requirement_type, seed.title)::integer
from spring_2027_requirements seed
join spring_2027_programs program on program.external_id = seed.external_id
join spring_2027_university_ids ids on ids.slug = program.university_slug
join public.university_programs db_program
  on db_program.university_id = ids.university_id and db_program.external_id = seed.external_id
where not exists (
  select 1 from public.university_requirements existing
  where existing.university_id = ids.university_id
    and existing.program_id = db_program.id
    and existing.requirement_type = seed.requirement_type
    and existing.title = seed.title
);

create temporary table spring_2027_scholarships (
  name text primary key,
  description text not null,
  coverage_type text not null,
  coverage_value numeric(14,2) not null,
  currency text not null,
  eligibility text not null
);

insert into spring_2027_scholarships values
  ('Стипендия провинции Гуандун',
   'Ежегодная стипендия 30 000 CNY. Предоставляется по результатам отбора и не гарантируется.',
   'ежегодная стипендия', 30000, 'CNY',
   'Кандидаты на докторантуру; назначение по результатам отбора.'),
  ('Стипендия Универсиады Шэньчжэня',
   'Ежегодная стипендия 40 000 CNY. Предоставляется по результатам отбора и не гарантируется.',
   'ежегодная стипендия', 40000, 'CNY',
   'Кандидаты на докторантуру; назначение по результатам отбора.'),
  ('Стипендия Liyuan — категория I',
   'Освобождение от оплаты обучения и стипендия 72 000 CNY в год. Предоставляется по результатам отбора и не гарантируется.',
   'освобождение от оплаты обучения и ежегодная стипендия', 72000, 'CNY',
   'Кандидаты на докторантуру; назначение по результатам отбора.'),
  ('Стипендия Liyuan — категория II',
   'Освобождение от оплаты обучения и стипендия 60 000 CNY в год. Предоставляется по результатам отбора и не гарантируется.',
   'освобождение от оплаты обучения и ежегодная стипендия', 60000, 'CNY',
   'Кандидаты на докторантуру; назначение по результатам отбора.'),
  ('Стипендия Liyuan — категория III',
   'Освобождение от оплаты обучения и стипендия 48 000 CNY в год. Предоставляется по результатам отбора и не гарантируется.',
   'освобождение от оплаты обучения и ежегодная стипендия', 48000, 'CNY',
   'Кандидаты на докторантуру; назначение по результатам отбора.');

insert into public.scholarships (
  university_id, program_id, name, description, coverage_type, coverage_value, currency, eligibility, is_active
)
select ids.university_id, db_program.id, seed.name, seed.description, seed.coverage_type,
       seed.coverage_value, seed.currency, seed.eligibility, true
from spring_2027_scholarships seed
join spring_2027_university_ids ids on ids.slug = 'shenzhen-university'
join public.university_programs db_program
  on db_program.university_id = ids.university_id and db_program.external_id = 'szu-phd-2027'
where not exists (
  select 1 from public.scholarships existing
  where existing.university_id = ids.university_id
    and existing.program_id = db_program.id
    and existing.name = seed.name
);

update public.universities u
set is_active = true,
    programs_count = greatest(coalesce(u.programs_count, 0), (
      select count(*)::integer
      from public.university_programs p
      where p.university_id = u.id and p.is_active
    ))
from spring_2027_university_ids ids
where u.id = ids.university_id;

update public.education_countries country
set university_count = (
  select count(*)::integer
  from public.universities u
  where u.country_id = country.id and u.is_active
)
where country.slug = 'china';

commit;
