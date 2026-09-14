"use client";
export function PrintOfferButton() { return <button onClick={() => window.print()} className="rounded-xl bg-ze-primary px-4 py-2.5 text-sm font-semibold text-white print:hidden">Сохранить PDF / Печать</button>; }
