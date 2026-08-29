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
  // { label: "Главная", href: "/" },
  // { label: "Университеты", href: "/education", icon: "🎓" },
  // Временно скрыто — фокус на обучении, см. zagraneasy-requirements.json (main_services)
  // { label: "Туры", href: "/tours", icon: "✈️" },
  // { label: "Работа", href: "/work", icon: "💼" },
  // { label: "Виза USA", href: "/visa-usa", icon: "🗽" },
  // { label: "Недвижимость", href: "/realestate", icon: "🏠" },
  // { label: "О нас", href: "/about" },
  // { label: "FAQ", href: "/faq" },
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
  // "/tours": "Туры",
  // "/work": "Работа",
  // "/visa-usa": "Виза USA",
  // "/realestate": "Недвижимость",
  "/about": "О нас",
  "/faq": "FAQ",
  "/staff": "Портал",
  "/staff/calculator": "Калькулятор",
  "/staff/directory": "Справочник",
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
    title: "Обучение за рубежом — ZagranEasy",
    description:
      "3200+ зачислений в университеты Турции, Китая, Италии, Малайзии. Поступление без экзаменов, гранты до 100%.",
  },
  "/tours": {
    title: "Эксклюзивные туры — ZagranEasy",
    description:
      "Авторские маршруты: Китай, Италия, Таиланд. Перелёт, отель 4-5*, гид — всё включено. Рассрочка 0·0·12.",
  },
  "/work": {
    title: "Работа за рубежом — ZagranEasy",
    description:
      "Трудоустройство в Турции, Польше, Германии. Рабочая виза, контракт, поддержка на месте.",
  },
  "/visa-usa": {
    title: "Виза в США — ZagranEasy",
    description:
      "98% одобрений. DS-160, подготовка к интервью, запись в посольство. Полное сопровождение.",
  },
  "/realestate": {
    title: "Недвижимость за рубежом — ZagranEasy",
    description:
      "Турция, Кипр, ОАЭ. Виллы, апартаменты, инвестиции. ВНЖ через покупку. Юридическое сопровождение.",
  },
  "/about": {
    title: "О компании — ZagranEasy",
    description:
      "ТОО «ZAGRANEASY». Более 3200 клиентов, 98% успешных виз. Алматы, БЦ Нурлы Тау.",
  },
  "/faq": {
    title: "Частые вопросы — ZagranEasy",
    description:
      "Ответы на популярные вопросы о визах, обучении, турах, работе и недвижимости за рубежом.",
  },
};
