import { Quote } from "lucide-react";
import SectionHeading from "./SectionHeading";

/**
 * SectionTestimonial — Avatar + quote + author.
 * Supports variant: "centered" (default) or "card".
 */

const DEMO_TESTIMONIAL = {
  quote:
    "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem has been the industry's standard dummy text.",
  author: "Shane Watson",
  role: "Customer",
  avatar:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
};

export default function SectionTestimonial({ data = {}, variant = "centered" }) {
  const testimonial = data.testimonial || DEMO_TESTIMONIAL;

  return (
    <section className="px-6 py-8">
      <SectionHeading title="Testimonial" icon={Quote} />

      {variant === "centered" ? (
        <div className="flex flex-col items-center text-center gap-4">
          {/* Large quote mark */}
          <Quote
            className="w-8 h-8 rotate-180"
            style={{ color: "var(--t-accent)" }}
          />

          {/* Avatar */}
          <div
            className="w-16 h-16 rounded-full overflow-hidden ring-2"
            style={{ ringColor: "var(--t-accent)" }}
          >
            <img
              src={testimonial.avatar}
              alt={testimonial.author}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Quote text */}
          <p
            className="text-sm leading-relaxed max-w-sm"
            style={{ color: "var(--t-text-secondary)" }}
          >
            {testimonial.quote}
          </p>

          {/* Author */}
          <div>
            <p
              className="text-sm font-bold"
              style={{ color: "var(--t-accent)" }}
            >
              {testimonial.author}
            </p>
            <p
              className="text-xs"
              style={{ color: "var(--t-text-secondary)" }}
            >
              {testimonial.role}
            </p>
          </div>
        </div>
      ) : (
        /* card variant */
        <div
          className="p-5 flex items-start gap-4"
          style={{
            backgroundColor: "var(--t-bg-section)",
            borderRadius: "var(--t-card-radius)",
            boxShadow: "var(--t-card-shadow)",
          }}
        >
          <div
            className="w-14 h-14 rounded-full overflow-hidden shrink-0 ring-2"
            style={{ ringColor: "var(--t-accent)" }}
          >
            <img
              src={testimonial.avatar}
              alt={testimonial.author}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p
              className="text-sm leading-relaxed mb-2"
              style={{ color: "var(--t-text-secondary)" }}
            >
              "{testimonial.quote}"
            </p>
            <p
              className="text-sm font-bold"
              style={{ color: "var(--t-accent)" }}
            >
              {testimonial.author}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
