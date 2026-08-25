import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Minus, Plus, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ProductImageFrame from "./components/ProductImageFrame";
import { useCartStore } from "./store/useCartStore";

const formatPrice = (price) => `${price} MAD`;

export function ProductDetailsPanel({ product, isSheet = false, onClose, onCheckout }) {
  const addItem = useCartStore((state) => state.addItem);
  const beginCheckout = useCartStore((state) => state.beginCheckout);
  const navigate = useNavigate();
  const [selectedVariantId, setSelectedVariantId] = useState(product.defaultVariant?.id ?? null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState("");
  const selectedVariant = product.variants.find((variant) => variant.id === selectedVariantId)
    ?? product.defaultVariant;
  const selectedImages = selectedVariant?.images?.length ? selectedVariant.images : product.images;
  const unitPrice = selectedVariant?.price ?? product.price;
  const selectedStock = selectedVariant?.stock ?? product.stockCount;
  const isOutOfStock = selectedStock === 0;
  const hasStockLimit = Number.isFinite(selectedStock);
  const canIncreaseQuantity = !hasStockLimit || quantity < selectedStock;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addItem({ product, variant: selectedVariant, quantity });
    setCartMessage(`${product.name} ajouté au panier.`);
  };

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout({ product, variant: selectedVariant, quantity });
      return;
    }

    addItem({ product, variant: selectedVariant, quantity });
    beginCheckout();
    navigate("/checkout");
  };

  return (
    <main className={isSheet ? "relative bg-cloud md:bg-white" : "min-h-dvh bg-cloud sm:p-8 md:min-h-0 md:p-0"}>
      <div className={`relative mx-auto overflow-hidden bg-cloud md:grid md:w-full md:max-w-[1040px] md:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] md:grid-rows-[minmax(0,1fr)_auto] md:rounded-[32px] md:bg-white ${isSheet ? "max-h-[calc(100dvh-88px)] overflow-y-auto md:max-h-[min(760px,calc(100dvh-48px))] md:overflow-hidden" : "min-h-dvh max-w-[402px] sm:min-h-[874px] sm:rounded-[34px] sm:shadow-2xl md:min-h-0 md:max-h-[min(760px,calc(100dvh-48px))] md:shadow-[0_32px_100px_rgba(0,35,102,0.24)]"}`}>
        <header className={`z-30 flex items-center justify-between bg-transparent px-[23px] md:absolute md:left-auto md:right-6 md:top-6 md:mx-0 md:h-auto md:max-w-none md:gap-2 md:p-0 ${isSheet ? "sticky top-0 h-[72px]" : "fixed inset-x-0 top-0 mx-auto h-[126px] max-w-[402px] pt-8 sm:top-8"}`}>
          {isSheet && (
            <div
              className="absolute left-1/2 top-3 h-1.5 w-16 -translate-x-1/2 rounded-full bg-ink/35 md:hidden"
              aria-hidden="true"
            />
          )}
          {isSheet ? (
            <button
              type="button"
              onClick={onClose}
              className="grid size-[45px] place-items-center rounded-full bg-white text-ink shadow-lg shadow-ink/10 transition hover:bg-cloud focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-cloud"
              aria-label="Fermer les détails du produit"
            >
              <ArrowLeft className="size-6 md:hidden" />
              <X className="hidden size-5 md:block" />
            </button>
          ) : (
            <Link
              to="/products"
              className="grid size-[45px] place-items-center rounded-full bg-white text-ink shadow-lg shadow-ink/10 transition hover:bg-cloud focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-cloud"
              aria-label="Retour aux produits"
            >
              <ArrowLeft className="size-6 md:hidden" />
              <X className="hidden size-5 md:block" />
            </Link>
          )}
        </header>

        <section className={`rounded-t-[34px] bg-white pb-28 pt-4 md:contents ${isSheet ? "min-h-0" : "mt-[126px] min-h-[calc(100dvh-126px)] sm:min-h-[748px] md:mt-0"}`}>
          <div className="relative mx-3 aspect-square overflow-hidden rounded-[34px] md:col-start-1 md:row-span-2 md:m-8 md:self-center lg:m-10">
            <ProductImageFrame
              src={selectedImages[selectedImageIndex] ?? selectedImages[0] ?? ""}
              alt={product.name}
              className="size-full"
              imageClassName="md:drop-shadow-2xl"
            />
            {selectedImages.length > 1 && (
              <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2" aria-label="Images du produit">
                {selectedImages.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`size-2.5 rounded-full border border-white shadow ${selectedImageIndex === index ? "bg-mint" : "bg-ink/35"}`}
                    aria-label={`Afficher l'image ${index + 1}`}
                    aria-pressed={selectedImageIndex === index}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="px-[22px] pt-4 md:col-start-2 md:row-start-1 md:overflow-y-auto md:px-10 md:pb-5 md:pt-20">
            {product.isCustomizable && (
              <p className="inline-flex rounded-[14px] bg-primary/10 px-2.5 py-1.5 text-xs font-semibold text-primary">
                Personnalisable
              </p>
            )}

            <h1 className="mt-3 font-heading text-[30px] font-bold leading-[36px] tracking-[-0.04em] text-foreground md:mt-4 md:text-[38px] md:leading-[44px]">{product.name}</h1>
            <p className="mt-2 text-[15px] leading-[22px] text-ink/70 md:mt-3 md:leading-6">{product.description}</p>

            <div className="mt-3 flex h-[46px] items-center justify-between gap-4">
              <p className="font-heading text-[28px] font-bold tracking-[-0.04em] text-foreground">{formatPrice(unitPrice)}</p>
              {product.freeDelivery && <p className="text-xs font-semibold text-mint">Livraison offerte</p>}
            </div>

            {product.variants.length > 0 && (
              <fieldset className="mt-2 flex min-h-[52px] flex-wrap items-center gap-2">
                <legend className="sr-only">Variante</legend>
                <p className={`text-sm font-semibold text-ink ${product.variants.every((variant) => variant.color) ? "mr-auto" : "w-full"}`}>Option : {selectedVariant.name}</p>
                {product.variants.map((variant) => {
                  const isSelected = variant.id === selectedVariant.id;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => {
                        setSelectedVariantId(variant.id);
                        setSelectedImageIndex(0);
                        setQuantity((current) => Number.isFinite(variant.stock) && variant.stock > 0
                          ? Math.min(current, variant.stock)
                          : 1);
                      }}
                      className={variant.color
                        ? `grid size-[30px] place-items-center rounded-full border transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isSelected ? "border-primary ring-2 ring-primary ring-offset-2" : "border-ink/15"}`
                        : `min-h-9 rounded-xl border px-3 text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isSelected ? "border-primary bg-primary text-white" : "border-ink/15 bg-white text-ink hover:border-primary/40"}`}
                      aria-label={`Choisir ${variant.name}`}
                      aria-pressed={isSelected}
                    >
                      {variant.color
                        ? <span className="size-5 rounded-full" style={{ backgroundColor: variant.colorValue }} />
                        : `${variant.name} · ${formatPrice(variant.price)}`}
                    </button>
                  );
                })}
              </fieldset>
            )}

            <div className="mt-3 flex items-center justify-between rounded-[18px] border border-ink/15 px-3 py-2">
              <p className="text-sm font-semibold text-ink">Quantité</p>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setQuantity((current) => current - 1)} disabled={quantity === 1} className="grid size-9 place-items-center rounded-full border border-ink/15 text-ink transition hover:bg-cloud disabled:cursor-not-allowed disabled:opacity-35 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" aria-label="Diminuer la quantité">
                  <Minus className="size-4" />
                </button>
                <span className="min-w-5 text-center text-sm font-bold text-ink" aria-live="polite">{quantity}</span>
                <button type="button" onClick={() => setQuantity((current) => current + 1)} disabled={!canIncreaseQuantity} className="grid size-9 place-items-center rounded-full border border-ink/15 text-ink transition hover:bg-cloud disabled:cursor-not-allowed disabled:opacity-35 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" aria-label="Augmenter la quantité">
                  <Plus className="size-4" />
                </button>
              </div>
            </div>

            {product.features.length > 0 && (
              <ul className="mt-4 space-y-2" aria-label="Caractéristiques">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-ink/70">
                    <Check className="size-4 text-primary" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <div className={`z-20 bg-white px-[22px] pb-[max(22px,env(safe-area-inset-bottom))] pt-3 md:static md:col-start-2 md:row-start-2 md:px-10 md:pb-9 md:pt-4 ${isSheet ? "sticky bottom-0" : "fixed inset-x-0 bottom-0 mx-auto max-w-[402px] sm:bottom-8 sm:rounded-b-[34px] md:max-w-none md:rounded-none"}`}>
          <div className="grid grid-cols-2 overflow-hidden rounded-[18px] border border-ink/20 bg-white">
            <button type="button" onClick={handleCheckout} disabled={isOutOfStock} className="flex h-14 min-w-0 items-center justify-center bg-mint px-3 text-center text-sm font-semibold leading-tight text-foreground transition hover:bg-mint/80 disabled:cursor-not-allowed disabled:opacity-45 focus:z-10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
              {isOutOfStock ? "Indisponible" : `Commander · ${formatPrice(totalPrice)}`}
            </button>
            <button type="button" onClick={handleAddToCart} disabled={isOutOfStock} className="flex h-14 min-w-0 items-center justify-center border-l border-ink/20 bg-white px-3 text-center text-sm font-semibold leading-tight text-ink transition hover:bg-cloud disabled:cursor-not-allowed disabled:opacity-45 focus:z-10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
              Ajouter au panier
            </button>
          </div>
          <p className="sr-only" aria-live="polite">{cartMessage}</p>
        </div>
      </div>
    </main>
  );
}

export default function ProductDetailsPage({ product }) {
  const navigate = useNavigate();
  const closeProduct = () => navigate("/products");

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") navigate("/products");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return (
    <div className="relative min-h-dvh md:grid md:place-items-center md:overflow-hidden md:p-6">
      <motion.button
        type="button"
        className="fixed inset-0 hidden cursor-default bg-ink/55 backdrop-blur-sm md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        onClick={closeProduct}
        aria-label="Fermer les détails du produit"
      />
      <motion.div
        className="relative z-10 w-full"
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <ProductDetailsPanel product={product} />
      </motion.div>
    </div>
  );
}
