import { AnimatePresence, motion } from "framer-motion";
import ReviewContainer from "../reviews/ReviewContainer";

/**
 * Full-screen fade-in/out overlay hosting the reviews list/form flow.
 */
export default function ReviewOverlay({
  open,
  isLoggedIn,
  currentUser,
  profile,
  reviews,
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
          <ReviewContainer
            isLoggedIn={isLoggedIn}
            currentUser={currentUser}
            profile={profile}
            reviews={reviews}
            onClose={onClose}
            onSubmitReview={onSubmitReview}
            onUpdateReview={onUpdateReview}
            onDeleteReview={onDeleteReview}
            onSubmitReply={onSubmitReply}
            onUpdateReply={onUpdateReply}
            onDeleteReply={onDeleteReply}
            onReportReview={onReportReview}
            shouldReduceMotion={shouldReduceMotion}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
