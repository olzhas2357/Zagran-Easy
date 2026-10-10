import { getCurrentUser } from "@/lib/account-data";
import { StudentSidebar } from "@/components/account/StudentSidebar";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSessionUser, getToken } from "@/lib/session-data";

export default async function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSessionUser();
  if (!session && await getToken()) {
    redirect("/auth/session-expired?login=/account/login&next=/account");
  }
  const user = await getCurrentUser();

  // Страница логина сама решает, что показывать неавторизованным
  if (!user) return <>{children}</>;

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-ze-surface md:flex-row">
      <StudentSidebar email={user.email} />
      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
