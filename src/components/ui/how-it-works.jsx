"use client";

import React from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";

const Card = ({ number, title, description, rotate, translateY, className = "" }) => {
  return (
    <m.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`relative w-full max-w-[280px] lg:w-[280px] xl:w-[320px] shrink-0 bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_12px_40px_rgb(0,0,0,0.06)] border border-black/[0.03] flex flex-col justify-between aspect-square mx-auto lg:mx-0 bg-gradient-to-br from-white to-[#fcfcfc] ${className}`}
      style={{
        transform: `rotate(${rotate}deg) translateY(${translateY}px)`,
      }}
    >
      <div className="text-[4rem] xl:text-[5rem] leading-none font-medium tracking-tighter text-ink">
        {number}
      </div>
      
      <div className="mt-auto">
        <h3 className="text-xl xl:text-2xl font-semibold tracking-tight text-ink mb-2">
          {title}
        </h3>
        <p className="text-sm text-ink/60 leading-relaxed font-medium">
          {description}
        </p>
      </div>
    </m.div>
  );
};

export default function HowItWorksComponent({ features, className }) {
  const data = features || [];

  return (
    <LazyMotion features={domAnimation}>
      <div className={`relative w-full ${className || ""}`}>
        {/* ── Desktop Layout ── */}
        <div className="hidden lg:flex items-center justify-center gap-12 xl:gap-24 relative max-w-[1400px] mx-auto pt-4 pb-20 px-10">
          
          {/* CARD 1 */}
          {data[0] && (
            <div className="relative z-10">
              <Card 
                number="1" 
                title={data[0].title} 
                description={data[0].description} 
                rotate={-6} 
                translateY={50}
              />
            </div>
          )}
          
          {/* CARD 2 */}
          {data[1] && (
            <div className="relative z-30">
              <Card 
                number="2" 
                title={data[1].title} 
                description={data[1].description} 
                rotate={8} 
                translateY={-20}
                className="shadow-[0_20px_60px_rgb(0,0,0,0.12)]"
              />
            </div>
          )}
          
          {/* CARD 3 */}
          {data[2] && (
            <div className="relative z-20">
              <Card 
                number="3" 
                title={data[2].title} 
                description={data[2].description} 
                rotate={-10} 
                translateY={60}
              />
            </div>
          )}

          {/* INDEPENDENT SVG OVERLAY - Permanently z-50 to float above all hover states */}
          {data.length > 1 && (
            <div 
              className="absolute top-1/2 left-1/2 w-[280px] xl:w-[320px] aspect-square pointer-events-none z-50 hidden lg:block"
              style={{ transform: 'translate(-50%, calc(-50% - 20px))' }}
            >
              {/* SVG Connecting Card 1 to Card 2 */}
              <svg 
                className="absolute top-[35%] right-[85%] w-[320px] xl:w-[380px] h-[150px] overflow-visible drop-shadow-md"
                viewBox="0 0 320 150"
              >
                 <m.path 
                   d="M 0 0 C 100 -100, 220 -80, 320 20" 
                   fill="none" 
                   stroke="#00E5B5" 
                   strokeWidth="4" 
                   strokeDasharray="24 16"
                   strokeLinecap="round"
                   initial={{ pathLength: 0 }}
                   whileInView={{ pathLength: 1 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
                 />
                 <circle cx="0" cy="0" r="5" fill="white" stroke="#00E5B5" strokeWidth="3" />
                 <circle cx="320" cy="20" r="5" fill="white" stroke="#00E5B5" strokeWidth="3" />
              </svg>

              {/* SVG Connecting Card 2 to Card 3 */}
              <svg 
                className="absolute top-[75%] left-[80%] w-[320px] xl:w-[380px] h-[200px] overflow-visible drop-shadow-md"
                viewBox="0 0 320 200"
              >
                 <m.path 
                   d="M 0 0 C 50 140, 220 160, 120 80 C 60 0, 260 10, 320 40" 
                   fill="none" 
                   stroke="#00E5B5" 
                   strokeWidth="4" 
                   strokeDasharray="24 16"
                   strokeLinecap="round"
                   initial={{ pathLength: 0 }}
                   whileInView={{ pathLength: 1 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.8, ease: "easeInOut", delay: 0.7 }}
                 />
                 <circle cx="0" cy="0" r="5" fill="white" stroke="#00E5B5" strokeWidth="3" />
                 <circle cx="320" cy="40" r="5" fill="white" stroke="#00E5B5" strokeWidth="3" />
              </svg>
            </div>
          )}
        </div>

        {/* ── Mobile/Tablet Layout (Stacked) ── */}
        <div className="flex flex-col lg:hidden space-y-6 sm:space-y-12 px-6 pb-20 mt-4">
          {data.map((step, index) => {
            const rotate = index % 2 === 0 ? -3 : 4;
            const translateX = index % 2 === 0 ? -10 : 10;
            return (
              <div key={index} style={{ transform: `translateX(${translateX}px)` }}>
                <Card 
                  number={(index + 1).toString()} 
                  title={step.title} 
                  description={step.description} 
                  rotate={rotate} 
                  translateY={0}
                />
              </div>
            );
          })}
        </div>
      </div>
    </LazyMotion>
  );
}
