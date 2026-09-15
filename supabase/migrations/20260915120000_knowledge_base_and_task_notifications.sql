-- Structured knowledge base and in-app manager task notifications.

create table public.knowledge_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) > 0),
  section text not null check (section in (
    'Информация о компании', 'Услуги ZagranEasy', 'Языковые курсы', 'Страны',
    'Университеты', 'Программы', 'Стоимость', 'Гранты', 'Общежития',
    'Визовые требования', 'Этапы поступления', 'Документы', 'Рассрочка и платежи',
    'Скрипты продаж', 'Ответы на возражения', 'Часто задаваемые вопросы',
    'Внутренние инструкции менеджеров'
  ))
  ,
  content text not null check (length(trim(content)) > 0),
  language text not null default 'ru' check (language in ('ru', 'kk', 'en')),
  status text not null default 'draft' check (status in ('draft', 'review', 'published', 'archived')),
  source text,
  author_id uuid not null references public.profiles(id) on delete restrict,
  published_by uuid references public.profiles(id) on delete set null,
  published_at timestamptz,
  next_review_at date,
  version integer not null default 1 check (version > 0),
  allowed_roles text[] not null default array['admin', 'manager']::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint knowledge_articles_publication_check check (
    (status = 'published' and published_by is not null and published_at is not null)
    or status <> 'published'
  ),
  constraint knowledge_articles_roles_check check (
    allowed_roles <@ array['admin', 'manager']::text[] and cardinality(allowed_roles) > 0
  )
);

create index knowledge_articles_section_status_idx on public.knowledge_articles (section, status, updated_at desc);
create index knowledge_articles_review_idx on public.knowledge_articles (next_review_at) where status = 'published';
create index knowledge_articles_allowed_roles_idx on public.knowledge_articles using gin (allowed_roles);

create trigger knowledge_articles_touch_updated_at before update on public.knowledge_articles
for each row execute function private.touch_updated_at();

create or replace function private.prepare_knowledge_article_update()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  if new.content is distinct from old.content or new.title is distinct from old.title then
    new.version = old.version + 1;
    if old.status = 'published' and new.status = old.status then
      new.status = 'review';
      new.published_by = null;
      new.published_at = null;
    end if;
  end if;
  if new.status = 'published' and old.status is distinct from new.status then
    if current_user <> 'service_role' and not (select private.current_user_is_admin()) then
      raise exception 'Only an administrator can publish a knowledge article';
    end if;
    if current_user <> 'service_role' then
      new.published_by = (select auth.uid());
      new.published_at = now();
    end if;
  elsif new.status <> 'published' then
    new.published_by = null;
    new.published_at = null;
  end if;
  return new;
end;
$$;

revoke all on function private.prepare_knowledge_article_update() from public;
grant execute on function private.prepare_knowledge_article_update() to authenticated, service_role;
create trigger knowledge_articles_prepare_update before update on public.knowledge_articles
for each row execute function private.prepare_knowledge_article_update();

alter table public.knowledge_articles enable row level security;
revoke all on table public.knowledge_articles from anon, authenticated;
grant select, insert, update, delete on table public.knowledge_articles to authenticated;
grant select, insert, update, delete on table public.knowledge_articles to service_role;

create policy "staff read role-accessible knowledge"
on public.knowledge_articles for select to authenticated
using (
  exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = any(allowed_roles))
);
create policy "staff create knowledge drafts"
on public.knowledge_articles for insert to authenticated
with check (author_id = (select auth.uid()) and status in ('draft', 'review'));
create policy "authors and admins update knowledge"
on public.knowledge_articles for update to authenticated
using (author_id = (select auth.uid()) or (select private.current_user_is_admin()))
with check (author_id = (select auth.uid()) or (select private.current_user_is_admin()));
create policy "admins delete knowledge"
on public.knowledge_articles for delete to authenticated
using ((select private.current_user_is_admin()));

-- AI retrieval must use this view: drafts and review copies are excluded.
create view public.published_knowledge_articles with (security_invoker = true) as
select id, title, section, content, language, source, version, allowed_roles, published_at, updated_at
from public.knowledge_articles
where status = 'published';
revoke all on public.published_knowledge_articles from anon, authenticated;
grant select on public.published_knowledge_articles to authenticated, service_role;

create table public.manager_task_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  task_id uuid not null references public.manager_tasks(id) on delete cascade,
  title text not null,
  body text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index manager_task_notifications_user_unread_idx on public.manager_task_notifications (user_id, created_at desc) where read_at is null;
create unique index manager_task_notifications_task_kind_idx on public.manager_task_notifications (user_id, task_id, title);
alter table public.manager_task_notifications enable row level security;
revoke all on table public.manager_task_notifications from anon, authenticated;
grant select, update (read_at) on table public.manager_task_notifications to authenticated;
grant select, insert, update, delete on table public.manager_task_notifications to service_role;
create policy "users read own task notifications" on public.manager_task_notifications for select to authenticated using (user_id = (select auth.uid()));
create policy "users mark own task notifications read" on public.manager_task_notifications for update to authenticated
using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create or replace function private.notify_manager_about_task()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    insert into public.manager_task_notifications (user_id, task_id, title, body)
    values (new.manager_id, new.id, 'Новая задача', new.title) on conflict do nothing;
  elsif new.status = 'completed' and old.status is distinct from new.status then
    insert into public.manager_task_notifications (user_id, task_id, title, body)
    values (new.manager_id, new.id, 'Задача выполнена', new.title) on conflict do nothing;
  elsif new.due_at is distinct from old.due_at then
    insert into public.manager_task_notifications (user_id, task_id, title, body)
    values (new.manager_id, new.id, 'Срок задачи изменён', new.title) on conflict do nothing;
  end if;
  return new;
end;
$$;
revoke all on function private.notify_manager_about_task() from public;
create trigger manager_tasks_create_notification after insert or update on public.manager_tasks
for each row execute function private.notify_manager_about_task();

-- Backend scheduler calls this daily to create due/overdue in-app notices.
create or replace function private.generate_manager_task_notifications()
returns integer language plpgsql security definer set search_path = '' as $$
declare inserted_count integer;
begin
  insert into public.manager_task_notifications (user_id, task_id, title, body)
  select t.manager_id, t.id,
    case when t.due_at < now() then 'Задача просрочена' else 'Задача на сегодня' end,
    t.title
  from public.manager_tasks t
  where t.status in ('open', 'in_progress')
    and t.due_at < date_trunc('day', now()) + interval '1 day'
  on conflict do nothing;
  get diagnostics inserted_count = row_count;
  return inserted_count;
end;
$$;
revoke all on function private.generate_manager_task_notifications() from public, anon, authenticated;
grant execute on function private.generate_manager_task_notifications() to service_role;
