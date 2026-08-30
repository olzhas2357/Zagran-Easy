"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "./SiteHeader";
import { WhatsAppButton } from "./WhatsAppButton";
import { AuthProvider } from "@/lib/auth-context";

// Админ-панель, кабинет менеджера и кабинет преподавателя ведут свою навигацию
// и хедер (см. их layout.tsx), поэтому публичный SiteHeader/WhatsApp там не показываются.
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/admin") || pathname?.startsWith("/staff") || pathname?.startsWith("/teacher");

  return (
    <AuthProvider>
      {!isDashboard && <SiteHeader />}
      <main className="flex flex-1 flex-col">{children}</main>
      {!isDashboard && <WhatsAppButton />}
    </AuthProvider>
  );
}
