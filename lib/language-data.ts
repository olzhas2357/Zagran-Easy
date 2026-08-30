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
  { id: "sat", label: "SAT" },
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
// где реально есть данные (IELTS) — для HSK и SAT ведём на заявку, а не выдумываем цифры.
export const LANGUAGE_PATHS: LanguagePath[] = [
  {
    id: "hsk",
    exam: "HSK",
    country: "Китай",
    title: "Китайский язык и HSK",
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
  {
    id: "sat",
    exam: "SAT",
    country: "США",
    title: "Подготовка к SAT",
    description: "Математика, Reading и Writing для поступления в университеты США.",
    goalId: "sat",
    hasCourse: false,
  },
];

export interface LanguageTeacher {
  id: string;
  name: string;
  role: string;
  tags: string;
  experience: string;
  rating: string;
  students: string;
  photo: string;
}

export const LANGUAGE_TEACHERS: LanguageTeacher[] = [
  {
    id: "teacher-1",
    name: "Айгерим Сатова",
    role: "English Teacher",
    tags: "IELTS · Speaking · Academic English",
    experience: "6+ лет опыта",
    rating: "4.9 ★",
    students: "180+ студентов",
    photo:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "teacher-2",
    name: "Данияр Ахметов",
    role: "English Teacher",
    tags: "General English · Speaking Club",
    experience: "5+ лет опыта",
    rating: "4.8 ★",
    students: "150+ студентов",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "teacher-3",
    name: "Мадина Ержанова",
    role: "English Teacher",
    tags: "IELTS · University Prep",
    experience: "7+ лет опыта",
    rating: "5.0 ★",
    students: "220+ студентов",
    photo:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "teacher-4",
    name: "Ержан Болатов",
    role: "English Teacher",
    tags: "Academic English · Business English",
    experience: "4+ года опыта",
    rating: "4.9 ★",
    students: "110+ студентов",
    photo:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80&auto=format&fit=crop",
  },
];

export const TEACHER_HIGHLIGHT = {
  name: "Мадина Ержанова",
  quote:
    "Помогаю студентам уверенно говорить на английском и подготовиться к обучению за рубежом.",
  experience: "7+ лет опыта",
  students: "220+ студентов",
  score: "IELTS 8.5",
  photo:
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=900&q=80&auto=format&fit=crop",
};

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
    id: "self",
    name: "Самостоятельно",
    description: "Учебные материалы + задания.",
    price: "$29 / месяц",
    cta: "Выбрать",
  },
  {
    id: "group",
    name: "В группе",
    description: "Живые занятия + преподаватель.",
    price: "$99 / месяц",
    cta: "Выбрать",
    highlighted: true,
  },
  {
    id: "individual",
    name: "Индивидуально",
    description: "Персональная программа + преподаватель.",
    price: "$199 / месяц",
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
    answer: "Английский язык с подготовкой к IELTS, а также направления по китайскому (HSK) и подготовке к SAT — уточняйте формат и старт по вашему направлению.",
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
