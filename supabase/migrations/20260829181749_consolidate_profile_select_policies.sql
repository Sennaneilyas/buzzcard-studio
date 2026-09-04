begin;

drop policy if exists "Published profiles are publicly readable" on public.profiles;
drop policy if exists "Users can read own profile" on public.profiles;

create policy "Published profiles are publicly readable"
on public.profiles
for select
to anon
using (status = 'published');

create policy "Authenticated users can read own or published profiles"
on public.profiles
for select
to authenticated
using (status = 'published' or (select auth.uid()) = id);

commit;
