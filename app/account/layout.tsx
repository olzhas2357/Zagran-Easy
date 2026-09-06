import { getCurrentUser } from "@/lib/account-data";
import { StudentHeader } from "@/components/account/StudentHeader";
import type { ReactNode } from "react";

export default async function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
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