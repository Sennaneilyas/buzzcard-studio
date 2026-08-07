import { ContactDetailsSection } from "./sections/ContactDetailsSection/ContactDetailsSection";
import { HairServicesSection } from "./sections/HairServicesSection/HairServicesSection";
import { ProfileFooterSection } from "./sections/ProfileFooterSection/ProfileFooterSection";
import { StylistProfileHeroSection } from "./sections/StylistProfileHeroSection/StylistProfileHeroSection";
import { ToastProvider } from "./components/Toast/Toast";

const galleryImages = [
  "/img/image-gallery-1.png",
  "/img/image-gallery-2.png",
  "/img/image-gallery-3.png",
  "/img/image-gallery-4.png",
];

export const App = () => {
  return (
    <ToastProvider>
      <main className="relative flex min-h-screen items-center justify-center bg-[#f4efe8] px-2 py-4 sm:px-4">
        <article className="relative flex w-full max-w-[390px] flex-col overflow-hidden rounded-[28px] bg-[#f5f4f0] shadow-[0px_20px_45px_-12px_#00000030]">
          <StylistProfileHeroSection />
          <ContactDetailsSection />
          <HairServicesSection />

          <section className="bg-white px-5 py-6" aria-labelledby="gallery-heading">
            <div className="mb-4 flex items-center justify-center">
              <h2 id="gallery-heading" className="text-lg font-semibold tracking-[0.4px] text-[#1e3d25]">
                Recent work
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-2" role="list" aria-label="Hair styling gallery">
              {galleryImages.map((image, index) => (
                <div key={image} className="overflow-hidden rounded-xl bg-[#e8e4dc]" role="listitem">
                  <div
                    className="h-28 w-full bg-cover bg-center transform transition-transform duration-200 hover:scale-105 cursor-pointer"
                    role="img"
                    aria-label={`Gallery image ${index + 1}`}
                    style={{ backgroundImage: `url(${image})` }}
                    onClick={() => window.open(image, "_blank")}
                  />
                </div>
              ))}
            </div>
          </section>

          <ProfileFooterSection />
        </article>
      </main>
    </ToastProvider>
  );
};
