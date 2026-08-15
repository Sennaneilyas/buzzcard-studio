import { useEffect, useRef, useState } from "react";
import { MoreVertical, Edit2, Trash2, CornerDownRight } from "lucide-react";
import ReplyForm from "./ReplyForm";

export default function ReviewReply({ reply, isProfileOwner, onUpdateReply, onDeleteReply }) {
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
          <button onClick={() => setIsDeleting(false)} className="flex-1 bg-white text-neutral-950 py-1.5 rounded-lg text-xs font-medium active:scale-95">
            Annuler
          </button>
          <button
            onClick={() => { if (onDeleteReply) onDeleteReply({ replyId: reply.id }); }}
            className="flex-1 bg-red-500 text-white py-1.5 rounded-lg text-xs font-medium active:scale-95"
          >
            Supprimer
          </button>
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
