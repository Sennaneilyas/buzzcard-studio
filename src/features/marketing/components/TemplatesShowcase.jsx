import { motion } from "framer-motion";
import { Eye, Layers } from "lucide-react";

const TEMPLATES = [
  {
    name: "Midnight",
    gradient: "from-[#0f0c29] via-[#302b63] to-[#24243e]",
    accent: "bg-violet-400",
    tag: "Popular",
  },
  {
    name: "Ocean",
    gradient: "from-navy via-[#003d99] to-[#0066cc]",
    accent: "bg-mint",
    tag: "New",
  },
  {
    name: "Ember",
    gradient: "from-[#1a1a2e] via-[#16213e] to-[#0f3460]",
    accent: "bg-amber-400",
    tag: null,
  },
  {
    name: "Arctic",
    gradient: "from-[#e8f0fe] via-[#d2e3fc] to-[#aecbfa]",
    accent: "bg-navy",
    tag: null,
    dark: true,
  },
  {
    name: "Forest",
    gradient: "from-[#0b3d0b] via-[#1a5c1a] to-[#2d8b2d]",
    accent: "bg-emerald-300",
    tag: null,
  },
  {
    name: "Slate",
    gradient: "from-[#2c3e50] via-[#34495e] to-[#4a6274]",
    accent: "bg-cyan-400",
    tag: "Minimal",
  },
];

/**
 * TemplatesShowcase — Grid of template card previews.
 */
export default function TemplatesShowcase() {
  return (
    <section className="py-24 md:py-32 px-6 bg-white" id="templates">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full bg-navy/5 text-navy text-xs font-semibold uppercase tracking-widest">
            <Layers className="w-3.5 h-3.5" />
            Templates
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-ink tracking-tight">
            Pick your{" "}
            <span className="bg-gradient-to-r from-navy to-mint bg-clip-text text-transparent">
              perfect style
            </span>
          </h2>
          <p className="mt-4 max-w-lg mx-auto text-ink/50 text-lg">
            Start with a professionally designed template, then make it entirely yours.
          </p>
        </motion.div>

        {/* Templates grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {TEMPLATES.map((tmpl, i) => (
            <motion.div
              key={tmpl.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group relative"
            >
              <div
                className={`
                  relative aspect-[8/5] rounded-2xl overflow-hidden
                  bg-gradient-to-br ${tmpl.gradient}
                  border border-white/10
                  transition-all duration-500
                  group-hover:shadow-[0_12px_40px_rgba(0,35,102,0.15)]
                  group-hover:scale-[1.03]
                `}
              >
                {/* Card content preview */}
                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className={`w-8 h-8 rounded-lg ${tmpl.accent} opacity-80`} />
                    {tmpl.tag && (
                      <span className="px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-semibold text-white/80 uppercase tracking-wider">
                        {tmpl.tag}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className={`h-1.5 w-20 rounded-full ${tmpl.dark ? "bg-ink/20" : "bg-white/25"} mb-2`} />
                    <div className={`h-1.5 w-14 rounded-full ${tmpl.dark ? "bg-ink/15" : "bg-white/15"}`} />
                  </div>
                </div>

                {/* Hover overlay */}
                <div
                  className="
                    absolute inset-0 flex items-center justify-center
                    bg-ink/0 transition-all duration-300
                    group-hover:bg-ink/30 group-hover:backdrop-blur-[2px]
                    opacity-0 group-hover:opacity-100
                  "
                >
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 text-ink text-sm font-semibold">
                    <Eye className="w-4 h-4" />
                    Preview
                  </span>
                </div>
              </div>

              {/* Template name */}
              <p className={`mt-3 text-sm font-semibold ${tmpl.dark ? "text-ink" : "text-ink/70"} text-center`}>
                {tmpl.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
