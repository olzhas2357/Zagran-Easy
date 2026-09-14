-- University CMS writes belong to ADMIN only. Managers keep public read access
-- to active universities for search and client selection.
drop policy if exists "staff full access countries" on public.education_countries;
drop policy if exists "staff full access universities" on public.universities;

create policy "admins manage countries" on public.education_countries for all to authenticated
using ((select private.current_user_is_admin()))
with check ((select private.current_user_is_admin()));

create policy "admins manage universities" on public.universities for all to authenticated
using ((select private.current_user_is_admin()))
with check ((select private.current_user_is_admin()));

drop policy if exists "staff upload university-media" on storage.objects;
drop policy if exists "staff delete university-media" on storage.objects;

create policy "admins upload university-media" on storage.objects for insert to authenticated
with check (bucket_id = 'university-media' and (select private.current_user_is_admin()));
create policy "admins update university-media" on storage.objects for update to authenticated
using (bucket_id = 'university-media' and (select private.current_user_is_admin()))
with check (bucket_id = 'university-media' and (select private.current_user_is_admin()));
create policy "admins delete university-media" on storage.objects for delete to authenticated
using (bucket_id = 'university-media' and (select private.current_user_is_admin()));
