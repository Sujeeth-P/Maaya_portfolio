import { useState, useRef, useEffect } from 'react'
import { FAQS } from '../data/index.jsx'

function FaqItem({ faq, isOpen, onToggle }) {
  const answerRef = useRef(null)

  useEffect(() => {
    if (answerRef.current) {
      answerRef.current.style.maxHeight = isOpen
        ? `${answerRef.current.scrollHeight}px`
        : '0px'
    }
  }, [isOpen])

  return (
    <div
      className={`border rounded-2xl overflow-hidden transition-colors duration-200 ${
        isOpen ? 'border-[rgba(10,10,10,0.25)]' : 'border-[rgba(10,10,10,0.1)] hover:border-[rgba(10,10,10,0.25)]'
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full bg-transparent border-none px-6 py-[22px] text-left font-body text-[15px] font-medium text-[#0A0A0A] cursor-pointer flex justify-between items-center gap-3 transition-colors duration-200 hover:bg-[#F4F1E8]"
      >
        {faq.q}
        <span
          className={`w-5 h-5 border rounded-full flex items-center justify-center flex-shrink-0 text-[10px] text-[#8A8880] transition-all duration-300 ${
            isOpen
              ? 'rotate-180 bg-[#0D9E75] border-[#0D9E75] text-white'
              : 'border-[rgba(10,10,10,0.25)]'
          }`}
        >
          ▾
        </span>
      </button>
      <div
        ref={answerRef}
        style={{ maxHeight: 0, overflow: 'hidden', transition: 'max-height 0.35s ease' }}
        className="px-6 text-sm font-light text-[#8A8880] leading-[1.7]"
      >
        <div className="pb-5">{faq.a}</div>
      </div>
    </div>
  )
}

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null)

  const toggle = (i) => setOpenIdx(openIdx === i ? null : i)

  return (
    <section id="faq" className="min-h-screen bg-[#F4F1E8] flex items-center pt-5 pb-10 px-12 max-md:py-16 max-md:px-6">
      <div className="max-w-[1280px] mx-auto w-full">
        {/* <div className="section-eyebrow">FAQ</div> */}
        <h2 className="pb-5 text-center font-display text-[clamp(28px,3.5vw,48px)] font-extrabold tracking-[-0.03em] leading-[1.1] text-[#0A0A0A] mb-12">
          FAQ
        </h2>

        {/* <div className="grid grid-cols-2 gap-3 max-w-[960px] max-md:grid-cols-1"> */}
          <div className="grid grid-cols-2 gap-5 max-w-[960px] mx-auto max-md:grid-cols-1">
          {FAQS.map((faq, i) => (
            <FaqItem
              key={i}
              faq={faq}
              isOpen={openIdx === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
