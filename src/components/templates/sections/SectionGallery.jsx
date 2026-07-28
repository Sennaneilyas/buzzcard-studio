import { useState } from "react";
import { Images, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "./SectionHeading";

/**
 * SectionGallery — Horizontal image carousel with dot pagination.
 */

const DEMO_IMAGES = [
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop",
];

export default function SectionGallery({ data = {} }) {
  const images = data.gallery?.length ? data.gallery : DEMO_IMAGES;
  const [current, setCurrent] = useState(0);

  const goTo = (dir) => {
    setCurrent((prev) => {
      if (dir === "prev") return prev === 0 ? images.length - 1 : prev - 1;
      return prev === images.length - 1 ? 0 : prev + 1;
    });
  };

  return (
    <section className="px-6 py-8">
      <SectionHeading title="Gallery" icon={Images} />

      <div className="relative overflow-hidden rounded-xl" style={{ borderRadius: "var(--t-card-radius)" }}>
        {/* Image */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={images[current]}
            alt={`Gallery ${current + 1}`}
            className="w-full h-full object-cover transition-opacity duration-300"
          />

          {/* Nav arrows */}
          <button
            onClick={() => goTo("prev")}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => goTo("next")}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dot pagination */}
        <div className="flex justify-center gap-1.5 py-3" style={{ backgroundColor: "var(--t-bg-section)" }}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="w-2 h-2 rounded-full transition-colors"
              style={{
                backgroundColor:
                  i === current ? "var(--t-accent)" : "var(--t-text-secondary)",
                opacity: i === current ? 1 : 0.4,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
