import { getCurrentUser } from "@/lib/account-data";
import { StudentHeader } from "@/components/account/StudentHeader";
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
    <div className="flex min-h-dvh flex-col">
      <StudentHeader email={user.email} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
