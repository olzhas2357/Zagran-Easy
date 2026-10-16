import { ChecklistsEditor } from "@/components/admin/ChecklistsEditor";
import { parseMonth } from "@/lib/checklist-month";
import { getManagerChecklists } from "@/lib/staff-data";

export default async function AdminChecklistsPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const month = parseMonth((await searchParams).month);
  const checklists = await getManagerChecklists(month);
  return <div className="p-5 sm:p-9"><h1 className="text-[25px] font-extrabold tracking-tight sm:text-[34px]">Чек-листы менеджеров</h1><p className="mt-2 mb-6 text-[14px] text-ze-muted">Задачи на месяц, что говорить и делать. Менеджеры видят их на главной странице.</p><ChecklistsEditor key={month} month={month} checklists={checklists} /></div>;
}
