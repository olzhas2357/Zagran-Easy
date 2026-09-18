"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, FileSpreadsheet, Upload } from "lucide-react";
import { commitUniversityImport, previewUniversityImport, type UniversityImportPreview } from "@/lib/staff-actions";
import type { UniversityImportHistoryItem } from "@/lib/staff-data";

const targets = [
  ["name", "Название *"], ["slug", "Slug *"], ["country", "Страна (ID, slug или название) *"], ["city", "Город"], ["type", "Тип (public/private)"],
  ["name_local", "Локальное название"], ["website_url", "Сайт"], ["address", "Адрес"], ["latitude", "Широта"], ["longitude", "Долгота"],
  ["google_maps_url", "Google Maps"], ["youtube_url", "YouTube"], ["virtual_tour_url", "Виртуальный тур"], ["logo_url", "Логотип"],
  ["tuition_from", "Обучение от"], ["tuition_to", "Обучение до"], ["tuition_currency", "Валюта обучения (ISO)"],
  ["application_fee", "Регистрационный взнос"], ["application_fee_currency", "Валюта регистрационного взноса (ISO)"],
  ["medical_insurance_cost", "Страховка"], ["medical_insurance_currency", "Валюта страховки (ISO)"],
  ["dormitory_cost", "Общежитие"], ["dormitory_currency", "Валюта общежития (ISO)"], ["has_grant", "Есть грант"], ["has_dormitory", "Есть общежитие"],
  ["degree_levels", "Уровни программ"], ["languages", "Языки"], ["specialties", "Специальности"], ["requirements", "Требования"],
  ["advantages", "Преимущества"], ["limitations", "Ограничения"], ["contact_email", "Email"], ["contact_phone", "Телефон"],
  ["description", "Описание"], ["information_source", "Источник информации"], ["is_partner", "Партнёр"], ["is_active", "Опубликован"],
] as const;

export function UniversityImport({ initialHistory }: { initialHistory: UniversityImportHistoryItem[] }) {
  const [preview, setPreview] = useState<UniversityImportPreview | null>(null);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ valid_rows: number; error_rows: number; errors: { row: number; message: string }[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function upload(formData: FormData) {
    setError(null); setResult(null);
    startTransition(async () => {
      const res = await previewUniversityImport(formData);
      if (!res.success || !res.preview) return setError(res.error || "Не удалось прочитать файл");
      setPreview(res.preview);
      const auto: Record<string, string> = {};
      targets.forEach(([key]) => { const header = res.preview!.headers.find((h) => h.toLowerCase() === key); if (header) auto[key] = header; });
      setMapping(auto);
    });
  }

  function commit() {
    if (!preview) return;
    setError(null);
    startTransition(async () => {
      const res = await commitUniversityImport(preview.id, mapping);
      if (!res.success) return setError(res.error);
      setResult(res.result); setPreview(null);
    });
  }

  return <div className="mt-5 flex flex-col gap-4">
    <form action={upload} className="rounded-[20px] border border-ze-border bg-white p-5 sm:p-6">
      <div className="flex items-center gap-3"><FileSpreadsheet className="h-7 w-7 text-ze-primary" /><div><div className="font-bold">CSV / XLSX файл</div><div className="text-[13px] text-ze-muted">До 10 МБ и 2000 строк. Первая строка должна содержать названия колонок.</div></div></div>
      <div className="mt-4 flex flex-wrap items-center gap-3"><input name="file" type="file" accept=".csv,.xlsx" required className="text-[13px]" /><button disabled={pending} className="flex items-center gap-2 rounded-xl bg-ze-accent px-4 py-2.5 text-[13px] font-semibold text-white disabled:opacity-60"><Upload className="h-4 w-4" />{pending ? "Читаем…" : "Предпросмотр"}</button></div>
    </form>

    {preview && <>
      <section className="rounded-[20px] border border-ze-border bg-white p-5 sm:p-6"><h2 className="font-bold">Сопоставление колонок</h2><p className="mt-1 text-[13px] text-ze-muted">Файл: {preview.file_name}, строк: {preview.total_rows}. Поля со звёздочкой обязательны.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">{targets.map(([key, label]) => <label key={key}><div className="mb-1 text-[12px] font-semibold text-ze-muted">{label}</div><select value={mapping[key] || ""} onChange={(e) => setMapping((m) => ({ ...m, [key]: e.target.value }))} className="w-full rounded-xl border border-ze-border bg-white px-3 py-2.5 text-[13px]"><option value="">Не импортировать</option>{preview.headers.map((h) => <option key={h} value={h}>{h}</option>)}</select></label>)}</div>
      </section>
      <section className="overflow-hidden rounded-[20px] border border-ze-border bg-white"><div className="p-5 pb-3 font-bold">Предпросмотр первых {preview.preview_rows.length} строк</div><div className="overflow-x-auto"><table className="min-w-full text-left text-[12px]"><thead className="bg-slate-50"><tr>{preview.headers.map((h) => <th key={h} className="whitespace-nowrap px-3 py-2 font-semibold">{h}</th>)}</tr></thead><tbody>{preview.preview_rows.map((row, i) => <tr key={i} className="border-t border-ze-border">{preview.headers.map((h) => <td key={h} className="max-w-[220px] truncate px-3 py-2">{String(row[h] ?? "")}</td>)}</tr>)}</tbody></table></div></section>
      <button type="button" onClick={commit} disabled={pending || !mapping.name || !mapping.slug || !mapping.country} className="w-fit rounded-xl bg-emerald-600 px-5 py-3 text-[14px] font-semibold text-white disabled:opacity-50">{pending ? "Импортируем…" : "Подтвердить импорт"}</button>
    </>}
    {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-600">{error}</div>}
    {result && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-800"><div className="flex items-center gap-2 font-bold"><CheckCircle2 className="h-4 w-4" />Импорт завершён: обработано {result.valid_rows}, ошибок {result.error_rows}</div>{result.errors.length > 0 && <ul className="mt-2 list-disc pl-5">{result.errors.slice(0, 20).map((e, i) => <li key={i}>Строка {e.row}: {e.message}</li>)}</ul>}</div>}
    <section className="rounded-[20px] border border-ze-border bg-white p-5 sm:p-6"><h2 className="font-bold">Журнал импорта</h2><div className="mt-3 flex flex-col divide-y divide-ze-border">{initialHistory.map((item) => <div key={item.id} className="grid gap-1 py-2.5 text-[12.5px] sm:grid-cols-[1fr_auto_auto]"><div><div className="font-semibold">{item.file_name}</div><div className="text-ze-muted">{new Date(item.created_at).toLocaleString("ru-RU")}</div></div><div className="text-ze-muted">Всего {item.total_rows} · успешно {item.valid_rows} · ошибок {item.error_rows}</div><div className="font-semibold">{item.status}</div></div>)}{!initialHistory.length && <div className="py-3 text-[13px] text-ze-muted">Импортов пока не было.</div>}</div></section>
  </div>;
}
