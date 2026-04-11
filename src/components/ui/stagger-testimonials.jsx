"use client"

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const SQRT_5000 = Math.sqrt(5000);

const TestimonialCard = ({ 
  position, 
  testimonial, 
  handleMove, 
  cardSize,
  theme = 'dark'
}) => {
  const isCenter = position === 0;
  const isLight = theme === 'light';

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-700 ease-in-out",
        isCenter 
          ? "z-10 bg-[#FAFAF7] text-[#0A0A0A] border-teal shadow-[8px_8px_0_hsl(var(--primary))]" 
          : cn(
              "z-0 transition-colors duration-500",
              isLight 
                ? "bg-[#F4F1E8] text-[#0A0A0A] border-[#D1CFCA] hover:border-teal/50"
                : "bg-[#1A1A1A] text-[#FAFAF7] border-[#333] hover:border-teal/50"
            )
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(30px 0%, 100% 0%, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0% 100%, 0% 30px)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
      }}
    >
      <img
        src={testimonial.imgSrc || `https://i.pravatar.cc/150?u=${testimonial.by}`}
        alt={testimonial.by}
        className="mb-6 h-14 w-14 rounded-full bg-[#333] object-cover border-2 border-teal shadow-[3px_3px_0_#000]"
      />
      <h3 className={cn(
        "text-lg sm:text-xl font-medium leading-relaxed italic",
        isCenter ? "text-[#0A0A0A]" : (isLight ? "text-[#0A0A0A]" : "text-[#FAFAF7]")
      )}>
        "{testimonial.testimonial}"
      </h3>
      <div className="absolute bottom-8 left-8 right-8">
        <p className={cn(
          "text-sm font-bold uppercase tracking-wider",
          isCenter ? "text-[#0A0A0A]/80" : "text-teal"
        )}>
          {testimonial.by.split(',')[0]}
        </p>
        <p className={cn(
          "text-xs opacity-60",
          isCenter ? "text-[#0A0A0A]" : (isLight ? "text-[#0A0A0A]/70" : "text-[#FAFAF7]")
        )}>
          {testimonial.by.split(',')[1]?.trim()}
        </p>
      </div>
    </div>
  );
};

export const StaggerTestimonials = ({ items = [], theme = 'dark' }) => {
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef(null);

  // Initialize data
  useEffect(() => {
    if (items.length > 0) {
      setTestimonialsList(items.map((item, idx) => ({ ...item, tempId: idx })));
    }
  }, [items]);

  const handleMove = (steps) => {
    if (steps === 0) return;
    
    setTestimonialsList((prev) => {
      const newList = [...prev];
      if (steps > 0) {
        for (let i = 1; i <= Math.abs(steps); i++) {
          const item = newList.shift();
          if (item) newList.push({ ...item, tempId: Math.random() });
        }
      } else {
        for (let i = 1; i <= Math.abs(steps); i++) {
          const item = newList.pop();
          if (item) newList.unshift({ ...item, tempId: Math.random() });
        }
      }
      return newList;
    });
  };

  // Auto-play logic
  useEffect(() => {
    if (!isPaused && testimonialsList.length > 0) {
      autoPlayRef.current = setInterval(() => {
        handleMove(1);
      }, 3000);
    }
    return () => clearInterval(autoPlayRef.current);
  }, [isPaused, testimonialsList]);

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 290);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  if (testimonialsList.length === 0) return null;

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: 600 }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {testimonialsList.map((testimonial, index) => {
          const position = index - Math.floor(testimonialsList.length / 2);
          if (Math.abs(position) > 2) return null; // Show 5 cards max for better layout
          
          return (
            <TestimonialCard
              key={testimonial.tempId}
              testimonial={testimonial}
              handleMove={handleMove}
              position={position}
              cardSize={cardSize}
              theme={theme}
            />
          );
        })}
      </div>
    </div>
  );
};
