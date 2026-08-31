import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function AccountLoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-100 px-4 py-12">
      <Suspense>
        <LoginForm title="Кабинет студента" subtitle="Войдите, чтобы отслеживать заявку на поступление." defaultNext="/account" />
      </Suspense>
    </div>
  );
}
