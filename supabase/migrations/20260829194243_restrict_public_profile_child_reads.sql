begin;

-- Child rows must follow the publication visibility of their parent profile.
-- Owners retain authenticated access to their own draft data without exposing
-- the existence or contents of a draft to anonymous callers.

drop policy if exists "Users manage own social links" on public.social_links;
create policy "Owners can insert social links"
on public.social_links
for insert
to authenticated
with check (profile_id = (select auth.uid()));
create policy "Owners can update social links"
on public.social_links
for update
to authenticated
using (profile_id = (select auth.uid()))
with check (profile_id = (select auth.uid()));
create policy "Owners can delete social links"
on public.social_links
for delete
to authenticated
using (profile_id = (select auth.uid()));

drop policy if exists "Social links viewable by everyone" on public.social_links;
create policy "Social links follow profile visibility"
on public.social_links
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = social_links.profile_id
      and (
        profiles.status = 'published'
        or profiles.id = (select auth.uid())
      )
  )
);

drop policy if exists "Users manage own phones" on public.profile_phones;
create policy "Owners can insert phones"
on public.profile_phones
for insert
to authenticated
with check (profile_id = (select auth.uid()));
create policy "Owners can update phones"
on public.profile_phones
for update
to authenticated
using (profile_id = (select auth.uid()))
with check (profile_id = (select auth.uid()));
create policy "Owners can delete phones"
on public.profile_phones
for delete
to authenticated
using (profile_id = (select auth.uid()));

drop policy if exists "Phones viewable by everyone" on public.profile_phones;
create policy "Phones follow profile visibility"
on public.profile_phones
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = profile_phones.profile_id
      and (
        profiles.status = 'published'
        or profiles.id = (select auth.uid())
      )
  )
);

drop policy if exists "Users manage own emails" on public.profile_emails;
create policy "Owners can insert emails"
on public.profile_emails
for insert
to authenticated
with check (profile_id = (select auth.uid()));
create policy "Owners can update emails"
on public.profile_emails
for update
to authenticated
using (profile_id = (select auth.uid()))
with check (profile_id = (select auth.uid()));
create policy "Owners can delete emails"
on public.profile_emails
for delete
to authenticated
using (profile_id = (select auth.uid()));

drop policy if exists "Emails viewable by everyone" on public.profile_emails;
create policy "Emails follow profile visibility"
on public.profile_emails
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = profile_emails.profile_id
      and (
        profiles.status = 'published'
        or profiles.id = (select auth.uid())
      )
  )
);

drop policy if exists "Anyone can read profile reviews" on public.profile_reviews;
create policy "Reviews follow profile visibility"
on public.profile_reviews
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = profile_reviews.profile_id
      and (
        profiles.status = 'published'
        or profiles.id = (select auth.uid())
      )
  )
);

drop policy if exists "Anyone can read replies" on public.profile_review_replies;
create policy "Review replies follow profile visibility"
on public.profile_review_replies
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.profile_reviews
    join public.profiles on profiles.id = profile_reviews.profile_id
    where profile_reviews.id = profile_review_replies.review_id
      and (
        profiles.status = 'published'
        or profiles.id = (select auth.uid())
      )
  )
);

commit;
