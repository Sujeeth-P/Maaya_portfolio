import { useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { FORM_SERVICES } from '../data/index.jsx'

export default function Modal({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [industry, setIndustry] = useState('')
  const [message, setMessage] = useState('')
  const [selectedServices, setSelectedServices] = useState([])
  const [error, setError] = useState('')

  // Lock/unlock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const toggleService = (s) => {
    setSelectedServices((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    )
  }

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) {
      setError('Please fill in your name and email to proceed.')
      return
    }
    setError('')
    onSubmit()
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      onClick={handleBackdropClick}
      className={`fixed inset-0 bg-[rgba(5,5,5,0.75)] z-[1000] flex items-center justify-center p-5 backdrop-blur-md transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`bg-[#FAFAF7] rounded-3xl w-full max-w-[680px] max-h-[90vh] overflow-y-auto p-12 relative transition-transform duration-[350ms] ease-out max-md:p-8 ${
          isOpen ? 'translate-y-0 scale-100' : 'translate-y-6 scale-[0.98]'
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#F4F1E8] border-none cursor-pointer flex items-center justify-center text-lg text-[#8A8880] transition-all duration-200 hover:bg-[#0A0A0A] hover:text-white"
        >
          ✕
        </button>

        <div className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#0D9E75] mb-2">Let's talk</div>
        <div className="font-display text-[28px] font-extrabold text-[#0A0A0A] tracking-[-0.03em] mb-2">Book a Consultation</div>
        <p className="text-sm font-light text-[#8A8880] mb-9">Tell us about your project and we'll get back to you within 24 hours.</p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
        )}

        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#555] tracking-[0.04em]">Name *</label>
            <input
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#F4F1E8] border border-transparent rounded-[10px] px-4 py-3 font-body text-sm text-[#0A0A0A] outline-none w-full transition-all duration-200 focus:border-[#0D9E75] focus:bg-[#FAFAF7]"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#555] tracking-[0.04em]">Email *</label>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#F4F1E8] border border-transparent rounded-[10px] px-4 py-3 font-body text-sm text-[#0A0A0A] outline-none w-full transition-all duration-200 focus:border-[#0D9E75] focus:bg-[#FAFAF7]"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#555] tracking-[0.04em]">Phone</label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-[#F4F1E8] border border-transparent rounded-[10px] px-4 py-3 font-body text-sm text-[#0A0A0A] outline-none w-full transition-all duration-200 focus:border-[#0D9E75] focus:bg-[#FAFAF7]"
            />
          </div>

          {/* Company */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#555] tracking-[0.04em]">Company Name</label>
            <input
              type="text"
              placeholder="Your company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="bg-[#F4F1E8] border border-transparent rounded-[10px] px-4 py-3 font-body text-sm text-[#0A0A0A] outline-none w-full transition-all duration-200 focus:border-[#0D9E75] focus:bg-[#FAFAF7]"
            />
          </div>

          {/* Industry */}
          <div className="flex flex-col gap-1.5 col-span-2 max-md:col-span-1">
            <label className="text-xs font-medium text-[#555] tracking-[0.04em]">Industry</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="bg-[#F4F1E8] border border-transparent rounded-[10px] px-4 py-3 font-body text-sm text-[#0A0A0A] outline-none w-full transition-all duration-200 focus:border-[#0D9E75] focus:bg-[#FAFAF7] cursor-pointer"
            >
              <option value="">Select your industry</option>
              {['Technology / SaaS', 'Retail / E-Commerce', 'Healthcare', 'Finance / Fintech', 'Education', 'Real Estate', 'Hospitality', 'Manufacturing', 'Other'].map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Services */}
          <div className="col-span-2 max-md:col-span-1">
            <div className="text-xs font-medium text-[#555] tracking-[0.04em] mb-2.5">Services Needed</div>
            <div className="grid grid-cols-2 gap-2 max-md:grid-cols-1">
              {FORM_SERVICES.map((svc) => {
                const checked = selectedServices.includes(svc)
                return (
                  <div
                    key={svc}
                    onClick={() => toggleService(svc)}
                    className={`flex items-center gap-2 cursor-pointer py-[9px] px-3 rounded-lg border text-[13px] select-none transition-all duration-200 ${
                      checked
                        ? 'border-[#0D9E75] bg-[#E1F5EE] text-[#085041]'
                        : 'border-[rgba(10,10,10,0.1)] text-[#444] hover:border-[#0D9E75]'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                      checked ? 'bg-[#0D9E75] border-[#0D9E75] text-white' : 'border-[rgba(10,10,10,0.25)]'
                    }`}>
                      {checked && <span className="text-[10px] leading-none">✓</span>}
                    </div>
                    {svc}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Message */}
          <div className="flex flex-col gap-1.5 col-span-2 max-md:col-span-1">
            <label className="text-xs font-medium text-[#555] tracking-[0.04em]">Message</label>
            <textarea
              placeholder="Tell us about your project, goals, or challenges…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="bg-[#F4F1E8] border border-transparent rounded-[10px] px-4 py-3 font-body text-sm text-[#0A0A0A] outline-none w-full transition-all duration-200 focus:border-[#0D9E75] focus:bg-[#FAFAF7] resize-y min-h-[100px]"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="col-span-2 max-md:col-span-1 bg-[#0A0A0A] text-[#FAFAF7] border-none py-4 px-8 rounded-full font-body text-[15px] font-medium cursor-pointer transition-all duration-200 w-full mt-2 hover:bg-[#0D9E75] hover:-translate-y-px"
          >
            Submit Request →
          </button>
        </div>
      </div>
    </div>
  )
}
