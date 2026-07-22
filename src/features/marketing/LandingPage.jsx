import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";
import ProductsShowcase from "./components/ProductsShowcase";
import Pricing from "./components/Pricing";
import Work from "./components/Work";
import Footer from "./components/Footer";

import HeroBackgroundWrapper from "@/components/ui/HeroBackgroundWrapper";

/**
 * LandingPage — Root component for the `features/marketing` feature.
 *
 * Holds the full marketing/landing page layout.
 * The light gray (#f4f5f7 / --color-cloud) background is applied
 * globally via index.css on <body>; this component adds the structural
 * wrapper and renders each landing section in order.
 */
export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-transparent" id="landing-page">
      <div className="px-2 pt-2 sm:px-3 sm:pt-3 lg:px-4 lg:pt-4 relative z-50">
        <HeroBackgroundWrapper className="bg-cloud rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-sm border border-black/5">
          <Navbar />
          <HeroSection />
        </HeroBackgroundWrapper>
      </div>

      <main>
        <HowItWorks />
        <ProductsShowcase />
        <Pricing />
        <Work />
      </main>

      <Footer />
    </div>
  );
}
