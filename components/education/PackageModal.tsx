"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, ChevronRight, Clock, Package, Wallet, X } from "lucide-react";
import type { EducationPackage } from "@/lib/types";

export function PackageModal({ pkg, price, extraCostsText }: {
  pkg: EducationPackage;
  price: string;
  extraCostsText: string[];
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex w-full cursor-pointer items-start justify-between gap-4 rounded-[28px] border border-slate-200/80 bg-white p-6 text-left shadow-[0_18px_50px_rgba(15,23,42,.07)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(26,86,219,.14)]"
      >
        <div className="min-w-0">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ze-primary text-white shadow-[0_8px_20px_rgba(26,86,219,.22)]"><Package className="h-5 w-5" /></span>
          <h3 className="mt-4 text-xl font-extrabold leading-snug text-ze-ink">{pkg.name}</h3>
        </div>
        <div className="flex flex-none items-center gap-3">
          <div className="rounded-2xl bg-blue-50 px-4 py-3 text-right">
            <p className="text-[11px] font-bold uppercase tracking-wide text-ze-primary">Стоимость</p>
            <p className="mt-0.5 text-lg font-extrabold text-ze-ink">{price}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-0.5" />
        </div>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-stretch justify-center bg-slate-950/60 backdrop-blur-sm sm:items-center sm:p-6" onClick={() => setOpen(false)}>
          <div role="dialog" aria-modal="true" aria-label={pkg.name} onClick={(e) => e.stopPropagation()} className="relative flex h-full w-full flex-col overflow-hidden bg-white sm:h-auto sm:max-h-[92vh] sm:max-w-3xl sm:rounded-[28px] sm:shadow-2xl">
            <div className="flex items-start justify-between gap-4 bg-gradient-to-br from-ze-primary to-[#0B3FA8] p-6 text-white sm:p-8">
              <div className="min-w-0">
                <p className="text-base font-bold uppercase tracking-[0.18em] text-white/70">Пакет полного сопровождения</p>
                <h2 className="mt-2 text-2xl font-extrabold leading-tight sm:text-3xl">{pkg.name}</h2>
                <p className="mt-3 inline-flex rounded-full bg-white/15 px-3.5 py-1.5 text-base font-bold">{price}</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Закрыть" className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-7 overflow-y-auto p-6 sm:p-8">
              {pkg.description && <p className="text-lg leading-8 text-slate-600">{pkg.description}</p>}

              {pkg.stages.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 text-base font-bold text-ze-ink"><Clock className="h-4 w-4 text-ze-primary" /> Этапы и сроки</h4>
                  <ol className="mt-3 space-y-3">
                    {pkg.stages.map((stage, i) => (
                      <li key={stage} className="flex gap-3">
                        <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-ze-primary text-base font-bold text-white">{i + 1}</span>
                        <span className="pt-0.5 text-lg leading-7 text-slate-700">{stage}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {pkg.priceNote && (
                <p className="rounded-2xl bg-slate-50 px-4 py-3 text-lg leading-7 text-slate-600"><Wallet className="mb-0.5 mr-1.5 inline h-4 w-4 text-ze-primary" />{pkg.priceNote}</p>
              )}

              <div>
                <h4 className="text-base font-bold text-ze-ink">Прочие расходы</h4>
                {extraCostsText.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {extraCostsText.map((text) => (
                      <span key={text} className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-base font-semibold text-amber-900">{text}</span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-base text-slate-500">Уточняется у менеджера</p>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 p-5">
                <h4 className="flex items-center gap-2 text-base font-bold text-ze-ink"><ArrowRight className="h-4 w-4 text-ze-primary" /> Как различаются сроки?</h4>
                {pkg.stages.length > 0 ? (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5 text-base font-semibold text-slate-600">
                    {pkg.stages.map((stage, i) => (
                      <span key={stage} className="flex items-center gap-1.5">
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-ze-primary">{stage}</span>
                        {i < pkg.stages.length - 1 && <ArrowRight className="h-3 w-3 text-slate-300" />}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-base text-slate-500">Сроки уточняются</p>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 p-5">
                <h4 className="flex items-center gap-2 text-base font-bold text-ze-ink"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Как выбрать подходящую программу?</h4>
                <p className="mt-3 text-lg leading-8 text-slate-600">{pkg.selectionGuide || "Уточняется у менеджера"}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
