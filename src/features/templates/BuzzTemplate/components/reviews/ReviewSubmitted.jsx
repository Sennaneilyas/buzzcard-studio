import { Star } from "lucide-react";

export default function ReviewSubmitted({ onBack, onClose }) {
  return (
    <div className="relative z-[2] flex flex-col items-center text-center py-8">
      <div className="w-[58px] h-[58px] rounded-full bg-neutral-950 flex items-center justify-center mb-5">
        <Star className="w-6 h-6 text-white fill-white" />
      </div>
      <h2 className="text-neutral-950 text-xl font-bold">Merci pour votre avis !</h2>
      <p className="mt-2 max-w-[280px] text-sm leading-5 text-neutral-950/60">
        Votre avis a bien été enregistré et publié sur ce profil.
      </p>
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
