import { useMemo } from "react";
import { useParams } from "react-router-dom";
import HairdresserTemplate from "@/features/templates/hairdresser-template/HairdresserTemplate";

const DEFAULT_PROFILE = {
    coverImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    quote: "Style that feels like you.",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80",
    fullName: "Lara Miller",
    company: "New Salon",
    profession: "Senior Hairdresser",
    phones: ["+1 (212) 555-0147"],
    emails: ["jenny.wilson@mail.com"],
    website: "https://buzzcard.ma",
    description: "Passionate about modern cuts, color, and healthy hair styling for every occasion.",
};

export default function PublicProfileRoute() {
    const { slug } = useParams();

    const profile = useMemo(() => ({
        ...DEFAULT_PROFILE,
        fullName: DEFAULT_PROFILE.fullName,
        company: DEFAULT_PROFILE.company,
        profession: DEFAULT_PROFILE.profession,
        quote: slug ? `${DEFAULT_PROFILE.quote} • ${slug}` : DEFAULT_PROFILE.quote,
    }), [slug]);

    return (
        <HairdresserTemplate
            profile={profile}
            socials={[
                { platform: "Instagram", href: "https://instagram.com/" },
                { platform: "WhatsApp", href: "https://wa.me/12125550147" },
                { platform: "TikTok", href: "https://tiktok.com/" },
            ]}
            gallery={[
                "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80",
                "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
                "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80",
                "https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=900&q=80",
            ]}
        />
    );
}
