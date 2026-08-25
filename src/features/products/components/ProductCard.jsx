import { ShoppingBag } from "lucide-react";
import ProductImageFrame from "./ProductImageFrame";

export default function ProductCard({
  product,
  viewMode = "grid",
  onOpenDetails,
  onAddToCart,
}) {
  const isList = viewMode === "list";
  const isOutOfStock = product.stock === "out_of_stock";

  return (
    <article
      className={`group relative flex overflow-hidden bg-white p-3 shadow-xl shadow-navy/10 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-navy/15 ${isList ? "min-h-0 flex-row rounded-[24px]" : "min-h-[29rem] flex-col rounded-[34px]"}`}
    >
      <button
        type="button"
        onClick={() => onOpenDetails(product)}
        className={`absolute inset-0 z-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-navy focus:ring-inset ${isList ? "rounded-[24px]" : "rounded-[34px]"}`}
        aria-label={`Voir ${product.name}`}
      />

      <div className={`pointer-events-none relative z-10 aspect-square shrink-0 overflow-hidden bg-cloud ${isList ? "w-28 rounded-[17px] sm:w-36" : "w-full rounded-[25px]"}`}>
        <button
          type="button"
          onClick={() => onOpenDetails(product)}
          className="pointer-events-auto block size-full focus:outline-none focus:ring-2 focus:ring-mint focus:ring-offset-2 focus:ring-offset-navy"
          aria-label={`Voir ${product.name}`}
        >
          <ProductImageFrame
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="size-full"
            imageClassName="drop-shadow-xl transition duration-500 group-hover:scale-105"
          />
          {(product.badge || product.isFeatured) && (
            <span className={`absolute rounded-full bg-mint font-extrabold uppercase tracking-[0.12em] text-ink ${isList ? "left-2 top-2 px-2 py-1 text-[0.55rem]" : "left-4 top-4 px-3 py-1.5 text-[0.68rem]"}`}>
              {product.badge || "Trending"}
            </span>
          )}
        </button>
      </div>

      <div className={`pointer-events-none relative z-10 flex min-w-0 flex-1 flex-col ${isList ? "px-4 py-2 sm:px-5 sm:py-3" : "px-3 pb-3 pt-6 sm:px-4 sm:pb-4"}`}>
        <div className="min-w-0">
          <h2 className="font-heading text-xl font-extrabold leading-tight tracking-[-0.035em] text-ink">
            <button
              type="button"
              onClick={() => onOpenDetails(product)}
              className="pointer-events-auto text-left focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2"
            >
              {product.name}
            </button>
          </h2>
          <p className={`${isList ? "mt-1 line-clamp-1 leading-5" : "mt-3 line-clamp-2 leading-6"} text-sm text-ink/55`}>
            {product.description}
          </p>
        </div>

        <div className={`mt-auto flex items-end justify-between gap-3 ${isList ? "pt-2" : "pt-6"}`}>
          <p className="text-xl font-extrabold tracking-[-0.03em] text-navy">{product.priceLabel}</p>
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className="pointer-events-auto inline-flex min-h-11 shrink-0 items-center gap-2 rounded-[15px] bg-mint px-4 text-sm font-bold text-ink shadow-lg shadow-mint/30 transition hover:-translate-y-0.5 hover:bg-mint/80 focus:outline-none focus:ring-2 focus:ring-mint focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
          >
            <ShoppingBag className="size-4" />
            <span className={isList ? "sr-only sm:not-sr-only" : ""}>
              {isOutOfStock ? "Out of stock" : "Add to Cart"}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
