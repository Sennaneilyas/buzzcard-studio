import { useState } from "react";
import { MessageSquare, Star } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const reviewSchema = z.object({
  rating: z.number().min(1, "Veuillez sélectionner une note"),
  comment: z.string().min(1, "Veuillez écrire un commentaire").max(500)
});

export default function ReviewForm({ initialData, onSubmit, onCancel }) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, register, handleSubmit: hookFormSubmit, setValue, formState: { errors, isValid } } = useForm({
    resolver: zodResolver(reviewSchema),
    mode: "onChange",
    defaultValues: {
      rating: initialData?.rating || 0,
      comment: initialData?.comment || ""
    }
  });

  const rating = useWatch({ control, name: "rating" });
  const displayedRating = hoveredRating || rating;
  const isEditing = !!initialData;

  const onSubmitHandler = async (data) => {
    setIsSubmitting(true);
    try {
      await onSubmit({ rating: data.rating, comment: data.comment.trim() });
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

      <form onSubmit={hookFormSubmit(onSubmitHandler)} className={`relative z-[2] ${!isEditing ? "mt-7" : ""}`}>
        <div className="flex flex-col items-center relative">
          <p className="text-xs font-medium text-neutral-950 mb-3">
            {isEditing ? "Modifier votre note" : "Votre note"}
          </p>
          <div className="flex items-center gap-2" onMouseLeave={() => setHoveredRating(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredRating(star)}
                onClick={() => setValue("rating", star, { shouldValidate: true })}
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
          {errors.rating && <p className="text-[10px] text-red-500 font-medium absolute -bottom-5">{errors.rating.message}</p>}
        </div>

        <div className="mt-8 relative">
          <label className="block text-xs font-medium text-neutral-950 mb-2">Votre commentaire</label>
          <textarea
            placeholder="Écrivez votre avis..."
            rows={4}
            maxLength={500}
            className={`w-full resize-none rounded-[18px] bg-white/60 border px-4 py-3 text-sm text-neutral-950 placeholder:text-neutral-950/35 outline-none transition-all ${
              errors.comment ? "border-red-300 focus:border-red-500" : "border-neutral-950/10 focus:border-neutral-950/25"
            }`}
            {...register("comment")}
          />
          {errors.comment && <p className="text-[10px] text-red-500 font-medium absolute -bottom-4 left-1">{errors.comment.message}</p>}
        </div>

        <div className="mt-5 flex gap-3">
          <button type="button" onClick={onCancel} className="flex-1 h-[45px] rounded-[15px] bg-neutral-200 text-neutral-950 text-sm font-medium active:scale-[0.98]">
            Annuler
          </button>
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="flex-1 h-[45px] rounded-[15px] bg-neutral-950 text-white text-sm font-medium active:scale-[0.98] disabled:opacity-40"
          >
            {isSubmitting ? "Envoi..." : isEditing ? "Mettre à jour" : "Publier"}
          </button>
        </div>
      </form>
    </>
  );
}
