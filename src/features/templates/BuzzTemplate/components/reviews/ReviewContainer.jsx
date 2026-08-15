import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { GLASS_SHADOW, GLASS_BORDER } from "../../utils/constants";
import BuzzCardBackground from "../ui/BuzzCardBackground";
import ReviewsList from "./ReviewsList";
import ReviewForm from "./ReviewForm";
import ReviewLoginRequired from "./ReviewLoginRequired";
import ReviewSubmitted from "./ReviewSubmitted";

const PANEL_CLASS = `relative w-full rounded-[25px] bg-[#ffffff90] backdrop-blur-md ${GLASS_SHADOW} ${GLASS_BORDER} px-5 py-6`;

/**
 * Owns which review sub-view is shown: the list, the "leave a review" form,
 * a login-required prompt, or the post-submit confirmation.
 */
export default function ReviewContainer({
  isLoggedIn,
  currentUser,
  profile,
  reviews = [],
  onClose,
  onSubmitReview,
  onUpdateReview,
  onDeleteReview,
  onSubmitReply,
  onUpdateReply,
  onDeleteReply,
  onReportReview,
  shouldReduceMotion,
}) {
  const [view, setView] = useState("list"); // "list" | "form" | "login" | "submitted"

  const handleLeaveReviewClick = () => {
    setView(isLoggedIn ? "form" : "login");
  };

  const handleReviewSubmit = async (data) => {
    if (onSubmitReview) await onSubmitReview(data);
    setView("submitted");
  };

  const transition = (extra = {}) => ({
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 20, scale: shouldReduceMotion ? 1 : 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: shouldReduceMotion ? 0 : -20 },
    transition: { duration: shouldReduceMotion ? 0 : 0.25 },
    ...extra,
  });

  return (
    <div className="relative w-full h-[100dvh] bg-[#f4f5f7] overflow-y-auto">
      <BuzzCardBackground fixed />

      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer"
        className="fixed top-5 right-5 z-30 w-[42px] h-[42px] rounded-full bg-white/70 backdrop-blur-md flex items-center justify-center shadow-md active:scale-95 transition-transform"
      >
        <X className="w-5 h-5 text-neutral-950" />
      </button>

      <div className="relative z-10 w-full max-w-[430px] min-h-[100dvh] mx-auto px-5 py-20 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {view === "list" && (
            <motion.div key="list" {...transition()} className="w-full">
              <ReviewsList
                reviews={reviews}
                currentUser={currentUser}
                profile={profile}
                onLeaveReview={handleLeaveReviewClick}
                onUpdateReview={onUpdateReview}
                onDeleteReview={onDeleteReview}
                onSubmitReply={onSubmitReply}
                onUpdateReply={onUpdateReply}
                onDeleteReply={onDeleteReply}
                onReportReview={onReportReview}
              />
            </motion.div>
          )}

          {view === "form" && (
            <motion.div key="form" {...transition()} className={PANEL_CLASS}>
              <ReviewForm onSubmit={handleReviewSubmit} onCancel={() => setView("list")} />
            </motion.div>
          )}

          {view === "login" && (
            <motion.div key="login" {...transition()} className={PANEL_CLASS}>
              <ReviewLoginRequired onBack={() => setView("list")} />
            </motion.div>
          )}

          {view === "submitted" && (
            <motion.div key="submitted" {...transition()} className={PANEL_CLASS}>
              <ReviewSubmitted onBack={() => setView("list")} onClose={onClose} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
