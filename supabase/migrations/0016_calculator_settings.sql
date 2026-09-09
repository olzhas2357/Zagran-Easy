-- Тарифы калькулятора менеджера — редактируемые сотрудниками (staff), а не
-- захардкоженные в коде. Ключ/значение (jsonb), т.к. структура тарифов разная
-- для каждой услуги. Применять через Supabase SQL Editor, после 0015.

create table if not exists calculator_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references profiles(id) on delete set null
);

alter table calculator_settings enable row level security;

create policy "staff manage calculator_settings" on calculator_settings
  for all using (public.is_staff()) with check (public.is_staff());

-- Значения по умолчанию — перенос текущих значений из lib/calculator.ts.
-- Валюта пакетов и остальных тарифов — тенге (₸).
insert into calculator_settings (key, value) values
  ('education_fees', '{"turkey":500,"china":700,"italy":600,"malaysia":550}'),
  ('education_extras', '{"Перевод документов":150,"Нотариальное заверение":100,"Визовое сопровождение":300,"Встреча в аэропорту":100,"Поиск жилья":200}'),
  ('education_packages', '{"global_2027":{"label":"GLOBAL 2027 (полный пакет поступления)","amount":1790000,"goal":"Поступление на бакалавриат в англоязычную страну","duration":"TODO — уточнить после файла «Два пакета» (ориентировочно 6–12 месяцев)","format":"TODO — уточнить формат занятий (группа/индивидуально, онлайн/офлайн)","description":"Английский язык + подготовка к IELTS + сопровождение поступления за рубеж (вуз, документы, подача заявки)."},"china_2027":{"label":"CHINA 2027 (полный пакет поступления)","amount":1990000,"goal":"Поступление на бакалавриат в вуз Китая","duration":"TODO — уточнить после файла «Два пакета» (ориентировочно 6–12 месяцев)","format":"TODO — уточнить формат занятий (группа/индивидуально, онлайн/офлайн)","description":"Китайский язык + подготовка к HSK + CSCA + сопровождение поступления в Китай (вуз, документы, подача заявки)."}}'),
  ('visa_fees', '{"service":350,"consular":185,"interview_prep":200,"urgent_booking":150}'),
  ('work_fees', '{"turkey":800,"poland":1200,"germany":1500,"processing":400,"relocation":500}'),
  ('tours_fees', '{"per_day":250,"service":200}'),
  ('realestate_fees', '{"legal_support":1500,"residency_permit":800}')
on conflict (key) do nothing;
