begin;

update public.university_programs program
set degree_level = 'Докторантура (PhD)',
    updated_at = now()
from public.universities university
where program.university_id = university.id
  and university.slug = 'shenzhen-university'
  and program.external_id = 'szu-phd-2027'
  and program.degree_level = 'PhD';

update public.universities
set degree_levels = array_replace(degree_levels, 'PhD', 'Докторантура (PhD)'),
    updated_at = now()
where slug = 'shenzhen-university'
  and degree_levels @> array['PhD']::text[];

commit;
