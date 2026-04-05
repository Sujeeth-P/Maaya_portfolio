import { useEffect, useRef, useState } from 'react'
import { TICKER_ROW1, TICKER_ROW2, TICKER_ROW3 } from '../data/index.jsx'
import TickerCard from './TickerCard.jsx'

const ROWS = [
  { data: TICKER_ROW1, cls: 'ticker-row-1', startActive: 0, interval: 2200 },
  { data: TICKER_ROW2, cls: 'ticker-row-2', startActive: 2, interval: 2800 },
  { data: TICKER_ROW3, cls: 'ticker-row-3', startActive: 4, interval: 1900 },
]

function TickerRow({ rowData, rowCls, startActive, interval, paused }) {
  const [activeIdx, setActiveIdx] = useState(startActive % rowData.length)
  const doubled = [...rowData, ...rowData]

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % rowData.length)
    }, interval)
    return () => clearInterval(id)
  }, [rowData.length, interval])

  return (
    <div className={`ticker-row ${rowCls} ${paused ? 'ticker-paused' : ''}`}>
      {doubled.map((card, i) => (
        <TickerCard key={i} card={card} isActive={(i % rowData.length) === activeIdx} />
      ))}
    </div>
  )
}

export default function HeroTicker() {
  const areaRef = useRef(null)
  const [paused, setPaused] = useState(false)

  return (
    <div
      ref={areaRef}
      className="relative z-[2] flex flex-col gap-0 py-5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {ROWS.map((row, i) => (
        <TickerRow
          key={i}
          rowData={row.data}
          rowCls={row.cls}
          startActive={row.startActive}
          interval={row.interval}
          paused={paused}
        />
      ))}
    </div>
  )
}
