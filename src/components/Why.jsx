import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PILLARS, WHY_STATS } from '../data/index.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function Why({ onOpenModal }) {
  useEffect(() => {
    const pillars = document.querySelectorAll('.pillar-anim')
    pillars.forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.5,
          delay: i * 0.1,
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        }
      )
    })

    gsap.fromTo('.why-visual-anim',
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.7,
        scrollTrigger: { trigger: '.why-visual-anim', start: 'top 85%', toggleActions: 'play none none none' },
      }
    )
  }, [])

  return (
    <section id="why"style={{backgroundColor:"#F3F0E7"}} className="min-h-screen flex items-center pt-5 pb-10 px-12 max-md:py-16 max-md:px-6">
      <div className="grid grid-cols-2 gap-16 items-center max-w-[1280px] mx-auto w-full max-md:grid-cols-1 max-md:gap-10">

        {/* Left text */}
        <div>
          {/* <div className="section-eyebrow">Why Maayay</div> */}
          <h2 className="font-display text-[clamp(28px,3.5vw,48px)] font-extrabold tracking-[-0.03em] leading-[1.1] text-[#0A0A0A] mb-3">
            Why Choose Maayay
          </h2>
          <p className="pb-7 pt-5 text-[15px] font-light leading-[1.7] text-[#555] max-w-[600px] mb-6">
            Maayay focuses on practical solutions that help businesses operate better and communicate their value clearly. Our approach blends technology, design, and marketing to build systems that support long-term growth.
          </p>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onOpenModal() }}
            className="bg-[#0D9E75] text-[#FAFAF7] border-none py-[13px] px-6 rounded-lg font-body text-sm font-semibold cursor-pointer transition-all duration-200 no-underline inline-block tracking-[0.01em] hover:bg-[#0bb876] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(13,158,117,0.4)]"
          >
            Book a Consultation →
          </a>

          {/* <div className="grid grid-cols-2 gap-3 mt-7">
            {PILLARS.map((pillar, i) => (
              <div
                key={i}
                className="pillar-anim bg-[#FAFAF7] border border-[rgba(10,10,10,0.1)] rounded-2xl p-5 transition-all duration-300 opacity-0 hover:border-[#0D9E75] hover:-translate-y-[3px]"
              >
                <div className="w-9 h-9 bg-[#E1F5EE] rounded-[10px] flex items-center justify-center mb-3 text-base">
                  {pillar.icon}
                </div>
                <div className="font-display text-[14px] font-bold text-[#0A0A0A] mb-1">{pillar.title}</div>
                <div className="text-[12px] font-light text-[#8A8880] leading-[1.6]">{pillar.desc}</div>
              </div>
            ))}
          </div> */}
        </div>

        {/* Right visual */}
        <div className="why-visual-anim pt-6 pb-20 flex flex-col gap-4 opacity-0">
        <div className="grid grid-cols-2 gap-3 mt-7">
            {PILLARS.map((pillar, i) => (
              <div
                key={i}
                className="pillar-anim bg-[#FAFAF7] border border-[rgba(10,10,10,0.1)] rounded-2xl p-5 transition-all duration-300 opacity-0 hover:border-[#0D9E75] hover:-translate-y-[3px]"
              >
                <div className="w-9 h-9 bg-[#E1F5EE] rounded-[10px] flex items-center justify-center mb-3 text-base">
                  {pillar.icon}
                </div>
                <div className="font-display text-[14px] font-bold text-[#0A0A0A] mb-1">{pillar.title}</div>
                <div className="text-[12px] font-light text-[#8A8880] leading-[1.6]">{pillar.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
