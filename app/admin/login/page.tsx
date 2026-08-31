import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-100 px-4 py-12">
      <Suspense>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
