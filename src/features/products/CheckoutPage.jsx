import { useEffect, useMemo, useRef } from "react";
import { ArrowLeft, Check, LockKeyhole, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useProfile } from "@/features/auth/hooks/useProfile";
import { getBuzzCardVariantKey } from "./api/cardPreviews";
import CheckoutConfigurationItem from "./components/CheckoutConfigurationItem";
import { isCartItemConfigured } from "./checkout/configuration";
import { useCartStore } from "./store/useCartStore";
import { useProductCatalog } from "./hooks/useProductCatalog";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { data: catalog } = useProductCatalog();
  const user = useAuthStore((state) => state.user);
  const { data: profile } = useProfile();
  const profileInitializedItems = useRef(new Set());
  const isAuthLoading = useAuthStore((state) => state.isLoading);
  const items = useCartStore((state) => state.items);
  const checkoutStep = useCartStore((state) => state.checkoutStep);
  const setCheckoutStep = useCartStore((state) => state.setCheckoutStep);
  const updateConfiguration = useCartStore((state) => state.updateConfiguration);
  const updateCustomization = useCartStore((state) => state.updateCustomization);
  const setCustomizationFile = useCartStore((state) => state.setCustomizationFile);
  const changeItemVariant = useCartStore((state) => state.changeItemVariant);
  const removeItem = useCartStore((state) => state.removeItem);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isConfigurationComplete = useMemo(
    () => items.length > 0 && items.every(isCartItemConfigured),
    [items],
  );

  useEffect(() => {
    const profileName = profile?.full_name?.trim();
    if (!profileName) return;

    items.forEach((item) => {
      if (getBuzzCardVariantKey(item.variant) !== "custom") return;
      if (profileInitializedItems.current.has(item.id)) return;

      profileInitializedItems.current.add(item.id);
      if (!item.customization.displayName && !item.customization.businessName) {
        updateCustomization(item.id, { displayName: profileName });
      }
    });
  }, [items, profile?.full_name, updateCustomization]);

  useEffect(() => {
    if (!isAuthLoading && !user && checkoutStep === "delivery") {
      navigate("/auth?mode=login&returnTo=%2Fcheckout", { replace: true });
    }
  }, [checkoutStep, isAuthLoading, navigate, user]);

  const handleContinue = () => {
    if (!isConfigurationComplete || isAuthLoading) return;
    setCheckoutStep("delivery");
    if (!user) navigate("/auth?mode=login&returnTo=%2Fcheckout");
  };

  if (items.length === 0) {
    return (
      <main className="grid min-h-dvh place-items-center bg-cloud px-5 text-center text-ink">
        <div>
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-white text-ink/45 shadow-lg shadow-navy/10">
            <ShoppingBag className="size-6" />
          </span>
          <h1 className="mt-5 font-heading text-2xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-sm text-ink/55">Add a product before starting checkout.</p>
          <Link to="/products" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-navy px-5 text-sm font-bold text-white">Browse products</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-cloud text-ink">
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-cloud/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link to="/products" className="grid size-10 place-items-center rounded-full border border-ink/15 bg-white" aria-label="Back to products">
            <ArrowLeft className="size-4" />
          </Link>
          <div className="text-center">
            <h1 className="text-sm font-extrabold">Checkout</h1>
            <p className="text-[11px] text-ink/45">{checkoutStep === "configuration" ? "Configure your products" : "Delivery and review"}</p>
          </div>
          <div className="w-10 text-right text-xs font-bold text-navy">{total} MAD</div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-6 sm:px-8 sm:py-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section>
          <ol className="mb-6 grid grid-cols-2 gap-2" aria-label="Checkout progress">
            {[{ id: "configuration", label: "Configuration" }, { id: "delivery", label: "Delivery & review" }].map((step, index) => {
              const active = step.id === checkoutStep;
              const complete = step.id === "configuration" && checkoutStep === "delivery";
              return (
                <li key={step.id} className={`flex min-h-11 items-center gap-2 rounded-xl border px-3 text-xs font-bold ${active ? "border-navy bg-white text-navy" : "border-ink/10 text-ink/45"}`}>
                  <span className={`grid size-6 place-items-center rounded-full ${active || complete ? "bg-navy text-white" : "bg-white"}`}>
                    {complete ? <Check className="size-3.5" /> : index + 1}
                  </span>
                  {step.label}
                </li>
              );
            })}
          </ol>

          {checkoutStep === "configuration" ? (
            <div className="space-y-4">
              {items.map((item, index) => (
                <CheckoutConfigurationItem
                  key={item.id}
                  item={item}
                  index={index}
                  availableVariants={catalog?.products.find((product) => product.id === item.productId)?.variants}
                  onConfigurationChange={updateConfiguration}
                  onCustomizationChange={updateCustomization}
                  onFileChange={setCustomizationFile}
                  onVariantChange={changeItemVariant}
                  onRemove={removeItem}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-ink/10 bg-white p-6 shadow-lg shadow-navy/5 sm:p-8">
              <span className="grid size-11 place-items-center rounded-full bg-mint text-ink"><Check className="size-5" /></span>
              <h2 className="mt-5 font-heading text-2xl font-bold">Configuration saved</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-ink/60">Your cart and product configuration are ready. Delivery and final review will be implemented in the next checkout stage; no order has been created yet.</p>
              <button type="button" onClick={() => setCheckoutStep("configuration")} className="mt-6 min-h-11 rounded-xl border border-ink/15 px-4 text-sm font-bold text-ink">Review configuration</button>
            </div>
          )}
        </section>

        <aside className="h-fit rounded-[24px] bg-white p-5 shadow-lg shadow-navy/5 lg:sticky lg:top-24">
          <h2 className="font-heading text-lg font-bold">Order summary</h2>
          <div className="mt-4 space-y-3 border-y border-ink/10 py-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between gap-4 text-sm">
                <p className="min-w-0 text-ink/65"><span className="font-semibold text-ink">{item.quantity}×</span> {item.name}</p>
                <p className="shrink-0 font-bold">{item.price * item.quantity} MAD</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between font-bold"><span>Total</span><span className="text-xl text-navy">{total} MAD</span></div>

          {checkoutStep === "configuration" && (
            <>
              <button
                type="button"
                onClick={handleContinue}
                disabled={!isConfigurationComplete || isAuthLoading}
                className="mt-5 flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-mint px-4 text-sm font-bold text-ink transition hover:bg-mint/80 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {!user && <LockKeyhole className="size-4" />}
                Continue
              </button>
              <p className="mt-2 text-center text-[11px] leading-4 text-ink/45">
                {isConfigurationComplete
                  ? user ? "Continue to delivery and review." : "You’ll sign in next. Your configuration is preserved."
                  : "Complete every required product field to continue."}
              </p>
            </>
          )}
        </aside>
      </div>
    </main>
  );
}
