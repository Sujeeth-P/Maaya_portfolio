export default function TickerCard({ card, isActive }) {
  return (
    <div
      className={`
        flex-shrink-0 min-w-[220px] max-w-[240px] rounded-2xl p-[18px_22px]
        border transition-all duration-[400ms] cursor-default
        ${isActive
          ? 'bg-[rgba(13,158,117,0.1)] border-[rgba(13,158,117,0.45)] opacity-100 scale-[1.04] shadow-[0_0_30px_rgba(13,158,117,0.15)] blur-none'
          : 'bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.08)] opacity-[0.45] blur-[0.5px] hover:opacity-75 hover:blur-none hover:border-[rgba(255,255,255,0.2)]'
        }
      `}
    >
      <div className="w-8 h-8 rounded-lg bg-[rgba(13,158,117,0.15)] flex items-center justify-center mb-3 text-sm">
        {card.icon}
      </div>
      <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-teal mb-1">{card.label}</div>
      <div className="font-display text-sm font-bold text-white/85 leading-[1.35] tracking-[-0.01em]">{card.title}</div>

      {card.bars ? (
        <div className="mt-2.5 flex flex-col gap-1.5">
          {card.bars.map((w, i) => (
            <div key={i} className="h-[3px] bg-white/[0.07] rounded-sm overflow-hidden">
              <div className="h-full bg-teal rounded-sm" style={{ width: `${w}%` }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs text-white/35 mt-1.5 leading-[1.5]">{card.desc}</div>
      )}
    </div>
  )
}
