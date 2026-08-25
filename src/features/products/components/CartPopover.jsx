import { useEffect } from "react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { motion } from "framer-motion";
import ProductImageFrame from "./ProductImageFrame";

export default function CartPopover({
  items,
  itemCount,
  total,
  onClose,
  onOpenProduct,
  onCheckout,
  onUpdateQuantity,
  onRemoveItem,
  onClear,
}) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <motion.section
      role="dialog"
      aria-modal="false"
      aria-label="Shopping cart"
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.16, ease: "easeOut" }}
      className="absolute right-0 top-[calc(100%-4px)] z-40 flex max-h-[min(32rem,calc(100dvh-5rem))] w-[min(23rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-2xl shadow-navy/15"
    >
      <header className="flex items-center justify-between gap-4 border-b border-ink/10 px-4 py-3">
        <div>
          <h2 className="font-heading text-base font-bold text-ink">Your cart</h2>
          <p className="text-xs text-ink/55">{itemCount} item{itemCount === 1 ? "" : "s"}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="grid size-9 place-items-center rounded-full text-ink/55 transition hover:bg-cloud hover:text-ink focus:outline-none focus:ring-2 focus:ring-navy"
          aria-label="Close cart"
        >
          <X className="size-4" />
        </button>
      </header>

      {items.length > 0 ? (
        <>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {items.map((item) => (
              <article key={item.id} className="flex gap-3 rounded-xl bg-cloud p-2.5">
                <button
                  type="button"
                  onClick={() => onOpenProduct(item)}
                  className="shrink-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy"
                  aria-label={`View ${item.name}`}
                >
                  <ProductImageFrame src={item.image} alt="" className="size-16 rounded-lg" />
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenProduct(item)}
                      className="min-w-0 text-left focus:outline-none focus:ring-2 focus:ring-navy"
                    >
                      <span className="block truncate text-sm font-bold text-ink">{item.name}</span>
                      <span className="block text-xs text-ink/55">{item.variant.name}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="grid size-8 shrink-0 place-items-center rounded-lg text-ink/45 transition hover:bg-white hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <div className="flex items-center rounded-lg border border-ink/15 bg-white">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="grid size-8 place-items-center text-ink transition hover:bg-cloud focus:outline-none focus:ring-2 focus:ring-inset focus:ring-navy"
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="min-w-7 text-center text-xs font-bold text-ink" aria-live="polite">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={Number.isFinite(item.variant.stock) && item.quantity >= item.variant.stock}
                        className="grid size-8 place-items-center text-ink transition hover:bg-cloud focus:outline-none focus:ring-2 focus:ring-inset focus:ring-navy disabled:cursor-not-allowed disabled:opacity-35"
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <p className="text-sm font-extrabold text-navy">{item.price * item.quantity} MAD</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <footer className="border-t border-ink/10 bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={onClear}
                className="text-xs font-semibold text-ink/55 transition hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              >
                Clear cart
              </button>
              <p className="text-sm font-semibold text-ink">
                Total <span className="ml-2 text-base font-extrabold text-navy">{total} MAD</span>
              </p>
            </div>
            <button
              type="button"
              onClick={onCheckout}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-mint px-4 text-sm font-bold text-ink transition hover:bg-mint/80 focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2"
            >
              <ShoppingBag className="size-4" />
              Checkout
            </button>
          </footer>
        </>
      ) : (
        <div className="grid min-h-48 place-items-center px-6 py-8 text-center">
          <div>
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-cloud text-ink/45">
              <ShoppingBag className="size-5" />
            </span>
            <p className="mt-3 text-sm font-bold text-ink">Your cart is empty</p>
            <p className="mt-1 text-xs text-ink/55">Add a product to see it here.</p>
          </div>
        </div>
      )}
    </motion.section>
  );
}
