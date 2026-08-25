import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProductDetailsPanel } from "../ProductDetailsPage";

export default function ProductDetailsSheet({ product, onClose, onCheckout }) {
  useEffect(() => {
    if (!product) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, product]);

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.button
            type="button"
            className="fixed inset-0 z-40 cursor-default bg-ink/20 md:bg-ink/55 md:backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-label="Fermer les détails du produit"
          />
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-label={`Détails de ${product.name}`}
            onClick={(event) => {
              if (event.target === event.currentTarget) onClose();
            }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[402px] overflow-hidden rounded-t-[34px] bg-cloud shadow-[0_-20px_48px_rgba(17,24,39,0.22)] md:inset-0 md:grid md:max-w-none md:place-items-center md:bg-transparent md:p-6 md:shadow-none"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
          >
            <div className="w-full md:max-w-[1040px] md:overflow-hidden md:rounded-[32px] md:shadow-[0_32px_100px_rgba(0,35,102,0.3)]">
              <ProductDetailsPanel key={product.id} product={product} isSheet onClose={onClose} onCheckout={onCheckout} />
            </div>
          </motion.section>
        </>
      )}
    </AnimatePresence>
  );
}
