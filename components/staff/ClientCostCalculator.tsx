"use client";

import { useMemo, useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { saveCostCalculation } from "@/lib/staff-actions";

type Row = Record<string, unknown>;
type Item = {
  category: string;
  title: string;
  quantity: string;
  unit_price: string;
  currency: string;
  is_optional: boolean;
};
const categories = [
  ["tuition", "Обучение"],
  ["registration_fee", "Регистрационный взнос"],
  ["dormitory", "Общежитие"],
  ["deposit", "Депозит"],
  ["food", "Питание"],
  ["insurance", "Страховка"],
  ["visa", "Виза"],
  ["document_translation", "Перевод документов"],
  ["apostille", "Апостиль"],
  ["flight", "Перелёт"],
  ["transfer", "Трансфер"],
  ["zagraneasy_services", "Услуги ZagranEasy"],
  ["language_course", "Языковой курс"],
  ["additional", "Дополнительные расходы"],
  ["installment", "Рассрочка"],
];
const input =
  "w-full rounded-xl border border-ze-border bg-white px-3 py-2.5 text-[13px] outline-none focus:border-ze-primary";

export function ClientCostCalculator({
  clientId,
  context,
}: {
  clientId: string;
  context: Row;
}) {
  const universities = (context.universities as Row[]) || [];
  const [universityId, setUniversityId] = useState(
    String(universities[0]?.university_id || ""),
  );
  const selected = universities.find((u) => u.university_id === universityId);
  const programs = (selected?.programs as Row[]) || [];
  const intakes = (selected?.intakes as Row[]) || [];
  const costs = (selected?.costs as Row[]) || [];
  const [programId, setProgramId] = useState("");
  const [intakeId, setIntakeId] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [exchangeRate, setExchangeRate] = useState("1");
  const [discount, setDiscount] = useState("0");
  const [title, setTitle] = useState("Предложение на обучение");
  const [managerComment, setManagerComment] = useState("");
  const [clientComment, setClientComment] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [installments, setInstallments] = useState("1");
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();
  const subtotal = useMemo(
    () =>
      items
        .filter((i) => !i.is_optional)
        .reduce(
          (sum, i) =>
            sum + (Number(i.quantity) || 0) * (Number(i.unit_price) || 0),
          0,
        ),
    [items],
  );
  const total = Math.max(0, subtotal - (Number(discount) || 0));

  function changeUniversity(id: string) {
    setUniversityId(id);
    setProgramId("");
    setIntakeId("");
    setItems([]);
  }
  function autofill() {
    const relevant = costs.filter(
      (c) =>
        (!c.program_id || c.program_id === programId) &&
        (!c.intake_id || c.intake_id === intakeId),
    );
    setItems(
      relevant.map((c) => ({
        category: String(c.category),
        title: String(c.title),
        quantity: "1",
        unit_price: String(c.amount),
        currency: String(c.currency || currency),
        is_optional: !Boolean(c.is_required),
      })),
    );
  }
  function add() {
    setItems((v) => [
      ...v,
      {
        category: "additional",
        title: "",
        quantity: "1",
        unit_price: "0",
        currency,
        is_optional: false,
      },
    ]);
  }
  function save() {
    if (!universityId || !title.trim() || !items.length)
      return setError("Выберите университет и добавьте хотя бы один расход");
    setError(null);
    const count = Math.max(1, Number(installments) || 1);
    const plan = Array.from({ length: count }, (_, index) => ({
      number: index + 1,
      amount: Math.round((total / count) * 100) / 100,
    }));
    startTransition(async () => {
      const res = await saveCostCalculation({
        client_id: clientId,
        university_id: universityId,
        program_id: programId || null,
        intake_id: intakeId || null,
        title,
        currency,
        exchange_rate: Number(exchangeRate),
        discount: Number(discount),
        manager_comment: managerComment,
        client_comment: clientComment,
        valid_until: validUntil || null,
        installment_plan: plan,
        items: items.map((i) => ({
          ...i,
          quantity: Number(i.quantity),
          unit_price: Number(i.unit_price),
        })),
      });
      if (!res.success) return setError(res.error);
      setSaved(true);
    });
  }
  if (!universities.length)
    return (
      <div className="rounded-xl bg-amber-50 p-4 text-[13px] text-amber-800">
        Сначала добавьте университет клиенту через подбор.
      </div>
    );
  return (
    <div className="flex flex-col gap-4">
      <section className="grid gap-3 rounded-[20px] border border-ze-border bg-white p-5 sm:grid-cols-2">
        <label>
          <div className="mb-1 text-xs font-semibold text-ze-muted">
            Университет
          </div>
          <select
            className={input}
            value={universityId}
            onChange={(e) => changeUniversity(e.target.value)}
          >
            {universities.map((u) => {
              const uni = u.universities as Row;
              return (
                <option key={String(u.id)} value={String(u.university_id)}>
                  {String(uni?.name || "Университет")}
                </option>
              );
            })}
          </select>
        </label>
        <label>
          <div className="mb-1 text-xs font-semibold text-ze-muted">
            Название расчёта
          </div>
          <input
            className={input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label>
          <div className="mb-1 text-xs font-semibold text-ze-muted">
            Программа
          </div>
          <select
            className={input}
            value={programId}
            onChange={(e) => {
              setProgramId(e.target.value);
              setIntakeId("");
            }}
          >
            <option value="">Не выбрана</option>
            {programs.map((p) => (
              <option key={String(p.id)} value={String(p.id)}>
                {String(p.name)}
              </option>
            ))}
          </select>
        </label>
        <label>
          <div className="mb-1 text-xs font-semibold text-ze-muted">Intake</div>
          <select
            className={input}
            value={intakeId}
            onChange={(e) => setIntakeId(e.target.value)}
          >
            <option value="">Не выбран</option>
            {intakes
              .filter((i) => !programId || i.program_id === programId)
              .map((i) => (
                <option key={String(i.id)} value={String(i.id)}>
                  {String(i.name)} {String(i.academic_year || "")}
                </option>
              ))}
          </select>
        </label>
        <button
          type="button"
          onClick={autofill}
          className="w-fit rounded-xl bg-[#EBF1FE] px-4 py-2.5 text-[13px] font-semibold text-ze-primary"
        >
          Подставить известные расходы
        </button>
      </section>
      <section className="rounded-[20px] border border-ze-border bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Расходы</h2>
          <button
            onClick={add}
            className="flex items-center gap-1 rounded-lg border border-ze-border px-3 py-2 text-xs font-semibold"
          >
            <Plus className="h-4 w-4" />
            Добавить
          </button>
        </div>
        <div className="mt-3 flex flex-col gap-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="grid gap-2 rounded-xl border border-ze-border p-3 sm:grid-cols-[1fr_1.4fr_.5fr_.7fr_auto]"
            >
              <select
                className={input}
                value={item.category}
                onChange={(e) =>
                  setItems((v) =>
                    v.map((x, i) =>
                      i === index ? { ...x, category: e.target.value } : x,
                    ),
                  )
                }
              >
                {categories.map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
              <input
                className={input}
                placeholder="Название"
                value={item.title}
                onChange={(e) =>
                  setItems((v) =>
                    v.map((x, i) =>
                      i === index ? { ...x, title: e.target.value } : x,
                    ),
                  )
                }
              />
              <input
                className={input}
                value={item.quantity}
                onChange={(e) =>
                  setItems((v) =>
                    v.map((x, i) =>
                      i === index ? { ...x, quantity: e.target.value } : x,
                    ),
                  )
                }
              />
              <input
                className={input}
                value={item.unit_price}
                onChange={(e) =>
                  setItems((v) =>
                    v.map((x, i) =>
                      i === index ? { ...x, unit_price: e.target.value } : x,
                    ),
                  )
                }
              />
              <button
                onClick={() => setItems((v) => v.filter((_, i) => i !== index))}
                className="p-2 text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <label className="text-xs text-ze-muted sm:col-span-5">
                <input
                  type="checkbox"
                  checked={item.is_optional}
                  onChange={(e) =>
                    setItems((v) =>
                      v.map((x, i) =>
                        i === index
                          ? { ...x, is_optional: e.target.checked }
                          : x,
                      ),
                    )
                  }
                />{" "}
                Не включать в итог (опционально)
              </label>
            </div>
          ))}
        </div>
      </section>
      <section className="grid gap-3 rounded-[20px] border border-ze-border bg-white p-5 sm:grid-cols-3">
        <label>
          <div className="mb-1 text-xs font-semibold text-ze-muted">Валюта</div>
          <input
            className={input}
            value={currency}
            onChange={(e) => setCurrency(e.target.value.toUpperCase())}
          />
        </label>
        <label>
          <div className="mb-1 text-xs font-semibold text-ze-muted">
            Зафиксированный курс
          </div>
          <input
            className={input}
            value={exchangeRate}
            onChange={(e) => setExchangeRate(e.target.value)}
          />
        </label>
        <label>
          <div className="mb-1 text-xs font-semibold text-ze-muted">Скидка</div>
          <input
            className={input}
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />
        </label>
        <label>
          <div className="mb-1 text-xs font-semibold text-ze-muted">
            Количество платежей
          </div>
          <input
            className={input}
            value={installments}
            onChange={(e) => setInstallments(e.target.value)}
          />
        </label>
        <label>
          <div className="mb-1 text-xs font-semibold text-ze-muted">
            Действительно до
          </div>
          <input
            type="date"
            className={input}
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
          />
        </label>
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="text-xs text-ze-muted">Итого</div>
          <div className="text-xl font-extrabold">
            {total.toLocaleString("ru-RU")} {currency}
          </div>
        </div>
        <textarea
          className={`${input} sm:col-span-3`}
          placeholder="Комментарий клиенту"
          value={clientComment}
          onChange={(e) => setClientComment(e.target.value)}
        />
        <textarea
          className={`${input} sm:col-span-3`}
          placeholder="Внутренний комментарий менеджера"
          value={managerComment}
          onChange={(e) => setManagerComment(e.target.value)}
        />
      </section>
      {error && (
        <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}
      {saved && (
        <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
          Расчёт сохранён. Он появился в карточке клиента.
        </div>
      )}
      <button
        onClick={save}
        disabled={pending}
        className="w-fit rounded-xl bg-ze-accent px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Сохраняем…" : "Сохранить расчёт"}
      </button>
    </div>
  );
}
