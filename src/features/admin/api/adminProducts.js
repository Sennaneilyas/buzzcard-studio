import { supabase } from "@/lib/supabase";
import { mapProduct } from "@/features/products/api/products";

/**
 * Fetches ALL products (including inactive) for the admin products panel.
 */
export async function fetchAdminProducts() {
  const { data, error } = await supabase
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
      is_active,
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
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((p) => ({
    ...mapProduct(p),
    isActive: p.is_active,
  }));
}

/**
 * Fetches ALL categories (including inactive) for the admin categories panel.
 */
export async function fetchAdminCategories() {
  const { data, error } = await supabase
    .from("product_categories")
    .select("id, name, slug, description, position, is_active")
    .order("position", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

/**
 * Toggles is_featured on a product (pins it to the top of its category).
 */
export async function updateProductFeatured(productId, isFeatured) {
  const { error } = await supabase
    .from("products")
    .update({ is_featured: isFeatured })
    .eq("id", productId);
  if (error) throw error;
}

/**
 * Toggles is_active on a product (show/hide on public store).
 */
export async function toggleProductActive(productId, isActive) {
  const { error } = await supabase
    .from("products")
    .update({ is_active: isActive })
    .eq("id", productId);
  if (error) throw error;
}

/**
 * Toggles is_active on a category.
 */
export async function toggleCategoryActive(categoryId, isActive) {
  const { error } = await supabase
    .from("product_categories")
    .update({ is_active: isActive })
    .eq("id", categoryId);
  if (error) throw error;
}

/**
 * Persists new category display positions after drag-and-drop reorder.
 * @param {Array<{id: string, position: number}>} updates
 */
export async function saveCategoryPositions(updates) {
  // Execute all position updates in parallel
  const promises = updates.map(({ id, position }) =>
    supabase
      .from("product_categories")
      .update({ position })
      .eq("id", id)
  );
  const results = await Promise.all(promises);
  const failed = results.find((r) => r.error);
  if (failed) throw failed.error;
}
