import { useEffect, useRef, useState } from 'react'
import { profile } from '../data/profile'
import { useMedia } from '../hooks'

export const NAV = [
  { id: 'about', label: 'About' },
  { id: 'logs', label: 'Logs' },
  { id: 'work', label: 'Work' },
  { id: 'stack', label: 'Stack' },
  { id: 'certs', label: 'Certs' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]

/* Boot overlay: timer-driven, so it can never hang on a slow asset. */
export function Boot({ onDone }) {
  const [pct, setPct] = useState(0)
  const [gone, setGone] = useState(false)
  useEffect(() => {
    const start = performance.now()
    const total = 1100
    let raf
    const tick = (now) => {
      const p = Math.min(1, (now - start) / total)
      setPct(Math.round(p * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else {
        setGone(true)
        setTimeout(onDone, 450)
      }
    }
    raf = requestAnimationFrame(tick)
    // hard stop: never leave the overlay up, even if animation frames stall
    const failsafe = setTimeout(() => {
      setGone(true)
      onDone()
    }, 2500)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(failsafe)
    }
  }, [onDone])
  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-black transition-opacity duration-500 ${gone ? 'pointer-events-none opacity-0' : ''}`}
      aria-hidden="true"
    >
      <span className="wordmark text-6xl">{profile.mark}</span>
      <span className="block h-1 w-48 bg-white/10">
        <span className="block h-full origin-left bg-white" style={{ transform: `scaleX(${pct / 100})` }} />
      </span>
      <span className="micro">BOOT_SEQUENCE :: {String(pct).padStart(3, '0')}%</span>
    </div>
  )
}

export function Nav({ ready }) {
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    document.querySelectorAll('section[id]').forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 h-16 border-b hairline bg-black/80 backdrop-blur-md transition-transform duration-700 ${ready ? '' : '-translate-y-full'}`}
      >
        <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-4 md:px-6">
          <a href="#top" className="flex items-baseline gap-3" aria-label="Back to top">
            <span className="font-display text-xl font-bold tracking-[-0.06em]">{profile.mark}</span>
            <span className="micro hidden xs:inline">{profile.handle}</span>
          </a>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Sections">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                aria-current={active === n.id ? 'true' : undefined}
                className={`font-mono text-[10px] font-bold uppercase tracking-[0.2em] transition-colors hover:text-white ${active === n.id ? 'text-white' : 'text-white/40'}`}
              >
                <span className="text-white/50">{active === n.id ? '> ' : ''}</span>
                {n.label}
                <span className="text-white/50">{active === n.id ? ' <' : ''}</span>
              </a>
            ))}
          </nav>
          <button
            className="pill !px-4 !py-2 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>

      {open && (
        <div id="mobile-menu" className="fixed inset-0 z-40 flex flex-col justify-center gap-2 bg-black/95 px-6 pt-16 backdrop-blur-xl md:hidden">
          <span className="label mb-4">// NAVIGATE</span>
          {NAV.map((n, i) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={() => setOpen(false)}
              className="flex items-baseline gap-4 border-b hairline py-4 font-display text-4xl font-bold uppercase tracking-[-0.04em]"
            >
              <span className="micro">{String(i + 1).padStart(2, '0')}</span>
              {n.label}
            </a>
          ))}
        </div>
      )}
    </>
  )
}

/* Difference-blend cursor dot, desktop pointers only. The system cursor stays. */
export function Cursor() {
  const fine = useMedia('(hover: hover) and (pointer: fine)')
  const reduced = useMedia('(prefers-reduced-motion: reduce)')
  const ref = useRef(null)
  useEffect(() => {
    if (!fine || reduced) return
    const el = ref.current
    let x = -100, y = -100, tx = -100, ty = -100, scale = 1, raf
    const move = (e) => {
      tx = e.clientX
      ty = e.clientY
      scale = e.target.closest?.('a,button,[role="tab"]') ? 2.4 : 1
    }
    const loop = () => {
      x += (tx - x) * 0.22
      y += (ty - y) * 0.22
      el.style.transform = `translate(${x - 14}px, ${y - 14}px) scale(${scale})`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('pointermove', move, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('pointermove', move)
      cancelAnimationFrame(raf)
    }
  }, [fine, reduced])
  if (!fine || reduced) return null
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-7 w-7 rounded-full bg-white mix-blend-difference transition-[scale] duration-200"
    />
  )
}

export function Footer() {
  return (
    <footer className="border-t hairline px-4 py-10 md:px-6">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4">
        <span className="micro">
          {profile.mark} // {profile.role}
        </span>
        <span className="micro">BUILT_WITH :: REACT · VITE · SVG // HOSTED_ON :: GITHUB_PAGES</span>
        <span className="micro">© {new Date().getFullYear()} {profile.name}</span>
      </div>
    </footer>
  )
}
