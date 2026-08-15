import { AnimatePresence, motion } from "framer-motion";
import BuzzCardQRCode from "@/features/marketing/components/BuzzCardQRCode";

/**
 * Full-screen fade-in/out overlay hosting the QR code view.
 */
export default function QrCodeOverlay({ open, profile, onClose, shouldReduceMotion }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          className="fixed inset-0 z-[60]"
        >
          <BuzzCardQRCode profile={profile} onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
