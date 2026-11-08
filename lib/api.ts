// ============================================================
// ZagranEasy — клиент для NestJS API (админ-панель).
// Публичный каталог также идёт через NestJS — см. lib/data.ts.
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

interface ApiCacheOptions {
  revalidate?: number | false;
  tags?: string[];
  cache?: "no-store";
}

interface ApiOptions extends ApiCacheOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
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
  const { method = "GET", body, token, revalidate, tags, cache } = options;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // Кэш opt-in: отсутствие Authorization не означает отсутствие персональных данных.
  const cacheInit: RequestInit = token || method !== "GET" || cache === "no-store" || revalidate === 0 || (revalidate === undefined && !tags?.length)
    ? { cache: "no-store" }
    : { ...(revalidate === undefined ? { cache: "force-cache" as const } : {}), next: { revalidate, tags } };

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

export const apiGet = <T>(path: string, token?: string | null, cacheOptions?: ApiCacheOptions) =>
  api<T>(path, { token, ...cacheOptions });

export const apiPost = <T>(path: string, body: unknown, token?: string | null) =>
  api<T>(path, { method: "POST", body, token });

export const apiPatch = <T>(path: string, body: unknown, token?: string | null) =>
  api<T>(path, { method: "PATCH", body, token });

export const apiDelete = <T>(path: string, token?: string | null) => api<T>(path, { method: "DELETE", token });
