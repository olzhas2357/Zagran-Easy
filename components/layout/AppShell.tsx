"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "./SiteHeader";
import { WhatsAppButton } from "./WhatsAppButton";
import { AuthProvider } from "@/lib/auth-context";

// Админ-панель ведёт свою навигацию и хедер (см. app/admin/(protected)/layout.tsx),
// поэтому публичный SiteHeader/WhatsApp на /admin/* не показываются.
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <AuthProvider>
      {!isAdmin && <SiteHeader />}
      <main className="flex flex-1 flex-col">{children}</main>
      {!isAdmin && <WhatsAppButton />}
    </AuthProvider>
  );
}
