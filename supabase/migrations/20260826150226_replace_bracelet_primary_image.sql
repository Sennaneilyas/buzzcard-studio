update public.product_media as media
set storage_path = 'nfc-bracelet/Nfc Bracelet single'
from public.products as product
where media.product_id = product.id
  and product.slug = 'bracelet-nfc'
  and media.is_primary = true
  and media.storage_path = 'nfc-bracelet/NFC bracelet.avif';
