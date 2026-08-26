import { motion } from "framer-motion";
import { ArrowUpRight, Package } from "lucide-react";
import { Link } from "react-router-dom";

export function CommerceHero({ categories }) {
  return (
    <section
      id="products"
      className="overflow-hidden bg-transparent px-4 py-20 sm:px-6 md:py-28"
      aria-labelledby="products-showcase-title"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[2rem] border border-navy/10 bg-mint/15 px-5 py-16 text-center sm:px-8 sm:py-20 lg:py-24"
        >
          <div
            className="pointer-events-none absolute -left-24 top-1/2 size-72 -translate-y-1/2 rounded-full bg-white/60 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -right-20 -top-28 size-72 rounded-full bg-navy/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-4xl">
            <div className="mb-5 flex items-center justify-center gap-3 text-ink/65">
              <span className="h-px w-10 bg-ink/20" />
              <span className="flex items-center gap-2 font-serif text-lg italic tracking-wide">
                <Package className="size-4" aria-hidden="true" />
                Our Products
              </span>
              <span className="h-px w-10 bg-ink/20" />
            </div>

            <motion.h2
              id="products-showcase-title"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
              className="font-heading text-4xl font-bold leading-[1.05] tracking-[-0.045em] text-ink sm:text-5xl lg:text-7xl"
            >
              Everything you need to connect,
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-navy to-mint bg-clip-text text-transparent">
                in one collection.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.22, ease: "easeOut" }}
              className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink/60 sm:text-lg"
            >
              Explore premium NFC cards, bracelets, plates, and stands designed
              to make every introduction effortless.
            </motion.p>
          </div>
        </motion.div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {categories.map((category, index) => (
            <motion.article
              key={category.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.55, delay: index * 0.08, ease: "easeOut" }}
              className="group relative aspect-square overflow-hidden rounded-[1.5rem] border border-ink/5 bg-white shadow-[0_18px_50px_rgba(0,35,102,0.07)] sm:aspect-auto sm:min-h-[320px] sm:rounded-[2rem]"
            >
              <Link
                to={category.href}
                className="absolute inset-0 z-10 overflow-hidden rounded-[inherit] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-navy"
                aria-label={`Explore ${category.title}`}
              >
                <h3 className="relative z-10 px-2 pt-4 text-center font-heading text-lg font-bold tracking-[-0.04em] text-navy transition-colors duration-300 group-hover:text-ink sm:px-5 sm:pt-7 sm:text-3xl">
                  {category.title}
                </h3>

                <div className="absolute inset-x-3 bottom-7 top-10 flex items-center justify-center sm:inset-x-5 sm:bottom-12 sm:top-16">
                  <img
                    src={category.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="max-h-full w-full object-contain drop-shadow-[0_20px_22px_rgba(0,35,102,0.14)] transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                </div>

                <div
                  className="absolute -bottom-px -right-px size-14 rounded-tl-[1.25rem] bg-cloud sm:size-24 sm:rounded-tl-[1.75rem]"
                  aria-hidden="true"
                >
                  <span className="absolute bottom-2 right-2 grid size-9 place-items-center rounded-full bg-mint text-ink shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-navy group-hover:text-white sm:bottom-4 sm:right-4 sm:size-12">
                    <ArrowUpRight className="size-4 sm:size-5" />
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
