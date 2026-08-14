import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UserRoundPlus, QrCode, MessageSquare, Phone, Mail, Link } from "lucide-react";
import { ZoomableImage } from "@/components/ui/ZoomableImage";

const GLASS_SHADOW =
  "shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]";

const GLASS_BORDER =
  "before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-[25px] before:p-px before:content-[''] before:[background:conic-gradient(from_90deg_at_100%_100%,rgba(255,255,255,0.5)_12%,rgba(255,255,255,0)_37%,rgba(255,255,255,0.5)_62%,rgba(255,255,255,0)_87%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude]";

const SOCIAL_ICONS = {
  instagram:   "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/4c/be/de/4cbedeca-02d7-e15c-9e14-b0ac165eeb5a/Prod-0-0-1x_U007epad-0-1-0-sRGB-85-220.png/512x512bb.jpg",
  linkedin:    "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/2e/f7/92/2ef792b1-f553-5433-7d55-1a15cb9e049c/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg",
  whatsapp:    "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/c1/f2/a8/c1f2a8b3-56af-7837-3369-ada0ca0fe760/AppIcon-0-0-1x_U007epad-0-0-0-1-0-0-sRGB-0-85-220.png/512x512bb.jpg",
  x:           "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/bf/46/c4/bf46c48e-94bb-c30d-601f-d73ed5a70689/ProductionAppIcon-0-0-1x_U007emarketing-0-8-0-0-0-85-220.png/512x512bb.jpg",
  discord:     "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/e6/c8/52/e6c852f4-8c99-a0ab-b3cf-b4b5299afe01/AppIcon-0-0-1x_U007epad-0-1-0-85-220.png/512x512bb.jpg",
  tripadvisor: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/b5/96/f0/b596f079-3f6c-48cc-de09-2f004a3302bb/AppIcon-0-0-1x_U007epad-0-1-sRGB-85-220.png/512x512bb.jpg",
  facebook:    "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/7f/72/b7/7f72b76a-5865-3da5-8dc3-71a2b75551e9/Icon-Production-0-0-1x_U007epad-0-1-0-sRGB-85-220.png/512x512bb.jpg",
  tiktok:      "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/50/70/42/50704260-89c4-2aa4-7740-4a6a621af5db/TikTok_AppIcon26-0-0-1x_U007epad-0-1-0-85-220.png/512x512bb.jpg",
  youtube:     "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/8e/43/35/8e43350e-2dad-ac27-13d4-71eac741cf80/logo_youtube_2024_q4_color-0-0-1x_U007emarketing-0-0-0-7-0-0-0-85-220.png/512x512bb.jpg",
};

export default function BuzzTemplate({
  profile = {},
  socials = [],
  gallery = [],
  onSave,
  onQrCode,
  onReview,
}) {
  return (
    <div className="relative w-full max-w-[390px] mx-auto h-[100dvh] overflow-hidden bg-[#f4f5f7] flex flex-col">
      <img src="/Vector 1.svg" alt="" className="absolute left-0 top-[94px] w-[390px] h-[750px] opacity-50 pointer-events-none z-0" />
      <img src="/Vector 2.svg" alt="" className="absolute left-[114px] bottom-0 w-[276px] h-[129px] opacity-50 pointer-events-none z-0" />

      <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col gap-4 pb-6">
          <ProfileHeader coverImage={profile.coverImage} quote={profile.quote} />
          <div className="flex flex-col gap-4 px-[25px]">
            <HeroSection profile={profile} />
            <SocialLinksSection socials={socials} />
            <GallerySection gallery={gallery} />
            <DescriptionSection description={profile.description} />
          </div>
        </div>
      </div>

      <BottomNav onSave={onSave} onQrCode={onQrCode} onReview={onReview} />
    </div>
  );
}

function ProfileHeader({ coverImage, quote }) {
  return (
    <header
      className="w-full h-[220px] shrink-0 bg-cover bg-center rounded-b-[40px] overflow-hidden"
      style={{ backgroundImage: coverImage ? `url(${coverImage})` : "none" }}
      aria-label="Profile header"
    >
      {quote && (
        <div className={`absolute top-0 inset-x-0 h-[47px] bg-[#ffffff11] backdrop-blur-[7.58px] ${GLASS_SHADOW} flex items-center justify-center px-6 rounded-b-[25px]`}>
          <p className="text-[#0A0A0A] text-sm font-bold italic text-center leading-normal font-serif truncate">
            &ldquo;{quote}&rdquo;
          </p>
        </div>
      )}
    </header>
  );
}

function HeroSection({ profile }) {
  const [isSaved, setIsSaved] = useState(false);

  const phones = useMemo(() => profile.phones?.filter(Boolean) ?? [], [profile.phones]);
  const emails = useMemo(() => profile.emails?.filter(Boolean) ?? [], [profile.emails]);

  const handleSaveContact = useCallback(() => {
    const { fullName, company, profession, website, avatarUrl } = profile;
    const vcard = [
      "BEGIN:VCARD", "VERSION:3.0",
      `FN:${fullName ?? ""}`, `ORG:${company ?? ""}`, `TITLE:${profession ?? ""}`,
      ...phones.map((p) => `TEL:${p}`),
      ...emails.map((e) => `EMAIL:${e}`),
      website   ? `URL:${website}`               : "",
      avatarUrl ? `PHOTO;VALUE=URI:${avatarUrl}` : "",
      "END:VCARD",
    ].filter(Boolean).join("\n");

    const blob = new Blob([vcard], { type: "text/vcard" });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement("a"), { href: url, download: `${fullName ?? "contact"}.vcf` });
    a.click();
    URL.revokeObjectURL(url);
    setIsSaved(true);
  }, [profile, phones, emails]);

  const contactActions = useMemo(() => [
    phones.length > 0 && { id: "phone",   entries: phones, href: `tel:${phones[0]}`,    icon: Phone, label: `Appeler ${profile.fullName ?? ""}` },
    emails.length > 0 && { id: "email",   entries: emails, href: `mailto:${emails[0]}`, icon: Mail,  label: `Email ${profile.fullName ?? ""}` },
    profile.website   && { id: "website", entries: null,   href: profile.website,        icon: Link,  label: `Site de ${profile.fullName ?? ""}` },
  ].filter(Boolean), [phones, emails, profile.website, profile.fullName]);

  return (
    <article
      className={`relative z-50 w-full rounded-[25px] bg-[#f4f5f790] backdrop-blur-[7.58px] ${GLASS_SHADOW} -mt-[39px] pt-[47px] pb-[18px] flex flex-col items-center gap-[6px]`}
      aria-label="Carte de contact"
    >
      <div className="absolute -top-[39px] left-1/2 -translate-x-1/2 w-[78px] h-[78px] rounded-full ring-2 ring-white/80 overflow-hidden bg-neutral-200 shadow-[0_4px_16px_rgba(0,0,0,0.20),0_1px_4px_rgba(0,0,0,0.10)]">
        {profile.avatarUrl && (
          <img className="w-full h-full object-cover" alt={profile.fullName ?? "Avatar"} src={profile.avatarUrl} />
        )}
      </div>

      {profile.fullName && (
        <h1 className="font-bold text-neutral-950 text-xl text-center leading-normal [font-family:'Space_Grotesk',sans-serif]">
          {profile.fullName}
        </h1>
      )}

      {(profile.company || profile.profession) && (
        <p className="text-neutral-950 text-xs text-center italic leading-normal [font-family:'Georgia',serif]">
          {[profile.company, profile.profession].filter(Boolean).join(" | ")}
        </p>
      )}

      {contactActions.length > 0 && (
        <div className="flex items-center justify-center gap-[15px] mt-3">
          {contactActions.map(({ id, entries, href, icon: Icon, label }) =>
            entries?.length > 1 ? (
              <ContactPopover key={id} icon={Icon} label={label} entries={entries} prefix={id === "phone" ? "tel:" : "mailto:"} />
            ) : (
              <a key={id} href={href} aria-label={label}
                className="w-[45px] h-[45px] rounded-full bg-[#f4f5f7] flex items-center justify-center shadow-[inset_1px_1px_3px_rgba(255,255,255,0.8),-1px_-1px_6px_rgba(0,0,0,0.08)] hover:scale-105 transition-transform">
                <Icon className="w-5 h-5 text-neutral-950" />
              </a>
            )
          )}
        </div>
      )}

      <hr className="w-[285px] border-0 border-t border-neutral-950/10 mt-3" />

      <button
        type="button"
        onClick={handleSaveContact}
        aria-pressed={isSaved}
        className="mt-1 w-[175px] h-[37px] flex items-center justify-center gap-2 bg-neutral-950 rounded-[15px] hover:bg-neutral-800 transition-colors"
      >
        <UserRoundPlus className="w-4 h-4 text-[#f4f5f7] shrink-0" />
        <span className="text-[#f4f5f7] text-xs font-medium leading-none">
          {isSaved ? "Contact enregistré" : "Enregistrer le contact"}
        </span>
      </button>

      <span className="sr-only" aria-live="polite">{isSaved ? "Le contact a été enregistré." : ""}</span>
    </article>
  );
}

function ContactPopover({ icon: Icon, label, entries, prefix }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative z-50">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
        className="w-[45px] h-[45px] rounded-full bg-[#f4f5f7] flex items-center justify-center shadow-[inset_1px_1px_3px_rgba(255,255,255,0.8),-1px_-1px_6px_rgba(0,0,0,0.08)] hover:scale-105 transition-transform"
      >
        <Icon className="w-5 h-5 text-neutral-950" />
      </button>

      {open && (
        <ul role="listbox" className="absolute top-[54px] left-1/2 -translate-x-1/2 z-50 min-w-[160px] rounded-[16px] overflow-hidden bg-[#f4f5f7cc] backdrop-blur-[12px] shadow-[-2px_-2px_12px_-4px_rgba(0,0,0,0.12),0_8px_32px_-8px_rgba(0,0,0,0.15)] list-none m-0 p-0">
          {entries.map((entry, i) => (
            <li key={i} role="option" aria-selected={false}>
              <a href={`${prefix}${entry}`}
                className="flex items-center gap-3 px-4 py-3 text-xs font-medium text-neutral-950 hover:bg-white/40 transition-colors border-b border-neutral-950/5 last:border-0">
                <Icon className="w-4 h-4 text-neutral-950/60 shrink-0" />
                {entry}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SocialLinksSection({ socials }) {
  if (!socials?.length) return null;

  return (
    <nav
      className={`relative z-0 w-full rounded-[25px] bg-[#ffffff90] backdrop-blur-[7.58px] ${GLASS_SHADOW} ${GLASS_BORDER} px-[14px] py-[16px]`}
      aria-label="Social media links"
    >
      <ul className="relative z-[2] grid grid-cols-3 gap-y-[18px] list-none m-0 p-0">
        {socials.slice(0, 6).map((social) => {
          const icon = SOCIAL_ICONS[social.platform?.toLowerCase()];
          return (
            <li key={social.platform} className="flex justify-center">
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${social.platform}`}
                className="flex flex-col items-center gap-[9px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
              >
                <div className="w-[65px] h-[65px] rounded-[14px] overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.15),0_1px_3px_rgba(0,0,0,0.10)]">
                  {icon ? (
                    <img src={icon} alt={social.platform} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
                      <Link className="w-6 h-6 text-neutral-500" />
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-medium text-neutral-950 text-center leading-none">
                  {social.platform}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function GallerySection({ gallery }) {
  const images = useMemo(() => gallery?.slice(0, 5) ?? [], [gallery]);
  const [active, setActive] = useState(0);

  const handleNext = useCallback(() => setActive((p) => (p + 1) % images.length), [images.length]);
  const handlePrev = useCallback(() => setActive((p) => (p - 1 + images.length) % images.length), [images.length]);

  const handleDragEnd = useCallback((e, { offset }) => {
    if (offset.x < -50) handleNext();
    else if (offset.x > 50) handlePrev();
  }, [handleNext, handlePrev]);

  if (!images.length) return null;

  return (
    <section className="relative w-full h-[220px]" aria-label="Galerie">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[180px] h-[190px]">
          <AnimatePresence>
            {images.map((src, index) => (
              <motion.div
                key={src}
                className={`absolute inset-0 origin-bottom ${index === active ? "cursor-grab active:cursor-grabbing" : ""}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: index === active ? 1 : 0.55,
                  scale:   index === active ? 1 : 0.93,
                  rotate:  index === active ? 0 : (index % 2 === 0 ? 5 : -5),
                  zIndex:  index === active ? 10 : images.length - index,
                  y:       index === active ? [0, -8, 0] : 0,
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                drag={index === active ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.8}
                onDragEnd={handleDragEnd}
              >
                <ZoomableImage
                  src={src}
                  alt={`Galerie ${index + 1}`}
                  className="w-full h-full"
                  imageClassName="rounded-[18px] select-none"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <GalleryArrow direction="prev" onClick={handlePrev} />
      <GalleryArrow direction="next" onClick={handleNext} />

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-[5px] z-20">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Image ${i + 1}`}
            aria-current={i === active ? "true" : undefined}
            className={`w-[6px] h-[6px] rounded-full transition-colors ${i === active ? "bg-neutral-950" : "bg-neutral-950/30"}`}
          />
        ))}
      </div>
    </section>
  );
}

function GalleryArrow({ direction, onClick }) {
  const isPrev = direction === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? "Image précédente" : "Image suivante"}
      className={`absolute top-1/2 -translate-y-1/2 ${isPrev ? "left-[10px]" : "right-[10px]"} z-20 w-[30px] h-[30px] rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center hover:bg-white/80 transition-colors`}
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d={isPrev ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function DescriptionSection({ description }) {
  if (!description) return null;

  return (
    <section
      className={`relative w-full rounded-[25px] bg-[#ffffff90] backdrop-blur-[7.58px] ${GLASS_SHADOW} ${GLASS_BORDER} px-[18px] pt-[14px] pb-[18px]`}
      aria-labelledby="description-title"
    >
      <h2 id="description-title" className="relative z-[2] font-bold italic text-neutral-950 text-base text-center leading-normal mb-[10px] [font-family:'Georgia',serif]">
        -- Description --
      </h2>
      <p className="relative z-[2] text-neutral-950 text-sm leading-5">{description}</p>
    </section>
  );
}

function BottomNav({ onSave, onQrCode, onReview }) {
  const [srMessage, setSrMessage] = useState("");
  const [activeTab, setActiveTab] = useState("qrcode");

  const handleSave = useCallback(async () => {
    setActiveTab("enregistrer");
    if (onSave) { onSave(); return; }
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url: window.location.href });
        setSrMessage("Partagé");
      } else {
        await navigator.clipboard?.writeText(window.location.href);
        setSrMessage("Lien copié");
      }
    } catch (err) {
      if (err?.name !== "AbortError") setSrMessage("Action indisponible");
    }
  }, [onSave]);

  const items = useMemo(() => [
    { id: "enregistrer", label: "Enregistrer", icon: UserRoundPlus, action: handleSave },
    { id: "qrcode", label: "QR Code", icon: QrCode, action: () => { setActiveTab("qrcode"); if (onQrCode) onQrCode(); } },
    { id: "avis", label: "Avis", icon: MessageSquare, action: () => { setActiveTab("avis"); if (onReview) onReview(); } },
  ], [handleSave, onReview, onQrCode]);

  return (
    <nav className="relative z-20 w-full shrink-0" style={{ paddingBottom: "env(safe-area-inset-bottom)" }} aria-label="Navigation principale">
      <div className={`absolute inset-x-0 bottom-0 h-[82px] bg-white/40 rounded-t-[25px] backdrop-blur-[7.58px] ${GLASS_SHADOW}`} aria-hidden="true" />

      <div className="relative h-[82px] w-full max-w-[340px] mx-auto flex items-center justify-between px-4">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          const isSpecial = item.id === "qrcode";
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              type="button"
              onClick={item.action}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex items-center justify-center transition-all duration-300 ease-out z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 active:scale-95 ${
                isSpecial
                  ? "bg-neutral-950 text-white rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.15)] h-[54px]"
<<<<<<< HEAD
                  : "h-[50px] rounded-full"
=======
                  : "h-[50px] rounded-full hover:bg-white/20"
>>>>>>> 8743f68655d8b6d84c0a7c924358bca06cf308e7
              } ${isActive ? "px-5" : (isSpecial ? "w-[54px]" : "w-[50px]")}`}
            >
              {isActive && !isSpecial && (
                <motion.div
                  layoutId="active-tab-bg"
                  className="absolute inset-0 rounded-full bg-white/60 shadow-[inset_1px_1px_4px_rgba(255,255,255,0.4),0_2px_8px_rgba(0,0,0,0.05)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <div className="relative z-10 flex items-center">
                <Icon className={`w-[22px] h-[22px] transition-colors duration-300 shrink-0 ${
                  isSpecial ? "text-white" : (isActive ? "text-neutral-950" : "text-neutral-950/70")
                }`} />
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "auto", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      <span className={`block pl-2 text-[13px] font-semibold ${
                        isSpecial ? "text-white" : "text-neutral-950"
                      }`}>
                        {item.label}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </button>
          );
        })}
      </div>

      <span className="sr-only" aria-live="polite">{srMessage}</span>
    </nav>
  );
}
