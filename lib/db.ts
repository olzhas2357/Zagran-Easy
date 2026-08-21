import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "";

// Клиент для браузера (публичные данные)
export const supabase = createClient(supabaseUrl, supabaseKey);

// Флаг: используем Supabase или локальные данные
export const USE_DB = Boolean(supabaseUrl && supabaseKey);
