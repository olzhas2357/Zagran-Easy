import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "";

// Защита /staff/* (кабинет менеджера) и /account/* (кабинет студента):
// без сессии — редирект на соответствующий /login. Роль (staff vs client)
// проверяется дальше на сервере через profiles.role — здесь только факт логина.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!supabaseUrl || !supabaseKey) return response;

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isStaffArea = pathname.startsWith("/staff") && pathname !== "/staff/login";
  const isAccountArea = pathname.startsWith("/account") && pathname !== "/account/login";
  const isTeacherArea = pathname.startsWith("/teacher") && pathname !== "/teacher/login";

  if ((isStaffArea || isAccountArea || isTeacherArea) && !user) {
    const loginPath = isStaffArea ? "/staff/login" : isTeacherArea ? "/teacher/login" : "/account/login";
    const url = request.nextUrl.clone();
    url.pathname = loginPath;
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/staff/:path*", "/account/:path*", "/teacher/:path*"],
};
