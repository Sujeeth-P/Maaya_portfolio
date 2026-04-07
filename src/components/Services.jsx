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
            <div key={i} className="service-parent service-card-anim">
              <div className="neo-3d-card">
                <div className="content-box">
                  <span className="card-title font-display tracking-tight">{svc.cat}</span>
                  <ul className="card-content font-body">
                    {svc.items.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); onOpenModal() }}
                    className="see-more"
                  >
                    Learn More →
                  </a>
                </div>
                <div className="date-box">
                  {svc.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
