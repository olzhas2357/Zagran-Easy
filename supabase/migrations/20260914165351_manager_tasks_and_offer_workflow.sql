-- Commercial-offer lifecycle and manager task workspace.

alter table public.cost_calculations
  drop constraint if exists cost_calculations_status_check;

alter table public.cost_calculations
  add constraint cost_calculations_status_check
  check (status in ('draft', 'sent', 'viewed', 'accepted', 'rejected', 'archived', 'expired'));

alter table public.cost_calculations
  add column if not exists sent_at timestamptz,
  add column if not exists viewed_at timestamptz,
  add column if not exists accepted_at timestamptz,
  add column if not exists rejected_at timestamptz,
  add column if not exists archived_at timestamptz;

create index if not exists cost_calculations_manager_status_idx
  on public.cost_calculations (manager_id, status, updated_at desc);

create table public.manager_tasks (
  id uuid primary key default gen_random_uuid(),
  manager_id uuid not null references public.profiles(id) on delete restrict,
  client_id uuid references public.clients(id) on delete cascade,
  admission_case_id uuid references public.admission_cases(id) on delete cascade,
  stage_id text,
  title text not null check (length(trim(title)) > 0),
  description text,
  task_type text not null default 'other'
    check (task_type in ('call', 'whatsapp', 'meeting', 'document_review', 'payment', 'proposal', 'application', 'reminder', 'other')),
  priority text not null default 'normal'
    check (priority in ('low', 'normal', 'high', 'urgent')),
  status text not null default 'open'
    check (status in ('open', 'in_progress', 'completed', 'cancelled')),
  due_at timestamptz,
  completed_at timestamptz,
  result_comment text,
  created_by uuid not null references public.profiles(id) on delete restrict,
  automation_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint manager_tasks_completion_check check (
    (status = 'completed' and completed_at is not null)
    or (status <> 'completed' and completed_at is null)
  )
);

create index manager_tasks_manager_due_idx
  on public.manager_tasks (manager_id, due_at)
  where status in ('open', 'in_progress');
create index manager_tasks_client_idx
  on public.manager_tasks (client_id, created_at desc)
  where client_id is not null;
create index manager_tasks_case_idx
  on public.manager_tasks (admission_case_id, created_at desc)
  where admission_case_id is not null;
create index manager_tasks_completed_idx
  on public.manager_tasks (manager_id, completed_at desc)
  where status = 'completed';
create unique index manager_tasks_automation_key_idx
  on public.manager_tasks (automation_key)
  where automation_key is not null;

create trigger manager_tasks_touch_updated_at
before update on public.manager_tasks
for each row execute function private.touch_updated_at();

alter table public.manager_tasks enable row level security;
revoke all on table public.manager_tasks from anon, authenticated;
grant select, insert, update, delete on table public.manager_tasks to authenticated;
grant select, insert, update, delete on table public.manager_tasks to service_role;

create policy "staff read accessible manager tasks"
on public.manager_tasks for select to authenticated
using (
  manager_id = (select auth.uid())
  or (select private.current_user_is_admin())
);

create policy "staff create accessible manager tasks"
on public.manager_tasks for insert to authenticated
with check (
  created_by = (select auth.uid())
  and (manager_id = (select auth.uid()) or (select private.current_user_is_admin()))
  and (client_id is null or (select private.can_access_client(client_id)))
);

create policy "staff update accessible manager tasks"
on public.manager_tasks for update to authenticated
using (manager_id = (select auth.uid()) or (select private.current_user_is_admin()))
with check (
  (manager_id = (select auth.uid()) or (select private.current_user_is_admin()))
  and (client_id is null or (select private.can_access_client(client_id)))
);

create policy "staff delete accessible manager tasks"
on public.manager_tasks for delete to authenticated
using (
  (manager_id = (select auth.uid()) and created_by = (select auth.uid()))
  or (select private.current_user_is_admin())
);

create or replace function private.set_offer_status_timestamps()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.status is distinct from old.status then
    if new.status = 'sent' and new.sent_at is null then new.sent_at = now(); end if;
    if new.status = 'viewed' and new.viewed_at is null then new.viewed_at = now(); end if;
    if new.status = 'accepted' and new.accepted_at is null then new.accepted_at = now(); end if;
    if new.status = 'rejected' and new.rejected_at is null then new.rejected_at = now(); end if;
    if new.status = 'archived' and new.archived_at is null then new.archived_at = now(); end if;
  end if;
  return new;
end;
$$;

revoke all on function private.set_offer_status_timestamps() from public;
grant execute on function private.set_offer_status_timestamps() to authenticated, service_role;

create trigger cost_calculations_set_status_timestamps
before update of status on public.cost_calculations
for each row execute function private.set_offer_status_timestamps();

create or replace function private.create_initial_client_task()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  insert into public.manager_tasks (
    manager_id, client_id, title, description, task_type, priority,
    due_at, created_by, automation_key
  ) values (
    new.assigned_manager_id,
    new.id,
    'Связаться с новым клиентом',
    'Клиент создан, первичный контакт ещё не зафиксирован.',
    'call',
    'high',
    now() + interval '1 day',
    new.created_by,
    'client:' || new.id::text || ':initial-contact'
  ) on conflict (automation_key) where automation_key is not null do nothing;
  return new;
end;
$$;

revoke all on function private.create_initial_client_task() from public;
grant execute on function private.create_initial_client_task() to authenticated, service_role;

create trigger clients_create_initial_task
after insert on public.clients
for each row execute function private.create_initial_client_task();

create or replace function private.create_sent_offer_followup_task()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.status = 'sent' and old.status is distinct from new.status then
    insert into public.manager_tasks (
      manager_id, client_id, admission_case_id, title, description,
      task_type, priority, due_at, created_by, automation_key
    ) values (
      new.manager_id,
      new.client_id,
      new.admission_case_id,
      'Уточнить решение по предложению',
      'Коммерческое предложение отправлено, но ответ клиента ещё не получен.',
      'proposal',
      'normal',
      now() + interval '3 days',
      new.manager_id,
      'offer:' || new.id::text || ':sent-followup'
    ) on conflict (automation_key) where automation_key is not null do nothing;
  end if;
  return new;
end;
$$;

revoke all on function private.create_sent_offer_followup_task() from public;
grant execute on function private.create_sent_offer_followup_task() to authenticated, service_role;

create trigger cost_calculations_create_followup_task
after update of status on public.cost_calculations
for each row execute function private.create_sent_offer_followup_task();

-- Invoke daily from the backend scheduler. It is deliberately unavailable to
-- browser roles; only the service role may generate cross-user tasks.
create or replace function private.generate_scheduled_manager_tasks()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  inserted_count integer := 0;
  affected integer := 0;
begin
  insert into public.manager_tasks (
    manager_id, client_id, admission_case_id, stage_id, title, description,
    task_type, priority, due_at, created_by, automation_key
  )
  select
    c.manager_id,
    c.client_id,
    c.id,
    c.stage,
    'Проверить приближающийся дедлайн',
    'До следующего дедлайна клиента осталось не более семи дней.',
    'reminder',
    'high',
    c.next_deadline_at,
    c.manager_id,
    'case:' || c.id::text || ':deadline:' || c.next_deadline_at::date::text
  from public.admission_cases c
  where c.stage not in ('enrolled', 'closed')
    and c.next_deadline_at > now()
    and c.next_deadline_at <= now() + interval '7 days'
  on conflict (automation_key) where automation_key is not null do nothing;
  get diagnostics affected = row_count;
  inserted_count := inserted_count + affected;

  insert into public.manager_tasks (
    manager_id, client_id, admission_case_id, stage_id, title, description,
    task_type, priority, due_at, created_by, automation_key
  )
  select
    c.manager_id,
    c.client_id,
    c.id,
    c.stage,
    'Проверить статус поступления',
    'Этап поступления не менялся более семи дней.',
    'reminder',
    'normal',
    now(),
    c.manager_id,
    'case:' || c.id::text || ':stale-stage:' || c.stage
  from public.admission_cases c
  where c.stage not in ('enrolled', 'closed')
    and c.updated_at <= now() - interval '7 days'
  on conflict (automation_key) where automation_key is not null do nothing;
  get diagnostics affected = row_count;
  inserted_count := inserted_count + affected;

  return inserted_count;
end;
$$;

revoke all on function private.generate_scheduled_manager_tasks() from public, anon, authenticated;
grant execute on function private.generate_scheduled_manager_tasks() to service_role;
