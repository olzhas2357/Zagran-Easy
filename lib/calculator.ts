// ============================================================
// ZagranEasy — Calculator Logic (Портал сотрудников)
// Расчёт стоимости услуг для каждого направления.
// Тарифы редактируются менеджером (см. lib/staff-data.ts getCalculatorSettings /
// lib/staff-actions.ts updateCalculatorSetting) и хранятся в Supabase
// (таблица calculator_settings). DEFAULT_CALCULATOR_SETTINGS — значения по
// умолчанию, используются пока настройки не загрузились или отсутствуют.
// Валюта — тенге (₸).
// ============================================================

export type ServiceType = "education" | "tours" | "work" | "visa" | "realestate";

export interface EducationPackage {
  label: string;
  amount: number;
  /** Цель пакета (например "Поступление на бакалавриат в англоязычную страну"). */
  goal: string;
  /** Срок подготовки (например "6–12 месяцев"). */
  duration: string;
  /** Формат занятий (группа/индивидуально, онлайн/офлайн, кол-во часов). */
  format: string;
  /** Подробное описание состава пакета для менеджера/клиента. */
  description: string;
}

export interface CalculatorSettings {
  education_fees: Record<string, number>;
  education_extras: Record<string, number>;
  education_packages: Record<string, EducationPackage>;
  visa_fees: {
    service: number;
    consular: number;
    interview_prep: number;
    urgent_booking: number;
  };
  work_fees: Record<string, number>; // страны + "processing" + "relocation"
  tours_fees: {
    per_day: number;
    service: number;
  };
  realestate_fees: {
    legal_support: number;
    residency_permit: number;
  };
}

export const DEFAULT_CALCULATOR_SETTINGS: CalculatorSettings = {
  education_fees: { turkey: 500, china: 700, italy: 600, malaysia: 550 },
  education_extras: {
    "Перевод документов": 150,
    "Нотариальное заверение": 100,
    "Визовое сопровождение": 300,
    "Встреча в аэропорту": 100,
    "Поиск жилья": 200,
  },
  education_packages: {
    global_2027: {
      label: "GLOBAL 2027 (полный пакет поступления)",
      amount: 1_790_000,
      goal: "Поступление на бакалавриат в англоязычную страну",
      duration: "TODO — уточнить после файла «Два пакета» (ориентировочно 6–12 месяцев)",
      format: "TODO — уточнить формат занятий (группа/индивидуально, онлайн/офлайн)",
      description: "Английский язык + подготовка к IELTS + сопровождение поступления за рубеж (вуз, документы, подача заявки).",
    },
    china_2027: {
      label: "CHINA 2027 (полный пакет поступления)",
      amount: 1_990_000,
      goal: "Поступление на бакалавриат в вуз Китая",
      duration: "TODO — уточнить после файла «Два пакета» (ориентировочно 6–12 месяцев)",
      format: "TODO — уточнить формат занятий (группа/индивидуально, онлайн/офлайн)",
      description: "Китайский язык + подготовка к HSK + CSCA + сопровождение поступления в Китай (вуз, документы, подача заявки).",
    },
  },
  visa_fees: { service: 350, consular: 185, interview_prep: 200, urgent_booking: 150 },
  work_fees: { turkey: 800, poland: 1200, germany: 1500, processing: 400, relocation: 500 },
  tours_fees: { per_day: 250, service: 200 },
  realestate_fees: { legal_support: 1500, residency_permit: 800 },
};

export interface CalcInput {
  service: ServiceType;
  country?: string;
  /** Для education: "support" (только сопровождение) или ключ education_packages (например "global_2027"). */
  program?: string;
  duration?: number;
  extras?: string[];
}

export interface CalcResult {
  items: CalcLineItem[];
  total: number;
  currency: string;
  note?: string;
  waMessage: string;
}

export interface CalcLineItem {
  label: string;
  amount: number;
}

export function formatMoney(amount: number): string {
  return `${amount.toLocaleString("ru-RU")} ₸`;
}

// ---- Расчёт ----

export function calculate(input: CalcInput, settings: CalculatorSettings = DEFAULT_CALCULATOR_SETTINGS): CalcResult {
  const items: CalcLineItem[] = [];
  let note: string | undefined;

  switch (input.service) {
    case "education": {
      const pkg = input.program ? settings.education_packages[input.program] : undefined;

      if (pkg) {
        items.push({ label: pkg.label, amount: pkg.amount });
        note = `${pkg.description} Стоимость обучения в вузе оплачивается отдельно, напрямую университету.`;
        break;
      }

      const country = input.country || "turkey";
      const baseFee = settings.education_fees[country] ?? 500;
      items.push({ label: `Сервисный сбор (${country})`, amount: baseFee });

      if (input.extras) {
        for (const extra of input.extras) {
          const amount = settings.education_extras[extra];
          if (amount) items.push({ label: extra, amount });
        }
      }

      note = "Стоимость обучения оплачивается напрямую университету";
      break;
    }

    case "visa": {
      items.push({ label: "Сервисный сбор ZagranEasy", amount: settings.visa_fees.service });
      items.push({ label: "Консульский сбор (оплата в посольстве)", amount: settings.visa_fees.consular });

      if (input.extras?.includes("Подготовка к интервью")) {
        items.push({ label: "Подготовка к интервью (3 сессии)", amount: settings.visa_fees.interview_prep });
      }
      if (input.extras?.includes("Срочная запись")) {
        items.push({ label: "Мониторинг срочной записи", amount: settings.visa_fees.urgent_booking });
      }

      note = "Консульский сбор оплачивается отдельно";
      break;
    }

    case "work": {
      const country = input.country || "turkey";
      const baseFee = settings.work_fees[country] ?? 1000;
      items.push({ label: `Трудоустройство (${country})`, amount: baseFee });
      items.push({ label: "Оформление рабочей визы", amount: settings.work_fees.processing });

      if (input.extras?.includes("Релокация")) {
        items.push({ label: "Пакет релокации (жильё + адаптация)", amount: settings.work_fees.relocation });
      }
      break;
    }

    case "tours": {
      const baseCost = input.duration ? input.duration * settings.tours_fees.per_day : settings.tours_fees.per_day * 10;
      items.push({ label: "Тур (базовая стоимость)", amount: baseCost });
      items.push({ label: "Сервисный сбор", amount: settings.tours_fees.service });
      break;
    }

    case "realestate": {
      items.push({ label: "Подбор объекта", amount: 0 });
      items.push({ label: "Юридическое сопровождение сделки", amount: settings.realestate_fees.legal_support });
      items.push({ label: "Оформление ВНЖ", amount: settings.realestate_fees.residency_permit });
      note = "Подбор объекта — бесплатно. Оплата только при покупке.";
      break;
    }
  }

  const total = items.reduce((sum, item) => sum + item.amount, 0);

  const waMessage = [
    `Расчёт стоимости — ${getServiceLabel(input.service)}`,
    "",
    ...items.map((i) => `${i.label}: ${formatMoney(i.amount)}`),
    "",
    `Итого: ${formatMoney(total)}`,
    note ? `\n${note}` : "",
    "",
    "По вопросам: +7 747 911 2606",
  ].join("\n");

  return { items, total, currency: "₸", note, waMessage };
}

function getServiceLabel(service: ServiceType): string {
  const labels: Record<ServiceType, string> = {
    education: "Обучение за рубежом",
    tours: "Тур",
    work: "Трудоустройство",
    visa: "Виза в США",
    realestate: "Недвижимость",
  };
  return labels[service];
}

// Доступные экстра-опции для каждого сервиса
export function getExtrasForService(service: ServiceType, settings: CalculatorSettings = DEFAULT_CALCULATOR_SETTINGS): string[] {
  switch (service) {
    case "education":
      return Object.keys(settings.education_extras);
    case "visa":
      return ["Подготовка к интервью", "Срочная запись"];
    case "work":
      return ["Релокация"];
    default:
      return [];
  }
}

// Пакеты поступления (GLOBAL/CHINA 2027) — для селектора "программа" на education.
export function getEducationPackages(settings: CalculatorSettings = DEFAULT_CALCULATOR_SETTINGS) {
  return Object.entries(settings.education_packages).map(([value, pkg]) => ({ value, ...pkg }));
}
