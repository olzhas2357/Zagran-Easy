import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function TeacherLoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-ze-navy px-4 py-16">
      <Suspense>
        <LoginForm title="Кабинет преподавателя" subtitle="Вход для учителей ZagranEasy." defaultNext="/teacher" accent="navy" />
      </Suspense>
    </div>
  );
}
