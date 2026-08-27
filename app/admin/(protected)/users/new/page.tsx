import Link from "next/link";
import { UserForm } from "@/components/admin/UserForm";

export default function NewUserPage() {
  return (
    <div className="p-6">
      <Link href="/admin/users" className="text-[13.5px] font-semibold text-blue-600 hover:underline">
        ← Пользователи
      </Link>
      <h1 className="mt-3 text-[22px] font-extrabold tracking-tight text-slate-900">Новый пользователь</h1>
      <UserForm />
    </div>
  );
}
