delete from public.product_media
where product_id = (
  select id
  from public.products
  where slug = 'classique'
);

insert into public.product_media (
  product_id,
  variant_id,
  storage_path,
  alt_text,
  position,
  is_primary
)
select
  product.id,
  variant.id,
  media.storage_path,
  media.alt_text,
  media.position,
  media.is_primary
from public.products as product
cross join (
  values
    (null::text, 'nfc-cards/blank-nfc-cards/buzzcards/Buzzcards Cover.webp', 'BuzzCards collection', 0, true),
    ('classique-standard', 'nfc-cards/blank-nfc-cards/buzzcards/Bzzcard standard white.webp', 'BuzzCard Standard blanche', 0, true),
    ('classique-standard', 'nfc-cards/blank-nfc-cards/buzzcards/Buzzcard standard black.webp', 'BuzzCard Standard noire', 1, false),
    ('classique-custom', 'nfc-cards/blank-nfc-cards/buzzcards/Buzzcard costum white.webp', 'BuzzCard Custom blanche', 0, true),
    ('classique-custom', 'nfc-cards/blank-nfc-cards/buzzcards/Buzzcard costum black.webp', 'BuzzCard Custom noire', 1, false)
) as media(variant_slug, storage_path, alt_text, position, is_primary)
left join public.product_variants as variant
  on variant.product_id = product.id
 and variant.slug = media.variant_slug
where product.slug = 'classique';
