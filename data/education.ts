import { EducationCountry, University } from "@/lib/types";

export const educationCountries: EducationCountry[] = [
  {
    id: "edu-tr",
    slug: "turkey",
    name: "Университеты Турции",
    flag: "🇹🇷",
    cities: ["Стамбул", "Анкара", "Анталия", "Измир", "Алания", "Бурса"],
    description: "Поступление без экзаменов. Обучение на английском и турецком языках. Медицина, архитектура и инженерия по доступным ценам.",
    badgeColor: "blue",
    imageUrl: "/images/edu-turkey.jpg",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "edu-cn",
    slug: "china",
    name: "Университеты Китая",
    flag: "🇨🇳",
    cities: ["Пекин", "Шанхай", "Гуанчжоу", "Ханчжоу", "Нанкин", "Сиань"],
    description: "Правительственные гранты до 100%. Полное покрытие обучения, проживания и ежемесячная стипендия.",
    badgeColor: "red",
    imageUrl: "/images/edu-china.jpg",
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "edu-it",
    slug: "italy",
    name: "Университеты Италии",
    flag: "🇮🇹",
    cities: ["Рим", "Милан", "Болонья", "Флоренция", "Пиза", "Венеция"],
    description: "Государственные вузы с мировым именем. Грант DSU позволяет учиться бесплатно и получать выплаты на питание.",
    badgeColor: "green",
    imageUrl: "/images/edu-italy.jpg",
    isActive: true,
    sortOrder: 3,
  },
  {
    id: "edu-my",
    slug: "malaysia",
    name: "Университеты Малайзии",
    flag: "🇲🇾",
    cities: ["Куала-Лумпур", "Пенанг", "Джохор-Бару", "Кучинг", "Кота-Кинабалу"],
    description: "Диплом британского образца за половину стоимости. Безопасная страна, высокий уровень жизни и карьерный старт.",
    badgeColor: "amber",
    imageUrl: "/images/edu-malaysia.jpg",
    isActive: true,
    sortOrder: 4,
  },
];

export const universities: University[] = [
  // Turkey
  { id: "uni-1", countrySlug: "turkey", name: "Istanbul University", city: "Стамбул", programs: ["Бакалавр", "Магистр", "Медицина"], languages: ["Английский", "Турецкий"], tuitionFrom: 1500, hasGrant: true, imageUrl: "/images/uni-istanbul.jpg" },
  { id: "uni-2", countrySlug: "turkey", name: "Ankara University", city: "Анкара", programs: ["Бакалавр", "Магистр"], languages: ["Турецкий", "Английский"], tuitionFrom: 1200, hasGrant: true, imageUrl: "/images/uni-ankara.jpg" },
  { id: "uni-3", countrySlug: "turkey", name: "Akdeniz University", city: "Анталия", programs: ["Бакалавр", "Языковые курсы"], languages: ["Турецкий"], tuitionFrom: 800, hasGrant: false, imageUrl: "/images/uni-akdeniz.jpg" },
  // China
  { id: "uni-4", countrySlug: "china", name: "Chongqing Jiaotong University", city: "Чунцин", programs: ["Бакалавр", "Магистр", "Языковые курсы"], languages: ["Китайский", "Английский"], tuitionFrom: 0, hasGrant: true, imageUrl: "/images/uni-chongqing.jpg" },
  { id: "uni-5", countrySlug: "china", name: "Zhejiang University", city: "Ханчжоу", programs: ["Бакалавр", "Магистр", "PhD"], languages: ["Английский", "Китайский"], tuitionFrom: 2500, hasGrant: true, imageUrl: "/images/uni-zhejiang.jpg" },
  // Italy
  { id: "uni-6", countrySlug: "italy", name: "Università di Bologna", city: "Болонья", programs: ["Бакалавр", "Магистр"], languages: ["Итальянский", "Английский"], tuitionFrom: 0, hasGrant: true, imageUrl: "/images/uni-bologna.jpg" },
  // Malaysia
  { id: "uni-7", countrySlug: "malaysia", name: "University of Malaya", city: "Куала-Лумпур", programs: ["Бакалавр", "Магистр"], languages: ["Английский"], tuitionFrom: 3000, hasGrant: false, imageUrl: "/images/uni-malaya.jpg" },
];

export function getCountryBySlug(slug: string) {
  return educationCountries.find((c) => c.slug === slug);
}

export function getUniversitiesByCountry(slug: string) {
  return universities.filter((u) => u.countrySlug === slug);
}
