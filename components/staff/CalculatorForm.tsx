"use client";

import { useMemo, useState, useTransition } from "react";
import { Pencil, Send } from "lucide-react";
import {
  calculate,
  formatMoney,
  getEducationPackages,
  getExtrasForService,
  DEFAULT_CALCULATOR_SETTINGS,
  type CalculatorSettings,
  type EducationPackage,
  type ServiceType,
} from "@/lib/calculator";
import { updateCalculatorSetting } from "@/lib/staff-actions";
import { waUrl } from "@/lib/utils";

const SERVICES: { value: ServiceType; label: string }[] = [
  { value: "education", label: "Обучение за рубежом" },
  { value: "tours", label: "Тур" },
];

const COUNTRIES_BY_SERVICE: Partial<Record<ServiceType, { value: string; label: string }[]>> = {
  education: [
    { value: "turkey", label: "Турция" },
    { value: "china", label: "Китай" },
  ]
};

export function CalculatorForm({ initialSettings }: { initialSettings?: CalculatorSettings }) {
  const [settings, setSettings] = useState<CalculatorSettings>(initialSettings ?? DEFAULT_CALCULATOR_SETTINGS);
  const [service, setService] = useState<ServiceType>("education");
  const [country, setCountry] = useState("turkey");
  const [program, setProgram] = useState<string>("support");
  const [duration, setDuration] = useState(10);
  const [extras, setExtras] = useState<string[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"full" | "installment" | "staged">("full");
  const [paymentStatus, setPaymentStatus] = useState<"unpaid" | "awaiting" | "partial" | "paid" | "overdue">("awaiting");
  const [paidAmount, setPaidAmount] = useState(0);
  const [installmentCount, setInstallmentCount] = useState(3);

  const availableExtras = getExtrasForService(service, settings);
  const countries = COUNTRIES_BY_SERVICE[service];
  const packages = getEducationPackages(settings);
  const isPackage = service === "education" && program !== "support";
  const selectedPackage = packages.find((p) => p.value === program);

  const result = useMemo(
    () =>
      calculate(
        {
          service,
          country: countries ? country : undefined,
          program: service === "education" ? program : undefined,
          duration: service === "tours" ? duration : undefined,
          extras: isPackage ? undefined : extras,
        },
        settings
      ),
    [service, country, program, duration, extras, countries, isPackage, settings]
  );
  const remainingAmount = Math.max(result.total - paidAmount, 0);
  const installmentAmount = installmentCount > 0 ? Math.ceil(result.total / installmentCount) : result.total;

  function toggleExtra(extra: string) {
    setExtras((prev) => (prev.includes(extra) ? prev.filter((e) => e !== extra) : [...prev, extra]));
  }

  function changeService(s: ServiceType) {
    setService(s);
    setExtras([]);
    setProgram("support");
    setCountry(COUNTRIES_BY_SERVICE[s]?.[0]?.value || "turkey");
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_380px]">
      <div className="rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
        <div className="text-[12.5px] font-bold uppercase tracking-wide text-ze-muted">Услуга</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {SERVICES.map((s) => (
            <button
              key={s.value}
              onClick={() => changeService(s.value)}
              className={`rounded-full border px-3.5 py-2 text-[13.5px] font-semibold transition-colors ${
                service === s.value ? "border-ze-primary bg-ze-primary text-white" : "border-ze-border bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {service === "education" && (
          <>
            <div className="mt-5 text-[12.5px] font-bold uppercase tracking-wide text-ze-muted">Программа</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => setProgram("support")}
                className={`rounded-full border px-3.5 py-2 text-[13.5px] font-semibold transition-colors ${
                  program === "support" ? "border-ze-primary bg-ze-primary text-white" : "border-ze-border bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                Только сопровождение
              </button>
              {packages.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setProgram(p.value)}
                  className={`rounded-full border px-3.5 py-2 text-[13.5px] font-semibold transition-colors ${
                    program === p.value ? "border-ze-primary bg-ze-primary text-white" : "border-ze-border bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            {isPackage && (() => {
              if (!selectedPackage) return null;
              return (
                <dl className="mt-4 grid grid-cols-1 gap-3 rounded-xl bg-[#F7F9FC] p-4 text-[13.5px] sm:grid-cols-2">
                  <div>
                    <dt className="font-bold text-ze-muted">Цель</dt>
                    <dd className="mt-0.5 text-ze-ink">{selectedPackage.goal}</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-ze-muted">Срок подготовки</dt>
                    <dd className="mt-0.5 text-ze-ink">{selectedPackage.duration}</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-ze-muted">Формат занятий</dt>
                    <dd className="mt-0.5 text-ze-ink">{selectedPackage.format}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="font-bold text-ze-muted">Что входит</dt>
                    <dd className="mt-0.5 text-ze-ink">{selectedPackage.description}</dd>
                  </div>
                </dl>
              );
            })()}
          </>
        )}

        {countries && !isPackage && (
          <>
            <div className="mt-5 text-[12.5px] font-bold uppercase tracking-wide text-ze-muted">Страна</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {countries.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCountry(c.value)}
                  className={`rounded-full border px-3.5 py-2 text-[13.5px] font-semibold transition-colors ${
                    country === c.value ? "border-ze-primary bg-ze-primary text-white" : "border-ze-border bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </>
        )}

        {service === "tours" && (
          <>
            <div className="mt-5 text-[12.5px] font-bold uppercase tracking-wide text-ze-muted">Длительность (дней)</div>
            <input
              type="number"
              min={1}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value) || 1)}
              className="mt-3 w-32 rounded-xl border border-ze-border px-3.5 py-2.5 text-[14px] outline-none transition-colors focus:border-ze-primary"
            />
          </>
        )}

        {availableExtras.length > 0 && !isPackage && (
          <>
            <div className="mt-5 text-[12.5px] font-bold uppercase tracking-wide text-ze-muted">Доп. услуги</div>
            <div className="mt-3 flex flex-col gap-2">
              {availableExtras.map((extra) => (
                <label key={extra} className="flex items-center gap-2.5 text-[14.5px] text-ze-ink">
                  <input type="checkbox" checked={extras.includes(extra)} onChange={() => toggleExtra(extra)} className="h-4 w-4 accent-[#1A56DB]" />
                  {extra}
                </label>
              ))}
            </div>
          </>
        )}

        <div className="mt-6 border-t border-ze-border pt-4">
          <button
            onClick={() => setEditMode((v) => !v)}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-ze-primary hover:underline"
          >
            <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
            {editMode ? "Скрыть редактирование тарифов" : "Редактировать тарифы"}
          </button>
          {editMode && (
            <div className="mt-4">
              <RatesEditor service={service} settings={settings} onSaved={setSettings} />
            </div>
          )}
        </div>
      </div>

      <div className="rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
        <div className="text-[16px] font-bold text-ze-ink">Расчёт</div>
        <div className="mt-3.5 flex flex-col">
          {result.items.map((item) => (
            <div key={item.label} className="flex justify-between border-b border-[#F1F4F9] py-3 text-[14px] last:border-0">
              <span className="text-slate-600">{item.label}</span>
              <span className="font-semibold text-ze-ink">{formatMoney(item.amount)}</span>
            </div>
          ))}
        </div>
        <div className="mt-3.5 flex items-center justify-between border-t border-ze-border pt-3.5">
          <span className="text-[15px] font-bold text-ze-ink">Итого</span>
          <span className="text-[22px] font-extrabold text-ze-primary">{formatMoney(result.total)}</span>
        </div>
        {result.note && <p className="mt-2.5 text-[13px] text-ze-muted">{result.note}</p>}
        {isPackage && (
          <div className="mt-5 border-t border-ze-border pt-5">
            <div className="text-[12.5px] font-bold uppercase tracking-wide text-ze-muted">Оплата полного пакета</div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ze-muted">
              Обучение в университете оплачивается отдельно. Ниже указана только стоимость сопровождения ZagranEasy.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-semibold text-slate-600">Способ оплаты</span>
                <select
                  value={paymentMethod}
                  onChange={(event) => setPaymentMethod(event.target.value as typeof paymentMethod)}
                  className="w-full rounded-xl border border-ze-border bg-white px-3 py-2.5 text-[13.5px] text-ze-ink outline-none focus:border-ze-primary"
                >
                  <option value="full">Полная оплата</option>
                  <option value="installment">Рассрочка</option>
                  <option value="staged">Поэтапная оплата</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-semibold text-slate-600">Статус оплаты</span>
                <select
                  value={paymentStatus}
                  onChange={(event) => {
                    const nextStatus = event.target.value as typeof paymentStatus;
                    setPaymentStatus(nextStatus);
                    if (nextStatus === "paid") setPaidAmount(result.total);
                    if (nextStatus === "unpaid" || nextStatus === "awaiting" || nextStatus === "overdue") setPaidAmount(0);
                  }}
                  className="w-full rounded-xl border border-ze-border bg-white px-3 py-2.5 text-[13.5px] text-ze-ink outline-none focus:border-ze-primary"
                >
                  <option value="unpaid">Не оплачено</option>
                  <option value="awaiting">Ожидает оплаты</option>
                  <option value="partial">Частично оплачено</option>
                  <option value="paid">Оплачено полностью</option>
                  <option value="overdue">Оплата просрочена</option>
                </select>
              </label>
            </div>

            {paymentMethod !== "full" && (
              <label className="mt-3 block">
                <span className="mb-1.5 block text-[13px] font-semibold text-slate-600">Количество платежей</span>
                <input
                  type="number"
                  min={2}
                  max={24}
                  value={installmentCount}
                  onChange={(event) => setInstallmentCount(Math.max(2, Math.min(24, Number(event.target.value) || 2)))}
                  className="w-full rounded-xl border border-ze-border px-3 py-2.5 text-[13.5px] outline-none focus:border-ze-primary"
                />
              </label>
            )}

            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 rounded-xl bg-[#F7F9FC] p-4 text-[13.5px]">
              <span className="text-slate-600">Стоимость пакета</span>
              <span className="text-right font-semibold text-ze-ink">{formatMoney(result.total)}</span>
              <span className="text-slate-600">Оплачено</span>
              <label className="flex justify-end">
                <input
                  type="number"
                  min={0}
                  max={result.total}
                  value={paidAmount}
                  onChange={(event) => setPaidAmount(Math.max(0, Math.min(result.total, Number(event.target.value) || 0)))}
                  className="w-32 rounded-lg border border-ze-border bg-white px-2.5 py-1.5 text-right text-[13px] outline-none focus:border-ze-primary"
                />
                <span className="sr-only">тенге</span>
              </label>
              <span className="text-slate-600">Остаток к оплате</span>
              <span className="text-right font-bold text-ze-primary">{formatMoney(remainingAmount)}</span>
              <span className="text-slate-600">К оплате сейчас</span>
              <span className="text-right font-semibold text-ze-ink">
                {formatMoney(paymentMethod === "full" ? remainingAmount : Math.min(installmentAmount, remainingAmount || installmentAmount))}
              </span>
            </div>

            {paymentMethod !== "full" && (
              <p className="mt-2.5 text-[12.5px] text-ze-muted">
                График: {installmentCount} платежа по {formatMoney(installmentAmount)}. Последний платеж может отличаться на несколько тенге из-за округления.
              </p>
            )}
            {paymentStatus === "paid" && (
              <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-[13px] font-semibold text-emerald-800">
                Полный пакет сопровождения ZagranEasy оплачен полностью.
              </div>
            )}
          </div>
        )}
        {/* <a
          href={waUrl(result.waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-ze-whatsapp py-3.5 text-center text-[14.5px] font-bold text-white shadow-[0_6px_16px_rgba(37,211,102,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-ze-whatsapp-dark"
        >
          <Send className="h-4.5 w-4.5" strokeWidth={2} />
          Отправить клиенту в WhatsApp
        </a> */}
      </div>
    </div>
  );
}

// ---- Редактирование тарифов менеджером ----
// Показывает поля только для тех тарифов, которые относятся к выбранной услуге,
// сохраняет изменения через server action (Supabase, таблица calculator_settings).

function RatesEditor({
  service,
  settings,
  onSaved,
}: {
  service: ServiceType;
  settings: CalculatorSettings;
  onSaved: (next: CalculatorSettings) => void;
}) {
  if (service === "education") {
    return (
      <div className="flex flex-col gap-5">
        <RateGroup
          title="Сервисный сбор (сопровождение)"
          fields={Object.entries(settings.education_fees).map(([key, value]) => ({ key, label: key, value }))}
          onSave={async (next) => {
            const value = Object.fromEntries(next.map((f) => [f.key, f.value]));
            const res = await updateCalculatorSetting("education_fees", value);
            if (res.success) onSaved({ ...settings, education_fees: value });
            return res;
          }}
        />
        <RateGroup
          title="Доп. услуги"
          fields={Object.entries(settings.education_extras).map(([key, value]) => ({ key, label: key, value }))}
          onSave={async (next) => {
            const value = Object.fromEntries(next.map((f) => [f.key, f.value]));
            const res = await updateCalculatorSetting("education_extras", value);
            if (res.success) onSaved({ ...settings, education_extras: value });
            return res;
          }}
        />
        <PackageDetailsEditor
          packages={settings.education_packages}
          onSave={async (value) => {
            const res = await updateCalculatorSetting("education_packages", value);
            if (res.success) onSaved({ ...settings, education_packages: value });
            return res;
          }}
        />
      </div>
    );
  }

  if (service === "visa") {
    return (
      <RateGroup
        title="Тарифы визы в США"
        fields={Object.entries(settings.visa_fees).map(([key, value]) => ({ key, label: key, value }))}
        onSave={async (next) => {
          const value = Object.fromEntries(next.map((f) => [f.key, f.value])) as CalculatorSettings["visa_fees"];
          const res = await updateCalculatorSetting("visa_fees", value);
          if (res.success) onSaved({ ...settings, visa_fees: value });
          return res;
        }}
      />
    );
  }

  if (service === "work") {
    return (
      <RateGroup
        title="Тарифы трудоустройства"
        fields={Object.entries(settings.work_fees).map(([key, value]) => ({ key, label: key, value }))}
        onSave={async (next) => {
          const value = Object.fromEntries(next.map((f) => [f.key, f.value]));
          const res = await updateCalculatorSetting("work_fees", value);
          if (res.success) onSaved({ ...settings, work_fees: value });
          return res;
        }}
      />
    );
  }

  if (service === "tours") {
    return (
      <RateGroup
        title="Тарифы туров"
        fields={Object.entries(settings.tours_fees).map(([key, value]) => ({ key, label: key, value }))}
        onSave={async (next) => {
          const value = Object.fromEntries(next.map((f) => [f.key, f.value])) as CalculatorSettings["tours_fees"];
          const res = await updateCalculatorSetting("tours_fees", value);
          if (res.success) onSaved({ ...settings, tours_fees: value });
          return res;
        }}
      />
    );
  }

  return (
    <RateGroup
      title="Тарифы недвижимости"
      fields={Object.entries(settings.realestate_fees).map(([key, value]) => ({ key, label: key, value }))}
      onSave={async (next) => {
        const value = Object.fromEntries(next.map((f) => [f.key, f.value])) as CalculatorSettings["realestate_fees"];
        const res = await updateCalculatorSetting("realestate_fees", value);
        if (res.success) onSaved({ ...settings, realestate_fees: value });
        return res;
      }}
    />
  );
}

function RateGroup({
  title,
  fields,
  onSave,
}: {
  title: string;
  fields: { key: string; label: string; value: number }[];
  onSave: (next: { key: string; label: string; value: number }[]) => Promise<{ success: boolean; error?: string }>;
}) {
  const [values, setValues] = useState(fields);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  function setValue(key: string, value: number) {
    setValues((prev) => prev.map((f) => (f.key === key ? { ...f, value } : f)));
  }

  function save() {
    setStatus("idle");
    startTransition(async () => {
      const res = await onSave(values);
      setStatus(res.success ? "saved" : "error");
    });
  }

  return (
    <div>
      <div className="text-[12.5px] font-bold uppercase tracking-wide text-ze-muted">{title}</div>
      <div className="mt-2.5 flex flex-col gap-2">
        {values.map((f) => (
          <div key={f.key} className="flex items-center justify-between gap-3">
            <span className="text-[13.5px] text-slate-600">{f.label}</span>
            <input
              type="number"
              min={0}
              value={f.value}
              onChange={(e) => setValue(f.key, Number(e.target.value) || 0)}
              className="w-32 rounded-lg border border-ze-border px-2.5 py-1.5 text-[13.5px] outline-none transition-colors focus:border-ze-primary"
            />
          </div>
        ))}
      </div>
      <div className="mt-2.5 flex items-center gap-3">
        <button
          onClick={save}
          disabled={isPending}
          className="rounded-lg border border-ze-primary bg-ze-primary px-3 py-1.5 text-[13px] font-semibold text-white transition-opacity disabled:opacity-60"
        >
          {isPending ? "Сохранение…" : "Сохранить"}
        </button>
        {status === "saved" && <span className="text-[12.5px] text-emerald-600">Сохранено</span>}
        {status === "error" && <span className="text-[12.5px] text-red-600">Ошибка сохранения</span>}
      </div>
    </div>
  );
}

// Редактирование пакетов поступления (GLOBAL/CHINA) — сумма + текстовые детали
// (цель, срок подготовки, формат занятий, состав), которые видит менеджер и клиент.
function PackageDetailsEditor({
  packages,
  onSave,
}: {
  packages: Record<string, EducationPackage>;
  onSave: (next: Record<string, EducationPackage>) => Promise<{ success: boolean; error?: string }>;
}) {
  const [values, setValues] = useState(packages);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  function setField(key: string, field: keyof EducationPackage, value: string | number) {
    setValues((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  }

  function addProgram() {
    const key = `program_${Date.now().toString(36)}`;
    setValues((prev) => ({
      ...prev,
      [key]: { label: "Новая программа", amount: 0, goal: "", duration: "", format: "", description: "" },
    }));
  }

  function removeProgram(key: string) {
    setValues((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function save() {
    setStatus("idle");
    startTransition(async () => {
      const res = await onSave(values);
      setStatus(res.success ? "saved" : "error");
    });
  }

  return (
    <div>
      <div className="text-[12.5px] font-bold uppercase tracking-wide text-ze-muted">Пакеты поступления (GLOBAL/CHINA)</div>
      <div className="mt-2.5 flex flex-col gap-4">
        {Object.entries(values).map(([key, pkg]) => (
          <div key={key} className="rounded-xl border border-ze-border p-3">
            <div className="flex items-center justify-between gap-3">
              <input
                value={pkg.label}
                onChange={(e) => setField(key, "label", e.target.value)}
                className="flex-1 rounded-lg border border-ze-border px-2.5 py-1.5 text-[13.5px] font-semibold outline-none transition-colors focus:border-ze-primary"
              />
              <input
                type="number"
                min={0}
                value={pkg.amount}
                onChange={(e) => setField(key, "amount", Number(e.target.value) || 0)}
                className="w-32 rounded-lg border border-ze-border px-2.5 py-1.5 text-[13.5px] outline-none transition-colors focus:border-ze-primary"
              />
              <button
                onClick={() => removeProgram(key)}
                title="Удалить программу"
                className="rounded-lg border border-ze-border px-2.5 py-1.5 text-[13px] font-semibold text-red-600 transition-colors hover:border-red-300 hover:bg-red-50"
              >
                Удалить
              </button>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <LabeledInput label="Цель" value={pkg.goal} onChange={(v) => setField(key, "goal", v)} />
              <LabeledInput label="Срок подготовки" value={pkg.duration} onChange={(v) => setField(key, "duration", v)} />
              <LabeledInput label="Формат занятий" value={pkg.format} onChange={(v) => setField(key, "format", v)} className="sm:col-span-2" />
              <LabeledTextarea label="Что входит (описание)" value={pkg.description} onChange={(v) => setField(key, "description", v)} className="sm:col-span-2" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2.5 flex items-center gap-3">
        <button
          onClick={addProgram}
          className="rounded-lg border border-dashed border-ze-primary px-3 py-1.5 text-[13px] font-semibold text-ze-primary transition-colors hover:bg-ze-primary/5"
        >
          + Добавить программу
        </button>
        <button
          onClick={save}
          disabled={isPending}
          className="rounded-lg border border-ze-primary bg-ze-primary px-3 py-1.5 text-[13px] font-semibold text-white transition-opacity disabled:opacity-60"
        >
          {isPending ? "Сохранение…" : "Сохранить"}
        </button>
        {status === "saved" && <span className="text-[12.5px] text-emerald-600">Сохранено</span>}
        {status === "error" && <span className="text-[12.5px] text-red-600">Ошибка сохранения</span>}
      </div>
    </div>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1 text-[12px] text-ze-muted ${className}`}>
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-ze-border px-2.5 py-1.5 text-[13.5px] text-ze-ink outline-none transition-colors focus:border-ze-primary"
      />
    </label>
  );
}

function LabeledTextarea({
  label,
  value,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1 text-[12px] text-ze-muted ${className}`}>
      {label}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="rounded-lg border border-ze-border px-2.5 py-1.5 text-[13.5px] text-ze-ink outline-none transition-colors focus:border-ze-primary"
      />
    </label>
  );
}