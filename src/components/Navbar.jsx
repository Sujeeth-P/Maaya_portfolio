export default function Navbar({ onOpenModal }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-12 h-[68px] bg-[rgba(10,10,10,0.92)] backdrop-blur-md border-b border-[rgba(10,10,10,0.1)] transition-colors duration-300">
      <a href="#" className="font-display text-[22px] font-extrabold text-[#FAFAF7] no-underline tracking-tight">
        Maayay<span className="text-teal">.</span>
      </a>

      <ul className="hidden md:flex items-center gap-9 list-none">
        {['Services', 'Process', 'About', 'Clients', 'FAQ'].map((item) => (
          <li key={item}>
            <a
              href={`#${item.toLowerCase()}`}
              className="text-sm font-normal text-white/50 no-underline transition-colors duration-200 hover:text-white"
            >
              {item}
            </a>
          </li>
        ))}
        <li>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onOpenModal() }}
            className="bg-teal text-white px-[22px] py-2.5 rounded-lg font-semibold text-sm no-underline transition-all duration-200 hover:bg-[#0bb876] hover:-translate-y-px"
          >
            Book a Consultation
          </a>
        </li>
      </ul>
    </nav>
  )
}
