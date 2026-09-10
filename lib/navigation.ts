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
  { label: "Университеты", href: "/universities" },
  { label: "Языковые курсы", href: "/language" },
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
  "/education": "Университеты",
  "/universities": "Университеты",
  "/language": "Языковые курсы",
  "/about": "О нас",
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
  "/about": {
    title: "О компании — ZagranEasy",
    description:
      "ИП «ZAGRANEASY». Более 3200 клиентов, 98% успешных виз. Алматы.",
  },
  "/faq": {
    title: "Частые вопросы — ZagranEasy",
    description:
      "Ответы на популярные вопросы о визах, обучении, турах, работе и недвижимости за рубежом.",
  },
};
