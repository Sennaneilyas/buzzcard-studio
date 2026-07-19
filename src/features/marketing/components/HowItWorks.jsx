import { motion } from "framer-motion";
import { Smartphone, Palette, Share2 } from "lucide-react";

const STEPS = [
  {
    icon: Palette,
    step: "01",
    title: "Design Your Card",
    description:
      "Choose from premium templates and customize every detail — colors, fonts, layout, and social links.",
  },
  {
    icon: Smartphone,
    step: "02",
    title: "Tap & Connect",
    description:
      "Your NFC card instantly opens your digital profile. No app required — works on any smartphone.",
  },
  {
    icon: Share2,
    step: "03",
    title: "Grow Your Network",
    description:
      "Track views, capture leads, and update your card anytime. Your contact info is always current.",
  },
];

/**
 * HowItWorks — Three-step process section with animated cards.
 */
export default function HowItWorks() {
  return (
    <section className="py-24 md:py-32 px-6" id="how-it-works">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-block px-4 py-1.5 mb-5 rounded-full bg-navy/5 text-navy text-xs font-semibold uppercase tracking-widest">
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-ink tracking-tight">
            Three steps to{" "}
            <span className="bg-gradient-to-r from-navy to-mint bg-clip-text text-transparent">
              stand out
            </span>
          </h2>
          <p className="mt-4 max-w-lg mx-auto text-ink/50 text-lg">
            From design to connection — everything happens in seconds.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="
                group relative p-8 rounded-3xl
                bg-white border border-ink/[0.06]
                transition-all duration-500
                hover:shadow-[0_8px_40px_rgba(0,35,102,0.08)]
                hover:border-mint/20
              "
            >
              {/* Step number */}
              <span className="absolute top-6 right-6 text-5xl font-black text-ink/[0.04] select-none">
                {step.step}
              </span>

              {/* Icon */}
              <div
                className="
                  w-14 h-14 rounded-2xl flex items-center justify-center mb-6
                  bg-gradient-to-br from-mint/15 to-mint/5
                  border border-mint/15
                  transition-all duration-500
                  group-hover:shadow-[0_0_20px_rgba(0,230,118,0.15)]
                  group-hover:scale-110
                "
              >
                <step.icon className="w-6 h-6 text-navy" />
              </div>

              <h3 className="text-xl font-bold text-ink mb-3">{step.title}</h3>
              <p className="text-ink/50 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
