import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { SectionWrapper } from "../ui/SectionWrapper";

export function ReviewsSection({ reviews }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % (reviews?.length || 1)),
    [reviews?.length],
  );
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + (reviews?.length || 1)) % (reviews?.length || 1)),
    [reviews?.length],
  );

  // Auto-play
  useEffect(() => {
    if (isPaused || !reviews || reviews.length === 0) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [isPaused, next, reviews]);

  if (!reviews || reviews.length === 0) return null;

  const review = reviews[current];

  return (
    <SectionWrapper>
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <SectionHeader subtitle="Avis Clients" title="Ce Qu'ils Disent" />

        <div className="relative mt-6 max-w-[380px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={review.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="bg-white rounded-[24px] p-6 border border-[var(--hotel-cappuccino)]/20 shadow-[0_8px_32px_-8px_rgba(59,42,34,0.06)]"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-[var(--hotel-cappuccino)]/30"
                  loading="lazy"
                />
                <div>
                  <p className="text-[14px] text-[var(--hotel-espresso)] font-bold font-hotel-body">
                    {review.name}
                  </p>
                  <p className="text-[11px] text-[var(--hotel-caramel)] font-hotel-body">
                    {review.date}
                  </p>
                </div>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-3">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 fill-[var(--hotel-gold)] text-[var(--hotel-gold)]"
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-[13px] text-[var(--hotel-espresso)]/70 leading-[1.7] italic font-hotel-body">
                "{review.text}"
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-5">
            <button
              onClick={prev}
              className="w-8 h-8 rounded-full bg-[var(--hotel-latte)] border border-[var(--hotel-cappuccino)]/30 flex items-center justify-center text-[var(--hotel-mocha)] hover:bg-[var(--hotel-espresso)] hover:text-[var(--hotel-latte)] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-6 h-2 bg-[var(--hotel-caramel)]"
                      : "w-2 h-2 bg-[var(--hotel-cappuccino)]/50 hover:bg-[var(--hotel-cappuccino)]"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-8 h-8 rounded-full bg-[var(--hotel-latte)] border border-[var(--hotel-cappuccino)]/30 flex items-center justify-center text-[var(--hotel-mocha)] hover:bg-[var(--hotel-espresso)] hover:text-[var(--hotel-latte)] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
