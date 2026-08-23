import React from "react";
import { Link as FallbackLink } from "lucide-react";
import { GLASS_SHADOW, GLASS_BORDER, SOCIAL_ICONS } from "../../utils/constants";

/**
 * Grid of up to 6 social platform links, each with its vector icon.
 */
function SocialLinksSection({ socials, isEditMode }) {
  if (!socials?.length) return null;

  return (
    <nav
      className={`relative z-0 w-full rounded-[25px] bg-[#ffffff90] backdrop-blur-md ${GLASS_SHADOW} ${GLASS_BORDER} px-[14px] py-[16px]`}
      aria-label="Liens sociaux"
    >
      <ul className="relative z-[2] flex flex-wrap justify-center gap-y-[18px] gap-x-[4%] list-none m-0 p-0">
        {socials.slice(0, 6).map((social) => {
          const config = SOCIAL_ICONS[social.platform?.toLowerCase()];
          const Icon = config?.icon || FallbackLink;
          const iconColor = config?.color || "#111827";
          const iconBg = config?.bg || "#f4f5f7";

          return (
            <li key={social.platform} className="flex justify-center w-[28%] max-w-[100px]">
              <a
                href={isEditMode ? undefined : social.href}
                target={isEditMode ? undefined : "_blank"}
                rel="noreferrer"
                aria-label={`Ouvrir ${social.platform}`}
                onClick={(e) => { if (isEditMode) e.preventDefault(); }}
                className="flex flex-col items-center gap-[9px] outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 rounded-lg p-1 active:scale-95 transition-transform group"
              >
                <div
                  className="w-[17vw] h-[17vw] max-w-[65px] max-h-[65px] min-w-[52px] min-h-[52px] rounded-[16px] shadow-sm flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-md border border-black/5"
                  style={{ backgroundColor: iconBg }}
                >
                  <Icon
                    className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300"
                    style={{ color: iconColor }}
                  />
                </div>

                <span className="text-[10px] font-semibold text-neutral-900 text-center leading-none">
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

export default React.memo(SocialLinksSection);
