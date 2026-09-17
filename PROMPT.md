Ты работаешь над проектом ZagranEasy — платформой для поступления студентов
в зарубежные университеты.

Stack:
- Frontend: Next.js App Router + TypeScript
- Tailwind CSS
- Backend: NestJS
- Database: Supabase PostgreSQL
- Уже существует каталог университетов
- Уже существуют country pages:
  /china
  /turkey
  /europe
- Уже есть API университетов.
- Не ломай существующий backend/API.
- Перед изменениями изучи существующие types, API client, components,
  database fields и текущую страницу university details.
- Переиспользуй существующие данные там, где это возможно.

====================================================
ГЛАВНАЯ ЗАДАЧА
====================================================

Полностью переработай UI/UX страницы деталей университета.

Сейчас university detail page выглядит слишком административно:
много маленьких одинаковых блоков, слабая визуальная иерархия,
фотография университета слишком маленькая, программы плохо заметны,
campus/gallery/video практически не участвуют в presentation.

Нужно превратить страницу в современную образовательную страницу,
которая одновременно:

1. красиво презентует университет студенту;
2. помогает студенту понять стоимость, программы и требования;
3. позволяет менеджеру ZagranEasy быстро добавить университет
   или конкретную программу студенту;
4. показывает реальные фотографии кампуса;
5. поддерживает несколько фотографий;
6. поддерживает видео;
7. хорошо работает desktop/tablet/mobile;
8. визуально соответствует общей дизайн-системе ZagranEasy.

Не делай интерфейс похожим на CRM.
Страница должна ощущаться как premium education platform.

====================================================
ROUTING
====================================================

Сохраняем существующую архитектуру университетов.

Country:

/china
/turkey
/europe

University detail должен открываться из соответствующего каталога.

Если существующая архитектура позволяет, использовать SEO-friendly URL:

/universities/[slug]

или существующий route проекта.

Не меняй URL без необходимости, если существующие ссылки уже
используются frontend/backend.

Добавить breadcrumb:

Университеты / Китай / Zhejiang University

или:

Университеты / Европа / Италия / University of Bologna

Breadcrumb должен позволять вернуться назад.

====================================================
1. UNIVERSITY HERO
====================================================

Полностью переделать верхнюю часть страницы.

Сейчас фотография слишком маленькая.

Нужен большой cinematic hero.

DESKTOP:

------------------------------------------------------------
← Назад к университетам

[                BIG CAMPUS PHOTO                       ]
[                                                       ]
[                                                       ]
[ 🇨🇳 Китай ] [ Государственный ] [ Партнер ZagranEasy ]
[                                                       ]
------------------------------------------------------------

Под фотографией:

[University logo]

Zhejiang University
浙江大学

📍 Hangzhou, China

⭐ 4.8
🌍 #47 мировой рейтинг

[Добавить студенту] [Сравнить] [♡]

Фотография:
- aspect-ratio примерно 16:6 / 16:7;
- width 100%;
- rounded 24px;
- object-cover;
- качественный gradient overlay;
- никаких растянутых изображений;
- responsive;
- next/image;
- proper sizes;
- lazy loading для изображений ниже hero.

Если university.image_url отсутствует:
использовать красивый branded placeholder,
а НЕ broken image.

====================================================
2. UNIVERSITY PHOTO GALLERY
====================================================

Одна фотография недостаточна.

Нужно поддержать university gallery.

После hero или внутри hero добавить:

┌─────────────────────────────┬───────────────┐
│                             │ Campus        │
│       MAIN CAMPUS           ├───────────────┤
│                             │ Dormitory     │
│                             │ +8 фото       │
└─────────────────────────────┴───────────────┘

При клике открывать fullscreen gallery/lightbox.

Категории фотографий:

- CAMPUS
- DORMITORY
- CLASSROOM
- LIBRARY
- SPORTS
- CITY
- STUDENT_LIFE
- OTHER

Каждая фотография может иметь:

id
university_id
image_url
caption
category
sort_order
is_cover

Если таблицы university_images пока нет,
не ломай существующую страницу.

Сначала проверь schema.

Если необходимо — подготовь migration/SQL отдельно.

Существующий university.image_url использовать как cover.

ВАЖНО:

Не использовать случайные фотографии другого университета.

Если фотография отсутствует — placeholder.

В будущем реальные HTTPS URL фотографий будут храниться в Supabase.

====================================================
3. UNIVERSITY HEADER INFORMATION
====================================================

После Hero сделать компактный Quick Facts блок.

Не создавать 10 маленьких карточек.

Использовать одну горизонтальную clean section:

┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Основан      │ Тип          │ Язык         │ Общежитие    │
│ 1897         │ Public       │ EN / Chinese │ Есть         │
└──────────────┴──────────────┴──────────────┴──────────────┘

Дополнительно:

World ranking
City
Programs count

На mobile сделать horizontal scroll или 2-column grid.

====================================================
4. STICKY UNIVERSITY NAVIGATION
====================================================

После Quick Facts:

[ Обзор ]
[ Программы ]
[ Поступление ]
[ Стоимость ]
[ Гранты ]
[ Кампус ]
[ Видео ]

Навигация должна быть sticky.

При клике делать smooth scroll до соответствующей секции.

Active section подсвечивать.

На телефоне:
horizontal scroll tabs.

====================================================
5. OVERVIEW
====================================================

Section:

Об университете

Слева:
description.

Справа:
important facts.

Пример:

Zhejiang University — ...

[Читать полностью]

Почему стоит рассмотреть:

✓ сильные программы
✓ международные программы
✓ гранты
✓ общежитие
✓ инфраструктура

Использовать существующие:
description
advantages
ranking
type
languages
city
и другие fields.

Не придумывать информацию.

Если field пустой — скрывать соответствующий элемент.

====================================================
6. PROGRAMS — ОДИН ИЗ ГЛАВНЫХ БЛОКОВ
====================================================

Программы сейчас должны стать центральной частью university page.

Заголовок:

Программы обучения
Найдите программу, подходящую вашему направлению и уровню образования.

Tabs:

[Все]
[Бакалавриат]
[Магистратура]
[PhD]
[Языковые]

Search:

🔎 Найти специальность

Filters:

Язык
Уровень
Стоимость

Program Card:

------------------------------------------------

Computer Science

Bachelor • 4 года
🌐 English

$4 200 / год

IELTS 6.0+
GPA 75%+

📅 Deadline: 30 июня 2027

[Подробнее о программе] [Добавить студенту]

------------------------------------------------

Не показывать огромное количество данных сразу.

Если программ много:
первые 6-8 программ +
[Показать все программы].

====================================================
7. PROGRAM DETAILS
====================================================

При нажатии "Подробнее о программе"
открывать отдельный detail drawer/modal/page в зависимости
от существующей архитектуры.

Показать:

Computer Science

Degree:
Bachelor

Duration:
4 years

Language:
English

Tuition:
$4,200/year

Application fee:
если существует

Deadline:
30 June 2027

Requirements:

IELTS
TOEFL
HSK
GPA
Age
Foundation
Portfolio

Required documents:

Passport
Certificate/Diploma
Transcript
Motivation Letter
Recommendation Letter
Language certificate
Medical documents

Scholarships:
если связаны с программой.

CTA:

[Добавить программу студенту]

====================================================
8. ADMISSION REQUIREMENTS
====================================================

Создать красивую section:

Требования к поступлению

Не делать обычный длинный текст.

Использовать structured UI.

Academic requirements

🎓 GPA
75%+

🌐 IELTS
6.0+

🇨🇳 HSK
4+

🎂 Возраст
17–25

Затем:

Необходимые документы

✓ Паспорт
✓ Аттестат
✓ Transcript
✓ Language certificate
✓ Motivation Letter

Все значения брать из API/database.

Если требования отличаются между программами,
показать:

"Точные требования зависят от выбранной программы."

====================================================
9. TUITION / COST
====================================================

Создать отдельную визуально сильную секцию:

Стоимость обучения

Bachelor
от $4,200 / год

Master
от $4,800 / год

PhD
от $5,500 / год

Дополнительные расходы:

🏠 Общежитие
$600–1,200 / год

🛡 Страховка
если данные существуют

Application fee
если существует

ВАЖНО:
не показывать $0, null, undefined.

Если стоимость неизвестна:

"Стоимость уточняется для выбранной программы."

====================================================
10. SCHOLARSHIPS
====================================================

Section:

Гранты и стипендии

Cards:

Chinese Government Scholarship

University Scholarship

Provincial Scholarship

Для каждой:

Название
Что покрывает
Кому доступно
Deadline
requirements

[Подробнее]

Показывать только реальные данные API.

====================================================
11. CAMPUS / DORMITORY
====================================================

Очень важный визуальный блок.

Заголовок:

Кампус и проживание

Большая gallery:

Campus
Dormitory
Library
Classrooms
Sports

Использовать university_images.

Добавить информацию:

Общежитие: Есть
Стоимость: ...
Расстояние до кампуса: ...
Тип комнаты: ...

только если такие данные существуют.

====================================================
12. VIDEO
====================================================

Создать полноценный section:

Видео об университете

Не показывать просто URL.

Использовать video cards с thumbnail.

Главное видео:

┌─────────────────────────────────────────┐
│                                         │
│                  ▶                      │
│                                         │
│        Обзор Zhejiang University        │
│                                         │
└─────────────────────────────────────────┘

Под ним дополнительные:

[Campus Tour]
[Dormitory]
[Student Life]
[ZagranEasy Review]

Video types:

OVERVIEW
CAMPUS
DORMITORY
STUDENT_LIFE
PROGRAM
ZAGRANEASY

Если видео YouTube:
не загружать тяжелый iframe сразу.

Сначала thumbnail + play.
Iframe загружать после interaction.

Если таблицы videos пока нет,
подготовить структуру:

university_videos

id
university_id
title
description
video_url
thumbnail_url
type
sort_order
is_featured
created_at

====================================================
13. CITY / LOCATION
====================================================

Section:

Город и расположение

Hangzhou, China

Короткое описание города, если оно есть в базе.

Можно показать:

City
Province/Region
Distance to city center
Airport

Если coordinates существуют:
показать карту.

Если координат нет:
НЕ угадывать location.

====================================================
14. MANAGER MODE
====================================================

Это очень важно.

Страница используется не только студентом,
но и менеджером ZagranEasy.

Не создавай полностью отдельную university page.

Использовать один UI.

Но если текущий пользователь MANAGER/ADMIN,
добавить manager tools.

Если менеджер пришел из client page:

?client_id=...

показать сверху компактную панель:

------------------------------------------------

👤 Подбор университета для

Алихан Нурланов

Направление: IT
Бюджет: $5,000 / год
IELTS: 6.0

[Вернуться к клиенту]

------------------------------------------------

При клике:

[Добавить студенту]

открыть modal:

Добавить в подборку

Студент:
Алихан Нурланов

University:
Zhejiang University

Program:
[Computer Science ▼]

Degree:
[Bachelor ▼]

Priority:

○ Основной вариант
○ Запасной вариант
○ Рассматриваем

Manager comment:

[ textarea ]

[Отмена] [Добавить в подборку]

Не придумывать endpoint.

Сначала найти существующие client/university/application/selection tables
и существующий API.

Если API нет — описать, какой endpoint нужен,
но не создавать несовместимую архитектуру без проверки backend.

====================================================
15. STUDENT MODE
====================================================

Студент не должен видеть manager tools.

Для студента основные CTA:

[Хочу поступить]
[Сравнить]
[Сохранить]

При клике "Хочу поступить"
использовать существующую application/consultation flow.

Если flow пока отсутствует,
создать UI abstraction, но не делать fake success.

====================================================
16. SIDEBAR / CTA
====================================================

На desktop можно сделать sticky right sidebar.

Например:

┌─────────────────────────┐
│ Zhejiang University     │
│                         │
│ Обучение                │
│ от $4,200 / год         │
│                         │
│ Deadline                │
│ 30 июня                 │
│                         │
│ ✓ Гранты                │
│ ✓ Общежитие             │
│                         │
│ [Хочу поступить]        │
│                         │
│ Нужна помощь?           │
│ [Спросить менеджера]    │
└─────────────────────────┘

Но sidebar не должен занимать слишком много места.

На mobile sidebar превращается в sticky bottom CTA:

[Хочу поступить]

====================================================
17. RELATED UNIVERSITIES
====================================================

В конце:

Похожие университеты

Показать 3–4 university cards.

Например:
- same country
- similar tuition
- similar programs

Но НЕ придумывать recommendation algorithm.

Использовать существующие данные.

====================================================
18. DESIGN SYSTEM
====================================================

Стиль ZagranEasy:

Primary:
#3255AD или существующий project primary color.

Background:
очень светлый blue/gray.

Cards:
white.

Border:
subtle gray/blue.

Radius:
16–24px.

Shadows:
очень мягкие.

Typography:
современная clean typography.

Главное правило:

НЕ делать каждый параметр отдельной карточкой.

Использовать:
- whitespace
- typography hierarchy
- sections
- dividers
- grouped information.

University page должна выглядеть premium,
но оставаться очень простой для чтения.

Избегать:
- excessive gradients;
- glassmorphism everywhere;
- слишком большого количества blue;
- маленького текста;
- десятков badges;
- огромного количества borders;
- emoji как основных UI icons.

Использовать существующий icon library проекта
(Lucide и т.п.).

====================================================
19. ANIMATIONS
====================================================

Использовать очень аккуратно.

Если Framer Motion уже установлен:
- fade/slide sections;
- gallery hover;
- program card hover;
- smooth modal;
- sticky nav transition.

Не добавлять animation library,
если её нет.

Animation должна быть subtle.

====================================================
20. MOBILE
====================================================

Обязательно проверить:

375px
390px
430px
768px
1024px
1440px+

На mobile:

Hero photo
↓
University title
↓
Quick facts horizontal
↓
Sticky navigation
↓
Overview
↓
Programs
↓
Requirements
↓
Cost
↓
Scholarships
↓
Campus
↓
Videos
↓
Related universities
↓
Sticky CTA

Не должно быть horizontal page overflow.

Program cards:
1 column.

Gallery:
mobile-friendly carousel/grid.

====================================================
21. DATA QUALITY
====================================================

Это критически важно.

Никогда не показывать:

undefined
null
NaN
$0
0 рейтинг
пустые badges
пустые sections

Использовать conditional rendering.

Например:

if (!university.scholarships?.length)
  section не показываем.

Если image URL broken:
fallback.

Если university logo отсутствует:
использовать initials/logo placeholder.

====================================================
22. PERFORMANCE
====================================================

Страница должна загружаться быстро.

Использовать:

Next/Image
proper sizes
lazy loading
optimized thumbnails
dynamic video loading

Hero image можно priority.

Остальные gallery images НЕ priority.

Не загружать одновременно 20 больших campus images.

Первые изображения показывать сразу,
остальные после открытия gallery.

====================================================
23. SEO
====================================================

Для university page использовать:

title:
Zhejiang University — программы, стоимость и поступление | ZagranEasy

description:
Информация о Zhejiang University: программы обучения,
стоимость, требования, гранты и условия поступления.

OpenGraph:
university cover image.

Использовать dynamic metadata,
если проект уже использует Next.js generateMetadata.

====================================================
24. COMPONENT ARCHITECTURE
====================================================

Не писать всю страницу в одном page.tsx.

Разделить примерно:

UniversityHero
UniversityGallery
UniversityQuickFacts
UniversityNavigation
UniversityOverview
UniversityPrograms
ProgramCard
ProgramDetails
UniversityAdmission
UniversityTuition
UniversityScholarships
UniversityCampus
UniversityVideos
UniversityLocation
UniversityManagerPanel
UniversityCTA
RelatedUniversities

Создать reusable components.

Не переусложнять abstraction.

====================================================
25. DATABASE
====================================================

Сначала изучить существующую schema.

Не создавать дубликаты существующих полей.

Проверить:

universities
programs
university_programs
scholarships
applications
clients/students
documents

Если gallery/videos отсутствуют,
предложить migration.

Предпочтительная структура:

university_images

id uuid
university_id uuid FK
image_url text
caption text
category text
sort_order integer
is_cover boolean
created_at timestamptz

university_videos

id uuid
university_id uuid FK
title text
description text
video_url text
thumbnail_url text
type text
sort_order integer
is_featured boolean
created_at timestamptz

Но перед SQL обязательно проверить,
нет ли уже аналогичных таблиц.

====================================================
26. HTTPS IMAGES
====================================================

Все фотографии университетов должны использовать
нормальные HTTPS URLs.

Никаких:

localhost
http://
base64 image
случайных Google Images URLs

Хранить URL в Supabase/database.

Поддерживать внешние domains через
next.config.ts remotePatterns.

Не добавлять "*" для всех hosts без необходимости.

Если используются университетские официальные CDN,
добавлять конкретные hosts.

====================================================
27. FINAL RESULT
====================================================

В результате university page должна иметь такую структуру:

Breadcrumb

        ↓

BIG UNIVERSITY HERO
+ gallery preview

        ↓

University identity
Name / Local name
Country / City
Ranking
Type
Actions

        ↓

Quick Facts

        ↓

Sticky navigation

        ↓

Overview

        ↓

PROGRAMS
один из самых важных блоков

        ↓

Admission Requirements

        ↓

Tuition & Costs

        ↓

Scholarships

        ↓

Campus & Dormitory Gallery

        ↓

VIDEOS

        ↓

Location

        ↓

Related Universities

        ↓

CTA

====================================================
ПОРЯДОК РАБОТЫ
====================================================

Не переписывай всё вслепую.

ШАГ 1:
Изучи текущую university detail page.

ШАГ 2:
Найди существующие:
- components
- types
- API
- DTO
- university schema
- program schema
- images fields
- manager/client relation.

ШАГ 3:
Напиши короткий audit:
- что уже есть;
- что можно переиспользовать;
- каких данных не хватает;
- какие DB изменения действительно нужны.

ШАГ 4:
Реализуй новый UI university detail page.

ШАГ 5:
Подключи реальные существующие API данные.

ШАГ 6:
Добавь gallery/video support только там,
где это можно сделать без нарушения существующей schema.

ШАГ 7:
Проверь TypeScript:
npm run typecheck / tsc --noEmit

ШАГ 8:
Проверь build.

ШАГ 9:
Проверь responsive.

ШАГ 10:
В конце дай отчет:

1. Какие файлы изменены
2. Какие components созданы
3. Какие API использованы
4. Какие поля БД использованы
5. Какие данные пока отсутствуют
6. Нужна ли SQL migration
7. Что осталось следующим этапом

ВАЖНО:
не использовать mock data там, где API уже существует.
Не удалять существующую рабочую функциональность.
Не ломать manager/student flows.
Не менять backend contracts без необходимости.
Сначала понять текущую архитектуру, потом менять код.