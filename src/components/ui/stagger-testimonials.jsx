"use client"

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SQRT_5000 = Math.sqrt(5000);

const testimonials = [
  {
    tempId: 0,
    testimonial: "My favorite solution in the market. We work 5x faster with BuzzCard.",
    by: "Alex, CEO at TechCorp",
    imgSrc: "https://api.dicebear.com/10.x/pixel-art/svg?seed=Alex"
  },
  {
    tempId: 1,
    testimonial: "I'm confident my data is safe with BuzzCard. I can't say that about other providers.",
    by: "Dan, CTO at SecureNet",
    imgSrc: "https://api.dicebear.com/10.x/pixel-art/svg?seed=Dan"
  },
  {
    tempId: 2,
    testimonial: "I know it's cliche, but we were lost before we found BuzzCard. Can't thank you guys enough!",
    by: "Stephanie, COO at InnovateCo",
    imgSrc: "https://api.dicebear.com/10.x/pixel-art/svg?seed=Stephanie"
  },
  {
    tempId: 3,
    testimonial: "BuzzCard's products make networking for the future seamless. Can't recommend them enough!",
    by: "Marie, CFO at FuturePlanning",
    imgSrc: "https://api.dicebear.com/10.x/pixel-art/svg?seed=Marie"
  },
  {
    tempId: 4,
    testimonial: "If I could give 11 stars, I'd give 12.",
    by: "Andre, Head of Design at CreativeSolutions",
    imgSrc: "https://api.dicebear.com/10.x/pixel-art/svg?seed=Andre"
  },
  {
    tempId: 5,
    testimonial: "SO SO SO HAPPY WE FOUND YOU GUYS!!!! I'd bet you've saved me 100 hours so far.",
    by: "Jeremy, Product Manager at TimeWise",
    imgSrc: "https://api.dicebear.com/10.x/pixel-art/svg?seed=Jeremy"
  },
  {
    tempId: 6,
    testimonial: "Took some convincing, but now that we're on BuzzCard, we're never going back.",
    by: "Pam, Marketing Director at BrandBuilders",
    imgSrc: "https://api.dicebear.com/10.x/pixel-art/svg?seed=Pam"
  },
  {
    tempId: 7,
    testimonial: "I would be lost without BuzzCard's NFC analytics. The ROI is EASILY 100X for us.",
    by: "Daniel, Data Scientist at AnalyticsPro",
    imgSrc: "https://api.dicebear.com/10.x/pixel-art/svg?seed=Daniel"
  },
  {
    tempId: 8,
    testimonial: "It's just the best. Period.",
    by: "Fernando, UX Designer at UserFirst",
    imgSrc: "https://api.dicebear.com/10.x/pixel-art/svg?seed=Fernando"
  },
  {
    tempId: 9,
    testimonial: "I switched 5 years ago and never looked back.",
    by: "Andy, DevOps Engineer at CloudMasters",
    imgSrc: "https://api.dicebear.com/10.x/pixel-art/svg?seed=Andy"
  },
  {
    tempId: 10,
    testimonial: "I've been searching for a solution like BuzzCard for YEARS. So glad I finally found one!",
    by: "Pete, Sales Director at RevenueRockets",
    imgSrc: "https://api.dicebear.com/10.x/pixel-art/svg?seed=Pete"
  },
  {
    tempId: 11,
    testimonial: "It's so simple and intuitive, we got the team up to speed in 10 minutes.",
    by: "Marina, HR Manager at TalentForge",
    imgSrc: "https://api.dicebear.com/10.x/pixel-art/svg?seed=Marina"
  },
  {
    tempId: 12,
    testimonial: "BuzzCard's customer support is unparalleled. They're always there when we need them.",
    by: "Olivia, Customer Success Manager at ClientCare",
    imgSrc: "https://api.dicebear.com/10.x/pixel-art/svg?seed=Olivia"
  },
  {
    tempId: 13,
    testimonial: "The efficiency gains we've seen since implementing BuzzCard are off the charts!",
    by: "Raj, Operations Manager at StreamlineSolutions",
    imgSrc: "https://api.dicebear.com/10.x/pixel-art/svg?seed=Raj"
  },
  {
    tempId: 14,
    testimonial: "BuzzCard has revolutionized how we handle our workflow. It's a game-changer!",
    by: "Lila, Workflow Specialist at ProcessPro",
    imgSrc: "https://api.dicebear.com/10.x/pixel-art/svg?seed=Lila"
  },
  {
    tempId: 15,
    testimonial: "The scalability of BuzzCard's solution is impressive. It grows with our business seamlessly.",
    by: "Trevor, Scaling Officer at GrowthGurus",
    imgSrc: "https://api.dicebear.com/10.x/pixel-art/svg?seed=Trevor"
  },
  {
    tempId: 16,
    testimonial: "I appreciate how BuzzCard continually innovates. They're always one step ahead.",
    by: "Naomi, Innovation Lead at FutureTech",
    imgSrc: "https://api.dicebear.com/10.x/pixel-art/svg?seed=Naomi"
  },
  {
    tempId: 17,
    testimonial: "The ROI we've seen with BuzzCard is incredible. It's paid for itself many times over.",
    by: "Victor, Finance Analyst at ProfitPeak",
    imgSrc: "https://api.dicebear.com/10.x/pixel-art/svg?seed=Victor"
  },
  {
    tempId: 18,
    testimonial: "BuzzCard's platform is so robust, yet easy to use. It's the perfect balance.",
    by: "Yuki, Tech Lead at BalancedTech",
    imgSrc: "https://api.dicebear.com/10.x/pixel-art/svg?seed=Yuki"
  },
  {
    tempId: 19,
    testimonial: "We've tried many solutions, but BuzzCard stands out in terms of reliability and performance.",
    by: "Zoe, Performance Manager at ReliableSystems",
    imgSrc: "https://api.dicebear.com/10.x/pixel-art/svg?seed=Zoe"
  }
];

const TestimonialCard = ({ 
  position, 
  testimonial, 
  handleMove, 
  cardSize 
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out",
        isCenter 
          ? "z-10 bg-navy text-white border-navy" 
          : "z-0 bg-white text-ink border-ink/10 hover:border-navy/50"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? "0px 8px 0px 4px rgba(0, 35, 102, 0.15)" : "0px 0px 0px 0px transparent"
      }}
    >
      <span
        className={cn("absolute block origin-top-right rotate-45", isCenter ? "bg-white/20" : "bg-ink/10")}
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2
        }}
      />
      <img
        src={testimonial.imgSrc}
        alt={`${testimonial.by.split(',')[0]}`}
        className="mb-4 h-14 w-14 bg-cloud rounded-lg object-cover object-top"
        style={{
          boxShadow: isCenter ? "3px 3px 0px rgba(255,255,255,0.2)" : "3px 3px 0px rgba(17, 24, 39, 0.1)"
        }}
      />
      <h3 className={cn(
        "text-base sm:text-xl font-bold",
        isCenter ? "text-white" : "text-ink"
      )}>
        "{testimonial.testimonial}"
      </h3>
      <p className={cn(
        "absolute bottom-8 left-8 right-8 mt-2 text-sm font-medium",
        isCenter ? "text-white/80" : "text-ink/50"
      )}>
        — {testimonial.by}
      </p>
    </div>
  );
};

export const StaggerTestimonials = () => {
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState(testimonials);

  const handleMove = (steps) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 290);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ 
        height: 520,
        maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)"
      }}
    >
      {testimonialsList.map((testimonial, index) => {
        const position = testimonialsList.length % 2
          ? index - (testimonialsList.length + 1) / 2
          : index - testimonialsList.length / 2;
        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-3">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full text-2xl transition-all shadow-sm",
            "bg-white border border-ink/10 text-ink/70 hover:bg-cloud hover:text-navy hover:border-navy/20 hover:-translate-x-0.5",
            "focus-visible:outline-none"
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full text-2xl transition-all shadow-sm",
            "bg-white border border-ink/10 text-ink/70 hover:bg-cloud hover:text-navy hover:border-navy/20 hover:translate-x-0.5",
            "focus-visible:outline-none"
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
