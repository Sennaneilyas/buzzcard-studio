import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  UserRoundPlus,
  QrCode,
  MessageSquare,
  Phone,
  Mail,
  Link,
} from "lucide-react";

import { ZoomableImage } from "@/components/ui/ZoomableImage";
import BuzzCardQRCode from "@/features/marketing/components/BuzzCardQRCode";

const GLASS_SHADOW =
  "shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]";

const GLASS_BORDER =
  "before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-[25px] before:p-px before:content-[''] before:[background:conic-gradient(from_90deg_at_100%_100%,rgba(255,255,255,0.5)_12%,rgba(255,255,255,0)_37%,rgba(255,255,255,0.5)_62%,rgba(255,255,255,0)_87%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude]";

const SOCIAL_ICONS = {
  instagram:
    "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/4c/be/de/4cbedeca-02d7-e15c-9e14-b0ac165eeb5a/Prod-0-0-1x_U007epad-0-1-0-sRGB-85-220.png/512x512bb.jpg",
  linkedin:
    "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/2e/f7/92/2ef792b1-f553-5433-7d55-1a15cb9e049c/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg",
  whatsapp:
    "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/c1/f2/a8/c1f2a8b3-56af-7837-3369-ada0ca0fe760/AppIcon-0-0-1x_U007epad-0-0-0-1-0-0-sRGB-0-85-220.png/512x512bb.jpg",
  x: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/bf/46/c4/bf46c48e-94bb-c30d-601f-d73ed5a70689/ProductionAppIcon-0-0-1x_U007emarketing-0-8-0-0-0-85-220.png/512x512bb.jpg",
  discord:
    "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/e6/c8/52/e6c852f4-8c99-a0ab-b3cf-b4b5299afe01/AppIcon-0-0-1x_U007epad-0-1-0-85-220.png/512x512bb.jpg",
  tripadvisor:
    "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/b5/96/f0/b596f079-3f6c-48cc-de09-2f004a3302bb/AppIcon-0-0-1x_U007epad-0-1-sRGB-85-220.png/512x512bb.jpg",
  facebook:
    "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/7f/72/b7/b7a5865-3da5-8dc3-71a2b75551e9/Icon-Production-0-0-1x_U007epad-0-1-0-sRGB-85-220.png/512x512bb.jpg",
  tiktok:
    "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/50/70/42/50704260-89c4-2aa4-7740-4a6a621af5db/TikTok_AppIcon26-0-0-1x_U007epad-0-1-0-85-220.png/512x512bb.jpg",
  youtube:
    "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/8e/43/35/e43350e2-2dad-ac27-13d4-71eac741cf80/logo_youtube_2024_q4_color-0-0-1x_U007emarketing-0-0-0-7-0-0-0-85-220.png/512x512bb.jpg",
};

export default function BuzzTemplate({
  profile = {},
  socials = [],
  gallery = [],
  onSave,
  onQrCode,
  onReview,
}) {
  const [showQrCode, setShowQrCode] = useState(false);
  const [activeTab, setActiveTab] = useState("qrcode");
  const shouldReduceMotion = useReducedMotion();

  const handleQrCode = useCallback(() => {
    setShowQrCode(true);
    setActiveTab("qrcode");
    if (onQrCode) onQrCode();
  }, [onQrCode]);

  const closeQrCode = useCallback(() => {
    setShowQrCode(false);
    setActiveTab(null);
  }, []);

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#f4f5f7] flex flex-col">
      <img
        src="/Vector 1.svg"
        alt=""
        fetchpriority="high"
        decoding="async"
        className="absolute left-0 top-[12%] w-full h-auto opacity-50 pointer-events-none z-0"
      />
      <img
        src="/Vector 2.svg"
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute left-[29%] bottom-0 w-[71%] h-auto opacity-50 pointer-events-none z-0"
      />

      <main className="relative z-10 flex-1 w-full mx-auto max-w-[430px] overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col gap-4 pb-6">
          <ProfileHeader
            coverImage={profile.coverImage}
            quote={profile.quote}
          />

          <div className="flex flex-col gap-4 px-5 sm:px-6">
            <HeroSection profile={profile} />
            <SocialLinksSection socials={socials} />
            <GallerySection
              gallery={gallery}
              shouldReduceMotion={shouldReduceMotion}
            />
            <DescriptionSection description={profile.description} />
          </div>
        </div>
      </main>

      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSave={onSave}
        onQrCode={handleQrCode}
        onReview={onReview}
        shouldReduceMotion={shouldReduceMotion}
      />

      <AnimatePresence>
        {showQrCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="fixed inset-0 z-[60]"
          >
            <BuzzCardQRCode profile={profile} onClose={closeQrCode} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProfileHeader({ coverImage, quote }) {
  return (
    <header
      className="relative w-full h-[26vh] min-h-[170px] max-h-[260px] shrink-0 bg-cover bg-center rounded-b-[40px] overflow-hidden bg-neutral-200"
      style={{ backgroundImage: coverImage ? `url(${coverImage})` : "none" }}
      role="img"
      aria-label="Photo de couverture"
    >
      {quote && (
        <div
          className={`absolute top-0 inset-x-0 min-h-[47px] bg-white/10 backdrop-blur-md ${GLASS_SHADOW} flex items-center justify-center px-6 py-2 rounded-b-[25px]`}
        >
          <p className="text-[#0A0A0A] text-sm font-bold italic text-center leading-normal font-serif line-clamp-2">
            &ldquo;{quote}&rdquo;
          </p>
        </div>
      )}
    </header>
  );
}

function HeroSection({ profile }) {
  const [isSaved, setIsSaved] = useState(false);

  const phones = useMemo(
    () => profile.phones?.filter(Boolean) ?? [],
    [profile.phones],
  );
  const emails = useMemo(
    () => profile.emails?.filter(Boolean) ?? [],
    [profile.emails],
  );

  const handleSaveContact = useCallback(() => {
    const { fullName, company, profession, website, avatarUrl } = profile;

    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${fullName ?? ""}`,
      `ORG:${company ?? ""}`,
      `TITLE:${profession ?? ""}`,
      ...phones.map((p) => `TEL:${p}`),
      ...emails.map((e) => `EMAIL:${e}`),
      website ? `URL:${website}` : "",
      avatarUrl ? `PHOTO;VALUE=URI:${avatarUrl}` : "",
      "END:VCARD",
    ]
      .filter(Boolean)
      .join("\n");

    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${fullName?.replace(/\s+/g, "_") ?? "contact"}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Timeout prevents mobile browsers from aborting the download instantly
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setIsSaved(true);
  }, [profile, phones, emails]);

  const contactActions = useMemo(
    () =>
      [
        phones.length > 0 && {
          id: "phone",
          entries: phones,
          href: `tel:${phones[0]}`,
          icon: Phone,
          label: `Appeler`,
        },
        emails.length > 0 && {
          id: "email",
          entries: emails,
          href: `mailto:${emails[0]}`,
          icon: Mail,
          label: `Email`,
        },
        profile.website && {
          id: "website",
          entries: null,
          href: profile.website,
          icon: Link,
          label: `Site web`,
        },
      ].filter(Boolean),
    [phones, emails, profile.website],
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
            fetchpriority="high"
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
            ),
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

function ContactPopover({ icon: Icon, label, entries, prefix }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };

    document.addEventListener("mousedown", handler, { passive: true });
    document.addEventListener("touchstart", handler, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative z-50">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
        className="w-[45px] h-[45px] rounded-full bg-[#f4f5f7] flex items-center justify-center shadow-[inset_1px_1px_3px_rgba(255,255,255,0.8),-1px_-1px_6px_rgba(0,0,0,0.08)] active:scale-95 transition-transform"
      >
        <Icon className="w-5 h-5 text-neutral-950" />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute top-[54px] left-1/2 -translate-x-1/2 z-50 min-w-[160px] max-w-[80vw] rounded-[16px] overflow-hidden bg-[#f4f5f7cc] backdrop-blur-lg shadow-lg list-none m-0 p-0"
        >
          {entries.map((entry, i) => (
            <li key={i} role="option" aria-selected={false}>
              <a
                href={`${prefix}${entry}`}
                className="flex items-center gap-3 px-4 py-3 text-xs font-medium text-neutral-950 active:bg-white/40 transition-colors border-b border-neutral-950/5 last:border-0"
              >
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
      className={`relative z-0 w-full rounded-[25px] bg-[#ffffff90] backdrop-blur-md ${GLASS_SHADOW} ${GLASS_BORDER} px-[14px] py-[16px]`}
      aria-label="Liens sociaux"
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
                aria-label={`Ouvrir ${social.platform}`}
                className="flex flex-col items-center gap-[9px] outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 rounded-lg p-1 active:scale-95 transition-transform"
              >
                <div className="w-[17vw] h-[17vw] max-w-[65px] max-h-[65px] min-w-[52px] min-h-[52px] rounded-[14px] overflow-hidden shadow-sm bg-neutral-100 flex items-center justify-center">
                  {icon ? (
                    <img
                      src={icon}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      width={65}
                      height={65}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Link className="w-6 h-6 text-neutral-500" />
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

function GallerySection({ gallery, shouldReduceMotion }) {
  const images = useMemo(() => gallery?.slice(0, 5) ?? [], [gallery]);
  const [active, setActive] = useState(0);

  const handleNext = useCallback(
    () => setActive((p) => (p + 1) % images.length),
    [images.length],
  );
  const handlePrev = useCallback(
    () => setActive((p) => (p - 1 + images.length) % images.length),
    [images.length],
  );

  const handleDragEnd = useCallback(
    (e, { offset }) => {
      if (offset.x < -40) handleNext();
      else if (offset.x > 40) handlePrev();
    },
    [handleNext, handlePrev],
  );

  if (!images.length) return null;

  return (
    <section
      className="relative w-full h-[220px]"
      aria-label="Galerie de photos"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[46vw] h-[190px] max-w-[180px]">
          <AnimatePresence mode="popLayout">
            {images.map((src, index) => (
              <motion.div
                key={`${src}-${index}`}
                className={`absolute inset-0 origin-bottom will-change-transform ${index === active ? "cursor-grab active:cursor-grabbing z-10" : "z-0"}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: index === active ? 1 : 0.55,
                  scale: index === active ? 1 : 0.93,
                  rotate: shouldReduceMotion
                    ? 0
                    : index === active
                      ? 0
                      : index % 2 === 0
                        ? 3
                        : -3,
                  zIndex: index === active ? 10 : images.length - index,
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.3,
                  ease: "easeOut",
                }}
                drag={index === active ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={handleDragEnd}
              >
                <ZoomableImage
                  src={src}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full"
                  imageClassName="rounded-[18px] select-none bg-neutral-200"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <GalleryArrow direction="prev" onClick={handlePrev} />
      <GalleryArrow direction="next" onClick={handleNext} />

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-[6px] z-20">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Voir l'image ${i + 1}`}
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
      className={`absolute top-1/2 -translate-y-1/2 ${isPrev ? "left-[10px]" : "right-[10px]"} z-20 w-[30px] h-[30px] rounded-full bg-white/70 backdrop-blur-md flex items-center justify-center active:scale-90 transition-transform`}
    >
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4 text-neutral-800"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <path
          d={isPrev ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

function DescriptionSection({ description }) {
  if (!description) return null;

  return (
    <section
      className={`relative w-full rounded-[25px] bg-[#ffffff90] backdrop-blur-md ${GLASS_SHADOW} ${GLASS_BORDER} px-[18px] pt-[14px] pb-[18px]`}
      aria-labelledby="description-title"
    >
      <h2
        id="description-title"
        className="relative z-[2] font-bold italic text-neutral-950 text-base text-center leading-normal mb-[10px] [font-family:'Georgia',serif]"
      >
        -- Description --
      </h2>
      <p className="relative z-[2] text-neutral-950 text-sm leading-5">
        {description}
      </p>
    </section>
  );
}

function BottomNav({
  activeTab,
  setActiveTab,
  onSave,
  onQrCode,
  onReview,
  shouldReduceMotion,
}) {
  const [srMessage, setSrMessage] = useState("");

  const handleSave = useCallback(async () => {
    setActiveTab("enregistrer");
    if (onSave) {
      onSave();
      return;
    }
    try {
      if (navigator.share) {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
        setSrMessage("Lien partagé");
      } else {
        await navigator.clipboard?.writeText(window.location.href);
        setSrMessage("Lien copié dans le presse-papier");
      }
    } catch (err) {
      if (err?.name !== "AbortError") setSrMessage("Action indisponible");
    }
  }, [onSave, setActiveTab]);

  const items = useMemo(
    () => [
      {
        id: "enregistrer",
        label: "Enregistrer",
        icon: UserRoundPlus,
        action: handleSave,
      },
      {
        id: "qrcode",
        label: "QR Code",
        icon: QrCode,
        action: () => {
          setActiveTab("qrcode");
          if (onQrCode) onQrCode();
        },
      },
      {
        id: "avis",
        label: "Avis",
        icon: MessageSquare,
        action: () => {
          setActiveTab("avis");
          if (onReview) onReview();
        },
      },
    ],
    [handleSave, onReview, onQrCode, setActiveTab],
  );

  return (
    <nav
      className="relative z-20 w-full shrink-0"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Navigation principale"
    >
      <div
        className={`absolute inset-x-0 bottom-0 h-[82px] bg-white/50 rounded-t-[25px] backdrop-blur-lg ${GLASS_SHADOW}`}
        aria-hidden="true"
      />

      <div className="relative h-[82px] w-full max-w-[430px] mx-auto flex items-center justify-center gap-x-6 sm:gap-x-8 px-4">
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
              className={`relative flex items-center justify-center transition-all duration-300 ease-out z-10 outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 active:scale-95 ${
                isSpecial
                  ? "bg-neutral-950 text-white rounded-full shadow-md h-[54px]"
                  : "h-[50px] rounded-full active:bg-white/20"
              } ${isActive ? "px-5 w-auto" : isSpecial ? "w-[54px]" : "w-[50px]"}`}
            >
              {/* Only show the gray background slider for non-special buttons */}
              {isActive && !isSpecial && (
                <motion.div
                  layoutId="active-tab-bg"
                  className="absolute inset-0 rounded-full bg-white/70 shadow-sm"
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: shouldReduceMotion ? 0 : 0.4,
                  }}
                />
              )}

              <div className="relative z-10 flex items-center">
                <Icon
                  className={`w-[22px] h-[22px] transition-colors duration-200 shrink-0 ${
                    isSpecial
                      ? "text-white"
                      : isActive
                        ? "text-neutral-950"
                        : "text-neutral-950/70"
                  }`}
                />

                {/* Removed the !isSpecial restriction here so the QR code button can expand */}
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "auto", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : 0.25,
                        ease: "easeOut",
                      }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      <span
                        className={`block pl-2 text-[13px] font-semibold ${isSpecial ? "text-white" : "text-neutral-950"}`}
                      >
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
      <span className="sr-only" aria-live="polite">
        {srMessage}
      </span>
    </nav>
  );
}
