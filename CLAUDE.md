@AGENTS.md
# ZagranEasy — Teacher Dashboard

## Задача

Добавить панель учителя в существующий Next.js проект (zagraneasy).
Учитель заходит через teacher.zagraneasy.kz (для разработки: localhost:3000/teacher).
Данные из Supabase (таблицы уже созданы: profiles, students, teachers,
scheduled_lessons, tasks, task_attempts, assignments).

## Шаг 1: Реорганизация маршрутов

Текущая структура app/ → переделать в route groups:

```
app/
  (public)/                  ← публичный сайт zagraneasy.kz
    layout.tsx               ← navbar + footer + WhatsApp
    page.tsx                 ← главная
    education/
    tours/
    ...

  (teacher)/                 ← teacher.zagraneasy.kz
    layout.tsx               ← teacher sidebar + auth guard
    page.tsx                 ← teacher dashboard
    students/
      page.tsx               ← список моих учеников
      [id]/
        page.tsx             ← профиль ученика
    lessons/
      page.tsx               ← мои уроки (расписание)
      new/
        page.tsx             ← создать урок
      [id]/
        page.tsx             ← детали урока
    assignments/
      page.tsx               ← задания на проверку
      [id]/
        page.tsx             ← проверить задание
    materials/
      page.tsx               ← мои материалы

  (admin)/                   ← admin.zagraneasy.kz (потом)
    layout.tsx
    page.tsx
```

## Шаг 2: Middleware для субдоменов

Создай middleware.ts в корне проекта:

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const pathname = request.nextUrl.pathname

  // Для разработки: /teacher/* → teacher routes
  // Для прода: teacher.zagraneasy.kz → teacher routes
  if (hostname.startsWith('teacher.') || pathname.startsWith('/teacher')) {
    // Rewrite to (teacher) route group
    const teacherPath = pathname.startsWith('/teacher')
      ? pathname.replace('/teacher', '')
      : pathname
    return NextResponse.rewrite(
      new URL(`/teacher${teacherPath || '/'}`, request.url)
    )
  }

  if (hostname.startsWith('admin.') || pathname.startsWith('/admin')) {
    const adminPath = pathname.startsWith('/admin')
      ? pathname.replace('/admin', '')
      : pathname
    return NextResponse.rewrite(
      new URL(`/admin${adminPath || '/'}`, request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

Для разработки используй: http://localhost:3000/teacher

## Шаг 3: Teacher Layout с Auth Guard

```
app/(teacher)/layout.tsx:

- Проверить Supabase auth session
- Если нет сессии → redirect на /teacher/login
- Если role !== 'teacher' → redirect на /
- Sidebar навигация:
  📊 Dashboard       /teacher
  👥 Мои ученики     /teacher/students
  📚 Уроки          /teacher/lessons
  📝 Задания        /teacher/assignments
  📁 Материалы      /teacher/materials
  👤 Профиль        /teacher/profile

- Дизайн: sidebar 240px слева (серый), контент справа
- Mobile: hamburger → slide drawer
- Header: "Панель преподавателя" + имя + аватар + logout
```

## Шаг 4: Teacher Dashboard (главная)

```
URL: /teacher (localhost:3000/teacher)

Запросы к Supabase:
- Кол-во учеников: SELECT COUNT(*) FROM students WHERE teacher_id = {myId}
- Уроки сегодня: SELECT * FROM scheduled_lessons WHERE teacher_id = {myId}
  AND scheduled_at::date = CURRENT_DATE
- На проверку: SELECT COUNT(*) FROM task_attempts WHERE status = 'pending_review'
  AND reviewed_by IS NULL AND task_id IN (SELECT id FROM tasks WHERE ...)
- Ближайший урок: SELECT * FROM scheduled_lessons WHERE teacher_id = {myId}
  AND scheduled_at > now() ORDER BY scheduled_at LIMIT 1

Layout (4 stat карточки + список):

┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ 👥 12       │ │ 📚 3        │ │ 📝 8        │ │ 🔥 94%      │
│ Учеников    │ │ Уроков      │ │ На проверку │ │ Посещаемость│
│             │ │ сегодня     │ │             │ │             │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘

Ближайший урок:
┌────────────────────────────────────────────────┐
│  HSK Listening — Level 3                       │
│  Сегодня, 18:00 · 5 учеников                  │
│  [Начать урок]  [Материалы]                    │
└────────────────────────────────────────────────┘

Задания на проверку (последние 5):
┌────────────────────────────────────────────────┐
│ Айгерим К. · IELTS Writing Task 2 · 2 часа    │
│ Данияр М. · HSK Writing · 5 часов              │
│ ...                                            │
│ [Все задания →]                                │
└────────────────────────────────────────────────┘
```

## Шаг 5: Создание урока

```
URL: /teacher/lessons/new

Форма:
  Название урока:     [HSK Listening — Level 3          ]
  Описание:           [textarea                          ]
  Дата и время:       [date picker] [time picker]
  Длительность:       [60 мин ▼]
  Ученики:            [multiselect из моих учеников]
  Ссылка Zoom/Meet:   [https://...                       ]
  Материалы:          [Upload files] (PDF, PPTX, images)
  Домашнее задание:   [Выбрать задания из банка]

  [Создать урок]

При сохранении:
  1. INSERT INTO scheduled_lessons (...)
  2. Для каждого ученика → INSERT INTO notifications
  3. Redirect на /teacher/lessons/{id}

Supabase:
  INSERT INTO scheduled_lessons (
    teacher_id, student_ids, title, description,
    scheduled_at, duration_minutes, meeting_url,
    materials, homework_task_ids, status
  ) VALUES (...)
```

## Шаг 6: Проверка Writing/Speaking

```
URL: /teacher/assignments/{attempt_id}

Запрос:
  SELECT ta.*, t.question, t.type, p.first_name, p.last_name
  FROM task_attempts ta
  JOIN tasks t ON ta.task_id = t.id
  JOIN profiles p ON ta.student_id = p.id
  WHERE ta.id = {attempt_id}

Layout:
┌─────────────────────────────────────────────┐
│ Ученик: Айгерим К.                          │
│ Задание: IELTS Writing Task 2               │
│ Тема: "Education should be free"            │
│                                              │
│ Ответ ученика:                               │
│ ┌──────────────────────────────────────────┐ │
│ │ In today's world, education plays a...   │ │
│ │ (полный текст essay)                     │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ Оценка:        [__] / 9.0                    │
│ Комментарий:   [textarea]                    │
│ Ошибки:        [textarea]                    │
│ Рекомендации:  [textarea]                    │
│                                              │
│ [Отправить оценку]                           │
└─────────────────────────────────────────────┘

При сохранении:
  UPDATE task_attempts SET
    reviewed_by = {teacherId},
    review_score = {score},
    review_comment = {comment},
    review_errors = {errors},
    reviewed_at = now(),
    status = 'reviewed'
  WHERE id = {attemptId}

  + INSERT INTO notifications (user_id = student_id, ...)
  + UPDATE students SET total_tasks_completed = total_tasks_completed + 1
  + INSERT INTO xp_log (student_id, amount: 30, source: 'task')
```

## Шаг 7: Список учеников

```
URL: /teacher/students

Запрос:
  SELECT s.*, p.first_name, p.last_name, p.avatar_url, g.exam_type,
    g.current_score, g.target_score, g.progress
  FROM students s
  JOIN profiles p ON s.id = p.id
  LEFT JOIN goals g ON s.id = g.student_id AND g.status = 'active'
  WHERE s.teacher_id = {myId}

Карточки учеников (grid 2×N):
┌─────────────────────────────────┐
│ 👤 Айгерим К.                   │
│ Цель: IELTS 7.5                 │
│ Сейчас: 6.5 · Прогресс: 72%     │
│ ████████████░░░░░ 72%           │
│ Streak: 🔥 12 · XP: 2,450       │
│ [Подробнее →]                   │
└─────────────────────────────────┘
```

## Дизайн-токены (Teacher Dashboard)

```
Sidebar:          bg-slate-900, text-white
Sidebar active:   bg-blue-600 rounded-lg
Content bg:       bg-slate-50
Cards:            bg-white, border border-slate-200, rounded-xl
Stat cards:       p-5, icon left, number big, label small
Buttons primary:  bg-blue-600 text-white rounded-lg
Buttons ghost:    text-blue-600 hover:bg-blue-50
Font:             Inter (same as main site)
```

## Как запустить (для разработки)

```bash
cd ~/projects/zagraneasy-fix
npm run dev
# Открой http://localhost:3000/teacher
```

Для теста создай тестового учителя в Supabase:
```sql
-- 1. Создай пользователя через Supabase Auth Dashboard
-- 2. Обнови его профиль:
UPDATE profiles SET role = 'teacher' WHERE id = '{user_id}';
INSERT INTO teachers (id, specializations, bio)
VALUES ('{user_id}', ARRAY['ielts','hsk'], 'Test teacher');
```

## Промпт для Claude Code

```
@TEACHER_DASHBOARD_PROMPT.md

Добавь Teacher Dashboard в существующий Next.js проект.
1. Реорганизуй app/ в route groups: (public) и (teacher)
2. Создай middleware.ts для /teacher маршрутов
3. Создай layout для teacher с sidebar навигацией
4. Dashboard: 4 stat карточки + ближайший урок + задания на проверку
5. Создание урока: форма с datepicker, multiselect учеников
6. Список учеников с прогрессом
7. Все данные из Supabase

Supabase уже настроена. Таблицы: profiles, students, teachers,
scheduled_lessons, tasks, task_attempts, assignments.
```