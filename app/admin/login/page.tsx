import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-slate-100 px-4 py-16">
      <Suspense>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
