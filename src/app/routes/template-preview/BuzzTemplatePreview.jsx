import BuzzTemplate from "@/features/templates/BuzzTemplate/BuzzTemplate";

const profile = {
  coverImage:
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=85&w=1200&h=500",
  quote: "Clarity creates momentum.",
  avatarUrl:
    "https://images.unsplash.com/photo-1569779213435-ba3167dde7cc?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  fullName: "Yassine Amrani",
  profession: "Founder & Growth Strategist · Atlas Growth Studio",
  phones: ["06 64 28 91 40", "06 46 82 19 04"],
  emails: ["yassine@atlasgrowth.studio", "atlasgrowth@gmail.com"],
  website: "https://atlasgrowth.studio",
  description:
    "I help ambitious Moroccan brands turn clear positioning, strategic partnerships, and digital experiences into sustainable growth.",
};

const socials = [
  { platform: "Instagram", href: "https://instagram.com/atlasgrowth.studio" },
  { platform: "WhatsApp", href: "https://wa.me/212664289140" },
  { platform: "LinkedIn", href: "https://linkedin.com/in/yassine-amrani" },
  { platform: "X", href: "https://x.com/atlasgrowth" },
  { platform: "YouTube", href: "https://youtube.com/@atlasgrowth" },
  { platform: "Behance", href: "https://behance.net/atlasgrowth" },
];

const gallery = [
  "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=85&w=1000",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=85&w=1000",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=85&w=1000",
];

export default function BuzzTemplatePreview() {
  return <BuzzTemplate profile={profile} socials={socials} gallery={gallery} />;
}
