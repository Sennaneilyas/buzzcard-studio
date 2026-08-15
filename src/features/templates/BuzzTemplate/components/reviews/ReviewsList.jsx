import { MessageSquare } from "lucide-react";
import ReviewCard from "./ReviewCard";

export default function ReviewsList({
  reviews,
  currentUser,
  profile,
  onLeaveReview,
  onUpdateReview,
  onDeleteReview,
  onSubmitReply,
  onUpdateReply,
  onDeleteReply,
  onReportReview,
}) {
  const hasReviewed =
    currentUser && reviews.some((r) => r.reviewer_id === currentUser.id);

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-bold text-neutral-950">Avis clients</h2>
        {!hasReviewed && (
          <button
            onClick={onLeaveReview}
            className="text-xs font-semibold bg-neutral-950 text-white px-3 py-1.5 rounded-full active:scale-95 transition-transform"
          >
            Laisser un avis
          </button>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-neutral-950/50">
          <MessageSquare className="w-10 h-10 mb-3 opacity-20" />
          <p className="text-sm">Aucun avis pour le moment.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              currentUser={currentUser}
              profile={profile}
              onUpdateReview={onUpdateReview}
              onDeleteReview={onDeleteReview}
              onSubmitReply={onSubmitReply}
              onUpdateReply={onUpdateReply}
              onDeleteReply={onDeleteReply}
              onReportReview={onReportReview}
            />
          ))}
        </div>
      )}
    </div>
  );
}
