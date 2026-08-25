import { describe, expect, it } from "vitest";
import { mapProduct } from "../src/features/products/api/products";

const createProduct = (overrides = {}) => ({
  id: "product-1",
  slug: "classique",
  name: "Classique",
  short_description: "NFC card",
  description: "NFC card description",
  product_type: "customizable",
  customization_mode: "full_design",
  configuration_type: "profile",
  base_price: 150,
  stock: null,
  badge: null,
  features: [],
  free_delivery: true,
  is_featured: true,
  category: { id: "category-1", slug: "nfc-cards", name: "NFC cards" },
  variants: [],
  media: [],
  ...overrides,
});

describe("product catalogue mapping", () => {
  it("puts primary media first after mapping database field names", () => {
    const product = mapProduct(createProduct({
      media: [
        {
          id: "secondary",
          variant_id: null,
          storage_path: "classique/secondary.webp",
          alt_text: "Secondary",
          media_type: "image",
          position: 0,
          is_primary: false,
        },
        {
          id: "primary",
          variant_id: null,
          storage_path: "classique/primary.webp",
          alt_text: "Primary",
          media_type: "image",
          position: 10,
          is_primary: true,
        },
      ],
    }));

    expect(product.media.map((item) => item.id)).toEqual(["primary", "secondary"]);
    expect(product.image).toContain("classique/primary.webp");
  });

  it("uses the active default variant for initial price and stock", () => {
    const product = mapProduct(createProduct({
      variants: [
        {
          id: "inactive",
          name: "Inactive",
          price: 90,
          stock: 10,
          is_default: false,
          is_active: false,
        },
        {
          id: "custom",
          name: "Custom",
          slug: "classique-custom",
          price: 200,
          stock: 4,
          is_default: true,
          is_active: true,
        },
      ],
    }));

    expect(product.variants).toHaveLength(1);
    expect(product.defaultVariant.id).toBe("custom");
    expect(product.price).toBe(200);
    expect(product.stockCount).toBe(4);
  });
});
