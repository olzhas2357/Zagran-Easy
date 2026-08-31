"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "./SiteHeader";
import { WhatsAppButton } from "./WhatsAppButton";
import { AuthProvider } from "@/lib/auth-context";

// Админ-панель, кабинет менеджера и кабинет преподавателя ведут свою навигацию
// и хедер (см. их layout.tsx), поэтому публичный SiteHeader/WhatsApp там не показываются.
// AuthProvider (localStorage-токен + /auth/me) нужен только /admin — /staff и /teacher
// используют серверную сессию (httpOnly cookie, см. lib/session.ts), а на публичных
// страницах он лишь лишний клиентский запрос при каждой загрузке.
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isDashboard = isAdmin || pathname?.startsWith("/staff") || pathname?.startsWith("/teacher");

  const content = (
    <>
      {!isDashboard && <SiteHeader />}
      <main className="flex flex-1 flex-col">{children}</main>
      {!isDashboard && <WhatsAppButton />}
    </>
  );

  return isAdmin ? <AuthProvider>{content}</AuthProvider> : content;
}
