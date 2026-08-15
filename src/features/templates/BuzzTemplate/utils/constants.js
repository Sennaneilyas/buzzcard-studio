// Shared design tokens for the Buzz template.
// Previously duplicated verbatim inside BuzzTemplate.jsx and ReviewComponents.jsx —
// centralized here so both stay in sync.

export const GLASS_SHADOW =
  "shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),_0px_12px_12px_-6px_rgba(0,0,0,0.06),_0px_24px_24px_-12px_rgba(0,0,0,0.06)]";

export const GLASS_BORDER =
  "before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:rounded-[25px] before:p-px before:content-[''] before:[background:conic-gradient(from_90deg_at_100%_100%,rgba(255,255,255,0.5)_12%,rgba(255,255,255,0)_37%,rgba(255,255,255,0.5)_62%,rgba(255,255,255,0)_87%)] before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[-webkit-mask-composite:xor] before:[mask-composite:exclude]";

export const SOCIAL_ICONS = {
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
