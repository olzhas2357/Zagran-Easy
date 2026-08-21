import { EducationCountry, University } from "@/lib/types";

export const educationCountries: EducationCountry[] = [
  {
    id: "edu-tr",
    slug: "turkey",
    name: "Турция",
    nameEn: "Türkiye",
    flag: "🇹🇷",
    continent: "Europe",
    cities: ["Стамбул", "Анкара", "Анталия", "Измир", "Алания", "Бурса"],
    description: "Поступление без экзаменов. Обучение на английском и турецком языках. Медицина, архитектура и инженерия по доступным ценам.",
    longDescription: "Поступление без экзаменов. Обучение на английском и турецком языках. Медицина, архитектура и инженерия по доступным ценам.",
    badgeColor: "blue",
    imageUrl: "/images/edu-turkey.jpg",
    heroImageUrl: "/images/edu-turkey.jpg",
    universityCount: 3,
    features: ["Без экзаменов", "TÖMER", "TR-YÖS/SAT", "Скидки до 100%"],
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "edu-cn",
    slug: "china",
    name: "Китай",
    nameEn: "China",
    flag: "🇨🇳",
    continent: "Asia",
    cities: ["Пекин", "Шанхай", "Гуанчжоу", "Ханчжоу", "Нанкин", "Сиань"],
    description: "Правительственные гранты до 100%. Полное покрытие обучения, проживания и ежемесячная стипендия.",
    longDescription: "Правительственные гранты до 100%. Полное покрытие обучения, проживания и ежемесячная стипендия.",
    badgeColor: "red",
    imageUrl: "/images/edu-china.jpg",
    heroImageUrl: "/images/edu-china.jpg",
    universityCount: 2,
    features: ["Гранты до 100%", "HSK", "CSCA", "Языковой год"],
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "edu-it",
    slug: "italy",
    name: "Италия",
    nameEn: "Italy",
    flag: "🇮🇹",
    continent: "Europe",
    cities: ["Рим", "Милан", "Болонья", "Флоренция", "Пиза", "Венеция"],
    description: "Государственные вузы с мировым именем. Грант DSU позволяет учиться бесплатно и получать выплаты на питание.",
    longDescription: "Государственные вузы с мировым именем. Грант DSU позволяет учиться бесплатно и получать выплаты на питание.",
    badgeColor: "green",
    imageUrl: "/images/edu-italy.jpg",
    heroImageUrl: "/images/edu-italy.jpg",
    universityCount: 1,
    features: ["Грант DSU", "Бесплатное обучение", "Мировые вузы"],
    isActive: true,
    sortOrder: 3,
  },
  {
    id: "edu-my",
    slug: "malaysia",
    name: "Малайзия",
    nameEn: "Malaysia",
    flag: "🇲🇾",
    continent: "Asia",
    cities: ["Куала-Лумпур", "Пенанг", "Джохор-Бару", "Кучинг", "Кота-Кинабалу"],
    description: "Диплом британского образца за половину стоимости. Безопасная страна, высокий уровень жизни и карьерный старт.",
    longDescription: "Диплом британского образца за половину стоимости. Безопасная страна, высокий уровень жизни и карьерный старт.",
    badgeColor: "amber",
    imageUrl: "/images/edu-malaysia.jpg",
    heroImageUrl: "/images/edu-malaysia.jpg",
    universityCount: 1,
    features: ["Британский диплом", "Доступные цены", "Английский язык"],
    isActive: true,
    sortOrder: 4,
  },
];

export const universities: University[] = [
  // Turkey
  {
    id: "uni-1", countryId: "edu-tr", slug: "istanbul-university", name: "Istanbul University", nameLocal: "İstanbul Üniversitesi",
    city: "Стамбул", type: "public", programs: ["Бакалавр", "Магистр", "Медицина"], languages: ["Английский", "Турецкий"],
    tuitionFrom: 1500, tuitionTo: 4000, hasGrant: true, grantDetails: "Грант YTB покрывает до 100%", hasDormitory: true, dormitoryCost: 150,
    requirements: ["Аттестат", "TÖMER", "SAT"], description: "", imageUrl: "/images/uni-istanbul.jpg", websiteUrl: "",
    rankingNational: 1, rankingWorld: null, isActive: true, sortOrder: 1,
  },
  {
    id: "uni-2", countryId: "edu-tr", slug: "ankara-university", name: "Ankara University", nameLocal: "Ankara Üniversitesi",
    city: "Анкара", type: "public", programs: ["Бакалавр", "Магистр"], languages: ["Турецкий", "Английский"],
    tuitionFrom: 1200, tuitionTo: 3000, hasGrant: true, grantDetails: "Частичный грант для отличников", hasDormitory: true, dormitoryCost: 120,
    requirements: ["Аттестат", "TÖMER"], description: "", imageUrl: "/images/uni-ankara.jpg", websiteUrl: "",
    rankingNational: 2, rankingWorld: null, isActive: true, sortOrder: 2,
  },
  {
    id: "uni-3", countryId: "edu-tr", slug: "akdeniz-university", name: "Akdeniz University", nameLocal: "Akdeniz Üniversitesi",
    city: "Анталия", type: "public", programs: ["Бакалавр", "Языковые курсы"], languages: ["Турецкий"],
    tuitionFrom: 800, tuitionTo: 1500, hasGrant: false, grantDetails: "", hasDormitory: false, dormitoryCost: 0,
    requirements: ["Аттестат", "TR-YÖS"], description: "", imageUrl: "/images/uni-akdeniz.jpg", websiteUrl: "",
    rankingNational: 3, rankingWorld: null, isActive: true, sortOrder: 3,
  },
  // China
  {
    id: "uni-4", countryId: "edu-cn", slug: "chongqing-jiaotong-university", name: "Chongqing Jiaotong University", nameLocal: "重庆交通大学",
    city: "Чунцин", type: "public", programs: ["Бакалавр", "Магистр", "Языковые курсы"], languages: ["Китайский", "Английский"],
    tuitionFrom: 0, tuitionTo: 2000, hasGrant: true, grantDetails: "Грант CSCA — полное покрытие", hasDormitory: true, dormitoryCost: 60,
    requirements: ["Аттестат", "Медсправка", "HSK 4"], description: "", imageUrl: "/images/uni-chongqing.jpg", websiteUrl: "",
    rankingNational: 1, rankingWorld: null, isActive: true, sortOrder: 1,
  },
  {
    id: "uni-5", countryId: "edu-cn", slug: "zhejiang-university", name: "Zhejiang University", nameLocal: "浙江大学",
    city: "Ханчжоу", type: "public", programs: ["Бакалавр", "Магистр", "PhD"], languages: ["Английский", "Китайский"],
    tuitionFrom: 2500, tuitionTo: 6000, hasGrant: true, grantDetails: "Грант университета для сильных абитуриентов", hasDormitory: true, dormitoryCost: 80,
    requirements: ["Аттестат", "Медсправка", "IELTS/HSK"], description: "", imageUrl: "/images/uni-zhejiang.jpg", websiteUrl: "",
    rankingNational: 2, rankingWorld: null, isActive: true, sortOrder: 2,
  },
  // Italy
  {
    id: "uni-6", countryId: "edu-it", slug: "universita-di-bologna", name: "Università di Bologna", nameLocal: "Università di Bologna",
    city: "Болонья", type: "public", programs: ["Бакалавр", "Магистр"], languages: ["Итальянский", "Английский"],
    tuitionFrom: 0, tuitionTo: 1000, hasGrant: true, grantDetails: "Грант DSU — бесплатное обучение + стипендия", hasDormitory: true, dormitoryCost: 200,
    requirements: ["Аттестат", "Апостиль", "IELTS"], description: "", imageUrl: "/images/uni-bologna.jpg", websiteUrl: "",
    rankingNational: 1, rankingWorld: null, isActive: true, sortOrder: 1,
  },
  // Malaysia
  {
    id: "uni-7", countryId: "edu-my", slug: "university-of-malaya", name: "University of Malaya", nameLocal: "Universiti Malaya",
    city: "Куала-Лумпур", type: "public", programs: ["Бакалавр", "Магистр"], languages: ["Английский"],
    tuitionFrom: 3000, tuitionTo: 7000, hasGrant: false, grantDetails: "", hasDormitory: true, dormitoryCost: 100,
    requirements: ["Аттестат", "IELTS/TOEFL"], description: "", imageUrl: "/images/uni-malaya.jpg", websiteUrl: "",
    rankingNational: 1, rankingWorld: null, isActive: true, sortOrder: 1,
  },
];

export function getCountryBySlug(slug: string) {
  return educationCountries.find((c) => c.slug === slug);
}

export function getUniversitiesByCountryId(countryId: string) {
  return universities.filter((u) => u.countryId === countryId);
}
