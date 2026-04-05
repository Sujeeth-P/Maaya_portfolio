import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { STEPS } from '../data/index.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function Process() {
  useEffect(() => {
    const steps = document.querySelectorAll('.step-anim')
    steps.forEach((step, i) => {
      gsap.fromTo(step,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.5,
          delay: i * 0.1,
          scrollTrigger: { trigger: step, start: 'top 88%', toggleActions: 'play none none none' },
        }
      )
    })
  }, [])

  return (
    <section id="process" className="bg-[#F4F1E8] min-h-screen flex items-center px-12 pt-5 pb-20 max-md:py-16 max-md:px-6">
      <div className="max-w-[1280px] mx-auto w-full">
        {/* <div className="section-eyebrow">How we work</div> */}
        <h2 className="text-center font-display text-[clamp(28px,3.5vw,48px)] font-extrabold tracking-[-0.03em] leading-[1.1] text-[#0A0A0A] mb-4">
          How we work
        </h2>

        <div className="pt-5 relative flex items-start gap-0 mt-16 max-md:flex-col max-md:gap-8">
          {/* Connector line */}
          <div className="absolute top-12 left-7 right-7 h-px bg-[rgba(10,10,10,0.25)] z-0 max-md:hidden" />

          {STEPS.map((step, i) => (
            <div
              key={i}
              className="step-anim flex-1 flex flex-col items-center text-center px-4 relative z-[1] group max-md:flex-row max-md:text-left max-md:items-start max-md:gap-4"
            >
              <div className="w-14 h-14 rounded-full bg-[#FAFAF7] border-[1.5px] border-[rgba(10,10,10,0.25)] flex items-center justify-center font-display text-lg font-extrabold text-[#0A0A0A] mb-5 transition-all duration-300 group-hover:bg-[#0D9E75] group-hover:border-[#0D9E75] group-hover:text-white max-md:mb-0 max-md:flex-shrink-0">
                {step.num}
              </div>
              <div className="max-md:pt-1">
                <div className="font-display text-base font-bold text-[#0A0A0A] mb-2">{step.title}</div>
                <div className="text-[13px] font-light text-[#8A8880] leading-[1.6]">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
