// ============================================================
// ZagranEasy — Navigation & Routing Config
// Единственное место, где определяется структура меню
// ============================================================

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}

// Главное меню (публичное)
export const NAV_ITEMS: NavItem[] = [
  { label: "Университеты", href: "/education" },
  { label: "Языковые курсы", href: "/language" },
  { label: "Пакеты", href: "/education/packages" },
  { label: "Отзывы", href: "/reviews" },
  { label: "Контакты", href: "/contacts" },
  { label: "О нас", href: "/about" },
];
// Меню портала сотрудников
export const STAFF_NAV_ITEMS: NavItem[] = [
  { label: "Дашборд", href: "/staff" },
  { label: "Калькулятор", href: "/staff/calculator" },
  { label: "Справочник", href: "/staff/directory" },
  { label: "Заявки", href: "/staff/leads" },
];

// Breadcrumb маппинг
export const BREADCRUMBS: Record<string, string> = {
  "/": "Главная",
  "/about": "О нас",
  "/education": "Университеты",
  "/language": "Языковые курсы",
  "/education/packages": "Пакеты",
  "/reviews": "Отзывы",
  "/contacts": "Контакты",
  "/faq": "FAQ",
};

// SEO мета-данные для каждой страницы
export const PAGE_META: Record<
  string,
  { title: string; description: string }
> = {
  "/": {
    title: "ZagranEasy — Весь мир в одном месте",
    description:
      "Обучение, работа, туры, визы, недвижимость за рубежом. 3200+ клиентов. Алматы.",
  },
  "/education": {
    title: "Университеты — ZagranEasy",
    description:
      "Каталог университетов, цены, дедлайны и программы обучения за рубежом.",
  },
  "/universities": {
    title: "Университеты — ZagranEasy",
    description:
      "Каталог университетов, цены, дедлайны и программы обучения за рубежом.",
  },
  "/language": {
    title: "Языковые курсы — ZagranEasy",
    description:
      "Онлайн-курсы английского языка: General English, IELTS Preparation, English for University, Speaking Club.",
  },
  "/education/packages": {
    title: "Пакеты полного сопровождения — ZagranEasy",
    description:
      "Пакеты полного сопровождения: учёба в Чехии и Китае, этапы, сроки и стоимость.",
  },
  "/about": {
    title: "О компании — ZagranEasy",
    description:
      "ИП «ZAGRANEASY». Более 3200 клиентов, 98% успешных виз. Алматы.",
  },
  "/reviews": {
    title: "Отзывы клиентов — ZagranEasy",
    description:
      "Истории и отзывы клиентов ZagranEasy об обучении и поступлении за рубежом.",
  },
  "/contacts": {
    title: "Контакты — ZagranEasy",
    description:
      "Адрес офиса ZagranEasy в Алматы, карта Google Maps, телефон и способы связи.",
  },
  "/faq": {
    title: "Частые вопросы — ZagranEasy",
    description:
      "Ответы на популярные вопросы о визах, обучении, турах, работе и недвижимости за рубежом.",
  },
};
