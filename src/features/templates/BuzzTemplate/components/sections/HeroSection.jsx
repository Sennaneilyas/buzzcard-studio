import { useMemo } from "react";
import { UserRoundPlus, Phone, Mail, Link } from "lucide-react";
import { GLASS_SHADOW } from "../../utils/constants";
import { useSaveContact } from "../../hooks/useSaveContact";
import ContactPopover from "../ui/ContactPopover";
import EditableText from "@/components/ui/EditableText";
import EditableImage from "@/components/ui/EditableImage";
import { useEditorStore } from "@/features/editor/store/useEditorStore";
import { PROFILE_MEDIA_CATEGORIES } from "@/features/editor/media/profileMedia";
import PreviewEditRegion from "@/features/editor/contextual/PreviewEditRegion";
import { validHttpUrl } from "@/features/templates/shared/profileActions";

/**
 * Identity card: avatar, name, company/profession, contact quick-actions
 * (call / email / website), and the "Enregistrer le contact" vCard button.
 */
export default function HeroSection({
  profile,
  isEditMode,
  lockProfileIdentity = false,
  contextualEditing = false,
  activeEditTarget,
  onEditTargetSelect,
}) {
  const { phones, emails, isSaved, handleSaveContact } = useSaveContact(profile);
  const setProfileData = useEditorStore((s) => s.setProfileData);
  const inlineEditing = isEditMode && !contextualEditing;

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
        validHttpUrl(profile.website) && {
          id: "website",
          entries: null,
          href: validHttpUrl(profile.website),
          icon: Link,
          label: "Site web",
        },
      ].filter(Boolean),
    [phones, emails, profile.website]
  );

  return (
    <article
      className={`relative z-50 w-full rounded-[25px] bg-[#f4f5f790] backdrop-blur-md ${GLASS_SHADOW} -mt-[39px] pt-[52px] pb-[18px] flex flex-col items-center gap-[6px]`}
    >
      <PreviewEditRegion
        targetId="identity"
        label="Avatar"
        isEditMode={contextualEditing && !lockProfileIdentity}
        isActive={activeEditTarget === "identity"}
        onSelect={onEditTargetSelect}
        className="absolute -top-[44px] left-1/2 -translate-x-1/2 w-[90px] h-[90px] rounded-full ring-2 ring-white/80 overflow-hidden bg-neutral-200 shadow-md"
      >
        <EditableImage
          src={profile.avatarUrl || profile.avatar_url || ""}
          alt={`Avatar de ${profile.fullName ?? ""}`}
          isEditMode={inlineEditing && !lockProfileIdentity}
          category={PROFILE_MEDIA_CATEGORIES.AVATAR}
          onChange={(val) => setProfileData({ avatarUrl: val })}
          className="w-full h-full object-cover"
        />
      </PreviewEditRegion>

      <PreviewEditRegion
        targetId="identity"
        label="Name"
        isEditMode={contextualEditing && !lockProfileIdentity}
        isActive={activeEditTarget === "identity"}
        onSelect={onEditTargetSelect}
        className="w-full"
      >
        <EditableText
          as="h1"
          value={profile.full_name || profile.fullName || ""}
          onChange={(val) => setProfileData({ name: val })}
          isEditMode={inlineEditing && !lockProfileIdentity}
          placeholder="Your Name"
          className="font-bold text-neutral-950 text-xl text-center leading-normal px-4 [font-family:'Space_Grotesk',sans-serif]"
        />
      </PreviewEditRegion>

      <PreviewEditRegion
        targetId="identity"
        label="Profession"
        isEditMode={contextualEditing}
        isActive={activeEditTarget === "identity"}
        onSelect={onEditTargetSelect}
        className="w-full"
      >
        <EditableText
          as="p"
          value={profile.role || profile.profession || profile.company || ""}
          onChange={(val) => setProfileData({ role: val })}
          isEditMode={inlineEditing}
          placeholder="Profession & Company"
          className="text-neutral-950 text-xs text-center italic leading-normal px-4 [font-family:'Georgia',serif]"
        />
      </PreviewEditRegion>

      {(contactActions.length > 0 || contextualEditing) && (
        <PreviewEditRegion
          targetId="contact"
          label="Contact"
          isEditMode={contextualEditing}
          isActive={activeEditTarget === "contact"}
          onSelect={onEditTargetSelect}
          className="mt-3 min-h-[45px] min-w-[160px]"
        >
          <div className="flex items-center justify-center gap-[15px] flex-wrap px-4">
            {contactActions.length > 0 ? contactActions.map(({ id, entries, href, icon: Icon, label }) =>
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
                  href={isEditMode ? undefined : href}
                  aria-label={label}
                  onClick={(e) => { if (isEditMode) e.preventDefault(); }}
                  className="w-[45px] h-[45px] shrink-0 rounded-full bg-[#f4f5f7] flex items-center justify-center shadow-[inset_1px_1px_3px_rgba(255,255,255,0.8),-1px_-1px_6px_rgba(0,0,0,0.08)] active:scale-95 transition-transform"
                >
                  <Icon className="w-5 h-5 text-neutral-950" />
                </a>
              )
            ) : (
              <span className="flex min-h-[45px] items-center text-xs font-semibold text-neutral-500">
                Add contact actions
              </span>
            )}
          </div>
        </PreviewEditRegion>
      )}

      <hr className="w-[85%] max-w-[285px] border-0 border-t border-neutral-950/10 mt-3" />

      <button
        type="button"
        onClick={(e) => {
          if (isEditMode) {
            e.preventDefault();
            return;
          }
          handleSaveContact(e);
        }}
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
