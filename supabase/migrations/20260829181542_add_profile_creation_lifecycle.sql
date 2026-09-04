begin;

-- A BuzzCard profile is optional. Authentication must succeed independently
-- from profile creation, so remove the legacy signup side effect first.
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

alter table public.profiles
  add column if not exists profile_label text,
  add column if not exists status text not null default 'draft',
  add column if not exists template_data jsonb not null default '{}'::jsonb,
  add column if not exists first_published_at timestamp with time zone;

-- A profile now starts only after a template is explicitly selected. Existing
-- values are retained; only the old implicit fallback is removed.
alter table public.profiles
  alter column template_id drop default;

alter table public.profiles
  drop constraint if exists profiles_status_check,
  add constraint profiles_status_check
    check (status in ('draft', 'published')),
  drop constraint if exists profiles_published_timestamp_check,
  add constraint profiles_published_timestamp_check
    check (status = 'draft' or first_published_at is not null);

comment on column public.profiles.status is
  'Publication state only: draft or published. Independent from lifecycle_status.';
comment on column public.profiles.lifecycle_status is
  'Commercial/account lifecycle state. Independent from profile publication status.';
comment on column public.profiles.template_data is
  'Template-specific editor state for the currently selected template.';
comment on column public.profiles.first_published_at is
  'Timestamp of the first publication. Set once and never reset or overwritten.';

create or replace function public.set_profile_first_published_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    if new.status = 'published' then
      new.first_published_at = now();
    else
      new.first_published_at = null;
    end if;
  elsif old.first_published_at is not null then
    -- Preserve the original value across unpublish/republish, template changes,
    -- and attempted direct edits to first_published_at.
    new.first_published_at = old.first_published_at;
  elsif new.status = 'published' then
    new.first_published_at = now();
  else
    new.first_published_at = null;
  end if;

  return new;
end;
$$;

revoke all on function public.set_profile_first_published_at() from public;

drop trigger if exists set_profile_first_published_at on public.profiles;
create trigger set_profile_first_published_at
  before insert or update of status, first_published_at
  on public.profiles
  for each row
  execute function public.set_profile_first_published_at();

alter table public.profiles enable row level security;

drop policy if exists "Profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Published profiles are publicly readable" on public.profiles;
drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Users can create own draft profile" on public.profiles;

create policy "Published profiles are publicly readable"
on public.profiles
for select
to anon, authenticated
using (status = 'published');

create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "Users can create own draft profile"
on public.profiles
for insert
to authenticated
with check (
  (select auth.uid()) = id
  and status = 'draft'
  and first_published_at is null
  and template_id is not null
);

create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

commit;
