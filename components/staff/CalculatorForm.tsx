"use client";

import { useMemo, useState } from "react";
import { calculate, getExtrasForService, type ServiceType } from "@/lib/calculator";
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

export function CalculatorForm() {
  const [service, setService] = useState<ServiceType>("education");
  const [country, setCountry] = useState("turkey");
  const [duration, setDuration] = useState(10);
  const [extras, setExtras] = useState<string[]>([]);

  const availableExtras = getExtrasForService(service);
  const countries = COUNTRIES_BY_SERVICE[service];

  const result = useMemo(
    () => calculate({ service, country: countries ? country : undefined, duration: service === "tours" ? duration : undefined, extras }),
    [service, country, duration, extras, countries]
  );

  function toggleExtra(extra: string) {
    setExtras((prev) => (prev.includes(extra) ? prev.filter((e) => e !== extra) : [...prev, extra]));
  }

  function changeService(s: ServiceType) {
    setService(s);
    setExtras([]);
    setCountry(COUNTRIES_BY_SERVICE[s]?.[0]?.value || "turkey");
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_380px]">
      <div className="rounded-2xl border border-ze-border bg-white p-5">
        <div className="text-[12px] font-bold uppercase tracking-wide text-ze-muted">Услуга</div>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {SERVICES.map((s) => (
            <button
              key={s.value}
              onClick={() => changeService(s.value)}
              className={`rounded-full border px-3.5 py-2 text-[13px] font-semibold ${
                service === s.value ? "border-ze-primary bg-ze-primary text-white" : "border-ze-border bg-white text-slate-700"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {countries && (
          <>
            <div className="mt-4.5 text-[12px] font-bold uppercase tracking-wide text-ze-muted">Страна</div>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {countries.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCountry(c.value)}
                  className={`rounded-full border px-3.5 py-2 text-[13px] font-semibold ${
                    country === c.value ? "border-ze-primary bg-ze-primary text-white" : "border-ze-border bg-white text-slate-700"
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
            <div className="mt-4.5 text-[12px] font-bold uppercase tracking-wide text-ze-muted">Длительность (дней)</div>
            <input
              type="number"
              min={1}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value) || 1)}
              className="mt-2.5 w-32 rounded-xl border border-ze-border px-3 py-2 text-[14px]"
            />
          </>
        )}

        {availableExtras.length > 0 && (
          <>
            <div className="mt-4.5 text-[12px] font-bold uppercase tracking-wide text-ze-muted">Доп. услуги</div>
            <div className="mt-2.5 flex flex-col gap-1.5">
              {availableExtras.map((extra) => (
                <label key={extra} className="flex items-center gap-2.5 text-[14px]">
                  <input type="checkbox" checked={extras.includes(extra)} onChange={() => toggleExtra(extra)} className="h-4 w-4 accent-[#1A56DB]" />
                  {extra}
                </label>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="rounded-2xl border border-ze-border bg-white p-5">
        <div className="text-[15px] font-bold">Расчёт</div>
        <div className="mt-3 flex flex-col">
          {result.items.map((item) => (
            <div key={item.label} className="flex justify-between border-b border-[#F1F4F9] py-2.5 text-[13.5px] last:border-0">
              <span className="text-slate-600">{item.label}</span>
              <span className="font-semibold">${item.amount.toLocaleString("ru-RU")}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-ze-border pt-3">
          <span className="text-[14px] font-bold">Итого</span>
          <span className="text-[20px] font-extrabold text-ze-primary">${result.total.toLocaleString("ru-RU")}</span>
        </div>
        {/* {result.note && <p className="mt-2 text-[12.5px] text-ze-muted">{result.note}</p>}
        <a
          href={waUrl(result.waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block rounded-xl bg-ze-whatsapp py-3 text-center text-[14px] font-bold text-white hover:bg-ze-whatsapp-dark"
        >
          Отправить клиенту в WhatsApp
        </a> */}
      </div>
    </div>
  );
}
