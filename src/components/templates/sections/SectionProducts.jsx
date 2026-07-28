import { ShoppingCart, Package } from "lucide-react";
import SectionHeading from "./SectionHeading";

/**
 * SectionProducts — 2-column product cards with image, name, price, cart icon.
 */

const DEMO_PRODUCTS = [
  {
    name: "Lorem Ipsum",
    description: "It is a long established",
    price: "$125",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Lorem Ipsum",
    description: "It is a long established",
    price: "$125",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop",
  },
];

export default function SectionProducts({ data = {} }) {
  const products = data.products?.length ? data.products : DEMO_PRODUCTS;

  return (
    <section className="px-6 py-8">
      <SectionHeading title="Products" icon={Package} />

      <div className="grid grid-cols-2 gap-3">
        {products.map((prod, i) => (
          <div
            key={i}
            className="overflow-hidden flex flex-col"
            style={{
              backgroundColor: "var(--t-bg-section)",
              borderRadius: "var(--t-card-radius)",
              boxShadow: "var(--t-card-shadow)",
            }}
          >
            {/* Product image */}
            <div className="aspect-square overflow-hidden">
              <img
                src={prod.image}
                alt={prod.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product info */}
            <div className="p-3 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h4
                  className="text-xs font-bold truncate"
                  style={{ color: "var(--t-text-primary)" }}
                >
                  {prod.name}
                </h4>
                <p
                  className="text-[10px] truncate"
                  style={{ color: "var(--t-text-secondary)" }}
                >
                  {prod.description}
                </p>
              </div>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
                style={{
                  backgroundColor: "var(--t-accent)",
                  color: "var(--t-bg-primary)",
                }}
              >
                {prod.price}
              </span>
            </div>

            {/* Cart icon */}
            <div className="px-3 pb-3 flex justify-end">
              <button
                className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
                style={{
                  backgroundColor: "var(--t-accent)",
                  color: "var(--t-bg-primary)",
                }}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
