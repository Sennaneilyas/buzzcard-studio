import { UserRoundPlus } from "lucide-react";

export default function ReviewLoginRequired({ onBack }) {
  return (
    <div className="relative z-[2] flex flex-col items-center text-center py-8">
      <div className="w-[58px] h-[58px] rounded-full bg-neutral-950 flex items-center justify-center mb-5">
        <UserRoundPlus className="w-6 h-6 text-white" />
      </div>
      <h2 className="text-neutral-950 text-xl font-bold">Connexion requise</h2>
      <p className="mt-2 max-w-[280px] text-sm leading-5 text-neutral-950/60">
        Vous devez être connecté pour pouvoir laisser un avis.
      </p>
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
