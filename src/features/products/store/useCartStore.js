import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  getDefaultConfiguration,
  getDefaultCustomization,
  getClassiqueDesignType,
  isClassiqueProduct,
} from "../checkout/configuration";

export const createCartStore = (set) => ({
  items: [],
  checkoutStep: "configuration",
  addItem: ({ product, variant, quantity }) => {
    const requestedQuantity = Number.isFinite(quantity)
      ? Math.max(1, Math.floor(quantity))
      : 1;
    const selectedVariant = variant ?? {
      id: "default",
      name: "Standard",
      price: product.price,
      images: product.images,
    };
    const itemId = `${product.id}-${selectedVariant.id}`;
    const stockLimit = Number.isFinite(selectedVariant.stock) ? selectedVariant.stock : null;

    if (stockLimit === 0) return;

    set((state) => {
      const existingItem = state.items.find((item) => item.id === itemId);

      if (existingItem) {
        return {
          checkoutStep: "configuration",
          items: state.items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  quantity: stockLimit === null
                    ? item.quantity + requestedQuantity
                    : Math.min(item.quantity + requestedQuantity, stockLimit),
                }
              : item,
          ),
        };
      }

      const isClassique = isClassiqueProduct(product.slug);
      const configuration = getDefaultConfiguration(product.configurationType ?? "profile");
      const customization = getDefaultCustomization();

      return {
        checkoutStep: "configuration",
        items: [
          ...state.items,
          {
            id: itemId,
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price: selectedVariant.price ?? product.price,
            image: selectedVariant.images?.[0] ?? product.images?.[0] ?? "",
            variant: selectedVariant,
            availableVariants: product.variants ?? [selectedVariant],
            quantity: stockLimit === null
              ? requestedQuantity
              : Math.min(requestedQuantity, stockLimit),
            configurationType: product.configurationType ?? "profile",
            customizationMode: product.customizationMode ?? "none",
            configuration: isClassique ? { ...configuration, color: "black" } : configuration,
            customization: isClassique
              ? { ...customization, designType: getClassiqueDesignType(selectedVariant) }
              : customization,
          },
        ],
      };
    });
  },
  updateQuantity: (itemId, quantity) => {
    set((state) => ({
      checkoutStep: "configuration",
      items:
        quantity <= 0
          ? state.items.filter((item) => item.id !== itemId)
          : state.items.map((item) =>
              item.id === itemId
                ? {
                    ...item,
                    quantity: Number.isFinite(item.variant.stock)
                      ? Math.min(quantity, item.variant.stock)
                      : quantity,
                  }
                : item,
            ),
    }));
  },
  changeItemVariant: (itemId, variant) => {
    set((state) => {
      const currentItem = state.items.find((item) => item.id === itemId);
      if (!currentItem || !variant || currentItem.variant.id === variant.id) return state;
      if (variant.stock === 0) return state;

      const nextItemId = `${currentItem.productId}-${variant.id}`;
      if (state.items.some((item) => item.id === nextItemId)) return state;

      return {
        checkoutStep: "configuration",
        items: state.items.map((item) =>
          item.id === itemId
            ? (() => {
                const designType = isClassiqueProduct(item.slug)
                  ? getClassiqueDesignType(variant)
                  : item.customization.designType;

                return {
                ...item,
                id: nextItemId,
                variant,
                price: variant.price ?? item.price,
                image: variant.images?.[0] ?? item.image,
                customization: isClassiqueProduct(item.slug)
                  ? {
                      ...item.customization,
                      designType,
                      previewSide: designType === "blank" ? "front" : item.customization.previewSide,
                    }
                  : item.customization,
                };
              })()
            : item,
        ),
      };
    });
  },
  removeItem: (itemId) => {
    set((state) => ({
      checkoutStep: "configuration",
      items: state.items.filter((item) => item.id !== itemId),
    }));
  },
  updateConfiguration: (itemId, configuration) => {
    set((state) => ({
      checkoutStep: "configuration",
      items: state.items.map((item) =>
        item.id === itemId
          ? { ...item, configuration: { ...item.configuration, ...configuration } }
          : item,
      ),
    }));
  },
  updateCustomization: (itemId, customization) => {
    set((state) => ({
      checkoutStep: "configuration",
      items: state.items.map((item) =>
        item.id === itemId
          ? { ...item, customization: { ...item.customization, ...customization } }
          : item,
      ),
    }));
  },
  setCustomizationFile: (itemId, file) => {
    set((state) => ({
      checkoutStep: "configuration",
      items: state.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              customization: {
                ...item.customization,
                file,
                fileName: file?.name ?? "",
                fileSize: file?.size ?? 0,
                fileType: file?.type ?? "",
              },
            }
          : item,
      ),
    }));
  },
  beginCheckout: () => set({ checkoutStep: "configuration" }),
  setCheckoutStep: (checkoutStep) => set({ checkoutStep }),
  clearCart: () => set({ items: [], checkoutStep: "configuration" }),
});

export const prepareCheckoutForStorage = (state) => ({
  checkoutStep: state.checkoutStep,
  items: state.items.map((item) => ({
    ...item,
    customization: {
      ...item.customization,
      file: null,
    },
  })),
});

export const migrateCheckoutState = (persistedState = {}) => ({
  ...persistedState,
  checkoutStep: persistedState.checkoutStep ?? "configuration",
  items: (persistedState.items ?? []).map((item) => ({
    ...item,
    configurationType: item.configurationType ?? "profile",
    customizationMode: item.customizationMode ?? "none",
    configuration: isClassiqueProduct(item.slug)
      ? {
          ...getDefaultConfiguration(item.configurationType ?? "profile"),
          color: "black",
          ...item.configuration,
        }
      : item.configuration ?? getDefaultConfiguration(item.configurationType ?? "profile"),
    customization: {
      ...getDefaultCustomization(),
      ...(isClassiqueProduct(item.slug) && !item.customization?.designType
        ? { designType: getClassiqueDesignType(item.variant) }
        : {}),
      ...item.customization,
      displayName: item.customization?.displayName ?? item.customization?.businessName ?? "",
      logoUrl: item.customization?.logoUrl ?? item.customization?.logoPreviewUrl ?? "",
      file: null,
    },
  })),
});

export const useCartStore = create(persist(createCartStore, {
  name: "buzzcard-checkout",
  storage: createJSONStorage(() => localStorage),
  version: 2,
  partialize: prepareCheckoutForStorage,
  migrate: migrateCheckoutState,
}));
