import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, User, Box } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CheckoutDrawer({ isOpen, onClose, product }) {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // Reset step when opened
  useEffect(() => {
    if (isOpen) setStep(1);
  }, [isOpen]);

  if (!product) return null;

  const handleNext = () => setStep((s) => s + 1);
  
  const handleComplete = () => {
    onClose();
    // Simulate successful payment redirect to onboarding wizard
    navigate("/onboarding");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-black/5">
              <div>
                <h2 className="text-xl font-bold text-ink">Checkout</h2>
                <p className="text-sm text-ink/60">Step {step} of 3</p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
              >
                <X className="w-5 h-5 text-ink" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Step 1: Configuration */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-navy">
                    <Box className="w-6 h-6" />
                    <h3 className="text-lg font-semibold">Product Configuration</h3>
                  </div>
                  <div className="p-4 bg-cloud rounded-xl border border-black/5">
                    <h4 className="font-bold text-ink">{product.name}</h4>
                    <p className="text-ink/60">{product.price}</p>
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-ink">Quantity</label>
                    <select className="w-full p-3 rounded-xl border border-black/10 bg-white">
                      <option>1 unit</option>
                      <option>5 units (Team Pack)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Authentication */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-navy">
                    <User className="w-6 h-6" />
                    <h3 className="text-lg font-semibold">Account Details</h3>
                  </div>
                  <p className="text-sm text-ink/60">
                    Create an account to link your physical card to your digital profile.
                  </p>
                  <div className="space-y-4">
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full p-3 rounded-xl border border-black/10 bg-white"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full p-3 rounded-xl border border-black/10 bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-navy">
                    <CreditCard className="w-6 h-6" />
                    <h3 className="text-lg font-semibold">Payment Info</h3>
                  </div>
                  <div className="p-6 rounded-xl border border-black/10 bg-cloud text-center space-y-4">
                    <CreditCard className="w-12 h-12 text-ink/20 mx-auto" />
                    <p className="text-sm text-ink/60">Stripe Elements will render here</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer / Actions */}
            <div className="p-6 border-t border-black/5 bg-cloud/50">
              {step < 3 ? (
                <button
                  onClick={handleNext}
                  className="w-full py-4 bg-ink text-white rounded-xl font-semibold hover:bg-navy transition-colors"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  className="w-full py-4 bg-mint text-ink rounded-xl font-bold hover:bg-mint/90 transition-colors"
                >
                  Pay {product.price}
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
