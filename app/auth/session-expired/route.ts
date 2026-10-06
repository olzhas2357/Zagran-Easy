import { NextResponse, type NextRequest } from "next/server";

const LOGIN_PATHS = new Set(["/account/login", "/teacher/login", "/staff/login", "/parents/login", "/admin/login"]);

function safeInternalPath(value: string | null, fallback: string) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : fallback;
}

export function GET(request: NextRequest) {
  const loginPath = safeInternalPath(request.nextUrl.searchParams.get("login"), "/account/login");
  const destination = LOGIN_PATHS.has(loginPath) ? loginPath : "/account/login";
  const url = new URL(destination, request.url);
  const next = request.nextUrl.searchParams.get("next");

  url.searchParams.set("reason", "session_expired");
  if (next) url.searchParams.set("next", safeInternalPath(next, "/"));

  const response = NextResponse.redirect(url);
  response.cookies.delete("ze_session");
  return response;
}
