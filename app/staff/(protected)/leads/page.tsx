import { getLeadsForAdmin } from "@/lib/staff-data";
import { LeadCard } from "@/components/staff/LeadCard";

export default async function StaffLeadsPage() {
  const leads = await getLeadsForAdmin();

  return (
    <div className="p-6 sm:p-9">
      <h1 className="text-[25px] font-extrabold tracking-tight sm:text-[34px]">Заявки студентов</h1>
      <p className="mt-2 text-[14px] text-ze-muted">Лиды из квиза, форм и WhatsApp — статус и история по каждому.</p>

      <div className="mt-5 flex flex-col gap-3">
        {leads.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#D6DEEA] bg-white px-6 py-14 text-center text-[14px] text-ze-muted">
            Пока нет заявок.
          </div>
        )}
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  );
}
