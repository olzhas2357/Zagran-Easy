import { WorkCountry, Property, Review } from "@/lib/types";

// ============ WORK ============
export const workCountries: WorkCountry[] = [
  { id: "w-tr", slug: "turkey", name: "Турция", flag: "🇹🇷", industries: ["Отельный бизнес", "IT", "Строительство"], description: "Вакансии в отельном бизнесе, IT и строительстве.", salaryRange: "$800 — $2 000", imageUrl: "/images/work-turkey.jpg" },
  { id: "w-pl", slug: "poland", name: "Польша", flag: "🇵🇱", industries: ["Производство", "Логистика", "IT"], description: "Лидер в производстве и логистике.", salaryRange: "$1 200 — $3 000", imageUrl: "/images/work-poland.jpg" },
  { id: "w-de", slug: "germany", name: "Германия", flag: "🇩🇪", industries: ["Инженерия", "Медицина", "IT"], description: "Работа для инженеров и медиков.", salaryRange: "$2 500 — $5 000", imageUrl: "/images/work-germany.jpg" },
];

// ============ VISA STEPS ============
export const visaSteps = [
  { num: 1, title: "Первичная консультация", desc: "Оценка ситуации и шансов" },
  { num: 2, title: "Сбор и аудит документов", desc: "Проверяем полный пакет" },
  { num: 3, title: "Оплата консульского сбора", desc: "Помогаем оплатить $185" },
  { num: 4, title: "Заполнение анкеты DS-160", desc: "Без ошибок, с проверкой" },
  { num: 5, title: "Запись на собеседование", desc: "Мониторим слоты, записываем" },
  { num: 6, title: "Подготовка к интервью", desc: "Симуляция вопросов посольства" },
  { num: 7, title: "Получение визы", desc: "Сопровождаем до одобрения" },
];

export const visaServices = [
  { icon: "📄", title: "Анкета DS-160", desc: "Безошибочное заполнение визовой анкеты" },
  { icon: "🎯", title: "Подготовка к интервью", desc: "Симуляция собеседования с экспертом" },
  { icon: "🕐", title: "Запись в консульство", desc: "Мониторинг и оперативная запись" },
];

// ============ REAL ESTATE ============
export const properties: Property[] = [
  { id: "p-1", title: "Вилла с видом на горы", location: "Анталия, Коньяалты", city: "Анталия", rooms: 3, areaSqm: 180, priceUsd: 285000, features: ["Бассейн", "Парковка", "Сад"], isHotDeal: true, imageUrl: "/images/prop-villa.jpg" },
  { id: "p-2", title: "Пентхаус в центре", location: "Стамбул, Бешикташ", city: "Стамбул", rooms: 4, areaSqm: 220, priceUsd: 450000, features: ["Вид на Босфор", "Терраса"], isHotDeal: false, imageUrl: "/images/prop-penthouse.jpg" },
  { id: "p-3", title: "Апартаменты 1+1 у моря", location: "Алания, Махмутлар", city: "Алания", rooms: 1, areaSqm: 65, priceUsd: 85000, features: ["1 линия", "Мебель"], isHotDeal: false, imageUrl: "/images/prop-alanya.jpg" },
  { id: "p-4", title: "Вилла Prime Residence", location: "Кипр, Кирения", city: "Кипр", rooms: 4, areaSqm: 210, priceUsd: 380000, features: ["Sea View", "Бассейн", "Гараж"], isHotDeal: false, imageUrl: "/images/prop-cyprus.jpg" },
];

export const realEstateRegions = [
  { name: "Стамбул", desc: "Центр мировых инвестиций", imageUrl: "/images/re-istanbul.jpg" },
  { name: "Анталия", desc: "Лучшие виллы на побережье", imageUrl: "/images/re-antalya.jpg" },
  { name: "Алания", desc: "Доступное жильё у моря", imageUrl: "/images/re-alanya.jpg" },
  { name: "Кипр", desc: "Налоговые льготы и европейский уровень жизни", imageUrl: "/images/re-cyprus.jpg" },
];

// ============ REVIEWS ============
export const reviews: Review[] = [
  { id: "r-1", name: "Айгерим К.", service: "Обучение в Турции", text: "Помогли поступить в Стамбул за 2 месяца! Всё объяснили, помогли с документами. Сейчас учусь и очень довольна.", avatar: "А", rating: 5 },
  { id: "r-2", name: "Данияр М.", service: "Работа в Польше", text: "Устроился на работу через ZagranEasy. Контракт, виза, перелёт — всё организовали. Рекомендую!", avatar: "Д", rating: 5 },
  { id: "r-3", name: "Мадина С.", service: "Виза USA", text: "С первого раза получила визу B1/B2! Подготовили к собеседованию так, что чувствовала себя уверенно.", avatar: "М", rating: 5 },
  { id: "r-4", name: "Арман Т.", service: "Тур в Таиланд", text: "Летали семьёй в Таиланд. Подобрали отличный отель, трансфер, экскурсии. Всё на высоте!", avatar: "А", rating: 5 },
  { id: "r-5", name: "Жанна Б.", service: "Обучение в Китае", text: "Получила грант на обучение в Китае на 100%! Спасибо команде за поддержку на каждом этапе.", avatar: "Ж", rating: 5 },
];
