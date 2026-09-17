import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarClock, Mail, MapPin, Phone, UserRound, Pencil, Landmark } from "lucide-react";
import { getClient, getClientNotes, getClientUniversities, getClientCostCalculations } from "@/lib/staff-data";
import { ClientNotes } from "@/components/staff/ClientNotes";
import { ClientUniversities } from "@/components/staff/ClientUniversities";
import { ClientCalculations } from "@/components/staff/ClientCalculations";
import { AIChatCard } from "@/components/staff/AIChat";

const SALES_STATUS = {
  new: "Новый",
  qualified: "Квалифицирован",
  proposal: "Предложение",
  negotiation: "Переговоры",
  won: "Продажа",
  lost: "Отказ",
};

function Value({ label, value }: { label: string; value: React.ReactNode }) {
  return <div><div className="text-[11.5px] font-semibold uppercase tracking-wide text-slate-400">{label}</div><div className="mt-1 text-[14px] font-medium text-ze-ink">{value || "—"}</div></div>;
}

export default async function StaffClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await getClient(id);
  if (!client) notFound();
  const [notes, universities, calculations] = await Promise.all([getClientNotes(id), getClientUniversities(id), getClientCostCalculations(id)]);

  return (
    <div className="p-5 sm:p-9">
      <Link href="/staff/clients" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ze-muted hover:text-ze-primary"><ArrowLeft className="h-4 w-4" />К клиентам</Link>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[25px] font-extrabold tracking-tight sm:text-[34px]">{client.fullName}</h1>
            {client.leadCategory && <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-[12px] font-extrabold text-ze-primary">{client.leadCategory}</span>}
          </div>
          <p className="mt-1.5 text-[13.5px] text-ze-muted">Ответственный: {client.assignedManagerName || "менеджер"}</p>
        </div>
        <div className="flex items-center gap-2"><span className="w-fit rounded-xl bg-slate-100 px-3 py-2 text-[12.5px] font-bold text-slate-700">{SALES_STATUS[client.salesStatus]}</span><Link href={`/staff/clients/${client.id}/edit`} className="flex items-center gap-1.5 rounded-xl border border-ze-border bg-white px-3 py-2 text-[12.5px] font-semibold"><Pencil className="h-3.5 w-3.5" />Изменить</Link></div>
      </div>

      <div className="mt-6 flex gap-1 overflow-x-auto border-b border-ze-border">
        <span className="border-b-2 border-ze-primary px-4 py-3 text-[13.5px] font-bold text-ze-primary">Обзор</span>
        <span className="px-4 py-3 text-[13.5px] font-medium text-ze-muted">Потребности</span>
      </div>
      <Link href={`/education?clientId=${client.id}`} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-ze-primary px-4 py-2.5 text-[13.5px] font-semibold text-white"><Landmark className="h-4 w-4" />Подобрать университет</Link>
      <Link href={`/staff/clients/${client.id}/calculations/new`} className="ml-2 mt-4 inline-flex items-center gap-2 rounded-xl border border-ze-primary px-4 py-2.5 text-[13.5px] font-semibold text-ze-primary">Рассчитать стоимость</Link>

      <div className="mt-5"><AIChatCard clientId={client.id} clientName={client.fullName} /></div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-5">
          <section className="rounded-[20px] border border-ze-border bg-white p-5">
            <h2 className="flex items-center gap-2 text-[16px] font-bold"><UserRound className="h-5 w-5 text-ze-primary" />Контактная информация</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Value label="Телефон" value={client.phone && <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{client.phone}</span>} />
              <Value label="Email" value={client.email && <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{client.email}</span>} />
              <Value label="Город" value={client.city && <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{client.city}</span>} />
              <Value label="Дата рождения" value={client.birthDate} />
              <Value label="Родитель" value={client.parentName} />
              <Value label="Связь" value={client.preferredContact} />
            </div>
          </section>

          <section className="rounded-[20px] border border-ze-border bg-white p-5">
            <h2 className="text-[16px] font-bold">Квалификация</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Value label="Продукт" value={client.product} />
              <Value label="Страна" value={client.studyCountry} />
              <Value label="Специальность" value={client.specialty} />
              <Value label="Уровень" value={client.educationLevel} />
              <Value label="Intake" value={[client.intakeName, client.intakeYear].filter(Boolean).join(" ")} />
              <Value label="Бюджет" value={client.budget === null ? null : `${client.budget.toLocaleString("ru-RU")} ${client.budgetCurrency}`} />
              <Value label="Язык" value={client.languageLevel} />
              <Value label="Грант" value={client.needsGrant ? "Нужен" : "Не требуется"} />
              <Value label="Общежитие" value={client.needsDormitory ? "Нужно" : "Не требуется"} />
            </div>
            {client.preferences && <div className="mt-5 rounded-xl bg-[#F7F9FC] p-4 text-[13.5px] leading-relaxed text-slate-700">{client.preferences}</div>}
          </section>
        </div>

        <div className="flex flex-col gap-5">
          <section className="rounded-[20px] border border-ze-border bg-white p-5">
            <h2 className="flex items-center gap-2 text-[16px] font-bold"><CalendarClock className="h-5 w-5 text-amber-600" />Следующее действие</h2>
            <p className="mt-3 text-[14px] font-medium text-ze-ink">{client.nextAction || "Не назначено"}</p>
            <p className="mt-1 text-[12.5px] text-ze-muted">{client.nextContactAt ? new Date(client.nextContactAt).toLocaleString("ru-RU") : "Дата контакта не указана"}</p>
          </section>
          <ClientNotes clientId={client.id} notes={notes} />
          <ClientUniversities clientId={client.id} items={universities} />
          <ClientCalculations clientId={client.id} calculations={calculations} />
        </div>
      </div>
    </div>
  );
}
