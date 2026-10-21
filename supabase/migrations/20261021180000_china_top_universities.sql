-- Seed the 20 universities shown in the China education guide.
-- Existing universities are matched by slug, English name, Chinese name, or Russian display name.
-- Unknown admission, cost, ranking, and media data are intentionally left unset.

begin;

do $$
declare
  china_id uuid;
begin
  select id into china_id
  from public.education_countries
  where slug = 'china';

  if china_id is null then
    raise exception 'Country with slug=china was not found; China universities were not added';
  end if;

  with seed (
    slug, english_name, chinese_name, russian_name, city, specialties,
    description, website_url, sort_order, aliases
  ) as (
    values
      ('peking-university', 'Peking University', '北京大学', 'Пекинский университет', 'Пекин',
       array['Экономика и финансы','Право и международные отношения','Медицина и биология','Компьютерные науки'],
       'Гуманитарные и общественные науки, экономика, право, медицина и естественные науки.',
       'https://www.pku.edu.cn/', 1001,
       array['peking university','北京大学','пекинский университет']),
      ('tsinghua-university', 'Tsinghua University', '清华大学', 'Университет Цинхуа', 'Пекин',
       array['Инженерия и робототехника','Компьютерные науки и ИИ','Архитектура','Бизнес и экономика'],
       'Технологии, инженерия, бизнес и архитектура.',
       'https://www.tsinghua.edu.cn/', 1002,
       array['tsinghua university','清华大学','университет цинхуа']),
      ('fudan-university', 'Fudan University', '复旦大学', 'Университет Фудань', 'Шанхай',
       array['Экономика и менеджмент','Международные отношения','Медицина','Журналистика и коммуникации'],
       'Многопрофильный университет с направлениями в экономике, медицине, гуманитарных и общественных науках.',
       'https://www.fudan.edu.cn/', 1003,
       array['fudan university','复旦大学','университет фудань']),
      ('shanghai-jiao-tong-university', 'Shanghai Jiao Tong University', '上海交通大学', 'Шанхайский университет Цзяотун', 'Шанхай',
       array['Инженерия','Компьютерные науки и ИИ','Медицина','Бизнес и менеджмент'],
       'Технологии, инженерия, медицина и предпринимательство.',
       'https://www.sjtu.edu.cn/', 1004,
       array['shanghai jiao tong university','上海交通大学','шанхайский университет цзяотун']),
      ('zhejiang-university', 'Zhejiang University', '浙江大学', 'Чжэцзянский университет', 'Ханчжоу',
       array['Информационные технологии','Инженерия','Биомедицина','Экономика и менеджмент'],
       'Исследовательский университет с направлениями в технологиях, инженерии и биомедицине.',
       'https://www.zju.edu.cn/', 1005,
       array['zhejiang university','浙江大学','чжэцзянский университет']),
      ('nanjing-university', 'Nanjing University', '南京大学', 'Нанкинский университет', 'Нанкин',
       array['Физика и химия','Компьютерные науки','Экономика','Китайский язык и культура'],
       'Исследовательские направления, естественные науки, гуманитарные дисциплины и бизнес.',
       'https://www.nju.edu.cn/', 1006,
       array['nanjing university','南京大学','нанкинский университет']),
      ('university-of-science-and-technology-of-china', 'University of Science and Technology of China', '中国科学技术大学', 'Университет науки и технологий Китая', 'Хэфэй',
       array['Физика и математика','Информатика и ИИ','Инженерия','Материаловедение'],
       'Естественные науки, высокие технологии и исследовательская подготовка.',
       'https://www.ustc.edu.cn/', 1007,
       array['university of science and technology of china','中国科学技术大学','университет науки и технологий китая']),
      ('wuhan-university', 'Wuhan University', '武汉大学', 'Университет Ухань', 'Ухань',
       array['Право','Геоинформатика и картография','Медицина','Экономика и менеджмент'],
       'Многопрофильный университет с направлениями в праве, геоинформатике и медицине.',
       'https://www.whu.edu.cn/', 1008,
       array['wuhan university','武汉大学','университет ухань']),
      ('harbin-institute-of-technology', 'Harbin Institute of Technology', '哈尔滨工业大学', 'Харбинский технологический институт', 'Харбин',
       array['Аэрокосмическая инженерия','Робототехника','Компьютерные науки','Машиностроение'],
       'Инженерия, космические технологии, производство и прикладные науки.',
       'https://www.hit.edu.cn/', 1009,
       array['harbin institute of technology','哈尔滨工业大学','харбинский технологический институт']),
      ('tongji-university', 'Tongji University', '同济大学', 'Университет Тунцзи', 'Шанхай',
       array['Архитектура и дизайн','Гражданское строительство','Городское планирование','Инженерия'],
       'Архитектура, городское развитие, инженерия и устойчивые технологии.',
       'https://www.tongji.edu.cn/', 1010,
       array['tongji university','同济大学','университет тунцзи']),
      ('beijing-normal-university', 'Beijing Normal University', '北京师范大学', 'Пекинский педагогический университет', 'Пекин',
       array['Образование и педагогика','Психология','Экология','Китайский язык'],
       'Образование, психология, гуманитарные и экологические науки.',
       'https://www.bnu.edu.cn/', 1011,
       array['beijing normal university','北京师范大学','пекинский педагогический университет']),
      ('renmin-university-of-china', 'Renmin University of China', '中国人民大学', 'Народный университет Китая', 'Пекин',
       array['Экономика и финансы','Социология','Право','Государственное управление'],
       'Экономика, социальные науки, право и государственное управление.',
       'https://www.ruc.edu.cn/', 1012,
       array['renmin university of china','中国人民大学','народный университет китая']),
      ('xian-jiaotong-university', 'Xi''an Jiaotong University', '西安交通大学', 'Сианьский университет Цзяотун', 'Сиань',
       array['Энергетика','Машиностроение','Медицина','Менеджмент'],
       'Инженерия, энергетика, медицина и управление.',
       'https://www.xjtu.edu.cn/', 1013,
       array['xi''an jiaotong university','西安交通大学','сианьский университет цзяотун']),
      ('sun-yat-sen-university', 'Sun Yat-sen University', '中山大学', 'Университет Сунь Ятсена', 'Гуанчжоу',
       array['Медицина и биология','Бизнес','Международные отношения','Компьютерные науки'],
       'Медицина, бизнес, гуманитарные науки и исследования в регионе Большого залива.',
       'https://www.sysu.edu.cn/', 1014,
       array['sun yat-sen university','中山大学','университет сунь ятсена']),
      ('huazhong-university-of-science-and-technology', 'Huazhong University of Science and Technology', '华中科技大学', 'Хуачжунский университет науки и технологий', 'Ухань',
       array['Оптика и фотоника','Машиностроение','Медицина','Компьютерные науки'],
       'Инженерия, медицина, оптика и прикладные исследования.',
       'https://www.hust.edu.cn/', 1015,
       array['huazhong university of science and technology','华中科技大学','хуачжунский университет науки и технологий']),
      ('sichuan-university', 'Sichuan University', '四川大学', 'Сычуаньский университет', 'Чэнду',
       array['Медицина и стоматология','Материаловедение','Инженерия','Китайский язык'],
       'Многопрофильный университет с направлениями в медицине, инженерии и гуманитарных науках.',
       'https://www.scu.edu.cn/', 1016,
       array['sichuan university','四川大学','сычуаньский университет']),
      ('shandong-university', 'Shandong University', '山东大学', 'Шаньдунский университет', 'Цзинань',
       array['Медицина','Математика и физика','Инженерия','Экономика'],
       'Медицина, естественные науки, инженерия и гуманитарные дисциплины.',
       'https://www.sdu.edu.cn/', 1017,
       array['shandong university','山东大学','шаньдунский университет']),
      ('xiamen-university', 'Xiamen University', '厦门大学', 'Университет Сямэнь', 'Сямэнь',
       array['Экономика и финансы','Морские науки','Химия','Международный бизнес'],
       'Экономика, морские науки, химия и международные направления.',
       'https://www.xmu.edu.cn/', 1018,
       array['xiamen university','厦门大学','университет сямэнь']),
      ('tianjin-university', 'Tianjin University', '天津大学', 'Тяньцзиньский университет', 'Тяньцзинь',
       array['Химическая инженерия','Архитектура','Гражданское строительство','Бизнес'],
       'Инженерия, химические технологии, архитектура и менеджмент.',
       'https://www.tju.edu.cn/', 1019,
       array['tianjin university','天津大学','тяньцзиньский университет']),
      ('southeast-university', 'Southeast University', '东南大学', 'Юго-Восточный университет', 'Нанкин',
       array['Архитектура','Транспортная инженерия','Электроника','Медицина'],
       'Архитектура, инженерия, транспортные системы и медицина.',
       'https://www.seu.edu.cn/', 1020,
       array['southeast university','东南大学','юго-восточный университет'])
  )
  insert into public.universities (
    country_id, slug, name, name_local, city, type, degree_levels, languages,
    specialties, requirements, description, image_url, website_url, google_maps_url, ranking_national,
    has_grant, has_dormitory, programs_count, program_list, stories, is_active, sort_order
  )
  select
    china_id,
    seed.slug,
    seed.english_name,
    seed.chinese_name,
    seed.city,
    'public',
    '{}',
    '{}',
    seed.specialties,
    '{}',
    seed.description,
    '',
    seed.website_url,
    'https://www.google.com/maps/search/?api=1&query=' ||
      replace(seed.english_name || ' ' || seed.city || ' China', ' ', '+'),
    null,
    false,
    false,
    0,
    '[]'::jsonb,
    '[]'::jsonb,
    true,
    seed.sort_order
  from seed
  where not exists (
    select 1
    from public.universities existing
    where existing.slug = seed.slug
       or (
         existing.country_id = china_id
         and (
           lower(existing.name) = any(seed.aliases)
           or lower(coalesce(existing.name_local, '')) = any(seed.aliases)
         )
       )
  );

  update public.education_countries
  set university_count = (
    select count(*)::integer
    from public.universities
    where country_id = china_id and is_active
  )
  where id = china_id;
end
$$;

commit;
