export default function FinalCTA({ onOpenModal }) {
  return (
    <section
      id="cta-final"
      className="bg-[#0A0A0A] min-h-screen flex flex-col items-center justify-center text-center px-12 py-20 max-md:py-16 max-md:px-6"
    >
      {/* <div className="flex justify-center mb-3.5">
        <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#0D9E75]">
          Ready?
        </span>
      </div> */}

      <h2 className="pb-14 font-display text-[clamp(32px,4vw,52px)] font-extrabold tracking-[-0.03em] leading-[1.1] text-[#FAFAF7] max-w-[700px] mx-auto mb-5 text-center">
        Ready to build something meaningful for your business?
      </h2>

      {/* <p className="text-[17px] font-light text-white/50 mb-10">
        Let's talk about your goals and figure out the right path forward.
      </p> */}

      <a
        href="#"
        onClick={(e) => { e.preventDefault(); onOpenModal() }}
        className="bg-[#0D9E75] text-[#FAFAF7] border-none text-base py-[18px] px-10 rounded-lg font-body font-semibold cursor-pointer transition-all duration-200 no-underline inline-block tracking-[0.01em] hover:bg-[#0bb876] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(13,158,117,0.4)]"
      >
        Book a Consultation →
      </a>
    </section>
  )
}
