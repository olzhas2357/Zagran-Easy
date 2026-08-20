// ============================================================
// ZagranEasy — Calculator Logic (Портал сотрудников)
// Расчёт стоимости услуг для каждого направления
// ============================================================

// ---- Типы ----

export type ServiceType = "education" | "tours" | "work" | "visa" | "realestate";

export interface CalcInput {
  service: ServiceType;
  country?: string;
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

// ---- Тарифы (конфигурируемые) ----

const EDUCATION_FEES: Record<string, number> = {
  turkey: 500,    // сервисный сбор
  china: 700,
  italy: 600,
  malaysia: 550,
};

const EDUCATION_EXTRAS: Record<string, number> = {
  "Перевод документов": 150,
  "Нотариальное заверение": 100,
  "Визовое сопровождение": 300,
  "Встреча в аэропорту": 100,
  "Поиск жилья": 200,
};

const VISA_USA_FEE = 350; // сервисный сбор
const CONSULAR_FEE = 185; // консульский сбор (фиксированный)

const WORK_FEES: Record<string, number> = {
  turkey: 800,
  poland: 1200,
  germany: 1500,
};

// ---- Расчёт ----

export function calculate(input: CalcInput): CalcResult {
  const items: CalcLineItem[] = [];
  let note: string | undefined;

  switch (input.service) {
    case "education": {
      const country = input.country || "turkey";
      const baseFee = EDUCATION_FEES[country] || 500;
      items.push({ label: `Сервисный сбор (${country})`, amount: baseFee });

      if (input.extras) {
        for (const extra of input.extras) {
          const amount = EDUCATION_EXTRAS[extra];
          if (amount) items.push({ label: extra, amount });
        }
      }

      note = "Стоимость обучения оплачивается напрямую университету";
      break;
    }

    case "visa": {
      items.push({ label: "Сервисный сбор ZagranEasy", amount: VISA_USA_FEE });
      items.push({ label: "Консульский сбор (оплата в посольстве)", amount: CONSULAR_FEE });

      if (input.extras?.includes("Подготовка к интервью")) {
        items.push({ label: "Подготовка к интервью (3 сессии)", amount: 200 });
      }
      if (input.extras?.includes("Срочная запись")) {
        items.push({ label: "Мониторинг срочной записи", amount: 150 });
      }

      note = "Консульский сбор оплачивается отдельно";
      break;
    }

    case "work": {
      const country = input.country || "turkey";
      const baseFee = WORK_FEES[country] || 1000;
      items.push({ label: `Трудоустройство (${country})`, amount: baseFee });
      items.push({ label: "Оформление рабочей визы", amount: 400 });

      if (input.extras?.includes("Релокация")) {
        items.push({ label: "Пакет релокации (жильё + адаптация)", amount: 500 });
      }
      break;
    }

    case "tours": {
      const baseCost = input.duration ? input.duration * 250 : 2500;
      items.push({ label: "Тур (базовая стоимость)", amount: baseCost });
      items.push({ label: "Сервисный сбор", amount: 200 });
      break;
    }

    case "realestate": {
      items.push({ label: "Подбор объекта", amount: 0 });
      items.push({ label: "Юридическое сопровождение сделки", amount: 1500 });
      items.push({ label: "Оформление ВНЖ", amount: 800 });
      note = "Подбор объекта — бесплатно. Оплата только при покупке.";
      break;
    }
  }

  const total = items.reduce((sum, item) => sum + item.amount, 0);

  // Формируем сообщение для клиента
  const waMessage = [
    `Расчёт стоимости — ${getServiceLabel(input.service)}`,
    "",
    ...items.map((i) => `${i.label}: $${i.amount.toLocaleString("ru-RU")}`),
    "",
    `Итого: $${total.toLocaleString("ru-RU")}`,
    note ? `\n${note}` : "",
    "",
    "По вопросам: +7 747 911 2606",
  ].join("\n");

  return { items, total, currency: "$", note, waMessage };
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
export function getExtrasForService(service: ServiceType): string[] {
  switch (service) {
    case "education":
      return Object.keys(EDUCATION_EXTRAS);
    case "visa":
      return ["Подготовка к интервью", "Срочная запись"];
    case "work":
      return ["Релокация"];
    default:
      return [];
  }
}
