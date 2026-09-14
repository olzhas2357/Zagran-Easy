import Link from "next/link";
import { notFound } from "next/navigation";
import { ClientCostCalculator } from "@/components/staff/ClientCostCalculator";
import { getCostCalculationContext } from "@/lib/staff-data";

export default async function NewCalculationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const context = await getCostCalculationContext(id); if (!context) notFound();
  const client = context.client as Record<string, unknown>;
  return <div className="p-5 sm:p-9"><Link href={`/staff/clients/${id}`} className="text-[13px] font-semibold text-ze-muted">← К клиенту</Link><h1 className="mt-3 text-[25px] font-extrabold sm:text-[34px]">Расчёт для {String(client.full_name || "клиента")}</h1><p className="mt-2 text-sm text-ze-muted">Сохранённая версия с фиксированным курсом валюты.</p><div className="mt-5"><ClientCostCalculator clientId={id} context={context} /></div></div>;
}
