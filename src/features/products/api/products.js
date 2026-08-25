import { supabase } from "@/lib/supabase";

const PRODUCT_IMAGES_BUCKET = "product-images";

const compareMedia = (first, second) => {
  if (first.isPrimary !== second.isPrimary) return first.isPrimary ? -1 : 1;
  return first.position - second.position;
};

const getPublicImageUrl = (storagePath) => {
  if (!storagePath) return "";

  return supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .getPublicUrl(storagePath).data.publicUrl;
};

const getColorValue = (color) => {
  const normalizedColor = color?.trim().toLocaleLowerCase("fr");

  if (normalizedColor === "noir" || normalizedColor === "noire") {
    return "var(--color-ink)";
  }

  if (normalizedColor === "blanc" || normalizedColor === "blanche") {
    return "var(--color-cloud)";
  }

  return "var(--color-primary)";
};

const mapMedia = (media) => ({
  id: media.id,
  variantId: media.variant_id,
  storagePath: media.storage_path,
  alt: media.alt_text,
  position: media.position,
  isPrimary: media.is_primary,
  url: getPublicImageUrl(media.storage_path),
});

const getVariantImages = (variantId, media, generalMedia) => {
  const variantMedia = media.filter((item) => item.variantId === variantId);
  return (variantMedia.length > 0 ? variantMedia : generalMedia).map((item) => item.url);
};

export const mapProduct = (product) => {
  const media = (product.media ?? [])
    .filter((item) => item.media_type === "image")
    .map(mapMedia)
    .sort(compareMedia);
  const generalMedia = media.filter((item) => !item.variantId);
  const variants = (product.variants ?? [])
    .filter((variant) => variant.is_active)
    .map((variant) => ({
      id: variant.id,
      name: variant.name,
      slug: variant.slug,
      sku: variant.sku,
      color: variant.color,
      colorValue: getColorValue(variant.color),
      material: variant.material,
      price: Number(variant.price),
      stock: variant.stock,
      isDefault: variant.is_default,
      images: getVariantImages(variant.id, media, generalMedia),
    }));
  const defaultVariant = variants.find((variant) => variant.isDefault) ?? variants[0] ?? null;
  const allImages = media.map((item) => item.url);
  const initialImages = defaultVariant?.images.length
    ? defaultVariant.images
    : generalMedia.map((item) => item.url).length
      ? generalMedia.map((item) => item.url)
      : allImages;
  const initialPrice = defaultVariant?.price ?? Number(product.base_price);
  const initialStock = defaultVariant?.stock ?? product.stock;

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.short_description || product.description || "",
    longDescription: product.description || product.short_description || "",
    category: product.category.slug,
    categoryId: product.category.id,
    categoryName: product.category.name,
    badge: product.badge,
    isFeatured: product.is_featured,
    isCustomizable: product.product_type === "customizable",
    customizationMode: product.customization_mode,
    configurationType: product.configuration_type,
    freeDelivery: product.free_delivery,
    features: Array.isArray(product.features) ? product.features : [],
    basePrice: Number(product.base_price),
    price: initialPrice,
    priceLabel: `${initialPrice} MAD`,
    stock: initialStock === 0 ? "out_of_stock" : "in_stock",
    stockCount: initialStock,
    variants,
    defaultVariant,
    media,
    images: initialImages,
    image: initialImages[0] ?? "",
  };
};

export async function fetchProductCatalog() {
  const [categoriesResult, productsResult] = await Promise.all([
    supabase
      .from("product_categories")
      .select("id, name, slug, description, position")
      .eq("is_active", true)
      .order("position", { ascending: true }),
    supabase
      .from("products")
      .select(`
        id,
        name,
        slug,
        short_description,
        description,
        product_type,
        customization_mode,
        configuration_type,
        base_price,
        stock,
        badge,
        features,
        free_delivery,
        is_featured,
        created_at,
        category:product_categories!products_category_id_fkey!inner (
          id,
          name,
          slug
        ),
        variants:product_variants!product_variants_product_id_fkey (
          id,
          name,
          slug,
          sku,
          color,
          material,
          price,
          stock,
          is_default,
          is_active
        ),
        media:product_media!product_media_product_id_fkey (
          id,
          variant_id,
          storage_path,
          alt_text,
          media_type,
          position,
          is_primary
        )
      `)
      .eq("is_active", true)
      .eq("product_categories.is_active", true)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: true }),
  ]);

  if (categoriesResult.error) throw categoriesResult.error;
  if (productsResult.error) throw productsResult.error;

  return {
    categories: categoriesResult.data.map((category) => ({
      id: category.slug,
      databaseId: category.id,
      label: category.name,
      description: category.description,
      position: category.position,
    })),
    products: productsResult.data.map(mapProduct),
  };
}
