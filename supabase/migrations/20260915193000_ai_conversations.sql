create table public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  manager_id uuid not null references public.profiles(id) on delete restrict,
  client_id uuid references public.clients(id) on delete restrict,
  title text not null default 'Новый чат' check (length(trim(title)) > 0),
  context_type text not null check (context_type in ('manager_dashboard', 'client_card', 'university', 'calculator')),
  status text not null default 'active' check (status in ('active', 'archived')),
  last_message_preview text,
  last_message_at timestamptz,
  archived_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ai_conversations_context_check check (
    (context_type = 'client_card' and client_id is not null) or context_type <> 'client_card'
  ),
  constraint ai_conversations_archive_check check (
    (status = 'archived' and archived_at is not null) or (status = 'active' and archived_at is null)
  )
);

create table public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ai_conversations(id) on delete restrict,
  role text not null check (role in ('user', 'assistant')),
  content text not null check (length(trim(content)) > 0),
  status text not null default 'completed' check (status in ('pending', 'completed', 'failed')),
  sources jsonb not null default '[]'::jsonb check (jsonb_typeof(sources) = 'array'),
  warnings jsonb not null default '[]'::jsonb check (jsonb_typeof(warnings) = 'array'),
  suggested_actions jsonb not null default '[]'::jsonb check (jsonb_typeof(suggested_actions) = 'array'),
  provider text,
  model text,
  error_message text,
  created_at timestamptz not null default now()
);

create index ai_conversations_manager_recent_idx on public.ai_conversations (manager_id, last_message_at desc, created_at desc) where deleted_at is null;
create index ai_conversations_client_recent_idx on public.ai_conversations (client_id, last_message_at desc) where client_id is not null and deleted_at is null;
create index ai_conversations_manager_status_idx on public.ai_conversations (manager_id, status, last_message_at desc) where deleted_at is null;
create index ai_messages_conversation_recent_idx on public.ai_messages (conversation_id, created_at, id);
create trigger ai_conversations_touch_updated_at before update on public.ai_conversations for each row execute function private.touch_updated_at();

alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;
revoke all on public.ai_conversations, public.ai_messages from anon, authenticated;
grant select, insert, update on public.ai_conversations to authenticated, service_role;
grant select, insert, update on public.ai_messages to authenticated, service_role;

create policy "managers read own ai conversations" on public.ai_conversations for select to authenticated
using (manager_id = (select auth.uid()) or (select private.current_user_is_admin()));
create policy "managers create own ai conversations" on public.ai_conversations for insert to authenticated
with check (manager_id = (select auth.uid()) and (client_id is null or (select private.can_access_client(client_id))));
create policy "managers update own ai conversations" on public.ai_conversations for update to authenticated
using (manager_id = (select auth.uid()) or (select private.current_user_is_admin()))
with check (manager_id = (select auth.uid()) or (select private.current_user_is_admin()));
create policy "managers read own ai messages" on public.ai_messages for select to authenticated
using (exists (select 1 from public.ai_conversations c where c.id = conversation_id and (c.manager_id = (select auth.uid()) or (select private.current_user_is_admin()))));
create policy "managers create own ai messages" on public.ai_messages for insert to authenticated
with check (exists (select 1 from public.ai_conversations c where c.id = conversation_id and c.manager_id = (select auth.uid()) and c.deleted_at is null));
create policy "managers update own ai messages" on public.ai_messages for update to authenticated
using (exists (select 1 from public.ai_conversations c where c.id = conversation_id and (c.manager_id = (select auth.uid()) or (select private.current_user_is_admin()))))
with check (exists (select 1 from public.ai_conversations c where c.id = conversation_id and (c.manager_id = (select auth.uid()) or (select private.current_user_is_admin()))));
