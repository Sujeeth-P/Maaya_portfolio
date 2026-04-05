import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SERVICES } from '../data/index.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function Services({ onOpenModal }) {
  useEffect(() => {
    const cards = document.querySelectorAll('.service-card-anim')
    cards.forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.6,
          delay: i * 0.12,
          scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
        }
      )
    })
  }, [])

  return (
    <section id="services" className="bg-[#0A0A0A] min-h-screen flex items-center pt-5 py-20 max-md:py-16 max-md:px-6">
      <div className="max-w-[1280px] mx-auto w-full">
        {/* <div className="section-eyebrow" style={{ color: '#0D9E75' }}>What we do</div> */}
        <h2 className="font-display text-[clamp(28px,3.5vw,48px)] font-extrabold tracking-[-0.03em] leading-[1.1] text-[#FAFAF7] mb-3">
          What we do
        </h2>
        <p className="text-[15px] font-light leading-[1.7] text-white/55 max-w-[600px] mb-8 pt-3">
          We help businesses operate, market, and grow using technology, design, and strategic marketing.
        </p>

        <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1 pt-6">
          {SERVICES.map((svc, i) => (
            <div
              key={i}
              className="service-card-anim bg-white/[0.04] border border-white/10 rounded-[20px] p-7 transition-all duration-300 hover:bg-white/[0.08] hover:border-teal/40"
            >
              <div className="w-11 h-11 bg-[rgba(13,158,117,0.15)] rounded-xl flex items-center justify-center mb-5">
                <div className="w-[20px] h-[20px]">{svc.icon}</div>
              </div>
              <div className="font-display text-[20px] font-bold text-[#FAFAF7] mb-4 tracking-[-0.02em]">{svc.cat}</div>
              <ul className="list-none flex flex-col gap-2 mb-6">
                {svc.items.map((item, j) => (
                  <li key={j} className="text-sm font-light text-white/60 flex items-center gap-2.5 before:content-[''] before:w-1 before:h-1 before:rounded-full before:bg-teal before:flex-shrink-0">
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); onOpenModal() }}
                className="text-[13px] font-medium text-teal no-underline flex items-center gap-1.5 transition-all duration-200 hover:gap-2.5"
              >
                Learn More →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
