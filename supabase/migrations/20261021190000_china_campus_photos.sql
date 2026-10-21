ALTER TABLE public.universities
  ADD COLUMN IF NOT EXISTS image_attribution text,
  ADD COLUMN IF NOT EXISTS image_attribution_url text;

UPDATE public.universities AS university
SET
  image_url = photo.image_url,
  gallery_images = ARRAY(
    SELECT DISTINCT image
    FROM unnest(COALESCE(university.gallery_images, ARRAY[]::text[]) || ARRAY[photo.image_url]) AS images(image)
  ),
  image_attribution = photo.attribution,
  image_attribution_url = photo.attribution_url
FROM (
  VALUES
    (
      'peking-university',
      'https://upload.wikimedia.org/wikipedia/commons/0/0f/Campus_No.3%2C_Peking_University%2C_Gate.jpg',
      'Автор не указан · общественное достояние',
      'https://commons.wikimedia.org/wiki/File:Campus_No.3,_Peking_University,_Gate.jpg'
    ),
    (
      'tsinghua-university',
      'https://upload.wikimedia.org/wikipedia/commons/e/ef/Tsinghua_University_campus_1.jpg',
      'Costi · CC BY 2.0',
      'https://commons.wikimedia.org/wiki/File:Tsinghua_University_campus_1.jpg'
    ),
    (
      'fudan-university',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Fudan-building2.jpg/1280px-Fudan-building2.jpg',
      'Whw · общественное достояние',
      'https://commons.wikimedia.org/wiki/File:Fudan-building2.jpg'
    ),
    (
      'shanghai-jiao-tong-university',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/10/A_panorama_of_Shanghai_Jiao_Tong_University_school_campus.jpg/1280px-A_panorama_of_Shanghai_Jiao_Tong_University_school_campus.jpg',
      'Ziqi CHAI · CC BY-SA 4.0',
      'https://commons.wikimedia.org/wiki/File:A_panorama_of_Shanghai_Jiao_Tong_University_school_campus.jpg'
    ),
    (
      'zhejiang-university',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9c/After_snow_-_International_Campus%2C_Zhejiang_University.png/1280px-After_snow_-_International_Campus%2C_Zhejiang_University.png',
      'Y Chen · CC BY-SA 4.0',
      'https://commons.wikimedia.org/wiki/File:After_snow_-_International_Campus,_Zhejiang_University.png'
    ),
    (
      'nanjing-university',
      'https://commons.wikimedia.org/wiki/Special:FilePath/Nanjing_University_20160714.jpg?width=1280',
      'Gmbsfd · CC BY-SA 4.0',
      'https://commons.wikimedia.org/wiki/File:Nanjing_University_20160714.jpg'
    ),
    (
      'university-of-science-and-technology-of-china',
      'https://commons.wikimedia.org/wiki/Special:FilePath/Gate_of_USTC.JPG?width=1280',
      'Ryanli · CC BY-SA 3.0',
      'https://commons.wikimedia.org/wiki/File:Gate_of_USTC.JPG'
    ),
    (
      'wuhan-university',
      'https://commons.wikimedia.org/wiki/Special:FilePath/Wuhan_University_Administration_Building.jpg?width=1280',
      'Howchou · CC BY 4.0',
      'https://commons.wikimedia.org/wiki/File:Wuhan_University_Administration_Building.jpg'
    ),
    (
      'harbin-institute-of-technology',
      'https://commons.wikimedia.org/wiki/Special:FilePath/Harbin_Institute_of_Technology_-_Main_Bldg.jpg?width=1280',
      'Yoshi Canopus · CC BY-SA 4.0',
      'https://commons.wikimedia.org/wiki/File:Harbin_Institute_of_Technology_-_Main_Bldg.jpg'
    ),
    (
      'tongji-university',
      'https://commons.wikimedia.org/wiki/Special:FilePath/Tongjidaxue_Tushuguan.JPG?width=1280',
      'Fayhoo · CC BY-SA 3.0',
      'https://commons.wikimedia.org/wiki/File:Tongjidaxue_Tushuguan.JPG'
    ),
    (
      'beijing-normal-university',
      'https://commons.wikimedia.org/wiki/Special:FilePath/Beijing_Normal_University_Library.jpg?width=1280',
      'Nick Challoner · CC BY-SA 4.0',
      'https://commons.wikimedia.org/wiki/File:Beijing_Normal_University_Library.jpg'
    ),
    (
      'renmin-university-of-china',
      'https://commons.wikimedia.org/wiki/Special:FilePath/Renmin_University_Entrance.JPG?width=1280',
      '螺钉 · CC BY-SA 3.0',
      'https://commons.wikimedia.org/wiki/File:Renmin_University_Entrance.JPG'
    ),
    (
      'xian-jiaotong-university',
      'https://commons.wikimedia.org/wiki/Special:FilePath/XJTU_campus.jpg?width=1280',
      'Zhang Zhicheng · CC BY-SA 3.0',
      'https://commons.wikimedia.org/wiki/File:XJTU_campus.jpg'
    ),
    (
      'sun-yat-sen-university',
      'https://commons.wikimedia.org/wiki/Special:FilePath/Sun_Yat-sen_University_statue.jpg?width=1280',
      'Charlie fong · CC BY-SA 4.0',
      'https://commons.wikimedia.org/wiki/File:Sun_Yat-sen_University_statue.jpg'
    ),
    (
      'huazhong-university-of-science-and-technology',
      'https://commons.wikimedia.org/wiki/Special:FilePath/HUST-Main-building-4110.jpg?width=1280',
      'Автор не указан · CC BY-SA 3.0',
      'https://commons.wikimedia.org/wiki/File:HUST-Main-building-4110.jpg'
    ),
    (
      'sichuan-university',
      'https://commons.wikimedia.org/wiki/Special:FilePath/Chengdu_1991_Sichuan_University_Entrance_(10564829693).jpg?width=1280',
      'Joe Mabel · CC BY 2.0',
      'https://commons.wikimedia.org/wiki/File:Chengdu_1991_Sichuan_University_Entrance_(10564829693).jpg'
    ),
    (
      'shandong-university',
      'https://commons.wikimedia.org/wiki/Special:FilePath/Central_Campus_of_Shandong_University.jpg?width=1280',
      'AlexHe34 · CC BY-SA 3.0',
      'https://commons.wikimedia.org/wiki/File:Central_Campus_of_Shandong_University.jpg'
    ),
    (
      'xiamen-university',
      'https://commons.wikimedia.org/wiki/Special:FilePath/Main_Entrance_of_Xiamen_University.jpg?width=1280',
      'David.C.LOK · CC BY-SA 4.0',
      'https://commons.wikimedia.org/wiki/File:Main_Entrance_of_Xiamen_University.jpg'
    ),
    (
      'tianjin-university',
      'https://commons.wikimedia.org/wiki/Special:FilePath/9th_Building_of_Tianjin_University.jpg?width=1280',
      'Amazingloong · CC BY-SA 4.0',
      'https://commons.wikimedia.org/wiki/File:9th_Building_of_Tianjin_University.jpg'
    ),
    (
      'southeast-university',
      'https://commons.wikimedia.org/wiki/Special:FilePath/Southeast_University_gate.jpg?width=1280',
      'Автор не указан · CC BY-SA 3.0',
      'https://commons.wikimedia.org/wiki/File:Southeast_University_gate.jpg'
    )
) AS photo(slug, image_url, attribution, attribution_url)
WHERE university.slug = photo.slug
  AND COALESCE(university.image_url, '') IN ('', photo.image_url);


  
