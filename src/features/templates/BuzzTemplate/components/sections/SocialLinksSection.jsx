import { Link } from "lucide-react";
import { GLASS_SHADOW, GLASS_BORDER, SOCIAL_ICONS } from "../../utils/constants";

/**
 * Grid of up to 6 social platform links, each with its app icon.
 */
export default function SocialLinksSection({ socials }) {
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
