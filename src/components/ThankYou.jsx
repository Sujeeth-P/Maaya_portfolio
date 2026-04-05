export default function ThankYou({ onReturn }) {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col text-center p-12 bg-[#FAFAF7]">
      <div className="w-[72px] h-[72px] bg-[#E1F5EE] rounded-full flex items-center justify-center mx-auto mb-6 text-[28px] pop-in">
        ✓
      </div>
      <h1 className="font-display text-[40px] font-extrabold tracking-[-0.03em] text-[#0A0A0A] mb-3">
        Thank you.
      </h1>
      <p className="text-[17px] font-light text-[#8A8880] max-w-[440px] leading-[1.7] mb-3">
        Thank you for contacting Maayay. Our team will review your request and reach out shortly.
      </p>
      <div className="inline-block text-[13px] font-medium text-[#0D9E75] bg-[#E1F5EE] py-2 px-[18px] rounded-full mb-9">
        ⏱ Expected response: 24–48 hours
      </div>
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); onReturn() }}
        className="bg-[#0D9E75] text-[#FAFAF7] border-none py-[14px] px-7 rounded-lg font-body text-sm font-semibold cursor-pointer transition-all duration-200 no-underline inline-block tracking-[0.01em] hover:bg-[#0bb876] hover:-translate-y-0.5"
      >
        ← Return to Homepage
      </a>
    </div>
  )
}
