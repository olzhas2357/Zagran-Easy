import { notFound } from "next/navigation";
import { ClientForm } from "@/components/staff/ClientForm";
import { getClient } from "@/lib/staff-data";

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await getClient(id);
  if (!client) notFound();
  return <div className="p-5 sm:p-9"><h1 className="text-[25px] font-extrabold tracking-tight sm:text-[34px]">Редактирование клиента</h1><p className="mt-2 text-[14px] text-ze-muted">Контакты, квалификация и следующее действие.</p><div className="mt-6"><ClientForm initial={client} /></div></div>;
}
