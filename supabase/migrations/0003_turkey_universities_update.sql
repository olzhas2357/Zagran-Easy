-- ============================================================
-- ZagranEasy — Обновление базы вузов Турции
-- Заменяет 3 старых вуза Турции (istanbul/ankara/akdeniz-university)
-- на полный список из 8 вузов (источник: turkey_education_data.json).
-- Применять через Supabase SQL Editor (см. supabase/README.md).
-- ============================================================

-- Обновляем карточку страны
update education_countries set
  cities = array['Стамбул','Анкара','Измир','Анталья','Бурса'],
  description = 'Высшее образование в Турции: сочетание европейских стандартов и доступной стоимости обучения.',
  long_description = 'Турция предлагает студентам высококачественные образовательные программы на английском и турецком языках. Университеты страны участвуют в Болонском процессе, что обеспечивает признание дипломов в Европе и по всему миру. Студентам доступны государственные и частные вузы, грантовые программы (включая Türkiye Bursları) и комфортные условия проживания.',
  image_url = 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200',
  hero_image_url = 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b',
  university_count = 8,
  features = array['Обучение на английском и турецком языках','Признание дипломов в странах ЕС (Болонский процесс)','Возможность поступления без экзаменов и по аттестату','Доступные цены на обучение и проживание','Широкий выбор стипендий и скидок'],
  updated_at = now()
where slug = 'turkey';

-- Удаляем старые 3 вуза Турции — их заменяет полный список ниже
delete from universities
where country_id = (select id from education_countries where slug = 'turkey')
  and slug in ('istanbul-university', 'ankara-university', 'akdeniz-university');

-- Вставляем 8 вузов Турции
insert into universities (
  country_id, slug, name, name_local, city, type, degree_levels, languages, specialties,
  tuition_from, tuition_to, has_grant, grant_details, has_dormitory, dormitory_cost, requirements,
  description, image_url, website_url, ranking_national, ranking_world,
  ielts_required, is_partner, admission_chance, deadline_label, deadline_date,
  rating_stars, reviews_count, programs_count, last_verified_at, program_list, stories, is_active, sort_order
) values
(
  (select id from education_countries where slug = 'turkey'),
  'istanbul-university', 'Стамбульский университет', 'İstanbul Üniversitesi', 'Стамбул', 'public',
  array['Бакалавриат','Магистратура','PhD'], array['Турецкий','Английский'], array['Медицина','Юриспруденция','Бизнес','Гуманитарные науки'],
  800, 3500, true, 'Доступны государственные гранты Türkiye Bursları и скидки по академическим успехам.', true, 150,
  array['Аттестат / Диплом','Загранпаспорт','Сертификат YÖS / TR-YÖS','Сертификат знание языка (TOEFL/TÖMER)'],
  'Старейший и один из самых престижных государственных университетов Турции, основанный в 1453 году.', 'https://images.unsplash.com/photo-1562774053-701939374585', 'https://www.istanbul.edu.tr',
  2, 750,
  false, true, 75, 'до 15 июля', '2026-07-15',
  4.8, 142, 120, '2026-08-01',
  '[{"name": "Медицина (Medicine)", "meta": "Бакалавриат | 6 лет | Английский/Турецкий", "price": "$3 500"}, {"name": "Международное право", "meta": "Бакалавриат | 4 года | Турецкий", "price": "$1 200"}, {"name": "Бизнес-администрирование (MBA)", "meta": "Магистратура | 2 года | Английский", "price": "$2 000"}]', '[{"name": "Айдос К.", "meta": "Факультет медицины, 2 курс", "text": "Поступил через ZagranEasy Помогли подготовить документы для YÖS и подать заявку на грант. Учиться сложно, но уровень преподавания высочайший!"}]', true, 1
),
(
  (select id from education_countries where slug = 'turkey'),
  'middle-east-technical-university', 'Ближневосточный технический университет (METU)', 'Orta Doğu Teknik Üniversitesi (ODTÜ)', 'Анкара', 'public',
  array['Бакалавриат','Магистратура','PhD'], array['Английский'], array['IT','Инженерия','Архитектура','Естественные науки'],
  1200, 4000, true, 'Полные и частичные стипендии для выдающихся иностранных студентов.', true, 200,
  array['Аттестат с высоким средним баллом','SAT / SAT Subject','IELTS / TOEFL','Загранпаспорт'],
  'Ведущий технический университет Турции, полностью обучающий на английском языке. Входит в топ мировых рейтингов по инженерии.', 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3', 'https://www.metu.edu.tr',
  1, 501,
  true, true, 65, 'до 30 июня', '2026-06-30',
  4.9, 98, 85, '2026-08-10',
  '[{"name": "Computer Engineering", "meta": "Бакалавриат | 4 года | Английский", "price": "$2 500"}, {"name": "Mechanical Engineering", "meta": "Бакалавриат | 4 года | Английский", "price": "$2 500"}, {"name": "Data Science", "meta": "Магистратура | 2 года | Английский", "price": "$3 500"}]', '[]', true, 2
),
(
  (select id from education_countries where slug = 'turkey'),
  'istanbul-gelisim-university', 'Стамбульский университет Гелишим', 'İstanbul Gelişim Üniversitesi', 'Стамбул', 'private',
  array['Бакалавриат','Магистратура'], array['Английский','Турецкий'], array['IT','Инженерия','Авиация','Дизайн','Бизнес'],
  3000, 7500, true, 'Внутренние стипендии и скидки от 25% до 50% при ранней подаче документов.', true, 250,
  array['Аттестат / Диплом','Загранпаспорт','Мотивационное письмо'],
  'Один из наиболее динамично развивающихся частных вузов Турции с международно аккредитованными программами AQAS.', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1', 'https://gelisim.edu.tr',
  25, 1201,
  false, true, 85, 'до 31 августа', '2026-08-31',
  4.7, 64, 95, '2026-08-15',
  '[{"name": "Software Engineering", "meta": "Бакалавриат | 4 года | Английский", "price": "$4 000"}, {"name": "Aeronautical Engineering", "meta": "Бакалавриат | 4 года | Английский", "price": "$4 500"}, {"name": "Graphic Design", "meta": "Бакалавриат | 4 года | Турецкий", "price": "$3 200"}]', '[]', true, 3
),
(
  (select id from education_countries where slug = 'turkey'),
  'bahcesehir-university', 'Университет Бахчешехир (BAU)', 'Bahçeşehir Üniversitesi', 'Стамбул', 'private',
  array['Бакалавриат','Магистратура','PhD'], array['Английский','Турецкий'], array['IT','Медицина','Архитектура','Бизнес','Медиа и коммуникации'],
  5500, 25000, true, 'Скидки по партнерским программам Qoldau Study до 50%.', true, 350,
  array['Аттестат / Диплом','Загранпаспорт','Сертификат IELTS/TOEFL (желательно)'],
  'Престижный частный университет на берегу Босфора. Известен своей глобальной сетью кампусов BAU Global и программами обмена.', 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a', 'https://bau.edu.tr',
  10, 801,
  false, true, 80, 'до 25 августа', '2026-08-25',
  4.8, 115, 110, '2026-08-18',
  '[{"name": "Medicine", "meta": "Бакалавриат | 6 лет | Английский", "price": "$25 000"}, {"name": "Artificial Intelligence Engineering", "meta": "Бакалавриат | 4 года | Английский", "price": "$8 500"}, {"name": "Digital Game Design", "meta": "Бакалавриат | 4 года | Английский", "price": "$7 900"}]', '[]', true, 4
),
(
  (select id from education_countries where slug = 'turkey'),
  'sabanci-university', 'Университет Сабанджи', 'Sabancı Üniversitesi', 'Стамбул', 'private',
  array['Бакалавриат','Магистратура','PhD'], array['Английский'], array['IT','Инженерия','Экономика','Менеджмент'],
  9000, 21500, true, 'Гранты 25%, 50%, 75% и 100% на основе высокого балла SAT / GPA.', true, 300,
  array['Аттестат с высоким балом','SAT / ACT','TOEFL / IELTS','Эссе'],
  'Один из лучших исследовательских частных университетов Турции с междисциплинарной системой обучения без выбора специальности на 1 курсе.', 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952', 'https://www.sabanciuniv.edu',
  4, 450,
  true, true, 60, 'до 10 августа', '2026-08-10',
  4.9, 52, 40, '2026-08-12',
  '[{"name": "Computer Science and Engineering", "meta": "Бакалавриат | 4 года | Английский", "price": "$21 500"}, {"name": "Industrial Engineering", "meta": "Бакалавриат | 4 года | Английский", "price": "$21 500"}]', '[]', true, 5
),
(
  (select id from education_countries where slug = 'turkey'),
  'koc-university', 'Университет Коч', 'Koç Üniversitesi', 'Стамбул', 'private',
  array['Бакалавриат','Магистратура','PhD'], array['Английский'], array['Медицина','IT','Инженерия','Право','Бизнес'],
  10500, 26500, true, 'Мериторные академические стипендии для сильнейших абитуриентов.', true, 320,
  array['Высокий GPA','SAT / ACT','IELTS / TOEFL','Рекомендательные письма'],
  'Топовый частный университет Турции, стабильно входящий в список лучших университетов мира. Высокий уровень научных исследований.', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f', 'https://www.ku.edu.tr',
  3, 400,
  true, false, 50, 'до 1 июля', '2026-07-01',
  4.9, 78, 50, '2026-08-05',
  '[{"name": "School of Medicine", "meta": "Бакалавриат | 6 лет | Английский", "price": "$26 500"}, {"name": "Chemical and Biological Engineering", "meta": "Бакалавриат | 4 года | Английский", "price": "$21 500"}]', '[]', true, 6
),
(
  (select id from education_countries where slug = 'turkey'),
  'ege-university', 'Университет Эге', 'Ege Üniversitesi', 'Измир', 'public',
  array['Бакалавриат','Магистратура','PhD'], array['Турецкий','Английский'], array['Агрономия','Медицина','Инженерия','Педагогика'],
  600, 2800, true, 'Стипендии Türkiye Bursları.', true, 120,
  array['Аттестат','TR-YÖS','Загранпаспорт'],
  'Крупный государственный университет на побережье Эгейского моря в Измире с развитым исследовательским комплексом.', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644', 'https://ege.edu.tr',
  8, 950,
  false, true, 70, 'до 20 июля', '2026-07-20',
  4.6, 34, 130, '2026-08-14',
  '[{"name": "Стоматология", "meta": "Бакалавриат | 5 лет | Турецкий", "price": "$2 800"}, {"name": "Сельское хозяйство и агрономия", "meta": "Бакалавриат | 4 года | Турецкий", "price": "$600"}]', '[]', true, 7
),
(
  (select id from education_countries where slug = 'turkey'),
  'ankara-university', 'Анкарский университет', 'Ankara Üniversitesi', 'Анкара', 'public',
  array['Бакалавриат','Магистратура','PhD'], array['Турецкий','Английский'], array['Политология','Право','Медицина','Языкознание'],
  700, 3200, true, 'Государственная стипендиальная программа.', true, 140,
  array['Аттестат','YÖS / TR-YÖS','Загранпаспорт'],
  'Первый высший учебный заведение Турецкой Республики, основанный Мустафой Кемалем Ататюрком.', 'https://images.unsplash.com/photo-1562774053-701939374585', 'https://www.ankara.edu.tr',
  5, 800,
  false, true, 72, 'до 10 июля', '2026-07-10',
  4.7, 45, 140, '2026-08-16',
  '[{"name": "Политология и государственное управление", "meta": "Бакалавриат | 4 года | Турецкий", "price": "$900"}, {"name": "Фармация", "meta": "Бакалавриат | 5 лет | Турецкий", "price": "$2 500"}]', '[]', true, 8
);
