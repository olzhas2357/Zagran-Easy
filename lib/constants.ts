// ============================================================
// ZagranEasy — Constants & Utilities
// ============================================================

export const SITE = {
  name: "ZagranEasy",
  tagline: "Весь мир — в одном месте",
  description: "Обучение, работа, туры, визы за рубежом. Одна команда решает все вопросы.",
  phone: "+7 747 911 2606",
  phoneClean: "77479112606",
  email: "ZagranEasy.office@gmail.com",
  instagram: "zagraneasyy",
  instagramUrl: "https://www.instagram.com/zagraneasyy",
  address: "г. Алматы, ул. Сатпаева 30/8, офис Блок С 3 этаж 148",
  url: "https://zagraneasy.kz",
} as const;

export const SERVICES = [
  { id: "education", icon: "🎓", title: "Обучение", subtitle: "за рубежом", color: "emerald", href: "/education" },
  { id: "tours", icon: "✈️", title: "Туры", subtitle: "по миру", color: "sky", href: "/tours" },
  { id: "work", icon: "💼", title: "Работа", subtitle: "за границей", color: "violet", href: "/work" },
  { id: "visa", icon: "🗽", title: "Виза USA", subtitle: "B1/B2, F-1", color: "blue", href: "/visa-usa" },
  { id: "realestate", icon: "🏠", title: "Жильё", subtitle: "за рубежом", color: "amber", href: "/realestate" },
] as const;

export const STATS = [
  { value: 3200, suffix: "+", label: "Клиентов" },
  { value: 50,   suffix: "+", label: "Университетов" },
  { value: 98,   suffix: "%", label: "Успешных виз" },
] as const;

export const ABOUT = {
  eyebrow: "О компании",
  heading: "Команда, которая знает дорогу",
  body: "ZagranEasy — агентство международного образования из Алматы. Более 10 специалистов сопровождают поступление в университеты Турции и Китая на каждом шаге: от выбора программы до визы и заселения. 3 200+ клиентов уже уехали учиться с нашей поддержкой.",
} as const;

// Реел-лента на главной — реальные фото/видео с Cloudinary (см. videos_reels.md,
// information_doc.md). Видео показаны статичным кадром-постером (Cloudinary отдаёт
// .jpg того же файла) — воспроизводить N копий <video> в бесконечной ленте на 90%
// мобильного трафика было бы слишком тяжело, поэтому лента остаётся картинкой + бейдж.
const CLOUDINARY = "https://res.cloudinary.com/dwq9aesrb";

export const MEDIA_REEL_ITEMS = [
  { id: "reel-01", type: "photo", label: "Офис ZagranEasy", src: `${CLOUDINARY}/image/upload/q_auto:eco,f_auto/v1776028171/about_of_us_yhf2hw.png` },
  { id: "reel-02", type: "photo", label: "Команда ZagranEasy", src: `${CLOUDINARY}/image/upload/q_auto:eco,f_auto/v1776028170/a4te_opwrjk.png` },
  { id: "reel-03", type: "video", label: "Видео-отзыв клиента", src: `${CLOUDINARY}/video/upload/q_auto:eco,f_auto/v1775761880/lololo_iqlygt.jpg` },
  { id: "reel-04", type: "photo", label: "Студенты ZagranEasy", src: `${CLOUDINARY}/image/upload/q_auto:eco,f_auto/v1776028171/intro2_qmkezg.png` },
  { id: "reel-05", type: "photo", label: "Момент со студентами", src: `${CLOUDINARY}/image/upload/q_auto:eco,f_auto/v1775763274/WhatsApp_Image_2026-04-09_at_14.43.49_mggyrg.jpg` },
  { id: "reel-06", type: "photo", label: "Документы о зачислении", src: `${CLOUDINARY}/image/upload/q_auto:eco,f_auto/v1775763270/09_e6xfue.jpg` },
  { id: "reel-07", type: "video", label: "Видео-отзыв клиента", src: `${CLOUDINARY}/video/upload/q_auto:eco,f_auto/v1775761868/474645_ny3v6g.jpg` },
  { id: "reel-08", type: "photo", label: "Момент со студентами", src: `${CLOUDINARY}/image/upload/q_auto:eco,f_auto/v1775763274/WhatsApp_Image_2026-04-09_at_14.43.43_ozhkcw.jpg` },
  { id: "reel-09", type: "photo", label: "Момент со студентами", src: `${CLOUDINARY}/image/upload/q_auto:eco,f_auto/v1775763273/WhatsApp_Image_2026-04-09_at_14.44.27_jgid6k.jpg` },
  { id: "reel-10", type: "video", label: "Видео-отзыв клиента", src: `${CLOUDINARY}/video/upload/q_auto:eco,f_auto/v1775761867/8744_k8zpyj.jpg` },
  { id: "reel-11", type: "photo", label: "Документы о зачислении", src: `${CLOUDINARY}/image/upload/q_auto:eco,f_auto/v1775763270/9797_hfoyud.jpg` },
  { id: "reel-12", type: "photo", label: "Момент со студентами", src: `${CLOUDINARY}/image/upload/q_auto:eco,f_auto/v1775763272/WhatsApp_Image_2026-04-09_at_14.44.24_vlymjk.jpg` },
  { id: "reel-13", type: "video", label: "Видео-отзыв клиента", src: `${CLOUDINARY}/video/upload/q_auto:eco,f_auto/v1775761870/823813_obpfvj.jpg` },
  { id: "reel-14", type: "photo", label: "Документы о зачислении", src: `${CLOUDINARY}/image/upload/q_auto:eco,f_auto/v1775761722/123_v2ez3z.jpg` },
  { id: "reel-15", type: "photo", label: "Момент со студентами", src: `${CLOUDINARY}/image/upload/q_auto:eco,f_auto/v1775763273/WhatsApp_Image_2026-04-09_at_14.47.23_sgemr6.jpg` },
  { id: "reel-16", type: "video", label: "Видео-отзыв клиента", src: `${CLOUDINARY}/video/upload/q_auto:eco,f_auto/v1775761929/WhatsApp_Video_2026-04-09_at_14.54.56_p9deem.jpg` },
  { id: "reel-17", type: "photo", label: "Документы о зачислении", src: `${CLOUDINARY}/image/upload/q_auto:eco,f_auto/v1775763271/WhatsApp_Image_2026-04-09_at_14.44.25_ut1ik5.jpg` },
  { id: "reel-18", type: "photo", label: "Момент со студентами", src: `${CLOUDINARY}/image/upload/q_auto:eco,f_auto/v1775763271/WhatsApp_Image_2026-04-09_at_14.44.21_vsvy0d.jpg` },
  { id: "reel-19", type: "video", label: "Видео-отзыв клиента", src: `${CLOUDINARY}/video/upload/q_auto:eco,f_auto/v1775761724/543_w1xzjf.jpg` },
] as const;

// Только фото (без видео-постеров) — для плотных фото-лент и коллажей,
// где нужна именно фотография, а не превью видео.
export const REEL_PHOTOS_ONLY = MEDIA_REEL_ITEMS.filter((i) => i.type === "photo");

// Коллаж плавающих фото в hero — 5 карточек с разной фазой анимации
export const HERO_COLLAGE = [
  REEL_PHOTOS_ONLY[3],
  REEL_PHOTOS_ONLY[4],
  REEL_PHOTOS_ONLY[6],
  REEL_PHOTOS_ONLY[8],
  REEL_PHOTOS_ONLY[1],
] as const;

// Лента "писем о зачислении" — используем реальные фото документов из Cloudinary
export const ACCEPTANCE_LETTER_PHOTOS = MEDIA_REEL_ITEMS.filter((i) => i.label === "Документы о зачислении").map(
  (i) => ({ src: i.src, alt: i.label })
);

// Лента "моменты со студентами" — второй ряд, едет в обратную сторону
export const CAMPUS_LIFE_PHOTOS = REEL_PHOTOS_ONLY.filter((i) => i.label !== "Документы о зачислении").map((i) => ({
  src: i.src,
  alt: i.label,
}));

// Отдельный номер WhatsApp для модуля образования
export const EDUCATION_PHONE = "77470382914";

// Tailwind color map for service cards
export const SERVICE_COLORS: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  emerald: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", badge: "bg-emerald-100 text-emerald-800" },
  sky:     { bg: "bg-sky-50",     border: "border-sky-200",     text: "text-sky-700",     badge: "bg-sky-100 text-sky-800" },
  violet:  { bg: "bg-violet-50",  border: "border-violet-200",  text: "text-violet-700",  badge: "bg-violet-100 text-violet-800" },
  blue:    { bg: "bg-blue-50",    border: "border-blue-200",    text: "text-blue-700",    badge: "bg-blue-100 text-blue-800" },
  amber:   { bg: "bg-amber-50",   border: "border-amber-200",   text: "text-amber-700",   badge: "bg-amber-100 text-amber-800" },
};
