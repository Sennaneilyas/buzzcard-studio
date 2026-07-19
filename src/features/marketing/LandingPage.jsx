import Navbar from "./components/Navbar";

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

      {/* ── Sections will be added here as we build them ── */}
      <main>
        {/* Temporary hero placeholder so the page isn't blank */}
        <section
          className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center"
          id="hero"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-ink leading-tight">
            Your Card.{" "}
            <span className="bg-gradient-to-r from-navy to-mint bg-clip-text text-transparent">
              Your Brand.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink/60 font-medium leading-relaxed">
            Create stunning digital business cards powered by NFC.
            Tap, connect, and leave a lasting impression — all from a single card.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#get-started"
              className="
                px-8 py-3.5 text-base font-semibold text-ink bg-mint rounded-2xl
                transition-all duration-300
                hover:shadow-[0_0_30px_rgba(0,230,118,0.35)]
                hover:scale-[1.04] active:scale-[0.97]
              "
              id="hero-cta"
            >
              Get Started Free
            </a>
            <a
              href="#how-it-works"
              className="
                px-8 py-3.5 text-base font-semibold text-navy
                border-2 border-navy/15 rounded-2xl
                transition-all duration-300
                hover:border-navy/30 hover:bg-navy/5
              "
              id="hero-secondary-cta"
            >
              See How It Works
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
