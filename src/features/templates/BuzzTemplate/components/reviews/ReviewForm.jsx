import { useState } from "react";
import { MessageSquare, Star } from "lucide-react";

export default function ReviewForm({ initialData, onSubmit, onCancel }) {
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
          <p className="text-xs font-medium text-neutral-950 mb-3">
            {isEditing ? "Modifier votre note" : "Votre note"}
          </p>
          <div className="flex items-center gap-2" onMouseLeave={() => setHoveredRating(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredRating(star)}
                onClick={() => setRating(star)}
                className="w-9 h-9 flex items-center justify-center active:scale-90 transition-transform"
              >
                <Star
                  className={`w-7 h-7 transition-all duration-150 ${
                    star <= displayedRating ? "fill-neutral-950 text-neutral-950" : "text-neutral-950/25"
                  }`}
                />
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
          <button
            type="submit"
            disabled={!rating || !comment.trim() || isSubmitting}
            className="flex-1 h-[45px] rounded-[15px] bg-neutral-950 text-white text-sm font-medium active:scale-[0.98] disabled:opacity-40"
          >
            {isSubmitting ? "Envoi..." : isEditing ? "Mettre à jour" : "Publier"}
          </button>
        </div>
      </form>
    </>
  );
}
