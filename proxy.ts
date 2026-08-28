import { NextResponse, type NextRequest } from "next/server";

// Защита /staff/*, /teacher/* (кабинеты сотрудников) и /account/* (кабинет
// студента): без сессии — редирект на соответствующий /login. Роль
// проверяется дальше на сервере через NestJS /auth/me — здесь только факт
// наличия токена (httpOnly-cookie, см. lib/session.ts).
export async function proxy(request: NextRequest) {
  const hasSession = Boolean(request.cookies.get("ze_session")?.value);

  const { pathname } = request.nextUrl;
  const isStaffArea = pathname.startsWith("/staff") && pathname !== "/staff/login";
  const isAccountArea = pathname.startsWith("/account") && pathname !== "/account/login";
  const isTeacherArea = pathname.startsWith("/teacher") && pathname !== "/teacher/login";

  if ((isStaffArea || isAccountArea || isTeacherArea) && !hasSession) {
    const loginPath = isStaffArea ? "/staff/login" : isTeacherArea ? "/teacher/login" : "/account/login";
    const url = request.nextUrl.clone();
    url.pathname = loginPath;
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/staff/:path*", "/account/:path*", "/teacher/:path*"],
};
