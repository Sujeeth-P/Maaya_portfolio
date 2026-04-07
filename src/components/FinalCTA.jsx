export default function FinalCTA({ onOpenModal }) {
  return (
    <section
      id="cta-final"
      className="bg-[#0A0A0A] min-h-screen flex flex-col items-center justify-center text-center px-12 py-20 max-md:py-16 max-md:px-6 relative overflow-hidden"
    >
      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '20px 30px',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)',
        }}
      />
      {/* <div className="flex justify-center mb-3.5">
        <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#0D9E75]">
          Ready?
        </span>
      </div> */}

      <h2 className="relative z-10 pb-14 font-display text-[clamp(32px,4vw,52px)] font-extrabold tracking-[-0.03em] leading-[1.1] text-[#FAFAF7] max-w-[700px] mx-auto mb-5 text-center">
        Ready to build something meaningful for your business?
      </h2>

      {/* <p className="text-[17px] font-light text-white/50 mb-10">
        Let's talk about your goals and figure out the right path forward.
      </p> */}

      <a
        href="#"
        onClick={(e) => { e.preventDefault(); onOpenModal() }}
        className="relative z-10 btn-glitch"
      >
        <span className="text">Book a Consultation</span>
        <span className="decoration">→</span>
      </a>
    </section>
  )
}
