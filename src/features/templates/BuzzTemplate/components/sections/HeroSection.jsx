import { useMemo } from "react";
import { UserRoundPlus, Phone, Mail, Link } from "lucide-react";
import { GLASS_SHADOW } from "../../utils/constants";
import { useSaveContact } from "../../hooks/useSaveContact";
import ContactPopover from "../ui/ContactPopover";

/**
 * Identity card: avatar, name, company/profession, contact quick-actions
 * (call / email / website), and the "Enregistrer le contact" vCard button.
 */
export default function HeroSection({ profile }) {
  const { phones, emails, isSaved, handleSaveContact } = useSaveContact(profile);

  const contactActions = useMemo(
    () =>
      [
        phones.length > 0 && {
          id: "phone",
          entries: phones,
          href: `tel:${phones[0]}`,
          icon: Phone,
          label: "Appeler",
        },
        emails.length > 0 && {
          id: "email",
          entries: emails,
          href: `mailto:${emails[0]}`,
          icon: Mail,
          label: "Email",
        },
        profile.website && {
          id: "website",
          entries: null,
          href: profile.website,
          icon: Link,
          label: "Site web",
        },
      ].filter(Boolean),
    [phones, emails, profile.website]
  );

  return (
    <article
      className={`relative z-50 w-full rounded-[25px] bg-[#f4f5f790] backdrop-blur-md ${GLASS_SHADOW} -mt-[39px] pt-[47px] pb-[18px] flex flex-col items-center gap-[6px]`}
    >
      <div className="absolute -top-[39px] left-1/2 -translate-x-1/2 w-[78px] h-[78px] rounded-full ring-2 ring-white/80 overflow-hidden bg-neutral-200 shadow-md">
        {profile.avatarUrl && (
          <img
            className="w-full h-full object-cover"
            alt={`Avatar de ${profile.fullName ?? ""}`}
            src={profile.avatarUrl}
            fetchPriority="high"
            decoding="async"
          />
        )}
      </div>

      {profile.fullName && (
        <h1 className="font-bold text-neutral-950 text-xl text-center leading-normal px-4 [font-family:'Space_Grotesk',sans-serif]">
          {profile.fullName}
        </h1>
      )}

      {(profile.company || profile.profession) && (
        <p className="text-neutral-950 text-xs text-center italic leading-normal px-4 [font-family:'Georgia',serif]">
          {[profile.company, profile.profession].filter(Boolean).join(" | ")}
        </p>
      )}

      {contactActions.length > 0 && (
        <div className="flex items-center justify-center gap-[15px] mt-3 flex-wrap px-4">
          {contactActions.map(({ id, entries, href, icon: Icon, label }) =>
            entries?.length > 1 ? (
              <ContactPopover
                key={id}
                icon={Icon}
                label={label}
                entries={entries}
                prefix={id === "phone" ? "tel:" : "mailto:"}
              />
            ) : (
              <a
                key={id}
                href={href}
                aria-label={label}
                className="w-[45px] h-[45px] shrink-0 rounded-full bg-[#f4f5f7] flex items-center justify-center shadow-[inset_1px_1px_3px_rgba(255,255,255,0.8),-1px_-1px_6px_rgba(0,0,0,0.08)] active:scale-95 transition-transform"
              >
                <Icon className="w-5 h-5 text-neutral-950" />
              </a>
            )
          )}
        </div>
      )}

      <hr className="w-[85%] max-w-[285px] border-0 border-t border-neutral-950/10 mt-3" />

      <button
        type="button"
        onClick={handleSaveContact}
        aria-pressed={isSaved}
        className="mt-1 w-[175px] max-w-[80%] h-[37px] flex items-center justify-center gap-2 bg-neutral-950 rounded-[15px] active:bg-neutral-800 transition-colors"
      >
        <UserRoundPlus className="w-4 h-4 text-[#f4f5f7] shrink-0" />
        <span className="text-[#f4f5f7] text-xs font-medium leading-none whitespace-nowrap">
          {isSaved ? "Contact enregistré" : "Enregistrer le contact"}
        </span>
      </button>

      <span className="sr-only" aria-live="polite">
        {isSaved ? "Le contact a été enregistré." : ""}
      </span>
    </article>
  );
}
