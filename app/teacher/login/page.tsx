import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function TeacherLoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-100 px-4 py-12">
      <Suspense>
        <LoginForm 
          title="Кабинет преподавателя" 
          subtitle="Вход для учителей ZagranEasy." 
          defaultNext="/teacher" 
          accent="primary" 
        />
      </Suspense>
    </div>

  );
}
