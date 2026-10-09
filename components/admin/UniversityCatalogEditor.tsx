"use client";

import { useMemo, useState, useTransition } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import type { UniversityCatalog, UniversityCatalogItem, UniversityCatalogKind } from "@/lib/types";
import { deleteUniversityCatalogItem, saveUniversityCatalogItem } from "@/lib/staff-actions";

type FieldDefinition = {
  key: string;
  label: string;
  type?: "text" | "number" | "date" | "boolean" | "program" | "intake" | "textarea";
  required?: boolean;
  placeholder?: string;
};

const sections: Record<UniversityCatalogKind, { title: string; singular: string; fields: FieldDefinition[] }> = {
  programs: { title: "Программы", singular: "программу", fields: [
    { key: "name", label: "Название", required: true }, { key: "external_id", label: "Внешний ID" },
    { key: "degree_level", label: "Уровень", required: true, placeholder: "Бакалавриат" },
    { key: "specialty", label: "Специальность" }, { key: "language", label: "Язык обучения" },
    { key: "duration_months", label: "Длительность, месяцев", type: "number" },
    { key: "description", label: "Описание", type: "textarea" }, { key: "is_active", label: "Активна", type: "boolean" },
  ] },
  intakes: { title: "Наборы (intake)", singular: "набор", fields: [
    { key: "program_id", label: "Программа", type: "program", required: true }, { key: "name", label: "Название набора", required: true },
    { key: "academic_year", label: "Учебный год", placeholder: "2026/2027" },
    { key: "application_opens", label: "Начало подачи", type: "date" },
    { key: "application_deadline", label: "Дедлайн", type: "date" }, { key: "study_starts", label: "Начало обучения", type: "date" },
    { key: "seats", label: "Количество мест", type: "number" }, { key: "is_active", label: "Активен", type: "boolean" },
  ] },
  requirements: { title: "Требования", singular: "требование", fields: [
    { key: "program_id", label: "Программа (необязательно)", type: "program" },
    { key: "requirement_type", label: "Тип", required: true, placeholder: "language / document / score" },
    { key: "title", label: "Название", required: true }, { key: "description", label: "Описание", type: "textarea" },
    { key: "minimum_value", label: "Минимальное значение", type: "number" }, { key: "unit", label: "Единица", placeholder: "балл" },
    { key: "sort_order", label: "Порядок", type: "number" }, { key: "is_mandatory", label: "Обязательно", type: "boolean" },
  ] },
  costs: { title: "Стоимость", singular: "стоимость", fields: [
    { key: "program_id", label: "Программа (необязательно)", type: "program" },
    { key: "intake_id", label: "Intake (необязательно)", type: "intake" },
    { key: "category", label: "Категория", required: true, placeholder: "tuition / rector_grant / zagraneasy_service" },
    { key: "title", label: "Название", required: true }, { key: "amount", label: "Сумма", type: "number", required: true },
    { key: "currency", label: "Валюта", placeholder: "USD" }, { key: "period", label: "Период", placeholder: "year / за все 5 лет / единоразово" },
    { key: "valid_from", label: "Действует с", type: "date" }, { key: "valid_until", label: "Действует до", type: "date" },
    { key: "is_required", label: "Обязательный расход", type: "boolean" },
  ] },
  scholarships: { title: "Стипендии и гранты", singular: "стипендию", fields: [
    { key: "program_id", label: "Программа (необязательно)", type: "program" }, { key: "name", label: "Название", required: true },
    { key: "description", label: "Описание", type: "textarea" }, { key: "coverage_type", label: "Тип покрытия", placeholder: "rector_4_plus_1 / percent / fixed / full" },
    { key: "coverage_value", label: "Размер покрытия", type: "number" }, { key: "currency", label: "Валюта" },
    { key: "eligibility", label: "Критерии", type: "textarea" }, { key: "application_deadline", label: "Дедлайн", type: "date" },
    { key: "source_url", label: "Ссылка на источник" }, { key: "is_active", label: "Активна", type: "boolean" },
  ] },
};

const inputClass = "w-full rounded-xl border border-ze-border bg-white px-3 py-2.5 text-[13px] outline-none focus:border-ze-primary";

function emptyItem(kind: UniversityCatalogKind): Record<string, string | number | boolean | null> {
  const item: Record<string, string | number | boolean | null> = {};
  for (const field of sections[kind].fields) item[field.key] = field.type === "boolean" ? true : "";
  if (kind === "costs") item.currency = "USD";
  return item;
}

export function UniversityCatalogEditor({ universityId, initialCatalog }: { universityId: string; initialCatalog: UniversityCatalog }) {
  const [catalog, setCatalog] = useState(initialCatalog);
  const [editing, setEditing] = useState<{ kind: UniversityCatalogKind; id?: string } | null>(null);
  const [draft, setDraft] = useState<Record<string, string | number | boolean | null>>({});
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const programNames = useMemo(() => Object.fromEntries(catalog.programs.map((p) => [p.id, p.name])), [catalog.programs]);

  function open(kind: UniversityCatalogKind, item?: UniversityCatalogItem) {
    setError(null);
    setEditing({ kind, id: item?.id });
    setDraft(item
      ? Object.fromEntries(Object.entries(item).filter(([key]) => key !== "id").map(([key, value]) => [key, value ?? null]))
      : emptyItem(kind));
  }

  function submit() {
    if (!editing) return;
    const definition = sections[editing.kind];
    const missing = definition.fields.find((field) => field.required && String(draft[field.key] ?? "").trim() === "");
    if (missing) return setError(`Заполните поле «${missing.label}»`);
    const data = Object.fromEntries(definition.fields.map((field) => {
      const value = draft[field.key];
      if (field.type === "number") return [field.key, value === "" || value == null ? null : Number(value)];
      if (field.type === "boolean") return [field.key, Boolean(value)];
      return [field.key, typeof value === "string" ? value.trim() || null : value ?? null];
    }));
    startTransition(async () => {
      const res = await saveUniversityCatalogItem(universityId, editing.kind, data, editing.id);
      if (!res.success) return setError(res.error);
      setCatalog((current) => ({
        ...current,
        [editing.kind]: editing.id
          ? current[editing.kind].map((item) => item.id === editing.id ? res.item : item)
          : [...current[editing.kind], res.item],
      }));
      setEditing(null);
    });
  }

  function remove(kind: UniversityCatalogKind, id: string) {
    if (!window.confirm("Удалить эту запись? Связанные данные также могут быть удалены.")) return;
    startTransition(async () => {
      const res = await deleteUniversityCatalogItem(universityId, kind, id);
      if (!res.success) return setError(res.error);
      setCatalog((current) => ({ ...current, [kind]: current[kind].filter((item) => item.id !== id) }));
    });
  }

  return <div className="mt-4 flex flex-col gap-3.5">
    <div>
      <h2 className="text-[21px] font-extrabold text-ze-ink">Связанные справочники</h2>
      <p className="mt-1 text-[13.5px] text-ze-muted">Программы, наборы, требования, цены и стипендии хранятся отдельными записями.</p>
    </div>
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-[13px] leading-5 text-slate-700">
      <div className="font-extrabold text-emerald-800">Как добавить ректорский грант «1 + 4»</div>
      <ol className="mt-2 list-decimal space-y-1 pl-5">
        <li>Добавьте грант с типом покрытия <b>rector_4_plus_1</b>.</li>
        <li>Для каждой цены за 5 лет добавьте стоимость с категорией <b>rector_grant</b>.</li>
        <li>Услуги компании добавьте отдельной стоимостью с категорией <b>zagraneasy_service</b>.</li>
      </ol>
      <p className="mt-2 text-slate-500">Специальный блок появится только у университетов, где заполнен такой грант.</p>
    </div>
    {(Object.keys(sections) as UniversityCatalogKind[]).map((kind) => {
      const section = sections[kind];
      return <section key={kind} className="rounded-[20px] border border-ze-border bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="font-bold text-ze-ink">{section.title} <span className="text-ze-muted">({catalog[kind].length})</span></div>
          <button type="button" onClick={() => open(kind)} className="flex items-center gap-1.5 rounded-lg bg-[#EBF1FE] px-3 py-2 text-[12.5px] font-semibold text-ze-primary">
            <Plus className="h-3.5 w-3.5" /> Добавить
          </button>
        </div>
        <div className="mt-3 flex flex-col gap-2">
          {catalog[kind].map((item) => <div key={item.id} className="flex items-center gap-2 rounded-xl border border-[#EEF1F6] px-3 py-2.5">
            <div className="min-w-0 flex-1 text-[13px]">
              <div className="truncate font-semibold text-ze-ink">{String(item.name || item.title || item.category || "Без названия")}</div>
              <div className="truncate text-ze-muted">{kind === "intakes" ? String(programNames[String(item.program_id)] || "") : String(item.degree_level || item.amount || item.requirement_type || item.coverage_type || "")}</div>
            </div>
            <button type="button" onClick={() => open(kind, item)} className="rounded-lg p-2 text-ze-muted hover:bg-slate-50" aria-label="Редактировать"><Pencil className="h-4 w-4" /></button>
            <button type="button" onClick={() => remove(kind, item.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50" aria-label="Удалить"><Trash2 className="h-4 w-4" /></button>
          </div>)}
          {!catalog[kind].length && <div className="text-[13px] text-ze-muted">Пока нет записей.</div>}
        </div>
      </section>;
    })}

    {editing && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4" onMouseDown={(e) => e.target === e.currentTarget && setEditing(null)}>
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[22px] bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-center justify-between">
          <div className="text-[18px] font-extrabold">{editing.id ? "Редактировать" : "Добавить"} {sections[editing.kind].singular}</div>
          <button type="button" onClick={() => setEditing(null)} className="rounded-lg p-2 text-ze-muted"><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {sections[editing.kind].fields.map((field) => <label key={field.key} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
            <div className="mb-1 text-[12px] font-semibold text-ze-muted">{field.label}{field.required ? " *" : ""}</div>
            {field.type === "boolean" ? <input type="checkbox" checked={Boolean(draft[field.key])} onChange={(e) => setDraft((d) => ({ ...d, [field.key]: e.target.checked }))} className="h-4 w-4" />
              : field.type === "program" ? <select value={String(draft[field.key] ?? "")} onChange={(e) => setDraft((d) => ({ ...d, [field.key]: e.target.value }))} className={inputClass}><option value="">Без привязки</option>{catalog.programs.map((p) => <option key={p.id} value={p.id}>{String(p.name)}</option>)}</select>
              : field.type === "intake" ? <select value={String(draft[field.key] ?? "")} onChange={(e) => setDraft((d) => ({ ...d, [field.key]: e.target.value }))} className={inputClass}><option value="">Без привязки</option>{catalog.intakes.map((i) => <option key={i.id} value={i.id}>{String(i.name)}</option>)}</select>
              : field.type === "textarea" ? <textarea rows={3} value={String(draft[field.key] ?? "")} onChange={(e) => setDraft((d) => ({ ...d, [field.key]: e.target.value }))} className={inputClass} />
              : <input type={field.type === "date" ? "date" : "text"} inputMode={field.type === "number" ? "decimal" : undefined} value={String(draft[field.key] ?? "")} placeholder={field.placeholder} onChange={(e) => setDraft((d) => ({ ...d, [field.key]: e.target.value }))} className={inputClass} />}
          </label>)}
        </div>
        {error && <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[12.5px] text-red-600">{error}</div>}
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={() => setEditing(null)} className="rounded-xl border border-ze-border px-4 py-2.5 text-[13px] font-semibold">Отмена</button>
          <button type="button" onClick={submit} disabled={isPending} className="rounded-xl bg-ze-accent px-4 py-2.5 text-[13px] font-semibold text-white disabled:opacity-60">{isPending ? "Сохраняем…" : "Сохранить"}</button>
        </div>
      </div>
    </div>}
  </div>;
}
