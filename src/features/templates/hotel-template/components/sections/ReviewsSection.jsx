import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { fadeInUp } from "../../utils/animations";

export function ReviewsSection({ reviews }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  if (!reviews || reviews.length === 0) return null;

  const next = useCallback(() => setCurrent((c) => (c + 1) % reviews.length), [reviews.length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + reviews.length) % reviews.length), [reviews.length]);

  // Auto-play
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [isPaused, next]);

  const review = reviews[current];

  return (
    <section 
      className="px-6 py-14 bg-transparent hotel-lazy-section"
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
            className="bg-white rounded-[24px] p-6 border border-[#D6BFA6]/20 shadow-[0_8px_32px_-8px_rgba(59,42,34,0.06)]"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={review.avatar}
                alt={review.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-[#D6BFA6]/30"
                loading="lazy"
              />
              <div>
                <p 
                  className="text-[14px] text-[#3B2A22] font-bold"
                  style={{ fontFamily: "var(--hotel-font-body)" }}
                >
                  {review.name}
                </p>
                <p className="text-[11px] text-[#B08968]"
                  style={{ fontFamily: "var(--hotel-font-body)" }}
                >
                  {review.date}
                </p>
              </div>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-0.5 mb-3">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#C9A96E] text-[#C9A96E]" />
              ))}
            </div>

            {/* Review Text */}
            <p 
              className="text-[13px] text-[#3B2A22]/70 leading-[1.7] italic"
              style={{ fontFamily: "var(--hotel-font-display)" }}
            >
              "{review.text}"
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-5">
          <button
            onClick={prev}
            className="w-8 h-8 rounded-full bg-[#F3E9D7] border border-[#D6BFA6]/30 flex items-center justify-center text-[#7A553A] hover:bg-[#3B2A22] hover:text-[#F3E9D7] transition-colors"
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
                    ? "w-6 h-2 bg-[#B08968]"
                    : "w-2 h-2 bg-[#D6BFA6]/50 hover:bg-[#D6BFA6]"
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-8 h-8 rounded-full bg-[#F3E9D7] border border-[#D6BFA6]/30 flex items-center justify-center text-[#7A553A] hover:bg-[#3B2A22] hover:text-[#F3E9D7] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
