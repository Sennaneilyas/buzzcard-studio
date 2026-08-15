import { useEffect, useRef, useState } from "react";
import { MoreVertical, Edit2, Trash2, CornerDownRight, Flag, Star } from "lucide-react";
import { GLASS_SHADOW, GLASS_BORDER } from "../../utils/constants";
import ReviewForm from "./ReviewForm";
import ReplyForm from "./ReplyForm";
import ReviewReply from "./ReviewReply";

export default function ReviewCard({
  review,
  currentUser,
  profile,
  onUpdateReview,
  onDeleteReview,
  onSubmitReply,
  onUpdateReply,
  onDeleteReply,
  onReportReview,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const isAuthenticated = !!currentUser;
  const isReviewOwner = currentUser?.id === review.reviewer_id;
  // Note: for BuzzCard profiles, profile.id === profile.user_id since it extends auth.users
  const isProfileOwner = currentUser?.id === (profile?.user_id || profile?.id);

  const showEditDelete = isReviewOwner;
  const showReply = isProfileOwner && !isReviewOwner && !review.reply; // only if no reply exists yet
  const showReport = isAuthenticated && !isReviewOwner;
  const hasMenuActions = showEditDelete || showReply || showReport;

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler, { passive: true });
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const handleUpdate = async (data) => {
    if (onUpdateReview) await onUpdateReview({ reviewId: review.id, ...data });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (onDeleteReview) await onDeleteReview({ reviewId: review.id, profileId: review.profile_id });
    setIsDeleting(false);
  };

  if (isEditing) {
    return (
      <div className={`relative w-full rounded-[25px] bg-[#ffffff90] backdrop-blur-md ${GLASS_SHADOW} ${GLASS_BORDER} px-5 py-6`}>
        <ReviewForm
          initialData={{ rating: review.rating, comment: review.comment }}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  if (isDeleting) {
    return (
      <div className={`relative w-full rounded-[25px] bg-[#ffffff90] backdrop-blur-md ${GLASS_SHADOW} ${GLASS_BORDER} px-5 py-6 flex flex-col items-center text-center`}>
        <Trash2 className="w-10 h-10 text-red-500 mb-3" />
        <h3 className="font-bold text-neutral-950 mb-1">Supprimer l&apos;avis ?</h3>
        <p className="text-xs text-neutral-950/60 mb-5">Cette action est irréversible.</p>
        <div className="flex gap-3 w-full">
          <button onClick={() => setIsDeleting(false)} className="flex-1 bg-neutral-200 text-neutral-950 py-2 rounded-[12px] text-xs font-semibold active:scale-95 transition">
            Annuler
          </button>
          <button onClick={handleDelete} className="flex-1 bg-red-500 text-white py-2 rounded-[12px] text-xs font-semibold active:scale-95 transition">
            Supprimer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full rounded-[25px] bg-[#ffffff90] backdrop-blur-md ${GLASS_SHADOW} ${GLASS_BORDER} px-5 py-5`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-200 overflow-hidden shrink-0">
            {review.reviewer?.avatar_url ? (
              <img src={review.reviewer.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-neutral-950 text-white font-bold">
                {review.reviewer?.full_name?.charAt(0) || "U"}
              </div>
            )}
          </div>
          <div>
            <p className="font-bold text-sm text-neutral-950">{review.reviewer?.full_name || "Utilisateur"}</p>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${star <= review.rating ? "fill-neutral-950 text-neutral-950" : "text-neutral-950/20"}`}
                />
              ))}
            </div>
          </div>
        </div>

        {hasMenuActions && (
          <div className="relative z-20" ref={menuRef}>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-1 rounded-full hover:bg-neutral-950/5 active:scale-95 transition-all text-neutral-950/60">
              <MoreVertical className="w-5 h-5" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-white shadow-lg rounded-xl overflow-hidden py-1 border border-neutral-950/5 z-50">
                {showEditDelete && (
                  <>
                    <button onClick={() => { setIsEditing(true); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-xs text-neutral-950 hover:bg-neutral-50 flex items-center gap-2">
                      <Edit2 className="w-3.5 h-3.5" /> Modifier
                    </button>
                    <button onClick={() => { setIsDeleting(true); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2">
                      <Trash2 className="w-3.5 h-3.5" /> Supprimer
                    </button>
                  </>
                )}
                {showReply && (
                  <button onClick={() => { setIsReplying(true); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-xs text-neutral-950 hover:bg-neutral-50 flex items-center gap-2">
                    <CornerDownRight className="w-3.5 h-3.5" /> Répondre
                  </button>
                )}
                {showReport && (
                  <button
                    onClick={() => {
                      if (onReportReview) onReportReview({ reviewId: review.id, reason: "Signalement utilisateur" });
                      setMenuOpen(false);
                      alert("Avis signalé à la modération.");
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-orange-600 hover:bg-orange-50 flex items-center gap-2"
                  >
                    <Flag className="w-3.5 h-3.5" /> Signaler
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <p className="text-sm text-neutral-950 leading-5 whitespace-pre-wrap">{review.comment}</p>

      <p className="text-[10px] text-neutral-950/40 mt-2">
        {new Date(review.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
      </p>

      {isReplying && (
        <ReplyForm
          onSubmit={async (comment) => {
            if (onSubmitReply) await onSubmitReply({ reviewId: review.id, comment });
            setIsReplying(false);
          }}
          onCancel={() => setIsReplying(false)}
        />
      )}

      {review.reply && review.reply.length > 0 && (
        <div className="mt-4 pt-3 border-t border-neutral-950/10">
          <ReviewReply
            reply={review.reply[0]}
            isProfileOwner={isProfileOwner}
            onUpdateReply={onUpdateReply}
            onDeleteReply={onDeleteReply}
          />
        </div>
      )}
    </div>
  );
}
