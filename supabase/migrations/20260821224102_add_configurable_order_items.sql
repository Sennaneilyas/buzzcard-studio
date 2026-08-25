create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  variant_id uuid references public.product_variants(id) on delete restrict,
  sku text,
  product_name text not null,
  variant_name text,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  line_total numeric(10, 2) not null check (
    line_total >= 0 and line_total = unit_price * quantity
  ),
  configuration jsonb not null default '{}'::jsonb,
  customization jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index idx_order_items_order_id on public.order_items(order_id);
create index idx_order_items_product_id on public.order_items(product_id);
create index idx_order_items_variant_id on public.order_items(variant_id)
where variant_id is not null;

alter table public.order_items enable row level security;

revoke all on table public.order_items from anon, authenticated;
grant select, insert on table public.order_items to authenticated;
grant all on table public.order_items to service_role;

create policy "Users view own order items"
on public.order_items
for select
to authenticated
using (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and orders.user_id = (select auth.uid())
  )
);

create policy "Users create own order items"
on public.order_items
for insert
to authenticated
with check (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and orders.user_id = (select auth.uid())
  )
);

drop policy if exists "Users view own orders" on public.orders;
drop policy if exists "Users create orders" on public.orders;

create policy "Users view own orders"
on public.orders
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users create orders"
on public.orders
for insert
to authenticated
with check ((select auth.uid()) = user_id);

revoke all on table public.orders from anon, authenticated;
grant select, insert on table public.orders to authenticated;
grant all on table public.orders to service_role;
