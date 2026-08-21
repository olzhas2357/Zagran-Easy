// Требования к поступлению по странам — блок 4 на странице /education/[slug].
// Категории отличаются от страны к стране (это не структурировано в БД),
// поэтому контент статичный. Составлено по аналогии с примерами из ТЗ
// (Турция, Китай) — перед публикацией стоит проверить актуальность цифр
// и требований для остальных стран.

export interface RequirementItem {
  label: string;
  value: string;
}

export const educationRequirements: Record<string, RequirementItem[]> = {
  turkey: [
    { label: "Документы", value: "Аттестат, паспорт, фото 3×4" },
    { label: "Языковой тест", value: "TÖMER (турецкий) или IELTS/TOEFL (английский)" },
    { label: "Вступительный", value: "TR-YÖS или SAT (зависит от вуза)" },
    { label: "Апостиль", value: "Требуется на аттестат + перевод" },
  ],
  china: [
    { label: "Документы", value: "Аттестат, паспорт, медсправка" },
    { label: "Языковой тест", value: "HSK 4+ (для программ на китайском)" },
    { label: "Грант", value: "CSCA или грант университета" },
    { label: "Языковой год", value: "Можно начать без HSK" },
  ],
  malaysia: [
    { label: "Документы", value: "Аттестат, паспорт, фото 3×4" },
    { label: "Языковой тест", value: "IELTS 5.5+ или TOEFL (английский язык обучения)" },
    { label: "Вступительный", value: "Собеседование или тест вуза (зависит от программы)" },
    { label: "Легализация", value: "Апостиль на аттестат + нотариальный перевод" },
  ],
  italy: [
    { label: "Документы", value: "Аттестат, паспорт, фото 3×4" },
    { label: "Языковой тест", value: "IELTS/TOEFL (английский) или CILS/CELI (итальянский)" },
    { label: "Грант DSU", value: "Оформляется по доходу семьи после зачисления" },
    { label: "Легализация", value: "Апостиль + Dichiarazione di Valore на аттестат" },
  ],
  germany: [
    { label: "Документы", value: "Аттестат, паспорт, фото 3×4" },
    { label: "Языковой тест", value: "TestDaF/DSH (немецкий) или IELTS (англоязычные программы)" },
    { label: "Studienkolleg", value: "Подготовительный год при неполном соответствии аттестата" },
    { label: "Легализация", value: "Апостиль на аттестат + перевод" },
  ],
  austria: [
    { label: "Документы", value: "Аттестат, паспорт, фото 3×4" },
    { label: "Языковой тест", value: "ÖSD/TestDaF (немецкий) или IELTS (англоязычные программы)" },
    { label: "Взнос за семестр", value: "Оплачивается ежесеместрово, размер зависит от вуза" },
    { label: "Легализация", value: "Апостиль на аттестат + перевод" },
  ],
  usa: [
    { label: "Документы", value: "Аттестат/транскрипт, паспорт, фото" },
    { label: "Языковой тест", value: "IELTS/TOEFL или Duolingo English Test" },
    { label: "Вступительный", value: "SAT/ACT (для части университетов) или Community College без экзаменов" },
    { label: "Виза", value: "F-1 студенческая виза после получения I-20" },
  ],
  canada: [
    { label: "Документы", value: "Аттестат/транскрипт, паспорт, фото" },
    { label: "Языковой тест", value: "IELTS/TOEFL (английский) или TEF (французский)" },
    { label: "Study Permit", value: "Учебная виза после письма о зачислении" },
    { label: "PGWP", value: "Рабочая виза после выпуска — путь к иммиграции" },
  ],
  uk: [
    { label: "Документы", value: "Аттестат/транскрипт, паспорт, фото" },
    { label: "Языковой тест", value: "IELTS Academic (обычно от 6.0)" },
    { label: "Foundation Year", value: "Подготовительная программа при неполном соответствии аттестата" },
    { label: "Виза", value: "Student visa после CAS от университета" },
  ],
};

export function getRequirementsBySlug(slug: string): RequirementItem[] {
  return educationRequirements[slug] || [];
}

// Название страны в предложном падеже ("в Турции", "в Китае") — нужно для
// заголовков и текстов WhatsApp-кнопок ("Обучение в {country.name}").
// В схеме БД такого поля нет, склонение по-русски нерегулярное, поэтому карта статичная.
const COUNTRY_NAME_IN_CASE: Record<string, string> = {
  turkey: "Турции",
  china: "Китае",
  malaysia: "Малайзии",
  italy: "Италии",
  germany: "Германии",
  austria: "Австрии",
  usa: "США",
  canada: "Канаде",
  uk: "Великобритании",
};

export function getCountryNameInCase(slug: string, fallbackName: string): string {
  return COUNTRY_NAME_IN_CASE[slug] || fallbackName;
}
