import { EducationCountry, University } from "@/lib/types";

export const educationCountries: EducationCountry[] = [
  {
    id: "edu-tr",
    slug: "turkey",
    name: "Турция",
    nameEn: "Turkey",
    flag: "🇹🇷",
    continent: "Europe",
    cities: ["Стамбул", "Анкара", "Измир", "Анталья", "Бурса"],
    description: "Высшее образование в Турции: сочетание европейских стандартов и доступной стоимости обучения.",
    longDescription: "Турция предлагает студентам высококачественные образовательные программы на английском и турецком языках. Университеты страны участвуют в Болонском процессе, что обеспечивает признание дипломов в Европе и по всему миру. Студентам доступны государственные и частные вузы, грантовые программы (включая Türkiye Bursları) и комфортные условия проживания.",
    badgeColor: "blue",
    imageUrl: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200",
    heroImageUrl: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b",
    universityCount: 8,
    features: ["Обучение на английском и турецком языках", "Признание дипломов в странах ЕС (Болонский процесс)", "Возможность поступления без экзаменов и по аттестату", "Доступные цены на обучение и проживание", "Широкий выбор стипендий и скидок"],
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
    id: "uni-tr-1", countryId: "edu-tr", slug: "istanbul-university", name: "Стамбульский университет", nameLocal: "İstanbul Üniversitesi",
    city: "Стамбул", type: "public", programs: ["Бакалавриат", "Магистратура", "PhD"], specialties: ["Медицина", "Юриспруденция", "Бизнес", "Гуманитарные науки"], languages: ["Турецкий", "Английский"],
    tuitionFrom: 800, tuitionTo: 3500, hasGrant: true, grantDetails: "Доступны государственные гранты Türkiye Bursları и скидки по академическим успехам.", hasDormitory: true, dormitoryCost: 150,
    requirements: ["Аттестат / Диплом", "Загранпаспорт", "Сертификат YÖS / TR-YÖS", "Сертификат знание языка (TOEFL/TÖMER)"], description: "Старейший и один из самых престижных государственных университетов Турции, основанный в 1453 году.", imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585", websiteUrl: "https://www.istanbul.edu.tr",
    rankingNational: 2, rankingWorld: 750, ieltsRequired: false, isPartner: true, admissionChance: 75, deadlineLabel: "до 15 июля", deadlineDate: "2026-07-15",
    ratingStars: 4.8, reviewsCount: 142, programsCount: 120, presentationUrl: null, presentationPages: null, lastVerifiedAt: "2026-08-01",
    programList: [
      { name: "Медицина (Medicine)", meta: "Бакалавриат | 6 лет | Английский/Турецкий", price: "$3 500" },
      { name: "Международное право", meta: "Бакалавриат | 4 года | Турецкий", price: "$1 200" },
      { name: "Бизнес-администрирование (MBA)", meta: "Магистратура | 2 года | Английский", price: "$2 000" }
    ],
    stories: [{ name: "Айдос К.", meta: "Факультет медицины, 2 курс", text: "Поступил через Qoldau Study. Помогли подготовить документы для YÖS и подать заявку на грант. Учиться сложно, но уровень преподавания высочайший!" }],
    isActive: true, sortOrder: 1,
  },
  {
    id: "uni-tr-2", countryId: "edu-tr", slug: "middle-east-technical-university", name: "Ближневосточный технический университет (METU)", nameLocal: "Orta Doğu Teknik Üniversitesi (ODTÜ)",
    city: "Анкара", type: "public", programs: ["Бакалавриат", "Магистратура", "PhD"], specialties: ["IT", "Инженерия", "Архитектура", "Естественные науки"], languages: ["Английский"],
    tuitionFrom: 1200, tuitionTo: 4000, hasGrant: true, grantDetails: "Полные и частичные стипендии для выдающихся иностранных студентов.", hasDormitory: true, dormitoryCost: 200,
    requirements: ["Аттестат с высоким средним баллом", "SAT / SAT Subject", "IELTS / TOEFL", "Загранпаспорт"], description: "Ведущий технический университет Турции, полностью обучающий на английском языке. Входит в топ мировых рейтингов по инженерии.", imageUrl: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3", websiteUrl: "https://www.metu.edu.tr",
    rankingNational: 1, rankingWorld: 501, ieltsRequired: true, isPartner: true, admissionChance: 65, deadlineLabel: "до 30 июня", deadlineDate: "2026-06-30",
    ratingStars: 4.9, reviewsCount: 98, programsCount: 85, presentationUrl: null, presentationPages: null, lastVerifiedAt: "2026-08-10",
    programList: [
      { name: "Computer Engineering", meta: "Бакалавриат | 4 года | Английский", price: "$2 500" },
      { name: "Mechanical Engineering", meta: "Бакалавриат | 4 года | Английский", price: "$2 500" },
      { name: "Data Science", meta: "Магистратура | 2 года | Английский", price: "$3 500" }
    ],
    stories: [],
    isActive: true, sortOrder: 2,
  },
  {
    id: "uni-tr-3", countryId: "edu-tr", slug: "istanbul-gelisim-university", name: "Стамбульский университет Гелишим", nameLocal: "İstanbul Gelişim Üniversitesi",
    city: "Стамбул", type: "private", programs: ["Бакалавриат", "Магистратура"], specialties: ["IT", "Инженерия", "Авиация", "Дизайн", "Бизнес"], languages: ["Английский", "Турецкий"],
    tuitionFrom: 3000, tuitionTo: 7500, hasGrant: true, grantDetails: "Внутренние стипендии и скидки от 25% до 50% при ранней подаче документов.", hasDormitory: true, dormitoryCost: 250,
    requirements: ["Аттестат / Диплом", "Загранпаспорт", "Мотивационное письмо"], description: "Один из наиболее динамично развивающихся частных вузов Турции с международно аккредитованными программами AQAS.", imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1", websiteUrl: "https://gelisim.edu.tr",
    rankingNational: 25, rankingWorld: 1201, ieltsRequired: false, isPartner: true, admissionChance: 85, deadlineLabel: "до 31 августа", deadlineDate: "2026-08-31",
    ratingStars: 4.7, reviewsCount: 64, programsCount: 95, presentationUrl: null, presentationPages: null, lastVerifiedAt: "2026-08-15",
    programList: [
      { name: "Software Engineering", meta: "Бакалавриат | 4 года | Английский", price: "$4 000" },
      { name: "Aeronautical Engineering", meta: "Бакалавриат | 4 года | Английский", price: "$4 500" },
      { name: "Graphic Design", meta: "Бакалавриат | 4 года | Турецкий", price: "$3 200" }
    ],
    stories: [],
    isActive: true, sortOrder: 3,
  },
  {
    id: "uni-tr-4", countryId: "edu-tr", slug: "bahcesehir-university", name: "Университет Бахчешехир (BAU)", nameLocal: "Bahçeşehir Üniversitesi",
    city: "Стамбул", type: "private", programs: ["Бакалавриат", "Магистратура", "PhD"], specialties: ["IT", "Медицина", "Архитектура", "Бизнес", "Медиа и коммуникации"], languages: ["Английский", "Турецкий"],
    tuitionFrom: 5500, tuitionTo: 25000, hasGrant: true, grantDetails: "Скидки по партнерским программам Qoldau Study до 50%.", hasDormitory: true, dormitoryCost: 350,
    requirements: ["Аттестат / Диплом", "Загранпаспорт", "Сертификат IELTS/TOEFL (желательно)"], description: "Престижный частный университет на берегу Босфора. Известен своей глобальной сетью кампусов BAU Global и программами обмена.", imageUrl: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a", websiteUrl: "https://bau.edu.tr",
    rankingNational: 10, rankingWorld: 801, ieltsRequired: false, isPartner: true, admissionChance: 80, deadlineLabel: "до 25 августа", deadlineDate: "2026-08-25",
    ratingStars: 4.8, reviewsCount: 115, programsCount: 110, presentationUrl: null, presentationPages: null, lastVerifiedAt: "2026-08-18",
    programList: [
      { name: "Medicine", meta: "Бакалавриат | 6 лет | Английский", price: "$25 000" },
      { name: "Artificial Intelligence Engineering", meta: "Бакалавриат | 4 года | Английский", price: "$8 500" },
      { name: "Digital Game Design", meta: "Бакалавриат | 4 года | Английский", price: "$7 900" }
    ],
    stories: [],
    isActive: true, sortOrder: 4,
  },
  {
    id: "uni-tr-5", countryId: "edu-tr", slug: "sabanci-university", name: "Университет Сабанджи", nameLocal: "Sabancı Üniversitesi",
    city: "Стамбул", type: "private", programs: ["Бакалавриат", "Магистратура", "PhD"], specialties: ["IT", "Инженерия", "Экономика", "Менеджмент"], languages: ["Английский"],
    tuitionFrom: 9000, tuitionTo: 21500, hasGrant: true, grantDetails: "Гранты 25%, 50%, 75% и 100% на основе высокого балла SAT / GPA.", hasDormitory: true, dormitoryCost: 300,
    requirements: ["Аттестат с высоким балом", "SAT / ACT", "TOEFL / IELTS", "Эссе"], description: "Один из лучших исследовательских частных университетов Турции с междисциплинарной системой обучения без выбора специальности на 1 курсе.", imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952", websiteUrl: "https://www.sabanciuniv.edu",
    rankingNational: 4, rankingWorld: 450, ieltsRequired: true, isPartner: true, admissionChance: 60, deadlineLabel: "до 10 августа", deadlineDate: "2026-08-10",
    ratingStars: 4.9, reviewsCount: 52, programsCount: 40, presentationUrl: null, presentationPages: null, lastVerifiedAt: "2026-08-12",
    programList: [
      { name: "Computer Science and Engineering", meta: "Бакалавриат | 4 года | Английский", price: "$21 500" },
      { name: "Industrial Engineering", meta: "Бакалавриат | 4 года | Английский", price: "$21 500" }
    ],
    stories: [],
    isActive: true, sortOrder: 5,
  },
  {
    id: "uni-tr-6", countryId: "edu-tr", slug: "koc-university", name: "Университет Коч", nameLocal: "Koç Üniversitesi",
    city: "Стамбул", type: "private", programs: ["Бакалавриат", "Магистратура", "PhD"], specialties: ["Медицина", "IT", "Инженерия", "Право", "Бизнес"], languages: ["Английский"],
    tuitionFrom: 10500, tuitionTo: 26500, hasGrant: true, grantDetails: "Мериторные академические стипендии для сильнейших абитуриентов.", hasDormitory: true, dormitoryCost: 320,
    requirements: ["Высокий GPA", "SAT / ACT", "IELTS / TOEFL", "Рекомендательные письма"], description: "Топовый частный университет Турции, стабильно входящий в список лучших университетов мира. Высокий уровень научных исследований.", imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f", websiteUrl: "https://www.ku.edu.tr",
    rankingNational: 3, rankingWorld: 400, ieltsRequired: true, isPartner: false, admissionChance: 50, deadlineLabel: "до 1 июля", deadlineDate: "2026-07-01",
    ratingStars: 4.9, reviewsCount: 78, programsCount: 50, presentationUrl: null, presentationPages: null, lastVerifiedAt: "2026-08-05",
    programList: [
      { name: "School of Medicine", meta: "Бакалавриат | 6 лет | Английский", price: "$26 500" },
      { name: "Chemical and Biological Engineering", meta: "Бакалавриат | 4 года | Английский", price: "$21 500" }
    ],
    stories: [],
    isActive: true, sortOrder: 6,
  },
  {
    id: "uni-tr-7", countryId: "edu-tr", slug: "ege-university", name: "Университет Эге", nameLocal: "Ege Üniversitesi",
    city: "Измир", type: "public", programs: ["Бакалавриат", "Магистратура", "PhD"], specialties: ["Агрономия", "Медицина", "Инженерия", "Педагогика"], languages: ["Турецкий", "Английский"],
    tuitionFrom: 600, tuitionTo: 2800, hasGrant: true, grantDetails: "Стипендии Türkiye Bursları.", hasDormitory: true, dormitoryCost: 120,
    requirements: ["Аттестат", "TR-YÖS", "Загранпаспорт"], description: "Крупный государственный университет на побережье Эгейского моря в Измире с развитым исследовательским комплексом.", imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644", websiteUrl: "https://ege.edu.tr",
    rankingNational: 8, rankingWorld: 950, ieltsRequired: false, isPartner: true, admissionChance: 70, deadlineLabel: "до 20 июля", deadlineDate: "2026-07-20",
    ratingStars: 4.6, reviewsCount: 34, programsCount: 130, presentationUrl: null, presentationPages: null, lastVerifiedAt: "2026-08-14",
    programList: [
      { name: "Стоматология", meta: "Бакалавриат | 5 лет | Турецкий", price: "$2 800" },
      { name: "Сельское хозяйство и агрономия", meta: "Бакалавриат | 4 года | Турецкий", price: "$600" }
    ],
    stories: [],
    isActive: true, sortOrder: 7,
  },
  {
    id: "uni-tr-8", countryId: "edu-tr", slug: "ankara-university", name: "Анкарский университет", nameLocal: "Ankara Üniversitesi",
    city: "Анкара", type: "public", programs: ["Бакалавриат", "Магистратура", "PhD"], specialties: ["Политология", "Право", "Медицина", "Языкознание"], languages: ["Турецкий", "Английский"],
    tuitionFrom: 700, tuitionTo: 3200, hasGrant: true, grantDetails: "Государственная стипендиальная программа.", hasDormitory: true, dormitoryCost: 140,
    requirements: ["Аттестат", "YÖS / TR-YÖS", "Загранпаспорт"], description: "Первый высший учебный заведение Турецкой Республики, основанный Мустафой Кемалем Ататюрком.", imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585", websiteUrl: "https://www.ankara.edu.tr",
    rankingNational: 5, rankingWorld: 800, ieltsRequired: false, isPartner: true, admissionChance: 72, deadlineLabel: "до 10 июля", deadlineDate: "2026-07-10",
    ratingStars: 4.7, reviewsCount: 45, programsCount: 140, presentationUrl: null, presentationPages: null, lastVerifiedAt: "2026-08-16",
    programList: [
      { name: "Политология и государственное управление", meta: "Бакалавриат | 4 года | Турецкий", price: "$900" },
      { name: "Фармация", meta: "Бакалавриат | 5 лет | Турецкий", price: "$2 500" }
    ],
    stories: [],
    isActive: true, sortOrder: 8,
  },
];

export function getCountryBySlug(slug: string) {
  return educationCountries.find((c) => c.slug === slug);
}

export function getUniversitiesByCountryId(countryId: string) {
  return universities.filter((u) => u.countryId === countryId);
}
