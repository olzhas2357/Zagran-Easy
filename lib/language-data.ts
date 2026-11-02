// ============================================================
// ZagranEasy — Language Courses Landing (/language)
// Данные вынесены отдельно, чтобы в будущем подключить CMS/backend без переписывания UI.
// ============================================================

export interface LanguageCourse {
  id: string;
  name: string;
  description: string;
  image: string;
  level: string;
  duration: string;
  format: string;
  teacher: string;
  price: string;
  cta: string;
  goals: string[];
}

export interface RealLanguageCourse {
  id: string;
  slug: string;
  title: string;

  exam_type: string;
  level_from: string;
  level_to: string;

  description: string;

  total_lessons: number;
  total_tasks: number;
  estimated_hours: number;

  image_url: string | null;

  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface CourseModule {
  id: string;
  course_id: string;
  slug: string;
  title: string;
  icon: string;
  sort_order: number;
  lessons: CourseLesson[];
}

export interface CourseLesson {
  id: string;
  slug: string;
  title: string;
  sort_order: number;
}

export const LANGUAGE_COURSES: LanguageCourse[] = [
  {
    id: "general-english",
    name: "General English",
    description: "Разговорный английский для жизни, учёбы и путешествий.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&q=80&auto=format&fit=crop",
    level: "A1–C1",
    duration: "8 недель",
    format: "2 занятия / неделя",
    teacher: "Подбирается индивидуально",
    price: "от $99 / месяц",
    cta: "Подробнее",
    goals: ["speaking", "study", "travel"],
  },
  {
    id: "ielts",
    name: "IELTS Preparation",
    description: "Системная подготовка к IELTS с преподавателем-экспертом.",
    image:
      "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=900&q=80&auto=format&fit=crop",
    level: "B1–C1",
    duration: "8–12 недель",
    format: "Speaking + Writing + Reading + Listening",
    teacher: "IELTS-сертифицированный преподаватель",
    price: "от $149 / месяц",
    cta: "Начать подготовку",
    goals: ["ielts", "abroad"],
  },
  {
    id: "university-english",
    name: "English for University",
    description: "Язык для студентов, которые планируют обучение за рубежом.",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900&q=80&auto=format&fit=crop",
    level: "B1–C1",
    duration: "10 недель",
    format: "Academic English + эссе",
    teacher: "Преподаватель с опытом Academic English",
    price: "от $129 / месяц",
    cta: "Подробнее",
    goals: ["abroad", "study"],
  },
  {
    id: "speaking-club",
    name: "Speaking Club",
    description: "Практика разговорного языка в небольшой группе.",
    image:
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=900&q=80&auto=format&fit=crop",
    level: "A2–C1",
    duration: "Без ограничений",
    format: "1 встреча / неделя, группа до 6 человек",
    teacher: "Носитель или преподаватель-практик",
    price: "от $39 / месяц",
    cta: "Посмотреть расписание",
    goals: ["speaking", "work", "travel"],
  },
];

export interface LanguageGoal {
  id: string;
  label: string;
}

export const LANGUAGE_GOALS: LanguageGoal[] = [
  { id: "abroad", label: "Поступление за рубеж" },
  { id: "ielts", label: "IELTS" },
  { id: "speaking", label: "Разговорный язык" },
  { id: "study", label: "Учёба" },
  { id: "work", label: "Работа" },
  { id: "travel", label: "Путешествия" },
  { id: "hsk", label: "HSK" },
];

export interface LanguagePath {
  id: string;
  exam: string;
  country: string;
  title: string;
  description: string;
  goalId: string;
  hasCourse: boolean;
}

// Три направления подготовки. Курс/цена/преподаватель показываются только там,
// где реально есть данные (IELTS) — для HSK ведём на заявку, а не выдумываем цифры.
export const LANGUAGE_PATHS: LanguagePath[] = [
  {
    id: "hsk",
    exam: "HSK",
    country: "Китай",
    title: "Китайский язык HSK",
    description: "Подготовка к экзамену HSK для поступления в университеты Китая.",
    goalId: "hsk",
    hasCourse: false,
  },
  {
    id: "ielts",
    exam: "IELTS",
    country: "Международный",
    title: "Английский язык и IELTS",
    description: "Системная подготовка к IELTS с преподавателем-экспертом по всем четырём модулям.",
    goalId: "ielts",
    hasCourse: true,
  },
];

// Реальные преподаватели приходят с бэкенда — см. lib/data.ts (fetchPublicTeachers).
export interface LanguageTeacher {
  id: string;
  name: string;
  tags: string;
  photo: string;
  bio: string;
  experience: string;
  certificateUrl: string;
}

export interface LanguageReview {
  id: string;
  name: string;
  course: string;
  rating: number;
  text: string;
}

export const LANGUAGE_REVIEWS: LanguageReview[] = [
  {
    id: "review-1",
    name: "Асель К.",
    course: "IELTS Preparation",
    rating: 5,
    text: "За 10 недель подняла балл с 5.5 до 7.0. Преподаватель разбирала каждую ошибку в Writing очень подробно.",
  },
  {
    id: "review-2",
    name: "Тимур Б.",
    course: "General English",
    rating: 5,
    text: "Перестал бояться говорить на английском уже после первых занятий. Программа понятная, без воды.",
  },
  {
    id: "review-3",
    name: "Дана С.",
    course: "English for University",
    rating: 5,
    text: "Готовилась к поступлению в университет в Турции — курс дал именно тот английский, который нужен для учёбы.",
  },
  {
    id: "review-4",
    name: "Алихан М.",
    course: "Speaking Club",
    rating: 4,
    text: "Хорошая практика в небольшой группе, комфортно даже с базовым уровнем.",
  },
];

export interface LanguagePricingPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  cta: string;
  highlighted?: boolean;
}

export const LANGUAGE_PRICING: LanguagePricingPlan[] = [
  {
    id: "standard_ielts",
    name: "Standard",
    description: "IELTS 9-10 человек Онлайн + преподаватель.",
    price: "115990 ₸  / месяц",
    cta: "Выбрать",
  },
  {
    id: "pro_ielts",
    name: "Pro",
    description: "IELTS Офлайн-группа 7–8 человек + преподаватель.",
    price: "125990 ₸ / месяц",
    cta: "Выбрать",
    highlighted: true,
  },
  {
    id: "premium_ielts",
    name: "Premium",
    description: "IELTS Индивидуальный формат с преподавателем.",
    price: "159990 ₸ / месяц",
    cta: "Выбрать",
  },
  
  {
    id: "standard_english",
    name: "Standard",
    description: "Английский язык 9-10 человек Онлайн + преподаватель.",
    price: "49990 ₸ / месяц",
    cta: "Выбрать",
  },
  {
    id: "pro_english",
    name: "Pro",
    description: "Английский язык Офлайн-группа 7–8 человек + преподаватель.",
    price: "59990 ₸ / месяц",
    cta: "Выбрать",
    highlighted: true,
  },
  {
    id: "premium_english",
    name: "Premium",
    description: "Английский язык Индивидуальный формат с преподавателем.",
    price: "89990 ₸ / месяц",
    cta: "Выбрать",
  },
  
  {
    id: "standard_chinese",
    name: "Standard",
    description: "Китайский язык 5-6 человек Онлайн + преподаватель.",
    price: "49990 ₸ / месяц",
    cta: "Выбрать",
  },
  {
    id: "pro_chinese",
    name: "Pro",
    description: "Китайский язык Офлайн-группа 5–6 человек + преподаватель.",
    price: "59990 ₸ / месяц",
    cta: "Выбрать",
    highlighted: true,
  },
  {
    id: "premium_chinese",
    name: "Premium",
    description: "Китайский язык Индивидуальный формат с преподавателем.",
    price: "89990 ₸ / месяц",
    cta: "Выбрать",
  },
  {
    id: "csca_chinese",
    name: "CSCA",
    description: "Подготовка к экзамену CSCA",
    price: "299990 ₸ два месяца",
    cta: "Выбрать",
  },
];

export interface LanguageFaqItem {
  id: string;
  question: string;
  answer: string;
}

export const LANGUAGE_FAQ: LanguageFaqItem[] = [
  {
    id: "faq-1",
    question: "Как проходят занятия?",
    answer:
      "Онлайн, в удобное для вас время. Формат — индивидуально или в мини-группе, с живым преподавателем и обратной связью.",
  },
  {
    id: "faq-2",
    question: "Можно ли заниматься индивидуально?",
    answer: "Да, доступен индивидуальный формат с преподавателем на выбор и персональной программой.",
  },
  {
    id: "faq-3",
    question: "Какие языки доступны?",
    answer: "Английский язык с подготовкой к IELTS, а также направления по китайскому (HSK) — уточняйте формат и старт по вашему направлению.",
  },
  {
    id: "faq-4",
    question: "Как определить свой уровень?",
    answer: "Перед стартом мы проводим бесплатное вводное занятие с определением уровня и целей.",
  },
  {
    id: "faq-5",
    question: "Можно ли сменить преподавателя?",
    answer: "Да, если формат или стиль преподавания не подошёл — подберём другого преподавателя без доплат.",
  },
  {
    id: "faq-6",
    question: "Сколько длится курс?",
    answer: "От 8 до 12 недель в зависимости от программы и вашего текущего уровня.",
  },
  {
    id: "faq-7",
    question: "Есть ли пробное занятие?",
    answer: "Да, первое занятие — бесплатное, чтобы вы могли оценить формат и преподавателя.",
  },
  {
    id: "faq-8",
    question: "Можно ли подготовиться к IELTS?",
    answer: "Да, у нас есть отдельная программа IELTS Preparation с проработкой всех четырёх модулей экзамена.",
  },
];

export const LANGUAGE_STEPS = [
  { step: "01", title: "Выберите цель", text: "Расскажите, зачем вам нужен язык." },
  { step: "02", title: "Подберите курс", text: "Мы предложим подходящую программу." },
  { step: "03", title: "Познакомьтесь с преподавателем", text: "Выберите преподавателя и удобный формат." },
  { step: "04", title: "Начните обучение", text: "Занимайтесь онлайн и отслеживайте свой прогресс." },
];

export const LANGUAGE_PROBLEMS = [
  { title: "Боитесь говорить?", text: "Практикуйте язык с преподавателем на каждом занятии." },
  { title: "Не знаете, с чего начать?", text: "Получите понятную программу обучения." },
  { title: "Готовитесь к экзамену?", text: "Подготовка к IELTS и другим языковым экзаменам." },
  { title: "Планируете обучение за рубежом?", text: "Подготовьте язык заранее и приезжайте увереннее." },
];

export const LANGUAGE_BENEFITS = [
  "Живые занятия с преподавателем",
  "Практика разговорной речи",
  "Домашние задания",
  "Персональная обратная связь",
  "Отслеживание прогресса",
  "Учебные материалы",
];

export const LANGUAGE_STATS = [
  { value: "500+", label: "студентов" },
  { value: "20+", label: "преподавателей" },
  { value: "5+", label: "языков" },
  { value: "4.9/5", label: "средняя оценка" },
];

export const LANGUAGE_RESULT_STATS = [
  { value: "500+", label: "студентов" },
  { value: "90%+", label: "завершили программу" },
  { value: "4.9/5", label: "средняя оценка" },
];
