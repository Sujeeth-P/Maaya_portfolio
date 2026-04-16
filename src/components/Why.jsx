import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PILLARS } from '../data/index.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function Why({ onOpenModal }) {
  const cardRefs = useRef([])
  const juggleTweens = useRef([])

  useEffect(() => {
    // Scroll-in entrance for left side
    gsap.fromTo('.why-left-anim',
      { opacity: 0, x: -40 },
      {
        opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.why-left-anim', start: 'top 85%', toggleActions: 'play none none none' },
      }
    )

    // Staggered entrance for cards then kick off juggle
    gsap.fromTo(cardRefs.current,
      { opacity: 0, y: 50, rotateY: -25, scale: 0.85 },
      {
        opacity: 1, y: 0, rotateY: 0, scale: 1,
        duration: 0.7, ease: 'back.out(1.4)',
        stagger: 0.15,
        scrollTrigger: { trigger: cardRefs.current[0], start: 'top 88%', toggleActions: 'play none none none' },
        onComplete: startJuggle,
      }
    )

    return () => {
      juggleTweens.current.forEach(t => t.kill())
    }
  }, [])

  function startJuggle() {
    const cards = cardRefs.current
    if (cards.some(c => !c)) return

    // Set perspective on each card individually so rotateY is visible
    cards.forEach(card => {
      gsap.set(card, { transformPerspective: 600, transformOrigin: 'center center' })
    })

    // Each card gets a unique rotation personality (no y-movement — stays in grid cell)
    const styles = [
      { rotateZ: -14, rotateY: 22,  scale: 1.06 },
      { rotateZ:  12, rotateY: -20, scale: 1.05 },
      { rotateZ: -10, rotateY: 24,  scale: 1.07 },
      { rotateZ:  16, rotateY: -18, scale: 1.05 },
    ]

    // Single looping master timeline — cards never leave their grid cell
    const master = gsap.timeline({ repeat: -1, delay: 0.5 })

    cards.forEach((card, i) => {
      const s = styles[i]
      const startAt = i * 0.55

      // 1. Pre-lean
      master.to(card, {
        rotateZ: s.rotateZ * 0.4,
        scale: 1.02,
        duration: 0.22,
        ease: 'power2.out',
      }, startAt)

      // 2. Peak — full tilt + scale
      master.to(card, {
        rotateZ: s.rotateZ,
        rotateY: s.rotateY,
        scale: s.scale,
        duration: 0.42,
        ease: 'power3.inOut',
      }, startAt + 0.22)

      // 3. Land with bounce
      master.to(card, {
        rotateZ: s.rotateZ * 0.15,
        rotateY: 0,
        scale: 1,
        duration: 0.52,
        ease: 'bounce.out',
      }, startAt + 0.64)

      // 4. Elastic settle to flat
      master.to(card, {
        rotateZ: 0,
        duration: 0.32,
        ease: 'elastic.out(1.4, 0.5)',
      }, startAt + 1.16)
    })

    juggleTweens.current.push(master)
  }

  return (
    <section
      id="why"
      style={{ backgroundColor: '#F3F0E7' }}
      // style={{ backgroundColor: '#E5FCCD' }}
      className="min-h-screen flex items-center pt-5 pb-10 px-12 max-md:py-16 max-md:px-6"
    >
      <div className="grid grid-cols-2 gap-16 items-center max-w-[1280px] mx-auto w-full max-md:grid-cols-1 max-md:gap-10">

        {/* Left text */}
        <div className="why-left-anim" style={{ opacity: 0 }}>
          <h2 className="font-display text-[clamp(28px,3.5vw,48px)] font-extrabold tracking-[-0.03em] leading-[1.1] text-[#084734] mb-3">
            Why Choose Maayay
          </h2>
          <p className="pb-7 pt-5 text-[15px] font-light leading-[1.7] text-[#084734]/60 max-w-[600px] mb-6">
            Maayay focuses on practical solutions that help businesses operate better and communicate their value clearly. Our approach blends technology, design, and marketing to build systems that support long-term growth.
          </p>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onOpenModal() }}
            className="bg-[#084734] text-[#E5FCCD] border-none py-[13px] px-6 rounded-lg font-body text-sm font-semibold cursor-pointer transition-all duration-200 no-underline inline-block tracking-[0.01em] hover:bg-[#CEF17B] hover:text-[#084734] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(8,71,52,0.3)]"
          >
            Book a Consultation →
          </a>
        </div>

        {/* Right — juggling cards */}
        <div className="pt-6 pb-10">
          <div className="grid grid-cols-2 gap-4 mt-7" style={{ perspective: '800px' }}>
            {PILLARS.map((pillar, i) => (
              <div
                key={i}
                ref={el => cardRefs.current[i] = el}
                style={{
                  opacity: 0,
                  transformStyle: 'preserve-3d',
                  willChange: 'transform',
                }}
                className="bg-[#E5FCCD] border border-[rgba(8,71,52,0.12)] rounded-2xl p-6 flex flex-col gap-4 hover:border-[#084734] transition-colors duration-300"
              >
                <div className="w-12 h-12 bg-[#CEF17B] rounded-[12px] flex items-center justify-center flex-shrink-0">
                  {pillar.icon}
                </div>
                <div>
                  <div className="font-display text-[15px] font-bold text-[#084734] mb-2">{pillar.title}</div>
                  <div className="text-[13px] font-light text-[#084734]/55 leading-[1.6]">{pillar.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}