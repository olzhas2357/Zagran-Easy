"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Client } from "@/lib/types";
import { createClient, updateClient, type ClientInput } from "@/lib/staff-actions";

const inputClass = "w-full rounded-xl border border-ze-border bg-white px-3.5 py-2.5 text-[14px] outline-none focus:border-ze-primary";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="flex flex-col gap-1.5 text-[12.5px] font-semibold text-ze-muted">{label}{children}</label>;
}

function toLocalDateTime(iso?: string | null) {
  if (!iso) return "";
  const date = new Date(iso);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

export function ClientForm({ initial }: { initial?: Client }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ClientInput>({
    fullName: initial?.fullName || "",
    phone: initial?.phone || "",
    email: initial?.email || "",
    city: initial?.city || "",
    leadCategory: initial?.leadCategory || "",
    salesStatus: initial?.salesStatus || "new",
    product: initial?.product || "",
    studyCountry: initial?.studyCountry || "",
    specialty: initial?.specialty || "",
    educationLevel: initial?.educationLevel || "",
    intakeYear: initial?.intakeYear,
    intakeName: initial?.intakeName || "",
    budget: initial?.budget,
    languageLevel: initial?.languageLevel || "",
    needsGrant: initial?.needsGrant || false,
    needsDormitory: initial?.needsDormitory || false,
    preferences: initial?.preferences || "",
    dealProbability: initial?.dealProbability,
    nextAction: initial?.nextAction || "",
    nextContactAt: toLocalDateTime(initial?.nextContactAt),
  });

  function set<K extends keyof ClientInput>(key: K, value: ClientInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const payload = { ...form, nextContactAt: form.nextContactAt ? new Date(form.nextContactAt).toISOString() : "" };
      const result = initial ? await updateClient(initial.id, payload) : await createClient(payload);
      if (!result.success || !result.clientId) return setError(result.error || "Не удалось сохранить клиента");
      router.push(`/staff/clients/${result.clientId}`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <section className="rounded-[20px] border border-ze-border bg-white p-5">
        <h2 className="text-[16px] font-bold">Контактная информация</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="ФИО *"><input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} className={inputClass} /></Field>
          <Field label="Телефон"><input value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputClass} /></Field>
          <Field label="Email"><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputClass} /></Field>
          <Field label="Город"><input value={form.city} onChange={(e) => set("city", e.target.value)} className={inputClass} /></Field>
        </div>
      </section>

      <section className="rounded-[20px] border border-ze-border bg-white p-5">
        <h2 className="text-[16px] font-bold">Квалификация</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Категория лида"><select value={form.leadCategory} onChange={(e) => set("leadCategory", e.target.value as ClientInput["leadCategory"])} className={inputClass}><option value="">Не указана</option>{["A+", "A", "B", "C"].map((v) => <option key={v}>{v}</option>)}</select></Field>
          <Field label="Статус продажи"><select value={form.salesStatus} onChange={(e) => set("salesStatus", e.target.value as ClientInput["salesStatus"])} className={inputClass}><option value="new">Новый</option><option value="qualified">Квалифицирован</option><option value="proposal">Предложение</option><option value="negotiation">Переговоры</option><option value="won">Продажа</option><option value="lost">Отказ</option></select></Field>
          <Field label="Вероятность сделки, %"><input type="number" min={0} max={100} value={form.dealProbability ?? ""} onChange={(e) => set("dealProbability", e.target.value ? Number(e.target.value) : null)} className={inputClass} /></Field>
          <Field label="Продукт"><input value={form.product} onChange={(e) => set("product", e.target.value)} className={inputClass} /></Field>
          <Field label="Страна обучения"><input value={form.studyCountry} onChange={(e) => set("studyCountry", e.target.value)} className={inputClass} /></Field>
          <Field label="Специальность"><input value={form.specialty} onChange={(e) => set("specialty", e.target.value)} className={inputClass} /></Field>
          <Field label="Уровень образования"><input value={form.educationLevel} onChange={(e) => set("educationLevel", e.target.value)} className={inputClass} /></Field>
          <Field label="Intake"><input value={form.intakeName} onChange={(e) => set("intakeName", e.target.value)} className={inputClass} /></Field>
          <Field label="Год"><input type="number" min={2000} max={2200} value={form.intakeYear ?? ""} onChange={(e) => set("intakeYear", e.target.value ? Number(e.target.value) : null)} className={inputClass} /></Field>
          <Field label="Бюджет, KZT"><input type="number" min={0} value={form.budget ?? ""} onChange={(e) => set("budget", e.target.value ? Number(e.target.value) : null)} className={inputClass} /></Field>
          <Field label="Уровень языка"><input value={form.languageLevel} onChange={(e) => set("languageLevel", e.target.value)} className={inputClass} /></Field>
          <div className="flex items-end gap-4 pb-2">
            <label className="flex items-center gap-2 text-[13px] font-medium"><input type="checkbox" checked={form.needsGrant} onChange={(e) => set("needsGrant", e.target.checked)} />Нужен грант</label>
            <label className="flex items-center gap-2 text-[13px] font-medium"><input type="checkbox" checked={form.needsDormitory} onChange={(e) => set("needsDormitory", e.target.checked)} />Общежитие</label>
          </div>
        </div>
        <Field label="Дополнительные пожелания"><textarea rows={4} value={form.preferences} onChange={(e) => set("preferences", e.target.value)} className={inputClass} /></Field>
      </section>

      <section className="rounded-[20px] border border-ze-border bg-white p-5">
        <h2 className="text-[16px] font-bold">Следующее действие</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Что сделать"><input value={form.nextAction} onChange={(e) => set("nextAction", e.target.value)} className={inputClass} /></Field>
          <Field label="Дата следующего контакта"><input type="datetime-local" value={form.nextContactAt} onChange={(e) => set("nextContactAt", e.target.value)} className={inputClass} /></Field>
        </div>
      </section>

      {error && <p className="text-[13px] text-red-600">{error}</p>}
      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => router.back()} className="rounded-xl border border-ze-border bg-white px-5 py-3 text-[14px] font-semibold">Отмена</button>
        <button disabled={pending} className="rounded-xl bg-ze-primary px-5 py-3 text-[14px] font-semibold text-white disabled:opacity-50">{pending ? "Сохранение…" : "Сохранить"}</button>
      </div>
    </form>
  );
}
