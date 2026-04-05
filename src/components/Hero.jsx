import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import HeroTicker from './HeroTicker.jsx'

export default function Hero({ onOpenModal }) {
  const eyebrowRef = useRef(null)
  const h1Ref = useRef(null)
  const subRef = useRef(null)
  const actionsRef = useRef(null)
  const metaRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo(eyebrowRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, 0.15)
      .fromTo(h1Ref.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9 }, 0.3)
      .fromTo(subRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9 }, 0.45)
      .fromTo(actionsRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9 }, 0.6)
      .fromTo(metaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9 }, 0.75)
  }, [])

  return (
    <section
      id="hero"
      className="h-screen bg-[#0A0A0A] grid grid-cols-[52%_48%] relative overflow-hidden max-md:grid-cols-1 max-md:h-auto max-md:min-h-screen"
    >
      {/* Left */}
      <div className="flex flex-col justify-center pl-[140px] relative z-[2] max-md:px-6 max-md:pt-[110px] max-md:pb-8">
        {/* <div
          ref={eyebrowRef}
          className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] uppercase text-teal mb-7 opacity-0 before:content-[''] before:w-5 before:h-[1.5px] before:bg-teal before:flex-shrink-0"
        >
          Technology · Marketing · Design
        </div> */}

        <h1
          ref={h1Ref}
          className="pt-4 font-display text-[clamp(36px,4.2vw,62px)] font-extrabold leading-[1.04] tracking-[-0.03em] text-[#FAFAF7] mb-[22px] opacity-0"
        >
          Build smarter<br />systems for<br />
          <span className="block text-teal">your business.</span>
        </h1>

        <p
          ref={subRef}
          className="pt-5 text-[15px] font-light leading-[1.75] text-white/40 max-w-[400px] mb-9 opacity-0"
        >
          Maayay helps businesses grow through technology, marketing, and design — from websites and apps to brand campaigns and digital assets.
        </p>

        <div ref={actionsRef} className="flex items-center gap-14 pt-5 flex-wrap opacity-0">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onOpenModal() }}
            className="bg-teal text-[#FAFAF7] border-none py-[14px] px-7 rounded-lg font-body text-sm font-semibold cursor-pointer transition-all duration-200 no-underline inline-block tracking-[0.01em] hover:bg-[#0bb876] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(13,158,117,0.4)]"
          >
            Book a Consultation →
          </a>
          <a
            href="#services"
            className="text-sm font-medium text-white/35 no-underline flex items-center gap-1.5 transition-colors duration-200 hover:text-white/75"
          >
            Explore services ↓
          </a>
        </div>

        {/* <div
          ref={metaRef}
          className="flex items-center gap-[110px] mt-10 pt-7 border-t border-white/[0.08] opacity-0"
        >
          {[
            { num: '50', sup: '+', label: ['Projects', 'delivered'] },
            { num: '3', sup: 'x', label: ['Avg. client', 'growth'] },
            { num: '24', sup: 'h', label: ['Support', 'response'] },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-7">
              {i > 0 && <div className="w-px h-9 bg-white/10 flex-shrink-0" />}
              <div>
                <div className="font-display text-[30px] font-extrabold text-[#FAFAF7] tracking-[-0.04em] leading-none mb-[3px]">
                  {stat.num}<span className="text-teal">{stat.sup}</span>
                </div>
                <div className="pt-2 text-[11px] font-light text-white/30 leading-[1.4]">
                  {stat.label[0]}<br />{stat.label[1]}
                </div>
              </div>
            </div>
          ))}
        </div> */}
      </div>

      {/* Right */}
      <div className="relative flex flex-col justify-center overflow-hidden h-full max-md:h-[300px] max-md:border-t max-md:border-white/[0.06]">
        <div className="absolute inset-0 bg-[#0d0d0d]" />
        {/* Glow */}
        <div className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(13,158,117,0.13)_0%,transparent_65%)] top-1/2 left-[30%] -translate-x-1/2 -translate-y-1/2 pointer-events-none glow-pulse" />
        {/* Left fade — wide soft blend, no hard line */}
        <div className="absolute top-0 bottom-0 left-0 w-48 z-10 pointer-events-none bg-gradient-to-r from-[#0A0A0A] via-[#0d0d0d]/80 to-transparent" />
        {/* Edge fade right */}
        <div className="absolute top-0 bottom-0 right-0 w-20 z-10 pointer-events-none bg-gradient-to-l from-[#0d0d0d] to-transparent" />
        <HeroTicker />
      </div>
    </section>
  )
}
