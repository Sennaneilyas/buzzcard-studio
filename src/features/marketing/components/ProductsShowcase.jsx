import { motion } from "framer-motion";
import { Package } from "lucide-react";
import SocialCards from "@/components/ui/card-fan-carousel";

const PRODUCT_CARDS = [
  { imgUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=700&fit=crop", alt: "NFC Bracelets", linkUrl: "/products/bracelets" },
  { imgUrl: "https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?w=400&h=700&fit=crop", alt: "Custom Metal Cards", linkUrl: "/products/metal-cards" },
  { imgUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=700&fit=crop", alt: "Wall Stickers", linkUrl: "/products/stickers" },
  { imgUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=700&fit=crop", alt: "NFC Tags", linkUrl: "/products/tags" },
];

export default function ProductsShowcase() {
  return (
    <section className="py-24 md:py-32 px-6 bg-transparent overflow-hidden" id="products">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4 opacity-80">
            <div className="w-12 h-[1px] bg-ink/20"></div>
            <span className="font-serif italic text-lg sm:text-xl tracking-wide text-ink/80 flex items-center gap-2">
              <Package className="w-5 h-5 opacity-70" />
              Our Products
            </span>
            <div className="w-12 h-[1px] bg-ink/20"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-ink tracking-tight mb-2">
            More than just{" "}
            <span className="bg-gradient-to-r from-navy to-mint bg-clip-text text-transparent">
              Business Cards
            </span>
          </h2>
          <p className="mt-2 max-w-lg mx-auto text-ink/50 text-lg">
            Choose from our wide range of premium NFC-enabled products. Swipe or click to explore our collection.
          </p>
        </motion.div>

        {/* Carousel Component */}
        <div className="mt-4">
          <SocialCards cards={PRODUCT_CARDS} />
        </div>
      </div>
    </section>
  );
}
