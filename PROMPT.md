Ты работаешь с уже существующим проектом ZagranEasy.

ВАЖНО:
Это НЕ новый проект и НЕ нужно переписывать приложение с нуля.
Сначала изучи существующую архитектуру, страницы, компоненты, API, модели БД,
авторизацию и роли. После этого расширяй текущую систему минимальными
и безопасными изменениями.

Главная задача следующего этапа:
улучшить существующую образовательную часть ZagranEasy для студентов
и преподавателей.

Нужно развить 5 связанных направлений:

1. Student Learning
2. Teacher Workspace
3. Assignments / Homework
4. Gamification & Progress
5. Live Lessons через LiveKit

────────────────────────────
1. STUDENT
────────────────────────────

Доработать существующий Student Cabinet.

Не создавать отдельное приложение.

Student Dashboard должен постепенно объединить:

• ближайший урок;
• расписание;
• текущий курс;
• преподавателя;
• задания;
• домашние работы;
• дедлайны;
• материалы;
• прогресс;
• XP;
• level;
• streak;
• achievements.

Главная страница студента должна сразу отвечать:

— Когда следующий урок?
— Что мне нужно выполнить?
— Есть ли просроченные задания?
— Какой у меня прогресс?
— Как продолжить обучение?

Основные CTA:

[Присоединиться к уроку]
[Продолжить задание]
[Посмотреть расписание]

────────────────────────────
2. TEACHER
────────────────────────────

Доработать существующий Teacher Cabinet.

Teacher Dashboard:

• сегодняшние уроки;
• ближайшие занятия;
• группы;
• студенты;
• задания на проверку;
• просроченные проверки;
• быстрый запуск Live Lesson;
• прогресс студентов.

Teacher не должен переходить через множество страниц,
чтобы провести обычный урок.

Например:

Сегодня

10:00 — English B1
8 студентов

[Начать урок]

12:00 — IELTS
4 студента

[Открыть урок]

────────────────────────────
3. ASSIGNMENTS / HOMEWORK
────────────────────────────

Расширить существующую систему assignments.

Teacher может создавать:

TEXT
QUIZ
FILE
ESSAY
SPEAKING
LISTENING

Assignment:

title
description
course
lesson
students/group
type
deadline
points
attachments
status

Student может:

• открыть задание;
• выполнить;
• сохранить draft;
• прикрепить файл;
• написать ответ;
• записать speaking;
• отправить работу.

Статусы:

DRAFT
ASSIGNED
IN_PROGRESS
SUBMITTED
REVIEWED
RETURNED
COMPLETED
OVERDUE

Teacher после отправки видит submission и может:

• поставить score;
• написать feedback;
• вернуть на исправление;
• подтвердить выполнение.

────────────────────────────
4. GAMIFICATION
────────────────────────────

Добавить мотивационную систему, но не превращать интерфейс
в детскую игру.

Использовать:

XP
LEVEL
STREAK
ACHIEVEMENTS
WEEKLY GOALS

Пример Student Dashboard:

Level 7

1840 / 2000 XP
████████████████░░

🔥 12 day streak

Weekly goal
4 / 5 activities

Achievements:
First Lesson
7 Day Streak
10 Homework
Speaking Master
Perfect Week

XP должен начисляться сервером, а не frontend.

Пример:

lesson completed → XP
homework completed → XP
weekly goal completed → XP
speaking practice → XP

Не позволять frontend самостоятельно отправлять количество XP,
иначе систему можно будет легко накрутить.

Создать историю XP transactions.

────────────────────────────
5. LIVEKIT
────────────────────────────

Не создавать LiveKit как отдельный продукт.

Интегрировать Live Lesson в существующую модель lesson.

Lesson:

lesson
    ↓
Live Room
    ↓
Activities
    ↓
Homework
    ↓
Feedback
    ↓
Progress

На странице урока:

┌─────────────────────────────────────────┐
│ Course / Lesson            Timer        │
├──────────────────────┬──────────────────┤
│                      │ Teacher Video    │
│                      │                  │
│ Board / Material     ├──────────────────┤
│                      │ Students         │
│                      │                  │
├──────────────────────┴──────────────────┤
│ Mic Camera Share Board Chat Materials  │
└─────────────────────────────────────────┘

Использовать LiveKit для:

• audio/video;
• screen sharing;
• participants;
• realtime presence;
• chat;
• realtime lesson events.

Предусмотреть возможность позже добавить:

• collaborative whiteboard;
• quiz внутри урока;
• polls;
• hand raise;
• reactions;
• vocabulary exercises.

────────────────────────────
6. LESSON ACTIVITIES
────────────────────────────

Заложить универсальную модель Activity.

Например:

QUIZ
POLL
VOCABULARY
TEXT
SPEAKING
WHITEBOARD

Teacher во время Live Lesson может отправить activity студентам.

Пример:

Teacher:
[Send Quiz]

Student:

Choose the correct answer:

Opportunity means:

○ проблема
● возможность
○ решение

Teacher realtime:

7 / 9 answered
6 correct
1 incorrect

Результаты сохраняются после урока.

────────────────────────────
7. LESSON COMPLETION
────────────────────────────

После завершения Live Lesson:

сохранить:

• attendance;
• start time;
• end time;
• participants;
• activities;
• teacher notes;
• lesson status.

Teacher получает экран:

Lesson completed

Attendance: 8/9
Activities: 4
Homework: not assigned

[Create Homework]
[Add Notes]
[Finish Lesson]

После этого информация появляется Student Dashboard.

────────────────────────────
8. DATABASE
────────────────────────────

НЕ изменять существующие таблицы вслепую.

Сначала проанализировать текущую Supabase/PostgreSQL schema.

Проверить существующие:

users
students
teachers
courses
lessons
assignments
schedules

и связанные таблицы.

Только после анализа предложить необходимые migrations.

Предположительно могут понадобиться:

assignment_submissions
lesson_participants
lesson_activities
activity_responses
student_progress
xp_transactions
achievements
student_achievements
student_streaks

Но если аналогичная сущность уже существует —
использовать существующую.

НЕ создавать дублирующие таблицы.

────────────────────────────
9. BACKEND
────────────────────────────

Использовать существующий NestJS backend.

Business logic должна находиться на backend.

Frontend НЕ должен:

• начислять XP;
• определять completion;
• выдавать achievements;
• создавать LiveKit access token самостоятельно;
• самостоятельно менять attendance.

Backend должен валидировать роль:

STUDENT
TEACHER
MANAGER
ADMIN

Teacher может управлять только своими уроками/группами.

Student имеет доступ только к своим данным.

────────────────────────────
10. FRONTEND
────────────────────────────

Использовать существующий Next.js frontend и текущую design system.

НЕ создавать новый визуальный стиль.

Переиспользовать:

buttons
cards
modals
inputs
layout
sidebar
navigation
typography
colors

Новые страницы должны выглядеть частью существующего ZagranEasy.

────────────────────────────
11. IMPLEMENTATION ORDER
────────────────────────────

Не реализовывать всё одновременно.

Работать этапами.

PHASE 1
Провести audit существующего проекта:

• frontend routes;
• student pages;
• teacher pages;
• existing components;
• backend modules;
• database schema;
• assignment logic;
• lesson logic;
• authentication/roles.

После audit написать:

CURRENT STATE
WHAT ALREADY EXISTS
WHAT CAN BE REUSED
WHAT IS MISSING
WHAT SHOULD BE CHANGED

Ничего не удалять и не переписывать без необходимости.

PHASE 2
Assignments + Homework.

PHASE 3
Student Progress + Gamification.

PHASE 4
Teacher improvements.

PHASE 5
LiveKit Lesson Room.

PHASE 6
Realtime Activities.

PHASE 7
Analytics / AI Teacher Assistant.

────────────────────────────
FINAL RULE
────────────────────────────

Главный принцип разработки:

EXTEND → REUSE → IMPROVE

а не:

REWRITE → REPLACE.

Перед каждым большим изменением сначала показать:

1. какие существующие файлы будут использованы;
2. какие файлы будут изменены;
3. какие новые файлы нужны;
4. какие API endpoints изменятся/добавятся;
5. нужны ли database migrations;
6. какие существующие функции могут сломаться.

После этого приступать к реализации.