import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { UserForm } from "@/components/admin/UserForm";

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="p-5 sm:p-8">
      <Link href="/admin/users" className="flex w-fit items-center gap-1.5 text-[13.5px] font-semibold text-blue-600 hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
        Пользователи
      </Link>
      <h1 className="mt-3 text-[24px] font-extrabold tracking-tight text-slate-900 sm:text-[28px]">Редактировать пользователя</h1>
      <UserForm mode="edit" userId={id} />
    </div>
  );
}
