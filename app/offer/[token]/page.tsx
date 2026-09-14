import { notFound } from "next/navigation";
import { apiGet } from "@/lib/api";
import { PrintOfferButton } from "@/components/public/PrintOfferButton";

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
  const university = offer.universities as Record<string, unknown> | null;
  const program = offer.university_programs as Record<string, unknown> | null;
  const intake = offer.university_intakes as Record<string, unknown> | null;
  const items = offer.cost_calculation_items as Record<string, unknown>[];
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 print:bg-white">
      <div className="mx-auto max-w-3xl rounded-2xl border border-ze-border bg-white p-6 shadow-sm print:border-0 print:shadow-none sm:p-10">
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
        {Boolean(offer.client_comment) && (
          <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm">
            {String(offer.client_comment)}
          </div>
        )}
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
