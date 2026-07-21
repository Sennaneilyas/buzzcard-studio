import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const PROJECTS = [
  {
    title: "Studio Noir",
    category: "Photography Studio",
    color: "from-[#1a1a2e] to-[#16213e]",
    initials: "SN",
  },
  {
    title: "Café Bloom",
    category: "Restaurant & Café",
    color: "from-[#2d1810] to-[#4a2c1e]",
    initials: "CB",
  },
  {
    title: "Arch. Malik",
    category: "Architecture Firm",
    color: "from-navy to-[#003d99]",
    initials: "AM",
  },
  {
    title: "TechVentures",
    category: "Startup Consulting",
    color: "from-[#0f3460] to-[#1a5c3a]",
    initials: "TV",
  },
];

/**
 * Work — Showcase of example use-cases / client work.
 */
export default function Work() {
  return (
    <section className="py-24 md:py-32 px-6 bg-transparent" id="work">
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
            Our Work
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-ink tracking-tight">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-navy to-mint bg-clip-text text-transparent">
              professionals
            </span>
          </h2>
          <p className="mt-4 max-w-lg mx-auto text-ink/50 text-lg">
            See how businesses are making lasting first impressions with BuzzCard.
          </p>
        </motion.div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative"
            >
              <div
                className={`
                  relative aspect-[16/10] rounded-3xl overflow-hidden
                  bg-gradient-to-br ${project.color}
                  border border-white/5
                  transition-all duration-500
                  group-hover:shadow-[0_12px_40px_rgba(0,35,102,0.15)]
                  group-hover:scale-[1.02]
                  cursor-pointer
                `}
              >
                {/* Card content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  {/* Top row */}
                  <div className="flex items-start justify-between">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                      <span className="text-white/80 font-bold text-lg">{project.initials}</span>
                    </div>
                    <motion.div
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <ExternalLink className="w-4 h-4 text-white/70" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Bottom row */}
                  <div>
                    <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-1">
                      {project.category}
                    </p>
                    <p className="text-white text-xl font-bold">{project.title}</p>
                  </div>
                </div>

                {/* Subtle grid pattern overlay */}
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
