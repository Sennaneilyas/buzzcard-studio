import { createStore } from "zustand/vanilla";
import { describe, expect, it } from "vitest";
import {
  getDefaultConfiguration,
  getClassiqueDesignType,
  validateConfiguration,
  validateCustomization,
} from "../src/features/products/checkout/configuration";
import {
  createCartStore,
  migrateCheckoutState,
  prepareCheckoutForStorage,
} from "../src/features/products/store/useCartStore";
import {
  getBuzzCardPreviewPath,
  getBuzzCardVariantKey,
} from "../src/features/products/api/cardPreviews";

describe("checkout product configuration", () => {
  it.each([
    ["essential", "white", "front", "buzzcard/essential/white/front.webp"],
    ["essential", "black", "back", "buzzcard/essential/black/front.webp"],
    ["standard", "white", "front", "buzzcard/standard/white/front.webp"],
    ["standard", "white", "back", "buzzcard/standard/white/back.webp"],
    ["standard", "black", "front", "buzzcard/standard/black/front.webp"],
    ["standard", "black", "back", "buzzcard/standard/black/back.webp"],
    ["custom", "white", "front", "buzzcard/custom/White/DocumentBuzzCard Custom White:Base design.webp"],
    ["custom", "white", "back", "buzzcard/custom/White/BuzzCard Custom White:Back.webp"],
    ["custom", "black", "front", "buzzcard/custom/Black/BuzzCard Custom Black:Base design.webp"],
    ["custom", "black", "back", "buzzcard/custom/Black/BuzzCard Custom Black:Back.webp"],
  ])("builds the %s %s %s card preview path", (variant, color, side, expected) => {
    expect(getBuzzCardPreviewPath({ variant, color, side })).toBe(expected);
  });

  it("derives preview variants from catalogue names and slugs", () => {
    expect(getBuzzCardVariantKey({ slug: "classique-essential" })).toBe("essential");
    expect(getBuzzCardVariantKey({ name: "Standard" })).toBe("standard");
    expect(getBuzzCardVariantKey({ slug: "classique-custom" })).toBe("custom");
  });

  it.each([
    ["classique-essential", "blank"],
    ["classique-standard", "standard"],
    ["classique-custom", "custom"],
  ])("maps the %s catalogue variant to its checkout design", (slug, designType) => {
    expect(getClassiqueDesignType({ slug })).toBe(designType);
  });

  it.each([
    ["google_review", { reviewDestination: "123 Avenue Mohammed V" }],
    ["instagram", { instagramDestination: "@buzzcard.ma" }],
    ["whatsapp", { whatsappDestination: "+212612345678" }],
    ["website", { websiteUrl: "https://buzzcard.ma" }],
    ["custom_url", { customUrl: "https://example.com/menu" }],
    ["profile", { profileMode: "new_profile", profileUsername: "" }],
    ["profile", { profileMode: "existing_profile", profileUsername: "oualid" }],
  ])("accepts a complete %s configuration", (type, configuration) => {
    expect(validateConfiguration(type, configuration)).toBe("");
  });

  it.each([
    ["google_review", getDefaultConfiguration("google_review")],
    ["instagram", { instagramDestination: "not a valid username" }],
    ["whatsapp", { whatsappDestination: "123" }],
    ["website", { websiteUrl: "buzzcard.ma" }],
    ["custom_url", { customUrl: "example" }],
    ["profile", { profileMode: "existing_profile", profileUsername: "" }],
  ])("rejects an incomplete %s configuration", (type, configuration) => {
    expect(validateConfiguration(type, configuration)).not.toBe("");
  });

  it("requires a reference or instructions only for a custom design", () => {
    expect(validateCustomization("full_design", { designType: "standard" })).toBe("");
    expect(validateCustomization("full_design", { designType: "blank" })).toBe("");
    expect(validateCustomization("full_design", { designType: "custom" })).not.toBe("");
    expect(validateCustomization("full_design", {
      designType: "custom",
      designNotes: "Use our navy logo on white.",
    })).toBe("");
    expect(validateCustomization("logo_and_text", {
      designType: "custom",
      fileName: "logo.png",
    })).toBe("");
    expect(validateCustomization("logo_and_text", {
      designType: "custom",
      profession: "Creative Director",
    })).toBe("");
    expect(validateCustomization("full_design", {
      designType: "custom",
      businessName: "BuzzCard Studio",
    })).toBe("");
  });

  it("preserves cart and configuration through persisted auth redirects", () => {
    const state = {
      checkoutStep: "delivery",
      items: [{
        id: "product-variant",
        productId: "product",
        variant: { id: "variant", name: "Black" },
        quantity: 2,
        configurationType: "whatsapp",
        customizationMode: "full_design",
        configuration: { whatsappDestination: "+212612345678" },
        customization: {
          designType: "custom",
          designNotes: "Black logo",
          file: { browserOnly: true },
          fileName: "logo.png",
          fileSize: 1200,
          fileType: "image/png",
          businessName: "BuzzCard Studio",
          secondaryText: "Tap to connect",
          logoPreviewUrl: "data:image/webp;base64,preview",
        },
      }],
    };

    const serialized = JSON.stringify(prepareCheckoutForStorage(state));
    const restored = migrateCheckoutState(JSON.parse(serialized));

    expect(restored.checkoutStep).toBe("delivery");
    expect(restored.items[0]).toMatchObject({
      productId: "product",
      quantity: 2,
      configuration: { whatsappDestination: "+212612345678" },
      customization: {
        designType: "custom",
        designNotes: "Black logo",
        fileName: "logo.png",
        businessName: "BuzzCard Studio",
        displayName: "BuzzCard Studio",
        secondaryText: "Tap to connect",
        logoPreviewUrl: "data:image/webp;base64,preview",
        logoUrl: "data:image/webp;base64,preview",
        file: null,
      },
    });
  });

  it("migrates the Classique card to a separate persisted color configuration", () => {
    const restored = migrateCheckoutState({
      items: [{
        id: "classique-standard",
        slug: "classique",
        configurationType: "profile",
        configuration: { profileMode: "new_profile", profileUsername: "" },
        variant: { name: "Standard", slug: "classique-standard" },
        customization: {},
      }],
    });

    expect(restored.items[0].configuration.color).toBe("black");
    expect(restored.items[0].customization.designType).toBe("standard");
  });

  it("normalizes invalid add-to-cart quantities and missing images", () => {
    const cartStore = createStore(createCartStore);

    cartStore.getState().addItem({
      product: {
        id: "product",
        slug: "test-product",
        name: "Test product",
        price: 100,
        images: [],
        configurationType: "profile",
        customizationMode: "none",
      },
      variant: {
        id: "variant",
        name: "Standard",
        price: 100,
        stock: null,
        images: [],
      },
      quantity: 0,
    });

    expect(cartStore.getState().items[0]).toMatchObject({
      quantity: 1,
      image: "",
    });
  });

  it("does not switch a cart item to an out-of-stock variant", () => {
    const cartStore = createStore(createCartStore);
    const product = {
      id: "product",
      slug: "test-product",
      name: "Test product",
      price: 100,
      images: [],
      configurationType: "profile",
      customizationMode: "none",
    };
    const available = {
      id: "available",
      name: "Available",
      price: 100,
      stock: 2,
      images: [],
    };

    cartStore.getState().addItem({ product, variant: available, quantity: 1 });
    cartStore.getState().changeItemVariant("product-available", {
      id: "sold-out",
      name: "Sold out",
      price: 120,
      stock: 0,
      images: [],
    });

    expect(cartStore.getState().items[0].variant.id).toBe("available");
  });
});
