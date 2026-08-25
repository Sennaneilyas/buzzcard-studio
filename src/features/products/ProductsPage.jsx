import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Grid2X2, List, Search, ShoppingBag, SlidersHorizontal, X } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CartPopover from "./components/CartPopover";
import ProductCard from "./components/ProductCard";
import ProductDetailsSheet from "./components/ProductDetailsSheet";
import { useCartStore } from "./store/useCartStore";
import { CATEGORY_ROUTE_ALIASES } from "./data/productRoutes";
import { useProductCatalog } from "./hooks/useProductCatalog";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
  { value: "name", label: "Name: A to Z" },
];
const EMPTY_PRODUCTS = [];

const getCategoryFromRoute = (category, categories) => {
  if (!category) return "all";

  const resolvedCategory = CATEGORY_ROUTE_ALIASES[category] ?? category;
  return categories.some((item) => item.id === resolvedCategory)
    ? resolvedCategory
    : "all";
};

export default function ProductsPage() {
  const { slug: category } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [selectedDetailProduct, setSelectedDetailProduct] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const { data: catalog, isPending, isError, refetch } = useProductCatalog();
  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const beginCheckout = useCartStore((state) => state.beginCheckout);
  const products = catalog?.products ?? EMPTY_PRODUCTS;
  const productCategories = useMemo(
    () => [{ id: "all", label: "All products" }, ...(catalog?.categories ?? [])],
    [catalog?.categories],
  );
  const activeCategory = getCategoryFromRoute(category, productCategories);
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  useEffect(() => {
    if (!isFilterOpen) return undefined;

    const closeFilters = () => setIsFilterOpen(false);
    window.addEventListener("wheel", closeFilters, { passive: true });
    window.addEventListener("touchmove", closeFilters, { passive: true });

    return () => {
      window.removeEventListener("wheel", closeFilters);
      window.removeEventListener("touchmove", closeFilters);
    };
  }, [isFilterOpen]);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const filteredProducts = products.filter((product) => {
      const matchesCategory = activeCategory === "all" || product.category === activeCategory;
      const searchableText = `${product.name} ${product.description} ${product.badge}`.toLocaleLowerCase();
      return matchesCategory && searchableText.includes(normalizedQuery);
    });

    return [...filteredProducts].sort((first, second) => {
      if (sort === "price-low") return first.price - second.price;
      if (sort === "price-high") return second.price - first.price;
      if (sort === "name") return first.name.localeCompare(second.name);
      return 0;
    });
  }, [activeCategory, products, query, sort]);

  const selectCategory = (categoryId) => {
    navigate(categoryId === "all" ? "/products" : `/products/${categoryId}`);
  };

  const toggleFilters = () => {
    setIsFilterOpen((isOpen) => !isOpen);
  };

  const handleAddToCart = (product) => {
    if (product.stock === "out_of_stock") return;
    addItem({ product, variant: product.defaultVariant, quantity: 1 });
    setIsCartOpen(true);
  };

  const handleCartCheckout = () => {
    if (cartItems.length === 0) return;
    beginCheckout();
    setIsCartOpen(false);
    navigate("/checkout");
  };

  return (
    <main className="min-h-screen bg-cloud text-ink">
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-cloud/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="relative flex h-16 items-center justify-center">
            <Link
              to="/"
              className="absolute left-0 grid size-9 place-items-center rounded-full border border-ink/15 bg-white text-ink/70 transition hover:border-ink/30 hover:text-ink"
              aria-label="Back to home"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <h1 className="text-base font-extrabold tracking-[-0.03em] text-ink">Products</h1>
            <button
              type="button"
              onClick={() => setIsCartOpen((isOpen) => !isOpen)}
              className="absolute right-0 grid size-10 place-items-center rounded-full border border-ink/15 bg-white text-ink transition hover:border-ink/30 focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2"
              aria-label={`Cart, ${cartItemCount} item${cartItemCount === 1 ? "" : "s"}`}
              aria-expanded={isCartOpen}
            >
              <ShoppingBag className="size-[18px]" />
              {cartItemCount > 0 && (
                <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-mint px-1 text-[10px] font-extrabold leading-5 text-ink">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {isCartOpen && (
                <CartPopover
                  items={cartItems}
                  itemCount={cartItemCount}
                  total={cartTotal}
                  onClose={() => setIsCartOpen(false)}
                  onOpenProduct={(item) => {
                    const product = products.find((candidate) => candidate.id === item.productId);
                    if (product) setSelectedDetailProduct(product);
                    setIsCartOpen(false);
                  }}
                  onCheckout={handleCartCheckout}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeItem}
                  onClear={clearCart}
                />
              )}
            </AnimatePresence>
          </div>

          <div className="border-t border-ink/10 py-3">
            <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-2">
              <label className="relative block">
                <span className="sr-only">Search products</span>
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink/45" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search"
                  className="min-h-11 w-full rounded-xl border border-ink/15 bg-white py-2 pl-10 pr-10 text-sm outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/15"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-ink/50 hover:bg-ink/5 hover:text-ink"
                    aria-label="Clear search"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </label>

              <button
                type="button"
                onClick={toggleFilters}
                className={`grid size-11 place-items-center rounded-xl border transition ${
                  isFilterOpen || activeCategory !== "all" || sort !== "featured"
                    ? "border-navy bg-navy text-white"
                    : "border-ink/15 bg-white text-ink"
                }`}
                aria-expanded={isFilterOpen}
                aria-controls="product-filters"
              >
                <SlidersHorizontal className="size-4" />
              </button>

              <div className="flex h-11 overflow-hidden rounded-xl border border-ink/15 bg-white p-1" role="group" aria-label="Product view">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`grid size-8 place-items-center rounded-lg transition ${viewMode === "grid" ? "bg-navy text-white" : "text-ink/55 hover:bg-cloud hover:text-ink"}`}
                  aria-label="Grid view"
                  aria-pressed={viewMode === "grid"}
                >
                  <Grid2X2 className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`grid size-8 place-items-center rounded-lg transition ${viewMode === "list" ? "bg-navy text-white" : "text-ink/55 hover:bg-cloud hover:text-ink"}`}
                  aria-label="List view"
                  aria-pressed={viewMode === "list"}
                >
                  <List className="size-4" />
                </button>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {isFilterOpen && (
                <motion.div
                  id="product-filters"
                  initial={{ height: 0, opacity: 0, y: -8 }}
                  animate={{ height: "auto", opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 rounded-2xl border border-ink/10 bg-white p-4 shadow-[0_14px_32px_rgba(8,24,38,0.08)]">
                    <div className="flex flex-wrap gap-2">
                      {productCategories.map((productCategory) => {
                        const isActive = productCategory.id === activeCategory;
                        return (
                          <button
                            key={productCategory.id}
                            type="button"
                            onClick={() => selectCategory(productCategory.id)}
                            className={`min-h-9 rounded-full px-3.5 text-xs font-bold transition-colors ${
                              isActive
                                ? "bg-ink text-white"
                                : "border border-ink/15 bg-cloud text-ink/70 hover:border-ink/35 hover:text-ink"
                            }`}
                          >
                            {productCategory.label}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-4 border-t border-ink/10 pt-4">
                      <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-ink/45">Sort</p>
                      <div className="flex flex-wrap gap-2">
                        {SORT_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setSort(option.value)}
                            className={`min-h-9 rounded-full px-3.5 text-xs font-bold transition-colors ${
                              sort === option.value
                                ? "bg-navy text-white"
                                : "border border-ink/15 text-ink/65 hover:border-ink/35 hover:text-ink"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-6 sm:px-8 sm:py-8 lg:px-12">
        {isPending ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="Loading products">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="min-h-[29rem] animate-pulse rounded-[34px] bg-white p-3">
                <div className="aspect-square rounded-[25px] bg-ink/10" />
                <div className="space-y-3 px-3 pt-6">
                  <div className="h-5 w-3/4 rounded-full bg-ink/10" />
                  <div className="h-4 w-full rounded-full bg-ink/10" />
                  <div className="h-4 w-2/3 rounded-full bg-ink/10" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="grid min-h-72 place-items-center rounded-2xl bg-white px-6 text-center">
            <div>
              <p className="text-lg font-bold text-ink">Unable to load products</p>
              <p className="mt-2 text-sm text-ink/55">Please check your connection and try again.</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 min-h-11 rounded-xl bg-navy px-5 text-sm font-bold text-white"
              >
                Try again
              </button>
            </div>
          </div>
        ) : visibleProducts.length > 0 ? (
          <div className={viewMode === "grid" ? "grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid gap-3 lg:grid-cols-2"}>
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode={viewMode}
                onOpenDetails={setSelectedDetailProduct}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="grid min-h-72 place-items-center rounded-2xl bg-white px-6 text-center">
            <div>
              <p className="text-lg font-bold text-ink">No matches</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  selectCategory("all");
                }}
                className="mt-4 min-h-11 rounded-lg bg-ink px-4 text-sm font-bold text-white"
              >
                Clear filters
              </button>
            </div>
          </div>
        )}
      </section>

      <ProductDetailsSheet
        product={selectedDetailProduct}
        onClose={() => setSelectedDetailProduct(null)}
        onCheckout={({ product, variant, quantity }) => {
          setSelectedDetailProduct(null);
          addItem({ product, variant, quantity });
          beginCheckout();
          navigate("/checkout");
        }}
      />
    </main>
  );
}
