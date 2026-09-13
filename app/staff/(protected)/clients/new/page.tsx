import { ClientForm } from "@/components/staff/ClientForm";

export default function NewClientPage() {
  return <div className="p-5 sm:p-9"><h1 className="text-[25px] font-extrabold tracking-tight sm:text-[34px]">Новый клиент</h1><p className="mt-2 text-[14px] text-ze-muted">Контактные данные и первичная квалификация.</p><div className="mt-6"><ClientForm /></div></div>;
}
