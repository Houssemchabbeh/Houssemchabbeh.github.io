import { useEffect, useRef, useState } from 'react'
import { useInView, useMedia } from '../hooks'

export function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { threshold: 0.08 }, true)
  return (
    <Tag ref={ref} className={`reveal ${inView ? 'in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  )
}

export function Panel({ children, className = '', title, right }) {
  return (
    <div className={`panel ${className}`}>
      <span className="dot tl" /><span className="dot tr" /><span className="dot bl" /><span className="dot br" />
      <span className="sweep-wrap"><span className="sweep" /></span>
      {title && (
        <div className="flex items-center justify-between gap-3 border-b hairline bg-white/5 px-4 py-2">
          <span className="micro truncate">{title}</span>
          {right && <span className="micro flex-none !text-white/70">{right}</span>}
        </div>
      )}
      <div className="relative">{children}</div>
    </div>
  )
}

export function SectionHeading({ children, chip, right }) {
  return (
    <div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-20">
      <div className="flex flex-wrap items-center gap-4">
        <h2
          className="glitch text-4xl font-bold uppercase tracking-[-0.05em] md:text-6xl"
          data-text={children}
        >
          {children}
        </h2>
        {chip && (
          <span className="flex items-center gap-2 rounded-full border border-term/30 bg-term/10 px-2.5 py-1 font-mono text-[10px] font-bold tracking-[0.1em] text-term">
            <span className="led" /> {chip}
          </span>
        )}
      </div>
      {right && <div className="hidden flex-col items-end gap-1 md:flex">{right}</div>}
    </div>
  )
}

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#*/<>_-+'

/* Cycles through phrases; each one decodes from random glyphs. */
export function Scramble({ phrases, hold = 2600 }) {
  const reduced = useMedia('(prefers-reduced-motion: reduce)')
  const [text, setText] = useState(phrases[0])
  useEffect(() => {
    if (reduced) return
    let i = 0
    let frame = 0
    let timer
    const run = () => {
      const target = phrases[i % phrases.length]
      frame = 0
      const tick = () => {
        frame++
        const locked = Math.floor(frame / 2)
        setText(
          target
            .split('')
            .map((ch, k) => (k < locked || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
            .join(''),
        )
        if (locked < target.length) timer = setTimeout(tick, 32)
        else {
          i++
          timer = setTimeout(run, hold)
        }
      }
      tick()
    }
    run()
    return () => clearTimeout(timer)
  }, [phrases, hold, reduced])
  return <span>{text}</span>
}

export const Arrow = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
)
