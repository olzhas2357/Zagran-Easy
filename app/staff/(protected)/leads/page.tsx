import { getLeadsForAdmin } from "@/lib/staff-data";
import { LeadsBoard } from "@/components/staff/LeadsBoard";

export default async function StaffLeadsPage() {
  const leads = await getLeadsForAdmin();

  return (
    <div className="p-6 sm:p-9">
      <h1 className="text-[25px] font-extrabold tracking-tight sm:text-[34px]">Заявки студентов</h1>
      <p className="mt-2 text-[14px] text-ze-muted">Лиды из квиза, форм и WhatsApp — статус и история по каждому.</p>

      <LeadsBoard leads={leads} />
    </div>
  );
}
