// ============================================================
// ZagranEasy — Quiz Logic
// 3-шаговый квиз для подбора услуги
// ============================================================

export interface QuizStep {
  id: string;
  question: string;
  options: QuizOption[];
}

export interface QuizOption {
  label: string;
  icon: string;
  value: string;
}

export interface QuizAnswers {
  goal: string;
  budget: string;
  timeline: string;
}

export interface QuizResult {
  serviceId: string;
  serviceTitle: string;
  serviceIcon: string;
  description: string;
  href: string;
  waMessage: string;
}

// ---- Шаги квиза ----

export const QUIZ_STEPS: QuizStep[] = [
  {
    id: "goal",
    question: "Какая у вас цель?",
    options: [
      { label: "Учиться за границей", icon: "🎓", value: "education" },
      { label: "Путешествовать", icon: "✈️", value: "tours" },
      { label: "Работать за рубежом", icon: "💼", value: "work" },
      { label: "Получить визу в США", icon: "🗽", value: "visa" },
    ],
  },
  {
    id: "budget",
    question: "Какой у вас бюджет?",
    options: [
      { label: "До $3 000", icon: "💰", value: "low" },
      { label: "$3 000 — $10 000", icon: "💵", value: "mid" },
      { label: "Более $10 000", icon: "💎", value: "high" },
      { label: "Нужна консультация", icon: "🤔", value: "consult" },
    ],
  },
  {
    id: "timeline",
    question: "Когда планируете?",
    options: [
      { label: "В ближайший месяц", icon: "⚡", value: "asap" },
      { label: "Через 2-3 месяца", icon: "📅", value: "soon" },
      { label: "Через полгода+", icon: "🗓️", value: "later" },
      { label: "Просто изучаю", icon: "🔍", value: "exploring" },
    ],
  },
];

// ---- Маппинг результатов ----

const RESULT_MAP: Record<string, Omit<QuizResult, "waMessage">> = {
  education: {
    serviceId: "education",
    serviceTitle: "Обучение за рубежом",
    serviceIcon: "🎓",
    description:
      "Поможем подобрать университет, оформить документы и получить визу. 3200+ студентов уже учатся через нас.",
    href: "/education",
  },
  tours: {
    serviceId: "tours",
    serviceTitle: "Эксклюзивные туры",
    serviceIcon: "✈️",
    description:
      "Авторские маршруты в самые красивые уголки мира. Перелёт, отель, экскурсии — всё включено.",
    href: "/tours",
  },
  work: {
    serviceId: "work",
    serviceTitle: "Работа за границей",
    serviceIcon: "💼",
    description:
      "Легальное трудоустройство с полным сопровождением: виза, контракт, адаптация на месте.",
    href: "/work",
  },
  visa: {
    serviceId: "visa",
    serviceTitle: "Виза в США",
    serviceIcon: "🗽",
    description:
      "98% одобрений. Заполнение DS-160, подготовка к интервью, запись в посольство.",
    href: "/visa-usa",
  },
};

// ---- Получение результата ----

export function getQuizResult(answers: QuizAnswers): QuizResult {
  const base = RESULT_MAP[answers.goal] || RESULT_MAP.education;

  const budgetLabels: Record<string, string> = {
    low: "до $3 000",
    mid: "$3 000 — $10 000",
    high: "более $10 000",
    consult: "нужна консультация",
  };

  const timelineLabels: Record<string, string> = {
    asap: "в ближайший месяц",
    soon: "через 2-3 месяца",
    later: "через полгода+",
    exploring: "просто изучаю",
  };

  const waMessage = [
    "Здравствуйте! Прошёл квиз на сайте ZagranEasy.",
    "",
    `Цель: ${base.serviceTitle}`,
    `Бюджет: ${budgetLabels[answers.budget] || answers.budget}`,
    `Сроки: ${timelineLabels[answers.timeline] || answers.timeline}`,
    "",
    "Хочу бесплатную консультацию!",
  ].join("\n");

  return { ...base, waMessage };
}
