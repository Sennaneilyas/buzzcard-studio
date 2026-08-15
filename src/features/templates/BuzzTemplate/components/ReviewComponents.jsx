import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  MessageSquare, 
  Star, 
  UserRoundPlus, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  CornerDownRight, 
  Flag 
} from "lucide-react";

const GLASS_SHADOW =
  "shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),_0px_12px_12px_-6px_rgba(0,0,0,0.06),_0px_24px_24px_-12px_rgba(0,0,0,0.06)]";
const GLASS_BORDER =
  "before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-[25px] before:p-px before:content-[''] before:[background:conic-gradient(from_90deg_at_100%_100%,rgba(255,255,255,0.5)_12%,rgba(255,255,255,0)_37%,rgba(255,255,255,0.5)_62%,rgba(255,255,255,0)_87%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude]";

export function ReviewContainer({
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
  const [view, setView] = useState("list"); // "list", "form", "login", "submitted"

  // If user clicks "Leave a review" but isn't logged in
  const handleLeaveReviewClick = () => {
    if (isLoggedIn) {
      setView("form");
    } else {
      setView("login");
    }
  };

  const handleReviewSubmit = async (data) => {
    if (onSubmitReview) await onSubmitReview(data);
    setView("submitted");
  };

  return (
    <div className="relative w-full h-[100dvh] bg-[#f4f5f7] overflow-y-auto">
      {/* Backgrounds */}
      <img
        src="/Vector 1.svg"
        alt=""
        fetchpriority="high"
        decoding="async"
        className="absolute left-0 top-[12%] w-full h-auto opacity-50 pointer-events-none fixed"
      />
      <img
        src="/Vector 2.svg"
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute left-[29%] bottom-0 w-[71%] h-auto opacity-50 pointer-events-none fixed"
      />

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
            <motion.div
              key="list"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20, scale: shouldReduceMotion ? 1 : 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
              className="w-full"
            >
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
            <motion.div
              key="form"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20, scale: shouldReduceMotion ? 1 : 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
              className={`relative w-full rounded-[25px] bg-[#ffffff90] backdrop-blur-md ${GLASS_SHADOW} ${GLASS_BORDER} px-5 py-6`}
            >
              <ReviewForm
                onSubmit={handleReviewSubmit}
                onCancel={() => setView("list")}
              />
            </motion.div>
          )}

          {view === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20, scale: shouldReduceMotion ? 1 : 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
              className={`relative w-full rounded-[25px] bg-[#ffffff90] backdrop-blur-md ${GLASS_SHADOW} ${GLASS_BORDER} px-5 py-6`}
            >
              <ReviewLoginRequired onBack={() => setView("list")} />
            </motion.div>
          )}

          {view === "submitted" && (
            <motion.div
              key="submitted"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20, scale: shouldReduceMotion ? 1 : 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
              className={`relative w-full rounded-[25px] bg-[#ffffff90] backdrop-blur-md ${GLASS_SHADOW} ${GLASS_BORDER} px-5 py-6`}
            >
              <ReviewSubmitted onBack={() => setView("list")} onClose={onClose} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ReviewsList({
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
  const hasReviewed = currentUser && reviews.some((r) => r.reviewer_id === currentUser.id);

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

function ReviewCard({
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

  // Permission logic
  const isAuthenticated = !!currentUser;
  const isReviewOwner = currentUser?.id === review.reviewer_id;
  
  // Note: For BuzzCard profiles, profile.id is the same as profile.user_id since it extends auth.users
  const isProfileOwner = currentUser?.id === (profile?.user_id || profile?.id);

  const showEditDelete = isReviewOwner;
  const showReply = isProfileOwner && !isReviewOwner && !review.reply; // only if no reply exists yet
  const showReport = isAuthenticated && !isReviewOwner;
  
  const hasMenuActions = showEditDelete || showReply || showReport;

  // Close menu on click outside
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
        <h3 className="font-bold text-neutral-950 mb-1">Supprimer l'avis ?</h3>
        <p className="text-xs text-neutral-950/60 mb-5">Cette action est irréversible.</p>
        <div className="flex gap-3 w-full">
          <button onClick={() => setIsDeleting(false)} className="flex-1 bg-neutral-200 text-neutral-950 py-2 rounded-[12px] text-xs font-semibold active:scale-95 transition">Annuler</button>
          <button onClick={handleDelete} className="flex-1 bg-red-500 text-white py-2 rounded-[12px] text-xs font-semibold active:scale-95 transition">Supprimer</button>
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
                <Star key={star} className={`w-3 h-3 ${star <= review.rating ? "fill-neutral-950 text-neutral-950" : "text-neutral-950/20"}`} />
              ))}
            </div>
          </div>
        </div>
        
        {/* Action Menu */}
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
                  <button onClick={() => { 
                    if (onReportReview) onReportReview({ reviewId: review.id, reason: "Signalement utilisateur" });
                    setMenuOpen(false);
                    alert("Avis signalé à la modération.");
                  }} className="w-full text-left px-4 py-2 text-xs text-orange-600 hover:bg-orange-50 flex items-center gap-2">
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
        {new Date(review.created_at).toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>

      {/* Reply input for Profile Owner */}
      {isReplying && (
        <ReplyForm
          onSubmit={async (comment) => {
            if (onSubmitReply) await onSubmitReply({ reviewId: review.id, comment });
            setIsReplying(false);
          }}
          onCancel={() => setIsReplying(false)}
        />
      )}

      {/* Display Reply if exists */}
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

function ReviewReply({ reply, isProfileOwner, onUpdateReply, onDeleteReply }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler, { passive: true });
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  if (isEditing) {
    return (
      <ReplyForm 
        initialComment={reply.comment}
        onSubmit={async (comment) => {
          if (onUpdateReply) await onUpdateReply({ replyId: reply.id, comment });
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  if (isDeleting) {
    return (
      <div className="bg-neutral-950/5 rounded-[12px] p-3 text-center">
        <p className="text-xs font-semibold text-neutral-950 mb-2">Supprimer la réponse ?</p>
        <div className="flex gap-2">
          <button onClick={() => setIsDeleting(false)} className="flex-1 bg-white text-neutral-950 py-1.5 rounded-lg text-xs font-medium active:scale-95">Annuler</button>
          <button onClick={() => { if (onDeleteReply) onDeleteReply({ replyId: reply.id }); }} className="flex-1 bg-red-500 text-white py-1.5 rounded-lg text-xs font-medium active:scale-95">Supprimer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-neutral-950/5 rounded-tr-[16px] rounded-br-[16px] rounded-bl-[16px] p-3 border-l-2 border-neutral-950">
      <div className="flex justify-between items-start mb-1">
        <div className="flex items-center gap-1.5 text-neutral-950 font-bold text-xs">
          <CornerDownRight className="w-3.5 h-3.5 opacity-60" />
          Réponse du propriétaire
        </div>
        
        {isProfileOwner && (
          <div className="relative z-20" ref={menuRef}>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-0.5 rounded text-neutral-950/50 hover:bg-neutral-950/10">
              <MoreVertical className="w-4 h-4" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-white shadow-lg rounded-xl overflow-hidden py-1 border border-neutral-950/5 z-50">
                <button onClick={() => { setIsEditing(true); setMenuOpen(false); }} className="w-full text-left px-3 py-1.5 text-[11px] text-neutral-950 hover:bg-neutral-50 flex items-center gap-1.5">
                  <Edit2 className="w-3 h-3" /> Modifier
                </button>
                <button onClick={() => { setIsDeleting(true); setMenuOpen(false); }} className="w-full text-left px-3 py-1.5 text-[11px] text-red-600 hover:bg-red-50 flex items-center gap-1.5">
                  <Trash2 className="w-3 h-3" /> Supprimer
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <p className="text-xs text-neutral-950 leading-relaxed whitespace-pre-wrap">{reply.comment}</p>
    </div>
  );
}

function ReplyForm({ initialComment = "", onSubmit, onCancel }) {
  const [comment, setComment] = useState(initialComment);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmit(comment.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-3 bg-neutral-950/5 p-3 rounded-[16px]">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Votre réponse..."
        rows={3}
        className="w-full resize-none rounded-[12px] bg-white border border-neutral-950/10 px-3 py-2 text-xs text-neutral-950 placeholder:text-neutral-950/35 outline-none focus:border-neutral-950/25"
      />
      <div className="flex gap-2 justify-end mt-2">
        <button onClick={onCancel} className="px-3 py-1.5 text-[11px] font-semibold text-neutral-950 hover:bg-neutral-950/10 rounded-lg">Annuler</button>
        <button onClick={handleSubmit} disabled={isSubmitting || !comment.trim()} className="px-3 py-1.5 text-[11px] font-semibold bg-neutral-950 text-white rounded-lg disabled:opacity-50">
          {isSubmitting ? "Envoi..." : "Répondre"}
        </button>
      </div>
    </div>
  );
}

function ReviewForm({ initialData, onSubmit, onCancel }) {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(initialData?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayedRating = hoveredRating || rating;
  const isEditing = !!initialData;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmit({ rating, comment: comment.trim() });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {!isEditing && (
        <div className="relative z-[2] flex flex-col items-center">
          <div className="w-[52px] h-[52px] rounded-full bg-neutral-950 flex items-center justify-center mb-4">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-neutral-950 text-xl font-bold text-center">Laisser un avis</h2>
          <p className="mt-1 text-neutral-950/60 text-sm text-center">Partagez votre expérience</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className={`relative z-[2] ${!isEditing ? "mt-7" : ""}`}>
        <div className="flex flex-col items-center">
          <p className="text-xs font-medium text-neutral-950 mb-3">{isEditing ? "Modifier votre note" : "Votre note"}</p>
          <div className="flex items-center gap-2" onMouseLeave={() => setHoveredRating(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredRating(star)}
                onClick={() => setRating(star)}
                className="w-9 h-9 flex items-center justify-center active:scale-90 transition-transform"
              >
                <Star className={`w-7 h-7 transition-all duration-150 ${star <= displayedRating ? "fill-neutral-950 text-neutral-950" : "text-neutral-950/25"}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-xs font-medium text-neutral-950 mb-2">Votre commentaire</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Écrivez votre avis..."
            rows={4}
            maxLength={500}
            className="w-full resize-none rounded-[18px] bg-white/60 border border-neutral-950/10 px-4 py-3 text-sm text-neutral-950 placeholder:text-neutral-950/35 outline-none focus:border-neutral-950/25 transition-all"
          />
        </div>

        <div className="mt-5 flex gap-3">
          <button type="button" onClick={onCancel} className="flex-1 h-[45px] rounded-[15px] bg-neutral-200 text-neutral-950 text-sm font-medium active:scale-[0.98]">
            Annuler
          </button>
          <button type="submit" disabled={!rating || !comment.trim() || isSubmitting} className="flex-1 h-[45px] rounded-[15px] bg-neutral-950 text-white text-sm font-medium active:scale-[0.98] disabled:opacity-40">
            {isSubmitting ? "Envoi..." : isEditing ? "Mettre à jour" : "Publier"}
          </button>
        </div>
      </form>
    </>
  );
}

function ReviewLoginRequired({ onBack }) {
  return (
    <div className="relative z-[2] flex flex-col items-center text-center py-8">
      <div className="w-[58px] h-[58px] rounded-full bg-neutral-950 flex items-center justify-center mb-5">
        <UserRoundPlus className="w-6 h-6 text-white" />
      </div>
      <h2 className="text-neutral-950 text-xl font-bold">Connexion requise</h2>
      <p className="mt-2 max-w-[280px] text-sm leading-5 text-neutral-950/60">Vous devez être connecté pour pouvoir laisser un avis.</p>
      <div className="w-full flex gap-3 mt-6">
        <button type="button" onClick={onBack} className="flex-1 h-[45px] rounded-[15px] bg-neutral-200 text-neutral-950 text-sm font-medium active:scale-[0.98]">
          Retour
        </button>
        <button type="button" className="flex-1 h-[45px] rounded-[15px] bg-neutral-950 text-white text-sm font-medium active:scale-[0.98]">
          Se connecter
        </button>
      </div>
    </div>
  );
}

function ReviewSubmitted({ onBack, onClose }) {
  return (
    <div className="relative z-[2] flex flex-col items-center text-center py-8">
      <div className="w-[58px] h-[58px] rounded-full bg-neutral-950 flex items-center justify-center mb-5">
        <Star className="w-6 h-6 text-white fill-white" />
      </div>
      <h2 className="text-neutral-950 text-xl font-bold">Merci pour votre avis !</h2>
      <p className="mt-2 max-w-[280px] text-sm leading-5 text-neutral-950/60">Votre avis a bien été enregistré et publié sur ce profil.</p>
      <div className="w-full flex flex-col gap-3 mt-6">
        <button type="button" onClick={onBack} className="w-full h-[45px] rounded-[15px] bg-neutral-950 text-white text-sm font-medium active:bg-neutral-800 transition-colors">
          Voir les avis
        </button>
        <button type="button" onClick={onClose} className="w-full h-[45px] rounded-[15px] bg-transparent text-neutral-950 text-sm font-medium active:bg-neutral-950/5 transition-colors">
          Fermer
        </button>
      </div>
    </div>
  );
}
