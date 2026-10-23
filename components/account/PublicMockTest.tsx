"use client";

import { useState, useSyncExternalStore, useTransition } from "react";
import { createLead } from "@/lib/actions";
import { formatKazakhstanPhone, isValidPhone, KAZAKHSTAN_PHONE_START } from "@/lib/utils";
import type { MockTestDetail } from "@/lib/mock-test-data";
import { MockTestRunner } from "./MockTestRunner";

const DESTINATIONS = ["Китай", "Италия", "Турция", "Другая страна", "Пока не решил(а)"];
const STORAGE_KEY = "ze_mock_test_lead";

const inputClass =
  "w-full rounded-xl border border-ze-border bg-white px-3.5 py-3 text-[14px] text-ze-ink outline-none focus:border-ze-primary";

const noopSubscribe = () => () => {};

// Перед публичным тестом собираем контакты и создаём лид, затем открываем тест.
export function PublicMockTest({ test }: { test: MockTestDetail }) {
  const [started, setStarted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(KAZAKHSTAN_PHONE_START);
  const [destination, setDestination] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Не просим данные повторно после обновления страницы (на сервере — false).
  const alreadyRegistered = useSyncExternalStore(
    noopSubscribe,
    () => sessionStorage.getItem(`${STORAGE_KEY}:${test.id}`) === "1",
    () => false,
  );
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("Укажите имя");
    if (!isValidPhone(phone)) return setError("Укажите корректный мобильный номер Казахстана");
    if (!destination) return setError("Выберите, куда хотите поступать");

    startTransition(async () => {
      const res = await createLead({
        source: "form",
        service: `mock-test-${test.examType.toLowerCase()}`,
        name: name.trim(),
        phone,
        message: `Mock test: ${test.title}. Куда хочет поступать: ${destination}`,
      });
      if (!res.success) {
        setError(res.error || "Не удалось сохранить данные. Попробуйте ещё раз.");
        return;
      }
      sessionStorage.setItem(`${STORAGE_KEY}:${test.id}`, "1");
      setStarted(true);
    });
  }

  if (started || alreadyRegistered) return <MockTestRunner test={test} mode="public" />;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-[20px] border border-ze-border bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
      <div>
        <div className="text-[16px] font-bold text-ze-ink">Перед началом теста</div>
        <p className="mt-1 text-[13.5px] text-ze-muted">
          Оставьте контакты — менеджер поможет разобрать результат и подскажет, как подготовиться. Тест бесплатный.
        </p>
      </div>

      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше имя" autoComplete="name" className={inputClass} />
      <input
        value={phone}
        onChange={(e) => setPhone(formatKazakhstanPhone(e.target.value))}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="+7 (___) ___ __ __"
        className={inputClass}
      />
      <select value={destination} onChange={(e) => setDestination(e.target.value)} className={inputClass}>
        <option value="">Куда хотите поступать?</option>
        {DESTINATIONS.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      {error && <div className="rounded-xl bg-red-50 px-3.5 py-3 text-[13.5px] font-medium text-red-600">{error}</div>}
      <button
        type="submit"
        disabled={isPending}
        className="w-fit rounded-xl bg-ze-primary px-6 py-3 text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(26,86,219,0.22)] transition-all hover:-translate-y-0.5 hover:bg-ze-primary-dark disabled:translate-y-0 disabled:opacity-60"
      >
        {isPending ? "Сохраняем…" : "Начать тест"}
      </button>
      <p className="text-[12px] text-ze-muted">Нажимая кнопку, вы соглашаетесь на обработку контактных данных для связи с вами.</p>
    </form>
  );
}
