// ============================================================
// ZagranEasy — клиент для NestJS API (админ-панель).
// Публичный каталог (вузы, туры) идёт напрямую в Supabase — см. lib/data.ts.
// Приватные данные (users, students, leads, payments...) — через этот клиент.
//
// Бэкенд оборачивает каждый ответ в TransformInterceptor: { success, data }.
// Пагинированные списки — data: { data: T[], total, page, limit }.
// Ошибки — HttpExceptionFilter: { success: false, statusCode, message }.
// ============================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

// Клиентские запросы админ-панели отправляем через same-origin Route Handler.
// Остальные кабинеты вызывают api() внутри Server Actions и идут в NestJS
// напрямую. Такой прокси убирает зависимость /admin от CORS в Railway.
function getApiUrl() {
  return typeof window === "undefined" ? API_URL : "/api/backend";
}

interface ApiOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
  /** Секунд до ревалидации Next Data Cache. Игнорируется для мутаций и авторизованных запросов (всегда no-store — иначе Data Cache отдаст чужой ответ по тому же URL другому пользователю). */
  revalidate?: number;
}

export interface ApiResponse<T = unknown> {
  data: T;
  error?: string;
  status?: number;
  authExpired?: boolean;
  total?: number;
  page?: number;
  limit?: number;
}

interface Envelope {
  success: boolean;
  data?: unknown;
  message?: string | string[];
}

function isPaginated(payload: unknown): payload is { data: unknown[]; total: number; page: number; limit: number } {
  return (
    !!payload &&
    typeof payload === "object" &&
    Array.isArray((payload as Record<string, unknown>).data) &&
    typeof (payload as Record<string, unknown>).total === "number"
  );
}

export async function api<T = unknown>(path: string, options: ApiOptions = {}): Promise<ApiResponse<T>> {
  const { method = "GET", body, token, revalidate } = options;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // Авторизованные запросы и мутации — всегда no-store (Data Cache не учитывает
  // заголовок Authorization, кеш по URL мог бы отдать чужие данные). Публичный
  // каталог (без токена, GET) кешируется и ревалидируется в фоне.
  const cacheInit: RequestInit =
    token || method !== "GET" ? { cache: "no-store" } : { next: { revalidate: revalidate ?? 300 } };

  let res: Response;
  try {
    res = await fetch(`${getApiUrl()}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...cacheInit,
    });
  } catch {
    return { data: null as T, error: "Нет подключения к серверу" };
  }

  let json: Envelope;
  try {
    json = await res.json();
  } catch {
    return { data: null as T, error: "Некорректный ответ сервера" };
  }

  if (!res.ok || json.success === false) {
    const message = Array.isArray(json.message) ? json.message.join(", ") : json.message;
    const authExpired = res.status === 401;
    return {
      data: null as T,
      error: authExpired ? "Сессия истекла. Выйдите и войдите снова." : message || "Ошибка сервера",
      status: res.status,
      authExpired,
    };
  }

  if (!("data" in json)) {
    return { data: null as T, error: `Ответ API без поля data (${res.status} ${path})` };
  }

  if (isPaginated(json.data)) {
    return { data: json.data.data as T, total: json.data.total, page: json.data.page, limit: json.data.limit };
  }

  return { data: json.data as T };
}

export const apiGet = <T>(path: string, token?: string | null) => api<T>(path, { token });

export const apiPost = <T>(path: string, body: unknown, token?: string | null) =>
  api<T>(path, { method: "POST", body, token });

export const apiPatch = <T>(path: string, body: unknown, token?: string | null) =>
  api<T>(path, { method: "PATCH", body, token });

export const apiDelete = <T>(path: string, token?: string | null) => api<T>(path, { method: "DELETE", token });
