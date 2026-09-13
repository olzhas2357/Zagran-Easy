import { getClients } from "@/lib/staff-data";
import { ClientsList } from "@/components/staff/ClientsList";
import Link from "next/link";
import { UserRoundPlus } from "lucide-react";

export default async function StaffClientsPage() {
  const clients = await getClients();

  return (
    <div className="p-5 sm:p-9">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-[25px] font-extrabold tracking-tight sm:text-[34px]">Клиенты</h1><p className="mt-2 text-[14px] text-ze-muted">Квалификация, следующий контакт и процесс поступления.</p></div><Link href="/staff/clients/new" className="flex items-center gap-2 rounded-xl bg-ze-primary px-4 py-2.5 text-[13.5px] font-semibold text-white"><UserRoundPlus className="h-4 w-4" />Создать клиента</Link></div>
      <ClientsList clients={clients} />
    </div>
  );
}
