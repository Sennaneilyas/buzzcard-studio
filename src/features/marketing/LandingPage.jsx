import Navbar from "./components/Navbar";
import HowItWorks from "./components/HowItWorks";
import TemplatesShowcase from "./components/TemplatesShowcase";
import Pricing from "./components/Pricing";
import Work from "./components/Work";
import Footer from "./components/Footer";

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
    <div className="relative min-h-screen bg-cloud" id="landing-page">
      <Navbar />

      {/* Spacer to account for fixed navbar height */}
      <div className="h-20" />

      <main>
        <HowItWorks />
        <TemplatesShowcase />
        <Pricing />
        <Work />
      </main>

      <Footer />
    </div>
  );
}
