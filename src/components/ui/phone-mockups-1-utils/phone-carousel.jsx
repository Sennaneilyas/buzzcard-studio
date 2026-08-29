import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

function IPhoneStatusBar() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[30px] bg-white text-black"
    >
      <span className="absolute left-[14%] top-1/2 -translate-y-1/2 font-sans text-[9px] font-semibold leading-none tracking-[-0.02em]">
        9:41
      </span>

      <div className="absolute right-[8.5%] top-1/2 flex -translate-y-1/2 items-center gap-[4px]">
        <svg
          viewBox="0 0 18 12"
          className="h-[8px] w-3"
          fill="currentColor"
        >
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" width="3" height="12" rx="1" />
        </svg>

        <svg
          viewBox="0 0 18 13"
          className="h-[8px] w-3"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
        >
          <path d="M1 4.25C5.7.1 12.3.1 17 4.25" />
          <path d="M4 7.25c2.85-2.45 7.15-2.45 10 0" />
          <path d="M7.25 10.15c1-.8 2.5-.8 3.5 0" />
        </svg>

        <div className="relative h-[8px] w-[16px] rounded-[2.5px] border border-black/40 p-px">
          <span className="block h-full w-full rounded-[1px] bg-black" />
          <span className="absolute -right-[2.5px] top-1/2 h-[4px] w-[1.5px] -translate-y-1/2 rounded-r-full bg-black/40" />
        </div>
      </div>
    </div>
  );
}

export function PhoneMockupFrame({ children, className = "w-full", ...props }) {
  return (
    <div
      className={`relative aspect-[9/19] rounded-[2.75rem] bg-[#111318] p-[7px] shadow-[0_32px_70px_-28px_rgba(12,13,16,0.55)] ring-1 ring-white/20 ${className}`}
      {...props}
    >
      <span className="absolute -left-[3px] top-24 h-12 w-[3px] rounded-l-full bg-[#2b2e35]" />
      <span className="absolute -left-[3px] top-40 h-16 w-[3px] rounded-l-full bg-[#2b2e35]" />
      <span className="absolute -right-[3px] top-32 h-20 w-[3px] rounded-r-full bg-[#2b2e35]" />

      <div className="relative h-full overflow-hidden rounded-[2.35rem] bg-white">
        <div className="absolute inset-x-0 bottom-0 top-[30px] overflow-hidden">
          {children}
        </div>
        <IPhoneStatusBar />
        <div className="pointer-events-none absolute left-1/2 top-[5px] z-30 h-5 w-[31%] -translate-x-1/2 rounded-full bg-[#08090b] shadow-sm">
          <span className="absolute right-2 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-[#17212b] ring-1 ring-white/5" />
        </div>
      </div>
    </div>
  );
}

function PhoneFrame({ item, priority = false }) {
  return (
    <PhoneMockupFrame>
      <div className="relative size-full">
        <img
          src={item.src}
          alt={item.alt}
          className="h-full w-full object-cover object-top"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          draggable={false}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/55 to-transparent" />
        <div className="pointer-events-none absolute inset-x-5 bottom-5 text-left text-white">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
            {item.category}
          </p>
          <p className="mt-1 text-lg font-bold leading-tight">{item.label}</p>
        </div>
      </div>
    </PhoneMockupFrame>
  );
}

function SidePhone({ item, side, onSelect, onIntent }) {
  const isLeft = side === "left";

  return (
    <button
      type="button"
      aria-label={`Show ${item.label}`}
      onClick={onSelect}
      onMouseEnter={onIntent}
      onFocus={onIntent}
      className={`absolute top-1/2 hidden w-[230px] -translate-y-1/2 cursor-pointer opacity-55 transition-all duration-300 hover:opacity-80 focus-visible:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/40 md:block lg:w-[260px] ${
        isLeft
          ? "left-1/2 -translate-x-[145%] -rotate-6"
          : "right-1/2 translate-x-[145%] rotate-6"
      }`}
    >
      <PhoneFrame item={item} />
    </button>
  );
}

export function PhoneCarousel({ images = [], onItemIntent }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduceMotion = useReducedMotion();

  if (images.length === 0) {
    return null;
  }

  const currentIndex = activeIndex % images.length;
  const previousIndex = (currentIndex - 1 + images.length) % images.length;
  const nextIndex = (currentIndex + 1) % images.length;
  const activeItem = images[currentIndex];

  const selectIndex = (index, nextDirection) => {
    setDirection(nextDirection);
    setActiveIndex(index);
    onItemIntent?.(images[index]);
  };

  const showPrevious = () => selectIndex(previousIndex, -1);
  const showNext = () => selectIndex(nextIndex, 1);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="BuzzCard template previews"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") showPrevious();
        if (event.key === "ArrowRight") showNext();
      }}
      className="relative mx-auto w-full max-w-5xl"
    >
      <div className="relative flex min-h-[510px] items-center justify-center sm:min-h-[580px]">
        {images.length > 1 && (
          <>
            <SidePhone
              item={images[previousIndex]}
              side="left"
              onSelect={showPrevious}
              onIntent={() => onItemIntent?.(images[previousIndex])}
            />
            <SidePhone
              item={images[nextIndex]}
              side="right"
              onSelect={showNext}
              onIntent={() => onItemIntent?.(images[nextIndex])}
            />
          </>
        )}

        <div className="relative z-10 w-[245px] sm:w-[280px] lg:w-[300px]">
          <AnimatePresence initial={false} mode="popLayout" custom={direction}>
            <motion.div
              key={activeItem.id ?? activeItem.src}
              custom={direction}
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.985, x: direction * 24 }
              }
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.985, x: direction * -24 }
              }
              transition={
                reduceMotion
                  ? { duration: 0.15 }
                  : {
                      type: "spring",
                      stiffness: 180,
                      damping: 25,
                      mass: 0.8,
                      delay: 0.12,
                    }
              }
              drag={reduceMotion ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={(_, info) => {
                if (info.offset.x < -55) showNext();
                if (info.offset.x > 55) showPrevious();
              }}
              onMouseEnter={() => onItemIntent?.(activeItem)}
            >
              <PhoneFrame item={activeItem} priority />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-6">
        {images.length > 1 && (
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Previous template"
              className="grid size-11 place-items-center rounded-full border border-ink/10 bg-white text-ink shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/40"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>

            <div
              className="flex min-w-20 items-center justify-center gap-2"
              role="tablist"
              aria-label="Choose a template"
            >
              {images.map((item, index) => {
                const isActive = index === currentIndex;

                return (
                  <button
                    key={item.id ?? item.src}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Show ${item.label}`}
                    onClick={() =>
                      selectIndex(index, index >= currentIndex ? 1 : -1)
                    }
                    onMouseEnter={() => onItemIntent?.(item)}
                    onFocus={() => onItemIntent?.(item)}
                    className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/40 focus-visible:ring-offset-2 ${
                      isActive
                        ? "w-8 bg-navy"
                        : "w-2.5 bg-ink/20 hover:bg-ink/35"
                    }`}
                  />
                );
              })}
            </div>

            <button
              type="button"
              onClick={showNext}
              aria-label="Next template"
              className="grid size-11 place-items-center rounded-full border border-ink/10 bg-white text-ink shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/40"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>
        )}

        <Link
          to="/template"
          onMouseEnter={() => onItemIntent?.(images[0])}
          onFocus={() => onItemIntent?.(images[0])}
          className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-navy hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/40 focus-visible:ring-offset-2"
        >
          Explore Templates
          <ArrowUpRight
            className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  );
}
