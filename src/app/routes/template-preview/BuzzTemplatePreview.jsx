import BuzzTemplate from "@/features/templates/BuzzTemplate/BuzzTemplate";

const profile = {
  coverImage: "https://api.dicebear.com/10.x/waves/svg?seed=Felix",
  quote: "Your network is your net worth.",
  avatarUrl: "https://api.dicebear.com/10.x/lorelei-neutral/svg?seed=Ayoub",
  fullName: "Ayoub El Bouz",
  company: "BuzzCard",
  profession: "Business Development Manager",
  phones: ["+212600000000", "+212600000000", "+212600000000"],
  emails: ["ayoub@buzzcard.ma", "ayoub@buzzcard.ma", "ayoub@buzzcard.ma"],
  website: "https://buzzcard.ma",
  description:
    "Business Development Manager passionate about strategic partnerships and growth.",
};

const socials = [
  { platform: "Instagram", href: "https://instagram.com/" },
  { platform: "WhatsApp", href: "https://whatsapp.com/" },
  { platform: "LinkedIn", href: "https://linkedin.com/" },
];

const gallery = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?w=1000&auto=format&fit=crop",
];

export default function BuzzTemplatePreview() {
  return <BuzzTemplate profile={profile} socials={socials} gallery={gallery} />;
}
