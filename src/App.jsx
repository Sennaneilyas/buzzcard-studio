import { Routes, Route } from "react-router-dom";
import { LandingPage } from "@/features/marketing";
import ProductsPage from "@/features/products/ProductsPage";
import { AuthForm, ProtectedRoute } from "@/features/auth";
import { OnboardingPage } from "@/features/onboarding";
import BuzzTemplate from "@/features/templates/BuzzTemplate/BuzzTemplate";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthForm />} />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        }
      />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:category" element={<ProductsPage />} />
      <Route
        path="/template"
        element={
          <BuzzTemplate
            profile={{
              coverImage: "https://api.dicebear.com/10.x/waves/svg?seed=Felix",
              quote: "Your network is your net worth.",
              avatarUrl:
                "https://api.dicebear.com/10.x/lorelei-neutral/svg?seed=Ayoub",
              fullName: "Ayoub El Bouz",
              company: "BuzzCard",
              profession: "Business Development Manager",
              phones: ["+212600000000", "+212611111111", "+212622222222"],
              emails: ["ayoub@buzzcard.ma", "ayoub.pro@gmail.com"],
              website: "https://buzzcard.ma",
              description: "Business Development Manager passionné par la création de partenariats stratégiques et le développement de nouvelles opportunités d'affaires. J'accompagne les entreprises dans leur croissance en mettant l'accent sur l'innovation, la négociation et la satisfaction client.",
            }}
            socials={[
              { platform: "Instagram",   href: "https://instagram.com/" },
              { platform: "WhatsApp",    href: "https://whatsapp.com/" },
              { platform: "Discord",     href: "https://discord.com/" },
              { platform: "LinkedIn",    href: "https://linkedin.com/" },
              { platform: "X",           href: "https://x.com/" },
              { platform: "TripAdvisor", href: "https://tripadvisor.com/" },
            ]}
            gallery={[
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?w=500&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1636041293178-808a6762ab39?w=500&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?w=500&auto=format&fit=crop",
            ]}
          />
        }
      />
    </Routes>
  );
}

export default App;
