import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import HeroTicker from './HeroTicker.jsx'

/**
 * Hero
 * ----
 * Props:
 *   onOpenModal  — opens the booking modal
 */
export default function Hero({ onOpenModal }) {
  return (
    <section
      id="hero"
      className="h-screen bg-[#084734] flex items-center justify-center relative overflow-hidden px-6"

    // className="h-screen bg-[#084734] grid grid-cols-[52%_48%] relative overflow-hidden max-md:grid-cols-1 max-md:h-auto max-md:min-h-screen"
    >
      {/* Left */}
      <div className="max-w-[900px] w-full text-center relative z-[2]">

        {/* <div className="flex flex-col justify-center pl-[140px] relative z-[2] max-md:px-6 max-md:pt-[110px] max-md:pb-8"> */}
        {/* Eyebrow (commented out, preserved) */}
        {/* <div
          ref={eyebrowRef}
          className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] uppercase text-teal mb-7 opacity-0 before:content-[''] before:w-5 before:h-[1.5px] before:bg-teal before:flex-shrink-0"
        >
          Technology · Marketing · Design
        </div> */}

        <h1 className="font-display text-[clamp(42px,6vw,76px)] font-semibold leading-[1.05] tracking-[-0.03em] text-[#FAFAF7] mb-6">
          Build smarter systems <br />
          <span className="whitespace-nowrap">
            for <span className="text-[#CEF17B]">your business.</span>
          </span>
        </h1>
        <p className="text-[16px] font-light leading-[1.8] text-[#E5FCCD]/60 max-w-[520px] mx-auto pt-4 mb-10">

          {/* <p className="pt-5 text-[15px] font-light leading-[1.75] text-[#E5FCCD]/60 max-w-[400px] mb-9"> */}
          Maayay helps businesses grow through technology, marketing, and design from websites and apps to brand campaigns and digital assets.
        </p>

        <div className="flex items-center justify-center gap-14 pt-6 flex-wrap">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onOpenModal() }}
            className="bg-[#CEF17B] text-[#084734] border-none py-[14px] px-7 rounded-lg font-body text-sm font-semibold cursor-pointer transition-all duration-200 no-underline inline-block tracking-[0.01em] hover:bg-[#E5FCCD] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(206,241,123,0.35)]"
          >
            Book a Consultation →
          </a>
          <a
            href="#services"
            className="text-sm font-medium text-[#E5FCCD]/40 no-underline flex items-center gap-1.5 transition-colors duration-200 hover:text-[#CEF17B]"
          >
            Explore services ↓
          </a>
        </div>

        {/* Stats (commented out, preserved)
        <div
          ref={metaRef}
          className="flex items-center gap-[110px] mt-10 pt-7 border-t border-white/[0.08] opacity-0"
        >
          ...
        </div> */}


      </div>

      {/* Right */}
      {/* <div className="relative flex flex-col justify-center overflow-hidden h-full max-md:h-[300px] max-md:border-t max-md:border-white/[0.06]">
        <div className="absolute inset-0 bg-[#062e23]" />
        <div className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(206,241,123,0.12)_0%,transparent_65%)] top-1/2 left-[30%] -translate-x-1/2 -translate-y-1/2 pointer-events-none glow-pulse" />
        <div className="absolute top-0 bottom-0 left-0 w-48 z-10 pointer-events-none bg-gradient-to-r from-[#084734] via-[#062e23]/80 to-transparent" />
        <div className="absolute top-0 bottom-0 right-0 w-20 z-10 pointer-events-none bg-gradient-to-l from-[#062e23] to-transparent" />
        <HeroTicker />
      </div> */}
    </section>
  )
}