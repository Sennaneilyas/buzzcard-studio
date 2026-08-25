alter table public.product_variants
add column if not exists slug text;

create unique index if not exists product_variants_slug_key
on public.product_variants (slug)
where slug is not null;

update public.products
set
  name = 'Classique',
  slug = 'classique',
  base_price = 150.00,
  product_type = 'customizable',
  customization_mode = 'full_design',
  is_active = true,
  updated_at = now()
where slug in ('carte-nfc-classique', 'buzzcard', 'classique');

update public.product_variants
set is_active = false,
    is_default = false
where product_id = (
  select id
  from public.products
  where slug = 'classique'
)
and sku not in (
  'CARD-CLASSIQUE-ESSENTIAL',
  'CARD-CLASSIQUE-STANDARD',
  'CARD-CLASSIQUE-CUSTOM'
);

insert into public.product_variants (
  product_id,
  name,
  slug,
  sku,
  color,
  material,
  price,
  stock,
  is_default,
  is_active
)
select
  product.id,
  variant.name,
  variant.slug,
  variant.sku,
  null,
  'PVC',
  variant.price,
  null,
  variant.is_default,
  true
from public.products product
cross join (
  values
    ('Essential', 'classique-essential', 'CARD-CLASSIQUE-ESSENTIAL', 150.00::numeric, true),
    ('Standard', 'classique-standard', 'CARD-CLASSIQUE-STANDARD', 170.00::numeric, false),
    ('Custom', 'classique-custom', 'CARD-CLASSIQUE-CUSTOM', 200.00::numeric, false)
) as variant(name, slug, sku, price, is_default)
where product.slug = 'classique'
on conflict (sku) do update
set
  product_id = excluded.product_id,
  name = excluded.name,
  slug = excluded.slug,
  color = excluded.color,
  material = excluded.material,
  price = excluded.price,
  stock = excluded.stock,
  is_default = excluded.is_default,
  is_active = excluded.is_active;

comment on column public.order_items.configuration is
'Extensible NFC routing configuration, for example color, destinationType, destinationUrl, and profileId.';

comment on column public.order_items.customization is
'Extensible print personalization, for example logoUrl, displayName, profession, and company.';
