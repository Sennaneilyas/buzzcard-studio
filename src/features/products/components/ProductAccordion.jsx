import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ShoppingBag } from "lucide-react";
import { PRODUCT_RANGES } from "../data/products";
import CheckoutDrawer from "./CheckoutDrawer";

export default function ProductAccordion({ initialCategory }) {
  // If no category is passed or found, default to the first one
  const [openCategory, setOpenCategory] = useState(
    initialCategory || PRODUCT_RANGES[0].id
  );
  
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Sync state if the URL parameter changes
  useEffect(() => {
    if (initialCategory) {
      setOpenCategory(initialCategory);
    }
  }, [initialCategory]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 relative z-10">
      {PRODUCT_RANGES.map((range) => {
        const isOpen = openCategory === range.id;

        return (
          <div
            key={range.id}
            className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${
              isOpen ? "bg-white border-black/10 shadow-sm" : "bg-white/50 border-black/5 hover:bg-white"
            }`}
          >
            <button
              onClick={() => setOpenCategory(isOpen ? null : range.id)}
              className="w-full flex items-center justify-between p-6 text-left outline-none"
            >
              <div>
                <h3 className={`text-xl font-bold transition-colors ${isOpen ? "text-ink" : "text-ink/80"}`}>
                  {range.title}
                </h3>
                <p className="text-sm text-ink/50 mt-1">{range.description}</p>
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                  isOpen ? "bg-black/5" : "bg-transparent"
                }`}
              >
                <ChevronDown className={`w-5 h-5 ${isOpen ? "text-ink" : "text-ink/40"}`} />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="p-6 pt-0 border-t border-black/5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                      {range.products.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => setSelectedProduct(product)}
                          className="p-5 rounded-xl border border-black/5 bg-black/[0.02] hover:bg-black/[0.05] transition-all flex justify-between items-center group cursor-pointer shadow-sm hover:shadow-md"
                        >
                          <div>
                            <span className="block font-bold text-ink group-hover:text-navy transition-colors">
                              {product.name}
                            </span>
                            <span className="flex items-center gap-1 text-sm text-ink/50 mt-1 font-medium group-hover:text-navy/70">
                              <ShoppingBag className="w-3.5 h-3.5" />
                              Configure & Buy
                            </span>
                          </div>
                          <span className="text-ink font-bold bg-white px-3 py-1.5 rounded-lg border border-black/5">
                            {product.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      <CheckoutDrawer 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        product={selectedProduct} 
      />
    </div>
  );
}
