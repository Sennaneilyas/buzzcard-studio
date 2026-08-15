import { useState } from "react";

export default function ReplyForm({ initialComment = "", onSubmit, onCancel }) {
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
        <button onClick={onCancel} className="px-3 py-1.5 text-[11px] font-semibold text-neutral-950 hover:bg-neutral-950/10 rounded-lg">
          Annuler
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !comment.trim()}
          className="px-3 py-1.5 text-[11px] font-semibold bg-neutral-950 text-white rounded-lg disabled:opacity-50"
        >
          {isSubmitting ? "Envoi..." : "Répondre"}
        </button>
      </div>
    </div>
  );
}
