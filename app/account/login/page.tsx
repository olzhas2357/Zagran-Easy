import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function AccountLoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-ze-surface px-4 py-16">
      <Suspense>
        <LoginForm title="Кабинет студента" subtitle="Войдите, чтобы отслеживать заявку на поступление." defaultNext="/account" />
      </Suspense>
    </div>
  );
}
