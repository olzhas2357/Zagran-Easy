import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "";

// Флаг: используем Supabase или локальные данные
export const USE_DB = Boolean(supabaseUrl && supabaseKey);

// createClient бросает исключение на пустом URL — а без env-переменных
// (локальная разработка, превью-деплой без секретов) это ожидаемое
// состояние, а не ошибка: приложение должно тихо уйти на seed-данные,
// а не падать на каждой странице. Поэтому клиент создаём только когда
// реально подключены, иначе — заглушка, которую USE_DB не даст вызвать.
export const supabase = USE_DB
  ? createClient(supabaseUrl, supabaseKey)
  : createClient("https://placeholder.supabase.co", "placeholder");
