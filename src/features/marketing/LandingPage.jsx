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
            Create stunning digital business cards powered by NFC. Tap, connect,
            and leave a lasting impression — all from a single card.
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
        {/* Temporary content for scroll testing */}
        <div>
          <section className="min-h-screen px-6 py-20 text-center">
            <h2 className="text-4xl font-bold text-ink mb-8">Section 1</h2>
            <p className="text-lg text-ink/60 max-w-2xl mx-auto">
              This is temporary content to test scrolling behavior. Lorem ipsum
              dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </p>
          </section>

          <section className="min-h-screen px-6 py-20 text-center bg-navy/5">
            <h2 className="text-4xl font-bold text-ink mb-8">Section 2</h2>
            <p className="text-lg text-ink/60 max-w-2xl mx-auto">
              More temporary content for scroll testing. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
              ex ea commodo consequat.
            </p>
          </section>

          <section className="min-h-screen px-6 py-20 text-center">
            <h2 className="text-4xl font-bold text-ink mb-8">Section 3</h2>
            <p className="text-lg text-ink/60 max-w-2xl mx-auto">
              Final temporary section for scroll testing. Duis aute irure dolor
              in reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
