import { TESTIMONIALS } from '../data/index.jsx'
import { StaggerTestimonials } from '@/components/ui/stagger-testimonials'

export default function Testimonials() {
  const formattedTestimonials = TESTIMONIALS.map((t, i) => ({
    testimonial: t.quote.replace(/"/g, ''), 
    by: `${t.name}, ${t.meta}`,
    imgSrc: `https://i.pravatar.cc/150?u=${t.initials}${i}`
  }));

  return (
    <section id="clients" className="bg-[#0A0A0A] py-24 sm:py-32 overflow-hidden border-t border-white/5">
      <div className="max-w-[1280px] mx-auto w-full px-6 lg:px-12">
        <h2 className="pb-16 text-center font-display text-[clamp(28px,3.5vw,48px)] font-extrabold tracking-[-0.03em] leading-[1.1] text-[#FAFAF7]">
          What our clients <span className="text-teal">say</span>
        </h2>

        <div className="relative -mx-6 lg:-mx-12">
          <StaggerTestimonials items={formattedTestimonials} />
        </div>
      </div>
    </section>
  )
}
