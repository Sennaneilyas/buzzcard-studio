import { motion } from "framer-motion";
import { Check, Zap, Crown, Building2 } from "lucide-react";

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Perfect for trying out BuzzCard",
    icon: Zap,
    features: [
      "1 digital card",
      "3 templates",
      "Basic contact sharing",
      "QR code included",
      "Community support",
    ],
    cta: "Start Free",
    popular: false,
    style: {
      card: "bg-white border-ink/[0.06]",
      icon: "bg-ink/5 text-ink/60",
      cta: "bg-ink/5 text-ink hover:bg-ink/10",
    },
  },
  {
    name: "Pro",
    price: "99",
    period: "MAD/mo",
    description: "For professionals who want to stand out",
    icon: Crown,
    features: [
      "5 digital cards",
      "All templates",
      "Analytics dashboard",
      "Custom branding",
      "Lead capture forms",
      "Priority support",
    ],
    cta: "Go Pro",
    popular: true,
    style: {
      card: "bg-gradient-to-b from-navy to-navy/95 border-navy/20",
      icon: "bg-mint/15 text-mint",
      cta: "bg-mint text-ink hover:shadow-[0_0_30px_rgba(0,230,118,0.3)] hover:scale-[1.03]",
    },
  },
  {
    name: "Business",
    price: "249",
    period: "MAD/mo",
    description: "For teams and organizations",
    icon: Building2,
    features: [
      "Unlimited cards",
      "All templates + custom",
      "Team management",
      "Advanced analytics",
      "API access",
      "White-label option",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    popular: false,
    style: {
      card: "bg-white border-ink/[0.06]",
      icon: "bg-navy/5 text-navy",
      cta: "bg-navy text-white hover:bg-navy/90 hover:shadow-[0_0_30px_rgba(0,35,102,0.2)]",
    },
  },
];

/**
 * Pricing — Three-tier pricing cards with animated entrance.
 */
export default function Pricing() {
  return (
    <section className="py-24 md:py-32 px-6" id="pricing">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 mb-5 rounded-full bg-navy/5 text-navy text-xs font-semibold uppercase tracking-widest">
            Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-ink tracking-tight">
            Simple,{" "}
            <span className="bg-gradient-to-r from-navy to-mint bg-clip-text text-transparent">
              transparent
            </span>{" "}
            pricing
          </h2>
          <p className="mt-4 max-w-lg mx-auto text-ink/50 text-lg">
            Start free, upgrade as you grow. No hidden fees, cancel anytime.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 items-start">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className={`
                relative p-8 rounded-3xl border
                transition-all duration-500
                hover:shadow-[0_8px_40px_rgba(0,35,102,0.1)]
                ${plan.style.card}
                ${plan.popular ? "md:scale-105 md:-my-4" : ""}
              `}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-mint text-ink text-xs font-bold uppercase tracking-wider shadow-[0_4px_12px_rgba(0,230,118,0.3)]">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${plan.style.icon}`}>
                <plan.icon className="w-6 h-6" />
              </div>

              {/* Plan name & description */}
              <h3 className={`text-xl font-bold mb-1 ${plan.popular ? "text-white" : "text-ink"}`}>
                {plan.name}
              </h3>
              <p className={`text-sm mb-6 ${plan.popular ? "text-white/50" : "text-ink/40"}`}>
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-8">
                <span className={`text-5xl font-extrabold tracking-tight ${plan.popular ? "text-white" : "text-ink"}`}>
                  {plan.price === "Free" ? plan.price : `${plan.price}`}
                </span>
                {plan.period && (
                  <span className={`ml-2 text-sm ${plan.popular ? "text-white/40" : "text-ink/40"}`}>
                    {plan.period}
                  </span>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-3">
                    <Check
                      className={`w-4 h-4 shrink-0 ${plan.popular ? "text-mint" : "text-mint"}`}
                    />
                    <span className={`text-sm ${plan.popular ? "text-white/70" : "text-ink/60"}`}>
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="#get-started"
                className={`
                  block text-center w-full px-6 py-3.5 rounded-2xl
                  text-sm font-semibold transition-all duration-300
                  active:scale-[0.97]
                  ${plan.style.cta}
                `}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
