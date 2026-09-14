import { notFound } from "next/navigation";
import { CalendarDays, CheckCircle2, GraduationCap, Mail, MapPin, Phone, UserRound } from "lucide-react";
import { apiGet } from "@/lib/api";
import { PrintOfferButton } from "@/components/public/PrintOfferButton";
import { OfferResponseActions } from "@/components/public/OfferResponseActions";

type Row = Record<string, unknown>;

const ADMISSION_STEPS = [
  "Консультация и проверка документов",
  "Подбор программы и подготовка заявки",
  "Подача документов в университет",
  "Получение решения и зачисление",
  "Виза, перелёт и подготовка к переезду",
];

function asRows(value: unknown): Row[] {
  return Array.isArray(value) ? (value as Row[]) : [];
}

function formatAmount(value: unknown, currency: unknown) {
  return `${Number(value || 0).toLocaleString("ru-RU")} ${String(currency || "")}`;
}

export default async function PublicOfferPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const res = await apiGet<Record<string, unknown>>(
    `/cost-calculations/public/${token}`,
  );
  if (!res.data) notFound();
  const offer = res.data;
  const university = offer.universities as Row | null;
  const program = offer.university_programs as Row | null;
  const intake = offer.university_intakes as Row | null;
  const client = offer.clients as Row | null;
  const manager = offer.profiles as Row | null;
  const country = university?.education_countries as Row | null;
  const items = asRows(offer.cost_calculation_items);
  const installmentPlan = asRows(offer.installment_plan);
  const advantages = Array.isArray(university?.advantages) ? university.advantages.map(String) : [];
  const requirements = Array.isArray(university?.requirements) ? university.requirements.map(String) : [];
  const includedServices = items.filter((item) => item.category === "zagraneasy_services" && !item.is_optional);
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 print:bg-white">
      <div className="mx-auto max-w-4xl rounded-2xl border border-ze-border bg-white p-6 shadow-sm print:border-0 print:shadow-none sm:p-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-extrabold text-ze-primary">
              ZagranEasy
            </div>
            <h1 className="mt-2 text-2xl font-extrabold">
              {String(offer.title)}
            </h1>
            <p className="mt-1 text-sm text-ze-muted">
              {String(university?.name || "Университет")}
              {program?.name ? ` · ${program.name}` : ""}
              {intake?.name ? ` · ${intake.name}` : ""}
            </p>
          </div>
          <PrintOfferButton />
        </div>

        <div className="mt-6 grid gap-3 rounded-2xl bg-[#F7F9FC] p-4 sm:grid-cols-2 lg:grid-cols-4">
          <OfferFact Icon={UserRound} label="Клиент" value={String(client?.full_name || client?.name || "Персональное предложение")} />
          <OfferFact Icon={GraduationCap} label="Программа" value={String(program?.name || "Уточняется")} />
          <OfferFact Icon={MapPin} label="Локация" value={[country?.name, university?.city].filter(Boolean).map(String).join(", ") || "Уточняется"} />
          <OfferFact Icon={CalendarDays} label="Срок действия" value={offer.valid_until ? new Date(String(offer.valid_until)).toLocaleDateString("ru-RU") : "Без ограничения"} />
        </div>

        {(advantages.length > 0 || requirements.length > 0) && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {advantages.length > 0 && <InfoList title="Преимущества университета" items={advantages} />}
            {requirements.length > 0 && <InfoList title="Требования к поступлению" items={requirements} />}
          </div>
        )}

        <section className="mt-6">
          <h2 className="text-[17px] font-bold">Этапы поступления</h2>
          <ol className="mt-3 grid gap-2 sm:grid-cols-2">
            {ADMISSION_STEPS.map((step, index) => (
              <li key={step} className="flex items-center gap-3 rounded-xl border border-ze-border px-3.5 py-3 text-[13px] text-slate-700">
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[#EBF1FE] text-[12px] font-extrabold text-ze-primary">{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        {includedServices.length > 0 && (
          <section className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
            <h2 className="text-[15px] font-bold text-ze-ink">Услуги ZagranEasy</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {includedServices.map((item) => (
                <div key={String(item.id)} className="flex items-start gap-2 text-[13px] text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
                  <span>{String(item.title)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <h2 className="mt-6 text-[17px] font-bold">Полный расчёт</h2>
        <div className="mt-6 overflow-hidden rounded-xl border border-ze-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3">Расход</th>
                <th className="px-4 py-3 text-right">Сумма</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={String(item.id)} className="border-t border-ze-border">
                  <td className="px-4 py-3">
                    <div className="font-medium">{String(item.title)}</div>
                    {Boolean(item.description) && (
                      <div className="text-xs text-ze-muted">
                        {String(item.description)}
                      </div>
                    )}
                    {Boolean(item.is_optional) && (
                      <div className="text-xs text-amber-600">Опционально</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {Number(item.amount).toLocaleString("ru-RU")}{" "}
                    {String(item.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="ml-auto mt-5 max-w-xs space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Подытог</span>
            <b>
              {Number(offer.subtotal).toLocaleString("ru-RU")}{" "}
              {String(offer.currency)}
            </b>
          </div>
          <div className="flex justify-between">
            <span>Скидка</span>
            <b>
              − {Number(offer.discount).toLocaleString("ru-RU")}{" "}
              {String(offer.currency)}
            </b>
          </div>
          <div className="flex justify-between border-t pt-2 text-lg">
            <span>Итого</span>
            <b>
              {Number(offer.grand_total).toLocaleString("ru-RU")}{" "}
              {String(offer.currency)}
            </b>
          </div>
        </div>

        {installmentPlan.length > 0 && (
          <section className="mt-6">
            <h2 className="text-[17px] font-bold">График платежей</h2>
            <div className="mt-3 overflow-hidden rounded-xl border border-ze-border">
              {installmentPlan.map((payment, index) => (
                <div key={String(payment.id || payment.number || index)} className="flex items-center justify-between border-t border-ze-border px-4 py-3 text-sm first:border-0">
                  <span>
                    Платёж {String(payment.number || index + 1)}
                    {payment.due_date ? ` · до ${new Date(String(payment.due_date)).toLocaleDateString("ru-RU")}` : ""}
                  </span>
                  <b>{formatAmount(payment.amount, offer.currency)}</b>
                </div>
              ))}
            </div>
          </section>
        )}

        {Boolean(offer.client_comment) && (
          <section className="mt-6 rounded-xl bg-slate-50 p-4 text-sm">
            <div className="mb-1 text-xs font-bold uppercase tracking-wide text-ze-muted">Комментарий для клиента</div>
            {String(offer.client_comment)}
          </section>
        )}

        {Boolean(manager?.full_name || manager?.phone || manager?.email) && (
          <section className="mt-6 rounded-2xl bg-ze-navy p-5 text-white print:border print:border-ze-border print:bg-white print:text-ze-ink">
            <div className="text-xs font-semibold uppercase tracking-wide text-white/55 print:text-ze-muted">Ваш менеджер</div>
            <div className="mt-1 text-[17px] font-bold">{String(manager?.full_name || "Менеджер ZagranEasy")}</div>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-white/80 print:text-ze-ink">
              {Boolean(manager?.phone) && <span className="flex items-center gap-1.5"><Phone className="h-4 w-4" />{String(manager?.phone)}</span>}
              {Boolean(manager?.email) && <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" />{String(manager?.email)}</span>}
            </div>
          </section>
        )}

        <OfferResponseActions token={token} initialStatus={String(offer.status)} />

        <div className="mt-6 text-xs text-ze-muted">
          Версия {String(offer.version)} · курс зафиксирован:{" "}
          {String(offer.exchange_rate)} · действительно до{" "}
          {offer.valid_until
            ? new Date(String(offer.valid_until)).toLocaleDateString("ru-RU")
            : "без ограничения"}
        </div>
      </div>
    </main>
  );
}

function OfferFact({ Icon, label, value }: { Icon: typeof UserRound; label: string; value: string }) {
  return (
    <div className="flex gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 flex-none text-ze-primary" />
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wide text-ze-muted">{label}</div>
        <div className="mt-0.5 text-[13px] font-semibold text-ze-ink">{value}</div>
      </div>
    </div>
  );
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-2xl border border-ze-border p-4">
      <h2 className="text-[15px] font-bold">{title}</h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-[13px] leading-5 text-slate-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
