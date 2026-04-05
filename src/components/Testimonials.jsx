import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TESTIMONIALS } from '../data/index.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function Testimonials() {
  useEffect(() => {
    const cards = document.querySelectorAll('.testi-anim')
    cards.forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.5,
          delay: i * 0.12,
          scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
        }
      )
    })
  }, [])

  return (
    <section id="clients" className="bg-[#F4F1E8] min-h-screen flex items-center px-12 py-20 max-md:py-16 max-md:px-6">
      <div className="max-w-[1280px] mx-auto w-full">
        {/* <div className="section-eyebrow">Client stories</div> */}
        <h2 className="pb-5 text-center font-display text-[clamp(28px,3.5vw,48px)] font-extrabold tracking-[-0.03em] leading-[1.1] text-[#0A0A0A] mb-12">
          What our clients say
        </h2>

        <div className="grid grid-cols-3 gap-5 max-md:grid-cols-1">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="testi-anim bg-[#FAFAF7] border border-[rgba(10,10,10,0.1)] rounded-[20px] p-8 opacity-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.07)]"
            >
              <div className="flex gap-[3px] mb-4">
                {[...Array(5)].map((_, j) => (
                  <span key={j} className="text-teal text-sm">★</span>
                ))}
              </div>
              <p className="text-[15px] font-light italic text-[#333] leading-[1.7] mb-6">{t.quote}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E1F5EE] flex items-center justify-center font-display text-sm font-bold text-[#0D9E75] flex-shrink-0">
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-medium text-[#0A0A0A]">{t.name}</div>
                  <div className="text-xs text-[#8A8880] mt-0.5">{t.meta}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
