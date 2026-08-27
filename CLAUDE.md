# ZagranEasy Web — Backend Connection + Admin Dashboard

## Архитектура

```
Next.js (port 3000)          NestJS (port 4000)         Supabase
┌────────────────┐           ┌──────────────┐           ┌──────────┐
│ (public)/      │──каталог──→│              │           │          │
│   education    │  напрямую  │              │           │ PostgreSQL│
│   tours, etc.  │──────────→ │  Supabase    │──────────→│ Auth     │
│                │           │              │           │ Storage  │
│ (admin)/       │──users───→│  /api/v1/*   │──────────→│          │
│   dashboard    │  через    │              │           │          │
│   users        │  NestJS   │              │           │          │
│   students     │           │              │           │          │
│                │           │              │           │          │
│ (teacher)/     │──lessons─→│              │           │          │
│   dashboard    │  через    │              │           │          │
│   assignments  │  NestJS   │              │           │          │
└────────────────┘           └──────────────┘           └──────────┘

Правило:
  Публичные данные (каталог вузов, туры) → Supabase напрямую (быстрее)
  Приватные данные (users, progress, CRM) → через NestJS API (безопаснее)
```

## Шаг 1: API Client (lib/api.ts)

Создай в Next.js проекте:

```typescript
// lib/api.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: any;
  token?: string;
}

interface ApiResponse<T = any> {
  data: T;
  error?: string;
  total?: number;
}

export async function api<T = any>(
  path: string,
  options: ApiOptions = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      cache: 'no-store',
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null as any, error: json.message || 'Ошибка сервера' };
    }

    return json;
  } catch (err) {
    return { data: null as any, error: 'Нет подключения к серверу' };
  }
}

// Shorthand functions
export const apiGet = <T>(path: string, token?: string) =>
  api<T>(path, { token });

export const apiPost = <T>(path: string, body: any, token?: string) =>
  api<T>(path, { method: 'POST', body, token });

export const apiPatch = <T>(path: string, body: any, token?: string) =>
  api<T>(path, { method: 'PATCH', body, token });

export const apiDelete = <T>(path: string, token?: string) =>
  api<T>(path, { method: 'DELETE', token });
```

## Шаг 2: Auth Context (lib/auth-context.tsx)

```typescript
// lib/auth-context.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from './api';

interface User {
  id: string;
  email: string;
  profile: {
    full_name: string;
    role: 'admin' | 'teacher' | 'student' | 'parent' | 'manager';
    phone: string | null;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
  isAdmin: boolean;
  isTeacher: boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('ze_token');
    if (saved) {
      setToken(saved);
      fetchMe(saved);
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchMe(t: string) {
    const res = await api('/auth/me', { token: t });
    if (res.data && !res.error) {
      setUser(res.data);
      setToken(t);
    } else {
      localStorage.removeItem('ze_token');
      setToken(null);
    }
    setLoading(false);
  }

  async function login(email: string, password: string) {
    const res = await api('/auth/login', {
      method: 'POST',
      body: { email, password },
    });

    if (res.error) return { error: res.error };

    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem('ze_token', newToken);
    setToken(newToken);
    setUser(newUser);
    return {};
  }

  function logout() {
    localStorage.removeItem('ze_token');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{
      user, token, loading, login, logout,
      isAdmin: user?.profile?.role === 'admin',
      isTeacher: user?.profile?.role === 'teacher',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

## Шаг 3: .env.local

```
# Публичные данные (каталог) — напрямую
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# Приватные данные (users, CRM) — через NestJS
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

## Шаг 4: Структура файлов Admin

```
app/
  (public)/                    ← публичный сайт (уже есть)
    layout.tsx
    page.tsx
    education/
    tours/

  (admin)/                     ← admin панель
    layout.tsx                 ← sidebar + auth guard (role=admin)
    login/
      page.tsx                 ← /admin/login
    page.tsx                   ← /admin (dashboard)
    users/
      page.tsx                 ← /admin/users (список)
      new/
        page.tsx               ← /admin/users/new (создать)
      [id]/
        page.tsx               ← /admin/users/:id (профиль)
    students/
      page.tsx                 ← /admin/students
      [id]/
        page.tsx               ← /admin/students/:id
    teachers/
      page.tsx                 ← /admin/teachers
    leads/
      page.tsx                 ← /admin/leads (CRM)
      [id]/
        page.tsx
    courses/
      page.tsx                 ← /admin/courses
      new/
        page.tsx
    payments/
      page.tsx                 ← /admin/payments
    analytics/
      page.tsx                 ← /admin/analytics

  components/
    admin/
      AdminSidebar.tsx
      AdminHeader.tsx
      StatsCard.tsx
      DataTable.tsx            ← переиспользуемая таблица
      UserForm.tsx
      ConfirmModal.tsx
```

## Шаг 5: Admin Layout

```
app/(admin)/layout.tsx

Проверка авторизации:
  1. useAuth() → если loading → показать spinner
  2. Если нет user → redirect на /admin/login
  3. Если role !== 'admin' && role !== 'manager' → показать "Нет доступа"
  4. Если всё ок → показать layout с sidebar

Layout:
┌──────────────────────────────────────────────────────┐
│ Header: "ZagranEasy Admin" │ Поиск │ 🔔 │ 👤 Admin │
├──────────────┬───────────────────────────────────────┤
│              │                                       │
│  Sidebar     │  Content (children)                   │
│  240px       │                                       │
│              │                                       │
│  📊 Dashboard│                                       │
│  👥 Пользов. │                                       │
│  🎓 Студенты │                                       │
│  👨‍🏫 Учителя  │                                       │
│  📋 Заявки   │                                       │
│  📚 Курсы    │                                       │
│  💳 Оплаты   │                                       │
│  📈 Аналитика│                                       │
│              │                                       │
│  ──────────  │                                       │
│  ⚙️ Настройки│                                       │
│  🚪 Выход    │                                       │
│              │                                       │
└──────────────┴───────────────────────────────────────┘

Sidebar:
  bg-slate-900, text-white
  Active item: bg-blue-600 rounded-lg
  Hover: bg-slate-800
  Logo: "ZE" badge + "Admin Panel"
  Mobile: hamburger → drawer overlay
```

## Шаг 6: Admin Dashboard (/admin)

```
Запросы к NestJS:
  GET /api/v1/users?count=true         → totalUsers
  GET /api/v1/students?count=true      → totalStudents  
  GET /api/v1/leads?status=new&count   → newLeads
  GET /api/v1/payments?status=pending  → pendingPayments

Layout:
  4 stat карточки (top row):
  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐
  │ 👥 156    │ │ 🎓 89     │ │ 📋 12     │ │ 💰 ₸2.4M  │
  │ Пользов.  │ │ Студентов │ │ Новых     │ │ Оплачено  │
  │ +8 за нед │ │ +3 за нед │ │ заявок    │ │ за месяц  │
  └───────────┘ └───────────┘ └───────────┘ └───────────┘

  Новые заявки (таблица):
  ┌──────────────────────────────────────────────────────┐
  │ Имя         │ Услуга      │ Источник │ Дата  │       │
  │ Айгерим К.  │ Обучение    │ Квиз     │ Сегод │ [→]   │
  │ Данияр М.   │ Виза USA    │ WhatsApp │ Вчера │ [→]   │
  └──────────────────────────────────────────────────────┘

  Последние студенты:
  ┌──────────────────────────────────────────────────────┐
  │ 👤 Имя      │ Экзамен │ Прогресс │ Учитель  │       │
  │ Мадина С.   │ HSK 5   │ ██░ 45%  │ Ли Мин   │ [→]   │
  │ Арман Т.    │ IELTS 7 │ ████ 78% │ Тест У.  │ [→]   │
  └──────────────────────────────────────────────────────┘
```

## Шаг 7: Создание пользователя (/admin/users/new)

```
Форма:
  Роль:         [Student ▼] (dropdown: student/teacher/parent/manager/admin)
  
  --- При выборе роли появляются нужные поля ---

  Имя:          [___________________]
  Email:        [___________________]
  Телефон:      [+7 ___ ___ ____]
  Пароль:       [___________________] [Сгенерировать]

  --- Если Student ---
  Учитель:      [Выбрать учителя ▼] (из GET /api/v1/teachers)
  Экзамен:      [IELTS ▼] (ielts/hsk/sat)
  Текущий уровень: [___]
  Целевой уровень: [___]
  Целевой вуз:  [Поиск...] (из universities)
  Дата экзамена: [calendar]

  --- Если Teacher ---
  Специализации: [✓ IELTS] [✓ HSK] [☐ SAT]
  Bio:          [textarea]

  --- Если Parent ---
  Дети:         [Выбрать студентов ▼] (multiselect)

  [Создать пользователя]

При submit:
  POST /api/v1/users {
    email, password, full_name, role, phone,
    student_data: { teacher_id, current_exam, target_level, ... },
    teacher_data: { specializations, bio },
    parent_data: { children: [student_ids] }
  }
```

## Шаг 8: Список пользователей (/admin/users)

```
Фильтры:
  [Все ▼] [Студенты] [Учителя] [Родители] [Админы]
  [Поиск по имени или email...]

Таблица (DataTable компонент):
  ┌──────┬──────────────┬─────────────┬─────────┬──────────┬────────┐
  │      │ Имя          │ Email       │ Роль    │ Создан   │        │
  ├──────┼──────────────┼─────────────┼─────────┼──────────┼────────┤
  │ 👤   │ Тест Учитель │ teacher@..  │ teacher │ 27.08.26 │ [···]  │
  │ 👤   │ Айгерим К.   │ aigeri@..   │ student │ 25.08.26 │ [···]  │
  └──────┴──────────────┴─────────────┴─────────┴──────────┴────────┘

  [···] dropdown: Редактировать | Деактивировать | Удалить

  Pagination: < 1 2 3 ... 10 >

Запрос:
  GET /api/v1/users?role={filter}&search={query}&page=1&limit=20
```

## Шаг 9: DataTable — переиспользуемый компонент

```typescript
// components/admin/DataTable.tsx

interface Column<T> {
  key: string;
  title: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  total: number;
  page: number;
  onPageChange: (page: number) => void;
  onRowClick?: (row: T) => void;
  loading?: boolean;
}

// Использование:
<DataTable
  columns={[
    { key: 'full_name', title: 'Имя' },
    { key: 'email', title: 'Email' },
    { key: 'role', title: 'Роль', render: (row) => <RoleBadge role={row.role} /> },
    { key: 'created_at', title: 'Создан', render: (row) => formatDate(row.created_at) },
  ]}
  data={users}
  total={total}
  page={page}
  onPageChange={setPage}
  onRowClick={(user) => router.push(`/admin/users/${user.id}`)}
/>
```

## Дизайн-токены Admin Panel

```
Background:       #F8FAFC (slate-50)
Sidebar:          #0F172A (slate-900)
Sidebar active:   #1D4ED8 (blue-700) rounded-lg
Cards:            #FFFFFF, border #E2E8F0, rounded-xl, shadow-sm
Stat positive:    #10B981 (green, "+8 за неделю")
Stat negative:    #EF4444 (red, "-2")
Badge student:    bg-blue-100 text-blue-700
Badge teacher:    bg-purple-100 text-purple-700
Badge parent:     bg-amber-100 text-amber-700
Badge admin:      bg-red-100 text-red-700
Table header:     bg-slate-50, text-slate-600, text-xs uppercase
Table row hover:  bg-slate-50
Buttons:          bg-blue-600 text-white (primary), border-slate-300 (secondary)
```

## Промпт для Claude Code

```
@ADMIN_WEB_PROMPT.md

В существующем Next.js проекте (zagraneasy-fix):
1. Создай lib/api.ts — клиент для NestJS API (localhost:4000)
2. Создай lib/auth-context.tsx — AuthProvider с login/logout/useAuth
3. Оберни app/layout.tsx в AuthProvider
4. Создай app/(admin)/ route group:
   - layout.tsx с sidebar + auth guard (role=admin)
   - login/page.tsx
   - page.tsx (dashboard: 4 stat карточки + таблицы)
   - users/page.tsx (список + фильтры + DataTable)
   - users/new/page.tsx (форма создания)
   - students/page.tsx
   - leads/page.tsx
5. Создай components/admin/ — AdminSidebar, DataTable, StatsCard
6. Дизайн: slate-900 sidebar, white cards, Inter font

NestJS API на localhost:4000/api/v1
Endpoints: /auth/login, /auth/me, /users, /students, /teachers, /leads
```

## Запуск (два терминала)

```bash
# Терминал 1: NestJS backend
cd ~/projects/zagran-easy-back
npm run start:dev
# → localhost:4000

# Терминал 2: Next.js frontend
cd ~/projects/zagraneasy-fix
npm run dev
# → localhost:3000

# Открой:
# localhost:3000           → публичный сайт
# localhost:3000/admin     → admin login → dashboard
# localhost:4000/api/docs  → Swagger API документация
```